import express from "express"
import { cupcakeBodyValidator, cupcakeIdValidator } from "../middleware/cupcake.middleware"
import CupcakeController from "../controllers/cupcake.controller"

export const cupcakeRouter = express.Router()

cupcakeRouter.get("/cupcake", CupcakeController.getAllCupcakes)

cupcakeRouter.post("/cupcake", cupcakeBodyValidator, CupcakeController.addCupcake)

cupcakeRouter.get("/cupcake/:cupcakeId", cupcakeIdValidator, CupcakeController.getCupcakeById)

cupcakeRouter.put("/cupcake/:cupcakeId", cupcakeIdValidator, cupcakeBodyValidator, CupcakeController.updateCupcakeById)

cupcakeRouter.delete("/cupcake/:cupcakeId", cupcakeIdValidator, CupcakeController.deleteCupcakeById)