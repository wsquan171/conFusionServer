const express = require('express');
const bodyParser = require('body-parser');
const promoRouter = express.Router();

promoRouter.use(bodyParser.json());
promoRouter.route('/')
.all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('will send all promotions to you');
})
.post((req,res,next)=>{
    res.end('will add the promotion: ' + req.body.name + 
            ' with details: ' + req.body.description);
})
.put((req,res,next)=>{
    res.statusCode = 403;
    res.end('put operation not supported on /promotions');
})
.delete((req,res,next)=>{
    res.end('will delete all promotions');
});

promoRouter.route('/:promoId')
.get((req,res,next)=>{
    res.end('will send details about promotion ' + 
            req.params.promoId + ' to you');
})
.post((req,res,next)=>{
    res.statusCode = 403;
    res.end('post operation not supported on /promotions/' + 
             req.params.promoId);
})
.put((req,res,next)=>{
    res.write('updating promotion ' + req.params.promoId + '\n');
    res.end('name ' + req.body.name + 
            ' with details: ' + req.body.description);
})
.delete((req,res,next)=>{
    res.end('will delete promotion ' + req.params.promoId);
});

module.exports = promoRouter;