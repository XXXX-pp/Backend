import {UserModel} from '../model/userModel.js'

export default function getUsers(req, res) {
    UserModel.find({})
    .then(function (users) {
      res.send(users)
    })
}