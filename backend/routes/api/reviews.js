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

// Add Image to review

router.post('/:reviewId/images', requireAuth, async (req, res) => {
    let reviewId = Number(req.params.reviewId)

    let review = await Review.findByPk(reviewId, {include:{model:ReviewImage}});

    if(!review) {
        res.status(404);
        return res.send({
            "message": "Review couldn't be found"
          });
    }


    if(Number(req.user.id) !== review.userId) {
        res.status(403);
        return res.send({
            "message": "Forbidden"
          });
    }

    let reviewPOJO = review.toJSON();
    let reviewCount = 0;
    for(let el of reviewPOJO.ReviewImages) {
        reviewCount++
    }
    if(reviewCount >= 10) {
        res.status(403);
        return res.send({
            "message": "Maximum number of images for this resource was reached"
          })
    }

    let {url} = req.body;

    let newReviewImage = await ReviewImage.create({
        reviewId,
        url
    });

    let newReviewImagePOJO = newReviewImage.toJSON();

    delete newReviewImagePOJO.reviewId;
    delete newReviewImagePOJO.createdAt;
    delete newReviewImagePOJO.updatedAt;

    res.send(newReviewImagePOJO);
});

// End of Add Image to review


// Edit a review

reviewValidator = [
    check('review').exists().withMessage("Review text is required"),
    check('review').notEmpty().withMessage("Review text is required"),
    check('stars').exists().withMessage("Stars must be an integer from 1 to 5"),
    check('stars').isInt({min:1, max: 5}).withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
  ]

router.put('/:reviewId', requireAuth, reviewValidator, async (req, res) => {
    let reviewId = Number(req.params.reviewId);

    let reviewToEdit = await Review.findByPk(reviewId);

    if(!reviewToEdit) {
        res.status(404);
        return res.send({
            "message": "Review couldn't be found"
          });
    }

    console.log(Number(req.user.id));
    console.log(reviewToEdit.userId);

    if(Number(req.user.id) !== reviewToEdit.userId) {
        res.status(403);
        return res.send({
            "message": "Forbidden"
          });
    }

    let {review, stars} = req.body;

    reviewToEdit.review = review;
    reviewToEdit.stars = stars;
    await reviewToEdit.save();

    res.send(reviewToEdit);
});

// End of Edit a review

module.exports = router;
