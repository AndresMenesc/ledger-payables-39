import { useState } from "react"
import { Plus, Eye, Calendar, DollarSign, FileText, History } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "./DataTable"

// Datos de ejemplo de préstamos
const prestamosData = [
  {
    id: 1434,
    proveedor: "DORIS DE LA CRUZ ROMERO",
    total: 194714,
    cuotas: 1,
    valorCuota: 194714,
    abono: 0,
    pendiente: 194714,
    fechaSolicitud: "2025-03-27",
    esAnticipo: true,
    estado: "activo",
    motivo: "Anticipo para viajes de trabajo",
    items: [
      {
        consecutivo: 403,
        fecha: "2025-03-27 22:59:56",
        creadoPor: "Marian kei dominguez moreno",
        concepto: "Horas extras juan duque febrero gfp979",
        valor: 194714
      }
    ]
  },
  {
    id: 1435,
    proveedor: "ALBERTO JOSE TAMARA CABARCAS",
    total: 2821500,
    cuotas: 3,
    valorCuota: 940500,
    abono: 940500,
    pendiente: 1881000,
    fechaSolicitud: "2025-02-01",
    esAnticipo: false,
    estado: "en_proceso",
    motivo: "Préstamo para equipos de viaje",
    items: []
  }
]

const proveedoresViaje = [
  "ALBERTO JOSE TAMARA CABARCAS",
  "ALEXANDER PERDOMO VARGAS", 
  "ANTONIO MARÍA PARADA ROPERO",
  "CESAR IGNACIO SOLANO BUITRAGO",
  "CRISTIAN DAVID CUESTA GARAVITO",
  "DERLY TATIANA MENDEZ PEREZ",
  "DIANA MILENA GALEANO GIRALDO",
  "DORIS DE LA CRUZ ROMERO"
]

const columnasPrestamos = [
  { key: "id", label: "Consecutivo", sortable: true },
  { key: "proveedor", label: "Proveedor", sortable: true },
  { key: "total", label: "Total", sortable: true },
  { key: "pendiente", label: "Pendiente", sortable: true },
  { key: "cuotas", label: "Cuotas", sortable: true },
  { key: "fechaSolicitud", label: "Fecha", sortable: true },
  { key: "estado", label: "Estado", sortable: true }
]

interface PrestamosManagerProps {
  onSelectPrestamo?: (prestamo: any) => void
  showCreateButton?: boolean
  mode?: "select" | "manage"
}

export default function PrestamosManager({ onSelectPrestamo, showCreateButton = true, mode = "manage" }: PrestamosManagerProps) {
  const [showCreatePrestamo, setShowCreatePrestamo] = useState(false)
  const [showDetallePrestamo, setShowDetallePrestamo] = useState(false)
  const [selectedPrestamo, setSelectedPrestamo] = useState<any>(null)
  const [nuevoPrestamo, setNuevoPrestamo] = useState({
    proveedor: "",
    total: "",
    cuotas: "1",
    valorCuota: "",
    fechaSolicitud: new Date().toISOString().split('T')[0],
    esAnticipo: false,
    valorPrestamo: "",
    motivo: ""
  })

  const handleCreatePrestamo = () => {
    console.log("Crear nuevo préstamo:", nuevoPrestamo)
    setShowCreatePrestamo(false)
    setNuevoPrestamo({
      proveedor: "",
      total: "",
      cuotas: "1", 
      valorCuota: "",
      fechaSolicitud: new Date().toISOString().split('T')[0],
      esAnticipo: false,
      valorPrestamo: "",
      motivo: ""
    })
  }

  const calcularValorCuota = () => {
    const total = parseFloat(nuevoPrestamo.total) || 0
    const cuotas = parseInt(nuevoPrestamo.cuotas) || 1
    return (total / cuotas).toFixed(0)
  }

  const actions = (row: any) => (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setSelectedPrestamo(row)
          setShowDetallePrestamo(true)
        }}
      >
        <Eye className="h-4 w-4 mr-2" />
        Consultar
      </Button>
      {mode === "select" && onSelectPrestamo && (
        <Button
          size="sm"
          onClick={() => onSelectPrestamo(row)}
        >
          Seleccionar
        </Button>
      )}
    </div>
  )

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value)
  }

  const summary = showCreateButton ? (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Préstamos</p>
              <p className="text-2xl font-semibold">{prestamosData.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Valor Pendiente</p>
          <p className="text-xl font-semibold text-primary">
            {formatCurrency(prestamosData.reduce((sum, prestamo) => sum + prestamo.pendiente, 0))}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <Button 
            className="w-full"
            onClick={() => setShowCreatePrestamo(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear Préstamo
          </Button>
        </CardContent>
      </Card>
    </div>
  ) : undefined

  return (
    <div className="space-y-6">
      <DataTable
        title="Gestión de Préstamos - Servicios de Viaje"
        columns={columnasPrestamos}
        data={prestamosData}
        actions={actions}
        summary={summary}
      />

      {/* Dialog para crear nuevo préstamo */}
      <Dialog open={showCreatePrestamo} onOpenChange={setShowCreatePrestamo}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-destructive">Crear un prestamo</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Columna 1: Proveedor y Total */}
            <div className="space-y-4">
              <div>
                <Label>Proveedor</Label>
                <Select 
                  value={nuevoPrestamo.proveedor}
                  onValueChange={(value) => setNuevoPrestamo(prev => ({ ...prev, proveedor: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {proveedoresViaje.map((proveedor) => (
                      <SelectItem key={proveedor} value={proveedor}>
                        {proveedor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Total</Label>
                <Input
                  type="number"
                  value={nuevoPrestamo.total}
                  onChange={(e) => {
                    const total = e.target.value
                    setNuevoPrestamo(prev => ({ 
                      ...prev, 
                      total,
                      valorCuota: total && prev.cuotas ? (parseFloat(total) / parseInt(prev.cuotas)).toFixed(0) : ""
                    }))
                  }}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Columna 2: Cuotas y Valor cuota */}
            <div className="space-y-4">
              <div>
                <Label>Cuotas</Label>
                <Select 
                  value={nuevoPrestamo.cuotas}
                  onValueChange={(value) => {
                    setNuevoPrestamo(prev => ({ 
                      ...prev, 
                      cuotas: value,
                      valorCuota: prev.total ? (parseFloat(prev.total) / parseInt(value)).toFixed(0) : ""
                    }))
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6,12].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Valor cuota (Aprox)</Label>
                <Input
                  type="number"
                  value={nuevoPrestamo.valorCuota}
                  readOnly
                  placeholder="0"
                />
              </div>
            </div>

            {/* Columna 3: Resumen */}
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Abono</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Pendiente</span>
                  <span className="font-semibold text-primary">{nuevoPrestamo.total || "0"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Fecha de solicitud</Label>
              <Input
                type="date"
                value={nuevoPrestamo.fechaSolicitud}
                onChange={(e) => setNuevoPrestamo(prev => ({ ...prev, fechaSolicitud: e.target.value }))}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="esAnticipo"
                checked={nuevoPrestamo.esAnticipo}
                onCheckedChange={(checked) => setNuevoPrestamo(prev => ({ ...prev, esAnticipo: !!checked }))}
              />
              <Label htmlFor="esAnticipo">Es anticipo ?</Label>
            </div>

            <Button variant="outline" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Detalle de ítems
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Valor del prestamo</Label>
                <Input
                  type="number"
                  value={nuevoPrestamo.valorPrestamo}
                  onChange={(e) => setNuevoPrestamo(prev => ({ ...prev, valorPrestamo: e.target.value }))}
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Motivo del prestamo</Label>
                <Textarea
                  value={nuevoPrestamo.motivo}
                  onChange={(e) => setNuevoPrestamo(prev => ({ ...prev, motivo: e.target.value }))}
                  placeholder="Describa el motivo del préstamo"
                  className="min-h-[80px]"
                />
              </div>
            </div>

            <Button 
              className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              onClick={handleCreatePrestamo}
            >
              Generar prestamo
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para consultar préstamo */}
      <Dialog open={showDetallePrestamo} onOpenChange={setShowDetallePrestamo}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Consultar prestamo #{selectedPrestamo?.id}
            </DialogTitle>
          </DialogHeader>
          
          {selectedPrestamo && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Columna 1: Proveedor y Total */}
                <div className="space-y-4">
                  <div>
                    <Label>Proveedor</Label>
                    <Select value={selectedPrestamo.proveedor} disabled>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Total</Label>
                    <Input
                      value={selectedPrestamo.total.toString()}
                      disabled
                    />
                  </div>
                </div>

                {/* Columna 2: Cuotas y Valor cuota */}
                <div className="space-y-4">
                  <div>
                    <Label>Cuotas</Label>
                    <Select value={selectedPrestamo.cuotas.toString()} disabled>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Valor cuota (Aprox)</Label>
                    <Input
                      value={selectedPrestamo.valorCuota.toString()}
                      disabled
                    />
                  </div>
                </div>

                {/* Columna 3: Resumen */}
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Abono</span>
                      <span className="font-semibold">{selectedPrestamo.abono}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Pendiente</span>
                      <span className="font-semibold text-primary">{selectedPrestamo.pendiente}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label>Fecha de solicitud</Label>
                <Input
                  type="date"
                  value={selectedPrestamo.fechaSolicitud}
                  disabled
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="esAnticipoDetalle"
                  checked={selectedPrestamo.esAnticipo}
                  disabled
                />
                <Label htmlFor="esAnticipoDetalle">Es anticipo ?</Label>
              </div>

              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Detalle de ítems
              </Button>

              {/* Tabla de items del préstamo */}
              {selectedPrestamo.items && selectedPrestamo.items.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Detalle de ítems</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Consecutivo</th>
                            <th className="text-left p-2">Fecha - hora</th>
                            <th className="text-left p-2">Creado por</th>
                            <th className="text-left p-2">Concepto</th>
                            <th className="text-right p-2">Valor</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedPrestamo.items.map((item: any, index: number) => (
                            <tr key={index} className="border-b">
                              <td className="p-2">{item.consecutivo}</td>
                              <td className="p-2">{item.fecha}</td>
                              <td className="p-2">{item.creadoPor}</td>
                              <td className="p-2">{item.concepto}</td>
                              <td className="p-2 text-right">{formatCurrency(item.valor)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        Descuentos: 1/1
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}