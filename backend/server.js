const express = require('express');
const path = require('path');
const getRouters = require('./routes/get');
const uploadRouters = require('./routes/upload');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, '../client')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(getRouters);
app.use(uploadRouters);

app.listen(PORT, () => {
    console.log('server start ' + Date.now());
});