/*
 * Vista administrador
 */
var VistaAdministrador = function(modelo, controlador, elementos) {
  this.modelo = modelo;
  this.controlador = controlador;
  this.elementos = elementos;
  var contexto = this;
  //Suscripción de observadores
  this.modelo.preguntaAgregada.suscribir(() => contexto.reconstruirLista());
  this.modelo.preguntaEliminada.suscribir(() => contexto.reconstruirLista());
  this.modelo.todoEliminado.suscribir(() => contexto.reconstruirLista());
  this.modelo.preguntaEditada.suscribir(() => contexto.reconstruirLista());
};

VistaAdministrador.prototype = {

  inicializar() {
    this.reconstruirLista(),
    this.configuracionDeBotones(),
    validacionDeFormulario();
  },

  construirElementoPregunta(pregunta) {
    var $nuevoItem = this.construirElemento(
      '<li>', '' + pregunta.id, 'list-group-item', pregunta.textoPregunta);
    var $interiorItem = $('.d-flex');
    var titulo = $interiorItem.find('h5');
    titulo.text(pregunta.textoPregunta);
    $interiorItem.find('small').text(
      pregunta.cantidadPorRespuesta.map(resp =>  " " + resp.textoRespuesta));

    $nuevoItem.html($('.d-flex').html());
    return $nuevoItem;
  },

  //Devuelve nuevo elemento
  construirElemento(etiqueta, id, clase ,texto) {
    return $(etiqueta)
    .addClass(clase)
    .attr('id', id)
    .text(texto);
  },

  reconstruirLista() {
    var lista = this.elementos.lista;
    lista.html('');
    if (this.modelo.preguntas.length > 0) {
      this.modelo.preguntas.forEach(
        pregunta => lista.append(this.construirElementoPregunta(pregunta)));
    }
  },

  configuracionDeBotones() {
    var e = this.elementos;
    var contexto = this;

    //Boton agregar pregunta
    e.botonAgregarPregunta.click(() => {
      var value = e.pregunta.val();
      var respuestas = [];
      $('[name="option[]"]').each(function() {
        //no agrega respuestas vacias
        if ($(this).val().length > 0) {
          contexto.agregarRespuesta(respuestas, $(this).val(), 0);
        }
      })
      contexto.limpiarFormulario();
      contexto.controlador.agregarPregunta(value, respuestas);
    });

    //Boton borrar todo
    e.botonEditarPregunta.click(() => {
      var id = contexto.obtenerIdElementoPregunta();
      var nuevoTexto = prompt('Editar Pregunta');
      contexto.controlador.editarPregunta(id, nuevoTexto);
    });

    //Boton borrar pregunta
    e.botonBorrarPregunta.click(() => {
      var id = contexto.obtenerIdElementoPregunta();
      contexto.controlador.eliminarPregunta(id);
    });

    //Boton borrar todo
    e.borrarTodo.click(() => {
      contexto.controlador.eliminarTodo();
    });
  },

  //Agrega un objeto respuesta al array de respuestas
  agregarRespuesta(respuestas, texto, votos) {
    respuestas.push(this.crearRespuesta(texto, votos));
  },

  //Crea respuesta y la devuelve
  crearRespuesta(texto, cantidad) {
    return {'textoRespuesta':texto, 'cantidad': cantidad};
  },

  //Obtiene id de elemento pregunta
  obtenerIdElementoPregunta() {
    return parseInt($('.list-group-item.active').attr('id'));
  },

  //Limpia form
  limpiarFormulario() {
    $('.form-group.answer.has-feedback.has-success').remove();
  },
};