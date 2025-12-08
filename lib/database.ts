import { RemovalPolicy } from "aws-cdk-lib";
import { AttributeType, BillingMode, ITable, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class SwnDatabase extends Construct {

  public readonly productTable: ITable;
  public readonly basketTable: ITable;
  public readonly orderTable: ITable;
  public readonly paymentTable: ITable;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    //product table
    this.productTable = this.createProductTable();
    //basket table
    this.basketTable = this.createBasketTable();
    //order table
    this.orderTable = this.createOrderTable();
    this.paymentTable = this.createPaymentTable();
  }

  // Product DynamoDb Table Creation
  // product : PK: id -- name - description - imageFile - price - category
  private createProductTable(): ITable {
    const productTable = new Table(this, 'product', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      tableName: 'product-v2',
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST
    });
    return productTable;
  }

  // Basket DynamoDb Table Creation
  // basket : PK: userName -- items (SET-MAP object) 
  // item1 - { quantity - color - price - productId - productName }
  // item2 - { quantity - color - price - productId - productName }
  private createBasketTable(): ITable {
    const basketTable = new Table(this, 'basket', {
      partitionKey: {
        name: 'userName',
        type: AttributeType.STRING,
      },
      tableName: 'basket-v2',
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST
    });
    return basketTable;
  }

  // Order DynamoDb Table Creation
  // order : PK: userName - SK: orderDate -- totalPrice - firstName - lastName - email - address - paymentMethod - cardInfo
  private createOrderTable(): ITable {
    const orderTable = new Table(this, 'order', {
      partitionKey: {
        name: 'userName',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'orderDate',
        type: AttributeType.STRING,
      },
      tableName: 'order-v2',
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST
    });
    return orderTable;
  }

  private createPaymentTable(): ITable {
    const paymentTable = new Table(this, 'payment', {
      partitionKey: {
        name: 'paymentId',
        type: AttributeType.STRING,
      },
      tableName: 'payment-v2',
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST
    });
    return paymentTable;
  }

}

