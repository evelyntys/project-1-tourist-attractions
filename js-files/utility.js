let recreation = [];
let recreationLayer = L.markerClusterGroup();
let recreationLayerfoc = L.markerClusterGroup();
let nature = [];
let natureLayer = L.markerClusterGroup();
let natureLayerfoc = L.markerClusterGroup();
let arts = [];
let artsLayer = L.markerClusterGroup();
let artsLayerfoc = L.markerClusterGroup();
let cultureHistory = [];
let cultureHistoryLayer = L.markerClusterGroup();
let cultureHistoryLayerfoc = L.markerClusterGroup();
let archiLandscapes = [];
let archiLandscapesLayer = L.markerClusterGroup();
let archiLandscapesLayerfoc = L.markerClusterGroup();

let searchResultLayer = L.layerGroup();

//marker icons for map
var natureIcon = L.icon({
    iconUrl: 'images/map-markers/nature.png',

    iconSize: [50, 50],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
});

var heritageIcon = L.icon({
    iconUrl: 'images/map-markers/heritage.png',

    iconSize: [50, 50],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
});

var recreationIcon = L.icon({
    iconUrl: 'images/map-markers/recreation.png',

    iconSize: [50, 50],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
});

var archiLandscapesIcon = L.icon({
    iconUrl: 'images/map-markers/landscapes.png',

    iconSize: [50, 50],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
});

var artsIcon = L.icon({
    iconUrl: 'images/map-markers/arts.png',

    iconSize: [50, 50],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
});

var searchIcon = L.icon({
    iconUrl: 'images/map-markers/searching.png',
    iconSize: [50, 50],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
})

//variables to store lat/lng of chosen attraction to serve as start point for routing 
let chosenLat = null;
let chosenLng = null;

//weather icons
var fairIcon = L.icon({
    iconUrl: 'images/weather/sun.png',

    iconSize: [50, 50],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
});

var partlyCloudyIcon = L.icon({
    iconUrl: 'images/weather/partly-cloudy.png',

    iconSize: [50, 50],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
});

var cloudyIcon = L.icon({
    iconUrl: 'images/weather/cloudy.png',

    iconSize: [50, 50],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
});

var rainIcon = L.icon({
    iconUrl: 'images/weather/rain.png',

    iconSize: [50, 50],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
});

var thunderyIcon = L.icon({
    iconUrl: 'images/weather/storm.png',

    iconSize: [50, 50],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
});

//keys for foc/paid attraction
let entranceFee = {
    'yes': 'Free entry',
    'depends': 'Free entry for Singaporeans/PRs, foreigners to buy tickets',
    'no': 'Tickets to be purchased prior to entry'
}

let artsPopup = [];
let artsPopupFOC = [];
let naturePopup = [];
let naturePopupFOC = [];
let cultureHistPopup = [];
let cultureHistFOC = [];
let archiLandPopup = [];
let archiLandFOC = [];
let recreationPopup = [];
let recreationPopupFOC = [];

function directToMap(button, layer, popup) {
    for (let j = 0; j < button.length; j++) {
        button[j].addEventListener('click', function () {
            layer.zoomToShowLayer(popup[j], function () {
                popup[j].openPopup();
            });
        })
    }
}