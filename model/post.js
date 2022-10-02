const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
	title: {
		type: String,
		unique: true,
	  },
	  body: {
		type: String,
		unique: true,
	  },
	  photo: {
		type: String,
	  },
      postedBy : {
        type: Schema.Types.ObjectId,
        ref: "Users"
      }
});

const postModel = mongoose.model('Posts', PostSchema);

module.exports = postModel