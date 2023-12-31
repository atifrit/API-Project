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

// Delete a Review image

router.delete('/:imageId', requireAuth, async (req, res) => {
    let reviewImage = await ReviewImage.findByPk(Number(req.params.imageId), {include:{model:Review}});
    if(!reviewImage) {
        res.status(404);
        return res.send({
            "message": "Review Image couldn't be found"
          })
    }

    if(reviewImage.Review.dataValues.userId !== req.user.id) {
        res.status(403);
        return res.send({
            "message": "Forbidden"
          });
    }

    await reviewImage.destroy();

    res.send({
        "message": "Successfully deleted"
      })
})

// End of Delete a Review image

module.exports = router;
