import { PostModel } from "../../model/postModel.js";
import { decodeJwt } from "../../utils/utilities.js";
import { findUser, getPost } from "../../workers/dbWork.js";
import { retry } from "await-retry";

async function findUserWithRetry(userId) {
  try {
    const user = await retry(async () => {
      return await findUser(null, null, userId);
    }, { retries: 3, minTimeout: 3000 });

    return user;
  } catch (error) {
    console.error('Error finding the user:', error);
    throw error;
  }
}

export const getPosts = async (req, res) => {
  const token = req.header('Authorization').split(' ')[1];
  const secretKey = process.env.JWT_SECRET;
  const decodedData = decodeJwt(token, secretKey)
  const userId = decodedData.user._id
  const limit = parseInt(req.query.limit) || 10; 
  const pageParam = parseInt(req.query.page) || 1;
  try {
    const user = await findUserWithRetry(userId);
    const skip = (pageParam - 1) * limit;
    const postsCount = await PostModel.countDocuments();
    const posts = await PostModel.find().maxTimeMS(5000)
    .skip(skip)
    .limit(limit);
    if (user) {
      const postsYouSaved = user.postsYouSaved;
      return res.status(200).json({ 
        posts, 
        postsCount, 
        userId, 
        postsYouSaved, 
        currentPage: pageParam, 
        totalPages: Math.ceil(postsCount / limit), 
        hasNextPage: skip + limit < postsCount
      });
       
    } else {
      console.log('User not found');
      return res.status(404)
    }
  } catch (error) {
    console.error('Error finding the user:', error);
    return res.status(500).json({status:500});
  }
}

export const getPostById = async (req, res) => {
  const postId = req.params.postId;
  try {
    const {byId} = await getPost(postId)    
    if (!byId) {
      return res.status(202).json({
        _id: postId,
        description: "Post no longer exists"
      });
    }
    return res.status(200).json(byId)
  } catch (error) {
    console.error(error);
    return res.status(500).json({status:500});
  }
};

export const getPostsByLikes = async (req, res) => {
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