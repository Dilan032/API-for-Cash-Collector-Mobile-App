const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function(req,res,next){
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    {
        const token = req.headers.authorization.split(' ')[1]; // Extract the token from the header

        if(token == null){
            res.status(401).send('Unauthorized access'); // No token provided
        }else{
            jwt.verify(token,process.env.TOKEN_KEY,(err, result)=>{
                if(err)
                    { res.status(403).send('Forbidden access'); } // Invalid token 
                else
                    { req.result = result; next(); }
            });
        }
    }else{ 
        res.status(401).send('Unauthorized access'); // No Authorization header or doesn't start with Bearer
    }
}