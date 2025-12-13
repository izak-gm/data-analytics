import {
  LayoutDashboard,
  BarChart3,
  Filter,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";

const navigation = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Branch Performance", href: "/branch-data", icon: TrendingUp },
  { name: "Banking Log", href: "/banking-data", icon: BarChart3 },
  { name: "Filters and validation", href: "/validation-filtering", icon: Filter },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="border-r border-border bg-card flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;

          return (
            <button
              key={item.name}
              onClick={() => navigate(item.href)} //  navigate on click
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
