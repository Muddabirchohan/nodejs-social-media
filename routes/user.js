const express = require('express')
const { adminAuth, userAuth } = require('../auth/auth')
const { listAllUsers, createUser, findUserById, deleteUser, addFriend, updateUser, login, getUser, followUser } = require('../controller/user.controller')
const router= express.Router()

router.post("/create", createUser)

router.post("/login",login)

router.get("/all", userAuth, listAllUsers)

router.get("/findById/:userId", findUserById)

router.get("/deleteUser/:userId", deleteUser)

router.get("/updateUser/:userId", updateUser)

router.get("/getUser/:userId", getUser)

router.post("/follow", userAuth, followUser)


module.exports = router