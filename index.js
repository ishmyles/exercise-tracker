const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require("mongoose")
const User = require('./models/user')
const Log = require('./models/log')
const Exercise = require('./models/exercise')
const app = express()
const cors = require('cors')
require('dotenv').config()

mongoose.connect(process.env.DB_CONNECTION,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "))
db.once("open", () => console.log("Connected successfully"))

app.use(cors())
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get('/api/users', async (req, res) => {
  const allUsers = await User.find({});
  res.json(allUsers);
});

app.post('/api/users', async (req, res) => {
  const userName = req.body.username;
  const checkIfExistingUser = await User.find({username: userName});
  if (!checkIfExistingUser) return res.json({Error: "Username already exists"});
  
  const newUser = new User({username: userName});
  await newUser.save((err, data) => {
    if (!err) return res.json(data);
  });
});

app.post('/api/users/:_id/exercises', async (req, res) => {
  /*
  ORIGINAL SOLUTION ADDING TO USER SCHEMA
  console.log("POSTING EXERCISE DATA");
  const userId = req.params._id;
  const description = req.body.description;
  const duration = req.body.duration;
  const date = (req.body.date) ? new Date(req.body.date) : new Date()
  const user = await User.findById(userId);
  console.log(userId);
  console.log(user);
  console.log(description);
  console.log(duration);
  if (!user) return res.json({error: "Enter a valid user id"});
  if (!description) return res.json({error: "Description is required"});
  if (!duration) return res.json({error: "Duration is required"});

  const exercise = new Exercise({
    description: description,
    duration: parseInt(duration),
    date: date.toDateString()
  });
  await exercise.save(async (err, data) => {
    console.log("SAVING!!!!!!");
    if(err) {
      console.log("Error Msg", err)
    } else {
      console.log("EXERCISE DATA: " + data)
      user.log.push(data)
      await user.save((err, userData) => {
        console.log("USER DATA: " + userData)
      if (!err) return res.send({
        _id: userData._id,
        username: userData.username,
        description: userData.log[userData.log.length - 1].description,
        duration: userData.log[userData.log.length - 1].duration,
        date: userData.log[userData.log.length - 1].date
      });
    });
    }
  })*/
  const uId = req.params._id;
  const description = req.body.description;
  const duration = req.body.duration;
  const date = (req.body.date) ? new Date(req.body.date) : new Date()
  const user = await User.findById(uId);

  if (!user) return res.json({error: "Enter a valid user id"});
  if (!description) return res.json({error: "Description is required"});
  if (!duration) return res.json({error: "Duration is required"});

  const exercise = new Exercise({
    description: description,
    duration: parseInt(duration),
    date: date.toDateString()
  });

  await exercise.save(async (err, data) => {
    if(err) {
      console.log("Error Msg", err)
    } else {
      const newExercise = data._id;

      const existingLog = await Log.findOne({userId: uId});
      if (!existingLog) {
        const newLog = new Log({
          userId: uId,
          log: [newExercise]
        });
        await newLog.save((err, logData) => {
          if (err) return res.json({error: "Could not save new exercise"});
        });
      } else {
        existingLog.log.push(newExercise)
        await existingLog.save((err, logData) => {
          if (err) return res.json({error: "Could not save new exercise"});
        })
      }
      res.json ({
          _id: user._id,
          username: user.username,
          description: data.description,
          duration: data.duration,
          date: data.date
        });
    }
  })
});

app.get('/api/users/:_id/logs', async (req, res) => {
  const uId = req.params._id;

  if (Object.keys(req.query).length === 0) {
    const userLog = await Log.findOne({userId: uId})
      .populate('userId')
      .populate('log');

    if (!userLog) return res.json({error: "Enter a valid user id"});
    const logs = userLog.log.map(exercise => ({
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date
    }))
    const data = {
      _id: userLog.userId._id,
      username: userLog.userId.username,
      count: logs.length,
      log: logs,
    }
    return res.json(data);
  } else {
    // TODO
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
