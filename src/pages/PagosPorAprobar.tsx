import { useState } from "react"
import { Eye, CheckCircle, XCircle, Package, AlertTriangle } from "lucide-react"
import { DataTable } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Datos de ejemplo
const lotesPendientesAprobacion = [
  {
    id: 1,
    numero: "LP-2024-001",
    fecha_envio: "2024-01-25",
    estado: "pendiente_aprobacion",
    total_cuentas: 3,
    valor_total: 8500000,
    enviado_por: "María González",
    cuentas: [
      { numero: "CC-2024-001", proveedor: "Tecnología Avanzada S.A.S", valor: 2500000, descuentos: 0 },
      { numero: "CC-2024-002", proveedor: "Servicios Integrales LTDA", valor: 1800000, descuentos: 100000 },
      { numero: "CC-2024-004", proveedor: "Consultoría Pro", valor: 4200000, descuentos: 0 }
    ]
  },
  {
    id: 2,
    numero: "LP-2024-003",
    fecha_envio: "2024-01-26",
    estado: "pendiente_aprobacion",
    total_cuentas: 2,
    valor_total: 3200000,
    enviado_por: "Carlos Ramírez",
    cuentas: [
      { numero: "CC-2024-007", proveedor: "Servicios Generales", valor: 1200000, descuentos: 100000 },
      { numero: "CC-2024-008", proveedor: "Mantenimiento Pro", valor: 2000000, descuentos: 0 }
    ]
  },
  {
    id: 3,
    numero: "LP-2024-004",
    fecha_envio: "2024-01-24",
    estado: "rechazado",
    total_cuentas: 1,
    valor_total: 1500000,
    enviado_por: "Ana Torres",
    motivo_rechazo: "Documentación incompleta en la cuenta CC-2024-009",
    cuentas: [
      { numero: "CC-2024-009", proveedor: "Construcciones XYZ", valor: 1500000, descuentos: 0 }
    ]
  }
]

const columns = [
  { key: "numero", label: "No. Lote", sortable: true },
  { key: "fecha_envio", label: "Fecha Envío", sortable: true },
  { key: "enviado_por", label: "Enviado Por", sortable: true },
  { key: "total_cuentas", label: "Cuentas", sortable: true },
  { key: "valor_total", label: "Valor Total", sortable: true },
  { key: "estado", label: "Estado", sortable: true }
]

export default function PagosPorAprobar() {
  const [selectedLote, setSelectedLote] = useState<any>(null)

  const handleApproveLote = (loteId: number) => {
    // Implementar lógica para aprobar lote
    console.log(`Aprobar lote ${loteId}`)
  }

  const handleRejectLote = (loteId: number) => {
    // Implementar lógica para rechazar lote
    console.log(`Rechazar lote ${loteId}`)
  }

  const actions = (row: any) => (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedLote(row)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalle
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Lote para Aprobación - {selectedLote?.numero}
            </DialogTitle>
          </DialogHeader>
          
          {selectedLote && (
            <div className="space-y-6">
              {/* Información del Lote */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información del Lote</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha Envío</p>
                    <p className="font-medium">{new Date(selectedLote.fecha_envio).toLocaleDateString('es-CO')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Enviado Por</p>
                    <p className="font-medium">{selectedLote.enviado_por}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Cuentas</p>
                    <p className="font-medium">{selectedLote.total_cuentas}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estado</p>
                    <Badge variant={
                      selectedLote.estado === 'pendiente_aprobacion' ? 'warning-light' :
                      selectedLote.estado === 'aprobado' ? 'success-light' : 'destructive'
                    }>
                      {selectedLote.estado === 'pendiente_aprobacion' ? 'Pendiente Aprobación' :
                       selectedLote.estado === 'aprobado' ? 'Aprobado' : 'Rechazado'}
                    </Badge>
                  </div>
                </CardContent>
                
                {selectedLote.motivo_rechazo && (
                  <CardContent className="pt-0">
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        <h4 className="font-medium text-destructive">Motivo de Rechazo</h4>
                      </div>
                      <p className="text-sm">{selectedLote.motivo_rechazo}</p>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Cuentas en el Lote */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cuentas de Cobro</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedLote.cuentas.map((cuenta: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{cuenta.numero}</h4>
                            <p className="text-sm text-muted-foreground">{cuenta.proveedor}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-primary">
                              {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(cuenta.valor)}
                            </p>
                            {cuenta.descuentos > 0 && (
                              <p className="text-sm text-destructive">
                                Descuentos: -{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(cuenta.descuentos)}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {cuenta.descuentos > 0 && (
                          <div className="bg-warning/10 border border-warning/20 rounded p-3 mt-3">
                            <p className="text-sm">
                              <strong>Total a pagar:</strong> {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(cuenta.valor - cuenta.descuentos)}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-lg">
                      <span>Valor Bruto Total:</span>
                      <span className="font-semibold">
                        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedLote.valor_total)}
                      </span>
                    </div>
                    
                    {selectedLote.cuentas.some((c: any) => c.descuentos > 0) && (
                      <div className="flex justify-between text-destructive">
                        <span>Descuentos Totales:</span>
                        <span className="font-semibold">
                          -{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(
                            selectedLote.cuentas.reduce((sum: number, c: any) => sum + c.descuentos, 0)
                          )}
                        </span>
                      </div>
                    )}
                    
                    <Separator />
                    
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total a Pagar:</span>
                      <span className="text-primary">
                        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(
                          selectedLote.valor_total - selectedLote.cuentas.reduce((sum: number, c: any) => sum + c.descuentos, 0)
                        )}
                      </span>
                    </div>
                  </div>
                  
                  {selectedLote.estado === 'pendiente_aprobacion' && (
                    <div className="flex gap-2 mt-6">
                      <Button 
                        variant="success"
                        onClick={() => handleApproveLote(selectedLote.id)}
                        className="flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aprobar Lote
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => handleRejectLote(selectedLote.id)}
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rechazar Lote
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {row.estado === 'pendiente_aprobacion' && (
        <>
          <Button 
            size="sm"
            variant="success"
            onClick={() => handleApproveLote(row.id)}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Aprobar
          </Button>
          <Button 
            size="sm"
            variant="destructive"
            onClick={() => handleRejectLote(row.id)}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Rechazar
          </Button>
        </>
      )}
    </div>
  )

  const pendientesAprobacion = lotesPendientesAprobacion.filter(l => l.estado === 'pendiente_aprobacion')
  const rechazados = lotesPendientesAprobacion.filter(l => l.estado === 'rechazado')
  
  const valorTotalPendiente = pendientesAprobacion.reduce((sum, lote) => sum + lote.valor_total, 0)

  const summary = (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Lotes Pendientes</p>
          <p className="text-2xl font-semibold text-warning">{pendientesAprobacion.length}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Valor Pendiente</p>
          <p className="text-xl font-semibold text-primary">
            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(valorTotalPendiente)}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Lotes Rechazados</p>
          <p className="text-2xl font-semibold text-destructive">{rechazados.length}</p>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pagos por Aprobar</h1>
        <p className="text-muted-foreground">Revisa y aprueba los lotes de pagos enviados</p>
      </div>

      <DataTable
        title="Lotes Pendientes de Aprobación"
        columns={columns}
        data={lotesPendientesAprobacion}
        actions={actions}
        summary={summary}
      />
    </div>
  )
}