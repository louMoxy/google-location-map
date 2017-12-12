const L = require('leaflet');
require('leaflet.heat');
const e7 = 10000000;

var map; 

document.addEventListener('DOMContentLoaded', function(){ 
    map = createMap();
    createEventListeners();
}, false);

const createMap = function() {
    const mapboxAttribution =  'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';
    const accessToken = 'pk.eyJ1IjoibG1veGhheSIsImEiOiJjajB0YzM0cXIwMDF6MzNtZHdyZ3J4anFhIn0.FSi3dh1eb4vVOGMtI9ONJA';
    const mapBoxUrl = function(uid){
        return `https://api.mapbox.com/styles/v1/lmoxhay/${uid}/tiles/256/{z}/{x}/{y}?access_token=${accessToken}`;
    }

    const pastel = L.tileLayer(mapBoxUrl('cjb3rlyhi017y2spx9sanzy6d'), { attribution:mapboxAttribution, renderer: L.canvas()});
    const vintage = L.tileLayer(mapBoxUrl('cjb4395k20bos2rnu8nyaqpnq'),{ attribution:mapboxAttribution, renderer: L.canvas()});
    const comicBook = L.tileLayer(mapBoxUrl('cjb43fhc10c9t2smq2fk56170'),{ attribution:mapboxAttribution, renderer: L.canvas()});
    const matrix = L.tileLayer(mapBoxUrl('cjb43gy120c2r2sldnjkumagj'),{ attribution:mapboxAttribution, renderer: L.canvas()});
    const map = L.map('map', {layers: [pastel]}).setView([51.5074, 0.1278, 0.2], 9);
    var baseMaps = {
        'Pastel': pastel,
        'Vintage': vintage,
        'Comic Book': comicBook,
        'Matrix' : matrix
    };

    L.control.layers(baseMaps).addTo(map);
    return map;
}

const createEventListeners = function() {
    const inputFiles = [...document.getElementsByClassName('inputFile')];
    inputFiles.forEach(link => {
        link.addEventListener('change', (e) => {
            fileUploaded(e);
        });
    });
    
    document.querySelector('#arrow').addEventListener('click', () => {
        document.getElementById('modal').classList.toggle('hide');
    });
}

const fileUploaded = function(event) {
    const name = event.target.files[0].name.split('.');
    if(name[name.length-1]=== 'json') {
        const reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(event.target.files[0]);
    }
    else {
        alert('Please upload only the json file');
    }
}

const onReaderLoad = function(event){
    const obj = JSON.parse(event.target.result);
    createHeatMap(obj);
}

const createHeatMap = function(json) {
    if(json.locations) {
        document.getElementById('modal').classList.add('hide');
        const data = json.locations.map(row => {
            return [row.latitudeE7 / e7, row.longitudeE7 / e7, 1] // lat, lng, intensity
        })
        return (
            map.setView(data[0]),
            L.heatLayer(data, {gradient: {0.1: '#4daf4a', 0.65: '#377eb8', 1: '#e41a1c'}}).addTo(map)
        );
    } else {
        alert('Opps that seems to be the incorrect file');
    }
}
