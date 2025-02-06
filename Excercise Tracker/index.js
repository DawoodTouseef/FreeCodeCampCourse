const cors = require('cors')
const mongoose=require('mongoose')
const parser=require('body-parser')
require('dotenv').config()


const express = require('express')
const app = express()
mongoose.connect(process.env.MONGO_URI).then(
  ()=>(
    console.log('connected successfully')
  )
)


app.use(parser())
app.use(cors())
app.use(express.static('public'))


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const user=mongoose.Schema({
  username:String,
})

const exercise=mongoose.Schema({
  uid:mongoose.Types.ObjectId,
  description:String,
  duration:Number,
  date:Date,
})

const userModel=mongoose.model('user',user,'user')
const exerciseModel=mongoose.model('exercise',exercise,'exercise')


app.post('/api/users',async function(req,res){
  
  const newuser=new userModel({
    username:req.body.username
  })
  console.log(newuser)
  const done=await newuser.save()
  res.json({username:done.username,_id:done._id})
})




app.get('/api/users',async function(req,res){
  const doc=await userModel.find().select({__v:0})
  res.json(doc)
})

app.post('/api/users/:_id/exercises',async function(req,res){
    const user=await userModel.findById(req.params._id)
    if(!user){
      res.send("could not find user")
    }
    else{
      const obj=new exerciseModel({
        uid:user._id,
        description:req.body.description,
        duration:req.body.duration,
        date:req.body.date?new Date(req.body.date):new Date()

      })
      const done=await obj.save()
      res.json({
        _id:user._id,
        username:user.username,
        description:done.description,
        duration:done.duration,
        date:new Date(done.date).toDateString()
      })
  }
})



app.get('/api/users/:_id/logs',async function(req,res){
  const {from,to,limit}=req.query
  const user=await userModel.findById(req.params._id)
  if(!user){
    res.send("user not found")
    return 0;
  }
  let dateobj={}
  if(from){
    dateobj["$gte"]=new Date(from)
  }
  if(to){
    dateobj["$lte"]=new Date(to)
  }
  let filter={
    uid:req.params._id
  }
  if(from||to){
    filter.date=dateobj
  }
  const exercises=await exerciseModel.find(filter).limit(+limit ?? 500)

  const log=exercises.map(e=>({
  description:e.description,
  duration:e.duration,
  date:e.date.toDateString()
}))

  res.json({
    username:user.username,
    count:exercises.length,
    _id:user._id,
    log
  })

})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
