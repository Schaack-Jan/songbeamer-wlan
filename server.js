const express = require('express')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const path = require('path')
const fs = require('fs')
const WebSocket = require('ws')

// Create a new instance of express
const app = express()

// Websocket Instance
const wss = new WebSocket.Server({port: 3030})

// Tell express to use the body-parser middleware and to not parse extended bodies
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(__dirname+'/public'))
app.use(fileUpload())

fs.mkdir(path.join(__dirname, 'files'),
	{ recursive: true }, (err) => {
		if (err) {
			return console.error(err);
		}
	}
);

app.get('/', function (req, res) {
	const file = __dirname + "/files/songbeamer.txt"
	res.sendFile(path.join(__dirname, 'resources/views/index.html'))
	fs.watch(file, () => {
		let fileContent = fs.readFileSync(file, 'utf-8').toString().split("\n")

		wss.clients.forEach(client => {
			client.send(JSON.stringify(fileContent));
		})
	})
})

app.get('/check', function (req, res) {
	res.status(200).send('OK')
})

app.post('/send', function (req, res) {
	if (!req.files) {
		return res.status(400).send("No files were uploaded")
	}
	const file = req.files.songbeamer
	const dir = __dirname + "/files/" + file.name

	if(fs.existsSync(dir)) {
		fs.unlinkSync(dir);
	}

	file.mv(dir, function (err) {
		if (err) {
			return res.status(500).send(err)
		}
		console.log("file uploaded")
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