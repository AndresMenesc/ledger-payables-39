import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, Upload, Download, Search, Filter, Eye, 
  CheckCircle, AlertCircle, Clock, Folder, Calendar,
  User, Building2
} from "lucide-react";

export default function Documentacion() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [filterTipo, setFilterTipo] = useState("todos");

  // Datos mock de documentos
  const documentos = [
    {
      id: 1,
      nombre: "Cuenta de Cobro #001 - Enero 2024",
      tipo: "Cuenta de Cobro",
      proveedor: "Transportes Colombia SAS",
      fecha: "2024-01-15",
      estado: "Aprobado",
      tamaño: "2.4 MB",
      formato: "PDF"
    },
    {
      id: 2,
      nombre: "RUT - Transportes Colombia SAS",
      tipo: "Documento Legal",
      proveedor: "Transportes Colombia SAS",
      fecha: "2024-01-10",
      estado: "Vigente",
      tamaño: "1.2 MB",
      formato: "PDF"
    },
    {
      id: 3,
      nombre: "Certificado RUNT - Vehículo ABC-123",
      tipo: "Certificado",
      proveedor: "Movilidad Express LTDA",
      fecha: "2024-01-12",
      estado: "Pendiente",
      tamaño: "890 KB",
      formato: "PDF"
    },
    {
      id: 4,
      nombre: "Póliza de Seguros - Vehículo XYZ-789",
      tipo: "Seguro",
      proveedor: "Rutas del Sur S.A.",
      fecha: "2024-01-08",
      estado: "Vencido",
      tamaño: "3.1 MB",
      formato: "PDF"
    },
    {
      id: 5,
      nombre: "Licencia de Conducir - Juan Pérez",
      tipo: "Licencia",
      proveedor: "Transportes Colombia SAS",
      fecha: "2024-01-14",
      estado: "Vigente",
      tamaño: "567 KB",
      formato: "JPG"
    }
  ];

  const documentosFiltrados = documentos.filter(doc => {
    const matchesSearch = 
      doc.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.proveedor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = filterEstado === "todos" || doc.estado.toLowerCase() === filterEstado;
    const matchesTipo = filterTipo === "todos" || doc.tipo.toLowerCase() === filterTipo.toLowerCase();
    
    return matchesSearch && matchesEstado && matchesTipo;
  });

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Aprobado":
      case "Vigente":
        return <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20">{estado}</Badge>;
      case "Pendiente":
        return <Badge className="bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20">{estado}</Badge>;
      case "Vencido":
        return <Badge className="bg-red-500/10 text-red-700 hover:bg-red-500/20">{estado}</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "Aprobado":
      case "Vigente":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Pendiente":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "Vencido":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
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
            Gestión y almacenamiento de documentos de proveedores
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
            <div className="text-2xl font-bold">248</div>
            <p className="text-xs text-muted-foreground">
              +12 este mes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documentos Vigentes</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">189</div>
            <p className="text-xs text-muted-foreground">
              76% del total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Por Vencer</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              Próximos 30 días
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Almacenamiento</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.1 GB</div>
            <p className="text-xs text-muted-foreground">
              de 10 GB disponibles
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
                <SelectItem value="cuenta de cobro">Cuenta de Cobro</SelectItem>
                <SelectItem value="documento legal">Documento Legal</SelectItem>
                <SelectItem value="certificado">Certificado</SelectItem>
                <SelectItem value="seguro">Seguro</SelectItem>
                <SelectItem value="licencia">Licencia</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="vigente">Vigente</SelectItem>
                <SelectItem value="aprobado">Aprobado</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="vencido">Vencido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Documentos */}
      <Card>
        <CardHeader>
          <CardTitle>Documentos Almacenados</CardTitle>
          <CardDescription>
            Lista completa de documentos organizados por proveedor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documentosFiltrados.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center space-x-4 min-w-0 flex-1">
                  {getEstadoIcon(doc.estado)}
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium truncate">{doc.nombre}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        <span className="truncate">{doc.proveedor}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {doc.fecha}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {doc.tipo}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium">{doc.formato}</div>
                    <div className="text-xs text-muted-foreground">{doc.tamaño}</div>
                  </div>
                  {getEstadoBadge(doc.estado)}
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
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

      {/* Acciones Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Herramientas para gestión masiva de documentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <div className="font-medium">Carga Masiva</div>
                <div className="text-xs text-muted-foreground">Subir múltiples documentos</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <Download className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <div className="font-medium">Exportar Todo</div>
                <div className="text-xs text-muted-foreground">Descargar documentos seleccionados</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <div className="font-medium">Por Vencer</div>
                <div className="text-xs text-muted-foreground">Revisar documentos próximos a vencer</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <div className="font-medium">Generar Reporte</div>
                <div className="text-xs text-muted-foreground">Estado de documentación</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}