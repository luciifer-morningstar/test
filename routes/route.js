const express = require('express')
const router = express.Router()
const HomeController = require('../controllers/home.controller')
const AuthController = require('../controllers/auth.controller')
const {createAgencyAndClient, checkAuth, registerUser, loginUser, updateProfile } = require('../middleware/validation-middleware');

router.get('/get',checkAuth, HomeController.index)
router.get('/top_client',checkAuth, HomeController.getTopClients)
router.post('/login_agency', HomeController.login);

router.post('/user/register_user',registerUser, AuthController.registerUser)
router.post('/user/login_user',loginUser,AuthController.login)
router.patch('/user/update',updateProfile, checkAuth,AuthController.updateProfile)
router.get('/user',checkAuth,AuthController.auth_user)

router.post('/create',createAgencyAndClient,HomeController.store)
router.patch('/client_update/:id',checkAuth, HomeController.update)
router.delete('/delete/:id',checkAuth, HomeController.remove)

module.exports = router
