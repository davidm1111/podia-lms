import type { Course, UserProgress, LessonComment, Student, AuthUser, SiteConfig } from '../types';
import { defaultCourses, defaultStudents, defaultSiteConfig } from '../data/sampleCourses';

const COURSES_STORAGE_KEY = 'aura_lms_courses_v3';
const STUDENTS_STORAGE_KEY = 'aura_lms_students_v3';
const AUTH_STORAGE_KEY = 'aura_lms_auth_v3';
const PROGRESS_STORAGE_KEY = 'aura_lms_progress_v3';
const SITE_CONFIG_STORAGE_KEY = 'aura_lms_site_config_v3';

// ----------------- Site Configuration (Editable by Professor) -----------------
export function getStoredSiteConfig(): SiteConfig {
  try {
    const raw = localStorage.getItem(SITE_CONFIG_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SITE_CONFIG_STORAGE_KEY, JSON.stringify(defaultSiteConfig));
      return defaultSiteConfig;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading site config:', e);
    return defaultSiteConfig;
  }
}

export function saveSiteConfig(config: SiteConfig): void {
  try {
    localStorage.setItem(SITE_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Error saving site config:', e);
  }
}

// ----------------- Courses -----------------
export function getStoredCourses(): Course[] {
  try {
    const raw = localStorage.getItem(COURSES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(defaultCourses));
      return defaultCourses;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultCourses;
  } catch (e) {
    console.error('Error loading stored courses:', e);
    return defaultCourses;
  }
}

export function saveCourses(courses: Course[]): void {
  try {
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
  } catch (e) {
    console.error('Error saving courses to localStorage:', e);
  }
}

export function saveCourse(updatedCourse: Course): void {
  const current = getStoredCourses();
  const index = current.findIndex(c => c.id === updatedCourse.id);
  if (index >= 0) {
    current[index] = updatedCourse;
  } else {
    current.unshift(updatedCourse);
  }
  saveCourses(current);
}

export function deleteCourse(courseId: string): void {
  const current = getStoredCourses();
  const filtered = current.filter(c => c.id !== courseId);
  saveCourses(filtered);
}

// ----------------- Students Management -----------------
export function getStoredStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STUDENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(defaultStudents));
      return defaultStudents;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultStudents;
  } catch (e) {
    console.error('Error loading students:', e);
    return defaultStudents;
  }
}

export function saveStudents(students: Student[]): void {
  try {
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
  } catch (e) {
    console.error('Error saving students:', e);
  }
}

export function addStudent(name: string, email: string, enrolledCourseIds: string[]): Student {
  const students = getStoredStudents();
  const newStudent: Student = {
    id: `stud-${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    enrolledCourseIds,
    status: 'active',
    createdAt: new Date().toISOString(),
  };
  students.unshift(newStudent);
  saveStudents(students);
  return newStudent;
}

export function updateStudent(updated: Student): void {
  const students = getStoredStudents();
  const index = students.findIndex(s => s.id === updated.id);
  if (index >= 0) {
    students[index] = updated;
    saveStudents(students);
  }
}

export function deleteStudent(studentId: string): void {
  const students = getStoredStudents().filter(s => s.id !== studentId);
  saveStudents(students);
}

// ----------------- Authentication & Access Control -----------------
export function getAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading auth user:', e);
  }
  return null;
}

export function setAuthUser(user: AuthUser | null): void {
  if (user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

// Teacher / Admin Login: username 'profe' (or 'admin'), password '18111982z'
export function loginAsTeacher(username: string, password: string): { success: boolean; error?: string } {
  const cleanUser = username.trim().toLowerCase();
  const cleanPass = password.trim();

  const isUserValid = cleanUser === 'profe' || cleanUser === 'profesor' || cleanUser === 'profe@academia.com' || cleanUser === 'admin';
  const isPassValid = cleanPass === '18111982z';

  if (!isUserValid) {
    return { success: false, error: 'Usuario no reconocido como profesor.' };
  }

  if (!isPassValid) {
    return { success: false, error: 'Contraseña incorrecta.' };
  }

  const teacherUser: AuthUser = {
    role: 'admin',
    id: 'teacher-1',
    name: 'Profe',
    email: 'profe@academia.com',
  };
  setAuthUser(teacherUser);
  return { success: true };
}

// Student Login: accepts 'david' or 'davidmeirino@gmail.com' or registered student email, password '18111982z'
export function loginAsStudentWithPassword(
  identifier: string,
  password: string
): { success: boolean; student?: Student; error?: string } {
  const cleanId = identifier.trim().toLowerCase();
  const cleanPass = password.trim();

  // Validate password
  if (cleanPass !== '18111982z') {
    return { success: false, error: 'Contraseña incorrecta.' };
  }

  const students = getStoredStudents();
  // Find matching student by email or name
  let found = students.find(s => s.email.toLowerCase() === cleanId || s.name.toLowerCase() === cleanId);

  // If identifier is 'david' and not yet found, auto-link to David
  if (!found && cleanId === 'david') {
    found = {
      id: 'stud-david',
      name: 'David',
      email: 'davidmeirino@gmail.com',
      enrolledCourseIds: getStoredCourses().map(c => c.id),
      status: 'active',
      createdAt: new Date().toISOString(),
    };
  }

  if (!found) {
    return {
      success: false,
      error: 'Usuario o correo no registrado. Contacta al profesor.',
    };
  }

  if (found.status === 'inactive') {
    return {
      success: false,
      error: 'Tu acceso como alumno está pausado por el profesor.',
    };
  }

  const studentUser: AuthUser = {
    role: 'student',
    id: found.id,
    name: found.name,
    email: found.email,
  };
  setAuthUser(studentUser);
  return { success: true, student: found };
}

export function logout(): void {
  setAuthUser(null);
}

// ----------------- User Progress -----------------
export function getStoredProgress(courseId: string, userId: string = 'default'): UserProgress {
  try {
    const raw = localStorage.getItem(`${PROGRESS_STORAGE_KEY}_${courseId}_${userId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading progress:', e);
  }
  return {
    courseId,
    userId,
    completedLessonIds: [],
    notes: {},
    comments: [],
    quizAnswers: {},
  };
}

export function saveProgress(progress: UserProgress): void {
  try {
    const userId = progress.userId || 'default';
    localStorage.setItem(`${PROGRESS_STORAGE_KEY}_${progress.courseId}_${userId}`, JSON.stringify(progress));
  } catch (e) {
    console.error('Error saving progress:', e);
  }
}

export function toggleLessonCompletion(courseId: string, lessonId: string, userId: string = 'default'): boolean {
  const progress = getStoredProgress(courseId, userId);
  const isCompleted = progress.completedLessonIds.includes(lessonId);
  if (isCompleted) {
    progress.completedLessonIds = progress.completedLessonIds.filter(id => id !== lessonId);
  } else {
    progress.completedLessonIds.push(lessonId);
  }
  progress.lastLessonId = lessonId;
  saveProgress(progress);
  return !isCompleted;
}

export function saveLessonNote(courseId: string, lessonId: string, noteText: string, userId: string = 'default'): void {
  const progress = getStoredProgress(courseId, userId);
  progress.notes[lessonId] = noteText;
  saveProgress(progress);
}

export function addLessonComment(courseId: string, comment: LessonComment, userId: string = 'default'): void {
  const progress = getStoredProgress(courseId, userId);
  progress.comments.push(comment);
  saveProgress(progress);
}
