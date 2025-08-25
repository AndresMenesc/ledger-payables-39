import { useState } from "react"
import { Eye, CheckCircle, XCircle, Package, AlertTriangle } from "lucide-react"
import { DataTable } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Datos de ejemplo - servicios de transporte
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
      { 
        numero: "CC-2024-001", 
        proveedor: "TRANSPORTES BOGOTÁ EXPRESS S.A.S", 
        valor: 2500000, 
        descuentos: 0,
        servicios: [
          {
            id: "SRV-001",
            descripcion: "Transporte ejecutivo Bogotá-Medellín",
            valor: 1800000,
            ruta: "Bogotá → Medellín",
            vehiculo: "Toyota Prado 2023 - ABC123",
            fecha: "2024-01-20",
            estado: "completado"
          },
          {
            id: "SRV-002",
            descripcion: "Servicio de regreso Medellín-Bogotá",
            valor: 700000,
            ruta: "Medellín → Bogotá",
            vehiculo: "Toyota Prado 2023 - ABC123",
            fecha: "2024-01-21",
            estado: "completado"
          }
        ]
      },
      { 
        numero: "CC-2024-002", 
        proveedor: "FLOTA NACIONAL DE CARGA LTDA", 
        valor: 1800000, 
        descuentos: 100000,
        servicios: [
          {
            id: "SRV-003",
            descripcion: "Transporte de carga Bogotá-Cali",
            valor: 1800000,
            ruta: "Bogotá → Cali",
            vehiculo: "Camión Volvo FH 2022 - XYZ789",
            fecha: "2024-01-22",
            estado: "completado",
            carga: "Equipos industriales - 15 toneladas"
          }
        ]
      },
      { 
        numero: "CC-2024-004", 
        proveedor: "SERVITAXIS EMPRESARIALES SAS", 
        valor: 4200000, 
        descuentos: 0,
        servicios: [
          {
            id: "SRV-004",
            descripcion: "Servicios de taxi corporativo",
            valor: 4200000,
            ruta: "Múltiples destinos zona empresarial",
            vehiculo: "Flota Chevrolet Spark GT 2023",
            fecha: "2024-01-23",
            estado: "completado"
          }
        ]
      }
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
      { 
        numero: "CC-2024-007", 
        proveedor: "TRANSPORTES INTERURBANOS LTDA", 
        valor: 1200000, 
        descuentos: 100000,
        servicios: [
          {
            id: "SRV-005",
            descripcion: "Transporte intermunicipal ejecutivo",
            valor: 1200000,
            ruta: "Bogotá → Bucaramanga",
            vehiculo: "Bus Mercedes Benz 2023 - GHI789",
            fecha: "2024-01-24",
            estado: "completado"
          }
        ]
      },
      { 
        numero: "CC-2024-008", 
        proveedor: "LOGÍSTICA Y TRANSPORTE ABC", 
        valor: 2000000, 
        descuentos: 0,
        servicios: [
          {
            id: "SRV-006",
            descripcion: "Distribución urbana y logística",
            valor: 2000000,
            ruta: "Centro → Zona Industrial",
            vehiculo: "Camión NPR 2022 - JKL456",
            fecha: "2024-01-25",
            estado: "completado"
          }
        ]
      }
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
    motivo_rechazo: "Documentación incompleta en servicios de transporte",
    cuentas: [
      { 
        numero: "CC-2024-009", 
        proveedor: "TRANSPORTE DE MATERIALES XYZ", 
        valor: 1500000, 
        descuentos: 0,
        servicios: [
          {
            id: "SRV-007",
            descripcion: "Transporte de materiales de construcción",
            valor: 1500000,
            ruta: "Planta → Obra Zona Norte",
            vehiculo: "Volqueta Kenworth 2022 - MNO123",
            fecha: "2024-01-23",
            estado: "pendiente_documentacion"
          }
        ]
      }
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
  const [showDetail, setShowDetail] = useState(false)
  const [selectedCuentaDetail, setSelectedCuentaDetail] = useState<any>(null)
  const [showCuentaDetail, setShowCuentaDetail] = useState(false)

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
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => {
          setSelectedLote(row)
          setShowDetail(true)
        }}
      >
        <Eye className="h-4 w-4 mr-2" />
        Ver Detalle
      </Button>
      
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

  // Lista principal
  if (!showDetail && !showCuentaDetail) {
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

  // Vista de detalle
  if (showDetail && selectedLote) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setShowDetail(false)
              setSelectedLote(null)
            }}
          >
            ← Volver a Lista
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Lote para Aprobación: {selectedLote.numero}</h1>
            <p className="text-muted-foreground">Enviado por {selectedLote.enviado_por} • {new Date(selectedLote.fecha_envio).toLocaleDateString('es-CO')}</p>
          </div>
        </div>

        {/* Información del Lote */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Información del Lote
            </CardTitle>
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
                    <div className="flex-1">
                      <h4 className="font-medium">{cuenta.numero}</h4>
                      <p className="text-sm text-muted-foreground">{cuenta.proveedor}</p>
                      {cuenta.servicios && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {cuenta.servicios.length} servicio{cuenta.servicios.length !== 1 ? 's' : ''} de transporte
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
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
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCuentaDetail(cuenta)
                          setShowDetail(false)
                          setShowCuentaDetail(true)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Servicios
                      </Button>
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
    )
  }

  // Vista de detalle de cuenta de cobro
  if (showCuentaDetail && selectedCuentaDetail) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setShowCuentaDetail(false)
              setSelectedCuentaDetail(null)
              setShowDetail(true)
            }}
          >
            ← Volver al Lote
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Servicios de Transporte: {selectedCuentaDetail.numero}</h1>
            <p className="text-muted-foreground">{selectedCuentaDetail.proveedor}</p>
          </div>
        </div>

        {/* Información de la cuenta */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen de la Cuenta de Cobro</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Proveedor</p>
              <p className="font-medium">{selectedCuentaDetail.proveedor}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Servicios</p>
              <p className="font-medium">{selectedCuentaDetail.servicios?.length || 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valor Total</p>
              <p className="text-xl font-bold text-primary">
                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedCuentaDetail.valor)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Servicios de Transporte */}
        <Card>
          <CardHeader>
            <CardTitle>Servicios de Transporte Detallados</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedCuentaDetail.servicios && selectedCuentaDetail.servicios.length > 0 ? (
              <div className="space-y-4">
                {selectedCuentaDetail.servicios.map((servicio: any, index: number) => (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-1">{servicio.descripcion}</h4>
                          <p className="text-xl font-bold text-primary">
                            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(servicio.valor)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="success-light">
                            {servicio.id}
                          </Badge>
                          <Badge variant={
                            servicio.estado === 'completado' ? 'success' :
                            servicio.estado === 'pendiente_documentacion' ? 'warning' : 'pending'
                          }>
                            {servicio.estado === 'completado' ? 'Completado' :
                             servicio.estado === 'pendiente_documentacion' ? 'Pendiente Doc.' : 'Pendiente'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/30 p-3 rounded-lg">
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Fecha del Servicio</p>
                            <p className="font-medium">{new Date(servicio.fecha).toLocaleDateString('es-CO')}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Ruta</p>
                            <p className="font-medium">{servicio.ruta}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Vehículo</p>
                            <p className="font-medium">{servicio.vehiculo}</p>
                          </div>
                          {servicio.carga && (
                            <div>
                              <p className="text-xs text-muted-foreground">Carga</p>
                              <p className="font-medium">{servicio.carga}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Estado</p>
                            <Badge variant={
                              servicio.estado === 'completado' ? 'success' :
                              servicio.estado === 'pendiente_documentacion' ? 'warning' : 'pending'
                            }>
                              {servicio.estado === 'completado' ? 'Servicio Completado' :
                               servicio.estado === 'pendiente_documentacion' ? 'Documentación Pendiente' : 'En Proceso'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {/* Resumen financiero de servicios */}
                <Card className="bg-accent/50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium">Total de Servicios:</span>
                      <span className="text-2xl font-bold text-primary">
                        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(
                          selectedCuentaDetail.servicios.reduce((sum: number, s: any) => sum + s.valor, 0)
                        )}
                      </span>
                    </div>
                    
                    {selectedCuentaDetail.descuentos > 0 && (
                      <>
                        <Separator className="my-2" />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Descuentos aplicados:</span>
                          <span className="text-lg font-medium text-destructive">
                            -{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedCuentaDetail.descuentos)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-lg font-bold">Total neto a pagar:</span>
                          <span className="text-2xl font-bold text-success">
                            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedCuentaDetail.valor - selectedCuentaDetail.descuentos)}
                          </span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <p className="text-muted-foreground">No hay servicios asociados a esta cuenta de cobro.</p>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}