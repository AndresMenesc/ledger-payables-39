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
import { Search, MoreHorizontal, Plus, Edit, Trash2, History, Eye, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Conductor {
  id: string;
  nombreCompleto: string;
  identificacion: string;
  telefono: string;
  email: string;
  direccion: string;
  fechaNacimiento: string;
  licenciaConducir: string;
  fechaVencimientoLicencia: string;
  proveedor: string;
  estado: "activo" | "inactivo";
  fechaCreacion: string;
  fechaActualizacion: string;
  usuarioBloqueo?: {
    bloqueado: boolean;
    fechaBloqueo?: string;
    ultimoLogin?: string;
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
    identificacion: "12345678",
    telefono: "300-123-4567",
    email: "juan.perez@email.com",
    direccion: "Calle 123 #45-67",
    fechaNacimiento: "1985-05-15",
    licenciaConducir: "C1-987654321",
    fechaVencimientoLicencia: "2025-12-31",
    proveedor: "Transportes del Valle",
    estado: "activo",
    fechaCreacion: "2024-01-15",
    fechaActualizacion: "2024-01-15",
    usuarioBloqueo: {
      bloqueado: false,
      ultimoLogin: "2024-01-14 10:30:00"
    }
  },
  {
    id: "2",
    nombreCompleto: "María José García",
    identificacion: "87654321",
    telefono: "301-987-6543",
    email: "maria.garcia@email.com",
    direccion: "Carrera 45 #67-89",
    fechaNacimiento: "1990-08-22",
    licenciaConducir: "C2-123456789",
    fechaVencimientoLicencia: "2026-06-15",
    proveedor: "Logística Andina",
    estado: "inactivo",
    fechaCreacion: "2024-01-10",
    fechaActualizacion: "2024-01-20",
    usuarioBloqueo: {
      bloqueado: true,
      fechaBloqueo: "2024-01-20 15:45:00",
      ultimoLogin: "2024-01-19 08:15:00"
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
  const [pendingStatusChange, setPendingStatusChange] = useState<{ conductor: Conductor; newStatus: "activo" | "inactivo" } | null>(null);
  const [pendingBlockChange, setPendingBlockChange] = useState<{ conductor: Conductor; block: boolean } | null>(null);
  const [historialCambios, setHistorialCambios] = useState<HistorialCambio[]>([]);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      nombreCompleto: "",
      identificacion: "",
      telefono: "",
      email: "",
      direccion: "",
      fechaNacimiento: "",
      licenciaConducir: "",
      fechaVencimientoLicencia: "",
      proveedor: ""
    }
  });

  const columns = [
    {
      key: "nombreCompleto",
      label: "Conductor",
      sortable: true
    },
    {
      key: "identificacion", 
      label: "Identificación",
      sortable: true
    },
    {
      key: "telefono",
      label: "Teléfono"
    },
    {
      key: "email",
      label: "Correo"
    },
    {
      key: "licenciaConducir",
      label: "Licencia"
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

  const handleCreate = (data: any) => {
    const newConductor: Conductor = {
      id: Date.now().toString(),
      ...data,
      estado: "activo",
      fechaCreacion: new Date().toISOString().split('T')[0],
      fechaActualizacion: new Date().toISOString().split('T')[0],
      usuarioBloqueo: {
        bloqueado: false
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
        campo: "telefono",
        valorAnterior: "300-111-1111",
        valorNuevo: conductor.telefono,
        usuario: "admin@sistema.com",
        fecha: conductor.fechaActualizacion + " 14:30:00",
        tipo: "actualizacion"
      }
    ];
    setHistorialCambios(mockHistorial);
    setSelectedConductor(conductor);
    setShowHistorialDialog(true);
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
                  name="identificacion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Identificación</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="direccion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fechaNacimiento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Nacimiento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="licenciaConducir"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Licencia de Conducir</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fechaVencimientoLicencia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vencimiento Licencia</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
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
                          <SelectItem value="transportes-valle">Transportes del Valle</SelectItem>
                          <SelectItem value="logistica-andina">Logística Andina</SelectItem>
                          <SelectItem value="rapido-express">Rápido Express</SelectItem>
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

      <DataTable
        title="Lista de Conductores"
        columns={columns}
        data={conductores}
        searchable
        filterable
        exportable
        renderCell={renderCell}
      />

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
                name="identificacion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identificación</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="direccion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fechaNacimiento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Nacimiento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="licenciaConducir"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Licencia de Conducir</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fechaVencimientoLicencia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vencimiento Licencia</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
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
                        <SelectItem value="transportes-valle">Transportes del Valle</SelectItem>
                        <SelectItem value="logistica-andina">Logística Andina</SelectItem>
                        <SelectItem value="rapido-express">Rápido Express</SelectItem>
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
    </div>
  );
}
