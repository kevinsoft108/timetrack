const mongoose = require('mongoose');
const Timetrack = require('../models/timetrackModel');

// Define the data to be seeded
const data = [
  {
    userid: '654476f78fbdbbf513668f14',
    detect_start: new Date('2023-11-03T06:00:00Z'),
    detect_end: new Date('2023-11-01T11:30:00Z'),
  },
  {
    userid: '654476f78fbdbbf513668f14',
    detect_start: new Date('2023-11-03T10:40:00Z'),
    detect_end: new Date('2023-11-01T12:20:00Z'),
  },
  {
    userid: '654476f78fbdbbf513668f14',
    detect_start: new Date('2023-11-03T12:25:00Z'),
    detect_end: new Date('2023-11-01T15:30:00Z'),
  },
  {
    userid: '654476f78fbdbbf513668f14',
    detect_start: new Date('2023-11-03T15:50:00Z'),
    detect_end: new Date('2023-11-01T16:00:00Z'),
  },
  {
    userid: '654476f78fbdbbf513668f14',
    detect_start: new Date('2023-11-03T16:40:00Z'),
    detect_end: new Date('2023-11-01T17:40:00Z'),
  },
  {
    userid: '654476f78fbdbbf513668f14',
    detect_start: new Date('2023-11-03T17:59:00Z'),
    detect_end: new Date('2023-11-01T21:50:00Z'),
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