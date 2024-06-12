

const Estado = Object.freeze({
  PENDIENTE: 'Pendiente',
  EN_PROGRESO: 'En Progreso',
  COMPLETADO: 'Completado',
  CANCELADO: 'Cancelado'
});

const RolUsuario = Object.freeze({
  ADMIN: 'Admin',
  USUARIO: 'Usuario',
  INVITADO: 'Invitado'
});

const TipoServicio = Object.freeze({
  TALLER: 1,
  CHAPERIO: 2
});

const CategoriaServicio = Object.freeze({
  ABOLLADURA: 'abolladura',
  FAROL_ROTO: 'farolRoto',
  GRIETA: 'grieta',
  LLANTA_PINCHADA: 'llantaPinchada',
  RAYADURA: 'rayadura',
  VIDRIO_ROTO: 'vidrioRoto',
  SIN_CATEGORIA: 'SIN CATEGORIA',
  DESCONOCIDA: 'DESCONOCIDO'
});

module.exports = {
  Estado,
  RolUsuario,
  TipoServicio,
  CategoriaServicio
};
