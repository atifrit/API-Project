const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

function averageStarCount(spotsArr) {
  spotsArr.map(spot => {
    let reviews = spot.Reviews;
    let count = reviews.length;
    let starCount = 0;
    for(let el of reviews) {
      starCount += el.stars;
    }

    spot.avgRating = starCount/count;
    delete spot.Reviews;
  })
};

function getPreviewImage(spotsArr) {
  spotsArr.map(spot => {
    let spotImages = spot.SpotImages;
    let previewImage = null;
    for(let el of spotImages) {
      if(el.preview == true) {
        previewImage = el.url;
      }
    }

    spot.previewImage = previewImage;
    delete spot.SpotImages;
  })
}

// Get all spots

  router.get('/', async (req, res) => {
    let spots = await Spot.findAll({include: [
      {model:Review},
      {model:SpotImage}
    ]});

    let spotsPOJOs = spots.map(spot => spot.toJSON());

    averageStarCount(spotsPOJOs);
    getPreviewImage(spotsPOJOs);

    res.send({"Spots":spotsPOJOs});
  });

// End of Get all spots

// Get All spots owned by current user

router.get('/current', requireAuth, async (req, res) => {
  let spots = await Spot.findAll({
    where:{ownerId:req.user.id},
    include: [
    {model:Review},
    {model:SpotImage}
  ]
});

  let spotsPOJOs = spots.map(spot => spot.toJSON());

  averageStarCount(spotsPOJOs);
  getPreviewImage(spotsPOJOs);

  res.send({"Spots":spotsPOJOs});
});

//End of Get All spots owned by current user

// Get spot info by Id

router.get('/:spotId', async (req, res) => {
  let spot = await Spot.findByPk(req.params.spotId, {
    include: [
    {model:Review},
    {model:SpotImage,
    attributes:{exclude:['spotId','createdAt', 'updatedAt']}},
    {model:User,
    as: "Owner",
    attributes:{exclude:['username',"hashedPassword", "email", "createdAt", "updatedAt"]}}
  ]
});

if(!spot) {
  res.status(404);
  return res.send({
    "message": "Spot couldn't be found"
  });
}

  let spotPOJO = spot.toJSON();

  let reviews = spotPOJO.Reviews;
    let count = reviews.length;
    let starCount = 0;
    for(let el of reviews) {
      starCount += el.stars;
    }

    spotPOJO.avgRating = starCount/count;
    spotPOJO.numReviews = count;
    delete spotPOJO.Reviews;


  res.send(spotPOJO);
});

// End of get spot info by id

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
 let ownerId = req.user.id;
  let {
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

// Add an Image to a Spot

spotImageValidator = [
  handleValidationErrors]


router.post('/:spotId/images', requireAuth, async (req, res) => {
  let spotId = Number(req.params.spotId);
  console.log(spotId);
  let {url, preview} = req.body;

  let spot = await Spot.findByPk(spotId);

  if(spot.ownerId !== req.user.id) {
    res.status(403);
    return res.send({
      "message": "Forbidden"
    })
  }

  if(!spot) {
    res.status(404);
    return res.send(
      {
        "message": "Spot couldn't be found"
      }
    )
  }

  let newSpotImage = await SpotImage.create(
    {
      spotId,
      url,
      preview
    }
  )

    res.send(
      {
        id:newSpotImage.id,
        url,
        preview
      }
    );

})

// End of Add an Image to a Spot

// Edit a Spot



// End of Edit a Spot


module.exports = router;
