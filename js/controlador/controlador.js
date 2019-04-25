/**
 * Controlador
 */
var Controlador = function(modelo) {
  this.modelo = modelo;

  //inicializacion de eventos
  this.preguntaEstructuraIncorrecta = new Evento(this);
  this.idPreguntaIncorrecto = new Evento(this);
  this.nuevaPreguntaVacia = new Evento(this);
};

Controlador.prototype = {

  agregarPregunta(pregunta, respuestas) {
    if (pregunta.length > 0 && respuestas.length > 0) {
      this.modelo.agregarPregunta(pregunta, respuestas);
    } else {
      this.preguntaEstructuraIncorrecta.notificar();
    }
  },

  eliminarPregunta(idPregunta) {
    this.modelo.eliminarPregunta(idPregunta);
  },

  eliminarTodo() {
    this.modelo.eliminarTodo();
  },

  editarPregunta(id, nuevoTexto) {
    if (nuevoTexto != null) {
      if (nuevoTexto.length > 0) {
        this.modelo.editarPregunta(id, nuevoTexto);
      } else {
        this.nuevaPreguntaVacia.notificar();
      }
    }
  },

  agregarVoto(preguntaId, respuesta) {
    this.modelo.agregarVoto(preguntaId, respuesta);
  }
};