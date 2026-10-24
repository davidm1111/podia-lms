import type { Course, JupyterNotebook, Student, SiteConfig } from '../types';

// Default Site Configuration editable by the Professor
export const defaultSiteConfig: SiteConfig = {
  academyName: 'Academia Privada de Formación',
  heroBadge: 'Plataforma Privada de Aprendizaje',
  heroTitle: 'Aprende con Vídeo, Audio, Infografías y Código',
  heroSubtitle: 'Accede a tus módulos formativos privados, laboratorios de código interactivo y cuestionarios de evaluación.',
  heroCtaText: 'Ver Mi Plan de Estudios',
  featuresTitle: 'Módulos y Metodología de la Academia',
  features: [
    { title: 'Vídeos HD', description: 'Lecciones explicativas paso a paso con reproductor adaptativo.' },
    { title: 'Jupyter Notebooks (.ipynb)', description: 'Código Python interactivo ejecutable directamente en el navegador.' },
    { title: 'Audios y Podcasts', description: 'Contenido sonoro para repasar conceptos clave.' },
    { title: 'Cuestionarios Interactivos', description: 'Tests con corrección automática y explicación del profesor.' },
  ],
};

// Default Students: David with full access to all courses
export const defaultStudents: Student[] = [
  {
    id: 'stud-david',
    name: 'David',
    email: 'davidmeirino@gmail.com',
    enrolledCourseIds: ['course-python-ml', 'course-cloudflare-fullstack'],
    status: 'active',
    createdAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'stud-david-short',
    name: 'David',
    email: 'david',
    enrolledCourseIds: ['course-python-ml', 'course-cloudflare-fullstack'],
    status: 'active',
    createdAt: '2026-03-01T10:00:00Z',
  },
];

// Notebook 1: Introducción a Python & Variables
export const notebookIntroPython: JupyterNotebook = {
  cells: [
    {
      id: 'cell-md-1',
      cell_type: 'markdown',
      source: [
        '# 🐍 Lección Práctica: Fundamentos de Python y Notebooks\n',
        '¡Bienvenido al aula! En esta lección aprenderás los conceptos esenciales de Python que utilizaremos a lo largo de todo el programa.\n\n',
        '### ¿Qué es este entorno de código?\n',
        'Este módulo combina texto explicativo, bloques de código interactivo y resultados visuales.\n\n',
        '> **Objetivo:** Comprender tipos de datos dinámicos, list comprehensions y ejecución en vivo.',
      ],
      metadata: {},
    },
    {
      id: 'cell-code-1',
      cell_type: 'code',
      execution_count: 1,
      source: [
        '# Definición de estructuras de datos esenciales\n',
        'estudiante = {\n',
        '    "nombre": "David",\n',
        '    "modulo": "Inteligencia Artificial",\n',
        '    "progreso": 92.0,\n',
        '    "completado": True\n',
        '}\n',
        '\n',
        'print(f"Estudiante: {estudiante[\'nombre\']} | Progreso: {estudiante[\'progreso\']}%")',
      ],
      outputs: [
        {
          output_type: 'stream',
          name: 'stdout',
          text: ['Estudiante: David | Progreso: 92.0%\n'],
        },
      ],
      metadata: {},
    },
    {
      id: 'cell-code-2',
      cell_type: 'code',
      execution_count: 2,
      source: [
        '# Transformación de datos usando List Comprehensions\n',
        'calificaciones = [65, 88, 92, 45, 78, 96, 54, 89]\n',
        'aprobados = [round(c / 100, 2) for c in calificaciones if c >= 70]\n',
        'print("Calificaciones aprobadas normalizadas (0 a 1):", aprobados)\n',
      ],
      outputs: [
        {
          output_type: 'stream',
          name: 'stdout',
          text: ['Calificaciones aprobadas normalizadas (0 a 1): [0.88, 0.92, 0.78, 0.96, 0.89]\n'],
        },
      ],
      metadata: {},
    },
  ],
  metadata: {
    kernelspec: {
      display_name: 'Python 3',
      language: 'python',
      name: 'python3',
    },
  },
  nbformat: 4,
  nbformat_minor: 5,
};

// Default Courses with Cloud Resources (Google Drive, Dropbox, etc.)
export const defaultCourses: Course[] = [
  {
    id: 'course-python-ml',
    title: 'Python, Inteligencia Artificial y Machine Learning',
    slug: 'python-data-science-machine-learning',
    tagline: 'Aprende programación moderna, modelos de IA y análisis práctico con notebooks interactivos, vídeo y ejercicios.',
    description: 'Un curso completo organizado por módulos multimedia: vídeo explicativo, guías de estudio, lecciones interactivas de código Python ejecutable en navegador, podcast de audio, cuestionarios y descargas desde Google Drive o Dropbox.',
    badge: 'Curso Principal',
    themeColor: '#724ae8',
    price: 'Acceso Privado',
    isPublished: true,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-03-20T14:30:00Z',
    instructor: {
      name: 'Profe',
      title: 'Profesor y Director de Tecnología',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
      bio: 'Especialista en desarrollo cloud-native, Inteligencia Artificial aplicada y docencia tecnológica.',
    },
    features: [
      'Acceso privado exclusivo para alumnos registrados',
      'Módulos de Vídeo, Podcast de Audio, Infografías y Artículos',
      'Ejecución en vivo de código Python y Jupyter Notebooks (.ipynb)',
      'Descargas directas desde Google Drive y Dropbox',
      'Cuestionarios interactivos autocorregibles',
      'Panel de profesor con control de alumnos y personalización de la portada',
    ],
    faq: [],
    sections: [
      {
        id: 'sec-1',
        title: 'Módulo 1: Fundamentos y Bienvenida Multimedia',
        description: 'Introducción conceptual mediante vídeo, infografía y lectura.',
        lessons: [
          {
            id: 'les-vid-1',
            title: '1. Vídeo: Bienvenida y Hoja de Ruta del Curso',
            slug: 'video-bienvenida-hoja-de-ruta',
            type: 'video',
            durationMinutes: 8,
            summary: 'Conoce los objetivos de aprendizaje, la metodología y las herramientas que usaremos.',
            videoUrl: 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
            contentMarkdown: `### 📌 Puntos Clave de este Vídeo:
- Presentación del entorno de trabajo
- Cómo sacar el máximo partido a cada módulo multimedia
- Recomendación de dedicar 25 minutos al día a la práctica de código.`,
            resources: [
              {
                name: 'Diapositivas_Bienvenida.pdf (Google Drive)',
                url: 'https://drive.google.com',
                size: '2.4 MB',
                provider: 'google-drive',
              },
              {
                name: 'Material_Adicional.zip (Dropbox)',
                url: 'https://www.dropbox.com',
                size: '15.8 MB',
                provider: 'dropbox',
              },
            ],
          },
          {
            id: 'les-img-1',
            title: '2. Infografía: Arquitectura del Ecosistema de Datos',
            slug: 'infografia-ecosistema-datos',
            type: 'image',
            durationMinutes: 5,
            summary: 'Diagrama visual de las capas de un proyecto de Inteligencia Artificial.',
            imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
            imageCaption: 'Flujo de datos: Adquisición -> Limpieza con Pandas -> Modelado -> Despliegue en la Nube.',
            contentMarkdown: `Analiza detenidamente la infografía antes de comenzar los ejercicios prácticos de código.`,
          },
          {
            id: 'les-aud-1',
            title: '3. Audio: Podcast - Hábitos de un Programador de IA',
            slug: 'podcast-habitos-programador-ia',
            type: 'audio',
            durationMinutes: 12,
            summary: 'Episodio de audio para escuchar mientras repasas tus notas.',
            audioTitle: 'Episodio 1: Mentalidad de Resolución de Problemas y Debugging',
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            contentMarkdown: `> 🎧 **Notas del Episodio:**
- La importancia de leer mensajes de error sin frustración
- Descomposición de algoritmos complejos en funciones de menos de 20 líneas
- Práctica deliberada con datasets reales.`,
          },
        ],
      },
      {
        id: 'sec-2',
        title: 'Módulo 2: Práctica de Código y Evaluación',
        description: 'Laboratorio de código interactivo y cuestionario.',
        lessons: [
          {
            id: 'les-code-1',
            title: '4. Código: Fundamentos de Python en Vivo',
            slug: 'codigo-fundamentos-python',
            type: 'notebook',
            durationMinutes: 20,
            summary: 'Ejecuta y modifica código directamente en tu navegador con WebAssembly.',
            notebookData: notebookIntroPython,
            notebookFileName: 'fundamentos_python.ipynb',
            resources: [
              { name: 'fundamentos_python.ipynb', url: '#', size: '14 KB', provider: 'direct' },
              {
                name: 'Dataset_Ejercicios.csv (Dropbox)',
                url: 'https://www.dropbox.com',
                size: '4.2 MB',
                provider: 'dropbox',
              },
            ],
          },
          {
            id: 'les-quiz-1',
            title: '5. Cuestionario de Evaluación: Módulo 1 y 2',
            slug: 'cuestionario-evaluacion-conceptos',
            type: 'quiz',
            durationMinutes: 10,
            summary: 'Evalúa tus conocimientos adquiridos con retroalimentación inmediata.',
            quizQuestions: [
              {
                id: 'q1',
                question: '¿Qué estructura de datos de Python mantiene elementos únicos sin duplicados?',
                options: ['list', 'tuple', 'set', 'dict'],
                correctIndex: 2,
                explanation: 'Los conjuntos (sets) en Python no admiten duplicados y tienen búsquedas de tiempo O(1).',
              },
              {
                id: 'q2',
                question: '¿Qué ventaja tiene ejecutar código mediante WebAssembly en el navegador?',
                options: [
                  'No requiere servidores backend costosos y el cómputo se realiza en el cliente',
                  'Requiere instalar Docker en la máquina del alumno',
                  'Solo funciona en ordenadores con GPU dedicada',
                  'Es un servicio de pago obligatorio',
                ],
                correctIndex: 0,
                explanation: 'WebAssembly corre directamente en la máquina del usuario, permitiendo alojar el LMS en Cloudflare sin costes de servidor.',
              },
              {
                id: 'q3',
                question: '¿Cuál es la función principal de una List Comprehension en Python?',
                options: [
                  'Crear bucles infinitos controlados',
                  'Transformar y filtrar listas de manera concisa y elegante',
                  'Conectar a una base de datos remota',
                  'Generar gráficos vectoriales',
                ],
                correctIndex: 1,
                explanation: 'Las list comprehensions proporcionan una sintaxis compacta para crear nuevas listas a partir de iterables existentes.',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'course-cloudflare-fullstack',
    title: 'Arquitectura Cloud Serverless y Automatización',
    slug: 'arquitectura-cloud-serverless',
    tagline: 'Domina Cloudflare Pages, Workers, bases de datos D1 y despliegues globales a coste cero.',
    description: 'Curso práctico para desarrolladores y creadores que desean construir plataformas web modernas sin pagar facturas mensuales de servidores.',
    badge: 'Avanzado',
    themeColor: '#f97316',
    price: 'Acceso Privado',
    isPublished: true,
    createdAt: '2026-02-10T11:00:00Z',
    updatedAt: '2026-03-22T09:15:00Z',
    instructor: {
      name: 'Profe',
      title: 'Profesor y Director de Tecnología',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
      bio: 'Especialista en desarrollo cloud-native y optimización de costes de infraestructura.',
    },
    features: [
      'Configuración de Cloudflare Pages, D1 SQL y Workers',
      'Despliegue continuo con Git y Wrangler CLI',
      'Autenticación y control de acceso privado',
    ],
    faq: [],
    sections: [
      {
        id: 'cf-sec-1',
        title: 'Módulo 1: Infraestructura Serverless',
        description: 'Fundamentos de la red de borde y bases de datos distribuidas.',
        lessons: [
          {
            id: 'cf-les-1',
            title: '1. Despliegue en Cloudflare Pages con Wrangler',
            slug: 'despliegue-cloudflare-wrangler',
            type: 'article',
            durationMinutes: 15,
            summary: 'Guía paso a paso para publicar aplicaciones web con CDN global y SSL.',
            contentMarkdown: `# Despliegue Global en Cloudflare Pages

Aprende a publicar aplicaciones estáticas y dinámicas utilizando Wrangler CLI:

\`\`\`bash
# Compilar la aplicación
npm run build

# Desplegar en Cloudflare Pages
npx wrangler pages deploy dist --project-name aura-lms
\`\`\`

Todo el contenido se distribuye automáticamente en más de 300 centros de datos mundiales.`,
          },
        ],
      },
    ],
  },
];
