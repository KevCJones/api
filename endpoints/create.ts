import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import * as uuid from 'uuid';
import handler from '../libs/handler-lib';
import dynamoDB from '../libs/dynamodb-lib';

export const main = handler(async (event, context) => {
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
