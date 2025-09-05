import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Pencil, Trash2, Plus, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Anticipo {
  id: string;
  numeroAnticipo: string;
  proveedor: string;
  concepto: string;
  valor: number;
  fechaSolicitud: Date;
  fechaVencimiento: Date;
  fechaAprobacion?: Date;
  estado: "pendiente" | "aprobado" | "rechazado" | "pagado";
  metodoPago: string;
  observaciones?: string;
}

const proveedores = [
  "Transportes Rápidos S.A.S",
  "Logística Express Ltda",
  "Carga Segura S.A",
  "Rutas Nacionales SAS",
  "Transporte Global S.A.S"
];

const metodosPago = [
  "Transferencia bancaria",
  "Cheque",
  "Efectivo",
  "Descuento en liquidación"
];

const mockAnticipos: Anticipo[] = [
  {
    id: "1",
    numeroAnticipo: "ANT-2024-001",
    proveedor: "Transportes Rápidos S.A.S",
    concepto: "Combustible para ruta Bogotá-Medellín",
    valor: 2500000,
    fechaSolicitud: new Date("2024-01-15"),
    fechaVencimiento: new Date("2024-02-15"),
    fechaAprobacion: new Date("2024-01-16"),
    estado: "aprobado",
    metodoPago: "Transferencia bancaria",
    observaciones: "Aprobado para ruta prioritaria"
  },
  {
    id: "2",
    numeroAnticipo: "ANT-2024-002",
    proveedor: "Logística Express Ltda",
    concepto: "Reparación de vehículo VHC-123",
    valor: 1800000,
    fechaSolicitud: new Date("2024-01-20"),
    fechaVencimiento: new Date("2024-02-20"),
    estado: "pendiente",
    metodoPago: "Cheque"
  },
  {
    id: "3",
    numeroAnticipo: "ANT-2024-003",
    proveedor: "Carga Segura S.A",
    concepto: "Pago anticipado de nómina",
    valor: 3200000,
    fechaSolicitud: new Date("2024-01-18"),
    fechaVencimiento: new Date("2024-02-18"),
    estado: "rechazado",
    metodoPago: "Transferencia bancaria",
    observaciones: "No cumple con los requisitos documentales"
  }
];

export default function Anticipos() {
  const [anticipos, setAnticipos] = useState<Anticipo[]>(mockAnticipos);
  const [filteredAnticipos, setFilteredAnticipos] = useState<Anticipo[]>(mockAnticipos);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnticipo, setEditingAnticipo] = useState<Anticipo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    proveedor: "",
    concepto: "",
    valor: "",
    fechaVencimiento: undefined as Date | undefined,
    metodoPago: "",
    observaciones: ""
  });

  const generateNextNumber = () => {
    const currentYear = new Date().getFullYear();
    const existingNumbers = anticipos
      .map(a => parseInt(a.numeroAnticipo.split('-')[2]))
      .filter(num => !isNaN(num));
    const nextNumber = Math.max(...existingNumbers, 0) + 1;
    return `ANT-${currentYear}-${nextNumber.toString().padStart(3, '0')}`;
  };

  const resetForm = () => {
    setFormData({
      proveedor: "",
      concepto: "",
      valor: "",
      fechaVencimiento: undefined,
      metodoPago: "",
      observaciones: ""
    });
    setEditingAnticipo(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.proveedor || !formData.concepto || !formData.valor || !formData.fechaVencimiento || !formData.metodoPago) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    const anticipoData: Anticipo = {
      id: editingAnticipo?.id || Date.now().toString(),
      numeroAnticipo: editingAnticipo?.numeroAnticipo || generateNextNumber(),
      proveedor: formData.proveedor,
      concepto: formData.concepto,
      valor: parseFloat(formData.valor),
      fechaSolicitud: editingAnticipo?.fechaSolicitud || new Date(),
      fechaVencimiento: formData.fechaVencimiento,
      estado: editingAnticipo?.estado || "pendiente",
      metodoPago: formData.metodoPago,
      observaciones: formData.observaciones
    };

    if (editingAnticipo) {
      const updatedAnticipos = anticipos.map(a => a.id === editingAnticipo.id ? anticipoData : a);
      setAnticipos(updatedAnticipos);
      setFilteredAnticipos(updatedAnticipos);
      toast({
        title: "Éxito",
        description: "Anticipo actualizado correctamente"
      });
    } else {
      const newAnticipos = [...anticipos, anticipoData];
      setAnticipos(newAnticipos);
      setFilteredAnticipos(newAnticipos);
      toast({
        title: "Éxito",
        description: "Anticipo creado correctamente"
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (anticipo: Anticipo) => {
    setEditingAnticipo(anticipo);
    setFormData({
      proveedor: anticipo.proveedor,
      concepto: anticipo.concepto,
      valor: anticipo.valor.toString(),
      fechaVencimiento: anticipo.fechaVencimiento,
      metodoPago: anticipo.metodoPago,
      observaciones: anticipo.observaciones || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const updatedAnticipos = anticipos.filter(a => a.id !== id);
    setAnticipos(updatedAnticipos);
    setFilteredAnticipos(updatedAnticipos);
    toast({
      title: "Éxito",
      description: "Anticipo eliminado correctamente"
    });
  };

  const handleChangeStatus = (id: string, newStatus: Anticipo["estado"]) => {
    const updatedAnticipos = anticipos.map(a => 
      a.id === id 
        ? { 
            ...a, 
            estado: newStatus,
            fechaAprobacion: newStatus === "aprobado" ? new Date() : undefined
          }
        : a
    );
    setAnticipos(updatedAnticipos);
    setFilteredAnticipos(updatedAnticipos);
    toast({
      title: "Éxito",
      description: `Estado actualizado a ${newStatus}`
    });
  };

  const filterAnticipos = () => {
    let filtered = anticipos;

    if (searchTerm) {
      filtered = filtered.filter(a => 
        a.numeroAnticipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.concepto.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "todos") {
      filtered = filtered.filter(a => a.estado === statusFilter);
    }

    setFilteredAnticipos(filtered);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setTimeout(filterAnticipos, 100);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setTimeout(filterAnticipos, 100);
  };

  const getStatusBadge = (estado: string) => {
    const variants = {
      pendiente: "bg-yellow-100 text-yellow-800 border-yellow-200",
      aprobado: "bg-green-100 text-green-800 border-green-200",
      rechazado: "bg-red-100 text-red-800 border-red-200",
      pagado: "bg-blue-100 text-blue-800 border-blue-200"
    };
    
    return (
      <Badge className={variants[estado as keyof typeof variants] || variants.pendiente}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Anticipos</h1>
          <p className="text-muted-foreground">Administra los anticipos a proveedores</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Anticipo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingAnticipo ? "Editar Anticipo" : "Crear Nuevo Anticipo"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="proveedor">Proveedor *</Label>
                  <Select value={formData.proveedor} onValueChange={(value) => setFormData({...formData, proveedor: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar proveedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {proveedores.map((proveedor) => (
                        <SelectItem key={proveedor} value={proveedor}>
                          {proveedor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valor">Valor *</Label>
                  <Input
                    id="valor"
                    type="number"
                    placeholder="0"
                    value={formData.valor}
                    onChange={(e) => setFormData({...formData, valor: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="concepto">Concepto *</Label>
                <Input
                  id="concepto"
                  placeholder="Descripción del anticipo"
                  value={formData.concepto}
                  onChange={(e) => setFormData({...formData, concepto: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fecha de vencimiento *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.fechaVencimiento && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.fechaVencimiento ? (
                          format(formData.fechaVencimiento, "dd/MM/yyyy", { locale: es })
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.fechaVencimiento}
                        onSelect={(date) => setFormData({...formData, fechaVencimiento: date})}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metodoPago">Método de pago *</Label>
                  <Select value={formData.metodoPago} onValueChange={(value) => setFormData({...formData, metodoPago: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar método" />
                    </SelectTrigger>
                    <SelectContent>
                      {metodosPago.map((metodo) => (
                        <SelectItem key={metodo} value={metodo}>
                          {metodo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  placeholder="Comentarios adicionales..."
                  value={formData.observaciones}
                  onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingAnticipo ? "Actualizar" : "Crear"} Anticipo
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por número, proveedor o concepto..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="aprobado">Aprobado</SelectItem>
                  <SelectItem value="rechazado">Rechazado</SelectItem>
                  <SelectItem value="pagado">Pagado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Anticipos */}
      <div className="grid gap-4">
        {filteredAnticipos.map((anticipo) => (
          <Card key={anticipo.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{anticipo.numeroAnticipo}</CardTitle>
                  <p className="text-sm text-muted-foreground">{anticipo.proveedor}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(anticipo.estado)}
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(anticipo)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(anticipo.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium">Concepto</p>
                  <p className="text-sm text-muted-foreground">{anticipo.concepto}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Valor</p>
                  <p className="text-sm text-muted-foreground">
                    ${anticipo.valor.toLocaleString('es-CO')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Método de pago</p>
                  <p className="text-sm text-muted-foreground">{anticipo.metodoPago}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Fecha solicitud</p>
                  <p className="text-sm text-muted-foreground">
                    {format(anticipo.fechaSolicitud, "dd/MM/yyyy", { locale: es })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Fecha vencimiento</p>
                  <p className="text-sm text-muted-foreground">
                    {format(anticipo.fechaVencimiento, "dd/MM/yyyy", { locale: es })}
                  </p>
                </div>
                {anticipo.fechaAprobacion && (
                  <div>
                    <p className="text-sm font-medium">Fecha aprobación</p>
                    <p className="text-sm text-muted-foreground">
                      {format(anticipo.fechaAprobacion, "dd/MM/yyyy", { locale: es })}
                    </p>
                  </div>
                )}
              </div>
              
              {anticipo.observaciones && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm font-medium">Observaciones</p>
                  <p className="text-sm text-muted-foreground">{anticipo.observaciones}</p>
                </div>
              )}

              {anticipo.estado === "pendiente" && (
                <div className="mt-4 flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleChangeStatus(anticipo.id, "aprobado")}
                  >
                    Aprobar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleChangeStatus(anticipo.id, "rechazado")}
                  >
                    Rechazar
                  </Button>
                </div>
              )}

              {anticipo.estado === "aprobado" && (
                <div className="mt-4">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleChangeStatus(anticipo.id, "pagado")}
                  >
                    Marcar como pagado
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAnticipos.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No se encontraron anticipos</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}