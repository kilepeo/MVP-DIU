# Biblioteca USM · MVP (React)

MVP frontend del proyecto **Biblioteca USM: Descubrimiento de Recursos** (curso Diseño de Interfaces Usuarias).
Solo frontend: los datos son de demostración y las reservas/préstamos se guardan en el navegador (`localStorage`).

## Integrantes

```bash
Ricardo Alvear Chávez   - 202373574-4
Josefina Pino Monsalve  - 202373619-8
Vicente Silva Ríos      - 2023735140-0
```


## Cómo ejecutarlo

```bash
npm install
npm run dev      # desarrollo
npm run build    # build de producción en /dist
```

## Estructura

```
src/
├── App.jsx                         rutas
├── pages/
│   ├── Home.jsx                    PÁGINA PRINCIPAL
│   └── MisActividades.jsx          reservas y préstamos del usuario
├── features/
│   ├── salas/                      FUNCIÓN 1 · Reservar sala de estudio
│   │   ├── ReservaSalas.jsx
│   │   └── salas.css
│   ├── catalogo/                   FUNCIÓN 2 · Consultar disponibilidad de un libro
│   │   ├── Catalogo.jsx            búsqueda + filtros (campus, disponibilidad)
│   │   ├── FichaLibro.jsx          estado por campus + "Hacer reserva"
│   │   └── catalogo.css
│   └── digital/                    FUNCIÓN 3 · Pedir prestado un libro digital
│       ├── BibliotecaDigital.jsx
│       ├── BotonPrestamoDigital.jsx
│       ├── Lector.jsx
│       └── digital.css
├── components/                     Layout, LoginModal, BotonConfirmar, Portada
├── context/AppContext.jsx          sesión, reservas y préstamos (estado compartido)
├── data/                           libros, salas y campus de demostración
└── utils/fechas.js
```

## Metas de usuario implementadas

| Meta | Dónde | Hipótesis |
|------|-------|-----------|
| Reservar una sala de estudio (campus, tipo, capacidad, día, duración, bloque) | `/salas` | H1 |
| Consultar si un libro está disponible en un campus y reservar la copia física | `/catalogo` → `/catalogo/:id` | H2 |
| Pedir prestado un libro digital y leerlo | `/digital` → `/digital/leer/:id` | H3 |

## Decisiones de diseño basadas en los tests

- Una sola cuenta institucional (la de SIGA/Aula), explicada antes de pedirla, que se solicita solo al confirmar.
- Reserva de sala con una única confirmación y comprobante visible.
- Estado de copias coherente: si el botón dice "Hacer reserva", la reserva se puede hacer.
- La ficha explica dónde está el libro (piso, sección, estante) y cuándo se espera una devolución.
- Búsqueda tolerante a errores de tipeo.
- "Pedir prestado" pasa a "Leer ahora" apenas se concreta; el lector permite navegación continua.
- El catálogo y la biblioteca digital se explican y se enlazan entre sí.
