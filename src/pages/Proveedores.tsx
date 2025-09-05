import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
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
  Star,
  Upload,
  CheckCircle,
  FileSpreadsheet
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
  estado: 'activo' | 'inactivo'
  fechaRegistro: string
  fechaUltimaActividad: string
  servicios: string[]
  observaciones?: string
  usuarioBloqueado?: boolean
  ultimoLogin?: string
}

interface HistorialCambio {
  id: string
  tipo: 'proveedor' | 'conductor' | 'vehiculo'
  entidadId: string
  campo: string
  valorAnterior: string
  valorNuevo: string
  usuario: string
  fecha: string
  accion: 'crear' | 'editar' | 'eliminar'
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
    estado: "inactivo",
    fechaRegistro: "2024-03-10",
    fechaUltimaActividad: "2024-07-15",
    servicios: ["Transporte", "Mudanzas"],
    observaciones: "Inactivo por incumplimiento en entregas"
  }
]

export default function Proveedores() {
  const [statusFilter, setStatusFilter] = useState("")
  const { toast } = useToast()
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isConductoresDialogOpen, setIsConductoresDialogOpen] = useState(false)
  const [conductoresProveedor, setConductoresProveedor] = useState<any[]>([])
  const [formData, setFormData] = useState<Partial<Proveedor>>({})
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    title: string
    description: string
    onConfirm: () => void
  }>({ open: false, title: '', description: '', onConfirm: () => {} })
  const [conductorConfirmDialog, setConductorConfirmDialog] = useState<{
    open: boolean
    conductor: any
    action: 'activate' | 'deactivate'
  }>({ open: false, conductor: null, action: 'activate' })
  const [isVehiculosDialogOpen, setIsVehiculosDialogOpen] = useState(false)
  const [vehiculosProveedor, setVehiculosProveedor] = useState<any[]>([])
  const [isHistorialDialogOpen, setIsHistorialDialogOpen] = useState(false)
  const [historialCambios, setHistorialCambios] = useState<HistorialCambio[]>([])
  const [bloquearUsuarioDialog, setBloquearUsuarioDialog] = useState<{
    open: boolean
    proveedor: Proveedor | null
  }>({ open: false, proveedor: null })
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Columnas para la tabla
  const columns = [
    { key: 'codigo', label: 'Código', sortable: true },
    { key: 'razonSocial', label: 'Nombre Completo', sortable: true },
    { key: 'nit', label: 'Identificación', sortable: true },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'email', label: 'Correo', sortable: true },
    { key: 'usuarioBloqueo', label: 'Usuario', sortable: false },
    { key: 'estado', label: 'Estado', sortable: true },
    { key: 'acciones', label: 'Acciones' }
  ]

  const getEstadoBadge = (estado: string, proveedorId: string) => {
    return (
      <Button
        variant={estado === 'activo' ? 'default' : 'destructive'}
        size="sm"
        onClick={() => {
          setConfirmDialog({
            open: true,
            title: `${estado === 'activo' ? 'Inactivar' : 'Activar'} Proveedor`,
            description: `¿Estás seguro de que deseas ${estado === 'activo' ? 'inactivar' : 'activar'} este proveedor?`,
            onConfirm: () => handleEstadoChange(proveedorId, estado === 'activo' ? 'inactivo' : 'activo')
          })
        }}
        className={`h-6 text-xs ${estado === 'activo' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
      >
        {estado === 'activo' ? 'Activo' : 'Inactivo'}
      </Button>
    )
  }

  const handleEstadoChange = (proveedorId: string, nuevoEstado: string) => {
    toast({
      title: "Estado actualizado",
      description: `El proveedor ha sido marcado como ${nuevoEstado}.`,
    })
    setConfirmDialog({ ...confirmDialog, open: false })
  }

  const handleConductorEstadoChange = (conductor: any, action: 'activate' | 'deactivate') => {
    const updatedConductores = conductoresProveedor.map(c => 
      c.id === conductor.id 
        ? { ...c, estado: action === 'activate' ? 'activo' : 'inactivo' }
        : c
    )
    setConductoresProveedor(updatedConductores)
    toast({
      title: "Estado actualizado",
      description: `El conductor ha sido ${action === 'activate' ? 'activado' : 'inactivado'}.`,
    })
    setConductorConfirmDialog({ ...conductorConfirmDialog, open: false })
  }

  const handleVerConductores = (proveedor: Proveedor) => {
    // Datos de ejemplo de conductores
    const conductoresEjemplo = [
      {
        id: 1,
        nombre: "Juan Pérez",
        cedula: "12345678",
        licencia: "C2-123456",
        telefono: "+57 300 1234567",
        estado: "activo"
      },
      {
        id: 2,
        nombre: "María González",
        cedula: "87654321", 
        licencia: "C3-654321",
        telefono: "+57 310 7654321",
        estado: "activo"
      }
    ]
    setConductoresProveedor(conductoresEjemplo)
    setSelectedProveedor(proveedor)
    setIsConductoresDialogOpen(true)
  }

  const handleVerVehiculos = (proveedor: Proveedor) => {
    // Datos de ejemplo de vehículos
    const vehiculosEjemplo = [
      {
        id: 1,
        placa: "ABC123",
        marca: "Volvo",
        modelo: "FH16",
        año: "2020",
        tipo: "Tractocamión",
        estado: "activo"
      },
      {
        id: 2,
        placa: "XYZ789",
        marca: "Mercedes Benz",
        modelo: "Actros",
        año: "2019",
        tipo: "Camión",
        estado: "inactivo"
      }
    ]
    setVehiculosProveedor(vehiculosEjemplo)
    setSelectedProveedor(proveedor)
    setIsVehiculosDialogOpen(true)
  }

  const handleVerHistorial = (proveedor: Proveedor) => {
    // Datos de ejemplo del historial
    const historialEjemplo: HistorialCambio[] = [
      {
        id: "1",
        tipo: "proveedor",
        entidadId: proveedor.id,
        campo: "Creación",
        valorAnterior: "",
        valorNuevo: "Proveedor creado",
        usuario: "admin@sistema.com",
        fecha: "2024-01-15 10:30:00",
        accion: "crear"
      },
      {
        id: "2", 
        tipo: "proveedor",
        entidadId: proveedor.id,
        campo: "estado",
        valorAnterior: "activo",
        valorNuevo: "inactivo",
        usuario: "gerente@sistema.com",
        fecha: "2024-03-20 14:45:00",
        accion: "editar"
      }
    ]
    setHistorialCambios(historialEjemplo)
    setSelectedProveedor(proveedor)
    setIsHistorialDialogOpen(true)
  }

  const handleBloquearUsuario = (proveedor: Proveedor) => {
    setBloquearUsuarioDialog({ open: true, proveedor })
  }

  const confirmBloquearUsuario = () => {
    toast({
      title: "Usuario bloqueado",
      description: "El usuario del proveedor ha sido bloqueado exitosamente.",
    })
    setBloquearUsuarioDialog({ open: false, proveedor: null })
  }

  const handleImportFile = () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo Excel.",
        variant: "destructive"
      })
      return
    }
    
    setIsImportDialogOpen(false)
    setIsSuccessDialogOpen(true)
    setSelectedFile(null)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || file.type === "application/vnd.ms-excel")) {
      setSelectedFile(file)
    } else {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo Excel válido (.xlsx o .xls).",
        variant: "destructive"
      })
    }
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
        return getEstadoBadge(item.estado, item.id)
      case 'usuarioBloqueo':
        return (
          <div className="space-y-1">
            <Button
              variant={item.usuarioBloqueado ? "destructive" : "outline"}
              size="sm"
              onClick={() => handleBloquearUsuario(item)}
              className="h-6 text-xs w-full"
            >
              {item.usuarioBloqueado ? 'Desbloq. Usuario' : 'Bloq. Usuario'}
            </Button>
            <p className="text-xs text-muted-foreground">
              Último login: {item.ultimoLogin || '2024-08-30 15:30'}
            </p>
          </div>
        )
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
              <DropdownMenuItem onClick={() => handleVerConductores(item)}>
                <User className="mr-2 h-4 w-4" />
                Ver conductores
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleVerVehiculos(item)}>
                <Building2 className="mr-2 h-4 w-4" />
                Ver vehículos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleVerHistorial(item)}>
                <FileText className="mr-2 h-4 w-4" />
                Ver historial
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
      </div>
        <div className="flex gap-2">
          <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 bg-green-600 text-white hover:bg-green-700">
                <FileSpreadsheet className="h-4 w-4" />
                Importar Masivo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Importar Proveedores Masivamente</DialogTitle>
                <DialogDescription>
                  Adjunta un archivo Excel con los datos de los proveedores
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="excelFile">Archivo Excel</Label>
                  <Input
                    id="excelFile"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  {selectedFile && (
                    <p className="text-sm text-green-600 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      {selectedFile.name}
                    </p>
                  )}
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleImportFile} className="bg-green-600 hover:bg-green-700">
                    Importar Proveedores
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Proveedor
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedProveedor ? 'Editar Proveedor' : 'Creación de Nuevo Proveedor'}</DialogTitle>
              <DialogDescription>
                {selectedProveedor ? 'Modifica los datos del proveedor' : 'Completa la información para registrar un nuevo proveedor'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipoAfiliado">Tipo de afiliado</Label>
                  <Select value={formData.tipoDocumento} onValueChange={(value) => setFormData({...formData, tipoDocumento: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="INTERNO" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INTERNO">INTERNO</SelectItem>
                      <SelectItem value="EXTERNO">EXTERNO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nitOCC">Nit o CC</Label>
                  <Input 
                    id="nitOCC" 
                    placeholder=""
                    value={formData.nit || ''}
                    onChange={(e) => setFormData({...formData, nit: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="digitoVerificacion">Dígito de verificación</Label>
                  <Input 
                    id="digitoVerificacion" 
                    placeholder=""
                    className="w-20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="razonSocial">Razón social</Label>
                  <Input 
                    id="razonSocial" 
                    placeholder=""
                    value={formData.razonSocial || ''}
                    onChange={(e) => setFormData({...formData, razonSocial: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipoEmpresa">Tipo de empresa</Label>
                  <Select value="P.N">
                    <SelectTrigger>
                      <SelectValue placeholder="P.N" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="P.N">P.N</SelectItem>
                      <SelectItem value="P.J">P.J</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="correo">Correo</Label>
                  <Input 
                    id="correo" 
                    type="email"
                    placeholder=""
                    value={formData.email || ''}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departamento">Departamento</Label>
                  <Select value={formData.departamento} onValueChange={(value) => setFormData({...formData, departamento: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cundinamarca">Cundinamarca</SelectItem>
                      <SelectItem value="Antioquia">Antioquia</SelectItem>
                      <SelectItem value="Atlántico">Atlántico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ciudad">Ciudad</Label>
                  <Select value={formData.ciudad} onValueChange={(value) => setFormData({...formData, ciudad: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bogotá">Bogotá</SelectItem>
                      <SelectItem value="Medellín">Medellín</SelectItem>
                      <SelectItem value="Barranquilla">Barranquilla</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sede">Sede</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="principal">Principal</SelectItem>
                      <SelectItem value="sucursal">Sucursal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input 
                    id="direccion" 
                    placeholder=""
                    value={formData.direccion || ''}
                    onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="celular">Celular</Label>
                  <Input 
                    id="celular" 
                    placeholder=""
                    value={formData.telefono || ''}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fotoProveedor">Foto proveedor</Label>
                  <div className="flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 cursor-pointer hover:border-muted-foreground/50">
                    <div className="text-center">
                      <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Seleccione un archivo</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Datos financieros */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Datos financieros</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="entidadBancaria">Entidad bancaria</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bancolombia">Bancolombia</SelectItem>
                        <SelectItem value="davivienda">Davivienda</SelectItem>
                        <SelectItem value="bogota">Banco de Bogotá</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipoCuenta">Tipo de cuenta</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ahorros">Ahorros</SelectItem>
                        <SelectItem value="corriente">Corriente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numeroCuenta">Número de cuenta</Label>
                    <Input 
                      id="numeroCuenta" 
                      placeholder=""
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="certificadoBancario">Certificado bancario</Label>
                    <div className="flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 cursor-pointer hover:border-muted-foreground/50">
                      <div className="text-center">
                        <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Seleccione un archivo</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="poder">Poder</Label>
                    <div className="flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 cursor-pointer hover:border-muted-foreground/50">
                      <div className="text-center">
                        <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Seleccione un archivo</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
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
            data={statusFilter ? proveedoresData.filter(p => p.estado === statusFilter) : proveedoresData}
            searchable
            filterable
            exportable
            renderCell={renderCell}
            title="Proveedores"
            statusFilter={true}
            onStatusFilterChange={setStatusFilter}
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
                  {getEstadoBadge(selectedProveedor.estado, selectedProveedor.id)}
                  <Badge variant="outline">{selectedProveedor.codigo}</Badge>
                </div>
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
      {/* Modal de Conductores */}
      <Dialog open={isConductoresDialogOpen} onOpenChange={setIsConductoresDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Conductores - {selectedProveedor?.razonSocial}
            </DialogTitle>
            <DialogDescription>
              Lista de conductores asociados al proveedor
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {conductoresProveedor.length > 0 ? (
              <div className="grid gap-4">
                {conductoresProveedor.map((conductor) => (
                  <Card key={conductor.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{conductor.nombre}</h4>
                            <Badge variant={conductor.estado === 'activo' ? 'default' : 'secondary'}>
                              {conductor.estado}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div><span className="font-medium">Cédula:</span> {conductor.cedula}</div>
                            <div><span className="font-medium">Licencia:</span> {conductor.licencia}</div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {conductor.telefono}
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant={conductor.estado === 'activo' ? 'destructive' : 'default'}
                          size="sm"
                          onClick={() => {
                            setConductorConfirmDialog({
                              open: true,
                              conductor,
                              action: conductor.estado === 'activo' ? 'deactivate' : 'activate'
                            })
                          }}
                          className={conductor.estado === 'activo' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
                        >
                          {conductor.estado === 'activo' ? 'Inactivar' : 'Activar'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay conductores registrados</h3>
                <p className="text-muted-foreground">Este proveedor no tiene conductores asociados.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Provider Status */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({...confirmDialog, open})}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmDialog({...confirmDialog, open: false})}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDialog.onConfirm}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmation Dialog for Driver Status */}
      <AlertDialog open={conductorConfirmDialog.open} onOpenChange={(open) => setConductorConfirmDialog({...conductorConfirmDialog, open})}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {conductorConfirmDialog.action === 'activate' ? 'Activar' : 'Inactivar'} Conductor
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas {conductorConfirmDialog.action === 'activate' ? 'activar' : 'inactivar'} al conductor {conductorConfirmDialog.conductor?.nombre}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConductorConfirmDialog({...conductorConfirmDialog, open: false})}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => handleConductorEstadoChange(conductorConfirmDialog.conductor, conductorConfirmDialog.action)}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de Vehículos */}
      <Dialog open={isVehiculosDialogOpen} onOpenChange={setIsVehiculosDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Vehículos - {selectedProveedor?.razonSocial}
            </DialogTitle>
            <DialogDescription>
              Lista de vehículos asociados al proveedor
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {vehiculosProveedor.length > 0 ? (
              <div className="grid gap-4">
                {vehiculosProveedor.map((vehiculo) => (
                  <Card key={vehiculo.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{vehiculo.placa}</h4>
                            <Badge variant={vehiculo.estado === 'activo' ? 'default' : 'secondary'}>
                              {vehiculo.estado}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div><span className="font-medium">Marca:</span> {vehiculo.marca}</div>
                            <div><span className="font-medium">Modelo:</span> {vehiculo.modelo}</div>
                            <div><span className="font-medium">Año:</span> {vehiculo.año}</div>
                            <div><span className="font-medium">Tipo:</span> {vehiculo.tipo}</div>
                          </div>
                        </div>
                        <Button 
                          variant={vehiculo.estado === 'activo' ? 'destructive' : 'default'}
                          size="sm"
                          onClick={() => {
                            const updatedVehiculos = vehiculosProveedor.map(v => 
                              v.id === vehiculo.id 
                                ? { ...v, estado: vehiculo.estado === 'activo' ? 'inactivo' : 'activo' }
                                : v
                            )
                            setVehiculosProveedor(updatedVehiculos)
                            toast({
                              title: "Estado actualizado",
                              description: `El vehículo ha sido ${vehiculo.estado === 'activo' ? 'inactivado' : 'activado'}.`,
                            })
                          }}
                          className={vehiculo.estado === 'activo' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
                        >
                          {vehiculo.estado === 'activo' ? 'Inactivar' : 'Activar'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay vehículos registrados</h3>
                <p className="text-muted-foreground">Este proveedor no tiene vehículos asociados.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Historial */}
      <Dialog open={isHistorialDialogOpen} onOpenChange={setIsHistorialDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Historial de Cambios - {selectedProveedor?.razonSocial}
            </DialogTitle>
            <DialogDescription>
              Registro de todos los cambios realizados en este proveedor
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {historialCambios.length > 0 ? (
              <div className="space-y-3">
                {historialCambios.map((cambio) => (
                  <Card key={cambio.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant={cambio.accion === 'crear' ? 'default' : cambio.accion === 'editar' ? 'secondary' : 'destructive'}>
                              {cambio.accion.toUpperCase()}
                            </Badge>
                            <h4 className="font-semibold">{cambio.campo}</h4>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {cambio.valorAnterior && (
                              <div><span className="font-medium">Valor anterior:</span> {cambio.valorAnterior}</div>
                            )}
                            <div><span className="font-medium">Valor nuevo:</span> {cambio.valorNuevo}</div>
                            <div className="flex items-center gap-4 mt-2">
                              <span><span className="font-medium">Usuario:</span> {cambio.usuario}</span>
                              <span><span className="font-medium">Fecha:</span> {cambio.fecha}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay historial disponible</h3>
                <p className="text-muted-foreground">No se han registrado cambios para este proveedor.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Block User */}
      <AlertDialog open={bloquearUsuarioDialog.open} onOpenChange={(open) => setBloquearUsuarioDialog({...bloquearUsuarioDialog, open})}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {bloquearUsuarioDialog.proveedor?.usuarioBloqueado ? 'Desbloquear' : 'Bloquear'} Usuario
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas {bloquearUsuarioDialog.proveedor?.usuarioBloqueado ? 'desbloquear' : 'bloquear'} el usuario del proveedor {bloquearUsuarioDialog.proveedor?.razonSocial}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setBloquearUsuarioDialog({ open: false, proveedor: null })}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmBloquearUsuario}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              ¡Importación Exitosa!
            </DialogTitle>
            <DialogDescription>
              Los proveedores han sido importados correctamente al sistema.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center py-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          
          <div className="flex justify-end">
            <Button onClick={() => setIsSuccessDialogOpen(false)} className="bg-green-600 hover:bg-green-700">
              Continuar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}