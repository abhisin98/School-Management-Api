import cors, { CorsOptions } from "cors";
import express from "express";
import morgan from "morgan";

import apiv1 from "./v1";
declare const module: any;

//---------------------------------------------------------------------------
const PORT = process.env.PORT || 4000;
const app = express();

// You may add core option here
const corsOptions: CorsOptions = {
  // enabling CORS for some specific origins only.
  // origin: [],
  methods: ["GET", "POST", "PUT", "DELETE"],
  // this part is only for auth
  allowedHeaders: ["content-type"], // Allow specific headers
  credentials: true,
};

// Apply core Middleware before all routers and middleware
app.use(cors(corsOptions));
app.use(morgan("tiny"));

// --------------------------------------------------------------------
// You may add app specific api router here.
// Now mount the API routers
app.use("/api/v1", apiv1);
app.get("/", (req, res) => {
  res.send("Hello from root route.");
});

//---------------------------------------------------------------------------
const server = app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});

if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => {
    server.close();
    console.log("Server will close");
  });
}
