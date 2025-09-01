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
import { Search, MoreHorizontal, Plus, Edit, Trash2, History, Eye, Truck } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Vehiculo {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  año: string;
  color: string;
  tipoVehiculo: string;
  capacidadCarga: string;
  numeroChasis: string;
  numeroMotor: string;
  fechaVencimientoSOAT: string;
  fechaVencimientoTecnomecanica: string;
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

const mockVehiculos: Vehiculo[] = [
  {
    id: "1",
    placa: "ABC123",
    marca: "Chevrolet",
    modelo: "NPR",
    año: "2020",
    color: "Blanco",
    tipoVehiculo: "Camión",
    capacidadCarga: "3.5 Ton",
    numeroChasis: "CH123456789",
    numeroMotor: "MT987654321",
    fechaVencimientoSOAT: "2024-12-31",
    fechaVencimientoTecnomecanica: "2024-11-30",
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
    placa: "XYZ789",
    marca: "Ford",
    modelo: "Transit",
    año: "2019",
    color: "Azul",
    tipoVehiculo: "Van",
    capacidadCarga: "2.0 Ton",
    numeroChasis: "FD123456789",
    numeroMotor: "FM987654321",
    fechaVencimientoSOAT: "2024-10-15",
    fechaVencimientoTecnomecanica: "2024-09-20",
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

export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>(mockVehiculos);
  const [selectedVehiculo, setSelectedVehiculo] = useState<Vehiculo | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showHistorialDialog, setShowHistorialDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{ vehiculo: Vehiculo; newStatus: "activo" | "inactivo" } | null>(null);
  const [pendingBlockChange, setPendingBlockChange] = useState<{ vehiculo: Vehiculo; block: boolean } | null>(null);
  const [historialCambios, setHistorialCambios] = useState<HistorialCambio[]>([]);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      placa: "",
      marca: "",
      modelo: "",
      año: "",
      color: "",
      tipoVehiculo: "",
      capacidadCarga: "",
      numeroChasis: "",
      numeroMotor: "",
      fechaVencimientoSOAT: "",
      fechaVencimientoTecnomecanica: "",
      proveedor: ""
    }
  });

  const columns = [
    {
      key: "placa",
      label: "Vehículo",
      sortable: true
    },
    {
      key: "marca", 
      label: "Marca",
      sortable: true
    },
    {
      key: "modelo",
      label: "Modelo"
    },
    {
      key: "año",
      label: "Año"
    },
    {
      key: "tipoVehiculo",
      label: "Tipo"
    },
    {
      key: "capacidadCarga",
      label: "Capacidad"
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
    const newVehiculo: Vehiculo = {
      id: Date.now().toString(),
      ...data,
      estado: "activo",
      fechaCreacion: new Date().toISOString().split('T')[0],
      fechaActualizacion: new Date().toISOString().split('T')[0],
      usuarioBloqueo: {
        bloqueado: false
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
        campo: "fechaVencimientoSOAT",
        valorAnterior: "2024-06-30",
        valorNuevo: vehiculo.fechaVencimientoSOAT,
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Vehículos</h1>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
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
                  name="marca"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marca</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="modelo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modelo</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="año"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Año</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tipoVehiculo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Vehículo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="camion">Camión</SelectItem>
                          <SelectItem value="van">Van</SelectItem>
                          <SelectItem value="camioneta">Camioneta</SelectItem>
                          <SelectItem value="trailer">Tráiler</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="capacidadCarga"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacidad de Carga</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ej: 3.5 Ton" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numeroChasis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Chasis</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numeroMotor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Motor</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fechaVencimientoSOAT"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vencimiento SOAT</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fechaVencimientoTecnomecanica"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vencimiento Tecnomecánica</FormLabel>
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
                  <Button type="submit">Crear Vehículo</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        title="Lista de Vehículos"
        columns={columns}
        data={vehiculos}
        searchable
        filterable
        exportable
        renderCell={renderCell}
      />

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Vehículo</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-4">
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
                name="marca"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marca</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="modelo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="año"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Año</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tipoVehiculo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Vehículo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="camion">Camión</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                        <SelectItem value="camioneta">Camioneta</SelectItem>
                        <SelectItem value="trailer">Tráiler</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="capacidadCarga"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacidad de Carga</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ej: 3.5 Ton" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="numeroChasis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Chasis</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="numeroMotor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Motor</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fechaVencimientoSOAT"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vencimiento SOAT</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fechaVencimientoTecnomecanica"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vencimiento Tecnomecánica</FormLabel>
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
            <DialogTitle>Historial de Cambios - {selectedVehiculo?.placa}</DialogTitle>
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
              ¿Está seguro que desea {pendingStatusChange?.newStatus === "activo" ? "activar" : "desactivar"} el vehículo {pendingStatusChange?.vehiculo.placa}?
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
              ¿Está seguro que desea {pendingBlockChange?.block ? "bloquear" : "desbloquear"} el acceso del vehículo {pendingBlockChange?.vehiculo.placa}?
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
              ¿Está seguro que desea eliminar el vehículo {selectedVehiculo?.placa}? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedVehiculo(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
