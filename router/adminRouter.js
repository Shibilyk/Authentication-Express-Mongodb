const express = require("express");
const router = express.Router();
const {
  getAdminHome,
  adminLogOut,
  userList,
} = require("../controllers/adminController");
function isAdminLoggedIn(req, res, next) {
  if (req.session && req.session.admin) {
    next();
  } else {
    res.redirect("/admin/login");
  }
}

router
  .get("/home", getAdminHome)
  .get("/userList", userList)
  .get("/logout", adminLogOut);

module.exports = router;
