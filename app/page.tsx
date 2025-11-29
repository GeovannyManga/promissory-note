"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation'



const Formulario = () => {
  const router = useRouter()
  const [loader, setLoader] = useState(true);
  const [formData, setFormData] = useState({
    documentType: "",
    documentNumber: "",
    studentName: "",
    grade: "",
    schoolYear: "",
    guardianName: "",
    idNumber: "",
    email: "",
    phone: "",
    addres: "",
  });

  const [errors, setErrors] = useState({
    documentNumber: "",
    studentName: "",
    grade: "",
    email: "",
    guardianName: "",
    idNumber: "",
    phone: "",
    addres: ""
  });

  const date = new Date();
  const formattedDate = date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

 

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
        if (
          ![
            "PRE-JARDIN",
            "JARDIN",
            "TRANSICION",
            "PRIMERO",
            "SEGUNDO",
            "TERCERO",
            "CUARTO",
            "QUINTO",
            "SEXTO",
            "SEPTIMO",
            "OCTAVO",
            "NOVENO",
            "DECIMO",
            "UNDECIMO",
          ].includes(value)
        ) {
          errorMessage = "El grado no es válido.";
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
        case "phone":
  if (!/^\d{10}$/.test(value)) {
    errorMessage = "El número de teléfono debe tener 10 dígitos.";
  }
  break;
case "addres":
  if (!/^[a-zA-Z\s,.-]+$/.test(value)) {
    errorMessage = "La dirección no puede contener caracteres especiales.";
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
    setLoader(false)
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
    const content2 = document.createElement("div");

    content.innerHTML = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Documento</title>
</head>
<body style="font-size: 12px;">
    <div>
      <div>
        <p style="text-align: left;">
            <span style="color: #000000;">${contador}</span>
        </p>
         <p style="text-align: right;">
            <span style="color: #000000;">Pagina 1/2</span>
        </p>
        <p style="text-align: center;">
            <span style="color: #000000;"><strong>CORPORACIÓN EDUCATIVA ADVENTISTA SUR DE BOGOTÁ</strong></span>
        </p>
        <p style="text-align: center;">
            <span style="color: #000000;"><strong>CARTA DE INSTRUCCIÓN</strong></span>
        </p>
        <p style="text-align: center;">
            <span style="color: #000000;"><strong>AUTORIZACIÓN PARA DILIGENCIAR EL DOCUMENTO CON ESPACIOS EN BLANCO PARA SER</strong></span>
        </p>
        <p style="text-align: center;">
            <span style="color: #000000;"><strong>CONVERTIDO EN PAGARÉ</strong></span>
        </p>
      </div>  
        <p style="text-align: left;">
            Tipo de documento <strong style="text-transform: uppercase;">${formData.documentType}</strong> 
            No. identificación <strong style="text-transform: uppercase;">${formData.idNumber}</strong>
        </p>
        <div style="font-size: 10px;">
        <p style="text-align: justify;">
            1. El cliente por medio del presente escrito autoriza a la CORPORACIÓN EDUCATIVA ADVENTISTA SUR DE BOGOTÁ "CEASB" de conformidad con el artículo 622 del código de comercio, en forma irrevocable y permanente para diligenciar sin previo aviso los espacios en blanco contenidos en el presente pagaré que ha otorgado a su orden, cuando exista incumplimiento de cualquier obligación a su cargo o se presente cualquier evento que permita a la CORPORACIÓN EDUCATIVA ADVENTISTA SUR DE BOGOTÁ "CEASB" acelerar las obligaciones conforme a los reglamentos de los servicios, de acuerdo con las siguientes instrucciones:
        </p>
        <p style="text-align: justify;">
            a) El lugar de pago será la ciudad de Bogotá. El lugar y fecha de emisión del pagaré serán el lugar y el día en que sea llenado por la CORPORACIÓN EDUCATIVA ADVENTISTA SUR DE BOGOTÁ "CEASB", y la fecha de vencimiento será el día siguiente al de la fecha de emisión.
        </p>
        <p style="text-align: justify;">
            b) El monto por concepto de capital será igual al valor de las obligaciones contraídas por el Contrato de Prestación de Servicios Educativos del (los) estudiante(s) <strong style="text-transform: uppercase;">${formData.studentName}</strong> identificada con el numero de documento <strong>${formData.documentNumber}</strong> de lo(s) grado(s) <strong style="text-transform: uppercase;">${formData.grade}</strong> por el año escolar 2026 exigibles a favor de la CORPORACIÓN EDUCATIVA ADVENTISTA SUR DE BOGOTÁ "CEASB", de las que EL PADRE DE FAMILIA/ACUDIENTE sea deudor individual, conjunto o solidario, o de las que sea garante o avalista, o de las que por cualquier motivo resulten a su cargo, más los valores que se relacionen con las anteriores obligaciones por concepto de honorarios de abogados, gastos administrativos y de cobranza, así como cualquier otra suma que se deba por concepto distinto de intereses.
        </p>
        <p style="text-align: justify;">
            c) El monto de intereses causados por mora corresponderá a la tasa máxima permitida por la Superintendencia Financiera por los servicios dejados de pagar.
        </p>
        <p style="text-align: justify;">
            d) En caso de incumplimiento o retardos frente a las obligaciones correspondientes a la prestación de servicios educativos a cargo del PADRE DE FAMILIA/ACUDIENTE, la CORPORACIÓN EDUCATIVA ADVENTISTA SUR DE BOGOTÁ "CEASB" queda autorizada para exigir el valor de dichas obligaciones contraídas por el deudor, garante o avalista, individual, conjunta o solidariamente, sin necesidad de requerimiento judicial o extrajudicial para constituir en mora, así como para incorporarlas en el pagaré.
        </p>
        <p style="text-align: justify;">
            e) Así mismo, el PADRE DE FAMILIA/ACUDIENTE autoriza expresamente a diligenciar los espacios que se han dejado en blanco en el pagaré, así como los espacios correspondientes a su nombre y domicilio.
        </p>
        </div>
        <p style="text-align: center;">
            <strong>PAGARÉ</strong>
        </p>
        <p style="text-align: justify; font-size:14px;">
            Yo, <strong style="text-transform: uppercase;">${formData.guardianName}</strong>, mayor de edad, con domicilio en Bogotá DC, identificado como aparece al pie de mi firma, actuando en mi propio nombre, declaro de manera expresa por medio del presente instrumento que SOLIDARIA e INCONDICIONALMENTE pagaré a la CORPORACIÓN EDUCATIVA ADVENTISTA SUR DE BOGOTÁ "CEASB", o a su orden, en sus instalaciones de la CLL 10B sur No. 18A-15 Luna Park, el día <strong style="text-transform: uppercase;">${formattedDate}</strong>, las siguientes cantidades:
        </p>
        <p style="text-align: left;">1. Por concepto de Prestación de Servicios Educativos, la suma de:</p>
        <div style="display: flex; flex-direction: row; width: 100%; margin-top: 20px;">
            <div style="display: flex; flex-direction: row; width: 50%;">
                <div style="width: 100%; height: 0; border: #000000 solid 1px; align-self: flex-end;"></div>
            </div>
            <div style="display: flex; flex-direction: column; justify-content: flex-end; text-align: right; padding-left: 1rem;">
                <p style="margin: 0;">(    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   )($) moneda corriente.</p>
            </div>
        </div>
        <p style="text-align: left;">
            2. Sobre la suma de capital mencionada en el numeral primero de este pagaré, reconoceré intereses de mora a la tasa máxima legalmente autorizada.
        </p>
        <p style="text-align: left;">Bogotá <strong style="text-transform: uppercase;">${formattedDate}</strong></p>
    </div>
</body>
</html>

    `;

    content2.innerHTML = `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Documento</title>
</head>
    <body  style="font-size: 10px; margin-top: 0;">
    <p style="text-align: left;"><span style="color: #000000;">${contador}</span></p>
    <p style="text-align: right;">
            <span style="color: #000000;">Pagina 2/2</span>
        </p>
<p style="text-align: center;"><span style="color: #000000;"><strong>CORPORACIÓN EDUCATIVA ADVENTISTA SUR DE BOGOTÁ.</strong></span></p>
<p style="text-align: left; font-size: 12px;">Yo,<strong>${formData.guardianName}</strong>, mayor de edad, con domicilio en Bogot&aacute; DC, identificado como aparece al pie de mi firma, actuando en mi propio nombre, declaro de manera expresa por medio del presente instrumento que SOLIDARIA e INCONDICIONALMENTE pagar&eacute; a la CORPORACIÓN EDUCATIVA ADVENTISTA SUR DE BOGOTÁ."CEASB", o a su orden, en sus instalaciones de la CLL 10B sur No. 18A-15 Luna Park, el día <strong>${formattedDate}</strong>, las siguientes cantidades<strong><br /></strong></p>
<p style="text-align: center;"><span style="color: #000000;"><strong>AUTORIZACIONES Y DECLARACIONES</strong></span></p>
<div style="font-size: 8px;">
<p style="text-align: justify; color: #000000;">
    <strong>AVISO DE PRIVACIDAD Y PROTECCIÓN DE DATOS PERSONALES:</strong> Autorizo(amos) a la CORPORACIÓN EDUCATIVA ADVENTISTA SUR DE BOGOTÁ "CEASB", identificada con el NIT 901.069.944-3, domiciliada y ubicada en Bogotá - Colombia en la CLL 10B Sur No. 18A-15 Luna Park, teléfono 2891562 y página web: 
    <a href="http://www.cae.edu.co">www.cae.edu.co</a>, para que como responsable del tratamiento de datos personales de la información que usted suministra en virtud del vínculo contractual existente y el desarrollo del objeto social de nuestra entidad, recolecte, almacene, use y circule los datos para los siguientes fines: realizar inscripción a servicios educativos; enviar invitaciones y comunicaciones de eventos, foros y talleres; enviar comunicados relacionados con el objetivo social de "CEASB"; responder solicitudes presentadas; permitir el registro fotográfico y audiovisual durante eventos presenciales, con el fin de generar y publicar noticias en diferentes medios de comunicación, portales y redes sociales, respetando los derechos de autor; transferir datos a filiales y aliados estratégicos; transmitir información a proveedores que apoyen eventos; remitir encuestas de satisfacción; generar y publicar directorios, informes o boletines en nuestros portales; y elaborar estadísticas e informes. Estas finalidades se podrán realizar a través de medios físicos, electrónicos o telefónicos. Usted podrá consultar nuestras políticas de protección de datos personales y confidencialidad en 
    <a href="http://www.cae.edu.co/portaldedatospersonales">http://www.cae.edu.co/portaldedatospersonales</a>. Para resolver dudas o ejercer sus derechos, puede escribirnos al correo 
    <a href="mailto:protecciondedatos@cae.edu.co">protecciondedatos@cae.edu.co</a> o hacerlo directamente en nuestra sede, cumpliendo lo establecido en la Ley Estatutaria 1581 de 2012 y el Decreto 1377 de 2013. Igualmente, autorizo a "CEASB" a tratar los datos personales de estudiantes sobre los cuales ejerza patria potestad o representación legal, resaltando que es de carácter facultativo responder preguntas sobre datos sensibles o de menores de edad. Sus derechos como titular de datos personales incluyen: acceder gratuitamente a los datos proporcionados; conocer, actualizar y rectificar información parcial, inexacta o incompleta; solicitar prueba de la autorización otorgada; revocar la autorización y/o solicitar la supresión de datos, salvo cuando exista un deber legal que lo impida; y abstenerse de responder preguntas sobre datos sensibles. Finalmente, si desea que sus datos sean eliminados de nuestra base de datos, le solicitamos manifestarlo de manera expresa. De lo contrario, "CEASB" podrá continuar con el tratamiento de sus datos conforme a nuestras políticas de protección de datos y la normativa vigente.
</p>

<p style="text-align: justify; color: #000000;">
    <strong>AUTORIZACIÓN DE CONSULTA Y REPORTE DE INFORMACIÓN:</strong> En mi(nuestra) calidad de titular(es) de la información, actuando libre y voluntariamente, expido esta autorización de manera expresa e irrevocable a la CORPORACIÓN EDUCATIVA ADVENTISTA SUR DE BOGOTÁ "CEASB", identificada con el NIT 901.069.944-3, o a quien represente sus derechos o los ostente en el futuro como acreedor, para consultar, solicitar, suministrar, reportar, procesar y divulgar toda la información relacionada con mi(nuestro) comportamiento crediticio a las centrales de riesgo: TransUnion, Datacrédito (Experian Colombia S.A.), o cualquier base de datos que preste servicios similares. Esta información permitirá suministrar datos suficientes y adecuados al mercado sobre el estado de mi(nuestras) obligaciones contractuales, comerciales y crediticias. Por lo tanto, podrán conocer mi(nuestra) información quienes se encuentren afiliados a dichas centrales o tengan acceso a estas, conforme a la legislación aplicable. La permanencia de mi(nuestra) información en dichas bases de datos será determinada por las normas legales vigentes y la jurisprudencia aplicable, las cuales contienen mis(nuestros) derechos y obligaciones, que conozco(conocemos) plenamente. En caso de que en el futuro el autorizado en este documento realice una venta de cartera o cesión de contratos a cualquier título respecto de las obligaciones a mi(nuestro) cargo, la presente autorización se extenderá al nuevo titular en los mismos términos y condiciones. Declaro(amos) que estoy(amos) obligado(s) a autorizar este tratamiento de información.
</p>
<p style="text-align: justify; color: #000000;">
    <strong>AUTORIZACIÓN USO DE DATOS SENSIBLES:</strong> Autorizo(amos) a la CORPORACIÓN EDUCATIVA ADVENTISTA SUR DE BOGOTÁ "CEASB" para que utilice mi(nuestra) huella con el fin de dar trámite a lo solicitado y/o autorizado en este documento. Así mismo, declaro(amos) que conozco(emos) y acepto(amos) que, al otorgar mi(nuestra) huella, estoy(amos) dando mi(nuestro) consentimiento y aceptación para la realización de los procesos solicitados y/o autorizados en este documento. Conozco(emos) que mi(nuestra) huella corresponde a un dato sensible y que no estoy(amos) obligados a autorizar su tratamiento.
</p>
<p style="text-align: justify;; color: #000000;">
    <strong>AUTORIZACIÓN DE DESTRUCCIÓN DE DOCUMENTOS:</strong> Autorizo(amos) a la CORPORACIÓN EDUCATIVA ADVENTISTA SUR DE BOGOTÁ "CEASB" para que, en el evento en que no exista una deuda contraída con la institución, lleve a cabo la destrucción de todos los documentos que he(mos) aportado con la solicitud del servicio y todo lo que haya(mos) firmado para el efecto. 
    <br><br>
    <strong>DECLARACIÓN DE RECEPCIÓN DE INFORMACIÓN:</strong> Declaro(amos) con mi(nuestras) firma(s) que la CORPORACIÓN EDUCATIVA ADVENTISTA SUR DE BOGOTÁ "CEASB" me(nos) ha informado sobre el contenido del (de los) contrato(s) y lo(s) ha puesto a mi(nuestra) disposición, el(los) cual(es) acepto(amos) de manera libre y espontánea. Así mismo, me(nos) obligo(amos) a consultar y revisar su contenido periódicamente. Declaro(amos) que se me(nos) informó y capacitó acerca de los procedimientos de bloqueo e inhabilitación de las plataformas educativas. Asimismo, sobre los términos y condiciones de los beneficios que la institución ofrece. De acuerdo con lo anterior, manifiesto(amos) que se me(nos) informó acerca de los costos asociados a los servicios de educación, los cuales acepto(amos), declaro(amos) que conozco(conocemos) que puedo(podemos) obtener más información en las oficinas de la CORPORACIÓN EDUCATIVA ADVENTISTA SUR DE BOGOTÁ "CEASB". 
    <br><br>
    Declaro(amos) que toda la información suministrada es veraz. Bogotá D.C a los <strong>${formattedDate}</strong>.
</p>
</div>
<table style="border-collapse: collapse; width: 40%; border: 1px solid black; margin-top: 10px; margin-bottom: 10px;">
    <tbody>
        <tr>
            <td style="width: 70%; height: 100px; border: 1px solid black; text-align: center; vertical-align: middle;">
                <!-- Puedes agregar contenido o dejarlo vacío -->
            </td>
            <td style="width: 30%; height: 100px; border: 1px solid black; text-align: center; vertical-align: middle;">
                <!-- Puedes agregar contenido o dejarlo vacío -->
            </td>
        </tr>
    </tbody>
</table>

<table style="border-collapse: collapse; width: 40%; border: 1px solid black;">
    <tbody>
        <tr>
            <td style="padding: 10px; border: 1px solid black; text-align: left;">
                <p style="margin: 0;">Nombres: <strong>${formData.guardianName}</strong></p>
                <p style="margin: 0;">No. identificación: <strong>${formData.idNumber}</strong></p>
            </td>
        </tr>
    </tbody>
</table>

</body>
</html>
    `;
    


  


    const html2pdf = (await import("html2pdf.js")).default;

   
    const combinedContent = document.createElement("div")
    combinedContent.appendChild(content);
    combinedContent.appendChild(content2);
  
    const optionsto = {
      margin: 0.5,
      filename: `Pagaré_y_Aturozacion_${formData.documentNumber}_${contador}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      pagebreak: {
        mode: ['avoid-all'],
    // Divide la página antes del elemento con esta clase
    },

    };
  
    // Generar el PDF
    html2pdf().from(combinedContent).set(optionsto).save();
    setLoader(true)
    router.push('/finish')
  };


  return (
    <div>
     {loader? (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
       <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Formulario de Pagaré
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Campo de Número de Documento */}
        <div>
          <label
            htmlFor="documentNumber"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Número de Documento Estudiante:
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
            Nombre y Apellido del Estudiante:
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
          <select
            id="grade"
            value={formData.grade}
            onChange={handleChange}
            className="mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full"
            required
          >
            <option value="">Seleccione un grado</option>
            <option value="PRE-JARDIN">PRE-JARDIN</option>
            <option value="JARDIN">JARDIN</option>
            <option value="TRANSICION">TRANSICION</option>
            <option value="PRIMERO">PRIMERO</option>
            <option value="SEGUNDO">SEGUNDO</option>
            <option value="TERCERO">TERCERO</option>
            <option value="CUARTO">CUARTO</option>
            <option value="QUINTO">QUINTO</option>
            <option value="SEXTO">SEXTO</option>
            <option value="SEPTIMO">SEPTIMO</option>
            <option value="OCTAVO">OCTAVO</option>
            <option value="NOVENO">NOVENO</option>
            <option value="DECIMO">DECIMO</option>
            <option value="UNDECIMO">UNDECIMO</option>
          </select>
          {errors.grade && (
            <p className="text-red-500 text-sm mt-1">{errors.grade}</p>
          )}
        </div>
        {/* Campo de Tipo de Documento */}
        <div>
          <label
            htmlFor="documentType"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Tipo de Documento del Acudiente:
          </label>
          <select
            id="documentType"
            value={formData.documentType}
            onChange={handleChange}
            className="mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full"
          >
            <option value="">Seleccione</option>
            <option value="CC">Cédula de ciudadanía</option>
            <option value="CE">Cédula de extranjería</option>
            <option value="PEP">Permiso especial de permanecia</option>
            <option value="PPT">Permiso por Protección Temporal</option>
          </select>
          {Object.values(formData).every((value) => value === "") ||
            (formData.documentType === "" && (
              <p className="text-red-500 text-sm mt-1">
                Elige un tipo de documento válido
              </p>
            ))}
        </div>

        {/* Campo de Nombre del Acudiente */}
        <div>
          <label
            htmlFor="guardianName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nombre y Apellido del Acudiente:
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
  
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="phone">Número de Celular</label>
  <input  onChange={handleChange} 
    className="mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full"
    required type="number" name="phone" id="phone" />
  {errors.phone && (
    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
  )}
</div>

<div>
  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="addres">Direccion de Residencia</label>
  <input  onChange={handleChange}
    className="mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 w-full"
    required type="text" name="addres" id="addres" />
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
      ) :(
        <div className="flex justify-center items-center h-screen w-screen">
  <div
    className="flex justify-center items-center h-[200px] w-[200px] bg-center bg-cover"
    style={{ backgroundImage: "url('/load-32.gif')" }}
  ></div>
</div>


      )
      }
      </div>
  );
};

export default Formulario;
