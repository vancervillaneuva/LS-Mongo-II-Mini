const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Person = require('./models.js');

const port = process.env.PORT || 3000;

const app = express();

// error status code constants
const STATUS_SERVER_ERROR = 500;
const STATUS_USER_ERROR = 422;

app.use(bodyParser.json());

// Your API will be built out here.

// regular get
app.get('/users', (req, res) => {
	Person.find({}, (err, data) => {
        if(err) throw err;
        res.json(data);
  });
});

// get with order
app.get('/users/:direction', (req, res) => {
	const { id } = req.params; //? query string

	Person.aggregate([{$sort:{"firstName":1}}], (err, user) => {
        if (err) throw err;
          res.json(user);
	});
});


// get by id
app.get('/user-get-friends/:id', (req, res) => {
	const { id } = req.params; //? query string

	Person.findById(id, (err, user) => {
        if (err) throw err;
          res.json(user);
	});
});




mongoose.Promise = global.Promise;
const connect = mongoose.connect(
  'mongodb://localhost/people',
  { useMongoClient: true }
);
/* eslint no-console: 0 */
connect.then(() => {
  app.listen(port);
  console.log(`Server Listening on ${port}`);
}, (err) => {
  console.log('\n************************');
  console.log("ERROR: Couldn't connect to MongoDB. Do you have it running?");
  console.log('************************\n');
});
