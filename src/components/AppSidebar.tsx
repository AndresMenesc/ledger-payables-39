import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import {
  BarChart3, FileText, Clock, Package, CheckCircle, 
  DollarSign, AlertTriangle, CreditCard, Truck, Building2,
  ChevronDown, ChevronRight, Home, Receipt, MessageSquare, Users, User, FileCheck, FolderOpen, Target, Calculator, ClipboardCheck, Banknote
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Estructura de navegación
const navigationItems = [
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
    title: "Facturación",
    icon: Receipt,
    subItems: [
      {
        title: "Liquidaciones",
        url: "/liquidaciones",
        icon: Calculator
      },
      {
        title: "Facturas",
        url: "/facturas",
        icon: FileText
      }
    ]
  },
  {
    title: "Cuentas de Cobro",
    icon: Receipt,
    subItems: [
      {
        title: "Cuentas de Cobro",
        url: "/cuenta-cobro",
        icon: Receipt
      }      
    ]
  },
  {
    title: "Gestión de Pagos",
    icon: DollarSign,
    subItems: [
      {
        title: "Por Preparar",
        url: "/pagos-preparar",
        icon: FileText
      },
      {
        title: "Por Procesar", 
        url: "/pagos-procesar",
        icon: Package
      },
      {
        title: "Por Aprobar",
        url: "/pagos-aprobar",
        icon: Clock
      }
    ]
  },
  {
    title: "Préstamos",
    url: "/prestamos",
    icon: CreditCard
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
    title: "Validación de documentos",
    url: "/validacion-proveedores",
    icon: CheckCircle
  },
  {
    title: "FUEC",
    url: "/fuec",
    icon: FileCheck
  },
  {
    title: "Comercial",
    icon: Target,
    subItems: [
      {
        title: "Cotizaciones",
        url: "/cotizaciones",
        icon: FileText
      },
      {
        title: "Portafolios",
        url: "/portafolios",
        icon: FolderOpen
      }
    ]
  },
  {
    title: "Gestión PQR",
    url: "/pqr",
    icon: MessageSquare
  },
  {
    title: "Usuarios proveedores",
    icon: Users,
    subItems: [
      {
        title: "Generar cuenta de cobro",
        url: "/generar-cuenta-cobro",
        icon: Receipt
      },
      {
        title: "Documentación",
        url: "/documentacion",
        icon: FileText
      }
    ]
  }
]

export function AppSidebar() {
  const { open, setOpen } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const [openGroups, setOpenGroups] = useState<string[]>(["Dashboard", "Facturación", "Cuentas de Cobro", "Usuarios proveedores", "Gestión de Pagos", "Estados de Lotes", "Comercial"])

  const isActive = (path: string) => currentPath === path
  const hasActiveChild = (subItems?: any[]) => 
    subItems?.some(item => isActive(item.url)) ?? false

  const toggleGroup = (groupTitle: string) => {
    setOpenGroups(prev => 
      prev.includes(groupTitle) 
        ? prev.filter(title => title !== groupTitle)
        : [...prev, groupTitle]
    )
  }

  const getNavClasses = (isActiveItem: boolean) =>
    isActiveItem 
      ? "bg-primary text-primary-foreground hover:bg-primary/90" 
      : "hover:bg-accent hover:text-accent-foreground"

  return (
    <Sidebar className={!open ? "w-14" : "w-48 sm:w-56 lg:w-64"}>
      <SidebarContent>
        {/* Header */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm sm:text-base lg:text-lg font-bold text-primary px-2 sm:px-4 py-4 sm:py-6">
            {open && (
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="hidden sm:block">Sistema Transportes</span>
              </div>
            )}
            {!open && <Truck className="h-5 w-5 sm:h-6 sm:w-6 mx-auto" />}
          </SidebarGroupLabel>
        </SidebarGroup>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.subItems ? (
                    // Grupo con submódulos
                    <Collapsible
                      open={openGroups.includes(item.title)}
                      onOpenChange={() => toggleGroup(item.title)}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton 
                          className={`w-full justify-between ${hasActiveChild(item.subItems) ? 'bg-accent' : ''}`}
                        >
                          <div className="flex items-center">
                            <item.icon className="h-4 w-4" />
                            {open && <span className="ml-3">{item.title}</span>}
                          </div>
                          {open && (
                            openGroups.includes(item.title) ? 
                            <ChevronDown className="h-4 w-4" /> : 
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      
                      {open && (
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.subItems.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
                                  <NavLink 
                                    to={subItem.url} 
                                    className={getNavClasses(isActive(subItem.url))}
                                  >
                                    <subItem.icon className="h-4 w-4" />
                                    <span className="ml-3">{subItem.title}</span>
                                  </NavLink>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      )}
                    </Collapsible>
                  ) : (
                    // Elemento simple
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url!} 
                        className={getNavClasses(isActive(item.url!))}
                      >
                        <item.icon className="h-4 w-4" />
                        {open && <span className="ml-3">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Footer */}
        {open && (
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <div className="px-2 sm:px-4 py-3 text-xs border-t">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="hidden sm:block">Sistema Activo</span>
                </div>
                <p className="mt-1 hidden sm:block">Gestión de Transportes v1.0</p>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  )
}