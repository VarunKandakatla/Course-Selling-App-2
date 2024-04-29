const { Admin } = require("../db");
const jwt = require('jsonwebtoken');
const jwtPassword = 'secret123';

function generateToken(req,res,next)
{
    Admin.findOne({
        username : req.body.username
    })
    .then((admin)=>{
        if(admin == null)
        {
            return res.status(400).json({message : 'Admin details not found! please do sign up!'});
        }
        else
        {
            const token = jwt.sign({username : req.body.username},jwtPassword);
            req.headers.token = 'Bearer'+token;
            next();
        }
    })
}

// Middleware for handling auth
function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
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
        res.status(400).json({message : "Invalid token! Please sign in!"});
    }
}

module.exports = {adminMiddleware,generateToken};