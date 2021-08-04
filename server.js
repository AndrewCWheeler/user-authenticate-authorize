const express = require('express');
const session = require('express-session');
const cors = require('cors');
const app = express();
const PORT = 8000;
const cookieParser = require('cookie-parser');
const ONE_WEEK = 1000 * 60 * 60 * 24 * 7;

require('dotenv').config();
require('./server/config/mongoose.config');

const IN_PROD = process.env.NODE_ENV === 'production';

app.use(
  session({
    name: process.env.SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESS_SECRET,
    cookie: {
      maxAge: ONE_WEEK,
      // sameSite: false,
      secure: false,
    },
  })
);

app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./server/routes/user.routes')(app);
require('./server/routes/auth.routes')(app);

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
