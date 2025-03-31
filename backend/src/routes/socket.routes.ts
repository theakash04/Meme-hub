import { Socket } from "socket.io";
import { io } from "../app";
import { userType } from "src/types/users";

const users: userType[] = []


function removeUser(userId: string) {
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
    }
}

io.on("connection", (socket: Socket) => {
    socket.on("register-user", (data: { name: string }) => {
        const newUser: userType = { id: socket.id, name: data.name }
        users.push(newUser)
        console.log(`Registered user: ${data.name} with ID: ${socket.id}`)

        io.emit("user-details", users)
    })

    socket.on("object-updated", (data) => {
        socket.broadcast.emit('object-updated', data)
    })

    // user mouse move
    socket.on("user-move", (data: { x: number, y: number }) => {
        const userMove = {
            id: socket.id,
            x: data.x,
            y: data.y,
        }
        socket.broadcast.emit('user-move', userMove)
    })


    // Handle disconnection
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        removeUser(socket.id)
        io.emit("user-details", users);
    });
});
