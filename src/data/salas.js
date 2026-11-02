export const HORA_INICIO = 8;
export const HORA_FIN = 20;

export const CATEGORIAS = ['Individual', 'Grupal', 'Taller con pantalla'];

export const SALAS = [
  // San Joaquín
  { id: 'sj-101', nombre: 'Sala 101', campus: 'San Joaquín', piso: 1, categoria: 'Grupal', capacidad: 6, equipamiento: ['Pizarra', 'Enchufes'] },
  { id: 'sj-102', nombre: 'Sala 102', campus: 'San Joaquín', piso: 1, categoria: 'Grupal', capacidad: 6, equipamiento: ['Pizarra', 'Enchufes'] },
  { id: 'sj-103', nombre: 'Sala 103', campus: 'San Joaquín', piso: 1, categoria: 'Taller con pantalla', capacidad: 10, equipamiento: ['Pantalla HDMI', 'Pizarra', 'Enchufes'] },
  { id: 'sj-201', nombre: 'Sala 201', campus: 'San Joaquín', piso: 2, categoria: 'Individual', capacidad: 2, equipamiento: ['Enchufes'] },
  { id: 'sj-202', nombre: 'Sala 202', campus: 'San Joaquín', piso: 2, categoria: 'Individual', capacidad: 2, equipamiento: ['Enchufes'] },
  { id: 'sj-203', nombre: 'Sala 203', campus: 'San Joaquín', piso: 2, categoria: 'Grupal', capacidad: 8, equipamiento: ['Pizarra', 'Pantalla HDMI', 'Enchufes'] },
  // Casa Central
  { id: 'cc-101', nombre: 'Sala 101', campus: 'Casa Central', piso: 1, categoria: 'Grupal', capacidad: 6, equipamiento: ['Pizarra', 'Enchufes'] },
  { id: 'cc-102', nombre: 'Sala 102', campus: 'Casa Central', piso: 1, categoria: 'Individual', capacidad: 2, equipamiento: ['Enchufes'] },
  { id: 'cc-201', nombre: 'Sala 201', campus: 'Casa Central', piso: 2, categoria: 'Taller con pantalla', capacidad: 10, equipamiento: ['Pantalla HDMI', 'Pizarra', 'Enchufes'] },
  // Vitacura
  { id: 'vt-101', nombre: 'Sala 101', campus: 'Vitacura', piso: 1, categoria: 'Grupal', capacidad: 6, equipamiento: ['Pizarra', 'Enchufes'] },
  { id: 'vt-102', nombre: 'Sala 102', campus: 'Vitacura', piso: 1, categoria: 'Individual', capacidad: 2, equipamiento: ['Enchufes'] },
  // Viña del Mar
  { id: 'vm-101', nombre: 'Sala 101', campus: 'Viña del Mar', piso: 1, categoria: 'Grupal', capacidad: 4, equipamiento: ['Pizarra', 'Enchufes'] },
  { id: 'vm-102', nombre: 'Sala 102', campus: 'Viña del Mar', piso: 1, categoria: 'Individual', capacidad: 2, equipamiento: ['Enchufes'] },
  { id: 'vm-103', nombre: 'Sala 103', campus: 'Viña del Mar', piso: 2, categoria: 'Grupal', capacidad: 6, equipamiento: ['Pizarra', 'Pantalla HDMI', 'Enchufes'] },
];

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Ocupación "de fábrica" simulada, determinista por sala, fecha y hora (sin backend). */
export function ocupadoBase(salaId, fechaISO, hora) {
  return hash(`${salaId}|${fechaISO}|${hora}`) % 100 < 38;
}
