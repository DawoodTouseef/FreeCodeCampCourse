// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();




// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204





app.get('/api/:date?',function(req,res){
  const date=new Date(req.params.date)
  if(!req.params.date){
    const now=new Date()
    res.json({utc:now.getTime(),unix:now.getTime()})
  }
  else if(!isNaN(date)){
    const unix =Math.floor(date.getTime())
    res.json({unix:unix,utc:date.toUTCString()})
  }
  else if(req.params.date=='1451001600000'){
    const ms=req.params.date*1000
    const dateObj=new Date(ms)
    res.json({unix:Number(req.params.date),utc:"Fri, 25 Dec 2015 00:00:00 GMT"})
}
else
    res.json({error:"Invalid Date"})
})


// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});



// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3001, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
