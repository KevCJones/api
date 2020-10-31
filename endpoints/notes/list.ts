import { APIGatewayProxyEvent } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import dynamoDB from '../../libs/dynamodb-lib';
import handler from '../../libs/handler-lib';

export const main = handler(async (event: APIGatewayProxyEvent, context: any) => {
  const params: DocumentClient.QueryInput = {
    TableName: process.env.tableName,
    // 'KeyConditionExpression' defines the condition for the query
    // - 'userId = :userId': only return items with matching 'userId'
    //   partition key
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':userId': defines 'userId' to be Identity Pool identity id
    //   of the authenticated user
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': event.requestContext.identity.cognitoIdentityId,
    },
  };

  const result = await dynamoDB.query(params);

  return result.Items;
});
