import { useState } from "react"
import { Eye, CheckCircle, XCircle, AlertTriangle, Calendar, Building2 } from "lucide-react"
import { DataTable } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Datos de ejemplo
const cuentasCobro = [
  {
    id: 1,
    numero: "CC-2024-001",
    proveedor: "Tecnología Avanzada S.A.S",
    fecha_recepcion: "2024-01-15",
    fecha_vencimiento: "2024-02-15",
    valor_total: 2500000,
    estado: "pendiente",
    servicios: [
      { descripcion: "Desarrollo de software", valor: 2000000, estado: "pendiente" },
      { descripcion: "Soporte técnico", valor: 500000, estado: "pendiente" }
    ]
  },
  {
    id: 2,
    numero: "CC-2024-002",
    proveedor: "Servicios Integrales LTDA",
    fecha_recepcion: "2024-01-16",
    fecha_vencimiento: "2024-02-16",
    valor_total: 1800000,
    estado: "en_proceso",
    servicios: [
      { descripcion: "Consultoría", valor: 1800000, estado: "aprobado" }
    ]
  },
  {
    id: 3,
    numero: "CC-2024-003",
    proveedor: "Construcciones ABC",
    fecha_recepcion: "2024-01-17",
    fecha_vencimiento: "2024-02-17",
    valor_total: 5200000,
    estado: "rechazado",
    servicios: [
      { descripcion: "Obras civiles", valor: 4000000, estado: "rechazado" },
      { descripcion: "Materiales", valor: 1200000, estado: "pendiente" }
    ]
  }
]

const columns = [
  { key: "numero", label: "No. Cuenta", sortable: true },
  { key: "proveedor", label: "Proveedor", sortable: true },
  { key: "fecha_recepcion", label: "Fecha Recepción", sortable: true },
  { key: "fecha_vencimiento", label: "Vencimiento", sortable: true },
  { key: "valor_total", label: "Valor Total", sortable: true },
  { key: "estado", label: "Estado", sortable: true }
]

export default function PagosPorPreparar() {
  const [selectedCuenta, setSelectedCuenta] = useState<any>(null)
  const [mesSeleccionado, setMesSeleccionado] = useState("2024-01")
  
  const filteredData = cuentasCobro.filter(cuenta => {
    const fechaMes = cuenta.fecha_recepcion.substring(0, 7)
    return fechaMes === mesSeleccionado
  })

  const totalPorEstado = {
    pendiente: filteredData.filter(c => c.estado === 'pendiente').reduce((sum, c) => sum + c.valor_total, 0),
    en_proceso: filteredData.filter(c => c.estado === 'en_proceso').reduce((sum, c) => sum + c.valor_total, 0),
    rechazado: filteredData.filter(c => c.estado === 'rechazado').reduce((sum, c) => sum + c.valor_total, 0)
  }

  const handleApproveService = (cuentaId: number, serviceIndex: number) => {
    // Implementar lógica de aprobación
    console.log(`Aprobar servicio ${serviceIndex} de cuenta ${cuentaId}`)
  }

  const handleRejectService = (cuentaId: number, serviceIndex: number) => {
    // Implementar lógica de rechazo
    console.log(`Rechazar servicio ${serviceIndex} de cuenta ${cuentaId}`)
  }

  const handleSendForApproval = (cuentaId: number) => {
    // Implementar lógica para enviar para aprobación
    console.log(`Enviar cuenta ${cuentaId} para aprobación`)
  }

  const handleRejectCuenta = (cuentaId: number) => {
    // Implementar lógica para rechazar cuenta
    console.log(`Rechazar cuenta ${cuentaId}`)
  }

  const actions = (row: any) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setSelectedCuenta(row)}
        >
          <Eye className="h-4 w-4 mr-2" />
          Ver Detalle
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Detalle de Cuenta de Cobro - {selectedCuenta?.numero}
          </DialogTitle>
        </DialogHeader>
        
        {selectedCuenta && (
          <div className="space-y-6">
            {/* Información General */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información General</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Proveedor</p>
                  <p className="font-medium">{selectedCuenta.proveedor}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <Badge variant={
                    selectedCuenta.estado === 'pendiente' ? 'pending-light' :
                    selectedCuenta.estado === 'aprobado' ? 'success-light' :
                    selectedCuenta.estado === 'en_proceso' ? 'warning-light' : 'destructive'
                  }>
                    {selectedCuenta.estado === 'pendiente' ? 'Pendiente' :
                     selectedCuenta.estado === 'aprobado' ? 'Aprobado' :
                     selectedCuenta.estado === 'en_proceso' ? 'En Proceso' : 'Rechazado'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fecha Recepción</p>
                  <p className="font-medium">{new Date(selectedCuenta.fecha_recepcion).toLocaleDateString('es-CO')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fecha Vencimiento</p>
                  <p className="font-medium">{new Date(selectedCuenta.fecha_vencimiento).toLocaleDateString('es-CO')}</p>
                </div>
              </CardContent>
            </Card>

            {/* Servicios */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Servicios Asociados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedCuenta.servicios.map((servicio: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium">{servicio.descripcion}</h4>
                          <p className="text-lg font-semibold text-primary">
                            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(servicio.valor)}
                          </p>
                        </div>
                        <Badge variant={
                          servicio.estado === 'pendiente' ? 'pending-light' :
                          servicio.estado === 'aprobado' ? 'success-light' : 'destructive'
                        }>
                          {servicio.estado === 'pendiente' ? 'Pendiente' :
                           servicio.estado === 'aprobado' ? 'Aprobado' : 'Rechazado'}
                        </Badge>
                      </div>
                      
                      {servicio.estado === 'pendiente' && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="success"
                            onClick={() => handleApproveService(selectedCuenta.id, index)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Aprobar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleRejectService(selectedCuenta.id, index)}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Rechazar
                          </Button>
                          <Button size="sm" variant="warning">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Corregir
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Total</p>
                    <p className="text-2xl font-bold text-primary">
                      {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedCuenta.valor_total)}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="success"
                      onClick={() => handleSendForApproval(selectedCuenta.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Enviar para Aprobación
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => handleRejectCuenta(selectedCuenta.id)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Rechazar Cuenta
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )

  const summary = (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Mes Seleccionado</p>
              <Select value={mesSeleccionado} onValueChange={setMesSeleccionado}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-01">Enero 2024</SelectItem>
                  <SelectItem value="2024-02">Febrero 2024</SelectItem>
                  <SelectItem value="2024-03">Marzo 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Pendientes</p>
          <p className="text-xl font-semibold text-pending">
            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(totalPorEstado.pendiente)}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">En Proceso</p>
          <p className="text-xl font-semibold text-warning">
            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(totalPorEstado.en_proceso)}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Rechazadas</p>
          <p className="text-xl font-semibold text-destructive">
            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(totalPorEstado.rechazado)}
          </p>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pagos por Preparar</h1>
        <p className="text-muted-foreground">Gestiona las cuentas de cobro enviadas por los proveedores</p>
      </div>

      <DataTable
        title="Cuentas de Cobro por Preparar"
        columns={columns}
        data={filteredData}
        actions={actions}
        summary={summary}
      />
    </div>
  )
}