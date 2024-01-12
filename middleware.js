const jwt = require('jose')
const {verifyToken} = require('./utility')

const authMiddleware = async (req, res, next) => {
    // Get the token from the request headers
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    // console.log(req.body.headers.authorization,4)
      // const authorizationHeader = req.headers.Authorization;
    console.log('authHeader:', authHeader, 'token: ',token)
      if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }
    // const token = authorizationHeader.split(' ')[1];
  
  
    try {
      // Verify the token
      const decoded = await verifyToken(token)
      req.user = decoded; // Store the decoded user information in the request object
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  };
  
  module.exports = authMiddleware;
  
// const authenticationToken = (req, res, next) => {
//     const authHeader = req.headers['authorization']
//     const token = authHeader && authHeader.split(' ')[1];
//     // const token = req.headers.authorization


//     if(!token){
//          res.status(401).json({message:'error no token in middleware'});
//     }

//     jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
//         if(err){
//             return res.status(403).json({message:'error verify token in middleware'});;
//         }
//         req.user = user;
//         next()
//     })
// }

// module.exports = authenticationToken