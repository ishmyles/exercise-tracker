const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require("mongoose")
const User = require('./models/user')
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
  const newUser = new User({username: req.body.username});
  const savedUser = await newUser.save();
  res.json(savedUser);
});



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
