"use client";

import React, { useState } from "react";



const Formulario = () => {
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
      <p style="text-align: left;"><span style="color: #000000;">${contador}</span></p>
      <p style="text-align: center;"><span style="color: #ff0000;"><strong>CAE</strong></span></p>
      <p style="text-align: center;"><span style="color: #ff0000;"><strong>CARTA DE INSTRUCCIÓN</strong></span></p>
      <p style="text-align: center;"><span style="color: #ff0000;"><strong>AUTORIZACIÓN PARA DILIGENCIAR EL DOCUMENTO CON ESPACIOS EN BLANCO PARA SER</strong></span></p>
      <p style="text-align: center;"><span style="color: #ff0000;"><strong>CONVERTIDO EN PAGARÉ</strong></span></p>
      <p style="text-align: left;">Tipo de documento ${formData.documentType} No. identificación ${formData.documentNumber}</p>
      <p style="text-align: left;">1. El cliente por medio del presente escrito autoriza a la CORPORACI&Oacute;N EDUCATIVA ADVENTISTA SUR DE BOGOTÁ "CEASB" de conformidad con el articulo 622 del código de comercio, en forma irrevocable y permanente para diligenciar sin previo aviso los espacios en blanco contenidos en el presente pagaré que ha otorgado a su órden, cuando exista incumplimiento de cualquier obligaci&oacute;n a su cargo o se presente cualquier evento que permita la CORPORACION EDUCATIVA ADVENTISTA SUR DE BOGOT&Aacute; "CEASB" acelerar las obligaciones conforme a los reglamentos de los servicios, de acuerdo con las siguientes instrucciones:</p>
      <p style="text-align: left;">a) El lugar de pago sera la ciudad de Bogotá el lugar y fecha de emision del pagaré seran el lugar y el día en que sea llenado por la CORPORACIÓN EDUCATIVA ADVENTISTA SUR DE BOGOTÁ "CEASB", y la fecha de vencimiento sera el día siguiente al de la fecha de emisión.</p>
      <p style="text-align: left;">b) El monto por concepto de capital ser&aacute; igual al valor de las obligaciones contraídas por el Contrato de Prestaci&oacute;n de Servicios Educativos del (los) estudiante(s) ${formData.studentName} de lo(s) grado(s) ${formData.grade} por el a&ntilde;o escolar 2024 exigibles a favor de la CORPORACIÓN EDUCATIVA ADVENTISTA SUR DE BOGOTÁ "CEASB" de las que EL PADRE DE FAMILIA/ACUDIENTE sea deudor individual, conjunto o solidario, o de las que sea garante o avalista, o de las que por cualquier motivo resulten a su cargo, mas los valores que se relacionen con las anteriores obligaciones por concepto de honorarios de abogados, gastos administrativos y de cobranza, as&iacute; como cualquier otra suma que se deba por concepto distinto de intereses</p>
      <p style="text-align: left;">c) El monto de intereses causados por mora correspondera a la tasa m&aacute;xima permitida por la Superintendencia Financiera por los servicios dejados de pagar.</p>
      <p style="text-align: left;">d) En caso de incumplimiento o retardos frente a las obligaciones correspondientes a la prestación de servicios educativos a cargo del PADRE DE FAMILIA/ACUDIENTE, La CORPORACIÓN EDUCATIVA ADVENTISTA SUR DE BOGOT&Aacute; "CEASB" queda autorizada para exigir el valor de dichas obligaciones contraidas por el deudor, garante o avalista, individual, conjunta o solidariamente, sin necesidad de requerimiento judicial o extrajudicial para constituir en mora, asi como para incorporarlas en el pagaré.</p><br>
      <p style="text-align: left;">e) Así mismo el PADRE DE FAMILIA /ACUDIENTE autoriza expresamente a diligenciar los espacios que se han dejado en blanco en el pagaré. así como los espacios correspondientes a su nombre y domicilio.</p>
      <p style="text-align: center;"><strong>PAGARÉ</strong></p>
      <p style="text-align: left;">Yo,${formData.guardianName}, mayor de edad, con domicilio en Bogot&aacute; DC, identificado como aparece al pie de mi firma, actuando en mi propio nombre, declaro de manera expresa por medio del presente instrumento que SOLIDARIA e INCONDICIONALMENTE pagar&eacute; a la CORPORACIÓN EDUCATIVA ADVENTISTA SUR DE BOGOTÁ."CEASB", o a su orden, en sus instalaciones de la CLL 10B sur No. 18A-15 Luna Park, el dia ${formattedDate}, las siguientes cantidades<strong><br /></strong></p>
      <p style="text-align: left;">1. Por concepto de Prestación de Servicios Educativos, la suma de:&nbsp;</p>
      <p style="text-align: left;">($) moneda corriente.&nbsp;</p>
      <p style="text-align: left;">2. Sobre la suma de capital mencionadas en el numeral primero de este pagare, reconocer&eacute; intereses de mora a la tasa maxima legalmente autorizada.</p>
      <p style="text-align: left;">Bogot&aacute; ${formattedDate}</p>
    `;;

    content2.innerHTML = `<p style="text-align: left;"><span style="color: #000000;">${contador}</span></p>
<p style="text-align: center;"><span style="color: #ff0000;"><strong>CAE</strong></span></p>
<p style="text-align: left;">Yo,${formData.guardianName}, mayor de edad, con domicilio en Bogot&aacute; DC, identificado como aparece al pie de mi firma, actuando en mi propio nombre, declaro de manera expresa por medio del presente instrumento que SOLIDARIA e INCONDICIONALMENTE pagar&eacute; a la CORPORACIÓN EDUCATIVA ADVENTISTA SUR DE BOGOTÁ."CEASB", o a su orden, en sus instalaciones de la CLL 10B sur No. 18A-15 Luna Park, el día ${formattedDate}, las siguientes cantidades<strong><br /></strong></p>
<p style="text-align: center;"><span style="color: #ff0000;"><strong>AUTORIZACIONES Y DECLARACIONES</strong></span></p>
<p style="text-align: left;"><span style="color: #000000;"><strong>AVISO DE PRIVACIDAD Y PROTECCI&Oacute;N DE DATOS PERSONALES</strong> autorizo(amos) a la CORPORACIÓN EDUCATIVA ADVENTISTA SUR DE BOGOTÁ "CEASB" identificada con el NIT 901.069.944-3, domiciliada y ubicada en Bogotá - Colombia en la CLL 10B Sur No. 18A - 15 Luna Park, telefono 2891562 y pagina web: <a href="http://www.cae.edu.co,">www.cae.edu.co,</a> para que como responsable del tratamiento de datos personales de la informaci&oacute;n que usted suministra en virtud del vinculo contraactual existente, el desarrollo del objeto social de nuestra entidad, su asistencia a nuestras instalaciones, del que se desprende la autorizaci&oacute;n para recolecci&oacute;n de datos, bien sea en medio fisico, digital, visual, en audio, se almacene, use y circule para: a: realizar inscripci&oacute;n a servicios educativos b: enviar invitaciones y/o comunicaciones de los eventos, foros, talleres y demas servicios de la CORPORACI&Oacute;N EDUCATIVA ADVENTISTA SUR DE BOGOT&Aacute; "CEASB", nuestras filiales o afiliados estrategicos, c: enviar comunicados relacionados con el objetivo social de la CORPORACI&Oacute;N EDUCATIVA ADVENTISTA SUR DE BOGOT&Aacute; "CEASB", d: enviar informaci&oacute;n y/o respuesta de las solicitudes presentadas e: durante los eventos presenciales permitir el registro fotografico y audivisual con el fin de generar y publicar noticias de los eventos, en los diferentes medios de comunicaci&oacute;, en nuestros portales y en redes sociales. En todo caso, los responsables respetaran los derechos de autoria y propiedad intelectual de las piezas utilizadas en material promocional o publicitario, sin que esto suponga una retribuci&oacute;n y/o compensaci&oacute;n economica alguna f: transferirlos a nuestras filiales, g: transmitirlos a los proveedores que apoyar&aacute;n los eventos, h: remitir encuestas de satisfacci&oacute;n si se requiere, y, i: generar y publicar noticias, directorios, informes, informes o boletines en nuestros protales y j: generar informes y estadisticas. estas finalidades se podr&aacute;n realizar atravez de medios fisicos, electronicos o telefonicos, usted podr&aacute; consultar las politicas de protecci&oacute;n de datos personales y confidencialidad de la informac0i&oacute;n, en cae.edu.co/portaldedatospersonales. Para resolver dudas o inquietudes relacionadas con el tratamiento de datos, presentar sus solicitudes y/o ejercer sus derechos, puede escribirnos al correo <a href="mailto:protecciondedatos@cae.edu.co,">protecciondedatos@cae.edu.co,</a> o hacerlo en nuestra sede, previo cumplimiento con lo descrito en la ley estatutaria 1581 de 2012 de protecci&oacute;n de datos y con el decreto 1377 de 2013. Igualmente autorizo a dicha entidad para dar tratamiento de datos de los estudiantes sobre los que ejerza patria potestad, sea el representante legal, el titular o acudiente y al igual que mis datos personales sensibles, resaltando de estos que es de caracter facultativo responder preguntas que versen sobre datos sensibles o sobre menores de edad , as&iacute; como todos aquellos con los que la entidad pueda contribuir al objetivo social y temas de la comunidad educativa de la CORPORACI&Oacute;N EDUCATIVA ADVENTISTA SUR DE BOGOTÁ "CEASB", as&iacute; mismo, la CORPORACI&Oacute;N EDUCATIVA ADVENTISTA SUR DE BOGOTÁ "CEASB", le informa que sus derechos como titular de datos p&eacute;rsonales son i: acceder en forma gratuita a los datos proporcionados que hayan sido objeto de tratamiento. ii: conocer, actualizar y rectificar la informaci&oacute;n frente a datos parciales, inexactos, incompletos, fraccionados, que induzcan a error, o a aquellos cuyo tratamiento este prohibido o no haya sido <style={margin-top:150px}br>autorizado iii: Solicitar prueba de la autorizaci&oacute;n otorgada. iv: revocar la autorizaci&oacute;n y/o solicitar la supresi&oacute;n del dato, siempre que no exista un deber legal o contraactual que impida eliminarlos. v: abstenerse de responderlas preguntas sobre datos sensibles. Finalmente, si desea que sus datos sean eliminados de nuestra base de datos, le informamos que debe manifestarlo de forma expresa, si por contrario no recibimos de parte suya alguna solicitud de suprimir sus datos; la CORPORACI&Oacute;N EDUCATIVA ADVENTISTA SUR DE BOGOTÁ "CEASB" podr&aacute; continuar realizando el tratamiento de sus datos de conformidad con la politica protecci&oacute;n de datos personales, de las politicas de la informaci&oacute;n y lo expresado en el siguiente aviso.</span></p>
<p style="text-align: left;"><span style="color: #000000;">AUTORIZACI&Oacute;N DE CONSULTA Y REPORTE DE INFORMACI&Oacute;N En mi(nuestra) calidad de titular(es) de la informaci&oacute;n, actuando libre y voluntariamente, suscrita me permito expedir autorizaci&oacute;n de manera expresa e irrevocable a la entidad CORPORACI&Oacute;N EDUCATIVA ADVENTISTA SUR DE BOGOTA "CEASB", identificada con el NIT. 9.1.069944-3 o a quien represente sus derechos u ostente en el futuro cualquier titulo en calidad de acreedor, a consultar, solciitar, suministrar, reportar, procesar y divulgar toda la informaci&oacute;n que se refiere a mi(nuestro) comportamiento crediticio, las centrales de riesgo: Transunion y datacredito (experian colombia S.A), o cualquier base de datos que existiera, que presten el mismo servicio o a quien represente sus derecho. Lo anterior suministra informaci&oacute;n suficiene y adecuada al mercado, sobre el estado de mi(nuestras) obligaciones contraidas en cualquier tipo de contrato del que se desprenda obligaciones, relaciones comerciales y crediticias, por lo tanto, conocer&aacute;n de mi(nuestra) informaci&oacute;n quienes se encuentren afiliados a dichas centrales y/o que tengan acceso a estas, de conformidad con la legislaci&oacute;n aolicacble. La permanencia de mi(nuestra) informaci&oacute;n en las bases de datos ser&aacute; determinada por el ordenamiento juridico aplicacble, en especial por las normas legales y la jurisprudencia, las cuales contienen mis(nuestros) derechos y obligaciones, que por ser publicos, conozco(conocemos) plenamente. En caso que en el futuro&nbsp; el autorizado en este documento efect&uacute;e una venta de cartera o cesi&oacute;n de contratos a cualquier t&iacute;tulo de las obligaciones a mi(nuestro) cargo a favor de un tercero, los efectos de la presente autorizaci&oacute;n se extender&aacute;n a &eacute;ste, en los mismos terminos y condiciones. Estoy(amos) obligado a autorizar su tratamiento.



<p style="text-align: left margin-top: 500px;"><span style="color: #000000;">AUTORIZACION USO DE DATOS SENSIBLES: Autorizo(amos) a la CORPORACI&Oacute;N EDUCATIVA ADVENTISTA SUR DE BOGOTÁ "CEASB" para que utilice mi(nuestra) huella con el fin de dar tramite a lo solicitado y/o autorizado en este documento. Asi mismo, declaro(amos) que conozco(emos) y acepto(amos) que por medio de mi(nuestra) huella estoy(amos) otorgando mi(nuestro) consentimiento y aceptacion para la realizacion de los procesos solicitados y/o autorizados en este documento. conozco(emos) que mi(nuestra) huella corresponde a un dato sensible y que no estoy(amos) obligados a autorizar su tratamiento.</span></p>




<p style="text-align: left; margin-top:460px"><span style="color: #000000;">AUTORIZACI&Oacute;N DE DESTRUCCI&Oacute;N DE DOCUMENTOS: Autorizo(amos) a la CORPORACI&Oacute;N EDUCATIVA ADVENTISTA SUR DE BOGOTÁ "CEASB" para que en el evento en que no exista una deuda contraida con la instituci&oacute;n, llevar&aacute; a cabo la destrucci&oacute;n de todos los documentos que he(mos) aportado con la solicitud del servicio y todo lo que haya(mos) firmado para el efecto.</span></p>
<p style="text-align: left;">DECLARACIÓN DE RECEPCIÓN DE INFORMACI&Oacute;N: Declaro(amos) con mi(nuestras) firma(s) que la <span style="color: #000000;">CORPORACI&Oacute;N EDUCATIVA ADVENTISTA SUR DE BOGOTÁ "CEASB" me (nos) ha informado sobre el contenido del (de los) contrato(s) y lo(s) ha puesto a mi(nuestra) disposicion, el(los) cual(es) acepto(amos) de maner alibre y espontanea; as&iacute; mismo me(nos) obligo(amos) a consultar y revisar su contenido periodicamente, decalro(amos) que se me(nos) informo y capacito acerca de los procedimientos el bloqueo e inhabilitacion de las plataformas<br> <br> educativas, Asimismo los terminos y condiciones de los beneficios que diera lugar ofrecidos por la instituci&oacute;n. De acuerdo con lo anterior, manifiesto(amos) que se me(nos) acerca de los costos asociados a los servicios de educaci&oacute;n, los cuales acepto(amos), declaro(amos) que conozco(conocemos) que puedo(podemos) obtener mas informaci&oacute;n en las oficinas de la CORPORACI&Oacute;N EDUCATIVA ADVENTISTA SUR DE BOGOT&Aacute; "CEASB</span>&nbsp;&nbsp;</p>
<p>Declaro(amos) que toda la informaci&oacute;n suministrada es veraz. Bogot&aacute; D.C a los ${formattedDate}</p>
<table style="border-collapse: collapse; width: 56.3177%; height: 119px;" border="1">
    <tbody>
    <tr style="height: 90px;">
    <td style="width: 35.7143%; height: 119px;">&nbsp;</td>
    <td style="width: 19.7951%; height: 119px;">&nbsp;</td>
    </tr>
    </tbody>
    </table>
    <table style="border-collapse: collapse; width: 56.4982%; height: 72px;" border="1">
    <tbody>
    <tr style="height: 72px;">
    <td style="width: 100%; height: 72px;">
    <p>Nombres: ${formData.guardianName}</p>
    <p>No. identificaci&oacute;n: ${formData.documentNumber}</p>
    </td>
    </tr>
    </tbody>
</table>
    `;
    

    const options = {
      margin: 0.5,
      filename: `Pagaré_${formData.documentNumber}_${contador}`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      paginate: {
        addLink: true,
        displayMode: 'fullpage',
        scale: 1.2,
        viewport: 'page',
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

  

    const options2 = {
      margin: 0.6,
      filename: `Autorización_${formData.documentNumber}_${contador}`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      paginate: {
        addLink: true,
        displayMode: 'auto-fit',
        scale: 0.5,
        viewport: 'page',
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    const html2pdf = (await import("html2pdf.js")).default;

     html2pdf().from(content2).set(options2).save();

    html2pdf().from(content).set(options).save();
    setLoader(true)
  };


  return (
    <div>
     {loader? (
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
