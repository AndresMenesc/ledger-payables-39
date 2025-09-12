import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { 
  Search, Filter, Eye, FileText, Download, 
  Calendar, Building2, MapPin, DollarSign, Hash,
  ExternalLink, Printer
} from "lucide-react"

// Mock data para facturas
const mockFacturas = [
  {
    id: "FAC-2024-001",
    numero: "F001-00000234",
    contrato: "TRANSPORTES DEL CARIBE LTDA",
    liquidacion: "LIQ-2024-001",
    ciudad: "BARRANQUILLA",
    fechaEmision: "2024-02-15T00:00:00",
    fechaVencimiento: "2024-03-15T00:00:00",
    valor: 2850000,
    iva: 541500,
    total: 3391500,
    estado: "PAGADA",
    metodoPago: "TRANSFERENCIA",
    fechaPago: "2024-02-28T00:00:00"
  },
  {
    id: "FAC-2024-002",
    numero: "F001-00000235", 
    contrato: "SERVICIOS LOGÍSTICOS DEL NORTE SAS",
    liquidacion: "LIQ-2024-002",
    ciudad: "CARTAGENA",
    fechaEmision: "2024-02-20T00:00:00",
    fechaVencimiento: "2024-03-20T00:00:00",
    valor: 3200000,
    iva: 608000,
    total: 3808000,
    estado: "PENDIENTE",
    metodoPago: null,
    fechaPago: null
  },
  {
    id: "FAC-2024-003",
    numero: "F001-00000236",
    contrato: "TRANSPORTES MAGDALENA LIMITADA",
    liquidacion: "LIQ-2024-003",
    ciudad: "SANTA MARTA",
    fechaEmision: "2024-03-01T00:00:00",
    fechaVencimiento: "2024-03-31T00:00:00",
    valor: 1950000,
    iva: 370500,
    total: 2320500,
    estado: "VENCIDA",
    metodoPago: null,
    fechaPago: null
  },
  {
    id: "FAC-2024-004",
    numero: "F001-00000237",
    contrato: "FLOTA ATLÁNTICO EMPRESARIAL",
    liquidacion: "LIQ-2024-004",
    ciudad: "SOLEDAD", 
    fechaEmision: "2024-03-16T00:00:00",
    fechaVencimiento: "2024-04-16T00:00:00",
    valor: 2750000,
    iva: 522500,
    total: 3272500,
    estado: "EMITIDA",
    metodoPago: null,
    fechaPago: null
  }
]

const estadosBadge = {
  EMITIDA: { variant: "secondary" as const, className: "bg-pending-light text-pending border-pending/20" },
  PENDIENTE: { variant: "secondary" as const, className: "bg-warning-light text-warning border-warning/20" },
  PAGADA: { variant: "secondary" as const, className: "bg-success-light text-success border-success/20" },
  VENCIDA: { variant: "secondary" as const, className: "bg-destructive/10 text-destructive border-destructive/20" },
  ANULADA: { variant: "secondary" as const, className: "bg-muted text-muted-foreground border-muted" }
}

export default function Facturas() {
  const [searchTerm, setSearchTerm] = useState("")
  const [estadoFilter, setEstadoFilter] = useState("todos")
  const [selectedFactura, setSelectedFactura] = useState<any>(null)
  const [showPdfViewer, setShowPdfViewer] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{ type: string, item: any } | null>(null)

  // Filtrar facturas
  const facturasFiltradas = mockFacturas.filter(factura => {
    const matchSearch = factura.contrato.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       factura.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       factura.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       factura.ciudad.toLowerCase().includes(searchTerm.toLowerCase())
    const matchEstado = estadoFilter === "todos" || factura.estado === estadoFilter
    return matchSearch && matchEstado
  })

  const handleViewPdf = (factura: any) => {
    setSelectedFactura(factura)
    setShowPdfViewer(true)
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
      month: 'short', 
      day: 'numeric'
    })
  }

  // Calcular totales
  const totales = facturasFiltradas.reduce((acc, item) => ({
    valor: acc.valor + item.valor,
    iva: acc.iva + item.iva,
    total: acc.total + item.total
  }), { valor: 0, iva: 0, total: 0 })

  const conteoEstados = facturasFiltradas.reduce((acc, item) => {
    acc[item.estado] = (acc[item.estado] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Facturas</h1>
          <p className="text-muted-foreground mt-1">Gestión y control de facturación de servicios</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {facturasFiltradas.length} facturas
          </Badge>
          <Button className="bg-primary hover:bg-primary-hover">
            <FileText className="h-4 w-4 mr-2" />
            Nueva Factura
          </Button>
        </div>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Valor Neto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(totales.valor)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">IVA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{formatCurrency(totales.iva)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Facturado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{formatCurrency(totales.total)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Estados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {Object.entries(conteoEstados).map(([estado, cantidad]) => (
                <div key={estado} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{estado}:</span>
                  <span className="font-medium">{cantidad}</span>
                </div>
              ))}
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
                  <SelectItem value="EMITIDA">Emitida</SelectItem>
                  <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                  <SelectItem value="PAGADA">Pagada</SelectItem>
                  <SelectItem value="VENCIDA">Vencida</SelectItem>
                  <SelectItem value="ANULADA">Anulada</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de facturas */}
      <div className="grid gap-4">
        {facturasFiltradas.map((factura) => (
          <Card key={factura.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Información principal */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h3 className="font-semibold text-lg">{factura.numero}</h3>
                    <Badge {...estadosBadge[factura.estado as keyof typeof estadosBadge]}>
                      {factura.estado}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{factura.contrato}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{factura.ciudad}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <span>Liq: {factura.liquidacion}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Emitida: {formatDate(factura.fechaEmision)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Vence: {formatDate(factura.fechaVencimiento)}</span>
                    </div>
                  </div>
                </div>

                {/* Valores financieros */}
                <div className="grid grid-cols-3 gap-4 text-center lg:text-right">
                  <div>
                    <p className="text-xs text-muted-foreground">Valor Neto</p>
                    <p className="font-semibold text-primary">{formatCurrency(factura.valor)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">IVA</p>
                    <p className="font-semibold text-warning">{formatCurrency(factura.iva)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="font-semibold text-success">{formatCurrency(factura.total)}</p>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    onClick={() => handleViewPdf(factura)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Ver PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedFactura(factura)}
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

      {/* Modal de PDF Viewer */}
      {showPdfViewer && selectedFactura && (
        <Dialog open={showPdfViewer} onOpenChange={setShowPdfViewer}>
          <DialogContent className="max-w-4xl h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Factura {selectedFactura.numero}
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                  <Button size="sm" variant="outline">
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimir
                  </Button>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Abrir en nueva ventana
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            {/* PDF Viewer simulado */}
            <div className="flex-1 bg-muted rounded-xl p-8 overflow-auto">
              <div className="bg-card shadow-lg max-w-2xl mx-auto p-8 rounded-2xl border">
                {/* Header de la factura */}
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-primary">FACTURA DE VENTA</h1>
                  <p className="text-lg font-semibold">{selectedFactura.numero}</p>
                </div>

                {/* Información de la empresa */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="font-semibold mb-2">EMPRESA EMISORA</h3>
                    <p className="text-sm">TRANSPORTES UNIDOS S.A.S</p>
                    <p className="text-sm">NIT: 900.123.456-7</p>
                    <p className="text-sm">Carrera 45 # 67-89</p>
                    <p className="text-sm">Barranquilla, Colombia</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">CLIENTE</h3>
                    <p className="text-sm">{selectedFactura.contrato}</p>
                    <p className="text-sm">Ciudad: {selectedFactura.ciudad}</p>
                    <p className="text-sm">Fecha: {formatDate(selectedFactura.fechaEmision)}</p>
                    <p className="text-sm">Vencimiento: {formatDate(selectedFactura.fechaVencimiento)}</p>
                  </div>
                </div>

                {/* Detalles de la factura */}
                <table className="w-full mb-8 text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Descripción</th>
                      <th className="text-right py-2">Cantidad</th>
                      <th className="text-right py-2">Valor Unit.</th>
                      <th className="text-right py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">Servicios de transporte según liquidación {selectedFactura.liquidacion}</td>
                      <td className="text-right py-2">1</td>
                      <td className="text-right py-2">{formatCurrency(selectedFactura.valor)}</td>
                      <td className="text-right py-2">{formatCurrency(selectedFactura.valor)}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Totales */}
                <div className="flex justify-end mb-8">
                  <div className="w-64">
                    <div className="flex justify-between py-1">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(selectedFactura.valor)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>IVA (19%):</span>
                      <span>{formatCurrency(selectedFactura.iva)}</span>
                    </div>
                    <div className="flex justify-between py-2 font-bold border-t">
                      <span>TOTAL:</span>
                      <span>{formatCurrency(selectedFactura.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Información de pago */}
                {selectedFactura.estado === "PAGADA" && selectedFactura.fechaPago && (
                  <div className="bg-success-light p-4 rounded">
                    <h3 className="font-semibold text-success mb-2">INFORMACIÓN DE PAGO</h3>
                    <p className="text-sm">Método: {selectedFactura.metodoPago}</p>
                    <p className="text-sm">Fecha de pago: {formatDate(selectedFactura.fechaPago)}</p>
                  </div>
                )}

                {/* Footer */}
                <div className="text-center text-xs text-muted-foreground mt-8 pt-4 border-t">
                  <p>Esta factura fue generada electrónicamente y tiene validez legal</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de detalles */}
      {selectedFactura && !showPdfViewer && (
        <Dialog open={!!selectedFactura} onOpenChange={() => setSelectedFactura(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Detalles de Factura {selectedFactura.numero}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Número de Factura</label>
                  <p className="font-medium">{selectedFactura.numero}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Liquidación</label>
                  <p>{selectedFactura.liquidacion}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Contrato</label>
                  <p>{selectedFactura.contrato}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Ciudad</label>
                  <p>{selectedFactura.ciudad}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Fecha de Emisión</label>
                  <p>{formatDate(selectedFactura.fechaEmision)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Fecha de Vencimiento</label>
                  <p>{formatDate(selectedFactura.fechaVencimiento)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Estado</label>
                  <Badge {...estadosBadge[selectedFactura.estado as keyof typeof estadosBadge]}>
                    {selectedFactura.estado}
                  </Badge>
                </div>
                {selectedFactura.fechaPago && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Fecha de Pago</label>
                    <p>{formatDate(selectedFactura.fechaPago)}</p>
                  </div>
                )}
              </div>

              {/* Valores financieros */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Valor Neto</p>
                  <p className="text-lg font-bold text-primary">{formatCurrency(selectedFactura.valor)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">IVA (19%)</p>
                  <p className="text-lg font-bold text-warning">{formatCurrency(selectedFactura.iva)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-lg font-bold text-success">{formatCurrency(selectedFactura.total)}</p>
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
                ¿Está seguro que desea realizar esta acción?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirm}>
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}