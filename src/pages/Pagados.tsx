import { useState } from "react"
import { Eye, Download, Calendar, DollarSign } from "lucide-react"
import { DataTable } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Datos de ejemplo
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
      { numero: "CC-2024-001", proveedor: "Tecnología Avanzada S.A.S", valor: 2500000, descuentos: 0, valor_pagado: 2500000 },
      { numero: "CC-2024-002", proveedor: "Servicios Integrales LTDA", valor: 1800000, descuentos: 100000, valor_pagado: 1700000 },
      { numero: "CC-2024-004", proveedor: "Consultoría Pro", valor: 4200000, descuentos: 0, valor_pagado: 4200000 }
    ]
  },
  {
    id: 2,
    numero: "LP-2024-002",
    fecha_aprobacion: "2024-01-29",
    fecha_pago: "2024-01-31",
    total_cuentas: 2,
    valor_bruto: 3200000,
    descuentos_totales: 50000,
    valor_neto: 3150000,
    aprobado_por: "Director Financiero",
    pagado_por: "Tesorería",
    cuentas: [
      { numero: "CC-2024-007", proveedor: "Servicios Generales", valor: 1200000, descuentos: 50000, valor_pagado: 1150000 },
      { numero: "CC-2024-008", proveedor: "Mantenimiento Pro", valor: 2000000, descuentos: 0, valor_pagado: 2000000 }
    ]
  },
  {
    id: 3,
    numero: "LP-2024-005",
    fecha_aprobacion: "2024-02-01",
    fecha_pago: "2024-02-02",
    total_cuentas: 1,
    valor_bruto: 2800000,
    descuentos_totales: 200000,
    valor_neto: 2600000,
    aprobado_por: "Director Financiero",
    pagado_por: "Tesorería",
    cuentas: [
      { numero: "CC-2024-010", proveedor: "Construcciones XYZ", valor: 2800000, descuentos: 200000, valor_pagado: 2600000 }
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
  const [showDetail, setShowDetail] = useState(false)
  const [mesSeleccionado, setMesSeleccionado] = useState("2024-01")

  const filteredData = lotesPagados.filter(lote => {
    const fechaMes = lote.fecha_pago.substring(0, 7)
    return fechaMes === mesSeleccionado
  })

  const handleDownloadReport = (loteId: number) => {
    // Implementar lógica para descargar reporte
    console.log(`Descargar reporte del lote ${loteId}`)
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
  if (!showDetail) {
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
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{cuenta.numero}</h4>
                      <p className="text-sm text-muted-foreground">{cuenta.proveedor}</p>
                    </div>
                    <Badge variant="success">Pagado</Badge>
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

  return null
}