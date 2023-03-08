const express = require('express')
const cors = require('cors')
const upload = require('express-fileupload')
const fs = require('fs')
const path = require('path')

const app = express()
app.use(cors({ origin: 'http://localhost:3000' }))
app.use(upload())

app.get('/file/user/:userEmail', (req, res) => {
	const userDir = path.join(__dirname, 'uploads', req.params.userEmail)

	if (!fs.existsSync(userDir)) return res.status(200).json({ files: [] })

	const data = fs.readdirSync(userDir)
	res.status(200).json({ files: data })
})

app.post('/file', (req, res) => {
	if (req.files?.file && req.body.user) {
		const file = req.files.file
		const fileLocation = `${ __dirname }/uploads/${ req.body.user }/${ file.name }`

		if (!fs.existsSync(path.dirname(fileLocation))) fs.mkdirSync(path.dirname(fileLocation))
		if (fs.existsSync(fileLocation)) return res.status(400).json({ message: 'File already exists!' })

		file.mv(fileLocation, (err) => {
			if (!err) res.status(200).json({ message: 'File upload successful!' })
			else {
				res.status(500).json({ message: String(err) })
			}
		})
	} else {
		res.status(400).json({ message: 'Sent information is inappropriate!' })
	}
})

app.get('/file/download/:userEmail/:filename', (req, res) => {
	const userEmail = req.params.userEmail
	const filename = req.params.filename
	const filePath = path.join(__dirname, 'uploads', userEmail, filename)

	if (!fs.existsSync(filePath)) return res.status(400).json({ message: 'Error! No such file exists!' })

	res.status(200).download(filePath)
})

app.get('/', (_req, res) => {
	res.status(200).json({ message: 'hello world' })
})

app.listen(5000, () => console.log('Server started listening'))