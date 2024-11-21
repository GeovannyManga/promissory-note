"use client";

import React, { useState } from "react";
import html2pdf from "html2pdf.js";

const Formulario = () => {;
  const [formData, setFormData] = useState({
    documentType: "",
    documentNumber: "",
    studentName: "",
    grade: "",
    schoolYear: "",
    guardianName: "",
    idNumber: "",
    email: "",
  });

  const [errors, setErrors] = useState({
    documentNumber: "",
    studentName: "",
    grade: "",
    email: "",
    guardianName: "",
    idNumber: "",
  });

  const date = new Date();
const formattedDate = date.toLocaleDateString('es-ES', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});
 
  console.log( date.getFullYear)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
    validateField(id, value);
  };

  const validateField = (field: string, value: string) => {
    let errorMessage = "";
    switch (field) {
      case "documentNumber":
        if (!/^\d+$/.test(value)) {
          errorMessage = "El número de documento debe ser solo números.";
        }
        break;
      case "studentName":
        if (/[^a-zA-Z\s]/.test(value)) {
          errorMessage =
            "El nombre del estudiante debe contener solo letras y espacios.";
        } else if (/\s{2,}/.test(value)) {
          errorMessage =
            "El nombre del estudiante no debe contener espacios consecutivos.";
        }
        break;
      case "grade":
        if (!/^\d+$/.test(value)) {
          errorMessage = "El grado debe ser un número.";
        } else if (parseInt(value) < 1 || parseInt(value) > 11) {
          errorMessage = "El grado debe estar entre 1 y 11.";
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errorMessage = "El correo electrónico no es válido.";
        }
        break;
      case "guardianName":
        if (/[^a-zA-Z\s]/.test(value)) {
          errorMessage =
            "El nombre del acudiente debe contener solo letras y espacios.";
        } else if (/\s{2,}/.test(value)) {
          errorMessage =
            "El nombre del acudiente no debe contener espacios consecutivos.";
        }
        break;
      case "idNumber":
        if (!/^\d+$/.test(value)) {
          errorMessage = "El número de identificación debe ser solo números.";
        }
        break;
      case "documentType":
        if (!value || value.trim() === "" || value === "default") {
          errorMessage = "Debe seleccionar una opción válida.";
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: errorMessage,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      formData.documentType === "" ||
      formData.documentNumber === "" ||
      formData.email === "" ||
      formData.grade === "" ||
      formData.guardianName === "" ||
      formData.idNumber === "" ||
      formData.studentName === ""
    ) {
      console.log("Debe seleccionar una opción válida.");
      console.log(formData);
      return;
    }

    const response = await fetch("/api/form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (data.message) {
      alert("Formulario enviado correctamente");
    }

    const fetchLastElement = async () => {
      try {
        const response = await fetch("/api/form", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Último elemento:", data.lastElement);
        return data.lastElement; // Devuelve el último elemento
      } catch (error) {
        console.error("Error al obtener el último elemento:", error);
      }
    };

    // Ejemplo de uso:
    const contador = await fetchLastElement();

    const content = document.createElement("div");

    content.innerHTML = `
      <p style="text-align: left;"><span style="color: #000000;">${contador}</span></p>
      <p style="text-align: center;"><span style="color: #ff0000;"><strong>CAE</strong></span></p>
      <p style="text-align: center;"><span style="color: #ff0000;"><strong>CARTA DE INSTRUCCION</strong></span></p>
      <p style="text-align: center;"><span style="color: #ff0000;"><strong>AUTORIZACION PARA DILIGENCIAR EL DOCUMENTO CON ESPACIOS EN BLANCO PARA SER</strong></span></p>
      <p style="text-align: center;"><span style="color: #ff0000;"><strong>CONVERTIDO EN PAGARE</strong></span></p>
      <p style="text-align: left;">Tipo de documento ${formData.documentType} No. identificacion ${formData.documentNumber}</p>
      <p style="text-align: left;">1. El cliente por medio del presente escrito autoriza a la CORPORACI&Oacute;N EDUCATIVA ADVENTISTA SUR DE BOGOTA "CEASB" de conformidad con el articulo 622 del codigo de comercio, en forma irrevocable y permanente para diligenciar sin previo aviso los espacios en blanco contenidos en el presente pagare que ha otorgado a su orden, cuando exista incumplimiento de cualquier obligaci&oacute;n a su cargo o se presente cualquier evento que permita la CORPORACION EDUCATIVA ADVENTISTA SUR DE BOGOT&Aacute; "CEASB" acelerar las obligaciones conforme a los reglamentos de los servicios, de acuerdo con las siguientes instrucciones:</p>
      <p style="text-align: left;">a) El lugar de pago sera la ciudad de Bogota el lugar y fecha de emision del pagare seran el lugar y el dia en que sea llenado por la CORPORACION EDUCATIVA ADVENTISTA SUR DE BOGOTA "CEASB", y la fecha de vencimiento sera el dia siguiente al de la fecha de emision.</p>
      <p style="text-align: left;">b) El monto por concepto de capital ser&aacute; igual al valor de las obligaciones contrafdas por el Contrato de Prestaci&oacute;n de Servicios Educativos del (los) estudiante(s) ${formData.studentName} de lo(s) grado(s) ${formData.grade} por el a&ntilde;o escolar 2024 exigibles a favor de la CORPORACION EDUCATIVA ADVENTISTA SUR DE BOGOTA "CEASB" de las que EL PADRE DE FAMILIA/ACUDIENTE sea deudor individual, conjunto o solidario, o de las que sea garante o avalista, o de las que por cualquier motivo resulten a su cargo, mas los valores que se relacionen con las anteriores obligaciones por concepto de honorarios de abogados, gastos administrativos y de cobranza, as&iacute; como cualquier otra suma que se deba por concepto distinto de intereses</p>
      <p style="text-align: left;">c) El monto de intereses causados por mora correspondera a la tasa m&aacute;xima permitida por la Superintendencia Financiera por los servicios dejados de pagar.</p>
      <p style="text-align: left;">d) En caso de incumplimiento o retardos frente a las obligaciones correspondientes a la prestacion de servicios educativos a cargo del PADRE DE FAMILIA/ACUDIENTE, La CORPORACION EDUCATIVA ADVENTISTA SUR DE BOGOT&Aacute; "CEASB" queda autorizada para exigir el valor de dichas obligaciones contraidas por el deudor, garante o avalista, individual, conjunta o solidariamente, sin necesidad de requerimiento judicial o extrajudicial para constituir en mora, asi como para incorporarlas en el pagare.</p><br>
      <p style="text-align: left;">e) Asi mismo el PADRE DE FAMILIA /ACUDIENTE autoriza expresamente a diligenciar los espacios que se han dejado en blanco en el pagare. asi como los espacios correspondientes a su nombre y domicilio.</p>
      <p style="text-align: center;"><strong>PAGARE</strong></p>
      <p style="text-align: left;">Yo,${formData.guardianName}, mayor de edad, con domicilio en Bogot&aacute; DC, identificado como aparece al pie de mi firma, actuando en mi propio nombre, declaro de manera expresa por medio del presente instrumento que SOLIDARIA e INCONDICIONALMENTE pagar&eacute; a la CORPORACION EDUCATIVA ADVENTISTA SUR DE BOGOTA."CEASB", o a su orden, en sus instalaciones de la CLL 10B sur No. 18A-15 Luna Park, el dia ${formattedDate}, las siguientes cantidades<strong><br /></strong></p>
      <p style="text-align: left;">1. Por concepto de Prestacion de Servicios Educativos, la suma de:&nbsp;</p>
      <p style="text-align: left;">____________________________________________________($____________) moneda corriente.&nbsp;</p>
      <p style="text-align: left;">2. Sobre la suma de capital mencionadas en el numeral primero de este pagare, reconocer&eacute; intereses de mora a la tasa maxima legalmente autorizada.</p>
      <p style="text-align: left;">Bogot&aacute; ${formattedDate}</p>
    `;

    const options = {
      margin: 0.5,
      filename: `Pagaré_${formData.documentNumber}_${contador}`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().from(content).set(options).save();
  };


  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Formulario de Pagaré
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campo de Tipo de Documento */}
        <div>
          <label
            htmlFor="documentType"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Tipo de Documento:
          </label>
          <select
            id="documentType"
            value={formData.documentType}
            onChange={handleChange}
            className="mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full"
          >
            <option value="">Seleccione</option>
            <option value="CC">Cédula de ciudadanía</option>
            <option value="TI">Tarjeta de identidad</option>
            <option value="RC">Registro civil</option>
          </select>
          {Object.values(formData).every((value) => value === "") ||
            (formData.documentType === "" && (
              <p className="text-red-500 text-sm mt-1">
                Elige un tipo de documento válido
              </p>
            ))}
        </div>

        {/* Campo de Número de Documento */}
        <div>
          <label
            htmlFor="documentNumber"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Número de Documento:
          </label>
          <input
            id="documentNumber"
            type="text"
            value={formData.documentNumber}
            onChange={handleChange}
            className="mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full"
            required
          />
          {errors.documentNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.documentNumber}</p>
          )}
        </div>

        {/* Campo de Nombre del Estudiante */}
        <div>
          <label
            htmlFor="studentName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nombre del Estudiante:
          </label>
          <input
            id="studentName"
            type="text"
            value={formData.studentName}
            onChange={handleChange}
            className="mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full"
            required
          />
          {errors.studentName && (
            <p className="text-red-500 text-sm mt-1">{errors.studentName}</p>
          )}
        </div>

        {/* Campo de Grado */}
        <div>
          <label
            htmlFor="grade"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Grado:
          </label>
          <input
            id="grade"
            type="number"
            value={formData.grade}
            onChange={handleChange}
            className="mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full"
            required
          />
          {errors.grade && (
            <p className="text-red-500 text-sm mt-1">{errors.grade}</p>
          )}
        </div>

        {/* Campo de Correo Electrónico */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Correo Electrónico:
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full"
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Campo de Nombre del Acudiente */}
        <div>
          <label
            htmlFor="guardianName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nombre del Acudiente:
          </label>
          <input
            id="guardianName"
            type="text"
            value={formData.guardianName}
            onChange={handleChange}
            className="mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full"
            required
          />
          {errors.guardianName && (
            <p className="text-red-500 text-sm mt-1">{errors.guardianName}</p>
          )}
        </div>

        {/* Campo de ID del Acudiente */}
        <div>
          <label
            htmlFor="idNumber"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Número de Identificación del Acudiente:
          </label>
          <input
            id="idNumber"
            type="text"
            value={formData.idNumber}
            onChange={handleChange}
            className="mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full"
            required
          />
          {errors.idNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.idNumber}</p>
          )}
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Generar Pagaré
          </button>
        </div>
      </form>
    </div>
  );
};

export default Formulario;
