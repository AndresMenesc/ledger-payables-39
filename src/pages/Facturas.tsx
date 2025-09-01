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
    numeroFactura: "FACT-001",
    contrato: "EMPRESA TRANSPORTES DEL CARIBE LTDA",
    ciudad: "BARRANQUILLA",
    desde: "Enero 10, 2025",
    hasta: "Enero 15, 2025",
    cobrado: 1200000,
    pagado: 950000,
    utilidad: 250000,
    creador: "PEDRO GONZÁLEZ",
    fechaCreacion: "Enero 16, 2025 10:30 AM",
    estado: "PAGADA",
    numeroFacturaSystem: "2025-01-16"
  },
  {
    id: 2,
    numeroFactura: "FACT-002",
    contrato: "TRANSPORTES UNIDOS DEL NORTE SAS",
    ciudad: "CARTAGENA",
    desde: "Enero 20, 2025",
    hasta: "Enero 25, 2025",
    cobrado: 1500000,
    pagado: 1200000,
    utilidad: 300000,
    creador: "SANDRA MARTÍNEZ",
    fechaCreacion: "Enero 26, 2025 2:45 PM",
    estado: "PAGADA",
    numeroFacturaSystem: "2025-01-26"
  },
  {
    id: 3,
    numeroFactura: "FACT-003",
    contrato: "COMPAÑÍA DE TRANSPORTES LA GAVIOTA",
    ciudad: "SANTA MARTA",
    desde: "Febrero 01, 2025",
    hasta: "Febrero 05, 2025",
    cobrado: 980000,
    pagado: 750000,
    utilidad: 230000,
    creador: "MIGUEL RODRÍGUEZ",
    fechaCreacion: "Febrero 06, 2025 11:15 AM",
    estado: "POR PAGAR",
    numeroFacturaSystem: ""
  },
  {
    id: 4,
    numeroFactura: "FACT-004",
    contrato: "TRANSPORTES RÁPIDOS DEL ATLÁNTICO",
    ciudad: "SOLEDAD",
    desde: "Febrero 08, 2025",
    hasta: "Febrero 12, 2025",
    cobrado: 1350000,
    pagado: 1100000,
    utilidad: 250000,
    creador: "LAURA LÓPEZ",
    fechaCreacion: "Febrero 13, 2025 4:20 PM",
    estado: "PAGADA",
    numeroFacturaSystem: "2025-02-13"
  },
  {
    id: 5,
    numeroFactura: "FACT-005",
    contrato: "SERVICIOS DE TRANSPORTE MAGDALENA",
    ciudad: "BARRANQUILLA",
    desde: "Febrero 15, 2025",
    hasta: "Febrero 18, 2025",
    cobrado: 850000,
    pagado: 650000,
    utilidad: 200000,
    creador: "ANDRÉS HERRERA",
    fechaCreacion: "Febrero 19, 2025 9:30 AM",
    estado: "POR PAGAR",
    numeroFacturaSystem: ""
  },
  {
    id: 6,
    numeroFactura: "FACT-006",
    contrato: "TRANSPORTES EMPRESARIALES DEL CESAR",
    ciudad: "VALLEDUPAR",
    desde: "Febrero 20, 2025",
    hasta: "Febrero 24, 2025",
    cobrado: 1700000,
    pagado: 1350000,
    utilidad: 350000,
    creador: "CARMEN SILVA",
    fechaCreacion: "Febrero 25, 2025 1:45 PM",
    estado: "PAGADA",
    numeroFacturaSystem: "2025-02-25"
  },
  {
    id: 7,
    numeroFactura: "FACT-007",
    contrato: "COOPERATIVA DE TRANSPORTADORES",
    ciudad: "MONTERÍA",
    desde: "Febrero 26, 2025",
    hasta: "Febrero 28, 2025",
    cobrado: 620000,
    pagado: 480000,
    utilidad: 140000,
    creador: "ROBERTO CASTRO",
    fechaCreacion: "Marzo 01, 2025 8:15 AM",
    estado: "POR PAGAR",
    numeroFacturaSystem: ""
  },
  {
    id: 8,
    numeroFactura: "FACT-008",
    contrato: "EMPRESA DE TURISMO Y TRANSPORTE",
    ciudad: "SINCELEJO",
    desde: "Marzo 03, 2025",
    hasta: "Marzo 07, 2025",
    cobrado: 2100000,
    pagado: 1650000,
    utilidad: 450000,
    creador: "PATRICIA MORALES",
    fechaCreacion: "Marzo 08, 2025 12:00 PM",
    estado: "PAGADA",
    numeroFacturaSystem: "2025-03-08"
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