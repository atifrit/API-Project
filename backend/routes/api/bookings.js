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
        delete el.Spot.SpotImages;
    }

    res.send({"Bookings":bookingsPOJOs});
});

// End of Get all bookings for current user


// Edit a booking

bookingValidator = [
    check('endDate').custom(async (endDate, {req}) => {
      let comparisonEnd = new Date(endDate).getTime();
      let comparisonStart = new Date(req.body.startDate).getTime();
      if(comparisonStart >= comparisonEnd) {
        throw new Error("endDate cannot be on or before startDate");
      }
      return true;
    }),
    handleValidationErrors]



router.put('/:bookingId', requireAuth, bookingValidator, async (req, res) => {

    let booking = await Booking.findByPk(Number(req.params.bookingId));

    if(!booking) {
        res.status(404);
        return res.send({
            "message": "Booking couldn't be found"
          });
    }

    if(booking.userId !== req.user.id) {
        res.status(403);
        return res.send({
            "message": "Forbidden"
          });
    }


    let bookingPOJO = booking.toJSON();
    let comparisonStart = new Date(req.body.startDate).getTime();
    let comparisonEnd = new Date(req.body.endDate).getTime();

    if(new Date().getTime() >= new Date(bookingPOJO.endDate).getTime()) {
        res.status(403);
        return res.send({
            "message": "Past bookings can't be modified"
          });
    }

    let bookings = await Booking.findAll({where:{spotId:booking.spotId}});
    let bookingsPOJOs = bookings.map(booking => booking.toJSON());

    for(let el of bookingsPOJOs) {
        if((comparisonEnd <= new Date(el.endDate).getTime() && comparisonEnd >= new Date(el.startDate).getTime()) &&
        (comparisonStart >= new Date(el.startDate).getTime() && comparisonStart <= new Date(el.endDate).getTime()) && Number(el.id) !== Number(booking.id)) {
          res.status(403);
          return res.send({
            "message": "Sorry, this spot is already booked for the specified dates",
            "errors": {
              "startDate": "Start date conflicts with an existing booking",
              "endDate": "End date conflicts with an existing booking"
            }
          });
        } else if (comparisonEnd <= new Date(el.endDate).getTime() && comparisonEnd >= new Date(el.startDate).getTime() && Number(el.id) !== Number(booking.id)) {
          res.status(403);
          return res.send({
            "message": "Sorry, this spot is already booked for the specified dates",
            "errors": {
              "endDate": "End date conflicts with an existing booking"
            }
          });
        } else if (comparisonStart >= new Date(el.startDate).getTime() && comparisonStart <= new Date(el.endDate).getTime() && Number(el.id) !== Number(booking.id)) {
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
        if(comparisonStart <= new Date(el.startDate).getTime() && comparisonEnd >= new Date(el.endDate).getTime() && Number(el.id) !== Number(booking.id)) {
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


      booking.startDate = req.body.startDate;
      booking.endDate = req.body.endDate;
      await booking.save();

      let resultPOJO = booking.toJSON();
      resultPOJO.startDate = reformatDate(booking.startDate);
      resultPOJO.endDate = reformatDate(booking.endDate);
      res.send(resultPOJO);

});

// End of Edit a booking


// delete a booking

router.delete('/:bookingId', requireAuth, async (req, res) => {
    let booking = await Booking.findByPk(Number(req.params.bookingId));

    if(!booking) {
        res.status(404);
        return res.send({
            "message": "Booking couldn't be found"
          });
    }

    if(booking.userId !== req.user.id) {
        res.status(403);
        return res.send({
            "message": "Forbidden"
          });
    }

    let bookingPOJO = booking.toJSON();

    if(new Date().getTime() >= new Date(bookingPOJO.startDate).getTime()) {
        res.status(403);
        return res.send({
            "message": "Bookings that have been started can't be deleted"
          });
    }

    await booking.destroy();

    res.send({
        "message": "Successfully deleted"
      });

})

// end of delete a booking



module.exports = router;
