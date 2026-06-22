import fs from "fs/promises";
import path from "path";
import type { SiteData } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "site.json");

export const defaultSiteData: SiteData = {
  settings: {
    name: "Gajendra Jha",
    title: "Creative Portfolio",
    tagline: "Generative AI · 3D · Applications",
    about:
      "I'm a creative technologist working at the intersection of generative AI, 3D visualization, and interactive applications. My work spans AI influencer creation, workflow design, environment art, product visualization, and full-stack web tools.",
    email: "hello@example.com",
    location: "India",
    social: {
      instagram: "",
      behance: "",
      linkedin: "",
      twitter: "",
      dribbble: "",
    },
    gridColumns: 4,
    gridGutter: 8,
    showMasthead: true,
    accentColor: "#111111",
  },
  collections: [
    {
      id: "c1",
      slug: "toast-nightlight",
      title: "Toast Nightlight",
      description: "Playful 3D product concept with soft lighting and character design.",
      category: "3d",
      subcategory: "product",
      coverImage: "/uploads/sample-1.svg",
      featured: true,
      images: [
        { id: "c1-i1", src: "/uploads/sample-1.svg", alt: "Toast nightlight render" },
      ],
      createdAt: "2025-01-10T00:00:00.000Z",
    },
    {
      id: "c2",
      slug: "editorial-portrait",
      title: "Editorial Portrait",
      description: "Cinematic AI-generated portrait with dramatic lighting and styling.",
      category: "generative-ai",
      subcategory: "portraits",
      coverImage: "/uploads/sample-2.svg",
      featured: true,
      images: [
        { id: "c2-i1", src: "/uploads/sample-2.svg", alt: "Editorial portrait" },
      ],
      createdAt: "2025-01-15T00:00:00.000Z",
    },
    {
      id: "c3",
      slug: "ai-influencer-lookbook",
      title: "AI Influencer Lookbook",
      description: "Consistent character generation across multiple poses and outfits.",
      category: "generative-ai",
      subcategory: "ai-influencer",
      coverImage: "/uploads/sample-3.svg",
      featured: true,
      images: [
        { id: "c3-i1", src: "/uploads/sample-3.svg", alt: "AI influencer look 1" },
        { id: "c3-i2", src: "/uploads/sample-2.svg", alt: "AI influencer look 2" },
      ],
      createdAt: "2025-02-01T00:00:00.000Z",
    },
    {
      id: "c4",
      slug: "macro-beauty",
      title: "Macro Beauty Study",
      description: "Hyper-detailed generative beauty and skin texture exploration.",
      category: "generative-ai",
      subcategory: "portraits",
      coverImage: "/uploads/visual-index-reference.png",
      featured: true,
      images: [
        { id: "c4-i1", src: "/uploads/visual-index-reference.png", alt: "Macro beauty study" },
      ],
      createdAt: "2025-02-10T00:00:00.000Z",
    },
    {
      id: "c5",
      slug: "sedan-studio",
      title: "Sedan Studio Render",
      description: "Clean automotive product visualization with studio lighting.",
      category: "3d",
      subcategory: "product",
      coverImage: "/uploads/sample-3.svg",
      featured: true,
      images: [
        { id: "c5-i1", src: "/uploads/sample-3.svg", alt: "Blue sedan render" },
      ],
      createdAt: "2025-02-20T00:00:00.000Z",
    },
    {
      id: "c6",
      slug: "organic-micro",
      title: "Organic Microstructure",
      description: "Scientific 3D visualization of organic surface detail.",
      category: "3d",
      subcategory: "visualization",
      coverImage: "/uploads/sample-2.svg",
      featured: true,
      images: [
        { id: "c6-i1", src: "/uploads/sample-2.svg", alt: "Organic microstructure" },
      ],
      createdAt: "2025-03-01T00:00:00.000Z",
    },
    {
      id: "c7",
      slug: "park-environment",
      title: "Park Environment",
      description: "Outdoor environment generation with consistent subject placement.",
      category: "generative-ai",
      subcategory: "environment",
      coverImage: "/uploads/sample-1.svg",
      featured: true,
      images: [
        { id: "c7-i1", src: "/uploads/sample-1.svg", alt: "Park environment 1" },
        { id: "c7-i2", src: "/uploads/sample-2.svg", alt: "Park environment 2" },
      ],
      createdAt: "2025-03-15T00:00:00.000Z",
    },
  ],
  applications: [
    {
      id: "a1",
      slug: "comfyui-workflow",
      title: "ComfyUI Workflow Builder",
      description: "Node-based generative AI pipeline for image production workflows.",
      screenshot: "/uploads/visual-index-reference.png",
      liveUrl: "https://github.com/gajendrajha09/Portfolio",
      featured: true,
      createdAt: "2025-04-01T00:00:00.000Z",
    },
    {
      id: "a2",
      slug: "character-studio",
      title: "AI Character Studio",
      description: "Full-stack character creation and content engine for AI influencers.",
      screenshot: "/uploads/sample-3.svg",
      liveUrl: "https://github.com/gajendrajha09",
      featured: true,
      createdAt: "2025-04-15T00:00:00.000Z",
    },
  ],
  published: true,
  updatedAt: new Date().toISOString(),
};

function migrateLegacyData(raw: Record<string, unknown>): SiteData {
  if (Array.isArray(raw.collections) && Array.isArray(raw.applications)) {
    return raw as unknown as SiteData;
  }

  if (Array.isArray(raw.projects)) {
    const projects = raw.projects as Array<{
      id: string;
      slug: string;
      title: string;
      description: string;
      coverImage: string;
      category: string;
      featured: boolean;
      images: SiteData["collections"][0]["images"];
      createdAt: string;
    }>;

    return {
      ...(raw as unknown as SiteData),
      collections: projects.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        description: p.description,
        category: "generative-ai" as const,
        subcategory: "concept-art",
        coverImage: p.coverImage,
        images: p.images,
        featured: p.featured,
        createdAt: p.createdAt,
      })),
      applications: [],
    };
  }

  return defaultSiteData;
}

async function ensureDataFile(): Promise<void> {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(
      DATA_FILE,
      JSON.stringify(defaultSiteData, null, 2),
      "utf-8",
    );
  }
}

export async function getSiteData(): Promise<SiteData> {
  await ensureDataFile();
  const raw = JSON.parse(await fs.readFile(DATA_FILE, "utf-8")) as Record<
    string,
    unknown
  >;
  return migrateLegacyData(raw);
}

export async function saveSiteData(data: SiteData): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const payload: SiteData = {
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await fs.writeFile(DATA_FILE, JSON.stringify(payload, null, 2), "utf-8");
}
