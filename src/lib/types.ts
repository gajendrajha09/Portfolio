export interface SiteImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  category: string;
  featured: boolean;
  images: SiteImage[];
  createdAt: string;
}

export interface SiteSettings {
  name: string;
  title: string;
  tagline: string;
  about: string;
  email: string;
  location: string;
  social: {
    instagram?: string;
    behance?: string;
    linkedin?: string;
    twitter?: string;
    dribbble?: string;
  };
  gridColumns: number;
  gridGutter: number;
  showMasthead: boolean;
  accentColor: string;
}

export interface SiteData {
  settings: SiteSettings;
  projects: Project[];
  published: boolean;
  updatedAt: string;
}

export interface EditorSession {
  authenticated: boolean;
}
