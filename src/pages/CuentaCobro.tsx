import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Search, Filter, Eye, UserX, CheckCircle, XCircle, Clock, ArrowLeft, FileCheck, Plus } from "lucide-react"

// Datos de muestra
const lotesDisponibles = [
  {
    id: 1,
    numero: "LOTE-2025-001",
    estado: "EN PREPARACION",
    valorActual: 15450000,
    cantidadCuentas: 12,
    fechaCreacion: "2025-01-15",
    responsable: "Ana García"
  },
  {
    id: 2,
    numero: "LOTE-2025-002",
    estado: "EN REVISION",
    valorActual: 8920000,
    cantidadCuentas: 8,
    fechaCreacion: "2025-01-18",
    responsable: "Carlos Mendez"
  },
  {
    id: 3,
    numero: "LOTE-2025-003",
    estado: "PENDIENTE",
    valorActual: 12300000,
    cantidadCuentas: 15,
    fechaCreacion: "2025-01-22",
    responsable: "María López"
  }
]

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
    nombre: "COUNTRY LICORES",
    tipo: "PROPIO",
    correo: "GERENCIA@EMPRESAMAIL.COM",
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
    cliente: "Center Source",
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
    cliente: "Center Source",
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
    cliente: "Center Source",
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

const Metric = ({ icon: Icon, label, value, sub }: any) => (
  <Card className="rounded-2xl border">
    <CardContent className="p-5 flex items-center gap-4">
      <div className="h-10 w-10 rounded-xl bg-blue-600/10 text-blue-700 grid place-content-center">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="text-2xl font-semibold leading-none tracking-tight">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
        {sub && <div className="text-[11px] mt-1 text-muted-foreground">{sub}</div>}
      </div>
    </CardContent>
  </Card>
);

export default function CuentaCobro() {
  const [filtroFecha, setFiltroFecha] = useState("")
  const [filtroContratista, setFiltroContratista] = useState("all")
  const [filtroEstado, setFiltroEstado] = useState("all")
  const [busqueda, setBusqueda] = useState("")
  const [mostrarDetalle, setMostrarDetalle] = useState(false)
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState<any>(null)
  const [mostrarLotes, setMostrarLotes] = useState(false)
  const [loteSeleccionado, setLoteSeleccionado] = useState<string | null>(null)

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "EN REVISION":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 rounded-md">EN REVISIÓN ⚠</Badge>
      case "APROBADO":
        return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100 rounded-md">APROBADO ✓</Badge>
      case "RECHAZADO":
        return <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100 rounded-md">RECHAZADO ✗</Badge>
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  const verDetalleCuenta = (cuenta: any) => {
    setCuentaSeleccionada(cuenta)
    setMostrarDetalle(true)
  }

  const radicarCuenta = () => {
    if (loteSeleccionado) {
      console.log(`Radicando cuenta ${cuentaSeleccionada?.numero} al lote ${loteSeleccionado}`)
      setMostrarLotes(false)
      setLoteSeleccionado(null)
    }
  }

  const getEstadoLoteBadge = (estado: string) => {
    switch (estado) {
      case "EN PREPARACION":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100 rounded-md">EN PREPARACIÓN</Badge>
      case "EN REVISION":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 rounded-md">EN REVISIÓN</Badge>
      case "PENDIENTE":
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-100 rounded-md">PENDIENTE</Badge>
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  if (mostrarDetalle && cuentaSeleccionada) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Header con botón de regreso */}
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setMostrarDetalle(false)}
              className="flex items-center gap-2 rounded-xl"
            >
              <ArrowLeft className="h-4 w-4" />
              Regresar
            </Button>
            <h1 className="text-xl font-bold text-primary">
              {cuentaSeleccionada.contratista}
            </h1>
          </div>

          {/* Información de la cuenta */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="rounded-2xl border">
              <CardContent className="p-6">
                <p className="text-sm text-blue-600 font-medium">Valor Liquidación</p>
                <p className="text-2xl font-bold text-blue-700">$ 1,804,360</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border">
              <CardContent className="p-6">
                <p className="text-sm text-green-600 font-medium">Cobrado contratista</p>
                <p className="text-2xl font-bold text-green-700">$ 1,804,360</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border">
              <CardContent className="p-6">
                <p className="text-sm text-yellow-600 font-medium">Estado</p>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 mt-2 rounded-md">EN REVISIÓN</Badge>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border">
              <CardContent className="p-6 flex gap-2">
                <Button variant="outline" className="flex-1 rounded-xl">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  APROBAR
                </Button>
                <Button variant="destructive" className="flex-1 rounded-xl">
                  <XCircle className="h-4 w-4 mr-2" />
                  RECHAZAR
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Tabla de servicios */}
          <Card className="rounded-2xl border">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Detalle de Servicios</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Búsqueda general"
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="pl-9 w-64 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border overflow-hidden">
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
                      <TableRow key={servicio.id} className="hover:bg-muted/50">
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="max-w-xs">{servicio.cliente}</TableCell>
                        <TableCell>{servicio.origen}</TableCell>
                        <TableCell>{servicio.destino}</TableCell>
                        <TableCell>{servicio.fecha}</TableCell>
                        <TableCell>{servicio.hora}</TableCell>
                        <TableCell>{servicio.valorLiquidacion}</TableCell>
                        <TableCell>{servicio.valorContratista}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100 rounded-md">
                            {servicio.diferencia}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="rounded-xl">
                            <Eye className="h-4 w-4" />
                            {servicio.historico}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Botón Radicar Cuenta */}
          <div className="flex justify-center pt-4">
            <Button 
              onClick={() => setMostrarLotes(true)}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-2 rounded-xl"
            >
              <FileCheck className="h-4 w-4 mr-2" />
              Radicar Cuenta
            </Button>
          </div>

          {/* Modal de Lotes Disponibles */}
          <Dialog open={mostrarLotes} onOpenChange={setMostrarLotes}>
            <DialogContent className="max-w-4xl rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-primary">
                  Seleccionar Lote para Radicar Cuenta de Cobro
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Cuenta: <span className="font-semibold">{cuentaSeleccionada?.numero} - {cuentaSeleccionada?.contratista}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Valor: <span className="font-semibold text-green-600">{cuentaSeleccionada?.valor}</span>
                </p>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Lotes Disponibles</h3>
                  <Input 
                    placeholder="Buscar lote..."
                    className="w-64 rounded-xl"
                  />
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {lotesDisponibles.map((lote) => (
                    <div 
                      key={lote.id} 
                      className={`border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
                        loteSeleccionado === lote.numero 
                          ? 'border-primary bg-primary/5' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setLoteSeleccionado(lote.numero)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-lg">{lote.numero}</h4>
                            {getEstadoLoteBadge(lote.estado)}
                            {loteSeleccionado === lote.numero && (
                              <CheckCircle className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Valor Actual:</span>
                              <p className="font-semibold text-green-600">
                                ${lote.valorActual.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Cuentas:</span>
                              <p className="font-semibold">{lote.cantidadCuentas} cuentas</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Fecha Creación:</span>
                              <p>{lote.fechaCreacion}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Responsable:</span>
                              <p>{lote.responsable}</p>
                            </div>
                          </div>
                          <Card className="mt-3 rounded-xl">
                            <CardContent className="p-3 bg-blue-50">
                              <p className="text-sm text-blue-700">
                                <strong>Valor Final si se radica:</strong> 
                                <span className="ml-2 font-bold">
                                  ${(lote.valorActual + parseFloat(cuentaSeleccionada?.valor?.replace(/[$,]/g, '') || '0')).toLocaleString()}
                                </span>
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setMostrarLotes(false)
                      setLoteSeleccionado(null)
                    }}
                    className="rounded-xl"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={radicarCuenta}
                    disabled={!loteSeleccionado}
                    className="bg-primary hover:bg-primary/90 rounded-xl"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Radicar a Lote Seleccionado
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header + CTAs */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-6 pb-0">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Gestión de Cuentas de Cobro</h1>
          <p className="text-sm text-muted-foreground">Está habilitado <span className="text-primary">JULIO</span></p>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Metric icon={FileCheck} label="Total Cuentas" value={234} sub={"+8% desde el mes pasado"} />
          <Metric icon={CheckCircle} label="Aprobadas" value={198} sub={"84.6% del total"} />
          <Metric icon={Clock} label="En Revisión" value={23} sub={"+12% vs mes anterior"} />
          <Metric icon={XCircle} label="Rechazadas" value={13} sub={"-5% vs mes anterior"} />
        </div>

        {/* Filtros */}
        <Card className="rounded-2xl border">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="text-sm font-medium text-primary mb-2 block">Fecha Inicio</label>
                <Input 
                  type="date"
                  value={filtroFecha}
                  onChange={(e) => setFiltroFecha(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-primary mb-2 block">Contratistas</label>
                <Select value={filtroContratista} onValueChange={setFiltroContratista}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
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
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="revision">En Revisión</SelectItem>
                    <SelectItem value="aprobado">Aprobado</SelectItem>
                    <SelectItem value="rechazado">Rechazado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2 rounded-xl">
                  <Filter className="h-4 w-4" />
                  Filtrar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de cuentas recibidas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="rounded-2xl border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Lista de Cuentas de Cobro Recibidas</CardTitle>
                <p className="text-sm text-muted-foreground">Gestiona y revisa las cuentas de cobro recibidas</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar por número, contratista o estado"
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="pl-10 rounded-xl"
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="rounded-xl border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cuenta N°</TableHead>
                        <TableHead>Contratista</TableHead>
                        <TableHead>Periodo</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cuentasCobro.map((cuenta) => (
                        <TableRow key={cuenta.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{cuenta.numero}</TableCell>
                          <TableCell className="max-w-xs">
                            <div className="font-medium">{cuenta.contratista}</div>
                            <div className="text-sm text-muted-foreground">
                              {cuenta.enviadaEn}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {cuenta.desde} - {cuenta.hasta}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-green-600">{cuenta.valor}</TableCell>
                          <TableCell>{getEstadoBadge(cuenta.estado)}</TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => verDetalleCuenta(cuenta)}
                              className="flex items-center gap-2 rounded-xl"
                            >
                              <Eye className="h-4 w-4" />
                              Ver detalle
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination placeholder */}
                <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                  <div>Mostrando 1–4 de 4</div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="rounded-xl">Anterior</Button>
                    <Button variant="outline" size="sm" className="rounded-xl">Siguiente</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panel lateral - Contratistas sin cuenta */}
          <Card className="rounded-2xl border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <UserX className="h-5 w-5 text-orange-500" />
                Sin cuenta este mes
              </CardTitle>
              <p className="text-sm text-muted-foreground">Contratistas que no han enviado cuenta de cobro</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {contratistasFaltantes.map((contratista) => (
                <div key={contratista.id} className="p-3 border rounded-xl hover:bg-muted/50">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{contratista.nombre}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={`rounded-md text-xs ${
                          contratista.tipo === "PROPIO" 
                            ? "bg-blue-100 text-blue-800" 
                            : "bg-purple-100 text-purple-800"
                        }`}>
                          {contratista.tipo}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{contratista.correo}</p>
                      <p className="text-xs text-muted-foreground">{contratista.celular}</p>
                      <p className="text-xs text-muted-foreground">
                        Último login: {contratista.ultimoLogin}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}