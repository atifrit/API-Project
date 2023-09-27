const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, ReviewImage, Booking } = require('../../db/models');

const { check, body } = require('express-validator');
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

function reformatDate (date) {
  let newDate = new Date(date.toUTCString()).toLocaleDateString('en-US', {
    timeZone: 'UTC',
  }).replace(/\//g, '-');
  return newDate;
}

// Get all spots

spotQueryValidator = [
  check('page').custom(async (value, {req}) => {
    if(req.query.page < 1) {
      throw new Error("Page must be greater than or equal to 1");
    }
  }),
  check('size').custom(async (value, {req}) => {
    if(req.query.size < 1) {
      throw new Error("Size must be greater than or equal to 1");
    }
  }),
  check('maxLat').custom(async (value, {req}) => {
    if (!req.query.maxLat) return true;
    if(isNaN(req.query.maxLat)) {
      throw new Error("Maximum latitude is invalid");
    }
    return true
  }),
  check('minLat').custom(async (value, {req}) => {
    if (!req.query.minLat) return true;
    if(isNaN(req.query.minLat)) {
      throw new Error("Minimum latitude is invalid");
    }
  }),
  check('maxLng').custom(async (value, {req}) => {
    if (!req.query.maxLng) return true;
    if(isNaN(req.query.maxLng)) {
      throw new Error("Maximum longitude is invalid");
    }
  }),
  check('minLng').custom(async (value, {req}) => {
    if (!req.query.minLng) return true;
    if(isNaN(req.query.minLng)) {
      throw new Error("Minimum longitude is invalid");
    }
  }),
  check('minPrice').custom(async (value, {req}) => {
    if (!req.query.minPrice) return true;
    if(isNaN(req.query.minPrice) || Number(req.query.minPrice) < 0) {
      throw new Error("Minimum price must be greater than or equal to 0");
    }
  }),
  check('maxPrice').custom(async (value, {req}) => {
    if (!req.query.maxPrice) return true;
    if(isNaN(req.query.maxPrice) || Number(req.query.maxPrice) < 0) {
      throw new Error("Maximum price must be greater than or equal to 0");
    }
  }),
  handleValidationErrors
]
const { Op } = require("sequelize");

  router.get('/', spotQueryValidator, async (req, res) => {

    let queryObj = {};

    let{size, page, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query;

    if(minLat) {
      queryObj.lat = {[Op.gte]:minLat};
    }

    if(maxLat) {
      queryObj.lat = {[Op.lte]:maxLat};
    }

    if(minLat && maxLat){
      queryObj.lat = {[Op.gte]:minLat, [Op.lte]:maxLat};
    }

    if(minLng) {
      queryObj.lng = {[Op.gte]:minLng};
    }

    if(maxLng) {
      queryObj.lng = {[Op.lte]:maxLng};
    }

    if(minLng && maxLng){
      queryObj.lng = {[Op.gte]:minLng, [Op.lte]:maxLng};
    }



    if(minPrice) {
      queryObj.price = {[Op.gte]:minPrice};
    }

    if(maxPrice) {
      queryObj.price = {[Op.lte]:maxPrice};
    }

    if(minPrice && maxPrice){
      queryObj.price = {[Op.gte]:minPrice, [Op.lte]:maxPrice};
    }

    if(!size || size > 20) {
      size = 20;
    }

    if(!page) {
      page = 1;
    }

    if(page > 10) {
      page = 10;
    }

    let spots = await Spot.findAll({where:queryObj ,include: [
      {model:Review},
      {model:SpotImage}
    ], limit: size, offset: (size*(page-1))});

    let spotsPOJOs = spots.map(spot => spot.toJSON());

    averageStarCount(spotsPOJOs);
    getPreviewImage(spotsPOJOs);

    res.send({"Spots":spotsPOJOs, page, size});
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
  check('description').isLength({min: 30}).withMessage("Description must be at least 30 characters"),
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


router.post('/:spotId/images', requireAuth, async (req, res) => {
  let spotId = Number(req.params.spotId);
  let {url, preview} = req.body;

  let spot = await Spot.findByPk(spotId);

  if(!spot) {
    res.status(404);
    return res.send(
      {
        "message": "Spot couldn't be found"
      }
    )
  }

  if(spot.ownerId !== req.user.id) {
    res.status(403);
    return res.send({
      "message": "Forbidden"
    })
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

router.put('/:spotId', requireAuth, validateNewSpot, async (req, res) => {

  let spotId = Number(req.params.spotId);
  let {address, city, state, country, lat, lng, name, description, price} = req.body;

  let spot = await Spot.findByPk(spotId);

  if(!spot) {
    res.status(404);
    return res.send(
      {
        "message": "Spot couldn't be found"
      }
    )
  }

  if(spot.ownerId !== req.user.id) {
    res.status(403);
    return res.send({
      "message": "Forbidden"
    })
  }


  spot.address = address;
  spot.city = city;
  spot.state = state;
  spot.country = country;
  spot.lat = lat;
  spot.lng = lng;
  spot.name = name;
  spot.description = description;
  spot.price = price;

  await spot.save();

  res.send(spot);

})

// End of Edit a Spot


// Delete a Spot

router.delete('/:spotId', requireAuth, async (req, res) => {

  let spotId = Number(req.params.spotId);

  let spot = await Spot.findByPk(spotId);

  if(!spot) {
    res.status(404);
    return res.send(
      {
        "message": "Spot couldn't be found"
      }
    )
  }

  if(spot.ownerId !== req.user.id) {
    res.status(403);
    return res.send({
      "message": "Forbidden"
    })
  }

  await spot.destroy();

  res.send({
    "message": "Successfully deleted"
  })

})

// End of Delete a Spot

// Get all reviews for a spot by id

router.get('/:spotId/reviews', async (req, res) => {
  let Id = Number(req.params.spotId);

  let spot = await Spot.findByPk(Id);

  if(!spot) {
      res.status(404);
      return res.send({
          "message": "Spot couldn't be found"
        });
  }

  let reviews = await Review.findAll(
      {
          where:{spotId:Id},
          include:[
            {model:User, attributes:{exclude:['username',"hashedPassword", "email", "createdAt", "updatedAt"]}},
              {model: ReviewImage, attributes:{exclude:['createdAt', 'updatedAt', 'reviewId']}}
          ]
  })


  res.send({"Reviews":reviews});
});

// End of Get all reviews for a spot by id


// Post a new review to a spot by ID

reviewValidator = [
  check('review').exists().withMessage("Review text is required"),
  check('review').notEmpty().withMessage("Review text is required"),
  check('stars').exists().withMessage("Stars must be an integer from 1 to 5"),
  check('stars').isInt({min:1, max: 5}).withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors
]


router.post('/:spotId/reviews', requireAuth, reviewValidator, async (req, res) => {

  let spotId = Number(req.params.spotId);

  let spot = await Spot.findByPk(spotId);

  if(!spot) {
    res.status(404);
    return res.send({
      "message": "Spot couldn't be found"
    });
  }

  let userId = req.user.id;

  let queriedUser = await User.findByPk(userId, {include:{model:Review}});

  let user = queriedUser.toJSON();


  for(let el of user.Reviews) {
    if(el.spotId === spotId) {
      res.status(403);
      return res.send({
        "message": "User already has a review for this spot"
      });
    }
  }

  let {review, stars} = req.body;

  let newReview = await Review.create({
    userId,
    spotId,
    review,
    stars
  });

  res.status(201);
  res.send(newReview);

});

// End of Post a new review to a spot by ID


// Get all bookings for a spot by Id




router.get('/:spotId/bookings', requireAuth, async (req, res) => {
  let Id = Number(req.params.spotId);

  let spot = await Spot.findByPk(Id);

  if(!spot) {
      res.status(404);
      return res.send({
          "message": "Spot couldn't be found"
        });
  }

  let bookings;
  if(req.user.id == spot.ownerId) {
    bookings = await Booking.findAll(
      {
          where: {spotId:Id},
          include: {model:User, attributes:{exclude:['username',"hashedPassword", "email", "createdAt", "updatedAt"]}},
  })
  } else {
    bookings = await Booking.findAll(
      {
          where:{spotId:Id},
          attributes:{exclude:['createdAt', 'updatedAt', 'id', 'userId']}
  })

  }


  let bookingsPOJOs = bookings.map(booking => booking.toJSON());


  for(let el of bookingsPOJOs) {
    let updatedStartDate = reformatDate(el.startDate);
    let updatedEndDate = reformatDate(el.endDate);

    el.startDate = updatedStartDate;
    el.endDate = updatedEndDate;
  }


  res.send({"Bookings":bookingsPOJOs});
});

// End of get all bookings for a spot by Id


// Create a new booking by Spot Id

bookingValidator = [
  check('endDate').custom(async (endDate, {req}) => {
    let comparisonEnd = new Date(endDate).getTime();
    let comparisonStart = new Date(req.body.startDate).getTime();
    if(comparisonStart >= comparisonEnd) {
      throw new Error("endDate cannot be on or before startDate");
    }
    return true;
  }),
  // check('startDate').custom(async (startDate, {req}) => {
  //   let bookings = await Booking.findAll({where:{spotId:Number(req.params.spotId)}});
  //   let bookingsPOJOs = bookings.map(booking => booking.toJSON());
  //   let comparisonStart = new Date(startDate).getTime();
  //   for(let el of bookingsPOJOs) {
  //     if(comparisonStart >= new Date(el.startDate).getTime() && comparisonStart <= new Date(el.endDate).getTime()) {
  //       throw new Error("Start date conflicts with an existing booking")
  //     }
  //   }
  //   return true;

  // }),
  // check('endDate').custom(async (endDate, {req}) => {
  //   let bookings = await Booking.findAll({where:{spotId:Number(req.params.spotId)}});
  //   let bookingsPOJOs = bookings.map(booking => booking.toJSON());
  //   let comparisonEnd = new Date(endDate).getTime();
  //   for(let el of bookingsPOJOs) {
  //     if(comparisonEnd <= new Date(el.endDate).getTime() && comparisonEnd >= new Date(el.startDate).getTime()) {
  //       throw new Error("End date conflicts with an existing booking")
  //     }
  //   }
  //   return true;

  // }),



  // check('startDate').custom(async (startDate, {req}) => {
  //   let bookings = await Booking.findAll({where:{spotId:Number(req.params.spotId)}});
  //   let bookingsPOJOs = bookings.map(booking => booking.toJSON());
  //   let comparisonStart = new Date(startDate).getTime();
  //   let comparisonEnd = new Date(req.body.endDate).getTime();
  //   for(let el of bookingsPOJOs) {
  //     if(comparisonStart <= new Date(el.startDate).getTime() && comparisonEnd >= new Date(el.endDate).getTime()) {
  //       throw new Error("Start date conflicts with an existing booking", {statusCode: 403})
  //     }
  //   }
  //   return true;

  // }),
  // check('endDate').custom(async (endDate, {req}) => {
  //   let bookings = await Booking.findAll({where:{spotId:Number(req.params.spotId)}});
  //   let bookingsPOJOs = bookings.map(booking => booking.toJSON());
  //   let comparisonEnd = new Date(endDate).getTime();
  //   let comparisonStart = new Date(req.body.startDate).getTime();
  //   for(let el of bookingsPOJOs) {
  //     if(comparisonStart <= new Date(el.startDate).getTime() && comparisonEnd >= new Date(el.endDate).getTime()) {
  //       throw new Error("End date conflicts with an existing booking", {statusCode: 403})
  //     }
  //   }
  //   return true;

  // }),
  handleValidationErrors
]

router.post('/:spotId/bookings', requireAuth, bookingValidator, async (req, res) => {
  let Id = Number(req.params.spotId);

  let spot = await Spot.findByPk(Id);

  if(!spot) {
      res.status(404);
      return res.send({
          "message": "Spot couldn't be found"
        });
  }

  if(spot.ownerId == req.user.id) {
    res.status(403);
    return res.send({
      "message": "Forbidden"
    })
  }

  let {startDate, endDate} = req.body;


  let bookings = await Booking.findAll({where:{spotId:Number(req.params.spotId)}});
  let bookingsPOJOs = bookings.map(booking => booking.toJSON());
  let comparisonStart = new Date(req.body.startDate).getTime();
  let comparisonEnd = new Date(req.body.endDate).getTime();

  for(let el of bookingsPOJOs) {
    if((comparisonEnd <= new Date(el.endDate).getTime() && comparisonEnd >= new Date(el.startDate).getTime()) &&
    comparisonStart >= new Date(el.startDate).getTime() && comparisonStart <= new Date(el.endDate).getTime()) {
      res.status(403);
      return res.send({
        "message": "Sorry, this spot is already booked for the specified dates",
        "errors": {
          "startDate": "Start date conflicts with an existing booking",
          "endDate": "End date conflicts with an existing booking"
        }
      });
    } else if (comparisonEnd <= new Date(el.endDate).getTime() && comparisonEnd >= new Date(el.startDate).getTime()) {
      res.status(403);
      return res.send({
        "message": "Sorry, this spot is already booked for the specified dates",
        "errors": {
          "endDate": "End date conflicts with an existing booking"
        }
      });
    } else if (comparisonStart >= new Date(el.startDate).getTime() && comparisonStart <= new Date(el.endDate).getTime()) {
      res.status(403);
      return res.send({
        "message": "Sorry, this spot is already booked for the specified dates",
        "errors": {
          "startDate": "Start date conflicts with an existing booking"
        }
      });
    }
  }

  for(let el of bookingsPOJOs) {
    if(comparisonStart <= new Date(el.startDate).getTime() && comparisonEnd >= new Date(el.endDate).getTime()) {
      res.status(403);
      return res.send({
        "message": "Sorry, this spot is already booked for the specified dates",
        "errors": {
          "startDate": "Start date conflicts with an existing booking",
          "endDate": "End date conflicts with an existing booking"
        }
      });
    }
  }


  let newBooking = await Booking.create({
    spotId: spot.id,
    userId: req.user.id,
    startDate,
    endDate
  })

  let bookingPOJO = newBooking.toJSON();

  let reformattedStart = reformatDate(bookingPOJO.startDate);
  let reformattedEnd = reformatDate(bookingPOJO.endDate);

  bookingPOJO.startDate = reformattedStart;
  bookingPOJO.endDate = reformattedEnd;

  res.send(bookingPOJO);

});

// End of create a new booking by Spot Id





module.exports = router;
