import Image from "next/image";

function TimerRingSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="60"
        cy="60"
        r="52"
        stroke="#1a1a2a"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle
        cx="60"
        cy="60"
        r="52"
        stroke="var(--accent-red)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="327"
        strokeDashoffset="82"
        transform="rotate(-90 60 60)"
        style={{ filter: "drop-shadow(0 0 8px var(--accent-red-glow))" }}
      />
      <text
        x="60"
        y="58"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="var(--foreground)"
        fontSize="18"
        fontFamily="var(--font-geist-sans)"
        fontWeight="500"
        letterSpacing="2"
      >
        18:24
      </text>
      <text
        x="60"
        y="74"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="var(--accent-red)"
        fontSize="7"
        fontFamily="var(--font-geist-sans)"
        fontWeight="500"
        letterSpacing="1"
      >
        FOCO
      </text>
      {[0, 1, 2, 3].map((i) => (
        <circle
          key={i}
          cx={49 + i * 8}
          cy="86"
          r="2.5"
          fill={i < 2 ? "var(--accent-red)" : "#1a1a2a"}
        />
      ))}
    </svg>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  accent,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent: string;
  delay: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-border bg-surface p-8 transition-all duration-500 hover:border-transparent hover:shadow-2xl animate-fade-in-up ${delay}`}
    >
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at 50% 50%, ${accent}08, transparent 40%)`,
        }}
      />
      <div className="relative z-10">
        <div
          className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${accent}15`, color: accent }}
        >
          {icon}
        </div>
        <h3 className="mb-3 font-display text-xl font-semibold tracking-tight">
          {title}
        </h3>
        <p className="text-[15px] leading-relaxed text-muted">{description}</p>
      </div>
    </div>
  );
}

function StatBlock({
  value,
  label,
  delay,
}: {
  value: string;
  label: string;
  delay: string;
}) {
  return (
    <div className={`text-center animate-fade-in-up ${delay}`}>
      <div className="font-display text-5xl font-bold tracking-tight text-accent-red md:text-6xl">
        {value}
      </div>
      <div className="mt-2 text-sm tracking-wide text-muted uppercase">
        {label}
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="relative overflow-hidden">
      {/* ── HERO ── */}
      <section className="noise relative flex min-h-screen flex-col items-center justify-center px-6 py-32">
        <div
          className="animate-glow-pulse pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, var(--accent-red-glow) 0%, transparent 70%)",
          }}
        />

        <div
          className="pointer-events-none absolute top-20 left-[10%] h-64 w-64 animate-float rounded-full opacity-[0.03]"
          style={{ background: "var(--accent-red)", filter: "blur(80px)" }}
        />
        <div
          className="pointer-events-none absolute bottom-32 right-[15%] h-48 w-48 animate-float rounded-full opacity-[0.04]"
          style={{
            background: "var(--accent-blue)",
            filter: "blur(60px)",
            animationDelay: "3s",
          }}
        />

        {/* Nav */}
        <nav className="animate-fade-in absolute top-0 right-0 left-0 z-50 flex items-center justify-between px-8 py-6 md:px-16">
          <div className="flex items-center gap-3">
            <Image
              src="/icon.png"
              alt="Duck Pomodoro"
              width={36}
              height={36}
              className="rounded-lg"
            />
            <span className="font-display text-lg font-semibold tracking-tight">
              Duck Pomodoro
            </span>
          </div>
          <div className="flex items-center gap-8">
            <a
              href="#features"
              className="hidden text-sm text-muted transition-colors hover:text-foreground md:block"
            >
              Recursos
            </a>
            <a
              href="#how-it-works"
              className="hidden text-sm text-muted transition-colors hover:text-foreground md:block"
            >
              Como funciona
            </a>
            <a
              href="#download"
              className="rounded-full bg-accent-red px-5 py-2 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-accent-red/25"
            >
              Download
            </a>
          </div>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="animate-fade-in-up delay-100 mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs tracking-wide text-muted uppercase">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "var(--accent-green)" }}
            />
            Desktop nativo &middot; Open source &middot; 100% offline
          </div>

          <h1 className="animate-fade-in-up delay-200 font-display text-5xl leading-[1.08] font-extrabold tracking-tight md:text-7xl lg:text-8xl">
            Foco profundo,
            <br />
            <span className="bg-gradient-to-r from-accent-red via-red-400 to-orange-400 bg-clip-text text-transparent">
              sem distrações.
            </span>
          </h1>

          <p className="animate-fade-in-up delay-300 mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
            Um timer Pomodoro que roda nativo no seu desktop. Gestão de tarefas,
            estatísticas detalhadas e sons ambientes — tudo leve, privado e sem
            depender do navegador.
          </p>

          <div className="animate-fade-in-up delay-400 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#download"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-accent-red px-8 py-4 text-base font-semibold text-white transition-all hover:shadow-2xl hover:shadow-accent-red/30"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Baixar gratuitamente
            </a>
            <a
              href="https://github.com/SrWalkerB/duck-pomodoro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-4 text-base font-medium text-muted transition-all hover:border-foreground/20 hover:text-foreground"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Ver no GitHub
            </a>
          </div>
        </div>

        {/* Timer preview */}
        <div className="animate-fade-in-up delay-600 relative z-10 mt-20">
          <div className="animate-float">
            <TimerRingSVG className="h-48 w-48 drop-shadow-2xl md:h-56 md:w-56" />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="animate-fade-in delay-800 absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 text-muted">
            <span className="text-[11px] tracking-widest uppercase">
              Rolar
            </span>
            <svg
              width="16"
              height="24"
              viewBox="0 0 16 24"
              fill="none"
              className="animate-bounce"
            >
              <rect
                x="1"
                y="1"
                width="14"
                height="22"
                rx="7"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle cx="8" cy="8" r="2" fill="currentColor">
                <animate
                  attributeName="cy"
                  values="8;14;8"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="relative px-6 py-32 md:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-20 text-center">
            <span className="animate-fade-in-up mb-4 inline-block text-xs font-medium tracking-widest text-accent-red uppercase">
              Recursos
            </span>
            <h2 className="animate-fade-in-up delay-100 font-display text-4xl font-bold tracking-tight md:text-5xl">
              Tudo que você precisa
              <br />
              <span className="text-muted">para manter o foco.</span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              }
              title="Timer Pomodoro"
              description="Sessões de foco, pausas curtas e longas com durações configuráveis. O ciclo avança automaticamente para que você nunca perca o ritmo."
              accent="#ef4444"
              delay="delay-100"
            />
            <FeatureCard
              icon={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9" />
                  <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" />
                </svg>
              }
              title="Gestão de Tarefas"
              description="Crie tarefas, vincule ao timer e acompanhe quantos pomodoros dedicou a cada uma. Veja seu progresso real."
              accent="#22c55e"
              delay="delay-200"
            />
            <FeatureCard
              icon={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                  <path d="m19 9-5 5-4-4-3 3" />
                </svg>
              }
              title="Estatísticas"
              description="Dashboard com métricas diárias, semanais e mensais. Gráfico de atividade dos últimos 30 dias para manter a consistência."
              accent="#3b82f6"
              delay="delay-300"
            />
            <FeatureCard
              icon={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              }
              title="Sons Ambientes"
              description="Chuva inclusa de fábrica. Importe seus próprios áudios — MP3, WAV, FLAC. O som toca só durante o foco e pausa nos intervalos."
              accent="#ef4444"
              delay="delay-400"
            />
            <FeatureCard
              icon={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              }
              title="100% Privado"
              description="Seus dados ficam no seu computador, em um banco SQLite local. Sem conta, sem nuvem, sem telemetria. Zero dependência de internet."
              accent="#22c55e"
              delay="delay-500"
            />
            <FeatureCard
              icon={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              }
              title="Open Source"
              description="Código aberto no GitHub. Feito com Tauri 2, React e Rust — leve como um app nativo porque é um app nativo."
              accent="#3b82f6"
              delay="delay-600"
            />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        id="how-it-works"
        className="noise relative overflow-hidden px-6 py-32 md:px-16"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="mx-auto max-w-5xl">
          <div className="mb-24 text-center">
            <span className="mb-4 inline-block text-xs font-medium tracking-widest text-accent-red uppercase">
              Como funciona
            </span>
            <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
              Simples por design.
            </h2>
          </div>

          <div className="space-y-32">
            {/* Step 1 */}
            <div className="flex flex-col items-center gap-16 md:flex-row">
              <div className="flex-1">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-accent-red/30 font-display text-sm font-bold text-accent-red">
                  1
                </div>
                <h3 className="mb-4 font-display text-2xl font-bold tracking-tight md:text-3xl">
                  Escolha uma tarefa
                  <br />
                  <span className="text-muted">ou apenas comece.</span>
                </h3>
                <p className="max-w-md text-base leading-relaxed text-muted">
                  Crie tarefas para organizar seu trabalho ou use o modo simples
                  — sem tarefa vinculada, só o timer e você.
                </p>
              </div>
              <div className="flex flex-1 justify-center">
                <div className="w-72 rounded-2xl border border-border bg-surface p-6 shadow-2xl shadow-black/40">
                  <div className="mb-4 text-xs tracking-wide text-muted uppercase">
                    Tarefas ativas
                  </div>
                  {[
                    { name: "Estudar React Hooks", pomos: 4 },
                    { name: "Escrever artigo blog", pomos: 2 },
                    { name: "Revisar PR #42", pomos: 1 },
                  ].map((task, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 ${i === 0 ? "border border-accent-red/20 bg-accent-red/5" : "bg-transparent"} ${i > 0 ? "mt-2" : ""}`}
                    >
                      <span
                        className={`text-sm ${i === 0 ? "font-medium text-foreground" : "text-muted"}`}
                      >
                        {task.name}
                      </span>
                      <span className="text-xs text-muted">
                        {task.pomos}
                        <span className="ml-0.5 text-accent-red">p</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col-reverse items-center gap-16 md:flex-row">
              <div className="flex flex-1 justify-center">
                <div className="relative flex flex-col items-center">
                  <TimerRingSVG className="h-52 w-52" />
                  <div className="mt-6 flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 18V5l12-2v13" />
                      <circle cx="6" cy="18" r="3" />
                      <circle cx="18" cy="16" r="3" />
                    </svg>
                    <span className="text-xs text-muted">
                      Chuva &middot; 70%
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-accent-red/30 font-display text-sm font-bold text-accent-red">
                  2
                </div>
                <h3 className="mb-4 font-display text-2xl font-bold tracking-tight md:text-3xl">
                  Foque com
                  <br />
                  <span className="text-muted">som ambiente.</span>
                </h3>
                <p className="max-w-md text-base leading-relaxed text-muted">
                  O timer roda com som de chuva (ou seu áudio favorito) durante
                  as sessões de foco. Nas pausas, silêncio — seu cérebro
                  descansa.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center gap-16 md:flex-row">
              <div className="flex-1">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-accent-red/30 font-display text-sm font-bold text-accent-red">
                  3
                </div>
                <h3 className="mb-4 font-display text-2xl font-bold tracking-tight md:text-3xl">
                  Acompanhe sua
                  <br />
                  <span className="text-muted">evolução.</span>
                </h3>
                <p className="max-w-md text-base leading-relaxed text-muted">
                  Estatísticas mostram sua consistência ao longo do tempo. Veja
                  quantos pomodoros por dia, semana e mês — e onde você está
                  investindo seu foco.
                </p>
              </div>
              <div className="flex flex-1 justify-center">
                <div className="w-72 rounded-2xl border border-border bg-surface p-6 shadow-2xl shadow-black/40">
                  <div className="mb-5 text-xs tracking-wide text-muted uppercase">
                    Últimos 7 dias
                  </div>
                  <div className="mb-6 flex items-end justify-between gap-2">
                    {[40, 70, 55, 90, 30, 80, 65].map((h, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center gap-1.5"
                      >
                        <div
                          className="w-5 rounded-sm transition-all"
                          style={{
                            height: `${h}px`,
                            backgroundColor: "#ef4444",
                            opacity: i === 3 ? 1 : 0.3,
                          }}
                        />
                        <span className="text-[10px] text-muted">
                          {["S", "T", "Q", "Q", "S", "S", "D"][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-3 border-t border-border pt-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-accent-red">
                        42
                      </div>
                      <div className="text-[10px] text-muted">Total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-accent-green">
                        6.0
                      </div>
                      <div className="text-[10px] text-muted">Média/dia</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-accent-blue">
                        9
                      </div>
                      <div className="text-[10px] text-muted">Recorde</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TECH STRIP ── */}
      <section className="border-y border-border bg-surface/50 px-6 py-20 md:px-16">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-16 gap-y-8">
          {[
            { name: "Tauri 2", desc: "Backend nativo" },
            { name: "React 19", desc: "Interface reativa" },
            { name: "Rust", desc: "Performance real" },
            { name: "SQLite", desc: "Dados locais" },
            { name: "Tailwind", desc: "Estilo moderno" },
          ].map((tech) => (
            <div key={tech.name} className="text-center">
              <div className="font-display text-lg font-semibold tracking-tight">
                {tech.name}
              </div>
              <div className="mt-0.5 text-xs text-muted">{tech.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="px-6 py-32 md:px-16">
        <div className="mx-auto grid max-w-3xl grid-cols-3 gap-8">
          <StatBlock value="<2MB" label="Tamanho do app" delay="delay-100" />
          <StatBlock value="0" label="Dados na nuvem" delay="delay-200" />
          <StatBlock value="100%" label="Offline" delay="delay-300" />
        </div>
      </section>

      {/* ── DOWNLOAD CTA ── */}
      <section
        id="download"
        className="noise relative overflow-hidden px-6 py-32 md:px-16"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <div
          className="animate-glow-pulse pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, var(--accent-red-glow) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <Image
            src="/icon.png"
            alt="Duck Pomodoro"
            width={80}
            height={80}
            className="mx-auto mb-8 rounded-2xl shadow-2xl shadow-accent-red/20"
          />
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-6xl">
            Pronto para focar?
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-lg text-muted">
            Baixe o Duck Pomodoro e comece a transformar suas sessões de
            trabalho. Disponível para Linux — Windows em breve.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#"
              className="group flex items-center gap-3 rounded-2xl border border-border bg-surface px-8 py-5 transition-all hover:border-accent-red/40 hover:shadow-xl hover:shadow-accent-red/10"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-foreground"
              >
                <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.368 1.884 1.43.39.033.77-.396 1.03-.899.26-.504.34-1.07.26-1.49l-.003-.04c.383-.278.558-.676.623-1.093.065-.417.03-.858-.09-1.252-.118-.39-.298-.8-.494-1.07-.103-.15-.218-.263-.34-.335.26-.137.47-.331.636-.56.38-.53.536-1.185.509-1.882-.027-.7-.196-1.448-.517-2.1-.445-.906-.845-1.545-1.103-2.3-.26-.756-.355-1.624-.173-2.873.203-1.448.096-2.468-.218-3.233-.314-.765-.755-1.267-1.168-1.569-.47-.345-.878-.525-1.077-.666-.248-.178-.301-.25-.457-.607-.376-.875-.677-1.553-1.168-2.056-.487-.5-1.14-.808-2.117-.808z" />
              </svg>
              <div className="text-left">
                <div className="text-sm font-semibold">
                  Download para Linux
                </div>
                <div className="text-xs text-muted">
                  .deb, .rpm, .AppImage
                </div>
              </div>
            </a>

            <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-surface/50 px-8 py-5 opacity-50">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-foreground"
              >
                <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
              </svg>
              <div className="text-left">
                <div className="text-sm font-semibold">Windows</div>
                <div className="text-xs text-muted">Em breve</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border px-6 py-10 md:px-16">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Image
              src="/icon.png"
              alt="Duck Pomodoro"
              width={24}
              height={24}
              className="rounded-md"
            />
            <span className="text-sm text-muted">
              Duck Pomodoro &copy; 2026
            </span>
          </div>
          <div className="flex gap-6">
            <a
              href="https://github.com/SrWalkerB/duck-pomodoro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              GitHub
            </a>
            <a
              href="https://github.com/SrWalkerB/duck-pomodoro/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              Issues
            </a>
            <a
              href="https://github.com/SrWalkerB/duck-pomodoro/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              Releases
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
