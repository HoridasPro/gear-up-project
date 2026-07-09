import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import httpstatus from "http-status";

const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Hi Hello World");
});
app.get("/api/users/register", (req: Request, res: Response) => {
  const payload = req.body;
  console.log(payload);
  res.status(httpstatus.CREATED).json({
    message: "register succesfully",
  });
});

// app.use("/api/auth", authRoutes);
export default app;
