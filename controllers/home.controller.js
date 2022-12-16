const validator = require('../helpers/validate');
const { ObjectId } = require('bson');
const agency = require('../models/agency');
const client = require('../models/client');

const HomeController = {

    async login(res, req){
        
    },

    async index (req, res) {
        try{
            const data = await agency.aggregate([
                {
                    $lookup:{
                        from:"clients",
                        let:{agency_id:"$_id"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $eq:["$agencyId","$$agency_id"]
                                    }
                                }
                            },
                            {
                                $project:{
                                    name:1,
                                    total_bill:1
                                }
                            },
                            {
                                $sort:{
                                    total_bill:-1
                                }
                            }
                        ],
                        as:"clients"
                    }
                },
                {
                    $project:{
                        name:1,
                        clients:1
                    }
                }
            ]);
            return res.status(200).send({ 
                message:"Data retrieved successfully",
                data:data
            });
        }catch(err){
            return res.send('Error ' + err)
        }
    },

    async getTopClients (req, res) {
        try{
            const data = await client.aggregate([
                {
                    $lookup:{
                        from:"agencies",
                        let:{agency_id:"$agencyId"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $eq:["$_id","$$agency_id"]
                                    }
                                }
                            },
                            {
                                $project:{
                                    name:1,
                                }
                            },
                        ],
                        as:"agency"
                    }
                },
                {
                    $sort:{
                        total_bill:-1
                    }
                },
                {
                    $project:{
                        name:1,
                        total_bill:1,
                        agencyName:{$arrayElemAt:["$agency.name",0]}
                    }
                }
            ]);
            return res.status(200).send({ 
                message:"Data retrieved successfully",
                data:data
            });
        }catch(err){
            return res.send('Error ' + err)
        }
    },

    async store (req, res) {
        const {type} = req.body;
        let validationRule = {};
        if(type.toUpperCase() === "AGENCY"){
            validationRule = {
                "name": "required|string",
                "address": "required|string",
                "state": "required|string",
                "city": "required|string",
                "phone": "required|integer",
            }
        }
        if(type.toUpperCase() === "CLIENT"){
            validationRule = {
                "agencyId": "required|string",
                "name": "required|string",
                "email": "required|string",
                "total_bill": "required|integer",
                "phone": "required|integer",
            }
        }
        validator(req.body, validationRule, {}, (err, status) => {
            if (!status) {
                return res.status(406)
                    .send({
                        success: false,
                        message: 'Errors',
                        data: err
                    });
            }
        });
        const { name, address, phone, city, state, address_2, agencyId, email, total_bill } = req.body;
        let newObject = {}, result = {};
        if(type.toUpperCase() === "AGENCY"){
            newObject = {
                name: name,
                address: address,
                address_2: address_2 ?? '',
                state: state,
                city: city,
                phone: phone
            }
            console.log("newObject", newObject)
            result = await new agency(newObject).save();
        }
        if(type.toUpperCase() === "CLIENT"){
            let checkAgency = await agency.count({_id:ObjectId(agencyId)});
            if(!checkAgency){
                return res.status(401).send({
                    message: "Errors",
                    "data": {
                        "errors": {
                            "agencyId": [
                                "agencyId not available."
                            ]
                        }
                    },
                });
            }
            newObject = {
                name: name,
                agencyId: ObjectId(agencyId),
                email: email,
                total_bill: total_bill,
                phone: phone
            }
            result = await new client(newObject).save();
        }
        try{
            return res.status(200).send({ 
                message:`${type.toUpperCase() === "AGENCY" ? "Agency" : "Client" } stored successfully`,
                data:result
            });
        }catch(err){
        	console.log("Error",err)
            return res.send('Error')
        }
    },

    async update(req, res){
        const validationRule = {
            "agencyId": "required|string",
            "name": "required|string",
            "email": "required|string",
            "total_bill": "required|integer",
            "phone": "required|integer",
        }
        validator(req.body, validationRule, {}, (err, status) => {
            if (!status) {
                return res.status(406)
                    .send({
                        success: false,
                        message: 'Errors',
                        data: err
                    });
            }
        });

        try{
            let { id } = req.params;
            const { agencyId, name, email, total_bill, phone } = req.body;
            let newObject = {};
            newObject = {
                name: name,
                agencyId: ObjectId(agencyId),
                email: email,
                total_bill: total_bill,
                phone: phone
            }
            const data = await client.updateOne({_id:ObjectId(id)},{$set:newObject});
            return res.status(200).send({ 
                message:"Client updated successfully",
                data:{_id:id, ...newObject}
            });
        }catch(err){
            return res.send('Error')
        }
    },

    async remove(req, res){
        try{
            await client.deleteOne({_id:ObjectId(req.params.id)})
            return res.status(200).send({ 
                message:"Client removed successfully",
                data:req.params.id
            });
        }catch(err){
        	console.log("err",err)
            return res.send('Error')
        }
    }

};

module.exports = HomeController;
