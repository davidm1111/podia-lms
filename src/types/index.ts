export type LessonType = 'notebook' | 'video' | 'article' | 'quiz';

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
  contentMarkdown?: string;
  videoUrl?: string;
  notebookData?: JupyterNotebook;
  rawNotebookJson?: string;
  notebookFileName?: string;
  resources?: {
    name: string;
    url: string;
    size?: string;
  }[];
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
  themeColor?: string; // Podia custom brand color
  sections: Section[];
  features: string[];
  faq: {
    question: string;
    answer: string;
  }[];
  price: string; // 'Gratis' or '$0'
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProgress {
  courseId: string;
  completedLessonIds: string[];
  lastLessonId?: string;
  notes: Record<string, string>; // lessonId -> personal note
  comments: LessonComment[];
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
