const Joi = require("joi").extend(require("@joi/date"));

module.exports.joiSessionSchema = Joi.object({
  session: Joi.object({
    // name: Joi.array().items(Joi.string()),
    name: Joi.any(),
    // name: Joi.string().required(),
    date: Joi.date().format("YYYY-MM-DD").utc().required(),
    // price: Joi.number().required().min(0),
  }),
});
