const translations = {
    en: {
        nav: {
            home: "Home",
            materials: "Materials",
            services: "Services",
            catalog: "Catalog",
            contact: "Contact Us",
            quote: "Request Quote"
        },
        hero: {
            title: "Excellence in Casting & Manufacturing",
            subtitle: "Forging the Future of Industrial Infrastructure. Precision casting and advanced manufacturing for a new era of engineering.",
            cta_catalog: "View Catalog",
            cta_quote: "Request Quote"
        },

        features: {
            nearshoring_title: "Your Strategic Nearshoring Partner",
            nearshoring_desc: "Located in Chihuahua, Mexico with distribution in El Paso, Texas. We offer the logistical advantages of domestic manufacturing with competitive global pricing.",
            quality_title: "Certified Quality",
            quality_desc: "ISO 9001:2015 compliant processes. In-house spectrometry and mechanical testing ensure every pour meets your exact specifications.",
            turnkey_title: "Turnkey Solutions",
            turnkey_desc: "Vertical integration from pattern making to final machining reduces lead times and simplifies your supply chain."
        },
        process: {
            title: "Our Manufacturing Process",
            step1_title: "Consultation",
            step1_desc: "Engineering review and design optimization.",
            step2_title: "Pattern Making",
            step2_desc: "Precision tooling creation.",
            step3_title: "Casting",
            step3_desc: "High-quality alloy pouring.",
            step4_title: "Machining",
            step4_desc: "CNC finishing to exact tolerances.",
            step5_title: "Quality Control",
            step5_desc: "Rigorous testing and certification."
        },
        industries: {
            title: "Industries Served",
            mining: "Mining & Crushing",
            automotive: "Automotive",
            agriculture: "Agriculture",
            oil_gas: "Oil & Gas",
            rail: "Rail & Transport"
        },
        home_about: {
            title: "World-Class Manufacturing",
            description: "With over 30 years of experience, we specialize in high-quality casting and machining. From reverse engineering to finished parts, we deliver precision in Bronze, Steel, and Aluminum.",
            foundation: "Founded: October 17, 1988",
            capacity: "Installed Capacity: 50 Tons/Month",
            solar: "Clean Energy: 39.5 MW/Month (100% Solar)"
        },
        materials: {
            title: "Material Specifications",
            bronze: "Bronze Alloys",
            steel: "Steel Alloys",
            aluminum: "Aluminum Alloys",
            desc: "We adhere to strict international standards (ASTM, SAE, DIN) for all our alloys."
        },
        services: {
            title: "Our Industrial Services",
            casting: "Casting",
            machining: "Machining",
            reverse_engineering: "Reverse Engineering",
            pattern_making: "Specialized Services",
            modal_cta: "Get a Quote Now",
            details: {
                casting: "Our foundry utilizes advanced sand and permanent mold processes. We handle Bronze (up to 500kg) and Steel/Iron (up to 2,000kg). We specialize in complex geometries and ensure porosity-free castings for critical applications.",
                machining: "State-of-the-art technology for precision results. Our capabilities include: Precision Turning (CNC & Conventional), CNC Milling (Vertical Machining Centers), Surface Grinding, and Gear/Crown manufacturing.",
                reverse_engineering: "We breathe new life into obsolete machinery. Services include: CAD Drawing generation, 3D Scanning, and material hardness analysis to recreate parts with improved properties.",
                pattern_making: "In-house pattern shop for rapid tooling development. We also offer Heat Treatments, Welding/Boilermaking, and a certified Laboratory for material analysis."
            }
        },
        catalog: {
            title: "Product Catalog",
            filter_all: "All",
            filter_bronze: "Bronze",
            filter_steel: "Steel",
            filter_aluminum: "Aluminum",
            category_bronze: "Bronze",
            features_title: "Key Features",
            applications_title: "Common Applications",
            products: {
                bar_stock: {
                    name: "Solid Bronze Bar Stock",
                    desc: "High quality solid bronze bars.",
                    features: ["Consistent grain structure", "Excellent machinability", "Uniform hardness"],
                    applications: ["General machining", "Custom bushings", "Prototype parts"]
                },
                c93200: {
                    name: "Bronze SAE 660 (UNS C93200)",
                    desc: "Standard bronze for bushings and bearings. High lead content.",
                    features: ["Excellent anti-friction properties", "Good machinability", "Resistant to wear"],
                    applications: ["General utility bearings", "Bushings", "Wear plates"]
                },
                c93700: {
                    name: "Bronze SAE 64 (UNS C93700)",
                    desc: "Leaded phosphor bronze. For high speed and pressure applications.",
                    features: ["High strength", "Corrosion resistant", "Excellent for heavy loads"],
                    applications: ["High-speed bearings", "Pump impellers", "Pressure-tight castings"]
                },
                c93800: {
                    name: "Bronze SAE 67 (UNS C93800)",
                    desc: "High lead bronze. Soft anti-friction alloy.",
                    features: ["Superior anti-friction", "Conformability", "Embeddability"],
                    applications: ["Railroad bearings", "Acid-resisting pumps", "Backing for babbitt-lined bearings"]
                },
                c90500: {
                    name: "Bronze SAE 62 (UNS C90500)",
                    desc: "Gunmetal (G Bronze). Hard and corrosion resistant.",
                    features: ["High tensile strength", "Saltwater corrosion resistance", "Wear resistance"],
                    applications: ["Marine fittings", "Gears", "Valve bodies"]
                },
                c90700: {
                    name: "Bronze SAE 65 (UNS C90700)",
                    desc: "Pure tin bronze. For heavy-load gears.",
                    features: ["High hardness", "Good ductility", "Impact resistance"],
                    applications: ["Worm gears", "Heavy-load bearings", "Structural parts"]
                },
                c95200: {
                    name: "Bronze SAE 68 A (UNS C95200)",
                    desc: "Aluminum bronze. Tough and resistant.",
                    features: ["High strength", "Corrosion resistance", "Good fatigue strength"],
                    applications: ["Marine hardware", "Pickling hooks", "Non-sparking tools"]
                },
                c95400: {
                    name: "Bronze SAE 68 B (UNS C95400)",
                    desc: "Heat-treated aluminum bronze. The most wear-resistant alloy.",
                    features: ["Extreme hardness", "High tensile strength", "Abrasion resistance"],
                    applications: ["Heavy duty gears", "Wear plates", "Forming dies"]
                },
                c83600: {
                    name: "Bronze SAE 40 (UNS C83600)",
                    desc: "Leaded red brass. For plumbing and water pumps.",
                    features: ["Excellent castability", "Pressure tightness", "Moderate strength"],
                    applications: ["Valves", "Pipe fittings", "Pump bodies"]
                },
                c86500: {
                    name: "Bronze SAE 43 (UNS C86500)",
                    desc: "High-strength manganese bronze.",
                    features: ["Very high strength", "Toughness", "Corrosion resistance"],
                    applications: ["Propellers", "Marine hardware", "Heavy-duty brackets"]
                },

                gray_iron: {
                    name: "Gray Iron",
                    desc: "Excellent machinability and vibration damping. Ideal for engine blocks, flywheels, and machine bases.",
                    features: ["Vibration damping", "High compressive strength", "Good machinability"],
                    applications: ["Engine blocks", "Machine bases", "Flywheels"]
                },
                ductile_iron: {
                    name: "Ductile Iron (Nodular)",
                    desc: "High strength and ductility. Used for crankshafts, gears, and heavy-duty suspension components.",
                    features: ["High ductility", "Impact resistance", "Good machinability"],
                    applications: ["Crankshafts", "Gears", "Suspension parts"]
                },
                high_chrome_iron: {
                    name: "High Chrome Iron",
                    desc: "Extreme abrasion resistance. Perfect for mining crushers, pump impellers, and liners.",
                    features: ["Extreme hardness", "Abrasion resistance", "Corrosion resistance"],
                    applications: ["Mining crushers", "Pump liners", "Grinding balls"]
                },
                carbon_steel: {
                    name: "Carbon Steel",
                    desc: "Versatile and strong. Structural components, shafts, and general machinery parts.",
                    features: ["High strength", "Weldability", "Versatility"],
                    applications: ["Structural components", "Shafts", "Gears"]
                },
                manganese_steel: {
                    name: "Manganese Steel",
                    desc: "Work-hardening steel. The ultimate choice for impact resistance in crushing equipment.",
                    features: ["Work hardening", "High impact strength", "Wear resistance"],
                    applications: ["Crusher jaws", "Impact hammers", "Railroad crossings"]
                },
                stainless_steel: {
                    name: "Stainless Steel",
                    desc: "Corrosion resistant. Essential for food processing, chemical, and marine applications.",
                    features: ["Corrosion resistance", "Hygiene", "Heat resistance"],
                    applications: ["Food processing equipment", "Chemical tanks", "Marine fittings"]
                }
            }
        },
        quote: {
            title: "Request a Quote",
            subtitle: "Ready to start your project? Choose how you'd like to provide your details.",
            mode_form: "Fill a Form",
            mode_chat: "Interactive Chat",
            form: {
                client_info: "Client Information",
                name: "Full Name",
                email: "Email Address",
                phone: "Phone Number",
                company_info: "Company Details",
                company_name: "Company Name",
                industry: "Industry",
                location: "Location (City/Country)",
                project_info: "Project Requirements",
                project_type: "Project Type (Casting, Machining, etc.)",
                material: "Material / Alloy",
                quantity: "Estimated Quantity",
                description: "Project Description / Specifications",
                submit: "Submit Request"
            },
            chat: {
                welcome: "Hello! I'm your virtual assistant. I'll help you build your quote request step-by-step. First, what is your full name?",
                q_email: "Nice to meet you, {name}. What is your email address?",
                q_company: "Great. What is the name of your company?",
                q_project: "Thanks. Briefly describe your project or what you need from us.",
                done: "Perfect! We have your details. A specialist will contact you shortly at {email}."
            }
        },
        about: {
            title: "Our Legacy",
            subtitle: "Over 30 years of excellence in industrial casting and machining.",
            story_title: "Our Story",
            story_text: "With over three decades of experience, FUNESMA has positioned itself as the premier partner for industrial casting and machining. We provide a superior alternative to imported spare parts, guaranteeing cost efficiency, unmatched quality, and rapid delivery times. We proudly supply certified bronze bars and bushings across North America.",
            mission_title: "Mission",
            mission_text: "To exceed client expectations in quality, delivery, and cost, while continuously improving our services and partnerships.",
            vision_title: "Vision",
            vision_text: "To be the internationally recognized leader in high-quality industrial products manufactured in Mexico.",
            values_title: "Core Values",
            value_growth: "Sustained Growth",
            value_trust: "Responsibility & Trust",
            value_people: "Empowered People",
            value_honesty: "Honesty & Integrity"
        },
        contact: {
            title: "Contact Us",
            form_name: "Name",
            form_email: "Email",
            form_message: "Message",
            form_submit: "Send Message",
            info_title: "Get in Touch"
        },
        footer: {
            rights: "© 2024 Funesma & Loya Industrial Castings. All rights reserved.",
            contact: "Contact",
            desc: "World-class industrial castings and machining solutions.",
            address: "Locations",
            sitemap_title: "Sitemap",
            contact_title: "Contact Us",
            social_title: "Follow Us",
            privacy: "Privacy Policy",
            terms: "Terms of Service"
        }
    },
    es: {
        nav: {
            home: "Inicio",
            about: "Conócenos",
            materials: "Materiales",
            services: "Servicios",
            catalog: "Catálogo",
            contact: "Contacto",
            quote: "Cotizar"
        },
        hero: {
            title: "Excelencia en Fundición y Manufactura",
            subtitle: "Forjando el Futuro de la Infraestructura Industrial. Fundición de precisión y manufactura avanzada para una nueva era de ingeniería.",
            cta_catalog: "Ver Catálogo",
            cta_quote: "Solicitar Cotización"
        },

        features: {
            nearshoring_title: "Su Socio Estratégico en Nearshoring",
            nearshoring_desc: "Ubicados en Chihuahua, México con distribución en El Paso, Texas. Ofrecemos las ventajas logísticas de la manufactura doméstica con precios competitivos globales.",
            quality_title: "Calidad Certificada",
            quality_desc: "Procesos bajo norma ISO 9001:2015. Espectrometría interna y pruebas mecánicas aseguran que cada colada cumpla sus especificaciones exactas.",
            turnkey_title: "Soluciones Integrales",
            turnkey_desc: "Integración vertical desde la fabricación de modelos hasta el maquinado final reduce tiempos de entrega y simplifica su cadena de suministro."
        },
        process: {
            title: "Nuestro Proceso de Manufactura",
            step1_title: "Consulta",
            step1_desc: "Revisión de ingeniería y optimización de diseño.",
            step2_title: "Modelado",
            step2_desc: "Creación de herramental de precisión.",
            step3_title: "Fundición",
            step3_desc: "Vaciado de aleaciones de alta calidad.",
            step4_title: "Maquinado",
            step4_desc: "Acabado CNC a tolerancias exactas.",
            step5_title: "Control de Calidad",
            step5_desc: "Pruebas rigurosas y certificación."
        },
        industries: {
            title: "Industrias Atendidas",
            mining: "Minería y Trituración",
            automotive: "Automotriz",
            agriculture: "Agricultura",
            oil_gas: "Petróleo y Gas",
            rail: "Ferrocarril y Transporte"
        },
        home_about: {
            title: "Manufactura de Clase Mundial",
            description: "Con más de 30 años de experiencia, nos especializamos en fundición y maquinado de alta calidad. Desde ingeniería inversa hasta piezas terminadas, entregamos precisión en Bronce, Acero y Aluminio.",
            foundation: "Fundación: 17 de Octubre 1988",
            capacity: "Capacidad Instalada: 50 Toneladas/Mes",
            solar: "Energía Limpia: 39.5 MW/Mes (100% Solar)"
        },
        materials: {
            title: "Especificaciones de Materiales",
            bronze: "Aleaciones de Bronce",
            steel: "Aleaciones de Acero",
            aluminum: "Aleaciones de Aluminio",
            desc: "Nos apegamos a estrictas normas internacionales (ASTM, SAE, DIN) para todas nuestras aleaciones."
        },
        services: {
            title: "Nuestros Servicios Industriales",
            casting: "Fundición",
            machining: "Maquinado",
            reverse_engineering: "Ingeniería Inversa",
            pattern_making: "Servicios Especializados",
            modal_cta: "Solicitar Cotización Ahora",
            details: {
                casting: "Nuestra fundición utiliza procesos avanzados de arena y molde permanente. Manejamos Bronce (hasta 500kg) y Acero/Hierro (hasta 2,000kg). Nos especializamos en geometrías complejas asegurando piezas libres de porosidad.",
                machining: "Tecnología de punta para resultados precisos. Nuestras capacidades incluyen: Torneado de Precisión (CNC y Convencional), Fresado CNC (Centros de Maquinado Vertical), Rectificado de Superficies y Fabricación de Engranes/Coronas.",
                reverse_engineering: "Damos nueva vida a maquinaria obsoleta. Servicios incluyen: Generación de Dibujos CAD, Escaneo 3D y Análisis de Dureza para recrear piezas con propiedades mejoradas.",
                pattern_making: "Taller interno de modelos para desarrollo rápido de herramental. También ofrecemos Tratamientos Térmicos, Pailería y Soldadura, y Laboratorio Certificado para análisis de materiales."
            }
        },
        catalog: {
            title: "Catálogo de Productos",
            filter_all: "Todos",
            filter_bronze: "Bronce",
            filter_steel: "Acero",
            filter_aluminum: "Aluminio",
            category_bronze: "Bronce",
            features_title: "Características Clave",
            applications_title: "Aplicaciones Comunes",
            products: {
                bar_stock: {
                    name: "Barra de Bronce Sólido",
                    desc: "Barras de bronce sólido de alta calidad.",
                    features: ["Estructura de grano consistente", "Excelente maquinabilidad", "Dureza uniforme"],
                    applications: ["Maquinado general", "Bujes personalizados", "Piezas prototipo"]
                },
                c84400: {
                    name: "Bronce ESTANDAR (UNS C84400)",
                    desc: "El mejor bronce para uso en general. Mejor equilibrio de costo y prestación. Dureza uniforme.",
                    features: ["Costo efectivo", "Buena maquinabilidad", "Propiedades generales decentes"],
                    applications: ["Accesorios de plomería", "Hardware general", "Componentes de baja presión"]
                },
                c93200: {
                    name: "Bronce SAE 660 (UNS C93200)",
                    desc: "Bronce estándar para bujes y cojinetes (Alta plomo).",
                    features: ["Excelentes propiedades antifricción", "Buena maquinabilidad", "Resistente al desgaste"],
                    applications: ["Cojinetes de uso general", "Bujes", "Placas de desgaste"]
                },
                c93700: {
                    name: "Bronce SAE 64 (UNS C93700)",
                    desc: "Bronce fosforado al plomo (Para alta velocidad/presión).",
                    features: ["Alta resistencia", "Resistente a la corrosión", "Excelente para cargas pesadas"],
                    applications: ["Cojinetes de alta velocidad", "Impulsores de bombas", "Fundiciones herméticas a presión"]
                },
                c93800: {
                    name: "Bronce SAE 67 (UNS C93800)",
                    desc: "Bronce de alto plomo (Antifricción 'suave').",
                    features: ["Antifricción superior", "Conformabilidad", "Incrustabilidad"],
                    applications: ["Cojinetes de ferrocarril", "Bombas resistentes al ácido", "Respaldo para cojinetes revestidos de babbitt"]
                },
                c90500: {
                    name: "Bronce SAE 62 (UNS C90500)",
                    desc: "'Gunmetal' (Bronce G), duro y resistente a corrosión.",
                    features: ["Alta resistencia a la tracción", "Resistencia a la corrosión por agua salada", "Resistencia al desgaste"],
                    applications: ["Accesorios marinos", "Engranajes", "Cuerpos de válvulas"]
                },
                c90700: {
                    name: "Bronce SAE 65 (UNS C90700)",
                    desc: "Bronce al estaño puro (Para engranajes de carga pesada).",
                    features: ["Alta dureza", "Buena ductilidad", "Resistencia al impacto"],
                    applications: ["Engranajes sin fin", "Cojinetes de carga pesada", "Partes estructurales"]
                },
                c95200: {
                    name: "Bronce SAE 68 A (UNS C95200)",
                    desc: "Bronce al aluminio (Tenaz y resistente).",
                    features: ["Alta resistencia", "Resistencia a la corrosión", "Buena resistencia a la fatiga"],
                    applications: ["Hardware marino", "Ganchos de decapado", "Herramientas antichispa"]
                },
                c95400: {
                    name: "Bronce SAE 68 B (UNS C95400)",
                    desc: "Bronce al aluminio tratado térmicamente (El más resistente al desgaste).",
                    features: ["Dureza extrema", "Alta resistencia a la tracción", "Resistencia a la abrasión"],
                    applications: ["Engranajes de servicio pesado", "Placas de desgaste", "Matrices de conformado"]
                },
                c83600: {
                    name: "Bronce SAE 40 (UNS C83600)",
                    desc: "Latón rojo con plomo (Para grifería y bombas de agua).",
                    features: ["Excelente colabilidad", "Hermeticidad a presión", "Resistencia moderada"],
                    applications: ["Válvulas", "Accesorios de tubería", "Cuerpos de bombas"]
                },
                c86500: {
                    name: "Bronce SAE 43 (UNS C86500)",
                    desc: "Bronce al manganeso de alta resistencia.",
                    features: ["Muy alta resistencia", "Tenacidad", "Resistencia a la corrosión"],
                    applications: ["Hélices", "Hardware marino", "Soportes de servicio pesado"]
                },
                gray_iron: {
                    name: "Fierro Gris",
                    desc: "Excelente maquinabilidad y amortiguación de vibraciones. Ideal para bloques de motor y bases de máquinas.",
                    features: ["Amortiguación de vibraciones", "Alta resistencia a la compresión", "Buena maquinabilidad"],
                    applications: ["Bloques de motor", "Bases de máquinas", "Volantes"]
                },
                ductile_iron: {
                    name: "Hierro Nodular",
                    desc: "Alta resistencia y ductilidad. Usado para cigüeñales, engranes y componentes de suspensión pesada.",
                    features: ["Alta ductilidad", "Resistencia al impacto", "Buena maquinabilidad"],
                    applications: ["Cigüeñales", "Engranajes", "Partes de suspensión"]
                },
                high_chrome_iron: {
                    name: "Hierro Alto Cromo",
                    desc: "Resistencia extrema a la abrasión. Perfecto para trituradoras mineras, impulsores de bombas y revestimientos.",
                    features: ["Dureza extrema", "Resistencia a la abrasión", "Resistencia a la corrosión"],
                    applications: ["Trituradoras mineras", "Revestimientos de bombas", "Bolas de molienda"]
                },
                carbon_steel: {
                    name: "Aceros al Carbón",
                    desc: "Versátil y fuerte. Componentes estructurales, ejes y partes de maquinaria general.",
                    features: ["Alta resistencia", "Soldabilidad", "Versatilidad"],
                    applications: ["Componentes estructurales", "Ejes", "Engranajes"]
                },
                manganese_steel: {
                    name: "Aceros al Manganeso",
                    desc: "Acero que se endurece con el trabajo. La mejor opción para resistencia al impacto en equipos de trituración.",
                    features: ["Endurecimiento por trabajo", "Alta resistencia al impacto", "Resistencia al desgaste"],
                    applications: ["Mandíbulas de trituradora", "Martillos de impacto", "Cruces de ferrocarril"]
                },
                stainless_steel: {
                    name: "Aceros Inoxidables",
                    desc: "Resistente a la corrosión. Esencial para procesamiento de alimentos, química y aplicaciones marinas.",
                    features: ["Resistencia a la corrosión", "Higiene", "Resistencia al calor"],
                    applications: ["Equipos de procesamiento de alimentos", "Tanques químicos", "Accesorios marinos"]
                }
            }
        },
        quote: {
            title: "Solicitar Cotización",
            subtitle: "¿Listo para iniciar? Elija cómo prefiere proporcionar sus datos.",
            mode_form: "Llenar Formulario",
            mode_chat: "Chat Interactivo",
            form: {
                client_info: "Información del Cliente",
                name: "Nombre Completo",
                email: "Correo Electrónico",
                phone: "Teléfono",
                company_info: "Detalles de la Empresa",
                company_name: "Nombre de la Empresa",
                industry: "Industria",
                location: "Ubicación (Ciudad/País)",
                project_info: "Requerimientos del Proyecto",
                project_type: "Tipo de Proyecto (Fundición, Maquinado, etc.)",
                material: "Material / Aleación",
                quantity: "Cantidad Estimada",
                description: "Descripción del Proyecto / Especificaciones",
                submit: "Enviar Solicitud"
            },
            chat: {
                welcome: "¡Hola! Soy tu asistente virtual. Te ayudaré a crear tu solicitud paso a paso. Primero, ¿cuál es tu nombre completo?",
                q_email: "Un gusto, {name}. ¿Cuál es tu correo electrónico?",
                q_company: "Perfecto. ¿Cuál es el nombre de tu empresa?",
                q_project: "Gracias. Describe brevemente tu proyecto o lo que necesitas de nosotros.",
                done: "¡Listo! Tenemos tus datos. Un especialista te contactará pronto en {email}."
            }
        },
        about: {
            title: "Nuestro Legado",
            subtitle: "Más de 30 años de excelencia en fundición y maquinado industrial.",
            story_title: "Nuestra Historia",
            story_text: "Con más de tres décadas de experiencia, FUNESMA se ha consolidado como el socio principal para soluciones de fundición y maquinado. Ofrecemos una alternativa superior a las refacciones de importación, garantizando eficiencia en costos, calidad inigualable y tiempos de entrega rápidos. Proveemos con orgullo barras y bujes de bronce certificado en todo Norteamérica.",
            mission_title: "Misión",
            mission_text: "Exceder las expectativas de nuestros clientes en calidad, tiempo de entrega y costo, mejorando continuamente nuestros servicios y alianzas.",
            vision_title: "Visión",
            vision_text: "Ser el líder reconocido internacionalmente en productos industriales de alta calidad manufacturados en México.",
            values_title: "Valores Centrales",
            value_growth: "Crecimiento Sostenido",
            value_trust: "Responsibilidad y Confianza",
            value_people: "Gente Capacitada",
            value_honesty: "Honestidad e Integridad"
        },
        contact: {
            title: "Contáctenos",
            form_name: "Nombre",
            form_email: "Correo",
            form_message: "Mensaje",
            form_submit: "Enviar Mensaje",
            info_title: "Póngase en Contacto"
        },
        footer: {
            rights: "© 2024 Funesma & Loya Industrial Castings. Todos los derechos reservados.",
            contact: "Contacto",
            desc: "Soluciones de fundición y maquinado industrial de clase mundial.",
            address: "Ubicaciones",
            sitemap_title: "Mapa del Sitio",
            contact_title: "Contáctanos",
            social_title: "Síguenos",
            privacy: "Política de Privacidad",
            terms: "Términos de Servicio"
        }
    },
    zh: {
        nav: {
            home: "首页",
            materials: "材料",
            services: "服务",
            catalog: "目录",
            contact: "联系我们",
            quote: "询价"
        },
        hero: {
            title: "铸造与制造的卓越品质",
            subtitle: "锻造工业基础设施的未来。为工程新时代提供精密铸造和先进制造。",
            cta_catalog: "查看目录",
            cta_quote: "索取报价"
        },

        features: {
            nearshoring_title: "您的战略近岸外包合作伙伴",
            nearshoring_desc: "位于墨西哥奇瓦瓦州，在德克萨斯州埃尔帕索设有分销处。我们提供国内制造的物流优势和具有竞争力的全球价格。",
            quality_title: "认证质量",
            quality_desc: "符合 ISO 9001:2015 标准的流程。内部光谱分析和机械测试确保每次浇注都符合您的确切规格。",
            turnkey_title: "交钥匙解决方案",
            turnkey_desc: "从模具制作到最终加工的垂直整合缩短了交货时间并简化了您的供应链。"
        },
        process: {
            title: "我们的制造流程",
            step1_title: "咨询",
            step1_desc: "工程审查和设计优化。",
            step2_title: "模具制作",
            step2_desc: "精密模具制作。",
            step3_title: "铸造",
            step3_desc: "高质量合金浇注。",
            step4_title: "加工",
            step4_desc: "CNC 精加工至精确公差。",
            step5_title: "质量控制",
            step5_desc: "严格的测试和认证。"
        },
        industries: {
            title: "服务行业",
            mining: "采矿与破碎",
            automotive: "汽车",
            agriculture: "农业",
            oil_gas: "石油与天然气",
            rail: "铁路与运输"
        },
        home_about: {
            title: "世界级制造",
            description: "凭借超过30年的经验，我们要专注于高质量的铸造和加工。从逆向工程到成品零件，我们在青铜、钢和铝材方面提供精确度。"
        },
        materials: {
            title: "材料规格",
            bronze: "青铜合金",
            steel: "钢合金",
            aluminum: "铝合金",
            desc: "我们所有的合金均遵守严格的国际标准 (ASTM, SAE, DIN)。"
        },
        services: {
            title: "我们的工业服务",
            casting: "铸造",
            machining: "加工",
            reverse_engineering: "逆向工程",
            pattern_making: "专业服务",
            modal_cta: "立即获取报价",
            details: {
                casting: "我们的铸造厂利用先进的砂型和永久模具工艺。我们处理青铜（高达 500kg）和钢/铁（高达 2,000kg）。我们专注于复杂的几何形状，确保关键应用的无孔铸件。",
                machining: "最先进的精密结果技术。我们的能力包括：精密车削（CNC 和常规）、CNC 铣削（立式加工中心）、平面磨削和齿轮/冠制造。",
                reverse_engineering: "我们为过时的机械注入新活力。服务包括：CAD 图纸生成、3D 扫描和材料硬度分析，以改进的属性重建零件。",
                pattern_making: "用于快速模具开发的内部模具车间。我们还提供热处理、焊接/锅炉制造和用于材料分析的认证实验室。"
            }
        },
        catalog: {
            title: "产品目录",
            filter_all: "全部",
            filter_bronze: "青铜",
            filter_steel: "钢",
            filter_aluminum: "铝",
            products: {
                c84400: {
                    name: "标准青铜 (UNS C84400)",
                    desc: "最佳通用青铜。成本和性能的最佳平衡。硬度均匀。"
                },
                c83600: {
                    name: "青铜 SAE 40 (UNS C83600)",
                    desc: "低速硬青铜。非常适合齿轮、凸轮、阀杆和重载轴承。"
                },
                c93200: {
                    name: "青铜 SAE 660 (UNS C93200)",
                    desc: "良好的减摩青铜。在高压和高速下耐磨。"
                },
                c90500: {
                    name: "青铜 SAE 62 (UNS C90500)",
                    desc: "宏伟的锡青铜。耐磨损和酸侵蚀。用于齿轮和机器元件。"
                },
                c93700: {
                    name: "青铜 SAE 64 (UNS C93700)",
                    desc: "用于高压和高速的重型青铜。用于轧机、起重机、挖泥船。"
                },
                c90700: {
                    name: "青铜 SAE 65 (CDA 90700)",
                    desc: "用于重型服务和需要非常硬的青铜的蜗轮和蜗杆。"
                },
                c95300: {
                    name: "青铜 S.E 68 (CDA 95300)",
                    desc: "铝青铜合金。用于海洋设备、焊接钳、齿轮的优质硬青铜。"
                },
                gray_iron: {
                    name: "灰铸铁",
                    desc: "优异的切削加工性和减震性。非常适合发动机缸体、飞轮和机器底座。"
                },
                ductile_iron: {
                    name: "球墨铸铁",
                    desc: "高强度和延展性。用于曲轴、齿轮和重型悬挂部件。"
                },
                high_chrome_iron: {
                    name: "高铬铸铁",
                    desc: "极高的耐磨性。非常适合矿山破碎机、泵叶轮和衬板。"
                },
                carbon_steel: {
                    name: "碳钢",
                    desc: "多功能且坚固。结构部件、轴和一般机械零件。"
                },
                manganese_steel: {
                    name: "锰钢",
                    desc: "加工硬化钢。破碎设备抗冲击的终极选择。"
                },
                stainless_steel: {
                    name: "不锈钢",
                    desc: "耐腐蚀。食品加工、化工和海洋应用必不可少。"
                }
            }
        },
        quote: {
            title: "询价",
            subtitle: "准备好开始了吗？选择您希望提供详细信息的方式。",
            mode_form: "填写表格",
            mode_chat: "互动聊天",
            form: {
                client_info: "客户信息",
                name: "全名",
                email: "电子邮件",
                phone: "电话号码",
                company_info: "公司详情",
                company_name: "公司名称",
                industry: "行业",
                location: "地点（城市/国家）",
                project_info: "项目要求",
                project_type: "项目类型（铸造，加工等）",
                material: "材料/合金",
                quantity: "预计数量",
                description: "项目描述/规格",
                submit: "提交请求"
            },
            chat: {
                welcome: "你好！我是你的虚拟助手。我将一步步帮你建立报价请求。首先，你的全名是什么？",
                q_email: "很高兴见到你，{name}。你的电子邮件地址是什么？",
                q_company: "太好了。你的公司叫什么名字？",
                q_project: "谢谢。请简要描述你的项目或你需要我们做什么。",
                done: "完美！我们已经收到了你的详细信息。专家将很快通过 {email} 联系你。"
            }
        },
        about: {
            title: "我们的传承",
            subtitle: "30 多年的工业铸造和加工卓越经验。",
            story_title: "我们的故事",
            story_text: "凭借三十多年的经验，FUNESMA 已成为工业铸造和加工解决方案的首选合作伙伴。我们为进口备件提供了卓越的替代方案，保证了成本效率、无与伦比的质量和快速的交货时间。我们自豪地在整个北美供应经过认证的青铜棒和衬套。",
            mission_title: "使命",
            mission_text: "在质量、交货时间和成本方面超越客户的期望，同时不断改进我们的服务和合作伙伴关系。",
            vision_title: "愿景",
            vision_text: "成为国际公认的墨西哥制造的高质量工业产品领导者。",
            values_title: "核心价值观",
            value_growth: "持续增长",
            value_trust: "责任与信任",
            value_people: "赋能员工",
            value_honesty: "诚实与正直"
        },
        contact: {
            title: "联系我们",
            form_name: "姓名",
            form_email: "电子邮件",
            form_message: "留言",
            form_submit: "发送留言",
            info_title: "取得联系"
        },
        footer: {
            rights: "© 2024 Funesma & Loya Industrial Castings. 版权所有。",
            contact: "联系方式",
            desc: "世界一流的工业铸造和加工解决方案。",
            address: "地点"
        },
        footer: {
            rights: "© 2024 Funesma & Loya Industrial Castings. 保留所有权利。",
            contact: "联系方式",
            desc: "世界一流的工业铸造和加工解决方案。",
            address: "地点",
            sitemap_title: "网站地图",
            contact_title: "联系我们",
            social_title: "关注我们",
            privacy: "隐私政策",
            terms: "服务条款"
        }
    },
    ko: {
        nav: {
            home: "홈",
            materials: "재료",
            services: "서비스",
            catalog: "카탈로그",
            contact: "문의하기",
            quote: "견적 요청"
        },
        hero: {
            title: "주조 및 제조의 우수성",
            subtitle: "산업 인프라의 미래를 구축합니다. 새로운 엔지니어링 시대를 위한 정밀 주조 및 첨단 제조.",
            cta_catalog: "카탈로그 보기",
            cta_quote: "견적 요청"
        },

        features: {
            nearshoring_title: "전략적 니어쇼어링 파트너",
            nearshoring_desc: "멕시코 치와와에 위치하며 텍사스 엘패소에 유통망을 갖추고 있습니다. 경쟁력 있는 글로벌 가격으로 국내 제조의 물류 이점을 제공합니다.",
            quality_title: "인증된 품질",
            quality_desc: "ISO 9001:2015 준수 공정. 사내 분광 분석 및 기계적 테스트를 통해 모든 주조가 귀하의 정확한 사양을 충족하도록 보장합니다.",
            turnkey_title: "턴키 솔루션",
            turnkey_desc: "패턴 제작에서 최종 가공까지의 수직 통합으로 리드 타임을 단축하고 공급망을 단순화합니다."
        },
        process: {
            title: "우리의 제조 공정",
            step1_title: "상담",
            step1_desc: "엔지니어링 검토 및 설계 최적화.",
            step2_title: "패턴 제작",
            step2_desc: "정밀 툴링 제작.",
            step3_title: "주조",
            step3_desc: "고품질 합금 주입.",
            step4_title: "가공",
            step4_desc: "정확한 공차로 CNC 마감.",
            step5_title: "품질 관리",
            step5_desc: "엄격한 테스트 및 인증."
        },
        industries: {
            title: "서비스 산업",
            mining: "광업 및 파쇄",
            automotive: "자동차",
            agriculture: "농업",
            oil_gas: "석유 및 가스",
            rail: "철도 및 운송"
        },
        home_about: {
            title: "세계적 수준의 제조",
            description: "30년 이상의 경험을 바탕으로 고품질 주조 및 가공을 전문으로 합니다. 역설계에서 완제품에 이르기까지 청동, 강철 및 알루미늄의 정밀성을 제공합니다."
        },
        materials: {
            title: "재료 사양",
            bronze: "청동 합금",
            steel: "강철 합금",
            aluminum: "알루미늄 합금",
            desc: "우리는 모든 합금에 대해 엄격한 국제 표준(ASTM, SAE, DIN)을 준수합니다."
        },
        services: {
            title: "우리의 산업 서비스",
            casting: "주조",
            machining: "가공",
            reverse_engineering: "역설계",
            pattern_making: "전문 서비스",
            modal_cta: "지금 견적 받기",
            details: {
                casting: "당사의 주조 공장은 첨단 샌드 및 영구 금형 공정을 사용합니다. 청동(최대 500kg) 및 강철/철(최대 2,000kg)을 취급합니다. 당사는 복잡한 형상을 전문으로 하며 중요한 응용 분야를 위한 무기공 주조를 보장합니다.",
                machining: "정밀한 결과를 위한 최첨단 기술. 당사의 역량에는 정밀 선삭(CNC 및 일반), CNC 밀링(수직 가공 센터), 표면 연삭 및 기어/크라운 제조가 포함됩니다.",
                reverse_engineering: "우리는 노후된 기계에 새로운 생명을 불어넣습니다. 서비스에는 CAD 도면 생성, 3D 스캐닝 및 재료 경도 분석이 포함되어 개선된 속성으로 부품을 재생성합니다.",
                pattern_making: "신속한 툴링 개발을 위한 사내 패턴 샵. 또한 열처리, 용접/제관 및 재료 분석을 위한 인증된 실험실을 제공합니다."
            }
        },
        catalog: {
            title: "제품 카탈로그",
            filter_all: "전체",
            filter_bronze: "청동",
            filter_steel: "강철",
            filter_aluminum: "알루미늄",
            products: {
                c84400: {
                    name: "표준 청동 (UNS C84400)",
                    desc: "최고의 범용 청동. 비용과 성능의 최적 균형. 균일한 경도."
                },
                c83600: {
                    name: "청동 SAE 40 (UNS C83600)",
                    desc: "저속 경질 청동. 기어, 캠, 스템 및 고하중 베어링에 이상적입니다."
                },
                c93200: {
                    name: "청동 SAE 660 (UNS C93200)",
                    desc: "우수한 마찰 방지 청동. 고압 및 고속에서 내마모성."
                },
                c90500: {
                    name: "청동 SAE 62 (UNS C90500)",
                    desc: "웅장한 주석 청동. 마모 및 산 공격에 대한 내성. 기어 및 기계 요소용."
                },
                c93700: {
                    name: "청동 SAE 64 (UNS C93700)",
                    desc: "고압 및 고속용 중장비 청동. 압연기, 크레인, 준설선에 사용됩니다."
                },
                c90700: {
                    name: "청동 SAE 65 (CDA 90700)",
                    desc: "서비스가 무겁고 매우 단단한 청동이 필요한 웜 기어 및 휠에 사용됩니다."
                },
                c95300: {
                    name: "청동 S.E 68 (CDA 95300)",
                    desc: "알루미늄 청동 합금. 해양 장비, 용접 집게, 기어용 우수한 경질 청동."
                },
                gray_iron: {
                    name: "회주철",
                    desc: "우수한 가공성 및 진동 감쇠. 엔진 블록, 플라이휠 및 기계 베이스에 이상적입니다."
                },
                ductile_iron: {
                    name: "덕타일 주철 (구상흑연주철)",
                    desc: "높은 강도와 연성. 크랭크축, 기어 및 중장비 서스펜션 부품에 사용됩니다."
                },
                high_chrome_iron: {
                    name: "고크롬 주철",
                    desc: "극도의 내마모성. 광산 파쇄기, 펌프 임펠러 및 라이너에 적합합니다."
                },
                carbon_steel: {
                    name: "탄소강",
                    desc: "다재다능하고 강함. 구조 부품, 샤프트 및 일반 기계 부품."
                },
                manganese_steel: {
                    name: "망간강",
                    desc: "가공 경화 강철. 파쇄 장비의 내충격성을 위한 최고의 선택."
                },
                stainless_steel: {
                    name: "스테인리스 강",
                    desc: "내식성. 식품 가공, 화학 및 해양 응용 분야에 필수적입니다."
                }
            }
        },
        quote: {
            title: "견적 요청",
            subtitle: "시작할 준비가 되셨나요? 세부 정보를 제공할 방법을 선택하세요.",
            mode_form: "양식 작성",
            mode_chat: "대화형 채팅",
            form: {
                client_info: "고객 정보",
                name: "성명",
                email: "이메일 주소",
                phone: "전화번호",
                company_info: "회사 세부 정보",
                company_name: "회사명",
                industry: "산업",
                location: "위치 (도시/국가)",
                project_info: "프로젝트 요구 사항",
                project_type: "프로젝트 유형 (주조, 가공 등)",
                material: "재료 / 합금",
                quantity: "예상 수량",
                description: "프로젝트 설명 / 사양",
                submit: "요청 제출"
            },
            chat: {
                welcome: "안녕하세요! 가상 비서입니다. 견적 요청을 단계별로 도와드리겠습니다. 먼저 성함이 어떻게 되시나요?",
                q_email: "반갑습니다, {name}님. 이메일 주소는 무엇인가요?",
                q_company: "좋습니다. 회사 이름은 무엇인가요?",
                q_project: "감사합니다. 프로젝트나 필요한 사항을 간단히 설명해 주세요.",
                done: "완벽합니다! 세부 정보를 접수했습니다. 전문가가 곧 {email}로 연락드릴 것입니다."
            }
        },
        about: {
            title: "우리의 유산",
            subtitle: "30년 이상의 산업용 주조 및 가공 분야의 우수성.",
            story_title: "우리의 이야기",
            story_text: "30년 이상의 경험을 바탕으로 FUNESMA는 산업용 주조 및 가공 솔루션을 위한 최고의 파트너로 자리 매김했습니다. 당사는 수입 예비 부품에 대한 우수한 대안을 제공하여 비용 효율성, 타의 추종을 불허하는 품질 및 빠른 배송 시간을 보장합니다. 당사는 북미 전역에 인증된 청동 바와 부싱을 자랑스럽게 공급합니다.",
            mission_title: "미션",
            mission_text: "품질, 납기 및 비용 면에서 고객의 기대를 뛰어넘는 동시에 서비스와 파트너십을 지속적으로 개선합니다.",
            vision_title: "비전",
            vision_text: "멕시코에서 제조된 고품질 산업용 제품의 국제적으로 인정받는 리더가 되는 것.",
            values_title: "핵심 가치",
            value_growth: "지속적인 성장",
            value_trust: "책임과 신뢰",
            value_people: "권한이 부여된 인재",
            value_honesty: "정직과 성실"
        },
        contact: {
            title: "문의하기",
            form_name: "이름",
            form_email: "이메일",
            form_message: "메시지",
            form_submit: "메시지 보내기",
            info_title: "연락하기"
        },
        footer: {
            rights: "© 2024 Funesma & Loya Industrial Castings. 판권 소유.",
            contact: "연락처",
            desc: "세계적 수준의 산업용 주조 및 가공 솔루션.",
            address: "위치"
        },
        footer: {
            rights: "© 2024 Funesma & Loya Industrial Castings. 판권 소유.",
            contact: "연락처",
            desc: "세계적 수준의 산업용 주조 및 가공 솔루션.",
            address: "위치",
            sitemap_title: "사이트 맵",
            contact_title: "문의하기",
            social_title: "팔로우",
            privacy: "개인 정보 정책",
            terms: "서비스 약관"
        }
    }
};
