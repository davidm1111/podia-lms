export type LessonType = 'video' | 'image' | 'article' | 'notebook' | 'audio' | 'quiz';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface LessonResource {
  name: string;
  url: string;
  size?: string;
  provider?: 'google-drive' | 'dropbox' | 'github' | 'direct';
}

export interface NotebookCellOutput {
  output_type: 'stream' | 'display_data' | 'execute_result' | 'error';
  name?: string; // 'stdout' | 'stderr'
  text?: string | string[];
  data?: {
    'text/plain'?: string | string[];
    'text/html'?: string | string[];
    'image/png'?: string;
    'image/jpeg'?: string;
    'image/svg+xml'?: string;
    'application/json'?: any;
    [key: string]: any;
  };
  execution_count?: number | null;
  ename?: string;
  evalue?: string;
  traceback?: string[];
}

export interface NotebookCell {
  id?: string;
  cell_type: 'markdown' | 'code' | 'raw';
  source: string | string[];
  execution_count?: number | null;
  outputs?: NotebookCellOutput[];
  metadata?: Record<string, any>;
}

export interface JupyterNotebook {
  cells: NotebookCell[];
  metadata: {
    kernelspec?: {
      display_name: string;
      language: string;
      name: string;
    };
    language_info?: {
      name: string;
      version?: string;
      mimetype?: string;
    };
    [key: string]: any;
  };
  nbformat: number;
  nbformat_minor: number;
}

export interface Lesson {
  id: string;
  title: string;
  slug: string;
  type: LessonType;
  durationMinutes: number;
  summary: string;
  // Module types
  contentMarkdown?: string;
  videoUrl?: string;
  imageUrl?: string;
  imageCaption?: string;
  audioUrl?: string;
  audioTitle?: string;
  quizQuestions?: QuizQuestion[];
  // Jupyter Notebook module
  notebookData?: JupyterNotebook;
  rawNotebookJson?: string;
  notebookFileName?: string;
  // Downloadable cloud resources (Dropbox, Google Drive, direct links)
  resources?: LessonResource[];
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
}

export interface Instructor {
  name: string;
  title: string;
  avatar: string;
  bio: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  badge?: string;
  instructor: Instructor;
  coverImage?: string;
  themeColor?: string;
  sections: Section[];
  features: string[];
  faq: {
    question: string;
    answer: string;
  }[];
  price: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  enrolledCourseIds: string[];
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface AuthUser {
  role: 'admin' | 'student';
  id: string;
  name: string;
  email: string;
}

export interface SiteConfig {
  academyName: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  featuresTitle: string;
  features: {
    title: string;
    description: string;
  }[];
}

export interface UserProgress {
  courseId: string;
  userId?: string;
  completedLessonIds: string[];
  lastLessonId?: string;
  notes: Record<string, string>;
  comments: LessonComment[];
  quizAnswers?: Record<string, Record<string, number>>;
}

export interface LessonComment {
  id: string;
  lessonId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
}
