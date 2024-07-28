import express from 'express';
import rateLimit from 'express-rate-limit';


//limiting to 5 requests per 15 mins
const loginRateLimiter = rateLimit({
    windowMs : 15 * 60 * 1000,
    max: 100,
    message : {
        error : "Too many request from this IP, try again after 15 minutes"
    },
    headers : true,

})

export default loginRateLimiter