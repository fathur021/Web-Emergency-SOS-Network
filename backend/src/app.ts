import { config } from "dotenv";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import cokieParser from "cookie-parser";
import api from "./api/index.api.js";
import * as middlewares from "./middleware/index.middleware.js";
import path from "path";
import { verifyImageUrl } from "./utils/signedUrl.utils.js";

config();
const CLIENT_URLS = process.env.CLIENT_URL!.split(",").map((u) => u.trim());
const app = express();
app.use(morgan("dev"));
app.use(cokieParser());
app.use(
  helmet({
    // Izinkan frontend (origin lain) memuat resource seperti gambar upload.
    // Default helmet mengirim `Cross-Origin-Resource-Policy: same-origin`
    // yang memblokir <img> dari origin backend ke frontend (NotSameOrigin).
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],
        "img-src": ["'self'", "data:", "blob:"],
        "object-src": ["'none'"],
        "frame-ancestors": ["'none'"], // halaman ini tidak boleh dibungkus <iframe>
        "upgrade-insecure-requests": null,
      }
    }
      
  }),
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
app.use(express.json({limit : "10kb"}));

app.get("/", (req, res) => {
  res.json({ status: "success", message: "Server is running" });
});

app.use("/api/", api);
app.get("/uploads/:filename", (req, res) => {
  const filename = path.basename(req.params.filename);
  const imagePath = `/uploads/${filename}`;

  const e = req.query.e;
  const sig = req.query.sig;
  const sah =
    typeof e === "string" &&
    typeof sig === "string" &&
    verifyImageUrl(imagePath, e, sig);

  if (!sah) {
    return res.status(403).json({
      status: "fail",
      message: "Tautan gambar tidak valid atau sudah kadaluarsa",
    });
  }

  // Kirim file dari folder private_uploads (lokasi fisik asli)
  res.sendFile(filename, { root: path.join(process.cwd(), "private_uploads") });
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
