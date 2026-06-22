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
  ExternalLink,
  Box,
  Sparkles,
  AppWindow,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import type {
  SiteData,
  Collection,
  Application,
  SiteImage,
  CollectionCategory,
} from "@/lib/types";
import { SUBCATEGORIES } from "@/lib/categories";
import { slugify } from "@/lib/utils";

type EditorTab = "work" | "settings" | "uploads";
type WorkEditorMode = "generative-ai" | "3d" | "applications";

interface EditorDashboardProps {
  initialData: SiteData;
}

export function EditorDashboard({ initialData }: EditorDashboardProps) {
  const [data, setData] = useState<SiteData>(initialData);
  const [activeTab, setActiveTab] = useState<EditorTab>("work");
  const [workMode, setWorkMode] = useState<WorkEditorMode>("generative-ai");
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(
    initialData.collections.find((c) => c.category === "generative-ai")?.id ??
      initialData.collections[0]?.id ??
      null,
  );
  const [selectedAppId, setSelectedAppId] = useState<string | null>(
    initialData.applications[0]?.id ?? null,
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const filteredCollections = data.collections.filter((c) => c.category === workMode);
  const selectedCollection = data.collections.find((c) => c.id === selectedCollectionId);
  const selectedApp = data.applications.find((a) => a.id === selectedAppId);

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

  function updateCollection(id: string, partial: Partial<Collection>) {
    setData((prev) => ({
      ...prev,
      collections: prev.collections.map((c) =>
        c.id === id ? { ...c, ...partial } : c,
      ),
    }));
  }

  function addCollection(category: CollectionCategory) {
    const newCollection: Collection = {
      id: uuidv4(),
      slug: `new-collection-${Date.now()}`,
      title: "New Collection",
      description: "Collection description",
      category,
      subcategory: SUBCATEGORIES[category][0].slug,
      coverImage: "/uploads/sample-1.svg",
      featured: true,
      images: [],
      createdAt: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      collections: [newCollection, ...prev.collections],
    }));
    setSelectedCollectionId(newCollection.id);
  }

  function deleteCollection(id: string) {
    setData((prev) => ({
      ...prev,
      collections: prev.collections.filter((c) => c.id !== id),
    }));
    if (selectedCollectionId === id) {
      setSelectedCollectionId(
        data.collections.find((c) => c.id !== id && c.category === workMode)?.id ??
          null,
      );
    }
  }

  function updateApplication(id: string, partial: Partial<Application>) {
    setData((prev) => ({
      ...prev,
      applications: prev.applications.map((a) =>
        a.id === id ? { ...a, ...partial } : a,
      ),
    }));
  }

  function addApplication() {
    const newApp: Application = {
      id: uuidv4(),
      slug: `new-app-${Date.now()}`,
      title: "New Application",
      description: "Application description",
      screenshot: "/uploads/sample-3.svg",
      liveUrl: "https://",
      featured: true,
      createdAt: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      applications: [newApp, ...prev.applications],
    }));
    setSelectedAppId(newApp.id);
  }

  function deleteApplication(id: string) {
    setData((prev) => ({
      ...prev,
      applications: prev.applications.filter((a) => a.id !== id),
    }));
    if (selectedAppId === id) {
      setSelectedAppId(data.applications.find((a) => a.id !== id)?.id ?? null);
    }
  }

  function addImageToCollection(collectionId: string, url: string) {
    const newImage: SiteImage = {
      id: uuidv4(),
      src: url,
      alt: "",
      caption: "",
    };
    setData((prev) => ({
      ...prev,
      collections: prev.collections.map((c) => {
        if (c.id !== collectionId) return c;
        const images = [...c.images, newImage];
        return {
          ...c,
          images,
          coverImage: c.images.length === 0 ? url : c.coverImage,
        };
      }),
    }));
  }

  function removeImageFromCollection(collectionId: string, imageId: string) {
    setData((prev) => ({
      ...prev,
      collections: prev.collections.map((c) => {
        if (c.id !== collectionId) return c;
        return { ...c, images: c.images.filter((img) => img.id !== imageId) };
      }),
    }));
  }

  function updateImage(
    collectionId: string,
    imageId: string,
    partial: Partial<SiteImage>,
  ) {
    setData((prev) => ({
      ...prev,
      collections: prev.collections.map((c) => {
        if (c.id !== collectionId) return c;
        return {
          ...c,
          images: c.images.map((img) =>
            img.id === imageId ? { ...img, ...partial } : img,
          ),
        };
      }),
    }));
  }

  async function handleCollectionDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0 && selectedCollectionId) {
      const urls = await uploadFiles(e.dataTransfer.files);
      urls.forEach((url) => addImageToCollection(selectedCollectionId, url));
    }
  }

  const tabs: { id: EditorTab; label: string; icon: React.ReactNode }[] = [
    { id: "work", label: "Work", icon: <FolderOpen size={16} /> },
    { id: "settings", label: "Site Settings", icon: <Settings size={16} /> },
    { id: "uploads", label: "Upload Files", icon: <Upload size={16} /> },
  ];

  const workModes: { id: WorkEditorMode; label: string; icon: React.ReactNode }[] = [
    { id: "generative-ai", label: "Generative AI", icon: <Sparkles size={14} /> },
    { id: "3d", label: "3D", icon: <Box size={14} /> },
    { id: "applications", label: "Applications", icon: <AppWindow size={14} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#f0f0f0]">
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

        <div className="space-y-2 border-t border-black/10 p-3">
          <Link href="/" target="_blank" className="editor-btn-secondary flex w-full">
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

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-black/10 bg-white px-8 py-4">
          <h2 className="text-lg font-medium text-ink">
            {activeTab === "work" && "Manage Work"}
            {activeTab === "settings" && "Site Settings"}
            {activeTab === "uploads" && "Upload Files"}
          </h2>
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
          {activeTab === "work" && (
            <div>
              <div className="mb-6 flex flex-wrap gap-2">
                {workModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => {
                      setWorkMode(mode.id);
                      if (mode.id === "applications") return;
                      const first = data.collections.find((c) => c.category === mode.id);
                      setSelectedCollectionId(first?.id ?? null);
                    }}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors ${
                      workMode === mode.id
                        ? "bg-ink text-white"
                        : "bg-white text-ink-muted hover:text-ink"
                    }`}
                  >
                    {mode.icon}
                    {mode.label}
                  </button>
                ))}
              </div>

              {workMode === "applications" ? (
                <div className="flex gap-8">
                  <div className="w-72 shrink-0">
                    <button onClick={addApplication} className="editor-btn-primary mb-4 w-full">
                      <Plus size={16} />
                      Add Application
                    </button>
                    <div className="space-y-2">
                      {data.applications.map((app) => (
                        <button
                          key={app.id}
                          onClick={() => setSelectedAppId(app.id)}
                          className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                            selectedAppId === app.id
                              ? "border-ink bg-ink/5"
                              : "border-black/10 bg-white hover:bg-canvas-soft"
                          }`}
                        >
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded">
                            <Image src={app.screenshot} alt={app.title} fill className="object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-ink">{app.title}</p>
                            <p className="truncate text-xs text-ink-faint">Application</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedApp && (
                    <div className="flex-1 space-y-6">
                      <div className="editor-panel">
                        <h3 className="mb-4 text-sm font-semibold text-ink">Application Details</h3>
                        <div className="grid gap-4">
                          <div>
                            <label className="editor-label">Title</label>
                            <input
                              className="editor-input"
                              value={selectedApp.title}
                              onChange={(e) =>
                                updateApplication(selectedApp.id, {
                                  title: e.target.value,
                                  slug: slugify(e.target.value),
                                })
                              }
                            />
                          </div>
                          <div>
                            <label className="editor-label">Description</label>
                            <textarea
                              className="editor-input resize-none"
                              rows={3}
                              value={selectedApp.description}
                              onChange={(e) =>
                                updateApplication(selectedApp.id, {
                                  description: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <label className="editor-label">Live Demo URL</label>
                            <input
                              className="editor-input"
                              type="url"
                              value={selectedApp.liveUrl}
                              onChange={(e) =>
                                updateApplication(selectedApp.id, { liveUrl: e.target.value })
                              }
                              placeholder="https://your-app.com"
                            />
                          </div>
                          <div>
                            <label className="editor-label">Screenshot URL</label>
                            <input
                              className="editor-input"
                              value={selectedApp.screenshot}
                              onChange={(e) =>
                                updateApplication(selectedApp.id, {
                                  screenshot: e.target.value,
                                })
                              }
                            />
                          </div>
                          <label className="editor-btn-secondary w-fit cursor-pointer">
                            <Upload size={14} />
                            Upload Screenshot
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                if (e.target.files?.[0]) {
                                  const urls = await uploadFiles([e.target.files[0]]);
                                  if (urls[0]) {
                                    updateApplication(selectedApp.id, { screenshot: urls[0] });
                                  }
                                }
                              }}
                            />
                          </label>
                          {selectedApp.liveUrl.startsWith("http") && (
                            <a
                              href={selectedApp.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="editor-btn-secondary w-fit"
                            >
                              <ExternalLink size={14} />
                              Test Live Link
                            </a>
                          )}
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={selectedApp.featured}
                              onChange={(e) =>
                                updateApplication(selectedApp.id, {
                                  featured: e.target.checked,
                                })
                              }
                              className="h-4 w-4 rounded border-black/20"
                            />
                            <span className="text-sm text-ink">Show on visual index</span>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteApplication(selectedApp.id)}
                          className="editor-btn-danger mt-4"
                        >
                          <Trash2 size={14} />
                          Delete Application
                        </button>
                      </div>

                      <div className="editor-panel">
                        <h3 className="mb-4 text-sm font-semibold text-ink">Preview</h3>
                        <div className="overflow-hidden rounded-lg border border-black/10">
                          <div className="relative aspect-[16/10] bg-canvas-soft">
                            <Image
                              src={selectedApp.screenshot}
                              alt={selectedApp.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <p className="font-display text-lg">{selectedApp.title}</p>
                            <p className="mt-1 text-sm text-ink-muted">{selectedApp.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex gap-8">
                  <div className="w-72 shrink-0">
                    <button
                      onClick={() => addCollection(workMode as CollectionCategory)}
                      className="editor-btn-primary mb-4 w-full"
                    >
                      <Plus size={16} />
                      Add Collection
                    </button>
                    <div className="space-y-2">
                      {filteredCollections.map((collection) => (
                        <button
                          key={collection.id}
                          onClick={() => setSelectedCollectionId(collection.id)}
                          className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                            selectedCollectionId === collection.id
                              ? "border-ink bg-ink/5"
                              : "border-black/10 bg-white hover:bg-canvas-soft"
                          }`}
                        >
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded">
                            <Image
                              src={collection.coverImage}
                              alt={collection.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-ink">
                              {collection.title}
                            </p>
                            <p className="truncate text-xs text-ink-faint">
                              {SUBCATEGORIES[collection.category].find(
                                (s) => s.slug === collection.subcategory,
                              )?.label ?? collection.subcategory}
                            </p>
                          </div>
                          <GripVertical size={14} className="shrink-0 text-ink-faint" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedCollection && selectedCollection.category === workMode && (
                    <div className="flex-1 space-y-6">
                      <div className="editor-panel">
                        <h3 className="mb-4 text-sm font-semibold text-ink">Collection Details</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="editor-label">Title</label>
                            <input
                              className="editor-input"
                              value={selectedCollection.title}
                              onChange={(e) =>
                                updateCollection(selectedCollection.id, {
                                  title: e.target.value,
                                  slug: slugify(e.target.value),
                                })
                              }
                            />
                          </div>
                          <div>
                            <label className="editor-label">Subcategory</label>
                            <select
                              className="editor-input"
                              value={selectedCollection.subcategory}
                              onChange={(e) =>
                                updateCollection(selectedCollection.id, {
                                  subcategory: e.target.value,
                                })
                              }
                            >
                              {SUBCATEGORIES[selectedCollection.category].map((sub) => (
                                <option key={sub.slug} value={sub.slug}>
                                  {sub.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="sm:col-span-2">
                            <label className="editor-label">Description</label>
                            <textarea
                              className="editor-input resize-none"
                              rows={3}
                              value={selectedCollection.description}
                              onChange={(e) =>
                                updateCollection(selectedCollection.id, {
                                  description: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={selectedCollection.featured}
                              onChange={(e) =>
                                updateCollection(selectedCollection.id, {
                                  featured: e.target.checked,
                                })
                              }
                              className="h-4 w-4 rounded border-black/20"
                            />
                            <span className="text-sm text-ink">Show on visual index</span>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteCollection(selectedCollection.id)}
                          className="editor-btn-danger mt-4"
                        >
                          <Trash2 size={14} />
                          Delete Collection
                        </button>
                      </div>

                      <div className="editor-panel">
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-ink">Collection Images</h3>
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
                                    addImageToCollection(selectedCollection.id, url),
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
                          onDrop={handleCollectionDrop}
                          className={`grid grid-cols-2 gap-4 md:grid-cols-3 ${
                            dragOver ? "rounded-lg ring-2 ring-ink/20 ring-offset-4" : ""
                          }`}
                        >
                          {selectedCollection.images.map((image) => (
                            <div
                              key={image.id}
                              className="overflow-hidden rounded-lg border border-black/10 bg-canvas-soft"
                            >
                              <div className="relative aspect-[4/3]">
                                <Image src={image.src} alt={image.alt} fill className="object-cover" />
                              </div>
                              <div className="space-y-2 p-3">
                                <input
                                  className="editor-input text-xs"
                                  placeholder="Alt text"
                                  value={image.alt}
                                  onChange={(e) =>
                                    updateImage(selectedCollection.id, image.id, {
                                      alt: e.target.value,
                                    })
                                  }
                                />
                                <input
                                  className="editor-input text-xs"
                                  placeholder="Caption"
                                  value={image.caption || ""}
                                  onChange={(e) =>
                                    updateImage(selectedCollection.id, image.id, {
                                      caption: e.target.value,
                                    })
                                  }
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      updateCollection(selectedCollection.id, {
                                        coverImage: image.src,
                                      })
                                    }
                                    className="editor-btn-secondary flex-1 text-xs"
                                  >
                                    Set Cover
                                  </button>
                                  <button
                                    onClick={() =>
                                      removeImageFromCollection(
                                        selectedCollection.id,
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

                          {selectedCollection.images.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-black/10 py-16 text-ink-faint">
                              <ImageIcon size={40} className="mb-3 opacity-40" />
                              <p className="text-sm">Drag & drop images here</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="mx-auto max-w-2xl space-y-6">
              <div className="editor-panel">
                <h3 className="mb-4 text-sm font-semibold text-ink">Identity</h3>
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
                    <label className="editor-label">Tagline</label>
                    <input
                      className="editor-input"
                      value={data.settings.tagline}
                      onChange={(e) => updateSettings({ tagline: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="editor-label">About (Bio)</label>
                    <textarea
                      className="editor-input resize-none"
                      rows={5}
                      value={data.settings.about}
                      onChange={(e) => updateSettings({ about: e.target.value })}
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
                      onChange={(e) => updateSettings({ email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="editor-label">Location</label>
                    <input
                      className="editor-input"
                      value={data.settings.location}
                      onChange={(e) => updateSettings({ location: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="editor-panel">
                <h3 className="mb-4 text-sm font-semibold text-ink">Layout</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="editor-label">
                      Grid Gutter ({data.settings.gridGutter}px)
                    </label>
                    <input
                      type="range"
                      min={4}
                      max={32}
                      step={4}
                      value={data.settings.gridGutter}
                      onChange={(e) =>
                        updateSettings({ gridGutter: Number(e.target.value) })
                      }
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={data.settings.showMasthead}
                      onChange={(e) =>
                        updateSettings({ showMasthead: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-black/20"
                    />
                    <span className="text-sm text-ink">Show homepage masthead</span>
                  </div>
                </div>
              </div>
            </div>
          )}

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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
