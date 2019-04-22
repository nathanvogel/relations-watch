"use strict";
const joi = require("joi");
// store schema in variable to make it re-usable, see .body()

const entSchema = joi
  .object()
  .required()
  .keys({
    name: joi.string().required(),
    imageId: joi.string(),
    type: joi.number().required(),
    linkWikipedia: joi.string(),
    linkCrunchbase: joi.string(),
    linkTwitter: joi.string(),
    linkFacebook: joi.string(),
    linkYoutube: joi.string(),
    linkWebsite: joi.string(),
    domains: joi.array().items(joi.string())
  })
  .unknown(); // allow additional attributes

const relSchema = joi
  .object()
  .required()
  .keys({
    _from: joi.string().required(),
    _to: joi.string().required(),
    text: joi
      .string()
      .min(3)
      .max(288)
      .required(),
    type: joi
      .number()
      .integer()
      .required(),
    amount: joi.number(),
    exactAmount: joi.boolean(),
    sourceText: joi.string(),
    sources: joi.array().items(joi.string())
  })
  .unknown(); // allow additional attributes

module.exports = {
  entSchema,
  relSchema
};
