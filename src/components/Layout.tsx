import {
  Timer,
  ListTodo,
  History,
  BarChart3,
  Settings,
} from "lucide-react";
import type { Page } from "@/lib/types";

interface LayoutProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  children: React.ReactNode;
}

const NAV_ITEMS: { page: Page; icon: typeof Timer; label: string }[] = [
  { page: "pomodoro", icon: Timer, label: "Pomodoro" },
  { page: "tasks", icon: ListTodo, label: "Tarefas" },
  { page: "history", icon: History, label: "Histórico" },
  { page: "stats", icon: BarChart3, label: "Estatísticas" },
  { page: "settings", icon: Settings, label: "Configurações" },
];

export function Layout({ currentPage, onNavigate, children }: LayoutProps) {
  return (
    <div className="flex h-screen">
      <nav className="flex w-20 shrink-0 flex-col items-center gap-2 border-r border-border bg-card px-2 py-5">
        {NAV_ITEMS.map(({ page, icon: Icon, label }) => {
          const isActive = currentPage === page;
          return (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              title={label}
              className={`flex h-12 w-14 flex-col items-center justify-center gap-1 rounded-xl transition-colors ${
                isActive
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[9px] font-medium leading-none">{label.split(" ")[0]}</span>
            </button>
          );
        })}
      </nav>

      <main className="flex-1 overflow-hidden bg-background">
        <div className="h-full overflow-y-auto p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
