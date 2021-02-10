import express from "express";
import config from './config'
import mongoose from 'mongoose'
import hpp from "hpp";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";


// Routes 
import postsRoutes from './routes/api/post';
import usersRoutes from './routes/api/user';
import authRoutes from './routes/api/auth';

const app = express();
const { MONGO_URI } = config;

app.use(hpp())
app.use(helmet())

app.use(cors({ origin: true, credentials: true }))
app.use(morgan("dev"));

app.use(express.json());

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology : true,
  useCreateIndex: true,
}).then(() => console.log('MongoDB connecting success!')).catch( err => console.log(err));

// Use routes
app.get("/");
app.use('/api/post', postsRoutes)
app.use('/api/user', usersRoutes);
app.use('/api/auth', authRoutes);


export default app;
