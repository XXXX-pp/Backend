import { decodeJwt } from "../../utils/utilities.js";
import { findUser } from "../../workers/dbWork.js";

// export const getProfile = async (req, res) => {
  // try {
  //   const token = req.header('Authorization').split(' ')[1];
  //   const secretKey = process.env.JWT_SECRET;
  //   const decodedData = decodeJwt(token, secretKey);



  //   if (!decodedData || !decodedData.user || !decodedData.user._id) {
  //     console.error('JWT could not be decoded');
  //     return res.status(401).json({ status: 401, message: 'JWT could not be decoded' });
  //   }

  //   const userId = decodedData.user._id;
  //   const user = await findUser(null, null, userId);

  //   if (user) {
  //     const { username, posts, postYouLiked, postsYouSaved, totalNoOfLikes, _id } = user;
  //     return res.status(200).json({ username, posts, postYouLiked, postsYouSaved, totalNoOfLikes, _id });
  //   } else {
  //     console.log('Profile not found.');
  //     return res.status(404).json({ status: 404, message: 'Profile not found' });
  //   }
  // } catch (error) {
  //   // Log any unexpected error that occurs during request processing
  //   console.error('Unexpected error:', error);
  //   return res.status(500).json({ status: 500, message: 'An unexpected error occurred' });
  // }

//   const username = req.query.username;
//   console.log(username)

// };




export const getProfile = async (req, res) => {
  try {
    const token = req.header('Authorization').split(' ')[1];
    const secretKey = process.env.JWT_SECRET;
    const decodedData = decodeJwt(token, secretKey);
    const profileRequest = req.query.username

    if (!decodedData || !decodedData.user || !decodedData.user._id) {
      console.error('JWT could not be decoded');
      return res.status(401).json({ status: 401, message: 'JWT could not be decoded' });
    }

    if (decodedData.user.username === profileRequest) {
      
      const userId = decodedData.user._id;
      const user = await findUser(profileRequest, null, null);
  
      if (user) {
        const { username, posts, postYouLiked, postsYouSaved, totalNoOfLikes, _id } = user;
        const personal = true
        return res.status(200).json({ username, posts, postYouLiked, postsYouSaved, totalNoOfLikes, _id, personal });
      } else {
        console.log('Profile not found.');
        return res.status(404).json({ status: 404, message: 'Profile not found' });
      }
    }

    if (decodedData.user.username !== profileRequest) {
      console.log('is not the same')
      const user = await findUser(profileRequest, null, null);
      if (user) {
        const { username, posts} = user;
        const personal = false 
        console.log({ username, posts, personal })
        return res.status(200).json({ username, posts, personal });
      } else {
        console.log('Profile not found.');
        return res.status(404).json({ status: 404, message: 'Profile not found' });
      }
    }

  } catch (error) {
    // Log any unexpected error that occurs during request processing
    console.error('Unexpected error:', error);
    return res.status(500).json({ status: 500, message: 'An unexpected error occurred' });
  }
};