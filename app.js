const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const userRouter = require("./router/userRouter");
const adminRouter = require('./router/adminRouter')
const session  = require('express-session');

app.use(
  session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use("/user",userRouter)
app.use("/admin",adminRouter)


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
