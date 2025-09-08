import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import {
  Download,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  List,
  LayoutGrid,
  Edit,
  Trash2,
  History
} from "lucide-react";

interface Vehiculo {
  id: string;
  placa: string;
  proveedor: string;
  estado: "activo" | "inactivo";
  fechaCreacion: string;
  fechaActualizacion: string;
  usuarioBloqueo?: {
    bloqueado: boolean;
    fechaBloqueo?: string;
    ultimoLogin?: string;
  };
  documentos: {
    revisionPreventiva: string;
    tecnomecanica: string;
    tarjetaOperacion: string;
    soat: string;
    polizaContractual: string;
    polizaExtraContractual: string;
  };
}

interface DocumentoUpdate {
  tipo: keyof Vehiculo['documentos'];
  fecha: string;
  archivo?: File;
}

interface HistorialCambio {
  id: string;
  campo: string;
  valorAnterior: string;
  valorNuevo: string;
  usuario: string;
  fecha: string;
  tipo: "creacion" | "actualizacion";
}

// ---------------- Helpers ----------------
const toneFromStatus = (status: string): "success" | "danger" | "warning" => {
  const s = status.toLowerCase();
  if (s.includes("vigente") || s.includes("ok")) return "success";
  if (s.includes("por vencer")) return "warning";
  return "danger";
};

const statusBadge = (s: string) =>
  toneFromStatus(s) === "success"
    ? "bg-green-600 text-white"
    : toneFromStatus(s) === "warning"
    ? "bg-amber-500 text-white"
    : "bg-red-600 text-white";

const mockVehiculos: Vehiculo[] = [
  {
    id: "1",
    placa: "ABC123",
    proveedor: "Transportes del Valle",
    estado: "activo",
    fechaCreacion: "2024-01-15",
    fechaActualizacion: "2024-01-15",
    usuarioBloqueo: {
      bloqueado: false,
      ultimoLogin: "2024-01-14 10:30:00"
    },
    documentos: {
      revisionPreventiva: "2024-12-31",
      tecnomecanica: "2024-11-30",
      tarjetaOperacion: "2025-06-15",
      soat: "2024-10-20",
      polizaContractual: "2025-03-10",
      polizaExtraContractual: "2025-01-25"
    }
  },
  {
    id: "2",
    placa: "XYZ789",
    proveedor: "Logística Andina",
    estado: "inactivo",
    fechaCreacion: "2024-01-10",
    fechaActualizacion: "2024-01-20",
    usuarioBloqueo: {
      bloqueado: true,
      fechaBloqueo: "2024-01-20 15:45:00",
      ultimoLogin: "2024-01-19 08:15:00"
    },
    documentos: {
      revisionPreventiva: "2024-09-15",
      tecnomecanica: "2024-09-20",
      tarjetaOperacion: "2025-02-28",
      soat: "2024-08-30",
      polizaContractual: "2024-12-05",
      polizaExtraContractual: "2024-11-18"
    }
  }
];

export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>(mockVehiculos);
  const [view, setView] = useState<"list" | "cards">("list");
  const [selectedVehiculo, setSelectedVehiculo] = useState<Vehiculo | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showHistorialDialog, setShowHistorialDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showDocumentDialog, setShowDocumentDialog] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{ vehiculo: Vehiculo; newStatus: "activo" | "inactivo" } | null>(null);
  const [pendingBlockChange, setPendingBlockChange] = useState<{ vehiculo: Vehiculo; block: boolean } | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<{ vehiculo: Vehiculo; tipo: keyof Vehiculo['documentos'] } | null>(null);
  const [historialCambios, setHistorialCambios] = useState<HistorialCambio[]>([]);
  const [statusFilter, setStatusFilter] = useState("")
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      placa: "",
      proveedor: ""
    }
  });

  const documentForm = useForm({
    defaultValues: {
      fecha: "",
      archivo: null
    }
  });


  const getStatusBadge = (fecha: string) => {
    const today = new Date();
    const expirationDate = new Date(fecha);
    const diffTime = expirationDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { status: "Vencido", variant: "destructive" as const };
    } else if (diffDays <= 7) {
      return { status: "Por vencer", variant: "warning" as const };
    } else {
      return { status: "Vigente", variant: "success" as const };
    }
  };

  const handleDocumentClick = (vehiculo: Vehiculo, tipo: keyof Vehiculo['documentos']) => {
    setSelectedDocument({ vehiculo, tipo });
    documentForm.setValue("fecha", vehiculo.documentos[tipo]);
    setShowDocumentDialog(true);
  };

  const handleDocumentUpdate = (data: any) => {
    if (!selectedDocument) return;
    
    const updatedVehiculos = vehiculos.map(v =>
      v.id === selectedDocument.vehiculo.id
        ? { 
            ...v, 
            documentos: {
              ...v.documentos,
              [selectedDocument.tipo]: data.fecha
            },
            fechaActualizacion: new Date().toISOString().split('T')[0] 
          }
        : v
    );
    setVehiculos(updatedVehiculos);
    setShowDocumentDialog(false);
    setSelectedDocument(null);
    documentForm.reset();
    toast({
      title: "Documento actualizado",
      description: "La fecha del documento ha sido actualizada."
    });
  };

  const handleCreate = (data: any) => {
    const newVehiculo: Vehiculo = {
      id: Date.now().toString(),
      ...data,
      estado: "activo",
      fechaCreacion: new Date().toISOString().split('T')[0],
      fechaActualizacion: new Date().toISOString().split('T')[0],
      usuarioBloqueo: {
        bloqueado: false
      },
      documentos: {
        revisionPreventiva: "",
        tecnomecanica: "",
        tarjetaOperacion: "",
        soat: "",
        polizaContractual: "",
        polizaExtraContractual: ""
      }
    };
    setVehiculos([...vehiculos, newVehiculo]);
    setShowCreateDialog(false);
    form.reset();
    toast({
      title: "Vehículo creado",
      description: "El vehículo ha sido creado exitosamente."
    });
  };

  const handleEdit = (data: any) => {
    if (!selectedVehiculo) return;
    
    const updatedVehiculos = vehiculos.map(v =>
      v.id === selectedVehiculo.id
        ? { ...v, ...data, fechaActualizacion: new Date().toISOString().split('T')[0] }
        : v
    );
    setVehiculos(updatedVehiculos);
    setShowEditDialog(false);
    setSelectedVehiculo(null);
    form.reset();
    toast({
      title: "Vehículo actualizado",
      description: "Los datos del vehículo han sido actualizados."
    });
  };

  const handleDelete = () => {
    if (!selectedVehiculo) return;
    
    setVehiculos(vehiculos.filter(v => v.id !== selectedVehiculo.id));
    setShowDeleteDialog(false);
    setSelectedVehiculo(null);
    toast({
      title: "Vehículo eliminado",
      description: "El vehículo ha sido eliminado del sistema."
    });
  };

  const handleStatusChange = (vehiculo: Vehiculo, newStatus: "activo" | "inactivo") => {
    setPendingStatusChange({ vehiculo, newStatus });
    setShowStatusDialog(true);
  };

  const confirmStatusChange = () => {
    if (!pendingStatusChange) return;
    
    const updatedVehiculos = vehiculos.map(v =>
      v.id === pendingStatusChange.vehiculo.id
        ? { ...v, estado: pendingStatusChange.newStatus, fechaActualizacion: new Date().toISOString().split('T')[0] }
        : v
    );
    setVehiculos(updatedVehiculos);
    setShowStatusDialog(false);
    setPendingStatusChange(null);
    toast({
      title: "Estado actualizado",
      description: `El vehículo ha sido ${pendingStatusChange.newStatus === "activo" ? "activado" : "desactivado"}.`
    });
  };

  const handleBloquearUsuario = (vehiculo: Vehiculo, block: boolean) => {
    setPendingBlockChange({ vehiculo, block });
    setShowBlockDialog(true);
  };

  const confirmBlockChange = () => {
    if (!pendingBlockChange) return;
    
    const updatedVehiculos = vehiculos.map(v =>
      v.id === pendingBlockChange.vehiculo.id
        ? { 
            ...v, 
            usuarioBloqueo: {
              ...v.usuarioBloqueo,
              bloqueado: pendingBlockChange.block,
              fechaBloqueo: pendingBlockChange.block ? new Date().toISOString() : undefined
            },
            fechaActualizacion: new Date().toISOString().split('T')[0] 
          }
        : v
    );
    setVehiculos(updatedVehiculos);
    setShowBlockDialog(false);
    setPendingBlockChange(null);
    toast({
      title: `Usuario ${pendingBlockChange.block ? "bloqueado" : "desbloqueado"}`,
      description: `El acceso del vehículo ha sido ${pendingBlockChange.block ? "bloqueado" : "desbloqueado"}.`
    });
  };

  const handleVerHistorial = (vehiculo: Vehiculo) => {
    const mockHistorial: HistorialCambio[] = [
      {
        id: "1",
        campo: "Sistema",
        valorAnterior: "",
        valorNuevo: "Vehículo creado",
        usuario: "admin@sistema.com",
        fecha: vehiculo.fechaCreacion + " 09:00:00",
        tipo: "creacion"
      },
      {
        id: "2",
        campo: "documentos.soat",
        valorAnterior: "2024-06-30",
        valorNuevo: vehiculo.documentos.soat,
        usuario: "admin@sistema.com",
        fecha: vehiculo.fechaActualizacion + " 14:30:00",
        tipo: "actualizacion"
      }
    ];
    setHistorialCambios(mockHistorial);
    setSelectedVehiculo(vehiculo);
    setShowHistorialDialog(true);
  };

  const renderCell = (key: string, value: any, vehiculo: Vehiculo) => {
    switch (key) {
      case "placa":
        return (
          <div>
            <div className="font-medium">{vehiculo.placa}</div>
            <div className="text-sm text-muted-foreground">{vehiculo.proveedor}</div>
          </div>
        );
      case "revisionPreventiva":
      case "tecnomecanica":
      case "tarjetaOperacion":
      case "soat":
      case "polizaContractual":
      case "polizaExtraContractual":
        const fecha = vehiculo.documentos[key as keyof Vehiculo['documentos']];
        if (!fecha) {
          return (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDocumentClick(vehiculo, key as keyof Vehiculo['documentos'])}
            >
              Sin fecha
            </Button>
          );
        }
        const badge = getStatusBadge(fecha);
        return (
          <div className="space-y-1">
            <div className="text-xs">{new Date(fecha).toLocaleDateString()}</div>
            <Button
              variant={badge.variant}
              size="sm"
              className={`w-full ${badge.status === 'vencido' ? 'bg-red-600 hover:bg-red-700' : 
                badge.status === 'por-vencer' ? 'bg-yellow-600 hover:bg-yellow-700' : 
                'bg-green-600 hover:bg-green-700'}`}
              onClick={() => handleDocumentClick(vehiculo, key as keyof Vehiculo['documentos'])}
            >
              {badge.status}
            </Button>
          </div>
        );
      case "estado":
        return (
          <Button
            variant={vehiculo.estado === "activo" ? "default" : "destructive"}
            size="sm"
            className={vehiculo.estado === "activo" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
            onClick={() => handleStatusChange(vehiculo, vehiculo.estado === "activo" ? "inactivo" : "activo")}
          >
            {vehiculo.estado === "activo" ? "Activo" : "Inactivo"}
          </Button>
        );
      case "usuarioBloqueo":
        return (
          <div className="space-y-1">
            <Button
              variant={vehiculo.usuarioBloqueo?.bloqueado ? "default" : "destructive"}
              size="sm"
              className={vehiculo.usuarioBloqueo?.bloqueado ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
              onClick={() => handleBloquearUsuario(vehiculo, !vehiculo.usuarioBloqueo?.bloqueado)}
            >
              {vehiculo.usuarioBloqueo?.bloqueado ? "Desbloquear" : "Bloquear"}
            </Button>
            {vehiculo.usuarioBloqueo?.ultimoLogin && (
              <div className="text-xs text-muted-foreground">
                Último acceso: {new Date(vehiculo.usuarioBloqueo.ultimoLogin).toLocaleString()}
              </div>
            )}
          </div>
        );
      case "acciones":
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {
                setSelectedVehiculo(vehiculo);
                form.reset(vehiculo);
                setShowEditDialog(true);
              }}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleVerHistorial(vehiculo)}>
                <History className="mr-2 h-4 w-4" />
                Ver Historial
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => {
                  setSelectedVehiculo(vehiculo);
                  setShowDeleteDialog(true);
                }}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      default:
        return String(vehiculo[key as keyof Vehiculo] || "");
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header + CTAs */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-6 pb-0">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Gestión de Vehículos</h1>
          <p className="text-sm text-muted-foreground">Administra vehículos, documentos y estado</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={view === "list" ? "secondary" : "outline"} size="sm" className="rounded-xl" onClick={() => setView("list")}>
            <List className="h-4 w-4 mr-1"/> Lista
          </Button>
          <Button variant={view === "cards" ? "secondary" : "outline"} size="sm" className="rounded-xl" onClick={() => setView("cards")}>
            <LayoutGrid className="h-4 w-4 mr-1"/> Tarjetas
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="rounded-xl">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Vehículo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Creación de Nuevo Vehículo</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="placa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Placa</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="proveedor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proveedor</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar proveedor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Transportes del Valle">Transportes del Valle</SelectItem>
                            <SelectItem value="Logística Andina">Logística Andina</SelectItem>
                            <SelectItem value="Rápido Express">Rápido Express</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">Crear Vehículo</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {view === "list" ? (
          <Card className="rounded-2xl border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Lista de Vehículos</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Toolbar */}
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar..." className="pl-9 rounded-xl" />
                </div>
                <div className="flex items-center gap-2">
                  <Tabs defaultValue="all" className="hidden sm:block">
                    <TabsList className="rounded-xl">
                      <TabsTrigger value="all">Todos los estados</TabsTrigger>
                      <TabsTrigger value="activo">Activos</TabsTrigger>
                      <TabsTrigger value="inactivo">Inactivos</TabsTrigger>
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
                      <TableHead>Vehículo</TableHead>
                      <TableHead>Revisión Preventiva</TableHead>
                      <TableHead>Tecnomecánica</TableHead>
                      <TableHead>Tarjeta de Operación</TableHead>
                      <TableHead>SOAT</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vehiculos.map((v) => (
                      <TableRow key={v.id}>
                        <TableCell>
                          <div className="font-medium">{v.placa}</div>
                          <div className="text-xs text-muted-foreground">{v.proveedor}</div>
                          <div className="text-[11px] text-muted-foreground">
                            Último acceso: {v.usuarioBloqueo?.ultimoLogin || "N/A"}
                          </div>
                        </TableCell>
                        {["revisionPreventiva", "tecnomecanica", "tarjetaOperacion", "soat"].map((docType) => {
                          const fecha = v.documentos[docType as keyof typeof v.documentos];
                          const badge = fecha ? getStatusBadge(fecha) : null;
                          return (
                            <TableCell key={docType}>
                              <div className="flex flex-col text-xs items-start">
                                <span>{fecha ? new Date(fecha).toLocaleDateString() : "Sin fecha"}</span>
                                {badge && (
                                  <Badge className={`rounded-md mt-1 ${statusBadge(badge.status)}`}>
                                    {badge.status}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                          );
                        })}
                        <TableCell>
                          <Badge className={`rounded-md ${v.estado === "activo" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
                            {v.estado === "activo" ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4"/></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl">
                              <DropdownMenuItem onClick={() => {
                                setSelectedVehiculo(v);
                                form.reset(v);
                                setShowEditDialog(true);
                              }}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleVerHistorial(v)}>
                                <History className="mr-2 h-4 w-4" />
                                Ver Historial
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedVehiculo(v);
                                  setShowDeleteDialog(true);
                                }}
                                className="text-destructive"
                              >
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
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehiculos.map((v) => (
              <Card key={v.id} className="rounded-2xl border">
                {/* Header bar */}
                <div className="bg-muted/60 rounded-t-2xl p-3 flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{v.placa}</div>
                    <div className="text-xs text-muted-foreground truncate">{v.proveedor}</div>
                    <div className="text-[11px] text-muted-foreground">
                      Último acceso: {v.usuarioBloqueo?.ultimoLogin || "N/A"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={v.estado === "activo" ? "bg-green-600 text-white" : "bg-red-600 text-white"}>
                      {v.estado === "activo" ? "Activo" : "Inactivo"}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4"/></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem onClick={() => {
                          setSelectedVehiculo(v);
                          form.reset(v);
                          setShowEditDialog(true);
                        }}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleVerHistorial(v)}>
                          <History className="mr-2 h-4 w-4" />
                          Ver Historial
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedVehiculo(v);
                            setShowDeleteDialog(true);
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <CardContent className="p-4">
                  {/* Documents grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(v.documentos).slice(0, 4).map(([key, fecha]) => {
                      const badge = fecha ? getStatusBadge(fecha) : null;
                      const docLabels: Record<string, string> = {
                        revisionPreventiva: "Revisión Preventiva",
                        tecnomecanica: "Tecnomecánica", 
                        tarjetaOperacion: "Tarjeta Operación",
                        soat: "SOAT"
                      };
                      return (
                        <div key={key} className="rounded-lg border p-2 bg-background">
                          <div className={`text-sm font-medium ${badge ? (
                            toneFromStatus(badge.status) === "success" ? "text-emerald-600" : 
                            toneFromStatus(badge.status) === "warning" ? "text-amber-600" : "text-rose-600"
                          ) : "text-muted-foreground"}`}>
                            {docLabels[key] || key}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {fecha ? new Date(fecha).toLocaleDateString() : "Sin fecha"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
