import { useState } from "react"
import { Eye, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { DataTable } from "@/components/DataTable"

// Mock data para liquidaciones
const mockLiquidaciones = [
  {
    id: 1,
    numero: "LIQ-001",
    contrato: "EMPRESA TRANSPORTES DEL CARIBE LTDA",
    ciudad: "BARRANQUILLA",
    desde: "Enero 15, 2025",
    hasta: "Enero 15, 2025",
    cobrado: 850000,
    pagado: 650000,
    utilidad: 200000,
    creador: "JUAN PÉREZ",
    fechaCreacion: "Enero 15, 2025 10:30 AM",
    estado: "CREADA",
    rentabilidad: "23.5%"
  },
  {
    id: 2,
    numero: "LIQ-002",
    contrato: "TRANSPORTES UNIDOS DEL NORTE SAS",
    ciudad: "CARTAGENA",
    desde: "Enero 18, 2025",
    hasta: "Enero 20, 2025",
    cobrado: 1200000,
    pagado: 900000,
    utilidad: 300000,
    creador: "MARÍA GARCÍA",
    fechaCreacion: "Enero 20, 2025 2:15 PM",
    estado: "CREADA",
    rentabilidad: "25.0%"
  },
  {
    id: 3,
    numero: "LIQ-003",
    contrato: "COMPAÑÍA DE TRANSPORTES LA GAVIOTA",
    ciudad: "SANTA MARTA",
    desde: "Enero 22, 2025",
    hasta: "Enero 25, 2025",
    cobrado: 750000,
    pagado: 550000,
    utilidad: 200000,
    creador: "CARLOS RODRÍGUEZ",
    fechaCreacion: "Enero 25, 2025 4:45 PM",
    estado: "CREADA",
    rentabilidad: "26.7%"
  },
  {
    id: 4,
    numero: "LIQ-004",
    contrato: "TRANSPORTES RÁPIDOS DEL ATLÁNTICO",
    ciudad: "SOLEDAD",
    desde: "Enero 28, 2025",
    hasta: "Enero 30, 2025",
    cobrado: 950000,
    pagado: 720000,
    utilidad: 230000,
    creador: "ANA LÓPEZ",
    fechaCreacion: "Enero 30, 2025 11:20 AM",
    estado: "CREADA",
    rentabilidad: "24.2%"
  },
  {
    id: 5,
    numero: "LIQ-005",
    contrato: "SERVICIOS DE TRANSPORTE MAGDALENA",
    ciudad: "BARRANQUILLA",
    desde: "Febrero 01, 2025",
    hasta: "Febrero 03, 2025",
    cobrado: 680000,
    pagado: 480000,
    utilidad: 200000,
    creador: "LUIS MARTÍNEZ",
    fechaCreacion: "Febrero 03, 2025 9:10 AM",
    estado: "CREADA",
    rentabilidad: "29.4%"
  },
  {
    id: 6,
    numero: "LIQ-006",
    contrato: "TRANSPORTES EMPRESARIALES DEL CESAR",
    ciudad: "VALLEDUPAR",
    desde: "Febrero 05, 2025",
    hasta: "Febrero 07, 2025",
    cobrado: 1100000,
    pagado: 800000,
    utilidad: 300000,
    creador: "DIANA HERRERA",
    fechaCreacion: "Febrero 07, 2025 3:30 PM",
    estado: "CREADA",
    rentabilidad: "27.3%"
  }
]

const columns = [
  { key: "numero", label: "N°", sortable: true },
  { key: "id", label: "Id", sortable: true },
  { key: "contrato", label: "Contrato", sortable: true },
  { key: "ciudad", label: "Ciudad", sortable: true },
  { key: "periodo", label: "Desde / Hasta", sortable: false },
  { key: "cobrado", label: "Cobrado", sortable: true },
  { key: "pagado", label: "Pagado", sortable: true },
  { key: "utilidad", label: "Utilidad", sortable: true },
  { key: "creador", label: "Creador", sortable: true },
  { key: "estado", label: "Estado", sortable: true },
  { key: "rentabilidad", label: "Rent.", sortable: true },
  { key: "acciones", label: "Ver", sortable: false }
]

export default function Liquidaciones() {
  const [selectedLiquidacion, setSelectedLiquidacion] = useState<any>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{ type: string, item: any } | null>(null)

  const handleApprove = (item: any) => {
    setConfirmAction({ type: 'approve', item })
    setShowConfirmDialog(true)
  }

  const handleInvoice = (item: any) => {
    setConfirmAction({ type: 'invoice', item })
    setShowConfirmDialog(true)
  }

  const handleConfirm = () => {
    if (confirmAction) {
      console.log(`Acción ${confirmAction.type} confirmada para:`, confirmAction.item)
      // Aquí iría la lógica para procesar la acción
    }
    setShowConfirmDialog(false)
    setConfirmAction(null)
  }

  const renderCell = (item: any, key: string) => {
    switch (key) {
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
        return (
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              {item.estado}
            </Badge>
            <Button
              size="sm"
              variant="default"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => handleApprove(item)}
            >
              POR APROBAR ✓
            </Button>
          </div>
        )
      case 'rentabilidad':
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{item.rentabilidad}</span>
            <Button
              size="sm"
              variant="default"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => handleInvoice(item)}
            >
              FACTURAR 📋
            </Button>
          </div>
        )
      case 'acciones':
        return (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setSelectedLiquidacion(item)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        )
      default:
        return item[key]
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Liquidaciones</h1>
        <Badge variant="outline" className="text-sm">
          Total de liquidaciones: {mockLiquidaciones.length}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Búsqueda general</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            title=""
            columns={columns}
            data={mockLiquidaciones}
            searchable
            filterable
            exportable
            renderCell={renderCell}
          />
        </CardContent>
      </Card>

      {/* Modal de detalles */}
      {selectedLiquidacion && (
        <Dialog open={!!selectedLiquidacion} onOpenChange={() => setSelectedLiquidacion(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalles de Liquidación #{selectedLiquidacion.numero}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Contrato</label>
                <p className="text-sm">{selectedLiquidacion.contrato}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Ciudad</label>
                <p className="text-sm">{selectedLiquidacion.ciudad}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Período</label>
                <p className="text-sm">{selectedLiquidacion.desde} - {selectedLiquidacion.hasta}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Estado</label>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  {selectedLiquidacion.estado}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Cobrado</label>
                <p className="text-sm font-semibold text-green-600">
                  {new Intl.NumberFormat('es-CO', { 
                    style: 'currency', 
                    currency: 'COP',
                    minimumFractionDigits: 0
                  }).format(selectedLiquidacion.cobrado)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Pagado</label>
                <p className="text-sm font-semibold text-red-600">
                  {new Intl.NumberFormat('es-CO', { 
                    style: 'currency', 
                    currency: 'COP',
                    minimumFractionDigits: 0
                  }).format(selectedLiquidacion.pagado)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Utilidad</label>
                <p className="text-sm font-semibold text-blue-600">
                  {new Intl.NumberFormat('es-CO', { 
                    style: 'currency', 
                    currency: 'COP',
                    minimumFractionDigits: 0
                  }).format(selectedLiquidacion.utilidad)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Rentabilidad</label>
                <p className="text-sm font-semibold">{selectedLiquidacion.rentabilidad}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-muted-foreground">Creador</label>
                <p className="text-sm">{selectedLiquidacion.creador}</p>
                <p className="text-xs text-muted-foreground">{selectedLiquidacion.fechaCreacion}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de confirmación */}
      {showConfirmDialog && confirmAction && (
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Acción</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>
                ¿Está seguro que desea {confirmAction.type === 'approve' ? 'aprobar' : 'facturar'} 
                la liquidación #{confirmAction.item.numero}?
              </p>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm"><strong>Contrato:</strong> {confirmAction.item.contrato}</p>
                <p className="text-sm"><strong>Utilidad:</strong> {new Intl.NumberFormat('es-CO', { 
                  style: 'currency', 
                  currency: 'COP',
                  minimumFractionDigits: 0
                }).format(confirmAction.item.utilidad)}</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleConfirm}
                className={confirmAction.type === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}
              >
                {confirmAction.type === 'approve' ? 'Aprobar' : 'Facturar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}