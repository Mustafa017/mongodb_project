(function () {
    'use strict'
    const { MongoClient, ObjectID } = require('mongodb');

    function circulationRepo() {
        const url = 'mongodb://localhost:27017';
        const dbName = 'circulation';

        function loadData(data) {
            return new Promise(async (resolve, reject) => {
                const client = new MongoClient(url, { useUnifiedTopology: true });
                try {
                    await client.connect();
                    const db = client.db(dbName);
                    const results = await db.collection('newspapers').insertMany(data);
                    resolve(results);
                    client.close();
                } catch (error) {
                    reject(error);
                }
            })
        }

        function get(query, limit) {
            return new Promise(async (resolve, reject) => {
                const client = new MongoClient(url, { useUnifiedTopology: true });
                try {
                    await client.connect();
                    const db = client.db(dbName);
                    let items = db.collection('newspapers').find(query);

                    if (limit > 0) {
                        items = items.limit(limit);
                    }
                    resolve(await items.toArray());
                    client.close();
                } catch (error) {
                    reject(error);
                }
            })
        }

        function getById(id) {
            return new Promise(async (resolve, reject) => {
                const client = new MongoClient(url, { useUnifiedTopology: true });
                try {
                    await client.connect();
                    const db = client.db(dbName);
                    const item = await db.collection('newspapers').findOne({ _id: ObjectID(id) });
                    resolve(item);
                    client.close();
                } catch (error) {
                    reject(error);
                }
            })
        }

        function add(newItem) {
            return new Promise(async (resolve, reject) => {
                const client = new MongoClient(url, { useUnifiedTopology: true });
                try {
                    await client.connect();
                    const db = client.db(dbName);
                    const addItem = await db.collection('newspapers').insertOne(newItem);
                    resolve(addItem.ops[0]);
                    client.close();
                } catch (error) {
                    reject(error);
                }
            })
        }

        function update(id, item) {
            return new Promise(async (resolve, reject) => {
                const client = new MongoClient(url, { useUnifiedTopology: true });
                try {
                    await client.connect();
                    const db = client.db(dbName);
                    const updateditem = await db.collection('newspapers').findOneAndReplace({_id: ObjectID(id)}, item);
                    resolve(updateditem.value);
                    client.close();
                } catch (error) {
                    reject(error);
                }
            })
        }

        return {
            loadData,
            get,
            getById,
            add,
            update
        }
    }

    module.exports = circulationRepo();
}())