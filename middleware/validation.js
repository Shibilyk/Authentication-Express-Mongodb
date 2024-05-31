function validation(req, res, next) {
  const { email, password, confirm_password } = req.body;
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const emailCheck = emailPattern.test(email);

  const passwordPattern =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+[\]{}|;:,.<>?]).{6,}$/;
  const passwordCheck = passwordPattern.test(password);
  const passwordMatch = password === confirm_password;

  if (emailCheck && passwordCheck && passwordMatch) {
    next();
    console.log("if working");
  } else {
    console.log("not matching");

    return res.render("register", {
      errors: "please enter valid email or password",
    });
  }
}

module.exports = validation;
