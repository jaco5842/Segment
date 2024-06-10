const sql = require('mssql');
const moment = require('moment');

const serverConfig = {
    server: process.env.sqlserver,
    database: process.env.database,
    user: process.env.user,
    password: process.env.password,
    options: {
        encrypt: true, // Use this if you're on Windows Azure
        trustServerCertificate: true // Change to true for local dev / self-signed certs
    }
};

async function executeSqlQuery(context, query, date) {
    try {
        await sql.connect(serverConfig);

        const request = new sql.Request();
        request.input('date', sql.Date, new Date(date));

        const result = await request.query(query);
        return result.recordset;

    } catch (err) {
        context.error('SQL error', err);
        return [];
    }
}

module.exports = {executeSqlQuery};
