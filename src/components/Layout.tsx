import { useState } from "react"
import { NavLink, Outlet } from "react-router-dom"
import { Menu, X, Calculator, FileText, DollarSign, CheckCircle2, Package, Archive } from "lucide-react"
import { Button } from "@/components/ui/button"
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
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 sm:px-6 h-16">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center gap-2">
              <Calculator className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Sistema de Gestión Contable</h1>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden lg:inline">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "bg-card border-r border-border w-64 fixed lg:sticky lg:top-16 h-[calc(100vh-4rem)] z-40 transition-transform duration-300 ease-in-out",
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

        {/* Mobile Navigation */}
        <div className="md:hidden">
          {sidebarOpen && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30" onClick={() => setSidebarOpen(false)} />
          )}
          <div className={cn(
            "fixed top-16 left-0 right-0 bg-card border-b border-border p-4 z-40 transition-transform duration-300 ease-in-out",
            sidebarOpen ? "translate-y-0" : "-translate-y-full"
          )}>
            <nav className="grid grid-cols-2 gap-2">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
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
        </div>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}