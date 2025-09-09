import { useState } from "react"
import { NavLink, Outlet } from "react-router-dom"
import { Calculator, FileText, DollarSign, CheckCircle2, Package, Archive } from "lucide-react"
import { cn } from "@/lib/utils"

const navigationItems = [
  { name: "Pagos por preparar", path: "/pagos-preparar", icon: FileText },
  { name: "Pagos por procesar", path: "/pagos-procesar", icon: Package },
  { name: "Pagos por aprobar", path: "/pagos-aprobar", icon: CheckCircle2 },
  { name: "Pagados", path: "/pagados", icon: DollarSign },
  { name: "Sin lote de pago", path: "/sin-lote", icon: Archive },
  { name: "Lotes aprobados", path: "/lotes-aprobados", icon: CheckCircle2 },
]

const sidebarItems = [
  { name: "Cuenta de Cobro", path: "/cuenta-cobro", icon: Calculator },
  { name: "Préstamos", path: "/prestamos", icon: DollarSign },
]

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "bg-card border-r border-border w-64 fixed lg:sticky lg:top-0 h-screen z-40 transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          <div className="p-4">
            <h2 className="text-sm font-semibold text-muted-foreground mb-4">MÓDULOS</h2>
            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}