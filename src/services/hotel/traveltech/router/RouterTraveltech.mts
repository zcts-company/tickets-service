import express, { Response } from "express";
import { handService } from "./HandService.mjs";

export const routerTraveltech = express.Router();

routerTraveltech.use("/hand-check-service",handService)