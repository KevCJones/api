import { APIGatewayProxyEvent } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import * as uuid from 'uuid';
import dynamoDB from '../../libs/dynamodb-lib';
import handler from '../../libs/handler-lib';

export const main = handler(async (event: APIGatewayProxyEvent, context: any) => {
  const data = JSON.parse(event.body);
  const params: DocumentClient.PutItemInput = {
    TableName: process.env.tableName,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: uuid.v1(),
      content: data.content,
      attachment: data.attachment,
      createdAt: Date.now(),
    },
  };

  await dynamoDB.put(params);

  return params.Item;
});
