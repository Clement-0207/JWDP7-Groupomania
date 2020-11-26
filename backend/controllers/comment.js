const connection = require('../db');

exports.createComment = (req, res, next) => {
    const postId = req.originalUrl.split('/')[3];
    const comment = req.body;
    const sql = "INSERT INTO comment (comment_body, post_message_id, account_id, written_on) VALUES (?, ?, ?, ?);";
    const params = [comment.comment_body, postId, comment.account_id, getTodayDate()];
    connection.query({ 'sql': sql, 'timeout': 10000 }, params, function (err, result) {
        if (err) {
            throw err;
        }
        if (result.affectedRows === 1) {
            return res.status(201).json({ message: 'Commentaire créé !' });
        } else {
            return res.status(400).json({ message: 'Erreur lors de la création !' });
        }
    });
};

exports.modifyComment = (req, res, next) => {
    const comment = req.body;
    const commentId = req.params.id;
    const sql = "UPDATE comment SET comment_body = ?, written_on = ? WHERE comment_id = ?;";
    const params = [comment.comment_body, getTodayDate(), commentId];
    connection.query({ 'sql': sql, 'timeout': 10000 }, params, function (err, result) {
        if (err) {
            throw err;
        }
        if (result.affectedRows === 1) {
            return res.status(200).json({ message: 'Commentaire modifié !' });
        }
    });
};

exports.getOneComment = (req, res, next) => {
    const commentId = req.params.id;
    const sql = "SELECT comment_id, comment_body, post_message_id, comment.account_id, written_on, (SELECT count(comment_like.account_id) FROM comment_like WHERE comment_like.comment_id = comment.comment_id AND comment_like = 1) as likes, (SELECT count(comment_like.account_id) FROM comment_like WHERE comment_like.comment_id = comment.comment_id AND comment_like = 0) as dislikes, account.name FROM comment JOIN account ON comment.account_id = account.account_id WHERE comment_id = ?;";
    const params = [commentId];
    connection.query({ 'sql': sql, 'timeout': 10000 }, params, function (err, result) {
        if (err) {
            throw err;
        }
        if (result.length > 0) {
            return res.status(200).json(result[0]);
        } else {
            return res.status(404).json({ message: 'Commentaire non trouvé !' });
        }
    });
};

exports.getLike = (req, res, next) => {
    const commentId = req.params.id;
    const accountId = req.query.accountId;
    const sql = "SELECT comment_id, account_id, comment_like FROM comment_like WHERE comment_id = ? AND account_id = ?;";
    const params = [commentId, accountId];
    connection.query({ 'sql': sql, 'timeout': 10000 }, params, function (err, result) {
        if (err) {
            throw err;
        }
        if (result.length > 0) {
            return res.status(200).json({ result: 1, like: result[0].comment_like });
        } else {
            return res.status(200).json({ result: 0 });
        }
    });
};

exports.getAllComments = (req, res, next) => {
    const postId = req.originalUrl.split('/')[3];
    const sql = "SELECT comment_id, comment_body, post_message_id, comment.account_id, written_on, "
    + "(SELECT count(comment_like.account_id) FROM comment_like WHERE comment_like.comment_id = "
    + "comment.comment_id AND comment_like = 1) as likes, (SELECT count(comment_like.account_id) "
    + "FROM comment_like WHERE comment_like.comment_id = comment.comment_id AND comment_like = 0) "
    + "as dislikes, account.name FROM comment JOIN account ON comment.account_id = account.account_id "
    + "WHERE post_message_id = ? ORDER BY written_on ASC LIMIT ?;";
    const params = [postId, 10];
    connection.query({ 'sql': sql, 'timeout': 10000 }, params, function (err, result) {
        if (err) {
            throw err;
        }
        return res.status(200).json(result);
    });
};

exports.deleteComment = (req, res, next) => {
    const sql = "DELETE FROM comment WHERE comment_id = ?;";
    const commentId = req.params.id;
    const params = [commentId];
    connection.query({ 'sql': sql, 'timeout': 10000 }, params, function (err, result) {
        if (err) {
            throw err;
        }
        if (result.affectedRows === 1) {
            return res.status(204).json(result);
        } else {
            return res.status(404).json({ message: 'Commentaire non trouvé !' });
        }
    });
};

getTodayDate = () => {
    const today = new Date();

    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    const hour = today.getHours();
    const minutes = today.getMinutes();
    const seconds = today.getSeconds();

    return yyyy + '-' + mm + '-' + dd + ' ' + hour + ':' + minutes + ':' + seconds;
}

const addLikeOrDislike = (isLike, commentId, accountId, res, _callback) => {
    const sql = "INSERT INTO comment_like (comment_id, account_id, comment_like) VALUES (?, ?, ?);";
    const params = [commentId, accountId, isLike];
    connection.query({ 'sql': sql, 'timeout': 10000 }, params, function (err, result) {
        if (err) {
            throw err;
        }
        if (result.affectedRows === 1) {
            _callback(res.status(200).json({ message: 'Succès !' }));
        } else {
            _callback(res.status(404).json({ message: 'Commentaire non trouvé !' }));
        }
    }
    );
}

const updateLikeOrDislike = (isLike, commentId, accountId, res, _callback) => {
    const sql = "UPDATE comment_like set comment_like = ? WHERE comment_id = ? AND account_id = ?;";
    const params = [isLike, commentId, accountId];
    connection.query({ 'sql': sql, 'timeout': 10000 }, params, function (err, result) {
        if (err) {
            throw err;
        }
        if (result.affectedRows === 1) {
            _callback(res.status(200).json({ message: 'Succès !' }));
        } else {
            _callback(res.status(404).json({ message: 'Commentaire non trouvé !' }));
        }
    }
    );
}

const removeLikeOrDislike = (commentId, accountId, res, _callback) => {
    const sql = "DELETE FROM comment_like WHERE comment_id = ? AND account_id = ?;";
    const params = [commentId, accountId];
    connection.query({ 'sql': sql, 'timeout': 10000 }, params, function (err, result) {
        if (err) {
            throw err;
        }
        if (result.affectedRows === 1) {
            _callback(res.status(200).json({ message: 'Succès !' }));
        } else {
            _callback(res.status(404).json({ message: 'Commentaire non trouvé !' }));
        }
    }
    );
}

exports.likeComment = (req, res, next) => {
    const commentId = req.params.id;
    const accountId = req.body.account_id;
    const sql = "SELECT comment_id, account_id, comment_like FROM comment_like WHERE comment_id = ? AND account_id = ?;";
    const params = [commentId, accountId];
    connection.query({ 'sql': sql, 'timeout': 10000 }, params, function (err, result) {
        if (err) {
            throw err;
        }
        const like = req.body.like;
        if (like === 1) {
            if (result.length > 0) {
                // Avant c'était un dislike
                if (result[0].like !== 1) {
                    updateLikeOrDislike(true, commentId, accountId, res, function (result) {
                        return result;
                    });
                }
            } else {
                addLikeOrDislike(true, commentId, accountId, res, function (result) {
                    return result;
                });
            }
        }
        if (like === -1) {
            if (result.length > 0) {
                // Avant c'était un like
                if (result[0].like !== 0) {
                    updateLikeOrDislike(false, commentId, accountId, res, function (result) {
                        return result;
                    });
                }
            } else {
                addLikeOrDislike(false, commentId, accountId, res, function (result) {
                    return result;
                });
            }
        }
        if (like === 0) {
            if (result.length > 0) {
                removeLikeOrDislike(commentId, accountId, res, function (result) {
                    return result;
                });
            }
        }
    });
};