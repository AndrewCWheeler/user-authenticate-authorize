const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 8000;
require('dotenv').config();
require('./server/config/mongoose.config');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

require('./server/routes/user.routes')(app);

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
