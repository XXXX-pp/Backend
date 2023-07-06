import {userModel} from '../model/userModel.js'

export default function handleGetUsers(req, res) {
    userModel.find({})
    .then(function (users) {
      res.send(users)
    })
}