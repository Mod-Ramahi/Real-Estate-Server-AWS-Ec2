const jwt = require('jose');

const generateToken = async (payload, options) => {
    return new Promise((resolve, reject) => {
        try{
            const token = jwt.sign(payload,process.env.SECRET_KEY, options);
            resolve(token)
        } catch (error) {
            console.error('error generating token', error)
            reject(error)
        }
    })
}
const verifyToken = (token) => new Promise((resolve, reject) => {
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) reject(new Error('Unauthorized'));
      else resolve(decoded);
    });
  });

// const verifyToken = async (token) => {
//     return new Promise((resolve, reject) => {
//         try{
//             const decoded = jwt.verify(token, process.env.SECRET_KEY);
//             resolve(decoded)
//         } catch (error) {
//             console.error('error verifying token', error)
//             reject(error)
//         }
//     })
// }

module.exports = {generateToken, verifyToken}