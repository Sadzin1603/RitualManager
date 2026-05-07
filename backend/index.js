import express, { json } from 'express';
import cors from "cors";
import userRouter from './routes/User.js';
import ritualRouter from './routes/Ritual.js';
import authRouter from './routes/Auth.js';
import adminRouter from './routes/Admin.js';

const app = express()
app.use(express.json())
app.use(cors());

app.use('/user', userRouter)
app.use('/ritual', ritualRouter)
app.use('/auth', authRouter)
app.use('/admin', adminRouter)

app.listen(3000);