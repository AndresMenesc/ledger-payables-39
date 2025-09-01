import { useState } from "react"
import { Plus, Search, FileText, Eye, Download, Calendar, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

interface Cotizacion {
  numero: string
  cliente: string
  fechaSolicitud: string
  fechaCreacion: string
  estado: "Enviada" | "Pendiente" | "Aprobada"
  servicios: number
  valorTotal: number
}

interface Traslado {
  fechaServicio: string
  ciudades: string
  tipoVehiculo: string
  trayecto: string
  pax: number
  vehiculo: string
  valorTrayecto: number
  valorTotal: number
}

interface Gestion {
  id: string
  fecha: string
  descripcion: string
  usuario: string
}

const mockCotizaciones: Cotizacion[] = [
  {
    numero: "COT-2024-001",
    cliente: "Empresa ABC S.A.S.",
    fechaSolicitud: "2024-08-20",
    fechaCreacion: "2024-08-21",
    estado: "Enviada",
    servicios: 3,
    valorTotal: 850000
  },
  {
    numero: "COT-2024-002",
    cliente: "Hotel Residencia Plaza",
    fechaSolicitud: "2024-08-22",
    fechaCreacion: "2024-08-22",
    estado: "Pendiente",
    servicios: 1,
    valorTotal: 450000
  },
  {
    numero: "COT-2024-003",
    cliente: "Corporación XYZ",
    fechaSolicitud: "2024-08-23",
    fechaCreacion: "2024-08-24",
    estado: "Aprobada",
    servicios: 5,
    valorTotal: 1200000
  }
]

const mockGestiones: Gestion[] = [
  {
    id: "1",
    fecha: "2025-09-01 10:30:00",
    descripcion: "Se realizó seguimiento telefónico al cliente. Cliente interesado en el servicio.",
    usuario: "Juan Pérez"
  },
  {
    id: "2",
    fecha: "2025-08-30 14:15:00",
    descripcion: "Envío de cotización por correo electrónico al cliente.",
    usuario: "María González"
  }
]

export default function Cotizaciones() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [traslados, setTraslados] = useState<Traslado[]>([])
  const [activeTab, setActiveTab] = useState("agregar-cotizacion")
  const [selectedCotizacion, setSelectedCotizacion] = useState<Cotizacion | null>(null)
  const [isGestionModalOpen, setIsGestionModalOpen] = useState(false)
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false)
  const [selectedCotizacionPdf, setSelectedCotizacionPdf] = useState<Cotizacion | null>(null)

  const getEstadoBadge = (estado: string) => {
    const variants = {
      "Enviada": "default",
      "Pendiente": "secondary", 
      "Aprobada": "destructive"
    } as const
    
    return <Badge variant={variants[estado as keyof typeof variants] || "default"}>{estado}</Badge>
  }

  const filteredCotizaciones = mockCotizaciones.filter(cotizacion =>
    (cotizacion.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cotizacion.numero.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === "" || cotizacion.estado === statusFilter)
  )

  const handleAddTraslado = () => {
    // Simular agregar traslado
    const nuevoTraslado: Traslado = {
      fechaServicio: "2024-08-25",
      ciudades: "Bogotá - Medellín",
      tipoVehiculo: "Sedán",
      trayecto: "Aeropuerto - Hotel",
      pax: 4,
      vehiculo: "ABC-123",
      valorTrayecto: 250000,
      valorTotal: 250000
    }
    setTraslados([...traslados, nuevoTraslado])
    toast.success("Traslado agregado correctamente")
  }

  const totalCotizacion = traslados.reduce((sum, traslado) => sum + traslado.valorTotal, 0)

  const handleDownload = (cotizacion: Cotizacion) => {
    toast.success("Cotización descargada en PDF")
  }

  const handleGestionCotizacion = (cotizacion: Cotizacion) => {
    setSelectedCotizacion(cotizacion)
    setIsGestionModalOpen(true)
  }

  const handleViewPdf = (cotizacion: Cotizacion) => {
    setSelectedCotizacionPdf(cotizacion)
    setIsPdfModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Cotizaciones</h1>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nueva Cotización
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Nueva cotización
              </DialogTitle>
            </DialogHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="agregar-cotizacion">Agregar cotización</TabsTrigger>
                <TabsTrigger value="traslado">Traslado</TabsTrigger>
                <TabsTrigger value="total-cotizado">Total cotizado</TabsTrigger>
              </TabsList>
              
              <TabsContent value="agregar-cotizacion" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fechaSolicitud">Fecha de solicitud</Label>
                    <Input type="date" id="fechaSolicitud" defaultValue="2025-09-01" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fechaCreacion">Fecha de creación</Label>
                    <Input type="date" id="fechaCreacion" defaultValue="2025-09-01" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clienteExistente">¿Es para un cliente existente?</Label>
                    <Select defaultValue="si">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="si">Sí</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cliente">Cliente</Label>
                    <Input id="cliente" placeholder="Nombre del cliente" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input id="direccion" placeholder="Dirección del cliente" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Celular o teléfono</Label>
                    <Input id="telefono" placeholder="Número de contacto" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Correo electrónico" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="canal">Canal</Label>
                    <Input id="canal" placeholder="Canal de contacto" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="correosCorreo">Correos cotización</Label>
                    <Input id="correosCorreo" placeholder="Emails separados por coma" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contacto">Contacto</Label>
                    <Input id="contacto" placeholder="Persona de contacto" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="asunto">Asunto</Label>
                    <Input id="asunto" placeholder="Asunto de la cotización" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="soportePdf">Soporte PDF</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Plus className="h-4 w-4" />
                      </div>
                      <p className="text-sm text-gray-600">Seleccione un archivo</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="observaciones">Observaciones generales</Label>
                  <Textarea id="observaciones" placeholder="Observaciones adicionales..." className="min-h-[100px]" />
                </div>
              </TabsContent>
              
              <TabsContent value="traslado" className="space-y-4">
                <h3 className="text-lg font-semibold">Agregar Traslado</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fechaServicio">Fecha de servicio</Label>
                    <Input type="date" id="fechaServicio" placeholder="dd/mm/aaaa" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ciudades">Ciudades</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar ciudad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bogota">Bogotá</SelectItem>
                        <SelectItem value="medellin">Medellín</SelectItem>
                        <SelectItem value="cali">Cali</SelectItem>
                        <SelectItem value="barranquilla">Barranquilla</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipoVehiculo">Tipo de vehículo</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedan">Sedán</SelectItem>
                        <SelectItem value="suv">SUV</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                        <SelectItem value="bus">Bus</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trayecto">Trayecto</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar trayecto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aeropuerto-hotel">Aeropuerto - Hotel</SelectItem>
                        <SelectItem value="hotel-aeropuerto">Hotel - Aeropuerto</SelectItem>
                        <SelectItem value="city-tour">City Tour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pax"># PAX</Label>
                    <Input type="number" id="pax" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehiculo">Vehículo</Label>
                    <Input id="vehiculo" placeholder="Placa o identificación" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valorTrayecto">Valor trayecto</Label>
                    <Input type="number" id="valorTrayecto" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valorTotal">Valor total</Label>
                    <Input type="number" id="valorTotal" placeholder="0" />
                  </div>
                </div>
                
                <Button onClick={handleAddTraslado} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar traslado
                </Button>
              </TabsContent>
              
              <TabsContent value="total-cotizado" className="space-y-4">
                <h3 className="text-lg font-semibold">Resumen de Traslados</h3>
                
                {traslados.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No hay traslados agregados. Vaya a la pestaña "Traslado" para agregar servicios.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {traslados.map((traslado, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                            <div><strong>Fecha:</strong> {traslado.fechaServicio}</div>
                            <div><strong>Ciudades:</strong> {traslado.ciudades}</div>
                            <div><strong>Vehículo:</strong> {traslado.tipoVehiculo}</div>
                            <div><strong>PAX:</strong> {traslado.pax}</div>
                            <div><strong>Trayecto:</strong> {traslado.trayecto}</div>
                            <div><strong>Valor:</strong> ${traslado.valorTotal.toLocaleString()}</div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Valor total:</span>
                  <span className="text-primary">${totalCotizacion.toLocaleString()}</span>
                </div>
                
                <Button 
                  onClick={() => {
                    toast.success("Cotización guardada correctamente")
                    setIsCreateModalOpen(false)
                    setTraslados([])
                    setActiveTab("agregar-cotizacion")
                  }}
                  className="w-full"
                >
                  Guardar cotización
                </Button>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente o número..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Filtrar por estado" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los estados</SelectItem>
                <SelectItem value="Enviada">Enviada</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Aprobada">Aprobada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Cotizaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Número</th>
                  <th className="text-left p-2 font-medium">Cliente</th>
                  <th className="text-left p-2 font-medium">Fecha Solicitud</th>
                  <th className="text-left p-2 font-medium">Fecha Creación</th>
                  <th className="text-left p-2 font-medium">Estado</th>
                  <th className="text-left p-2 font-medium">Servicios</th>
                  <th className="text-left p-2 font-medium">Valor Total</th>
                  <th className="text-left p-2 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCotizaciones.map((cotizacion) => (
                  <tr key={cotizacion.numero} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{cotizacion.numero}</td>
                    <td className="p-2">{cotizacion.cliente}</td>
                    <td className="p-2">{cotizacion.fechaSolicitud}</td>
                    <td className="p-2">{cotizacion.fechaCreacion}</td>
                    <td className="p-2">{getEstadoBadge(cotizacion.estado)}</td>
                    <td className="p-2">{cotizacion.servicios}</td>
                    <td className="p-2">${cotizacion.valorTotal.toLocaleString()}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleGestionCotizacion(cotizacion)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewPdf(cotizacion)}
                          title="Ver cotización en PDF"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDownload(cotizacion)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Gestiones Modal */}
      <Dialog open={isGestionModalOpen} onOpenChange={setIsGestionModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Gestión de cotización
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="historial" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="historial">Historial de gestiones</TabsTrigger>
              <TabsTrigger value="nueva-gestion">Agregar nueva gestión</TabsTrigger>
            </TabsList>
            
            <TabsContent value="historial" className="space-y-4">
              <div className="space-y-3">
                {mockGestiones.map((gestion) => (
                  <Card key={gestion.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-primary mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium text-primary">{gestion.usuario} {gestion.fecha}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{gestion.descripcion}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="flex justify-center">
                <Button>Aceptar</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="nueva-gestion" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tipoGestion">Tipo de gestión</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="llamada">Llamada telefónica</SelectItem>
                      <SelectItem value="email">Envío de email</SelectItem>
                      <SelectItem value="reunion">Reunión</SelectItem>
                      <SelectItem value="seguimiento">Seguimiento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="observaciones">Observaciones</Label>
                  <Textarea 
                    id="observaciones" 
                    placeholder="Descripción de la gestión realizada..."
                    className="min-h-[100px]"
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => {
                    toast.success("Gestión agregada correctamente")
                  }}
                >
                  Guardar gestión
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* PDF Preview Modal */}
      <Dialog open={isPdfModalOpen} onOpenChange={setIsPdfModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Vista previa - {selectedCotizacionPdf?.numero}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 bg-gray-100 rounded-lg p-8 min-h-[500px] flex items-center justify-center">
            <div className="text-center space-y-4">
              <FileText className="h-16 w-16 text-gray-400 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Vista previa de PDF</h3>
                <p className="text-gray-500">Cotización: {selectedCotizacionPdf?.numero}</p>
                <p className="text-gray-500">Cliente: {selectedCotizacionPdf?.cliente}</p>
                <p className="text-gray-500">Valor: ${selectedCotizacionPdf?.valorTotal.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}