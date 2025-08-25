import { useState } from "react"
import { Eye, CheckCircle, XCircle, Package, AlertTriangle, ArrowLeft, Truck, MapPin, Clock, DollarSign, AlertCircle, CreditCard, Receipt } from "lucide-react"
import { DataTable } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Datos de ejemplo - servicios de transporte con descuentos y préstamos detallados
const lotesPendientesAprobacion = [
  {
    id: 1,
    numero: "LP-2024-001",
    fecha_envio: "2024-01-25",
    estado: "pendiente_aprobacion",
    total_cuentas: 3,
    valor_total: 9250000,
    enviado_por: "María González",
    cuentas: [
      { 
        numero: "CC-2024-001", 
        proveedor: "TRANSPORTES BOGOTÁ EXPRESS S.A.S", 
        valor: 2500000, 
        descuentos: 125000,
        valor_pagado: 2375000,
        descuentos_detalle: [
          {
            concepto: "Retención en la fuente",
            porcentaje: 4.0,
            valor: 100000,
            tipo: "retencion"
          },
          {
            concepto: "Retención ICA",
            porcentaje: 1.0,
            valor: 25000,
            tipo: "retencion"
          }
        ],
        prestamos: [
          {
            id: "PREST-001",
            concepto: "Anticipo para combustible y peajes",
            valor: 500000,
            fecha_otorgado: "2024-01-15",
            estado: "vigente",
            cuotas_restantes: 1
          }
        ],
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
        valor: 3200000, 
        descuentos: 320000,
        valor_pagado: 2880000,
        descuentos_detalle: [
          {
            concepto: "Retención en la fuente",
            porcentaje: 6.0,
            valor: 192000,
            tipo: "retencion"
          },
          {
            concepto: "Retención ICA",
            porcentaje: 4.0,
            valor: 128000,
            tipo: "retencion"
          }
        ],
        prestamos: [
          {
            id: "PREST-002",
            concepto: "Préstamo para reparación de vehículo",
            valor: 800000,
            fecha_otorgado: "2024-01-10",
            estado: "vigente",
            cuotas_restantes: 2
          }
        ],
        servicios: [
          {
            id: "SRV-003",
            descripcion: "Transporte de carga Bogotá-Cali",
            valor: 3200000,
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
        valor: 3550000, 
        descuentos: 177500,
        valor_pagado: 3372500,
        descuentos_detalle: [
          {
            concepto: "Retención en la fuente",
            porcentaje: 5.0,
            valor: 177500,
            tipo: "retencion"
          }
        ],
        prestamos: [
          {
            id: "PREST-003",
            concepto: "Anticipo servicios enero",
            valor: 600000,
            fecha_otorgado: "2024-01-01",
            estado: "descontado",
            cuotas_restantes: 0
          }
        ],
        servicios: [
          {
            id: "SRV-004",
            descripcion: "Servicios de taxi corporativo",
            valor: 3550000,
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
    valor_total: 4500000,
    enviado_por: "Carlos Ramírez",
    cuentas: [
      { 
        numero: "CC-2024-007", 
        proveedor: "TRANSPORTES INTERURBANOS LTDA", 
        valor: 2200000, 
        descuentos: 220000,
        valor_pagado: 1980000,
        descuentos_detalle: [
          {
            concepto: "Retención en la fuente",
            porcentaje: 6.0,
            valor: 132000,
            tipo: "retencion"
          },
          {
            concepto: "Multa por retraso en servicio",
            porcentaje: 4.0,
            valor: 88000,
            tipo: "multa"
          }
        ],
        prestamos: [],
        servicios: [
          {
            id: "SRV-005",
            descripcion: "Transporte intermunicipal ejecutivo",
            valor: 2200000,
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
        valor: 2300000, 
        descuentos: 115000,
        valor_pagado: 2185000,
        descuentos_detalle: [
          {
            concepto: "Retención en la fuente",
            porcentaje: 5.0,
            valor: 115000,
            tipo: "retencion"
          }
        ],
        prestamos: [
          {
            id: "PREST-004",
            concepto: "Anticipo para gastos operativos",
            valor: 400000,
            fecha_otorgado: "2024-01-20",
            estado: "vigente",
            cuotas_restantes: 1
          }
        ],
        servicios: [
          {
            id: "SRV-006",
            descripcion: "Distribución urbana y logística",
            valor: 2300000,
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
    valor_total: 1800000,
    enviado_por: "Ana Torres",
    motivo_rechazo: "Documentación incompleta - faltan pólizas de seguros actualizadas",
    cuentas: [
      { 
        numero: "CC-2024-009", 
        proveedor: "TRANSPORTE DE MATERIALES XYZ", 
        valor: 1800000, 
        descuentos: 108000,
        valor_pagado: 1692000,
        descuentos_detalle: [
          {
            concepto: "Retención en la fuente",
            porcentaje: 6.0,
            valor: 108000,
            tipo: "retencion"
          }
        ],
        prestamos: [
          {
            id: "PREST-005",
            concepto: "Préstamo para mantenimiento de vehículos",
            valor: 350000,
            fecha_otorgado: "2024-01-18",
            estado: "vigente",
            cuotas_restantes: 3
          }
        ],
        servicios: [
          {
            id: "SRV-007",
            descripcion: "Transporte de materiales de construcción",
            valor: 1800000,
            ruta: "Planta → Obra Zona Norte",
            vehiculo: "Volqueta Kenworth 2022 - MNO123",
            fecha: "2024-01-23",
            estado: "pendiente_documentacion",
            carga: "Materiales de construcción - 20 toneladas"
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
  const [selectedCuenta, setSelectedCuenta] = useState<any>(null)
  const [currentView, setCurrentView] = useState<'list' | 'lote-detail' | 'cuenta-detail'>('list')

  const handleVerCuentaDetalle = (cuenta: any) => {
    setSelectedCuenta(cuenta)
    setCurrentView('cuenta-detail')
  }

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
          setCurrentView('lote-detail')
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
  if (currentView === 'list') {
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

  // Vista de detalle del lote
  if (currentView === 'lote-detail' && selectedLote) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setCurrentView('list')
              setSelectedLote(null)
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Lista
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
                        onClick={() => handleVerCuentaDetalle(cuenta)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalle
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

  // Vista de detalle de cuenta individual
  if (currentView === 'cuenta-detail' && selectedCuenta) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentView('lote-detail')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Lote
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Cuenta: {selectedCuenta.numero}</h1>
            <p className="text-muted-foreground">{selectedCuenta.proveedor}</p>
          </div>
        </div>

        {/* Información de la Cuenta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Información de la Cuenta
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Número de Cuenta</p>
              <p className="font-medium">{selectedCuenta.numero}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Proveedor</p>
              <p className="font-medium">{selectedCuenta.proveedor}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estado</p>
              <Badge variant="warning-light">Pendiente Aprobación</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Servicios</p>
              <p className="font-medium">{selectedCuenta.servicios?.length || 0}</p>
            </div>
          </CardContent>
        </Card>

        {/* Resumen Financiero de la Cuenta */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumen Financiero</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-accent/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Valor Original</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedCuenta.valor)}
                </p>
              </div>
              
              <div className="text-center p-4 bg-destructive/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Descuentos</p>
                <p className="text-2xl font-bold text-destructive">
                  -{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedCuenta.descuentos || 0)}
                </p>
              </div>
              
              <div className="text-center p-4 bg-success/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Valor a Pagar</p>
                <p className="text-2xl font-bold text-success">
                  {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedCuenta.valor_pagado || selectedCuenta.valor)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detalle de Descuentos Aplicados */}
        {selectedCuenta.descuentos_detalle && selectedCuenta.descuentos_detalle.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Detalle de Descuentos Aplicados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedCuenta.descuentos_detalle.map((descuento: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4 bg-destructive/5">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{descuento.concepto}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={
                            descuento.tipo === 'retencion' ? 'secondary' : 
                            descuento.tipo === 'multa' ? 'destructive' : 'outline'
                          }>
                            {descuento.tipo === 'retencion' ? 'Retención' : 
                             descuento.tipo === 'multa' ? 'Multa' : 'Descuento'}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {descuento.porcentaje}%
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg text-destructive">
                          -{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(descuento.valor)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detalle de Préstamos */}
        {selectedCuenta.prestamos && selectedCuenta.prestamos.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Préstamos y Anticipos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedCuenta.prestamos.map((prestamo: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4 bg-blue-50/50">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{prestamo.concepto}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={prestamo.estado === 'vigente' ? 'outline' : 'secondary'}>
                            {prestamo.estado === 'vigente' ? 'Vigente' : 'Descontado'}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Otorgado: {new Date(prestamo.fecha_otorgado).toLocaleDateString('es-CO')}
                          </span>
                          {prestamo.cuotas_restantes > 0 && (
                            <span className="text-sm text-orange-600 font-medium">
                              {prestamo.cuotas_restantes} cuotas restantes
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg text-blue-600">
                          {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(prestamo.valor)}
                        </p>
                        <p className="text-sm text-muted-foreground">ID: {prestamo.id}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detalle de Servicios de Transporte */}
        {selectedCuenta.servicios && selectedCuenta.servicios.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Servicios de Transporte
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedCuenta.servicios.map((servicio: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-lg">{servicio.descripcion}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{servicio.ruta}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">
                          {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(servicio.valor)}
                        </p>
                        <Badge variant={
                          servicio.estado === 'completado' ? 'success' : 
                          servicio.estado === 'pendiente_documentacion' ? 'warning' : 'outline'
                        }>
                          {servicio.estado === 'completado' ? 'Completado' : 
                           servicio.estado === 'pendiente_documentacion' ? 'Pendiente Doc.' : servicio.estado}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Vehículo</p>
                          <p className="font-medium">{servicio.vehiculo}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Fecha</p>
                          <p className="font-medium">{new Date(servicio.fecha).toLocaleDateString('es-CO')}</p>
                        </div>
                      </div>
                      
                      {servicio.carga && (
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground">Carga</p>
                            <p className="font-medium">{servicio.carga}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Acciones */}
        <div className="flex justify-end gap-2">
          <Button variant="outline">
            <Receipt className="h-4 w-4 mr-2" />
            Descargar Cuenta
          </Button>
        </div>
      </div>
    )
  }

  return null
}