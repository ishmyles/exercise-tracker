const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require("mongoose")
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





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
