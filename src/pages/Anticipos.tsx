import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Anticipo {
  id: string;
  numeroAnticipo: string;
  proveedor: string;
  concepto: string;
  valor: number;
  estado: "por descontar" | "descontado";
  usuario: string;
  numeroPago?: string;
}

const proveedores = [
  "Transportes Rápidos S.A.S",
  "Logística Express Ltda",
  "Carga Segura S.A",
  "Rutas Nacionales SAS",
  "Transporte Global S.A.S"
];

const mockAnticipos: Anticipo[] = [
  {
    id: "1",
    numeroAnticipo: "ANT-2024-001",
    proveedor: "Transportes Rápidos S.A.S",
    concepto: "Combustible para ruta Bogotá-Medellín",
    valor: 2500000,
    estado: "por descontar",
    usuario: "admin@sistema.com"
  },
  {
    id: "2",
    numeroAnticipo: "ANT-2024-002",
    proveedor: "Logística Express Ltda",
    concepto: "Reparación de vehículo VHC-123",
    valor: 1800000,
    estado: "descontado",
    usuario: "finanzas@sistema.com",
    numeroPago: "P0029"
  },
  {
    id: "3",
    numeroAnticipo: "ANT-2024-003",
    proveedor: "Carga Segura S.A",
    concepto: "Pago anticipado de nómina",
    valor: 3200000,
    estado: "por descontar",
    usuario: "gerencia@sistema.com"
  }
];

export default function Anticipos() {
  const [anticipos, setAnticipos] = useState<Anticipo[]>(mockAnticipos);
  const [filteredAnticipos, setFilteredAnticipos] = useState<Anticipo[]>(mockAnticipos);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnticipo, setEditingAnticipo] = useState<Anticipo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [proveedorFilter, setProveedorFilter] = useState<string>("todos");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    proveedor: "",
    concepto: "",
    valor: ""
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
      valor: ""
    });
    setEditingAnticipo(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.proveedor || !formData.concepto || !formData.valor) {
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
      estado: editingAnticipo?.estado || "por descontar",
      usuario: editingAnticipo?.usuario || "admin@sistema.com",
      numeroPago: editingAnticipo?.numeroPago
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
      valor: anticipo.valor.toString()
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
      a.id === id ? { ...a, estado: newStatus } : a
    );
    setAnticipos(updatedAnticipos);
    setFilteredAnticipos(updatedAnticipos);
    toast({
      title: "Éxito",
      description: `Estado actualizado a ${newStatus}`
    });
  };

  const filterAnticipos = () => {
    let filtered = [...anticipos];

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

    if (proveedorFilter !== "todos") {
      filtered = filtered.filter(a => a.proveedor === proveedorFilter);
    }

    setFilteredAnticipos(filtered);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    // Apply filters immediately after state update
    let filtered = [...anticipos];

    if (value) {
      filtered = filtered.filter(a => 
        a.numeroAnticipo.toLowerCase().includes(value.toLowerCase()) ||
        a.proveedor.toLowerCase().includes(value.toLowerCase()) ||
        a.concepto.toLowerCase().includes(value.toLowerCase())
      );
    }

    if (statusFilter !== "todos") {
      filtered = filtered.filter(a => a.estado === statusFilter);
    }

    if (proveedorFilter !== "todos") {
      filtered = filtered.filter(a => a.proveedor === proveedorFilter);
    }

    setFilteredAnticipos(filtered);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    // Apply filters immediately after state update
    let filtered = [...anticipos];

    if (searchTerm) {
      filtered = filtered.filter(a => 
        a.numeroAnticipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.concepto.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (status !== "todos") {
      filtered = filtered.filter(a => a.estado === status);
    }

    if (proveedorFilter !== "todos") {
      filtered = filtered.filter(a => a.proveedor === proveedorFilter);
    }

    setFilteredAnticipos(filtered);
  };

  const handleProveedorFilter = (proveedor: string) => {
    setProveedorFilter(proveedor);
    // Apply filters immediately after state update
    let filtered = [...anticipos];

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

    if (proveedor !== "todos") {
      filtered = filtered.filter(a => a.proveedor === proveedor);
    }

    setFilteredAnticipos(filtered);
  };

  const getStatusBadge = (anticipo: Anticipo) => {
    if (anticipo.estado === "descontado" && anticipo.numeroPago) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          Descontado en el pago {anticipo.numeroPago}
        </Badge>
      );
    }
    
    const variants = {
      "por descontar": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "descontado": "bg-green-100 text-green-800 border-green-200"
    };
    
    return (
      <Badge className={variants[anticipo.estado as keyof typeof variants] || variants["por descontar"]}>
        {anticipo.estado === "por descontar" ? "Por Descontar" : "Descontado"}
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
              <Select value={proveedorFilter} onValueChange={handleProveedorFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Proveedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los proveedores</SelectItem>
                  {proveedores.map((proveedor) => (
                    <SelectItem key={proveedor} value={proveedor}>
                      {proveedor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="por descontar">Por Descontar</SelectItem>
                  <SelectItem value="descontado">Descontado</SelectItem>
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
                  {getStatusBadge(anticipo)}
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEdit(anticipo)}
                      disabled={anticipo.estado !== "por descontar"}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(anticipo.id)}
                      disabled={anticipo.estado !== "por descontar"}
                    >
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
                  <p className="text-sm font-medium">Usuario</p>
                  <p className="text-sm text-muted-foreground">{anticipo.usuario}</p>
                </div>
              </div>

              {anticipo.estado === "por descontar" && (
                <div className="mt-4">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleChangeStatus(anticipo.id, "descontado")}
                  >
                    Marcar como descontado
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