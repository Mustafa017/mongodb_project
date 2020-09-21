(function () {
    'use strict'
    const { MongoClient } = require("mongodb");
    const url = 'mongodb://localhost:27017';
    const dbName = 'circulation';
    const circulationRepo = require('./repos/circulationRepo');
    const data = require('./circulation.json');

    async function main() {
        const client = new MongoClient(url, { useUnifiedTopology: true });
        await client.connect();
        
        const results = circulationRepo.loadData(data);
        console.log(results.insertedCount, results.ops); //logs count and actual data.
        const admin = client.db(dbName).admin();
        console.log(await admin.listDatabases());
        //console.log(await admin.serverStatus());

    }
    main();
}())