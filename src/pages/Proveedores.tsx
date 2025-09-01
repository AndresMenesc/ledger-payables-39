import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/DataTable"
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  Phone, 
  Mail, 
  MapPin,
  Building2,
  User,
  FileText,
  Calendar,
  Star
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

// Tipos de datos
interface Proveedor {
  id: string
  codigo: string
  razonSocial: string
  nit: string
  tipoDocumento: string
  contactoPrincipal: string
  telefono: string
  email: string
  direccion: string
  ciudad: string
  departamento: string
  categoria: string
  estado: 'activo' | 'inactivo' | 'suspendido'
  calificacion: number
  fechaRegistro: string
  fechaUltimaActividad: string
  servicios: string[]
  observaciones?: string
}

// Datos de ejemplo
const proveedoresData: Proveedor[] = [
  {
    id: "1",
    codigo: "PROV-001",
    razonSocial: "Transportes Andinos S.A.S",
    nit: "900123456-1",
    tipoDocumento: "NIT",
    contactoPrincipal: "Carlos Rodríguez",
    telefono: "+57 310 1234567",
    email: "contacto@transportesandinos.com",
    direccion: "Calle 72 #10-34",
    ciudad: "Bogotá",
    departamento: "Cundinamarca",
    categoria: "Transporte Terrestre",
    estado: "activo",
    calificacion: 4.8,
    fechaRegistro: "2024-01-15",
    fechaUltimaActividad: "2024-08-30",
    servicios: ["Carga pesada", "Logística", "Distribución"],
    observaciones: "Proveedor confiable con excelente servicio"
  },
  {
    id: "2",
    codigo: "PROV-002",
    razonSocial: "Logística del Pacífico Ltda",
    nit: "800987654-2",
    tipoDocumento: "NIT",
    contactoPrincipal: "María González",
    telefono: "+57 320 9876543",
    email: "maria.gonzalez@logpacifica.com",
    direccion: "Carrera 45 #23-67",
    ciudad: "Medellín",
    departamento: "Antioquia",
    categoria: "Logística",
    estado: "activo",
    calificacion: 4.5,
    fechaRegistro: "2024-02-20",
    fechaUltimaActividad: "2024-08-28",
    servicios: ["Almacenamiento", "Distribución", "Embalaje"],
    observaciones: ""
  },
  {
    id: "3",
    codigo: "PROV-003",
    razonSocial: "Flota Norte S.A.S",
    nit: "900555888-3",
    tipoDocumento: "NIT",
    contactoPrincipal: "Roberto Silva",
    telefono: "+57 315 5555888",
    email: "roberto@flotanorte.com",
    direccion: "Avenida 68 #45-12",
    ciudad: "Barranquilla",
    departamento: "Atlántico",
    categoria: "Transporte Terrestre",
    estado: "suspendido",
    calificacion: 3.2,
    fechaRegistro: "2024-03-10",
    fechaUltimaActividad: "2024-07-15",
    servicios: ["Transporte", "Mudanzas"],
    observaciones: "Suspendido por incumplimiento en entregas"
  }
]

export default function Proveedores() {
  const { toast } = useToast()
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<Proveedor>>({})

  // Columnas para la tabla
  const columns = [
    { key: 'codigo', label: 'Código', sortable: true },
    { key: 'razonSocial', label: 'Razón Social', sortable: true },
    { key: 'nit', label: 'NIT', sortable: true },
    { key: 'contactoPrincipal', label: 'Contacto', sortable: true },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'categoria', label: 'Categoría', sortable: true },
    { key: 'estado', label: 'Estado', sortable: true },
    { key: 'calificacion', label: 'Calificación', sortable: true },
    { key: 'acciones', label: 'Acciones' }
  ]

  const getEstadoBadge = (estado: string) => {
    const variants = {
      'activo': 'default',
      'inactivo': 'secondary', 
      'suspendido': 'destructive'
    } as const
    
    return <Badge variant={variants[estado as keyof typeof variants]}>{estado}</Badge>
  }

  const getCalificacionStars = (calificacion: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i}
            className={`h-4 w-4 ${i < Math.floor(calificacion) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-1 text-sm text-muted-foreground">({calificacion})</span>
      </div>
    )
  }

  const handleCreateProveedor = () => {
    toast({
      title: "Proveedor creado",
      description: "El proveedor ha sido registrado exitosamente.",
    })
    setIsCreateDialogOpen(false)
    setFormData({})
  }

  const handleEditProveedor = (proveedor: Proveedor) => {
    setSelectedProveedor(proveedor)
    setFormData(proveedor)
    setIsCreateDialogOpen(true)
  }

  const handleDeleteProveedor = (id: string) => {
    toast({
      title: "Proveedor eliminado",
      description: "El proveedor ha sido eliminado del sistema.",
      variant: "destructive"
    })
  }

  const renderCell = (columnKey: string, value: any, item: Proveedor) => {
    switch (columnKey) {
      case 'estado':
        return getEstadoBadge(item.estado)
      case 'calificacion':
        return getCalificacionStars(item.calificacion)
      case 'acciones':
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => { setSelectedProveedor(item); setIsDetailDialogOpen(true) }}>
                <Eye className="mr-2 h-4 w-4" />
                Ver detalles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditProveedor(item)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleDeleteProveedor(item.id)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      default:
        return item[columnKey as keyof Proveedor]
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Gestión de Proveedores</h1>
          <p className="text-muted-foreground">
            Administra y gestiona todos los proveedores del sistema
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Proveedor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedProveedor ? 'Editar Proveedor' : 'Crear Nuevo Proveedor'}</DialogTitle>
              <DialogDescription>
                {selectedProveedor ? 'Modifica los datos del proveedor' : 'Completa la información para registrar un nuevo proveedor'}
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="basicos" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basicos">Datos Básicos</TabsTrigger>
                <TabsTrigger value="contacto">Contacto</TabsTrigger>
                <TabsTrigger value="servicios">Servicios</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basicos" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="codigo">Código</Label>
                    <Input 
                      id="codigo" 
                      placeholder="PROV-001"
                      value={formData.codigo || ''}
                      onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="razonSocial">Razón Social</Label>
                    <Input 
                      id="razonSocial" 
                      placeholder="Nombre de la empresa"
                      value={formData.razonSocial || ''}
                      onChange={(e) => setFormData({...formData, razonSocial: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipoDocumento">Tipo de Documento</Label>
                    <Select value={formData.tipoDocumento} onValueChange={(value) => setFormData({...formData, tipoDocumento: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NIT">NIT</SelectItem>
                        <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                        <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nit">Número de Documento</Label>
                    <Input 
                      id="nit" 
                      placeholder="900123456-1"
                      value={formData.nit || ''}
                      onChange={(e) => setFormData({...formData, nit: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoría</Label>
                    <Select value={formData.categoria} onValueChange={(value) => setFormData({...formData, categoria: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Transporte Terrestre">Transporte Terrestre</SelectItem>
                        <SelectItem value="Logística">Logística</SelectItem>
                        <SelectItem value="Almacenamiento">Almacenamiento</SelectItem>
                        <SelectItem value="Distribución">Distribución</SelectItem>
                        <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Select value={formData.estado} onValueChange={(value) => setFormData({...formData, estado: value as any})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="activo">Activo</SelectItem>
                        <SelectItem value="inactivo">Inactivo</SelectItem>
                        <SelectItem value="suspendido">Suspendido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="contacto" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactoPrincipal">Contacto Principal</Label>
                    <Input 
                      id="contactoPrincipal" 
                      placeholder="Nombre del contacto"
                      value={formData.contactoPrincipal || ''}
                      onChange={(e) => setFormData({...formData, contactoPrincipal: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input 
                      id="telefono" 
                      placeholder="+57 310 1234567"
                      value={formData.telefono || ''}
                      onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      placeholder="contacto@empresa.com"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input 
                      id="direccion" 
                      placeholder="Calle 72 #10-34"
                      value={formData.direccion || ''}
                      onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ciudad">Ciudad</Label>
                    <Input 
                      id="ciudad" 
                      placeholder="Bogotá"
                      value={formData.ciudad || ''}
                      onChange={(e) => setFormData({...formData, ciudad: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="departamento">Departamento</Label>
                    <Input 
                      id="departamento" 
                      placeholder="Cundinamarca"
                      value={formData.departamento || ''}
                      onChange={(e) => setFormData({...formData, departamento: e.target.value})}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="servicios" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="servicios">Servicios Ofrecidos</Label>
                    <Textarea 
                      id="servicios" 
                      placeholder="Describe los servicios que ofrece el proveedor (separados por comas)"
                      value={formData.servicios?.join(', ') || ''}
                      onChange={(e) => setFormData({...formData, servicios: e.target.value.split(', ').filter(s => s.trim())})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="observaciones">Observaciones</Label>
                    <Textarea 
                      id="observaciones" 
                      placeholder="Observaciones adicionales sobre el proveedor"
                      value={formData.observaciones || ''}
                      onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateProveedor}>
                {selectedProveedor ? 'Actualizar' : 'Crear'} Proveedor
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Proveedores</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">
              +12% desde el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">198</div>
            <p className="text-xs text-muted-foreground">
              80.8% del total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nuevos este mes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              +18% vs mes anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calificación Promedio</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2</div>
            <p className="text-xs text-muted-foreground">
              +0.2 vs mes anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de Proveedores */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Proveedores</CardTitle>
          <CardDescription>
            Gestiona y visualiza todos los proveedores registrados en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={proveedoresData}
            searchable
            filterable
            exportable
            renderCell={renderCell}
            title="Proveedores"
          />
        </CardContent>
      </Card>

      {/* Modal de Detalles */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {selectedProveedor?.razonSocial}
            </DialogTitle>
            <DialogDescription>
              Información detallada del proveedor
            </DialogDescription>
          </DialogHeader>
          
          {selectedProveedor && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {getEstadoBadge(selectedProveedor.estado)}
                  <Badge variant="outline">{selectedProveedor.codigo}</Badge>
                </div>
                {getCalificacionStars(selectedProveedor.calificacion)}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Información Básica
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">NIT:</span> {selectedProveedor.nit}</div>
                    <div><span className="font-medium">Categoría:</span> {selectedProveedor.categoria}</div>
                    <div><span className="font-medium">Fecha Registro:</span> {new Date(selectedProveedor.fechaRegistro).toLocaleDateString()}</div>
                    <div><span className="font-medium">Última Actividad:</span> {new Date(selectedProveedor.fechaUltimaActividad).toLocaleDateString()}</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Información de Contacto
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {selectedProveedor.contactoPrincipal}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {selectedProveedor.telefono}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {selectedProveedor.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {selectedProveedor.direccion}, {selectedProveedor.ciudad}, {selectedProveedor.departamento}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold">Servicios Ofrecidos</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProveedor.servicios.map((servicio, index) => (
                    <Badge key={index} variant="secondary">{servicio}</Badge>
                  ))}
                </div>
              </div>
              
              {selectedProveedor.observaciones && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Observaciones</h3>
                  <p className="text-sm text-muted-foreground">{selectedProveedor.observaciones}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}