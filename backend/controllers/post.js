const connection = require('../db');

exports.createPost = (req, res, next) => {
    const post = req.body
    const sql = "INSERT INTO post (title, body, written_on , account_id) VALUES (?, ?, ?, ?);";
    const params = [post.title, post.body, getTodayDate(), post.account_id];
    connection.query({ 'sql': sql, 'timeout': 10000 }, params, function (err, result) {
        if (err) {
            throw err;
        }
        if (result.affectedRows === 1) {
            return res.status(201).json({ message: 'Post créé !' });
        }
    });
};

exports.modifyPost = (req, res, next) => {
    const modify = req.body
    const postId = req.params.id
    const sql = "UPDATE post SET title = ?, body = ?, written_on = ? WHERE post_id = ?;";
    const params = [modify.title, modify.body, getTodayDate(), postId];
    connection.query({ 'sql': sql, 'timeout': 10000 }, params, function (err, result) {
        if (err) {
            throw err;
        }
        if (result.affectedRows === 1) {
            return res.status(200).json({ message: 'Post modifié !' });
        }
    });
};

exports.getOnePost = (req, res, next) => {
    const postId = req.params.id;
    const sql = "SELECT post_id, title, body, written_on, post.account_id, (SELECT count(post_like.account_id) FROM post_like WHERE post_like.post_id = post.post_id AND post_like = 1) as likes, (SELECT count(post_like.account_id) FROM post_like WHERE post_like.post_id = post.post_id AND post_like = 0) as dislikes, account.name FROM post JOIN account ON post.account_id = account.account_id WHERE post_id = ?;";
    const params = [postId];
    connection.query({ 'sql': sql, 'timeout': 10000 }, params, function (err, result) {
        if (err) {
            throw err;
        }
        if (result.length > 0) {
            return res.status(200).json(result[0]);
        } else {
            return res.status(404).json({ message: 'Post non trouvé !' });
        }
    });
};

exports.getLike = (req, res, next) => {
    const postId = req.params.id;
    const accountId = req.query.accountId;
    const sql = "SELECT post_id, account_id, post_like FROM post_like WHERE post_id = ? AND account_id = ?;";
    const params = [postId, accountId];
    connection.query({ 'sql': sql, 'timeout': 10000 }, params, function (err, result) {
        if (err) {
            throw err;
        }
        if (result.length > 0) {
            return res.status(200).json({ result: 1, like: result[0].post_like });
        } else {
            return res.status(200).json({ result: 0 });
        }
    });
};

exports.getAllPost = (req, res, next) => {
    const sql = "SELECT post_id, title, body, written_on, (SELECT count(post_like.account_id) FROM post_like WHERE post_like.post_id = post.post_id AND post_like = 1) as likes, (SELECT count(post_like.account_id) FROM post_like WHERE post_like.post_id = post.post_id AND post_like = 0) as dislikes, account.name FROM post JOIN account ON post.account_id = account.account_id ORDER BY written_on DESC LIMIT ?;";
    const params = [10];
    connection.query({ 'sql': sql, 'timeout': 10000 }, params, function (err, result) {
        if (err) {
            throw err;
        }
        return res.status(200).json(result);
    });
};

exports.deletePost = (req, res, next) => {
    const postId = req.params.id;
    const sqlPost = "DELETE FROM post WHERE post_id = ?;";
    const params = [postId];
    connection.query({ 'sql': sqlPost, 'timeout': 10000 }, params, function (err, result) {
        if (err) {
            throw err;
        }
        if (result.affectedRows === 1) {
            return res.status(204).json(result);
        } else {
            return res.status(404).json({ message: 'Post non trouvé !' });
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

const addLikeOrDislike = (isLike, postId, accountId, res, _callback) => {
    const sql = "INSERT INTO post_like (post_id, account_id, post_like) VALUES (?, ?, ?);";
    const params = [postId, accountId, isLike];
    connection.query({ 'sql': sql, 'timeout': 10000 }, params, function (err, result) {
        if (err) {
            throw err;
        }
        if (result.affectedRows === 1) {
            _callback(res.status(200).json({ message: 'Succès !' }));
        } else {
            _callback(res.status(404).json({ message: 'Post non trouvé !' }));
        }
    }
    );
}

const updateLikeOrDislike = (isLike, postId, accountId, res, _callback) => {
    const sql = "UPDATE post_like set post_like = ? WHERE post_id = ? AND account_id = ?;";
    const params = [isLike, postId, accountId];
    connection.query({ 'sql': sql, 'timeout': 10000 }, params, function (err, result) {
        if (err) {
            throw err;
        }
        if (result.affectedRows === 1) {
            _callback(res.status(200).json({ message: 'Succès !' }));
        } else {
            _callback(res.status(404).json({ message: 'Post non trouvé !' }));
        }
    }
    );
}

const removeLikeOrDislike = (postId, accountId, res, _callback) => {
    const sql = "DELETE FROM post_like WHERE post_id = ? AND account_id = ?;";
    const params = [postId, accountId];
    connection.query({ 'sql': sql, 'timeout': 10000 }, params, function (err, result) {
        if (err) {
            throw err;
        }
        if (result.affectedRows === 1) {
            _callback(res.status(200).json({ message: 'Succès !' }));
        } else {
            _callback(res.status(404).json({ message: 'Post non trouvé !' }));
        }
    }
    );
}

exports.likePost = (req, res, next) => {
    const postId = req.params.id;
    const accountId = req.body.account_id;
    const sql = "SELECT post_id, account_id, post_like FROM post_like WHERE post_id = ? AND account_id = ?;";
    const params = [postId, accountId];
    connection.query({ 'sql': sql, 'timeout': 10000 }, params, function (err, result) {
        if (err) {
            throw err;
        }
        const like = req.body.like;
        if (like === 1) {
            if (result.length > 0) {
                // Avant c'était un dislike
                if (result[0].like !== 1) {
                    updateLikeOrDislike(true, postId, accountId, res, function (result) {
                        return result;
                    });
                }
                return res.status(204).json({ message: 'Rien à faire !' });
            } else {
                addLikeOrDislike(true, postId, accountId, res, function (result) {
                    return result;
                });
            }
        }
        if (like === -1) {
            if (result.length > 0) {
                // Avant c'était un like
                if (result[0].like !== 0) {
                    updateLikeOrDislike(false, postId, accountId, res, function (result) {
                        return result;
                    });
                }
                return res.status(204).json({ message: 'Rien à faire !' });
            } else {
                addLikeOrDislike(false, postId, accountId, res, function (result) {
                    return result;
                });
            }
        }
        if (like === 0) {
            if (result.length > 0) {
                removeLikeOrDislike(postId, accountId, res, function (result) {
                    return result;
                });
            } else {
                return res.status(204).json({ message: 'Rien à déliker !' });
            }
        }
    });
};