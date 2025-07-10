import express, { Response } from "express";
import { handService } from "./HandService.mjs";

export const routerTravelline = express.Router();

routerTravelline.use("/hand-check-service",handService)