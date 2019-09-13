require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const client = require('./lib/client');

client.connect();

const ensureAuth = require('./lib/auth/ensure-auth');
const createAuthRoutes = require('./lib/auth/create-auth-routes');
const authRoutes = createAuthRoutes({
    selectUser(email) {
        return client.query(`
            SELECT id, email, hash, display_name as "displayName"
            FROM users
            WHERE email = $1;
        `,
        [email]
        ).then(result => result.rows[0]);
    },
    insertUser(user, hash) {
        return client.query(`
            INSERT into users (email, hash, display_name)
            VALUES ($1, $2, $3)
            RETURNING id, email, display_name as "displayName";
        `,
        [user.email, hash, user.displayName]
        ).then(result => result.rows[0]);
    }
});

const app = express();
const PORT = process.env.PORT;
app.use(morgan('dev'));
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', ensureAuth);

//AUTH ROUTES

// plural routes, "data" prefix is meaningless
app.get('/api/games', (req, res) => {
    client.query(`
        SELECT * FROM game WHERE is_complete = $1;
    `, [true])
        .then(result => {
            res.json(result.rows);
        })
        .catch(err => {
            res.status(500).json({
                error: err.message || err
            });
        });
});

app.get('/api/mbti/:name', (req, res) => {
    const name = req.params.name;
    client.query(`
        SELECT * FROM mbti WHERE name = $1;
    `, [name])
        .then(result => {
            res.json(result.rows[0]); // only one thing: return object, not array
        })
        .catch(err => {
            res.status(500).json({
                error: err.message || err
            });
        });
});

// is this used?
app.get('/api/test', (req, res) => {
    client.query(`
        SELECT * FROM test;
    `)
        .then(result => {
            res.json(result.rows);
        })
        .catch(err => {
            res.status(500).json({
                error: err.message || err
            });
        });
});

app.get('/api/answers', (req, res) => {
    client.query(`
        SELECT * FROM answers;
    `)
        .then(result => {
            res.json(result.rows);
        })
        .catch(err => {
            res.status(500).json({
                error: err.message || err
            });
        });
});

app.get('/api/me/game', (req, res) => {
    client.query(`
        SELECT * FROM game WHERE users_id = $1;
    `, [req.userId])
        .then(result => {
            res.json(result.rows[0]);
        })
        .catch(err => {
            res.status(500).json({
                error: err.message || err
            });
        });
});

// This route needs serious help, I would think that either:
// - Update needs to be consolidated
// - If it is multipurpose, then split into different routes.
app.put('/api/games/:id', (req, res) => {
    const data = req.body;
    const id = req.params.id;
    if(data.isComplete) {
        client.query(`
            UPDATE game 
            SET is_complete = $1 
            WHERE id = $2
            AND user_id = $3; -- limit to authed user
        `, [data.isComplete, id, req.userId]
        )
            .then(() => {
                res.status(204).send();
            })
            .catch(err => {
                res.status(500).json({
                    error: err.message || err
                });
            });
    }
    if(data.userAnswer) {
        client.query(`
            UPDATE game 
            SET user_answer = CONCAT(user_answer, $1::text) -- data model smell, why concat?
            WHERE id = $2; -- need to limit to authed user
        `, [data.userAnswer, id])
            .then(result => {
                // what exactly are you returning?
                res.json(result.rows[0]);
            })
            .catch(err => {
                res.status(500).json({
                    error: err.message || err
                });
            });
    }
    if(data.method === 'back') {
        client.query(`
        UPDATE game SET user_answer = SUBSTR(user_answer, 1, LENGTH(user_answer)-5) 
        WHERE id = $1
        RETURNING *;
        `, [id])
            .then(result => {
                res.json(result.rows[0]);
            })
            .catch(err => {
                res.status(500).json({
                    error: err.message || err
                });
            });
    }
    if(data.method === 'char') {
        client.query(`
        UPDATE game SET result = $2
        WHERE id = $1
        RETURNING *;
        `, [id, data.character])
            .then(result => {
                res.json(result.rows[0]);
            })
            .catch(err => {
                res.status(500).json({
                    error: err.message || err
                });
            });
    }
});

app.post('/api/game', (req, res) => {
    client.query(`
        INSERT INTO game (users_id, question_order, is_complete)
        VALUES ($1, $2, $3)
        RETURNING *;
    `, [req.userId, req.body.order, false])
        .then(result => {
            res.json(result.rows[0]);
        })
        .catch(err => {
            res.status(500).json({
                error: err.message || err
            });
        });
});

app.get('/data/characters/', (req, res) => {
    client.query(`SELECT * FROM characters`)
        .then(result => {
            res.json(result.rows);
        })
        .catch(err => {
            res.status(500).json({
                error: err.message || err
            });
        });
});

app.get('/api/characters/:mbti', (req, res) => {
    const mbti = req.params.mbti;
    client.query(`
        SELECT *
        FROM characters
        WHERE mbti = $1 
    `, [mbti])
        .then(result => {
            const character = result.rows[0];
            if(!character) {
                res.status(404).json({
                    error: `character mbti ${mbti} does not exist`
                });
            } else {
                res.json(result.rows[0]);
            }
        });
});
// Start the server
app.listen(PORT, () => {
    console.log('server running on PORT', PORT);
});