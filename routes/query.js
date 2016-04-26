var express = require('express');
var router = express.Router();

module.exports = router;


var AWS = require("aws-sdk");
var fs = require('fs');
AWS.config = new AWS.Config();
AWS.config.accessKeyId = "AKIAIN3F4XXTDXEFTQ2Q";
AWS.config.secretAccessKey = "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";

AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});

var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Querying for movies from 1985.");

var params = {
    TableName : "colors",
    KeyConditionExpression: "#id = :id",
    ExpressionAttributeNames:{
        "#id": "id"
    },
    ExpressionAttributeValues: {
        ":id":"10"
    }
};

docClient.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        data.Items.forEach(function(item) {
            console.log(" -", item.id + ": " + item.colorName + JSON.stringify(item.id + ": " + item.colorName, null, 2));
			router.get('/', function(req, res, next) {
			  res.send(item.id + ": " + item.colorName);
			});
        });
    }
});


