import { useState, useEffect } from 'react';
import type { Course, Lesson } from './types';
import {
  getStoredCourses,
  saveCourse,
  getUserRole,
  setUserRole,
} from './lib/storage';
import { Navbar } from './components/Navbar';
import { CourseCatalog } from './components/Storefront/CourseCatalog';
import { CourseLanding } from './components/Storefront/CourseLanding';
import { CoursePlayer } from './components/CoursePlayer/CoursePlayer';
import { CourseEditor } from './components/CourseCreator/CourseEditor';
import { CloudflareDeployModal } from './components/CloudflareDeployModal';

export function App() {
  const [courses, setCourses] = useState<Course[]>(() => getStoredCourses());
  const [currentView, setCurrentView] = useState<'catalog' | 'landing' | 'player' | 'creator'>('catalog');
  const [selectedCourse, setSelectedCourse] = useState<Course>(() => courses[0]);
  const [userRole, setUserRoleState] = useState<'student' | 'creator'>(() => getUserRole());
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);

  // Sync courses with localStorage when updated
  const handleSaveCourse = (updatedCourse: Course) => {
    saveCourse(updatedCourse);
    setCourses(getStoredCourses());
    if (selectedCourse.id === updatedCourse.id) {
      setSelectedCourse(updatedCourse);
    }
  };

  const handleToggleRole = () => {
    const nextRole = userRole === 'student' ? 'creator' : 'student';
    setUserRole(nextRole);
    setUserRoleState(nextRole);
    if (nextRole === 'creator') {
      setCurrentView('creator');
    } else if (currentView === 'creator') {
      setCurrentView('catalog');
    }
  };

  // Quick Notebook inspector: creates a temporary or permanent playground course and opens it immediately
  const handleQuickUploadNotebook = (notebookData: any, fileName: string) => {
    const cleanTitle = fileName.replace('.ipynb', '').replace(/[-_]/g, ' ');
    const playgroundLesson: Lesson = {
      id: `quick-les-${Date.now()}`,
      title: cleanTitle,
      slug: cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      type: 'notebook',
      durationMinutes: 15,
      summary: `Notebook importado desde ${fileName}. Ejecuta y analiza las celdas directamente en tu navegador.`,
      notebookData,
      notebookFileName: fileName,
      resources: [{ name: fileName, url: '#', size: '10 KB' }],
    };

    const playgroundCourse: Course = {
      id: `quick-course-${Date.now()}`,
      title: `Notebook: ${cleanTitle}`,
      slug: `notebook-${Date.now()}`,
      tagline: `Visualizador y ejecutor interactivo para el archivo ${fileName}`,
      description: 'Notebook de Jupyter importado para ejecución interactiva en WebAssembly y Cloudflare Pages.',
      badge: 'Notebook Importado',
      themeColor: '#724ae8',
      price: 'Gratis',
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      instructor: {
        name: 'Tú (Creador)',
        title: 'Data Science / Python Practitioner',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
        bio: 'Archivo subido localmente para exploración interactiva.',
      },
      features: [
        'Renderizado fiel de celdas de Markdown y Código',
        'Ejecución con WebAssembly Python (Pyodide)',
        'Descarga del notebook .ipynb original',
      ],
      faq: [],
      sections: [
        {
          id: `sec-quick-${Date.now()}`,
          title: 'Contenido del Notebook',
          description: 'Celdas parseadas directamente del archivo',
          lessons: [playgroundLesson],
        },
      ],
    };

    handleSaveCourse(playgroundCourse);
    setSelectedCourse(playgroundCourse);
    setCurrentView('player');
  };

  // Keep selected course fresh if courses change
  useEffect(() => {
    const currentInList = courses.find(c => c.id === selectedCourse.id);
    if (currentInList) {
      setSelectedCourse(currentInList);
    }
  }, [courses]);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2c2533] flex flex-col font-sans selection:bg-purple-100 selection:text-purple-900">
      {/* Podia-style Global Header (hidden inside player for distraction-free learning) */}
      {currentView !== 'player' && (
        <Navbar
          currentView={currentView}
          userRole={userRole}
          onNavigate={(view) => setCurrentView(view)}
          onToggleRole={handleToggleRole}
          onOpenDeployModal={() => setIsDeployModalOpen(true)}
        />
      )}

      {/* Main Body View Switcher */}
      <main className="flex-1 flex flex-col">
        {currentView === 'catalog' && (
          <CourseCatalog
            courses={courses}
            onSelectCourse={(course) => {
              setSelectedCourse(course);
              setCurrentView('landing');
            }}
            onOpenCoursePlayer={(course) => {
              setSelectedCourse(course);
              setCurrentView('player');
            }}
            onOpenCreator={() => {
              setUserRoleState('creator');
              setUserRole('creator');
              setCurrentView('creator');
            }}
            onOpenDeployModal={() => setIsDeployModalOpen(true)}
            onQuickUploadNotebook={handleQuickUploadNotebook}
          />
        )}

        {currentView === 'landing' && (
          <CourseLanding
            course={selectedCourse}
            onEnrollOrStart={() => setCurrentView('player')}
            onBackToCatalog={() => setCurrentView('catalog')}
          />
        )}

        {currentView === 'player' && (
          <CoursePlayer
            course={selectedCourse}
            onBackToCourse={() => setCurrentView('landing')}
            onGoToDashboard={() => setCurrentView('catalog')}
          />
        )}

        {currentView === 'creator' && (
          <CourseEditor
            courses={courses}
            onSaveCourse={handleSaveCourse}
            onPreviewCourse={(course) => {
              setSelectedCourse(course);
              setCurrentView('player');
            }}
            onBackToCatalog={() => setCurrentView('catalog')}
          />
        )}
      </main>

      {/* Cloudflare Deploy Free Modal */}
      <CloudflareDeployModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
      />
    </div>
  );
}

export default App;
