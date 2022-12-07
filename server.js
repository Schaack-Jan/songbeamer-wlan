const express = require('express')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const path = require('path')
const fs = require('fs')
const archiver = require('archiver')
const socket = require('socket.io')
const os = require('os')
const dotenv = require('dotenv')
const {arch} = require("os");

dotenv.config();
const PORT = process.env.PORT ? process.env.PORT : 80

function getLogTime() {
	date = new Date();
	time = date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate()
	time += " "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
	return "["+time+"] "
}

const nets = os.networkInterfaces()
let ip = null
switch (true) {
	case 'Ethernet' in nets:
		ip = nets['Ethernet']
		break
	case 'eth0' in nets:
		ip = nets['eth0']
		break
}
ip = ip[0].address

// Create a new instance of express
const app = express()
const server = app.listen(PORT, () => {
	console.log(`Listening on http://${ip} Port ${PORT}`)
	console.log(``)
})

// Websocket Instance
const io = socket(server)

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

const downloadFile = __dirname + '/watchSend.zip'
let output = fs.createWriteStream(downloadFile)
let archive = archiver('zip')

output.on('close', () => {
	console.log((archive.pointer() / 1024 / 1024).toFixed(2) + ' total megabytes')
	console.log('Archive has been generated and can be downloaded now.')
})

archive.pipe(output)
archive.directory(__dirname + '/watchSend', false)
archive.finalize()

const songbeamer = __dirname + "/files/songbeamer.txt"
let songtext = []

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'resources/views/index.html'))
})

app.get('/songtext', (req, res) => {
	if (songtext.length <= 0) {
		if (fs.existsSync(songbeamer)) {
			songtext = fs.readFileSync(songbeamer, 'utf-8').toString().split("\n")
		}
	}
	res.send({ songtext: songtext })
})

app.get('/check', (req, res) => {
	res.status(200).send('OK')
})

app.get('/info', (req, res) => {
	res.status(200).send('Server IP: '+ip)
})

app.get('/download', function (req, res) {
	res.download(downloadFile)
})

app.post('/send', (req, res) => {
	if (!req.files) {
		return res.status(400).send("No files were uploaded")
	}
	const file = req.files.songbeamer
	const filesize = file.data.length+" Bytes";
	songtext = file.data.toString('utf8').split("\n")

	if(fs.existsSync(songbeamer)) {
		fs.unlinkSync(songbeamer);
	}

	file.mv(songbeamer, function (err) {
		if (err) {
			return res.status(500).send(err)
		}

		io.sockets.emit('message', songtext)
		console.log(getLogTime()+"Songbeamer File uploaded, "+filesize)

		return res.status(200).send("OK")
	})
})

// Captive Portal trickery
	// Android
	app.get('/generate_204', (req, res) => {
		res.redirect(307, 'http://10.3.141.1')
	})

	// Apple
	app.get('/hotspot-detect.html', (req, res) => {
		res.redirect(307, 'http://10.3.141.1')
	})
	app.get('/library/test/success.html', (req, res) => {
		res.redirect(307, 'http://10.3.141.1')
	})

	// Windows
	app.get('/captiveportal/generate_204', (req, res) => {
		res.redirect(307, 'http://10.3.141.1')
	})

app.get('*', (req, res) => {
	res.status(404).send('Not found')
})
