import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
              valorNeto: "$4.140.000"
            },
            {
              nombre: "Sutherland",
              servicios: 22,
              valorBruto: "$2.200.000",
              gps: "-$25.000",
              examenes: "$0",
              chaqueta: "$0",
              impuestos: "-$132.000",
              valorNeto: "$2.043.000"
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
              valorNeto: "$3.495.000"
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
  const [serviceApprovals, setServiceApprovals] = useState<{[key: string]: string}>({}) // 'approved', 'rejected', 'pending'
  const [showServiceRejectModal, setShowServiceRejectModal] = useState(false)
  const [selectedServiceIndex, setSelectedServiceIndex] = useState<number | null>(null)
  const [serviceRejectReason, setServiceRejectReason] = useState("")

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Pendiente Aceptación":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Pendiente Aceptación</Badge>
      case "Aceptada":
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Aceptada</Badge>
      case "Rechazada":
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Rechazada</Badge>
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
    // Check if all services for this client are approved
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
          // Sumar servicios
          clientesAgrupados[cliente.nombre].servicios += cliente.servicios
          // Sumar valores (convertir de string a número, sumar, y volver a string)
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Proveedores - Liquidación de Servicios</h1>
          <p className="text-muted-foreground">
            Gestión de prefacturas y cuentas de cobro por proveedor
          </p>
        </div>
      </div>

      {/* Switch para mostrar/ocultar acciones avanzadas */}
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

      {/* Tabs de filtros */}
      <Tabs defaultValue="todos" className="w-full">
        <TabsList>
          <TabsTrigger value="todos">Todos los Proveedores</TabsTrigger>
          <TabsTrigger value="pendientes">Pendientes (1)</TabsTrigger>
          <TabsTrigger value="aceptadas">Aceptadas (1)</TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="space-y-4">
          {proveedoresData.map((proveedor) => (
            <Card key={proveedor.id} className="w-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{proveedor.nombre}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Código: {proveedor.codigo} • {proveedor.vehiculos} vehículos • Prefactura: {proveedor.prefactura}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {getEstadoBadge(proveedor.estado)}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Valor Liquidado:</p>
                    <p className="text-2xl font-bold text-primary">{proveedor.valorLiquidado}</p>
                  </div>
                </div>

                {/* Documentos */}
                <div>
                  <p className="text-sm font-medium mb-2">Documentos:</p>
                  <div className="flex gap-2">
                    {proveedor.documentos.rut && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">✓ RUT</Badge>
                    )}
                    {proveedor.documentos.certBancaria && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">✓ Cert. Bancaria</Badge>
                    )}
                    {proveedor.documentos.segSocial ? (
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">✓ Seg. Social</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">✗ Seg. Social</Badge>
                    )}
                  </div>
                </div>

                {/* Motivo de rechazo si aplica */}
                {proveedor.motivoRechazo && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-700">
                      <strong>Motivo de rechazo:</strong> {proveedor.motivoRechazo}
                    </p>
                  </div>
                )}

                {/* Botones de acción */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => verDetalle(proveedor)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalle
                  </Button>
                  
                  {showAdvancedActions && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => revisarServicios(proveedor)}>
                        <FileText className="h-4 w-4 mr-2" />
                        Revisar Servicios
                      </Button>
                      
                      <Button variant="outline" size="sm" onClick={() => emailProveedor(proveedor)}>
                        <Mail className="h-4 w-4 mr-2" />
                        E-mail Proveedor
                      </Button>
                    </>
                  )}
                  
                  {proveedor.nombre !== "Transportes Rápidos S.A.S" && proveedor.nombre !== "Cargo Express Ltda" && (
                    <Button variant="outline" size="sm" onClick={() => subirSegSocial(proveedor.id)}>
                      <FileText className="h-4 w-4 mr-2" />
                      Subir Seg. Social
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pendientes" className="space-y-4">
          {proveedoresData.filter(p => p.estado === "Pendiente Aceptación").map((proveedor) => (
            <Card key={proveedor.id} className="w-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{proveedor.nombre}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Código: {proveedor.codigo} • {proveedor.vehiculos} vehículos • Prefactura: {proveedor.prefactura}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {getEstadoBadge(proveedor.estado)}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Valor Liquidado:</p>
                    <p className="text-2xl font-bold text-primary">{proveedor.valorLiquidado}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Documentos:</p>
                  <div className="flex gap-2">
                    {proveedor.documentos.rut && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">✓ RUT</Badge>
                    )}
                    {proveedor.documentos.certBancaria && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">✓ Cert. Bancaria</Badge>
                    )}
                    {proveedor.documentos.segSocial ? (
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">✓ Seg. Social</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">✗ Seg. Social</Badge>
                    )}
                  </div>
                </div>

                {proveedor.motivoRechazo && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-700">
                      <strong>Motivo de rechazo:</strong> {proveedor.motivoRechazo}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => verDetalle(proveedor)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalle
                  </Button>
                  
                  {showAdvancedActions && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => revisarServicios(proveedor)}>
                        <FileText className="h-4 w-4 mr-2" />
                        Revisar Servicios
                      </Button>
                      
                      <Button variant="outline" size="sm" onClick={() => emailProveedor(proveedor)}>
                        <Mail className="h-4 w-4 mr-2" />
                        E-mail Proveedor
                      </Button>
                    </>
                  )}
                  
                  {proveedor.nombre !== "Transportes Rápidos S.A.S" && proveedor.nombre !== "Cargo Express Ltda" && (
                    <Button variant="outline" size="sm" onClick={() => subirSegSocial(proveedor.id)}>
                      <FileText className="h-4 w-4 mr-2" />
                      Subir Seg. Social
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="aceptadas" className="space-y-4">
          {proveedoresData.filter(p => p.estado === "Aceptada").map((proveedor) => (
            <Card key={proveedor.id} className="w-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{proveedor.nombre}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Código: {proveedor.codigo} • {proveedor.vehiculos} vehículos • Prefactura: {proveedor.prefactura}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {getEstadoBadge(proveedor.estado)}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Valor Liquidado:</p>
                    <p className="text-2xl font-bold text-primary">{proveedor.valorLiquidado}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Documentos:</p>
                  <div className="flex gap-2">
                    {proveedor.documentos.rut && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">✓ RUT</Badge>
                    )}
                    {proveedor.documentos.certBancaria && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">✓ Cert. Bancaria</Badge>
                    )}
                    {proveedor.documentos.segSocial ? (
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">✓ Seg. Social</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">✗ Seg. Social</Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => verDetalle(proveedor)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalle
                  </Button>
                  
                  {showAdvancedActions && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => revisarServicios(proveedor)}>
                        <FileText className="h-4 w-4 mr-2" />
                        Revisar Servicios
                      </Button>
                      
                      <Button variant="outline" size="sm" onClick={() => emailProveedor(proveedor)}>
                        <Mail className="h-4 w-4 mr-2" />
                        E-mail Proveedor
                      </Button>
                    </>
                  )}
                  
                  {proveedor.nombre !== "Transportes Rápidos S.A.S" && proveedor.nombre !== "Cargo Express Ltda" && (
                    <Button variant="outline" size="sm" onClick={() => subirSegSocial(proveedor.id)}>
                      <FileText className="h-4 w-4 mr-2" />
                      Subir Seg. Social
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Modal de Detalle de Facturación */}
      <Dialog open={showDetalleModal} onOpenChange={setShowDetalleModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Detalle de Facturación - {selectedProveedor?.nombre}
            </DialogTitle>
          </DialogHeader>

          {selectedProveedor && (
            <div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
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
                      <Card key={clienteIndex} className="border-l-4 border-l-primary">
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
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Descargar Detalle
                    </Button>
                    <Button size="sm">Cerrar</Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="cliente" className="space-y-4">
                <div className="space-y-3">
                  {groupClientsByName(selectedProveedor?.detalleFacturacion?.vehiculos || []).map((cliente: any, clienteIndex: number) => (
                    <div key={clienteIndex} className="border rounded-lg p-4">
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
                        <div className="bg-green-50 p-2 rounded">
                          <p className="text-muted-foreground">Valor Neto:</p>
                          <p className="font-medium text-green-600">{cliente.valorNeto}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Descuentos Unificados - now moved to bottom of main tab */}
                
                 {/* Descuentos Aplicados Summary for Por Cliente tab */}
                {selectedProveedor?.detalleFacturacion?.vehiculos && (
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-medium mb-3">Descuentos Aplicados</h4>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div className="bg-red-50 p-3 rounded">
                        <p className="text-muted-foreground">GPS Total</p>
                        <p className="font-semibold text-red-600">{getUnifiedDiscounts(selectedProveedor.detalleFacturacion.vehiculos).gps}</p>
                      </div>
                      <div className="bg-red-50 p-3 rounded">
                        <p className="text-muted-foreground">Exámenes Total</p>
                        <p className="font-semibold text-red-600">{getUnifiedDiscounts(selectedProveedor.detalleFacturacion.vehiculos).examenes}</p>
                      </div>
                      <div className="bg-red-50 p-3 rounded">
                        <p className="text-muted-foreground">Chaqueta Total</p>
                        <p className="font-semibold text-red-600">{getUnifiedDiscounts(selectedProveedor.detalleFacturacion.vehiculos).chaqueta}</p>
                      </div>
                      <div className="bg-red-50 p-3 rounded">
                        <p className="text-muted-foreground">Impuestos Total</p>
                        <p className="font-semibold text-red-600">{getUnifiedDiscounts(selectedProveedor.detalleFacturacion.vehiculos).impuestos}</p>
                      </div>
                    </div>
                  </div>
                )}

                 {/* Total General para el tab Por Cliente */}
                <div className="border-t pt-4 mt-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-blue-900">Total General:</span>
                      <span className="text-xl font-bold text-blue-900">{selectedProveedor?.detalleFacturacion?.totalGeneral}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Detalle de Servicios */}
      <Dialog open={showServiciosModal} onOpenChange={setShowServiciosModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Detalle de Servicios - {selectedCliente?.nombre}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Vehículo ABC-123 • {selectedCliente?.servicios} servicios registrados
            </p>
          </DialogHeader>

          {selectedCliente && (
            <div className="space-y-6">
              {/* Tarjetas de resumen */}
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">5</p>
                    <p className="text-sm text-blue-600">Total Servicios</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">126</p>
                    <p className="text-sm text-blue-600">Usuarios Total</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">25</p>
                    <p className="text-sm text-green-600">Promedio Usuarios</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Calculator className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">$600.000</p>
                    <p className="text-sm text-blue-600">Valor Total</p>
                  </CardContent>
                </Card>
              </div>

              {/* Tabla de servicios detallados */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Registro Detallado de Servicios
                    </CardTitle>
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={approveAllServices}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Aprobar Todos
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">Fecha</th>
                          <th className="text-left p-3">Hora</th>
                          <th className="text-left p-3">Localidad/Ruta</th>
                          <th className="text-left p-3">Usuarios</th>
                          <th className="text-left p-3">Valor</th>
                          <th className="text-left p-3">Estado</th>
                          <th className="text-left p-3">Aprobación</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedProveedor?.serviciosDetalle.map((servicio: any, index: number) => (
                          <tr key={index} className="border-b hover:bg-muted/50">
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                {servicio.fecha}
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                {servicio.hora}
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">{servicio.ruta.split(" - ")[0]}</p>
                                  <p className="text-sm text-muted-foreground">{servicio.ruta.split(" - ")[1]}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                {servicio.usuarios}
                              </div>
                            </td>
                            <td className="p-3 font-semibold text-primary">{servicio.valor}</td>
                            <td className="p-3">
                              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                                {servicio.estado}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                {getServiceStatus(index) === 'pending' && (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => approveService(index)}
                                      className="text-green-600 border-green-600 hover:bg-green-50"
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => rejectService(index)}
                                      className="text-red-600 border-red-600 hover:bg-red-50"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                                {getServiceStatus(index) === 'approved' && (
                                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                                    Aprobado
                                  </Badge>
                                )}
                                {getServiceStatus(index) === 'rejected' && (
                                  <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                                    Rechazado
                                  </Badge>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    Mostrando 5 de {selectedCliente?.servicios} servicios
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={() => setShowServiciosModal(false)}>Cerrar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Aprobación de Servicios */}
      {showApprovalModal && (
        <Dialog open={showApprovalModal} onOpenChange={setShowApprovalModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <DialogTitle>Aprobar Servicios - Agosto 2024</DialogTitle>
              </div>
            </DialogHeader>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-lg">{selectedProveedor?.nombre}</h3>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">Total Liquidado:</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedProveedor?.valorLiquidado}</p>
                </div>
              </div>

              <div>
                <p className="font-medium mb-4">¿Apruebas los servicios facturados?</p>
                <div className="flex gap-3">
                  <Button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={aprobarServicios}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Aprobar Servicios
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                    onClick={rechazarServicios}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Rechazar Servicios
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de Subir Planilla */}
      {showUploadModal && (
        <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <DialogTitle>¡Servicios Aprobados! - Subir Planilla</DialogTitle>
              </div>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Correo Enviado</span>
                </div>
                <p className="text-sm text-green-600">
                  Se ha enviado confirmación por correo electrónico sobre la aprobación de servicios del mes Agosto 2024.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Upload className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Siguiente Paso: Subir Planilla de Seguridad Social</span>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="font-medium mb-2">Arrastra tu planilla aquí o haz clic para seleccionar</p>
                  <p className="text-sm text-muted-foreground mb-4">Formatos aceptados: PDF, JPG, PNG (máx. 10MB)</p>
                  
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" className="cursor-pointer" onClick={selectFile}>
                      Seleccionar Archivo
                    </Button>
                  </label>
                </div>
                
                <p className="text-sm text-muted-foreground mt-4">
                  Recordatorio: La planilla de seguridad social debe corresponder al mes Agosto 2024.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de Proceso Completado */}
      {showSuccessModal && (
        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <DialogTitle>¡Proceso Completado!</DialogTitle>
              </div>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="text-center">
                <div className="bg-green-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-medium text-lg mb-2">¡Todo Listo!</h3>
                <p className="text-muted-foreground">
                  Servicios aprobados y planilla de seguridad social subida exitosamente. El área administrativa procesará tu cuenta de cobro.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                  Estado: Pendiente de Pago
                </Badge>
              </div>

              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setShowSuccessModal(false)}
              >
                Cerrar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de Proceso de Archivo */}
      {showFileProcessModal && (
        <Dialog open={showFileProcessModal} onOpenChange={setShowFileProcessModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <DialogTitle>¡Proceso Completado!</DialogTitle>
              </div>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="text-center">
                <div className="bg-green-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-medium text-lg mb-2">¡Todo Listo!</h3>
                <p className="text-muted-foreground">
                  Servicios aprobados y planilla de seguridad social subida exitosamente. El área administrativa procesará tu cuenta de cobro.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                  Estado: Pendiente de Pago
                </Badge>
              </div>

              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setShowFileProcessModal(false)}
              >
                Cerrar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de Rechazar Servicios */}
      {showRejectModal && (
        <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <div className="flex items-center gap-2 text-red-600">
                <X className="h-5 w-5" />
                <DialogTitle>Rechazar Servicios - Motivo Requerido</DialogTitle>
              </div>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-700 mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">Especifica el motivo del rechazo</span>
                </div>
                <p className="text-sm text-red-600">
                  Este mensaje será enviado al área administrativa para revisión.
                </p>
              </div>

              <div>
                <Label htmlFor="motivo" className="font-medium">Motivo del rechazo:</Label>
                <Textarea
                  id="motivo"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Ejemplo: Tarifas erróneas en servicios del 10 de agosto, me falta un servicio de la fecha 15 agosto horario 2:00 PM..."
                  className="mt-2 min-h-[100px]"
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowRejectModal(false)}
                >
                  Volver
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1"
                  onClick={confirmarRechazo}
                  disabled={!rejectReason.trim()}
                >
                  Confirmar Rechazo
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de Confirmación de Rechazo */}
      {showRejectConfirmModal && (
        <Dialog open={showRejectConfirmModal} onOpenChange={setShowRejectConfirmModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <DialogTitle>Rechazo Registrado</DialogTitle>
              </div>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="text-center">
                <div className="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <X className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="font-medium text-lg mb-2">Rechazo Registrado</h3>
                <p className="text-muted-foreground">
                  Tu feedback ha sido enviado al área administrativa para revisión.
                </p>
              </div>

              <div className="bg-gray-50 border rounded-lg p-3">
                <p className="text-sm font-medium">Motivo: {rejectReason}</p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
                  Estado: En Revisión
                </Badge>
              </div>

              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setShowRejectConfirmModal(false)}
              >
                Cerrar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de E-mail Proveedor */}
      {showEmailModal && (
        <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Vista Previa - Notificación por Correo</DialogTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-4 top-4"
                onClick={() => setShowEmailModal(false)}
              >
                Cerrar
              </Button>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Header del email */}
              <div className="border-l-4 border-blue-500 pl-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Vista Previa - Correo Automático</span>
                      <Badge className="bg-blue-100 text-blue-700">Aprobado</Badge>
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <p><strong>Para:</strong> transportesrapidos.sas@ejemplo.com</p>
                      <p><strong>De:</strong> noreply@estarter.co</p>
                      <p><strong>Asunto:</strong> ✅ Servicios Aprobados - Agosto 2024</p>
                    </div>
                  </div>
                </div>

                {/* Contenido del email */}
                <div className="bg-white border rounded-lg p-6 space-y-6">
                  <div className="text-center">
                    <div className="bg-green-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">¡Servicios Aprobados!</h2>
                  </div>

                  <div>
                    <p className="mb-4"><strong>Estimado/a {selectedProveedor?.nombre}</strong></p>
                    <p className="mb-4">
                      Te informamos que has <span className="font-medium text-green-600">aprobado</span> los servicios correspondientes al mes de <strong>Agosto 2024</strong>.
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calculator className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Resumen de Liquidación:</span>
                    </div>
                    <div className="space-y-1">
                      <p><strong>Valor Total:</strong> {selectedProveedor?.valorLiquidado}</p>
                      <p className="text-sm text-muted-foreground"><strong>Período:</strong> Agosto 2024</p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">Próximos pasos:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Se generará <strong>automáticamente</strong> tu cuenta de cobro en PDF</li>
                      <li>Debes <strong>subir la planilla</strong> de seguridad social correspondiente</li>
                      <li>Una vez validada, procederemos con el pago según calendario</li>
                    </ul>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm">Puedes acceder a tu portal en: <span className="text-blue-600">portal.estarter.co</span></p>
                    
                    <div className="mt-4 text-sm text-muted-foreground">
                      <p>Saludos cordiales,</p>
                      <p><strong>Equipo Estarter.co</strong></p>
                      <p>📧 soporte@estarter.co</p>
                      <p>📞 +57 300 123 4567</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowEmailModal(false)}>
                  Cancelar
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={enviarEmail}>
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar Email
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de Motivo de Rechazo de Servicio */}
      <Dialog open={showServiceRejectModal} onOpenChange={setShowServiceRejectModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Motivo del Rechazo
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Por favor, especifique el motivo por el cual está rechazando este servicio.
            </p>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="serviceRejectReason">Motivo del rechazo</Label>
              <Textarea
                id="serviceRejectReason"
                placeholder="Describa el motivo del rechazo..."
                value={serviceRejectReason}
                onChange={(e) => setServiceRejectReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowServiceRejectModal(false)
                setServiceRejectReason("")
                setSelectedServiceIndex(null)
              }}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmServiceReject}
              disabled={!serviceRejectReason.trim()}
            >
              Confirmar Rechazo
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}