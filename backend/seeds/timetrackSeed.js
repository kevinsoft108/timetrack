const mongoose = require('mongoose');
const Timetrack = require('../models/timetrackModel');

// Define the data to be seeded
const data = [
  {
    userid: '654284925256ce5573ee923f',
    detect_start: new Date('2023-11-02T07:00:00Z'),
    detect_end: new Date('2023-11-02T10:30:00Z'),
  },
  {
    userid: '654284925256ce5573ee923f',
    detect_start: new Date('2023-11-02T10:40:00Z'),
    detect_end: new Date('2023-11-02T12:20:00Z'),
  },
  {
    userid: '654284925256ce5573ee923f',
    detect_start: new Date('2023-11-02T12:25:00Z'),
    detect_end: new Date('2023-11-02T15:30:00Z'),
  },
  {
    userid: '654284925256ce5573ee923f',
    detect_start: new Date('2023-11-02T15:50:00Z'),
    detect_end: new Date('2023-11-02T16:00:00Z'),
  },
  {
    userid: '654284925256ce5573ee923f',
    detect_start: new Date('2023-11-02T16:40:00Z'),
    detect_end: new Date('2023-11-02T17:40:00Z'),
  },
  {
    userid: '654284925256ce5573ee923f',
    detect_start: new Date('2023-11-02T17:59:00Z'),
    detect_end: new Date('2023-11-02T21:50:00Z'),
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