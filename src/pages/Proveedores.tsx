import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import {
  Download,
  Filter,
  MoreHorizontal,
  Plus,
  Upload,
  Users2,
  CheckCircle2,
  CalendarDays,
  Star,
  Search,
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
import { useToast } from "@/hooks/use-toast";

const Metric = ({ icon: Icon, label, value, sub }: any) => (
  <Card className="rounded-2xl border">
    <CardContent className="p-5 flex items-center gap-4">
      <div className="h-10 w-10 rounded-xl bg-blue-600/10 text-blue-700 grid place-content-center">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="text-2xl font-semibold leading-none tracking-tight">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
        {sub && <div className="text-[11px] mt-1 text-muted-foreground">{sub}</div>}
      </div>
    </CardContent>
  </Card>
);

const columns = ["Código", "Nombre Completo", "Identificación", "Teléfono", "Correo", "Usuario"];

const rows = [
  {
    code: "PROV-001",
    name: "Transportes Andinos S.A.S",
    nit: "900123456-1",
    phone: "+57 310 1234567",
    email: "contacto@transportesandinos.com",
    user: { blocked: true, lastLogin: "2024-08-30 15:30" },
  },
  {
    code: "PROV-002",
    name: "Logística del Pacífico Ltda",
    nit: "800987654-2",
    phone: "+57 320 9876543",
    email: "maria.gonzalez@logpacifica.com",
    user: { blocked: true, lastLogin: "2024-08-30 15:30" },
  },
  {
    code: "PROV-003",
    name: "Flota Norte S.A.S",
    nit: "900555888-3",
    phone: "+57 315 5558888",
    email: "roberto@flotanorte.com",
    user: { blocked: false, lastLogin: "2024-09-02 09:20" },
  },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Cuenta de Cobro", icon: FileText },
    { label: "Revisión Admin", icon: ClipboardList },
    { label: "Lotes", icon: Layers },
    { label: "Anticipos", icon: CreditCard },
    { label: "Proveedores", icon: Truck, active: true },
    { label: "Conductores", icon: User },
    { label: "Vehículos", icon: Truck },
    { label: "Configuración", icon: Settings },
  ];

  return (
    <div className={`hidden md:flex ${collapsed ? "md:w-20" : "md:w-64"} shrink-0 border-r bg-card/30 transition-all`}>
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
          {menuItems.map(({ label, icon: Icon, active }) => (
            <Button
              key={label}
              variant={active ? "secondary" : "ghost"}
              className={`w-full justify-start rounded-xl ${collapsed ? "px-0 flex justify-center" : ""} ${active ? "bg-blue-600 text-white" : ""}`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {!collapsed && label}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default function ProvidersManagementPage() {
  const { toast } = useToast();
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    title: string
    description: string
    onConfirm: () => void
  }>({ open: false, title: '', description: '', onConfirm: () => {} });

  const handleInactivar = (provider: any) => {
    setConfirmDialog({
      open: true,
      title: "Inactivar Proveedor",
      description: "¿Estás seguro de que deseas inactivar este proveedor?",
      onConfirm: () => {
        toast({
          title: "Proveedor inactivado",
          description: "El proveedor ha sido inactivado exitosamente.",
        });
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    });
  };

  const handleBloquearUsuario = (provider: any) => {
    setConfirmDialog({
      open: true,
      title: "Bloquear Usuario",
      description: "¿Estás seguro de que deseas bloquear el usuario de este proveedor?",
      onConfirm: () => {
        toast({
          title: "Usuario bloqueado",
          description: "El usuario del proveedor ha sido bloqueado exitosamente.",
        });
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    });
  };

  const handleEliminar = (provider: any) => {
    setConfirmDialog({
      open: true,
      title: "Eliminar Proveedor",
      description: "¿Estás seguro de que deseas eliminar este proveedor? Esta acción no se puede deshacer.",
      onConfirm: () => {
        toast({
          title: "Proveedor eliminado",
          description: "El proveedor ha sido eliminado del sistema.",
          variant: "destructive"
        });
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    });
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <Sidebar />
      <div className="flex-1">
        {/* Topbar */}
        <div className="sticky top-0 z-10 border-b bg-background/70 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-blue-600 grid place-content-center text-white font-bold">⛟</div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold tracking-tight">Gestión de Proveedores</h2>
              <p className="text-sm text-muted-foreground">Administra y gestiona todos los proveedores del sistema</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="rounded-xl bg-green-600 text-white hover:bg-green-700"><Upload className="h-4 w-4 mr-2"/>Importar Masivo</Button>
              <Button className="rounded-xl"><Plus className="h-4 w-4 mr-2"/>Nuevo Proveedor</Button>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Metric icon={Users2} label="Total Proveedores" value={245} sub={"+12% desde el mes pasado"} />
            <Metric icon={CheckCircle2} label="Activos" value={198} sub={"80.8% del total"} />
            <Metric icon={CalendarDays} label="Nuevos este mes" value={23} sub={"+18% vs mes anterior"} />
            <Metric icon={Star} label="Calificación Promedio" value={"4.2"} sub={"+0.2 vs mes anterior"} />
          </div>

          {/* List section */}
          <Card className="rounded-2xl border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Lista de Proveedores</CardTitle>
              <p className="text-sm text-muted-foreground">Gestiona y visualiza todos los proveedores registrados en el sistema</p>
            </CardHeader>
            <CardContent>
              {/* Toolbar */}
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2 w-full md:max-w-md">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar por código, nombre o NIT" className="pl-9 rounded-xl" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Tabs defaultValue="all" className="hidden sm:block">
                    <TabsList className="rounded-xl">
                      <TabsTrigger value="all">Todos</TabsTrigger>
                      <TabsTrigger value="active">Activos</TabsTrigger>
                      <TabsTrigger value="inactive">Inactivos</TabsTrigger>
                      <TabsTrigger value="blocked">Bloqueados</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <Button variant="outline" className="rounded-xl"><Filter className="h-4 w-4 mr-2"/>Filtros</Button>
                  <Button variant="outline" className="rounded-xl"><Download className="h-4 w-4 mr-2"/>Exportar</Button>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Table */}
              <div className="rounded-xl border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columns.map((c) => (
                        <TableHead key={c} className="whitespace-nowrap">{c}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((r) => (
                      <TableRow key={r.code} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{r.code}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8"><AvatarFallback>{r.name.slice(0,2).toUpperCase()}</AvatarFallback></Avatar>
                            <div className="min-w-0">
                              <div className="truncate font-medium">{r.name}</div>
                              <div className="text-xs text-muted-foreground">Proveedor</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{r.nit}</TableCell>
                        <TableCell>{r.phone}</TableCell>
                        <TableCell className="truncate max-w-[240px]">{r.email}</TableCell>
                        <TableCell>
                          <div className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              {r.user.blocked ? (
                                <Badge variant="secondary" className="rounded-md">Bloq. Usuario</Badge>
                              ) : (
                                <Badge className="rounded-md">Activo</Badge>
                              )}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4"/></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-xl">
                                  <DropdownMenuItem>Ver Detalle</DropdownMenuItem>
                                  <DropdownMenuItem>Editar</DropdownMenuItem>
                                  <DropdownMenuItem>Gestionar Documentos</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleInactivar(r)}>
                                    Inactivar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleBloquearUsuario(r)}>
                                    Bloq. Usuario
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive" onClick={() => handleEliminar(r)}>
                                    Eliminar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="mt-1 text-[11px] text-muted-foreground">Último login: {r.user.lastLogin}</div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination placeholder */}
              <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                <div>Mostrando 1–3 de 245</div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="rounded-lg">Anterior</Button>
                  <Button variant="outline" size="sm" className="rounded-lg">Siguiente</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDialog.onConfirm}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}