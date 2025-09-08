import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Download,
  Filter,
  MoreHorizontal,
  Plus,
  Upload,
  DollarSign,
  CheckCircle2,
  Calendar,
  TrendingUp,
  Search,
  Grid3X3,
  List,
  Pencil,
  Trash2,
  FileCheck,
} from "lucide-react";
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

  const [viewMode, setViewMode] = useState<"list" | "cards">("list");
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string }>({ open: false, id: "" });

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

  const totalAnticipos = anticipos.length;
  const porDescontar = anticipos.filter(a => a.estado === "por descontar").length;
  const descontados = anticipos.filter(a => a.estado === "descontado").length;
  const valorTotal = anticipos.reduce((sum, a) => sum + a.valor, 0);

  return (
    <div className="min-h-screen bg-muted/30">
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
              <h2 className="text-xl font-semibold tracking-tight">Gestión de Anticipos</h2>
              <p className="text-sm text-muted-foreground">Administra los anticipos y adelantos a proveedores</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="rounded-xl"><Upload className="h-4 w-4 mr-2"/>Importar</Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-xl" onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Anticipo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl rounded-2xl">
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
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Seleccionar proveedor" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
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
                          className="rounded-xl"
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
                        className="rounded-xl"
                        value={formData.concepto}
                        onChange={(e) => setFormData({...formData, concepto: e.target.value})}
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" className="rounded-xl" onClick={() => setIsDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit" className="rounded-xl">
                        {editingAnticipo ? "Actualizar" : "Crear"} Anticipo
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Metric icon={DollarSign} label="Total Anticipos" value={totalAnticipos} sub={`$${valorTotal.toLocaleString('es-CO')} en total`} />
            <Metric icon={Calendar} label="Por Descontar" value={porDescontar} sub={`${((porDescontar/totalAnticipos)*100).toFixed(1)}% del total`} />
            <Metric icon={CheckCircle2} label="Descontados" value={descontados} sub={`${((descontados/totalAnticipos)*100).toFixed(1)}% del total`} />
            <Metric icon={TrendingUp} label="Promedio" value={`$${Math.round(valorTotal/totalAnticipos).toLocaleString('es-CO')}`} sub="Valor promedio por anticipo" />
          </div>

          {/* List section */}
          <Card className="rounded-2xl border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Lista de Anticipos</CardTitle>
              <p className="text-sm text-muted-foreground">Gestiona y visualiza todos los anticipos registrados en el sistema</p>
            </CardHeader>
            <CardContent>
              {/* Toolbar */}
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2 w-full md:max-w-md">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Buscar por número, proveedor o concepto" 
                      className="pl-9 rounded-xl" 
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "list" | "cards")} className="hidden sm:block">
                    <TabsList className="rounded-xl">
                      <TabsTrigger value="list"><List className="h-4 w-4 mr-1"/>Lista</TabsTrigger>
                      <TabsTrigger value="cards"><Grid3X3 className="h-4 w-4 mr-1"/>Tarjetas</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <Select value={proveedorFilter} onValueChange={handleProveedorFilter}>
                    <SelectTrigger className="w-48 rounded-xl">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Proveedor" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="todos">Todos los proveedores</SelectItem>
                      {proveedores.map((proveedor) => (
                        <SelectItem key={proveedor} value={proveedor}>
                          {proveedor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={handleStatusFilter}>
                    <SelectTrigger className="w-40 rounded-xl">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="por descontar">Por Descontar</SelectItem>
                      <SelectItem value="descontado">Descontado</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="rounded-xl"><Download className="h-4 w-4 mr-2"/>Exportar</Button>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Table View */}
              {viewMode === "list" && (
                <div className="rounded-xl border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="whitespace-nowrap">Número</TableHead>
                        <TableHead className="whitespace-nowrap">Proveedor</TableHead>
                        <TableHead className="whitespace-nowrap">Concepto</TableHead>
                        <TableHead className="whitespace-nowrap">Valor</TableHead>
                        <TableHead className="whitespace-nowrap">Estado</TableHead>
                        <TableHead className="whitespace-nowrap">Usuario</TableHead>
                        <TableHead className="whitespace-nowrap text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAnticipos.map((anticipo) => (
                        <TableRow key={anticipo.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{anticipo.numeroAnticipo}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{anticipo.proveedor.slice(0,2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <div className="truncate font-medium">{anticipo.proveedor}</div>
                                <div className="text-xs text-muted-foreground">Proveedor</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">{anticipo.concepto}</TableCell>
                          <TableCell className="font-medium">${anticipo.valor.toLocaleString('es-CO')}</TableCell>
                          <TableCell>
                            {anticipo.estado === "descontado" ? (
                              <Badge className="rounded-md bg-green-100 text-green-800 border-green-200">
                                {anticipo.numeroPago ? `Descontado (${anticipo.numeroPago})` : "Descontado"}
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="rounded-md">Por Descontar</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">{anticipo.usuario}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4"/></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-xl">
                                  <DropdownMenuItem onClick={() => handleEdit(anticipo)} disabled={anticipo.estado !== "por descontar"}>
                                    <Pencil className="h-4 w-4 mr-2"/>Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleChangeStatus(anticipo.id, anticipo.estado === "por descontar" ? "descontado" : "por descontar")}
                                  >
                                    <FileCheck className="h-4 w-4 mr-2"/>
                                    {anticipo.estado === "por descontar" ? "Marcar Descontado" : "Marcar Por Descontar"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-destructive"
                                    onClick={() => setDeleteConfirm({ open: true, id: anticipo.id })}
                                    disabled={anticipo.estado !== "por descontar"}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2"/>Eliminar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Cards View */}
              {viewMode === "cards" && (
                <div className="grid gap-4">
                  {filteredAnticipos.map((anticipo) => (
                    <Card key={anticipo.id} className="rounded-2xl">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{anticipo.numeroAnticipo}</CardTitle>
                            <p className="text-sm text-muted-foreground">{anticipo.proveedor}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {anticipo.estado === "descontado" ? (
                              <Badge className="rounded-md bg-green-100 text-green-800 border-green-200">
                                {anticipo.numeroPago ? `Descontado (${anticipo.numeroPago})` : "Descontado"}
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="rounded-md">Por Descontar</Badge>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4"/></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-xl">
                                <DropdownMenuItem onClick={() => handleEdit(anticipo)} disabled={anticipo.estado !== "por descontar"}>
                                  <Pencil className="h-4 w-4 mr-2"/>Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleChangeStatus(anticipo.id, anticipo.estado === "por descontar" ? "descontado" : "por descontar")}
                                >
                                  <FileCheck className="h-4 w-4 mr-2"/>
                                  {anticipo.estado === "por descontar" ? "Marcar Descontado" : "Marcar Por Descontar"}
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => setDeleteConfirm({ open: true, id: anticipo.id })}
                                  disabled={anticipo.estado !== "por descontar"}
                                >
                                  <Trash2 className="h-4 w-4 mr-2"/>Eliminar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
                            <p className="text-sm font-semibold">${anticipo.valor.toLocaleString('es-CO')}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Usuario</p>
                            <p className="text-sm text-muted-foreground">{anticipo.usuario}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {filteredAnticipos.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No se encontraron anticipos</p>
                </div>
              )}

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                <div>Mostrando 1–{filteredAnticipos.length} de {anticipos.length}</div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="rounded-lg">Anterior</Button>
                  <Button variant="outline" size="sm" className="rounded-lg">Siguiente</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirm.open} onOpenChange={(open) => setDeleteConfirm({ open, id: "" })}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El anticipo será eliminado permanentemente del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              className="rounded-xl"
              onClick={() => {
                handleDelete(deleteConfirm.id);
                setDeleteConfirm({ open: false, id: "" });
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}