/*
  Purpose:  To post surveys to survey monkey
  Author: Zachary Anderson
*/
const http = require('http');

var sm_path = '/'
const token = "cR0ExVVlERoMYtEcozWnVPOQ9wsy3PLEP.qT2IwRmTrtYTSJ7PXU40y1UfNS5jXjyQn9132tTmdANYAkZqm8SbXV--r9JOK161yWSt2lGrLS5bF5Tv2oz0fEtdi1liYh";

const post_option = {
  host: 'https://developer.surveymonkey.com/api/v3/surveys',
  headers: {
    'Content-type': 'application/json',
    'Authorization': 'bearer ' + token
  },
  method: 'POST'
};

var deets = {
  "title":"myfirstsurvey"
}

callback = function(res){
  var str = '';
  res.on('data', fuction(chunk){
    str += chunk;
  });
  res.on('end',function(){
    console.log(`Data was returned! \n ${str}`)
  });

  var req = http.request(options, callback);
  req.write(deets);
  req.end();
}
