const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('../db');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hashedPassword => {
            const sql = "INSERT INTO account (name, password, created_on, last_login, is_admin) VALUES (?, ?, ?, ?, ?);";
            const params = [req.body.name, hashedPassword, getTodayDate(), getTodayDate(), false];
            connection.query({ 'sql': sql, 'timeout': 10000 }, params, function (err, result) {
                if (err) {
                    throw err;
                }
                if (result.affectedRows === 1) {
                    return res.status(201).json({ message: 'Utilisateur créé !' });
                }
            });
        })
        .catch(error => res.status(500).json({ error }));
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
};

exports.login = (req, res, next) => {
    const sql = "SELECT account_id, name, password, is_admin FROM account WHERE name = ?;";
    const params = [req.body.name];
    connection.query({ 'sql': sql, 'timeout': 10000 }, params, function (err, result) {
        if (err) {
            throw err;
        }
        if (result.length > 0) {
            bcrypt.compare(req.body.password, result[0].password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: result[0].account_id,
                        name: result[0].name,
                        isAdmin: result[0].is_admin,
                        token: jwt.sign(
                            { userId: result[0].account_id },
                            process.env.TOKEN,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        } else {
            return res.status(404).json({ message: 'Utilisateur non trouvé !' });
        }
    });
};

exports.modifyUser = (req, res, next) => {
    const sql = "SELECT account_id, name, password FROM account WHERE account_id = ?;";
    const params = [req.params.id];
    connection.query({ 'sql': sql, 'timeout': 10000 }, params, function (err, result) {
        if (err) {
            throw err;
        }
        if (result.length > 0) {
            bcrypt.compare(req.body.oldPassword, result[0].password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    bcrypt.hash(req.body.newPassword, 10)
                        .then(hashedPassword => {
                            const sql = "UPDATE account SET name = ?, password = ? WHERE account_id = ?;";
                            const params = [req.body.name, hashedPassword, req.params.id];
                            connection.query({ 'sql': sql, 'timeout': 10000 }, params, function (err, result) {
                                res.status(200).json({
                                    message: 'Modification du compte réussie.'
                                });
                            });
                        });
                })
                .catch(error => res.status(500).json({ error }));
        } else {
            return res.status(404).json({ message: 'Utilisateur non trouvé !' });
        }
    });
};

exports.deleteUser = (req, res, next) => {
    const accountId = req.params.id;
    const accountDeleteParams = [accountId];
    const accountDeleteSql = "DELETE FROM account WHERE account_id = ?;";
    connection.query({ 'sql': accountDeleteSql, 'timeout': 10000 }, accountDeleteParams, function (err, result) {
        if (err) {
            throw err;
        }
        if (result.affectedRows === 1) {
            return res.status(200).json({ message: 'Le compte et toutes ses informations ont été supprimés avec succès !' });
        } else {
            return res.status(404).json({ message: 'Utilisateur non trouvé !' });
        }
    });
};
