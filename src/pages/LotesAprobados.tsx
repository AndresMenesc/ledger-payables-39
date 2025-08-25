import { useState } from "react"
import { Eye, Download, Calendar, Search, Building2 } from "lucide-react"
import { DataTable } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { addDays, format } from "date-fns"
import { DateRange } from "react-day-picker"

// Datos de ejemplo
const lotesAprobados = [
  {
    id: 1,
    numero: "LP-2024-001",
    fecha_aprobacion: "2024-01-28",
    fecha_pago: "2024-01-30",
    total_cuentas: 3,
    valor_bruto: 8500000,
    descuentos_totales: 100000,
    valor_neto: 8400000,
    estado: "pagado",
    aprobado_por: "Director Financiero",
    proveedores: ["Tecnología Avanzada S.A.S", "Servicios Integrales LTDA", "Consultoría Pro"],
    cuentas: [
      { numero: "CC-2024-001", proveedor: "Tecnología Avanzada S.A.S", valor: 2500000, descuentos: 0 },
      { numero: "CC-2024-002", proveedor: "Servicios Integrales LTDA", valor: 1800000, descuentos: 100000 },
      { numero: "CC-2024-004", proveedor: "Consultoría Pro", valor: 4200000, descuentos: 0 }
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
    estado: "pagado",
    aprobado_por: "Director Financiero",
    proveedores: ["Servicios Generales", "Mantenimiento Pro"],
    cuentas: [
      { numero: "CC-2024-007", proveedor: "Servicios Generales", valor: 1200000, descuentos: 50000 },
      { numero: "CC-2024-008", proveedor: "Mantenimiento Pro", valor: 2000000, descuentos: 0 }
    ]
  },
  {
    id: 3,
    numero: "LP-2024-003",
    fecha_aprobacion: "2024-02-01",
    fecha_pago: null,
    total_cuentas: 4,
    valor_bruto: 6800000,
    descuentos_totales: 150000,
    valor_neto: 6650000,
    estado: "aprobado",
    aprobado_por: "Director Financiero",
    proveedores: ["Construcciones XYZ", "Materiales ABC", "Transporte Ejecutivo", "Consultoría Digital"],
    cuentas: [
      { numero: "CC-2024-010", proveedor: "Construcciones XYZ", valor: 2800000, descuentos: 100000 },
      { numero: "CC-2024-011", proveedor: "Materiales ABC", valor: 1500000, descuentos: 50000 },
      { numero: "CC-2024-012", proveedor: "Transporte Ejecutivo", valor: 1200000, descuentos: 0 },
      { numero: "CC-2024-013", proveedor: "Consultoría Digital", valor: 1300000, descuentos: 0 }
    ]
  }
]

const columns = [
  { key: "numero", label: "No. Lote", sortable: true },
  { key: "fecha_aprobacion", label: "Fecha Aprobación", sortable: true },
  { key: "fecha_pago", label: "Fecha Pago", sortable: true },
  { key: "total_cuentas", label: "Cuentas", sortable: true },
  { key: "valor_neto", label: "Valor Total", sortable: true },
  { key: "estado", label: "Estado", sortable: true }
]

export default function LotesAprobados() {
  const [selectedLote, setSelectedLote] = useState<any>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [filtroProveedor, setFiltroProveedor] = useState("todos")
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [busqueda, setBusqueda] = useState("")
  const [fechaRange, setFechaRange] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: addDays(new Date(), 30),
  })

  // Obtener lista única de proveedores para el filtro
  const proveedoresUnicos = Array.from(new Set(
    lotesAprobados.flatMap(lote => lote.proveedores)
  )).sort()

  // Filtrar datos según los criterios seleccionados
  const filteredData = lotesAprobados.filter(lote => {
    const matchesProveedor = filtroProveedor === "todos" || lote.proveedores.includes(filtroProveedor)
    const matchesEstado = filtroEstado === "todos" || lote.estado === filtroEstado
    const matchesBusqueda = !busqueda || 
      lote.numero.toLowerCase().includes(busqueda.toLowerCase()) ||
      lote.proveedores.some(p => p.toLowerCase().includes(busqueda.toLowerCase()))
    
    let matchesFecha = true
    if (fechaRange?.from && fechaRange?.to) {
      const fechaLote = new Date(lote.fecha_aprobacion)
      matchesFecha = fechaLote >= fechaRange.from && fechaLote <= fechaRange.to
    }
    
    return matchesProveedor && matchesEstado && matchesBusqueda && matchesFecha
  })

  const handleDownloadReport = (loteId: number) => {
    // Implementar lógica para descargar reporte
    console.log(`Descargar reporte del lote ${loteId}`)
  }

  const renderCell = (key: string, value: any, row: any) => {
    if (key === 'estado') {
      return (
        <Badge variant={value === 'pagado' ? 'success' : 'success-light'}>
          {value === 'pagado' ? 'Pagado' : 'Aprobado'}
        </Badge>
      )
    }
    if (key === 'fecha_pago') {
      return value ? new Date(value).toLocaleDateString('es-CO') : 'Pendiente'
    }
    if (key === 'fecha_aprobacion') {
      return new Date(value).toLocaleDateString('es-CO')
    }
    if (key === 'valor_neto') {
      return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value)
    }
    return value
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
  const totalNeto = filteredData.reduce((sum, lote) => sum + lote.valor_neto, 0)
  const lotesPagados = filteredData.filter(l => l.estado === 'pagado').length

  const summary = (
    <div className="space-y-4">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros de Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="No. lote o proveedor..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Proveedor</label>
              <Select value={filtroProveedor} onValueChange={setFiltroProveedor}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los proveedores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los proveedores</SelectItem>
                  {proveedoresUnicos.map((proveedor) => (
                    <SelectItem key={proveedor} value={proveedor}>
                      {proveedor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Estado</label>
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="aprobado">Aprobado</SelectItem>
                  <SelectItem value="pagado">Pagado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Rango de Fechas</label>
              <DatePickerWithRange
                date={fechaRange}
                onDateChange={setFechaRange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Lotes Encontrados</p>
            <p className="text-2xl font-semibold">{filteredData.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Valor Bruto</p>
            <p className="text-xl font-semibold">
              {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(totalBruto)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Valor Neto</p>
            <p className="text-xl font-semibold text-success">
              {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(totalNeto)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Lotes Pagados</p>
            <p className="text-2xl font-semibold text-success">{lotesPagados}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // Lista principal
  if (!showDetail) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lotes Aprobados</h1>
          <p className="text-muted-foreground">Consulta consolidada de todos los lotes aprobados con filtros avanzados</p>
        </div>

        <DataTable
          title="Todos los Lotes Aprobados"
          columns={columns}
          data={filteredData}
          actions={actions}
          renderCell={renderCell}
          summary={summary}
          searchable={false}
          filterable={false}
          exportable={true}
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
            <h1 className="text-2xl font-bold text-foreground">Lote Aprobado: {selectedLote.numero}</h1>
            <p className="text-muted-foreground">Aprobado por {selectedLote.aprobado_por} • {new Date(selectedLote.fecha_aprobacion).toLocaleDateString('es-CO')}</p>
          </div>
        </div>

        {/* Información General */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Información General
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Fecha Aprobación</p>
              <p className="font-medium">{new Date(selectedLote.fecha_aprobacion).toLocaleDateString('es-CO')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fecha Pago</p>
              <p className="font-medium">
                {selectedLote.fecha_pago ? new Date(selectedLote.fecha_pago).toLocaleDateString('es-CO') : 'Pendiente'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Aprobado Por</p>
              <p className="font-medium">{selectedLote.aprobado_por}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estado</p>
              <Badge variant={selectedLote.estado === 'pagado' ? 'success' : 'success-light'}>
                {selectedLote.estado === 'pagado' ? 'Pagado' : 'Aprobado'}
              </Badge>
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
                <p className="text-sm text-muted-foreground">Descuentos</p>
                <p className="text-2xl font-bold text-destructive">
                  -{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedLote.descuentos_totales)}
                </p>
              </div>
              
              <div className="text-center p-4 bg-success/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Valor Neto</p>
                <p className="text-2xl font-bold text-success">
                  {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedLote.valor_neto)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detalle de Cuentas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cuentas de Cobro ({selectedLote.total_cuentas})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 font-medium text-muted-foreground">No. Cuenta</th>
                    <th className="text-left py-2 px-3 font-medium text-muted-foreground">Proveedor</th>
                    <th className="text-right py-2 px-3 font-medium text-muted-foreground">Valor Original</th>
                    <th className="text-right py-2 px-3 font-medium text-muted-foreground">Descuentos</th>
                    <th className="text-right py-2 px-3 font-medium text-muted-foreground">Valor Final</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedLote.cuentas.map((cuenta: any, index: number) => (
                    <tr key={index} className="border-b hover:bg-accent/50">
                      <td className="py-3 px-3 font-medium">{cuenta.numero}</td>
                      <td className="py-3 px-3">{cuenta.proveedor}</td>
                      <td className="py-3 px-3 text-right">
                        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(cuenta.valor)}
                      </td>
                      <td className="py-3 px-3 text-right text-destructive">
                        {cuenta.descuentos > 0 
                          ? `-${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(cuenta.descuentos)}`
                          : '-'
                        }
                      </td>
                      <td className="py-3 px-3 text-right font-semibold">
                        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(cuenta.valor - cuenta.descuentos)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button 
                onClick={() => handleDownloadReport(selectedLote.id)}
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar Reporte Completo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}