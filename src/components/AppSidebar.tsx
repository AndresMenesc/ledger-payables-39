import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  Layers,
  CreditCard,
  Truck,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// --------------- Sidebar (with toggle, DS aligned) ---------------
const Sidebar: React.FC<{ active: string }> = ({ active }) => {
  const [collapsed, setCollapsed] = useState(false);
  const menu = [
    { label: "Dashboard", icon: LayoutDashboard, url: "/" },
    { label: "Cuenta de Cobro", icon: FileText, url: "/cuenta-cobro-proveedor" },
    { label: "Revisión Admin", icon: ClipboardList, url: "/revision-admin" },
    { label: "Lotes", icon: Layers, url: "/lotes-aprobados" },
    { label: "Anticipos", icon: CreditCard, url: "/anticipos" },
    { label: "Proveedores", icon: Truck, url: "/proveedores" },
    { label: "Conductores", icon: User, url: "/conductores" },
    { label: "Vehículos", icon: Truck, url: "/vehiculos" },
    { label: "Configuración", icon: Settings, url: "/configuracion" },
  ];

  return (
    <aside className={`hidden md:flex ${collapsed ? "md:w-20" : "md:w-64"} shrink-0 border-r bg-card/30 transition-all`}>
      <div className="w-full p-4 space-y-6">
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
        <nav className="space-y-2">
          {menu.map(({ label, icon: Icon, url }) => (
            <Button
              key={label}
              variant={label === active ? "secondary" : "ghost"}
              className={`w-full justify-start rounded-xl ${collapsed ? "px-0 flex justify-center" : ""} ${label === active ? "bg-blue-600 text-white" : ""}`}
              onClick={() => window.location.href = url}
            >
              <Icon className="h-4 w-4 mr-2" />
              {!collapsed && label}
            </Button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export function AppSidebar() {
  return <Sidebar active="Conductores" />;
}