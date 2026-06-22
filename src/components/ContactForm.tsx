"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

interface ContactFormProps {
  email: string;
}

export function ContactForm({ email }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const message = formData.get("message") as string;
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(message);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-black/5 bg-canvas-soft p-6">
        <CheckCircle size={20} className="text-green-600" />
        <p className="text-sm text-ink-muted">
          Your email client should open shortly. If it doesn&apos;t, email{" "}
          <a href={`mailto:${email}`} className="text-ink underline">
            {email}
          </a>{" "}
          directly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="editor-label">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="editor-input"
          placeholder="Your name"
        />
      </div>
      <div>
        <label htmlFor="message" className="editor-label">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className="editor-input resize-none"
          placeholder="Tell me about your project..."
        />
      </div>
      <button type="submit" className="editor-btn-primary">
        <Send size={16} />
        Send Message
      </button>
    </form>
  );
}
