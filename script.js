let map;
let coord;
let marker;
let latInput;
let lngInput;
let wordsInput;

function iniciarMap() {
  latInput = document.getElementById('lat');
  lngInput = document.getElementById('lng');
  wordsInput = document.getElementById('words');

  coord = { lat: 19.8548689, lng: -98.9909347 };

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: coord
  });

  marker = new google.maps.Marker({
    position: coord,
    map: map,
    draggable: true
  });

  obtenerPalabras(marker.getPosition());

  marker.addListener('dragend', function() {
    actualizarInputs(marker.getPosition());
  });
}

function moverMarcador() {
  var lat = parseFloat(latInput.value);
  var lng = parseFloat(lngInput.value);
  var newPosition = new google.maps.LatLng(lat, lng);
  marker.setPosition(newPosition);
  map.panTo(newPosition);
  actualizarInputs(newPosition);
}

function buscarCoordenadas() {
  var words = document.getElementById('words').value;

  what3words.api.convertToCoordinates(words)
    .then(function(response) {
      console.log(response.coordinates);
      var lat = response.coordinates.lat;
      var lng = response.coordinates.lng;
      var newPosition = new google.maps.LatLng(lat, lng);
      marker.setPosition(newPosition);
      map.panTo(newPosition);
      actualizarInputs(newPosition);
    })
    .catch(function(error) {
      console.error(error);
    });
}

function obtenerPalabras(position) {
  what3words.api.convertTo3waGeoJson({ lat: position.lat(), lng: position.lng() }, 'es')
    .then(function(response) {
      wordsInput.value = response.features[0].properties.words;
      console.log(response.features[0].properties.words);
    })
    .catch(function(error) {
      console.error(error);
    });
}

function actualizarInputs(position) {
  latInput.value = position.lat();
  lngInput.value = position.lng();
  obtenerPalabras(marker.getPosition());  
}

