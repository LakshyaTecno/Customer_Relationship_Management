const express = require("express");
const app = express();
const serverConfig = require("./configs/server.config");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const dbConfig = require("./configs/db.config");
const User = require("./models/userSchema");
const bcrypt = require("bcryptjs");

app.use(bodyparser.json());

app.use(bodyparser.urlencoded({ extended: true })); //extended:true  accept  other  Datatype also  beside string

mongoose.connect(dbConfig.DB_URL);
const db = mongoose.connection;

db.on("error", () => {
  console.log("Error while connected to mongodb");
});

db.once("open", () => {
  console.log("connected to mongodb");
  init();
});

async function init() {
  try {
    await User.collection.drop();
    // const user= await User.findOne({userId:"admin"})

    // if(user){
    //     console.log("ADMIN user is already present");
    //     return;
    // }

    const user = await User.create({
      name: "Lakshya",
      userId: "admin",
      password: bcrypt.hashSync("Welcome", 8),
      email: "Lakshya@gmail.com",
      userType: "ADMIN",
    });
  } catch (err) {
    console.log("err in db initialization", +err.message);
  }
}

require("./routes/auth.route")(app);

require("./routes/user.route")(app);

console.log(serverConfig);
app.listen(serverConfig.PORT, () => {
  console.log("Started the server on the PORT number :", serverConfig.PORT);
});
