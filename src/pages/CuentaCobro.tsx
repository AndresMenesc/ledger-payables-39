import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Eye, UserX, CheckCircle, XCircle, Clock, ArrowLeft } from "lucide-react"

// Datos de muestra
const cuentasCobro = [
  {
    id: 1,
    numero: "0099",
    contratista: "YAKELINNE MILLÁN MEJÍA",
    desde: "Julio 01, 2025",
    hasta: "Julio 31, 2025",
    valor: "$1,804,360",
    enviadaEn: "Agosto 08, 2025 7:54 PM",
    estado: "EN REVISION"
  },
  {
    id: 2,
    numero: "0106",
    contratista: "EBEB MELED LUNA PARRA",
    desde: "Julio 01, 2025",
    hasta: "Julio 31, 2025",
    valor: "$2,025,000",
    enviadaEn: "Agosto 12, 2025 4:48 PM",
    estado: "EN REVISION"
  },
  {
    id: 3,
    numero: "0107",
    contratista: "JHON FREDY ARTUNDUAGA YAGUE",
    desde: "Julio 01, 2025",
    hasta: "Julio 31, 2025",
    valor: "$2,200,000",
    enviadaEn: "Agosto 16, 2025 8:37 AM",
    estado: "EN REVISION"
  },
  {
    id: 4,
    numero: "0108",
    contratista: "UBEL ANDRÉS MOGOLLÓN LOBO",
    desde: "Julio 01, 2025",
    hasta: "Julio 31, 2025",
    valor: "$2,600,000",
    enviadaEn: "Agosto 26, 2025 9:53 PM",
    estado: "EN REVISION"
  }
]

const contratistasFaltantes = [
  {
    id: 1,
    nombre: "COUNTRY EXPRESS",
    tipo: "PROPIO",
    correo: "GERENCIA@COUNTRYEXP.COM",
    celular: "3163304262",
    ultimoLogin: "Mayo 07, 2025 11:27 PM"
  },
  {
    id: 2,
    nombre: "JULIE ANDREA IDARRAGA MAHECHA",
    tipo: "CONVENIO",
    correo: "JULIEIDARRAGA@GMAIL.COM",
    celular: "3202187731",
    ultimoLogin: "Junio 24, 2025 6:13 PM"
  },
  {
    id: 3,
    nombre: "JUAN CARLOS MARÍN GONZÁLEZ",
    tipo: "CONVENIO",
    correo: "JUANKYS0912@GMAIL.COM",
    celular: "3148855104",
    ultimoLogin: "Nunca a ingresado"
  }
]

const detalleServicios = [
  {
    id: 1,
    cliente: "CINEMARK COLOMBIA FLORESTA",
    origen: "ENGATIVA",
    destino: "ENGATIVA",
    fecha: "Julio 01, 2025",
    hora: "1:30 AM",
    valorLiquidacion: "58,080",
    valorContratista: "58,080",
    diferencia: "$0",
    historico: "4951"
  },
  {
    id: 2,
    cliente: "CINEMARK COLOMBIA FLORESTA",
    origen: "ENGATIVA",
    destino: "ENGATIVA",
    fecha: "Julio 02, 2025",
    hora: "1:30 AM",
    valorLiquidacion: "58,064",
    valorContratista: "58,064",
    diferencia: "$0",
    historico: "4973"
  },
  {
    id: 3,
    cliente: "CINEMARK COLOMBIA FLORESTA",
    origen: "ENGATIVA",
    destino: "ENGATIVA",
    fecha: "Julio 03, 2025",
    hora: "1:30 AM",
    valorLiquidacion: "58,064",
    valorContratista: "58,064",
    diferencia: "$0",
    historico: "4995"
  }
]

export default function CuentaCobro() {
  const [filtroFecha, setFiltroFecha] = useState("")
  const [filtroContratista, setFiltroContratista] = useState("all")
  const [filtroEstado, setFiltroEstado] = useState("all")
  const [busqueda, setBusqueda] = useState("")
  const [mostrarDetalle, setMostrarDetalle] = useState(false)
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState<any>(null)

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "EN REVISION":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">EN REVISIÓN ⚠</Badge>
      case "APROBADO":
        return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">APROBADO ✓</Badge>
      case "RECHAZADO":
        return <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">RECHAZADO ✗</Badge>
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  const verDetalleCuenta = (cuenta: any) => {
    setCuentaSeleccionada(cuenta)
    setMostrarDetalle(true)
  }

  if (mostrarDetalle && cuentaSeleccionada) {
    return (
      <div className="space-y-4">
        {/* Header con botón de regreso */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setMostrarDetalle(false)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Regresar
          </Button>
          <h1 className="text-xl font-bold text-primary">
            {cuentaSeleccionada.contratista}
          </h1>
        </div>

        {/* Información de la cuenta */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Valor Liquidación</p>
            <p className="text-2xl font-bold text-blue-700">$ 1,804,360</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Cobrado contratista</p>
            <p className="text-2xl font-bold text-green-700">$ 1,804,360</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-600 font-medium">Estado</p>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 mt-2">EN REVISIÓN</Badge>
          </div>
          <div className="flex gap-2 items-end">
            <Button variant="outline" className="flex-1">
              <CheckCircle className="h-4 w-4 mr-2" />
              APROBAR SS
            </Button>
            <Button variant="destructive" className="flex-1">
              <XCircle className="h-4 w-4 mr-2" />
              RECHAZAR SS
            </Button>
          </div>
        </div>

        {/* Tabla de servicios */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Detalle de Servicios</CardTitle>
              <div className="flex gap-2">
                <Input 
                  placeholder="Búsqueda general"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N°</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Origen</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Valor Liquidación</TableHead>
                  <TableHead>Valor Contratista</TableHead>
                  <TableHead>Diferencia</TableHead>
                  <TableHead>Acciones</TableHead>
                  <TableHead>Histórico</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detalleServicios.map((servicio, index) => (
                  <TableRow key={servicio.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="max-w-xs">{servicio.cliente}</TableCell>
                    <TableCell>{servicio.origen}</TableCell>
                    <TableCell>{servicio.destino}</TableCell>
                    <TableCell>{servicio.fecha}</TableCell>
                    <TableCell>{servicio.hora}</TableCell>
                    <TableCell>{servicio.valorLiquidacion}</TableCell>
                    <TableCell>{servicio.valorContratista}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                        {servicio.diferencia}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                        {servicio.historico}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Está habilitado <span className="text-primary">JULIO</span></h1>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-sm font-medium text-primary mb-2 block">Fecha Inicio</label>
              <Input 
                type="date"
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-primary mb-2 block">Contratistas</label>
              <Select value={filtroContratista} onValueChange={setFiltroContratista}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="yakelinne">YAKELINNE MILLÁN MEJÍA</SelectItem>
                  <SelectItem value="ebeb">EBEB MELED LUNA PARRA</SelectItem>
                  <SelectItem value="jhon">JHON FREDY ARTUNDUAGA YAGUE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-primary mb-2 block">Estado</label>
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="revision">En Revisión</SelectItem>
                  <SelectItem value="aprobado">Aprobado</SelectItem>
                  <SelectItem value="rechazado">Rechazado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtrar
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <UserX className="h-4 w-4" />
                    Faltantes por enviar
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle className="text-primary">
                      Listado de Contratistas que no han enviado cuenta de cobro de <span className="text-red-500">Julio</span>
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <Input 
                        placeholder="Búsqueda general"
                        className="w-64"
                      />
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>#</TableHead>
                          <TableHead>Contratista</TableHead>
                          <TableHead>Tipo Vinculación</TableHead>
                          <TableHead>Correo</TableHead>
                          <TableHead>Celular</TableHead>
                          <TableHead>Último login</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contratistasFaltantes.map((contratista, index) => (
                          <TableRow key={contratista.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="font-medium">{contratista.nombre}</TableCell>
                            <TableCell>
                              <Badge variant={contratista.tipo === "PROPIO" ? "default" : "secondary"}>
                                {contratista.tipo}
                              </Badge>
                            </TableCell>
                            <TableCell>{contratista.correo}</TableCell>
                            <TableCell>{contratista.celular}</TableCell>
                            <TableCell>{contratista.ultimoLogin}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Mostrando 1 de 3 de 3 Registros</span>
                      <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                        3 Contratistas por enviar... NOTIFICALOS AQUÍ
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla principal */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Cuentas de Cobro</CardTitle>
            <div className="flex gap-2">
              <Input 
                placeholder="Búsqueda general"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N°</TableHead>
                <TableHead># Cuenta</TableHead>
                <TableHead>Contratista</TableHead>
                <TableHead>Desde</TableHead>
                <TableHead>Hasta</TableHead>
                <TableHead>Valor Cobrado</TableHead>
                <TableHead>Enviada en:</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cuentasCobro.map((cuenta, index) => (
                <TableRow key={cuenta.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{cuenta.numero}</TableCell>
                  <TableCell className="max-w-xs">{cuenta.contratista}</TableCell>
                  <TableCell>{cuenta.desde}</TableCell>
                  <TableCell>{cuenta.hasta}</TableCell>
                  <TableCell className="font-semibold text-green-600">{cuenta.valor}</TableCell>
                  <TableCell>{cuenta.enviadaEn}</TableCell>
                  <TableCell>{getEstadoBadge(cuenta.estado)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => verDetalleCuenta(cuenta)}
                        className="bg-green-50 hover:bg-green-100 border-green-200"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-blue-50 hover:bg-blue-100 border-blue-200"
                      >
                        <Clock className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
            <span>Mostrando 1 de 4 de 4 Registros</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}