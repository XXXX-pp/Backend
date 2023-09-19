import {findUser} from "../../workers/dbWork.js"

export const checkDetails = async (req, res) => {
  try {
    const {username, email} = req.body
    const detailExist = await findUser(username, email)

    if (detailExist) {
        return res.json({status: 201})
    }

    if (!detailExist) {
        return res.json({status: 404})
    }
  }
  catch (error) {
    return res.json({status: 500})
  }
};