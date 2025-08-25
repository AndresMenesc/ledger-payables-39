import { useState } from "react"
import { MoveRight, Package, Plus, Archive, Eye } from "lucide-react"
import { DataTable } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

// Datos de ejemplo - servicios de transporte
const cuentasSinLote = [
  {
    id: 1,
    numero: "CC-2024-011",
    proveedor: "TRANSPORTES RÁPIDOS BOGOTÁ S.A.S",
    fecha_aprobacion: "2024-02-01",
    valor_total: 1800000,
    estado: "aprobado",
    servicios: [
      {
        id: "SRV-011",
        descripcion: "Transporte ejecutivo aeropuerto",
        valor: 1800000,
        ruta: "Aeropuerto El Dorado → Centro Empresarial",
        vehiculo: "Toyota Prado 2023 - QWE123",
        fecha: "2024-02-01",
        estado: "completado"
      }
    ]
  },
  {
    id: 2,
    numero: "CC-2024-012",
    proveedor: "LOGÍSTICA URBANA LTDA",
    fecha_aprobacion: "2024-02-02",
    valor_total: 650000,
    estado: "aprobado",
    servicios: [
      {
        id: "SRV-012",
        descripcion: "Distribución última milla",
        valor: 650000,
        ruta: "Centro de distribución → Zona Norte",
        vehiculo: "Camión NPR 2022 - RTY456",
        fecha: "2024-02-02",
        estado: "completado"
      }
    ]
  },
  {
    id: 3,
    numero: "CC-2024-013",
    proveedor: "SERVICIOS DE TRANSPORTE ESPECIAL",
    fecha_aprobacion: "2024-02-03",
    valor_total: 1200000,
    estado: "aprobado",
    servicios: [
      {
        id: "SRV-013",
        descripcion: "Transporte de personal especializado",
        valor: 1200000,
        ruta: "Zona Industrial → Planta Norte",
        vehiculo: "Bus Mercedes Benz 2023 - UIO789",
        fecha: "2024-02-03",
        estado: "completado"
      }
    ]
  },
  {
    id: 4,
    numero: "CC-2024-014",
    proveedor: "FLOTA CORPORATIVA EXPRESS",
    fecha_aprobacion: "2024-02-04",
    valor_total: 3200000,
    estado: "aprobado",
    servicios: [
      {
        id: "SRV-014",
        descripcion: "Servicios de transporte ejecutivo mensual",
        valor: 3200000,
        ruta: "Múltiples rutas corporativas",
        vehiculo: "Flota Toyota Prado 2023",
        fecha: "2024-02-04",
        estado: "completado"
      }
    ]
  },
  {
    id: 5,
    numero: "CC-2024-015",
    proveedor: "TRANSPORTE DE CARGA PESADA",
    fecha_aprobacion: "2024-02-05",
    valor_total: 450000,
    estado: "aprobado",
    servicios: [
      {
        id: "SRV-015",
        descripcion: "Transporte de maquinaria pesada",
        valor: 450000,
        ruta: "Puerto → Zona Industrial",
        vehiculo: "Cama baja Kenworth 2022 - ASD123",
        fecha: "2024-02-05",
        estado: "completado",
        carga: "Maquinaria industrial - 25 toneladas"
      }
    ]
  }
]

const lotesExistentes = [
  { id: 1, numero: "LP-2024-006", descripcion: "Lote servicios febrero" },
  { id: 2, numero: "LP-2024-007", descripcion: "Lote proveedores tecnología" },
  { id: 3, numero: "LP-2024-008", descripcion: "Lote servicios generales" }
]

const columns = [
  { key: "numero", label: "No. Cuenta", sortable: true },
  { key: "proveedor", label: "Proveedor", sortable: true },
  { key: "fecha_aprobacion", label: "Fecha Aprobación", sortable: true },
  { key: "servicios", label: "Servicios", sortable: false },
  { key: "valor_total", label: "Valor Total", sortable: true },
  { key: "estado", label: "Estado", sortable: true }
]

export default function SinLote() {
  const [selectedCuentas, setSelectedCuentas] = useState<number[]>([])
  const [showMoveDialog, setShowMoveDialog] = useState(false)
  const [showCreateLoteDialog, setShowCreateLoteDialog] = useState(false)
  const [selectedCuentaDetail, setSelectedCuentaDetail] = useState<any>(null)
  const [showCuentaDetail, setShowCuentaDetail] = useState(false)
  const [moveToLote, setMoveToLote] = useState("")
  const [nuevoLote, setNuevoLote] = useState({ numero: "", descripcion: "" })

  const handleSelectCuenta = (cuentaId: number, checked: boolean) => {
    if (checked) {
      setSelectedCuentas(prev => [...prev, cuentaId])
    } else {
      setSelectedCuentas(prev => prev.filter(id => id !== cuentaId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCuentas(cuentasSinLote.map(cuenta => cuenta.id))
    } else {
      setSelectedCuentas([])
    }
  }

  const handleMoveToExistingLote = () => {
    // Implementar lógica para mover cuentas a lote existente
    console.log("Mover cuentas a lote existente:", selectedCuentas, moveToLote)
    setShowMoveDialog(false)
    setSelectedCuentas([])
    setMoveToLote("")
  }

  const handleCreateLoteWithCuentas = () => {
    // Implementar lógica para crear lote nuevo con cuentas seleccionadas
    console.log("Crear lote nuevo con cuentas:", selectedCuentas, nuevoLote)
    setShowCreateLoteDialog(false)
    setSelectedCuentas([])
    setNuevoLote({ numero: "", descripcion: "" })
  }

  const totalSeleccionado = selectedCuentas.reduce((sum, id) => {
    const cuenta = cuentasSinLote.find(c => c.id === id)
    return sum + (cuenta?.valor_total || 0)
  }, 0)

  const renderCell = (key: string, value: any, row: any) => {
    if (key === 'estado') {
      return <Badge variant="success-light">Aprobado</Badge>
    }
    if (key === 'valor_total') {
      return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value)
    }
    if (key === 'fecha_aprobacion') {
      return new Date(value).toLocaleDateString('es-CO')
    }
    if (key === 'servicios') {
      // Handle servicios as array of objects
      if (Array.isArray(value) && value.length > 0) {
        return (
          <span className="text-sm text-muted-foreground">
            {value.length} servicio{value.length !== 1 ? 's' : ''} de transporte
          </span>
        )
      }
      return <span className="text-sm text-muted-foreground">Sin servicios</span>
    }
    return value
  }

  const actions = (row: any) => (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setSelectedCuentaDetail(row)
          setShowCuentaDetail(true)
        }}
      >
        Ver Servicios
      </Button>
      <Checkbox
        checked={selectedCuentas.includes(row.id)}
        onCheckedChange={(checked) => handleSelectCuenta(row.id, checked as boolean)}
      />
    </div>
  )

  const summary = (
    <div className="space-y-4">
      {/* Resumen de cuentas sin lote */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Archive className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Cuentas Sin Lote</p>
                <p className="text-2xl font-semibold">{cuentasSinLote.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Valor Total</p>
            <p className="text-xl font-semibold text-primary">
              {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(
                cuentasSinLote.reduce((sum, cuenta) => sum + cuenta.valor_total, 0)
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Seleccionadas</p>
            <p className="text-xl font-semibold text-success">
              {selectedCuentas.length} / {cuentasSinLote.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Controles de selección */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedCuentas.length === cuentasSinLote.length}
                  onCheckedChange={handleSelectAll}
                />
                <Label>Seleccionar todas</Label>
              </div>
              
              {selectedCuentas.length > 0 && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Valor seleccionado: </span>
                  <span className="font-semibold text-primary">
                    {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(totalSeleccionado)}
                  </span>
                </div>
              )}
            </div>
            
            {selectedCuentas.length > 0 && (
              <div className="flex gap-2">
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => setShowMoveDialog(true)}
                >
                  <MoveRight className="h-4 w-4 mr-2" />
                  Mover a Lote
                </Button>
                
                <Button 
                  size="sm"
                  onClick={() => setShowCreateLoteDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Lote
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Vista principal
  if (!showMoveDialog && !showCreateLoteDialog && !showCuentaDetail) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sin Lote de Pago</h1>
          <p className="text-muted-foreground">Cuentas de cobro aprobadas que aún no están asociadas a ningún lote</p>
        </div>

        <DataTable
          title="Cuentas Sin Lote de Pago"
          columns={columns}
          data={cuentasSinLote}
          actions={actions}
          renderCell={renderCell}
          summary={summary}
          searchable={true}
          filterable={false}
          exportable={true}
        />
      </div>
    )
  }

  // Vista de mover a lote existente
  if (showMoveDialog) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowMoveDialog(false)}
          >
            ← Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Mover a Lote Existente</h1>
            <p className="text-muted-foreground">Selecciona el lote de destino para las cuentas seleccionadas</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Cuentas Seleccionadas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-accent/50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Cuentas seleccionadas:</span>
                <span className="font-medium">{selectedCuentas.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Valor total:</span>
                <span className="text-lg font-bold text-primary">
                  {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(totalSeleccionado)}
                </span>
              </div>
            </div>
            
            <div>
              <Label htmlFor="lote">Seleccionar Lote de Destino</Label>
              <Select value={moveToLote} onValueChange={setMoveToLote}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un lote..." />
                </SelectTrigger>
                <SelectContent>
                  {lotesExistentes.map((lote) => (
                    <SelectItem key={lote.id} value={lote.numero}>
                      {lote.numero} - {lote.descripcion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowMoveDialog(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleMoveToExistingLote}
                disabled={!moveToLote}
              >
                <MoveRight className="h-4 w-4 mr-2" />
                Mover Cuentas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Vista de crear nuevo lote
  if (showCreateLoteDialog) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowCreateLoteDialog(false)}
          >
            ← Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Crear Nuevo Lote</h1>
            <p className="text-muted-foreground">Crear un nuevo lote con las cuentas seleccionadas</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del Nuevo Lote</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-accent/50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Cuentas a incluir:</span>
                <span className="font-medium">{selectedCuentas.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Valor total:</span>
                <span className="text-lg font-bold text-primary">
                  {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(totalSeleccionado)}
                </span>
              </div>
            </div>
            
            <div>
              <Label htmlFor="numero">Número del Lote</Label>
              <Input
                id="numero"
                value={nuevoLote.numero}
                onChange={(e) => setNuevoLote(prev => ({ ...prev, numero: e.target.value }))}
                placeholder="Ej: LP-2024-009"
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
            
            <div className="bg-accent/50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Cuentas a incluir:</h4>
              <div className="space-y-1 text-sm">
                {selectedCuentas.map(id => {
                  const cuenta = cuentasSinLote.find(c => c.id === id)
                  return cuenta ? (
                    <div key={id} className="flex justify-between">
                      <span>{cuenta.numero} - {cuenta.proveedor}</span>
                      <span className="font-medium">
                        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(cuenta.valor_total)}
                      </span>
                    </div>
                  ) : null
                })}
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateLoteDialog(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleCreateLoteWithCuentas}
                disabled={!nuevoLote.numero || !nuevoLote.descripcion}
              >
                <Package className="h-4 w-4 mr-2" />
                Crear Lote
              </Button>
            </div>
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
            }}
          >
            ← Volver a Lista
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
                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedCuentaDetail.valor_total)}
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
                          <Badge variant="success">
                            {servicio.estado === 'completado' ? 'Completado' : 'En Proceso'}
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
                            <Badge variant="success">
                              Servicio Completado
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