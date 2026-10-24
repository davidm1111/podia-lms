import type { Course, UserProgress, LessonComment } from '../types';
import { defaultCourses } from '../data/sampleCourses';

const COURSES_STORAGE_KEY = 'podia_lms_courses_v1';
const PROGRESS_STORAGE_KEY = 'podia_lms_progress_v1';
const USER_ROLE_KEY = 'podia_lms_user_role'; // 'student' | 'creator'

// Initialize or get stored courses
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

// User Progress
export function getStoredProgress(courseId: string): UserProgress {
  try {
    const raw = localStorage.getItem(`${PROGRESS_STORAGE_KEY}_${courseId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading course progress:', e);
  }
  return {
    courseId,
    completedLessonIds: [],
    notes: {},
    comments: [],
  };
}

export function saveProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(`${PROGRESS_STORAGE_KEY}_${progress.courseId}`, JSON.stringify(progress));
  } catch (e) {
    console.error('Error saving progress:', e);
  }
}

export function toggleLessonCompletion(courseId: string, lessonId: string): boolean {
  const progress = getStoredProgress(courseId);
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

export function saveLessonNote(courseId: string, lessonId: string, noteText: string): void {
  const progress = getStoredProgress(courseId);
  progress.notes[lessonId] = noteText;
  saveProgress(progress);
}

export function addLessonComment(courseId: string, comment: LessonComment): void {
  const progress = getStoredProgress(courseId);
  progress.comments.push(comment);
  saveProgress(progress);
}

// User mode (Student / Creator)
export function getUserRole(): 'student' | 'creator' {
  const role = localStorage.getItem(USER_ROLE_KEY);
  return role === 'creator' ? 'creator' : 'student';
}

export function setUserRole(role: 'student' | 'creator'): void {
  localStorage.setItem(USER_ROLE_KEY, role);
}

// Reset data to defaults
export function resetToDefaults(): void {
  localStorage.removeItem(COURSES_STORAGE_KEY);
  // Clear all progress keys
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(PROGRESS_STORAGE_KEY)) {
      localStorage.removeItem(key);
    }
  }
}
