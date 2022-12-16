const Validator = require('validatorjs');
const { ObjectId } = require('bson');
const agency = require('../models/agency');

const type = ["AGENCY","CLIENT"];
Validator.register('type', value => type.includes(value.toUpperCase()),'The type field must be agency or client.');
Validator.register('agencyId', async value => await checkAgency(value), 'The agencyId is invalid');
Validator.register('space_not', value => (/\s/g).test(value.toString()) ? false : true, "The field doesn't contains spaces.");

async function checkAgency(agencyId){
    let agencyCount = await agency.count({_id:ObjectId(agencyId)});
    if(agencyCount){
        return true;
    }else{
        return false;
    }
}
const validator = (body, rules, customMessages, callback) => {
    const validation = new Validator(body, rules, customMessages);
    validation.passes(() => callback(null, true));
    validation.fails(() => callback(validation.errors, false));
};

module.exports = validator;