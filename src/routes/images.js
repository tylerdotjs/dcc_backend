const express = require('express')
const passport = require('passport')
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const imageModel = require('../models/images')
const { default: contentSecurityPolicy } = require('helmet/dist/middlewares/content-security-policy')

const app = express.Router();

const temp = path.join(__dirname + '/../temp/')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, temp)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage })

app.post('/', upload.single('image'), passport.authenticate('session'), (req, res) => {
    if (!req.user) return res.sendStatus(401)
    fs.readFile(path.join(temp + req.file.filename), (err, img) => {
        var obj = {
            title: req.body.title,
            desc: req.body.desc,
            owner: req.user._id,
            img: {
                data: img,
                contentType: req.file.mimetype
            }
        }
        imageModel.create(obj)
            .then(data => {
                res.send(data._id)
            })
            .catch(err => res.status(500).send(err))
    })
})
app.get('/:id', (req, res) => {
    imageModel.findById(req.params.id)
        .then(data => {
            var img = data.img.data
            res.writeHead(200, {
                'Content-Type': data.img.contentType,
                'Content-Length': img.length
            })
            res.end(img)
        })
        .catch(err => res.status(500).send(err))
})
app.get('/:id/info', (req, res) => {
    imageModel.findById(req.params.id).select('-img')
        .then(data => res.send(data))
        .catch(err => res.status(500).send(err))
})
app.put('/:id/', passport.authenticate('session'), (req, res) => {
    if (!req.user) return res.sendStatus(401)
    imageModel.findById(req.params.id).select('-img')
        .then(data => {
            if(req.user._id.toString() == data.owner.toString() || req.user.roles.includes('admin')) {       
                return imageModel.update({_id: req.params.id}, req.body).getUpdate()
            } else {
                return Promise.reject('User does not own image')
            }
        })
        .then(data => res.send(data))
        .catch(err => res.status(500).send(err))

})
app.delete('/:id', passport.authenticate('session', (res, req) => {

}))
module.exports = app