import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Download, Truck, MapPin, Clock, Calculator, Building2, FileText, Users, Calendar } from "lucide-react"

// Datos de ejemplo de proveedores
const proveedoresData = [
  {
    id: 1,
    nombre: "Transportes Rápidos S.A.S",
    codigo: "PROV001",
    vehiculos: 8,
    prefactura: "2024-01-15",
    valorLiquidado: "$12.500.000",
    estado: "Pendiente Aceptación",
    documentos: {
      rut: true,
      certBancaria: true,
      segSocial: false
    },
    detalleFacturacion: {
      vehiculos: [
        {
          placa: "ABC-123",
          clientes: [
            {
              nombre: "Alpina",
              servicios: 45,
              valorBruto: "$4.500.000",
              gps: "-$50.000",
              examenes: "-$25.000",
              chaqueta: "-$15.000",
              impuestos: "-$270.000",
              valorNeto: "$4.140.000"
            },
            {
              nombre: "Sutherland",
              servicios: 22,
              valorBruto: "$2.200.000",
              gps: "-$25.000",
              examenes: "$0",
              chaqueta: "$0",
              impuestos: "-$132.000",
              valorNeto: "$2.043.000"
            }
          ]
        },
        {
          placa: "DEF-456",
          clientes: [
            {
              nombre: "Sutherland",
              servicios: 38,
              valorBruto: "$3.800.000",
              gps: "-$40.000",
              examenes: "-$25.000",
              chaqueta: "-$15.000",
              impuestos: "-$225.000",
              valorNeto: "$3.495.000"
            }
          ]
        }
      ],
      totalGeneral: "$12.500.000"
    },
    serviciosDetalle: [
      {
        fecha: "31/1/2024",
        hora: "06:00 AM",
        ruta: "Zona Industrial - Alpina Terminal - Planta Alpina",
        usuarios: 25,
        valor: "$120.000",
        estado: "Completado"
      },
      {
        fecha: "31/1/2024",
        hora: "02:00 PM",
        ruta: "Zona Industrial - Alpina Planta Alpina - Terminal",
        usuarios: 23,
        valor: "$120.000",
        estado: "Completado"
      },
      {
        fecha: "1/2/2024",
        hora: "06:30 AM",
        ruta: "Centro Logístico Terminal - Centro Logístico",
        usuarios: 28,
        valor: "$120.000",
        estado: "Completado"
      },
      {
        fecha: "1/2/2024",
        hora: "02:30 PM",
        ruta: "Centro Logístico Centro Logístico - Terminal",
        usuarios: 26,
        valor: "$120.000",
        estado: "Completado"
      },
      {
        fecha: "2/2/2024",
        hora: "06:00 AM",
        ruta: "Zona Industrial - Alpina Terminal - Planta Alpina",
        usuarios: 24,
        valor: "$120.000",
        estado: "Completado"
      }
    ]
  },
  {
    id: 2,
    nombre: "Logística del Valle",
    codigo: "PROV002",
    vehiculos: 5,
    prefactura: "2024-01-14",
    valorLiquidado: "$8.200.000",
    estado: "Aceptada",
    documentos: {
      rut: true,
      certBancaria: true,
      segSocial: true
    },
    detalleFacturacion: {
      vehiculos: [
        {
          placa: "GHI-789",
          clientes: [
            {
              nombre: "Centro Source",
              servicios: 35,
              valorBruto: "$3.500.000",
              gps: "-$35.000",
              examenes: "-$20.000",
              chaqueta: "-$10.000",
              impuestos: "-$210.000",
              valorNeto: "$3.225.000"
            }
          ]
        }
      ],
      totalGeneral: "$8.200.000"
    }
  },
  {
    id: 3,
    nombre: "Cargo Express Ltda",
    codigo: "PROV003",
    vehiculos: 12,
    prefactura: "2024-01-12",
    valorLiquidado: "$18.900.000",
    estado: "Rechazada",
    motivoRechazo: "Tarifa incorrecta en vehículo VH-456",
    documentos: {
      rut: true,
      certBancaria: false,
      segSocial: false
    },
    detalleFacturacion: {
      vehiculos: [
        {
          placa: "JKL-012",
          clientes: [
            {
              nombre: "Alpina",
              servicios: 52,
              valorBruto: "$5.200.000",
              gps: "-$55.000",
              examenes: "-$30.000",
              chaqueta: "-$20.000",
              impuestos: "-$312.000",
              valorNeto: "$4.783.000"
            }
          ]
        }
      ],
      totalGeneral: "$18.900.000"
    }
  }
]

export default function CuentaCobroProveedor() {
  const [selectedProveedor, setSelectedProveedor] = useState<any>(null)
  const [showDetalleModal, setShowDetalleModal] = useState(false)
  const [showServiciosModal, setShowServiciosModal] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("vehiculo")

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Pendiente Aceptación":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Pendiente Aceptación</Badge>
      case "Aceptada":
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Aceptada</Badge>
      case "Rechazada":
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Rechazada</Badge>
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  const verDetalle = (proveedor: any) => {
    setSelectedProveedor(proveedor)
    setShowDetalleModal(true)
  }

  const verServicios = (cliente: any) => {
    setSelectedCliente(cliente)
    setShowServiciosModal(true)
  }

  const notificarProveedor = (proveedorId: number) => {
    console.log(`Notificando proveedor ${proveedorId}`)
  }

  const subirSegSocial = (proveedorId: number) => {
    console.log(`Subir seguridad social para proveedor ${proveedorId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Proveedores - Liquidación de Servicios</h1>
          <p className="text-muted-foreground">
            Gestión de prefacturas y cuentas de cobro por proveedor
          </p>
        </div>
      </div>

      {/* Tabs de filtros */}
      <Tabs defaultValue="todos" className="w-full">
        <TabsList>
          <TabsTrigger value="todos">Todos los Proveedores</TabsTrigger>
          <TabsTrigger value="pendientes">Pendientes (1)</TabsTrigger>
          <TabsTrigger value="aceptadas">Aceptadas (1)</TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="space-y-4">
          {proveedoresData.map((proveedor) => (
            <Card key={proveedor.id} className="w-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{proveedor.nombre}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Código: {proveedor.codigo} • {proveedor.vehiculos} vehículos • Prefactura: {proveedor.prefactura}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {getEstadoBadge(proveedor.estado)}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Valor Liquidado:</p>
                    <p className="text-2xl font-bold text-primary">{proveedor.valorLiquidado}</p>
                  </div>
                </div>

                {/* Documentos */}
                <div>
                  <p className="text-sm font-medium mb-2">Documentos:</p>
                  <div className="flex gap-2">
                    {proveedor.documentos.rut && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">✓ RUT</Badge>
                    )}
                    {proveedor.documentos.certBancaria && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">✓ Cert. Bancaria</Badge>
                    )}
                    {proveedor.documentos.segSocial ? (
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">✓ Seg. Social</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">✗ Seg. Social</Badge>
                    )}
                  </div>
                </div>

                {/* Motivo de rechazo si aplica */}
                {proveedor.motivoRechazo && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-700">
                      <strong>Motivo de rechazo:</strong> {proveedor.motivoRechazo}
                    </p>
                  </div>
                )}

                {/* Botones de acción */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => verDetalle(proveedor)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalle
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Revisar Servicios
                  </Button>
                  
                  <Button variant="outline" size="sm" onClick={() => notificarProveedor(proveedor.id)}>
                    <Users className="h-4 w-4 mr-2" />
                    Notificar Proveedor
                  </Button>
                  
                  {proveedor.nombre !== "Transportes Rápidos S.A.S" && (
                    <Button variant="outline" size="sm" onClick={() => subirSegSocial(proveedor.id)}>
                      <FileText className="h-4 w-4 mr-2" />
                      Subir Seg. Social
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pendientes" className="space-y-4">
          {proveedoresData.filter(p => p.estado === "Pendiente Aceptación").map((proveedor) => (
            <Card key={proveedor.id} className="w-full">
              {/* Mismo contenido que en "todos" */}
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="aceptadas" className="space-y-4">
          {proveedoresData.filter(p => p.estado === "Aceptada").map((proveedor) => (
            <Card key={proveedor.id} className="w-full">
              {/* Mismo contenido que en "todos" */}
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Modal de Detalle de Facturación */}
      <Dialog open={showDetalleModal} onOpenChange={setShowDetalleModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Detalle de Facturación - {selectedProveedor?.nombre}
            </DialogTitle>
          </DialogHeader>

          {selectedProveedor && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="vehiculo">Por Vehículo</TabsTrigger>
                <TabsTrigger value="cliente">Por Cliente</TabsTrigger>
              </TabsList>

              <TabsContent value="vehiculo" className="space-y-6">
                {selectedProveedor.detalleFacturacion.vehiculos.map((vehiculo: any, index: number) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <Truck className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Vehículo {vehiculo.placa}</h3>
                    </div>
                    
                    {vehiculo.clientes.map((cliente: any, clienteIndex: number) => (
                      <Card key={clienteIndex} className="border-l-4 border-l-primary">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4" />
                              <CardTitle className="text-base">{cliente.nombre}</CardTitle>
                            </div>
                            <Button 
                              variant="link" 
                              size="sm"
                              onClick={() => verServicios(cliente)}
                              className="text-primary hover:text-primary/80"
                            >
                              {cliente.servicios} servicios
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-4 gap-4 text-center">
                            <div>
                              <p className="text-sm text-muted-foreground">Valor Bruto</p>
                              <p className="font-semibold text-green-600">{cliente.valorBruto}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">GPS</p>
                              <p className="font-semibold text-red-600">{cliente.gps}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Exámenes</p>
                              <p className="font-semibold text-red-600">{cliente.examenes}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Chaqueta</p>
                              <p className="font-semibold text-red-600">{cliente.chaqueta}</p>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm text-muted-foreground">Impuestos (6%)</p>
                                <p className="font-semibold text-red-600">{cliente.impuestos}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Valor Neto</p>
                                <p className="text-xl font-bold text-primary">{cliente.valorNeto}</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ))}

                <div className="flex justify-between items-center pt-4 border-t-2 border-primary">
                  <div>
                    <p className="text-lg font-semibold">Total General</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{selectedProveedor.detalleFacturacion.totalGeneral}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Descargar Detalle
                    </Button>
                    <Button size="sm">Cerrar</Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="cliente" className="space-y-6">
                {selectedProveedor.detalleFacturacion.vehiculos.map((vehiculo: any, index: number) => (
                  <div key={index} className="space-y-4">
                    {vehiculo.clientes.map((cliente: any, clienteIndex: number) => (
                      <Card key={clienteIndex} className="border-l-4 border-l-primary">
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            <CardTitle>{cliente.nombre}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-4 gap-6 text-center">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <Calculator className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                              <p className="text-2xl font-bold text-blue-600">{cliente.servicios}</p>
                              <p className="text-sm text-blue-600">Servicios</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                              <Calculator className="h-8 w-8 text-green-600 mx-auto mb-2" />
                              <p className="text-2xl font-bold text-green-600">{cliente.valorBruto}</p>
                              <p className="text-sm text-green-600">Valor Bruto</p>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg">
                              <Calculator className="h-8 w-8 text-red-600 mx-auto mb-2" />
                              <p className="text-2xl font-bold text-red-600">{cliente.examenes}</p>
                              <p className="text-sm text-red-600">Descuentos</p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <Calculator className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                              <p className="text-2xl font-bold text-blue-600">{cliente.valorNeto}</p>
                              <p className="text-sm text-blue-600">Valor Neto</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Detalle de Servicios */}
      <Dialog open={showServiciosModal} onOpenChange={setShowServiciosModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Detalle de Servicios - {selectedCliente?.nombre}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Vehículo ABC-123 • {selectedCliente?.servicios} servicios registrados
            </p>
          </DialogHeader>

          {selectedCliente && (
            <div className="space-y-6">
              {/* Tarjetas de resumen */}
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">5</p>
                    <p className="text-sm text-blue-600">Total Servicios</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">126</p>
                    <p className="text-sm text-blue-600">Usuarios Total</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">25</p>
                    <p className="text-sm text-green-600">Promedio Usuarios</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Calculator className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">$600.000</p>
                    <p className="text-sm text-blue-600">Valor Total</p>
                  </CardContent>
                </Card>
              </div>

              {/* Tabla de servicios detallados */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Registro Detallado de Servicios
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">Fecha</th>
                          <th className="text-left p-3">Hora</th>
                          <th className="text-left p-3">Localidad/Ruta</th>
                          <th className="text-left p-3">Usuarios</th>
                          <th className="text-left p-3">Valor</th>
                          <th className="text-left p-3">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedProveedor?.serviciosDetalle.map((servicio: any, index: number) => (
                          <tr key={index} className="border-b hover:bg-muted/50">
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                {servicio.fecha}
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                {servicio.hora}
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">{servicio.ruta.split(" - ")[0]}</p>
                                  <p className="text-sm text-muted-foreground">{servicio.ruta.split(" - ")[1]}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                {servicio.usuarios}
                              </div>
                            </td>
                            <td className="p-3 font-semibold text-primary">{servicio.valor}</td>
                            <td className="p-3">
                              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                                {servicio.estado}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    Mostrando 5 de {selectedCliente?.servicios} servicios
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={() => setShowServiciosModal(false)}>Cerrar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}