export type Cupcake = CupcakeBody & {
    id: number
}

export type CupcakeBody = {
    name: string,
    price: number,
    description?: string,
    ingredients?: string[]  
}