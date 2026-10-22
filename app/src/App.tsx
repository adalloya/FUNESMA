"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Flame, Users, Calculator, Layers, Box, QrCode, Plus, ArrowRight, ArrowLeft,
  AlertTriangle, Download, Scale, Thermometer, Database, Settings, Upload,
  MessageSquare, Copy, Check, Search, ShieldCheck, PhoneCall, CheckCircle2,
  Trash2, RefreshCw, X, FileCheck, ExternalLink, MoreVertical, Menu, Filter,
  ChevronDown, ChevronUp
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from "recharts";
import * as THREE from "three";
import { STLLoader } from "three-stdlib";
import solver from "javascript-lp-solver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { QRCodeSVG } from "qrcode.react";
import { supabase, isSupabaseConfigured } from "./supabaseClient";

// ============================================================================
// 1. TIPOS, TABLA DE PRECIOS OFICIAL DEL EXCEL FUNESMA Y CATÁLOGOS
// ============================================================================

export type Role = "super_admin" | "jefe_planta" | "operador" | "almacen" | "ventas";
export type StageId = "modelaje" | "moldeo" | "fusion" | "limpieza" | "maquinado" | "calidad";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  active: boolean;
  shift?: string;
}

export interface BronzePricingRow {
  id: string;
  name: string;
  rowColor: string;
  textColor: string;
  minPriceKg: number;
  suggestedPriceKg: number;
  description: string;
}

// Tabla exacta replicada del Excel Oficial de FUNESMA con UX limpia y alineada
export const FUNESMA_BRONZE_TABLE: BronzePricingRow[] = [
  { id: "ESTANDAR", name: "ESTÁNDAR", rowColor: "bg-neutral-900/60 border-neutral-800", textColor: "text-slate-100", minPriceKg: 391, suggestedPriceKg: 430, description: "Bronce Estándar Comercial para bujes generales" },
  { id: "SAE40", name: "SAE 40", rowColor: "bg-neutral-900/40 border-neutral-800", textColor: "text-slate-200", minPriceKg: 491, suggestedPriceKg: 530, description: "Bronce Rojo (85-5-5-5) para válvulas, bombas y presión hidráulica" },
  { id: "SAE660", name: "SAE 660", rowColor: "bg-neutral-900/60 border-neutral-800", textColor: "text-slate-100", minPriceKg: 502, suggestedPriceKg: 542, description: "Bronce Estándar Antifricción C93200 para carga media-alta" },
  { id: "SAE62", name: "SAE 62", rowColor: "bg-neutral-900/40 border-neutral-800", textColor: "text-slate-200", minPriceKg: 541, suggestedPriceKg: 585, description: "Bronce Cañón (88-10-2) alta resistencia mecánica y coronas" },
  { id: "SAE64", name: "SAE 64", rowColor: "bg-neutral-900/60 border-neutral-800", textColor: "text-slate-100", minPriceKg: 517, suggestedPriceKg: 558, description: "Bronce al Plomo (80-10-10) alta velocidad y maquinaria pesada" },
  { id: "SAE65", name: "SAE 65", rowColor: "bg-neutral-900/40 border-neutral-800", textColor: "text-slate-200", minPriceKg: 541, suggestedPriceKg: 585, description: "Bronce Fosforado (89-11) especial para engranes y coronas sinfín" },
  { id: "SAE68", name: "SAE 68", rowColor: "bg-neutral-900/60 border-neutral-800", textColor: "text-slate-200", minPriceKg: 581, suggestedPriceKg: 627, description: "Bronce al Aluminio alta resistencia al desgaste, impacto y corrosión" },
  { id: "430B", name: "430°B", rowColor: "bg-neutral-900/40 border-neutral-800", textColor: "text-slate-200", minPriceKg: 594, suggestedPriceKg: 731, description: "Bronce al Manganeso de Extra Alta Resistencia (SAE 430B)" },
  { id: "AMPCO", name: "AMPCO", rowColor: "bg-neutral-900/60 border-neutral-800", textColor: "text-slate-200", minPriceKg: 502, suggestedPriceKg: 502, description: "Aleación Especial Bronce-Aluminio tipo AMPCO para fricción severa" }
];

// Catálogo de Modelos Estandarizados y Blindajes (Para consulta inmediata de Ventas / Ing. Itzel)
export interface StandardPatternItem {
  code: string;
  category: "Molino de Bolas" | "Quebradora Quijada" | "Quebradora Cono" | "Bomba Lodos";
  equipmentSpec: string;
  partName: string;
  alloyNorm: string;
  dimensionsIn: string;
  unitWeightKg: number;
  pricePerKgSuggested: number;
  inStockPattern: boolean;
  leadTimeDays: string;
  notes: string;
}

const STANDARD_PATTERNS_CATALOG: StandardPatternItem[] = [
  {
    code: "MOD-MB-4X8-L1",
    category: "Molino de Bolas",
    equipmentSpec: "Molino 4' x 8' (Estándar Minero)",
    partName: "Placa de Blindaje Cilindro (Liner Tipo Ola Doble)",
    alloyNorm: "Acero al Manganeso ASTM A128 Gr. B2 (12-14% Mn)",
    dimensionsIn: "23.5\" x 15.5\" x 3.25\" (Barrenos estándar 7/8\")",
    unitWeightKg: 68.5,
    pricePerKgSuggested: 118,
    inStockPattern: true,
    leadTimeDays: "10 a 14 días hábiles",
    notes: "Modelo disponible en almacén. El cliente puede adaptar la perforación de su casco 4x8 a nuestro plano estándar sin costo de modelo."
  },
  {
    code: "MOD-MB-4X8-T1",
    category: "Molino de Bolas",
    equipmentSpec: "Molino 4' x 8' (Estándar Minero)",
    partName: "Placa Blindaje de Tapa Carga / Descarga (End Liner)",
    alloyNorm: "Acero al Manganeso ASTM A128 Gr. B2 / Cr-Mo",
    dimensionsIn: "Sección circular 48\" Ø interior, esp. 3.5\"",
    unitWeightKg: 54.0,
    pricePerKgSuggested: 122,
    inStockPattern: true,
    leadTimeDays: "10 a 14 días hábiles",
    notes: "Juego completo de 8 secciones por tapa. Modelo físico listo para moldeo."
  },
  {
    code: "MOD-MB-5X10-R1",
    category: "Molino de Bolas",
    equipmentSpec: "Molino 5' x 10'",
    partName: "Rejilla de Descarga Ranurada (Grate Liner)",
    alloyNorm: "Acero al Manganeso / Acero Cr-Mo Tratado",
    dimensionsIn: "Ranuras de 3/8\" con alivio cónico anti-atascamiento",
    unitWeightKg: 82.0,
    pricePerKgSuggested: 128,
    inStockPattern: true,
    leadTimeDays: "12 a 15 días hábiles",
    notes: "Modelo de alta rotación en Parral y zona norte."
  },
  {
    code: "MOD-QQ-15X24",
    category: "Quebradora Quijada",
    equipmentSpec: "Quebradora 15\" x 24\"",
    partName: "Quijada Fija y Móvil Dentada Reversible",
    alloyNorm: "Acero al Manganeso ASTM A128 (Austenítico)",
    dimensionsIn: "15\" x 24\" x 3\" paso estándar",
    unitWeightKg: 145.0,
    pricePerKgSuggested: 115,
    inStockPattern: true,
    leadTimeDays: "8 a 12 días hábiles",
    notes: "Modelo listo en estantería A-12."
  }
];

export interface AlloySpec {
  id: string;
  name: string;
  norm: string;
  family: "Acero" | "Bronce" | "Aluminio" | "Hierro";
  density: number; // g/cm3
  shrinkage: number; // % contracción lineal
  pourTempMin: number; // °C
  pourTempMax: number; // °C
  oxidationLoss: number; // % merma fusión
  baseCostKg: number; // MXN/kg
  chemistry: Record<string, [number, number]>;
}

const ALLOYS_CATALOG: AlloySpec[] = [
  {
    id: "MN-A128",
    name: "Acero al Manganeso (Blindajes)",
    norm: "ASTM A128 Gr. B2 (Hadfield)",
    family: "Acero",
    density: 7.88,
    shrinkage: 2.4,
    pourTempMin: 1470,
    pourTempMax: 1520,
    oxidationLoss: 4.8,
    baseCostKg: 62,
    chemistry: { C: [1.05, 1.35], Mn: [11.5, 14.0], Si: [0.30, 0.90], Cr: [0.0, 0.50], Fe: [83.0, 87.0] }
  },
  {
    id: "WCB",
    name: "Acero al Carbón WCB",
    norm: "ASTM A216 Gr. WCB",
    family: "Acero",
    density: 7.85,
    shrinkage: 2.0,
    pourTempMin: 1580,
    pourTempMax: 1630,
    oxidationLoss: 4.5,
    baseCostKg: 48,
    chemistry: { C: [0.18, 0.30], Mn: [0.60, 1.00], Si: [0.30, 0.60], Cr: [0.0, 0.50], Fe: [97.0, 99.0] }
  },
  {
    id: "CA15",
    name: "Acero Inoxidable Martensítico",
    norm: "ASTM A743 Gr. CA-15",
    family: "Acero",
    density: 7.75,
    shrinkage: 2.1,
    pourTempMin: 1560,
    pourTempMax: 1610,
    oxidationLoss: 5.0,
    baseCostKg: 95,
    chemistry: { C: [0.05, 0.15], Mn: [0.50, 1.00], Si: [0.50, 1.50], Cr: [11.5, 14.0], Fe: [82.0, 87.5] }
  },
  {
    id: "SAE64",
    name: "Bronce al Plomo (Bujes Pesados)",
    norm: "SAE 64 / CDA 937",
    family: "Bronce",
    density: 8.95,
    shrinkage: 1.5,
    pourTempMin: 1040,
    pourTempMax: 1120,
    oxidationLoss: 3.0,
    baseCostKg: 215,
    chemistry: { Cu: [78.0, 82.0], Sn: [9.0, 11.0], Pb: [8.0, 11.0], Zn: [0.0, 1.0] }
  },
  {
    id: "SAE62",
    name: "Bronce Cañón SAE 62",
    norm: "SAE 62 / ASTM B584",
    family: "Bronce",
    density: 8.80,
    shrinkage: 1.5,
    pourTempMin: 1080,
    pourTempMax: 1150,
    oxidationLoss: 2.8,
    baseCostKg: 230,
    chemistry: { Cu: [86.0, 89.0], Sn: [9.0, 11.0], Zn: [1.0, 3.0], Pb: [0.0, 0.3] }
  },
  {
    id: "A356",
    name: "Aluminio Estructural A356",
    norm: "ASTM B26 Gr. A356",
    family: "Aluminio",
    density: 2.68,
    shrinkage: 1.3,
    pourTempMin: 680,
    pourTempMax: 730,
    oxidationLoss: 3.5,
    baseCostKg: 78,
    chemistry: { Al: [91.5, 93.5], Si: [6.5, 7.5], Mg: [0.25, 0.45], Fe: [0.0, 0.20] }
  },
  {
    id: "GG25",
    name: "Hierro Gris Perlítico GG25",
    norm: "ASTM A48 Clase 35",
    family: "Hierro",
    density: 7.20,
    shrinkage: 1.0,
    pourTempMin: 1380,
    pourTempMax: 1440,
    oxidationLoss: 3.2,
    baseCostKg: 36,
    chemistry: { C: [3.10, 3.40], Si: [1.80, 2.30], Mn: [0.60, 0.90], Cr: [0.0, 0.25], Fe: [92.5, 94.5] }
  }
];

const PATTERN_MATERIALS: Record<string, { name: string; density: number }> = {
  pino: { name: "Madera de Pino Seca", density: 0.50 },
  cedro: { name: "Madera de Cedro / Caoba", density: 0.58 },
  resina: { name: "Resina Epóxica de Modelaje", density: 1.15 },
  pla: { name: "Impresión 3D (PLA / PETG sólido)", density: 1.24 },
  aluminio: { name: "Modelo Metálico de Aluminio", density: 2.70 },
  hierro: { name: "Pieza Muestra en Hierro", density: 7.20 }
};

export interface ProductionOrder {
  id: string;
  client: string;
  partName: string;
  patternCode: string;
  alloyId: string;
  qty: number;
  netWeightKg: number;
  grossWeightKg: number;
  stage: StageId;
  priority: "Urgente" | "Alta" | "Normal";
  heatNumber: string;
  pourTemp?: number;
  hardnessHB?: number;
  chemActual?: Record<string, number>;
  notes: string;
  updatedAt: string;
}

export interface ScrapMaterial {
  id: string;
  name: string;
  costPerKg: number;
  stockKg: number;
  composition: Record<string, number>;
}

const INITIAL_USERS: UserProfile[] = [
  { id: "U-01", name: "Adalberto Loya", email: "adal@funesma.com", role: "super_admin", active: true },
  { id: "U-02", name: "Ventas y Administración", email: "ventas@funesma.com", role: "ventas", active: true },
  { id: "U-03", name: "Gerardo Loya (Director de Producto)", email: "gerardo@funesma.com", role: "jefe_planta", active: true },
  { id: "U-04", name: "Maestro Fundidor Turno 1", email: "hornos@funesma.com", role: "operador", active: true }
];

const INITIAL_ORDERS: ProductionOrder[] = [
  {
    id: "OP-2601",
    client: "Minera San Julián",
    partName: "Juego Placas Blindaje Molino de Bolas 4'x8'",
    patternCode: "MOD-MB-4X8-L1",
    alloyId: "MN-A128",
    qty: 24,
    netWeightKg: 68.5,
    grossWeightKg: 98.0,
    stage: "moldeo",
    priority: "Urgente",
    heatNumber: "COL-26-091",
    pourTemp: 1495,
    hardnessHB: 230,
    chemActual: { C: 1.18, Mn: 12.8, Si: 0.55, Cr: 0.22, Fe: 85.25 },
    notes: "Acero al Manganeso ASTM A128. Cliente adapta perforación a nuestro modelo estándar.",
    updatedAt: "2026-10-22 12:40"
  },
  {
    id: "OP-2602",
    client: "Cliente Barra Bronce 4 1/2\" x 3 1/4\" x 14\"",
    partName: "Buje Bronce p/ Acabar a 4 1/4\" Exterior",
    patternCode: "MOD-BUJ-450",
    alloyId: "SAE64",
    qty: 1,
    netWeightKg: 16.95,
    grossWeightKg: 23.5,
    stage: "fusion",
    priority: "Alta",
    heatNumber: "COL-26-092",
    pourTemp: 1080,
    hardnessHB: 75,
    chemActual: { Cu: 80.2, Sn: 9.8, Pb: 9.5, Zn: 0.5 },
    notes: "Cotizado con tabla oficial FUNESMA. Medida de vaciado 4 1/2 x 3 1/4 x 14 pulg.",
    updatedAt: "2026-10-22 11:10"
  },
  {
    id: "OP-2603",
    client: "Válvulas Industriales MX",
    partName: "Cuerpo Válvula Compuerta 8\" 300#",
    patternCode: "MOD-VAL-08",
    alloyId: "WCB",
    qty: 10,
    netWeightKg: 64.0,
    grossWeightKg: 98.5,
    stage: "calidad",
    priority: "Normal",
    heatNumber: "COL-26-084",
    pourTemp: 1605,
    hardnessHB: 168,
    chemActual: { C: 0.23, Mn: 0.82, Si: 0.45, Cr: 0.18, Fe: 98.32 },
    notes: "Prueba hidrostática aprobada. Lista para certificado.",
    updatedAt: "2026-10-21 17:40"
  }
];

const FRACTIONS_LIST: { label: string; value: number }[] = [
  { label: "0\"", value: 0 },
  { label: "1/16\"", value: 0.0625 },
  { label: "1/8\"", value: 0.125 },
  { label: "3/16\"", value: 0.1875 },
  { label: "1/4\"", value: 0.25 },
  { label: "5/16\"", value: 0.3125 },
  { label: "3/8\"", value: 0.375 },
  { label: "7/16\"", value: 0.4375 },
  { label: "1/2\"", value: 0.5 },
  { label: "9/16\"", value: 0.5625 },
  { label: "5/8\"", value: 0.625 },
  { label: "11/16\"", value: 0.6875 },
  { label: "3/4\"", value: 0.75 },
  { label: "13/16\"", value: 0.8125 },
  { label: "7/8\"", value: 0.875 },
  { label: "15/16\"", value: 0.9375 }
];

const KANBAN_STAGES: { id: StageId; label: string; badgeColor: string }[] = [
  { id: "modelaje", label: "1. Modelos y Cajas", badgeColor: "bg-slate-700 text-slate-200" },
  { id: "moldeo", label: "2. Moldeo y Corazones", badgeColor: "bg-amber-900/60 text-amber-300" },
  { id: "fusion", label: "3. Fusión y Vaciado", badgeColor: "bg-orange-900/70 text-orange-300" },
  { id: "limpieza", label: "4. Desmoldeo y Granallado", badgeColor: "bg-blue-900/60 text-blue-300" },
  { id: "maquinado", label: "5. Trat. Térmico / CNC", badgeColor: "bg-neutral-800 text-slate-300" },
  { id: "calidad", label: "6. Calidad y Liberación", badgeColor: "bg-emerald-900/60 text-emerald-300" }
];

const INITIAL_SCRAP_INVENTORY: ScrapMaterial[] = [
  { id: "M1", name: "Retorno Propio Acero WCB / Mn", costPerKg: 14.0, stockKg: 1800, composition: { C: 0.24, Mn: 0.72, Si: 0.42, Cr: 0.12, Fe: 98.5 } },
  { id: "M2", name: "Chatarra Placa Estructural A36", costPerKg: 11.5, stockKg: 4500, composition: { C: 0.18, Mn: 0.55, Si: 0.15, Cr: 0.05, Fe: 99.07 } },
  { id: "M3", name: "Ferromanganeso Alto Carbón (FeMn 76%)", costPerKg: 46.0, stockKg: 850, composition: { C: 6.5, Mn: 76.0, Si: 1.0, Cr: 0.0, Fe: 16.5 } },
  { id: "M4", name: "Ferrosilicio 75% (FeSi75)", costPerKg: 54.0, stockKg: 400, composition: { C: 0.1, Mn: 0.0, Si: 75.0, Cr: 0.0, Fe: 24.9 } },
  { id: "M5", name: "Ferrocromo Alto Carbón (FeCr 65%)", costPerKg: 82.0, stockKg: 500, composition: { C: 6.0, Mn: 0.0, Si: 1.5, Cr: 65.0, Fe: 27.5 } }
];

// ============================================================================
// 2. COMPONENTE PRINCIPAL FUNESMA MES & COMMERCIAL SUITE
// ============================================================================

export default function App() {
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[0]);
  const [activeTab, setActiveTab] = useState<
    "cotizador_bronce" | "catalogo_blindajes" | "kanban" | "calculadoras" | "stl3d" | "simplex" | "hornos" | "usuarios"
  >("cotizador_bronce");

  const [orders, setOrders] = useState<ProductionOrder[]>(INITIAL_ORDERS);
  const [selectedOrderQR, setSelectedOrderQR] = useState<ProductionOrder | null>(null);
  const [filterAlloy, setFilterAlloy] = useState<string>("ALL");
  const [selectedMobileStage, setSelectedMobileStage] = useState<StageId | "all">("all");
  const [openActionMenuOrderId, setOpenActionMenuOrderId] = useState<string | null>(null);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [isProductionFiltersOpen, setIsProductionFiltersOpen] = useState(false);

  // Estado Modal Nueva Orden
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [newOrderForm, setNewOrderForm] = useState({
    client: "",
    partName: "",
    patternCode: "",
    alloyId: "SAE64",
    qty: 1,
    netWeightKg: 16.95,
    grossWeightKg: 24.5,
    priority: "Normal" as "Urgente" | "Alta" | "Normal",
    heatNumber: "COL-26-093",
    notes: ""
  });

  // Estado Nuevo Usuario
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<Role>("operador");

  // ==========================================================================
  // ESTADOS DEL COTIZADOR OFICIAL FUNESMA (RÉPLICA EXCEL + WHATSAPP)
  // ==========================================================================
  // Entrada en Pulgadas Enteras + Fracción (por defecto 4 1/2 x 3 1/4 x 14.0 como en la foto)
  const [odWhole, setOdWhole] = useState<number>(4);
  const [odFrac, setOdFrac] = useState<number>(0.5); // 1/2"
  const [idWhole, setIdWhole] = useState<number>(3);
  const [idFrac, setIdFrac] = useState<number>(0.25); // 1/4"
  const [lenWhole, setLenWhole] = useState<number>(14);
  const [lenFrac, setLenFrac] = useState<number>(0);

  const [extraFactor, setExtraFactor] = useState<number>(0.06); // Celda "EXTRA 0.06" del Excel
  const [isFinishedMeasure, setIsFinishedMeasure] = useState<boolean>(false);
  const [selectedBronzeForWA, setSelectedBronzeForWA] = useState<string>("ESTANDAR");
  const [priceTierWA, setPriceTierWA] = useState<"sugerido" | "minimo">("sugerido");
  const [deliveryTimeWA, setDeliveryTimeWA] = useState<string>("3 A 5 DÍAS HÁBILES");
  const [clientPhoneWA, setClientPhoneWA] = useState<string>("");
  const [copiedWA, setCopiedWA] = useState<boolean>(false);

  // Buscador de Blindajes
  const [searchPatternQuery, setSearchPatternQuery] = useState<string>("");

  // Calculadoras de Fundición
  const [calcAlloyId, setCalcAlloyId] = useState<string>("WCB");
  const [patternMat, setPatternMat] = useState<string>("pino");
  const [patternWeightKg, setPatternWeightKg] = useState<number>(4.2);

  // Geometría buje/placa
  const [geoShape, setGeoShape] = useState<"buje" | "placa">("buje");
  const [dimOD, setDimOD] = useState<number>(250);
  const [dimID, setDimID] = useState<number>(150);
  const [dimLength, setDimLength] = useState<number>(300);
  const [machiningAllowanceMm, setMachiningAllowanceMm] = useState<number>(5);
  const [gatingRatioPct, setGatingRatioPct] = useState<number>(35);

  // Arenas y Resinas
  const [sandBoxVolLiters, setSandBoxVolLiters] = useState<number>(120);
  const [newSandPct, setNewSandPct] = useState<number>(30);
  const [resinPct, setResinPct] = useState<number>(1.2);
  const [catalystPct, setCatalystPct] = useState<number>(25);

  // Analizador 3D STL + Chvorinov
  const [stlStats, setStlStats] = useState<{
    fileName: string;
    volumeCm3: number;
    areaCm2: number;
    modulusCm: number;
    recommendedRiserModulusCm: number;
    recommendedRiserDiameterMm: number;
    recommendedRiserHeightMm: number;
  } | null>(null);

  // Optimizador Simplex
  const [targetChargeKg, setTargetChargeKg] = useState<number>(500);
  const [targetAlloySimplex, setTargetAlloySimplex] = useState<string>("WCB");
  const [scrapList, setScrapList] = useState<ScrapMaterial[]>(INITIAL_SCRAP_INVENTORY);

  // Hornos y Crisoles
  const [furnaces, setFurnaces] = useState([
    { id: "H-IND-01", name: "Horno Inducción 500 kg (Acero/Hierro)", heats: 94, maxHeats: 110, status: "Operativo" },
    { id: "H-IND-02", name: "Horno Inducción 250 kg (Inoxidable/Manganeso)", heats: 42, maxHeats: 100, status: "Operativo" },
    { id: "H-CRI-01", name: "Horno Crisol SiC #180 (Bronces)", heats: 58, maxHeats: 65, status: "Alerta Desgaste" },
    { id: "H-CRI-02", name: "Horno Basculante Aluminio 300 kg", heats: 31, maxHeats: 90, status: "Operativo" }
  ]);

  // Persistencia híbrida (Supabase si está configurado, con fallback automático a localStorage)
  useEffect(() => {
    const savedOrders = localStorage.getItem("funesma_orders_v2");
    if (savedOrders) {
      try { setOrders(JSON.parse(savedOrders)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("funesma_orders_v2", JSON.stringify(orders));
  }, [orders]);

  // Permisos RBAC
  const permissions = useMemo(() => {
    const r = currentUser.role;
    return {
      canManageUsers: r === "super_admin",
      canCreateOrders: r === "super_admin" || r === "jefe_planta" || r === "ventas",
      canMoveKanban: r === "super_admin" || r === "jefe_planta" || r === "operador",
      canUseSimplex: r === "super_admin" || r === "jefe_planta" || r === "almacen",
      canViewCosts: r === "super_admin" || r === "ventas" || r === "jefe_planta"
    };
  }, [currentUser]);

  // ==========================================================================
  // MOTOR MATEMÁTICO DEL COTIZADOR OFICIAL DE BRONCES FUNESMA
  // ==========================================================================
  const bronzeQuoteCalc = useMemo(() => {
    const finishAllowance = isFinishedMeasure ? 0.25 : 0;
    const rawOD = odWhole + odFrac + finishAllowance;
    const rawID = Math.max(0, idWhole + idFrac - (idWhole + idFrac > 0 ? finishAllowance : 0));
    const rawLen = lenWhole + lenFrac;

    // Aplicación exacta de la fila blanca del Excel (con factor EXTRA = 0.06)
    const adjOD = rawOD + extraFactor;
    const adjID = rawID > 0 ? Math.max(0, rawID - extraFactor) : 0;
    const adjLen = rawLen + extraFactor;

    // Fórmula exacta del Excel FUNESMA: ((OD_adj^2 - ID_adj^2) * L_adj * PI) / 400
    const weightKg = ((Math.pow(adjOD, 2) - Math.pow(adjID, 2)) * adjLen * Math.PI) / 400;

    // Cálculo de ANCHO y pared por lado
    const exactNomWall = rawOD - rawID + 0.125;
    const wallPerSide = (rawOD - rawID) / 2 + 0.0625;
    const isWallThinWarning = rawID > 0 && wallPerSide < 0.75; // Regla de 3/4" (0.750")

    // Tabla de precios calculada para cada aleación
    const rows = FUNESMA_BRONZE_TABLE.map((row) => {
      const cotMinima = weightKg * row.minPriceKg;
      const cotSugerida = weightKg * row.suggestedPriceKg;
      const piezas1x14 = cotSugerida + 50; // Columna "PIEZAS DE 1\" X 14\"" suma +$50 MXN
      return {
        ...row,
        cotMinima,
        cotSugerida,
        piezas1x14
      };
    });

    return {
      rawOD,
      rawID,
      rawLen,
      adjOD,
      adjID,
      adjLen,
      weightKg,
      exactNomWall,
      wallPerSide,
      isWallThinWarning,
      rows
    };
  }, [odWhole, odFrac, idWhole, idFrac, lenWhole, lenFrac, extraFactor, isFinishedMeasure]);

  // Mensaje oficial de WhatsApp
  const whatsappGeneratedText = useMemo(() => {
    const selectedRow =
      bronzeQuoteCalc.rows.find((r) => r.id === selectedBronzeForWA) || bronzeQuoteCalc.rows[0];
    const finalPrice =
      priceTierWA === "sugerido" ? selectedRow.cotSugerida : selectedRow.cotMinima;

    const odFracLabel = FRACTIONS_LIST.find((f) => f.value === odFrac)?.label.replace('"', "") || "";
    const idFracLabel = FRACTIONS_LIST.find((f) => f.value === idFrac)?.label.replace('"', "") || "";
    const odText = `${odWhole}${odFrac > 0 ? ` ${odFracLabel}` : ""}"`;
    const idText = idWhole + idFrac > 0 ? `${idWhole}${idFrac > 0 ? ` ${idFracLabel}` : ""}"` : "SÓLIDO";

    return `Hola buenas tardes, le comparto la cotización solicitada en *FUNESMA*:

*MATERIAL:* BRONCE ${selectedRow.name}
*MEDIDA DE VACIADO:* ${odText} Ø Ext. x ${idText} Ø Int. x ${bronzeQuoteCalc.rawLen.toFixed(1)}" Largo
*PESO ESTIMADO:* ${bronzeQuoteCalc.weightKg.toFixed(2)} kg
*PRECIO UNITARIO:* $${Math.round(finalPrice).toLocaleString("es-MX")} MXN + IVA
*TIEMPO DE ENTREGA:* ${deliveryTimeWA}

_Nota: La pieza cuenta con sobremedida para su maquinado final._
Quedo a sus órdenes.
*FUNESMA — Fundición Especializada y Maquinados*
ventas@funesma.com`;
  }, [
    bronzeQuoteCalc,
    selectedBronzeForWA,
    priceTierWA,
    deliveryTimeWA,
    odWhole,
    odFrac,
    idWhole,
    idFrac
  ]);

  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText(whatsappGeneratedText);
    setCopiedWA(true);
    setTimeout(() => setCopiedWA(false), 2500);
  };

  // Cálculos Metalúrgicos Generales
  const selectedAlloy = useMemo(
    () => ALLOYS_CATALOG.find((a) => a.id === calcAlloyId) || ALLOYS_CATALOG[0],
    [calcAlloyId]
  );

  const weightFromPatternKg = useMemo(() => {
    const patDensity = PATTERN_MATERIALS[patternMat]?.density || 0.5;
    return (patternWeightKg / patDensity) * selectedAlloy.density;
  }, [patternWeightKg, patternMat, selectedAlloy]);

  const geoResults = useMemo(() => {
    const allow = machiningAllowanceMm * 2;
    let volumeMm3 = 0;

    if (geoShape === "buje") {
      const outerR = (dimOD + allow) / 2;
      const innerR = Math.max(0, (dimID - allow) / 2);
      const h = dimLength + allow;
      volumeMm3 = Math.PI * (Math.pow(outerR, 2) - Math.pow(innerR, 2)) * h;
    } else {
      const l = dimOD + allow;
      const w = dimID + allow;
      const t = dimLength + allow;
      volumeMm3 = l * w * t;
    }

    const volumeCm3 = volumeMm3 / 1000;
    const netPartWeightKg = (volumeCm3 * selectedAlloy.density) / 1000;
    const liquidMetalRequiredKg =
      netPartWeightKg * (1 + gatingRatioPct / 100) * (1 + selectedAlloy.oxidationLoss / 100);
    const metallurgicalYieldPct = (netPartWeightKg / liquidMetalRequiredKg) * 100;

    const shrinkFactor = 1 + selectedAlloy.shrinkage / 100;
    const patternOD = (dimOD + allow) * shrinkFactor;
    const patternID = Math.max(0, (dimID - allow) * shrinkFactor);
    const patternLen = (dimLength + allow) * shrinkFactor;

    return {
      volumeCm3,
      netPartWeightKg,
      liquidMetalRequiredKg,
      metallurgicalYieldPct,
      patternOD,
      patternID,
      patternLen
    };
  }, [geoShape, dimOD, dimID, dimLength, machiningAllowanceMm, selectedAlloy, gatingRatioPct]);

  const sandMixResults = useMemo(() => {
    const totalSandKg = sandBoxVolLiters * 1.55;
    const newSandKg = totalSandKg * (newSandPct / 100);
    const reclaimedSandKg = totalSandKg - newSandKg;
    const resinGrams = totalSandKg * (resinPct / 100) * 1000;
    const catalystGrams = resinGrams * (catalystPct / 100);
    return { totalSandKg, newSandKg, reclaimedSandKg, resinGrams, catalystGrams };
  }, [sandBoxVolLiters, newSandPct, resinPct, catalystPct]);

  // Analizador 3D STL
  const handleSTLUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const buffer = event.target?.result;
      if (!buffer) return;

      const loader = new STLLoader();
      const geometry = loader.parse(buffer as ArrayBuffer);
      const pos = geometry.attributes.position;
      let volMm3 = 0;
      let areaMm2 = 0;

      const p1 = new THREE.Vector3();
      const p2 = new THREE.Vector3();
      const p3 = new THREE.Vector3();
      const ab = new THREE.Vector3();
      const ac = new THREE.Vector3();
      const cross = new THREE.Vector3();

      for (let i = 0; i < pos.count; i += 3) {
        p1.fromBufferAttribute(pos, i);
        p2.fromBufferAttribute(pos, i + 1);
        p3.fromBufferAttribute(pos, i + 2);

        volMm3 += p1.dot(p2.clone().cross(p3)) / 6.0;

        ab.subVectors(p2, p1);
        ac.subVectors(p3, p1);
        cross.crossVectors(ab, ac);
        areaMm2 += 0.5 * cross.length();
      }

      const volumeCm3 = Math.abs(volMm3) / 1000.0;
      const areaCm2 = areaMm2 / 100.0;
      const modulusCm = volumeCm3 / (areaCm2 || 1);
      const recommendedRiserModulusCm = modulusCm * 1.2;
      const recommendedRiserDiameterMm = recommendedRiserModulusCm * 50;
      const recommendedRiserHeightMm = recommendedRiserDiameterMm * 1.5;

      setStlStats({
        fileName: file.name,
        volumeCm3,
        areaCm2,
        modulusCm,
        recommendedRiserModulusCm,
        recommendedRiserDiameterMm,
        recommendedRiserHeightMm
      });
    };
    reader.readAsArrayBuffer(file);
  };

  // Optimizador Simplex (javascript-lp-solver)
  const simplexSolution = useMemo(() => {
    const alloy = ALLOYS_CATALOG.find((a) => a.id === targetAlloySimplex) || ALLOYS_CATALOG[0];
    const model: any = {
      optimize: "cost",
      opType: "min",
      constraints: { totalWeight: { equal: targetChargeKg } },
      variables: {}
    };

    Object.entries(alloy.chemistry).forEach(([elem, [minPct, maxPct]]) => {
      model.constraints[`elem_${elem}_min`] = { min: (minPct / 100) * targetChargeKg };
      model.constraints[`elem_${elem}_max`] = { max: (maxPct / 100) * targetChargeKg };
    });

    scrapList.forEach((mat) => {
      model.constraints[`stock_${mat.id}`] = { max: mat.stockKg };
      const v: Record<string, number> = {
        cost: mat.costPerKg,
        totalWeight: 1,
        [`stock_${mat.id}`]: 1
      };
      Object.keys(alloy.chemistry).forEach((elem) => {
        const pct = mat.composition[elem] || 0;
        v[`elem_${elem}_min`] = pct / 100;
        v[`elem_${elem}_max`] = pct / 100;
      });
      model.variables[mat.id] = v;
    });

    const result = solver.Solve(model);
    return { alloy, result };
  }, [targetChargeKg, targetAlloySimplex, scrapList]);

  // Certificado PDF
  const generateQualityCertificatePDF = (order: ProductionOrder) => {
    const alloy = ALLOYS_CATALOG.find((a) => a.id === order.alloyId) || ALLOYS_CATALOG[0];
    const doc = new jsPDF();

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 38, "F");
    doc.setTextColor(245, 158, 11);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("FUNESMA", 14, 18);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("CERTIFICADO METALÚRGICO DE CALIDAD Y TRAZABILIDAD DE COLADA", 14, 27);
    doc.text("Parral, Chihuahua • ventas@funesma.com • funesma.com", 14, 33);

    doc.setTextColor(20, 20, 20);
    doc.setFontSize(10);
    doc.text(`Orden de Producción: ${order.id}`, 14, 48);
    doc.text(`Cliente: ${order.client}`, 14, 55);
    doc.text(`Pieza: ${order.partName}`, 14, 62);
    doc.text(`Código Modelo: ${order.patternCode}`, 14, 69);

    doc.text(`No. de Colada: ${order.heatNumber}`, 115, 48);
    doc.text(`Aleación: ${alloy.name} (${alloy.norm})`, 115, 55);
    doc.text(`Cantidad Liberada: ${order.qty} pzas (${order.netWeightKg} kg c/u)`, 115, 62);
    doc.text(`Dureza Registrada: ${order.hardnessHB || 185} HB`, 115, 69);

    const chemRows = Object.entries(alloy.chemistry).map(([elem, [min, max]]) => {
      const actualVal = order.chemActual?.[elem] ?? Number(((min + max) / 2).toFixed(2));
      const inSpec = actualVal >= min && actualVal <= max;
      return [
        elem,
        `${min.toFixed(2)} %`,
        `${max.toFixed(2)} %`,
        `${actualVal.toFixed(2)} %`,
        inSpec ? "CUMPLE NORMA" : "AJUSTE ESPECIAL"
      ];
    });

    autoTable(doc, {
      startY: 78,
      head: [["Elemento", "% Mínimo Norma", "% Máximo Norma", "% Real Colada", "Dictamen"]],
      body: chemRows,
      headStyles: { fillColor: [217, 119, 6], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [241, 245, 249] }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 18;
    doc.setFont("helvetica", "bold");
    doc.text("Observaciones de Control de Calidad:", 14, finalY);
    doc.setFont("helvetica", "normal");
    doc.text(order.notes || "Inspección visual, dimensional y composición química aprobada satisfactoriamente.", 14, finalY + 7);

    doc.line(14, finalY + 30, 85, finalY + 30);
    doc.text("Ing. Control de Calidad — FUNESMA", 14, finalY + 36);

    doc.save(`Certificado_FUNESMA_${order.id}_${order.heatNumber}.pdf`);
  };

  const moveOrderStage = (orderId: string, direction: "next" | "prev") => {
    if (!permissions.canMoveKanban) return;
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const idx = KANBAN_STAGES.findIndex((s) => s.id === o.stage);
        const nextIdx = direction === "next" ? Math.min(idx + 1, KANBAN_STAGES.length - 1) : Math.max(idx - 1, 0);
        return {
          ...o,
          stage: KANBAN_STAGES[nextIdx].id,
          updatedAt: new Date().toISOString().slice(0, 16).replace("T", " ")
        };
      })
    );
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const nextNum = 2600 + orders.length + 1;
    const created: ProductionOrder = {
      id: `OP-${nextNum}`,
      ...newOrderForm,
      stage: "modelaje",
      updatedAt: new Date().toISOString().slice(0, 16).replace("T", " ")
    };
    setOrders([created, ...orders]);
    setShowNewOrderModal(false);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;
    const newUser: UserProfile = {
      id: `U-0${users.length + 1}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      active: true
    };
    setUsers([...users, newUser]);
    setNewUserName("");
    setNewUserEmail("");
  };

  const chartData = useMemo(() => {
    return ALLOYS_CATALOG.map((alloy) => {
      const alloyOrders = orders.filter((o) => o.alloyId === alloy.id);
      const netKg = alloyOrders.reduce((acc, o) => acc + o.netWeightKg * o.qty, 0);
      const grossKg = alloyOrders.reduce((acc, o) => acc + o.grossWeightKg * o.qty, 0);
      return {
        name: alloy.id,
        PesoNetoKg: Math.round(netKg),
        MetalLiquidoKg: Math.round(grossKg)
      };
    });
  }, [orders]);

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-amber-500 selection:text-black">
      {/* HEADER CORPORATIVO LIMPIO CON LOGO OFICIAL EN TAMAÑO DESTACADO */}
      <header className="sticky top-0 z-30 border-b border-neutral-900 bg-black/95 backdrop-blur px-4 py-3">
        <div className="max-w-[1650px] mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src="./funesma_logo.png"
              alt="FUNESMA"
              className="h-14 md:h-16 w-auto object-contain filter drop-shadow-md py-0.5"
            />
            <div className="hidden sm:block border-l border-neutral-800 pl-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
                MES & Foundry Suite
              </span>
              <span className="text-[11px] text-slate-400">
                Fundición Especializada y Maquinados
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="../index.html"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Sitio Web
            </a>

            <div className="flex items-center gap-1.5 bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1 text-xs">
              <span className="text-slate-400 hidden sm:inline">Rol:</span>
              <select
                value={currentUser.id}
                onChange={(e) => {
                  const found = users.find((u) => u.id === e.target.value);
                  if (found) setCurrentUser(found);
                }}
                className="bg-transparent font-medium text-slate-200 focus:outline-none cursor-pointer"
              >
                {users.filter((u) => u.active).map((u) => (
                  <option key={u.id} value={u.id} className="bg-black text-white">
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>

            {/* BOTÓN ÚNICO DE 3 RAYITAS PARA TODO EL MENÚ Y SECCIONES */}
            <div className="relative">
              <button
                onClick={() => setIsNavMenuOpen(!isNavMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-slate-200 hover:text-white transition font-medium text-xs"
                title="Menú de Navegación"
              >
                <Menu className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {activeTab === "cotizador_bronce" && "Cotizador"}
                  {activeTab === "catalogo_blindajes" && "Blindajes"}
                  {activeTab === "kanban" && "Producción"}
                  {activeTab === "calculadoras" && "Calculadoras"}
                  {activeTab === "stl3d" && "Escáner 3D"}
                  {activeTab === "simplex" && "Carga Horno"}
                  {activeTab === "hornos" && "Hornos"}
                  {activeTab === "usuarios" && "Usuarios"}
                </span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {/* MENÚ DESPLEGABLE DESDE EL BOTÓN DE 3 RAYITAS */}
              {isNavMenuOpen && (
                <div className="absolute right-0 top-10 z-50 w-64 bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl p-2 space-y-1">
                  <div className="px-2.5 py-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-neutral-900 mb-1">
                    Módulos FUNESMA
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab("cotizador_bronce");
                      setIsNavMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition ${
                      activeTab === "cotizador_bronce"
                        ? "bg-white text-black font-bold"
                        : "text-slate-300 hover:bg-neutral-900 hover:text-white"
                    }`}
                  >
                    Cotizador Bronces
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab("catalogo_blindajes");
                      setIsNavMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition ${
                      activeTab === "catalogo_blindajes"
                        ? "bg-white text-black font-bold"
                        : "text-slate-300 hover:bg-neutral-900 hover:text-white"
                    }`}
                  >
                    Blindajes y Modelos
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab("kanban");
                      setIsNavMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition ${
                      activeTab === "kanban"
                        ? "bg-white text-black font-bold"
                        : "text-slate-300 hover:bg-neutral-900 hover:text-white"
                    }`}
                  >
                    Producción
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab("calculadoras");
                      setIsNavMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition ${
                      activeTab === "calculadoras"
                        ? "bg-white text-black font-bold"
                        : "text-slate-300 hover:bg-neutral-900 hover:text-white"
                    }`}
                  >
                    Calculadoras
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab("stl3d");
                      setIsNavMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition ${
                      activeTab === "stl3d"
                        ? "bg-white text-black font-bold"
                        : "text-slate-300 hover:bg-neutral-900 hover:text-white"
                    }`}
                  >
                    Escáner 3D STL
                  </button>

                  {permissions.canUseSimplex && (
                    <button
                      onClick={() => {
                        setActiveTab("simplex");
                        setIsNavMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition ${
                        activeTab === "simplex"
                          ? "bg-white text-black font-bold"
                          : "text-slate-300 hover:bg-neutral-900 hover:text-white"
                      }`}
                    >
                      Carga de Horno
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setActiveTab("hornos");
                      setIsNavMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition ${
                      activeTab === "hornos"
                        ? "bg-white text-black font-bold"
                        : "text-slate-300 hover:bg-neutral-900 hover:text-white"
                    }`}
                  >
                    Hornos y Analítica
                  </button>

                  {permissions.canManageUsers && (
                    <button
                      onClick={() => {
                        setActiveTab("usuarios");
                        setIsNavMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition ${
                        activeTab === "usuarios"
                          ? "bg-white text-black font-bold"
                          : "text-slate-300 hover:bg-neutral-900 hover:text-white"
                      }`}
                    >
                      Usuarios
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-[1650px] mx-auto p-4 md:p-6">
        {/* ====================================================================
            MÓDULO 1: COTIZADOR OFICIAL DE BRONCES FUNESMA (RÉPLICA EXCEL + WA)
           ==================================================================== */}
        {activeTab === "cotizador_bronce" && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-amber-400" /> Cotizador Oficial FUNESMA — Bujes y Barras de Bronce
                  </h2>
                  <p className="text-xs text-slate-400">
                    Fórmula exacta del Excel de planta (tolerancia de colada Extra 0.06" y validación de espesor de pared 3/4" por lado).
                  </p>
                </div>

                <label className="flex items-center gap-2.5 bg-slate-950 border border-amber-500/40 px-3.5 py-2 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFinishedMeasure}
                    onChange={(e) => setIsFinishedMeasure(e.target.checked)}
                    className="h-4 w-4 accent-amber-500"
                  />
                  <span className="text-xs font-bold text-amber-300">
                    ¿Medida ACABADA del cliente? (+1/4" Ext / -1/4" Int para maquinado)
                  </span>
                </label>
              </div>

              {/* MEDIDAS EN PULGADAS Y FRACCIONES */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
                  <span className="text-[11px] font-bold uppercase text-slate-400 block">FACTOR EXTRA (Pulg)</span>
                  <input
                    type="number"
                    step="0.01"
                    value={extraFactor}
                    onChange={(e) => setExtraFactor(parseFloat(e.target.value) || 0)}
                    className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 font-mono text-lg font-black text-red-400"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">Estándar Excel: 0.06</span>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
                  <span className="text-[11px] font-bold uppercase text-slate-300 block">Ø EXTERIOR (Pulg + Fracc)</span>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <input
                      type="number"
                      min="0"
                      value={odWhole}
                      onChange={(e) => setOdWhole(parseInt(e.target.value) || 0)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 font-mono text-lg font-black text-blue-400"
                    />
                    <select
                      value={odFrac}
                      onChange={(e) => setOdFrac(parseFloat(e.target.value))}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 font-mono text-sm font-bold text-blue-400"
                    >
                      {FRACTIONS_LIST.map((f) => (
                        <option key={f.label} value={f.value}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <span className="text-xs font-mono text-slate-400 mt-1.5 block">
                    Nominal: <strong>{bronzeQuoteCalc.rawOD.toFixed(2)}"</strong> → Vaciado:{" "}
                    <strong className="text-white">{bronzeQuoteCalc.adjOD.toFixed(2)}"</strong>
                  </span>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
                  <span className="text-[11px] font-bold uppercase text-slate-300 block">Ø INTERIOR (0 = Sólido)</span>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <input
                      type="number"
                      min="0"
                      value={idWhole}
                      onChange={(e) => setIdWhole(parseInt(e.target.value) || 0)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 font-mono text-lg font-black text-blue-400"
                    />
                    <select
                      value={idFrac}
                      onChange={(e) => setIdFrac(parseFloat(e.target.value))}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 font-mono text-sm font-bold text-blue-400"
                    >
                      {FRACTIONS_LIST.map((f) => (
                        <option key={f.label} value={f.value}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <span className="text-xs font-mono text-slate-400 mt-1.5 block">
                    Nominal: <strong>{bronzeQuoteCalc.rawID.toFixed(2)}"</strong> → Vaciado:{" "}
                    <strong className="text-white">{bronzeQuoteCalc.adjID.toFixed(2)}"</strong>
                  </span>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
                  <span className="text-[11px] font-bold uppercase text-slate-300 block">LARGO TOTAL (Pulg)</span>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <input
                      type="number"
                      min="1"
                      value={lenWhole}
                      onChange={(e) => setLenWhole(parseInt(e.target.value) || 1)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 font-mono text-lg font-black text-blue-400"
                    />
                    <select
                      value={lenFrac}
                      onChange={(e) => setLenFrac(parseFloat(e.target.value))}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 font-mono text-sm font-bold text-blue-400"
                    >
                      {FRACTIONS_LIST.map((f) => (
                        <option key={f.label} value={f.value}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <span className="text-xs font-mono text-slate-400 mt-1.5 block">
                    Nominal: <strong>{bronzeQuoteCalc.rawLen.toFixed(2)}"</strong> → Vaciado:{" "}
                    <strong className="text-white">{bronzeQuoteCalc.adjLen.toFixed(2)}"</strong>
                  </span>
                </div>
              </div>

              {/* INDICADORES DEL EXCEL: PESO (16.948 kg), ANCHO Y ALERTA PARED */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-950/30 border border-red-500/40 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase font-bold text-red-300 block">PESO OFICIAL CALCULADO (π)</span>
                    <span className="text-3xl font-mono font-black text-white">
                      {bronzeQuoteCalc.weightKg.toFixed(3)} kg
                    </span>
                  </div>
                  <Scale className="h-8 w-8 text-red-400" />
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase font-bold text-slate-400 block">ANCHO / PARED POR LADO</span>
                    <span className="text-xl font-mono font-black text-amber-400">
                      {bronzeQuoteCalc.exactNomWall.toFixed(2)}"{" "}
                      <span className="text-sm text-slate-300">
                        ({bronzeQuoteCalc.wallPerSide.toFixed(4)}" por lado)
                      </span>
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Regla planta: 3/4" (0.750") mínimo por lado
                    </span>
                  </div>
                  {bronzeQuoteCalc.isWallThinWarning && (
                    <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
                      Pared &lt; 3/4"
                    </span>
                  )}
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-1.5">
                  <span className="font-bold uppercase text-amber-400 block">PRECIO MEDIDA FIJA (1" x 14")</span>
                  <p className="text-slate-200 font-mono">• Barra Estándar 1" x 14": <strong>$450.00 + IVA</strong></p>
                  <p className="text-slate-200 font-mono">• Barra Especial 1" x 14": <strong>$250.00 + IVA</strong></p>
                </div>
              </div>

              {/* VISTA MOBILE: TARJETAS TOUCH RESPONSIVAS (SIN SCROLL HORIZONTAL) */}
              <div className="md:hidden space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span>9 Aleaciones Disponibles</span>
                  <span className="text-[11px] text-slate-500">Toca "Elegir" para WhatsApp</span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {bronzeQuoteCalc.rows.map((r) => {
                    const isSelected = selectedBronzeForWA === r.id;
                    return (
                      <div
                        key={r.id}
                        className={`p-3.5 rounded-xl border transition ${
                          isSelected
                            ? "bg-neutral-900 border-white/40 shadow-lg"
                            : "bg-neutral-950/80 border-neutral-800 hover:border-neutral-700"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <span className="font-bold text-white text-sm block truncate">{r.name}</span>
                            <span className="text-[11px] text-slate-400 block line-clamp-1">{r.description}</span>
                          </div>
                          <button
                            onClick={() => setSelectedBronzeForWA(r.id)}
                            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition active:scale-95 ${
                              isSelected
                                ? "bg-white text-black font-bold shadow"
                                : "bg-neutral-800 text-slate-200 hover:bg-neutral-700"
                            }`}
                          >
                            {isSelected ? "✓ Seleccionado" : "Elegir"}
                          </button>
                        </div>

                        {/* PRECIOS Y COTIZACIÓN CLAVE */}
                        <div className="mt-3 grid grid-cols-2 gap-2 pt-2.5 border-t border-neutral-800/80">
                          <div className="bg-neutral-900/90 rounded-lg p-2">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Cot. Sugerida</span>
                            <span className="text-base font-bold font-mono text-white block">
                              ${r.cotSugerida.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              (${r.suggestedPriceKg}/kg)
                            </span>
                          </div>

                          <div className="bg-neutral-900/90 rounded-lg p-2">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Cot. Mínima</span>
                            <span className="text-sm font-bold font-mono text-slate-300 block">
                              ${r.cotMinima.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              (${r.minPriceKg}/kg)
                            </span>
                          </div>
                        </div>

                        {/* MEDIDA FIJA 1" x 14" */}
                        <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-neutral-900/40 px-2.5 py-1.5 rounded-md">
                          <span>1" x 14" (+ $50 corte):</span>
                          <strong className="text-slate-200">${Math.round(r.piezas1x14).toLocaleString("es-MX")}</strong>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* VISTA DESKTOP: TABLA COMPACTA (MD EN ADELANTE) */}
              <div className="hidden md:block overflow-x-auto rounded-xl border border-neutral-800">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-neutral-950 text-slate-300 border-b border-neutral-800 text-xs uppercase">
                      <th className="py-3 px-3">Aleación</th>
                      <th className="py-3 px-3 text-right">Precio Mín/kg</th>
                      <th className="py-3 px-3 text-right">Precio Sug/kg</th>
                      <th className="py-3 px-3 text-right">Cot. Mínima</th>
                      <th className="py-3 px-3 text-right">Cot. Sugerida</th>
                      <th className="py-3 px-3 text-right">Pzas 1"x14" (+$50)</th>
                      <th className="py-3 px-3 text-center">Elegir p/ WA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/70 font-mono">
                    {bronzeQuoteCalc.rows.map((r) => (
                      <tr key={r.id} className={`${r.rowColor} hover:bg-neutral-800/80 transition`}>
                        <td className="py-2.5 px-3 font-sans">
                          <span className={`font-bold block ${r.textColor}`}>{r.name}</span>
                          <span className="text-[11px] text-slate-400">{r.description}</span>
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-300">${r.minPriceKg}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-white">${r.suggestedPriceKg}</td>
                        <td className="py-2.5 px-3 text-right text-slate-200">
                          ${r.cotMinima.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-100 text-base">
                          ${r.cotSugerida.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-300">
                          ${Math.round(r.piezas1x14).toLocaleString("es-MX")}
                        </td>
                        <td className="py-2.5 px-3 text-center font-sans">
                          <button
                            onClick={() => setSelectedBronzeForWA(r.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                              selectedBronzeForWA === r.id
                                ? "bg-slate-200 text-neutral-950 shadow-sm"
                                : "bg-neutral-800 text-slate-300 hover:bg-neutral-700"
                            }`}
                          >
                            {selectedBronzeForWA === r.id ? "✓ Elegido" : "Elegir"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PANEL DERECHO: GENERADOR DE MENSAJE WHATSAPP */}
            <div className="xl:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-black text-emerald-400 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" /> Respuesta Rápida WhatsApp
                  </h3>
                  <span className="text-xs font-mono text-slate-400">Cotización Comercial</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Tabulador a Enviar</label>
                    <select
                      value={priceTierWA}
                      onChange={(e) => setPriceTierWA(e.target.value as "sugerido" | "minimo")}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 font-bold text-white"
                    >
                      <option value="sugerido">Cotización Sugerida</option>
                      <option value="minimo">Cotización Mínima</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Tiempo de Entrega</label>
                    <input
                      type="text"
                      value={deliveryTimeWA}
                      onChange={(e) => setDeliveryTimeWA(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 font-bold text-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    Teléfono del Cliente (10 dígitos para chat directo)
                  </label>
                  <input
                    type="tel"
                    placeholder="Ej. 6271234567"
                    value={clientPhoneWA}
                    onChange={(e) => setClientPhoneWA(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm font-mono"
                  />
                </div>

                <div>
                  <span className="text-xs font-bold uppercase text-slate-400 block mb-1.5">
                    Vista Previa del Mensaje Listo para el Cliente:
                  </span>
                  <pre className="bg-slate-950 border border-emerald-500/30 rounded-xl p-4 text-xs text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">
                    {whatsappGeneratedText}
                  </pre>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handleCopyWhatsApp}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition"
                >
                  {copiedWA ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-400" /> ¡Copiado al Portapapeles!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Copiar Texto para WhatsApp Web
                    </>
                  )}
                </button>

                <a
                  href={`https://wa.me/${clientPhoneWA.replace(/\D/g, "") ? (clientPhoneWA.replace(/\D/g, "").startsWith("52") ? clientPhoneWA.replace(/\D/g, "") : `52${clientPhoneWA.replace(/\D/g, "")}`) : ""}?text=${encodeURIComponent(
                    whatsappGeneratedText
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <PhoneCall className="h-4 w-4" /> Enviar por WhatsApp Directo
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            MÓDULO 2: CATÁLOGO DE BLINDAJES DE MOLINOS (MANGANESO) Y MODELOS
           ==================================================================== */}
        {activeTab === "catalogo_blindajes" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <ShieldCheck className="h-6 w-6 text-amber-400" /> Modelos Estandarizados (Blindajes de Molinos y Quebradoras)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Permite al equipo de Ventas responder al instante si FUNESMA cuenta con modelos estándar (ej. Molino de Bolas 4'x8' al Manganeso) sin demoras.
                </p>
              </div>

              <div className="relative w-full md:w-80">
                <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Buscar ej: Molino 4x8, Manganeso, Quijada..."
                  value={searchPatternQuery}
                  onChange={(e) => setSearchPatternQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {STANDARD_PATTERNS_CATALOG.filter(
                (item) =>
                  item.equipmentSpec.toLowerCase().includes(searchPatternQuery.toLowerCase()) ||
                  item.partName.toLowerCase().includes(searchPatternQuery.toLowerCase()) ||
                  item.alloyNorm.toLowerCase().includes(searchPatternQuery.toLowerCase())
              ).map((item) => (
                <div
                  key={item.code}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 hover:border-amber-500/50 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30">
                      {item.code} • {item.category}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300">
                      ✓ Modelo Físico en Almacén
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-white">{item.equipmentSpec} — {item.partName}</h3>
                    <p className="text-xs font-bold text-amber-300 mt-0.5">{item.alloyNorm}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-slate-900 p-3 rounded-lg text-xs">
                    <div>
                      <span className="text-slate-500 block">MEDIDAS PLANTA</span>
                      <span className="font-bold text-slate-200">{item.dimensionsIn}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">PESO UNITARIO</span>
                      <span className="font-mono font-bold text-white">{item.unitWeightKg} kg</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">PRECIO SUGERIDO</span>
                      <span className="font-mono font-black text-emerald-400">
                        ${(item.unitWeightKg * item.pricePerKgSuggested).toLocaleString("es-MX")} + IVA
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400">{item.notes}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====================================================================
            MÓDULO 3: TABLERO KANBAN DE PRODUCCIÓN Y TRAZABILIDAD QR
           ==================================================================== */}
        {activeTab === "kanban" && (
          <div className="space-y-4">
            {/* ENCABEZADO Y BARRA DE FILTROS COLAPSABLE */}
            <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsProductionFiltersOpen(!isProductionFiltersOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-slate-200 transition"
                  >
                    <Filter className="h-3.5 w-3.5 text-slate-400" />
                    <span>Filtros y Etapas</span>
                    {isProductionFiltersOpen ? (
                      <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                    )}
                  </button>

                  <span className="text-xs text-slate-400 hidden sm:inline">
                    {filterAlloy === "ALL" ? "Todas las aleaciones" : filterAlloy} • {selectedMobileStage === "all" ? "Todas las etapas" : selectedMobileStage}
                  </span>
                </div>

                {permissions.canCreateOrders && (
                  <button
                    onClick={() => setShowNewOrderModal(true)}
                    className="flex items-center gap-1.5 bg-white hover:bg-slate-200 text-black font-bold px-3 py-1.5 rounded-lg text-xs shadow transition"
                  >
                    <Plus className="h-4 w-4" /> Nueva OP
                  </button>
                )}
              </div>

              {/* CONTENIDO CONTRAÍBLE / COLAPSABLE DE FILTROS */}
              {isProductionFiltersOpen && (
                <div className="mt-3 pt-3 border-t border-neutral-900 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-slate-400">Aleación:</span>
                    <button
                      onClick={() => setFilterAlloy("ALL")}
                      className={`px-2.5 py-1 rounded text-xs font-semibold ${
                        filterAlloy === "ALL" ? "bg-white text-black" : "bg-neutral-900 text-slate-300 hover:bg-neutral-800"
                      }`}
                    >
                      Todas ({orders.length})
                    </button>
                    {ALLOYS_CATALOG.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => setFilterAlloy(a.id)}
                        className={`px-2.5 py-1 rounded text-xs font-semibold ${
                          filterAlloy === a.id ? "bg-white text-black" : "bg-neutral-900 text-slate-300 hover:bg-neutral-800"
                        }`}
                      >
                        {a.id}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-neutral-900">
                    <span className="text-xs text-slate-400 font-medium block mb-1.5">
                      Ver Etapa Específica (Modo Móvil):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => setSelectedMobileStage("all")}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                          selectedMobileStage === "all"
                            ? "bg-white text-black font-bold"
                            : "bg-neutral-900 text-slate-300 hover:bg-neutral-800"
                        }`}
                      >
                        Ver Todas
                      </button>
                      {KANBAN_STAGES.map((s) => {
                        const count = orders.filter((o) => o.stage === s.id && (filterAlloy === "ALL" || o.alloyId === filterAlloy)).length;
                        return (
                          <button
                            key={s.id}
                            onClick={() => setSelectedMobileStage(s.id)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 ${
                              selectedMobileStage === s.id
                                ? "bg-white text-black font-bold"
                                : "bg-neutral-900 text-slate-300 hover:bg-neutral-800"
                            }`}
                          >
                            <span>{s.label.replace(/^\d+\.\s*/, "")}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-800 text-slate-300">
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>


            {/* COLUMNAS KANBAN (RESPONSIVAS: ADAPTADAS PARA 1 SOLA O TODAS LAS ETAPAS) */}
            <div className={`grid gap-4 ${
              selectedMobileStage === "all"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
                : "grid-cols-1 max-w-2xl mx-auto"
            }`}>
              {KANBAN_STAGES.filter(
                (stage) => selectedMobileStage === "all" || selectedMobileStage === stage.id
              ).map((stage) => {
                const stageOrders = orders.filter(
                  (o) => o.stage === stage.id && (filterAlloy === "ALL" || o.alloyId === filterAlloy)
                );
                const totalStageKg = stageOrders.reduce((acc, o) => acc + o.netWeightKg * o.qty, 0);

                return (
                  <div
                    key={stage.id}
                    className="bg-neutral-950 border border-neutral-900 rounded-xl p-3.5 flex flex-col min-h-[460px]"
                  >
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-900">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${stage.badgeColor}`}>
                        {stage.label}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {stageOrders.length} OP ({totalStageKg.toFixed(0)} kg)
                      </span>
                    </div>

                    <div className="space-y-3 flex-1">
                      {stageOrders.length === 0 ? (
                        <div className="text-center py-10 text-xs text-slate-600 border border-dashed border-neutral-900 rounded-lg">
                          Sin órdenes en esta etapa
                        </div>
                      ) : (
                        stageOrders.map((order) => {
                          const alloy = ALLOYS_CATALOG.find((a) => a.id === order.alloyId);
                          const isMenuOpen = openActionMenuOrderId === order.id;

                          return (
                            <div
                              key={order.id}
                              className="relative bg-black border border-neutral-900 hover:border-neutral-700 rounded-xl p-3.5 shadow transition space-y-2.5"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-xs font-bold text-amber-400">{order.id}</span>
                                
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                                      order.priority === "Urgente"
                                        ? "bg-red-500/20 text-red-400 border border-red-500/40"
                                        : order.priority === "Alta"
                                        ? "bg-amber-500/20 text-amber-300"
                                        : "bg-neutral-900 text-slate-400"
                                    }`}
                                  >
                                    {order.priority}
                                  </span>

                                  {/* SUBMARINO / MENÚ DE 3 RAYITAS PARA ACCIONES */}
                                  <div className="relative">
                                    <button
                                      onClick={() =>
                                        setOpenActionMenuOrderId(isMenuOpen ? null : order.id)
                                      }
                                      className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-slate-300 hover:text-white transition"
                                      title="Menú de Acciones"
                                    >
                                      <Menu className="h-4 w-4" />
                                    </button>

                                    {/* POPUP SUBMARINO */}
                                    {isMenuOpen && (
                                      <div className="absolute right-0 top-8 z-40 w-48 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-1.5 space-y-1 text-xs">
                                        <button
                                          onClick={() => {
                                            setSelectedOrderQR(order);
                                            setOpenActionMenuOrderId(null);
                                          }}
                                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-800 text-slate-200 flex items-center gap-2 transition"
                                        >
                                          <QrCode className="h-3.5 w-3.5 text-amber-400" /> Ver Código QR
                                        </button>

                                        <button
                                          onClick={() => {
                                            generateQualityCertificatePDF(order);
                                            setOpenActionMenuOrderId(null);
                                          }}
                                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-800 text-slate-200 flex items-center gap-2 transition"
                                        >
                                          <Download className="h-3.5 w-3.5 text-emerald-400" /> Descargar PDF
                                        </button>

                                        <div className="border-t border-neutral-800 my-1"></div>

                                        <button
                                          onClick={() => {
                                            moveOrderStage(order.id, "prev");
                                            setOpenActionMenuOrderId(null);
                                          }}
                                          disabled={!permissions.canMoveKanban || stage.id === "modelaje"}
                                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-800 disabled:opacity-40 text-slate-300 flex items-center gap-2 transition"
                                        >
                                          <ArrowLeft className="h-3.5 w-3.5" /> Regresar Etapa
                                        </button>

                                        <button
                                          onClick={() => {
                                            moveOrderStage(order.id, "next");
                                            setOpenActionMenuOrderId(null);
                                          }}
                                          disabled={!permissions.canMoveKanban || stage.id === "calidad"}
                                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-amber-500 hover:text-black font-semibold disabled:opacity-40 text-amber-400 flex items-center gap-2 transition"
                                        >
                                          <ArrowRight className="h-3.5 w-3.5" /> Avanzar Siguiente Etapa
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-bold text-sm text-white leading-snug">{order.partName}</h4>
                                <p className="text-xs text-slate-400">{order.client}</p>
                              </div>

                              <div className="grid grid-cols-2 gap-1.5 bg-neutral-950 p-2 rounded-lg text-xs border border-neutral-900">
                                <div>
                                  <span className="text-slate-500 block text-[10px]">ALEACIÓN</span>
                                  <span className="font-semibold text-amber-300">{alloy?.id}</span>
                                </div>
                                <div>
                                  <span className="text-slate-500 block text-[10px]">CANT / PESO NETO</span>
                                  <span className="font-semibold text-white">
                                    {order.qty} pzas ({order.netWeightKg} kg)
                                  </span>
                                </div>
                                <div>
                                  <span className="text-slate-500 block text-[10px]">COLADA</span>
                                  <span className="font-mono text-slate-300">{order.heatNumber}</span>
                                </div>
                                <div>
                                  <span className="text-slate-500 block text-[10px]">MODELO</span>
                                  <span className="font-mono text-slate-300">{order.patternCode}</span>
                                </div>
                              </div>

                              {/* ACCIONES DIRECTAS TOUCH-FIRST PARA PISO */}
                              <div className="pt-1 flex items-center justify-between gap-2 border-t border-neutral-900/80">
                                <button
                                  onClick={() => moveOrderStage(order.id, "prev")}
                                  disabled={!permissions.canMoveKanban || stage.id === "modelaje"}
                                  className="flex-1 py-2 px-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 disabled:opacity-20 text-slate-300 text-xs font-medium flex items-center justify-center gap-1 transition"
                                >
                                  <ArrowLeft className="h-3.5 w-3.5" /> Ant
                                </button>

                                <button
                                  onClick={() => moveOrderStage(order.id, "next")}
                                  disabled={!permissions.canMoveKanban || stage.id === "calidad"}
                                  className="flex-1 py-2 px-2 rounded-lg bg-neutral-100 hover:bg-white disabled:opacity-20 text-black text-xs font-bold flex items-center justify-center gap-1 transition shadow"
                                >
                                  Sig <ArrowRight className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ====================================================================
            MÓDULO 4: CALCULADORAS DE FUNDICIÓN, ARENAS Y RESINAS
           ==================================================================== */}
        {activeTab === "calculadoras" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 1. Peso por Modelo y Aleación */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-lg font-black text-amber-400 flex items-center gap-2">
                  <Scale className="h-5 w-5" /> 1. Conversión Modelo Físico → Metal
                </h3>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-1.5">
                  Aleación a Vaciar en FUNESMA
                </label>
                <select
                  value={calcAlloyId}
                  onChange={(e) => setCalcAlloyId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-3 text-sm font-bold text-white"
                >
                  {ALLOYS_CATALOG.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.norm}) — {a.density} g/cm³
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Rango Óptimo de Vaciado:</span>
                  <span className="font-mono font-bold text-orange-400">
                    {selectedAlloy.pourTempMin}°C – {selectedAlloy.pourTempMax}°C
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Contracción Lineal:</span>
                  <span className="font-mono font-bold text-emerald-400">{selectedAlloy.shrinkage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Merma por Escoria:</span>
                  <span className="font-mono font-bold text-amber-300">{selectedAlloy.oxidationLoss}%</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-white">Conversión Báscula Modelo</h4>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Material del Modelo Físico</label>
                  <select
                    value={patternMat}
                    onChange={(e) => setPatternMat(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm"
                  >
                    {Object.entries(PATTERN_MATERIALS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.name} ({v.density} g/cm³)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Peso en Báscula del Modelo (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={patternWeightKg}
                    onChange={(e) => setPatternWeightKg(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-base font-mono font-bold text-amber-400"
                  />
                </div>

                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-amber-300 block">Peso Estimado en {selectedAlloy.id}:</span>
                    <span className="text-2xl font-black text-white">{weightFromPatternKg.toFixed(2)} kg</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Metal Líquido Requerido:</span>
                    <span className="text-lg font-bold text-amber-400">
                      {(weightFromPatternKg * (1 + gatingRatioPct / 100)).toFixed(2)} kg
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Geometría, Maquinado y Contracción */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-lg font-black text-amber-400 flex items-center gap-2">
                  <Calculator className="h-5 w-5" /> 2. Geometría y Contracción
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setGeoShape("buje")}
                  className={`py-2.5 rounded-xl font-bold text-xs border ${
                    geoShape === "buje"
                      ? "bg-amber-500 text-slate-950 border-amber-400"
                      : "bg-slate-950 text-slate-400 border-slate-800"
                  }`}
                >
                  Buje / Cilindro (OD / ID / L)
                </button>
                <button
                  onClick={() => setGeoShape("placa")}
                  className={`py-2.5 rounded-xl font-bold text-xs border ${
                    geoShape === "placa"
                      ? "bg-amber-500 text-slate-950 border-amber-400"
                      : "bg-slate-950 text-slate-400 border-slate-800"
                  }`}
                >
                  Placa / Bloque (L / W / E)
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    {geoShape === "buje" ? "Diámetro Ext. (mm)" : "Largo (mm)"}
                  </label>
                  <input
                    type="number"
                    value={dimOD}
                    onChange={(e) => setDimOD(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    {geoShape === "buje" ? "Diámetro Int. (mm)" : "Ancho (mm)"}
                  </label>
                  <input
                    type="number"
                    value={dimID}
                    onChange={(e) => setDimID(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    {geoShape === "buje" ? "Longitud (mm)" : "Espesor (mm)"}
                  </label>
                  <input
                    type="number"
                    value={dimLength}
                    onChange={(e) => setDimLength(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Sobremedida (mm/cara)</label>
                  <input
                    type="number"
                    value={machiningAllowanceMm}
                    onChange={(e) => setMachiningAllowanceMm(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 font-mono font-bold text-emerald-400"
                  />
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Peso Bruto Estimado:</span>
                  <span className="font-mono font-black text-white text-base">
                    {geoResults.netPartWeightKg.toFixed(2)} kg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Metal Líquido (+Colada {gatingRatioPct}%):</span>
                  <span className="font-mono font-black text-amber-400 text-base">
                    {geoResults.liquidMetalRequiredKg.toFixed(2)} kg
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800 text-xs text-slate-300">
                  <span className="font-bold text-amber-300 block mb-1">
                    Medidas para Fabricar Modelo (+{selectedAlloy.shrinkage}% contracción):
                  </span>
                  <p className="font-mono">
                    Ext: {geoResults.patternOD.toFixed(1)} mm | Int: {geoResults.patternID.toFixed(1)} mm | L: {geoResults.patternLen.toFixed(1)} mm
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Mezcla de Arenas Autofraguantes */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-lg font-black text-amber-400 flex items-center gap-2">
                  <Database className="h-5 w-5" /> 3. Mezcla de Arenas y Resinas
                </h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    Volumen Neto de Caja de Moldeo (Litros)
                  </label>
                  <input
                    type="number"
                    value={sandBoxVolLiters}
                    onChange={(e) => setSandBoxVolLiters(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    Arena Nueva ({newSandPct}%) vs. Recuperada ({100 - newSandPct}%)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={newSandPct}
                    onChange={(e) => setNewSandPct(parseInt(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">% Resina s/ Arena</label>
                    <input
                      type="number"
                      step="0.1"
                      value={resinPct}
                      onChange={(e) => setResinPct(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">% Catalizador s/ Resina</label>
                    <input
                      type="number"
                      step="1"
                      value={catalystPct}
                      onChange={(e) => setCatalystPct(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Arena Sílice Total:</span>
                  <span className="font-mono font-bold text-white">{sandMixResults.totalSandKg.toFixed(1)} kg</span>
                </div>
                <div className="border-t border-slate-800 pt-2 flex justify-between">
                  <span className="text-amber-300 font-semibold">Resina Exacta:</span>
                  <span className="font-mono font-black text-amber-400">
                    {sandMixResults.resinGrams.toFixed(0)} g ({(sandMixResults.resinGrams / 1000).toFixed(2)} kg)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-300 font-semibold">Catalizador Exacto:</span>
                  <span className="font-mono font-black text-emerald-400">
                    {sandMixResults.catalystGrams.toFixed(0)} g
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            MÓDULO 5: ESCÁNER 3D STL + REGLA DE CHVORINOV
           ==================================================================== */}
        {activeTab === "stl3d" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Box className="h-6 w-6 text-amber-400" /> Analizador Geométrico 3D (.STL) y Dimensionamiento de Mazarotas
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Carga el archivo .STL de la pieza para calcular volumen exacto mediante tetraedros firmados y el módulo térmico de Chvorinov ($M = V / A$).
                </p>
              </div>

              <label className="cursor-pointer bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg transition">
                <Upload className="h-5 w-5" /> Cargar Archivo 3D (.STL)
                <input type="file" accept=".stl" onChange={handleSTLUpload} className="hidden" />
              </label>
            </div>

            {!stlStats ? (
              <div className="border-2 border-dashed border-slate-800 rounded-2xl p-12 text-center space-y-3">
                <Box className="h-12 w-12 text-slate-600 mx-auto" />
                <p className="text-slate-300 font-bold">
                  Ningún archivo STL cargado. Sube un archivo 3D de SolidWorks, Inventor o Fusion 360.
                </p>
                <p className="text-xs text-slate-500">
                  Calcula de inmediato el peso neto exacto en Acero al Manganeso, Bronce SAE 64, Acero WCB o Aluminio.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
                  <span className="text-xs font-bold uppercase text-amber-400">Geometría Exacta 3D</span>
                  <h4 className="font-mono text-sm text-white truncate">{stlStats.fileName}</h4>
                  <div className="space-y-2 pt-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Volumen Neto ($V$):</span>
                      <span className="font-mono font-bold text-white">{stlStats.volumeCm3.toFixed(2)} cm³</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Área Superficial ($A$):</span>
                      <span className="font-mono font-bold text-white">{stlStats.areaCm2.toFixed(2)} cm²</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-2">
                      <span className="text-slate-300 font-semibold">Módulo Térmico ($M = V/A$):</span>
                      <span className="font-mono font-black text-amber-400">{stlStats.modulusCm.toFixed(3)} cm</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
                  <span className="text-xs font-bold uppercase text-emerald-400">
                    Dimensionamiento Mazarota (Chvorinov)
                  </span>
                  <p className="text-xs text-slate-400">
                    Para evitar rechupe, la mazarota requiere $M_r = 1.2 \times M_p$:
                  </p>
                  <div className="space-y-2 pt-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Módulo Mazarota ($M_r$):</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {stlStats.recommendedRiserModulusCm.toFixed(3)} cm
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Diámetro Sugerido ($D$):</span>
                      <span className="font-mono font-black text-white">
                        {stlStats.recommendedRiserDiameterMm.toFixed(0)} mm
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Altura Sugerida ($H = 1.5D$):</span>
                      <span className="font-mono font-black text-white">
                        {stlStats.recommendedRiserHeightMm.toFixed(0)} mm
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-2.5">
                  <span className="text-xs font-bold uppercase text-amber-400">
                    Peso Neto del Modelo por Aleación
                  </span>
                  {ALLOYS_CATALOG.map((a) => (
                    <div key={a.id} className="flex justify-between text-sm border-b border-slate-900 pb-1">
                      <span className="text-slate-400">{a.name}:</span>
                      <span className="font-mono font-bold text-white">
                        {((stlStats.volumeCm3 * a.density) / 1000).toFixed(2)} kg
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ====================================================================
            MÓDULO 6: OPTIMIZADOR SIMPLEX DE CARGA DE HORNO (LP-SOLVER)
           ==================================================================== */}
        {activeTab === "simplex" && permissions.canUseSimplex && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Scale className="h-6 w-6 text-amber-400" /> Optimizador de Carga de Horno al Mínimo Costo (Método Simplex)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Resuelve con Programación Lineal (`javascript-lp-solver`) los kilos exactos de retorno, chatarra y ferroaleaciones para dar la química al menor costo posible.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block">Aleación Objetivo</label>
                  <select
                    value={targetAlloySimplex}
                    onChange={(e) => setTargetAlloySimplex(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-amber-400"
                  >
                    <option value="WCB">Acero al Carbón WCB</option>
                    <option value="MN-A128">Acero al Manganeso ASTM A128</option>
                    <option value="CA15">Acero Inoxidable CA-15</option>
                    <option value="GG25">Hierro Gris GG25</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block">Carga Total (kg)</label>
                  <input
                    type="number"
                    value={targetChargeKg}
                    onChange={(e) => setTargetChargeKg(parseFloat(e.target.value) || 100)}
                    className="w-28 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono font-bold text-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase text-slate-300">
                  Patio de Chatarra y Ferroaleaciones Disponibles
                </h3>
                <div className="space-y-2">
                  {scrapList.map((mat) => (
                    <div
                      key={mat.id}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-white block text-sm">{mat.name}</span>
                        <span className="font-mono text-slate-400">
                          {Object.entries(mat.composition)
                            .map(([el, val]) => `${el}: ${val}%`)
                            .join(" | ")}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-emerald-400 block">
                          ${mat.costPerKg.toFixed(2)} MXN/kg
                        </span>
                        <span className="text-slate-500">Stock: {mat.stockKg} kg</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs uppercase font-bold text-amber-400 block">
                      Receta Óptima Calculada por Simplex
                    </span>
                    <h4 className="text-lg font-black text-white">
                      Colada de {targetChargeKg} kg — {simplexSolution.alloy.name}
                    </h4>
                  </div>
                  {simplexSolution.result.feasible ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Factible • Óptimo
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/40">
                      Requiere Ajuste de Insumos
                    </span>
                  )}
                </div>

                <div className="space-y-2.5">
                  {scrapList.map((mat) => {
                    const kgToLoad = Number(simplexSolution.result[mat.id] || 0);
                    const pctOfCharge = (kgToLoad / targetChargeKg) * 100;
                    return (
                      <div key={mat.id} className="flex items-center justify-between text-sm border-b border-slate-900 pb-2">
                        <span className="text-slate-300">{mat.name}</span>
                        <div className="text-right font-mono">
                          <span className="font-black text-amber-400 text-base">{kgToLoad.toFixed(2)} kg</span>
                          <span className="text-xs text-slate-500 ml-2">({pctOfCharge.toFixed(1)}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {permissions.canViewCosts && simplexSolution.result.feasible && (
                  <div className="bg-emerald-950/40 border border-emerald-700/40 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-emerald-300 block">Costo Total Metal Cargado:</span>
                      <span className="text-2xl font-black text-white">
                        ${Number(simplexSolution.result.result || 0).toLocaleString("es-MX", { maximumFractionDigits: 2 })} MXN
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Costo Promedio / kg:</span>
                      <span className="text-lg font-mono font-bold text-emerald-400">
                        ${(Number(simplexSolution.result.result || 0) / targetChargeKg).toFixed(2)} MXN/kg
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            MÓDULO 7: HORNOS, CRISOLES Y ANALÍTICA DE PLANTA
           ==================================================================== */}
        {activeTab === "hornos" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-amber-400" /> Vida Útil de Refractarios y Crisoles
              </h3>
              <div className="space-y-3">
                {furnaces.map((f, idx) => {
                  const pct = Math.min(100, Math.round((f.heats / f.maxHeats) * 100));
                  const isWarning = pct >= 80;
                  return (
                    <div key={f.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono text-xs text-amber-400 font-bold">{f.id}</span>
                          <h4 className="font-bold text-sm text-white">{f.name}</h4>
                        </div>
                        <button
                          onClick={() => {
                            const updated = [...furnaces];
                            updated[idx].heats += 1;
                            setFurnaces(updated);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs"
                        >
                          +1 Colada
                        </button>
                      </div>

                      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${isWarning ? "bg-red-500" : "bg-emerald-500"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-xs text-slate-400 font-mono">
                        <span>
                          Coladas acumuladas: {f.heats} / {f.maxHeats} ({pct}%)
                        </span>
                        {isWarning && (
                          <span className="text-red-400 font-bold flex items-center gap-1">
                            <AlertTriangle className="h-3.5 w-3.5" /> Programar Revestimiento
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-lg font-black text-white">
                Balance de Metal Neto vs. Metal Líquido Requerido (kg)
              </h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#fff" }}
                    />
                    <Legend />
                    <Bar dataKey="PesoNetoKg" name="Peso Neto Piezas (kg)" fill="#10b981" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="MetalLiquidoKg" name="Metal Líquido Total (kg)" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            MÓDULO 8: ADMINISTRACIÓN DE USUARIOS Y ROLES (RBAC)
           ==================================================================== */}
        {activeTab === "usuarios" && permissions.canManageUsers && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <form
              onSubmit={handleAddUser}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 h-fit"
            >
              <h3 className="text-lg font-black text-amber-400 flex items-center gap-2">
                <Plus className="h-5 w-5" /> Dar de Alta Usuario en Planta
              </h3>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Ej. Ing. Roberto Méndez"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="roberto@funesma.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Rol y Nivel de Acceso (RBAC)</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as Role)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-bold text-amber-400"
                >
                  <option value="super_admin">Super Admin / Dirección (Total)</option>
                  <option value="jefe_planta">Jefe de Planta / Ingeniería</option>
                  <option value="operador">Operador de Piso (Moldeo / Fusión)</option>
                  <option value="almacen">Almacén de Modelos y Chatarra</option>
                  <option value="ventas">Ventas y Cotizaciones</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl shadow-lg transition"
              >
                Guardar y Activar Usuario
              </button>
            </form>

            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-lg font-black text-white">Directorio de Usuarios y Permisos Activos</h3>
              <div className="space-y-2.5">
                {users.map((u) => (
                  <div
                    key={u.id}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div>
                      <span className="font-bold text-white text-sm block">{u.name}</span>
                      <span className="text-xs text-slate-400 font-mono">{u.email}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={u.role}
                        onChange={(e) => {
                          const newR = e.target.value as Role;
                          setUsers(users.map((item) => (item.id === u.id ? { ...item, role: newR } : item)));
                        }}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-bold text-amber-400"
                      >
                        <option value="super_admin">super_admin</option>
                        <option value="jefe_planta">jefe_planta</option>
                        <option value="operador">operador</option>
                        <option value="almacen">almacen</option>
                        <option value="ventas">ventas</option>
                      </select>

                      <button
                        onClick={() =>
                          setUsers(users.map((item) => (item.id === u.id ? { ...item, active: !item.active } : item)))
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                          u.active ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {u.active ? "Activo" : "Suspendido"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL QR DE TRAZABILIDAD */}
      {selectedOrderQR && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-center space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="font-mono font-black text-amber-400">{selectedOrderQR.id}</span>
              <button
                onClick={() => setSelectedOrderQR(null)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                Cerrar ✕
              </button>
            </div>
            <h3 className="text-lg font-black text-white">{selectedOrderQR.partName}</h3>
            <p className="text-xs text-slate-400">
              Cliente: {selectedOrderQR.client} | Colada: {selectedOrderQR.heatNumber}
            </p>
            <div className="bg-white p-5 rounded-2xl w-fit mx-auto">
              <QRCodeSVG
                value={JSON.stringify({
                  op: selectedOrderQR.id,
                  heat: selectedOrderQR.heatNumber,
                  alloy: selectedOrderQR.alloyId,
                  stage: selectedOrderQR.stage
                })}
                size={190}
              />
            </div>
            <p className="text-xs text-slate-400">
              Escanea este código QR desde iPhone o Android en piso para inspeccionar o avanzar etapa.
            </p>
          </div>
        </div>
      )}

      {/* MODAL CREAR NUEVA OP */}
      {showNewOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateOrder}
            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-amber-400">Crear Nueva Orden de Producción (OP)</h3>
              <button
                type="button"
                onClick={() => setShowNewOrderModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="col-span-2">
                <label className="text-xs text-slate-400 block mb-1">Cliente</label>
                <input
                  type="text"
                  required
                  value={newOrderForm.client}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, client: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2"
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-slate-400 block mb-1">Nombre de la Pieza</label>
                <input
                  type="text"
                  required
                  value={newOrderForm.partName}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, partName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Código de Modelo</label>
                <input
                  type="text"
                  required
                  value={newOrderForm.patternCode}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, patternCode: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Aleación</label>
                <select
                  value={newOrderForm.alloyId}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, alloyId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 font-bold text-amber-400"
                >
                  {ALLOYS_CATALOG.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.id} — {a.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Cantidad de Piezas</label>
                <input
                  type="number"
                  min="1"
                  value={newOrderForm.qty}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, qty: parseInt(e.target.value) || 1 })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Peso Neto Unitario (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  value={newOrderForm.netWeightKg}
                  onChange={(e) => {
                    const net = parseFloat(e.target.value) || 0;
                    setNewOrderForm({ ...newOrderForm, netWeightKg: net, grossWeightKg: Number((net * 1.45).toFixed(1)) });
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl shadow-lg"
            >
              Registrar OP en Tablero de Piso
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
