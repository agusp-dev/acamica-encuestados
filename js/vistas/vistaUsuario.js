/*
 * Vista usuario
 */
var VistaUsuario = function(modelo, controlador, elementos) {
  this.modelo = modelo;
  this.controlador = controlador;
  this.elementos = elementos;
  var contexto = this;
  //suscripcion de eventos
  this.modelo.votoAgregado.suscribir(() => contexto.reconstruirGrafico());
};

VistaUsuario.prototype = {

  inicializar() {
    this.reconstruirLista();
    this.reconstruirGrafico();
    this.configuracionDeBotones();
  },

  //reconstruccion de los graficos de torta
  reconstruirGrafico() {
    var contexto = this;
    var preguntas = this.modelo.preguntas;
    preguntas.forEach(clave => {
      var listaParaGrafico = [contexto.crearElementoDeListaParaGrafico(
        clave.textoPregunta, 'Cantidad')];
      var respuestas = clave.cantidadPorRespuesta;
      respuestas.forEach (elemento => {
        contexto.agregarElementoAListaParaGrafico(
          listaParaGrafico, elemento.textoRespuesta, elemento.cantidad);
      });
      contexto.dibujarGrafico(clave.textoPregunta, listaParaGrafico);
    })
  },

  //Agrega grafico a la lista
  agregarElementoAListaParaGrafico(array, respuesta, cantidad) {
    array.push(this.crearElementoDeListaParaGrafico(respuesta, cantidad));
  },

  //Retorna nuevo array con valores pasados por parametro
  crearElementoDeListaParaGrafico(valor1, valor2) {
    return [valor1, valor2];
  },

  //Arma lista
  reconstruirLista() {
    var contexto = this;
    var listaPreguntas = this.elementos.listaPreguntas;
    var preguntas = this.modelo.preguntas;
    listaPreguntas.html('');
    preguntas.forEach(clave => {
      contexto.agregarDivALista(listaPreguntas, clave);
      contexto.mostrarRespuestas(listaPreguntas, clave.id, clave.cantidadPorRespuesta);
    })
  },

  //Agrega div a la lista
  agregarDivALista(lista, clave) {
    lista.append(this.construirDiv(clave));
  },

  //Construye elemento pregunta
  construirDiv: function(clave) {
    return $('<div>')
    .attr('id', '' + clave.id)
    .attr('value', clave.textoPregunta)
    .text(clave.textoPregunta);
  },

  //Muestra respuestas
  mostrarRespuestas:function(listaPreguntas, idPregunta, listaRespuestas){
    var contexto = this;
    listaRespuestas.forEach (respuesta => {
      contexto.agregarBotonRadioListaPreguntas(
        listaPreguntas, idPregunta, respuesta.textoRespuesta);
      contexto.agregarLabelListaPreguntas(
        listaPreguntas, respuesta.textoRespuesta);
    });
  },

  //Agrega boton radio a la lista
  agregarBotonRadioListaPreguntas(listaPreguntas, idPregunta, textoRespuesta) {
    listaPreguntas.append($('<input>', this.crearBotonRadioRespuesta(idPregunta, textoRespuesta)));
  },

  //Crea y devuelve elemento boton radio
  crearBotonRadioRespuesta(idPregunta, textoRespuesta) {
    return {type: 'radio', value: textoRespuesta, name: idPregunta};
  },

  //Agrega label a la lista
  agregarLabelListaPreguntas(listaPreguntas, textoRespuesta) {
    listaPreguntas.append( $('<label>', this.crearLabelRespuesta(textoRespuesta))) ;
  },

  //Crea y devuelve elemento label
  crearLabelRespuesta(textoRespuesta) {
    return {type: textoRespuesta, text: textoRespuesta};
  },

  //Agrega votos
  agregarVotos() {
    var contexto = this;
    $('#preguntas').find('div').each(function() {
        var id = $(this).attr('id');
        var respuestaSeleccionada = $('input[name=' + id + ']:checked').val();
        $('input[name=' + id + ']').prop('checked',false);
        $('#nombreUsuario').val('');
        //se pasa identificador unico en vez de nombre de la pregunta.
        contexto.controlador.agregarVoto(id, respuestaSeleccionada);
      });
  },

  //Dibuja grafico
  dibujarGrafico(nombre, respuestas) {
    var contexto = this;
    var seVotoAlgunaVez = this.seVotoAlgunaVez(respuestas);
    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
      var data = google.visualization.arrayToDataTable(respuestas);
      var options = {
        title: nombre,
        is3D: true,
      };
      var ubicacionGraficos = contexto.elementos.graficosDeTorta;
      var id = (nombre.replace(/\W/g, '')).split(' ').join('')+'_grafico';
      if($('#'+id).length){$('#'+id).remove()}
      var div = document.createElement('div');
      ubicacionGraficos.append(div);
      div.id = id;
      div.style.width = '400';
      div.style.height = '300px';
      var chart = new google.visualization.PieChart(div);
      if(seVotoAlgunaVez){
        chart.draw(data, options);
      }
    }
  },

  //Devuelve booleano que determina si se voto alguna vez
  seVotoAlgunaVez(respuestas) {
    return respuestas.some(respuesta => respuesta[1] > 0);
  },

  //Botones
  configuracionDeBotones() {
    var contexto = this;
    this.elementos.botonAgregar.click(() => {
      contexto.agregarVotos(); 
    });
  }
};