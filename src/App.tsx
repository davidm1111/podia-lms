import { useState, useEffect } from 'react';
import type { Course, Student, AuthUser } from './types';
import {
  getStoredCourses,
  saveCourse,
  getStoredStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  getAuthUser,
  logout,
} from './lib/storage';
import { Navbar } from './components/Navbar';
import { LoginGate } from './components/Auth/LoginGate';
import { CourseCatalog } from './components/Storefront/CourseCatalog';
import { CourseLanding } from './components/Storefront/CourseLanding';
import { CoursePlayer } from './components/CoursePlayer/CoursePlayer';
import { AdminPortal } from './components/Admin/AdminPortal';
import { CloudflareDeployModal } from './components/CloudflareDeployModal';

export function App() {
  const [courses, setCourses] = useState<Course[]>(() => getStoredCourses());
  const [students, setStudents] = useState<Student[]>(() => getStoredStudents());
  const [authUser, setAuthUserState] = useState<AuthUser | null>(() => getAuthUser());
  const [currentView, setCurrentView] = useState<'catalog' | 'landing' | 'player' | 'admin' | 'login'>(() => {
    const user = getAuthUser();
    if (!user) return 'login';
    return user.role === 'admin' ? 'admin' : 'catalog';
  });

  const [selectedCourse, setSelectedCourse] = useState<Course>(() => courses[0]);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);

  // Sync courses with storage
  const handleSaveCourse = (updatedCourse: Course) => {
    saveCourse(updatedCourse);
    setCourses(getStoredCourses());
    if (selectedCourse.id === updatedCourse.id) {
      setSelectedCourse(updatedCourse);
    }
  };

  // Student operations
  const handleAddStudent = (name: string, email: string, courseIds: string[]) => {
    addStudent(name, email, courseIds);
    setStudents(getStoredStudents());
  };

  const handleUpdateStudent = (updated: Student) => {
    updateStudent(updated);
    setStudents(getStoredStudents());
  };

  const handleDeleteStudent = (studentId: string) => {
    deleteStudent(studentId);
    setStudents(getStoredStudents());
  };

  const handleLogout = () => {
    logout();
    setAuthUserState(null);
    setCurrentView('login');
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setAuthUserState(user);
    if (user.role === 'admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('catalog');
    }
  };

  // Filter accessible courses for student
  const visibleCourses = authUser?.role === 'student'
    ? courses.filter(c => {
        const studentRecord = students.find(s => s.email.toLowerCase() === authUser.email.toLowerCase());
        return studentRecord?.enrolledCourseIds.includes(c.id) ?? true;
      })
    : courses;

  useEffect(() => {
    const currentInList = courses.find(c => c.id === selectedCourse?.id);
    if (currentInList) {
      setSelectedCourse(currentInList);
    }
  }, [courses]);

  // If user is not authenticated, show private login gate ("para q nadie entre por libre")
  if (!authUser || currentView === 'login') {
    return (
      <LoginGate
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2c2533] flex flex-col font-sans selection:bg-purple-100 selection:text-purple-900">
      {/* Global Header (hidden inside player and admin) */}
      {currentView !== 'player' && currentView !== 'admin' && (
        <Navbar
          currentView={currentView}
          authUser={authUser}
          onNavigate={(view) => setCurrentView(view)}
          onLogout={handleLogout}
          onOpenDeployModal={() => setIsDeployModalOpen(true)}
        />
      )}

      {/* Main View Switcher */}
      <main className="flex-1 flex flex-col">
        {currentView === 'catalog' && (
          <CourseCatalog
            courses={visibleCourses.length > 0 ? visibleCourses : courses}
            authUser={authUser}
            onSelectCourse={(course) => {
              setSelectedCourse(course);
              setCurrentView('landing');
            }}
            onOpenCoursePlayer={(course) => {
              setSelectedCourse(course);
              setCurrentView('player');
            }}
            onOpenAdmin={() => setCurrentView('admin')}
            onOpenDeployModal={() => setIsDeployModalOpen(true)}
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
            authUser={authUser}
            onBackToCourse={() => setCurrentView('landing')}
            onGoToDashboard={() => setCurrentView('catalog')}
          />
        )}

        {currentView === 'admin' && (
          <AdminPortal
            courses={courses}
            students={students}
            onSaveCourse={handleSaveCourse}
            onPreviewCourse={(course) => {
              setSelectedCourse(course);
              setCurrentView('player');
            }}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
            onLogout={handleLogout}
            onOpenDeployModal={() => setIsDeployModalOpen(true)}
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
