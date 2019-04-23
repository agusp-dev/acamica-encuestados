/*
 * Modelo
 */
var Modelo = function() {
  this.preguntas = this.obtenerPreguntasDesdeLocalStorage();
  this.ultimoId = 0;

  //inicializacion de eventos
  this.preguntaAgregada = new Evento(this);
  this.preguntaEliminada = new Evento(this);
  this.todoEliminado = new Evento(this);
  this.preguntaEditada = new Evento(this);
  this.votoAgregado = new Evento(this);
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
      this.guardar();
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
    this.guardar();
    this.todoEliminado.notificar();
  },

  //se eliminan todas las preguntas
  eliminarTodasLasPreguntas: function() {
    if (this.preguntas.length > 0) {
      this.preguntas = [];
    }
  },

  //se edita una pregunta
  editarPregunta: function(id, nuevoTexto) {
    if (this.preguntas.length > 0) {
      var pregunta = this.obtenerPregunta(this.preguntas, id);
      if (pregunta != null) {
        pregunta.textoPregunta = nuevoTexto;
        this.guardar();
        this.preguntaEditada.notificar();
      }
    }
  },

  //se obtiene pregunta de array, pasando su id
  obtenerPregunta: function(array, id) {
    var index = array.findIndex(pregunta => pregunta.id == id);
    return (index > -1) ? array[index] : null;
  },

  //se obtiene respuesta de array, pasando su nombre
  obtenerRespuesta: function(array, nombre) {
    var index = array.findIndex(respuesta => respuesta.textoRespuesta === nombre);
    return (index > -1) ? array[index] : null;
  },

  //se agrega voto a una respuesta de una pregunta
  agregarVoto: function(preguntaId, respuesta) {
    if (this.preguntas.length > 0) {
      var pregunta = this.obtenerPregunta(this.preguntas, preguntaId);
      if (pregunta != null) {
        var respuesta = this.obtenerRespuesta(pregunta.cantidadPorRespuesta, respuesta);
        if (respuesta != null) {
          respuesta.cantidad++;
          this.guardar();
          this.votoAgregado.notificar();
        }
      }
    }
  },


  //se guardan las preguntas
  guardar: function() {
    if (this.preguntas != null) {
      this.guardarEnLocalStorage(this.preguntas);
    }
  },

  //Se guarda array pasado por parametro en local storage
  guardarEnLocalStorage: function(array) {
    localStorage.setItem('preguntas', this.convertirArrayEnString(array));
  },

  //Retorna array convertido en string
  convertirArrayEnString: function(array) {
    return JSON.stringify(array);
  },

  //Se obtiene array guardado en local storage
  obtenerPreguntasDesdeLocalStorage: function() {
    var array = this.convertirStringEnArray(localStorage.getItem('preguntas'));
    return (array != null) ? array : [];
  },

  //Retorna string convertido en array
  convertirStringEnArray: function(string) {
    return JSON.parse(string);
  }

};
