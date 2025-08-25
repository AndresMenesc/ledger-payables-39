import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import PagosPorPreparar from "./pages/PagosPorPreparar";
import PagosPorProcesar from "./pages/PagosPorProcesar";
import PagosPorAprobar from "./pages/PagosPorAprobar";
import Pagados from "./pages/Pagados";
import SinLote from "./pages/SinLote";
import LotesAprobados from "./pages/LotesAprobados";
import CuentaCobro from "./pages/CuentaCobro";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<PagosPorPreparar />} />
            <Route path="pagos-preparar" element={<PagosPorPreparar />} />
            <Route path="pagos-procesar" element={<PagosPorProcesar />} />
            <Route path="pagos-aprobar" element={<PagosPorAprobar />} />
            <Route path="pagados" element={<Pagados />} />
            <Route path="sin-lote" element={<SinLote />} />
            <Route path="lotes-aprobados" element={<LotesAprobados />} />
            <Route path="cuenta-cobro" element={<CuentaCobro />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
