/*
 * Modelo
 */
var Modelo = function() {
  this.preguntas = [];
  this.ultimoId = 0;

  //inicializacion de eventos
  this.preguntaAgregada = new Evento(this);
};

Modelo.prototype = {
  //se obtiene el id más grande asignado a una pregunta
  obtenerUltimoId: function() {
    this.preguntas.length > 0 ? this.obtenerIdMasGrande(this.preguntas) : 0;
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

  //se guardan las preguntas
  guardar: function(){
  },
};
