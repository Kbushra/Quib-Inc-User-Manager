import express from "express";
import app from "./app.js";
export default (req: express.Request, res: express.Response) => app(req, res);