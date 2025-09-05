import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Eye, Download, FileCheck, CalendarDays, User, FileText, X, CheckCircle, XCircle, AlertTriangle, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CuentaCobro {
  id: string
  proveedor: string
  mes: string
  idFactura: string
  fechaEnvio: string
  total: number
  estado: "Pendiente Revisión" | "Aprobado para Pago" | "Rechazado"
  documentos: {
    cuentaCobro: string
    planillaSeguridad: string
  }
  motivo?: string
  fechaRechazo?: string
  plazoSubsanar?: string
}

interface Lote {
  id: string
  numero: string
  estado: string
  valorActual: number
  cuentas: number
  fechaCreacion: string
  responsable: string
  fechaPago: string
  diasRestantes: number
}

const lotesDisponibles: Lote[] = [
  {
    id: "1",
    numero: "LOTE-2025-001",
    estado: "EN PREPARACIÓN",
    valorActual: 15450000,
    cuentas: 12,
    fechaCreacion: "2025-01-15",
    responsable: "Ana García",
    fechaPago: "2025-02-10",
    diasRestantes: 15
  },
  {
    id: "2", 
    numero: "LOTE-2025-002",
    estado: "EN REVISIÓN",
    valorActual: 8920000,
    cuentas: 8,
    fechaCreacion: "2025-01-18",
    responsable: "Carlos Mendez",
    fechaPago: "2025-02-15",
    diasRestantes: 20
  }
]

const cuentasCobro: CuentaCobro[] = [
  {
    id: "1",
    proveedor: "Juan Carlos Pérez",
    mes: "Agosto 2024",
    idFactura: "INV-001",
    fechaEnvio: "2024-09-01 14:30",
    total: 2850000,
    estado: "Pendiente Revisión",
    documentos: {
      cuentaCobro: "factura_juan_agosto_2024.pdf",
      planillaSeguridad: "ss_juan_agosto_2024.pdf"
    }
  },
  {
    id: "2",
    proveedor: "María Elena González",
    mes: "Agosto 2024",
    idFactura: "INV-002", 
    fechaEnvio: "2024-08-30 09:15",
    total: 3200000,
    estado: "Aprobado para Pago",
    documentos: {
      cuentaCobro: "factura_maria_agosto_2024.pdf",
      planillaSeguridad: "ss_maria_agosto_2024.pdf"
    }
  },
  {
    id: "3",
    proveedor: "Carlos Alberto Ruiz",
    mes: "Agosto 2024",
    idFactura: "INV-003",
    fechaEnvio: "2024-08-28 16:45",
    total: 1950000,
    estado: "Rechazado",
    documentos: {
      cuentaCobro: "factura_carlos_agosto_2024.pdf",
      planillaSeguridad: "ss_carlos_agosto_2024.pdf"
    },
    motivo: "Planilla sin pago de aportes de seguridad social",
    fechaRechazo: "2024-09-02",
    plazoSubsanar: "2024-09-05 (3 días)"
  }
]

export default function RevisionAdmin() {
  const { toast } = useToast()
  const [selectedCuenta, setSelectedCuenta] = useState<CuentaCobro | null>(null)
  const [showRevisionModal, setShowRevisionModal] = useState(false)
  const [showAprobadaModal, setShowAprobadaModal] = useState(false)
  const [showRechazoModal, setShowRechazoModal] = useState(false)
  const [showRechazadaModal, setShowRechazadaModal] = useState(false)
  const [motivoRechazo, setMotivoRechazo] = useState("")
  const [modalSeleccionarLote, setModalSeleccionarLote] = useState(false)
  const [modalCuentaAprobada, setModalCuentaAprobada] = useState(false)
  const [loteSeleccionado, setLoteSeleccionado] = useState<string | null>(null)
  const [filtros, setFiltros] = useState({
    proveedor: "",
    estado: "",
    fechaDesde: "",
    fechaHasta: ""
  })

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Pendiente Revisión":
        return <Badge variant="warning" className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Pendiente Revisión</Badge>
      case "Aprobado para Pago":
        return <Badge variant="success" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" />Aprobado para Pago</Badge>
      case "Rechazado":
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" />Rechazado</Badge>
      default:
        return <Badge variant="secondary">{estado}</Badge>
    }
  }

  const handleVerDocumento = (tipo: string) => {
    toast({
      title: "Visualizando documento",
      description: `Abriendo ${tipo} en nueva pestaña...`
    })
    // Aquí se abriría el PDF en una nueva pestaña
    window.open("#", "_blank")
  }

  const handleDescargar = (tipo: string) => {
    toast({
      title: "Descargando documento",
      description: `Descargando ${tipo}...`
    })
    // Aquí se iniciaría la descarga del PDF
  }

  const handleRevisar = (cuenta: CuentaCobro) => {
    setSelectedCuenta(cuenta)
    setShowRevisionModal(true)
  }

  const handleAprobar = () => {
    setShowRevisionModal(false)
    setModalSeleccionarLote(true)
  }

  const handleRadicarLote = () => {
    if (!loteSeleccionado) {
      toast({
        title: "Error",
        description: "Debe seleccionar un lote",
        variant: "destructive"
      })
      return
    }
    setModalSeleccionarLote(false)
    setModalCuentaAprobada(true)
  }

  const getEstadoLoteBadge = (estado: string) => {
    switch (estado) {
      case "EN PREPARACIÓN":
        return <Badge variant="warning">{estado}</Badge>
      case "EN REVISIÓN":
        return <Badge variant="pending">{estado}</Badge>
      default:
        return <Badge variant="secondary">{estado}</Badge>
    }
  }

  const handleRechazar = () => {
    setShowRevisionModal(false)
    setShowRechazoModal(true)
  }

  const handleConfirmarRechazo = () => {
    if (!motivoRechazo) {
      toast({
        title: "Error",
        description: "Debe seleccionar un motivo de rechazo",
        variant: "destructive"
      })
      return
    }
    setShowRechazoModal(false)
    setShowRechazadaModal(true)
  }

  const cuentasFiltradas = cuentasCobro.filter(cuenta => {
    if (filtros.proveedor && !cuenta.proveedor.toLowerCase().includes(filtros.proveedor.toLowerCase())) return false
    if (filtros.estado && filtros.estado !== "todos" && cuenta.estado !== filtros.estado) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header con filtros */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Revisión de Cuentas de Cobro</h1>
            <p className="text-muted-foreground">Revisar y aprobar las cuentas de cobro enviadas por los proveedores</p>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <span className="text-sm font-medium">{cuentasFiltradas.filter(c => c.estado === "Pendiente Revisión").length} pendientes de revisión</span>
          </div>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros de búsqueda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="filtro-proveedor">Proveedor</Label>
                <Input
                  id="filtro-proveedor"
                  placeholder="Buscar por proveedor..."
                  value={filtros.proveedor}
                  onChange={(e) => setFiltros({...filtros, proveedor: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="filtro-estado">Estado</Label>
                <Select value={filtros.estado} onValueChange={(value) => setFiltros({...filtros, estado: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los estados</SelectItem>
                    <SelectItem value="Pendiente Revisión">Pendiente Revisión</SelectItem>
                    <SelectItem value="Aprobado para Pago">Aprobado para Pago</SelectItem>
                    <SelectItem value="Rechazado">Rechazado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="filtro-desde">Fecha desde</Label>
                <Input
                  id="filtro-desde"
                  type="date"
                  value={filtros.fechaDesde}
                  onChange={(e) => setFiltros({...filtros, fechaDesde: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="filtro-hasta">Fecha hasta</Label>
                <Input
                  id="filtro-hasta"
                  type="date"
                  value={filtros.fechaHasta}
                  onChange={(e) => setFiltros({...filtros, fechaHasta: e.target.value})}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de cuentas de cobro */}
      <div className="space-y-4">
        {cuentasFiltradas.map((cuenta) => (
          <Card key={cuenta.id} className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-lg">{cuenta.proveedor}</span>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    ${cuenta.total.toLocaleString()}
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{cuenta.mes}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">ID: {cuenta.idFactura}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Enviado: {cuenta.fechaEnvio}</span>
                  </div>
                  <div>
                    {getEstadoBadge(cuenta.estado)}
                  </div>
                </div>

                {cuenta.estado === "Rechazado" && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-destructive font-medium mb-2">
                      <XCircle className="h-4 w-4" />
                      Rechazado
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      <strong>Motivo:</strong> {cuenta.motivo}
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">
                      <strong>Fecha de rechazo:</strong> {cuenta.fechaRechazo}
                    </p>
                    <div className="flex items-center gap-2 text-warning">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">Plazo para subsanar: {cuenta.plazoSubsanar}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">Cuenta de Cobro (PDF)</p>
                      <p className="text-sm text-muted-foreground">{cuenta.documentos.cuentaCobro}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleVerDocumento("Cuenta de Cobro")}>
                        <Eye className="h-4 w-4" />
                        Ver
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDescargar("Cuenta de Cobro")}>
                        <Download className="h-4 w-4" />
                        Descargar
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <FileCheck className="h-5 w-5 text-success" />
                    <div className="flex-1">
                      <p className="font-medium">Planilla Seguridad Social</p>
                      <p className="text-sm text-muted-foreground">{cuenta.documentos.planillaSeguridad}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleVerDocumento("Planilla de Seguridad Social")}>
                        <Eye className="h-4 w-4" />
                        Ver
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDescargar("Planilla de Seguridad Social")}>
                        <Download className="h-4 w-4" />
                        Descargar
                      </Button>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => handleRevisar(cuenta)}
                  className="w-full"
                  disabled={cuenta.estado !== "Pendiente Revisión"}
                >
                  <FileCheck className="h-4 w-4 mr-2" />
                  Revisar y Aprobar/Rechazar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal de Revisión Administrativa */}
      <Dialog open={showRevisionModal} onOpenChange={setShowRevisionModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              Revisión Administrativa - {selectedCuenta?.proveedor}
            </DialogTitle>
          </DialogHeader>

          {selectedCuenta && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Resumen de la Cuenta de Cobro</h3>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Proveedor:</span>
                    <p className="font-medium">{selectedCuenta.proveedor}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Período:</span>
                    <p className="font-medium">{selectedCuenta.mes}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Facturado:</span>
                    <p className="font-medium text-primary text-lg">${selectedCuenta.total.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fecha de Envío:</span>
                    <p className="font-medium">{selectedCuenta.fechaEnvio}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Documentos Recibidos</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Cuenta de Cobro (PDF)</p>
                        <p className="text-sm text-muted-foreground">{selectedCuenta.documentos.cuentaCobro}</p>
                      </div>
                    </div>
                    <Badge variant="success">✓ Recibido</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileCheck className="h-5 w-5 text-success" />
                      <div>
                        <p className="font-medium">Planilla de Seguridad Social</p>
                        <p className="text-sm text-muted-foreground">{selectedCuenta.documentos.planillaSeguridad}</p>
                      </div>
                    </div>
                    <Badge variant="success">✓ Recibido</Badge>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-4">Decisión de Revisión</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Revisa los documentos y toma una decisión sobre la cuenta de cobro
                </p>
                
                <div className="flex gap-3">
                  <Button onClick={handleAprobar} className="flex-1">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Aprobar Cuenta
                    <span className="text-xs block">Programar para pago</span>
                  </Button>
                  <Button onClick={handleRechazar} variant="destructive" className="flex-1">
                    <XCircle className="h-4 w-4 mr-2" />
                    Rechazar Cuenta
                    <span className="text-xs block">Solicitar correcciones</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Cuenta Aprobada */}
      <AlertDialog open={showAprobadaModal} onOpenChange={setShowAprobadaModal}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-success">
              <CheckCircle className="h-5 w-5" />
              ¡Cuenta Aprobada!
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-success/10 border border-success/20 rounded-lg p-4 text-center">
              <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Cuenta Aprobada y Programada</h3>
              <p className="text-sm text-muted-foreground mb-4">
                La cuenta de cobro de <strong>{selectedCuenta?.proveedor}</strong> ha sido aprobada y programada para pago.
              </p>
              
              <div className="flex items-center justify-center gap-2 text-success text-sm">
                <Mail className="h-4 w-4" />
                <span>Notificación Enviada</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Se ha enviado confirmación por correo electrónico al proveedor
              </p>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
              <Badge variant="default" className="w-full justify-center">
                Estado: Aprobado - Programada para Pago
              </Badge>
            </div>
          </div>

          <div className="flex justify-center">
            <Button onClick={() => setShowAprobadaModal(false)} className="w-full">
              Cerrar
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de Motivo de Rechazo */}
      <Dialog open={showRechazoModal} onOpenChange={setShowRechazoModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              Rechazar Cuenta de Cobro - Motivo Requerido
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-warning font-medium mb-2">
                <AlertTriangle className="h-4 w-4" />
                Especifica el motivo del rechazo
              </div>
              <p className="text-sm text-muted-foreground">
                El proveedor tendrá <strong>3 días</strong> para subsanar desde la notificación
              </p>
            </div>

            <div className="space-y-3">
              <Label>Selecciona el motivo del rechazo:</Label>
              <RadioGroup value={motivoRechazo} onValueChange={setMotivoRechazo}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="planilla-sin-pago" id="planilla-sin-pago" />
                  <Label htmlFor="planilla-sin-pago">Planilla sin pago de aportes de seguridad social</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="planilla-alterada" id="planilla-alterada" />
                  <Label htmlFor="planilla-alterada">Planilla alterada o modificada</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="planilla-no-corresponde" id="planilla-no-corresponde" />
                  <Label htmlFor="planilla-no-corresponde">Planilla no corresponde al período facturado</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="documentacion-incompleta" id="documentacion-incompleta" />
                  <Label htmlFor="documentacion-incompleta">Documentación incompleta</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="errores-valores" id="errores-valores" />
                  <Label htmlFor="errores-valores">Errores en los valores reportados</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="otro" id="otro" />
                  <Label htmlFor="otro">Otro (especificar)</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowRechazoModal(false)} className="flex-1">
                Volver
              </Button>
              <Button onClick={handleConfirmarRechazo} variant="destructive" className="flex-1">
                Confirmar Rechazo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal final de cuenta rechazada */}
      <AlertDialog open={showRechazadaModal} onOpenChange={setShowRechazadaModal}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <div className="flex items-center justify-between">
              <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                <XCircle className="h-5 w-5" />
                Cuenta Rechazada - Notificación Enviada
              </AlertDialogTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowRechazadaModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </AlertDialogHeader>

          <div className="space-y-6">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-destructive font-medium mb-3">
                <XCircle className="h-5 w-5" />
                Cuenta de Cobro Rechazada
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                La cuenta de cobro de <strong>{selectedCuenta?.proveedor}</strong> ha sido rechazada.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Motivo:</strong> {motivoRechazo === "planilla-sin-pago" ? "Planilla sin pago de aportes de seguridad social" : 
                                          motivoRechazo === "planilla-alterada" ? "Planilla alterada o modificada" :
                                          motivoRechazo === "planilla-no-corresponde" ? "Planilla no corresponde al período facturado" :
                                          motivoRechazo === "documentacion-incompleta" ? "Documentación incompleta" :
                                          motivoRechazo === "errores-valores" ? "Errores en los valores reportados" : "Otro"}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Plantilla de Correo - Notificación de Rechazo</h3>
              <div className="bg-background border rounded-lg p-4 space-y-3 font-mono text-sm">
                <div className="border-b pb-2">
                  <p><strong>Para:</strong> {selectedCuenta?.proveedor.toLowerCase().replace(/\s+/g, '.')}@email.com</p>
                  <p><strong>Asunto:</strong> Cuenta de Cobro Rechazada - Correcciones Requeridas</p>
                </div>
                
                <div className="space-y-3 text-sm">
                  <p>Estimado/a {selectedCuenta?.proveedor},</p>
                  
                  <p>
                    Le informamos que su cuenta de cobro correspondiente al período de <strong>{selectedCuenta?.mes}</strong> 
                    ha sido <strong>rechazada</strong> por el siguiente motivo:
                  </p>
                  
                  <div className="bg-destructive/10 border-l-4 border-destructive pl-4 py-2">
                    <p className="font-semibold text-destructive">
                      {motivoRechazo === "planilla-sin-pago" ? "Planilla sin pago de aportes de seguridad social" : 
                       motivoRechazo === "planilla-alterada" ? "Planilla alterada o modificada" :
                       motivoRechazo === "planilla-no-corresponde" ? "Planilla no corresponde al período facturado" :
                       motivoRechazo === "documentacion-incompleta" ? "Documentación incompleta" :
                       motivoRechazo === "errores-valores" ? "Errores en los valores reportados" : "Otro"}
                    </p>
                  </div>
                  
                  <p>
                    <strong>Plazo para corrección:</strong> Usted tiene un plazo de <strong>3 días hábiles</strong> 
                    a partir de la fecha de esta notificación para realizar las correcciones necesarias y reenviar 
                    la documentación.
                  </p>
                  
                  <p>
                    Por favor, revise la documentación, realice las correcciones correspondientes y reenvíe 
                    su cuenta de cobro a través del sistema.
                  </p>
                  
                  <p>
                    Si tiene alguna duda sobre las correcciones requeridas, no dude en contactarnos.
                  </p>
                  
                  <p>Atentamente,<br />Equipo de Gestión de Cuentas de Cobro</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button onClick={() => setShowRechazadaModal(false)} className="w-full">
              Cerrar
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal Seleccionar Lote para Radicar */}
      <Dialog open={modalSeleccionarLote} onOpenChange={setModalSeleccionarLote}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-primary">
                Seleccionar Lote para Radicar Cuenta de Cobro
              </DialogTitle>
              <Button variant="ghost" size="sm" onClick={() => setModalSeleccionarLote(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-background border rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Cuenta: {selectedCuenta?.idFactura} - {selectedCuenta?.proveedor}</div>
              <div className="text-lg font-semibold text-success">
                Valor: ${selectedCuenta?.total.toLocaleString()}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Lotes Disponibles</h3>
                <Input 
                  placeholder="Buscar lote..." 
                  className="w-48"
                />
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {lotesDisponibles.map((lote) => (
                  <div 
                    key={lote.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      loteSeleccionado === lote.id 
                        ? 'border-primary border-2 bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setLoteSeleccionado(lote.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold">{lote.numero}</h4>
                        {getEstadoLoteBadge(lote.estado)}
                        {loteSeleccionado === lote.id && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mb-1">
                          {lote.fechaPago} ({lote.diasRestantes} días)
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Valor Actual:</span>
                        <p className="font-medium">${lote.valorActual.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Cuentas:</span>
                        <p className="font-medium">{lote.cuentas} cuentas</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Fecha Creación:</span>
                        <p className="font-medium">{lote.fechaCreacion}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Responsable:</span>
                        <p className="font-medium">{lote.responsable}</p>
                      </div>
                    </div>

                    {loteSeleccionado === lote.id && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="text-sm text-primary">
                          <strong>Valor Final si se radica:</strong> ${(lote.valorActual + (selectedCuenta?.total || 0)).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setModalSeleccionarLote(false)} className="flex-1">
                Cancelar
              </Button>
              <Button 
                onClick={handleRadicarLote} 
                className="flex-1"
                disabled={!loteSeleccionado}
              >
                + Radicar a Lote Seleccionado
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Cuenta Aprobada y Radiada */}
      <AlertDialog open={modalCuentaAprobada} onOpenChange={setModalCuentaAprobada}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-success">
              <CheckCircle className="h-5 w-5" />
              ¡Cuenta Aprobada!
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-success/10 border border-success/20 rounded-lg p-4 text-center">
              <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Cuenta Aprobada y Programada</h3>
              <p className="text-sm text-muted-foreground mb-4">
                La cuenta de cobro de <strong>{selectedCuenta?.proveedor}</strong> ha sido 
                aprobada y programada para pago.
              </p>
              
              <div className="flex items-center justify-center gap-2 text-success text-sm">
                <Mail className="h-4 w-4" />
                <span>Notificación Enviada</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Se ha enviado confirmación por correo electrónico al proveedor
              </p>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
              <Button variant="default" className="w-full">
                Estado: Aprobado - Programada para Pago
              </Button>
            </div>
          </div>

          <div className="flex justify-center">
            <Button onClick={() => setModalCuentaAprobada(false)} className="w-full">
              Cerrar
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}