let map = createMap()
let testArr = [];
let archiArr = [];
let imgUrl = null;
let routing = null;


//get user location
navigator.geolocation.getCurrentPosition(position)
let userLat = null;
let userLng = null;

function position(markers) {
    userLat = markers.coords.latitude;
    userLng = markers.coords.longitude;
}

function showRoute(){
    if (routing){
        routing.remove()
    }
    navigator.geolocation.getCurrentPosition(position)
    routing = L.Routing.control({ waypoints: [
                    L.latLng(userLat, userLng),
                    L. latLng(chosenLat, chosenLng)
                ]}).addTo(map)
}

window.addEventListener('DOMContentLoaded', async function () {

    let response = await axios.get('tourism.geojson');
    for (let each of response.data.features) {
        for (let data in each) {

            //to get image imgUrl for display of images
            if (each[data]['PHOTOURL']) {
                imgUrl = each[data]['PHOTOURL'].split('')
                let indexEnd = imgUrl.indexOf('>')
                imgUrl = imgUrl.slice(25, indexEnd).join('')
            }

            //arts layer

            if (each[data]['Field_1'] && (each[data]['Field_1'].toLowerCase().includes('arts')
                || each[data]['PHOTOURL'].toLowerCase().includes('arts'))) {
                arts.push(each)
                let artsMarker = L.marker([each.geometry.coordinates[1], each.geometry.coordinates[0]],
                    { icon: artsIcon })
                    .bindPopup(`<img style='width: 50%' class='mx-auto' src="${imgUrl}> 
                ${each[data]['Name']}<br>  
                Opening Hours: ${each[data]['Opening Hours']}<br>
                ${each[data]['description']}
                ${entranceFee[each[data]['foc']]}
                <button
                class='btn-sm btn-dark view'
                type="button" data-bs-toggle="offcanvas" role="button" 
                aria-controls="searchcanvas" 
                data-bs-target="#searchcanvas">search nearby</button>
                
                <button class='btn-sm btn-dark help'
                type="button" onclick='showRoute()'}>
                get directions</button>`
                )

                    

                if (each[data]['foc'] == 'yes') {
                    artsMarker.addTo(artsLayerfoc);
                    document.querySelector('#artsfoc').innerHTML += `<div class="card mt-3" style="width: 18rem;">
                    <img src="${imgUrl}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${each[data]['Name']}</h5>
                      <h6 class="card-text">${each[data]['Opening Hours']}</h6>
                      <p class="card-text">${each[data]['description']}</p>
                    <button data-latitude='${each.geometry.coordinates[1]}' data-longitude='${each.geometry.coordinates[0]}' type="button" class="btn directions-arts btn-dark" data-bs-dismiss="offcanvas" aria-label="Close">view on map</button>
                    </div>
                  </div>`

                }
                else {
                    artsMarker.addTo(artsLayer);
                    document.querySelector('#arts').innerHTML += `<div class="card mt-3" style="width: 18rem;">
                    <img src="${imgUrl}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${each[data]['Name']}</h5>
                      <h6 class="card-text">${each[data]['Opening Hours']}</h6>
                      <p class="card-text">${each[data]['description']}</p>
                      <button data-latitude='${each.geometry.coordinates[1]}' data-longitude='${each.geometry.coordinates[0]}' type="button" class="btn directions-arts" data-bs-dismiss="offcanvas" aria-label="Close">view on map</button>
                    </div>
                  </div>`

                }

                artsMarker.on('click', function (){
                    searchResultLayer.clearLayers();
                    document.querySelector('#search-side').style.display = 'block';
                    chosenLat = each.geometry.coordinates[1];
                    chosenLng = each.geometry.coordinates[0];
                    map.flyTo([chosenLat, chosenLng], 16)
                })
            }


            //nature layer
            else if (each[data]['Field_1'] && (each[data]['Field_1'].toLowerCase().includes('nature') || each[data]['PHOTOURL'].toLowerCase().includes('nature'))) {
                nature.push(each)
                let natureMarker = L.marker([each.geometry.coordinates[1], each.geometry.coordinates[0]],
                    { icon: natureIcon })
                    .bindPopup(`<img style='width: 50%' class='mx-auto' src="${imgUrl}> 
                ${each[data]['Name']}<br>  
                Opening Hours: ${each[data]['Opening Hours']}<br>
                ${each[data]['description']}
                ${entranceFee[each[data]['foc']]}
                <button
                class='btn-sm btn-dark view'
                type="button" data-bs-toggle="offcanvas" role="button" 
                aria-controls="searchcanvas" 
                data-bs-target="#searchcanvas">search nearby</button>
                
                <button class='btn-sm btn-dark help'
                type="button" onclick='showRoute()'}>
                get directions</button>`
                    );
                if (each[data]['foc'] == 'yes') {
                    natureMarker.addTo(natureLayerfoc);
                    document.querySelector('#naturefoc').innerHTML += `<div class="card mt-3" style="width: 18rem;">
                    <img src="${imgUrl}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${each[data]['Name']}</h5>
                      <h6 class="card-text">${each[data]['Opening Hours']}</h6>
                      <p class="card-text">${each[data]['description']}</p>
                      <a data-latitude='${each.geometry.coordinates[1]}' data-longitude='${each.geometry.coordinates[0]}' class='btn-sm btn-dark view-architecture' href='#map'>search nearby</a>
                    <button data-latitude='${each.geometry.coordinates[1]}' data-longitude='${each.geometry.coordinates[0]}' type="button" class="btn directions" data-bs-dismiss="offcanvas" aria-label="Close">get directions</button>
                    </div>
                  </div>`

                }
                else {
                    natureMarker.addTo(natureLayer);
                    document.querySelector('#nature').innerHTML += `<div class="card mt-3" style="width: 18rem;">
                    <img src="${imgUrl}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${each[data]['Name']}</h5>
                      <h6 class="card-text">${each[data]['Opening Hours']}</h6>
                      <p class="card-text">${each[data]['description']}</p>
                      <a data-latitude='${each.geometry.coordinates[1]}' data-longitude='${each.geometry.coordinates[0]}' class='btn-sm btn-dark view-architecture' href='#map'>search nearby</a>
                    <button data-latitude='${each.geometry.coordinates[1]}' data-longitude='${each.geometry.coordinates[0]}' type="button" class="btn directions" data-bs-dismiss="offcanvas" aria-label="Close">get directions</button>
                    </div>
                  </div>`

                }
                natureMarker.on('click', function (){
                    searchResultLayer.clearLayers();
                    chosenLat = each.geometry.coordinates[1];
                    chosenLng = each.geometry.coordinates[0];
                    map.flyTo([chosenLat, chosenLng], 16);
                    document.querySelector('#search-side').style.display = 'block';
                })
            }

            //culture history layer
            else if (each[data]['Field_1'] && (each[data]['Field_1'].toLowerCase().includes('culture') || each[data]['Field_1'] && (each[data]['Field_1'].toLowerCase().includes('history')))) {
                cultureHistoryMarker = L.marker([each.geometry.coordinates[1], each.geometry.coordinates[0]],
                    { icon: heritageIcon })
                    .bindPopup(`<img style='width: 50%' class='mx-auto' src="${imgUrl}> 
                    ${each[data]['Name']}<br>  
                    Opening Hours: ${each[data]['Opening Hours']}<br>
                    ${each[data]['description']}
                    ${entranceFee[each[data]['foc']]}
                    <button
                class='btn-sm btn-dark view'
                type="button" data-bs-toggle="offcanvas" role="button" 
                aria-controls="searchcanvas" 
                data-bs-target="#searchcanvas">search nearby</button>
                
                <button class='btn-sm btn-dark help'
                type="button" onclick='showRoute()'}>
                get directions</button>`
                    )

                if (each[data]['foc'] == 'yes') {
                    cultureHistoryMarker.addTo(cultureHistoryLayerfoc);
                    document.querySelector('#culture-hist-foc').innerHTML += `<div class="card mt-3" style="width: 18rem;">
                    <img src="${imgUrl}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${each[data]['Name']}</h5>
                      <h6 class="card-text">${each[data]['Opening Hours']}</h6>
                      <p class="card-text">${each[data]['description']}</p>
                      <a data-latitude='${each.geometry.coordinates[1]}' data-longitude='${each.geometry.coordinates[0]}' class='btn-sm btn-dark view-architecture' href='#map'>search nearby</a>
                      <button data-latitude='${each.geometry.coordinates[1]}' data-longitude='${each.geometry.coordinates[0]}' type="button" class="btn directions" data-bs-dismiss="offcanvas" aria-label="Close">get directions</button>
                    </div>
                  </div>`

                }

                else {
                    cultureHistoryMarker.addTo(cultureHistoryLayer);
                    document.querySelector('#culture-hist').innerHTML += `<div class="card mt-3" style="width: 18rem;">
                    <img src="${imgUrl}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${each[data]['Name']}</h5>
                      <h6 class="card-text">${each[data]['Opening Hours']}</h6>
                      <p class="card-text">${each[data]['description']}</p>
                      <a data-latitude='${each.geometry.coordinates[1]}' data-longitude='${each.geometry.coordinates[0]}' class='btn-sm btn-dark view-architecture' href='#map'>search nearby</a>
                      <button data-latitude='${each.geometry.coordinates[1]}' data-longitude='${each.geometry.coordinates[0]}' type="button" class="btn directions" data-bs-dismiss="offcanvas" aria-label="Close">get directions</button>
                    </div>
                  </div>`

                }

                cultureHistoryMarker.on('click', function (){
                    searchResultLayer.clearLayers();
                    chosenLat = each.geometry.coordinates[1];
                    chosenLng = each.geometry.coordinates[0];
                    map.flyTo([chosenLat, chosenLng], 16);
                    document.querySelector('#search-side').style.display = 'block';
                })
            }

            //archi landscape layer
            else if (each[data]['Field_1'] && (each[data]['Field_1'].toLowerCase().includes('architecture') || each[data]['Field_1'] && (each[data]['Field_1'].toLowerCase().includes('places-to-see')))) {
                archiLandscapes.push(each)
                // let architectureMarker = L.marker([each.geometry.coordinates[1], each.geometry.coordinates[0]], { icon: architectureIcon }).bindPopup(each[data]['Name'])
                let archiLandscapesMarker = L.marker([each.geometry.coordinates[1], each.geometry.coordinates[0]],
                    { icon: archiLandscapesIcon })
                    .bindPopup(`<img style='width: 50%' class='mx-auto' src="${imgUrl}> 
                    ${each[data]['Name']}<br>  
                    Opening Hours: ${each[data]['Opening Hours']}<br>
                    ${each[data]['description']}
                    ${entranceFee[each[data]['foc']]}
                    <button
                    class='btn-sm btn-dark view'
                    type="button" data-bs-toggle="offcanvas" role="button" 
                    aria-controls="searchcanvas" 
                    data-bs-target="#searchcanvas">search nearby</button>
                    
                    <button class='btn-sm btn-dark help'
                    type="button" onclick='showRoute()'}>
                    get directions</button>`
                    )
                if (each[data]['foc'] == 'yes') {
                    archiLandscapesMarker.addTo(archiLandscapesLayerfoc);
                    document.querySelector('#archi-land-foc').innerHTML += `<div class="card mt-3" style="width: 18rem;">
                        <img src="${imgUrl}" class="card-img-top" alt="...">
                        <div class="card-body">
                          <h5 class="card-title">${each[data]['Name']}</h5>
                          <h6 class="card-text">${each[data]['Opening Hours']}</h6>
                          <p class="card-text">${each[data]['description']}</p>
                          <a data-latitude='${each.geometry.coordinates[1]}' data-longitude='${each.geometry.coordinates[0]}' class='btn-sm btn-dark view-architecture' href='#map'>search nearby</a>
                        <button data-latitude='${each.geometry.coordinates[1]}' data-longitude='${each.geometry.coordinates[0]}' type="button" class="btn directions" data-bs-dismiss="offcanvas" aria-label="Close">get directions</button>
                        </div>
                      </div>`

                }
                else {
                    archiLandscapesMarker.addTo(archiLandscapesLayer);
                    document.querySelector('#archi-land').innerHTML += `<div class="card mt-3" style="width: 18rem;">
                        <img src="${imgUrl}" class="card-img-top" alt="...">
                        <div class="card-body">
                          <h5 class="card-title">${each[data]['Name']}</h5>
                          <h6 class="card-text">${each[data]['Opening Hours']}</h6>
                          <p class="card-text">${each[data]['description']}</p>
                          <a data-latitude='${each.geometry.coordinates[1]}' data-longitude='${each.geometry.coordinates[0]}' class='btn-sm btn-dark view-architecture' href='#map'>search nearby</a>
                        <button data-latitude='${each.geometry.coordinates[1]}' data-longitude='${each.geometry.coordinates[0]}' type="button" class="btn directions" data-bs-dismiss="offcanvas" aria-label="Close">get directions</button>
                        </div>
                      </div>`

                }

                archiLandscapesMarker.on('click', function (){
                    searchResultLayer.clearLayers();
                    chosenLat = each.geometry.coordinates[1];
                    chosenLng = each.geometry.coordinates[0];
                    map.flyTo([chosenLat, chosenLng], 16);
                    document.querySelector('#search-side').style.display = 'block';
                })
            }

            //recreation layer

            else if (each[data]['Field_1'] && (each[data]['Field_1'].toLowerCase().includes('recreation') || each[data]['PHOTOURL'].toLowerCase().includes('recreation'))) {
                recreation.push(each)
                let recreationMarker = L.marker([each.geometry.coordinates[1], each.geometry.coordinates[0]],
                    { icon: recreationIcon })
                    .bindPopup(`<img style='width: 50%' class='mx-auto' src="${imgUrl}> 
                    ${each[data]['Name']}<br>  
                    Opening Hours: ${each[data]['Opening Hours']}<br>
                    ${each[data]['description']}
                    ${entranceFee[each[data]['foc']]}
                    <button
                class='btn-sm btn-dark view'
                type="button" data-bs-toggle="offcanvas" role="button" 
                aria-controls="searchcanvas" 
                data-bs-target="#searchcanvas">search nearby</button>
                
                <button class='btn-sm btn-dark help'
                type="button" onclick='showRoute()'}>
                get directions</button>`
                    )
                if (each[data]['foc'] == 'yes') {
                    recreationMarker.addTo(recreationLayerfoc);
                    document.querySelector('#recreation-foc').innerHTML += `<div class="card mt-3" style="width: 18rem;">
                    <img src="${imgUrl}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${each[data]['Name']}</h5>
                      <h6 class="card-text">${each[data]['Opening Hours']}</h6>
                      <p class="card-text">${each[data]['description']}</p>
                      <a data-latitude='${each.geometry.coordinates[1]}' data-longitude='${each.geometry.coordinates[0]}' class='btn-sm btn-dark view-architecture' href='#map'>search nearby</a>
                    <button data-latitude='${each.geometry.coordinates[1]}' data-longitude='${each.geometry.coordinates[0]}' type="button" class="btn directions" data-bs-dismiss="offcanvas" aria-label="Close">get directions</button>
                    </div>
                  </div>`

                }
                else {
                    recreationMarker.addTo(recreationLayer);
                    document.querySelector('#recreation').innerHTML += `<div class="card mt-3" style="width: 18rem;">
                    <img src="${imgUrl}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${each[data]['Name']}</h5>
                      <h6 class="card-text">${each[data]['Opening Hours']}</h6>
                      <p class="card-text">${each[data]['description']}</p>
                      <a data-latitude='${each.geometry.coordinates[1]}' data-longitude='${each.geometry.coordinates[0]}' class='btn-sm btn-dark view-architecture' href='#map'>search nearby</a>
                    <button data-latitude='${each.geometry.coordinates[1]}' data-longitude='${each.geometry.coordinates[0]}' type="button" class="btn directions" data-bs-dismiss="offcanvas" aria-label="Close">get directions</button>
                    </div>
                  </div>`

                }
                recreationMarker.on('click', function (){
                    searchResultLayer.clearLayers();
                    chosenLat = each.geometry.coordinates[1];
                    chosenLng = each.geometry.coordinates[0];
                    map.flyTo([chosenLat, chosenLng], 16);
                    document.querySelector('#search-side').style.display = 'block';
                })
            }

        }
    }
})


//adding layers to map
cultureHistoryLayer.addTo(map)
archiLandscapesLayer.addTo(map)
artsLayer.addTo(map)
natureLayer.addTo(map)
recreationLayer.addTo(map)
searchResultLayer.addTo(map)

//usersearch foursquare
document.querySelector('#searchBtn').addEventListener('click', async function () {
    searchResultLayer.clearLayers();
    if (routing) {
        routing.remove()
    }
    document.querySelector('#results').innerHTML = "";
    query = document.querySelector('#search').value;
    if (query.length > 0) {
        let locations = await search(query);
        L.circle([chosenLat, chosenLng], { radius: 1000, color: '#C0392B' }).addTo(searchResultLayer)
        for (let eachResult of locations.results) {
            let lat = eachResult.geocodes.main.latitude;
            let lng = eachResult.geocodes.main.longitude;
            let resultPopup = L.marker([lat, lng], { icon: searchIcon }).addTo(searchResultLayer)
            resultPopup.bindPopup(`<h4>${eachResult.name}</h4>
          <h6>  ${eachResult.location.formatted_address}`)
            let resultElement = document.createElement('div');
            resultElement.className = 'search-result';
            resultElement.innerHTML = eachResult.name;
            resultElement.setAttribute("data-bs-dismiss", "offcanvas");
            resultElement.setAttribute("aria-label", "Close")
            resultElement.addEventListener('click', function () {
                map.flyTo([lat, lng], 16)
                resultPopup.openPopup();
            })

            document.querySelector('#results').appendChild(resultElement);
        }
    }
    else {
        document.querySelector('#validate').innerHTML = `<div class='alert alert-warning'>please enter a search term</div>`
    }
})

document.querySelector('#reset').addEventListener('click', function(){
    document.querySelector('#results').innerHTML = "";
    searchResultLayer.clearLayers()
})

//overlay controls
let overlayLayers = {
    '<img style="height: 25px" src="images/map-markers/arts.png">arts': artsLayer,
    '<img style="height: 25px" src="images/map-markers/nature.png">nature': natureLayer,
    '<img style="height: 25px" src="images/map-markers/heritage.png">culture & history': cultureHistoryLayer,
    '<img style="height: 25px" src="images/map-markers/landscapes.png">architecture & landscapes': archiLandscapesLayer,
    '<img style="height: 25px" src="images/map-markers/recreation.png">recreation': recreationLayer
}

let controller = L.control.layers({}, overlayLayers).addTo(map);



//toggle for current layer
let focToggle = document.querySelector('#foc-toggle')
let current = document.querySelector('#now')
let PAID = [artsLayer, natureLayer, cultureHistoryLayer, archiLandscapesLayer, recreationLayer];
let FREE = [artsLayerfoc, natureLayerfoc, cultureHistoryLayerfoc, archiLandscapesLayerfoc, recreationLayerfoc];

focToggle.addEventListener('click', function () {
    if (routing) {
        routing.remove()
    }
    if (current.innerHTML == "no foc") {
        controller.remove();
        current.innerHTML = "foc"
        overlayLayersFOC = {
            '<img style="height: 25px" src="images/map-markers/arts.png"> artsfoc': artsLayerfoc,
            '<img style="height: 25px" src="images/map-markers/nature.png">naturefoc': natureLayerfoc,
            '<img style="height: 25px" src="images/map-markers/heritage.png">culture & historyfoc': cultureHistoryLayerfoc,
            '<img style="height: 25px" src="images/map-markers/landscapes.png">architecture & landscapesfoc': archiLandscapesLayerfoc,
            '<img style="height: 25px" src="images/map-markers/recreation.png">recreationfoc': recreationLayerfoc
        }
        let i = 0;
        for (let each in overlayLayers) {
            map.removeLayer(PAID[i]);
            FREE[i].addTo(map)
            i++;
        }
        controller = L.control.layers({}, overlayLayersFOC, { position: 'topright' }).addTo(map);
        controller.setPosition('topright');
        document.querySelector('.leaflet-control-layers-toggle').style.backgroundImage = "url(images/overlay-control/free.png)";
    }
    else {
        current.innerText = "no foc";
        controller.remove()
        let i = 0;
        for (let each in overlayLayers) {
            map.removeLayer(FREE[i]);
            PAID[i].addTo(map)
            i++;
        }
        controller = L.control.layers({}, overlayLayers, { position: 'topright' }).addTo(map);
        document.querySelector('.leaflet-control-layers-toggle').style.backgroundImage = "url(images/overlay-control/tickets.png)";
    }
})



//weather API
let weatherMarkers = L.layerGroup()

let weatherAPI = 'https://api.data.gov.sg/v1/environment/2-hour-weather-forecast';
async function getWeather() {
    let response = await axios.get(weatherAPI);
    let weatherData = response.data;
    for (let i = 0; i < weatherData.area_metadata.length; i++) {
        if (weatherData.items[0].forecasts[i].forecast.toLowerCase().includes('partly cloudy')) {
            let marker = L.marker([weatherData.area_metadata[i].label_location.latitude, weatherData.area_metadata[i].label_location.longitude], { icon: partlyCloudyIcon }).addTo(weatherMarkers)
            marker.bindPopup(`<h6>${weatherData.items[0].forecasts[i].area}</h6>
            ${weatherData.items[0].forecasts[i].forecast}`)
        }
        else if (weatherData.items[0].forecasts[i].forecast.toLowerCase().includes('cloudy')) {
            let marker = L.marker([weatherData.area_metadata[i].label_location.latitude, weatherData.area_metadata[i].label_location.longitude], { icon: cloudyIcon }).addTo(weatherMarkers)
            marker.bindPopup(`<h6>${weatherData.items[0].forecasts[i].area}</h6>
        ${weatherData.items[0].forecasts[i].forecast}`)
        }
        else if (weatherData.items[0].forecasts[i].forecast.toLowerCase().includes('thunder')) {
            let marker = L.marker([weatherData.area_metadata[i].label_location.latitude, weatherData.area_metadata[i].label_location.longitude], { icon: thunderyIcon }).addTo(weatherMarkers)
            marker.bindPopup(`<h6>${weatherData.items[0].forecasts[i].area}</h6>
            ${weatherData.items[0].forecasts[i].forecast}`)
        }
        else if (weatherData.items[0].forecasts[i].forecast.toLowerCase().includes('rain') || weatherData.items[0].forecasts[i].forecast.toLowerCase().includes('showers')) {
            let marker = L.marker([weatherData.area_metadata[i].label_location.latitude, weatherData.area_metadata[i].label_location.longitude], { icon: rainIcon }).addTo(weatherMarkers)
            marker.bindPopup(`<h6>${weatherData.items[0].forecasts[i].area}</h6>
            ${weatherData.items[0].forecasts[i].forecast}`)
        }
        else {
            let marker = L.marker([weatherData.area_metadata[i].label_location.latitude, weatherData.area_metadata[i].label_location.longitude], { icon: fairIcon }).addTo(weatherMarkers)
            marker.bindPopup(`<h6>${weatherData.items[0].forecasts[i].area}</h6>
            ${weatherData.items[0].forecasts[i].forecast}`)
        }
    }
}


//for weather markers and selectors
document.querySelector('#weatherBtn').addEventListener('click', function () {
    getWeather()
    if (map.hasLayer(weatherMarkers)) {
        map.removeLayer(weatherMarkers)
    }
    else {
        map.addLayer(weatherMarkers)
    }
})


//animation code
document.querySelector('#toggle').addEventListener('click', function (e) {
    let page = e.target.dataset.page;
    document.querySelector('#page-1').classList.add('hidden');
    document.querySelector('#page-1').classList.remove('show');
    document.querySelector('#page-2').style.display = 'block';
    document.querySelector('#page-2').classList.add('show');
    document.querySelector('#page-2').classList.remove('hidden')
})

document.querySelector('#go-back').addEventListener('click', function (e) {
    document.querySelector('#page-2').classList.add('hidden');
    document.querySelector('#page-2').classList.remove('show');
    document.querySelector('#page-1').classList.add('show');
    document.querySelector('#page-1').classList.remove('hidden')
})