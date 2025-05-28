import { Router, json } from "express";
import helmet from "helmet";

import { exampleRouter, schoolsRouter } from "./routes";

//---------------------------------------------------------------------------
const api: Router = Router();

// Apply core Middleware before all routers and middleware
api.use(json());

//---------------------------------------------------------------------------
// You may add app specific api router here.
// TODO: move all controllers in the controllers folder
api.use("/example", exampleRouter);
api.use("/schools", schoolsRouter);
// api.get("/", (req, res) => {
//   const status = {
//     info: "Welcome to express api version 1",
//     Status: "Running 1",
//   };
//   res.send(status);
// });

// --------------------------------------------------------------------
// You may add app specific middlewares here
// Global Helmet middleware applied after all router
api.use(helmet());

//---------------------------------------------------------------------------
export default api;
