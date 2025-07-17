import Joi from 'joi';

const bookSchema = Joi.object({
  title: Joi.string().required().trim().max(200).messages({
    'string.empty': 'Title is required',
    'string.max': 'Title cannot exceed 200 characters'
  }),
  author: Joi.string().required().trim().max(100).messages({
    'string.empty': 'Author is required',
    'string.max': 'Author name cannot exceed 100 characters'
  }),
  isbn: Joi.string().required().trim().pattern(/^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/).messages({
    'string.empty': 'ISBN is required',
    'string.pattern.base': 'Invalid ISBN format'
  })
});

const bookUpdateSchema = Joi.object({
  title: Joi.string().trim().max(200).messages({
    'string.max': 'Title cannot exceed 200 characters'
  }),
  author: Joi.string().trim().max(100).messages({
    'string.max': 'Author name cannot exceed 100 characters'
  })
});

export const validateBook = (data) => bookSchema.validate(data);
export const validateBookUpdate = (data) => bookUpdateSchema.validate(data);