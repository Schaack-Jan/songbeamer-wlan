const express = require('express')
const bodyParser = require('body-parser')

// Create a new instance of express
const app = express()

// Tell express to use the body-parser middleware and to not parse extended bodies
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function (req, res) {
	res.send("Hello World");
})

app.get('/check', function (req, res) {
	console.log("Client connected");
	res.status(200).send('OK');
})

app.post('/send', function (req, res) {
  const body = req.body
  res.set('Content-Type', 'text/plain')
  console.log(body);
  res.send(`You sent: ${body} to Express`)
})

app.get('*', function (req, res) {
	res.status(404).send('Not found');
})

// Tell our app to listen on port 3000
app.listen(80, function (err) {
  if (err) {
    throw err
  }

  console.log('Server started on port 80')
})