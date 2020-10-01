(function () {
    'use strict'
    const { MongoClient } = require("mongodb");
    const url = 'mongodb://localhost:27017';
    const dbName = 'circulation';
    const circulationRepo = require('./repos/circulationRepo');
    const data = require('./circulation.json');
    const assert = require('assert');

    async function main() {
        const client = new MongoClient(url, { useUnifiedTopology: true });
        try {
            await client.connect();

            const results = await circulationRepo.loadData(data);
            assert.strictEqual(data.length, results.insertedCount);
            // console.log(results.insertedCount, results.ops); //logs count and actual data.

            const getData = await circulationRepo.get();
            assert.strictEqual(data.length, getData.length);

            const filterData = await circulationRepo.get({Newspaper: getData[4].Newspaper});
            assert.deepStrictEqual(filterData[0], getData[4]); //both filterData and getData return an array, so to compare
            // the objects, we use bracket notation.
            
        } catch (error) {
            console.log(error);
        } finally {
            const db = client.db(dbName);
            const admin = db.admin();
            await db.dropDatabase();
            console.log(await admin.listDatabases());
            //console.log(await admin.serverStatus());
            client.close();
        }
    }
    main();
}())