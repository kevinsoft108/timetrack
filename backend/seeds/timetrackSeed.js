const mongoose = require('mongoose');
const Timetrack = require('../models/timetrackModel');

// Define the data to be seeded
const data = [
  {
    userid: '65469410e556ffd1bfac2155',
    detect_start: new Date('2023-11-06T06:42:49.690Z'),
    detect_end: new Date('2023-11-06T09:53:33.882Z'),
  },
  {
    userid: '65469410e556ffd1bfac2155',
    detect_start: new Date('2023-11-06T10:40:09.589Z'),
    detect_end: new Date('2023-11-06T11:42:49.690Z'),
  },
  {
    userid: '65469410e556ffd1bfac2155',
    detect_start: new Date('2023-11-06T12:12:46.161Z'),
    detect_end: new Date('2023-11-06T13:53:33.882Z')
  },
  {
    userid: '65469410e556ffd1bfac2155',
    detect_start: new Date('2023-11-06T14:12:46.161Z'),
    detect_end: new Date('2023-11-06T17:42:49.690Z')
  },
  {
    userid: '65469410e556ffd1bfac2155',
    detect_start: new Date('2023-11-06T15:38:23.011Z'),
    detect_end: new Date('2023-11-06T17:53:33.882Z')
  },
  {
    userid: '65469410e556ffd1bfac2155',
    detect_start: new Date('2023-11-06T16:12:46.161Z'),
    detect_end: new Date('2023-11-06T17:12:46.161Z'),
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