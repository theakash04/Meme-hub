import express, { Express } from "express";
import dotenv from "dotenv"
import cors from "cors"
import { createServer } from "http";
import { Server } from "socket.io";
import router from "./routes/user.routes";

dotenv.config()
const app: Express = express()

const server = createServer(app)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())


const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ["*"];


app.use(cors({
    origin: function(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

const io = new Server(server, {
    cors: {
        origin: allowedOrigins, // Allow only specified origins
        methods: ["GET", "POST", "DELETE", "PUT"],
        credentials: true,
    }
})

//socket io handler
import "./routes/socket.routes"


//routes
app.use("/api", router)



export { io, server }



