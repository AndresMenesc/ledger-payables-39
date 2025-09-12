import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Download,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  List,
  LayoutGrid,
} from "lucide-react";

// ---------------- Helpers ----------------
const toneFromStatus = (status: string): "success" | "danger" | "warning" => {
  const s = status.toLowerCase();
  if (s.includes("vigente") || s.includes("ok")) return "success";
  if (s.includes("por vencer")) return "warning";
  return "danger";
};

const dotClass = (status: string) => {
  const t = toneFromStatus(status);
  return t === "success" ? "bg-emerald-600" : t === "warning" ? "bg-amber-500" : "bg-rose-600";
};

const statusBadge = (s: string) =>
  toneFromStatus(s) === "success"
    ? "bg-green-600 text-white"
    : toneFromStatus(s) === "warning"
    ? "bg-amber-500 text-white"
    : "bg-red-600 text-white";


// ---------------- Data ----------------
interface Documento { label: string; fecha: string; status: string }
interface Conductor {
  nombre: string;
  proveedor: string;
  estado: "Activo" | "Inactivo";
  bloqueado: boolean; // true => presently blocked
  cedula: string;
  telefono: string;
  documentos?: Documento[];
  lastAccess: string;
}

const conductoresSeed: Conductor[] = [
  {
    nombre: "Juan Carlos Pérez",
    proveedor: "Transportes del Valle",
    estado: "Activo",
    bloqueado: false,
    cedula: "12345678",
    telefono: "+57 300 123 4567",
    documentos: [
      { label: "Seguridad Social", fecha: "29/06/2025", status: "Vencido" },
      { label: "Licencia de Conducción", fecha: "30/12/2025", status: "Vigente" },
      { label: "Exámenes Psicosensométricos", fecha: "14/12/2024", status: "Vencido" },
    ],
    lastAccess: "2024-01-14 10:30:00",
  },
  {
    nombre: "María José García",
    proveedor: "Logística Andina",
    estado: "Inactivo",
    bloqueado: true,
    cedula: "87654321",
    telefono: "+57 315 987 6543",
    documentos: [
      { label: "Seguridad Social", fecha: "19/11/2024", status: "Vencido" },
      { label: "Licencia de Conducción", fecha: "14/06/2026", status: "Vigente" },
      { label: "Exámenes Psicosensométricos", fecha: "09/09/2024", status: "Vencido" },
    ],
    lastAccess: "2024-01-19 08:15:00",
  },
  {
    nombre: "Carlos Andrés Rodríguez",
    proveedor: "Rápido Express",
    estado: "Activo",
    bloqueado: false,
    cedula: "11223344",
    telefono: "+57 301 555 7890",
    documentos: [
      { label: "Seguridad Social", fecha: "14/03/2025", status: "Vencido" },
      { label: "Licencia de Conducción", fecha: "29/09/2025", status: "Vigente" },
      { label: "Exámenes Psicosensométricos", fecha: "21/08/2024", status: "Vencido" },
    ],
    lastAccess: "2024-01-13 16:20:00",
  },
];

// ---------------- Page ----------------
export default function ConductoresPage() {
  const [view, setView] = useState<"list" | "cards">("list");
  const conductores = conductoresSeed;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header + CTAs */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-6 pb-0">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Gestión de Conductores</h1>
          <p className="text-sm text-muted-foreground">Administra perfiles, documentos y estado</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={view === "list" ? "secondary" : "outline"} size="sm" className="rounded-xl" onClick={() => setView("list")}>
            <List className="h-4 w-4 mr-1"/> Lista
          </Button>
          <Button variant={view === "cards" ? "secondary" : "outline"} size="sm" className="rounded-xl" onClick={() => setView("cards")}>
            <LayoutGrid className="h-4 w-4 mr-1"/> Tarjetas
          </Button>
          <Button className="rounded-xl"><Plus className="h-4 w-4 mr-2"/>Nuevo Conductor</Button>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {view === "list" ? (
            <Card className="rounded-2xl border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Lista de Conductores</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Toolbar */}
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar..." className="pl-9 rounded-xl" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Tabs defaultValue="all" className="hidden sm:block">
                      <TabsList className="rounded-xl">
                        <TabsTrigger value="all">Todos los estados</TabsTrigger>
                        <TabsTrigger value="active">Activos</TabsTrigger>
                        <TabsTrigger value="inactive">Inactivos</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <Button variant="outline" className="rounded-xl"><Filter className="h-4 w-4 mr-2"/>Filtros</Button>
                    <Button variant="outline" className="rounded-xl"><Download className="h-4 w-4 mr-2"/>Exportar</Button>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Table */}
                <div className="rounded-xl border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Conductor</TableHead>
                        <TableHead>Seguridad Social</TableHead>
                        <TableHead>Licencia de Conducción</TableHead>
                        <TableHead>Exámenes Psicosensométricos</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {conductores.map((c, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <div className="font-medium">{c.nombre}</div>
                            <div className="text-xs text-muted-foreground">{c.proveedor}</div>
                            <div className="text-[11px] text-muted-foreground">Último acceso: {c.lastAccess}</div>
                          </TableCell>
                          {(c.documentos ?? []).map((doc, j) => (
                            <TableCell key={j}>
                              <div className="flex flex-col text-xs items-start">
                                <span>{doc.fecha}</span>
                                <Badge className={`rounded-md mt-1 ${statusBadge(doc.status)}`}>{doc.status}</Badge>
                              </div>
                            </TableCell>
                          ))}
                          <TableCell>
                            <Badge className={`rounded-md ${c.estado === "Activo" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>{c.estado}</Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4"/></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-xl">
                                {c.bloqueado ? (
                                  <DropdownMenuItem>Desbloquear</DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem>Bloquear</DropdownMenuItem>
                                )}
                                <DropdownMenuItem>Editar</DropdownMenuItem>
                                <DropdownMenuItem>Actualizar Documentos</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Eliminar</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {conductores.map((c, i) => (
                <Card key={i} className="rounded-2xl border">
                  {/* Header bar like Vehículos */}
                  <div className="bg-muted/60 rounded-t-2xl p-3 flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{c.nombre}</div>
                      <div className="text-xs text-muted-foreground truncate">{c.proveedor}</div>
                      <div className="text-[11px] text-muted-foreground">Último acceso: {c.lastAccess}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={c.estado === "Activo" ? "bg-green-600 text-white" : "bg-red-600 text-white"}>{c.estado}</Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4"/></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          {c.bloqueado ? (
                            <DropdownMenuItem>Desbloquear</DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>Bloquear</DropdownMenuItem>
                          )}
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Actualizar Documentos</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Eliminar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    {/* Documents grid like vehicle */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {(c.documentos ?? []).map((doc, j) => (
                        <div key={j} className="rounded-xl border p-2 bg-background">
                          <div className={`text-sm font-medium ${toneFromStatus(doc.status) === "success" ? "text-emerald-600" : toneFromStatus(doc.status) === "warning" ? "text-amber-600" : "text-rose-600"}`}>{doc.label}</div>
                          <div className="text-[11px] text-muted-foreground">{doc.fecha}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
      </main>
    </div>
  );
}