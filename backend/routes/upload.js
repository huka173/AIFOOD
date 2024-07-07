const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const typesFile = ['image/jpg', 'image/jpeg'];

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (typesFile.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
}).single('photo');

router.post('/upload', upload, (req, res) => {
    if (req.file) {
        console.log('Photo upload ' + req.file.filename);
        console.log('Time: ' + new Date());

        const imagePath = path.join(__dirname, '../uploads', req.file.filename);
        
        const scriptPath = path.join(__dirname, '../AI/AI.py');
        const classesPath = path.join(__dirname, '../AI/classes.txt');
        const modelPath = path.join(__dirname, '../AI/model.pth');

        exec(`python3 ${scriptPath} ${imagePath} ${classesPath} ${modelPath}`, (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return res.status(500).json({ message: 'Error processing image' });
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);

            res.json({ message: req.file.filename, prediction: stdout.trim() });
        });
    } else {
        console.log('Error');
        console.log('Time: ' + new Date());
        res.status(500).json({ message: 'Error photo upload' + new Date() });
    }
});

module.exports = router;
