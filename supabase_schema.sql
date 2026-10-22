-- Esquema Oficial FUNESMA MES para Supabase (PostgreSQL)
-- Ejecutar este script en el SQL Editor de tu proyecto Supabase para habilitar sincronización en tiempo real y seguridad RLS.

CREATE TYPE user_role AS ENUM ('super_admin', 'jefe_planta', 'operador', 'almacen', 'ventas');
CREATE TYPE op_stage AS ENUM ('modelaje', 'moldeo', 'fusion', 'limpieza', 'tratamiento_maquinado', 'calidad_embarque');

-- 1. Perfiles de usuario y roles RBAC
CREATE TABLE IF NOT EXISTS public.users_profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'operador',
    phone TEXT,
    shift TEXT DEFAULT 'Matutino',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Catálogo Oficial de Aleaciones y Normas
CREATE TABLE IF NOT EXISTS public.alloys_catalog (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    norm TEXT NOT NULL,
    category TEXT NOT NULL, -- Acero, Bronce, Aluminio, Hierro
    density_g_cm3 NUMERIC(5,2) NOT NULL,
    shrinkage_pct NUMERIC(4,2) NOT NULL,
    pour_temp_min INT NOT NULL,
    pour_temp_max INT NOT NULL,
    oxidation_loss_pct NUMERIC(4,2) NOT NULL,
    chem_specs JSONB NOT NULL -- Ej: {"C": [0.20, 0.30], "Mn": [0.60, 1.00], "Si": [0.30, 0.60]}
);

-- 3. Órdenes de Producción (OP) con Trazabilidad de Colada
CREATE TABLE IF NOT EXISTS public.production_orders (
    id TEXT PRIMARY KEY, -- Ej: OP-2601
    client_name TEXT NOT NULL,
    part_name TEXT NOT NULL,
    pattern_code TEXT NOT NULL,
    alloy_id TEXT REFERENCES public.alloys_catalog(id),
    quantity INT NOT NULL,
    net_weight_kg NUMERIC(10,2) NOT NULL,
    gross_weight_kg NUMERIC(10,2) NOT NULL,
    stage op_stage NOT NULL DEFAULT 'modelaje',
    priority TEXT NOT NULL DEFAULT 'Normal',
    heat_number TEXT,
    pour_temp_recorded INT,
    brinell_hardness INT,
    chem_result JSONB,
    notes TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Bitácora de Desgaste de Hornos y Crisoles
CREATE TABLE IF NOT EXISTS public.furnace_linings (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- Induccion, Crisol
    current_heats INT NOT NULL DEFAULT 0,
    max_heats INT NOT NULL DEFAULT 120,
    status TEXT DEFAULT 'Operativo',
    last_relining_date DATE DEFAULT CURRENT_DATE
);

-- 5. Catálogo de Modelos Estandarizados (Blindajes de Molinos y Quebradoras)
CREATE TABLE IF NOT EXISTS public.standard_patterns (
    code TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    equipment_spec TEXT NOT NULL,
    part_name TEXT NOT NULL,
    alloy_norm TEXT NOT NULL,
    dimensions_in TEXT NOT NULL,
    unit_weight_kg NUMERIC(10,2) NOT NULL,
    price_per_kg_suggested NUMERIC(10,2) NOT NULL,
    in_stock_pattern BOOLEAN DEFAULT true,
    lead_time_days TEXT NOT NULL,
    notes TEXT
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.furnace_linings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.standard_patterns ENABLE ROW LEVEL SECURITY;

-- Políticas de Acceso:
-- Permitir lectura y escritura autenticada o anónima según configuración
CREATE POLICY "Acceso público lectura catálogos" ON public.standard_patterns FOR SELECT USING (true);
CREATE POLICY "Acceso total lectura OPs" ON public.production_orders FOR ALL USING (true);
CREATE POLICY "Acceso total hornos" ON public.furnace_linings FOR ALL USING (true);
CREATE POLICY "Acceso total usuarios" ON public.users_profile FOR ALL USING (true);
