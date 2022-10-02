const express = require('express')
const { userAuth } = require('../auth/auth')
const { createPost, allPost, getPost } = require('../controller/post.controller')
const { getPostsOfMyFollowing } = require('../controller/user.controller')
const router= express.Router()

router.post("/create", userAuth, createPost)

// router.post("/login",login)

router.get("/all", userAuth, allPost)

router.get("/getpost", userAuth, getPost)

router.get("/mySubPosts", userAuth ,getPostsOfMyFollowing)




module.exports = router