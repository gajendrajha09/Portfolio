export interface SiteImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

export type WorkCategory = "generative-ai" | "3d" | "applications";
export type CollectionCategory = "generative-ai" | "3d";

export interface Collection {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: CollectionCategory;
  subcategory: string;
  coverImage: string;
  images: SiteImage[];
  featured: boolean;
  createdAt: string;
}

export interface Application {
  id: string;
  slug: string;
  title: string;
  description: string;
  screenshot: string;
  liveUrl: string;
  featured: boolean;
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
  collections: Collection[];
  applications: Application[];
  published: boolean;
  updatedAt: string;
}

export interface EditorSession {
  authenticated: boolean;
}

/** @deprecated Use Collection or Application */
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
