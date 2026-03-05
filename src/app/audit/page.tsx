"use client";

import { useState } from "react";
import Link from "next/link";
import { submitAudit } from "@/lib/api";
import { AuditFormData, Platform } from "@/lib/types";
import { PLATFORMS } from "@/lib/constants";

type FormState = "idle" | "submitting" | "success" | "error";

export default function AuditPage() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [platform, setPlatform] = useState<Platform>("linkedin");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("submitting");
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data: AuditFormData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      platform: formData.get("platform") as Platform,
      profile_url: formData.get("profile_url") as string,
      niche: formData.get("niche") as string,
      content_goal: formData.get("content_goal") as string,
      frustration: formData.get("frustration") as string,
      submitted_at: new Date().toISOString(),
    };

    try {
      await submitAudit(data);
      setFormState("success");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
      setFormState("error");
    }
  }

  const selectedPlatform = PLATFORMS.find((p) => p.value === platform);

  if (formState === "success") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-cafy-cyan/10">
            <svg className="h-8 w-8 text-cafy-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-[family-name:var(--font-jakarta)] text-2xl font-bold text-cafy-text mb-3">
            Audit Submitted
          </h1>
          <p className="text-cafy-muted mb-8 leading-relaxed">
            Your content audit is being generated. Check your email in about 10 minutes for the full report.
          </p>
          <Link
            href="/"
            className="inline-block rounded-lg bg-cafy-card border border-cafy-border px-6 py-3 text-sm font-medium text-cafy-text transition-colors hover:border-cafy-cyan/50"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-cafy-muted hover:text-cafy-cyan transition-colors mb-8">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        <div className="mb-10">
          <h1 className="font-[family-name:var(--font-jakarta)] text-3xl font-bold text-cafy-text mb-3">
            Free Content Audit
          </h1>
          <p className="text-cafy-muted leading-relaxed">
            Get a personalized analysis of your content strategy — powered by AI. Results delivered to your email in ~10 minutes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name + Email row */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-cafy-text">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Jane Smith"
                className="w-full rounded-lg border border-cafy-border bg-cafy-card px-4 py-3 text-sm text-cafy-text placeholder:text-cafy-muted/50 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-cafy-text">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="jane@company.com"
                className="w-full rounded-lg border border-cafy-border bg-cafy-card px-4 py-3 text-sm text-cafy-text placeholder:text-cafy-muted/50 transition-colors"
              />
            </div>
          </div>

          {/* Platform */}
          <div>
            <label htmlFor="platform" className="mb-1.5 block text-sm font-medium text-cafy-text">
              Platform
            </label>
            <select
              id="platform"
              name="platform"
              required
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
              className="w-full rounded-lg border border-cafy-border bg-cafy-card px-4 py-3 text-sm text-cafy-text transition-colors appearance-none cursor-pointer"
            >
              {PLATFORMS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Profile URL */}
          <div>
            <label htmlFor="profile_url" className="mb-1.5 block text-sm font-medium text-cafy-text">
              Profile URL
            </label>
            <input
              id="profile_url"
              name="profile_url"
              type="url"
              required
              placeholder={selectedPlatform?.placeholder}
              className="w-full rounded-lg border border-cafy-border bg-cafy-card px-4 py-3 text-sm text-cafy-text placeholder:text-cafy-muted/50 transition-colors"
            />
          </div>

          {/* Niche */}
          <div>
            <label htmlFor="niche" className="mb-1.5 block text-sm font-medium text-cafy-text">
              Your Niche
            </label>
            <input
              id="niche"
              name="niche"
              type="text"
              required
              placeholder="e.g. SaaS Marketing, Fitness, Real Estate"
              className="w-full rounded-lg border border-cafy-border bg-cafy-card px-4 py-3 text-sm text-cafy-text placeholder:text-cafy-muted/50 transition-colors"
            />
          </div>

          {/* Content Goal */}
          <div>
            <label htmlFor="content_goal" className="mb-1.5 block text-sm font-medium text-cafy-text">
              Content Goal
            </label>
            <input
              id="content_goal"
              name="content_goal"
              type="text"
              required
              placeholder="e.g. Grow audience, generate leads, build authority"
              className="w-full rounded-lg border border-cafy-border bg-cafy-card px-4 py-3 text-sm text-cafy-text placeholder:text-cafy-muted/50 transition-colors"
            />
          </div>

          {/* Frustration */}
          <div>
            <label htmlFor="frustration" className="mb-1.5 block text-sm font-medium text-cafy-text">
              Biggest Content Frustration
            </label>
            <textarea
              id="frustration"
              name="frustration"
              required
              rows={3}
              placeholder="What's not working? What are you struggling with?"
              className="w-full rounded-lg border border-cafy-border bg-cafy-card px-4 py-3 text-sm text-cafy-text placeholder:text-cafy-muted/50 transition-colors resize-none"
            />
          </div>

          {/* Error message */}
          {formState === "error" && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {errorMessage}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={formState === "submitting"}
            className="w-full rounded-lg bg-cafy-cyan px-6 py-3.5 text-sm font-semibold text-cafy-bg transition-colors hover:bg-cafy-cyan-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formState === "submitting" ? (
              <span className="inline-flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting...
              </span>
            ) : (
              "Get My Free Audit"
            )}
          </button>

          <p className="text-center text-xs text-cafy-muted/70">
            Results are delivered via email. No spam, ever.
          </p>
        </form>
      </div>
    </div>
  );
}
