const jwt = require("jsonwebtoken");
const userModel = require("../model/user");
require('dotenv').config();

const jwtSecret = process.env.jwt_secret;

exports.userAuth = (req, res, next) => {
    const {authorization} = req.headers
    if (authorization) {

        const splitToken = authorization.split("Bearer ")[1];

      jwt.verify(splitToken, jwtSecret, (err, payload) => {
        if (err) {
          return res.status(401).json({ message: "Not authorized" })
        }  else {
            const {id} = payload;
            console.log("id",id)
            userModel.findById({_id: id}).then(userData => {
                console.log("data",userData)
                req.user = userData;
                console.log("req user",userData)
                next()
            })

          }
      })
    } else {
      return res
        .status(401)
        .json({ message: "Not authorized, token not available" })
    }
  }

