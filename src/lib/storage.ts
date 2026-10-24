import type { Course, UserProgress, LessonComment, Student, AuthUser } from '../types';
import { defaultCourses, defaultStudents } from '../data/sampleCourses';

const COURSES_STORAGE_KEY = 'aura_lms_courses_v2';
const STUDENTS_STORAGE_KEY = 'aura_lms_students_v2';
const AUTH_STORAGE_KEY = 'aura_lms_auth_v2';
const PROGRESS_STORAGE_KEY = 'aura_lms_progress_v2';

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

// Default Admin credentials (can be entered by instructor)
export function loginAsAdmin(password: string): boolean {
  // Allow 'admin123' or 'profesor'
  const normalized = password.trim();
  if (normalized === 'admin123' || normalized === 'profesor' || normalized === 'admin') {
    const adminUser: AuthUser = {
      role: 'admin',
      id: 'admin-1',
      name: 'Profesor / Administrador',
      email: 'admin@academia.com',
    };
    setAuthUser(adminUser);
    return true;
  }
  return false;
}

// Gated Student Login: Student MUST exist in the teacher's authorized students list
export function loginAsStudent(email: string): { success: boolean; student?: Student; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const students = getStoredStudents();
  const found = students.find(s => s.email.toLowerCase() === cleanEmail);

  if (!found) {
    return {
      success: false,
      error: 'Correo no registrado. Por favor, solicita acceso al profesor del curso.',
    };
  }

  if (found.status === 'inactive') {
    return {
      success: false,
      error: 'Tu acceso como alumno ha sido pausado. Contacta al profesor.',
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

export function saveQuizAnswer(
  courseId: string,
  lessonId: string,
  questionId: string,
  optionIndex: number,
  userId: string = 'default'
): void {
  const progress = getStoredProgress(courseId, userId);
  if (!progress.quizAnswers) progress.quizAnswers = {};
  if (!progress.quizAnswers[lessonId]) progress.quizAnswers[lessonId] = {};
  progress.quizAnswers[lessonId][questionId] = optionIndex;
  saveProgress(progress);
}
