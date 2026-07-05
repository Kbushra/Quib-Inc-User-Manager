import app from "./app.tsx";
import express from "express";
export default (req: express.Request, res: express.Response) => app(req, res);