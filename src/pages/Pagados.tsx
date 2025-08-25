
import { useState } from "react"
import { Eye, Download, Calendar, DollarSign, ArrowLeft, Truck, MapPin, Clock, Package } from "lucide-react"
import { DataTable } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Datos de ejemplo - servicios de transporte
const lotesPagados = [
  {
    id: 1,
    numero: "LP-2024-001",
    fecha_aprobacion: "2024-01-28",
    fecha_pago: "2024-01-30",
    total_cuentas: 3,
    valor_bruto: 8500000,
    descuentos_totales: 100000,
    valor_neto: 8400000,
    aprobado_por: "Director Financiero",
    pagado_por: "Tesorería",
    cuentas: [
      { 
        numero: "CC-2024-001", 
        proveedor: "TRANSPORTES BOGOTÁ EXPRESS S.A.S", 
        valor: 2500000, 
        descuentos: 0, 
        valor_pagado: 2500000,
        servicios: [
          {
            id: "SRV-001",
            descripcion: "Transporte ejecutivo Bogotá-Medellín",
            valor: 1800000,
            ruta: "Bogotá → Medellín",
            vehiculo: "Toyota Prado 2023 - ABC123",
            fecha: "2024-01-20",
            estado: "pagado"
          },
          {
            id: "SRV-002",
            descripcion: "Servicio de regreso Medellín-Bogotá",
            valor: 700000,
            ruta: "Medellín → Bogotá",
            vehiculo: "Toyota Prado 2023 - ABC123",
            fecha: "2024-01-21",
            estado: "pagado"
          }
        ]
      },
      { 
        numero: "CC-2024-002", 
        proveedor: "FLOTA NACIONAL DE CARGA LTDA", 
        valor: 1800000, 
        descuentos: 100000, 
        valor_pagado: 1700000,
        servicios: [
          {
            id: "SRV-003",
            descripcion: "Transporte de carga Bogotá-Cali",
            valor: 1800000,
            ruta: "Bogotá → Cali",
            vehiculo: "Camión Volvo FH 2022 - XYZ789",
            fecha: "2024-01-22",
            estado: "pagado",
            carga: "Equipos industriales - 15 toneladas"
          }
        ]
      },
      { 
        numero: "CC-2024-004", 
        proveedor: "SERVITAXIS EMPRESARIALES SAS", 
        valor: 4200000, 
        descuentos: 0, 
        valor_pagado: 4200000,
        servicios: [
          {
            id: "SRV-004",
            descripcion: "Servicios de taxi corporativo",
            valor: 4200000,
            ruta: "Múltiples destinos zona empresarial",
            vehiculo: "Flota Chevrolet Spark GT 2023",
            fecha: "2024-01-23",
            estado: "pagado"
          }
        ]
      }
    ]
  }
]

const columns = [
  { key: "numero", label: "No. Lote", sortable: true },
  { key: "fecha_pago", label: "Fecha Pago", sortable: true },
  { key: "total_cuentas", label: "Cuentas", sortable: true },
  { key: "valor_bruto", label: "Valor Bruto", sortable: true },
  { key: "valor_neto", label: "Valor Pagado", sortable: true },
  { key: "pagado_por", label: "Pagado Por", sortable: true }
]

export default function Pagados() {
  const [selectedLote, setSelectedLote] = useState<any>(null)
  const [selectedCuenta, setSelectedCuenta] = useState<any>(null)
  const [currentView, setCurrentView] = useState<'list' | 'lote-detail' | 'cuenta-detail'>('list')
  const [mesSeleccionado, setMesSeleccionado] = useState("2024-01")

  const filteredData = lotesPagados.filter(lote => {
    const fechaMes = lote.fecha_pago.substring(0, 7)
    return fechaMes === mesSeleccionado
  })

  const handleDownloadReport = (loteId: number) => {
    console.log(`Descargar reporte del lote ${loteId}`)
  }

  const handleVerCuentaDetalle = (cuenta: any) => {
    setSelectedCuenta(cuenta)
    setCurrentView('cuenta-detail')
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
      
      <Button 
        size="sm"
        variant="outline"
        onClick={() => handleDownloadReport(row.id)}
      >
        <Download className="h-4 w-4 mr-2" />
        Reporte
      </Button>
    </div>
  )

  const totalBruto = filteredData.reduce((sum, lote) => sum + lote.valor_bruto, 0)
  const totalDescuentos = filteredData.reduce((sum, lote) => sum + lote.descuentos_totales, 0)
  const totalPagado = filteredData.reduce((sum, lote) => sum + lote.valor_neto, 0)

  const summary = (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Mes</p>
              <Select value={mesSeleccionado} onValueChange={setMesSeleccionado}>
                <SelectTrigger className="w-32">
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
          <p className="text-sm text-muted-foreground">Total Bruto</p>
          <p className="text-xl font-semibold">
            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(totalBruto)}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Descuentos</p>
          <p className="text-xl font-semibold text-destructive">
            -{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(totalDescuentos)}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Total Pagado</p>
          <p className="text-xl font-semibold text-success">
            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(totalPagado)}
          </p>
        </CardContent>
      </Card>
    </div>
  )

  // Lista principal
  if (currentView === 'list') {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pagos Realizados</h1>
          <p className="text-muted-foreground">Historial de lotes de pagos ya procesados</p>
        </div>

        <DataTable
          title="Lotes Pagados"
          columns={columns}
          data={filteredData}
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
            <h1 className="text-2xl font-bold text-foreground">Lote Pagado: {selectedLote.numero}</h1>
            <p className="text-muted-foreground">Pagado por {selectedLote.pagado_por} • {new Date(selectedLote.fecha_pago).toLocaleDateString('es-CO')}</p>
          </div>
        </div>

        {/* Información del Lote Pagado */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Información del Pago
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Fecha Aprobación</p>
              <p className="font-medium">{new Date(selectedLote.fecha_aprobacion).toLocaleDateString('es-CO')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fecha Pago</p>
              <p className="font-medium">{new Date(selectedLote.fecha_pago).toLocaleDateString('es-CO')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estado</p>
              <Badge variant="success">Pagado</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Aprobado Por</p>
              <p className="font-medium">{selectedLote.aprobado_por}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pagado Por</p>
              <p className="font-medium">{selectedLote.pagado_por}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Cuentas</p>
              <p className="font-medium">{selectedLote.total_cuentas}</p>
            </div>
          </CardContent>
        </Card>

        {/* Resumen Financiero */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumen Financiero</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-accent/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Valor Bruto</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedLote.valor_bruto)}
                </p>
              </div>
              
              <div className="text-center p-4 bg-destructive/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Descuentos Aplicados</p>
                <p className="text-2xl font-bold text-destructive">
                  -{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedLote.descuentos_totales)}
                </p>
              </div>
              
              <div className="text-center p-4 bg-success/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Valor Pagado</p>
                <p className="text-2xl font-bold text-success">
                  {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedLote.valor_neto)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detalle de Cuentas Pagadas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cuentas Pagadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedLote.cuentas.map((cuenta: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-accent/20 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{cuenta.numero}</h4>
                      <p className="text-sm text-muted-foreground">{cuenta.proveedor}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="success">Pagado</Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleVerCuentaDetalle(cuenta)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalle
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Valor Original</p>
                      <p className="font-medium">
                        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(cuenta.valor)}
                      </p>
                    </div>
                    
                    {cuenta.descuentos > 0 && (
                      <div>
                        <p className="text-muted-foreground">Descuentos</p>
                        <p className="font-medium text-destructive">
                          -{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(cuenta.descuentos)}
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-muted-foreground">Valor Pagado</p>
                      <p className="font-medium text-success">
                        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(cuenta.valor_pagado)}
                      </p>
                    </div>
                  </div>
                  
                  {cuenta.servicios && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm text-muted-foreground">
                        {cuenta.servicios.length} servicio(s) de transporte incluido(s)
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <Separator className="my-6" />
            
            <div className="flex justify-end">
              <Button 
                onClick={() => handleDownloadReport(selectedLote.id)}
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar Reporte de Pago
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Vista de detalle de la cuenta individual
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
              <Badge variant="success">Pagado</Badge>
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
                <p className="text-sm text-muted-foreground">Valor Pagado</p>
                <p className="text-2xl font-bold text-success">
                  {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedCuenta.valor_pagado)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

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
                        <Badge variant="success">{servicio.estado}</Badge>
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
            <Download className="h-4 w-4 mr-2" />
            Descargar Cuenta
          </Button>
        </div>
      </div>
    )
  }

  return null
}
