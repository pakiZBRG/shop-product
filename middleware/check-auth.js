const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).json({msg: "Access denied to unauthorized users."});

    try{
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded;
        next();
    }
    catch(err){
        res.status(400).json({error: err})
    }
}