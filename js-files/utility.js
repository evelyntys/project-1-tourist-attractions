let architecture = [];
let architectureLayer = L.markerClusterGroup();
let architectureLayerfoc = L.markerClusterGroup();
let culture = [];
let cultureLayerfoc = L.markerClusterGroup();
let cultureLayer = L.markerClusterGroup();
let recreation = [];
let recreationLayer = L.markerClusterGroup();
let recreationLayerfoc = L.markerClusterGroup();
let nature = [];
let natureLayer = L.markerClusterGroup();
let natureLayerfoc = L.markerClusterGroup();
let arts = [];
let artsLayer = L.markerClusterGroup();
let artsLayerfoc = L.markerClusterGroup();
let history = [];
let historyLayer = L.markerClusterGroup();
let historyLayerfoc = L.markerClusterGroup();
let landscapes = [];
let landscapesLayer = L.markerClusterGroup();
let landscapesLayerfoc = L.markerClusterGroup();

//icons
var museumIcon = L.icon({
    iconUrl: 'images/map-markers/museum.png',

    iconSize: [50, 50],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
});

var natureIcon = L.icon({
    iconUrl: 'images/map-markers/nature.png',

    iconSize: [50, 50],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
});

var architectureIcon = L.icon({
    iconUrl: 'images/map-markers/architecture.png',

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

var landscapesIcon = L.icon({
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
