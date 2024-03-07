import { body, param } from "express-validator";

export const cupcakeBodyValidator = [
    body('name', 'cupcake name cannot be empty and must be string').not().isEmpty().bail().isString(),
    body('price', 'cupcake price cannot be empty and must be numeric').not().isEmpty().bail().isInt(),
    body('description', 'description must be string').optional().isString(),
    body('ingredients', 'ingredients must be an array of strings').optional().isArray(),
    body('ingredients.*', 'ingredient items must be string').isString()
]

export const cupcakeIdValidator = [
    param('cupcakeId', 'cupcakeId must be an integer').exists().isInt()
]