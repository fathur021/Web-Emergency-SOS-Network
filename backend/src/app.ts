import {config} from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import api from "./api/index.api.js";
import * as middlewares from "./middleware/index.middleware.js";

config();
const app = express();
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.json({ status: "success", message: "Server is running" });
});


app.use("/api/", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);



export default app;