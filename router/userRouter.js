const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController');
const validation = require('../middleware/validation')

router
  .get('/', userController.userHome)
  .get('/register', userController.registerGet)
  .post('/register',validation,userController.registerPost)
  .get('/login',userController.loginGet)
  .post('/login',userController.loginPost)
  .get('/details',userController.detailsget)
  .post('/details',userController.detailsPost)
  .get('/logout', userController.logout)
  .get('/updateData',userController.updateDataGet)
  .post('/updateData',userController.updateDataPost)
  .get('/delete', userController.deleteDetails)
  .post('/delete', userController.deleteDetails)


module.exports = router


