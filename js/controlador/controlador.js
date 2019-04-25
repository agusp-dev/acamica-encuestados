/*
 * Controlador
 */
var Controlador = function(modelo) {
  this.modelo = modelo;
};

Controlador.prototype = {

  agregarPregunta(pregunta, respuestas) {
      this.modelo.agregarPregunta(pregunta, respuestas);
  },

  eliminarPregunta(idPregunta) {
    this.modelo.eliminarPregunta(idPregunta);
  },

  eliminarTodo() {
    this.modelo.eliminarTodo();
  },

  editarPregunta(id, nuevoTexto) {
    this.modelo.editarPregunta(id, nuevoTexto);
  },

  agregarVoto(preguntaId, respuesta) {
    this.modelo.agregarVoto(preguntaId, respuesta);
  }
};