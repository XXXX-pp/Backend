import users from '../model/userModel.js'

export default function handleGetUsers(req, res) {
    users.find({})
    .then(function (users) {
      res.send(users)
    })
}