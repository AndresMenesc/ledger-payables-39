import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Eye, Download, Truck, MapPin, Clock, Calculator, Building2, FileText, Users, Calendar, CheckCircle, X, Upload, Mail, AlertTriangle } from "lucide-react"
import { Switch } from "@/components/ui/switch"

// Datos de ejemplo de proveedores
const proveedoresData = [
  {
    id: 1,
    nombre: "Transportes Rápidos S.A.S",
    codigo: "PROV001",
    vehiculos: 8,
    prefactura: "2024-01-15",
    valorLiquidado: "$12.500.000",
    estado: "Pendiente Aceptación",
    documentos: {
      rut: true,
      certBancaria: true,
      segSocial: false
    },
    detalleFacturacion: {
      vehiculos: [
        {
          placa: "ABC-123",
          clientes: [
            {
              nombre: "Alpina",
              servicios: 45,
              valorBruto: "$4.500.000",
              gps: "-$50.000",
              examenes: "-$25.000",
              chaqueta: "-$15.000",
              impuestos: "-$270.000",
              valorNeto: "$4.140.000",
              estado: "aprobado"
            },
            {
              nombre: "Sutherland",
              servicios: 22,
              valorBruto: "$2.200.000",
              gps: "-$25.000",
              examenes: "$0",
              chaqueta: "$0",
              impuestos: "-$132.000",
              valorNeto: "$2.043.000",
              estado: "rechazado"
            }
          ]
        },
        {
          placa: "DEF-456",
          clientes: [
            {
              nombre: "Sutherland",
              servicios: 38,
              valorBruto: "$3.800.000",
              gps: "-$40.000",
              examenes: "-$25.000",
              chaqueta: "-$15.000",
              impuestos: "-$225.000",
              valorNeto: "$3.495.000",
              estado: "aprobado"
            }
          ]
        }
      ],
      totalGeneral: "$12.500.000"
    },
    serviciosDetalle: [
      {
        fecha: "31/1/2024",
        hora: "06:00 AM",
        ruta: "Zona Industrial - Alpina Terminal - Planta Alpina",
        usuarios: 25,
        valor: "$120.000",
        estado: "Completado"
      },
      {
        fecha: "31/1/2024",
        hora: "02:00 PM",
        ruta: "Zona Industrial - Alpina Planta Alpina - Terminal",
        usuarios: 23,
        valor: "$120.000",
        estado: "Completado"
      },
      {
        fecha: "1/2/2024",
        hora: "06:30 AM",
        ruta: "Centro Logístico Terminal - Centro Logístico",
        usuarios: 28,
        valor: "$120.000",
        estado: "Completado"
      },
      {
        fecha: "1/2/2024",
        hora: "02:30 PM",
        ruta: "Centro Logístico Centro Logístico - Terminal",
        usuarios: 26,
        valor: "$120.000",
        estado: "Completado"
      },
      {
        fecha: "2/2/2024",
        hora: "06:00 AM",
        ruta: "Zona Industrial - Alpina Terminal - Planta Alpina",
        usuarios: 24,
        valor: "$120.000",
        estado: "Completado"
      }
    ]
  },
  {
    id: 2,
    nombre: "Logística del Valle",
    codigo: "PROV002",
    vehiculos: 5,
    prefactura: "2024-01-14",
    valorLiquidado: "$8.200.000",
    estado: "Aceptada",
    documentos: {
      rut: true,
      certBancaria: true,
      segSocial: true
    },
    detalleFacturacion: {
      vehiculos: [
        {
          placa: "GHI-789",
          clientes: [
            {
              nombre: "Centro Source",
              servicios: 35,
              valorBruto: "$3.500.000",
              gps: "-$35.000",
              examenes: "-$20.000",
              chaqueta: "-$10.000",
              impuestos: "-$210.000",
              valorNeto: "$3.225.000"
            }
          ]
        }
      ],
      totalGeneral: "$8.200.000"
    }
  },
  {
    id: 3,
    nombre: "Cargo Express Ltda",
    codigo: "PROV003",
    vehiculos: 12,
    prefactura: "2024-01-12",
    valorLiquidado: "$18.900.000",
    estado: "Rechazada",
    motivoRechazo: "Tarifa incorrecta en vehículo VH-456",
    documentos: {
      rut: true,
      certBancaria: false,
      segSocial: false
    },
    detalleFacturacion: {
      vehiculos: [
        {
          placa: "JKL-012",
          clientes: [
            {
              nombre: "Alpina",
              servicios: 52,
              valorBruto: "$5.200.000",
              gps: "-$55.000",
              examenes: "-$30.000",
              chaqueta: "-$20.000",
              impuestos: "-$312.000",
              valorNeto: "$4.783.000"
            }
          ]
        }
      ],
      totalGeneral: "$18.900.000"
    }
  }
]

const Metric = ({ icon: Icon, label, value, sub }: any) => (
  <Card className="rounded-2xl border">
    <CardContent className="p-5 flex items-center gap-4">
      <div className="h-10 w-10 rounded-xl bg-blue-600/10 text-blue-700 grid place-content-center">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="text-2xl font-semibold leading-none tracking-tight">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
        {sub && <div className="text-[11px] mt-1 text-muted-foreground">{sub}</div>}
      </div>
    </CardContent>
  </Card>
);

export default function CuentaCobroProveedor() {
  const { toast } = useToast()
  const [selectedProveedor, setSelectedProveedor] = useState<any>(null)
  const [showDetalleModal, setShowDetalleModal] = useState(false)
  const [showServiciosModal, setShowServiciosModal] = useState(false)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("vehiculo")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showRejectConfirmModal, setShowRejectConfirmModal] = useState(false)
  const [showFileProcessModal, setShowFileProcessModal] = useState(false)
  const [showAdvancedActions, setShowAdvancedActions] = useState(true)
  const [rejectReason, setRejectReason] = useState("")
  const [serviceApprovals, setServiceApprovals] = useState<{[key: string]: string}>({})
  const [showServiceRejectModal, setShowServiceRejectModal] = useState(false)
  const [selectedServiceIndex, setSelectedServiceIndex] = useState<number | null>(null)
  const [serviceRejectReason, setServiceRejectReason] = useState("")

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Pendiente Aceptación":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 rounded-md">Pendiente Aceptación</Badge>
      case "Aceptada":
        return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100 rounded-md">Aceptada</Badge>
      case "Rechazada":
        return <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100 rounded-md">Rechazada</Badge>
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  const verDetalle = (proveedor: any) => {
    setSelectedProveedor(proveedor)
    setShowDetalleModal(true)
  }

  const verServicios = (cliente: any) => {
    setSelectedCliente(cliente)
    setShowServiciosModal(true)
  }

  const revisarServicios = (proveedor: any) => {
    setSelectedProveedor(proveedor)
    setShowApprovalModal(true)
  }

  const aprobarServicios = () => {
    setShowApprovalModal(false)
    setShowUploadModal(true)
    toast({
      title: "¡Servicios Aprobados!",
      description: "Se ha enviado confirmación por correo electrónico sobre la aprobación de servicios del mes Agosto 2024.",
      duration: 5000,
    })
  }

  const rechazarServicios = () => {
    setShowApprovalModal(false)
    setShowRejectModal(true)
  }

  const confirmarRechazo = () => {
    setShowRejectModal(false)
    setShowRejectConfirmModal(true)
    toast({
      title: "Servicios Rechazados",
      description: "Se ha enviado notificación por correo electrónico con el motivo del rechazo",
      variant: "destructive",
      duration: 5000,
    })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setShowUploadModal(false)
      setShowFileProcessModal(true)
    }
  }

  const selectFile = () => {
    setShowFileProcessModal(true)
  }

  const emailProveedor = (proveedor: any) => {
    setSelectedProveedor(proveedor)
    setShowEmailModal(true)
  }

  const enviarEmail = () => {
    setShowEmailModal(false)
    toast({
      title: "Email Enviado",
      description: "Se ha enviado la notificación por correo electrónico al proveedor.",
      duration: 3000,
    })
  }

  const subirSegSocial = (proveedorId: number) => {
    console.log(`Subir seguridad social para proveedor ${proveedorId}`)
  }

  const approveService = (index: number) => {
    setServiceApprovals(prev => ({
      ...prev,
      [`service_${index}`]: 'approved'
    }))
  }

  const rejectService = (index: number) => {
    setSelectedServiceIndex(index)
    setShowServiceRejectModal(true)
  }

  const confirmServiceReject = () => {
    if (selectedServiceIndex !== null) {
      setServiceApprovals(prev => ({
        ...prev,
        [`service_${selectedServiceIndex}`]: 'rejected'
      }))
    }
    setShowServiceRejectModal(false)
    setServiceRejectReason("")
    setSelectedServiceIndex(null)
  }

  const approveAllServices = () => {
    const newApprovals: {[key: string]: string} = {}
    selectedProveedor?.serviciosDetalle.forEach((_: any, index: number) => {
      newApprovals[`service_${index}`] = 'approved'
    })
    setServiceApprovals(prev => ({
      ...prev,
      ...newApprovals
    }))
    toast({
      title: "Todos los servicios aprobados",
      description: "Se han aprobado todos los servicios del cliente.",
    })
  }

  const getServiceStatus = (index: number) => {
    return serviceApprovals[`service_${index}`] || 'pending'
  }

  const getClientApprovalStatus = (cliente: any) => {
    const clientServices = selectedProveedor?.serviciosDetalle || []
    const approvedCount = clientServices.filter((_: any, index: number) => 
      getServiceStatus(index) === 'approved'
    ).length
    const rejectedCount = clientServices.filter((_: any, index: number) => 
      getServiceStatus(index) === 'rejected'
    ).length
    
    if (rejectedCount > 0) return 'rejected'
    if (approvedCount === clientServices.length) return 'approved'
    return 'pending'
  }

  // Función para agrupar clientes por nombre y sumar sus valores
  const groupClientsByName = (vehiculos: any[]) => {
    const clientesAgrupados: { [key: string]: any } = {}
    
    vehiculos.forEach(vehiculo => {
      vehiculo.clientes.forEach((cliente: any) => {
        if (clientesAgrupados[cliente.nombre]) {
          clientesAgrupados[cliente.nombre].servicios += cliente.servicios
          const valorBrutoActual = parseInt(clientesAgrupados[cliente.nombre].valorBruto.replace(/[^\d]/g, ''))
          const valorBrutoNuevo = parseInt(cliente.valorBruto.replace(/[^\d]/g, ''))
          clientesAgrupados[cliente.nombre].valorBruto = `$${(valorBrutoActual + valorBrutoNuevo).toLocaleString()}`
          
          const valorNetoActual = parseInt(clientesAgrupados[cliente.nombre].valorNeto.replace(/[^\d]/g, ''))
          const valorNetoNuevo = parseInt(cliente.valorNeto.replace(/[^\d]/g, ''))
          clientesAgrupados[cliente.nombre].valorNeto = `$${(valorNetoActual + valorNetoNuevo).toLocaleString()}`
        } else {
          clientesAgrupados[cliente.nombre] = { ...cliente }
        }
      })
    })
    
    return Object.values(clientesAgrupados)
  }

  // Función para calcular descuentos totales unificados
  const getUnifiedDiscounts = (vehiculos: any[]) => {
    let totalGps = 0
    let totalExamenes = 0
    let totalChaqueta = 0
    let totalImpuestos = 0
    
    vehiculos.forEach(vehiculo => {
      vehiculo.clientes.forEach((cliente: any) => {
        totalGps += Math.abs(parseInt(cliente.gps.replace(/[^\d]/g, '')))
        totalExamenes += Math.abs(parseInt(cliente.examenes.replace(/[^\d]/g, '')))
        totalChaqueta += Math.abs(parseInt(cliente.chaqueta.replace(/[^\d]/g, '')))
        totalImpuestos += Math.abs(parseInt(cliente.impuestos.replace(/[^\d]/g, '')))
      })
    })
    
    return {
      gps: `-$${totalGps.toLocaleString()}`,
      examenes: `-$${totalExamenes.toLocaleString()}`,
      chaqueta: `-$${totalChaqueta.toLocaleString()}`,
      impuestos: `-$${totalImpuestos.toLocaleString()}`
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header + CTAs */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-6 pb-0">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Cuenta de Cobro - Proveedores</h1>
          <p className="text-sm text-muted-foreground">Gestión de prefacturas y cuentas de cobro por proveedor</p>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Metric icon={Building2} label="Total Proveedores" value={3} sub={"Todos los registrados"} />
          <Metric icon={Clock} label="Pendientes" value={1} sub={"Esperando aceptación"} />
          <Metric icon={CheckCircle} label="Aceptadas" value={1} sub={"Aprobadas y validadas"} />
          <Metric icon={X} label="Rechazadas" value={1} sub={"Requieren revisión"} />
        </div>

        {/* Vista proveedor y filtros */}
        <Card className="rounded-2xl border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch 
                  checked={showAdvancedActions} 
                  onCheckedChange={setShowAdvancedActions}
                  id="advanced-actions"
                />
                <Label htmlFor="advanced-actions" className="text-sm font-medium">
                  Vista proveedor
                </Label>
              </div>
              
              <Tabs defaultValue="todos">
                <TabsList className="rounded-xl">
                  <TabsTrigger value="todos">Todos los Proveedores</TabsTrigger>
                  <TabsTrigger value="pendientes">Pendientes (1)</TabsTrigger>
                  <TabsTrigger value="aceptadas">Aceptadas (1)</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Lista de proveedores */}
        <Tabs defaultValue="todos" className="w-full">
          <TabsContent value="todos" className="space-y-4">
            {proveedoresData.map((proveedor) => (
              <Card key={proveedor.id} className="rounded-2xl border">
                {/* Card Header with Provider Info */}
                <div className="bg-muted/60 rounded-t-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-xl bg-blue-600/10 text-blue-700 grid place-content-center">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold leading-tight truncate">{proveedor.nombre}</h3>
                        <p className="text-xs text-muted-foreground truncate">
                          Código: {proveedor.codigo} • {proveedor.vehiculos} vehículos • Prefactura: {proveedor.prefactura}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Valor Liquidado:</p>
                      <p className="text-lg font-bold text-primary">{proveedor.valorLiquidado}</p>
                      <div className="mt-1">{getEstadoBadge(proveedor.estado)}</div>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Left: Documents Section */}
                    <div className="lg:col-span-2">
                      <p className="text-sm font-medium mb-3">Documentos:</p>
                      <div className="flex gap-2 flex-wrap">
                        {proveedor.documentos.rut && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100 rounded-md text-xs">✓ RUT</Badge>
                        )}
                        {proveedor.documentos.certBancaria && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100 rounded-md text-xs">✓ Cert. Bancaria</Badge>
                        )}
                        {proveedor.documentos.segSocial ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100 rounded-md text-xs">✓ Seg. Social</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100 rounded-md text-xs">✗ Seg. Social</Badge>
                        )}
                      </div>
                      
                      {/* Motivo de rechazo si aplica */}
                      {proveedor.motivoRechazo && (
                        <Card className="mt-4 rounded-xl border-red-200 bg-red-50">
                          <CardContent className="p-3">
                            <p className="text-sm text-red-700">
                              <strong>Motivo de rechazo:</strong> {proveedor.motivoRechazo}
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                    
                    {/* Right: Action Buttons */}
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl justify-start"
                        onClick={() => verDetalle(proveedor)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalle
                      </Button>
                      {showAdvancedActions && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl justify-start"
                          onClick={() => revisarServicios(proveedor)}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Revisar Servicios
                        </Button>
                      )}
                      {showAdvancedActions && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl justify-start"
                          onClick={() => emailProveedor(proveedor)}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          E-mail Proveedor
                        </Button>
                      )}
                      {showAdvancedActions && proveedor.nombre !== "Transportes Rápidos S.A.S" && proveedor.nombre !== "Cargo Express Ltda" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl justify-start"
                          onClick={() => subirSegSocial(proveedor.id)}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Subir Seg. Social
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="pendientes" className="space-y-4">
            {proveedoresData.filter(p => p.estado === "Pendiente Aceptación").map((proveedor) => (
              <Card key={proveedor.id} className="rounded-2xl border">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-base">{proveedor.nombre}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Código: {proveedor.codigo} • {proveedor.vehiculos} vehículos • Prefactura: {proveedor.prefactura}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Valor Liquidado:</p>
                        <p className="text-2xl font-bold text-primary">{proveedor.valorLiquidado}</p>
                        {getEstadoBadge(proveedor.estado)}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div>
                        <p className="text-sm font-medium mb-2">Documentos:</p>
                        <div className="flex gap-2 flex-wrap">
                          {proveedor.documentos.rut && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100 rounded-md text-xs">✓ RUT</Badge>
                          )}
                          {proveedor.documentos.certBancaria && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100 rounded-md text-xs">✓ Cert. Bancaria</Badge>
                          )}
                          {proveedor.documentos.segSocial ? (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100 rounded-md text-xs">✓ Seg. Social</Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-100 rounded-md text-xs">✗ Seg. Social</Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-6">
                      <Button variant="outline" size="sm" onClick={() => verDetalle(proveedor)} className="w-full rounded-xl">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalle
                      </Button>
                      
                      {showAdvancedActions && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => revisarServicios(proveedor)} className="w-full rounded-xl">
                            <FileText className="h-4 w-4 mr-2" />
                            Revisar Servicios
                          </Button>
                          
                          <Button variant="outline" size="sm" onClick={() => emailProveedor(proveedor)} className="w-full rounded-xl">
                            <Mail className="h-4 w-4 mr-2" />
                            E-mail Proveedor
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="aceptadas" className="space-y-4">
            {proveedoresData.filter(p => p.estado === "Aceptada").map((proveedor) => (
              <Card key={proveedor.id} className="rounded-2xl border">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-base">{proveedor.nombre}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Código: {proveedor.codigo} • {proveedor.vehiculos} vehículos • Prefactura: {proveedor.prefactura}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Valor Liquidado:</p>
                        <p className="text-2xl font-bold text-primary">{proveedor.valorLiquidado}</p>
                        {getEstadoBadge(proveedor.estado)}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div>
                        <p className="text-sm font-medium mb-2">Documentos:</p>
                        <div className="flex gap-2 flex-wrap">
                          {proveedor.documentos.rut && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100 rounded-md text-xs">✓ RUT</Badge>
                          )}
                          {proveedor.documentos.certBancaria && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100 rounded-md text-xs">✓ Cert. Bancaria</Badge>
                          )}
                          {proveedor.documentos.segSocial ? (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100 rounded-md text-xs">✓ Seg. Social</Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-100 rounded-md text-xs">✗ Seg. Social</Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-6">
                      <Button variant="outline" size="sm" onClick={() => verDetalle(proveedor)} className="w-full rounded-xl">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalle
                      </Button>
                      
                      {showAdvancedActions && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => revisarServicios(proveedor)} className="w-full rounded-xl">
                            <FileText className="h-4 w-4 mr-2" />
                            Revisar Servicios
                          </Button>
                          
                          <Button variant="outline" size="sm" onClick={() => emailProveedor(proveedor)} className="w-full rounded-xl">
                            <Mail className="h-4 w-4 mr-2" />
                            E-mail Proveedor
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>

      {/* Modal de Detalle de Facturación */}
      <Dialog open={showDetalleModal} onOpenChange={setShowDetalleModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Detalle de Facturación - {selectedProveedor?.nombre}
            </DialogTitle>
          </DialogHeader>

          {selectedProveedor && (
            <div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-xl">
                <TabsTrigger value="vehiculo">Por Vehículo</TabsTrigger>
                <TabsTrigger value="cliente">Por Cliente</TabsTrigger>
              </TabsList>

              <TabsContent value="vehiculo" className="space-y-6">
                {selectedProveedor?.detalleFacturacion?.vehiculos?.map((vehiculo: any, index: number) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <Truck className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Vehículo {vehiculo.placa}</h3>
                    </div>
                    
                    {vehiculo?.clientes?.map((cliente: any, clienteIndex: number) => (
                      <Card key={clienteIndex} className="border-l-4 border-l-primary rounded-2xl">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4" />
                              <CardTitle className="text-base">{cliente.nombre}</CardTitle>
                            </div>
                            <Button 
                              variant="link" 
                              size="sm"
                              onClick={() => verServicios(cliente)}
                              className="text-primary hover:text-primary/80"
                            >
                              {cliente.servicios} servicios
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-4 gap-4 text-center">
                            <div>
                              <p className="text-sm text-muted-foreground">Valor Bruto</p>
                              <p className="font-semibold text-green-600">{cliente.valorBruto}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">GPS</p>
                              <p className="font-semibold text-red-600">{cliente.gps}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Exámenes</p>
                              <p className="font-semibold text-red-600">{cliente.examenes}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Chaqueta</p>
                              <p className="font-semibold text-red-600">{cliente.chaqueta}</p>
                            </div>
                          </div>
                          {/* Estado del cliente */}
                          <div className="mt-3 flex justify-center">
                            <Badge 
                              variant="secondary" 
                              className={`rounded-md ${
                                cliente.estado === 'aprobado' 
                                  ? "bg-green-100 text-green-800 hover:bg-green-100" 
                                  : "bg-red-100 text-red-800 hover:bg-red-100"
                              }`}
                            >
                              {cliente.estado === 'aprobado' ? 'APROBADO' : 'RECHAZADO'}
                            </Badge>
                          </div>

                          <div className="mt-4 pt-4 border-t">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm text-muted-foreground">Impuestos (6%)</p>
                                <p className="font-semibold text-red-600">{cliente.impuestos}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Valor Neto</p>
                                <p className="text-xl font-bold text-primary">{cliente.valorNeto}</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                     ))}
                   </div>
                )) || []}

                <div className="flex justify-between items-center pt-4 border-t-2 border-primary">
                  <div>
                    <p className="text-lg font-semibold">Total General</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{selectedProveedor?.detalleFacturacion?.totalGeneral}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-xl">
                      <Download className="h-4 w-4 mr-2" />
                      Descargar Detalle
                    </Button>
                    <Button size="sm" className="rounded-xl">Cerrar</Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="cliente" className="space-y-4">
                <div className="space-y-3">
                  {groupClientsByName(selectedProveedor?.detalleFacturacion?.vehiculos || []).map((cliente: any, clienteIndex: number) => (
                    <Card key={clienteIndex} className="rounded-2xl border">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium">{cliente.nombre}</h4>
                            <p className="text-sm text-muted-foreground">Total consolidado</p>
                          </div>
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="text-blue-600"
                            onClick={() => verServicios(cliente)}
                          >
                            {cliente.servicios} servicios
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Valor Bruto:</p>
                            <p className="font-medium">{cliente.valorBruto}</p>
                          </div>
                          <Card className="p-2 rounded-xl bg-green-50">
                            <div>
                              <p className="text-muted-foreground">Valor Neto:</p>
                              <p className="font-medium text-green-600">{cliente.valorNeto}</p>
                            </div>
                          </Card>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {/* Descuentos Aplicados Summary for Por Cliente tab */}
                {selectedProveedor?.detalleFacturacion?.vehiculos && (
                  <Card className="rounded-2xl border-t pt-4 mt-4">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-3">Descuentos Aplicados</h4>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <Card className="p-3 rounded-xl bg-red-50">
                          <div>
                            <p className="text-muted-foreground">GPS Total</p>
                            <p className="font-semibold text-red-600">{getUnifiedDiscounts(selectedProveedor.detalleFacturacion.vehiculos).gps}</p>
                          </div>
                        </Card>
                        <Card className="p-3 rounded-xl bg-red-50">
                          <div>
                            <p className="text-muted-foreground">Exámenes Total</p>
                            <p className="font-semibold text-red-600">{getUnifiedDiscounts(selectedProveedor.detalleFacturacion.vehiculos).examenes}</p>
                          </div>
                        </Card>
                        <Card className="p-3 rounded-xl bg-red-50">
                          <div>
                            <p className="text-muted-foreground">Chaqueta Total</p>
                            <p className="font-semibold text-red-600">{getUnifiedDiscounts(selectedProveedor.detalleFacturacion.vehiculos).chaqueta}</p>
                          </div>
                        </Card>
                        <Card className="p-3 rounded-xl bg-red-50">
                          <div>
                            <p className="text-muted-foreground">Impuestos Total</p>
                            <p className="font-semibold text-red-600">{getUnifiedDiscounts(selectedProveedor.detalleFacturacion.vehiculos).impuestos}</p>
                          </div>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-between items-center pt-4 border-t-2 border-primary">
                  <div>
                    <p className="text-lg font-semibold">Total General</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{selectedProveedor?.detalleFacturacion?.totalGeneral}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-xl">
                      <Download className="h-4 w-4 mr-2" />
                      Descargar Detalle
                    </Button>
                    <Button size="sm" className="rounded-xl">Cerrar</Button>
                  </div>
                </div>
              </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modals for Servicios, Approval, Email, Upload, Reject, etc. would be here with rounded-2xl styling applied */}
    </div>
  )
}
