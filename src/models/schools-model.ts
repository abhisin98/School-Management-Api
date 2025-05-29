import db_config from "../config/db";
import mysql from "mysql2/promise";

// --------------------------------------------------------------------
const school_table = `
CREATE TABLE IF NOT EXISTS schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address VARCHAR(100) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL
)
`;

// --------------------------------------------------------------------
export interface ISchool {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}
export type ISchoolResult = ISchool & { id: number };
interface ISchoolsModel {
  save(data: ISchool): Promise<ISchoolResult | null>;
  findById(id: number): Promise<ISchoolResult | null>;
  find(searchParams?: Partial<ISchool>): Promise<ISchoolResult[] | null>;
}

// --------------------------------------------------------------------
class SchoolsModel implements ISchoolsModel {
  private connection: Promise<mysql.Connection>;
  constructor() {
    this.connection = this.initConnection();
  }
  private async initConnection(): Promise<mysql.Connection> {
    try {
      const conn = await mysql.createConnection(db_config);
      console.log("Connected to MySQL database");

      await conn.execute(school_table);
      console.log("School table initialized");

      return conn;
    } catch (error) {
      console.error("Error connecting to MySQL:", error);
      throw error;
    }
  }

  // --------------------------------------------------------------------
  public async save(data: ISchool): Promise<ISchoolResult | null> {
    if (!data) return null;
    const conn = await this.connection; // Ensure connection is resolved

    const [result] = await conn.execute(
      "INSERT INTO schools (name, address, latitude, longitude) VALUES(?,?,?,?)",
      [data.name, data.address, data.latitude, data.longitude]
    );

    // @ts-ignore
    return this.findById(result.insertId);
  }
  public async findById(id: number): Promise<ISchoolResult | null> {
    if (!id) return null;
    const conn = await this.connection; // Ensure connection is resolved

    const [rows] = await conn.query("SELECT * FROM schools WHERE id = ?", [id]);

    // @ts-ignore
    return rows.length ? (rows[0] as ISchoolResult) : null;
  }
  public async find(
    searchParams?: Partial<ISchool>
  ): Promise<ISchoolResult[] | null> {
    const conn = await this.connection;

    let query: string = "SELECT * FROM schools";
    let conditions: string[] = [];
    let params: any[] = [];

    if (searchParams?.name) {
      conditions.push("LOWER(name) LIKE ?");
      params.push(`%${searchParams.name.toLowerCase()}%`);
    }
    if (searchParams?.address) {
      conditions.push("LOWER(address) LIKE ?");
      params.push(`%${searchParams.address.toLowerCase()}%`);
    }
    if (searchParams?.latitude) {
      conditions.push("latitude = ?");
      params.push(Number(searchParams.latitude));
    }
    if (searchParams?.longitude) {
      conditions.push("longitude = ?");
      params.push(Number(searchParams.longitude));
    }

    if (conditions.length) {
      query += " WHERE " + conditions.join(" AND ");
    }

    const [rows] = await conn.query(query, params);

    // @ts-ignore
    return rows.length ? (rows as ISchoolResult[]) : null;
  }
}

export default SchoolsModel;
