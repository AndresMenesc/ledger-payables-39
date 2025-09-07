import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Search, MoreHorizontal, Plus, Edit, Trash2, History, Eye, User, Grid3X3, List, Car } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Conductor {
  id: string;
  nombreCompleto: string;
  proveedor: string;
  estado: "activo" | "inactivo";
  fechaCreacion: string;
  fechaActualizacion: string;
  foto?: string;
  telefono?: string;
  cedula?: string;
  vehiculo?: {
    placa: string;
    marca: string;
    modelo: string;
    año: string;
    tipo: "camión" | "camioneta" | "automóvil";
  };
  usuarioBloqueo?: {
    bloqueado: boolean;
    fechaBloqueo?: string;
    ultimoLogin?: string;
  };
  documentos: {
    seguridadSocial: string;
    licenciaConduccion: string;
    examenesPsicosensometricos: string;
  };
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

const mockConductores: Conductor[] = [
  {
    id: "1",
    nombreCompleto: "Juan Carlos Pérez",
    proveedor: "Transportes del Valle",
    estado: "activo",
    fechaCreacion: "2024-01-15",
    fechaActualizacion: "2024-01-15",
    foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    telefono: "+57 300 123 4567",
    cedula: "12345678",
    vehiculo: {
      placa: "ABC-123",
      marca: "Mercedes-Benz",
      modelo: "Actros",
      año: "2022",
      tipo: "camión"
    },
    usuarioBloqueo: {
      bloqueado: false,
      ultimoLogin: "2024-01-14 10:30:00"
    },
    documentos: {
      seguridadSocial: "2025-06-30",
      licenciaConduccion: "2025-12-31",
      examenesPsicosensometricos: "2024-12-15"
    }
  },
  {
    id: "2",
    nombreCompleto: "María José García",
    proveedor: "Logística Andina",
    estado: "inactivo",
    fechaCreacion: "2024-01-10",
    fechaActualizacion: "2024-01-20",
    foto: "https://images.unsplash.com/photo-1494790108755-2616b332c449?w=150&h=150&fit=crop&crop=face",
    telefono: "+57 315 987 6543",
    cedula: "87654321",
    vehiculo: {
      placa: "XYZ-789",
      marca: "Volvo",
      modelo: "FH16",
      año: "2021",
      tipo: "camión"
    },
    usuarioBloqueo: {
      bloqueado: true,
      fechaBloqueo: "2024-01-20 15:45:00",
      ultimoLogin: "2024-01-19 08:15:00"
    },
    documentos: {
      seguridadSocial: "2024-11-20",
      licenciaConduccion: "2026-06-15",
      examenesPsicosensometricos: "2024-09-10"
    }
  },
  {
    id: "3",
    nombreCompleto: "Carlos Andrés Rodríguez",
    proveedor: "Rápido Express",
    estado: "activo",
    fechaCreacion: "2024-01-08",
    fechaActualizacion: "2024-01-08",
    foto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    telefono: "+57 301 555 7890",
    cedula: "11223344",
    vehiculo: {
      placa: "DEF-456",
      marca: "Chevrolet",
      modelo: "NPR",
      año: "2020",
      tipo: "camioneta"
    },
    usuarioBloqueo: {
      bloqueado: false,
      ultimoLogin: "2024-01-13 16:20:00"
    },
    documentos: {
      seguridadSocial: "2025-03-15",
      licenciaConduccion: "2025-09-30",
      examenesPsicosensometricos: "2024-08-22"
    }
  }
];

export default function Conductores() {
  const [conductores, setConductores] = useState<Conductor[]>(mockConductores);
  const [selectedConductor, setSelectedConductor] = useState<Conductor | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showHistorialDialog, setShowHistorialDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showDocumentDialog, setShowDocumentDialog] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{ conductor: Conductor; newStatus: "activo" | "inactivo" } | null>(null);
  const [pendingBlockChange, setPendingBlockChange] = useState<{ conductor: Conductor; block: boolean } | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<{ conductor: Conductor; tipo: keyof Conductor['documentos'] } | null>(null);
  const [historialCambios, setHistorialCambios] = useState<HistorialCambio[]>([]);
  const [statusFilter, setStatusFilter] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "cards">("list");
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      nombreCompleto: "",
      proveedor: ""
    }
  });

  const documentForm = useForm({
    defaultValues: {
      fecha: "",
      archivo: null
    }
  });

  const columns = [
    {
      key: "nombreCompleto",
      label: "Conductor",
      sortable: true
    },
    {
      key: "seguridadSocial",
      label: "Seguridad Social"
    },
    {
      key: "licenciaConduccion",
      label: "Licencia de Conducción"
    },
    {
      key: "examenesPsicosensometricos",
      label: "Exámenes Psicosensométricos"
    },
    {
      key: "estado",
      label: "Estado"
    },
    {
      key: "usuarioBloqueo",
      label: "Usuario"
    },
    {
      key: "acciones",
      label: "Acciones"
    }
  ];

  const getStatusBadge = (fecha: string) => {
    const today = new Date();
    const expirationDate = new Date(fecha);
    const diffTime = expirationDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { status: "vencido", variant: "destructive" as const, text: "Vencido" };
    } else if (diffDays <= 7) {
      return { status: "por-vencer", variant: "secondary" as const, text: "Por vencer" };
    } else {
      return { status: "vigente", variant: "default" as const, text: "Vigente" };
    }
  };

  const handleDocumentClick = (conductor: Conductor, tipo: keyof Conductor['documentos']) => {
    setSelectedDocument({ conductor, tipo });
    documentForm.setValue("fecha", conductor.documentos[tipo]);
    setShowDocumentDialog(true);
  };

  const handleDocumentUpdate = (data: any) => {
    if (!selectedDocument) return;
    
    const updatedConductores = conductores.map(c =>
      c.id === selectedDocument.conductor.id
        ? { 
            ...c, 
            documentos: {
              ...c.documentos,
              [selectedDocument.tipo]: data.fecha
            },
            fechaActualizacion: new Date().toISOString().split('T')[0] 
          }
        : c
    );
    setConductores(updatedConductores);
    setShowDocumentDialog(false);
    setSelectedDocument(null);
    documentForm.reset();
    toast({
      title: "Documento actualizado",
      description: "La fecha del documento ha sido actualizada."
    });
  };

  const handleCreate = (data: any) => {
    const newConductor: Conductor = {
      id: Date.now().toString(),
      ...data,
      estado: "activo",
      fechaCreacion: new Date().toISOString().split('T')[0],
      fechaActualizacion: new Date().toISOString().split('T')[0],
      usuarioBloqueo: {
        bloqueado: false
      },
      documentos: {
        seguridadSocial: "",
        licenciaConduccion: "",
        examenesPsicosensometricos: ""
      }
    };
    setConductores([...conductores, newConductor]);
    setShowCreateDialog(false);
    form.reset();
    toast({
      title: "Conductor creado",
      description: "El conductor ha sido creado exitosamente."
    });
  };

  const handleEdit = (data: any) => {
    if (!selectedConductor) return;
    
    const updatedConductores = conductores.map(c =>
      c.id === selectedConductor.id
        ? { ...c, ...data, fechaActualizacion: new Date().toISOString().split('T')[0] }
        : c
    );
    setConductores(updatedConductores);
    setShowEditDialog(false);
    setSelectedConductor(null);
    form.reset();
    toast({
      title: "Conductor actualizado",
      description: "Los datos del conductor han sido actualizados."
    });
  };

  const handleDelete = () => {
    if (!selectedConductor) return;
    
    setConductores(conductores.filter(c => c.id !== selectedConductor.id));
    setShowDeleteDialog(false);
    setSelectedConductor(null);
    toast({
      title: "Conductor eliminado",
      description: "El conductor ha sido eliminado del sistema."
    });
  };

  const handleStatusChange = (conductor: Conductor, newStatus: "activo" | "inactivo") => {
    setPendingStatusChange({ conductor, newStatus });
    setShowStatusDialog(true);
  };

  const confirmStatusChange = () => {
    if (!pendingStatusChange) return;
    
    const updatedConductores = conductores.map(c =>
      c.id === pendingStatusChange.conductor.id
        ? { ...c, estado: pendingStatusChange.newStatus, fechaActualizacion: new Date().toISOString().split('T')[0] }
        : c
    );
    setConductores(updatedConductores);
    setShowStatusDialog(false);
    setPendingStatusChange(null);
    toast({
      title: "Estado actualizado",
      description: `El conductor ha sido ${pendingStatusChange.newStatus === "activo" ? "activado" : "desactivado"}.`
    });
  };

  const handleBloquearUsuario = (conductor: Conductor, block: boolean) => {
    setPendingBlockChange({ conductor, block });
    setShowBlockDialog(true);
  };

  const confirmBlockChange = () => {
    if (!pendingBlockChange) return;
    
    const updatedConductores = conductores.map(c =>
      c.id === pendingBlockChange.conductor.id
        ? { 
            ...c, 
            usuarioBloqueo: {
              ...c.usuarioBloqueo,
              bloqueado: pendingBlockChange.block,
              fechaBloqueo: pendingBlockChange.block ? new Date().toISOString() : undefined
            },
            fechaActualizacion: new Date().toISOString().split('T')[0] 
          }
        : c
    );
    setConductores(updatedConductores);
    setShowBlockDialog(false);
    setPendingBlockChange(null);
    toast({
      title: `Usuario ${pendingBlockChange.block ? "bloqueado" : "desbloqueado"}`,
      description: `El acceso del conductor ha sido ${pendingBlockChange.block ? "bloqueado" : "desbloqueado"}.`
    });
  };

  const handleVerHistorial = (conductor: Conductor) => {
    const mockHistorial: HistorialCambio[] = [
      {
        id: "1",
        campo: "Sistema",
        valorAnterior: "",
        valorNuevo: "Conductor creado",
        usuario: "admin@sistema.com",
        fecha: conductor.fechaCreacion + " 09:00:00",
        tipo: "creacion"
      },
      {
        id: "2",
        campo: "documentos.seguridadSocial",
        valorAnterior: "2024-06-30",
        valorNuevo: conductor.documentos.seguridadSocial,
        usuario: "admin@sistema.com",
        fecha: conductor.fechaActualizacion + " 14:30:00",
        tipo: "actualizacion"
      }
    ];
    setHistorialCambios(mockHistorial);
    setSelectedConductor(conductor);
    setShowHistorialDialog(true);
  };

  const ConductorCard = ({ conductor }: { conductor: Conductor }) => {
    const getDocumentStatus = (fecha: string) => {
      if (!fecha) return { color: "bg-gray-500", text: "Sin fecha" };
      const badge = getStatusBadge(fecha);
      return {
        color: badge.status === 'vencido' ? 'bg-red-500' : 
               badge.status === 'por-vencer' ? 'bg-yellow-500' : 'bg-green-500',
        text: badge.text
      };
    };

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-4">
          <div className="flex items-start space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={conductor.foto} alt={conductor.nombreCompleto} />
              <AvatarFallback className="text-lg">
                {conductor.nombreCompleto.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate">{conductor.nombreCompleto}</CardTitle>
              <p className="text-sm text-muted-foreground">{conductor.proveedor}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant={conductor.estado === "activo" ? "default" : "destructive"}>
                  {conductor.estado === "activo" ? "Activo" : "Inactivo"}
                </Badge>
                <Badge variant={conductor.usuarioBloqueo?.bloqueado ? "destructive" : "secondary"}>
                  {conductor.usuarioBloqueo?.bloqueado ? "Bloqueado" : "Desbloqueado"}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Información del conductor */}
          <div>
            <h4 className="font-semibold text-sm mb-2">Información Personal</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Cédula:</span>
                <p className="font-medium">{conductor.cedula || "No registrada"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Teléfono:</span>
                <p className="font-medium">{conductor.telefono || "No registrado"}</p>
              </div>
            </div>
          </div>

          {/* Información del vehículo */}
          {conductor.vehiculo && (
            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center">
                <Car className="h-4 w-4 mr-1" />
                Vehículo Asignado
              </h4>
              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">{conductor.vehiculo.placa}</span>
                  <Badge variant="outline">{conductor.vehiculo.tipo}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Marca:</span>
                    <p className="font-medium">{conductor.vehiculo.marca}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Modelo:</span>
                    <p className="font-medium">{conductor.vehiculo.modelo}</p>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Año:</span>
                  <span className="font-medium ml-1">{conductor.vehiculo.año}</span>
                </div>
              </div>
            </div>
          )}

          {/* Estado de documentos */}
          <div>
            <h4 className="font-semibold text-sm mb-2">Estado de Documentos</h4>
            <div className="space-y-2">
              {Object.entries(conductor.documentos).map(([key, fecha]) => {
                const status = getDocumentStatus(fecha);
                const labels = {
                  seguridadSocial: "Seguridad Social",
                  licenciaConduccion: "Licencia de Conducción",
                  examenesPsicosensometricos: "Exámenes Psicosensométricos"
                };
                return (
                  <div key={key} className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{labels[key as keyof typeof labels]}:</span>
                    <div className="flex items-center space-x-2">
                      {fecha && <span className="text-xs">{new Date(fecha).toLocaleDateString()}</span>}
                      <div className={`w-2 h-2 rounded-full ${status.color}`} title={status.text}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Acciones */}
          <div className="flex justify-end pt-2 border-t">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => {
                  setSelectedConductor(conductor);
                  form.reset(conductor);
                  setShowEditDialog(true);
                }}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleVerHistorial(conductor)}>
                  <History className="mr-2 h-4 w-4" />
                  Ver Historial
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    setSelectedConductor(conductor);
                    setShowDeleteDialog(true);
                  }}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderCell = (key: string, value: any, conductor: Conductor) => {
    switch (key) {
      case "nombreCompleto":
        return (
          <div>
            <div className="font-medium">{conductor.nombreCompleto}</div>
            <div className="text-sm text-muted-foreground">{conductor.proveedor}</div>
          </div>
        );
      case "seguridadSocial":
      case "licenciaConduccion":
      case "examenesPsicosensometricos":
        const fecha = conductor.documentos[key as keyof Conductor['documentos']];
        if (!fecha) {
          return (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDocumentClick(conductor, key as keyof Conductor['documentos'])}
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
              onClick={() => handleDocumentClick(conductor, key as keyof Conductor['documentos'])}
            >
              {badge.text}
            </Button>
          </div>
        );
      case "estado":
        return (
          <Button
            variant={conductor.estado === "activo" ? "default" : "destructive"}
            size="sm"
            className={conductor.estado === "activo" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
            onClick={() => handleStatusChange(conductor, conductor.estado === "activo" ? "inactivo" : "activo")}
          >
            {conductor.estado === "activo" ? "Activo" : "Inactivo"}
          </Button>
        );
      case "usuarioBloqueo":
        return (
          <div className="space-y-1">
            <Button
              variant={conductor.usuarioBloqueo?.bloqueado ? "default" : "destructive"}
              size="sm"
              className={conductor.usuarioBloqueo?.bloqueado ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
              onClick={() => handleBloquearUsuario(conductor, !conductor.usuarioBloqueo?.bloqueado)}
            >
              {conductor.usuarioBloqueo?.bloqueado ? "Desbloquear" : "Bloquear"}
            </Button>
            {conductor.usuarioBloqueo?.ultimoLogin && (
              <div className="text-xs text-muted-foreground">
                Último acceso: {new Date(conductor.usuarioBloqueo.ultimoLogin).toLocaleString()}
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
                setSelectedConductor(conductor);
                form.reset(conductor);
                setShowEditDialog(true);
              }}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleVerHistorial(conductor)}>
                <History className="mr-2 h-4 w-4" />
                Ver Historial
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => {
                  setSelectedConductor(conductor);
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
        return String(conductor[key as keyof Conductor] || "");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Conductores</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center border rounded-lg p-1">
            <Button 
              variant={viewMode === "list" ? "default" : "ghost"} 
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 px-3"
            >
              <List className="h-4 w-4 mr-1" />
              Lista
            </Button>
            <Button 
              variant={viewMode === "cards" ? "default" : "ghost"} 
              size="sm"
              onClick={() => setViewMode("cards")}
              className="h-8 px-3"
            >
              <Grid3X3 className="h-4 w-4 mr-1" />
              Tarjetas
            </Button>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Conductor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Creación de Nuevo Conductor</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="nombreCompleto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre Completo</FormLabel>
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
                    <Button type="submit">Crear Conductor</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {viewMode === "list" ? (
        <DataTable
          title="Lista de Conductores"
          columns={columns}
          data={statusFilter ? conductores.filter(c => c.estado === statusFilter) : conductores}
          searchable
          filterable
          exportable
          renderCell={renderCell}
          statusFilter={true}
          onStatusFilterChange={setStatusFilter}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Vista de Tarjetas</h2>
            <div className="flex items-center space-x-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los estados</SelectItem>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(statusFilter ? conductores.filter(c => c.estado === statusFilter) : conductores).map((conductor) => (
              <ConductorCard key={conductor.id} conductor={conductor} />
            ))}
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Conductor</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nombreCompleto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo</FormLabel>
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
                <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Actualizar</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Historial Dialog */}
      <Dialog open={showHistorialDialog} onOpenChange={setShowHistorialDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Historial de Cambios - {selectedConductor?.nombreCompleto}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {historialCambios.map((cambio) => (
              <div key={cambio.id} className="border-l-2 border-primary pl-4 pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <Badge variant={cambio.tipo === "creacion" ? "default" : "secondary"}>
                      {cambio.tipo === "creacion" ? "Creación" : "Actualización"}
                    </Badge>
                    <p className="font-medium mt-1">{cambio.campo}</p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>{cambio.usuario}</p>
                    <p>{new Date(cambio.fecha).toLocaleString()}</p>
                  </div>
                </div>
                {cambio.tipo !== "creacion" && (
                  <div className="text-sm">
                    <p><span className="text-red-600">Anterior:</span> {cambio.valorAnterior}</p>
                    <p><span className="text-green-600">Nuevo:</span> {cambio.valorNuevo}</p>
                  </div>
                )}
                {cambio.tipo === "creacion" && (
                  <p className="text-sm text-muted-foreground">{cambio.valorNuevo}</p>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Status Change Confirmation */}
      <AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar cambio de estado</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro que desea {pendingStatusChange?.newStatus === "activo" ? "activar" : "desactivar"} al conductor {pendingStatusChange?.conductor.nombreCompleto}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingStatusChange(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusChange}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Block User Confirmation */}
      <AlertDialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar {pendingBlockChange?.block ? "bloqueo" : "desbloqueo"}</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro que desea {pendingBlockChange?.block ? "bloquear" : "desbloquear"} el acceso del conductor {pendingBlockChange?.conductor.nombreCompleto}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingBlockChange(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBlockChange}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro que desea eliminar al conductor {selectedConductor?.nombreCompleto}? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedConductor(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Document Update Dialog */}
      <Dialog open={showDocumentDialog} onOpenChange={setShowDocumentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Actualizar Documento</DialogTitle>
          </DialogHeader>
          <Form {...documentForm}>
            <form onSubmit={documentForm.handleSubmit(handleDocumentUpdate)} className="space-y-4">
              <FormField
                control={documentForm.control}
                name="fecha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Vencimiento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={documentForm.control}
                name="archivo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Documento PDF</FormLabel>
                    <FormControl>
                      <Input type="file" accept=".pdf" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowDocumentDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Actualizar</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
