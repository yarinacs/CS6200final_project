import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface SwnApiGatewayProps {
    productMicroservice: IFunction,
    basketMicroservice: IFunction,
    orderingMicroservices: IFunction,
    inventoryMicroservice?: IFunction,
    paymentMicroservice?: IFunction
}

export class SwnApiGateway extends Construct {    

    constructor(scope: Construct, id: string, props: SwnApiGatewayProps) {
        super(scope, id);

        this.createProductApi(props.productMicroservice);
        this.createBasketApi(props.basketMicroservice);
        this.createOrderApi(props.orderingMicroservices);
        
        if (props.inventoryMicroservice) {
            this.createInventoryApi(props.inventoryMicroservice);
        }
        
        if (props.paymentMicroservice) {
            this.createPaymentApi(props.paymentMicroservice);
        }
    }

    private createProductApi(productMicroservice: IFunction) {
      const apigw = new LambdaRestApi(this, 'productApi', {
        restApiName: 'Product Service',
        handler: productMicroservice,
        proxy: false,
        defaultCorsPreflightOptions: {
          allowOrigins: ['*'],
          allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
          allowHeaders: ['Content-Type', 'Authorization']
        }
      });
  
      const product = apigw.root.addResource('product');
      product.addMethod('GET');
      product.addMethod('POST');
      
      const singleProduct = product.addResource('{id}');
      singleProduct.addMethod('GET');
      singleProduct.addMethod('PUT');
      singleProduct.addMethod('DELETE');
    }

    private createBasketApi(basketMicroservice: IFunction) {
        const apigw = new LambdaRestApi(this, 'basketApi', {
            restApiName: 'Basket Service',
            handler: basketMicroservice,
            proxy: false,
            defaultCorsPreflightOptions: {
              allowOrigins: ['*'],
              allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
              allowHeaders: ['Content-Type', 'Authorization']
            }
        });

        const basket = apigw.root.addResource('basket');
        basket.addMethod('GET');
        basket.addMethod('POST');

        const singleBasket = basket.addResource('{userName}');
        singleBasket.addMethod('GET');
        singleBasket.addMethod('DELETE');

        const basketCheckout = basket.addResource('checkout');
        basketCheckout.addMethod('POST');
    }

    private createOrderApi(orderingMicroservices: IFunction) {
        const apigw = new LambdaRestApi(this, 'orderApi', {
            restApiName: 'Order Service',
            handler: orderingMicroservices,
            proxy: false,
            defaultCorsPreflightOptions: {
              allowOrigins: ['*'],
              allowMethods: ['GET', 'POST', 'OPTIONS'],
              allowHeaders: ['Content-Type', 'Authorization']
            }
        });
    
        const order = apigw.root.addResource('order');
        order.addMethod('GET');
    
        const singleOrder = order.addResource('{userName}');
        singleOrder.addMethod('GET');
    
        return singleOrder;
    }

    private createInventoryApi(inventoryMicroservice: IFunction) {
        const apigw = new LambdaRestApi(this, 'inventoryApi', {
            restApiName: 'Inventory Service',
            handler: inventoryMicroservice,
            proxy: false,
            defaultCorsPreflightOptions: {
              allowOrigins: ['*'],
              allowMethods: ['GET', 'POST', 'OPTIONS'],
              allowHeaders: ['Content-Type', 'Authorization']
            }
        });
    
        const inventory = apigw.root.addResource('inventory');
        inventory.addMethod('GET');
    }

    private createPaymentApi(paymentMicroservice: IFunction) {
        const apigw = new LambdaRestApi(this, 'paymentApi', {
            restApiName: 'Payment Service',
            handler: paymentMicroservice,
            proxy: false,
            defaultCorsPreflightOptions: {
              allowOrigins: ['*'],
              allowMethods: ['GET', 'OPTIONS'],
              allowHeaders: ['Content-Type', 'Authorization']
            }
        });
    
        const payment = apigw.root.addResource('payment');
        payment.addMethod('GET');
        
        const userPayments = payment.addResource('{userName}');
        userPayments.addMethod('GET');
    }
}
