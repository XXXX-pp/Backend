import { decodeJwt } from "../../utils/utilities.js";
import { findUser, getPost } from "../../workers/dbWork.js";

export const getPosts = async (req, res) => {
  // get the token from the request to personalize the feed
  const token = req.header('Authorization').split(' ')[1];
  const secretKey = process.env.JWT_SECRET;
  const decodedData = decodeJwt(token, secretKey)
  const userId = decodedData.user._id
  try {
    const user = await findUser(null,null,userId)
    const {homeFeed} = await getPost()
    if (user) {
      const postsYouSaved = user.postsYouSaved;
      return res.status(200).json({ homeFeed, userId, postsYouSaved });
    } else {
      console.log('User not found');
      // Handle the case when the user is not found
      return res.status(404)
    }
  } catch (error) {
    console.error('Error finding the user:', error);
    // Handle the error as needed
    return res.status(500).json({status:500});
  }
}

export const getPostById = async (req, res) => {
  const postId = req.params.postId;
  try {
    const {byId} = await getPost(postId)    
    if (!byId) {
      console.log('postIDs not found')
      return res.status(404).json({status:404});
    }
    return res.status(200).json(byId)
  } catch (error) {
    console.error(error);
    return res.status(500).json({status:500});
  }
};

export const getPostsByLikes = async (req, res) => {
    // get the token from the request to personalize the feed
    const token = req.header('Authorization').split(' ')[1];
    const secretKey = process.env.JWT_SECRET;
    const decodedData = decodeJwt(token, secretKey)
  try {
    const {byLikes} = await getPost()
    res.status(200).json(byLikes);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ status:500 });
  }
}