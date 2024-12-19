import jwt from 'jsonwebtoken';
import User from '../models/user.js'

export const protectRoute = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        // Get Token From Header
        token = req.headers.authorization.split(' ')[1];

        // Verify Token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
    
        // Assign/Get User from Token to use in Application: req.user
        const user = await User.findById(decoded.id, {
          _id: 1,
          email: 1,
        });

        // Attach the user to the request object
        req.user = user;

        next();
      } catch (error) {
        res.status(401);
        throw Error('User Unauthorized - Invalid Credentials');
      }
    }

    if (!token) {
      res.status(401);
      throw Error('User Unauthorized - No Token');
    }
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};