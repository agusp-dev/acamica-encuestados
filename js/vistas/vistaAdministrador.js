/*
 * Vista administrador
 */
var VistaAdministrador = function(modelo, controlador, elementos) {
  this.modelo = modelo;
  this.controlador = controlador;
  this.elementos = elementos;
  var contexto = this;

  // suscripción de observadores
  this.modelo.preguntaAgregada.suscribir(function() {
    contexto.reconstruirLista();
  });

  this.modelo.preguntaEliminada.suscribir(function() {
    contexto.reconstruirLista();
  });

  this.modelo.todoEliminado.suscribir(function() {
    contexto.reconstruirLista();
  });

  this.modelo.preguntaEditada.suscribir(function() {
    contexto.reconstruirLista();
  });
};


VistaAdministrador.prototype = {
  //lista
  inicializar: function() {
    //llamar a los metodos para reconstruir la lista, configurar botones y validar formularios
    this.reconstruirLista(),
    this.configuracionDeBotones(),
    validacionDeFormulario();
  },

  construirElementoPregunta: function(pregunta){
    var contexto = this;
    //completar
    //asignar a nuevoitem un elemento li con clase "list-group-item", id "pregunta.id" y texto "pregunta.textoPregunta"
    var $nuevoItem = $("<li>")
    .addClass("list-group-item")
    .attr('id', '' + pregunta.id)
    .text(pregunta.textoPregunta);

    console.log('id: ' + pregunta.id);

    var interiorItem = $('.d-flex');
    var titulo = interiorItem.find('h5');
    titulo.text(pregunta.textoPregunta);
    interiorItem.find('small').text(pregunta.cantidadPorRespuesta.map(function(resp){
      return " " + resp.textoRespuesta;
    }));

    $nuevoItem.html($('.d-flex').html());
    console.log($nuevoItem);
    return $nuevoItem;
  },

  reconstruirLista: function() {
    var lista = this.elementos.lista;
    lista.html('');
    var preguntas = this.modelo.preguntas;
    for (var i=0;i<preguntas.length;++i){
      lista.append(this.construirElementoPregunta(preguntas[i]));
    }
  },

  configuracionDeBotones: function(){
    var e = this.elementos;
    var contexto = this;

    //asociacion de eventos a boton
    e.botonAgregarPregunta.click(function() {
      var value = e.pregunta.val();
      var respuestas = [];
      console.log(value);

      $('[name="option[]"]').each(function() {
        //completar
        //no agrega respuestas vacias
        if ($(this).val().length > 0) {
          respuestas.push({'textoRespuesta':$(this).val(), 'cantidad': 0});
        }
      })
      contexto.limpiarFormulario();
      contexto.controlador.agregarPregunta(value, respuestas);
    });
    //Boton borrar pregunta
    e.botonBorrarPregunta.click(function() {
      var id = parseInt($('.list-group-item.active').attr('id'));
      contexto.controlador.eliminarPregunta(id);
    });

    //Boton borrar todo
    e.borrarTodo.click(function() {
      contexto.controlador.eliminarTodo();
    });

    //Boton borrar todo
    e.botonEditarPregunta.click(() => {
      var id = parseInt($('.list-group-item.active').attr('id'));
      var nuevoTexto = prompt('Editar Pregunta');
      contexto.controlador.editarPregunta(id, nuevoTexto);
    });
  },

  limpiarFormulario: function(){
    $('.form-group.answer.has-feedback.has-success').remove();
  },
};
