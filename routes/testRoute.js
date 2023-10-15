const express = require('express');
const {
  testController,
  postController,
} = require('../controllers/testController');

const route = express.Router();

route.get('/', testController).post('/', postController);

module.exports = route;
