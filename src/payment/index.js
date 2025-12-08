const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { EventBridgeClient, PutEventsCommand } = require("@aws-sdk/client-eventbridge");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);
const ebClient = new EventBridgeClient({});

const tableName = process.env.DYNAMODB_TABLE_NAME;

exports.handler = async function (event) {
    console.log("Request:", JSON.stringify(event, undefined, 2));

    try {
        if (event.Records) {
            return await handleSQSEvent(event);
        }

        if (event.httpMethod) {
            return await handleAPIRequest(event);
        }

        throw new Error("Unsupported event type");
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "GET,OPTIONS"
            },
            body: JSON.stringify({
                message: "Failed to process request",
                error: error.message
            })
        };
    }
};

async function handleSQSEvent(event) {
    console.log(`Processing ${event.Records.length} payment requests`);

    for (const record of event.Records) {
        try {
            const eventBridgeEvent = JSON.parse(record.body);
            const orderData = eventBridgeEvent.detail;
            console.log("Processing payment for order:", orderData);
            await processPayment(orderData);
        } catch (error) {
            console.error(`Failed to process payment:`, error);
        }
    }

    return { statusCode: 200 };
}

async function processPayment(orderData) {
    const paymentId = generatePaymentId();
    const timestamp = new Date().toISOString();
    
    // Simulate payment (90% success)
    const isSuccess = Math.random() > 0.1;
    const status = isSuccess ? 'COMPLETED' : 'FAILED';

    const paymentRecord = {
        paymentId: paymentId,
        userName: orderData.userName,
        orderDate: orderData.orderDate,
        amount: orderData.totalPrice || 0,
        status: status,
        paymentMethod: 'Credit Card',
        processedAt: timestamp,
        transactionId: isSuccess ? `TXN-${Date.now()}` : null,
        failureReason: isSuccess ? null : 'Insufficient funds'
    };

    await ddbDocClient.send(new PutCommand({
        TableName: tableName,
        Item: paymentRecord
    }));

    console.log(`✅ Payment ${status}: ${paymentId} for $${paymentRecord.amount}`);

    await publishPaymentEvent(paymentRecord, orderData);
    return paymentRecord;
}

async function publishPaymentEvent(paymentRecord, orderData) {
    const eventDetail = {
        userName: orderData.userName,
        orderDate: orderData.orderDate,
        paymentId: paymentRecord.paymentId,
        paymentStatus: paymentRecord.status,
        amount: paymentRecord.amount
    };

    const params = {
        Entries: [{
            Source: 'com.swn.payment',
            DetailType: paymentRecord.status === 'COMPLETED' ? 'PaymentCompleted' : 'PaymentFailed',
            Detail: JSON.stringify(eventDetail),
            EventBusName: process.env.EVENT_BUSNAME || 'SwnEventBus'
        }]
    };

    await ebClient.send(new PutEventsCommand(params));
    console.log(`📤 Payment event published: ${paymentRecord.status}`);
}

async function handleAPIRequest(event) {
    try {
        let body;
        
        if (event.pathParameters && event.pathParameters.userName) {
            body = await getPaymentsByUser(event.pathParameters.userName);
        } else {
            body = await getAllPayments();
        }

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "GET,OPTIONS"
            },
            body: JSON.stringify({
                message: "Successfully finished operation",
                body: body
            })
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: JSON.stringify({
                message: "Failed to perform operation",
                error: error.message
            })
        };
    }
}

async function getAllPayments() {
    const result = await ddbDocClient.send(new ScanCommand({
        TableName: tableName
    }));
    return result.Items || [];
}

async function getPaymentsByUser(userName) {
    const result = await ddbDocClient.send(new ScanCommand({
        TableName: tableName
    }));
    return (result.Items || []).filter(item => item.userName === userName);
}

function generatePaymentId() {
    return `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();
}
