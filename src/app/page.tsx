import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-cafy-border px-4 py-5">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <span className="font-[family-name:var(--font-jakarta)] text-lg font-bold tracking-wider text-cafy-cyan">
            CAFY
          </span>
          <span className="text-xs text-cafy-muted">Content Creation on Autopilot</span>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center px-4">
        <div className="mx-auto max-w-5xl w-full py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-cafy-cyan mb-4 tracking-wide uppercase">
              AI-Powered Tools
            </p>
            <h1 className="font-[family-name:var(--font-jakarta)] text-4xl sm:text-5xl font-bold text-cafy-text leading-tight mb-6">
              Your content strategy,<br />
              <span className="text-cafy-cyan">automated.</span>
            </h1>
            <p className="text-lg text-cafy-muted leading-relaxed mb-12 max-w-lg">
              CAFY analyzes your content, finds growth opportunities, and builds systems that create content while you sleep.
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/audit"
              className="group rounded-xl border border-cafy-border bg-cafy-card p-6 transition-all hover:border-cafy-cyan/50 hover:bg-cafy-card/80"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-cafy-cyan/10">
                <svg className="h-5 w-5 text-cafy-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                </svg>
              </div>
              <h2 className="font-[family-name:var(--font-jakarta)] text-base font-semibold text-cafy-text mb-1.5 group-hover:text-cafy-cyan transition-colors">
                Content Audit
              </h2>
              <p className="text-sm text-cafy-muted leading-relaxed">
                Free AI analysis of your social media content with actionable recommendations.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-cafy-cyan opacity-0 group-hover:opacity-100 transition-opacity">
                Start Audit
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>

            {/* Placeholder cards for future tools */}
            <div className="rounded-xl border border-cafy-border/50 bg-cafy-card/30 p-6 opacity-50">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-cafy-border/50">
                <svg className="h-5 w-5 text-cafy-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h2 className="font-[family-name:var(--font-jakarta)] text-base font-semibold text-cafy-muted mb-1.5">
                Content Strategy
              </h2>
              <p className="text-sm text-cafy-muted/70 leading-relaxed">
                AI-generated content calendar tailored to your niche and goals.
              </p>
              <span className="mt-4 inline-block text-xs text-cafy-muted/50">Coming Soon</span>
            </div>

            <div className="rounded-xl border border-cafy-border/50 bg-cafy-card/30 p-6 opacity-50">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-cafy-border/50">
                <svg className="h-5 w-5 text-cafy-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                </svg>
              </div>
              <h2 className="font-[family-name:var(--font-jakarta)] text-base font-semibold text-cafy-muted mb-1.5">
                Auto Content
              </h2>
              <p className="text-sm text-cafy-muted/70 leading-relaxed">
                Automated content creation and scheduling powered by AI.
              </p>
              <span className="mt-4 inline-block text-xs text-cafy-muted/50">Coming Soon</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-cafy-border px-4 py-6">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <span className="text-xs text-cafy-muted/50">CAFY &copy; {new Date().getFullYear()}</span>
          <a
            href="https://www.linkedin.com/in/muhammadsaad-contentautomation/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-cafy-muted/50 hover:text-cafy-cyan transition-colors"
          >
            Built by Muhammad Saad
          </a>
        </div>
      </footer>
    </div>
  );
}
