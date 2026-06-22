"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Save,
  Eye,
  LogOut,
  Plus,
  Trash2,
  Upload,
  GripVertical,
  Settings,
  FolderOpen,
  ImageIcon,
  Loader2,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import type { SiteData, Project, SiteImage } from "@/lib/types";
import { slugify } from "@/lib/utils";

type EditorTab = "projects" | "settings" | "uploads";

interface EditorDashboardProps {
  initialData: SiteData;
}

export function EditorDashboard({ initialData }: EditorDashboardProps) {
  const [data, setData] = useState<SiteData>(initialData);
  const [activeTab, setActiveTab] = useState<EditorTab>("projects");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    data.projects[0]?.id ?? null,
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const selectedProject = data.projects.find((p) => p.id === selectedProjectId);

  const showMessage = useCallback((type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Save failed");
      showMessage("success", "Site saved successfully!");
    } catch {
      showMessage("error", "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    window.location.reload();
  }

  async function uploadFiles(files: FileList | File[]) {
    setUploading(true);
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const result = await res.json();
        if (res.ok) uploaded.push(result.url);
      } catch {
        showMessage("error", `Failed to upload ${file.name}`);
      }
    }

    setUploading(false);

    if (uploaded.length > 0) {
      showMessage("success", `Uploaded ${uploaded.length} file(s)`);
    }

    return uploaded;
  }

  function updateSettings(partial: Partial<SiteData["settings"]>) {
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...partial },
    }));
  }

  function updateProject(id: string, partial: Partial<Project>) {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === id ? { ...p, ...partial } : p,
      ),
    }));
  }

  function addProject() {
    const newProject: Project = {
      id: uuidv4(),
      slug: `new-project-${Date.now()}`,
      title: "New Project",
      description: "Project description",
      coverImage: "/uploads/sample-1.svg",
      category: "Uncategorized",
      featured: true,
      images: [],
      createdAt: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      projects: [newProject, ...prev.projects],
    }));
    setSelectedProjectId(newProject.id);
  }

  function deleteProject(id: string) {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
    if (selectedProjectId === id) {
      setSelectedProjectId(data.projects.find((p) => p.id !== id)?.id ?? null);
    }
  }

  function addImageToProject(projectId: string, url: string) {
    const newImage: SiteImage = {
      id: uuidv4(),
      src: url,
      alt: "",
      caption: "",
    };
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id !== projectId) return p;
        const images = [...p.images, newImage];
        return {
          ...p,
          images,
          coverImage: p.images.length === 0 ? url : p.coverImage,
        };
      }),
    }));
  }

  function removeImageFromProject(projectId: string, imageId: string) {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id !== projectId) return p;
        return { ...p, images: p.images.filter((img) => img.id !== imageId) };
      }),
    }));
  }

  function updateImage(
    projectId: string,
    imageId: string,
    partial: Partial<SiteImage>,
  ) {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          images: p.images.map((img) =>
            img.id === imageId ? { ...img, ...partial } : img,
          ),
        };
      }),
    }));
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      const urls = await uploadFiles(e.dataTransfer.files);
      if (selectedProjectId && urls.length > 0) {
        urls.forEach((url) => addImageToProject(selectedProjectId, url));
      }
    }
  }

  const tabs: { id: EditorTab; label: string; icon: React.ReactNode }[] = [
    { id: "projects", label: "Projects", icon: <FolderOpen size={16} /> },
    { id: "settings", label: "Site Settings", icon: <Settings size={16} /> },
    { id: "uploads", label: "Upload Files", icon: <Upload size={16} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#f0f0f0]">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-black/10 bg-white">
        <div className="border-b border-black/10 px-5 py-5">
          <h1 className="text-sm font-semibold text-ink">Portfolio Editor</h1>
          <p className="mt-0.5 text-xs text-ink-faint">Manage your site</p>
        </div>

        <nav className="flex-1 p-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`mb-1 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                activeTab === tab.id
                  ? "bg-ink text-white"
                  : "text-ink-muted hover:bg-canvas-soft"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-black/10 p-3 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="editor-btn-secondary flex w-full"
          >
            <Eye size={16} />
            Preview Site
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="editor-btn-primary flex w-full disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Saving..." : "Save & Publish"}
          </button>
          <button onClick={handleLogout} className="editor-btn-secondary flex w-full">
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-black/10 bg-white px-8 py-4">
          <div>
            <h2 className="text-lg font-medium text-ink">
              {activeTab === "projects" && "Manage Projects"}
              {activeTab === "settings" && "Site Settings"}
              {activeTab === "uploads" && "Upload Files"}
            </h2>
          </div>
          {message && (
            <div
              className={`rounded-md px-4 py-2 text-sm ${
                message.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {/* Projects Tab */}
          {activeTab === "projects" && (
            <div className="flex gap-8">
              {/* Project list */}
              <div className="w-72 shrink-0">
                <button
                  onClick={addProject}
                  className="editor-btn-primary mb-4 w-full"
                >
                  <Plus size={16} />
                  Add Project
                </button>
                <div className="space-y-2">
                  {data.projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => setSelectedProjectId(project.id)}
                      className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                        selectedProjectId === project.id
                          ? "border-ink bg-ink/5"
                          : "border-black/10 bg-white hover:bg-canvas-soft"
                      }`}
                    >
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded">
                        <Image
                          src={project.coverImage}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">
                          {project.title}
                        </p>
                        <p className="truncate text-xs text-ink-faint">
                          {project.category}
                        </p>
                      </div>
                      <GripVertical size={14} className="shrink-0 text-ink-faint" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Project editor */}
              {selectedProject && (
                <div className="flex-1 space-y-6">
                  <div className="editor-panel">
                    <h3 className="mb-4 text-sm font-semibold text-ink">
                      Project Details
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="editor-label">Title</label>
                        <input
                          className="editor-input"
                          value={selectedProject.title}
                          onChange={(e) => {
                            updateProject(selectedProject.id, {
                              title: e.target.value,
                              slug: slugify(e.target.value),
                            });
                          }}
                        />
                      </div>
                      <div>
                        <label className="editor-label">Category</label>
                        <input
                          className="editor-input"
                          value={selectedProject.category}
                          onChange={(e) =>
                            updateProject(selectedProject.id, {
                              category: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="editor-label">Description</label>
                        <textarea
                          className="editor-input resize-none"
                          rows={3}
                          value={selectedProject.description}
                          onChange={(e) =>
                            updateProject(selectedProject.id, {
                              description: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={selectedProject.featured}
                          onChange={(e) =>
                            updateProject(selectedProject.id, {
                              featured: e.target.checked,
                            })
                          }
                          className="h-4 w-4 rounded border-black/20"
                        />
                        <label htmlFor="featured" className="text-sm text-ink">
                          Show on homepage
                        </label>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteProject(selectedProject.id)}
                      className="editor-btn-danger mt-4"
                    >
                      <Trash2 size={14} />
                      Delete Project
                    </button>
                  </div>

                  {/* Photo Grid */}
                  <div className="editor-panel">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-ink">
                        Photo Grid
                      </h3>
                      <label className="editor-btn-secondary cursor-pointer">
                        <Upload size={14} />
                        Add Photos
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={async (e) => {
                            if (e.target.files) {
                              const urls = await uploadFiles(e.target.files);
                              urls.forEach((url) =>
                                addImageToProject(selectedProject.id, url),
                              );
                            }
                          }}
                        />
                      </label>
                    </div>

                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                      }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      className={`grid grid-cols-2 gap-4 md:grid-cols-3 ${
                        dragOver ? "rounded-lg ring-2 ring-ink/20 ring-offset-4" : ""
                      }`}
                    >
                      {selectedProject.images.map((image) => (
                        <div
                          key={image.id}
                          className="group relative overflow-hidden rounded-lg border border-black/10 bg-canvas-soft"
                        >
                          <div className="relative aspect-[4/3]">
                            <Image
                              src={image.src}
                              alt={image.alt}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="space-y-2 p-3">
                            <input
                              className="editor-input text-xs"
                              placeholder="Alt text"
                              value={image.alt}
                              onChange={(e) =>
                                updateImage(selectedProject.id, image.id, {
                                  alt: e.target.value,
                                })
                              }
                            />
                            <input
                              className="editor-input text-xs"
                              placeholder="Caption"
                              value={image.caption || ""}
                              onChange={(e) =>
                                updateImage(selectedProject.id, image.id, {
                                  caption: e.target.value,
                                })
                              }
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  updateProject(selectedProject.id, {
                                    coverImage: image.src,
                                  })
                                }
                                className="editor-btn-secondary flex-1 text-xs"
                              >
                                Set Cover
                              </button>
                              <button
                                onClick={() =>
                                  removeImageFromProject(
                                    selectedProject.id,
                                    image.id,
                                  )
                                }
                                className="rounded-md p-1.5 text-red-500 hover:bg-red-50"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {selectedProject.images.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-black/10 py-16 text-ink-faint">
                          <ImageIcon size={40} className="mb-3 opacity-40" />
                          <p className="text-sm">Drag & drop images here</p>
                          <p className="mt-1 text-xs">or use the Add Photos button</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="mx-auto max-w-2xl space-y-6">
              <div className="editor-panel">
                <h3 className="mb-4 text-sm font-semibold text-ink">
                  Identity
                </h3>
                <div className="grid gap-4">
                  <div>
                    <label className="editor-label">Your Name</label>
                    <input
                      className="editor-input"
                      value={data.settings.name}
                      onChange={(e) => updateSettings({ name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="editor-label">Site Title</label>
                    <input
                      className="editor-input"
                      value={data.settings.title}
                      onChange={(e) => updateSettings({ title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="editor-label">Tagline</label>
                    <input
                      className="editor-input"
                      value={data.settings.tagline}
                      onChange={(e) =>
                        updateSettings({ tagline: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="editor-label">About (Bio)</label>
                    <textarea
                      className="editor-input resize-none"
                      rows={5}
                      value={data.settings.about}
                      onChange={(e) =>
                        updateSettings({ about: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="editor-panel">
                <h3 className="mb-4 text-sm font-semibold text-ink">Contact</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="editor-label">Email</label>
                    <input
                      className="editor-input"
                      type="email"
                      value={data.settings.email}
                      onChange={(e) =>
                        updateSettings({ email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="editor-label">Location</label>
                    <input
                      className="editor-input"
                      value={data.settings.location}
                      onChange={(e) =>
                        updateSettings({ location: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="editor-panel">
                <h3 className="mb-4 text-sm font-semibold text-ink">
                  Social Links
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {(
                    [
                      "instagram",
                      "behance",
                      "linkedin",
                      "twitter",
                      "dribbble",
                    ] as const
                  ).map((platform) => (
                    <div key={platform}>
                      <label className="editor-label capitalize">
                        {platform}
                      </label>
                      <input
                        className="editor-input"
                        placeholder={`https://${platform}.com/...`}
                        value={data.settings.social[platform] || ""}
                        onChange={(e) =>
                          updateSettings({
                            social: {
                              ...data.settings.social,
                              [platform]: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="editor-panel">
                <h3 className="mb-4 text-sm font-semibold text-ink">
                  Layout
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="editor-label">
                      Grid Columns ({data.settings.gridColumns})
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={4}
                      value={data.settings.gridColumns}
                      onChange={(e) =>
                        updateSettings({
                          gridColumns: Number(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="editor-label">
                      Grid Gutter ({data.settings.gridGutter}px)
                    </label>
                    <input
                      type="range"
                      min={8}
                      max={48}
                      step={4}
                      value={data.settings.gridGutter}
                      onChange={(e) =>
                        updateSettings({
                          gridGutter: Number(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="masthead"
                      checked={data.settings.showMasthead}
                      onChange={(e) =>
                        updateSettings({ showMasthead: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-black/20"
                    />
                    <label htmlFor="masthead" className="text-sm text-ink">
                      Show homepage masthead
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Uploads Tab */}
          {activeTab === "uploads" && (
            <div className="mx-auto max-w-2xl">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={async (e) => {
                  e.preventDefault();
                  setDragOver(false);
                  if (e.dataTransfer.files.length > 0) {
                    await uploadFiles(e.dataTransfer.files);
                  }
                }}
                className={`editor-panel flex flex-col items-center py-20 transition-colors ${
                  dragOver ? "border-ink/30 bg-ink/5" : ""
                }`}
              >
                <Upload
                  size={48}
                  className={`mb-4 ${uploading ? "animate-bounce" : "text-ink-faint"}`}
                />
                <p className="text-lg font-medium text-ink">
                  {uploading ? "Uploading..." : "Drop files here"}
                </p>
                <p className="mt-2 text-sm text-ink-faint">
                  JPEG, PNG, WebP, GIF, or SVG — max 10MB each
                </p>
                <label className="editor-btn-primary mt-6 cursor-pointer">
                  <Upload size={16} />
                  Choose Files
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={async (e) => {
                      if (e.target.files) await uploadFiles(e.target.files);
                    }}
                  />
                </label>
              </div>
              <p className="mt-4 text-center text-xs text-ink-faint">
                Uploaded files are saved to your site. Add them to projects from
                the Projects tab.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
