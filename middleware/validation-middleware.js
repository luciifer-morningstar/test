const validator = require('../helpers/validate');
const agency = require('../models/agency');

var jwt = require('jsonwebtoken');
const { ObjectId } = require('bson');
const users = require('../models/users');
const secret = 'BHRTPO(TY&'

const createAgencyAndClient = (req, res, next) => {
    const validationRule = {
        "type": "required|string|type"
    }
    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            return res.status(406)
                .send({
                    success: false,
                    message: 'Errors',
                    data: err
                });
        } else {
            next();
        }
    });
}

const checkAuth = (req, res, next) => {
    var token = req.headers['authorization'];
    if (!token){
        res.status(401).send({ message: "Unauthorized User"});
    } else {
        jwt.verify(token, secret, async function(err, decoded) {
            if (err) return res.status(406).send({ message: 'Invalid Token.' });
            let user = await users.findOne({_id:ObjectId(decoded['id'])});
            if(!user) return res.status(401).send({ message: "Unauthorized User"});
            req['authInfo'] = user['_doc'];
            next();
        });
    }
}

const updateProfile = (req, res, next) => {
    const validationRule = {
        "username": "required|string|space_not"
    }
    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            return res.status(406)
                .send({
                    success: false,
                    message: 'Errors',
                    data: err
                });
        } else {
            next();
        }
    });
}

const registerUser = (req, res, next) => {
    const validationRule = {
        "username": "required|string|space_not",
        "password": "required|string|min:6"
    }
    
    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            return res.status(406)
                .send({
                    success: false,
                    message: 'Errors',
                    data: err
                });
        } else {
            next();
        }
    });
}

const loginUser = (req, res, next) => {
    const validationRule = {
        "username": "required|string|space_not",
        "password": "required|string|min:6"
    }
    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(406)
                .send({
                    success: false,
                    message: 'Errors',
                    data: err
                });
        } else {
            next();
        }
    });
}


module.exports = { 
    createAgencyAndClient,
    checkAuth,
    updateProfile,
    registerUser,
    loginUser
  }