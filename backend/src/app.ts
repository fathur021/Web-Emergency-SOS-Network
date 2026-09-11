import {config} from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import cokieParser from 'cookie-parser';
import api from "./api/index.api.js";
import * as middlewares from "./middleware/index.middleware.js";



config();
const CLIENT_URLS = process.env.CLIENT_URL!.split(",").map((u) => u.trim());
const app = express();
app.use(morgan('dev'));
app.use(cokieParser());
app.use(
  helmet({
    // Izinkan frontend (origin lain) memuat resource seperti gambar upload.
    // Default helmet mengirim `Cross-Origin-Resource-Policy: same-origin`
    // yang memblokir <img> dari origin backend ke frontend (NotSameOrigin).
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || CLIENT_URLS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Origin tidak diizinkan"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());


app.get("/", (req, res) => {
  res.json({ status: "success", message: "Server is running" });
});


app.use("/api/", api);
app.use("/uploads", express.static("uploads"));

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);



export default app;