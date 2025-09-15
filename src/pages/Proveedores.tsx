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
  List,
  LayoutGrid,
  Edit,
  Trash2,
  FileText,
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

const rows = [
  {
    id: "1",
    code: "PROV-001",
    name: "Transportes Andinos S.A.S",
    nit: "900123456-1",
    phone: "+57 310 1234567",
    email: "contacto@transportesandinos.com",
    estado: "activo",
    user: { blocked: false, lastLogin: "2024-08-30 15:30" },
    vehiculos: [
      { placa: "ABC123", conductor: "Juan Carlos Pérez" },
      { placa: "DEF456", conductor: "Juan Carlos Pérez" }
    ],
    conductores: [
      { nombre: "Juan Carlos Pérez", cedula: "12345678", telefono: "+57 300 123 4567" }
    ]
  },
  {
    id: "2",
    code: "PROV-002", 
    name: "Logística del Pacífico Ltda",
    nit: "800987654-2",
    phone: "+57 320 9876543",
    email: "maria.gonzalez@logpacifica.com",
    estado: "activo",
    user: { blocked: true, lastLogin: "2024-08-30 15:30" },
    vehiculos: [
      { placa: "XYZ789", conductor: "María José García" }
    ],
    conductores: [
      { nombre: "María José García", cedula: "87654321", telefono: "+57 315 987 6543" }
    ]
  },
  {
    id: "3",
    code: "PROV-003",
    name: "Flota Norte S.A.S",
    nit: "900555888-3", 
    phone: "+57 315 5558888",
    email: "roberto@flotanorte.com",
    estado: "inactivo",
    user: { blocked: false, lastLogin: "2024-09-02 09:20" },
    vehiculos: [
      { placa: "GHI123", conductor: "Carlos Andrés Rodríguez" }
    ],
    conductores: [
      { nombre: "Carlos Andrés Rodríguez", cedula: "11223344", telefono: "+57 301 555 7890" }
    ]
  },
];

export default function Proveedores() {
  const { toast } = useToast();
  const [view, setView] = useState<"list" | "cards">("list");
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [showProviderDetails, setShowProviderDetails] = useState(false);
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

  const handleActivar = (provider: any) => {
    setConfirmDialog({
      open: true,
      title: "Activar Proveedor",
      description: "¿Estás seguro de que deseas activar este proveedor?",
      onConfirm: () => {
        toast({
          title: "Proveedor activado",
          description: "El proveedor ha sido activado exitosamente.",
        });
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    });
  };

  const handleBloquearUsuario = (provider: any) => {
    const isBlocked = provider.user.blocked;
    setConfirmDialog({
      open: true,
      title: isBlocked ? "Desbloquear Usuario" : "Bloquear Usuario",
      description: `¿Estás seguro de que deseas ${isBlocked ? 'desbloquear' : 'bloquear'} el usuario de este proveedor?`,
      onConfirm: () => {
        toast({
          title: isBlocked ? "Usuario desbloqueado" : "Usuario bloqueado",
          description: `El usuario del proveedor ha sido ${isBlocked ? 'desbloqueado' : 'bloqueado'} exitosamente.`,
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

  const handleVerDetalle = (provider: any) => {
    setSelectedProvider(provider);
    setShowProviderDetails(true);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header + CTAs */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-6 pb-0">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Gestión de Proveedores</h1>
          <p className="text-sm text-muted-foreground">Administra y gestiona todos los proveedores del sistema</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={view === "list" ? "secondary" : "outline"} size="sm" className="rounded-xl" onClick={() => setView("list")}>
            <List className="h-4 w-4 mr-1"/> Lista
          </Button>
          <Button variant={view === "cards" ? "secondary" : "outline"} size="sm" className="rounded-xl" onClick={() => setView("cards")}>
            <LayoutGrid className="h-4 w-4 mr-1"/> Tarjetas
          </Button>
          <Button variant="outline" className="rounded-xl bg-green-600 text-white hover:bg-green-700">
            <Upload className="h-4 w-4 mr-2"/>Importar Masivo
          </Button>
          <Button className="rounded-xl">
            <Plus className="h-4 w-4 mr-2"/>Nuevo Proveedor
          </Button>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Metric icon={Users2} label="Total Proveedores" value={245} sub={"+12% desde el mes pasado"} />
          <Metric icon={CheckCircle2} label="Activos" value={198} sub={"80.8% del total"} />
          <Metric icon={CalendarDays} label="Nuevos este mes" value={23} sub={"+18% vs mes anterior"} />
          <Metric icon={Star} label="Calificación Promedio" value={"4.2"} sub={"+0.2 vs mes anterior"} />
        </div>

        {view === "list" ? (
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
                      <TableHead>Código</TableHead>
                      <TableHead>Nombre Completo</TableHead>
                      <TableHead>Identificación</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Correo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
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
                          <Badge className={`rounded-md text-xs ${r.estado === "activo" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
                            {r.estado === "activo" ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4"/></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl">
                              <div className="px-2 py-1.5 text-xs text-muted-foreground border-b">
                                Último login: {r.user.lastLogin}
                              </div>
                              <DropdownMenuItem onClick={() => handleVerDetalle(r)}>
                                <FileText className="mr-2 h-4 w-4" />
                                Ver Detalle
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem>Gestionar Documentos</DropdownMenuItem>
                              {r.estado === "activo" ? (
                                <DropdownMenuItem onClick={() => handleInactivar(r)}>
                                  Inactivar
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleActivar(r)}>
                                  Activar
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleBloquearUsuario(r)}>
                                {r.user.blocked ? "Desbloq. Usuario" : "Bloq. Usuario"}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={() => handleEliminar(r)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
        ) : (
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

              {/* Cards View */}
              <div className="rounded-xl border overflow-hidden divide-y">
                {rows.map((r) => (
                  <div key={r.id} className="p-3 hover:bg-muted/40">
                    {/* Row head inside gray bar with 3-dot menu */}
                    <div className="bg-muted/60 rounded-lg p-3 flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{r.name.slice(0,2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="font-semibold leading-tight truncate">{r.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{r.code}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs font-medium px-2 py-0.5 rounded-md ${r.estado === "activo" ? "bg-emerald-600 text-white" : "bg-amber-500 text-white"}`}>
                          {r.estado === "activo" ? "Activo" : "Inactivo"}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4"/></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl">
                            <div className="px-2 py-1.5 text-xs text-muted-foreground border-b">
                              Último login: {r.user.lastLogin}
                            </div>
                            <DropdownMenuItem onClick={() => handleVerDetalle(r)}>Ver Detalle</DropdownMenuItem>
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem>Gestionar Documentos</DropdownMenuItem>
                            {r.estado === "activo" ? (
                              <DropdownMenuItem onClick={() => handleInactivar(r)}>
                                Inactivar
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleActivar(r)}>
                                Activar
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleBloquearUsuario(r)}>
                              {r.user.blocked ? "Desbloq. Usuario" : "Bloq. Usuario"}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleEliminar(r)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Provider Details */}
                    <div className="mt-3 grid grid-cols-1 gap-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="min-w-[160px]">
                          <div className="text-sm font-medium text-muted-foreground">Identificación</div>
                          <div className="text-sm">{r.nit}</div>
                        </div>
                        <div className="min-w-[160px]">
                          <div className="text-sm font-medium text-muted-foreground">Teléfono</div>
                          <div className="text-sm">{r.phone}</div>
                        </div>
                        <div className="min-w-[160px]">
                          <div className="text-sm font-medium text-muted-foreground">Correo</div>
                          <div className="text-sm truncate">{r.email}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
        )}
      </main>

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

      {/* Provider Details Dialog */}
      {selectedProvider && (
        <AlertDialog open={showProviderDetails} onOpenChange={setShowProviderDetails}>
          <AlertDialogContent className="max-w-4xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Detalle del Proveedor: {selectedProvider.name}</AlertDialogTitle>
            </AlertDialogHeader>
            
            <div className="space-y-6">
              {/* Provider Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Código</div>
                  <div className="text-sm">{selectedProvider.code}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">NIT</div>
                  <div className="text-sm">{selectedProvider.nit}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Teléfono</div>
                  <div className="text-sm">{selectedProvider.phone}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Estado</div>
                  <Badge className={`text-xs w-fit ${selectedProvider.estado === "activo" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
                    {selectedProvider.estado}
                  </Badge>
                </div>
              </div>

              {/* Vehicles Section */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Vehículos ({selectedProvider.vehiculos.length})</h4>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Placa</TableHead>
                        <TableHead>Conductor Asignado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedProvider.vehiculos.map((vehiculo: any, idx: number) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{vehiculo.placa}</TableCell>
                          <TableCell>{vehiculo.conductor}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Drivers Section */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Conductores ({selectedProvider.conductores.length})</h4>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Cédula</TableHead>
                        <TableHead>Teléfono</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedProvider.conductores.map((conductor: any, idx: number) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{conductor.nombre}</TableCell>
                          <TableCell>{conductor.cedula}</TableCell>
                          <TableCell>{conductor.telefono}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowProviderDetails(false)}>
                Cerrar
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}