import {userModel} from '../model/userModel.js'

export default function getUsers(req, res) {
    userModel.find({})
    .then(function (users) {
      res.send(users)
    })
}