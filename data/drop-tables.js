const client = require('../lib/client');

client.connect()
    .then(() => {
        return client.query(`
            DROP TABLE IF EXISTS test CASCADE;
            DROP TABLE IF EXISTS answers CASCADE;
            DROP TABLE IF EXISTS characters CASCADE;
            DROP TABLE IF EXISTS mbti CASCADE;
            DROP TABLE IF EXISTS users CASCADE;
            DROP TABLE IF EXISTS game CASCADE;
        `);
    })
    .then(
        () => console.log('tables dropped'),
        err => console.log(err)
    )
    .then(
        () => { client.end(); }
    );