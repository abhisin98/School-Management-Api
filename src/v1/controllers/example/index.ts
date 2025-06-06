import { Request, Response } from "express";

const data = [
  { id: 1, name: "example data 1" },
  { id: 2, name: "example data 2" },
];

// --------------------------------------------------------------------
export function GET(req: Request, res: Response) {
  res.send(data);
}

// --------------------------------------------------------------------
export function POST(req: Request, res: Response) {
  data.push(req.body);
  res.send({ message: "Your data has been submited." });
}
