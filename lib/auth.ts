import { Construct } from 'constructs';
import { UserPool, UserPoolClient, VerificationEmailStyle, AccountRecovery } from 'aws-cdk-lib/aws-cognito';
import { CfnOutput, RemovalPolicy } from 'aws-cdk-lib';

export class SwnAuth extends Construct {
    public readonly userPool: UserPool;
    public readonly userPoolClient: UserPoolClient;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.userPool = new UserPool(this, 'SwnUserPool', {
            signInAliases: {
                email: true
            },
            selfSignUpEnabled: true,
            autoVerify: {
                email: true
            },
            passwordPolicy: {
                minLength: 8,
                requireLowercase: false,
                requireUppercase: false,
                requireDigits: false,
                requireSymbols: false
            },
            removalPolicy: RemovalPolicy.DESTROY
        });

        this.userPoolClient = new UserPoolClient(this, 'SwnUserPoolClient', {
            userPool: this.userPool,
            generateSecret: false // Important for browser-based apps
        });

        new CfnOutput(this, 'UserPoolId', {
            value: this.userPool.userPoolId
        });

        new CfnOutput(this, 'UserPoolClientId', {
            value: this.userPoolClient.userPoolClientId
        });
    }
}
