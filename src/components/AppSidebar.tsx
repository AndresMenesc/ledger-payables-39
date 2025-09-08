import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import {
  BarChart3, FileText, Clock, Package, CheckCircle, 
  DollarSign, AlertTriangle, CreditCard, Truck, Building2,
  ChevronDown, ChevronRight, ChevronLeft, Home, Receipt, MessageSquare, Users, User, FileCheck, FolderOpen, Target, Calculator, ClipboardCheck, Banknote, Settings
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Estructura de navegación
interface NavigationItem {
  title: string;
  url?: string;
  icon: any;
  subItems?: NavigationItem[];
}

const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3
  },
  {
    title: "Cuenta de Cobro - Proveedor",
    url: "/cuenta-cobro-proveedor",
    icon: Building2
  },
  {
    title: "Revisión Admin",
    url: "/revision-admin",
    icon: ClipboardCheck
  },
  {
    title: "Lotes",
    url: "/lotes-aprobados",
    icon: CheckCircle
  },
  {
    title: "Anticipos",
    url: "/anticipos",
    icon: Banknote
  },
  {
    title: "Proveedores",
    url: "/proveedores",
    icon: Users
  },
  {
    title: "Conductores",
    url: "/conductores",
    icon: User
  },
  {
    title: "Vehículos",
    url: "/vehiculos",
    icon: Truck
  },
  {
    title: "Configuración",
    url: "/configuracion",
    icon: Settings
  }
]

export function AppSidebar() {
  const { open, setOpen } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const [collapsed, setCollapsed] = useState(false)
  const [openGroups, setOpenGroups] = useState<string[]>(["Dashboard", "Facturación", "Cuentas de Cobro", "Usuarios proveedores", "Gestión de Pagos", "Estados de Lotes", "Comercial"])

  const isActive = (path: string) => currentPath === path
  const hasActiveChild = (subItems?: NavigationItem[]) => 
    subItems?.some(item => item.url && isActive(item.url)) ?? false

  const toggleGroup = (groupTitle: string) => {
    setOpenGroups(prev => 
      prev.includes(groupTitle) 
        ? prev.filter(title => title !== groupTitle)
        : [...prev, groupTitle]
    )
  }

  const getNavClasses = (isActiveItem: boolean) =>
    isActiveItem 
      ? "bg-blue-600 text-white hover:bg-blue-700" 
      : "hover:bg-accent hover:text-accent-foreground"

  return (
    <aside className={`hidden md:flex ${collapsed ? "md:w-20" : "md:w-64"} shrink-0 border-r bg-card/30 transition-all`}>
      <div className="w-full p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-blue-600 grid place-content-center text-white font-bold">⛟</div>
            {!collapsed && (
              <div>
                <div className="text-sm font-semibold leading-none">Sistema Transportes</div>
                <div className="text-xs text-muted-foreground">Gestión v1.0</div>
              </div>
            )}
          </div>
          <Button size="icon" variant="ghost" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight className="h-4 w-4"/> : <ChevronLeft className="h-4 w-4"/>}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <div key={item.title}>
              {item.subItems ? (
                // Grupo con submódulos
                <Collapsible
                  open={openGroups.includes(item.title)}
                  onOpenChange={() => toggleGroup(item.title)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`w-full justify-between rounded-xl ${collapsed ? "px-0 flex justify-center" : ""} ${hasActiveChild(item.subItems) ? 'bg-blue-600 text-white' : ''}`}
                    >
                      <div className="flex items-center">
                        <item.icon className="h-4 w-4 mr-2" />
                        {!collapsed && item.title}
                      </div>
                      {!collapsed && (
                        openGroups.includes(item.title) ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  
                  {!collapsed && (
                    <CollapsibleContent className="ml-6 mt-2 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Button
                          key={subItem.title}
                          variant={isActive(subItem.url!) ? "secondary" : "ghost"}
                          asChild
                          className={`w-full justify-start rounded-xl ${isActive(subItem.url!) ? "bg-blue-600 text-white" : ""}`}
                        >
                          <NavLink to={subItem.url!}>
                            <subItem.icon className="h-4 w-4 mr-2" />
                            {subItem.title}
                          </NavLink>
                        </Button>
                      ))}
                    </CollapsibleContent>
                  )}
                </Collapsible>
              ) : (
                // Elemento simple
                <Button
                  variant={isActive(item.url!) ? "secondary" : "ghost"}
                  asChild
                  className={`w-full justify-start rounded-xl ${collapsed ? "px-0 flex justify-center" : ""} ${isActive(item.url!) ? "bg-blue-600 text-white" : ""}`}
                >
                  <NavLink to={item.url!}>
                    <item.icon className="h-4 w-4 mr-2" />
                    {!collapsed && item.title}
                  </NavLink>
                </Button>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="mt-auto pt-4">
            <div className="px-2 py-3 text-xs border-t">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Sistema Activo</span>
              </div>
              <p className="mt-1">Gestión de Transportes v1.0</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}