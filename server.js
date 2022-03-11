const express = require('express')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const path = require('path')
const fs = require('fs')

// Create a new instance of express
const app = express()

// Tell express to use the body-parser middleware and to not parse extended bodies
app.use(bodyParser.urlencoded({ extended: false }))
app.use(fileUpload())

fs.mkdir(path.join(__dirname, 'files'),
	{ recursive: true }, (err) => {
		if (err) {
			return console.error(err);
		}
	}
);

app.get('/', function (req, res) {
	res.send("Hello World");
	console.log(__dirname);
})

app.get('/check', function (req, res) {
	console.log("Client connected");
	res.status(200).send('OK');
})

app.post('/send', function (req, res) {
	if (!req.files) {
		return res.status(400).send("No files were uploaded")
	}
	const file = req.files.songbeamer
	const path = __dirname + "/files/" + file.name
	const allowedExtension = ['.txt']
	
	file.mv(path, (err) => {
		if (err) {
			console.log(err)
			return res.send(500).send(err)
		}
		return res.status(200)
	})
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