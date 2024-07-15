import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from "./routes/authRoute";
import messageRoutes from "./routes/messageRoute";
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin : 'http://localhost:3000',
}
));
//to parse application/json
app.use(express.json());
app.use(cookieParser()); // to parse cookies

app.use('/api/auth',authRoutes);
app.use('/api/messages',messageRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
