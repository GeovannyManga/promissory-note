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
  phone: number;
  addres: string;
}

// Función para generar un código dinámico basado en el número de filas
function generateDynamicCode(baseYear: string, currentRowCount: number): string {
  const formattedNumber = String(currentRowCount + 1).padStart(3, "0"); // Formatea con ceros
  return `${baseYear}_${formattedNumber}`;
}

export async function POST(req: Request) {
  const body: FormData = await req.json();
  console.log("Datos del formulario:", body);

  const addDataToGoogleSheets = async (sheetId: string, formData: FormData) => {
    try {
      // Configuración de autenticación con JWT
      const jwtClient = new JWT({
        email: process.env.GOOGLE_CLIENT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY, // Manejo de saltos de línea en claves
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });

      const sheets = google.sheets({ version: "v4", auth: jwtClient });

      // Obtener el conteo de filas actuales en la hoja
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: "Hoja 1!A:A",
      });

      const numRows = response.data.values ? response.data.values.length : 0;
      const dynamicCode = generateDynamicCode("2025", numRows); // Generar código dinámico

      const values = [
        [
          dynamicCode, // Columna A
          formData.documentType || "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          formData.documentNumber || "",
          formData.studentName || "",
          formData.grade || 0,
          formData.idNumber || "",
          formData.guardianName || "",
          formData.email || "",
          formData.addres || "",
          formData.phone || "",
        ],
      ];

      // Parámetros para insertar datos en la hoja
      const params = {
        spreadsheetId: sheetId,
        range: `Hoja 1!A${numRows + 1}`, // Añadir en la siguiente fila
        valueInputOption: "RAW",
        requestBody: {
          values,
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
    // Configuración de autenticación con JWT
    const jwtClient = new JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY, // Manejo de saltos de línea en claves
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth: jwtClient });

    // Leer la columna A
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "Hoja 1!A:A",
    });

    const values = response.data.values;
    if (!values || values.length === 0) {
      return NextResponse.json(
        { message: "No hay datos en la columna L" },
        { status: 404 }
      );
    }

    const lastElement = values[values.length - 1][0]; // Último elemento

    return NextResponse.json({ lastElement });
  } catch (error) {
    console.error("Error al obtener el último elemento:", error);
    return NextResponse.json(
      { error: "Hubo un problema al obtener el último elemento" },
      { status: 500 }
    );
  }
}
