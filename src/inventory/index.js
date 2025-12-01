const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.DYNAMODB_TABLE_NAME;
const primaryKey = process.env.PRIMARY_KEY || 'id';

exports.handler = async function (event) {
    console.log("Request:", JSON.stringify(event, undefined, 2));

    try {
        if (event.Records) {
            return await handleSQSEvent(event);
        }
        throw new Error("Unsupported event type");
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
            },
            body: JSON.stringify({
                message: "Failed to process request",
                error: error.message
            })
        };
    }
};

async function handleSQSEvent(event) {
    console.log(`Processing ${event.Records.length} SQS messages for inventory update`);
    const failedMessageIds = [];

    for (const record of event.Records) {
        try {
            const eventBridgeEvent = JSON.parse(record.body);
            const orderData = eventBridgeEvent.detail;

            if (!orderData || !orderData.items || !Array.isArray(orderData.items)) {
                throw new Error("Invalid order data: missing items");
            }

            for (const item of orderData.items) {
                if (!item.productId || !item.quantity) {
                    console.warn("Skipping invalid item:", item);
                    continue;
                }
                await decreaseStock(item.productId, item.quantity);
                console.log(`✅ Stock decreased for product ${item.productId}: -${item.quantity}`);
            }
        } catch (error) {
            console.error(`❌ Failed to process message ${record.messageId}:`, error);
            failedMessageIds.push(record.messageId);
        }
    }

    if (failedMessageIds.length > 0) {
        return {
            batchItemFailures: failedMessageIds.map(id => ({ itemIdentifier: id }))
        };
    }
    return { batchItemFailures: [] };
}

async function decreaseStock(productId, quantity) {
    console.log(`Decreasing stock for product ${productId} by ${quantity}`);

    try {
        const params = {
            TableName: tableName,
            Key: { [primaryKey]: productId },
            UpdateExpression: 'SET availableStock = availableStock - :quantity, lastRestocked = :lastRestocked',
            ConditionExpression: 'availableStock >= :quantity',
            ExpressionAttributeValues: {
                ':quantity': quantity,
                ':lastRestocked': new Date().toISOString()
            },
            ReturnValues: 'ALL_NEW'
        };

        const { Attributes } = await ddbDocClient.send(new UpdateCommand(params));
        console.log(`✅ Stock updated for product ${productId}. New stock: ${Attributes.availableStock}`);

        if (Attributes.availableStock <= (Attributes.reorderLevel || 10)) {
            console.warn(`⚠️ LOW STOCK ALERT for product ${productId}: ${Attributes.availableStock} units`);
        }
        return Attributes;
    } catch (error) {
        if (error.name === 'ConditionalCheckFailedException') {
            console.error(`❌ INSUFFICIENT STOCK for product ${productId}`);
            throw new Error(`Insufficient stock for product ${productId}`);
        }
        throw error;
    }
}
