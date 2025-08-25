import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Dashboard from "./pages/Index";
import PagosPorPreparar from "./pages/PagosPorPreparar";
import PagosPorProcesar from "./pages/PagosPorProcesar";
import PagosPorAprobar from "./pages/PagosPorAprobar";
import Pagados from "./pages/Pagados";
import SinLote from "./pages/SinLote";
import LotesAprobados from "./pages/LotesAprobados";
import CuentaCobro from "./pages/CuentaCobro";
import Prestamos from "./pages/Prestamos";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              {/* Header Global */}
              <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 flex items-center px-4">
                <SidebarTrigger className="mr-4" />
                <div className="flex items-center gap-2">
                  <h1 className="font-semibold text-lg">Sistema de Gestión de Transportes</h1>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Sistema Activo</span>
                </div>
              </header>
              
              {/* Main Content */}
              <main className="flex-1 overflow-y-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="pagos-preparar" element={<PagosPorPreparar />} />
                  <Route path="pagos-procesar" element={<PagosPorProcesar />} />
                  <Route path="pagos-aprobar" element={<PagosPorAprobar />} />
                  <Route path="pagados" element={<Pagados />} />
                  <Route path="sin-lote" element={<SinLote />} />
                  <Route path="lotes-aprobados" element={<LotesAprobados />} />
                  <Route path="cuenta-cobro" element={<CuentaCobro />} />
                  <Route path="prestamos" element={<Prestamos />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;