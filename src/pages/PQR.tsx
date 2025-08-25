import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  MessageSquare, Plus, Search, Filter, Eye, Calendar, User, 
  Clock, CheckCircle, AlertTriangle, XCircle, BarChart3, 
  TrendingUp, Phone, Mail, MessageCircle, FileText, Settings,
  Download, Upload, RefreshCw, Archive, Send, History
} from "lucide-react"

// Datos de ejemplo
const pqrData = {
  metrics: {
    total: 156,
    pendientes: 45,
    enProceso: 32,
    cerradas: 79,
    vencidas: 8
  },
  chartData: [
    { dia: "Lun", peticiones: 12, quejas: 8, reclamos: 5 },
    { dia: "Mar", peticiones: 18, quejas: 12, reclamos: 7 },
    { dia: "Mié", peticiones: 15, quejas: 6, reclamos: 9 },
    { dia: "Jue", peticiones: 22, quejas: 15, reclamos: 4 },
    { dia: "Vie", peticiones: 20, quejas: 10, reclamos: 8 },
    { dia: "Sáb", peticiones: 8, quejas: 4, reclamos: 2 },
    { dia: "Dom", peticiones: 5, quejas: 2, reclamos: 1 }
  ],
  pqrList: [
    {
      id: "PQR2024001",
      tipo: "QUEJA",
      titulo: "Demora en servicio de transporte",
      solicitante: "María González",
      email: "maria.gonzalez@email.com",
      telefono: "+57 300 123 4567",
      fechaCreacion: "2024-08-15",
      fechaVencimiento: "2024-08-25",
      estado: "EN_PROCESO",
      prioridad: "ALTA",
      canal: "WEB",
      categoria: "SERVICIO",
      descripcion: "El servicio de transporte llegó 2 horas tarde causando inconvenientes en reunión importante.",
      respuesta: "",
      asignadoA: "Juan Pérez",
      comentarios: [
        {
          fecha: "2024-08-15 10:30",
          usuario: "Sistema",
          mensaje: "PQR registrada automáticamente"
        },
        {
          fecha: "2024-08-15 14:20",
          usuario: "Juan Pérez",
          mensaje: "Caso asignado, iniciando investigación"
        }
      ]
    },
    {
      id: "PQR2024002",
      tipo: "PETICION",
      titulo: "Solicitud de nueva ruta",
      solicitante: "Carlos Rodríguez",
      email: "carlos.rodriguez@email.com",
      telefono: "+57 301 987 6543",
      fechaCreacion: "2024-08-14",
      fechaVencimiento: "2024-08-28",
      estado: "PENDIENTE",
      prioridad: "MEDIA",
      canal: "TELEFONO",
      categoria: "SERVICIO",
      descripcion: "Solicito evaluación para nueva ruta que conecte zona industrial con centro de la ciudad.",
      respuesta: "",
      asignadoA: "Ana López",
      comentarios: [
        {
          fecha: "2024-08-14 09:15",
          usuario: "Sistema",
          mensaje: "PQR registrada por call center"
        }
      ]
    },
    {
      id: "PQR2024003",
      tipo: "RECLAMO",
      titulo: "Cobro indebido en factura",
      solicitante: "Luis Martínez",
      email: "luis.martinez@email.com",
      telefono: "+57 302 456 7890",
      fechaCreacion: "2024-08-13",
      fechaVencimiento: "2024-08-20",
      estado: "VENCIDA",
      prioridad: "ALTA",
      canal: "EMAIL",
      categoria: "FACTURACION",
      descripcion: "Se está cobrando un servicio que no fue prestado según el contrato acordado.",
      respuesta: "",
      asignadoA: "Pedro Sánchez",
      comentarios: [
        {
          fecha: "2024-08-13 16:45",
          usuario: "Sistema",
          mensaje: "PQR registrada por email"
        },
        {
          fecha: "2024-08-14 08:30",
          usuario: "Pedro Sánchez",
          mensaje: "Revisando facturación del cliente"
        }
      ]
    }
  ]
}

export default function PQR() {
  const [filtroTipo, setFiltroTipo] = useState("TODOS")
  const [filtroEstado, setFiltroEstado] = useState("TODOS")
  const [filtroPrioridad, setFiltroPrioridad] = useState("TODOS")
  const [busqueda, setBusqueda] = useState("")
  const [pqrSeleccionada, setPqrSeleccionada] = useState<any>(null)
  const [modalDetalle, setModalDetalle] = useState(false)
  const [modalNueva, setModalNueva] = useState(false)
  const [modalRespuesta, setModalRespuesta] = useState(false)

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "PENDIENTE":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "EN_PROCESO":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "CERRADA":
        return "bg-green-100 text-green-800 border-green-300"
      case "VENCIDA":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case "ALTA":
        return "bg-red-500"
      case "MEDIA":
        return "bg-yellow-500"
      case "BAJA":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "PETICION":
        return <MessageCircle className="h-4 w-4" />
      case "QUEJA":
        return <AlertTriangle className="h-4 w-4" />
      case "RECLAMO":
        return <XCircle className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const filteredPQR = pqrData.pqrList.filter(pqr => {
    const matchesTipo = filtroTipo === "TODOS" || pqr.tipo === filtroTipo
    const matchesEstado = filtroEstado === "TODOS" || pqr.estado === filtroEstado
    const matchesPrioridad = filtroPrioridad === "TODOS" || pqr.prioridad === filtroPrioridad
    const matchesBusqueda = busqueda === "" || 
      pqr.id.toLowerCase().includes(busqueda.toLowerCase()) ||
      pqr.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      pqr.solicitante.toLowerCase().includes(busqueda.toLowerCase())
    
    return matchesTipo && matchesEstado && matchesPrioridad && matchesBusqueda
  })

  const maxValue = Math.max(...pqrData.chartData.flatMap(d => [d.peticiones, d.quejas, d.reclamos]))

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            Gestión de PQR
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Sistema inteligente de Peticiones, Quejas y Reclamos
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
          <Button 
            onClick={() => setModalNueva(true)}
            className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva PQR
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Total PQR</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">
                  {pqrData.metrics.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Pendientes</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-600">
                  {pqrData.metrics.pendientes}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <RefreshCw className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">En Proceso</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">
                  {pqrData.metrics.enProceso}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Cerradas</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
                  {pqrData.metrics.cerradas}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Vencidas</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600">
                  {pqrData.metrics.vencidas}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de tendencias */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Tendencias Semanales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pqrData.chartData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{item.dia}</span>
                  <span className="text-xs text-muted-foreground">
                    Total: {item.peticiones + item.quejas + item.reclamos}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex gap-1">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Peticiones: {item.peticiones}</span>
                      </div>
                      <Progress value={(item.peticiones / maxValue) * 100} className="h-2" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Quejas: {item.quejas}</span>
                      </div>
                      <Progress value={(item.quejas / maxValue) * 100} className="h-2" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Reclamos: {item.reclamos}</span>
                      </div>
                      <Progress value={(item.reclamos / maxValue) * 100} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ID, título o solicitante..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 lg:gap-4">
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">Todos</SelectItem>
                  <SelectItem value="PETICION">Petición</SelectItem>
                  <SelectItem value="QUEJA">Queja</SelectItem>
                  <SelectItem value="RECLAMO">Reclamo</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">Todos</SelectItem>
                  <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                  <SelectItem value="EN_PROCESO">En Proceso</SelectItem>
                  <SelectItem value="CERRADA">Cerrada</SelectItem>
                  <SelectItem value="VENCIDA">Vencida</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filtroPrioridad} onValueChange={setFiltroPrioridad}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">Todas</SelectItem>
                  <SelectItem value="ALTA">Alta</SelectItem>
                  <SelectItem value="MEDIA">Media</SelectItem>
                  <SelectItem value="BAJA">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de PQR */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lista de PQR</span>
            <Badge variant="outline">{filteredPQR.length} registros</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPQR.map((pqr) => (
              <div 
                key={pqr.id} 
                className="border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => {
                  setPqrSeleccionada(pqr)
                  setModalDetalle(true)
                }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="flex items-center gap-2">
                        {getTipoIcon(pqr.tipo)}
                        <span className="font-semibold text-primary">{pqr.id}</span>
                        <div className={`w-2 h-2 rounded-full ${getPrioridadColor(pqr.prioridad)}`} />
                      </div>
                      <Badge variant="outline" className={getEstadoColor(pqr.estado)}>
                        {pqr.estado.replace("_", " ")}
                      </Badge>
                    </div>
                    
                    <h3 className="font-medium text-sm sm:text-base">{pqr.titulo}</h3>
                    
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {pqr.solicitante}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {pqr.fechaCreacion}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Vence: {pqr.fechaVencimiento}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-row lg:flex-col gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        setPqrSeleccionada(pqr)
                        setModalDetalle(true)
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    
                    {pqr.estado !== "CERRADA" && (
                      <Button 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setPqrSeleccionada(pqr)
                          setModalRespuesta(true)
                        }}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Responder
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal Detalle PQR */}
      <Dialog open={modalDetalle} onOpenChange={setModalDetalle}>
        <DialogContent className="max-w-4xl mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <MessageSquare className="h-5 w-5" />
              Detalle PQR {pqrSeleccionada?.id}
            </DialogTitle>
          </DialogHeader>
          
          {pqrSeleccionada && (
            <Tabs defaultValue="detalle" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="detalle">Detalle</TabsTrigger>
                <TabsTrigger value="historial">Historial</TabsTrigger>
                <TabsTrigger value="respuesta">Respuesta</TabsTrigger>
              </TabsList>
              
              <TabsContent value="detalle" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Tipo</Label>
                      <div className="flex items-center gap-2 mt-1">
                        {getTipoIcon(pqrSeleccionada.tipo)}
                        <span>{pqrSeleccionada.tipo}</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Estado</Label>
                      <Badge className={`mt-1 ${getEstadoColor(pqrSeleccionada.estado)}`}>
                        {pqrSeleccionada.estado.replace("_", " ")}
                      </Badge>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Prioridad</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`w-3 h-3 rounded-full ${getPrioridadColor(pqrSeleccionada.prioridad)}`} />
                        <span>{pqrSeleccionada.prioridad}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Solicitante</Label>
                      <p className="mt-1">{pqrSeleccionada.solicitante}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <p className="mt-1 text-blue-600">{pqrSeleccionada.email}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Teléfono</Label>
                      <p className="mt-1">{pqrSeleccionada.telefono}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Descripción</Label>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm">{pqrSeleccionada.descripcion}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="historial" className="space-y-4 mt-4">
                <div className="space-y-3">
                  {pqrSeleccionada.comentarios.map((comentario, index) => (
                    <div key={index} className="border-l-4 border-primary pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-sm">{comentario.usuario}</span>
                        <span className="text-xs text-muted-foreground">{comentario.fecha}</span>
                      </div>
                      <p className="text-sm mt-1">{comentario.mensaje}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="respuesta" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="respuesta">Respuesta</Label>
                    <Textarea 
                      id="respuesta"
                      placeholder="Escriba su respuesta aquí..."
                      rows={5}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Respuesta
                    </Button>
                    <Button variant="outline">
                      <Archive className="h-4 w-4 mr-2" />
                      Cerrar PQR
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Nueva PQR */}
      <Dialog open={modalNueva} onOpenChange={setModalNueva}>
        <DialogContent className="max-w-2xl mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <Plus className="h-5 w-5" />
              Registrar Nueva PQR
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tipo">Tipo de PQR</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Seleccione el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PETICION">Petición</SelectItem>
                    <SelectItem value="QUEJA">Queja</SelectItem>
                    <SelectItem value="RECLAMO">Reclamo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="categoria">Categoría</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Seleccione categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SERVICIO">Servicio</SelectItem>
                    <SelectItem value="FACTURACION">Facturación</SelectItem>
                    <SelectItem value="ATENCION">Atención al Cliente</SelectItem>
                    <SelectItem value="OTROS">Otros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="titulo">Título</Label>
              <Input 
                id="titulo"
                placeholder="Resumen breve del caso"
                className="mt-1"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="solicitante">Nombre del Solicitante</Label>
                <Input 
                  id="solicitante"
                  placeholder="Nombre completo"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input 
                  id="telefono"
                  placeholder="+57 300 123 4567"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="canal">Canal de Recepción</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="¿Cómo llegó?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WEB">Sitio Web</SelectItem>
                    <SelectItem value="TELEFONO">Teléfono</SelectItem>
                    <SelectItem value="EMAIL">Email</SelectItem>
                    <SelectItem value="PRESENCIAL">Presencial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="descripcion">Descripción Detallada</Label>
              <Textarea 
                id="descripcion"
                placeholder="Describa detalladamente la situación..."
                rows={4}
                className="mt-1"
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button className="flex-1">
                <Upload className="h-4 w-4 mr-2" />
                Registrar PQR
              </Button>
              <Button variant="outline" onClick={() => setModalNueva(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Respuesta Rápida */}
      <Dialog open={modalRespuesta} onOpenChange={setModalRespuesta}>
        <DialogContent className="max-w-lg mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <Send className="h-5 w-5" />
              Responder PQR {pqrSeleccionada?.id}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="accion">Acción a Realizar</Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Seleccione una acción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RESPONDER">Responder</SelectItem>
                  <SelectItem value="REASIGNAR">Reasignar</SelectItem>
                  <SelectItem value="CERRAR">Cerrar</SelectItem>
                  <SelectItem value="ESCALATE">Escalar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="respuesta-rapida">Respuesta</Label>
              <Textarea 
                id="respuesta-rapida"
                placeholder="Escriba su respuesta..."
                rows={4}
                className="mt-1"
              />
            </div>
            
            <div className="flex gap-2">
              <Button className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                Enviar
              </Button>
              <Button variant="outline" onClick={() => setModalRespuesta(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}