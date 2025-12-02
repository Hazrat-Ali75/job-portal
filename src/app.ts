import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import jobRoutes from './routes/jobRoute';
import applicationRoutes from './routes/applicationRoute';

//configuration
const app = express();

app.use(cors());
app.use(express.json());

//routes

app.use("/api/auth", authRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/application", applicationRoutes);


app.get('/', (req, res) => {
    res.send("Job Portal Server is running");
})

export default app;
