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
app.use(
  helmet({
    // Izinkan frontend (origin lain) memuat resource seperti gambar upload.
    // Default helmet mengirim `Cross-Origin-Resource-Policy: same-origin`
    // yang memblokir <img> dari origin backend ke frontend (NotSameOrigin).
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.json({ status: "success", message: "Server is running" });
});


app.use("/api/", api);
app.use("/uploads", express.static("uploads"));

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);



export default app;