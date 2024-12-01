
import { google } from "googleapis";
import { NextResponse } from "next/server";
import { JWT } from "google-auth-library";
import dotenv from "dotenv";
dotenv.config();

const sheetId = process.env.SHEET_ID || "";

interface FormData {
  documentType: string;
  documentNumber: string;
  studentName: string;
  grade: number;
  guardianName: string;
  idNumber: string;
  email: string;
}

export async function POST(req: Request) {
  const body: FormData = await req.json();
  console.log("Datos del formulario:", body);

  const addDataToGoogleSheets = async (sheetId: string, formData: FormData) => {
    try {
      const jwtClient = new JWT({
        email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });

      const sheets = google.sheets({ version: "v4", auth: jwtClient });

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: "Hoja 1",
      });

      const numRows = response.data.values ? response.data.values.length : 0;

      const values = [
        [
          2010 + numRows || "",
          formData.documentType || "",
          formData.documentNumber || "",
          formData.email || "",
          formData.grade || 0,
          formData.studentName || "",
          formData.idNumber || "",
          formData.guardianName || "",
        ],
      ];

      const params = {
        spreadsheetId: sheetId,
        range: `Hoja 1!A${numRows + 1}`,
        valueInputOption: "RAW",
        requestBody: {
          values: values,
        },
      };

      const appendResponse = await sheets.spreadsheets.values.append(params);

      console.log("Respuesta de la API:", appendResponse.data);

      return NextResponse.json({
        message: "Datos insertados correctamente",
        data: appendResponse.data,
      });
    } catch (error) {
      console.error("Error al insertar los datos:", error);
      return NextResponse.json(
        { error: "Hubo un problema al insertar los datos" },
        { status: 500 }
      );
    }
  };

  return await addDataToGoogleSheets(sheetId, body);
}

export async function GET() {
  try {
    const jwtClient = new JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth: jwtClient });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "Hoja 1!A:A",
    });

    const values = response.data.values;
    if (!values || values.length === 0) {
      return NextResponse.json(
        { message: "No hay datos en la columna A" },
        { status: 404 }
      );
    }

    const lastElement = values[values.length - 1][0];

    return NextResponse.json({ lastElement });
  } catch (error) {
    console.error("Error al obtener el último elemento:", error);
    return NextResponse.json(
      { error: "Hubo un problema al obtener el último elemento" },
      { status: 500 }
    );
  }
}
