const express = require('express')
const router = express.Router()

const Employ = require('../models/employModel')


router.get("/get-employ", (req, res) => {
  try {
    var query = {};
    if (req.query && req.query.search) {
      query["$or"] = [];
      query["$or"].push({
        username: { $regex: req.query.search, $options: 'i' }
      });
      query["$or"].push({
        email: { $regex: req.query.search, $options: 'i' }
      });
    }
    var perPage = 5;
    var page = req.query.page || 1;
    Employ.find(query, {})
      .skip((perPage * page) - perPage).limit(perPage)
      .then((data) => {
        Employ.find(query).count()
          .then((count) => {

            if (data && data.length > 0) {
              res.status(200).json({
                status: true,
                title: 'User retrived.',
                users: data,
                current_page: page,
                total: count,
                pages: Math.ceil(count / perPage),
              });
            } else {
              res.status(400).json({
                errorMessage: 'There is no user!',
                status: false
              });
            }

          });

      }).catch(err => {
        res.status(400).json({
          errorMessage: err.message || err,
          status: false
        });
      });
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }

});

/* Api to add User */
router.post("/add-employ", (req, res) => {
  try {
    // if (req.body && req.body.email && req.body.username && req.body.password && req.body.confirm_password)
    if (req.body && req.body.email && req.body.username) {
      let new_user = new Employ();
      new_user.username = req.body.username;
      new_user.email = req.body.email;
      new_user.password = req.body.password;
      new_user.confirm_password = req.body.confirm_password;
      // new_user.face = req.body.face;

      if (req.body.password != req.body.confirm_password) {
        res.status(200).json({
          status: true,
          title: 'Password does not match.'
        });
      } else {
        Employ.find({ email: req.body.email }, (err, data) => {
          if (data.length == 0) {
            new_user.save((err, data) => {
              if (err) {
                res.status(400).json({
                  errorMessage: err,
                  status: false
                });
              } else {
                res.status(200).json({
                  status: true,
                  title: 'User Added successfully.'
                });
              }
            });
          } else {
            res.status(400).json({
              errorMessage: `Email ${req.body.email} Already Exist!`,
              status: false
            });
          }
        });
      }
    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

/* Api to update User */
router.post("/update-employ", (req, res) => {
  try {
    // if (req.body && req.body.username && req.body.email && req.body.password &&
    //   req.body.id && req.body.confirm_password)
    if (req.body && req.body.username && req.body.email && req.body.id) {

      if (req.body.password != req.body.confirm_password) {
        res.status(200).json({
          status: true,
          title: 'Password does not match.'
        });
      } else {
        const add = Employ.findById(req.body.id, (err, new_user) => {
          if (req.body.username) {
            new_user.username = req.body.username;
          }
          if (req.body.email) {
            new_user.email = req.body.email;
          }
          if (req.body.password) {
            new_user.password = req.body.password;
          }
          if (req.body.confirm_password) {
            new_user.confirm_password = req.body.confirm_password;
          }
          new_user.save((err, data) => {
            if (err) {
              res.status(400).json({
                errorMessage: err,
                status: false
              });
            } else {
              res.status(200).json({
                status: true,
                title: 'User updated.'
              });
            }
          });
        });
      }
    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

/* Api to delete User */
router.post("/delete-employ", (req, res) => {
  try {
    if (req.body && req.body.id) {
      Employ.findByIdAndRemove(req.body.id, (err, deletedUser) => {
        if (deletedUser) {
          return res.status(200).json({ title: 'User deleted successfully', status: true, deletedUser });
        } else {
          return res.status(404).json({ errorMessage: 'User not found', status: false });
        }
      });
    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      exMessage: e.message,
      status: false
    });
  }
});

module.exports = router