import * as http from "http";

import { Express } from 'express';
import { Server } from 'socket.io';

interface Message {
    user: string
    message: string
    date: Date
}

interface ServerToClientEvents {
    user: (user: string) => void
    users: (users: string[]) => void
    message: (msg: Message) => void
    messages: (msgs: Message[]) => void
}

interface ClientToServerEvents {
    message: (message: string) => void;
}

interface InterServerEvents {
    // ping: () => void;
}

interface SocketData {
    user: string;
}

const messages: Message[] = []
const users: string[] = []

const createSocket = (app: Express) => {

    const server = http.createServer(app)
    const io = new Server<
        ClientToServerEvents,
        ServerToClientEvents,
        InterServerEvents,
        SocketData
    >(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    })

    io.on("connection", (socket) => {

        if (socket.connected && !socket.data.user) {

            const user = `User ${Math.round(Math.random() * 100000)}`;
            socket.data.user = user
            users.push(user)

            io.emit("users", users)
            socket.emit("messages", messages)
            socket.emit("user", user)

            socket.on("message", (message: string) => {
                const msg: Message = {
                    user: socket.data.user || '??',//
                    message,
                    date: new Date
                }
                io.emit('message', msg)
                messages.push(msg)
            });

            socket.on('disconnect', () => {
                users.splice(users.indexOf(socket.data.user || ''), 1)
                io.emit("users", users)
            })

        }

    });

    return server
}

export default createSocket