require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const parser=require('body-parser')
const dns=require('dns')
const mongoose=require('mongoose');
const { error } = require('console');


function isValidHttpUrl(string) {
  let url;
  
  try {
    url = new URL(string);
  } catch (_) {
    return false;  
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

mongoose.connect(process.env.MONGO_URI).then(()=>(
  console.log('connected successfully')
)).catch((err)=>(console.error(err)))

const urlschema=mongoose.Schema({
  original_url:String,
  short_url:mongoose.Types.ObjectId
})

const urlmodel=mongoose.model('url',urlschema,'url')

// Basic Configuration
const port = process.env.PORT || 3001;

app.use(cors());
app.use(parser())
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


app.post('/api/shorturl/',async (req,res)=>{
  const urls=await urlmodel.findOne({original_url:req.body.url})

  if(!isValidHttpUrl(req.body.url)){
    res.json({error:"invalid url"})
  }
  
  if(!urls){
    const newshort=new urlmodel({
      original_url:req.body.url,
      short_url:new mongoose.Types.ObjectId()
    })
    const done=await newshort.save()
    res.json({
      original_url:done.original_url,
      short_url:done.short_url
    })
  }else{
    res.json({
      original_url:urls.original_url,
      short_url:urls.short_url
    })
  }
  
})

app.get('/api/shorturl/:shorturl',async function(req,res){
  const urls=await urlmodel.findOne({short_url:req.params.shorturl})
  console.log(urls)
  res.redirect(urls.original_url)
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
