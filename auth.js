const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validateUser } = require('./utils');

const router = express.Router();

router.post('/register', async (req, res) => {

});

router.post('/login', async (req, res) => {

});

module.exports = router;
