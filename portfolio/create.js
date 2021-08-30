const uuid = require('uuid');
const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = async (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  if (typeof data.profile_image !== 'string' || typeof data.name !== 'string' || typeof data.experience !== 'string') {
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t create the portfolio info, please check params.',
    });
    return;
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid.v1(),
      profile_image: data.profile_image,
      name: data.name,
      experience: data.experience,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  try {
    await dynamoDb.put(params).promise();
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  } catch (error) {
    console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t create the portfolio info.',
      });
    return;
  }
};