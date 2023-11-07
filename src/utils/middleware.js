import jwt from "jsonwebtoken";
const secretKey = process.env.JWT_SECRET;

export const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization').split(' ')[1];
    if (!token) {
      console.log('no token found')
      return res.status(401).json({ status: 401, message: 'session expired'});
    }
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
          console.error('authToken Error:', err);
          return res.status(401).json({ status: 401, message: 'session expired' });
        }
        req.user = user;
        next();
    });
};

