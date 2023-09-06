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


// Post a new Spot

let validateNewSpot = [
  check('address').exists().withMessage("Street address is required"),
  check('address').notEmpty().withMessage("Street address is required"),
  check('city').exists().withMessage("City is required"),
  check('city').notEmpty().withMessage("City is required"),
  check('state').exists().withMessage("State is required"),
  check('state').notEmpty().withMessage("State is required"),
  check('country').exists().withMessage("Country is required"),
  check('country').notEmpty().withMessage("country is required"),
  check('lat').isNumeric().withMessage("Latitude is not valid"),
  check('lng').isNumeric().withMessage("Longitude is not valid"),
  check('name').exists().withMessage("name is required"),
  check('name').notEmpty().withMessage("name is required"),
  check('name').isLength({max: 49}).withMessage("name must be less than 50 characters"),
  check('description').exists().withMessage("Description is required"),
  check('description').notEmpty().withMessage("Description is required"),
  check('price').exists().withMessage("Price per day is required"),
  check('price').notEmpty().withMessage("Price per day is required"),
  handleValidationErrors]

router.post('/', requireAuth, validateNewSpot, async (req, res) => {

  let {
    ownerId,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price
  } = req.body

    let newSpot = await Spot.create({
    ownerId,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price
    })

    let {id,
      createdAt,
      updatedAt} = newSpot;

    res.status(201);
    res.send({
    id,
    ownerId,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
    createdAt,
    updatedAt
    })
})

// End of Post a new Spot

module.exports = router;
