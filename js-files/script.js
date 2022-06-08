
let map = L.map('map')

//creation of map
map.setView([1.3521, 103.8198], 12)

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw' //demo access token
}).addTo(map);

//lat lng of chosen attraction
let chosenLat = [];
let chosenLng = [];

let searchResultLayer = L.layerGroup();
searchResultLayer.addTo(map)

let focLayer = L.layerGroup();
let nofoc = L.layerGroup();
// nofoc.addTo(map)

let count = 0;
let no = 0;

let link = null;
let query = ''
let testArr = [];
let cultureMarker = null;
let archiArr = [];
async function loadplace() {

    let response = await axios.get('tourism.geojson');

    for (let each of response.data.features) {
        for (let data in each) {

            if (each[data]['PHOTOURL']) {
                let imgUrl = each[data]['PHOTOURL'].split('')
                let index = imgUrl.indexOf('>')
                link = imgUrl.slice(25, index).join('')
            }

            // <div class='container'><h4>${each[data]['Name']}<h4>  <h6>${each[data]['Opening Hours']}</h6>
            //         <a data-latitude='${each.geometry.coordinates[1]}' data-longitude='${each.geometry.coordinates[0]}' class='col-4 btn-sm btn-dark view' href='#map'>see on map</a></div>
            //         <a class='col-4 btn-sm btn-dark get-directions' href='#map'>get directions</a></div>

            if (each[data]['Field_1'] && (each[data]['Field_1'].toLowerCase().includes('culture') || each[data]['PHOTOURL'].toLowerCase().includes('culture'))) {
                culture.push(each)
                document.querySelector('#culture').innerHTML += `<div class="card mt-3" style="width: 18rem;">
                    <img src="${link}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${each[data]['Name']}</h5>
                      <h6 class="card-text">${each[data]['Opening Hours']}
                      <p class="card-text">${each[data]['description']}</p>
                      <a data-latitude='${each.geometry.coordinates[1]}' data-longitude='${each.geometry.coordinates[0]}' class='btn-sm btn-dark view' href='#map'>see on map</a>
                      <a href="#map" class="btn-sm btn-dark get-directions">Get directions</a>
                    </div>
                  </div>`
                let view = document.querySelectorAll('.view');
                cultureMarker = L.marker([each.geometry.coordinates[1], each.geometry.coordinates[0]], { icon: museumIcon }).bindPopup(`<img style='width: 100%' src="${link}> <h4>${each[data]['Name']}<h4>  <h6>${each[data]['Opening Hours']}</h6>`)
                if (each[data]['foc'] == 'yes') {
                    cultureMarker.addTo(focLayer).addTo(cultureLayerfoc)
                    count++
                }
                else {
                    cultureMarker.addTo(nofoc).addTo(cultureLayer)
                    no++
                }
                testArr.push(cultureMarker)
                for (let i = 0; i < view.length; i++) {
                    view[i].addEventListener('click', function (e) {
                        map.flyTo([view[i].dataset.latitude, view[i].dataset.longitude], 16)
                        testArr[i].openPopup()

                    })
                }

                let getDirections = document.querySelectorAll('.get-directions');
                for (let i = 0; i < view.length; i++) {
                    getDirections[i].addEventListener('click', function () {
                        map.flyTo([view[i].dataset.latitude, view[i].dataset.longitude], 16)
                        testArr[i].openPopup();
                        chosenLat = view[i].dataset.latitude
                        chosenLng = view[i].dataset.longitude
                        L.Routing.control({
                            waypoints: [
                                L.latLng(userLat, userLng),
                                L.latLng(chosenLat, chosenLng)
                            ]
                        }).addTo(map);
                    })
                }

                cultureMarker.on('dblclick', async function mapfly(e) {
                    searchResultLayer.clearLayers();
                    document.querySelector('#searchbar').style.display = 'block';

                    map.flyTo([each.geometry.coordinates[1], each.geometry.coordinates[0]], 16)
                    chosenLat = each.geometry.coordinates[1];
                    chosenLng = each.geometry.coordinates[0];


                    L.Routing.control({
                        waypoints: [
                            L.latLng(userLat, userLng),
                            L.latLng(chosenLat, chosenLng)
                        ]
                    }).addTo(map);




                })
            }
            else if (each[data]['Field_1'] && (each[data]['Field_1'].toLowerCase().includes('architecture') || each[data]['PHOTOURL'].toLowerCase().includes('architecture'))) {
                architecture.push(each)
                // let architectureMarker = L.marker([each.geometry.coordinates[1], each.geometry.coordinates[0]], { icon: architectureIcon }).bindPopup(each[data]['Name'])
                let architectureMarker = L.marker([each.geometry.coordinates[1], each.geometry.coordinates[0]], { icon: architectureIcon }).bindPopup(`<img style='width: 100%' src="${link}> <h4>${each[data]['Name']}<h4>  <h6>${each[data]['Opening Hours']}</h6>`)
                document.querySelector('#architecture').innerHTML += `<div class="card mt-3" style="width: 18rem;">
                        <img src="${link}" class="card-img-top" alt="...">
                        <div class="card-body">
                          <h5 class="card-title">${each[data]['Name']}</h5>
                          <h6 class="card-text">${each[data]['Opening Hours']}
                          <p class="card-text">${each[data]['description']}</p>
                          <a data-latitude='${each.geometry.coordinates[1]}' data-longitude='${each.geometry.coordinates[0]}' class='btn-sm btn-dark view-architecture' href='#map'>see on map</a>
                          <a href="#map" class="btn-sm btn-dark get-directions-archi">Get directions</a>
                        </div>
                      </div>`
                if (each[data]['foc'] == 'yes') {
                    architectureMarker.addTo(focLayer).addTo(architectureLayerfoc)
                    count++
                }
                else {
                    architectureMarker.addTo(nofoc).addTo(architectureLayer)
                    no++
                }
                let viewArchitecture = document.querySelectorAll('.view-architecture');
                archiArr.push(architectureMarker)
                for (let i = 0; i < viewArchitecture.length; i++) {
                    viewArchitecture[i].addEventListener('click', function (e) {
                        map.flyTo([viewArchitecture[i].dataset.latitude, viewArchitecture[i].dataset.longitude], 16)
                        archiArr[i].openPopup()

                    })
                }

                let getDirectionsArchi = document.querySelectorAll('.get-directions-archi');
                for (let i = 0; i < viewArchitecture.length; i++) {
                    getDirectionsArchi[i].addEventListener('click', function () {
                        map.flyTo([viewArchitecture[i].dataset.latitude, viewArchitecture[i].dataset.longitude], 16)
                        archiArr[i].openPopup();
                        chosenLat = viewArchitecture[i].dataset.latitude
                        chosenLng = viewArchitecture[i].dataset.longitude
                        L.Routing.control({
                            waypoints: [
                                L.latLng(userLat, userLng),
                                L.latLng(chosenLat, chosenLng)
                            ]
                        }).addTo(map);
                    })
                }

                architectureMarker.on('dblclick', async function mapfly(e) {
                    searchResultLayer.clearLayers();
                    document.querySelector('#searchbar').style.display = 'block';

                    map.flyTo([each.geometry.coordinates[1], each.geometry.coordinates[0]], 16)
                    chosenLat = each.geometry.coordinates[1];
                    chosenLng = each.geometry.coordinates[0];


                    L.Routing.control({
                        waypoints: [
                            L.latLng(userLat, userLng),
                            L.latLng(chosenLat, chosenLng)
                        ]
                    }).addTo(map);

                })
            }

            else if (each[data]['Field_1'] && (each[data]['Field_1'].toLowerCase().includes('recreation') || each[data]['PHOTOURL'].toLowerCase().includes('recreation'))) {
                recreation.push(each)
                let recreationMarker = L.marker([each.geometry.coordinates[1], each.geometry.coordinates[0]], { icon: recreationIcon }).bindPopup(each[data]['Name'])
                if (each[data]['foc'] == 'yes') {
                    recreationMarker.addTo(focLayer).addTo(recreationLayerfoc)
                    count++
                }
                else {
                    recreationMarker.addTo(nofoc).addTo(recreationLayer)
                    no++
                }
            }

            else if (each[data]['Field_1'] && (each[data]['Field_1'].toLowerCase().includes('nature') || each[data]['PHOTOURL'].toLowerCase().includes('nature'))) {
                nature.push(each)
                let natureMarker = L.marker([each.geometry.coordinates[1], each.geometry.coordinates[0]], { icon: natureIcon }).bindPopup(each[data]['Name'])
                if (each[data]['foc'] == 'yes') {
                    natureMarker.addTo(focLayer).addTo(natureLayerfoc)
                    count++
                }
                else {
                    natureMarker.addTo(nofoc).addTo(natureLayer)
                    no++
                }
            }

            else if (each[data]['Field_1'] && (each[data]['Field_1'].toLowerCase().includes('arts') || each[data]['PHOTOURL'].toLowerCase().includes('arts'))) {
                arts.push(each)
                let artsMarker = L.marker([each.geometry.coordinates[1], each.geometry.coordinates[0]], { icon: artsIcon }).bindPopup(each[data]['Name'])
                if (each[data]['foc'] == 'yes') {
                    artsMarker.addTo(focLayer).addTo(artsLayerfoc)
                    count++
                }
                else {
                    artsMarker.addTo(nofoc).addTo(artsLayer)
                    no++
                }
            }

            else if (each[data]['Field_1'] && (each[data]['Field_1'].toLowerCase().includes('history') || each[data]['PHOTOURL'].toLowerCase().includes('history'))) {
                history.push(each)
                let historyMarker = L.marker([each.geometry.coordinates[1], each.geometry.coordinates[0]], { icon: heritageIcon }).bindPopup(each[data]['Name'])
                if (each[data]['foc'] == 'yes') {
                    historyMarker.addTo(focLayer).addTo(historyLayerfoc)
                    count++
                }
                else {
                    historyMarker.addTo(nofoc).addTo(historyLayer)
                    no++
                }
            }

            else if (each[data]['Field_1'] && (each[data]['Field_1'].toLowerCase().includes('places-to-see') || each[data]['PHOTOURL'].toLowerCase().includes('places-to-see'))) {
                landscapes.push(each)
                let landscapesMarker = L.marker([each.geometry.coordinates[1], each.geometry.coordinates[0]], { icon: landscapesIcon }).bindPopup(each[data]['Name'])
                if (each[data]['foc'] == 'yes') {
                    landscapesMarker.addTo(focLayer).addTo(landscapesLayerfoc)
                    count++
                }
                else {
                    landscapesMarker.addTo(nofoc).addTo(landscapesLayer)
                    no++
                }
            }
        }
    }


    console.log(count)
    console.log(no)


}


loadplace()

cultureLayer.addTo(map)
architectureLayer.addTo(map)
artsLayer.addTo(map)
natureLayer.addTo(map)
historyLayer.addTo(map)
landscapesLayer.addTo(map)
recreationLayer.addTo(map)


//four square
const BASE_API_URL = 'https://api.foursquare.com/v3/';
const API_KEY = 'fsq3ZRDrusEE9o+I1ExY+0+OY+AEHvj6C8fw5zccHOkbJpA=';
async function search(query) {
    let url = BASE_API_URL + 'places/search';
    let response = await axios.get(url, {
        'params': {
            'll': chosenLat + "," + chosenLng,
            'query': query,
            'radius': 1000,
            'limit': 50,
        },
        'headers': {
            'Accept': 'application/json',
            'Authorization': API_KEY
        }
    });
    return response.data
}

//usersearch foursquare
document.querySelector('#searchBtn').addEventListener('click', async function () {
    searchResultLayer.clearLayers();
    query = document.querySelector('#search').value;
    console.log(query)
    if (query.length > 0) {
        let locations = await search(query);
        L.circle([chosenLat, chosenLng], { radius: 1000 }).addTo(searchResultLayer)
        for (let eachResult of locations.results) {
            let lat = eachResult.geocodes.main.latitude;
            let lng = eachResult.geocodes.main.longitude;
            L.marker([lat, lng], { icon: searchIcon }).addTo(searchResultLayer).bindPopup(`${eachResult.name}`)
        }
    }
    else {
        document.querySelector('#validate').innerHTML += `<div class='alert alert-warning'>please enter a search term</div>`
    }
})

//get user location
navigator.geolocation.getCurrentPosition(position)
let userLat = null;
let userLng = null;

function position(markers) {
    userLat = markers.coords.latitude;
    userLng = markers.coords.longitude;

}

L.control.locate().addTo(map);

var marker = new L.marker([userLat, userLng], {
    draggable: 'true'
});


console.log(culture)

let overlayLayers = {
    '<img style="height: 20px" src="images/map-markers/museum.png"> culture': cultureLayer,
    '<img style="height: 20px" src="images/map-markers/architecture.png">architecture': architectureLayer,
    '<img style="height: 20px" src="images/map-markers/arts.png">arts': artsLayer,
    '<img style="height: 20px" src="images/map-markers/nature.png">nature': natureLayer,
    '<img style="height: 20px" src="images/map-markers/heritage.png">history': historyLayer,
    '<img style="height: 20px" src="images/map-markers/landscapes.png">landscapes': landscapesLayer,
    '<img style="height: 20px" src="images/map-markers/recreation.png">recreation': recreationLayer
}

let controller = L.control.layers({}, overlayLayers).addTo(map);


let focToggle = document.querySelector('#foc-toggle')
let current = document.querySelector('#now')

let PAID = [cultureLayer, architectureLayer, artsLayer, natureLayer, historyLayer, landscapesLayer, recreationLayer];

let FREE = [cultureLayerfoc, architectureLayerfoc, artsLayerfoc, natureLayerfoc, historyLayerfoc, landscapesLayerfoc, recreationLayerfoc];


focToggle.addEventListener('click', function () {
    if (current.innerHTML == "no foc") {
        controller.remove();
        current.innerHTML = "foc"
        overlayLayersFOC = {
            '<img style="height: 20px" src="images/map-markers/museum.png"> culture': cultureLayer,
            '<img style="height: 20px" src="images/map-markers/architecture.png">architecturefoc': architectureLayerfoc,
            '<img style="height: 20px" src="images/map-markers/arts.png"> artsfoc': artsLayerfoc,
            '<img style="height: 20px" src="images/map-markers/nature.png">naturefoc': natureLayerfoc,
            '<img style="height: 20px" src="images/map-markers/heritage.png">historyfoc': historyLayerfoc,
            '<img style="height: 20px" src="images/map-markers/landscapes.png">landscapesfoc': landscapesLayerfoc,
            '<img style="height: 20px" src="images/map-markers/recreation.png">recreationfoc': recreationLayerfoc
        }
        let i = 0;
        for (let each in overlayLayers) {
            overlayLayers[each] = FREE[i];
            map.removeLayer(PAID[i]);
            FREE[i].addTo(map)
            i++;
        }
        controller = L.control.layers({}, overlayLayersFOC).addTo(map);
        document.querySelector('.leaflet-top.leaflet-right .leaflet-control-layers:nth-child(1) .leaflet-control-layers-toggle').style.backgroundImage = "url(images/overlay-control/free.png)";
    }
    else {
        current.innerText = "no foc";
        controller.remove()
        let i = 0;
        for (let each in overlayLayers) {
            overlayLayers[each] = PAID[i];
            map.removeLayer(FREE[i]);
            PAID[i].addTo(map)
            i++;
        }
        controller = L.control.layers({}, overlayLayers).addTo(map)
    }
})