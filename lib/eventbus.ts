import { EventBus, Rule } from "aws-cdk-lib/aws-events";
import { SqsQueue } from "aws-cdk-lib/aws-events-targets";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { IQueue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

interface SwnEventBusProps {
    publisherFuntion: IFunction;
    orderQueue: IQueue;
    inventoryQueue: IQueue;
    paymentQueue: IQueue;
}

export class SwnEventBus extends Construct {

    constructor(scope: Construct, id: string, props: SwnEventBusProps) {
        super(scope, id);

        const bus = new EventBus(this, 'SwnEventBus', {
            eventBusName: 'SwnEventBus'
        });
    
        const checkoutBasketRule = new Rule(this, 'CheckoutBasketRule', {
            eventBus: bus,
            enabled: true,
            description: 'When Basket microservice checkout the basket',
            eventPattern: {
                source: ['com.swn.basket.checkoutbasket'],
                detailType: ['CheckoutBasket']
            },
            ruleName: 'CheckoutBasketRule'
        });
    
        // Fan-out to 3 queues: Order, Inventory, Payment
        checkoutBasketRule.addTarget(new SqsQueue(props.orderQueue));
        checkoutBasketRule.addTarget(new SqsQueue(props.inventoryQueue));
        checkoutBasketRule.addTarget(new SqsQueue(props.paymentQueue));
        
        bus.grantPutEventsTo(props.publisherFuntion);
    }
}
