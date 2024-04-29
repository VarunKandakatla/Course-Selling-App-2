const jwt = require('jsonwebtoken');
const { User } = require('../db');
const jwtPassword = 'secret123@'

function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    try{
        const str = req.headers.authorization;
        const token = str.slice(6,str.length);
        jwt.verify(token,jwtPassword);
        const decoded = jwt.decode(token,jwtPassword);
        req.headers.decoded = decoded;
        next();
    }
    catch(err)
    {
        res.status(400).json({message : 'Invalid user token! please sign in'});
    }
}


function generateToken(req,res,next)
{
    User.findOne({username : req.body.username})
    .then((user)=>{
        if(user == null)
        {
            res.status(400).json({message : 'user not found! please sign up'});
        }
        else
        {
            const token = jwt.sign({username : req.body.username},jwtPassword);
            req.headers.token = "Bearer"+token;
            next();
        }
    })

}
module.exports = {userMiddleware,generateToken};