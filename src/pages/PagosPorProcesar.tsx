import { useState } from "react"
import { Plus, Eye, Package, Building2, Calendar, DollarSign } from "lucide-react"
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
  const [selectedCuentaDetail, setSelectedCuentaDetail] = useState<any>(null)
  const [selectedCuentaToAdd, setSelectedCuentaToAdd] = useState<any>(null)
  const [loteToAddCuenta, setLoteToAddCuenta] = useState<any>(null)
  const [nuevoLote, setNuevoLote] = useState({ nombre: "", descripcion: "" })
  const [showPrestamosManager, setShowPrestamosManager] = useState(false)
  const [showCreatePrestamo, setShowCreatePrestamo] = useState(false)

  const handleCreateLote = () => {
    // Implementar lógica para crear nuevo lote
    console.log("Crear nuevo lote:", nuevoLote)
    setShowCreateLote(false)
    setNuevoLote({ nombre: "", descripcion: "" })
  }

  const handleAddCuentaToLote = () => {
    // Implementar lógica para agregar cuenta al lote
    console.log("Agregar cuenta al lote:", selectedCuentaToAdd, loteToAddCuenta)
    setShowAddCuenta(false)
    setSelectedCuentaToAdd(null)
    setLoteToAddCuenta(null)
    // Volver a la vista de detalle del lote
    if (selectedLote) {
      setShowDetail(true)
    }
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
  if (!showDetail && !showCreateLote && !showAddCuenta && !showCuentaDetail) {
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
                    Ver Servicios
                  </Button>
                  <Button 
                    onClick={() => {
                      handleAddCuentaToLote()
                    }}
                  >
                    Agregar al Lote
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
            <CardTitle>Resumen de la Cuenta de Cobro</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

  // Dialogs for loan management (missing from the component)
  return (
    <>
      {/* Dialog para gestión de préstamos */}
      {showPrestamosManager && (
        <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setShowPrestamosManager(false)
                  if (loteToAddCuenta) {
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
        </div>
      )}

      {/* Dialog para crear préstamo desde cuenta */}
      {showCreatePrestamo && (
        <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setShowCreatePrestamo(false)
                  if (loteToAddCuenta) {
                    setShowAddCuenta(true)
                  }
                }}
              >
                ← Volver
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Gestionar Préstamo - {selectedCuentaToAdd?.proveedor}</h1>
                <p className="text-muted-foreground">Información del préstamo asociado</p>
              </div>
            </div>

            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle>Información del Préstamo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-success/10 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Préstamo actual del proveedor:</p>
                  <p className="text-2xl font-bold text-success">
                    {selectedCuentaToAdd && new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedCuentaToAdd.prestamos)}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      setShowCreatePrestamo(false)
                      setShowPrestamosManager(true)
                    }}
                  >
                    Ver Historial de Préstamos
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowCreatePrestamo(false)
                      if (loteToAddCuenta) {
                        setShowAddCuenta(true)
                      }
                    }}
                  >
                    Cerrar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  )
}