const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const userDetails = require("../models/detailsModel");
const session = require("express-session");

module.exports = {
  getAdminHome: (req, res) => {
    if (!req.session.user && !req.session.isAdmin) {
      res.redirect("/user/login");
    }
    res.render("./admin/adminHome");
  },
  userList: async (req, res) => {
    if (req.session.user && req.session.isAdmin) {
      const userAndData = await User.aggregate([
        {
          $lookup: {
            from: "detailsusers", 
            localField: "_id", 
            foreignField: "userId", 
            as: "userDetails", 
          },
        },
        {
          $unwind: {
            path: "$userDetails",
            preserveNullAndEmptyArrays: true, 
          },
        },
      ]);
      console.log(userAndData);
      return res.render("./admin/usersList", { user: userAndData });
    }
    res.redirect("/user/login");
  },
  adminLogOut: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/user/login");
      }
    });
  },
};
