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

const commentSchema = joi
  .object()
  .required()
  .keys({
    t: joi.string().required(),
    posted: joi.number().optional()
  });

const sourceLinkSchema = joi
  .object()
  .required()
  .keys({
    type: joi
      .number()
      .integer()
      .required(),
    sourceKey: joi.string(),
    comments: joi.array().items(commentSchema.optional())
  });

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
    sources: joi
      .array()
      .items(sourceLinkSchema.optional())
      .optional()
  })
  .unknown(); // allow additional attributes

const nullOrEmptyString = joi
  .string()
  .allow(null)
  .allow("");

const souSchema = joi
  .object()
  .required()
  .keys({
    ref: joi.string().required(), // Simplified URL or text
    type: joi
      .number()
      .integer()
      .required(), // Is it a LINK or REF ?
    authors: joi.array().items(joi.string().optional()), // Entity keys
    // LINK-only
    fullUrl: nullOrEmptyString,
    description: nullOrEmptyString,
    pTitle: nullOrEmptyString,
    pDescription: nullOrEmptyString,
    pAuthor: nullOrEmptyString,
    rootDomain: nullOrEmptyString,
    domain: nullOrEmptyString
  })
  .unknown(); // allow additional attributes

const relationWithSourceSchema = joi
  .object()
  .required()
  .keys({
    relation: relSchema,
    sourceLink: sourceLinkSchema,
    source: souSchema
  });

// const relationKeyWithSourceSchema = joi
//   .object()
//   .required()
//   .keys({
//     relation: joi.string(),
//     sourceLink: sourceLinkSchema,
//     source: souSchema
//   });

module.exports = {
  entSchema,
  relSchema,
  souSchema,
  relationWithSourceSchema,
  // relationKeyWithSourceSchema,
  commentSchema,
  sourceLinkSchema
};
