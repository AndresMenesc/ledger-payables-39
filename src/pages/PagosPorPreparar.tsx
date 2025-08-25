import { useState } from "react"
import { Eye, CheckCircle, XCircle, AlertTriangle, Calendar, Building2, MapPin, Clock, Truck } from "lucide-react"
import { DataTable } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Datos de ejemplo - Servicios de Transporte
const cuentasCobro = [
  {
    id: 1,
    numero: "CC-2024-001",
    proveedor: "TRANSPORTES BOGOTÁ EXPRESS S.A.S",
    fecha_recepcion: "2024-01-15",
    fecha_vencimiento: "2024-02-15",
    valor_total: 2500000,
    estado: "pendiente",
    servicios: [
      { 
        descripcion: "Transporte ejecutivo Bogotá-Medellín", 
        valor: 1800000, 
        estado: "pendiente",
        tipoServicio: "transporte_ejecutivo",
        origen: "Bogotá",
        destino: "Medellín", 
        fecha: "2024-01-10",
        hora: "06:00",
        pasajeros: "Carlos Rodríguez, Ana Gómez",
        vehiculo: "Toyota Prado 2023 - ABC123",
        distancia: "415 km",
        duracion: "8 horas"
      },
      { 
        descripcion: "Servicio de regreso Medellín-Bogotá", 
        valor: 700000, 
        estado: "pendiente",
        tipoServicio: "transporte_ejecutivo",
        origen: "Medellín",
        destino: "Bogotá", 
        fecha: "2024-01-12",
        hora: "14:00",
        pasajeros: "Carlos Rodríguez, Ana Gómez",
        vehiculo: "Toyota Prado 2023 - ABC123",
        distancia: "415 km",
        duracion: "8 horas"
      }
    ]
  },
  {
    id: 2,
    numero: "CC-2024-002",
    proveedor: "FLOTA NACIONAL DE CARGA LTDA",
    fecha_recepcion: "2024-01-16",
    fecha_vencimiento: "2024-02-16",
    valor_total: 3200000,
    estado: "en_proceso",
    servicios: [
      { 
        descripcion: "Transporte de carga Bogotá-Cali", 
        valor: 3200000, 
        estado: "aprobado",
        tipoServicio: "carga",
        origen: "Bogotá",
        destino: "Cali", 
        fecha: "2024-01-14",
        hora: "22:00",
        carga: "Equipos industriales - 15 toneladas",
        vehiculo: "Camión Volvo FH 2022 - XYZ789",
        distancia: "465 km",
        duracion: "12 horas"
      }
    ]
  },
  {
    id: 3,
    numero: "CC-2024-003",
    proveedor: "SERVITAXIS EMPRESARIALES SAS",
    fecha_recepcion: "2024-01-17",
    fecha_vencimiento: "2024-02-17",
    valor_total: 850000,
    estado: "rechazado",
    servicios: [
      { 
        descripcion: "Servicios de taxi corporativo", 
        valor: 450000, 
        estado: "rechazado",
        tipoServicio: "taxi_corporativo",
        origen: "Zona Rosa",
        destino: "Aeropuerto El Dorado", 
        fecha: "2024-01-15",
        hora: "04:30",
        pasajeros: "Director Comercial",
        vehiculo: "Chevrolet Spark GT 2023 - DEF456",
        observaciones: "Tarifa excede el límite establecido"
      },
      { 
        descripcion: "Transporte aeropuerto-hotel", 
        valor: 400000, 
        estado: "pendiente",
        tipoServicio: "taxi_corporativo",
        origen: "Aeropuerto El Dorado",
        destino: "Hotel Tequendama", 
        fecha: "2024-01-15",
        hora: "23:45",
        pasajeros: "Visitante internacional",
        vehiculo: "Chevrolet Spark GT 2023 - DEF456"
      }
    ]
  }
]

const columns = [
  { key: "numero", label: "No. Cuenta", sortable: true },
  { key: "proveedor", label: "Proveedor", sortable: true },
  { key: "fecha_recepcion", label: "Fecha Recepción", sortable: true },
  { key: "fecha_vencimiento", label: "Vencimiento", sortable: true },
  { key: "valor_total", label: "Valor Total", sortable: true },
  { key: "estado", label: "Estado", sortable: true }
]

export default function PagosPorPreparar() {
  const [selectedCuenta, setSelectedCuenta] = useState<any>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [mesSeleccionado, setMesSeleccionado] = useState("2024-01")
  
  const filteredData = cuentasCobro.filter(cuenta => {
    const fechaMes = cuenta.fecha_recepcion.substring(0, 7)
    return fechaMes === mesSeleccionado
  })

  const totalPorEstado = {
    pendiente: filteredData.filter(c => c.estado === 'pendiente').reduce((sum, c) => sum + c.valor_total, 0),
    en_proceso: filteredData.filter(c => c.estado === 'en_proceso').reduce((sum, c) => sum + c.valor_total, 0),
    rechazado: filteredData.filter(c => c.estado === 'rechazado').reduce((sum, c) => sum + c.valor_total, 0)
  }

  const handleApproveService = (cuentaId: number, serviceIndex: number) => {
    // Implementar lógica de aprobación
    console.log(`Aprobar servicio ${serviceIndex} de cuenta ${cuentaId}`)
  }

  const handleRejectService = (cuentaId: number, serviceIndex: number) => {
    // Implementar lógica de rechazo
    console.log(`Rechazar servicio ${serviceIndex} de cuenta ${cuentaId}`)
  }

  const handleSendForApproval = (cuentaId: number) => {
    // Implementar lógica para enviar para aprobación
    console.log(`Enviar cuenta ${cuentaId} para aprobación`)
  }

  const handleRejectCuenta = (cuentaId: number) => {
    // Implementar lógica para rechazar cuenta
    console.log(`Rechazar cuenta ${cuentaId}`)
  }

  const actions = (row: any) => (
    <Button 
      variant="outline" 
      size="sm"
      onClick={() => {
        setSelectedCuenta(row)
        setShowDetail(true)
      }}
    >
      <Eye className="h-4 w-4 mr-2" />
      Ver Servicios
    </Button>
  )

  if (showDetail && selectedCuenta) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowDetail(false)}
            >
              ← Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Servicios de Transporte</h1>
              <p className="text-muted-foreground">
                Cuenta: {selectedCuenta.numero} - {selectedCuenta.proveedor}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="success"
              onClick={() => handleSendForApproval(selectedCuenta.id)}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Enviar para Aprobación
            </Button>
            <Button 
              variant="destructive"
              onClick={() => handleRejectCuenta(selectedCuenta.id)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Rechazar Cuenta
            </Button>
          </div>
        </div>

        {/* Información General de la Cuenta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Información General
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Proveedor</p>
              <p className="font-medium">{selectedCuenta.proveedor}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estado</p>
              <Badge variant={
                selectedCuenta.estado === 'pendiente' ? 'pending-light' :
                selectedCuenta.estado === 'aprobado' ? 'success-light' :
                selectedCuenta.estado === 'en_proceso' ? 'warning-light' : 'destructive'
              }>
                {selectedCuenta.estado === 'pendiente' ? 'Pendiente' :
                 selectedCuenta.estado === 'aprobado' ? 'Aprobado' :
                 selectedCuenta.estado === 'en_proceso' ? 'En Proceso' : 'Rechazado'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fecha Recepción</p>
              <p className="font-medium">{new Date(selectedCuenta.fecha_recepcion).toLocaleDateString('es-CO')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valor Total</p>
              <p className="text-lg font-bold text-primary">
                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedCuenta.valor_total)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Listado de Servicios */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Servicios Asociados</h2>
          
          {selectedCuenta.servicios.map((servicio: any, index: number) => (
            <Card key={index} className="border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Truck className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">{servicio.descripcion}</h3>
                      <Badge variant={
                        servicio.estado === 'pendiente' ? 'pending-light' :
                        servicio.estado === 'aprobado' ? 'success-light' : 'destructive'
                      }>
                        {servicio.estado === 'pendiente' ? 'Pendiente' :
                         servicio.estado === 'aprobado' ? 'Aprobado' : 'Rechazado'}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold text-primary mb-4">
                      {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(servicio.valor)}
                    </p>
                  </div>
                  
                  {servicio.estado === 'pendiente' && (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="success"
                        onClick={() => handleApproveService(selectedCuenta.id, index)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aprobar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleRejectService(selectedCuenta.id, index)}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rechazar
                      </Button>
                      <Button size="sm" variant="warning">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Corregir
                      </Button>
                    </div>
                  )}
                </div>

                {/* Detalles del Viaje */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/30 p-4 rounded-lg">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Ruta</p>
                        <p className="font-medium">{servicio.origen} → {servicio.destino}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Fecha y Hora</p>
                        <p className="font-medium">{servicio.fecha} - {servicio.hora}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {servicio.pasajeros && (
                      <div>
                        <p className="text-xs text-muted-foreground">Pasajeros</p>
                        <p className="font-medium">{servicio.pasajeros}</p>
                      </div>
                    )}
                    
                    {servicio.carga && (
                      <div>
                        <p className="text-xs text-muted-foreground">Carga</p>
                        <p className="font-medium">{servicio.carga}</p>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-xs text-muted-foreground">Vehículo</p>
                      <p className="font-medium">{servicio.vehiculo}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Distancia</p>
                      <p className="font-medium">{servicio.distancia}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-muted-foreground">Duración</p>
                      <p className="font-medium">{servicio.duracion}</p>
                    </div>
                    
                    {servicio.observaciones && (
                      <div>
                        <p className="text-xs text-muted-foreground">Observaciones</p>
                        <p className="font-medium text-destructive">{servicio.observaciones}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const summary = (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Mes Seleccionado</p>
              <Select value={mesSeleccionado} onValueChange={setMesSeleccionado}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-01">Enero 2024</SelectItem>
                  <SelectItem value="2024-02">Febrero 2024</SelectItem>
                  <SelectItem value="2024-03">Marzo 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Pendientes</p>
          <p className="text-xl font-semibold text-pending">
            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(totalPorEstado.pendiente)}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">En Proceso</p>
          <p className="text-xl font-semibold text-warning">
            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(totalPorEstado.en_proceso)}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Rechazadas</p>
          <p className="text-xl font-semibold text-destructive">
            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(totalPorEstado.rechazado)}
          </p>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Servicios de Transporte - Pagos por Preparar</h1>
        <p className="text-muted-foreground">Gestiona las cuentas de cobro de servicios de transporte enviadas por los proveedores</p>
      </div>

      <DataTable
        title="Cuentas de Cobro - Servicios de Transporte"
        columns={columns}
        data={filteredData}
        actions={actions}
        summary={summary}
      />
    </div>
  )
}