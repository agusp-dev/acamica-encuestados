/*
 * Modelo
 */
var Modelo = function() {
  this.preguntas = [];
  this.ultimoId = 0;

  //inicializacion de eventos
  this.preguntaAgregada = new Evento(this);
  this.preguntaEliminada = new Evento(this);
  this.todoEliminado = new Evento(this);
};

Modelo.prototype = {
  //se obtiene el id más grande asignado a una pregunta
  obtenerUltimoId: function() {
    return (this.preguntas.length > 0) ? this.obtenerIdMasGrande(this.preguntas) : 0;
  },

  //compara las respuestas de un array (no vacio) y devuelve id mas grande.
  obtenerIdMasGrande: function(array) {
    var idMasGrande = 0;
    array.forEach(pregunta => {
      if (pregunta.id > idMasGrande) {
        idMasGrande = pregunta.id;
      }
    });
    return idMasGrande;
  },

  //se agrega una pregunta dado un nombre y sus respuestas
  agregarPregunta: function(nombre, respuestas) {
    var id = this.obtenerUltimoId();
    id++;
    var nuevaPregunta = {'textoPregunta': nombre, 'id': id, 'cantidadPorRespuesta': respuestas};
    this.preguntas.push(nuevaPregunta);
    this.guardar();
    this.preguntaAgregada.notificar();
  },

  //se elimina una pregunta
  eliminarPregunta: function(id) {
    if (this.preguntas.length > 0) {
      this.preguntas = this.obtenerNuevoArraySinEliminado(this.preguntas, id);
    }
    this.preguntaEliminada.notificar();
  },

  //obtiene nuevo array de preguntas sin incluir al id pasado por parametro.
  obtenerNuevoArraySinEliminado: function(array, id) {
    return array.filter(pregunta => pregunta.id != id);
  },

  //se elimina todo
  eliminarTodo: function() {
    this.eliminarTodasLasPreguntas();
    this.todoEliminado.notificar();
  },

  //se eliminan todas las preguntas
  eliminarTodasLasPreguntas: function() {
    if (this.preguntas.length > 0) {
      this.preguntas = [];
    }
  },

  //se guardan las preguntas
  guardar: function(){
  },
};
