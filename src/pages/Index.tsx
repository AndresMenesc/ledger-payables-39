import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { 
  TrendingUp, TrendingDown, DollarSign, Clock, CheckCircle, 
  AlertTriangle, Package, FileText, Calendar, ArrowRight,
  Truck, Building2, CreditCard, BarChart3, PieChart as PieChartIcon, Settings
} from "lucide-react"

// Datos de ejemplo para el dashboard
const dashboardData = {
  resumenFinanciero: {
    totalBruto: 45300000,
    totalDescuentos: 2265000,
    totalNeto: 43035000,
    totalPrestamos: 3890000,
    variacionMensual: 12.5
  },
  estadoLotes: {
    pendientesAprobacion: 8,
    enProceso: 12,
    aprobados: 25,
    pagados: 15,
    rechazados: 3
  },
  datosGraficas: {
    porMes: [
      { mes: "Ene", valor: 8500000, pagado: 7200000, pendiente: 1300000 },
      { mes: "Feb", valor: 12400000, pagado: 10800000, pendiente: 1600000 },
      { mes: "Mar", valor: 15200000, pagado: 14100000, pendiente: 1100000 },
      { mes: "Abr", valor: 9800000, pagado: 8900000, pendiente: 900000 }
    ],
    porEstado: [
      { name: "Pagados", value: 15, color: "#22c55e", porcentaje: 23.8 },
      { name: "Aprobados", value: 25, color: "#3b82f6", porcentaje: 39.7 },
      { name: "En Proceso", value: 12, color: "#f59e0b", porcentaje: 19.0 },
      { name: "Pendientes", value: 8, color: "#ef4444", porcentaje: 12.7 },
      { name: "Rechazados", value: 3, color: "#6b7280", porcentaje: 4.8 }
    ],
    tiposServicio: [
      { tipo: "Transporte Ejecutivo", cantidad: 28, valor: 18500000 },
      { tipo: "Carga y Logística", cantidad: 22, valor: 15200000 },
      { tipo: "Taxi Corporativo", cantidad: 18, valor: 8800000 },
      { tipo: "Especializado", cantidad: 15, valor: 12800000 }
    ]
  },
  alertas: [
    {
      tipo: "warning",
      titulo: "8 lotes pendientes de aprobación",
      descripcion: "Requieren revisión urgente",
      icono: AlertTriangle
    },
    {
      tipo: "info",
      titulo: "3 préstamos próximos a vencer",
      descripcion: "Vencen en los próximos 15 días",
      icono: CreditCard
    },
    {
      tipo: "error",
      titulo: "3 lotes rechazados",
      descripcion: "Requieren corrección de documentos",
      icono: FileText
    }
  ]
}

const Metric = ({ icon: Icon, label, value, sub, onClick }: any) => (
  <Card className="rounded-2xl border cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
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

export default function Dashboard() {
  const navigate = useNavigate()
  const [mesSeleccionado, setMesSeleccionado] = useState("2024-04")
  const [periodoComparacion, setPeriodoComparacion] = useState("mensual")
  const [mesHabilitadoCuentaCobro, setMesHabilitadoCuentaCobro] = useState("2024-04")
  const [nuevoMesSeleccionado, setNuevoMesSeleccionado] = useState("")
  const [modalAbierto, setModalAbierto] = useState(false)

  const { resumenFinanciero, estadoLotes, datosGraficas, alertas } = dashboardData

  // Calcular máximo para las barras
  const maxValor = Math.max(...datosGraficas.porMes.map(item => item.valor))

  // Funciones de navegación
  const handleCardClick = (path: string) => {
    navigate(path)
  }

  const handleAlertClick = (alertType: string) => {
    switch(alertType) {
      case 'warning':
        navigate('/pagos-aprobar')
        break
      case 'info':
        navigate('/prestamos')
        break
      case 'error':
        navigate('/sin-lote')
        break
      default:
        break
    }
  }

  // Función para manejar el cambio de mes con confirmación
  const handleCambioMes = (nuevoMes: string) => {
    if (nuevoMes !== mesHabilitadoCuentaCobro) {
      setNuevoMesSeleccionado(nuevoMes)
      setModalAbierto(true)
    }
  }

  // Confirmar cambio de mes
  const confirmarCambioMes = () => {
    setMesHabilitadoCuentaCobro(nuevoMesSeleccionado)
    setModalAbierto(false)
  }

  // Obtener nombre del mes en español
  const obtenerNombreMes = (valor: string) => {
    const meses = {
      "2024-01": "Enero 2024",
      "2024-02": "Febrero 2024", 
      "2024-03": "Marzo 2024",
      "2024-04": "Abril 2024",
      "2024-05": "Mayo 2024",
      "2024-06": "Junio 2024",
      "2024-07": "Julio 2024",
      "2024-08": "Agosto 2024",
      "2024-09": "Septiembre 2024",
      "2024-10": "Octubre 2024",
      "2024-11": "Noviembre 2024",
      "2024-12": "Diciembre 2024"
    }
    return meses[valor as keyof typeof meses] || valor
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header + CTAs */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-6 pb-0">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard de Transportes</h1>
          <p className="text-sm text-muted-foreground">Vista general del sistema de pagos y gestión de servicios de transporte</p>
        </div>
        <div className="flex gap-2">
          <Select value={mesSeleccionado} onValueChange={setMesSeleccionado}>
            <SelectTrigger className="w-40 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="2024-01">Enero 2024</SelectItem>
              <SelectItem value="2024-02">Febrero 2024</SelectItem>
              <SelectItem value="2024-03">Marzo 2024</SelectItem>
              <SelectItem value="2024-04">Abril 2024</SelectItem>
            </SelectContent>
          </Select>
          <Select value={periodoComparacion} onValueChange={setPeriodoComparacion}>
            <SelectTrigger className="w-32 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="mensual">Mensual</SelectItem>
              <SelectItem value="trimestral">Trimestral</SelectItem>
              <SelectItem value="anual">Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Control de mes habilitado para cuenta de cobro */}
        <Card className="rounded-2xl border bg-blue-50/50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-medium text-blue-900">Mes Habilitado para Cuenta de Cobro</h3>
                  <p className="text-sm text-blue-700">Los proveedores podrán generar cuentas de cobro para este período</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-blue-800">Mes Actual:</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-300 rounded-md">
                    {obtenerNombreMes(mesHabilitadoCuentaCobro)}
                  </Badge>
                </div>
                <Select value={mesHabilitadoCuentaCobro} onValueChange={handleCambioMes}>
                  <SelectTrigger className="w-40 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="2024-01">Enero 2024</SelectItem>
                    <SelectItem value="2024-02">Febrero 2024</SelectItem>
                    <SelectItem value="2024-03">Marzo 2024</SelectItem>
                    <SelectItem value="2024-04">Abril 2024</SelectItem>
                    <SelectItem value="2024-05">Mayo 2024</SelectItem>
                    <SelectItem value="2024-06">Junio 2024</SelectItem>
                    <SelectItem value="2024-07">Julio 2024</SelectItem>
                    <SelectItem value="2024-08">Agosto 2024</SelectItem>
                    <SelectItem value="2024-09">Septiembre 2024</SelectItem>
                    <SelectItem value="2024-10">Octubre 2024</SelectItem>
                    <SelectItem value="2024-11">Noviembre 2024</SelectItem>
                    <SelectItem value="2024-12">Diciembre 2024</SelectItem>
                  </SelectContent>
                </Select>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                      <Settings className="h-4 w-4 mr-2" />
                      Gestionar Cuentas
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2 text-blue-800">
                        <FileText className="h-5 w-5" />
                        Gestión de Cuentas de Cobro
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-left space-y-3">
                        <p className="text-gray-600">
                          Mes habilitado actualmente: <span className="font-semibold text-blue-700">{obtenerNombreMes(mesHabilitadoCuentaCobro)}</span>
                        </p>
                        <Card className="rounded-xl bg-blue-50 p-3 border-l-4 border-blue-400">
                          <div>
                            <p className="text-sm text-blue-800">
                              <strong>¿Qué puedes hacer?</strong>
                            </p>
                            <ul className="text-sm text-blue-700 mt-2 space-y-1">
                              <li>• Revisar cuentas de cobro del mes actual</li>
                              <li>• Aprobar o rechazar documentos</li>
                              <li>• Generar reportes de facturación</li>
                              <li>• Gestionar proveedores</li>
                            </ul>
                          </div>
                        </Card>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex gap-2">
                      <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleCardClick('/cuenta-cobro')}
                        className="bg-blue-600 hover:bg-blue-700 rounded-xl"
                      >
                        Ir al Módulo
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acciones rápidas */}
        <Card className="rounded-2xl border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Acciones Rápidas</CardTitle>
            <p className="text-sm text-muted-foreground">Accede rápidamente a las funciones más utilizadas</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button 
                className="h-16 flex flex-col gap-2 rounded-xl" 
                variant="outline"
                onClick={() => handleCardClick('/pagos-preparar')}
              >
                <Package className="h-6 w-6" />
                <span>Crear Nuevo Lote</span>
              </Button>
              <Button 
                className="h-16 flex flex-col gap-2 rounded-xl" 
                variant="outline"
                onClick={() => handleCardClick('/cuenta-cobro')}
              >
                <FileText className="h-6 w-6" />
                <span>Generar Reporte</span>
              </Button>
              <Button 
                className="h-16 flex flex-col gap-2 rounded-xl" 
                variant="outline"
                onClick={() => handleCardClick('/prestamos')}
              >
                <CreditCard className="h-6 w-6" />
                <span>Gestionar Préstamos</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Metric 
            icon={DollarSign}
            label="Valor Total Bruto"
            value={new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(resumenFinanciero.totalBruto)}
            sub={`+${resumenFinanciero.variacionMensual}% vs mes anterior`}
            onClick={() => handleCardClick('/pagos-preparar')}
          />
          <Metric 
            icon={TrendingDown}
            label="Total Descuentos"
            value={`-${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(resumenFinanciero.totalDescuentos)}`}
            sub="Retenciones y multas aplicadas"
            onClick={() => handleCardClick('/pagos-procesar')}
          />
          <Metric 
            icon={CheckCircle}
            label="Valor Neto"
            value={new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(resumenFinanciero.totalNeto)}
            sub="Valor final a pagar"
            onClick={() => handleCardClick('/pagados')}
          />
          <Metric 
            icon={CreditCard}
            label="Préstamos Activos"
            value={new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(resumenFinanciero.totalPrestamos)}
            sub="Anticipos y préstamos vigentes"
            onClick={() => handleCardClick('/prestamos')}
          />
        </div>

        {/* Alertas importantes */}
        <Card className="rounded-2xl border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Alertas Importantes</CardTitle>
            <p className="text-sm text-muted-foreground">Situaciones que requieren atención inmediata</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {alertas.map((alerta, index) => {
                const IconComponent = alerta.icono
                return (
                  <Card 
                    key={index} 
                    className={`border-l-4 cursor-pointer hover:shadow-md transition-shadow rounded-2xl ${
                      alerta.tipo === 'warning' ? 'border-l-warning bg-warning/5' :
                      alerta.tipo === 'error' ? 'border-l-destructive bg-destructive/5' :
                      'border-l-blue-500 bg-blue-50/50'
                    }`}
                    onClick={() => handleAlertClick(alerta.tipo)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <IconComponent className={`h-5 w-5 ${
                          alerta.tipo === 'warning' ? 'text-warning' :
                          alerta.tipo === 'error' ? 'text-destructive' :
                          'text-blue-600'
                        }`} />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{alerta.titulo}</h4>
                          <p className="text-xs text-muted-foreground">{alerta.descripcion}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Gráficas principales */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Evolución Mensual */}
          <Card className="rounded-2xl border">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="h-5 w-5" />
                Evolución Mensual de Pagos
              </CardTitle>
              <p className="text-sm text-muted-foreground">Comparativa de valores pagados vs pendientes por mes</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {datosGraficas.porMes.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.mes}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(item.valor)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <Progress 
                      value={(item.pagado / maxValor) * 100} 
                      className="h-2 bg-muted rounded-xl"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Pagado: {new Intl.NumberFormat('es-CO', { notation: 'compact', style: 'currency', currency: 'COP' }).format(item.pagado)}</span>
                      <span>Pendiente: {new Intl.NumberFormat('es-CO', { notation: 'compact', style: 'currency', currency: 'COP' }).format(item.pendiente)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Estado de lotes */}
          <Card className="rounded-2xl border">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <PieChartIcon className="h-5 w-5" />
                Estado de Lotes
              </CardTitle>
              <p className="text-sm text-muted-foreground">Distribución de lotes por estado de procesamiento</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {datosGraficas.porEstado.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-sm text-muted-foreground">{item.value}</span>
                      <span className="text-xs text-muted-foreground">({item.porcentaje}%)</span>
                    </div>
                  </div>
                  <Progress 
                    value={item.porcentaje} 
                    className="h-2 rounded-xl"
                    style={{ 
                      '--progress-foreground': item.color 
                    } as React.CSSProperties}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Estado detallado por módulo */}
        <Card className="rounded-2xl border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Estado por Módulo</CardTitle>
            <p className="text-sm text-muted-foreground">Resumen rápido de cada módulo del sistema</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="rounded-xl border hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleCardClick('/pagos-aprobar')}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="h-5 w-5 text-warning" />
                    <h3 className="font-medium text-sm">Por Aprobar</h3>
                  </div>
                  <div className="text-2xl font-bold text-warning mb-1">{estadoLotes.pendientesAprobacion}</div>
                  <p className="text-xs text-muted-foreground mb-3">Lotes pendientes</p>
                  <Button variant="outline" size="sm" className="w-full rounded-xl">
                    Ver Detalles
                  </Button>
                </CardContent>
              </Card>

              <Card className="rounded-xl border hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleCardClick('/pagos-procesar')}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Package className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium text-sm">En Proceso</h3>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-1">{estadoLotes.enProceso}</div>
                  <p className="text-xs text-muted-foreground mb-3">Lotes en gestión</p>
                  <Button variant="outline" size="sm" className="w-full rounded-xl">
                    Ver Detalles
                  </Button>
                </CardContent>
              </Card>

              <Card className="rounded-xl border hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleCardClick('/lotes-aprobados')}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <h3 className="font-medium text-sm">Aprobados</h3>
                  </div>
                  <div className="text-2xl font-bold text-success mb-1">{estadoLotes.aprobados}</div>
                  <p className="text-xs text-muted-foreground mb-3">Lotes aprobados</p>
                  <Button variant="outline" size="sm" className="w-full rounded-xl">
                    Ver Detalles
                  </Button>
                </CardContent>
              </Card>

              <Card className="rounded-xl border hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleCardClick('/pagados')}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <h3 className="font-medium text-sm">Pagados</h3>
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-1">{estadoLotes.pagados}</div>
                  <p className="text-xs text-muted-foreground mb-3">Lotes pagados</p>
                  <Button variant="outline" size="sm" className="w-full rounded-xl">
                    Ver Detalles
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Servicios de transporte por tipo */}
        <Card className="rounded-2xl border">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Truck className="h-5 w-5" />
              Servicios de Transporte por Tipo
            </CardTitle>
            <p className="text-sm text-muted-foreground">Distribución y rendimiento por categoría de servicio</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {datosGraficas.tiposServicio.map((servicio, index) => (
                <Card key={index} className="rounded-xl border bg-accent/20 hover:bg-accent/30 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{servicio.tipo}</h4>
                      <Badge variant="secondary" className="rounded-md">{servicio.cantidad}</Badge>
                    </div>
                    <p className="text-xl font-bold text-primary">
                      {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(servicio.valor)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Promedio: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(servicio.valor / servicio.cantidad)}
                    </p>
                    <div className="mt-3">
                      <Progress 
                        value={(servicio.valor / Math.max(...datosGraficas.tiposServicio.map(s => s.valor))) * 100} 
                        className="h-2 rounded-xl"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

      </main>

      {/* Modal de confirmación para cambio de mes */}
      <AlertDialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-orange-600">
              <AlertTriangle className="h-5 w-5" />
              Confirmar Cambio de Mes
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left space-y-4">
              <p>Estás a punto de cambiar el mes habilitado para cuentas de cobro:</p>
              <Card className="rounded-xl bg-orange-50 p-4 border border-orange-200">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-orange-800">Mes actual:</span>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-300 rounded-md">
                      {obtenerNombreMes(mesHabilitadoCuentaCobro)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-orange-800">Nuevo mes:</span>
                    <Badge className="bg-orange-600 text-white rounded-md">
                      {obtenerNombreMes(nuevoMesSeleccionado)}
                    </Badge>
                  </div>
                </div>
              </Card>
              <Card className="rounded-xl bg-blue-50 p-3 border-l-4 border-blue-400">
                <div>
                  <p className="text-sm text-blue-800">
                    <strong>Importante:</strong> Al cambiar el mes, los proveedores serán notificados automáticamente y podrán comenzar a generar cuentas de cobro para el nuevo período.
                  </p>
                </div>
              </Card>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setModalAbierto(false)} className="rounded-xl">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmarCambioMes}
              className="bg-orange-600 hover:bg-orange-700 rounded-xl"
            >
              Confirmar Cambio
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}