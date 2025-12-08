import { Duration } from "aws-cdk-lib";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { IQueue, Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

interface SwnQueueProps {
    orderingConsumer?: IFunction;
    inventoryConsumer?: IFunction;
}

export class SwnQueue extends Construct {

    public readonly orderQueue: IQueue;
    public readonly inventoryQueue: IQueue;

    constructor(scope: Construct, id: string, props: SwnQueueProps) {
        super(scope, id);

      // Queue for Ordering service
      this.orderQueue = new Queue(this, 'OrderQueue', {
        queueName : 'OrderQueue',
        visibilityTimeout: Duration.seconds(30)
      });

      // Queue for Inventory service
      this.inventoryQueue = new Queue(this, 'InventoryQueue', {
        queueName : 'InventoryQueue',
        visibilityTimeout: Duration.seconds(30)
      });
      
      // Connect ordering consumer
      if (props.orderingConsumer) {
          props.orderingConsumer.addEventSource(new SqsEventSource(this.orderQueue, {
              batchSize: 1
          }));
      }

      // Connect inventory consumer
      if (props.inventoryConsumer) {
          props.inventoryConsumer.addEventSource(new SqsEventSource(this.inventoryQueue, {
              batchSize: 10
          }));
      }
    }
}
