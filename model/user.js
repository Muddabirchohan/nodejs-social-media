const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
	username: {
		type: String,
		unique: true,
		required: true,
	  },
	  email: {
		type: String,
		unique: true,
		required: true,
	  },
	  password: {
		type: String,
		minlength: 6,
		required: true,
	  },
	  follower: [{
		type: Schema.Types.ObjectId,
		ref: "Users"
	  }],
	  following: [{
		type: Schema.Types.ObjectId,
		ref: "Users"
	  }]
});

const userModel = mongoose.model('Users', userSchema);

module.exports = userModel