import 'dotenv/config';
import http from 'http';
import app from './app.js';
import {Server} from 'socket.io';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import projectModel from './models/project.model.js';


const port = process.env.PORT || 3000;



const server = http.createServer(app);
const io = new Server(server);

//middleware to prevent ambigous meddling in realtiime server
io.use(async (socket, next) => {

    try {

        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[ 1 ];
        const projectId = socket.handshake.query.projectId;

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return next(new Error('Invalid projectId'));
        }


        socket.project = await projectModel.findById(projectId);


        if (!token) {
            return next(new Error('Authentication error'))
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return next(new Error('Authentication error'))
        }


        socket.user = decoded;

        next();

    } catch (error) {
        next(error)
    }

});



io.on('connection', socket => {

    console.log("a user is connected");

  socket.on('event', data => { /* … */ });
  socket.on('disconnect', () => { /* … */ });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})