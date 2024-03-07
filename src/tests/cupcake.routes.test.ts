import app from '../app'
import request from "supertest"
import { CupcakeBody } from "../models/cupcake.interface"
import { clearCupcakes } from '../repositories/cupcake.database'


const CUPCAKE_BODY : CupcakeBody = {
    name: "Kara's cupcake",
    price: 5,
    description: "Store this Kara's cupcake",
    ingredients: ["flour", "eggs", "sugar"]
}

async function createCupcake(cupcake : CupcakeBody) : Promise<number> {
    const response = await request(app).post('/v2/cupcake').send(cupcake)
    expect(response.status).toBe(201)
    return response.body.cupcakeId
}

async function deleteCupcakeById(id: number) {
    const delResponse = await request(app).delete(`/v2/cupcake/${id}`)
    expect(delResponse.status).toBe(200)
}

describe('Test POST /cupcake endpoint', function() {

    beforeEach(() => {
        clearCupcakes()
    })

    afterEach(() => {
        clearCupcakes()
    })

    it('returns invalid input 405 when name is missing', async () => {

        const cupcake = {
            price: 5,
            description: "Store this Kara's cupcake",
            ingredients: ["flour", "eggs", "sugar"]    
        }
        const response = await request(app).post('/v2/cupcake').send(cupcake)
        expect(response.status).toBe(405)
        expect(response.body.message[0]).toEqual('cupcake name cannot be empty and must be string')
    
    })

    it('returns invalid input 405 when name is not string', async () => {
        const cupcake = {
            ...CUPCAKE_BODY,
            name: 24
        }
        const response = await request(app).post('/v2/cupcake').send(cupcake)
        expect(response.status).toBe(405)
        expect(response.body.message[0]).toEqual('cupcake name cannot be empty and must be string')
    })

    it('returns 201 success when desc and ingredients is missing', async() => {
        const cupcake = {
            name: "Sample cupcake",
            price: 10
        }
        const response = await request(app).post('/v2/cupcake').send(cupcake)
        expect(response.status).toBe(201)
        const cupcakeId = response.body.cupcakeId

        // cleanup
        deleteCupcakeById(cupcakeId)

    })

    it('returns invalid input 405 when ingredients is not an array', async () => {
        const cupcake = {
            ...CUPCAKE_BODY,
            ingredients: "sugar"
        }
        const response = await request(app).post('/v2/cupcake').send(cupcake)
        expect(response.status).toBe(405)
        expect(response.body.message[0]).toEqual('ingredients must be an array of strings')
    })

    it('returns invalid input 405 when ingredients contains non-string', async () => {
        const cupcake = {
            ...CUPCAKE_BODY,
            ingredients: ["flour", 234, "sugar"]
        }
        const response = await request(app).post('/v2/cupcake').send(cupcake)
        expect(response.status).toBe(405)
        expect(response.body.message[0]).toEqual('ingredient items must be string')
    })

})

describe('TEST GET /cucpake endpoint', function() {

    beforeEach(() => {
        clearCupcakes()
    })

    afterEach(() => {
        clearCupcakes()
    })

    it('returns an empty list', async() => {
        const response = await request(app).get('/v2/cupcake')
        expect(response.status).toBe(200)
        expect(response.body).toHaveLength(0)
    })

    it('returns a non-empty list', async() => {
        // Add cupcakes
        const firstCupcakeId = await createCupcake(CUPCAKE_BODY)
        const secondCupcakeId = await createCupcake({
            ...CUPCAKE_BODY,
            name: "Cako cupcake"
        })

        const getResponse = await request(app).get('/v2/cupcake')
        expect(getResponse.status).toBe(200)
        expect(getResponse.body).toHaveLength(2)        

        // cleanup
        deleteCupcakeById(firstCupcakeId)
        deleteCupcakeById(secondCupcakeId)
        
    })
})

describe('TEST GET /cupcake/:cupcakeId endpoint', function() {

    beforeEach(() => {
        clearCupcakes()
    })

    afterEach(() => {
        clearCupcakes()
    })

    it('returns 400 when alphanumeric id is supplied', async () => {
        const response = await request(app).get('/v2/cupcake/12ab3')
        expect(response.status).toBe(400)
        expect(response.body.message[0]).toEqual('cupcakeId must be an integer')
    })

    it('returns 404 not found', async () => {
        const response = await request(app).get('/v2/cupcake/1234')
        expect(response.status).toBe(404)
        expect(response.body.message).toMatch(/not found/)
    })

    it('returns 200 after successfully retrieving cupcake', async () => {

        // create cupcake
        const cupcakeId = await createCupcake(CUPCAKE_BODY)

        const response = await request(app).get(`/v2/cupcake/${cupcakeId}`)
        expect(response.status).toBe(200)
        expect(response.body).toMatchObject(CUPCAKE_BODY)

        // cleanup
        deleteCupcakeById(cupcakeId)

    })

})

describe('TEST PUT /cupcake/:cupcakeId endpoint', function() {

    beforeEach(() => {
        clearCupcakes()
    })

    afterEach(() => {
        clearCupcakes()
    })

    it("returns 404 not found", async() => {
        const response = await request(app).put('/v2/cupcake/123').send(CUPCAKE_BODY)
        expect(response.status).toBe(404)
        expect(response.body.message).toMatch(/not found/)
    })

    it("returns invalid input 405 when price is not number", async() => {
        const response = await request(app).put('/v2/cupcake/123').send({
            ...CUPCAKE_BODY,
            price: "free"
        })
        expect(response.status).toBe(405)
        expect(response.body.message).toMatch(/numeric/)
    })

    it("returns 200 after a cupcake is updated successfully", async () => {

        // create cupcake
        const cupcakeId = await createCupcake(CUPCAKE_BODY)

        // update it with a new name
        const response = await request(app).put(`/v2/cupcake/${cupcakeId}`).send({
            ...CUPCAKE_BODY,
            name: "New cupcake name"
        })
        expect(response.status).toBe(200)
        expect(response.body.name).toBe('New cupcake name')

        // cleanup
        deleteCupcakeById(cupcakeId)
    })
})

describe('TEST DELETE /cupcake/:cupcakeId endpoint', function() {

    beforeEach(() => {
        clearCupcakes()
    })

    afterEach(() => {
        clearCupcakes()
    })

    it("returns 400 when invalid id is supplied", async () => {
        const response = await request(app).delete('/v2/cupcake/:1aa43')
        expect(response.status).toBe(400)
        expect(response.body.message[0]).toMatch(/integer/)
    })

    it("returns 404 when cupcake not found", async () => {
        const response = await request(app).delete('/v2/cupcake/143')
        expect(response.status).toBe(404)
        expect(response.body.message).toMatch(/not found/)
    })

    it("returns 200 when cupcake is deleted successfully", async () => {

        // create cupcake
        const cupcakeId = await createCupcake(CUPCAKE_BODY)

        // delete the cupcake
        let response = await request(app).delete(`/v2/cupcake/${cupcakeId}`)
        expect(response.status).toBe(200)
        expect(response.body.message).toMatch(/deleted/)

        // ensure you get 404 if you try to delete again
        response = await request(app).delete(`/v2/cupcake/${cupcakeId}`)
        expect(response.status).toBe(404)
        expect(response.body.message).toMatch(/not found/)
    })


})