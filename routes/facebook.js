var express = require('express');
var router = express.Router();

var Facebook = require('facebook-node-sdk');

var facebook = new Facebook({ appID: '983767111705365', secret: 'c9b5f6a5f51b44d4cd89df22f4241e56' });

facebook.api('/me', function(err, data) {
  console.log(data); // => { id: ... }
  router.get('/', function(req, res, next) {
			  res.send(data);
			});
  
});




module.exports = router;