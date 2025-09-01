import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { FileText, Plus, Search, Calendar, DollarSign, User, Building2 } from "lucide-react";

export default function GenerarCuentaCobro() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { toast } = useToast();

  // Datos mock de servicios
  const servicios = [
    { id: 1, fecha: "2024-01-15", servicio: "Ejecutivo", proveedor: "Transportes Colombia SAS", vehiculo: "ABC-123", valor: 85000, estado: "Liquidado" },
    { id: 2, fecha: "2024-01-16", servicio: "Ruta", proveedor: "Movilidad Express LTDA", vehiculo: "XYZ-789", valor: 45000, estado: "Liquidado" },
    { id: 3, fecha: "2024-01-17", servicio: "Ejecutivo", proveedor: "Rutas del Sur S.A.", vehiculo: "DEF-456", valor: 120000, estado: "Liquidado" },
    { id: 4, fecha: "2024-01-18", servicio: "Ruta", proveedor: "Transportes Colombia SAS", vehiculo: "GHI-789", valor: 65000, estado: "Liquidado" },
    { id: 5, fecha: "2024-01-19", servicio: "Ejecutivo", proveedor: "Movilidad Express LTDA", vehiculo: "JKL-012", valor: 95000, estado: "Liquidado" },
    { id: 6, fecha: "2024-01-20", servicio: "Ruta", proveedor: "Rutas del Sur S.A.", vehiculo: "MNO-345", valor: 55000, estado: "Liquidado" },
    { id: 7, fecha: "2024-01-21", servicio: "Ejecutivo", proveedor: "Transportes Colombia SAS", vehiculo: "PQR-678", valor: 110000, estado: "Liquidado" },
    { id: 8, fecha: "2024-01-22", servicio: "Ruta", proveedor: "Movilidad Express LTDA", vehiculo: "STU-901", valor: 70000, estado: "Liquidado" },
    { id: 9, fecha: "2024-01-23", servicio: "Ejecutivo", proveedor: "Rutas del Sur S.A.", vehiculo: "VWX-234", valor: 105000, estado: "Liquidado" },
    { id: 10, fecha: "2024-01-24", servicio: "Ruta", proveedor: "Transportes Colombia SAS", vehiculo: "YZA-567", valor: 48000, estado: "Liquidado" },
    { id: 11, fecha: "2024-01-25", servicio: "Ejecutivo", proveedor: "Movilidad Express LTDA", vehiculo: "BCD-890", valor: 92000, estado: "Liquidado" },
    { id: 12, fecha: "2024-01-26", servicio: "Ruta", proveedor: "Rutas del Sur S.A.", vehiculo: "EFG-123", valor: 58000, estado: "Liquidado" },
    { id: 13, fecha: "2024-01-27", servicio: "Ejecutivo", proveedor: "Transportes Colombia SAS", vehiculo: "HIJ-456", valor: 88000, estado: "Liquidado" },
    { id: 14, fecha: "2024-01-28", servicio: "Ruta", proveedor: "Movilidad Express LTDA", vehiculo: "KLM-789", valor: 63000, estado: "Liquidado" },
    { id: 15, fecha: "2024-01-29", servicio: "Ejecutivo", proveedor: "Rutas del Sur S.A.", vehiculo: "NOP-012", valor: 97000, estado: "Liquidado" },
    { id: 16, fecha: "2024-01-30", servicio: "Ruta", proveedor: "Transportes Colombia SAS", vehiculo: "QRS-345", valor: 52000, estado: "Liquidado" },
    { id: 17, fecha: "2024-02-01", servicio: "Ejecutivo", proveedor: "Movilidad Express LTDA", vehiculo: "TUV-678", valor: 103000, estado: "Liquidado" },
    { id: 18, fecha: "2024-02-02", servicio: "Ruta", proveedor: "Rutas del Sur S.A.", vehiculo: "WXY-901", valor: 59000, estado: "Liquidado" },
    { id: 19, fecha: "2024-02-03", servicio: "Ejecutivo", proveedor: "Transportes Colombia SAS", vehiculo: "ZAB-234", valor: 89000, estado: "Liquidado" },
    { id: 20, fecha: "2024-02-04", servicio: "Ruta", proveedor: "Movilidad Express LTDA", vehiculo: "CDE-567", valor: 67000, estado: "Liquidado" },
    { id: 21, fecha: "2024-02-05", servicio: "Ejecutivo", proveedor: "Rutas del Sur S.A.", vehiculo: "FGH-890", valor: 94000, estado: "Liquidado" },
    { id: 22, fecha: "2024-02-06", servicio: "Ruta", proveedor: "Transportes Colombia SAS", vehiculo: "IJK-123", valor: 61000, estado: "Liquidado" },
    { id: 23, fecha: "2024-02-07", servicio: "Ejecutivo", proveedor: "Movilidad Express LTDA", vehiculo: "LMN-456", valor: 98000, estado: "Liquidado" },
    { id: 24, fecha: "2024-02-08", servicio: "Ruta", proveedor: "Rutas del Sur S.A.", vehiculo: "OPQ-789", valor: 54000, estado: "Liquidado" },
    { id: 25, fecha: "2024-02-09", servicio: "Ejecutivo", proveedor: "Transportes Colombia SAS", vehiculo: "RST-012", valor: 91000, estado: "Liquidado" },
    { id: 26, fecha: "2024-02-10", servicio: "Ruta", proveedor: "Movilidad Express LTDA", vehiculo: "UVW-345", valor: 66000, estado: "Liquidado" },
    { id: 27, fecha: "2024-02-11", servicio: "Ejecutivo", proveedor: "Rutas del Sur S.A.", vehiculo: "XYZ-678", valor: 99000, estado: "Liquidado" },
    { id: 28, fecha: "2024-02-12", servicio: "Ruta", proveedor: "Transportes Colombia SAS", vehiculo: "ABC-901", valor: 57000, estado: "Liquidado" },
    { id: 29, fecha: "2024-02-13", servicio: "Ejecutivo", proveedor: "Movilidad Express LTDA", vehiculo: "DEF-234", valor: 96000, estado: "Liquidado" },
    { id: 30, fecha: "2024-02-14", servicio: "Ruta", proveedor: "Rutas del Sur S.A.", vehiculo: "GHI-567", valor: 62000, estado: "Liquidado" },
    { id: 31, fecha: "2024-02-15", servicio: "Ejecutivo", proveedor: "Transportes Colombia SAS", vehiculo: "JKL-890", valor: 87000, estado: "Liquidado" },
    { id: 32, fecha: "2024-02-16", servicio: "Ruta", proveedor: "Movilidad Express LTDA", vehiculo: "MNO-123", valor: 69000, estado: "Liquidado" },
    { id: 33, fecha: "2024-02-17", servicio: "Ejecutivo", proveedor: "Rutas del Sur S.A.", vehiculo: "PQR-456", valor: 102000, estado: "Liquidado" },
    { id: 34, fecha: "2024-02-18", servicio: "Ruta", proveedor: "Transportes Colombia SAS", vehiculo: "STU-789", valor: 56000, estado: "Liquidado" },
    { id: 35, fecha: "2024-02-19", servicio: "Ejecutivo", proveedor: "Movilidad Express LTDA", vehiculo: "VWX-012", valor: 93000, estado: "Liquidado" },
    { id: 36, fecha: "2024-02-20", servicio: "Ruta", proveedor: "Rutas del Sur S.A.", vehiculo: "YZA-345", valor: 64000, estado: "Liquidado" },
    { id: 37, fecha: "2024-02-21", servicio: "Ejecutivo", proveedor: "Transportes Colombia SAS", vehiculo: "BCD-678", valor: 86000, estado: "Liquidado" },
    { id: 38, fecha: "2024-02-22", servicio: "Ruta", proveedor: "Movilidad Express LTDA", vehiculo: "EFG-901", valor: 71000, estado: "Liquidado" },
    { id: 39, fecha: "2024-02-23", servicio: "Ejecutivo", proveedor: "Rutas del Sur S.A.", vehiculo: "HIJ-234", valor: 100000, estado: "Liquidado" },
    { id: 40, fecha: "2024-02-24", servicio: "Ruta", proveedor: "Transportes Colombia SAS", vehiculo: "KLM-567", valor: 53000, estado: "Liquidado" },
    { id: 41, fecha: "2024-02-25", servicio: "Ejecutivo", proveedor: "Movilidad Express LTDA", vehiculo: "NOP-890", valor: 95000, estado: "Liquidado" },
    { id: 42, fecha: "2024-02-26", servicio: "Ruta", proveedor: "Rutas del Sur S.A.", vehiculo: "QRS-123", valor: 68000, estado: "Liquidado" }
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
            <CardTitle className="text-sm font-medium">Servicios Completados</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">
              +5 este mes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cuentas Generadas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">
              +2 este mes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Formulario de Adjuntar Seguridad Social */}
      <Card>
        <CardHeader>
          <CardTitle>Documentación Requerida</CardTitle>
          <CardDescription>
            Adjunte la seguridad social antes de generar la cuenta de cobro
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="seguridadSocial">Adjuntar Seguridad Social</Label>
              <Input
                id="seguridadSocial"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="cursor-pointer"
              />
              <p className="text-sm text-muted-foreground">
                Formatos permitidos: PDF, JPG, PNG (máx. 5MB)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea 
                id="observaciones"
                placeholder="Ingrese observaciones adicionales..."
                rows={3}
              />
            </div>
          </div>
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
                    <Badge className="bg-green-100 text-green-800 border-green-200">
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
            <Button onClick={() => setShowConfirmDialog(true)}>
              Generar Cuenta de Cobro
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal de confirmación */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Generación de Cuenta de Cobro</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea generar la cuenta de cobro con los servicios seleccionados? 
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Resumen:</h4>
              <div className="space-y-1 text-sm">
                <p>• Servicios liquidados: {serviciosFiltrados.length}</p>
                <p>• Total a facturar: ${serviciosFiltrados
                  .reduce((sum, s) => sum + s.valor, 0)
                  .toLocaleString()}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              setShowConfirmDialog(false);
              toast({
                title: "Cuenta de Cobro Generada",
                description: "La cuenta de cobro ha sido generada exitosamente.",
              });
            }}>
              Confirmar Generación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}