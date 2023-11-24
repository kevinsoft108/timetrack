const path = require('path');
const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const port = process.env.PORT || 5000;
const app = express();
const server = require('http').createServer(app);
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Employ = require('./models/employModel');
const io = require('socket.io')(server);
const cors = require('cors');
const callBack = require('./middleware/callback')
app.use(cors());
const adminSeed = require('./seeds/adminSeed')
const formatDateString = require('./config/formatDate')
const socketIO = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
});
const apiNamespace = socketIO.of('/api');
apiNamespace.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
})

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


if (process.env.SEED_ADMIN == 'true') {
  adminSeed()
}

setInterval(function () {
  callBack()
}, 10000)


// const timetrackSeed = require('./seeds/timetrackSeed');

app.use('/api/timetrack', require('./routes/timetrackRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/employ', require('./routes/employRoutes'));


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}
app.post('/api/users/', async (req, res) => {
  const { name, email, password, image } = req.body
  if (!name || !email || !password || !image) {
    res.status(400).json('Please add all fields')
  }
  // Check if user exists
  const employExists = await Employ.findOne({ email: email, username: name })
  if (employExists) {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    employExists.password = hashedPassword;
    employExists.face = image;
    employExists.save()
    let user = employExists;
    if (user) {
      apiNamespace.emit('avatarUpdate', name);
      res.status(201).json({
        _id: user.id,
        name: user.username,
        email: user.email,
        image: user.face,
        token: generateToken(user._id)
      })
    } else {
      res.status(400)
      // throw new Error('Invalid user data')
      res.json('Invalid user data')
    }
  }
  else {
    res.status(400)
    // throw new Error('User already exists')
    res.json('User already exists')
  }
})
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body

  // Check for user email
  const user = await Employ.findOne({ email })
  if (user) {
    saveImg = user.image;
  }

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.username,
      email: user.email,
      token: generateToken(user._id),
      image: user.face
    });
  }
  else {
    res.status(400)
    // throw new Error('Invalid credentials')
    res.json('Invalid credentials')
  }
})

// Serve frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
    )
  );
} else {
  app.get('/', (req, res) => res.send('Please set to production'));
}

app.use(errorHandler);

server.listen(port, () => console.log(`Server started on port ${port}`));
