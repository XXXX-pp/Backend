import jwt  from "jsonwebtoken";
import { UserModel } from "../../model/userModel.js";

function decodeJwt(token, secretKey) {
    try {
      const decoded = jwt.verify(token, secretKey);
      return decoded;
    } catch (error) {
      console.error('JWT verification error:', error.message);
      return null;
    }
  }

export const savePost = (req, res) => {
    try {
        const token = req.header('Authorization').split(' ')[1];
        const secretKey = process.env.JWT_SECRET;
        const decodedData = decodeJwt(token, secretKey)
        const saves = req.body
        if (decodedData) {
            const userId = decodedData.user._id;
          
            UserModel.findOneAndUpdate(
              { _id: userId },
              {
                $addToSet: { postsYouSaved: { $each: req.body } },
              },
              { new: true }
            )
              .exec()
              .then((user) => {
                if (user) {
                  console.log('User updated successfully');
                  res.status(200).json({ status: 200 });
                } else {
                  console.log('User not found or no updates were made.');
                  res.status(404).json({ status: 404 });
                }
              })
              .catch((error) => {
                console.error('Error updating user:', error);
                res.status(500).json({ status: 500 });
              });
          } else {
            console.log('Unauthorised')
            res.status(401).json({ status: 401 });
          }
    } catch {

    }
}

export const unSavePost = (req, res) => {
    try {
        const token = req.header('Authorization').split(' ')[1];
        const secretKey = process.env.JWT_SECRET;
        const decodedData = decodeJwt(token, secretKey)
        const saves = req.body
        if (decodedData) {
            const userId = decodedData.user._id;
          
            UserModel.findOneAndUpdate(
              { _id: userId },
              {
                $addToSet: { postsYouSaved: { $each: req.body } },
              },
              { new: true }
            )
              .exec()
              .then((user) => {
                if (user) {
                  console.log('User updated successfully');
                  res.status(200).json({ message: 'User updated successfully' });
                } else {
                  console.log('User not found or no updates were made.');
                  res.status(404).json({ message: 'User not found or no updates were made.' });
                }
              })
              .catch((error) => {
                console.error('Error updating user:', error);
                res.status(500).json({ message: 'Internal server error' });
              });
          } else {
            res.status(401).json({ message: 'Unauthorized' });
          }
    } catch {

    }
}