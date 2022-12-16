var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const secret = 'BHRTPO(TY&'
const Users = require('../models/users');

const AuthController = {
    async registerUser (req, res) {
        const { username, password} = req.body;
        let isUserExists = await Users.count({username:username.toLowerCase()});  
        if(!isUserExists){
            let hashedPassword = bcrypt.hashSync(password, 8);
            let newUser = {
                username: username,
                password: hashedPassword
            }
            const _data = await new Users(newUser).save();
            try{
                let token = jwt.sign({ id: _data._id }, secret, { expiresIn: 86400 });
                delete newUser.password;
                return res.status(200).send({ 
                    message:"LoggedIn successfully",
                    data:{ ...newUser, token: token }
                });
            }catch(err){
                return res.send('Error ' + err)
            }
        }else{
            return res.status(401).send({
                message: "Errors",
                "data": {
                    "errors": {
                        "username": [
                            "The username field must be unique."
                        ]
                    }
                },
            });
        }
    },

    async login (req, res) {
        try{
            const { username, password } = req.body;
            let user = await Users.findOne({username:username.toLowerCase()});
            if(!user) {
                return res.status(401).send({
                message: "Unauthorized User",
                "data": { "errors": { "username": [ "The username doesn't exists." ] } },
                });
            }
            let valid = await bcrypt.compare(password, user['password']);
            if(valid){
                delete user['_doc']['password'];
                let token = jwt.sign({ id: user._id }, secret, {expiresIn: 86400});
                return res.status(200).send({ 
                    message:"LoggedIn successfully",
                    data:{...user['_doc'], token:token}
                });
            }
            return res.status(401).send({
                message: "Unauthorized User",
                "data": { "errors": { "password": [ "Invalid password." ] }},
                });
        }catch(err){
            res.send('Error ' + err)
        }
    },

    async auth_user(req, res){
        return res.status(401).send({
            message: "Data retrieved successfully",
            "data": req.authInfo,
            });
    },
    
    async updateProfile(req, res){
        try{
            let updateObject = {};
            if(req.body.username){
                let checkUsernameExists = await Users.findOne({username:req.body.username.toLowerCase()});
                let userInfo = checkUsernameExists && checkUsernameExists['_doc'] ? checkUsernameExists['_doc'] : {};
                if(userInfo['_id'] && req.authInfo['_id'].toString() != userInfo['_id'].toString()){
                    return res.status(406).send({
                        message: "Error",
                        "data": { "errors": { "username": [ "The username must be unique." ] } },
                    });
                }
                updateObject['username'] = req.body.username.toLowerCase();
            }
            if(req.body.password) updateObject['password'] = crypt.hashSync(req.body.password, 8);
               const _data = await Users.updateOne({_id:req.authInfo['_id']},{$set:{...updateObject}})
               return res.status(200).send({
                    message: "Profile Updated Successfully",
                    "data": _data['_doc'],
                });
            }catch(err){
                console.log("Error",err)
                res.send('Error')
            }
    },
    
};

module.exports = AuthController;
