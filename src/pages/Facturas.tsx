import { useState } from "react"
import { Eye, FileText, Download, Send, Calendar, Filter, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { DataTable } from "@/components/DataTable"
import { Separator } from "@/components/ui/separator"

// Mock data para facturas
const mockFacturas = [
  {
    id: 1,
    numeroFactura: "FEV-1",
    contrato: "AGENCIA DE VIAJES Y TURISMO AVIATUR SAS VIA NORTE",
    ciudad: "BARRANQUILLA",
    desde: "Octubre 21, 2024",
    hasta: "Octubre 21, 2024",
    cobrado: 930000,
    pagado: 730000,
    utilidad: 200000,
    creador: "JOHAN GONZÁLEZ",
    fechaCreacion: "Febrero 24, 2025 4:22 PM",
    estado: "PAGADA",
    numeroFacturaSystem: "2025-01-10"
  },
  {
    id: 2,
    numeroFactura: "FEV-2",
    contrato: "AGENCIA DE VIAJES Y TURISMO AVIATUR SAS VIA NORTE",
    ciudad: "BARRANQUILLA",
    desde: "Octubre 28, 2024",
    hasta: "Octubre 28, 2024",
    cobrado: 930000,
    pagado: 730000,
    utilidad: 200000,
    creador: "JOHAN GONZÁLEZ",
    fechaCreacion: "Febrero 24, 2025 4:26 PM",
    estado: "PAGADA",
    numeroFacturaSystem: "2025-01-10"
  },
  {
    id: 3,
    numeroFactura: "FEV-3",
    contrato: "AGENCIA DE VIAJES Y TURISMO AVIATUR SAS AVIATUR 1",
    ciudad: "BARRANQUILLA",
    desde: "Octubre 22, 2024",
    hasta: "Febrero 24, 2025",
    cobrado: 3777100,
    pagado: 2940000,
    utilidad: 837100,
    creador: "JOHAN GONZÁLEZ",
    fechaCreacion: "Febrero 24, 2025 4:31 PM",
    estado: "PAGADA",
    numeroFacturaSystem: "2025-01-10"
  },
  {
    id: 4,
    numeroFactura: "FEV-4",
    contrato: "AGENCIA DE VIAJES Y TURISMO AVIATUR SAS VIA NORTE",
    ciudad: "BARRANQUILLA",
    desde: "Noviembre 01, 2024",
    hasta: "Noviembre 08, 2024",
    cobrado: 3145000,
    pagado: 2322000,
    utilidad: 823000,
    creador: "JOHAN GONZÁLEZ",
    fechaCreacion: "Febrero 24, 2025 4:38 PM",
    estado: "PAGADA",
    numeroFacturaSystem: "2024-12-17"
  },
  {
    id: 5,
    numeroFactura: "FEV-5",
    contrato: "AGENCIA DE VIAJES Y TURISMO AVIATUR SAS VIA NORTE",
    ciudad: "BARRANQUILLA",
    desde: "Noviembre 07, 2024",
    hasta: "Noviembre 07, 2024",
    cobrado: 2000000,
    pagado: 1600000,
    utilidad: 400000,
    creador: "JOHAN GONZÁLEZ",
    fechaCreacion: "Febrero 24, 2025 4:39 PM",
    estado: "PAGADA",
    numeroFacturaSystem: "2024-12-17"
  },
  {
    id: 6,
    numeroFactura: "FEV-6",
    contrato: "AGENCIA DE VIAJES Y TURISMO AVIATUR SAS VIA NORTE",
    ciudad: "BARRANQUILLA",
    desde: "Noviembre 21, 2024",
    hasta: "Noviembre 21, 2024",
    cobrado: 750000,
    pagado: 500000,
    utilidad: 250000,
    creador: "JOHAN GONZÁLEZ",
    fechaCreación: "Febrero 24, 2025 4:39 PM",
    estado: "PAGADA",
    numeroFacturaSystem: "2025-01-10"
  },
  {
    id: 7,
    numeroFactura: "FEV-7",
    contrato: "TICKET FAST SAS ADMIN",
    ciudad: "BOGOTÁ DC",
    desde: "Noviembre 24, 2024",
    hasta: "Noviembre 24, 2024",
    cobrado: 185000,
    pagado: 129500,
    utilidad: 55500,
    creador: "JOHAN GONZÁLEZ",
    fechaCreacion: "Febrero 24, 2025 4:41 PM",
    estado: "POR PAGAR",
    numeroFacturaSystem: ""
  },
  {
    id: 8,
    numeroFactura: "FEV-8",
    contrato: "CONTACTOS SAS BOG",
    ciudad: "BOGOTÁ DC",
    desde: "Noviembre 25, 2024",
    hasta: "Noviembre 25, 2024",
    cobrado: 2500000,
    pagado: 1500000,
    utilidad: 1000000,
    creador: "JOHAN GONZÁLEZ",
    fechaCreacion: "Febrero 24, 2025 4:50 PM",
    estado: "POR PAGAR",
    numeroFacturaSystem: ""
  }
]

const mockContratos = [
  "AGENCIA DE VIAJES Y TURISMO AVIATUR SAS",
  "TICKET FAST SAS ADMIN",
  "CONTACTOS SAS BOG",
  "COUNTRY EXPRESS ADMINISTRATIVO"
]

const columns = [
  { key: "numero", label: "N°", sortable: true },
  { key: "numeroFactura", label: "# Factura", sortable: true },
  { key: "contrato", label: "Contrato", sortable: true },
  { key: "ciudad", label: "Ciudad", sortable: true },
  { key: "periodo", label: "Desde / Hasta", sortable: false },
  { key: "cobrado", label: "Cobrado", sortable: true },
  { key: "pagado", label: "Pagado", sortable: true },
  { key: "utilidad", label: "Utilidad", sortable: true },
  { key: "creador", label: "Creador", sortable: true },
  { key: "estado", label: "Estado", sortable: true },
  { key: "acciones", label: "Ver", sortable: false }
]

export default function Facturas() {
  const [selectedFactura, setSelectedFactura] = useState<any>(null)
  const [showActionDialog, setShowActionDialog] = useState(false)
  const [actionType, setActionType] = useState<string>("")
  const [filters, setFilters] = useState({
    desde: "",
    hasta: "",
    contrato: "",
    numeroFactura: ""
  })

  const handleAction = (action: string, factura: any) => {
    setActionType(action)
    setSelectedFactura(factura)
    setShowActionDialog(true)
  }

  const handleConfirmAction = () => {
    console.log(`Acción ${actionType} confirmada para factura:`, selectedFactura)
    setShowActionDialog(false)
    setActionType("")
    setSelectedFactura(null)
  }

  const renderCell = (item: any, key: string) => {
    switch (key) {
      case 'numero':
        return item.id
      case 'periodo':
        return (
          <div className="text-sm">
            <div>{item.desde}</div>
            <div>{item.hasta}</div>
          </div>
        )
      case 'cobrado':
      case 'pagado':
      case 'utilidad':
        return new Intl.NumberFormat('es-CO', { 
          style: 'currency', 
          currency: 'COP',
          minimumFractionDigits: 0
        }).format(item[key])
      case 'creador':
        return (
          <div className="text-sm">
            <div className="font-medium">{item.creador}</div>
            <div className="text-muted-foreground">{item.fechaCreacion}</div>
          </div>
        )
      case 'estado':
        const isPagada = item.estado === "PAGADA"
        return (
          <div className="flex flex-col gap-1">
            <Badge 
              variant={isPagada ? "default" : "secondary"}
              className={isPagada ? "bg-green-600 text-white" : "bg-yellow-100 text-yellow-800"}
            >
              {item.estado} {isPagada ? "☑" : "💰"}
            </Badge>
            {item.numeroFacturaSystem && (
              <span className="text-xs text-muted-foreground">Pago: {item.numeroFacturaSystem}</span>
            )}
          </div>
        )
      case 'acciones':
        return (
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedFactura(item)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        )
      default:
        return item[key]
    }
  }

  const filteredData = mockFacturas.filter(factura => {
    if (filters.contrato && filters.contrato !== "todos" && !factura.contrato.toLowerCase().includes(filters.contrato.toLowerCase())) return false
    if (filters.numeroFactura && !factura.numeroFactura.toLowerCase().includes(filters.numeroFactura.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Facturas</h1>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-sm">
            Total: {filteredData.length}
          </Badge>
          <Badge variant="default" className="bg-green-600 text-white">
            Pagadas: {filteredData.filter(f => f.estado === "PAGADA").length}
          </Badge>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Por Pagar: {filteredData.filter(f => f.estado === "POR PAGAR").length}
          </Badge>
        </div>
      </div>

      {/* Filtros avanzados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Desde</label>
              <Input
                type="date"
                value={filters.desde}
                onChange={(e) => setFilters(prev => ({ ...prev, desde: e.target.value }))}
                placeholder="SELECCIONAR"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Hasta</label>
              <Input
                type="date"
                value={filters.hasta}
                onChange={(e) => setFilters(prev => ({ ...prev, hasta: e.target.value }))}
                placeholder="SELECCIONAR"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Contratos</label>
              <Select value={filters.contrato} onValueChange={(value) => setFilters(prev => ({ ...prev, contrato: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {mockContratos.map(contrato => (
                    <SelectItem key={contrato} value={contrato}>{contrato}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">N° de Factura</label>
              <Input
                value={filters.numeroFactura}
                onChange={(e) => setFilters(prev => ({ ...prev, numeroFactura: e.target.value }))}
                placeholder="Buscar por número"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <DataTable
            title=""
            columns={columns}
            data={filteredData}
            searchable
            exportable
            renderCell={renderCell}
          />
        </CardContent>
      </Card>

      {/* Modal de detalles de factura */}
      {selectedFactura && (
        <Dialog open={!!selectedFactura} onOpenChange={() => setSelectedFactura(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Factura {selectedFactura.numeroFactura}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">N° Factura</label>
                  <p className="text-sm font-semibold">{selectedFactura.numeroFactura}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Estado</label>
                  <Badge 
                    variant={selectedFactura.estado === "PAGADA" ? "default" : "secondary"}
                    className={selectedFactura.estado === "PAGADA" ? "bg-green-600 text-white" : "bg-yellow-100 text-yellow-800"}
                  >
                    {selectedFactura.estado}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Ciudad</label>
                  <p className="text-sm">{selectedFactura.ciudad}</p>
                </div>
              </div>

              <Separator />

              {/* Información del contrato */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Información del Contrato</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Contrato</label>
                    <p className="text-sm">{selectedFactura.contrato}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Período de Servicio</label>
                    <p className="text-sm">{selectedFactura.desde} - {selectedFactura.hasta}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Información financiera */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Información Financiera</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg bg-green-50">
                    <label className="text-sm font-medium text-muted-foreground">Cobrado</label>
                    <p className="text-lg font-bold text-green-600">
                      {new Intl.NumberFormat('es-CO', { 
                        style: 'currency', 
                        currency: 'COP',
                        minimumFractionDigits: 0
                      }).format(selectedFactura.cobrado)}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg bg-red-50">
                    <label className="text-sm font-medium text-muted-foreground">Pagado</label>
                    <p className="text-lg font-bold text-red-600">
                      {new Intl.NumberFormat('es-CO', { 
                        style: 'currency', 
                        currency: 'COP',
                        minimumFractionDigits: 0
                      }).format(selectedFactura.pagado)}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <label className="text-sm font-medium text-muted-foreground">Utilidad</label>
                    <p className="text-lg font-bold text-blue-600">
                      {new Intl.NumberFormat('es-CO', { 
                        style: 'currency', 
                        currency: 'COP',
                        minimumFractionDigits: 0
                      }).format(selectedFactura.utilidad)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {((selectedFactura.utilidad / selectedFactura.cobrado) * 100).toFixed(1)}% rentabilidad
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Información del creador */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Información de Creación</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Creado por</label>
                    <p className="text-sm font-medium">{selectedFactura.creador}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Fecha de Creación</label>
                    <p className="text-sm">{selectedFactura.fechaCreacion}</p>
                  </div>
                </div>
                {selectedFactura.numeroFacturaSystem && (
                  <div className="mt-2">
                    <label className="text-sm font-medium text-muted-foreground">N° Sistema de Pago</label>
                    <p className="text-sm font-medium">{selectedFactura.numeroFacturaSystem}</p>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setSelectedFactura(null)}>
                Cerrar
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleAction('download', selectedFactura)}
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar PDF
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleAction('send', selectedFactura)}
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar por Email
              </Button>
              {selectedFactura.estado === "POR PAGAR" && (
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleAction('mark-paid', selectedFactura)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Marcar como Pagada
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de confirmación de acciones */}
      {showActionDialog && (
        <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Acción</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>
                ¿Está seguro que desea {
                  actionType === 'download' ? 'descargar' :
                  actionType === 'send' ? 'enviar por email' :
                  actionType === 'mark-paid' ? 'marcar como pagada' : actionType
                } la factura {selectedFactura?.numeroFactura}?
              </p>
              {selectedFactura && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm"><strong>Contrato:</strong> {selectedFactura.contrato}</p>
                  <p className="text-sm"><strong>Valor:</strong> {new Intl.NumberFormat('es-CO', { 
                    style: 'currency', 
                    currency: 'COP',
                    minimumFractionDigits: 0
                  }).format(selectedFactura.cobrado)}</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowActionDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleConfirmAction} className="bg-blue-600 hover:bg-blue-700">
                Confirmar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}