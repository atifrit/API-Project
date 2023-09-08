const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Spot, Review, SpotImage, User, ReviewImage, Booking } = require('../../db/models');
const router = express.Router();

function reformatDate (date) {
    let newDate = new Date(date.toUTCString()).toLocaleDateString('en-US', {
      timeZone: 'UTC',
    }).replace(/\//g, '-');
    return newDate;
  }

// Get all bookings for current user

router.get('/current', requireAuth, async (req, res) => {
    let bookings = await Booking.findAll({where:{userId:req.user.id}, include:{model:Spot, attributes:{exclude:['createdAt', 'updatedAt', 'description']}, include:{model:SpotImage}}});

    let bookingsPOJOs = bookings.map(booking => booking.toJSON());

    for(let el of bookingsPOJOs) {
        let newStartDate = reformatDate(el.startDate);
        let newEndDate = reformatDate(el.endDate);

        el.startDate = newStartDate;
        el.endDate = newEndDate;

        let previewImage = null;

        for(let subEl of el.Spot.SpotImages){
            if(subEl.preview == true) {
                previewImage = subEl.url;
            }
        }

        el.Spot.previewImage = previewImage;
        console.log(el.Spot.previewImage);
        delete el.Spot.SpotImages;
    }

    res.send({"Bookings":bookingsPOJOs});
});

// End of Get all bookings for current user

module.exports = router;
