import express, { Express, Request, Response } from "express";
import { cupcakeRouter } from "./routes/cupcake.routes";

const app: Express = express();

app.use(express.json())
app.use("/v2", cupcakeRouter)

export default app