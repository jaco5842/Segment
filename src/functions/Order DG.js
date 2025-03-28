const { app } = require('@azure/functions');
const { executeSqlQuery } = require('./helpers/functions');
const { postUrl } = require('./helpers/Methods');
const fs = require('fs').promises; // Use fs.promises for async file operations
const path = require('path');
const moment = require('moment');


// Define test mode at the top level
const isTestMode = process.env.testmode === 'true';

app.timer('menyvin', {
    schedule: '0 0 2 * * *',
    handler: async (myTimer, context) => {
        const date = moment().subtract(1, 'days').format('YYYY-MM-DD');     
        context.log(date);
        
        // Construct the relative path to the SQL file
        const sqlFilePath = path.join(__dirname, 'sql', 'PW', 'menyvin.sql');
        
        try {
            // Read the SQL query from the file
            const query = await fs.readFile(sqlFilePath, 'utf8');
            
            // Execute the SQL query
            const results = await executeSqlQuery(context, query, date);
            context.log(results);

            // For each row in the result, call the track function
            for (const row of results) {

                // Create variables 
                let company = process.env.testmode === 'true' ? 'Test' : row.company;
                let messageId = process.env.testmode === 'true' ? row.event + '-' + row.invoiceNo + company+moment() : row.event + '-' + row.invoiceNo + company;                

                // Call the track function
                await postUrl(context, row, process.env.zappierTrackUrl);
            }

            context.log(results);
        } catch (error) {
            context.error(`Error: ${error.message}`);
        }
    }
});

