import { useState } from "react"
import { Plus, Search, FolderOpen, Eye, Send, FileText, Calendar, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface Portafolio {
  id: string
  nombreCliente: string
  archivos: number
  fecha: string
  telefono: string
  solicitante: string
  ciudad: string
  creadoPor: string
  enviado: number
  estado: "Activo" | "Inactivo" | "Pendiente"
}

interface Gestion {
  id: string
  fecha: string
  descripcion: string
  usuario: string
}

const mockPortafolios: Portafolio[] = [
  {
    id: "1",
    nombreCliente: "mateo",
    archivos: 2,
    fecha: "2025-05-30",
    telefono: "3013314702",
    solicitante: "adsfsdghgbe",
    ciudad: "BARRANQUILLA",
    creadoPor: "Mateo Gomez osio",
    enviado: 1,
    estado: "Activo"
  },
  {
    id: "2",
    nombreCliente: "mateo",
    archivos: 2,
    fecha: "2025-04-22",
    telefono: "3013314702",
    solicitante: "mateo",
    ciudad: "BARRANQUILLA",
    creadoPor: "Mateo Gomez osio",
    enviado: 2,
    estado: "Pendiente"
  }
]

const mockGestiones: Gestion[] = [
  {
    id: "1",
    fecha: "2025-05-30 09:45:00",
    descripcion: "Se realizó envío de portafolio al correo: teosio97@gmail.com el 2025-05-30 a las 09:45.",
    usuario: "Mateo Gomez osio"
  }
]

export default function Portafolios() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedPortafolio, setSelectedPortafolio] = useState<Portafolio | null>(null)
  const [isGestionModalOpen, setIsGestionModalOpen] = useState(false)
  const [tipoCliente, setTipoCliente] = useState("ejecutivos")
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false)
  const [pdfType, setPdfType] = useState<"ejecutivos" | "rutas">("ejecutivos")

  const filteredPortafolios = mockPortafolios.filter(portafolio =>
    (portafolio.nombreCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    portafolio.solicitante.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === "all" || portafolio.estado === statusFilter)
  )

  const handleCreatePortafolio = () => {
    toast.success("Portafolio creado correctamente")
    setIsCreateModalOpen(false)
  }

  const handleGestionPortafolio = (portafolio: Portafolio) => {
    setSelectedPortafolio(portafolio)
    setIsGestionModalOpen(true)
  }

  const handleViewPdf = (type: "ejecutivos" | "rutas") => {
    setPdfType(type)
    setIsPdfModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderOpen className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Gestión de Portafolios</h1>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Agregar
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Nuevo Portafolio
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input id="nombre" placeholder="Nombre del cliente" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="correo">Correo</Label>
                  <Input id="correo" type="email" placeholder="correo@ejemplo.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Celular o teléfono</Label>
                  <Input id="telefono" placeholder="Número de teléfono" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input id="direccion" placeholder="Dirección" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="solicitante">Solicitante</Label>
                  <Input id="solicitante" placeholder="Nombre del solicitante" />
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
                <div className="space-y-3">
                  <Label>Tipo de cliente</Label>
                  <RadioGroup value={tipoCliente} onValueChange={setTipoCliente}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ejecutivos" id="ejecutivos" />
                      <Label htmlFor="ejecutivos">Ejecutivos</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="rutas" id="rutas" />
                      <Label htmlFor="rutas">Rutas</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleCreatePortafolio}>
                  Enviar
                </Button>
              </div>
            </div>
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
                placeholder="Buscar por cliente o solicitante..."
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
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="Activo">Activo</SelectItem>
                <SelectItem value="Inactivo">Inactivo</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Nombre del cliente</th>
                  <th className="text-left p-2 font-medium">Archivos</th>
                  <th className="text-left p-2 font-medium">Fecha</th>
                  <th className="text-left p-2 font-medium">Teléfono</th>
                  <th className="text-left p-2 font-medium">Solicitante</th>
                  <th className="text-left p-2 font-medium">Ciudad</th>
                  <th className="text-left p-2 font-medium">Creado por</th>
                  <th className="text-left p-2 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredPortafolios.map((portafolio) => (
                  <tr key={portafolio.id} className="border-b hover:bg-muted/50">
                    <td className="p-2">{portafolio.nombreCliente}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewPdf("ejecutivos")}
                          className="h-auto p-0 hover:bg-transparent"
                        >
                          <FileText className="h-4 w-4 cursor-pointer hover:text-primary" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewPdf("rutas")}
                          className="h-auto p-0 hover:bg-transparent"
                        >
                          <FileText className="h-4 w-4 cursor-pointer hover:text-primary" />
                        </Button>
                        <span className="ml-1">{portafolio.archivos}</span>
                      </div>
                    </td>
                    <td className="p-2">{portafolio.fecha}</td>
                    <td className="p-2">{portafolio.telefono}</td>
                    <td className="p-2">{portafolio.solicitante}</td>
                    <td className="p-2">{portafolio.ciudad}</td>
                    <td className="p-2">{portafolio.creadoPor}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">
                          ({portafolio.enviado}) Enviado
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleGestionPortafolio(portafolio)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <span>Portafolio: 2/2</span>
            <div className="flex items-center gap-2">
              <span>Items per page: 10</span>
              <span>1 - 2 of 2</span>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>‹</Button>
                <Button variant="outline" size="sm" disabled>›</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gestión Modal */}
      <Dialog open={isGestionModalOpen} onOpenChange={setIsGestionModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Gestión de portafolio
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="historial" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="historial">Historial de gestiones</TabsTrigger>
              <TabsTrigger value="nueva-gestion">Agregar nueva gestión</TabsTrigger>
              <TabsTrigger value="enviar-tarifa">Enviar tarifa</TabsTrigger>
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
            
            <TabsContent value="enviar-tarifa" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emailDestino">Email de destino</Label>
                  <Input 
                    id="emailDestino" 
                    type="email"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="asuntoTarifa">Asunto</Label>
                  <Input 
                    id="asuntoTarifa" 
                    placeholder="Envío de tarifa - Portafolio"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mensajeTarifa">Mensaje</Label>
                  <Textarea 
                    id="mensajeTarifa" 
                    placeholder="Estimado cliente, adjunto encontrará nuestro portafolio de servicios..."
                    className="min-h-[100px]"
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => {
                    toast.success("Tarifa enviada correctamente")
                    setIsGestionModalOpen(false)
                  }}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Enviar tarifa
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
              {pdfType === "ejecutivos" ? "Portafolio de Ejecutivos" : "Portafolio de Rutas"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 bg-gray-100 rounded-lg p-8 min-h-[500px] flex items-center justify-center">
            <div className="text-center space-y-4">
              <FileText className="h-16 w-16 text-gray-400 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Vista previa de PDF</h3>
                <p className="text-gray-500">
                  {pdfType === "ejecutivos" ? "Portafolio de Ejecutivos" : "Portafolio de Rutas"}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Contenido del documento {pdfType === "ejecutivos" ? "ejecutivos" : "de rutas"}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}