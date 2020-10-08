const { get } = require("./repos/circulationRepo");

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

            const limitData = await circulationRepo.get({}, 3);
            assert.strictEqual(limitData.length, 3)

            const id = getData[4]._id.toString();
            const searchId = await circulationRepo.getById(id);
            assert.deepStrictEqual(searchId, getData[4]);

            const newItem = {
                "Newspaper": "Daily Nation",
                "Daily Circulation, 2004": 50000,
                "Daily Circulation, 2013": 46000,
                "Change in Daily Circulation, 2004-2013": 4000,
                "Pulitzer Prize Winners and Finalists, 1990-2003": 2,
                "Pulitzer Prize Winners and Finalists, 2004-2014": 7,
                "Pulitzer Prize Winners and Finalists, 1990-2014": 9
            };
            const addedItem = await circulationRepo.add(newItem);
            assert(addedItem._id);
            const addedItemQuery = await circulationRepo.getById(addedItem._id);
            assert.deepStrictEqual(addedItemQuery, newItem);

            const updateItem = await circulationRepo.update(addedItem._id, {
                "Newspaper": "The Standard",
                "Daily Circulation, 2004": 34126,
                "Daily Circulation, 2013": 57892,
                "Change in Daily Circulation, 2004-2013": 22766,
                "Pulitzer Prize Winners and Finalists, 1990-2003": 26,
                "Pulitzer Prize Winners and Finalists, 2004-2014": 38,
                "Pulitzer Prize Winners and Finalists, 1990-2014": 64
            });
            const updatedItem = await circulationRepo.getById(addedItem._id)
            assert.deepStrictEqual(updatedItem.Newspaper,'The Standard');
            
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