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

  export const savePost = async (req, res) => {
    try {
      const token = req.header('Authorization').split(' ')[1];
      const secretKey = process.env.JWT_SECRET;
      const decodedData = decodeJwt(token, secretKey);
  
      if (!decodedData || !decodedData.user || !decodedData.user._id) {
        console.error('Unauthorized request');
        return res.status(401).json({ status: 401, message: 'Unauthorized request' });
      }
  
      const userId = decodedData.user._id;
      const saves = req.body;
  
      try {
        const user = await UserModel.findOneAndUpdate(
          { _id: userId },
          {
            $addToSet: { postsYouSaved: { $each: saves } },
          },
          { new: true }
        ).exec();
  
        if (user) {
          console.log('User updated successfully');
          return res.status(200).json({ status: 200 });
        } else {
          console.log('User not found or no updates were made.');
          return res.status(404).json({ status: 404, message: 'User not found or no updates were made' });
        }
      } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ status: 500, message: 'Error updating user' });
      }
    } catch (error) {
      // Log any unexpected error that occurs during request processing
      console.error('Unexpected error:', error);
      return res.status(500).json({ status: 500, message: 'An unexpected error occurred' });
    }
  };
  

export const unSavePost = async (req, res) => {
  try {
    const token = req.header('Authorization').split(' ')[1];
    const secretKey = process.env.JWT_SECRET;
    const decodedData = decodeJwt(token, secretKey);

    if (!decodedData || !decodedData.user || !decodedData.user._id) {
      console.error('Unauthorized request');
      return res.status(401).json({ status: 401, message: 'Unauthorized request' });
    }

    const userId = decodedData.user._id;

    try {
      const user = await UserModel.findOneAndUpdate(
        { _id: userId },
        {
          $pull: { postsYouSaved: { $in: req.body } },
        },
        { new: true }
      ).exec();

      if (user) {
        console.log('User updated successfully');
        return res.status(200).json({ message: 'User updated successfully' });
      } else {
        console.log('User not found or no updates were made.');
        return res.status(404).json({ message: 'User not found or no updates were made' });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } catch (error) {
    // Log any unexpected error that occurs during request processing
    console.error('Unexpected error:', error);
    return res.status(500).json({ status: 500, message: 'An unexpected error occurred' });
  }
};
