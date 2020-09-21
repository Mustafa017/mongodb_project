(function () {
    'use strict'
    const { MongoClient } = require('mongodb');

    function circulationRepo() {
        const url = 'mongodb://localhost:27017';
        const dbName = 'circulation';

        function loadData(data) {
            return new Promise(async (resolve, reject) => {
                const client = new MongoClient(url, { useUnifiedTopology: true });
                try {
                    await client.connect();
                    const db = client.db(dbName);
                    const result = await db.collection('newspapers').insertMany(data);
                } catch (error) {
                    reject(error)
                }
            })
        }

        return {
            loadData
        }
    }

    module.exports = circulationRepo();
}())