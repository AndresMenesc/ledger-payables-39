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
      { numero: "CC-2024-001", proveedor: "Tecnología Avanzada S.A.S", valor: 2500000 },
      { numero: "CC-2024-002", proveedor: "Servicios Integrales LTDA", valor: 1800000 },
      { numero: "CC-2024-004", proveedor: "Consultoría Pro", valor: 4200000 }
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
      { numero: "CC-2024-005", proveedor: "Materiales XYZ", valor: 1500000 },
      { numero: "CC-2024-006", proveedor: "Transporte ABC", valor: 2200000 }
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
    fechas: "2025-02-01 2025-02-28"
  },
  { 
    numero: "CC-2024-008", 
    proveedor: "ALEXANDER PERDOMO VARGAS", 
    valor: 4063500, 
    prestamos: 142223,
    descuentoReteFuente: 142223,
    totalNeto: 3921277,
    centroCosto: "AMERICAS BUSINESS PROCESS SERVICES",
    fechas: "2025-02-01 2025-02-28"
  },
  { 
    numero: "CC-2024-009", 
    proveedor: "DERLY TATIANA MENDEZ PEREZ", 
    valor: 1123500, 
    prestamos: 0,
    descuentoReteFuente: 0,
    totalNeto: 1123500,
    centroCosto: "BANCO POPULAR BOGOTA",
    fechas: "2025-02-01 2025-02-28"
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
  const [showCreateLote, setShowCreateLote] = useState(false)
  const [showAddCuenta, setShowAddCuenta] = useState(false)
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
              Detalle del Lote - {selectedLote?.numero}
            </DialogTitle>
          </DialogHeader>
          
          {selectedLote && (
            <div className="space-y-6">
              {/* Información del Lote */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información del Lote</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                </CardContent>
              </Card>

              {/* Cuentas en el Lote */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Cuentas de Cobro</CardTitle>
                    <Button 
                      size="sm"
                      onClick={() => {
                        setLoteToAddCuenta(selectedLote)
                        setShowAddCuenta(true)
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Cuenta
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedLote.cuentas.map((cuenta: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{cuenta.numero}</h4>
                            <p className="text-sm text-muted-foreground">{cuenta.proveedor}</p>
                          </div>
                          <p className="text-lg font-semibold text-primary">
                            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(cuenta.valor)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Valor Total del Lote</p>
                      <p className="text-2xl font-bold text-primary">
                        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedLote.valor_total)}
                      </p>
                    </div>
                    
                    <Button variant="success">
                      Enviar para Aprobación
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <Button 
        size="sm"
        onClick={() => {
          setLoteToAddCuenta(row)
          setShowAddCuenta(true)
        }}
      >
        <Plus className="h-4 w-4 mr-2" />
        Agregar
      </Button>
    </div>
  )

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

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pagos por Procesar</h1>
        <p className="text-muted-foreground">Crea y gestiona lotes de pagos</p>
      </div>

      <DataTable
        title="Lotes de Pagos"
        columns={columns}
        data={lotesPago}
        actions={actions}
        summary={summary}
      />

      {/* Dialog para crear nuevo lote */}
      <Dialog open={showCreateLote} onOpenChange={setShowCreateLote}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Lote de Pago</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
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
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para agregar cuenta al lote */}
      <Dialog open={showAddCuenta} onOpenChange={setShowAddCuenta}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Agregar Cuenta al Lote {loteToAddCuenta?.numero}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Seleccionar Cuenta de Cobro</Label>
              <Select onValueChange={(value) => {
                const cuenta = cuentasDisponibles.find(c => c.numero === value)
                setSelectedCuentaToAdd(cuenta)
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una cuenta..." />
                </SelectTrigger>
                <SelectContent>
                  {cuentasDisponibles.map((cuenta) => (
                    <SelectItem key={cuenta.numero} value={cuenta.numero}>
                      {cuenta.numero} - {cuenta.proveedor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCuentaToAdd && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resumen de la Cuenta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Proveedor</p>
                      <p className="font-medium">{selectedCuentaToAdd.proveedor}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Número</p>
                      <p className="font-medium">{selectedCuentaToAdd.numero}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Centro de Costo</p>
                        <p className="font-medium text-sm">{selectedCuentaToAdd.centroCosto}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Fechas</p>
                        <p className="font-medium text-sm">{selectedCuentaToAdd.fechas}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Pagado:</span>
                        <span className="font-semibold">
                          {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedCuentaToAdd.valor)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-destructive">
                        <span>Descuento retafuente:</span>
                        <span className="font-semibold">
                          {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedCuentaToAdd.descuentoReteFuente)}
                        </span>
                      </div>
                      
                      {selectedCuentaToAdd.prestamos > 0 && (
                        <>
                          <div className="flex justify-between text-success">
                            <span>Valor prestamo:</span>
                            <span className="font-semibold">
                              {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedCuentaToAdd.prestamos)}
                            </span>
                          </div>
                          <div className="flex justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowCreatePrestamo(true)}
                            >
                              <DollarSign className="h-4 w-4 mr-2" />
                              Gestionar Préstamo
                            </Button>
                          </div>
                        </>
                      )}
                      
                      <Separator />
                      
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total neto:</span>
                        <span className="text-primary">
                          {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedCuentaToAdd.totalNeto)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddCuenta(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleAddCuentaToLote}
                disabled={!selectedCuentaToAdd}
              >
                Agregar al Lote
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para gestión de préstamos */}
      <Dialog open={showPrestamosManager} onOpenChange={setShowPrestamosManager}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gestión de Préstamos</DialogTitle>
          </DialogHeader>
          <PrestamosManager />
        </DialogContent>
      </Dialog>

      {/* Dialog para crear préstamo desde cuenta */}
      <Dialog open={showCreatePrestamo} onOpenChange={setShowCreatePrestamo}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Gestionar Préstamo - {selectedCuentaToAdd?.proveedor}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Préstamo actual del proveedor:</p>
                <p className="text-xl font-bold text-success">
                  {selectedCuentaToAdd && new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedCuentaToAdd.prestamos)}
                </p>
              </CardContent>
            </Card>
            
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
                onClick={() => setShowCreatePrestamo(false)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}