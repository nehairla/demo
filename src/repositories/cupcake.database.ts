import { Cupcake, CupcakeBody } from "../models/cupcake.interface"
import fs from "fs"
import crypto from "crypto"

/*
NOT FOR PRODUCTION USE. 
This "database" stores cupcake objects in a file and relies on 
synchronous NodeJS API. This kind of persistence is for demo purposes only.
It will not scale for large number of objects since we are loading the
objects in memory for easy retrieval and update.

An RDBMS is an ideal solution for the database layer.
*/


type Cupcakes = {
    [key: number] : Cupcake
}

let cupcakes: Cupcakes = loadCupcakes()

function loadCupcakes(): Cupcakes {
    try {
        const data = fs.readFileSync("./repositories/cupcakes.json", "utf-8")
        return JSON.parse(data)
      } catch (error) {
        console.log(`Error while loading cupcakes: ${error}`)
        return {}
      }
}

function saveCupcakes() {
    try {
        fs.writeFileSync("./repositories/cupcakes.json", JSON.stringify(cupcakes), "utf-8")
      } catch (error) {
        console.log(`Error while saving cupcakes: ${error}`)
      }
}

export function clearCupcakes() {
    try {
        fs.writeFileSync("./repositories/cupcakes.json", JSON.stringify({}), "utf-8")
    } catch (error) {
        console.log(`Error : ${error}`)
    }
}

export async function create(cupcakeBody: CupcakeBody) : Promise<number | null> {
    try {
        // NOT FOR PRODUCTION USE. 
        // Like noted above ideally we would use auto-increment feature of DBMS
        // for generating unique ids for objects
        // For demo purpose we generate a random id for every object we create
        // As per docs the range (max - min) for randomInt must be less than 2^48.
        // hence using the range (0, 2^40) to be safe
        const id = crypto.randomInt(0, 2 ** 40)

        const cupcake: Cupcake = {
            ...cupcakeBody,
            id,
            price: Number(cupcakeBody.price)
        }
        cupcakes[id] = cupcake
        saveCupcakes()
        return id
    } catch (error) {
        console.log(`Error encountered while creating a cupcake: ${error}`)
        return null
    }
}

export async function getCupcakeById(id: number) : Promise<Cupcake | null> {
    return cupcakes[id]
}

export async function updateCupcakeById(id: number, cupcake: Cupcake) : Promise<Cupcake | null> {
    if(cupcakes[id]) {
        cupcakes[id] = cupcake
        saveCupcakes()
    }
    return cupcakes[id]
}

export async function deleteCupcakeById(id: number) {
    if (cupcakes[id]) {
        delete cupcakes[id]
        saveCupcakes()
    }
}

export async function listAllCupcakes() : Promise<Cupcake[]> {
    return Object.values(cupcakes)
}