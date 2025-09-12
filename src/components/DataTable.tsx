import { useState } from "react"
import { ChevronDown, ChevronUp, Search, Filter, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface Column {
  key: string
  label: string
  sortable?: boolean
  className?: string
}

interface DataTableProps {
  title: string
  columns: Column[]
  data: any[]
  searchable?: boolean
  filterable?: boolean
  exportable?: boolean
  actions?: (row: any) => React.ReactNode
  renderCell?: (key: string, value: any, row: any) => React.ReactNode
  summary?: React.ReactNode
  statusFilter?: boolean
  onStatusFilterChange?: (status: string) => void
}

export function DataTable({
  title,
  columns,
  data,
  searchable = true,
  filterable = true,
  exportable = true,
  actions,
  renderCell,
  summary,
  statusFilter = false,
  onStatusFilterChange
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleSort = (key: string) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig?.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const filteredData = data.filter(item =>
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const sortedData = sortConfig
    ? [...filteredData].sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    : filteredData

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(sortedData.length / itemsPerPage)

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pendiente': { variant: 'pending-light' as const, text: 'Pendiente' },
      'aprobado': { variant: 'success-light' as const, text: 'Aprobado' },
      'rechazado': { variant: 'destructive' as const, text: 'Rechazado' },
      'pagado': { variant: 'success' as const, text: 'Pagado' },
      'en_proceso': { variant: 'warning-light' as const, text: 'En Proceso' },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline' as const, text: status }
    return <Badge variant={config.variant}>{config.text}</Badge>
  }

  const defaultRenderCell = (key: string, value: any, row: any) => {
    if (key === 'estado' || key === 'status') {
      return getStatusBadge(value)
    }
    if (key.includes('valor') || key.includes('total') || key.includes('monto')) {
      return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value)
    }
    if (key.includes('fecha')) {
      return new Date(value).toLocaleDateString('es-CO')
    }
    return value
  }

  return (
    <Card className="rounded-2xl border">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Gestiona y visualiza todas las cuentas de cobro del sistema</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            {searchable && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64 border-input bg-background text-foreground placeholder:text-muted-foreground rounded-xl"
                />
              </div>
            )}
            
            <div className="flex gap-2">
              {statusFilter && (
                <select 
                  className="px-3 py-1.5 text-sm border border-input bg-background text-foreground rounded-xl focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onChange={(e) => onStatusFilterChange?.(e.target.value)}
                >
                  <option value="todos">Todos los estados</option>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              )}
              
              {filterable && (
                <Button variant="outline" size="sm" className="rounded-xl">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              )}
              
              {exportable && (
                <Button variant="outline" size="sm" className="rounded-xl">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {summary && (
          <div className="mt-4">
            {summary}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <Separator className="my-4" />
        
        <div className="overflow-x-auto">
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/30">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={cn(
                        "text-left py-4 px-4 font-semibold text-muted-foreground text-sm uppercase tracking-wide",
                        column.sortable && "cursor-pointer hover:text-foreground transition-colors",
                        column.className
                      )}
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {column.sortable && (
                        <div className="flex flex-col">
                          <ChevronUp 
                            className={cn(
                              "h-3 w-3",
                              sortConfig?.key === column.key && sortConfig.direction === 'asc'
                                ? "text-primary" 
                                : "text-muted-foreground/50"
                            )} 
                          />
                          <ChevronDown 
                            className={cn(
                              "h-3 w-3 -mt-1",
                              sortConfig?.key === column.key && sortConfig.direction === 'desc'
                                ? "text-primary" 
                                : "text-muted-foreground/50"
                            )} 
                          />
                        </div>
                      )}
                    </div>
                  </th>
                ))}
                  {actions && (
                    <th className="text-left py-4 px-4 font-semibold text-muted-foreground text-sm uppercase tracking-wide">
                      Acciones
                    </th>
                  )}
                </tr>
              </thead>
              
              <tbody>
                 {paginatedData.map((row, index) => (
                   <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors group">
                     {columns.map((column) => (
                       <td key={column.key} className={cn("py-6 px-4 text-card-foreground font-medium", column.className)}>
                         {renderCell 
                           ? renderCell(column.key, row[column.key], row)
                           : defaultRenderCell(column.key, row[column.key], row)
                         }
                       </td>
                     ))}
                     {actions && (
                       <td className="py-6 px-4">
                         <div className="flex items-center gap-2">
                           {actions(row)}
                         </div>
                       </td>
                     )}
                   </tr>
                 ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, sortedData.length)} de {sortedData.length} resultados
            </p>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i
                  if (page > totalPages) return null
                  
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className="rounded-xl"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  )
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}