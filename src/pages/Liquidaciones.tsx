import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { 
  Search, Filter, Eye, FileText, CheckCircle, 
  Calendar, Building2, MapPin, TrendingUp, Download
} from "lucide-react"

// Mock data para liquidaciones
const mockLiquidaciones = [
  {
    id: "LIQ-2024-001",
    contrato: "TRANSPORTES DEL CARIBE LTDA",
    ciudad: "BARRANQUILLA",
    periodo: { desde: "2024-01-01", hasta: "2024-01-31" },
    valores: { cobrado: 2850000, pagado: 2150000, utilidad: 700000 },
    creador: "JUAN PÉREZ",
    fechaCreacion: "2024-02-01T10:30:00",
    estado: "PENDIENTE",
    rentabilidad: 24.6
  },
  {
    id: "LIQ-2024-002", 
    contrato: "SERVICIOS LOGÍSTICOS DEL NORTE SAS",
    ciudad: "CARTAGENA",
    periodo: { desde: "2024-01-15", hasta: "2024-02-15" },
    valores: { cobrado: 3200000, pagado: 2400000, utilidad: 800000 },
    creador: "MARÍA GARCÍA",
    fechaCreacion: "2024-02-16T14:20:00",
    estado: "APROBADA",
    rentabilidad: 25.0
  },
  {
    id: "LIQ-2024-003",
    contrato: "TRANSPORTES MAGDALENA LIMITADA",
    ciudad: "SANTA MARTA",
    periodo: { desde: "2024-02-01", hasta: "2024-02-28" },
    valores: { cobrado: 1950000, pagado: 1450000, utilidad: 500000 },
    creador: "CARLOS RODRÍGUEZ",
    fechaCreacion: "2024-03-01T09:15:00",
    estado: "FACTURADA",
    rentabilidad: 25.6
  },
  {
    id: "LIQ-2024-004",
    contrato: "FLOTA ATLÁNTICO EMPRESARIAL",
    ciudad: "SOLEDAD",
    periodo: { desde: "2024-02-15", hasta: "2024-03-15" },
    valores: { cobrado: 2750000, pagado: 2100000, utilidad: 650000 },
    creador: "ANA LÓPEZ",
    fechaCreacion: "2024-03-16T16:45:00",
    estado: "PENDIENTE",
    rentabilidad: 23.6
  }
]

const estadosBadge = {
  PENDIENTE: { variant: "secondary" as const, className: "bg-warning-light text-warning border-warning/20" },
  APROBADA: { variant: "secondary" as const, className: "bg-success-light text-success border-success/20" },
  FACTURADA: { variant: "secondary" as const, className: "bg-pending-light text-pending border-pending/20" },
  RECHAZADA: { variant: "secondary" as const, className: "bg-destructive/10 text-destructive border-destructive/20" }
}

export default function Liquidaciones() {
  const [searchTerm, setSearchTerm] = useState("")
  const [estadoFilter, setEstadoFilter] = useState("todos")
  const [selectedLiquidacion, setSelectedLiquidacion] = useState<any>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{ type: string, item: any } | null>(null)

  // Filtrar liquidaciones
  const liquidacionesFiltradas = mockLiquidaciones.filter(liquidacion => {
    const matchSearch = liquidacion.contrato.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       liquidacion.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       liquidacion.ciudad.toLowerCase().includes(searchTerm.toLowerCase())
    const matchEstado = estadoFilter === "todos" || liquidacion.estado === estadoFilter
    return matchSearch && matchEstado
  })

  const handleApprove = (item: any) => {
    setConfirmAction({ type: 'aprobar', item })
    setShowConfirmDialog(true)
  }

  const handleInvoice = (item: any) => {
    setConfirmAction({ type: 'facturar', item })
    setShowConfirmDialog(true)
  }

  const handleConfirm = () => {
    if (confirmAction) {
      console.log(`Acción ${confirmAction.type} confirmada para:`, confirmAction.item)
    }
    setShowConfirmDialog(false)
    setConfirmAction(null)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    })
  }

  // Calcular totales
  const totales = liquidacionesFiltradas.reduce((acc, item) => ({
    cobrado: acc.cobrado + item.valores.cobrado,
    pagado: acc.pagado + item.valores.pagado,
    utilidad: acc.utilidad + item.valores.utilidad
  }), { cobrado: 0, pagado: 0, utilidad: 0 })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Liquidaciones</h1>
          <p className="text-muted-foreground mt-1">Gestión y control de liquidaciones de contratos</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {liquidacionesFiltradas.length} liquidaciones
          </Badge>
          <Button className="bg-primary hover:bg-primary-hover">
            <FileText className="h-4 w-4 mr-2" />
            Nueva Liquidación
          </Button>
        </div>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Cobrado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{formatCurrency(totales.cobrado)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pagado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(totales.pagado)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Utilidad Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{formatCurrency(totales.utilidad)}</div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              {((totales.utilidad / totales.cobrado) * 100).toFixed(1)}% rentabilidad promedio
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por contrato, número o ciudad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                  <SelectItem value="APROBADA">Aprobada</SelectItem>
                  <SelectItem value="FACTURADA">Facturada</SelectItem>
                  <SelectItem value="RECHAZADA">Rechazada</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de liquidaciones */}
      <div className="grid gap-4">
        {liquidacionesFiltradas.map((liquidacion) => (
          <Card key={liquidacion.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Información principal */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h3 className="font-semibold text-lg">{liquidacion.id}</h3>
                    <Badge {...estadosBadge[liquidacion.estado as keyof typeof estadosBadge]}>
                      {liquidacion.estado}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{liquidacion.contrato}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{liquidacion.ciudad}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(liquidacion.periodo.desde)} - {formatDate(liquidacion.periodo.hasta)}</span>
                    </div>
                  </div>
                </div>

                {/* Valores financieros */}
                <div className="grid grid-cols-3 gap-4 text-center lg:text-right">
                  <div>
                    <p className="text-xs text-muted-foreground">Cobrado</p>
                    <p className="font-semibold text-success">{formatCurrency(liquidacion.valores.cobrado)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Pagado</p>
                    <p className="font-semibold text-primary">{formatCurrency(liquidacion.valores.pagado)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Utilidad</p>
                    <p className="font-semibold text-warning">{formatCurrency(liquidacion.valores.utilidad)}</p>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-col sm:flex-row gap-2">
                  {liquidacion.estado === "PENDIENTE" && (
                    <Button 
                      size="sm" 
                      className="bg-success hover:bg-success/90 text-success-foreground"
                      onClick={() => handleApprove(liquidacion)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Aprobar
                    </Button>
                  )}
                  {liquidacion.estado === "APROBADA" && (
                    <Button 
                      size="sm" 
                      className="bg-pending hover:bg-pending/90 text-pending-foreground"
                      onClick={() => handleInvoice(liquidacion)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Facturar
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedLiquidacion(liquidacion)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalles
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de detalles */}
      {selectedLiquidacion && (
        <Dialog open={!!selectedLiquidacion} onOpenChange={() => setSelectedLiquidacion(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Detalles de Liquidación {selectedLiquidacion.id}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Información del contrato */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Contrato</label>
                  <p className="font-medium">{selectedLiquidacion.contrato}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Ciudad</label>
                  <p>{selectedLiquidacion.ciudad}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Período</label>
                  <p>{formatDate(selectedLiquidacion.periodo.desde)} - {formatDate(selectedLiquidacion.periodo.hasta)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Estado</label>
                  <Badge {...estadosBadge[selectedLiquidacion.estado as keyof typeof estadosBadge]}>
                    {selectedLiquidacion.estado}
                  </Badge>
                </div>
              </div>

              {/* Valores financieros */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Valor Cobrado</p>
                  <p className="text-lg font-bold text-success">{formatCurrency(selectedLiquidacion.valores.cobrado)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Valor Pagado</p>
                  <p className="text-lg font-bold text-primary">{formatCurrency(selectedLiquidacion.valores.pagado)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Utilidad</p>
                  <p className="text-lg font-bold text-warning">{formatCurrency(selectedLiquidacion.valores.utilidad)}</p>
                </div>
              </div>

              {/* Información adicional */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Rentabilidad</label>
                  <p className="text-lg font-semibold">{selectedLiquidacion.rentabilidad}%</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Creado por</label>
                  <p>{selectedLiquidacion.creador}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(selectedLiquidacion.fechaCreacion)}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de confirmación */}
      {showConfirmDialog && confirmAction && (
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Acción</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Está seguro que desea {confirmAction.type} la liquidación {confirmAction.item.id}?
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm"><strong>Contrato:</strong> {confirmAction.item.contrato}</p>
                  <p className="text-sm"><strong>Utilidad:</strong> {formatCurrency(confirmAction.item.valores.utilidad)}</p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleConfirm}
                className={confirmAction.type === 'aprobar' ? 'bg-success hover:bg-success/90' : 'bg-pending hover:bg-pending/90'}
              >
                {confirmAction.type === 'aprobar' ? 'Aprobar' : 'Facturar'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}