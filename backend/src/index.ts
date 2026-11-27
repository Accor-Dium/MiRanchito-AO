import type { Core } from '@strapi/strapi';

const CATEGORIAS: [string, string, string[]][] = [
  [
    "🍽️",
    "Comida preparada",
    [
      "Fondas y restaurantes",
      "Taquerías y antojitos",
      "Pizzas y hamburguesas",
      "Mariscos",
      "Cafeterías y postres"
    ]
  ],
  [
    "🛒",
    "Alimentos y abarrotes",
    [
      "Abarrotes",
      "Carnicerías y pollerías",
      "Fruterías y verdulerías",
      "Tortillerías",
      "Panaderías"
    ]
  ],
  [
    "🏥",
    "Salud",
    [
      "Consultorios",
      "Farmacias",
      "Laboratorios",
      "Ópticas"
    ]
  ],
  [
    "🐾",
    "Mascotas",
    [
      "Veterinarias",
      "Alimento y accesorios"
    ]
  ],
  [
    "🔧",
    "Oficios y reparaciones",
    [
      "Plomería",
      "Electricidad",
      "Albañilería",
      "Herrería y carpintería",
      "Pintura",
      "Reparación de celulares y computadoras"
    ]
  ],
  [
    "🚗",
    "Autos y transporte",
    [
      "Mecánicos",
      "Refaccionarias",
      "Llanteras",
      "Gasolineras",
      "Taxis y mototaxis",
      "Fletes y mudanzas"
    ]
  ],
  [
    "🏗️",
    "Construcción y hogar",
    [
      "Materiales de construcción",
      "Ferreterías y pinturas",
      "Vidrierías",
      "Mueblerías y electrodomésticos"
    ]
  ],
  [
    "🛍️",
    "Comercio",
    [
      "Ropa y calzado",
      "Papelerías",
      "Celulares y accesorios",
      "Regalos y florerías"
    ]
  ],
  [
    "🌾",
    "Campo",
    [
      "Agroquímicos y fertilizantes",
      "Forrajes y alimento para animales",
      "Maquinaria y refacciones",
      "Viveros"
    ]
  ],
  [
    "🎉",
    "Eventos y fiestas",
    [
      "Salones",
      "Banquetes y pasteles",
      "Renta de mobiliario",
      "Música y sonido",
      "Fotografía y video"
    ]
  ],
  [
    "💇",
    "Belleza y bienestar",
    [
      "Estéticas y barberías",
      "Uñas y spa",
      "Gimnasios"
    ]
  ],
  [
    "💼",
    "Servicios profesionales",
    [
      "Abogados y notarías",
      "Contadores y trámites",
      "Papelería con copias e impresión",
      "Seguros"
    ]
  ],
  [
    "🏨",
    "Hospedaje y turismo",
    [
      "Hoteles y cabañas",
      "Atractivos y paseos"
    ]
  ],
  [
    "🎓",
    "Educación",
    [
      "Guarderías",
      "Academias y cursos"
    ]
  ],
  [
    "📌",
    "Otros",
    []
  ]
];

const LECTURA_PUBLICA = ['negocio', 'categoria', 'noticia', 'aviso-parroquial'];

async function permitirLecturaPublica(strapi: Core.Strapi) {
  const rol = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
  if (!rol) return;
  const permisos = strapi.db.query('plugin::users-permissions.permission');
  for (const api of LECTURA_PUBLICA) {
    for (const accion of ['find', 'findOne']) {
      const action = `api::${api}.${api}.${accion}`;
      const existe = await permisos.findOne({ where: { action, role: rol.id } });
      if (!existe) await permisos.create({ data: { action, role: rol.id } });
    }
  }
}

async function cargarCategorias(strapi: Core.Strapi) {
  const docs = strapi.documents('api::categoria.categoria');
  if ((await docs.findMany({ limit: 1 })).length > 0) return;
  let orden = 0;
  for (const [icono, nombre, subs] of CATEGORIAS) {
    const padre = await docs.create({ data: { nombre, icono, orden: orden++ } });
    let o = 0;
    for (const sub of subs) {
      await docs.create({ data: { nombre: sub, orden: o++, padre: { documentId: padre.documentId } } });
    }
  }
}

export default {
  register() {},
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await permitirLecturaPublica(strapi);
    await cargarCategorias(strapi);
  },
};
