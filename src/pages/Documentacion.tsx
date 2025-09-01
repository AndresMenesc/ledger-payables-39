import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  FileText, Upload, Download, Search, Eye, 
  CheckCircle, AlertTriangle, Clock, Folder, Calendar,
  Building2, X
} from "lucide-react";

export default function Documentacion() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [filterTipo, setFilterTipo] = useState("todos");
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [uploadDocument, setUploadDocument] = useState<any>(null);

  // Datos mock de documentos basados en los 6 documentos de vehículos
  const documentos = [
    {
      id: 1,
      nombre: "Revisión Preventiva",
      tipo: "Vehículo",
      fechaVencimiento: "2024-12-31",
      estado: "Vigente",
      archivo: "revision_preventiva.pdf",
      tamaño: "1.2 MB",
      formato: "PDF"
    },
    {
      id: 2,
      nombre: "Tecnomecánica",
      tipo: "Vehículo",
      fechaVencimiento: "2024-11-30",
      estado: "Vigente",
      archivo: "tecnomecanica.pdf",
      tamaño: "890 KB",
      formato: "PDF"
    },
    {
      id: 3,
      nombre: "Tarjeta de Operación",
      tipo: "Vehículo",
      fechaVencimiento: "2025-06-15",
      estado: "Vigente",
      archivo: "tarjeta_operacion.pdf",
      tamaño: "1.5 MB",
      formato: "PDF"
    },
    {
      id: 4,
      nombre: "SOAT",
      tipo: "Seguro",
      fechaVencimiento: "2024-10-15",
      estado: "Por Vencer",
      archivo: "soat.pdf",
      tamaño: "567 KB",
      formato: "PDF"
    },
    {
      id: 5,
      nombre: "Póliza Contractual",
      tipo: "Seguro",
      fechaVencimiento: "2024-09-20",
      estado: "Vencido",
      archivo: "poliza_contractual.pdf",
      tamaño: "2.1 MB",
      formato: "PDF"
    },
    {
      id: 6,
      nombre: "Póliza Extra Contractual",
      tipo: "Seguro",
      fechaVencimiento: "2024-08-30",
      estado: "Vencido",
      archivo: "poliza_extra_contractual.pdf",
      tamaño: "1.8 MB",
      formato: "PDF"
    }
  ];

  const documentosFiltrados = documentos.filter(doc => {
    const matchesSearch = 
      doc.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tipo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = filterEstado === "todos" || doc.estado.toLowerCase() === filterEstado;
    const matchesTipo = filterTipo === "todos" || doc.tipo.toLowerCase() === filterTipo.toLowerCase();
    
    return matchesSearch && matchesEstado && matchesTipo;
  });

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Vigente":
        return <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20">{estado}</Badge>;
      case "Por Vencer":
        return <Badge className="bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20">{estado}</Badge>;
      case "Vencido":
        return <Badge className="bg-red-500/10 text-red-700 hover:bg-red-500/20">{estado}</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "Vigente":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Por Vencer":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "Vencido":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Documentación</h1>
          <p className="text-muted-foreground mt-1">
            Gestión de documentos del vehículo y seguros
          </p>
        </div>
        <Button className="w-full sm:w-auto">
          <Upload className="w-4 h-4 mr-2" />
          Subir Documento
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documentos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">
              Total de documentos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documentos Vencidos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Requieren actualización
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Por Vencer (30 días)</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              Próximos a vencer
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actualizados Hoy</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Documentos vigentes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y Búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Tipo de documento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los tipos</SelectItem>
                <SelectItem value="vehículo">Vehículo</SelectItem>
                <SelectItem value="seguro">Seguro</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="vigente">Vigente</SelectItem>
                <SelectItem value="por vencer">Por Vencer</SelectItem>
                <SelectItem value="vencido">Vencido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Documentos */}
      <Card>
        <CardHeader>
          <CardTitle>Documentos del Vehículo</CardTitle>
          <CardDescription>
            Documentos requeridos para operación del vehículo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documentosFiltrados.map((documento) => (
              <div
                key={documento.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center space-x-4 min-w-0 flex-1">
                  {getEstadoIcon(documento.estado)}
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium truncate">{documento.nombre}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        <span className="truncate">{documento.tipo}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Vence: {documento.fechaVencimiento}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium">{documento.formato}</div>
                    <div className="text-xs text-muted-foreground">{documento.tamaño}</div>
                  </div>
                  {getEstadoBadge(documento.estado)}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedDocument(documento)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {(documento.estado === "Vencido" || documento.estado === "Por Vencer") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setUploadDocument(documento)}
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Adjuntar
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {documentosFiltrados.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron documentos que coincidan con los filtros aplicados.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal para vista previa del documento */}
      <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Vista Previa - {selectedDocument?.nombre}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 bg-muted/30 rounded-lg p-4 min-h-[500px] flex items-center justify-center">
            <div className="text-center">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Vista previa del documento: {selectedDocument?.archivo}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Fecha de vencimiento: {selectedDocument?.fechaVencimiento}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para adjuntar documento */}
      <Dialog open={!!uploadDocument} onOpenChange={() => setUploadDocument(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjuntar Documento - {uploadDocument?.nombre}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="file">Seleccionar archivo</Label>
              <Input id="file" type="file" accept=".pdf,.jpg,.jpeg,.png" />
            </div>
            <div>
              <Label htmlFor="fecha">Nueva fecha de vencimiento</Label>
              <Input id="fecha" type="date" />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setUploadDocument(null)}>
                Cancelar
              </Button>
              <Button onClick={() => {
                // Aquí iría la lógica para subir el archivo
                alert('Documento adjuntado exitosamente');
                setUploadDocument(null);
              }}>
                Adjuntar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}