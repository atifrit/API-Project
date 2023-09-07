const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Spot, Review, SpotImage, User, ReviewImage } = require('../../db/models');
const router = express.Router();


// Get all reviews for current user

router.get('/current', requireAuth, async (req, res) => {
    let Id = Number(req.user.id);

    let reviews = await Review.findAll(
        {
            where:{userId:Id},
            include:[
                {model: User, attributes:{exclude:['username',"hashedPassword", "email", "createdAt", "updatedAt"]}},
                {model: Spot, include:{model:SpotImage}, attributes:{exclude:['createdAt', 'updatedAt', 'description']}},
                {model: ReviewImage, attributes:{exclude:['createdAt', 'updatedAt', 'reviewId']}}
            ]
    })


    let reviewsPOJOs = reviews.map(review => review.toJSON());

    for(let el of reviewsPOJOs) {
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

    res.json({"Reviews":reviewsPOJOs});
})

// End of Get all reviews for current user




module.exports = router;
