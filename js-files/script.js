let map = createMap()
let imgUrl = null;
let routing = null;
let lat = null;
let lng = null;
let hyperlink = null;
//get user location
navigator.geolocation.getCurrentPosition(position)
let userLat = null;
let userLng = null;

function position(markers) {
    userLat = markers.coords.latitude;
    userLng = markers.coords.longitude;
}


window.addEventListener('DOMContentLoaded', async function () {

    let response = await axios.get('tourism.geojson');
    for (let each of response.data.features) {
        for (let data in each) {

            //to get image imgUrl for display of images
            if (each[data]['PHOTOURL']) {
                imgUrl = each[data]['PHOTOURL'].split('')
                let indexEnd = imgUrl.indexOf('>')
                imgUrl = imgUrl.slice(25, indexEnd-1).join('')
                imgUrl= imgUrl.replace("http://", "https://");
                console.log(imgUrl)

                let updatedLink = await axios.get(imgUrl);
                console.log(updatedLink.data)
            }

            if (each[data]['HYPERLINK']){
                hyperlink = each[data]['HYPERLINK'].split('')
                let indexStart = hyperlink.indexOf('>')+1;
                hyperlink = hyperlink.slice(indexStart, -4).join('');
                console.log(hyperlink)
            }

            let popup = L.responsivePopup()
                .setContent(
                    `<img class='pop-up-border' style='width: 100%' src="${imgUrl}"> 
                <h6>${each[data]['Name']}</h6>  
                <h6>Opening Hours: ${each[data]['Opening Hours']}</h6>
                <p>${each[data]['description']}</p>
                <h6>${entranceFee[each[data]['foc']]}</h6>

                <div class='mx-auto'>
                <button class='btn-sm btn-general view'
                type="button" data-bs-toggle="offcanvas" role="button" 
                aria-controls="searchcanvas" 
                data-bs-target="#searchcanvas">search nearby</button>
                
                <button class='btn-sm btn-general'
                type="button" onclick='showRouteToAttraction()'}>
                get directions</button>
                </div>`)
            



            //arts layer


            if (each[data]['Field_1'] && (each[data]['Field_1'].toLowerCase().includes('arts')
                || each[data]['PHOTOURL'].toLowerCase().includes('arts'))) {


                let artsMarker = L.marker([each.geometry.coordinates[1], each.geometry.coordinates[0]],
                    { icon: artsIcon })
                    .bindPopup(popup)

                if (each[data]['foc'] == 'yes') {
                    artsPopupFOC.push(artsMarker)
                    artsMarker.addTo(artsLayerfoc);
                    document.querySelector('#artsfoc').innerHTML +=
                        `<div class="card mt-3 mx-auto mx-auto" style="width: 18rem;">
                    <img src="${imgUrl}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${each[data]['Name']}</h5>
                      <h6 class="card-text">${each[data]['Opening Hours']}</h6>
                      <p class="card-text">${each[data]['description']}</p>
                    </div>
                    <div class="d-flex flex-row">
                    <button data-latitude='${each.geometry.coordinates[1]}' 
                    data-longitude='${each.geometry.coordinates[0]}' 
                    type="button" 
                    class="btn view-arts-foc btn-general w-50" 
                    data-bs-dismiss="offcanvas" 
                    aria-label="Close">view on map</button>

                    <a class = 'btn btn-general w-50' 
                    type="button" href='${hyperlink}' target="_blank">
                    visit website</a>
                    </div>
                  </div>`
                }

                else {
                    artsPopup.push(artsMarker)
                    artsMarker.addTo(artsLayer);
                    document.querySelector('#arts').innerHTML +=
                        `<div class="card mt-3 mx-auto" style="width: 18rem;">
                    <img src="${imgUrl}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${each[data]['Name']}</h5>
                      <h6 class="card-text">${each[data]['Opening Hours']}</h6>
                      <p class="card-text">${each[data]['description']}</p>
                      </div>
                      <div class="d-flex flex-row">
                    <button data-latitude='${each.geometry.coordinates[1]}' 
                    data-longitude='${each.geometry.coordinates[0]}' 
                    type="button" 
                    class="btn view-arts btn-general w-50" 
                    data-bs-dismiss="offcanvas" 
                    aria-label="Close">view on map</button>

                    <a class = 'btn btn-general w-50' 
                    type="button" href='${hyperlink}' target="_blank">
                    visit website</a>
                    </div>
                    </div>`

                }

                artsMarker.on('click', function () {
                    searchResultLayer.clearLayers();
                    chosenLat = each.geometry.coordinates[1];
                    chosenLng = each.geometry.coordinates[0];
                    map.flyTo([chosenLat, chosenLng], 16);
                    document.querySelector('#search-side').style.display = 'block';
                })

                //event listener to direct from offcanvas to map
                let artsButtonFOC = document.querySelectorAll('.view-arts-foc');
                directToMap(artsButtonFOC, artsLayerfoc, artsPopupFOC)


                let artsButton = document.querySelectorAll('.view-arts');
                directToMap(artsButton, artsLayer, artsPopup)


            }


            //nature layer
            else if (each[data]['Field_1'] && (each[data]['Field_1'].toLowerCase().includes('nature') || each[data]['PHOTOURL'].toLowerCase().includes('nature'))) {


                let natureMarker = L.marker([each.geometry.coordinates[1], each.geometry.coordinates[0]],
                    { icon: natureIcon })
                    .bindPopup(popup);
                if (each[data]['foc'] == 'yes') {
                    naturePopupFOC.push(natureMarker)
                    natureMarker.addTo(natureLayerfoc);
                    document.querySelector('#naturefoc').innerHTML +=
                        `<div class="card mt-3 mx-auto" style="width: 18rem;">
                    <img src="${imgUrl}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${each[data]['Name']}</h5>
                      <h6 class="card-text">${each[data]['Opening Hours']}</h6>
                      <p class="card-text">${each[data]['description']}</p>
                    </div>

                   <div class="d-flex flex-row">
                    <button data-latitude='${each.geometry.coordinates[1]}' 
                    data-longitude='${each.geometry.coordinates[0]}' 
                    type="button" 
                    class="btn btn-general view-nature-foc w-50" 
                    data-bs-dismiss="offcanvas" 
                    aria-label="Close">view on map</button>
                    <a class = 'btn btn-general w-50' 
                    type="button" href='${hyperlink}' target="_blank">
                    visit website</a>
                    </div>
                    
                    </div>`

                }
                else {
                    naturePopup.push(natureMarker);
                    natureMarker.addTo(natureLayer);
                    document.querySelector('#nature').innerHTML +=
                        `<div class="card mt-3 mx-auto" style="width: 18rem;">
                    <img src="${imgUrl}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${each[data]['Name']}</h5>
                      <h6 class="card-text">${each[data]['Opening Hours']}</h6>
                      <p class="card-text">${each[data]['description']}</p>
                      </div>
                      <div class="d-flex flex-row">
                    <button data-latitude='${each.geometry.coordinates[1]}' 
                    data-longitude='${each.geometry.coordinates[0]}' 
                    type="button" 
                    class="btn btn-general view-nature w-50" 
                    data-bs-dismiss="offcanvas" 
                    aria-label="Close">view on map</button>

                    <a class = 'btn btn-general w-50' 
                    type="button" href='${hyperlink}' target="_blank">
                    visit website</a>
                    </div>
                    </div>`

                }
                natureMarker.on('click', function () {
                    searchResultLayer.clearLayers();
                    chosenLat = each.geometry.coordinates[1];
                    chosenLng = each.geometry.coordinates[0];
                    map.flyTo([chosenLat, chosenLng], 16);
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


                cultureHistoryMarker = L.marker([each.geometry.coordinates[1], each.geometry.coordinates[0]],
                    { icon: heritageIcon })
                    .bindPopup(popup)

                if (each[data]['foc'] == 'yes') {
                    cultureHistPopupFOC.push(cultureHistoryMarker)
                    cultureHistoryMarker.addTo(cultureHistoryLayerfoc);
                    document.querySelector('#culture-hist-foc').innerHTML +=
                        `<div class="card mt-3 mx-auto" style="width: 18rem;">
                    <img src="${imgUrl}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${each[data]['Name']}</h5>
                      <h6 class="card-text">${each[data]['Opening Hours']}</h6>
                      <p class="card-text">${each[data]['description']}</p>
                      </div>

                      <div class="d-flex flex-row">
                    <button data-latitude='${each.geometry.coordinates[1]}' 
                    data-longitude='${each.geometry.coordinates[0]}' 
                    type="button" 
                    class="btn btn-general view-culture-foc w-50" 
                    data-bs-dismiss="offcanvas" 
                    aria-label="Close">view on map</button>
                    
                    <a class = 'btn btn-general w-50' 
                    type="button" href='${hyperlink}' target="_blank">
                    visit website</a>
                    </div>
                    </div>`

                }

                else {
                    cultureHistPopup.push(cultureHistoryMarker)
                    cultureHistoryMarker.addTo(cultureHistoryLayer);
                    document.querySelector('#culture-hist').innerHTML +=
                        `<div class="card mt-3 mx-auto" style="width: 18rem;">
                    <img src="${imgUrl}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${each[data]['Name']}</h5>
                      <h6 class="card-text">${each[data]['Opening Hours']}</h6>
                      <p class="card-text">${each[data]['description']}</p>
                      </div>

                      <div class="d-flex flex-row">
                    <button data-latitude='${each.geometry.coordinates[1]}' 
                    data-longitude='${each.geometry.coordinates[0]}' 
                    type="button" 
                    class="btn btn-general view-culture w-50" 
                    data-bs-dismiss="offcanvas" 
                    aria-label="Close">view on map</button>
                    <a class = 'btn btn-general w-50' 
                    type="button" href='${hyperlink}' target="_blank">
                    visit website</a>
                    </div>
                    </div>
                    `

                }

                cultureHistoryMarker.on('click', function () {
                    searchResultLayer.clearLayers();
                    chosenLat = each.geometry.coordinates[1];
                    chosenLng = each.geometry.coordinates[0];
                    map.flyTo([chosenLat, chosenLng], 16);
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


                let archiLandscapesMarker = L.marker([each.geometry.coordinates[1], each.geometry.coordinates[0]],
                    { icon: archiLandscapesIcon })
                    .bindPopup(popup)
                if (each[data]['foc'] == 'yes') {
                    archiLandPopupFOC.push(archiLandscapesMarker);
                    archiLandscapesMarker.addTo(archiLandscapesLayerfoc);
                    document.querySelector('#archi-land-foc').innerHTML +=
                        `<div class="card mt-3 mx-auto" style="width: 18rem;">
                    <img src="${imgUrl}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${each[data]['Name']}</h5>
                      <h6 class="card-text">${each[data]['Opening Hours']}</h6>
                      <p class="card-text">${each[data]['description']}</p>
                      </div>

                      <div class="d-flex flex-row">
                    <button data-latitude='${each.geometry.coordinates[1]}' 
                    data-longitude='${each.geometry.coordinates[0]}' 
                    type="button" 
                    class="btn btn-general view-archi-foc w-50" 
                    data-bs-dismiss="offcanvas" 
                    aria-label="Close">view on map</button>

                    <a class = 'btn btn-general w-50' 
                    type="button" href='${hyperlink}' target="_blank">
                    visit website</a>
                    </div>
                    </div>`

                }
                else {
                    archiLandPopup.push(archiLandscapesMarker);
                    archiLandscapesMarker.addTo(archiLandscapesLayer);
                    document.querySelector('#archi-land').innerHTML +=
                        `<div class="card mt-3 mx-auto" style="width: 18rem;">
                    <img src="${imgUrl}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${each[data]['Name']}</h5>
                      <h6 class="card-text">${each[data]['Opening Hours']}</h6>
                      <p class="card-text">${each[data]['description']}</p>
                      </div>
                      <div class="d-flex flex-row">
                    <button data-latitude='${each.geometry.coordinates[1]}' 
                    data-longitude='${each.geometry.coordinates[0]}' 
                    type="button" 
                    class="btn btn-general view-archi w-50" 
                    data-bs-dismiss="offcanvas" 
                    aria-label="Close">view on map</button>

                    <a class = 'btn btn-general w-50' 
                    type="button" href='${hyperlink}' target="_blank">
                    visit website</a>
                    </div>
                    </div>`
                }

                archiLandscapesMarker.on('click', function () {
                    searchResultLayer.clearLayers();
                    chosenLat = each.geometry.coordinates[1];
                    chosenLng = each.geometry.coordinates[0];
                    map.flyTo([chosenLat, chosenLng], 16);
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

                let recreationMarker = L.marker([each.geometry.coordinates[1], each.geometry.coordinates[0]],
                    { icon: recreationIcon })
                    .bindPopup(popup)
                if (each[data]['foc'] == 'yes') {
                    recreationPopupFOC.push(recreationMarker);
                    recreationMarker.addTo(recreationLayerfoc);
                    document.querySelector('#recreation-foc').innerHTML +=
                        `<div class="card mt-3 mx-auto" style="width: 18rem;">
                    <img src="${imgUrl}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${each[data]['Name']}</h5>
                      <h6 class="card-text">${each[data]['Opening Hours']}</h6>
                      <p class="card-text">${each[data]['description']}</p>
                      </div>

                      <div class="d-flex flex-row">
                    <button data-latitude='${each.geometry.coordinates[1]}' 
                    data-longitude='${each.geometry.coordinates[0]}' 
                    type="button" 
                    class="btn btn-general view-recre-foc w-50" 
                    data-bs-dismiss="offcanvas" 
                    aria-label="Close">view on map</button>
                    <a class = 'btn btn-general w-50' 
                    type="button" href='${hyperlink}' target="_blank">
                    visit website</a>
                    </div>
                    </div>`

                }
                else {
                    recreationPopup.push(recreationMarker);
                    recreationMarker.addTo(recreationLayer);
                    document.querySelector('#recreation').innerHTML +=
                        `<div class="card mt-3 mx-auto" style="width: 18rem;">
                    <img src="${imgUrl}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${each[data]['Name']}</h5>
                      <h6 class="card-text">${each[data]['Opening Hours']}</h6>
                      <p class="card-text">${each[data]['description']}</p>
                      </div>

                      <div class="d-flex flex-row">
                    <button data-latitude='${each.geometry.coordinates[1]}' 
                    data-longitude='${each.geometry.coordinates[0]}' 
                    type="button" 
                    class="btn btn-general view-recre" 
                    data-bs-dismiss="offcanvas" 
                    aria-label="Close">view on map</button>
                    <a class = 'btn btn-general w-50' 
                    type="button" href='${hyperlink}' target="_blank">
                    visit website</a>
                    </div>
                    </div>`
                }
                recreationMarker.on('click', function () {
                    searchResultLayer.clearLayers();
                    chosenLat = each.geometry.coordinates[1];
                    chosenLng = each.geometry.coordinates[0];
                    map.flyTo([chosenLat, chosenLng], 16);
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
        let locations = await searchNearby(query);
        L.circle([chosenLat, chosenLng], { radius: 1000, color: '#C0392B' }).addTo(searchResultLayer);
        if (locations.results == false) {
            document.querySelector('#results').innerHTML = "no results found";
        }
        else {
            for (let eachResult of locations.results) {
                let id = eachResult.fsq_id;
                lat = eachResult.geocodes.main.latitude;
                lng = eachResult.geocodes.main.longitude;
                let photoLink = ""
                let photo = await photoSearch(id);
                let details = await placeDetails(id);
                if (photo[0]) {
                    photoLink = photo[0].prefix + 'original' + photo[0].suffix;
                }
                else{
                    photoLink = eachResult.categories[0].icon.prefix + 'bg_120' + eachResult.categories[0].icon.suffix;
                }

                if (!details.hours.display){
                    details.hours.display = 'opening hours unavailable'
                }

                if (!details.rating){
                    details.rating = 'ratings unavailable'
                }

                if (!details.website){
                    details.website = 'https://www.google.com'
                }

                let popupDiv = document.createElement('div')
                popupDiv.innerHTML = `
                <img class='pop-up-border' style='width: 297px; height: 167px; object-fit: contain;' src='${photoLink}'>
                <h4>${eachResult.name}</h4>
                <h6>${details.hours.display}</h6>
                <h6>${eachResult.location.formatted_address}</h6>
                <h6>${eachResult.distance}m from this place</h6>
                <h6>Ratings: ${details.rating} <i class="bi bi-star-fill"></i>
                </h6>
                <button class='btn-sm btn-general'
                type="button" onclick='showRouteToNearby()'}>
                get directions</button>
               <a class = 'btn-sm btn-general place-link' type="button" href='${details.website}' target="_blank">visit website</a>`
                let popupContent = L.responsivePopup().setContent(popupDiv)
                let resultPopup = L.marker([lat, lng], { icon: searchIcon })
                    .addTo(searchResultLayer)
                    .bindPopup(popupContent)
                let perResult = document.createElement('div');
                perResult.className = 'search-result';
                perResult.innerHTML = eachResult.name;
                perResult.setAttribute("data-bs-dismiss", "offcanvas");
                perResult.setAttribute("aria-label", "Close")
                perResult.addEventListener('click', function () {
                    map.flyTo([lat, lng], 16);
                    resultPopup.openPopup()
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
let paidAttractions = [artsLayer, natureLayer, cultureHistoryLayer, archiLandscapesLayer, recreationLayer];
let freeAttractions = [artsLayerfoc, natureLayerfoc, cultureHistoryLayerfoc, archiLandscapesLayerfoc, recreationLayerfoc];

focToggle.addEventListener('click', function () {
    if (routing) {
        routing.remove()
    }
    searchResultLayer.clearLayers();
    if (userLocation)
    {map.removeLayer(userLocation)}
    document.querySelector('#search-side').style.display = 'none';
    if (document.querySelector('#current-layer').innerHTML == "Attractions with Paid Entry") {
        document.querySelector('#change').innerHTML = '<i class="bi bi-toggle-off"></i>';
        document.querySelector('#change')['data-bs-target'] = "#foc-attractions"
        controller.remove();
        document.querySelector('#current-layer').innerHTML = "Attractions with Free Entry";
        document.querySelector('#nav-toggle')['data-bs-toggle'] = "offcanvas";
        document.querySelector('#nav-toggle').href = "#foc-attractions";
        document.querySelector('#nav-toggle').role = "button"
        document.querySelector('#nav-toggle')['aria-controls'] = "foc-attractions"
        overlayLayersFOC = {
            '<img style="height: 25px" src="images/map-markers/arts.png"> artsfoc': artsLayerfoc,
            '<img style="height: 25px" src="images/map-markers/nature.png">naturefoc': natureLayerfoc,
            '<img style="height: 25px" src="images/map-markers/heritage.png">culture & historyfoc': cultureHistoryLayerfoc,
            '<img style="height: 25px" src="images/map-markers/landscapes.png">architecture & landscapesfoc': archiLandscapesLayerfoc,
            '<img style="height: 25px" src="images/map-markers/recreation.png">recreationfoc': recreationLayerfoc
        }
        let i = 0;
        for (let each in overlayLayers) {
            map.removeLayer(paidAttractions[i]);
            freeAttractions[i].addTo(map)
            i++;
        }
        controller = L.control.layers({}, overlayLayersFOC, { position: 'topright' }).addTo(map);
        controller.setPosition('topright');
        document.querySelector('.leaflet-control-layers-toggle').style.backgroundImage = "url(images/overlay-control/free.png)";
    }
    else {
        document.querySelector('#current-layer').innerHTML = "Attractions with Paid Entry";
        document.querySelector('#change').innerHTML = '<i class="bi bi-toggle-on"></i>';
        document.querySelector('#change')['data-bs-target'] = "#paid-attractions"
        controller.remove();
        document.querySelector('#nav-toggle')['data-bs-toggle'] = "offcanvas";
        document.querySelector('#nav-toggle').href = "#paid-attractions";
        document.querySelector('#nav-toggle').role = "button"
        document.querySelector('#nav-toggle')['aria-controls'] = "paid-attractions"
        let i = 0;
        for (let each in overlayLayers) {
            map.removeLayer(freeAttractions[i]);
            paidAttractions[i].addTo(map)
            i++;
        }
        controller = L.control.layers({}, overlayLayers, { position: 'topright' }).addTo(map);
        document.querySelector('.leaflet-control-layers-toggle').style.backgroundImage = "url(images/overlay-control/money.png)";
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

document.querySelector('#nav-subscribe').addEventListener('click', function(){
    if (document.querySelector('#newsletter').style.display=='block'){
        document.querySelector('#newsletter').style.display='none'
    }

    else{
    document.querySelector('#newsletter').style.display='block'
    }
})

//form validation


document.querySelector('#subscribeBtn').addEventListener('click', function(){
    if (!document.querySelector('#first-name').value){
        document.querySelector('#invalid-first-name').style.display = 'block';
        document.querySelector('#first-name').style.border = 'solid 1px darkred';
    }
    else{
        document.querySelector('#invalid-first-name').style.display = 'none';
    }

    if (!document.querySelector('#last-name').value){
        document.querySelector('#invalid-last-name').style.display = 'block';
        document.querySelector('#last-name').style.border = 'solid 1px darkred';
    }
    else{
        document.querySelector('#invalid-last-name').style.display = 'none';
    }

    if(!document.querySelector('#email').value || !document.querySelector('#email').value.includes('@')){
        document.querySelector('#invalid-email').style.display = 'block';
        document.querySelector('#email').style.border = 'solid 1px darkred';
    }
    else{
        document.querySelector('#invalid-email').style.display = 'none';
    }

    if (!document.querySelector('#agreement').checked){
        document.querySelector('#invalid-agreement').style.display = 'block';
        document.querySelector('#agreement').style.border = 'solid 1px darkred';
    }

    else{
        document.querySelector('#invalid-agreement').style.display = 'none';
    }

    if(document.querySelector('#invalid-first-name').style.display == 'none' && document.querySelector('#invalid-last-name').style.display == 'none' && document.querySelector('#invalid-email').style.display == 'none'&& document.querySelector('#invalid-agreement').style.display == 'none'){
        document.querySelector('#newsletter').innerHTML = '<h4 class="text-center">Thank you for subscribing!</h4>'
    }
})

document.querySelector('#map').addEventListener('click', function(){
if(document.querySelector('.leaflet-control-layers-expanded')){
    document.querySelector('#weatherBtn').style.right = '230px';
}
else{
    document.querySelector('#weatherBtn').style.right = '60px';
}
})

document.querySelector('#map').addEventListener('mouseover', function(){
    if(document.querySelector('.leaflet-control-layers-expanded')){
        document.querySelector('#weatherBtn').style.right = '230px';
    }
    else{
        document.querySelector('#weatherBtn').style.right = '60px';
    }
    })