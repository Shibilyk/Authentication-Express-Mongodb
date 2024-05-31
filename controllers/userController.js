const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const authentication = require("../middleware/validation");
const userDetails = require("../models/detailsModel");
const { render } = require("ejs");

mongoose.connect("mongodb://localhost:27017/login");
const db = mongoose.connection;

exports.userHome = (req, res) => {
  if (req.session.user && req.session.isAdmin) {
    return res.redirect("/admin/home");
  }
  if (req.session.user) {
    return res.render("./user/index");
  }
  res.redirect("/user/login");
};

exports.registerGet = (req, res) => {
  if (req.session.user) {
    return res.redirect("/user/");
  }
  res.render("./user/register");
};

exports.loginGet = (req, res) => {
  if (req.session.user && !req.session.isAdmin) {
    return res.redirect("/user/");
  }
  if (req.session.user && req.session.isAdmin) {
    return res.redirect("/admin/home");
  }
  const error = req.session.error_message;
  if (error) {
    req.session.error_message = null;
    return res.render("./user/login", { error });
  }
  res.render("./user/login", { error });
};

exports.loginPost = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.redirect("/user/login");
    }

    // Find the user by email
    const user = await User.findOne({ email });
    // Check if user exists
    if (!user) {
      req.session.error_message = "user does't exists";
      console.log("user does't exists");
      return res.redirect("/user/login");
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.redirect("/user/login");
    }
    req.session.user = user;
    if (user.usertype === "admin") {
      req.session.isAdmin = true;
      return res.redirect("/admin/home");
    }
    res.redirect("/user/");
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Internal Server Error");
  }
};
exports.registerPost = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password) {
      console.log("if workedin condrol 1");
      return res.redirect("/user/register");
    }

    const existingUser = await User.findOne({ email });

    // Check if the user already exists
    if (existingUser) {
      console.log("User already exists:", existingUser);
      return res.redirect("/user/register");
    }

    // Add any condition to not store in DB, e.g., if some validation fails
    if (!authentication) {
      // Adjust this condition as per your actual logic
      console.log("authentication");

      return res.redirect("/user/register");
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();
    res.redirect("/user/login");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
exports.detailsget = async (req, res) => {
  if (req.session.user && !req.session.isAdmin) {
    const userDetail = await userDetails.findOne({userId: req.session.user._id });
    if (userDetail) {
      const passDetails = {
        name: userDetail.name,
        age: userDetail.age,
        place: userDetail.place,
        contact: userDetail.contact,
      };
      // Render the form template with dynamic values
      return res.render("./user/showData", { passDetails });
    }
    return res.render("./user/userdata");
  }
  res.redirect("/user/login");
};
exports.detailsPost = async (req, res) => {
  try {
    const { name, age, place, contact } = req.body;
    const userId = req.session.user._id
    const newDetails = new userDetails({
      userId,
      name,
      age,
      place,
      contact,
    });
    console.log(newDetails);
    await newDetails.save();
    res.redirect('/user/details')
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};


exports.updateDataGet = async(req, res) => {
  if (!req.session.user) {
    return res.redirect("/user/login");
  }
  const userDetail = await userDetails.findOne({ userId: req.session.user._id });
  const passDetails = {
    name :userDetail.name,
    age :userDetail.age,
    place:userDetail.place,
    contact:userDetail.contact
  }
  res.render("./user/update",{data:passDetails});
};
exports.updateDataPost = async (req, res) => {
  try {
    const { name, age, place, contact } = req.body;
    const userDetail = await userDetails.findOne({ userId: req.session.user._id });
    if (userDetail) {
      // console.log("update post is working");
      const filter = { _id: userDetail._id };
      const update = { $set: { name, age, place, contact } };
      console.log(userDetail);
      const result = await userDetails.updateOne(filter, update);
      return res.redirect("/user/details");
    }
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).send("Internal Server Error");
  }
};
exports.deleteDetails = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/user/login");
    }

    const userDetail = await userDetails.findOne({ userId: req.session.user._id });
    if (!userDetail) {
      return res.redirect("/user/");
    }

    await userDetails.deleteOne({ userId: userDetail.userId });

    res.redirect("/user/details");
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).send("Internal Server Error");
    }
    res.redirect("/user/login");
  });
};
