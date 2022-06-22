
let recreationLayer = L.markerClusterGroup();
let recreationLayerfoc = L.markerClusterGroup();

let natureLayer = L.markerClusterGroup();
let natureLayerfoc = L.markerClusterGroup();

let artsLayer = L.markerClusterGroup();
let artsLayerfoc = L.markerClusterGroup();

let cultureHistoryLayer = L.markerClusterGroup();
let cultureHistoryLayerfoc = L.markerClusterGroup();

let archiLandscapesLayer = L.markerClusterGroup();
let archiLandscapesLayerfoc = L.markerClusterGroup();

let searchResultLayer = L.layerGroup();

//arays to store the respective markers
let artsPopup = [];
let artsPopupFOC = [];
let naturePopup = [];
let naturePopupFOC = [];
let cultureHistPopup = [];
let cultureHistPopupFOC = [];
let archiLandPopup = [];
let archiLandPopupFOC = [];
let recreationPopup = [];
let recreationPopupFOC = [];

let userLocation = null;
//variables to store lat/lng of chosen attraction to serve as start point for routing 
let chosenLat = null;
let chosenLng = null;

let routing = null;

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

var userIcon = L.icon({
    iconUrl: 'images/user.png',

    iconSize: [50, 50],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
});


//weather icons
var fairIcon = L.icon({
    iconUrl: 'images/weather/sun.png',

    iconSize: [50, 50],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
});

var partlyCloudyIcon = L.icon({
    iconUrl: 'images/weather/partly-cloudy.png',

    iconSize: [35, 35],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
});

var cloudyIcon = L.icon({
    iconUrl: 'images/weather/cloudy.png',

    iconSize: [35, 35],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
});

var rainIcon = L.icon({
    iconUrl: 'images/weather/rain.png',

    iconSize: [35, 35],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
});

var thunderyIcon = L.icon({
    iconUrl: 'images/weather/storm.png',

    iconSize: [35, 35],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
});

//keys for foc/paid attraction
let entranceFee = {
    'yes': 'FREE ENTRY',
    'depends': 'FREE ENTRY FOR SINGAPOREANS / PRs, FOREIGNERS TO BUY TICKETS',
    'no': 'PURCHASE OF TICKETS REQUIRED'
}

//function to change layer with navbar toggle
function changeLayerDetails(layer, image, entry) {
    layerControl.setAttribute('data-bs-target', `#${layer}`);
    document.querySelector('#nav-toggle').href = `#${layer}`;
    document.querySelector('#nav-toggle').setAttribute('aria-controls', `${layer}`)
    document.querySelector('.leaflet-right .leaflet-control-layers:nth-child(1) .leaflet-control-layers-toggle').style.backgroundImage = `url(images/overlay-control/${image}.png)`;
    document.querySelector('#current-layer').innerHTML = entry;
    return
}

//function to obtain card content for side offcanvas
function getCardContent(attractionImage, attractionName, attractionDescription, attractionAddress, attractionLat, attractionLng, category, attractionLink) {
    let content = `<div class="card mt-3 mx-auto mx-auto" style="width: 18rem;">
                    <img src="${attractionImage}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${attractionName}</h5>
                    
                      <p class="card-text">${attractionDescription} </p>
                      <p class="card-text"> Address: ${attractionAddress}</p>
                      
                    </div>
                    <div class="d-flex flex-row">
                    <button data-latitude='${attractionLat}' 
                    data-longitude='${attractionLng}' 
                    type="button" 
                    class="btn ${category} btn-general-straight w-50" 
                    data-bs-dismiss="offcanvas" 
                    aria-label="Close">view on map</button>

                    <a class = 'btn btn-general-straight w-50' 
                    href='${attractionLink}' target="_blank">
                    visit website</a>
                    </div>
                  </div>`

    return content
}

//function to direct user from side offcanvas to map popup
function directToMap(button, layer, popup) {
    for (let j = 0; j < button.length; j++) {
        button[j].addEventListener('click', function () {
            if (routing) {
                routing.remove()
            }
            layer.zoomToShowLayer(popup[j], function () {
                popup[j].openPopup();
            });
            chosenLat = button[j].dataset.latitude;
            chosenLng = button[j].dataset.longitude
        })
    }
}

//function to trigger with each click
function markerClick(attractionLat, attractionLng) {
    searchResultLayer.clearLayers();
    chosenLat = attractionLat;
    chosenLng = attractionLng;
    map.flyTo([chosenLat, chosenLng], 16);
}
let userLat = null;
let userLng = null;
//routing functions
function showRouteToAttraction() {
    if (routing) {
        routing.remove()
    }
    navigator.geolocation.getCurrentPosition(position)
    if (userLat == null && userLng == null){
        userLat = 1.286498854;
        userLng = 103.841163302;
    }
    userLocation = L.marker([userLat, userLng], { icon: userIcon }).bindPopup('You are here');
    userLocation.addTo(map).openPopup()
    let bounds = L.latLngBounds([userLat, userLng], [chosenLat, chosenLng]);
    map.flyToBounds(bounds)
    routing = L.Routing.control({
        waypoints: [
            L.latLng(userLat, userLng),
            L.latLng(chosenLat, chosenLng)
        ],
        collapsible: true,
        geocoder: L.Control.Geocoder.nominatim()
    }).addTo(map)
}

function showRouteToNearby(placeLat, placeLng) {
    if (routing) {
        routing.remove()
    }
    routing = L.Routing.control({
        waypoints: [
            L.latLng(chosenLat, chosenLng),
            L.latLng(placeLat, placeLng)
        ],
        collapsible: true,
        geocoder: L.Control.Geocoder.nominatim()
    }).addTo(map)
}

