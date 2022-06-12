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

function showRoute() {
    if (routing) {
        routing.remove()
    }
    navigator.geolocation.getCurrentPosition(position)
    routing = L.Routing.control({
        waypoints: [
            L.latLng(userLat, userLng),
            L.latLng(chosenLat, chosenLng)
        ]
    }).addTo(map)
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
                    let popup = L.responsivePopup()
                    .setContent(
                `<div class='mx-auto'><img style='width: 50%' src="${imgUrl}></div> 
                <h6>${each[data]['Name']}</h6>  
                <h6>Opening Hours: ${each[data]['Opening Hours']}</h6>
                <p>${each[data]['description']}</p>
                <h6>${entranceFee[each[data]['foc']]}</h6>
                <button
                class='btn-sm btn-dark view'
                type="button" data-bs-toggle="offcanvas" role="button" 
                aria-controls="searchcanvas" 
                data-bs-target="#searchcanvas">search nearby</button>
                
                <button class='btn-sm btn-dark'
                type="button" onclick='showRoute()'}>
                get directions</button>`)

                let artsMarker = L.marker([each.geometry.coordinates[1], each.geometry.coordinates[0]],
                    { icon: artsIcon })
                    .bindPopup(popup)

                if (each[data]['foc'] == 'yes') {
                    artsPopupFOC.push(artsMarker)
                    artsMarker.addTo(artsLayerfoc);
                    document.querySelector('#artsfoc').innerHTML +=
                `<div class="card mt-3" style="width: 18rem;">
                    <img src="${imgUrl}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${each[data]['Name']}</h5>
                      <h6 class="card-text">${each[data]['Opening Hours']}</h6>
                      <p class="card-text">${each[data]['description']}</p>
                    <button data-latitude='${each.geometry.coordinates[1]}' 
                    data-longitude='${each.geometry.coordinates[0]}' 
                    type="button" 
                    class="btn view-arts-foc btn-dark" 
                    data-bs-dismiss="offcanvas" 
                    aria-label="Close">view on map</button>
                    </div>
                  </div>`
                }

                else {
                    artsPopup.push(artsMarker)
                    artsMarker.addTo(artsLayer);
                    document.querySelector('#arts').innerHTML +=
                        `<div class="card mt-3" style="width: 18rem;">
                    <img src="${imgUrl}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${each[data]['Name']}</h5>
                      <h6 class="card-text">${each[data]['Opening Hours']}</h6>
                      <p class="card-text">${each[data]['description']}</p>
                    <button data-latitude='${each.geometry.coordinates[1]}' 
                    data-longitude='${each.geometry.coordinates[0]}' 
                    type="button" 
                    class="btn view-arts btn-dark" 
                    data-bs-dismiss="offcanvas" 
                    aria-label="Close">view on map</button>
                    </div>`

                }

                artsMarker.on('click', function () {
                    searchResultLayer.clearLayers();
                    chosenLat = each.geometry.coordinates[1];
                    chosenLng = each.geometry.coordinates[0];
                    map.flyTo([chosenLat, chosenLng], 13)
                })

                //event listener to direct from offcanvas to map
                let artsButtonFOC = document.querySelectorAll('.view-arts-foc');
                directToMap(artsButtonFOC, artsLayerfoc, artsPopupFOC)


                let artsButton = document.querySelectorAll('.view-arts');
                directToMap(artsButton, artsLayer, artsPopup)


            }


            //nature layer
            else if (each[data]['Field_1'] && (each[data]['Field_1'].toLowerCase().includes('nature') || each[data]['PHOTOURL'].toLowerCase().includes('nature'))) {
                let popup = L.responsivePopup()
                    .setContent(
                `<div class='mx-auto'><img style='width: 50%' src="${imgUrl}></div> 
                <h6>${each[data]['Name']}</h6>  
                <h6>Opening Hours: ${each[data]['Opening Hours']}</h6>
                <p>${each[data]['description']}</p>
                <h6>${entranceFee[each[data]['foc']]}</h6>
                <button
                class='btn-sm btn-dark view'
                type="button" data-bs-toggle="offcanvas" role="button" 
                aria-controls="searchcanvas" 
                data-bs-target="#searchcanvas">search nearby</button>
                
                <button class='btn-sm btn-dark'
                type="button" onclick='showRoute()'}>
                get directions</button>`);

                let natureMarker = L.marker([each.geometry.coordinates[1], each.geometry.coordinates[0]],
                    { icon: natureIcon })
                    .bindPopup(popup);
                if (each[data]['foc'] == 'yes') {
                    naturePopupFOC.push(natureMarker)
                    natureMarker.addTo(natureLayerfoc);
                    document.querySelector('#naturefoc').innerHTML +=
                        `<div class="card mt-3" style="width: 18rem;">
                    <img src="${imgUrl}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${each[data]['Name']}</h5>
                      <h6 class="card-text">${each[data]['Opening Hours']}</h6>
                      <p class="card-text">${each[data]['description']}</p>
                    <button data-latitude='${each.geometry.coordinates[1]}' 
                    data-longitude='${each.geometry.coordinates[0]}' 
                    type="button" 
                    class="btn directions-arts btn-dark view-nature-foc" 
                    data-bs-dismiss="offcanvas" 
                    aria-label="Close">view on map</button>
                    </div>`

                }
                else {
                    naturePopup.push(natureMarker);
                    natureMarker.addTo(natureLayer);
                    document.querySelector('#nature').innerHTML +=
                        `<div class="card mt-3" style="width: 18rem;">
                    <img src="${imgUrl}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${each[data]['Name']}</h5>
                      <h6 class="card-text">${each[data]['Opening Hours']}</h6>
                      <p class="card-text">${each[data]['description']}</p>
                    <button data-latitude='${each.geometry.coordinates[1]}' 
                    data-longitude='${each.geometry.coordinates[0]}' 
                    type="button" 
                    class="btn directions-arts btn-dark view-nature" 
                    data-bs-dismiss="offcanvas" 
                    aria-label="Close">view on map</button>
                    </div>`

                }
                natureMarker.on('click', function () {
                    searchResultLayer.clearLayers();
                    chosenLat = each.geometry.coordinates[1];
                    chosenLng = each.geometry.coordinates[0];
                    map.flyTo([chosenLat, chosenLng], 13);
                    document.querySelector('#search-side').style.display = 'block';
                })

                //event listener to direct from offcanvas to map
                let natureButtonFOC = document.querySelectorAll('.view-nature-foc');
                directToMap(natureButtonFOC, natureLayerfoc, naturePopupFOC)


                let natureButton = document.querySelectorAll('.view-nature');
                directToMap(natureButton, natureLayer, naturePopup)
            }

            //culture history layer
            else if (each[data]['Field_1'] && (each[data]['Field_1'].toLowerCase().includes('culture') || each[data]['Field_1'] && (each[data]['Field_1'].toLowerCase().includes('history')))) {
                let popup = L.responsivePopup()
                    .setContent(
                `<div class='mx-auto'><img style='width: 50%' src="${imgUrl}></div> 
                <h6>${each[data]['Name']}</h6>  
                <h6>Opening Hours: ${each[data]['Opening Hours']}</h6>
                <p>${each[data]['description']}</p>
                <h6>${entranceFee[each[data]['foc']]}</h6>
                <button
                class='btn-sm btn-dark view'
                type="button" data-bs-toggle="offcanvas" role="button" 
                aria-controls="searchcanvas" 
                data-bs-target="#searchcanvas">search nearby</button>
                
                <button class='btn-sm btn-dark'
                type="button" onclick='showRoute()'}>
                get directions</button>`)

                cultureHistoryMarker = L.marker([each.geometry.coordinates[1], each.geometry.coordinates[0]],
                    { icon: heritageIcon })
                    .bindPopup(popup)

                if (each[data]['foc'] == 'yes') {
                    cultureHistPopupFOC.push(cultureHistoryMarker)
                    cultureHistoryMarker.addTo(cultureHistoryLayerfoc);
                    document.querySelector('#culture-hist-foc').innerHTML +=
                        `<div class="card mt-3" style="width: 18rem;">
                    <img src="${imgUrl}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${each[data]['Name']}</h5>
                      <h6 class="card-text">${each[data]['Opening Hours']}</h6>
                      <p class="card-text">${each[data]['description']}</p>
                    <button data-latitude='${each.geometry.coordinates[1]}' 
                    data-longitude='${each.geometry.coordinates[0]}' 
                    type="button" 
                    class="btn directions-arts btn-dark view-culture-foc" 
                    data-bs-dismiss="offcanvas" 
                    aria-label="Close">view on map</button>
                    </div>`

                }

                else {
                    cultureHistPopup.push(cultureHistoryMarker)
                    cultureHistoryMarker.addTo(cultureHistoryLayer);
                    document.querySelector('#culture-hist').innerHTML +=
                        `<div class="card mt-3" style="width: 18rem;">
                    <img src="${imgUrl}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${each[data]['Name']}</h5>
                      <h6 class="card-text">${each[data]['Opening Hours']}</h6>
                      <p class="card-text">${each[data]['description']}</p>
                    <button data-latitude='${each.geometry.coordinates[1]}' 
                    data-longitude='${each.geometry.coordinates[0]}' 
                    type="button" 
                    class="btn directions-arts btn-dark view-culture" 
                    data-bs-dismiss="offcanvas" 
                    aria-label="Close">view on map</button>
                    </div>`

                }

                cultureHistoryMarker.on('click', function () {
                    searchResultLayer.clearLayers();
                    chosenLat = each.geometry.coordinates[1];
                    chosenLng = each.geometry.coordinates[0];
                    map.flyTo([chosenLat, chosenLng], 13);
                    document.querySelector('#search-side').style.display = 'block';
                })

                //event listener to direct from offcanvas to map
                let cultureHistButtonFOC = document.querySelectorAll('.view-culture-foc');
                directToMap(cultureHistButtonFOC, cultureHistoryLayerfoc, cultureHistPopupFOC)


                let cultureHistButton = document.querySelectorAll('.view-culture');
                directToMap(cultureHistButton, cultureHistoryLayer, cultureHistPopup)
            }

            //archi landscape layer
            else if (each[data]['Field_1'] && (each[data]['Field_1'].toLowerCase().includes('architecture') || each[data]['Field_1'] && (each[data]['Field_1'].toLowerCase().includes('places-to-see')))) {
                let popup = L.responsivePopup()
                    .setContent(
                `<div class='mx-auto'><img style='width: 50%' src="${imgUrl}></div> 
                <h6>${each[data]['Name']}</h6>  
                <h6>Opening Hours: ${each[data]['Opening Hours']}</h6>
                <p>${each[data]['description']}</p>
                <h6>${entranceFee[each[data]['foc']]}</h6>
                <button
                class='btn-sm btn-dark view'
                type="button" data-bs-toggle="offcanvas" role="button" 
                aria-controls="searchcanvas" 
                data-bs-target="#searchcanvas">search nearby</button>
                
                <button class='btn-sm btn-dark'
                type="button" onclick='showRoute()'}>
                get directions</button>`)

                let archiLandscapesMarker = L.marker([each.geometry.coordinates[1], each.geometry.coordinates[0]],
                    { icon: archiLandscapesIcon })
                    .bindPopup(popup)
                if (each[data]['foc'] == 'yes') {
                    archiLandPopupFOC.push(archiLandscapesMarker);
                    archiLandscapesMarker.addTo(archiLandscapesLayerfoc);
                    document.querySelector('#archi-land-foc').innerHTML +=
                        `<div class="card mt-3" style="width: 18rem;">
                    <img src="${imgUrl}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${each[data]['Name']}</h5>
                      <h6 class="card-text">${each[data]['Opening Hours']}</h6>
                      <p class="card-text">${each[data]['description']}</p>
                    <button data-latitude='${each.geometry.coordinates[1]}' 
                    data-longitude='${each.geometry.coordinates[0]}' 
                    type="button" 
                    class="btn directions-arts btn-dark view-archi-foc" 
                    data-bs-dismiss="offcanvas" 
                    aria-label="Close">view on map</button>
                    </div>`

                }
                else {
                    archiLandPopup.push(archiLandscapesMarker);
                    archiLandscapesMarker.addTo(archiLandscapesLayer);
                    document.querySelector('#archi-land').innerHTML +=
                        `<div class="card mt-3" style="width: 18rem;">
                    <img src="${imgUrl}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${each[data]['Name']}</h5>
                      <h6 class="card-text">${each[data]['Opening Hours']}</h6>
                      <p class="card-text">${each[data]['description']}</p>
                    <button data-latitude='${each.geometry.coordinates[1]}' 
                    data-longitude='${each.geometry.coordinates[0]}' 
                    type="button" 
                    class="btn directions-arts btn-dark view-archi" 
                    data-bs-dismiss="offcanvas" 
                    aria-label="Close">view on map</button>
                    </div>`
                }

                archiLandscapesMarker.on('click', function () {
                    searchResultLayer.clearLayers();
                    chosenLat = each.geometry.coordinates[1];
                    chosenLng = each.geometry.coordinates[0];
                    map.flyTo([chosenLat, chosenLng], 13);
                    document.querySelector('#search-side').style.display = 'block';
                })

                //event listener to direct from offcanvas to map
                let archiLandButtonFOC = document.querySelectorAll('.view-archi-foc');
                directToMap(archiLandButtonFOC, archiLandscapesLayerfoc, archiLandPopupFOC)


                let archiLandButton = document.querySelectorAll('.view-archi');
                directToMap(archiLandButton, archiLandscapesLayer, archiLandPopup)
            }

            //recreation layer

            else if (each[data]['Field_1'] && (each[data]['Field_1'].toLowerCase().includes('recreation') || each[data]['PHOTOURL'].toLowerCase().includes('recreation'))) {
                let popup = L.responsivePopup()
                    .setContent(
                `<div class='mx-auto'><img style='width: 50%' src="${imgUrl}></div> 
                <h6>${each[data]['Name']}</h6>  
                <h6>Opening Hours: ${each[data]['Opening Hours']}</h6>
                <p>${each[data]['description']}</p>
                <h6>${entranceFee[each[data]['foc']]}</h6>
                <button
                class='btn-sm btn-dark view'
                type="button" data-bs-toggle="offcanvas" role="button" 
                aria-controls="searchcanvas" 
                data-bs-target="#searchcanvas">search nearby</button>
                
                <button class='btn-sm btn-dark'
                type="button" onclick='showRoute()'}>
                get directions</button>`)
                let recreationMarker = L.marker([each.geometry.coordinates[1], each.geometry.coordinates[0]],
                    { icon: recreationIcon })
                    .bindPopup(popup)
                if (each[data]['foc'] == 'yes') {
                    recreationPopupFOC.push(recreationMarker);
                    recreationMarker.addTo(recreationLayerfoc);
                    document.querySelector('#recreation-foc').innerHTML +=
                        `<div class="card mt-3" style="width: 18rem;">
                    <img src="${imgUrl}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${each[data]['Name']}</h5>
                      <h6 class="card-text">${each[data]['Opening Hours']}</h6>
                      <p class="card-text">${each[data]['description']}</p>
                    <button data-latitude='${each.geometry.coordinates[1]}' 
                    data-longitude='${each.geometry.coordinates[0]}' 
                    type="button" 
                    class="btn directions-arts btn-dark view-recre-foc" 
                    data-bs-dismiss="offcanvas" 
                    aria-label="Close">view on map</button>
                    </div>`

                }
                else {
                    recreationPopup.push(recreationMarker);
                    recreationMarker.addTo(recreationLayer);
                    document.querySelector('#recreation').innerHTML +=
                        `<div class="card mt-3" style="width: 18rem;">
                    <img src="${imgUrl}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${each[data]['Name']}</h5>
                      <h6 class="card-text">${each[data]['Opening Hours']}</h6>
                      <p class="card-text">${each[data]['description']}</p>
                    <button data-latitude='${each.geometry.coordinates[1]}' 
                    data-longitude='${each.geometry.coordinates[0]}' 
                    type="button" 
                    class="btn directions-arts btn-dark view-recre" 
                    data-bs-dismiss="offcanvas" 
                    aria-label="Close">view on map</button>
                    </div>`
                }
                recreationMarker.on('click', function () {
                    searchResultLayer.clearLayers();
                    chosenLat = each.geometry.coordinates[1];
                    chosenLng = each.geometry.coordinates[0];
                    map.flyTo([chosenLat, chosenLng], 13);
                    document.querySelector('#search-side').style.display = 'block';
                })

                let recreationButtonFOC = document.querySelectorAll('.view-recre-foc');
                directToMap(recreationButtonFOC, recreationLayerfoc, recreationPopupFOC);

                let recreationButton = document.querySelectorAll('.view-recre');
                directToMap(recreationButton, recreationLayer, recreationPopup)
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
    document.querySelector('#validate').innerHTML = "";
    if (routing) {
        routing.remove()
    }
    document.querySelector('#results').innerHTML = "";
    query = document.querySelector('#search').value;
    if (query.length > 0) {
        let locations = await search(query);
        L.circle([chosenLat, chosenLng], { radius: 1000, color: '#C0392B' }).addTo(searchResultLayer);
        if (locations.results == false) {
            document.querySelector('#results').innerHTML = "no results found";
        }
        else {
            for (let eachResult of locations.results) {
                let lat = eachResult.geocodes.main.latitude;
                let lng = eachResult.geocodes.main.longitude;
                let resultPopup = L.marker([lat, lng], { icon: searchIcon }).addTo(searchResultLayer);
                resultPopup
                    .bindPopup(`<h4>${eachResult.name}</h4>
                <h6>${eachResult.location.formatted_address}</h6>`)
                let perResult = document.createElement('div');
                perResult.className = 'search-result';
                perResult.innerHTML = eachResult.name;
                perResult.setAttribute("data-bs-dismiss", "offcanvas");
                perResult.setAttribute("aria-label", "Close")
                perResult.addEventListener('click', function () {
                    map.flyTo([lat, lng], 13)
                    resultPopup.openPopup();
                })
                document.querySelector('#results').appendChild(perResult);
            }
        }
    }
    else {
        document.querySelector('#validate').innerHTML = `<div class='alert alert-warning'>please enter a search term</div>`
    }
})

document.querySelector('#reset').addEventListener('click', function () {
    document.querySelector('#results').innerHTML = "";
    searchResultLayer.clearLayers();
    document.querySelector('#search').value = "";
    document.querySelector('#validate').innerHTML = "";
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
let focToggle = document.querySelector('#change')
let PAID = [artsLayer, natureLayer, cultureHistoryLayer, archiLandscapesLayer, recreationLayer];
let FREE = [artsLayerfoc, natureLayerfoc, cultureHistoryLayerfoc, archiLandscapesLayerfoc, recreationLayerfoc];

focToggle.addEventListener('click', function () {
    if (routing) {
        routing.remove()
    }
    if (document.querySelector('#staticEmail').value == "Attractions with Paid Entry") {
        controller.remove();
        document.querySelector('#staticEmail').value = "Attractions with Free Entry";
        document.querySelector('#nav-toggle')['data-bs-toggle'] = "offcanvas";
        document.querySelector('#nav-toggle').href = "#offcanvasExample2";
        document.querySelector('#nav-toggle').role = "button"
        document.querySelector('#nav-toggle')['aria-controls'] = "offcanvasExample2"
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
        document.querySelector('#staticEmail').value = "Attractions with Paid Entry";
        controller.remove();
        document.querySelector('#nav-toggle')['data-bs-toggle'] = "offcanvas";
        document.querySelector('#nav-toggle').href = "#offcanvasExample";
        document.querySelector('#nav-toggle').role = "button"
        document.querySelector('#nav-toggle')['aria-controls'] = "offcanvasExample"
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
// document.querySelector('#toggle').addEventListener('click', function (e) {
//     let page = e.target.dataset.page;
//     document.querySelector('#page-1').classList.add('hidden');
//     document.querySelector('#page-1').classList.remove('show');
//     document.querySelector('#page-2').style.display = 'block';
//     document.querySelector('#page-2').classList.add('show');
//     document.querySelector('#page-2').classList.remove('hidden')
// })

// document.querySelector('#go-back').addEventListener('click', function (e) {
//     document.querySelector('#page-2').classList.add('hidden');
//     document.querySelector('#page-2').classList.remove('show');
//     document.querySelector('#page-1').classList.add('show');
//     document.querySelector('#page-1').classList.remove('hidden')
// })

