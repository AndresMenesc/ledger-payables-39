import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Building2, Calendar, DollarSign } from "lucide-react"

export default function CuentaCobro() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Módulo de Cuenta de Cobro</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Gestión completa de cuentas de cobro de proveedores</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <CardTitle className="text-base sm:text-lg">Crear Cuenta</CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground">Nueva cuenta de cobro</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs sm:text-sm">Registra una nueva cuenta de cobro de proveedor con todos sus servicios asociados.</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-success flex-shrink-0" />
              <div className="min-w-0">
                <CardTitle className="text-base sm:text-lg">Proveedores</CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground">Gestión de proveedores</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs sm:text-sm">Administra la información de proveedores y sus datos de facturación.</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-warning flex-shrink-0" />
              <div className="min-w-0">
                <CardTitle className="text-base sm:text-lg">Historial</CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground">Consulta histórica</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs sm:text-sm">Revisa el historial completo de cuentas de cobro por período y proveedor.</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-pending flex-shrink-0" />
              <div className="min-w-0">
                <CardTitle className="text-base sm:text-lg">Reportes</CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground">Informes financieros</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs sm:text-sm">Genera reportes detallados de facturación y análisis de gastos.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Funcionalidades del Módulo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-sm sm:text-base">Gestión de Cuentas</h3>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Creación y edición de cuentas de cobro
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Asociación de múltiples servicios por cuenta
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Validación automática de montos y datos
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Control de estados y aprobaciones
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3 text-sm sm:text-base">Integración con Pagos</h3>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  Flujo automático hacia módulo de pagos
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  Trazabilidad completa del proceso
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  Notificaciones y alertas automáticas
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  Reportería integrada con contabilidad
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}