import express from 'express';
import morgan from 'morgan';
import connect from './config/db.js';
import userRoutes from './routes/user.routes.js';
import cookieParser from 'cookie-parser';
import projectRoutes from './routes/project.routes.js';
import cors from 'cors';//added cors


connect();
const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//setting up routes
app.use('/users', userRoutes);

//project routes
app.use('/projects', projectRoutes);


app.get('/', (req, res) => {
    res.send('Hello World!');
});

export default app; 