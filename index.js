const express = require("express");
const configureDbconn = require("./config/db.config");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");

const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

configureDbconn()

app.use(express.json());
app.use(cookieParser());

app.use("/user", userRoutes);
app.use("/post", postRoutes);


app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

