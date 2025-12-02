import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { SwnApiGateway } from './apigateway';
import { SwnDatabase } from './database';
import { SwnEventBus } from './eventbus';
import { SwnMicroservices } from './microservice';
import { SwnQueue } from './queue';
import { SwnAuth } from './auth';

export class AwsMicroservicesStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const database = new SwnDatabase(this, 'Database');

    const microservices = new SwnMicroservices(this, 'Microservices', {
      productTable: database.productTable,
      basketTable: database.basketTable,
      orderTable: database.orderTable,
      paymentTable: database.paymentTable
    });

    const queue = new SwnQueue(this, 'Queue', {
      orderingConsumer: microservices.orderingMicroservice,
      inventoryConsumer: microservices.inventoryMicroservice,
      paymentConsumer: microservices.paymentMicroservice
    });

    const auth = new SwnAuth(this, 'Auth');

    const apigateway = new SwnApiGateway(this, 'ApiGateway', {
      productMicroservice: microservices.productMicroservice,
      basketMicroservice: microservices.basketMicroservice,
      orderingMicroservices: microservices.orderingMicroservice,
      inventoryMicroservice: microservices.inventoryMicroservice,
      paymentMicroservice: microservices.paymentMicroservice,
      userPool: auth.userPool
    });

    const eventbus = new SwnEventBus(this, 'EventBus', {
      publisherFuntion: microservices.basketMicroservice,
      orderQueue: queue.orderQueue,
      inventoryQueue: queue.inventoryQueue,
      paymentQueue: queue.paymentQueue
    });

  }
}
