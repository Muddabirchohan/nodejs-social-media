
const userModel = require("./../model/user")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');
const friendsModel = require("../model/friends");
const { off } = require("../model/friends");
const postModel = require("../model/post");

require('dotenv').config();

const jwtSecret = process.env.jwt_secret;

exports.addUser = (req, res) => {

    userModel
        .find()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Tutorial."
            });
        });

}


exports.listAllUsers = (req, res) => {



    userModel
        .find()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Tutorial."
            });
        });

}

exports.createUser = async (req, res) => {
    const { username, password, email, friends, requested } = req.body
    if (password.length < 6) {
        return res.status(400).json({ message: "Password less than 6 characters" })
    }
    try {



        bcrypt.hash(password, 10).then(async (hash) => {
            await userModel.create({
                username,
                password: hash,
                email,
                friends,
                requested
            })
                .then((user) => {
                    const maxAge = 3 * 60 * 60;

                    const token = jwt.sign(
                        { id: user._id, username },
                        jwtSecret,
                        {
                            expiresIn: maxAge, // 3hrs in sec
                        }
                    );
     
                    res.status(200).json({
                        message: "User successfully created",
                        user: user._id,
                    })
                }
                )
                .catch((error) => {
                    console.log("err", error)
                    res.status(400).json({
                        message: "User not successful created",
                        error: error.message,
                    })
                }
                );
        });
    } catch (err) {
        res.status(401).json({
            message: "Failed to create user",
            error: err.mesage,
        })
    }

}

exports.findUserById = (req, res) => {
    userModel.findById(req.params.userId)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "user not found with id " + req.params.userId,
                });
            }
            res.status(200).send(data);
        })
        .catch((err) => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    message: "user not found with id " + req.params.userId,
                });
            }
            return res.status(500).send({
                message: "Error retrieving user with id " + req.params.userId,
            });
        });
}


exports.deleteUser = (req, res) => {
    userModel.findByIdAndRemove(req.params.userId)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "user not found with id " + req.params.userId,
                });
            }
            res.status(200).send(data);
        })
        .catch((err) => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    message: "user not found with id " + req.params.userId,
                });
            }
            return res.status(500).send({
                message: "Error retrieving user with id " + req.params.userId,
            });
        });
}

exports.updateUser = (req, res) => {
    userModel.findByIdAndUpdate(req.params.userId)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "user not found with id " + req.params.userId,
                });
            }
            res.status(200).send({
                data,
                message: "user updated successfully"
            });
        })
        .catch((err) => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    message: "user not found with id " + req.params.userId,
                });
            }
            return res.status(500).send({
                message: "Error retrieving user with id " + req.params.userId,
            });
        });

}

exports.login = async (req, res, next) => {
    const { username, password } = req.body
    // Check if username and password is provided
    if (!username || !password) {
        return res.status(400).json({
            message: "Username or Password not present",
        })
    }
    try {
        const user = await userModel.findOne({ username })
        if (!user) {
            res.status(400).json({
                message: "Login not successful",
                error: "User not found",
            })
        } else {
            // comparing given password with hashed password


            bcrypt.compare(password, user.password).then(function (result) {
                if (result) {
                    const maxAge = 3 * 60 * 60;
                    const token = jwt.sign(
                        { id: user._id, username, role: user.role },
                        jwtSecret,
                        {
                            expiresIn: maxAge, // 3hrs in sec
                        }
                    );
            
                    res.status(201).json({
                        message: "User successfully Logged in",
                        token: token,
                    });
                } else {
                    res.status(400).json({ message: "Login not succesful" });
                }
            })
        }
    } catch (error) {
        res.status(400).json({
            message: "An error occurred",
            error: error.message,
        })
    }
}



exports.getUser = (req, res) => {


    const { userId } = req.params

    // if (!userId) {
    //   return res.status(400).json({ message: "User Id missing" })
    // }
    try {

        userModel.findById({ _id: req.params.userId })
            .select("-password")

            .then((user) => {

                postModel.find({ postedBy: req.params.userId }).then(posts => {
                    console.log("posts", posts)
                    res.status(200).json({
                        message: "User successfully created",
                        data: { user, posts }
                    })
                })


            }
            )
            .catch((error) => {
                console.log("err", error)
                res.status(400).json({
                    message: "User not successful created",
                    error: error.message,
                })
            }
            );

    } catch (err) {
        res.status(401).json({
            message: "Failed to create user",
            error: err.mesage,
        })
    }

}



exports.followUser = (req, res) => {


    const { toFollow } = req.body


    try {

        userModel.findByIdAndUpdate(toFollow, {
            $push: { follower: req.user._id }
        }, {
            new: true
        }, (err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            }
            userModel.findByIdAndUpdate(req.user._id, {
                $push: { following: toFollow }

            }, {
                new: true
            }).then(result => {
                res.json(result)
            }).catch((error) => {
                res.status(400).json({
                    message: "failed",
                    error: error.message,
                })
            })

        })

    } catch (err) {
        res.status(401).json({
            message: "Failed to create user",
            error: err.mesage,
        })
    }

}



exports.getPostsOfMyFollowing = (req, res) => {

    const { toFollow } = req.body

    try {

        postModel.find({ postedBy: { $in: req.user.following } })
            .populate("postedBy", "_id name")
            // .populate("comments.postedBy","_id name")
            .then(result => {
                res.json(result)
            }).catch((error) => {
                res.status(400).json({
                    message: "failed",
                    error: error.message,
                })
            })

    } catch (err) {
        res.status(401).json({
            message: "Failed to create user",
            error: err.mesage,
        })
    }

}