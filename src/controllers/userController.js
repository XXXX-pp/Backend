import {UserModel} from '../model/userModel.js'

export default function handleGetUsers(req, res) {
    UserModel.find({})
    .then(function (users) {
      res.send(users)
    })
}