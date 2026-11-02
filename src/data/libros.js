const ej = (campus, total, disponibles, piso, seccion, estante, diasDevolucion = 0) => ({
  campus, total, disponibles, piso, seccion, estante, diasDevolucion,
});

export const LIBROS = [
  {
    id: 'cpp-stroustrup',
    titulo: 'The C++ Programming Language',
    autor: 'Bjarne Stroustrup',
    edicion: '4.ª edición',
    editorial: 'Addison-Wesley',
    anio: 2013,
    isbn: '9780321563842',
    clasif: '005.133 STR',
    materias: ['Programación', 'Lenguajes de programación', 'C++'],
    claves: ['cpp'],
    digital: true,
    ejemplares: [
      ej('San Joaquín', 4, 2, 2, 'Computación e Informática', 'E-14'),
      ej('Casa Central', 3, 0, 1, 'Computación e Informática', 'C-07', 6),
      ej('Vitacura', 1, 1, 1, 'Computación e Informática', 'A-03'),
    ],
  },
  {
    id: 'siddhartha',
    titulo: 'Siddhartha',
    autor: 'Hermann Hesse',
    edicion: '12.ª edición',
    editorial: 'Edhasa',
    anio: 2011,
    clasif: '833.912 HES',
    materias: ['Literatura alemana', 'Novela'],
    digital: true,
    ejemplares: [
      ej('San Joaquín', 2, 1, 3, 'Literatura', 'L-22'),
      ej('Casa Central', 2, 2, 2, 'Literatura', 'L-05'),
    ],
  },
  {
    id: 'calculo-stewart',
    titulo: 'Cálculo de una variable: trascendentes tempranas',
    autor: 'James Stewart',
    edicion: '7.ª edición',
    editorial: 'Cengage Learning',
    anio: 2012,
    clasif: '515 STE',
    materias: ['Matemáticas', 'Cálculo diferencial e integral'],
    claves: ['calculo', 'mat021'],
    digital: false,
    ejemplares: [
      ej('San Joaquín', 12, 5, 2, 'Matemáticas', 'M-03'),
      ej('Casa Central', 8, 3, 1, 'Matemáticas', 'M-01'),
      ej('Vitacura', 2, 0, 1, 'Matemáticas', 'M-02', 3),
      ej('Viña del Mar', 3, 1, 1, 'Matemáticas', 'M-01'),
    ],
  },
  {
    id: 'fisica-young',
    titulo: 'Física universitaria, volumen 1',
    autor: 'Hugh D. Young y Roger A. Freedman',
    edicion: '13.ª edición',
    editorial: 'Pearson Educación',
    anio: 2013,
    clasif: '530 YOU',
    materias: ['Física', 'Mecánica'],
    claves: ['sears', 'zemansky'],
    digital: true,
    ejemplares: [
      ej('San Joaquín', 10, 0, 2, 'Física', 'F-08', 2),
      ej('Casa Central', 6, 2, 1, 'Física', 'F-04'),
    ],
  },
  {
    id: 'cormen-algoritmos',
    titulo: 'Introduction to Algorithms',
    autor: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest y Clifford Stein',
    edicion: '4.ª edición',
    editorial: 'MIT Press',
    anio: 2022,
    isbn: '9780262046305',
    clasif: '005.1 COR',
    materias: ['Algoritmos', 'Estructuras de datos'],
    claves: ['clrs', 'algoritmos'],
    digital: true,
    ejemplares: [
      ej('San Joaquín', 3, 1, 2, 'Computación e Informática', 'E-11'),
      ej('Casa Central', 2, 0, 1, 'Computación e Informática', 'C-06', 9),
    ],
  },
  {
    id: 'clean-code',
    titulo: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    autor: 'Robert C. Martin',
    edicion: '1.ª edición',
    editorial: 'Prentice Hall',
    anio: 2008,
    isbn: '9780132350884',
    clasif: '005.1 MAR',
    materias: ['Ingeniería de software', 'Buenas prácticas'],
    digital: true,
    ejemplares: [
      ej('San Joaquín', 2, 2, 2, 'Computación e Informática', 'E-12'),
    ],
  },
  {
    id: 'algebra-lay',
    titulo: 'Álgebra lineal y sus aplicaciones',
    autor: 'David C. Lay',
    edicion: '5.ª edición',
    editorial: 'Pearson Educación',
    anio: 2016,
    clasif: '512.5 LAY',
    materias: ['Matemáticas', 'Álgebra lineal'],
    claves: ['algebra'],
    digital: false,
    ejemplares: [
      ej('San Joaquín', 6, 3, 2, 'Matemáticas', 'M-05'),
      ej('Vitacura', 2, 1, 1, 'Matemáticas', 'M-04'),
    ],
  },
  {
    id: 'quimica-chang',
    titulo: 'Química',
    autor: 'Raymond Chang',
    edicion: '12.ª edición',
    editorial: 'McGraw-Hill',
    anio: 2016,
    clasif: '540 CHA',
    materias: ['Química general'],
    digital: true,
    ejemplares: [
      ej('San Joaquín', 5, 0, 2, 'Química', 'Q-02', 4),
      ej('Casa Central', 5, 4, 1, 'Química', 'Q-01'),
      ej('Viña del Mar', 2, 2, 1, 'Química', 'Q-01'),
    ],
  },
  {
    id: 'design-patterns',
    titulo: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    autor: 'Erich Gamma, Richard Helm, Ralph Johnson y John Vlissides',
    edicion: '1.ª edición',
    editorial: 'Addison-Wesley',
    anio: 1994,
    isbn: '9780201633610',
    clasif: '005.12 GAM',
    materias: ['Ingeniería de software', 'Patrones de diseño'],
    claves: ['patrones'],
    digital: false,
    ejemplares: [
      ej('Casa Central', 2, 1, 1, 'Computación e Informática', 'C-09'),
    ],
  },
  {
    id: 'ecuaciones-zill',
    titulo: 'Ecuaciones diferenciales con aplicaciones de modelado',
    autor: 'Dennis G. Zill',
    edicion: '10.ª edición',
    editorial: 'Cengage Learning',
    anio: 2015,
    clasif: '515.35 ZIL',
    materias: ['Matemáticas', 'Ecuaciones diferenciales'],
    digital: false,
    ejemplares: [
      ej('San Joaquín', 4, 2, 2, 'Matemáticas', 'M-07'),
      ej('Casa Central', 3, 1, 1, 'Matemáticas', 'M-06'),
    ],
  },
  {
    id: 'circuitos-alexander',
    titulo: 'Fundamentos de circuitos eléctricos',
    autor: 'Charles K. Alexander y Matthew N. O. Sadiku',
    edicion: '6.ª edición',
    editorial: 'McGraw-Hill',
    anio: 2016,
    clasif: '621.319 ALE',
    materias: ['Electricidad', 'Circuitos'],
    digital: true,
    ejemplares: [
      ej('San Joaquín', 5, 2, 3, 'Electricidad y Electrónica', 'EL-04'),
      ej('Vitacura', 1, 0, 1, 'Electricidad y Electrónica', 'EL-01', 5),
    ],
  },
  {
    id: 'cien-anos-soledad',
    titulo: 'Cien años de soledad',
    autor: 'Gabriel García Márquez',
    edicion: 'Edición conmemorativa',
    editorial: 'Alfaguara',
    anio: 2007,
    clasif: '863 GAR',
    materias: ['Literatura latinoamericana', 'Novela'],
    digital: true,
    ejemplares: [
      ej('San Joaquín', 3, 3, 3, 'Literatura', 'L-14'),
      ej('Casa Central', 3, 1, 2, 'Literatura', 'L-03'),
      ej('Viña del Mar', 2, 2, 1, 'Literatura', 'L-02'),
    ],
  },
];

export const libroPorId = (id) => LIBROS.find((l) => l.id === id);

/* ---------- Búsqueda tolerante a errores de tipeo ---------- */

const norm = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9+#\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

function distancia(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[a.length][b.length];
}

function tokenCoincide(token, palabras) {
  return palabras.some((p) => {
    if (p.includes(token)) return true;
    if (token.length < 4 || p.length < 4) return false;
    return distancia(token, p) <= (token.length >= 7 ? 2 : 1);
  });
}

/** Devuelve libros que contienen todas las palabras buscadas (con tolerancia a errores de escritura). */
export function buscarLibros(consulta) {
  const tokens = norm(consulta || '').split(' ').filter(Boolean);
  const ordenados = [...LIBROS].sort((a, b) => a.titulo.localeCompare(b.titulo, 'es'));
  if (!tokens.length) return ordenados;
  return ordenados.filter((l) => {
    const palabras = norm([l.titulo, l.autor, l.isbn || '', ...(l.claves || []), ...l.materias].join(' ')).split(' ');
    return tokens.every((t) => tokenCoincide(t, palabras));
  });
}
