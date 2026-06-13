export interface Category {
  id: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Technology {
  id: string;
  name: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  summary: string;
  year: string;
}

export interface Task {
  id: string;
  task: string;
  experienceId: string;
  experienceName: string;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryItem {
  id: string;
  projectId: string;
  projectTitle: string;
  imageUrl: string;
}

export interface Project {
  id: string;
  title: string;
  summary: string;
  overview: string;
  year: string;
  categoryId: string;
  imageUrl: string;
  technologyIds: string[];
  liveUrl: string;
  sourceCode: string;
}

export interface Blog {
  id: string;
  title: string;
  summary: string;
  content: string;
  tagIds: string[];
  tagNames: string[];
  readTime: string;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  categoryName: string;
}

export interface SelectOption {
  value: string;
  label: string;
}
