import { Request, Response } from "express"
import { Result, ValidationError, matchedData, validationResult } from 'express-validator'
import { create, listAllCupcakes, getCupcakeById, updateCupcakeById, deleteCupcakeById } from "../repositories/cupcake.database"
import { Cupcake, CupcakeBody } from "../models/cupcake.interface"


class CupcakeController {

    async getAllCupcakes(req: Request, res: Response) {
        try {
            console.log("Retrieving all cupcakes...")
            const cupcakes = await listAllCupcakes()
            res.status(200).json(cupcakes)
        } catch (error) {
            res.status(500).json({ message: "Server error encountered while listing all cupcakes" })
        }   
    }

    async addCupcake(req: Request, res: Response) {
        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            // Invalid input
            res.status(405).json({ message: errors.array().map((error) => error.msg)  })
            return 
        }

        const validated_data = matchedData(req)
        const cupcake : CupcakeBody = {
            name: validated_data.name,
            price: validated_data.price,
            description: validated_data.description,
            ingredients: validated_data.ingredients,
        }
        try {
            const cupcakeId = await create(cupcake)
            if(cupcakeId) {
                console.log("Cupcake object created successfully")
                res.status(201).json({ cupcakeId })
            } else {
                throw new Error()
            }                 
        } catch (error) {
            res.status(500).json({ message: "Server error encountered while creating cupcake" })
        }

    }

    async getCupcakeById(req: Request, res: Response) {
        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            // invalid id supplied
            res.status(400).json({ message: errors.array().map((error) => error.msg) })
            return
        }

        const validatedData = matchedData(req)
        try {
            const cupcake = await getCupcakeById(validatedData.cupcakeId)
            if (cupcake) {
                console.log("Retrived a cupcake successfully")
                res.status(200).json(cupcake)
            } else {
                console.error("Could not retrive cupcake by id")
                res.status(404).json({ message: "Cupcake not found" })
            }                 
        } catch (error) {
            res.status(500).json({ message: "Server error encountered while retrieving cupcake by id" })
        }           

    }

    async updateCupcakeById(req: Request, res: Response) {
        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            const errorDetails = getHttpCodeFromValidationErrors(errors)
            res.status(errorDetails.statusCode).json({ message: errorDetails.message })
            return
        }

        const validatedData = matchedData(req)
        const cupcakeId = validatedData.cupcakeId

        try {
            const retrievedCupcake = await getCupcakeById(cupcakeId)
            if(retrievedCupcake) {
                
                const newCupcake: Cupcake = {
                    name: validatedData.name,
                    price: validatedData.price,
                    description: validatedData.description,
                    ingredients: validatedData.ingredients,
                    id: cupcakeId
                }

                const cupcake = await updateCupcakeById(cupcakeId, newCupcake)
                if(cupcake) {
                    console.log("Updated a cupcake successfully")
                    // success
                    res.status(200).json(cupcake)
                } else {
                    console.log("Could not update a cake")
                    throw new Error()
                }
            } else {
                // not found
                res.status(404).json({ message: `Cupcake with id ${validatedData.cupcakeId} not found` })
            }
        } catch (error) {
            res.status(500).json({ message: "Error encountered while updating cupcake" }) 
        }  
    }

    async deleteCupcakeById(req: Request, res: Response) {
        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            // invalid id supplied
            res.status(400).json({ message: errors.array().map((error) => error.msg) })
            return            
        }

        const validatedData = matchedData(req)
        const cupcake = await getCupcakeById(validatedData.cupcakeId)

        try {
            if (cupcake) {
                await deleteCupcakeById(validatedData.cupcakeId)
                console.log("Deleted a cake successfully")
                res.status(200).json({ message: "Cupcake deleted successfully" })
            } else {
                res.status(404).json({ message: "Cupcake not found" })
            }          
        } catch (error) {
            res.status(500).json({ message: "Server error encountered while deleting cupcake" })
        }  
    }
}

function getHttpCodeFromValidationErrors(errors: Result<ValidationError>) : { statusCode: number, message: string} {
    const validationErrors = errors.array()
    if(validationErrors.length <= 0) {
        return  { statusCode: -1, message: "No validation errors found" }
    }

    // look at the first validation error. we expect it to be of type field
    // and since we validate cupcakeID and then the body (if applicable)
    // we expect the id validation error first
    // The statusCode depends on the location of the validation error
    // if the validation error is in params then send bad request 400
    if( validationErrors[0].type == "field" && validationErrors[0].location == "params") {
        return {
            statusCode: 400,
            message: validationErrors[0].msg
        }
    }

    // if the validation error is in body then it was validation exception 405
    if( validationErrors[0].type == "field" && validationErrors[0].location == "body") {
        return {
            statusCode: 405,
            message: validationErrors[0].msg
        }
    }

    return  {
        statusCode: 500,
        message: "Server error encountered in parsing validation errors"
    }
}   

export default new CupcakeController()