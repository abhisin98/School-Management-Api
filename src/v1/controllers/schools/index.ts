import { Request, Response } from "express";

const data = [
  {
    id: 1,
    name: "School 1",
    address: "no address",
    latitude: "",
    longitude: "",
  },
  {
    id: 2,
    name: "School 2",
    address: "no address",
    latitude: "",
    longitude: "",
  },
];

// --------------------------------------------------------------------
export function GET_List_Schools(req: Request, res: Response) {
  res.send(data);
}

// --------------------------------------------------------------------
export function POST_Add_School(req: Request, res: Response) {
  data.push(req.body);
  res.send({ message: "Your data has been submited." });
}
