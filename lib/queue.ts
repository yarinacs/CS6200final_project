import { Duration } from "aws-cdk-lib";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { IQueue, Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

interface SwnQueueProps {
    orderingConsumer?: IFunction;
    inventoryConsumer?: IFunction;
    paymentConsumer?: IFunction;
}

export class SwnQueue extends Construct {

    public readonly orderQueue: IQueue;
    public readonly inventoryQueue: IQueue;
    public readonly paymentQueue: IQueue;

    constructor(scope: Construct, id: string, props: SwnQueueProps) {
        super(scope, id);

        this.orderQueue = new Queue(this, 'OrderQueue', {
            queueName: 'OrderQueue-v2',
            visibilityTimeout: Duration.seconds(30)
        });

        this.inventoryQueue = new Queue(this, 'InventoryQueue', {
            queueName: 'InventoryQueue-v2',
            visibilityTimeout: Duration.seconds(30)
        });

        this.paymentQueue = new Queue(this, 'PaymentQueue', {
            queueName: 'PaymentQueue-v2',
            visibilityTimeout: Duration.seconds(30)
        });

        if (props.orderingConsumer) {
            props.orderingConsumer.addEventSource(new SqsEventSource(this.orderQueue, {
                batchSize: 1
            }));
        }

        if (props.inventoryConsumer) {
            props.inventoryConsumer.addEventSource(new SqsEventSource(this.inventoryQueue, {
                batchSize: 10
            }));
        }

        if (props.paymentConsumer) {
            props.paymentConsumer.addEventSource(new SqsEventSource(this.paymentQueue, {
                batchSize: 5
            }));
        }
    }
}
