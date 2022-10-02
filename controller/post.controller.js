const postModel = require("../model/post");



exports.createPost = (req, res) => {

    
    const { title, body } = req.body;

    if (!title || !body) {
        return res.status(422).json({ error: "missing required fields" })
    }

    console.log("req",req.user)

    try {

        postModel.create({
            title,
            body,
            postedBy: req.user
        }
        ).then((post) => {

            res.status(200).json({
                message: "post successfully created",
                post: post,
            })
        }
        )
            .catch((error) => {
                console.log("err", error)
                res.status(400).json({
                    message: "post not successful created",
                    error: error.message,
                })
            }
            );

    } catch (err) {
        res.status(401).json({
            message: "Failed to create post",
            error: err.mesage,
        })
    }

}

exports.allPost = (req,res) => {


    postModel.find()
    .populate("postedBy","_id name")
    .then(resp => {
        res.status(200).json({resp})
    }).catch(err => {
        console.log("err",err)
        res.send({err: "failed to load"})
    })


}


exports.getPost = (req,res) => {
    try {
        postModel.find({postedBy: req.user.id})
        .populate("postedBy","_id name")
        .then(resp => {
            res.status(200).json({resp})
        }).catch(err => {
            console.log("err",err)
            res.send({err: "failed to load"})
        })
    
    }
    catch(err){
        console.log("err",err)
        // res.status(400).josn({err : err.mesage})
    }

}