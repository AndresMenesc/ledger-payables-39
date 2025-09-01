import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Search, Plus, Download, Mail, Eye, Calendar, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface FUEC {
  id: string
  conductor: string
  vehiculo: string
  ruta: string
  contrato: string
  creado: Date
  vencimiento: Date
  estado: "activo" | "por_vencer" | "vencido"
}

const mockFUECs: FUEC[] = [
  {
    id: "FUEC-0001",
    conductor: "Juan Pérez",
    vehiculo: "ABC123",
    ruta: "Bogotá - Medellín - Cali",
    contrato: "CON-2024-001",
    creado: new Date("2024-01-15"),
    vencimiento: new Date("2024-12-31"),
    estado: "activo"
  },
  {
    id: "FUEC-0002", 
    conductor: "María González",
    vehiculo: "DEF456",
    ruta: "Cartagena - Barranquilla",
    contrato: "CON-2024-002",
    creado: new Date("2024-02-10"),
    vencimiento: new Date("2024-11-30"),
    estado: "activo"
  },
  {
    id: "FUEC-0003",
    conductor: "Carlos López",
    vehiculo: "GHI789",
    ruta: "Bucaramanga - Cúcuta",
    contrato: "CON-2024-001", 
    creado: new Date("2024-01-20"),
    vencimiento: new Date("2025-01-15"),
    estado: "por_vencer"
  }
]

const getEstadoBadge = (estado: FUEC["estado"]) => {
  switch (estado) {
    case "activo":
      return <Badge variant="success">Activo</Badge>
    case "por_vencer":
      return <Badge variant="warning">Por Vencer</Badge>
    case "vencido":
      return <Badge variant="destructive">Vencido</Badge>
    default:
      return <Badge variant="secondary">Desconocido</Badge>
  }
}

export default function FUEC() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFUECs, setSelectedFUECs] = useState<string[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailAddress, setEmailAddress] = useState("")
  const [newFUEC, setNewFUEC] = useState({
    conductor: "",
    vehiculo: "",
    ruta: "",
    contrato: "",
    vencimiento: null as Date | null
  })
  const { toast } = useToast()

  const filteredFUECs = mockFUECs.filter(fuec =>
    fuec.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fuec.conductor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fuec.vehiculo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fuec.ruta.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fuec.contrato.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFUECs(filteredFUECs.map(fuec => fuec.id))
    } else {
      setSelectedFUECs([])
    }
  }

  const handleSelectFUEC = (fuecId: string, checked: boolean) => {
    if (checked) {
      setSelectedFUECs(prev => [...prev, fuecId])
    } else {
      setSelectedFUECs(prev => prev.filter(id => id !== fuecId))
    }
  }

  const handleCreateFUEC = () => {
    if (!newFUEC.conductor || !newFUEC.vehiculo || !newFUEC.ruta || !newFUEC.contrato || !newFUEC.vencimiento) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos requeridos",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "FUEC Creado",
      description: "El FUEC ha sido creado exitosamente",
    })
    
    setShowCreateModal(false)
    setNewFUEC({
      conductor: "",
      vehiculo: "",
      ruta: "",
      contrato: "",
      vencimiento: null
    })
  }

  const handleSendEmail = () => {
    if (!emailAddress) {
      toast({
        title: "Error",
        description: "Por favor ingrese una dirección de correo electrónico",
        variant: "destructive",
      })
      return
    }

    if (selectedFUECs.length === 0) {
      toast({
        title: "Error", 
        description: "Por favor seleccione al menos un FUEC para enviar",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Correo Enviado",
      description: `Se han enviado ${selectedFUECs.length} FUEC(s) a ${emailAddress}`,
    })
    
    setShowEmailModal(false)
    setEmailAddress("")
    setSelectedFUECs([])
  }

  const handleDownload = (fuecId: string) => {
    toast({
      title: "Descarga Iniciada",
      description: `Descargando FUEC ${fuecId}`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestión de FUEC</h1>
          <p className="text-muted-foreground">Formato Único de Extracto del Contrato</p>
          <p className="text-sm text-muted-foreground mt-1">
            Seleccione los checks del inicio de la tabla para enviar por correo los FUECs seleccionados
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Crear FUEC
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por conductor, vehículo, ruta o contrato..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {selectedFUECs.length > 0 && (
          <Button
            variant="outline"
            onClick={() => setShowEmailModal(true)}
            className="flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />
            Enviar por Correo ({selectedFUECs.length})
          </Button>
        )}
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedFUECs.length === filteredFUECs.length && filteredFUECs.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Conductor</TableHead>
              <TableHead>Vehículo</TableHead>
              <TableHead>Ruta</TableHead>
              <TableHead>Contrato</TableHead>
              <TableHead>Creado</TableHead>
              <TableHead>Vencimiento</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFUECs.map((fuec) => (
              <TableRow key={fuec.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedFUECs.includes(fuec.id)}
                    onCheckedChange={(checked) => handleSelectFUEC(fuec.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell className="font-medium">{fuec.id}</TableCell>
                <TableCell>{fuec.conductor}</TableCell>
                <TableCell>{fuec.vehiculo}</TableCell>
                <TableCell>{fuec.ruta}</TableCell>
                <TableCell>{fuec.contrato}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {format(fuec.creado, "dd/MM/yyyy", { locale: es })}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {format(fuec.vencimiento, "dd/MM/yyyy", { locale: es })}
                  </div>
                </TableCell>
                <TableCell>{getEstadoBadge(fuec.estado)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(fuec.id)}
                    >
                      <Download className="h-4 w-4" />
                      Descargar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal para crear FUEC */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Crear Nuevo FUEC</DialogTitle>
            <DialogDescription>
              Complete los campos para generar un nuevo Formato Único de Extracto del Contrato
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="conductor">Conductor *</Label>
                <Select value={newFUEC.conductor} onValueChange={(value) => setNewFUEC(prev => ({ ...prev, conductor: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar conductor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="juan-perez">Juan Pérez</SelectItem>
                    <SelectItem value="maria-gonzalez">María González</SelectItem>
                    <SelectItem value="carlos-lopez">Carlos López</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vehiculo">Vehículo *</Label>
                <Select value={newFUEC.vehiculo} onValueChange={(value) => setNewFUEC(prev => ({ ...prev, vehiculo: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar vehículo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ABC123">ABC123</SelectItem>
                    <SelectItem value="DEF456">DEF456</SelectItem>
                    <SelectItem value="GHI789">GHI789</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ruta">Ruta del FUEC *</Label>
              <Textarea
                id="ruta"
                placeholder="Descripción detallada de la ruta (ej: Bogotá - Medellín - Cali)"
                value={newFUEC.ruta}
                onChange={(e) => setNewFUEC(prev => ({ ...prev, ruta: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contrato">Contrato *</Label>
                <Select value={newFUEC.contrato} onValueChange={(value) => setNewFUEC(prev => ({ ...prev, contrato: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar contrato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CON-2024-001">CON-2024-001</SelectItem>
                    <SelectItem value="CON-2024-002">CON-2024-002</SelectItem>
                    <SelectItem value="CON-2024-003">CON-2024-003</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Fecha de Vencimiento *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newFUEC.vencimiento && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {newFUEC.vencimiento ? format(newFUEC.vencimiento, "dd/MM/yyyy", { locale: es }) : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={newFUEC.vencimiento || undefined}
                      onSelect={(date) => setNewFUEC(prev => ({ ...prev, vencimiento: date || null }))}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateFUEC}>
              Crear FUEC
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para envío por correo */}
      <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Enviar FUECs por Correo</DialogTitle>
            <DialogDescription>
              Se enviarán {selectedFUECs.length} FUEC(s) seleccionado(s)
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Dirección de Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>FUECs Seleccionados:</Label>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {selectedFUECs.map(fuecId => (
                  <div key={fuecId} className="text-sm text-muted-foreground">
                    • {fuecId}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSendEmail}>
              <Mail className="mr-2 h-4 w-4" />
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}