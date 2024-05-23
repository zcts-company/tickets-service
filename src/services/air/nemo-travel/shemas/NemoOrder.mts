import Joi from "joi";
const {date} = Joi.types()

export const nemoOrder = Joi.object({
    method:Joi.string(),
    apiVersion: Joi.string(),
    params:Joi.object(),
    data:Joi.object().keys({
        system:Joi.string(),
        orderType:Joi.string(),
        id:Joi.number().required(),
        lastModifiedDate:date.iso().required(),
        currentServerDate:date.iso().required(),
        customer:Joi.object(),
        passengers:Joi.object(),
        products:Joi.object()
    }).required()

}) 