const express = require('express');
const multer  = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads');
    },
    filename(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const typesFile = ['image/png', 'image/jpg', 'image/jpeg'];

const upload = multer({ storage: storage, fileFilter: (req, file, cb) => {
    if(typesFile.includes(file.mimetype)) {
        cb(null, true);
    } 
    else {
        cb(null, false);
    }
} }).single('photo');

router.post('/upload', upload, (req, res) => {
    if(req.file) {
        console.log('Photo upload ' + req.file.filename);
        console.log('Time: ' + new Date());
        res.json({ message: req.file.filename });
    } 
    else {
        console.log('Error');
        console.log('Time: ' + new Date());
        res.status(500).json({ message: 'Error photo upload' + new Date()});
    }
});

module.exports = router;