import { Socket } from "socket.io";
import { io } from "../app";
import { userType } from "src/types/users";
import { shapesType } from "src/types/shapes";

const users: userType[] = [];

function removeUser(userId: string) {
  const userIndex = users.findIndex((user) => user.id === userId);
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
  }
}

io.on("connection", (socket: Socket) => {
  socket.on("register-user", (data: { name: string }) => {
    const newUser: userType = { id: socket.id, name: data.name };
    users.push(newUser);
    console.log(`Registered user: ${data.name} with ID: ${socket.id}`);

    io.emit("user-details", users);
  });

  socket.on("canvas-data", (canvasData: shapesType[]) => {
    io.emit("canvas-data", canvasData);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    removeUser(socket.id);
    io.emit("user-details", users);
  });
});
