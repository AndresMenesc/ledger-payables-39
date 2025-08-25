import { useState } from "react"
import { Plus, Eye, Package, Building2, Calendar, DollarSign, CheckCircle, History, Calculator } from "lucide-react"
import { DataTable } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PrestamosManager from "@/components/PrestamosManager"

// Datos de ejemplo de préstamos detallados
const prestamosDetallados = [
  {
    id: 1,
    proveedor: "ALBERTO JOSE TAMARA CABARCAS",
    fechaSolicitud: "2025-02-01",
    tipo: "Anticipo de viaje",
    montoTotal: 98753,
    montoUtilizado: 0,
    montoDisponible: 98753,
    estado: "Activo",
    descripcion: "Anticipo para servicios de transporte ejecutivo",
    cuotas: 1,
    valorCuota: 98753,
    fechaVencimiento: "2025-03-01",
    observaciones: "Préstamo para cubrir gastos de combustible y peajes"
  },
  {
    id: 2,
    proveedor: "ALEXANDER PERDOMO VARGAS",
    fechaSolicitud: "2025-01-15",
    tipo: "Anticipo de viaje",
    montoTotal: 142223,
    montoUtilizado: 50000,
    montoDisponible: 92223,
    estado: "Activo",
    descripcion: "Anticipo para servicios de carga",
    cuotas: 2,
    valorCuota: 71111.5,
    fechaVencimiento: "2025-04-15",
    observaciones: "Préstamo para mantenimiento de vehículos de carga"
  }
]

// Datos de ejemplo
const lotesPago = [
  {
    id: 1,
    numero: "LP-2024-001",
    fecha_creacion: "2024-01-20",
    estado: "en_proceso",
    total_cuentas: 3,
    valor_total: 8500000,
    cuentas: [
      { 
        numero: "CC-2024-001", 
        proveedor: "TRANSPORTES BOGOTÁ EXPRESS S.A.S", 
        valor: 2500000,
        servicios: [
          { 
            descripcion: "Transporte ejecutivo Bogotá-Medellín", 
            valor: 1800000, 
            estado: "pendiente",
            ruta: "Bogotá → Medellín",
            vehiculo: "Toyota Prado 2023 - ABC123"
          },
          { 
            descripcion: "Servicio de regreso Medellín-Bogotá", 
            valor: 700000, 
            estado: "pendiente",
            ruta: "Medellín → Bogotá",
            vehiculo: "Toyota Prado 2023 - ABC123"
          }
        ]
      },
      { 
        numero: "CC-2024-002", 
        proveedor: "FLOTA NACIONAL DE CARGA LTDA", 
        valor: 1800000,
        servicios: [
          { 
            descripcion: "Transporte de carga Bogotá-Cali", 
            valor: 1800000, 
            estado: "aprobado",
            ruta: "Bogotá → Cali",
            vehiculo: "Camión Volvo FH 2022 - XYZ789",
            carga: "Equipos industriales - 15 toneladas"
          }
        ]
      },
      { 
        numero: "CC-2024-004", 
        proveedor: "SERVITAXIS EMPRESARIALES SAS", 
        valor: 4200000,
        servicios: [
          { 
            descripcion: "Servicios de taxi corporativo", 
            valor: 4200000, 
            estado: "pendiente",
            ruta: "Zona Rosa → Aeropuerto El Dorado",
            vehiculo: "Chevrolet Spark GT 2023 - DEF456"
          }
        ]
      }
    ]
  },
  {
    id: 2,
    numero: "LP-2024-002",
    fecha_creacion: "2024-01-22",
    estado: "pendiente",
    total_cuentas: 2,
    valor_total: 3700000,
    cuentas: [
      { 
        numero: "CC-2024-005", 
        proveedor: "TRANSPORTES INTERURBANOS LTDA", 
        valor: 1500000,
        servicios: [
          { 
            descripcion: "Transporte intermunicipal", 
            valor: 1500000, 
            estado: "pendiente",
            ruta: "Bogotá → Bucaramanga",
            vehiculo: "Bus Mercedes Benz 2023 - GHI789"
          }
        ]
      },
      { 
        numero: "CC-2024-006", 
        proveedor: "LOGÍSTICA Y TRANSPORTE ABC", 
        valor: 2200000,
        servicios: [
          { 
            descripcion: "Distribución urbana", 
            valor: 2200000, 
            estado: "pendiente",
            ruta: "Centro → Zona Industrial",
            vehiculo: "Camión NPR 2022 - JKL456"
          }
        ]
      }
    ]
  }
]

const cuentasDisponibles = [
  { 
    numero: "CC-2024-007", 
    proveedor: "ALBERTO JOSE TAMARA CABARCAS", 
    valor: 2821500, 
    prestamos: 98753,
    descuentoReteFuente: 98753,
    totalNeto: 2722747,
    centroCosto: "IGT SERVICES AND TECHNOLOGIES COLOMBIA",
    fechas: "2025-02-01 2025-02-28",
    servicios: [
      {
        id: "AP43370",
        factura: "A143369",
        fechaExpedicion: "2025-03-28 03:27:34",
        centroCosto: "IGT SERVICES AND TECHNOLOGIES COLOMBIA",
        proveedor: "ALBERTO JOSE TAMARA CABARCAS",
        fechas: "2025-02-01 2025-02-28",
        valor: 1163500,
        descripcion: "Transporte ejecutivo Bogotá-Medellín",
        ruta: "Bogotá → Medellín",
        vehiculo: "Toyota Prado 2023 - ABC123",
        creadoPor: "Alberto jose tamara cabarcas"
      },
      {
        id: "AP43371",
        factura: "A143370", 
        fechaExpedicion: "2025-03-28 03:27:37",
        centroCosto: "IGT SERVICES AND TECHNOLOGIES COLOMBIA",
        proveedor: "ALBERTO JOSE TAMARA CABARCAS",
        fechas: "2025-02-01 2025-02-28",
        valor: 1456000,
        descripcion: "Servicio de regreso Medellín-Bogotá",
        ruta: "Medellín → Bogotá",
        vehiculo: "Toyota Prado 2023 - ABC123",
        creadoPor: "Alberto jose tamara cabarcas"
      }
    ]
  },
  { 
    numero: "CC-2024-008", 
    proveedor: "ALEXANDER PERDOMO VARGAS", 
    valor: 4063500, 
    prestamos: 142223,
    descuentoReteFuente: 142223,
    totalNeto: 3921277,
    centroCosto: "AMERICAS BUSINESS PROCESS SERVICES",
    fechas: "2025-02-01 2025-02-28",
    servicios: [
      {
        id: "AP43372",
        factura: "A143371",
        fechaExpedicion: "2025-03-28 03:27:45",
        centroCosto: "AMERICAS BUSINESS PROCESS SERVICES",
        proveedor: "ALEXANDER PERDOMO VARGAS",
        fechas: "2025-02-01 2025-02-28", 
        valor: 4063500,
        descripcion: "Transporte de carga Bogotá-Cali",
        ruta: "Bogotá → Cali",
        vehiculo: "Camión Volvo FH 2022 - XYZ789",
        carga: "Equipos industriales - 15 toneladas",
        creadoPor: "Alexander perdomo vargas"
      }
    ]
  },
  { 
    numero: "CC-2024-009", 
    proveedor: "DERLY TATIANA MENDEZ PEREZ", 
    valor: 1123500, 
    prestamos: 0,
    descuentoReteFuente: 0,
    totalNeto: 1123500,
    centroCosto: "BANCO POPULAR BOGOTA",
    fechas: "2025-02-01 2025-02-28",
    servicios: [
      {
        id: "AP43373",
        factura: "A143372",
        fechaExpedicion: "2025-03-28 03:27:50",
        centroCosto: "BANCO POPULAR BOGOTA",
        proveedor: "DERLY TATIANA MENDEZ PEREZ",
        fechas: "2025-02-01 2025-02-28",
        valor: 1123500,
        descripcion: "Servicios de taxi corporativo",
        ruta: "Zona Rosa → Aeropuerto El Dorado",
        vehiculo: "Chevrolet Spark GT 2023 - DEF456",
        creadoPor: "Derly tatiana mendez perez"
      }
    ]
  }
]

const columns = [
  { key: "numero", label: "No. Lote", sortable: true },
  { key: "fecha_creacion", label: "Fecha Creación", sortable: true },
  { key: "total_cuentas", label: "Cuentas", sortable: true },
  { key: "valor_total", label: "Valor Total", sortable: true },
  { key: "estado", label: "Estado", sortable: true }
]

export default function PagosPorProcesar() {
  const [selectedLote, setSelectedLote] = useState<any>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [showCreateLote, setShowCreateLote] = useState(false)
  const [showAddCuenta, setShowAddCuenta] = useState(false)
  const [showCuentaDetail, setShowCuentaDetail] = useState(false)
  const [showCuentaAdded, setShowCuentaAdded] = useState(false)
  const [selectedCuentaDetail, setSelectedCuentaDetail] = useState<any>(null)
  const [selectedCuentaToAdd, setSelectedCuentaToAdd] = useState<any>(null)
  const [loteToAddCuenta, setLoteToAddCuenta] = useState<any>(null)
  const [nuevoLote, setNuevoLote] = useState({ nombre: "", descripcion: "" })
  const [showPrestamosManager, setShowPrestamosManager] = useState(false)
  const [showCreatePrestamo, setShowCreatePrestamo] = useState(false)
  const [showLoanCalculator, setShowLoanCalculator] = useState(false)
  const [selectedPrestamo, setSelectedPrestamo] = useState<any>(null)
  const [discountToApply, setDiscountToApply] = useState(0)

  const handleCreateLote = () => {
    // Implementar lógica para crear nuevo lote
    console.log("Crear nuevo lote:", nuevoLote)
    setShowCreateLote(false)
    setNuevoLote({ nombre: "", descripcion: "" })
  }

  const handleAddCuentaToLote = () => {
    // Implementar lógica para agregar cuenta al lote
    console.log("Agregar cuenta al lote:", selectedCuentaToAdd, loteToAddCuenta)
    
    // Mostrar vista de confirmación con detalles
    setShowAddCuenta(false)
    setShowCuentaAdded(true)
  }


  // Define summary and actions first, before any conditional returns
  const summary = (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Lotes</p>
              <p className="text-2xl font-semibold">{lotesPago.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Valor Total</p>
          <p className="text-xl font-semibold text-primary">
            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(
              lotesPago.reduce((sum, lote) => sum + lote.valor_total, 0)
            )}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <Button 
            className="w-full"
            onClick={() => setShowCreateLote(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear Nuevo Lote
          </Button>
        </CardContent>
      </Card>
    </div>
  )

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
        Gestionar Lote
      </Button>
      
      <Button 
        size="sm"
        onClick={() => {
          setLoteToAddCuenta(row)
          setShowAddCuenta(true)
        }}
      >
        <Plus className="h-4 w-4 mr-2" />
        Agregar Cuenta
      </Button>
    </div>
  )

  // Vista principal - listado de lotes
  if (!showDetail && !showCreateLote && !showAddCuenta && !showCuentaDetail && !showCuentaAdded && !showPrestamosManager && !showCreatePrestamo && !showLoanCalculator) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestión de Lotes de Pago</h1>
          <p className="text-muted-foreground">Crea y gestiona lotes de pagos para servicios de transporte</p>
        </div>

        <DataTable
          title="Lotes de Pagos de Transporte"
          columns={columns}
          data={lotesPago}
          actions={actions}
          summary={summary}
        />
      </div>
    )
  }

  // Vista de detalle del lote
  if (showDetail && selectedLote) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setShowDetail(false)
                setSelectedLote(null)
              }}
            >
              ← Volver a Lotes
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Gestión del Lote: {selectedLote.numero}</h1>
              <p className="text-muted-foreground">
                {selectedLote.total_cuentas} cuentas asociadas • {new Date(selectedLote.fecha_creacion).toLocaleDateString('es-CO')}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => {
                setLoteToAddCuenta(selectedLote)
                setShowDetail(false)
                setShowAddCuenta(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Cuenta
            </Button>
            <Button variant="success">
              Enviar para Aprobación
            </Button>
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
              <p className="text-sm text-muted-foreground">Fecha Creación</p>
              <p className="font-medium">{new Date(selectedLote.fecha_creacion).toLocaleDateString('es-CO')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Cuentas</p>
              <p className="font-medium">{selectedLote.total_cuentas}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estado</p>
              <Badge variant={selectedLote.estado === 'en_proceso' ? 'warning-light' : 'pending-light'}>
                {selectedLote.estado === 'en_proceso' ? 'En Proceso' : 'Pendiente'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valor Total</p>
              <p className="text-2xl font-bold text-primary">
                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedLote.valor_total)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cuentas de Cobro en el Lote */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Cuentas de Cobro en el Lote</h2>
            <Button 
              onClick={() => {
                setLoteToAddCuenta(selectedLote)
                setShowDetail(false)
                setShowAddCuenta(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Cuenta
            </Button>
          </div>
          
          {selectedLote.cuentas.map((cuenta: any, index: number) => (
            <Card key={index} className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">{cuenta.numero}</h3>
                    </div>
                    <p className="text-muted-foreground mb-2">{cuenta.proveedor}</p>
                    <p className="text-xl font-bold text-primary">
                      {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(cuenta.valor)}
                    </p>
                    {cuenta.servicios && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {cuenta.servicios.length} servicio{cuenta.servicios.length !== 1 ? 's' : ''} asociado{cuenta.servicios.length !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Encontrar la cuenta completa en cuentasDisponibles con servicios
                        const cuentaCompleta = cuentasDisponibles.find(c => c.numero === cuenta.numero) || {
                          ...cuenta,
                          centroCosto: "Centro de costo no disponible",
                          fechas: "Fechas no disponibles",
                          totalNeto: cuenta.valor,
                          servicios: cuenta.servicios || []
                        }
                        setSelectedCuentaDetail(cuentaCompleta)
                        setShowDetail(false)
                        setShowCuentaDetail(true)
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Servicios
                    </Button>
                    <Button 
                      variant="destructive"
                      size="sm"
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Vista para agregar cuenta al lote
  if (showAddCuenta && loteToAddCuenta) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setShowAddCuenta(false)
              setLoteToAddCuenta(null)
              setSelectedCuentaToAdd(null)
              if (selectedLote) {
                setShowDetail(true)
              }
            }}
          >
            ← Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Agregar Cuenta al Lote: {loteToAddCuenta.numero}</h1>
            <p className="text-muted-foreground">Selecciona una cuenta de cobro disponible para agregar al lote</p>
          </div>
        </div>

        {/* Cuentas Disponibles */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Cuentas de Cobro Disponibles</h2>
          
          {cuentasDisponibles.map((cuenta: any, index: number) => (
            <Card 
              key={index} 
              className={`border-l-4 cursor-pointer transition-all hover:shadow-md ${
                selectedCuentaToAdd?.numero === cuenta.numero 
                  ? 'border-l-primary bg-primary/5' 
                  : 'border-l-muted hover:border-l-primary/50'
              }`}
              onClick={() => setSelectedCuentaToAdd(cuenta)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">{cuenta.numero}</h3>
                    </div>
                    <p className="text-muted-foreground mb-1">{cuenta.proveedor}</p>
                    <p className="text-sm text-muted-foreground mb-3">{cuenta.centroCosto}</p>
                    <p className="text-sm text-muted-foreground">Periodo: {cuenta.fechas}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary mb-1">
                      {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(cuenta.totalNeto)}
                    </p>
                    <div className="text-sm space-y-1">
                      <p className="text-muted-foreground">
                        Total: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(cuenta.valor)}
                      </p>
                      {cuenta.prestamos > 0 && (
                        <p className="text-success">
                          Préstamo: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(cuenta.prestamos)}
                        </p>
                      )}
                      <p className="text-destructive">
                        ReteFuente: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(cuenta.descuentoReteFuente)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Botones de acción */}
        {selectedCuentaToAdd && (
          <Card className="bg-primary/5 border-primary">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Cuenta Seleccionada: {selectedCuentaToAdd.numero}</h3>
                  <p className="text-muted-foreground">{selectedCuentaToAdd.proveedor}</p>
                  <p className="text-xl font-bold text-primary">
                    Total Neto: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedCuentaToAdd.totalNeto)}
                  </p>
                  {selectedCuentaToAdd.prestamos > 0 && (
                    <div className="mt-2 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowAddCuenta(false)
                          setShowCreatePrestamo(true)
                        }}
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        Gestionar Préstamo: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedCuentaToAdd.prestamos)}
                      </Button>
                    </div>
                  )}
                </div>
                
                 <div className="flex gap-2">
                   <Button 
                     variant="outline"
                     onClick={() => {
                       // Encontrar la cuenta completa con servicios
                       const cuentaCompleta = cuentasDisponibles.find(c => c.numero === selectedCuentaToAdd.numero) || selectedCuentaToAdd
                       setSelectedCuentaDetail(cuentaCompleta)
                       setShowAddCuenta(false)
                       setShowCuentaDetail(true)
                     }}
                   >
                     <Eye className="h-4 w-4 mr-2" />
                     Ver Detalle
                   </Button>
                   <Button 
                     onClick={() => {
                       handleAddCuentaToLote()
                     }}
                   >
                     Asociar al Lote
                   </Button>
                 </div>
              </div>
            </CardContent>
          </Card>
        )}
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
              if (loteToAddCuenta) {
                setShowAddCuenta(true)
              } else if (selectedLote) {
                setShowDetail(true)
              }
            }}
          >
            ← Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Servicios de la Cuenta: {selectedCuentaDetail.numero}</h1>
            <p className="text-muted-foreground">{selectedCuentaDetail.proveedor}</p>
          </div>
        </div>

        {/* Información de la cuenta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Resumen de la Cuenta de Cobro
              {loteToAddCuenta && (
                <Button
                  onClick={() => {
                    setSelectedCuentaToAdd(selectedCuentaDetail)
                    setShowCuentaDetail(false)
                    handleAddCuentaToLote()
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Asociar al Lote
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Centro de Costo</p>
                <p className="font-medium">{selectedCuentaDetail.centroCosto || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Periodo</p>
                <p className="font-medium">{selectedCuentaDetail.fechas || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Bruto</p>
                <p className="font-medium">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedCuentaDetail.valor)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Neto</p>
                <p className="text-xl font-bold text-primary">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedCuentaDetail.totalNeto || selectedCuentaDetail.valor)}</p>
              </div>
            </div>

            {/* Resumen financiero detallado */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Desglose Financiero</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Valor bruto:</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedCuentaDetail.valor)}
                  </span>
                </div>
                
                {selectedCuentaDetail.prestamos > 0 && (
                  <div className="flex justify-between text-warning">
                    <span className="text-sm">Descuento préstamo:</span>
                    <span className="font-medium">
                      -{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedCuentaDetail.prestamos)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between text-destructive">
                  <span className="text-sm">Retención fuente:</span>
                  <span className="font-medium">
                    -{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedCuentaDetail.descuentoReteFuente || 0)}
                  </span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total neto:</span>
                  <span className="text-success">
                    {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedCuentaDetail.totalNeto || selectedCuentaDetail.valor)}
                  </span>
                </div>
              </div>
            </div>

            {/* Gestión de préstamos si los hay */}
            {selectedCuentaDetail.prestamos > 0 && (
              <Card className="bg-warning/5 border-warning">
                <CardHeader>
                  <CardTitle className="text-warning flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Préstamo Activo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Monto del préstamo</p>
                      <p className="text-2xl font-bold text-warning">
                        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedCuentaDetail.prestamos)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Este monto será descontado del total de la cuenta
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedPrestamo(prestamosDetallados.find(p => p.proveedor === selectedCuentaDetail.proveedor))
                          setShowCuentaDetail(false)
                          setShowLoanCalculator(true)
                        }}
                      >
                        <Calculator className="h-4 w-4 mr-2" />
                        Calcular Descuento
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowCuentaDetail(false)
                          setShowPrestamosManager(true)
                        }}
                      >
                        <History className="h-4 w-4 mr-2" />
                        Ver Historial
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Servicios de Transporte */}
        <Card>
          <CardHeader>
            <CardTitle>Servicios de Transporte Incluidos</CardTitle>
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
                        <Badge variant="success-light">
                          {servicio.id || `SRV-${index + 1}`}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/30 p-3 rounded-lg">
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Factura</p>
                            <p className="font-medium">{servicio.factura || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Fecha Expedición</p>
                            <p className="font-medium">{servicio.fechaExpedicion || "N/A"}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Ruta</p>
                            <p className="font-medium">{servicio.ruta || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Vehículo</p>
                            <p className="font-medium">{servicio.vehiculo || "N/A"}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Creado por</p>
                            <p className="font-medium">{servicio.creadoPor || selectedCuentaDetail.proveedor}</p>
                          </div>
                          {servicio.carga && (
                            <div>
                              <p className="text-xs text-muted-foreground">Carga</p>
                              <p className="font-medium">{servicio.carga}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-xs text-muted-foreground">Estado</p>
                            <Badge variant={
                              servicio.estado === 'pendiente' ? 'pending-light' :
                              servicio.estado === 'aprobado' ? 'success-light' : 'destructive'
                            }>
                              {servicio.estado === 'pendiente' ? 'Pendiente' :
                               servicio.estado === 'aprobado' ? 'Aprobado' : 'Rechazado'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No hay servicios asociados a esta cuenta de cobro.</p>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Vista de confirmación de cuenta agregada
  if (showCuentaAdded && selectedCuentaToAdd && loteToAddCuenta) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setShowCuentaAdded(false)
              setSelectedCuentaToAdd(null)
              setLoteToAddCuenta(null)
              setShowDetail(true)
            }}
          >
            ← Volver al Lote
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Cuenta Agregada Exitosamente</h1>
            <p className="text-muted-foreground">
              {selectedCuentaToAdd.numero} se ha agregado al lote {loteToAddCuenta.numero}
            </p>
          </div>
        </div>

        {/* Resumen de la cuenta agregada */}
        <Card className="border-success bg-success/5">
          <CardHeader>
            <CardTitle className="text-success flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Cuenta de Cobro Agregada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Información de la Cuenta</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Número de Cuenta</p>
                    <p className="font-medium">{selectedCuentaToAdd.numero}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Proveedor</p>
                    <p className="font-medium">{selectedCuentaToAdd.proveedor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Centro de Costo</p>
                    <p className="font-medium">{selectedCuentaToAdd.centroCosto}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Periodo</p>
                    <p className="font-medium">{selectedCuentaToAdd.fechas}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Resumen Financiero</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Bruto:</span>
                    <span className="font-medium">
                      {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedCuentaToAdd.valor)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-destructive">
                    <span className="text-sm">Retención Fuente:</span>
                    <span className="font-medium">
                      -{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedCuentaToAdd.descuentoReteFuente)}
                    </span>
                  </div>
                  
                  {selectedCuentaToAdd.prestamos > 0 && (
                    <div className="flex justify-between text-warning">
                      <span className="text-sm">Descuento Préstamo:</span>
                      <span className="font-medium">
                        -{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedCuentaToAdd.prestamos)}
                      </span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Neto:</span>
                    <span className="text-success">
                      {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedCuentaToAdd.totalNeto)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gestión de Préstamos */}
        {selectedCuentaToAdd.prestamos > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-warning" />
                Préstamos Asociados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-warning/10 p-4 rounded-lg mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Esta cuenta tiene un préstamo activo por:
                </p>
                <p className="text-2xl font-bold text-warning">
                  {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedCuentaToAdd.prestamos)}
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCuentaAdded(false)
                    setShowPrestamosManager(true)
                  }}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Ver Historial de Préstamos
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCuentaAdded(false)
                    setShowCreatePrestamo(true)
                  }}
                >
                  Gestionar Préstamo
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Servicios de la cuenta */}
        <Card>
          <CardHeader>
            <CardTitle>Servicios de Transporte Incluidos</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setSelectedCuentaDetail(selectedCuentaToAdd)
                setShowCuentaAdded(false)
                setShowCuentaDetail(true)
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              Ver Detalle de Servicios
            </Button>
          </CardContent>
        </Card>

        {/* Acciones */}
        <div className="flex gap-3">
          <Button 
            onClick={() => {
              setShowCuentaAdded(false)
              setSelectedCuentaToAdd(null)
              setLoteToAddCuenta(null)
              setShowDetail(true)
            }}
          >
            Volver al Lote
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => {
              setShowCuentaAdded(false)
              setSelectedCuentaToAdd(null)
              setShowAddCuenta(true)
            }}
          >
            Agregar Otra Cuenta
          </Button>
        </div>
      </div>
    )
  }

  // Vista para crear nuevo lote
  if (showCreateLote) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowCreateLote(false)}
          >
            ← Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Crear Nuevo Lote de Pago</h1>
            <p className="text-muted-foreground">Completa la información para crear un nuevo lote de pagos</p>
          </div>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Información del Lote</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre del Lote</Label>
              <Input
                id="nombre"
                value={nuevoLote.nombre}
                onChange={(e) => setNuevoLote(prev => ({ ...prev, nombre: e.target.value }))}
                placeholder="Ej: LP-2024-003"
              />
            </div>
            <div>
              <Label htmlFor="descripcion">Descripción</Label>
              <Input
                id="descripcion"
                value={nuevoLote.descripcion}
                onChange={(e) => setNuevoLote(prev => ({ ...prev, descripcion: e.target.value }))}
                placeholder="Descripción del lote"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateLote(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateLote}>
                Crear Lote
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Vista de gestión de préstamos
  if (showPrestamosManager) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setShowPrestamosManager(false)
              if (showCuentaAdded) {
                setShowCuentaAdded(true)
              } else if (loteToAddCuenta) {
                setShowAddCuenta(true)
              }
            }}
          >
            ← Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gestión de Préstamos</h1>
            <p className="text-muted-foreground">Administra préstamos y anticipos para servicios de transporte</p>
          </div>
        </div>
        
        <PrestamosManager />
      </div>
    )
  }

  // Vista de gestión individual de préstamo
  if (showCreatePrestamo && selectedCuentaToAdd) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setShowCreatePrestamo(false)
              if (showCuentaAdded) {
                setShowCuentaAdded(true)
              } else if (loteToAddCuenta) {
                setShowAddCuenta(true)
              }
            }}
          >
            ← Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gestionar Préstamo</h1>
            <p className="text-muted-foreground">{selectedCuentaToAdd.proveedor}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información del préstamo actual */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-warning" />
                Préstamo Actual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-warning/10 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Monto del Préstamo</p>
                  <p className="text-2xl font-bold text-warning">
                    {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedCuentaToAdd.prestamos)}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Estado:</span>
                    <Badge variant="warning-light">Activo</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Tipo:</span>
                    <span className="text-sm">Anticipo de viaje</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Fecha:</span>
                    <span className="text-sm">2025-02-01</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acciones disponibles */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Disponibles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full"
                onClick={() => {
                  setShowCreatePrestamo(false)
                  setShowPrestamosManager(true)
                }}
              >
                <History className="h-4 w-4 mr-2" />
                Ver Historial Completo
              </Button>
              
              <Button
                variant="outline"
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear Nuevo Préstamo
              </Button>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setShowCreatePrestamo(false)
                  setShowLoanCalculator(true)
                }}
              >
                <Calculator className="h-4 w-4 mr-2" />
                Calcular Descuento
              </Button>
              
              <Separator />
              
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Impacto en la cuenta:</p>
                <p className="text-sm font-medium">
                  Descuento aplicado: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedCuentaToAdd.prestamos)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Vista de calculadora de préstamos
  if (showLoanCalculator) {
    const prestamoActual = prestamosDetallados.find(p => p.proveedor === selectedCuentaToAdd?.proveedor) || prestamosDetallados[0]
    const [montoCustom, setMontoCustom] = useState(prestamoActual.montoDisponible)
    const [aplicarCompleto, setAplicarCompleto] = useState(true)
    
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setShowLoanCalculator(false)
              setShowCreatePrestamo(true)
            }}
          >
            ← Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Calculadora de Descuentos</h1>
            <p className="text-muted-foreground">Configura el descuento del préstamo para {selectedCuentaToAdd?.proveedor}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Información del préstamo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-warning" />
                Préstamo Actual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-warning/10 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Monto del Préstamo</p>
                <p className="text-2xl font-bold text-warning">
                  {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(prestamoActual.montoTotal)}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <Badge variant="warning-light">{prestamoActual.estado}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo</p>
                  <p className="font-medium">{prestamoActual.tipo}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fecha</p>
                  <p className="font-medium">{prestamoActual.fechaSolicitud}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vencimiento</p>
                  <p className="font-medium">{prestamoActual.fechaVencimiento}</p>
                </div>
              </div>

              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-sm">Monto Total:</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(prestamoActual.montoTotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Utilizado:</span>
                  <span className="font-medium text-destructive">
                    -{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(prestamoActual.montoUtilizado)}
                  </span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-sm">Disponible:</span>
                  <span className="text-success">
                    {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(prestamoActual.montoDisponible)}
                  </span>
                </div>
              </div>

              {prestamoActual.observaciones && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Observaciones:</p>
                  <p className="text-sm">{prestamoActual.observaciones}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Configuración de descuento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Configuración de Descuento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="completo"
                    checked={aplicarCompleto}
                    onChange={() => setAplicarCompleto(true)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="completo" className="text-sm font-medium">
                    Aplicar descuento completo
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="custom"
                    checked={!aplicarCompleto}
                    onChange={() => setAplicarCompleto(false)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="custom" className="text-sm font-medium">
                    Monto personalizado
                  </label>
                </div>
              </div>

              {!aplicarCompleto && (
                <div className="space-y-2">
                  <Label htmlFor="montoCustom">Monto a descontar</Label>
                  <Input
                    id="montoCustom"
                    type="number"
                    value={montoCustom}
                    onChange={(e) => setMontoCustom(Number(e.target.value))}
                    max={prestamoActual.montoDisponible}
                    min={0}
                  />
                  <p className="text-xs text-muted-foreground">
                    Máximo disponible: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(prestamoActual.montoDisponible)}
                  </p>
                </div>
              )}

              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Descuento a aplicar:</p>
                <p className="text-2xl font-bold text-primary">
                  {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(
                    aplicarCompleto ? prestamoActual.montoDisponible : montoCustom
                  )}
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Impacto en la cuenta:</h4>
                <div className="bg-muted/50 p-3 rounded-lg space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm">Total cuenta:</span>
                    <span className="text-sm">
                      {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedCuentaToAdd?.valor || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Descuento préstamo:</span>
                    <span className="text-sm text-destructive">
                      -{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(
                        aplicarCompleto ? prestamoActual.montoDisponible : montoCustom
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">ReteFuente:</span>
                    <span className="text-sm text-destructive">
                      -{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedCuentaToAdd?.descuentoReteFuente || 0)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span className="text-sm">Total neto:</span>
                    <span className="text-success">
                      {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(
                        (selectedCuentaToAdd?.valor || 0) - 
                        (aplicarCompleto ? prestamoActual.montoDisponible : montoCustom) - 
                        (selectedCuentaToAdd?.descuentoReteFuente || 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => {
                    setDiscountToApply(aplicarCompleto ? prestamoActual.montoDisponible : montoCustom)
                    setShowLoanCalculator(false)
                    setShowCreatePrestamo(true)
                  }}
                >
                  Aplicar Descuento
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowLoanCalculator(false)
                    setShowCreatePrestamo(true)
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Historial de cuotas */}
        <Card>
          <CardHeader>
            <CardTitle>Detalle del Préstamo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Información General</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Número de cuotas:</span>
                    <span className="text-sm">{prestamoActual.cuotas}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Valor por cuota:</span>
                    <span className="text-sm">
                      {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(prestamoActual.valorCuota)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Descripción:</span>
                    <span className="text-sm">{prestamoActual.descripcion}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Acciones Adicionales</h4>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setShowLoanCalculator(false)
                      setShowPrestamosManager(true)
                    }}
                  >
                    <History className="h-4 w-4 mr-2" />
                    Ver Historial Completo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Nuevo Préstamo
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}