const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {

  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us18.api.mailchimp.com/3.0/lists/0e648f0225";
  const options = {
    method: "post",
    auth: "harsh:01f0e359399128518594a73c4aa382b9-us18"
  }

  const request = https.request(url, options, function (response) {
    
    if(response.statusCode === 200) {
      res.sendFile(__dirname + "/sucess.html");
    } else {
      res.send(__dirname + "/failure.html");
    }
    
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  })
  request.write(jsonData);
  request.end();

})

app.listen(process.env.PORT || 3000, function (req, res) {
  console.log("Server set up at port 3000.");
});


// Mailchimp auth ID : 01f0e359399128518594a73c4aa382b9-us18
// udiance ID : 0e648f0225

