import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';

//configuration
const app = express();

app.use(cors());
app.use(express.json());

//routes

app.use("/api/auth", authRoutes);


app.get('/', (req, res) => {
    res.send("Job Portal Server is running");
})

export default app;
