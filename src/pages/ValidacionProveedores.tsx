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
  revisor?: string
  comentarios?: string
}

interface ConductorValidacion {
  id: string
  nombre: string
  cedula: string
  telefono: string
  email: string
  estado: 'pendiente' | 'aprobado' | 'rechazado'
  documentos: Documento[]
}

interface VehiculoValidacion {
  id: string
  placa: string
  tipo: string
  modelo: string
  ano: string
  estado: 'pendiente' | 'aprobado' | 'rechazado'
  documentos: Documento[]
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
    nombre: "RUT Empresa",
    categoria: "Proveedor",
    estado: "aprobado",
    fechaSubida: "2024-08-20",
    revisor: "Admin Usuario",
    comentarios: "Documento válido y actualizado"
  },
  {
    id: "2", 
    nombre: "Cédula Representante Legal",
    categoria: "Proveedor",
    estado: "aprobado",
    fechaSubida: "2024-08-20",
    revisor: "Admin Usuario"
  },
  {
    id: "3",
    nombre: "SOAT Vehículo ABC123",
    categoria: "Vehículo",
    estado: "pendiente",
    fechaSubida: "2024-08-20"
  },
  {
    id: "4",
    nombre: "Tarjeta de Propiedad ABC123",
    categoria: "Vehículo", 
    estado: "rechazado",
    fechaSubida: "2024-08-20",
    revisor: "Admin Usuario",
    comentarios: "Documento vencido, requiere actualización"
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
    documentos: []
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
    documentos: []
  }
]

export default function ValidacionProveedores() {
  const [selectedProveedor, setSelectedProveedor] = useState<ProveedorValidacion | null>(null)
  const [validacionOpen, setValidacionOpen] = useState(false)
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
                      <CardTitle>Documentos Subidos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
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
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
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
                      <CardTitle>Vehículos Registrados</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {vehiculosEjemplo.map((vehiculo) => (
                          <div key={vehiculo.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                            <div className="flex items-center gap-4">
                              <Car className="h-8 w-8 text-primary" />
                              <div>
                                <p className="font-medium">{vehiculo.placa}</p>
                                <p className="text-sm text-muted-foreground">
                                  {vehiculo.tipo} - {vehiculo.modelo} ({vehiculo.ano})
                                </p>
                                {getDocumentoBadge(vehiculo.estado)}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
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
                      <CardTitle>Conductores Registrados</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {conductoresEjemplo.map((conductor) => (
                          <div key={conductor.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                            <div className="flex items-center gap-4">
                              <User className="h-8 w-8 text-primary" />
                              <div>
                                <p className="font-medium">{conductor.nombre}</p>
                                <p className="text-sm text-muted-foreground">
                                  CC: {conductor.cedula} - {conductor.telefono}
                                </p>
                                {getDocumentoBadge(conductor.estado)}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
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
    </div>
  )
}