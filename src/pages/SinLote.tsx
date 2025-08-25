import { useState } from "react"
import { MoveRight, Package, Plus, Archive } from "lucide-react"
import { DataTable } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

// Datos de ejemplo
const cuentasSinLote = [
  {
    id: 1,
    numero: "CC-2024-011",
    proveedor: "Consultoría Digital S.A.S",
    fecha_aprobacion: "2024-02-01",
    valor_total: 1800000,
    estado: "aprobado",
    servicios: "Desarrollo web, Consultoría técnica"
  },
  {
    id: 2,
    numero: "CC-2024-012",
    proveedor: "Suministros Oficina LTDA",
    fecha_aprobacion: "2024-02-02",
    valor_total: 650000,
    estado: "aprobado",
    servicios: "Material de oficina, Papelería"
  },
  {
    id: 3,
    numero: "CC-2024-013",
    proveedor: "Servicios de Limpieza Pro",
    fecha_aprobacion: "2024-02-03",
    valor_total: 1200000,
    estado: "aprobado",
    servicios: "Servicios de aseo"
  },
  {
    id: 4,
    numero: "CC-2024-014",
    proveedor: "Tecnología Avanzada S.A.S",
    fecha_aprobacion: "2024-02-04",
    valor_total: 3200000,
    estado: "aprobado",
    servicios: "Licencias software, Soporte técnico"
  },
  {
    id: 5,
    numero: "CC-2024-015",
    proveedor: "Transporte Ejecutivo",
    fecha_aprobacion: "2024-02-05",
    valor_total: 450000,
    estado: "aprobado",
    servicios: "Servicios de transporte"
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
      return <span className="text-sm text-muted-foreground">{value}</span>
    }
    return value
  }

  const actions = (row: any) => (
    <div className="flex items-center gap-2">
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

      {/* Dialog para mover a lote existente */}
      <Dialog open={showMoveDialog} onOpenChange={setShowMoveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mover a Lote Existente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Cuentas seleccionadas: {selectedCuentas.length}
              </p>
              <p className="text-sm font-medium">
                Valor total: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(totalSeleccionado)}
              </p>
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
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para crear nuevo lote */}
      <Dialog open={showCreateLoteDialog} onOpenChange={setShowCreateLoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Lote con Cuentas Seleccionadas</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Cuentas a incluir: {selectedCuentas.length}
              </p>
              <p className="text-sm font-medium">
                Valor total: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(totalSeleccionado)}
              </p>
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
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}