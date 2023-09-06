const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

  router.get('/', async (req, res) => {
    let spots = await Spot.findAll({include: [
      { model:Review,
        attributes:['stars']
      }
    ]});

    res.send(spots);
  })

module.exports = router;
