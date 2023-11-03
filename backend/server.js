const path = require('path');
const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const port = process.env.PORT || 5000;
const app = express();
const http = require('http').Server(app);

const cors = require('cors');
app.use(cors());
const socketIO = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3000"
  }
});

socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
    socket.disconnect();
  });
});
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// const timetrackSeed = require('./seeds/timetrackSeed');

app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/timetrack', require('./routes/timetrackRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/employ', require('./routes/employRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

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

http.listen(port, () => console.log(`Server started on port ${port}`));
