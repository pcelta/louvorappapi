function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="relative isolate overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu blur-3xl"
        >
          <div className="mx-auto aspect-[1155/678] w-[72rem] max-w-none bg-gradient-to-tr from-indigo-500 to-fuchsia-500 opacity-20" />
        </div>

        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-500 text-lg font-bold">
              L
            </span>
            <span className="text-lg font-semibold tracking-tight">LouvorApp</span>
          </div>
          <nav className="hidden gap-8 text-sm text-slate-300 sm:flex">
            <a className="hover:text-white" href="#features">
              Features
            </a>
            <a className="hover:text-white" href="#about">
              About
            </a>
          </nav>
        </header>

        <main className="mx-auto max-w-6xl px-6">
          <section className="py-24 text-center sm:py-32">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Frontend is live
            </span>
            <h1 className="mx-auto mt-6 max-w-3xl text-balance text-5xl font-bold tracking-tight sm:text-6xl">
              Worship planning,{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
                made simple
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-lg text-slate-400">
              React + Vite + Tailwind, wired into the LouvorApp monorepo. This is
              the starting point — build your screens from here.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <a
                href="#features"
                className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400"
              >
                Get started
              </a>
              <a
                href="#about"
                className="rounded-lg px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:text-white"
              >
                Learn more →
              </a>
            </div>
          </section>

          <section id="features" className="grid gap-6 pb-24 sm:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 transition hover:border-slate-700 hover:bg-slate-900/70"
              >
                <div className="text-2xl">{f.icon}</div>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{f.body}</p>
              </div>
            ))}
          </section>
        </main>

        <footer
          id="about"
          className="border-t border-slate-800 py-8 text-center text-sm text-slate-500"
        >
          LouvorApp monorepo · API + Web
        </footer>
      </div>
    </div>
  )
}

const features = [
  {
    icon: '⚡',
    title: 'Fast by default',
    body: 'Vite dev server with instant HMR and an optimized production build.',
  },
  {
    icon: '🎨',
    title: 'Tailwind v4',
    body: 'Utility-first styling with zero config, powered by the Vite plugin.',
  },
  {
    icon: '🔌',
    title: 'API-ready',
    body: 'Talks to the NestJS API over HTTP — wire up your first endpoint next.',
  },
]

export default App