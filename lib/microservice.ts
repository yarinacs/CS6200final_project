import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";
import { IQueue } from "aws-cdk-lib/aws-sqs";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";

interface SwnMicroservicesProps {
  productTable: ITable;
  basketTable: ITable;
  orderTable: ITable;
  paymentTable: ITable;
  paymentQueue?: IQueue;
}

export class SwnMicroservices extends Construct {

  public readonly productMicroservice: NodejsFunction;
  public readonly basketMicroservice: NodejsFunction;
  public readonly orderingMicroservice: NodejsFunction;
  public readonly inventoryMicroservice: NodejsFunction;
  public readonly paymentMicroservice: NodejsFunction;

  constructor(scope: Construct, id: string, props: SwnMicroservicesProps) {
    super(scope, id);

    this.productMicroservice = this.createProductFunction(props.productTable);
    this.basketMicroservice = this.createBasketFunction(props.basketTable);
    this.orderingMicroservice = this.createOrderingFunction(props.orderTable);
    this.inventoryMicroservice = this.createInventoryFunction(props.productTable);
    this.paymentMicroservice = this.createPaymentFunction(props.paymentTable, props.paymentQueue);
  }

  private createProductFunction(productTable: ITable): NodejsFunction {
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: []
      },
      environment: {
        PRIMARY_KEY: 'id',
        DYNAMODB_TABLE_NAME: productTable.tableName
      },
      runtime: Runtime.NODEJS_18_X
    }

    const productFunction = new NodejsFunction(this, 'productLambdaFunction', {
      entry: join(__dirname, `/../src/product/index.js`),
      ...nodeJsFunctionProps,
    });

    productTable.grantReadWriteData(productFunction);
    return productFunction;
  }

  private createBasketFunction(basketTable: ITable): NodejsFunction {
    const basketFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: []
      },
      environment: {
        PRIMARY_KEY: 'userName',
        DYNAMODB_TABLE_NAME: basketTable.tableName,
        EVENT_SOURCE: "com.swn.basket.checkoutbasket",
        EVENT_DETAILTYPE: "CheckoutBasket",
        EVENT_BUSNAME: "SwnEventBus-v2"
      },
      runtime: Runtime.NODEJS_18_X,
    }

    const basketFunction = new NodejsFunction(this, 'basketLambdaFunction', {
      entry: join(__dirname, `/../src/basket/index.js`),
      ...basketFunctionProps,
    });

    basketTable.grantReadWriteData(basketFunction);
    return basketFunction;
  }

  private createOrderingFunction(orderTable: ITable): NodejsFunction {
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: []
      },
      environment: {
        PRIMARY_KEY: 'userName',
        SORT_KEY: 'orderDate',
        DYNAMODB_TABLE_NAME: orderTable.tableName,
      },
      runtime: Runtime.NODEJS_18_X,
    }

    const orderFunction = new NodejsFunction(this, 'orderingLambdaFunction', {
      entry: join(__dirname, `/../src/ordering/index.js`),
      ...nodeJsFunctionProps,
    });

    orderTable.grantReadWriteData(orderFunction);
    return orderFunction;
  }

  private createInventoryFunction(productTable: ITable): NodejsFunction {
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: []
      },
      environment: {
        PRIMARY_KEY: 'id',
        DYNAMODB_TABLE_NAME: productTable.tableName,
      },
      runtime: Runtime.NODEJS_18_X,
    }

    const inventoryFunction = new NodejsFunction(this, 'inventoryLambdaFunction', {
      entry: join(__dirname, `/../src/inventory/index.js`),
      ...nodeJsFunctionProps,
    });

    productTable.grantReadWriteData(inventoryFunction);
    return inventoryFunction;
  }

  private createPaymentFunction(paymentTable: ITable, paymentQueue?: IQueue): NodejsFunction {
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: []
      },
      environment: {
        PRIMARY_KEY: 'paymentId',
        DYNAMODB_TABLE_NAME: paymentTable.tableName,
        EVENT_BUSNAME: 'SwnEventBus-v2'
      },
      runtime: Runtime.NODEJS_18_X,
    }

    const paymentFunction = new NodejsFunction(this, 'paymentLambdaFunction', {
      entry: join(__dirname, `/../src/payment/index.js`),
      ...nodeJsFunctionProps,
    });

    paymentTable.grantReadWriteData(paymentFunction);

    if (paymentQueue) {
      paymentFunction.addEventSource(new SqsEventSource(paymentQueue, {
        batchSize: 5
      }));
    }

    return paymentFunction;
  }
}
