const express = require('express');
const app = express();
const cors = require('cors');
import userRoutes from "./routes/userRoutes.js";

app.use(cors());
app.use(express.json())

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


app.use("/users", userRoutes);

app.listen(4000, () => {console.log("backend running on port 4000 ")});
