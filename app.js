
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const app = express();
const axios=require('axios');
app.set('view engine', 'ejs');
var profileData;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
//console logging nmy linked in data through linked in api
const credentials = JSON.parse(fs.readFileSync('credential.json'));
const options = {
  hostname: 'api.linkedin.com',
  path: '/v2/me',
  method: 'GET',
  headers: {
    'Authorization': `Bearer AQXwPp0IsaWCXkHmo5G-Db08fHPzCN_C5O_3SmG6iG7blIqpThHcIh5z8ZyQXNtCu4-pe9X9bJFQhTuOjERgPWRsil1BllOIOVUcqWh1l5PGV4eL08qli0GqYroZfpQ_YlelVsLGjlGKwZhUMRNYRswMopkj62ivOc3rtpjeX58bqyB4JS9LAFvlkvA9CcspHclHG2q2Sjgs0eqMiA4dIMgwWz2jIZytrQqPTBPiV9Bn-7ODVFnXUMJziMWI5g1TMu73CT1SgK8fB7D-ViJdIyk1pQLSTQcKFV4M09Noeg8ax-7IaPLg6ah6pjjh-Y8a9rlEkXdMEhKuYtTdYchjf_RCdqj1Ow`,
    'cache-control': 'no-cache',
    'X-Restli-Protocol-Version': '2.0.0',
  },
};

  
app.get('/', function (request, response) {
  
 
  const req = https.request(options, (res) => {
   
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
     
       profileData = JSON.parse(data);

console.log(profileData);
    });
  });

  req.on('error', (error) => {
    console.error(error);
    response.status(500).send('Internal Server Error');
  });
response.sendFile(__dirname+"/index.html")
  req.end();
});
app.post("/",function(req,res){
    const firstname=req.body.fname;
   const lastname=req.body.lname;
    const emailadddress=req.body.email;
    
  const data=
  {
   members:[
     {
        email_address: emailadddress,
        status: "subscribed",
        merge_fields: {
            FNAME: firstname,
            LNAME: lastname,

        }

    }
  ]
};
app.post("/failure",function(request,response){
    response.redirect("/");
});
const jsonDATA=JSON.stringify(data);
const url="https://us21.api.mailchimp.com/3.0/lists/941bc8bf68" 
const options={
    method: "Post",
    auth:"aady:7d24b607273056dd0ea5df1386794b9a-us21"
}

const request= https.request(url, options, function(response){

    if(response.statusCode==200){
        res.sendFile(__dirname+"/success.html");
    }
    else{
        res.sendFile(__dirname+"/failure.html");
    }
  response.on("data",function(data){
    console.log(JSON.parse(data));
  }) 

})

request.write(jsonDATA);
request.end();
});



app.listen(5173, function () {
  console.log('Listening to port 5173');
});
