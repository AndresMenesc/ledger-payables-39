import PrestamosManager from "@/components/PrestamosManager"

export default function Prestamos() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Gestión de Préstamos</h1>
        <p className="text-muted-foreground">Administra préstamos y anticipos para servicios de viaje</p>
      </div>
      
      <PrestamosManager />
    </div>
  )
}