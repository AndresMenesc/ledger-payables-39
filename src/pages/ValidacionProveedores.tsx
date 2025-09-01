import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/DataTable"
import { 
  Eye, 
  FileText, 
  Calendar,
  Download,
  Check,
  X,
  AlertTriangle,
  User,
  Car,
  Building2
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Tipos de datos
interface ProveedorValidacion {
  id: string
  empresa: string
  contacto: string
  telefono: string
  email: string
  fechaRegistro: string
  estado: 'pendiente' | 'en_revision' | 'aprobado' | 'rechazado'
  recursos: {
    conductores: number
    vehiculos: number
  }
  documentos: {
    aprobados: number
    total: number
  }
}

interface Documento {
  id: string
  nombre: string
  categoria: string
  estado: 'pendiente' | 'aprobado' | 'rechazado'
  fechaSubida: string
  fechaVencimiento?: string
  revisor?: string
  comentarios?: string
  urlDocumento?: string
}

interface ConductorValidacion {
  id: string
  nombre: string
  cedula: string
  telefono: string
  email: string
  estado: 'pendiente' | 'aprobado' | 'rechazado'
  documentos: {
    seguridadSocial: { fecha: string; documento?: string; estado: 'pendiente' | 'aprobado' | 'rechazado' }
    licenciaConduccion: { fecha: string; documento?: string; estado: 'pendiente' | 'aprobado' | 'rechazado' }
    examenesPsicosensometricos: { fecha: string; documento?: string; estado: 'pendiente' | 'aprobado' | 'rechazado' }
  }
}

interface VehiculoValidacion {
  id: string
  placa: string
  tipo: string
  modelo: string
  ano: string
  estado: 'pendiente' | 'aprobado' | 'rechazado'
  documentos: {
    revisionPreventiva: { fecha: string; documento?: string; estado: 'pendiente' | 'aprobado' | 'rechazado' }
    tecnomecanica: { fecha: string; documento?: string; estado: 'pendiente' | 'aprobado' | 'rechazado' }
    tarjetaOperacion: { fecha: string; documento?: string; estado: 'pendiente' | 'aprobado' | 'rechazado' }
    soat: { fecha: string; documento?: string; estado: 'pendiente' | 'aprobado' | 'rechazado' }
    polizaContractual: { fecha: string; documento?: string; estado: 'pendiente' | 'aprobado' | 'rechazado' }
    polizaExtraContractual: { fecha: string; documento?: string; estado: 'pendiente' | 'aprobado' | 'rechazado' }
  }
}

// Datos de ejemplo
const proveedoresValidacion: ProveedorValidacion[] = [
  {
    id: "1",
    empresa: "Transportes Rápidos S.A.S",
    contacto: "Carlos Rodriguez",
    telefono: "3001234567",
    email: "carlos@transportesrapidos.com",
    fechaRegistro: "2024-08-20",
    estado: "pendiente",
    recursos: { conductores: 2, vehiculos: 3 },
    documentos: { aprobados: 8, total: 15 }
  },
  {
    id: "2", 
    empresa: "Logística Total Ltda",
    contacto: "María González",
    telefono: "3109876543",
    email: "maria@logisticatotal.com",
    fechaRegistro: "2024-08-18",
    estado: "en_revision",
    recursos: { conductores: 1, vehiculos: 2 },
    documentos: { aprobados: 10, total: 10 }
  },
  {
    id: "3",
    empresa: "Servicios Express",
    contacto: "Juan Pérez",
    telefono: "3205555555",
    email: "juan@serviciosxpress.com",
    fechaRegistro: "2024-08-15",
    estado: "aprobado",
    recursos: { conductores: 3, vehiculos: 4 },
    documentos: { aprobados: 20, total: 20 }
  }
]

const documentosEjemplo: Documento[] = [
  {
    id: "1",
    nombre: "Cédula Representante Legal",
    categoria: "Proveedor",
    estado: "aprobado",
    fechaSubida: "2024-08-20",
    revisor: "Admin Usuario",
    comentarios: "Documento válido y actualizado",
    urlDocumento: "/api/documentos/cedula-ejemplo.pdf"
  },
  {
    id: "2", 
    nombre: "Certificado Bancario",
    categoria: "Proveedor",
    estado: "pendiente",
    fechaSubida: "2024-08-20",
    urlDocumento: "/api/documentos/certificado-bancario.pdf"
  }
]

const conductoresEjemplo: ConductorValidacion[] = [
  {
    id: "1",
    nombre: "Pedro López",
    cedula: "12345678",
    telefono: "3001111111",
    email: "pedro@email.com",
    estado: "pendiente",
    documentos: {
      seguridadSocial: { fecha: "2024-12-15", documento: "/api/documentos/seguridad-social.pdf", estado: "pendiente" },
      licenciaConduccion: { fecha: "2025-03-20", documento: "/api/documentos/licencia.pdf", estado: "aprobado" },
      examenesPsicosensometricos: { fecha: "2024-11-30", documento: "/api/documentos/examenes.pdf", estado: "rechazado" }
    }
  }
]

const vehiculosEjemplo: VehiculoValidacion[] = [
  {
    id: "1",
    placa: "ABC123",
    tipo: "Camión",
    modelo: "Ford F-150",
    ano: "2020",
    estado: "pendiente",
    documentos: {
      revisionPreventiva: { fecha: "2024-12-15", documento: "/api/documentos/revision.pdf", estado: "pendiente" },
      tecnomecanica: { fecha: "2025-06-30", documento: "/api/documentos/tecnomecanica.pdf", estado: "aprobado" },
      tarjetaOperacion: { fecha: "2025-01-20", documento: "/api/documentos/tarjeta.pdf", estado: "pendiente" },
      soat: { fecha: "2024-11-15", documento: "/api/documentos/soat.pdf", estado: "rechazado" },
      polizaContractual: { fecha: "2025-03-10", documento: "/api/documentos/poliza1.pdf", estado: "aprobado" },
      polizaExtraContractual: { fecha: "2025-03-10", documento: "/api/documentos/poliza2.pdf", estado: "pendiente" }
    }
  }
]

export default function ValidacionProveedores() {
  const [selectedProveedor, setSelectedProveedor] = useState<ProveedorValidacion | null>(null)
  const [validacionOpen, setValidacionOpen] = useState(false)
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false)
  const [selectedPdf, setSelectedPdf] = useState<string>("")
  const [activeTab, setActiveTab] = useState("documentos")
  const { toast } = useToast()

  const columns = [
    { key: 'empresa', label: 'Empresa', sortable: true },
    { key: 'contacto', label: 'Contacto', sortable: true },
    { key: 'fechaRegistro', label: 'Fecha Registro', sortable: true },
    { key: 'estado', label: 'Estado', sortable: true },
    { key: 'recursos', label: 'Recursos', sortable: false },
    { key: 'documentos', label: 'Documentos', sortable: false },
  ]

  const getEstadoBadge = (estado: string) => {
    const variants = {
      'pendiente': 'pending-light',
      'en_revision': 'warning-light',
      'aprobado': 'success-light',
      'rechazado': 'destructive'
    }
    
    const labels = {
      'pendiente': 'Pendiente',
      'en_revision': 'En Revisión', 
      'aprobado': 'Aprobado',
      'rechazado': 'Rechazado'
    }

    return (
      <Badge variant={variants[estado as keyof typeof variants] as any}>
        {labels[estado as keyof typeof labels]}
      </Badge>
    )
  }

  const getDocumentoBadge = (estado: string) => {
    const variants = {
      'pendiente': 'pending-light',
      'aprobado': 'success-light',
      'rechazado': 'destructive'
    }
    
    const labels = {
      'pendiente': 'Pendiente',
      'aprobado': 'Aprobado',
      'rechazado': 'Rechazado'
    }

    return (
      <Badge variant={variants[estado as keyof typeof variants] as any}>
        {labels[estado as keyof typeof labels]}
      </Badge>
    )
  }

  const handleVerPdf = (url: string) => {
    setSelectedPdf(url)
    setPdfViewerOpen(true)
  }

  const handleVerValidacion = (proveedor: ProveedorValidacion) => {
    setSelectedProveedor(proveedor)
    setValidacionOpen(true)
  }

  const handleAprobarDocumento = (documentoId: string) => {
    toast({
      title: "Documento aprobado",
      description: "El documento ha sido aprobado exitosamente"
    })
  }

  const handleRechazarDocumento = (documentoId: string) => {
    toast({
      title: "Documento rechazado", 
      description: "El documento ha sido rechazado"
    })
  }

  const renderCell = (key: string, value: any, row: ProveedorValidacion) => {
    switch (key) {
      case 'estado':
        return getEstadoBadge(value)
      case 'fechaRegistro':
        return new Date(value).toLocaleDateString('es-CO')
      case 'recursos':
        return (
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">
              <User className="h-3 w-3 mr-1" />
              {row.recursos.conductores}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Car className="h-3 w-3 mr-1" />
              {row.recursos.vehiculos}
            </Badge>
          </div>
        )
      case 'documentos':
        return (
          <div className="text-sm">
            <span className="font-medium text-success">
              {row.documentos.aprobados}
            </span>
            <span className="text-muted-foreground">
              /{row.documentos.total} aprobados
            </span>
          </div>
        )
      default:
        return value
    }
  }

  const actions = (row: ProveedorValidacion) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleVerValidacion(row)}
    >
      <Eye className="h-4 w-4" />
    </Button>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Validación de Proveedores</h1>
          <p className="text-muted-foreground">
            Gestiona la validación de documentos y aprobación de nuevos proveedores
          </p>
        </div>
      </div>

      <DataTable
        title="Proveedores Pendientes de Validación"
        columns={columns}
        data={proveedoresValidacion}
        actions={actions}
        renderCell={renderCell}
        searchable={true}
        filterable={true}
        exportable={true}
        summary={
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <div>
                  <p className="text-sm font-medium">Pendientes</p>
                  <p className="text-2xl font-bold">
                    {proveedoresValidacion.filter(p => p.estado === 'pendiente').length}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">En Revisión</p>
                  <p className="text-2xl font-bold">
                    {proveedoresValidacion.filter(p => p.estado === 'en_revision').length}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-success" />
                <div>
                  <p className="text-sm font-medium">Aprobados</p>
                  <p className="text-2xl font-bold">
                    {proveedoresValidacion.filter(p => p.estado === 'aprobado').length}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <X className="h-5 w-5 text-destructive" />
                <div>
                  <p className="text-sm font-medium">Rechazados</p>
                  <p className="text-2xl font-bold">
                    {proveedoresValidacion.filter(p => p.estado === 'rechazado').length}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        }
      />

      {/* Modal de Validación */}
      <Dialog open={validacionOpen} onOpenChange={setValidacionOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Validación de Documentos - {selectedProveedor?.empresa}
            </DialogTitle>
            <DialogDescription>
              Revisa y valida los documentos, vehículos y conductores del proveedor
            </DialogDescription>
          </DialogHeader>

          {selectedProveedor && (
            <div className="space-y-6">
              {/* Información del Proveedor */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Información del Proveedor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Empresa</Label>
                      <p className="font-medium">{selectedProveedor.empresa}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Contacto</Label>
                      <p className="font-medium">{selectedProveedor.contacto}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Teléfono</Label>
                      <p className="font-medium">{selectedProveedor.telefono}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                      <p className="font-medium">{selectedProveedor.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Estado</Label>
                      <div className="mt-1">{getEstadoBadge(selectedProveedor.estado)}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Fecha de Registro</Label>
                      <p className="font-medium">{new Date(selectedProveedor.fechaRegistro).toLocaleDateString('es-CO')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs para Documentos, Vehículos y Conductores */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="documentos">
                    <FileText className="h-4 w-4 mr-2" />
                    Documentos
                  </TabsTrigger>
                  <TabsTrigger value="vehiculos">
                    <Car className="h-4 w-4 mr-2" />
                    Vehículos
                  </TabsTrigger>
                  <TabsTrigger value="conductores">
                    <User className="h-4 w-4 mr-2" />
                    Conductores
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="documentos" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Documentos del Proveedor</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Datos Bancarios */}
                        <div className="p-4 border border-border rounded-lg">
                          <h4 className="font-semibold mb-3">Datos Bancarios</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Banco</Label>
                              <p className="font-medium">Banco de Bogotá</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Tipo de Cuenta</Label>
                              <p className="font-medium">Cuenta Corriente</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Número de Cuenta</Label>
                              <p className="font-medium">001234567890</p>
                            </div>
                          </div>
                        </div>

                        {/* Documentos */}
                        {documentosEjemplo.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                            <div className="flex items-center gap-4">
                              <FileText className="h-8 w-8 text-primary" />
                              <div>
                                <p className="font-medium">{doc.nombre}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">{doc.categoria}</Badge>
                                  {getDocumentoBadge(doc.estado)}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Subido: {new Date(doc.fechaSubida).toLocaleDateString('es-CO')}
                                </p>
                                {doc.revisor && (
                                  <p className="text-sm text-muted-foreground">
                                    Revisado por: {doc.revisor}
                                  </p>
                                )}
                                {doc.comentarios && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {doc.comentarios}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              {doc.urlDocumento && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleVerPdf(doc.urlDocumento!)}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              )}
                              {doc.estado === 'pendiente' && (
                                <>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleAprobarDocumento(doc.id)}
                                    className="text-success hover:text-success"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleRechazarDocumento(doc.id)}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="vehiculos" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Vehículos y Documentos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {vehiculosEjemplo.map((vehiculo) => (
                          <div key={vehiculo.id} className="border border-border rounded-lg p-4">
                            <div className="flex items-center gap-4 mb-4">
                              <Car className="h-8 w-8 text-primary" />
                              <div>
                                <p className="font-medium">{vehiculo.placa}</p>
                                <p className="text-sm text-muted-foreground">
                                  {vehiculo.tipo} - {vehiculo.modelo} ({vehiculo.ano})
                                </p>
                                {getDocumentoBadge(vehiculo.estado)}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {Object.entries(vehiculo.documentos).map(([tipo, doc]) => (
                                <div key={tipo} className="p-3 border border-border rounded-lg">
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <p className="font-medium text-sm capitalize">
                                        {tipo.replace(/([A-Z])/g, ' $1').trim()}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        Vence: {new Date(doc.fecha).toLocaleDateString('es-CO')}
                                      </p>
                                    </div>
                                    {getDocumentoBadge(doc.estado)}
                                  </div>
                                  <div className="flex gap-2">
                                    {doc.documento && (
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => handleVerPdf(doc.documento!)}
                                        className="text-xs"
                                      >
                                        <FileText className="h-3 w-3 mr-1" />
                                        Ver PDF
                                      </Button>
                                    )}
                                    {doc.estado === 'pendiente' && (
                                      <>
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          className="text-success hover:text-success text-xs"
                                        >
                                          <Check className="h-3 w-3" />
                                        </Button>
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          className="text-destructive hover:text-destructive text-xs"
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="conductores" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Conductores y Documentos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {conductoresEjemplo.map((conductor) => (
                          <div key={conductor.id} className="border border-border rounded-lg p-4">
                            <div className="flex items-center gap-4 mb-4">
                              <User className="h-8 w-8 text-primary" />
                              <div>
                                <p className="font-medium">{conductor.nombre}</p>
                                <p className="text-sm text-muted-foreground">
                                  CC: {conductor.cedula} - {conductor.telefono}
                                </p>
                                {getDocumentoBadge(conductor.estado)}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {Object.entries(conductor.documentos).map(([tipo, doc]) => (
                                <div key={tipo} className="p-3 border border-border rounded-lg">
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <p className="font-medium text-sm capitalize">
                                        {tipo.replace(/([A-Z])/g, ' $1').trim()}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        Vence: {new Date(doc.fecha).toLocaleDateString('es-CO')}
                                      </p>
                                    </div>
                                    {getDocumentoBadge(doc.estado)}
                                  </div>
                                  <div className="flex gap-2">
                                    {doc.documento && (
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => handleVerPdf(doc.documento!)}
                                        className="text-xs"
                                      >
                                        <FileText className="h-3 w-3 mr-1" />
                                        Ver PDF
                                      </Button>
                                    )}
                                    {doc.estado === 'pendiente' && (
                                      <>
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          className="text-success hover:text-success text-xs"
                                        >
                                          <Check className="h-3 w-3" />
                                        </Button>
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          className="text-destructive hover:text-destructive text-xs"
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Acciones del Modal */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setValidacionOpen(false)}>
                  Cerrar
                </Button>
                <Button variant="destructive">
                  Rechazar Proveedor
                </Button>
                <Button>
                  Aprobar Proveedor
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal para ver PDF */}
      <Dialog open={pdfViewerOpen} onOpenChange={setPdfViewerOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Visualizar Documento</DialogTitle>
          </DialogHeader>
          <div className="h-[70vh] w-full border border-border rounded-lg overflow-hidden">
            <iframe 
              src={selectedPdf}
              className="w-full h-full"
              title="Documento PDF"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}