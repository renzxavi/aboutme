
const START_YEAR = 2021;


const UI_TEXT = {
  es: {
    role: "Psicólogo | Analista Programador | Diplomatura en Business Analytics",
    now: "hoy",
    months: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
    contact: "¿Querés saber más sobre mis proyectos? ¡Contactame!",
    contactCta: "LinkedIn"
  },
  en: {
    role: "Psychologist | Software Developer | Diploma in Business Analytics",
    now: "today",
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    contact: "Want to know more about my projects? Get in touch!",
    contactCta: "LinkedIn"
  }
};

const CONTACT_URL = "https://www.linkedin.com/in/renzoxavier/";




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
    date: "2025-10",
    institution: "Universidad de Aconcagua",
    es: { title: "Diplomatura en Business Analytics" },
    en: { title: "Business Analytics Diploma" }
  },
   {
    year: 2025,
    date: "2025-11",
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
      description: "Desarrollo de una aplicación  para uso interno de procesos de extracción, transformación, limpieza y análisis de datos aplicando técnicas de Big Data, Inteligencia Artificial y Machine Learning. "
    },
    en: {
      title: "Data Analyst",
      description: "Development of an internal application for data extraction, transformation, cleaning, and analysis processes using Big Data, Artificial Intelligence, and Machine Learning techniques."
    }
  },
  {
    date: "2025-09",
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
  },
  {
    // TODO: completar datos reales de Polycup
    date: "2026-09",
    institution: "Polycup",
    images: ["assets/polycup1.png", "assets/polycup2.png", "assets/polycup3.png", "assets/polycup4.png", "assets/polycup2.png"],
    url: "",
    es: {
      title: "Polycup",
      description: "Estudié para ser barista hace algunos años. Antes de eso había estudiado química, así que ya tenía curiosidad por las extracciones, las mezclas y las proporciones.\n\nTodavía preparo café. Pruebo cosas, cambio algo y vuelvo a probar. A veces sale mejor; otras, no tanto.\n\nCon el tiempo, algo quedó claro: el café hecho a solas pierde interés. El sabor no cambia, pero la experiencia sí.\n\nDe ahí surge esta idea: preparar café al mismo tiempo, cada uno desde su lugar, sabiendo que hay alguien al otro lado aprendiendo a preparar su receta favorita.\n\nNo hace falta mucho: café y alguien del otro lado que le dé sentido a todo lo que aprendí en mi curso de barista.\n\nSi la idea te atrae, me encantaría que preparemos café juntos."
    },
    en: {
      title: "Polycup",
      description: "I trained as a barista a few years ago. Before that I had studied chemistry, so I was already curious about extractions, blends, and ratios.\n\nI still make coffee. I try things, change something, and try again. Sometimes it turns out better; sometimes not so much.\n\nOver time, one thing became clear: coffee made alone loses its appeal. The flavor doesn't change, but the experience does.\n\nThat's where this idea comes from: making coffee at the same time, each from our own place, knowing there's someone on the other side learning to prepare their favorite recipe.\n\nIt doesn't take much: coffee, and someone on the other side who gives meaning to everything I learned in my barista course.\n\nIf the idea appeals to you, I'd love for us to make coffee together."
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
