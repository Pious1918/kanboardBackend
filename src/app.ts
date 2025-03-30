import express from "express";
import cors from "cors"
import morgan from "morgan"
import logger from "./utils/logger";
import userRoutes from './routes/userRoutes'

import connectDB from "./utils/dbconnection";
import passport from "passport";

import passconfi from "./middleware/passport"
passconfi
connectDB()

const app = express()

const morganFormat = ":method :url :status :response-time ms";

app.use(cors({
    origin: 'http://localhost:4200',
}))

app.use(express.json());
app.use(
    morgan(morganFormat, {
        stream: {
            write: (message) => {
                const logObject = {
                    method: message.split(" ")[0],
                    url: message.split(" ")[1],
                    status: message.split(" ")[2],
                    responseTime: message.split(" ")[3],
                };
                logger.info(JSON.stringify(logObject));
            },
        },
    })
);

app.use(passport.initialize())

app.use('/' , userRoutes)

export default app