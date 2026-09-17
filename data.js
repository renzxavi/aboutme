
const START_YEAR = 2021;


const UI_TEXT = {
  es: {
    role: "Psicólogo | Analista Programador | Diplomatura en Business Analytics",
    now: "hoy",
    months: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
  },
  en: {
    role: "Psychologist | Software Developer | Diploma in Business Analytics",
    now: "today",
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  }
};




const EDUCATION = [
  {
     year:2021,
    institution: "Universidad de la República",
    es: { title: "Licenciado en Psicología" },
    en: { title: "Bachelor's Degree in Psychology" }
  },
  {
    year: 2024,
    institution: "CTC Salto | Educación Técnica y Profesional",
    es: { title: "Analista Programador" },
    en: { title: "Systems Analyst / Programmer" }
  },
  {
    year: 2025,
    institution: "Universidad de Aconcagua",
    es: { title: "Diplomatura en Business Analytics" },
    en: { title: "Business Analytics Diploma" }
  },
   {
    year: 2025,
    institution: "Jovenes a Programar",
    es: { title: "Desarrollo Web" },
    en: { title: "Web Developer" }
  },
  {
    startDate: "2026-08",
    institution: "Universidad de la República",
    es: { title: "Ingeniería en Computación (cursando materias)" },
    en: { title: "Computer Engineering / Currently pursuing" }
  }
];


const PROJECTS = [
  {
    date: "2023-03",
    institution: "Colegio Parroquial Santa Cruz",
    es: {
      title: "Talleres Educativos",
      description: "Diseño, organizo e imparto talleres de Informática y Robótica Inicial dirigidos a estudiantes de primero a sexto año de Educación Primaria. Planifico actividades prácticas y educativas orientadas al desarrollo del pensamiento computacional, la creatividad y el uso responsable de la tecnología como herramienta de aprendizaje."
    },
    en: {
      title: "Educational Workshops",
      description: "I design, organize, and deliver introductory Computer Science and Robotics workshops for students from first to sixth grade of primary school. I plan practical and educational activities focused on developing computational thinking, creativity, and the responsible use of technology as a learning tool."
    }
  },
  {
    date: "2026-08",
    institution: "Colegio Parroquial Santa Cruz",
    images: ["assets/cpsc1.png", "assets/cpsc2.png"],
    url: "https://www.colegioparroquialsantacruz.com/",
    es: {
      title: "Plataforma Web para Talleres",
      description: "Desarrollé una plataforma web para gestionar los talleres de Informática y Robótica Inicial y centralizar el contenido educativo, facilitando el acceso de los estudiantes al material de estudio y fortaleciendo el proceso de aprendizaje. La plataforma permite reducir el uso de fotocopias, minimizar la pérdida de trabajos y promover una mayor integración de la tecnología en el ámbito educativo."
    },
    en: {
      title: "Workshop Web Platform",
      description: "I developed a web platform to manage the Computer Science and Robotics workshops and centralize educational content, making learning materials more accessible to students and supporting the learning process. The platform helps reduce the use of printed materials, minimize the loss of assignments, and promote the integration of technology into the educational environment."
    }
  },
  {
    date: "2025-03",
    institution: "Assessmas (startup)",
    images: ["assets/assessmas1.png", "assets/assessmas2.png"],
    url: null,
    es: {
      title: "Analista de Datos",
      description: "Desarrollo de procesos de extracción, transformación, limpieza y análisis de datos empresariales, aplicando técnicas de Big Data, Inteligencia Artificial y Machine Learning. Procesamiento de grandes volúmenes de información, construcción y evaluación de modelos predictivos, identificación de patrones y generación de insights para apoyar la toma de decisiones basada en datos."
    },
    en: {
      title: "Data Analyst",
      description: "Developed data extraction, transformation, cleaning, and analysis processes using Machine Learning, Artificial Intelligence, and Big Data technologies. Processed and analyzed large datasets from multiple companies to identify patterns, generate actionable insights, and support data-driven decision-making."
    }
  },
  {
    date: "2025-10",
    institution: "CTC Salto | Educación Técnica y Profesional",
    url: "https://www.ctcsalto.edu.uy/",
    es: {
      title: "Docencia Universitaria",
      description: "Imparto la asignatura de Bases de Datos II y brindo clases de apoyo académico en diferentes asignaturas, además de tutorías para trabajos y proyectos de tesis dirigidas a estudiantes de la carrera de Analista Programador."
    },
    en: {
      title: "University Teaching",
      description: "Teach the Databases II course and provide academic support in various subjects, as well as tutoring for coursework and thesis projects for students in the Systems Analyst program."
    }
  }
];


const COLLABORATIONS = [
  {
    date: "2026-01",
    url: "https://paintingcreatures-a11y.github.io/200mates/",
    images: ["assets/mates2001.png", "assets/mates2002.png"],
    es: {
      title: "200mates",
      description: "Proyecto colaborativo desarrollado entre un grupo de amigos con diferentes intereses, conocimientos y perfiles, donde combinamos creatividad, diseño, programación, pruebas y análisis para convertir una idea relacionada con nuestra cultura."
    },
    en: {
      title: "200mates",
      description: "Collaborative project developed by a group of friends with diverse interests, knowledge, and backgrounds, where we combined creativity, design, programming, testing, and analysis to bring an idea related to our culture to life."
    }
  }
];
