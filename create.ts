import * as uuid from 'uuid';
import { AWSError, DynamoDB } from 'aws-sdk';
import { APIGatewayProxyResult } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const dynamoDB = new DynamoDB.DocumentClient();

export function main(event, context, callback) {
  const data = JSON.parse(event.body);

  const params: DocumentClient.PutItemInput = {
    TableName: process.env.tableName, 
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: uuid.v1(),
      content: data.content, 
      attachment: data.attachment, 
      createdAt: Date.now()
    }
  }

  // callback(null,JSON.stringify(process.env));
  // return;
  dynamoDB.put(params, (error: AWSError, data: DocumentClient.PutItemOutput) => {
    // Set response headers to enable CORS (Cross-Origin Resource Sharing)
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    };

    if(error) {
      const response: APIGatewayProxyResult = {
        statusCode: 500,
        headers: headers, 
        body: JSON.stringify(error)
      }
      callback(null, response);
      return;
    }

    const response: APIGatewayProxyResult = {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(params.Item)
    };
    callback(null, response);
  });
}