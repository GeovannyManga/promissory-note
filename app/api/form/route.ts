import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { JWT } from 'google-auth-library';
import dotenv from 'dotenv';
dotenv.config()

// Definir un tipo para los datos del formulario
interface FormData {
    documentType: string;
    documentNumber: string;
    studentName: string;
    grade: number;
    guardianName: string; // Agregar más campos si es necesario
    idNumber: string;
    email: string;
}

// Manejo de solicitud POST
export async function POST(req: Request) {
  // Obtener los datos del cuerpo de la solicitud y hacer el cast a FormData
  const body: FormData = await req.json();
  console.log('Datos del formulario:', body);

  // Función para agregar datos a Google Sheets
  const addDataToGoogleSheets = async (sheetId: string, formData: FormData) => {
    try {
      // Crear una instancia de JWT usando el archivo de clave
      const jwtClient = new JWT({
        keyFile: 'secrets.json', // Ruta del archivo de credenciales JSON
        scopes: ['https://www.googleapis.com/auth/spreadsheets'], // Permiso de escritura
      });

      // Usar el cliente JWT con la API de Google Sheets
      const sheets = google.sheets({ version: 'v4', auth: jwtClient });

      // Obtener la última fila con datos en la hoja
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: 'Hoja 1', // Solo el nombre de la hoja
      });

      // Obtener el número de filas actuales (esto incluye filas vacías)
      const numRows = response.data.values ? response.data.values.length : 0;

      // Formatear los datos del formulario para que coincidan con las columnas de la hoja de cálculo
      const values = [
        [
           2010 + numRows  ||'',
          formData.documentType || '',
          formData.documentNumber || '',
          formData.email || '',
          formData.grade || 0,
          formData.studentName || '',
          formData.idNumber || '',
          formData.guardianName || '',
        ],
      ];

      // Parámetros para la función append
      const params = {
        spreadsheetId: sheetId, // ID de la hoja de cálculo
        range: `Hoja 1!A${numRows + 1}`, // Empujar los datos a la siguiente fila vacía
        valueInputOption: 'RAW', // O 'USER_ENTERED' para formato
        requestBody: {
          values: values, // Datos a insertar
        },
      };

      // Llamar al método append de la API de Google Sheets
      const appendResponse = await sheets.spreadsheets.values.append(params);

      // Imprimir la respuesta para verificar que los datos se insertaron
      console.log('Respuesta de la API:', appendResponse.data);

      return NextResponse.json({ message: 'Datos insertados correctamente', data: appendResponse.data });
    } catch (error) {
      console.error('Error al insertar los datos:', error);
      return NextResponse.json({ error: 'Hubo un problema al insertar los datos' }, { status: 500 });
    }
  };

  // Llamar a la función para agregar datos a la hoja de cálculo
  const sheetId = process.env.SHEET_ID || ''; // Tu ID de hoja de Google Sheets
  console.log(sheetId)
  return await addDataToGoogleSheets(sheetId, body);
}
