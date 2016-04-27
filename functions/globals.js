global.express = require('express');
global.path = require('path');
global.favicon = require('serve-favicon');
global.logger = require('morgan');
global.cookieParser = require('cookie-parser');
global.bodyParser = require('body-parser');

global.AWS = require("aws-sdk");
global.fs = require('fs');
global.app = express();

global.express = require('express');
global.router = express.Router();
global.passport = require('passport');
global.FacebookStrategy = require('passport-facebook').Strategy;
global.AWS = require('aws-sdk');
global.colors = require('colors');

global.AWS_ACCOUNT_ID = '363425050455';
global.AWS_Region = 'us-east-1';
global.COGNITO_IDENTITY_POOL_ID = 'us-east-1:b1473cbb-85ff-4353-bc37-bef131d490cc';
global.COGNITO_IDENTITY_ID;
global.COGNITO_SYNC_TOKEN;
global.AWS_TEMP_CREDENTIALS;
global.cognitosync;
global.IAM_ROLE_ARN = 'arn:aws:iam::363425050455:role/Cognito_LamsaTestAuth_Role';
global.COGNITO_SYNC_COUNT;
global.COGNITO_DATASET_NAME = 'Dataset';
global.FACEBOOK_APP_ID = '983767111705365';
global.FACEBOOK_APP_SECRET = 'c9b5f6a5f51b44d4cd89df22f4241e56';
global.FACEBOOK_TOKEN;
global.user_id;

global.FACEBOOK_USER = {
  id: '',
  first_name: '',
  gender: '',
  last_name: '',
  link: '',
  locale: '',
  name: '',
  timezone: 0,
  updated_time: '',
  verified: false
};

/////function////////
function getCognitoID(){

  var params = {

    AccountId: AWS_ACCOUNT_ID, /* required */
    RoleArn: IAM_ROLE_ARN,  /* required */
    IdentityPoolId: COGNITO_IDENTITY_POOL_ID, /* required */
    Logins: {
      'graph.facebook.com': FACEBOOK_TOKEN
    }

  };

  AWS.config.region = AWS_Region;
  /* initialize the Credentials object */
  AWS.config.credentials = new AWS.CognitoIdentityCredentials(params);
  /* Get the credentials for our user */
  AWS.config.credentials.get(function(err) {
    if (err) console.log("credentials.get: ".red + err, err.stack); /* an error occurred */
      else{
		AWS_TEMP_CREDENTIALS = AWS.config.credentials.data.Credentials;
        COGNITO_IDENTITY_ID = AWS.config.credentials.identityId;
        console.log("Cognito Identity Id: ".green + COGNITO_IDENTITY_ID);
		getCognitoSynToken();
      }
  });
}


function getCognitoSynToken(){

  /* Other AWS SDKs will automatically use the Cognito Credentials provider */

  /* configured in the JavaScript SDK. */

  cognitosync = new AWS.CognitoSync();

  cognitosync.listRecords({

    DatasetName: COGNITO_DATASET_NAME, /* required */

    IdentityId: COGNITO_IDENTITY_ID,  /* required */

    IdentityPoolId: COGNITO_IDENTITY_POOL_ID  /* required */

  }, function(err, data) {

    if (err) console.log("listRecords: ".red + err, err.stack); /* an error occurred */

      else {

        console.log("listRecords: ".green + JSON.stringify(data));

        COGNITO_SYNC_TOKEN = data.SyncSessionToken;

        COGNITO_SYNC_COUNT = data.DatasetSyncCount;

        console.log("SyncSessionToken: ".green + COGNITO_SYNC_TOKEN);           /* successful response */

        console.log("DatasetSyncCount: ".green + COGNITO_SYNC_COUNT);
		addRecord(); 

      }

  });

}


function addRecord(){

  var params = {

    DatasetName: COGNITO_DATASET_NAME, /* required */

    IdentityId: COGNITO_IDENTITY_ID, /* required */

    IdentityPoolId: COGNITO_IDENTITY_POOL_ID, /* required */

    SyncSessionToken: COGNITO_SYNC_TOKEN, /* required */

    RecordPatches: [

      {

        Key: 'USER_NAME', /* required */

        Op: 'replace', /* required */

        SyncCount: COGNITO_SYNC_COUNT, /* required */

        Value: FACEBOOK_USER.name

      }

    ]

  };

  console.log("UserID: ".cyan + FACEBOOK_USER.id);

  cognitosync.updateRecords(params, function(err, data) {

    if (err) console.log("updateRecords: ".red + err, err.stack); /* an error occurred */

    else     console.log("Value: ".green + JSON.stringify(data));           /* successful response */

  });

}
/////////////////////

exports.getCognitoID = getCognitoID;
exports.getCognitoSynToken = getCognitoSynToken;
exports.addRecord = addRecord;



  