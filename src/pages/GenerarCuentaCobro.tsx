import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Plus, Search, Calendar, DollarSign, User, Building2 } from "lucide-react";

export default function GenerarCuentaCobro() {
  const [searchTerm, setSearchTerm] = useState("");

  // Datos mock de servicios
  const servicios = [
    {
      id: 1,
      fecha: "2024-01-15",
      servicio: "Transporte de carga - Bogotá a Medellín",
      proveedor: "Transportes Colombia SAS",
      vehiculo: "ABC-123",
      valor: 850000,
      estado: "Pendiente"
    },
    {
      id: 2,
      fecha: "2024-01-16",
      servicio: "Transporte de pasajeros - Ruta urbana",
      proveedor: "Movilidad Express LTDA",
      vehiculo: "XYZ-789",
      valor: 450000,
      estado: "Pendiente"
    },
    {
      id: 3,
      fecha: "2024-01-17",
      servicio: "Transporte intermunicipal - Cali a Pasto",
      proveedor: "Rutas del Sur S.A.",
      vehiculo: "DEF-456",
      valor: 1200000,
      estado: "Seleccionado"
    }
  ];

  const serviciosFiltrados = servicios.filter(servicio =>
    servicio.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    servicio.servicio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Generar Cuenta de Cobro</h1>
          <p className="text-muted-foreground mt-1">
            Crea cuentas de cobro para servicios de transporte realizados
          </p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Cuenta de Cobro
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Servicios Pendientes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +12% desde el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total a Cobrar</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12.450.000</div>
            <p className="text-xs text-muted-foreground">
              +8% desde el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proveedores Activos</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">
              +2 nuevos este mes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cuentas Generadas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              +23 este mes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Formulario de Creación */}
      <Card>
        <CardHeader>
          <CardTitle>Crear Nueva Cuenta de Cobro</CardTitle>
          <CardDescription>
            Complete la información necesaria para generar la cuenta de cobro
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="proveedor">Proveedor</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transportes-colombia">Transportes Colombia SAS</SelectItem>
                    <SelectItem value="movilidad-express">Movilidad Express LTDA</SelectItem>
                    <SelectItem value="rutas-del-sur">Rutas del Sur S.A.</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="periodo">Período</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enero-2024">Enero 2024</SelectItem>
                    <SelectItem value="febrero-2024">Febrero 2024</SelectItem>
                    <SelectItem value="marzo-2024">Marzo 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea 
                id="observaciones"
                placeholder="Ingrese observaciones adicionales..."
                rows={3}
              />
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Lista de Servicios */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Servicios Disponibles</CardTitle>
              <CardDescription>
                Seleccione los servicios para incluir en la cuenta de cobro
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar servicios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {serviciosFiltrados.map((servicio) => (
              <div
                key={servicio.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <div>
                    <h4 className="font-medium">{servicio.servicio}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {servicio.proveedor}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {servicio.fecha}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-semibold">
                      ${servicio.valor.toLocaleString()}
                    </div>
                    <Badge variant={servicio.estado === "Seleccionado" ? "default" : "secondary"}>
                      {servicio.estado}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {serviciosFiltrados.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron servicios que coincidan con la búsqueda.
            </div>
          )}
          
          <div className="flex justify-end pt-4 border-t mt-4">
            <div className="space-x-2">
              <Button variant="outline">Cancelar</Button>
              <Button>Generar Cuenta de Cobro</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}