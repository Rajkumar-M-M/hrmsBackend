import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.js'
import departmentRouter from './routes/department.js'
import employeeRouter from './routes/employee.js'
import connectToDatabase from './db/db.js'
import leaveRouter from './routes/leave.js'
import settingRouter from './routes/setting.js'
import dashboardRouter from './routes/dashboard.js'
import { Server } from "socket.io";
import http from "http";




connectToDatabase()
const app =  express()
app.use(cors())
app.use(express.json())
app.use(express.static('public/uploads'))
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // In production, restrict this to your frontend URL
    methods: ["GET", "POST"],
  },
});

// Mapping for employee socket connections
const userSocketMap = {}; // { userId: socket.id }

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle both admin and employee connections
  socket.on("register_user", ({ userId, role }) => {
    if (role === "admin") {
      socket.join("admins"); // For admin notifications
      console.log(`Admin joined room: admins`);
    } else {
      userSocketMap[userId] = socket.id; // For employee-specific notifications
      console.log(`Employee registered with ID ${userId} to socket ${socket.id}`);
    }
  });

  // Clean up on disconnect
  socket.on("disconnect", () => {
    for (const userId in userSocketMap) {
      if (userSocketMap[userId] === socket.id) {
        delete userSocketMap[userId];
        break;
      }
    }
    console.log("User disconnected:", socket.id);
  });
});

export { io, userSocketMap };
export default server;

app.use('/api/auth', authRouter)
app.use('/api/department', departmentRouter)
app.use('/api/employee', employeeRouter)
app.use('/api/leave', leaveRouter)
app.use('/api/setting', settingRouter)
app.use('/api/dashboard', dashboardRouter)


server.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`)
})
