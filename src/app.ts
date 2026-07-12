import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { createRoutes } from "./modules/user/user.route";
import { authRoutes } from "./modules/auth/auth.route";
import { gearItemRoutes } from "./modules/gearItems/gearItem.route";
import { categoryRoutes } from "./modules/category/category.route";
import { rentalOrderRoutes } from "./modules/rentalOrder/rentalOrder.route";

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
app.use("/api/auth", createRoutes);
app.use("/api/admin", createRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/provider", rentalOrderRoutes);
app.use("/api", rentalOrderRoutes);
app.use("/api/provider", gearItemRoutes);
app.use("/api", gearItemRoutes);
app.use("/api/categories", categoryRoutes);

export default app;
