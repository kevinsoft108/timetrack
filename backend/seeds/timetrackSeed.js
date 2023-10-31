const mongoose = require('mongoose');
const Timetrack = require('../models/timetrackModel');

// Define the data to be seeded
const data = [
  {
    userid: 'user1',
    detect_start: new Date('2021-09-01T09:00:00Z'),
    detect_end: new Date('2021-09-01T10:30:00Z'),
    note: 'First detection'
  },
  {
    userid: 'user1',
    detect_start: new Date('2021-09-01T10:40:00Z'),
    detect_end: new Date('2021-09-01T12:20:00Z'),
    note: 'Second detection'
  },
  {
    userid: 'user1',
    detect_start: new Date('2021-09-01T12:25:00Z'),
    detect_end: new Date('2021-09-01T15:30:00Z'),
    note: 'First detection'
  },
  {
    userid: 'user1',
    detect_start: new Date('2021-09-01T15:50:00Z'),
    detect_end: new Date('2021-09-01T16:00:00Z'),
    note: 'Second detection'
  },
  {
    userid: 'user1',
    detect_start: new Date('2021-09-01T16:40:00Z'),
    detect_end: new Date('2021-09-01T17:40:00Z'),
    note: 'First detection'
  },
  {
    userid: 'user1',
    detect_start: new Date('2021-09-01T17:59:00Z'),
    detect_end: new Date('2021-09-01T18:50:00Z'),
    note: 'Second detection'
  }
];

// Seed the data
Timetrack.insertMany(data)
  .then(() => {
    console.log('Data seeded successfully');
    mongoose.disconnect();
  })
  .catch(error => {
    console.error('Error seeding data:', error);
    mongoose.disconnect();
  });