const AWS = require('aws-sdk');

// Configure AWS Region
AWS.config.update({ region: 'us-east-1' });

const docClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'basket-v2';

async function checkBasket() {
    console.log(`Scanning table: ${TABLE_NAME}...`);

    const params = {
        TableName: TABLE_NAME
    };

    try {
        const data = await docClient.scan(params).promise();
        console.log('Scan succeeded.');
        if (data.Items.length === 0) {
            console.log('The basket is currently EMPTY.');
        } else {
            console.log(`Found ${data.Items.length} items in the basket:`);
            data.Items.forEach(item => {
                console.log('------------------------------------------------');
                console.log(JSON.stringify(item, null, 2));
            });
            console.log('------------------------------------------------');
        }
    } catch (err) {
        console.error('Unable to scan the table. Error JSON:', JSON.stringify(err, null, 2));
    }
}

checkBasket();
