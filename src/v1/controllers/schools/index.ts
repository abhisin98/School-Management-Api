import { Request, Response } from "express";
import SchoolsModel, {
  ISchool,
  ISchoolResult,
} from "../../../models/schools-model";

const schoolModel = new SchoolsModel();

interface Coordinates {
  latitude: number;
  longitude: number;
}
function haversineDistance(
  coordinates: Coordinates,
  data: ISchoolResult
): number {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = (data.latitude - coordinates.latitude) * (Math.PI / 180);
  const dLon = (data.longitude - coordinates.longitude) * (Math.PI / 180);
  const lat1 = coordinates.latitude * (Math.PI / 180);
  const lat2 = data.latitude * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in kilometers
}

function sortSchoolsByDistance(
  coordinates: Coordinates,
  data: ISchoolResult[]
): ISchoolResult[] {
  return data
    .map((item) => ({
      ...item,
      distance: haversineDistance(coordinates, item),
    }))
    .sort((a, b) => a.distance - b.distance);
}

function isValidLatitude(lat: number): boolean {
  return !isNaN(lat) && lat >= -90 && lat <= 90;
}

function isValidLongitude(lon: number): boolean {
  return !isNaN(lon) && lon >= -180 && lon <= 180;
}

// --------------------------------------------------------------------
export async function GET_List_Schools(req: Request, res: Response) {
  const { name, address, latitude, longitude } =
    req.query as unknown as ISchool;

  if (name && name?.length === 0) {
    res.status(400).json({ message: "Please check name params input." });
    return;
  }

  if (!address && address?.length === 0) {
    res.status(400).json({ message: "Please check address params input." });
    return;
  }

  if (latitude && !isValidLatitude(Number(latitude))) {
    res.status(400).json({ message: "Please check latitude params input." });
    return;
  }

  if (longitude && !isValidLongitude(Number(longitude))) {
    res.status(400).json({ message: "Please check longitude params input." });
    return;
  }
  try {
    const result = await schoolModel.find({ name, address });

    if (!result) {
      res.status(400).json({ message: "Cannot find any items." });
      return;
    }

    const sortedSchools = sortSchoolsByDistance(
      {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
      result
    );
    res.status(200).json({ result: sortedSchools });
    return;
  } catch (error) {
    console.error("Error in GET_List_Schools:", error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
}

// --------------------------------------------------------------------
export async function POST_Add_School(req: Request, res: Response) {
  const { name, address, latitude, longitude } = req.body;

  if (!name || typeof name !== "string" || name?.length === 0) {
    res.status(400).json({ message: "Please check name input." });
    return;
  }

  if (!address || typeof address !== "string" || address?.length === 0) {
    res.status(400).json({ message: "Please check address input." });
    return;
  }

  if (!latitude || !isValidLatitude(Number(latitude))) {
    res.status(400).json({ message: "Please check latitude input." });
    return;
  }

  if (!longitude || !isValidLongitude(Number(longitude))) {
    res.status(400).json({ message: "Please check longitude input." });
    return;
  }

  try {
    const result = await schoolModel.save({
      name,
      address,
      latitude: Number(latitude),
      longitude: Number(longitude),
    });
    res.status(200).json({ message: "Your data has been submited.", result });
    return;
  } catch (error) {
    console.error("Error in POST_Add_School:", error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
}
