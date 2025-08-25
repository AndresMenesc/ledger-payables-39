
import { useState } from "react"
import { Eye, Download, Calendar, Search, Building2, ArrowLeft, Truck, MapPin, Clock, Package, DollarSign, AlertCircle, CreditCard, Receipt } from "lucide-react"
import { DataTable } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { addDays, format } from "date-fns"
import { DateRange } from "react-day-picker"

// Datos de ejemplo con servicios de transporte, descuentos y préstamos detallados
const lotesAprobados = [
  {
    id: 1,
    numero: "LP-2024-001",
    fecha_aprobacion: "2024-01-28",
    fecha_pago: "2024-01-30",
    total_cuentas: 3,
    valor_bruto: 9500000,
    descuentos_totales: 485000,
    valor_neto: 9015000,
    estado: "pagado",
    aprobado_por: "Director Financiero",
    proveedores: ["TRANSPORTES EJECUTIVOS PLATINUM S.A.S", "FLOTA NORTE CARGA PESADA LTDA", "SERVICIOS LOGÍSTICOS INTEGRALES"],
    cuentas: [
      { 
        numero: "CC-2024-001", 
        proveedor: "TRANSPORTES EJECUTIVOS PLATINUM S.A.S", 
        valor: 3500000, 
        descuentos: 175000,
        valor_pagado: 3325000,
        descuentos_detalle: [
          {
            concepto: "Retención en la fuente",
            porcentaje: 4.0,
            valor: 140000,
            tipo: "retencion"
          },
          {
            concepto: "Retención ICA",
            porcentaje: 1.0,
            valor: 35000,
            tipo: "retencion"
          }
        ],
        prestamos: [
          {
            id: "PREST-001",
            concepto: "Anticipo para combustible y peajes",
            valor: 800000,
            fecha_otorgado: "2024-01-15",
            estado: "descontado",
            cuotas_restantes: 0
          }
        ],
        servicios: [
          {
            id: "SRV-001",
            descripcion: "Transporte ejecutivo VIP Bogotá-Cartagena",
            valor: 2200000,
            ruta: "Bogotá → Cartagena",
            vehiculo: "Mercedes-Benz Sprinter VIP 2023 - VIP001",
            fecha: "2024-01-20",
            estado: "completado"
          },
          {
            id: "SRV-002",
            descripcion: "Traslado aeropuerto - hotel ejecutivo",
            valor: 1300000,
            ruta: "Aeropuerto Rafael Núñez → Hotel Las Américas",
            vehiculo: "BMW X5 2023 - EXE123",
            fecha: "2024-01-20",
            estado: "completado"
          }
        ]
      },
      { 
        numero: "CC-2024-002", 
        proveedor: "FLOTA NORTE CARGA PESADA LTDA", 
        valor: 4000000, 
        descuentos: 240000,
        valor_pagado: 3760000,
        descuentos_detalle: [
          {
            concepto: "Retención en la fuente",
            porcentaje: 6.0,
            valor: 240000,
            tipo: "retencion"
          }
        ],
        prestamos: [
          {
            id: "PREST-002",
            concepto: "Préstamo para reparación de vehículo",
            valor: 1200000,
            fecha_otorgado: "2024-01-10",
            estado: "descontado",
            cuotas_restantes: 0
          },
          {
            id: "PREST-003",
            concepto: "Anticipo operativo enero",
            valor: 600000,
            fecha_otorgado: "2024-01-01",
            estado: "descontado",
            cuotas_restantes: 0
          }
        ],
        servicios: [
          {
            id: "SRV-003",
            descripcion: "Transporte de maquinaria industrial",
            valor: 4000000,
            ruta: "Bogotá → Medellín → Cali",
            vehiculo: "Tractomula Volvo FH16 2022 - CAR456",
            fecha: "2024-01-22",
            estado: "completado",
            carga: "Maquinaria industrial pesada - 25 toneladas"
          }
        ]
      },
      { 
        numero: "CC-2024-003", 
        proveedor: "SERVICIOS LOGÍSTICOS INTEGRALES", 
        valor: 2000000, 
        descuentos: 70000,
        valor_pagado: 1930000,
        descuentos_detalle: [
          {
            concepto: "Retención en la fuente",
            porcentaje: 3.5,
            valor: 70000,
            tipo: "retencion"
          }
        ],
        prestamos: [],
        servicios: [
          {
            id: "SRV-004",
            descripcion: "Distribución urbana empresarial",
            valor: 2000000,
            ruta: "Múltiples destinos zona empresarial Bogotá",
            vehiculo: "Flota de vehículos menores",
            fecha: "2024-01-23",
            estado: "completado"
          }
        ]
      }
    ]
  },
  {
    id: 2,
    numero: "LP-2024-002",
    fecha_aprobacion: "2024-01-29",
    fecha_pago: "2024-01-31",
    total_cuentas: 2,
    valor_bruto: 5800000,
    descuentos_totales: 290000,
    valor_neto: 5510000,
    estado: "pagado",
    aprobado_por: "Director Financiero",
    proveedores: ["TRANSPORTE ESPECIALIZADO MÉDICO", "SERVICIOS AEROPORTUARIOS PREMIUM"],
    cuentas: [
      { 
        numero: "CC-2024-007", 
        proveedor: "TRANSPORTE ESPECIALIZADO MÉDICO", 
        valor: 3300000, 
        descuentos: 165000,
        valor_pagado: 3135000,
        descuentos_detalle: [
          {
            concepto: "Retención en la fuente",
            porcentaje: 5.0,
            valor: 165000,
            tipo: "retencion"
          }
        ],
        prestamos: [
          {
            id: "PREST-004",
            concepto: "Anticipo para equipos especializados",
            valor: 400000,
            fecha_otorgado: "2024-01-20",
            estado: "descontado",
            cuotas_restantes: 0
          }
        ],
        servicios: [
          {
            id: "SRV-005",
            descripcion: "Transporte de pacientes en ambulancia",
            valor: 3300000,
            ruta: "Bogotá → Cúcuta",
            vehiculo: "Ambulancia Mercedes-Benz Sprinter - AMB001",
            fecha: "2024-01-25",
            estado: "completado",
            carga: "Transporte médico especializado"
          }
        ]
      },
      { 
        numero: "CC-2024-008", 
        proveedor: "SERVICIOS AEROPORTUARIOS PREMIUM", 
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
            concepto: "Descuento por volumen de servicios",
            porcentaje: 1.0,
            valor: 25000,
            tipo: "descuento"
          }
        ],
        prestamos: [],
        servicios: [
          {
            id: "SRV-006",
            descripcion: "Traslados aeroportuarios ejecutivos",
            valor: 2500000,
            ruta: "El Dorado ↔ Zona Rosa",
            vehiculo: "Flota Premium Audi A6 - PRM123",
            fecha: "2024-01-26",
            estado: "completado"
          }
        ]
      }
    ]
  },
  {
    id: 3,
    numero: "LP-2024-003",
    fecha_aprobacion: "2024-02-01",
    fecha_pago: null,
    total_cuentas: 4,
    valor_bruto: 8200000,
    descuentos_totales: 410000,
    valor_neto: 7790000,
    estado: "aprobado",
    aprobado_por: "Director Financiero",
    proveedores: ["TRANSPORTES REGIONALES DEL SUR", "LOGÍSTICA EMPRESARIAL LTDA", "FLOTA EJECUTIVA PREMIUM", "SERVICIOS ESPECIALIZADOS 4X4"],
    cuentas: [
      { 
        numero: "CC-2024-010", 
        proveedor: "TRANSPORTES REGIONALES DEL SUR", 
        valor: 3200000, 
        descuentos: 192000,
        valor_pagado: 3008000,
        descuentos_detalle: [
          {
            concepto: "Retención en la fuente",
            porcentaje: 6.0,
            valor: 192000,
            tipo: "retencion"
          }
        ],
        prestamos: [
          {
            id: "PREST-005",
            concepto: "Préstamo para expansión de flota",
            valor: 1500000,
            fecha_otorgado: "2024-01-28",
            estado: "vigente",
            cuotas_restantes: 3
          }
        ],
        servicios: [
          {
            id: "SRV-007",
            descripcion: "Transporte intermunicipal de personal",
            valor: 3200000,
            ruta: "Bogotá → Neiva → Pitalito",
            vehiculo: "Bus Mercedes-Benz O500 - BUS001",
            fecha: "2024-02-05",
            estado: "programado"
          }
        ]
      },
      { 
        numero: "CC-2024-011", 
        proveedor: "LOGÍSTICA EMPRESARIAL LTDA", 
        valor: 2800000, 
        descuentos: 140000,
        valor_pagado: 2660000,
        descuentos_detalle: [
          {
            concepto: "Retención en la fuente",
            porcentaje: 5.0,
            valor: 140000,
            tipo: "retencion"
          }
        ],
        prestamos: [],
        servicios: [
          {
            id: "SRV-008",
            descripcion: "Distribución de documentos empresariales",
            valor: 2800000,
            ruta: "Múltiples oficinas Bogotá y alrededores",
            vehiculo: "Flota de motocicletas y vehículos",
            fecha: "2024-02-06",
            estado: "programado"
          }
        ]
      },
      { 
        numero: "CC-2024-012", 
        proveedor: "FLOTA EJECUTIVA PREMIUM", 
        valor: 1500000, 
        descuentos: 45000,
        valor_pagado: 1455000,
        descuentos_detalle: [
          {
            concepto: "Retención en la fuente",
            porcentaje: 3.0,
            valor: 45000,
            tipo: "retencion"
          }
        ],
        prestamos: [
          {
            id: "PREST-006",
            concepto: "Anticipo para servicios febrero",
            valor: 300000,
            fecha_otorgado: "2024-02-01",
            estado: "vigente",
            cuotas_restantes: 1
          }
        ],
        servicios: [
          {
            id: "SRV-009",
            descripcion: "Servicios ejecutivos para reuniones",
            valor: 1500000,
            ruta: "Bogotá - zona financiera",
            vehiculo: "BMW Serie 5 2023 - EXE456",
            fecha: "2024-02-07",
            estado: "programado"
          }
        ]
      },
      { 
        numero: "CC-2024-013", 
        proveedor: "SERVICIOS ESPECIALIZADOS 4X4", 
        valor: 700000, 
        descuentos: 33000,
        valor_pagado: 667000,
        descuentos_detalle: [
          {
            concepto: "Retención en la fuente",
            porcentaje: 4.7,
            valor: 33000,
            tipo: "retencion"
          }
        ],
        prestamos: [],
        servicios: [
          {
            id: "SRV-010",
            descripcion: "Transporte a zonas de difícil acceso",
            valor: 700000,
            ruta: "Bogotá → Villavicencio → Yopal",
            vehiculo: "Toyota Land Cruiser 4X4 - 4X4001",
            fecha: "2024-02-08",
            estado: "programado"
          }
        ]
      }
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
  const [selectedCuenta, setSelectedCuenta] = useState<any>(null)
  const [currentView, setCurrentView] = useState<'list' | 'lote-detail' | 'cuenta-detail'>('list')
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
    console.log(`Descargar reporte del lote ${loteId}`)
  }

  const handleVerCuentaDetalle = (cuenta: any) => {
    setSelectedCuenta(cuenta)
    setCurrentView('cuenta-detail')
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
  if (currentView === 'list') {
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
            <div className="space-y-4">
              {selectedLote.cuentas.map((cuenta: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-accent/20 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{cuenta.numero}</h4>
                      <p className="text-sm text-muted-foreground">{cuenta.proveedor}</p>
                    </div>
                    <div className="flex items-center gap-2">
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
                    
                    <div>
                      <p className="text-muted-foreground">Descuentos</p>
                      <p className="font-medium text-destructive">
                        {cuenta.descuentos > 0 
                          ? `-${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(cuenta.descuentos)}`
                          : '-'
                        }
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-muted-foreground">Valor Final</p>
                      <p className="font-medium text-success">
                        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(cuenta.valor - cuenta.descuentos)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
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

  // Vista de detalle de la cuenta individual
  if (currentView === 'cuenta-detail' && selectedCuenta) {
    // Agregar datos de ejemplo para servicios si no existen
    const serviciosEjemplo = selectedCuenta.servicios || [
      {
        id: "SRV-" + Math.random().toString(36).substr(2, 9),
        descripcion: "Transporte ejecutivo para reuniones corporativas",
        valor: selectedCuenta.valor * 0.6,
        ruta: "Bogotá → Medellín → Bogotá",
        vehiculo: "Toyota Prado 2023 - ABC123",
        fecha: "2024-01-20",
        estado: selectedLote?.estado || "aprobado"
      },
      {
        id: "SRV-" + Math.random().toString(36).substr(2, 9),
        descripcion: "Servicio de transporte de documentos",
        valor: selectedCuenta.valor * 0.4,
        ruta: "Zona empresarial",
        vehiculo: "Motocicleta Honda 2022 - XYZ789",
        fecha: "2024-01-21",
        estado: selectedLote?.estado || "aprobado"
      }
    ]

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
              <Badge variant={selectedLote?.estado === 'pagado' ? 'success' : 'success-light'}>
                {selectedLote?.estado === 'pagado' ? 'Pagado' : 'Aprobado'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Servicios</p>
              <p className="font-medium">{serviciosEjemplo.length}</p>
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
                <p className="text-sm text-muted-foreground">Valor Final</p>
                <p className="text-2xl font-bold text-success">
                  {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedCuenta.valor - (selectedCuenta.descuentos || 0))}
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
                          servicio.estado === 'programado' ? 'outline' : 'success-light'
                        }>
                          {servicio.estado === 'completado' ? 'Completado' : 
                           servicio.estado === 'programado' ? 'Programado' : servicio.estado}
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
            <Download className="h-4 w-4 mr-2" />
            Descargar Cuenta
          </Button>
        </div>
      </div>
    )
  }

  return null
}
