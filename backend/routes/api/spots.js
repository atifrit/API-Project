const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Get all spots

  router.get('/', async (req, res) => {
    let spots = await Spot.findAll({include: [
      {model:Review},
      {model:SpotImage}
    ]});

    let spotsPOJOs = spots.map(spot => spot.toJSON());

    console.log(spotsPOJOs);
    spotsPOJOs.map(spot => {
      let reviews = spot.Reviews;
      let count = reviews.length;
      let starCount = 0;
      for(let el of reviews) {
        starCount += el.stars;
      }

      spot.avgRating = starCount/count;
      delete spot.Reviews;
    })


    spotsPOJOs.map(spot => {
      let spotImages = spot.SpotImages;
      let previewImage = null;
      for(let el of spotImages) {
        if(el.preview == true) {
          previewImage = el.url;
        }
      }

      spot.preview = previewImage;
      delete spot.SpotImages;
    })

    res.send(spotsPOJOs);
  });

// End of Get all spots






module.exports = router;
