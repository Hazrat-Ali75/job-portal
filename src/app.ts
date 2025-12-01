import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import jobRoutes from './routes/jobRoute';

//configuration
const app = express();

app.use(cors());
app.use(express.json());

//routes

app.use("/api/auth", authRoutes);
app.use("/api/job", jobRoutes)


app.get('/', (req, res) => {
    res.send("Job Portal Server is running");
})

export default app;
