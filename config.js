var config = {};


config.apiRateLimiter={};
config.apiRateLimiter.windowMs=15*60*1000;// 15 Min Window 
config.apiRateLimiter.delayAfter=90; // begin slowing down responses after the 90 request 
config.apiRateLimiter.max=100;// start blocking after 100 requests 


config.authRateLimiter={};
config.authRateLimiter.windowMs=60*60*1000;// 60 Min Window 
config.authRateLimiter.delayAfter=3; // begin slowing down responses after the 3 request 
config.authRateLimiter.max=5;// start blocking after 5 requests


module.exports = config;