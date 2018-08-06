const express = require('express');
const bodyParser = require('body-parser');
const dishRouter = express.Router();

dishRouter.use(bodyParser.json());
dishRouter.route('/')
.all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('will send all dishes to you');
})
.post((req,res,next)=>{
    res.end('will add the dish: ' + req.body.name + 
            ' with details: ' + req.body.description);
})
.put((req,res,next)=>{
    res.statusCode = 403;
    res.end('put operation not supported on /dishes');
})
.delete((req,res,next)=>{
    res.end('will delete all dishes');
});

dishRouter.route('/:dishId')
.get((req,res,next)=>{
    res.end('will send details about dish ' + 
            req.params.dishId + ' to you');
})
.post((req,res,next)=>{
    res.statusCode = 403;
    res.end('post operation not supported on /dishes/' + 
             req.params.dishId);
})
.put((req,res,next)=>{
    res.write('updating dish ' + req.params.dishId + '\n');
    res.end('name ' + req.body.name + 
            ' with details: ' + req.body.description);
})
.delete((req,res,next)=>{
    res.end('will delete dish ' + req.params.dishId);
});

module.exports = dishRouter;