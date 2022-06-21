let map = createMap();
let imgUrl = "";
let hyperlink = "";
//get user location
navigator.geolocation.getCurrentPosition(position)
let userLat = null;
let userLng = null;
function position(markers) {
    userLat = markers.coords.latitude;
    userLng = markers.coords.longitude;
}

//overlay controls
let overlayLayers = {
    '<img style="height: 25px" src="images/map-markers/arts.png">arts': artsLayer,
    '<img style="height: 25px" src="images/map-markers/nature.png">nature': natureLayer,
    '<img style="height: 25px" src="images/map-markers/heritage.png">culture & history': cultureHistoryLayer,
    '<img style="height: 25px" src="images/map-markers/landscapes.png">architecture & landscapes': archiLandscapesLayer,
    '<img style="height: 25px" src="images/map-markers/recreation.png">recreation': recreationLayer
};

let overlayLayersFOC = {
    '<img style="height: 25px" src="images/map-markers/arts.png">arts': artsLayerfoc,
    '<img style="height: 25px" src="images/map-markers/nature.png">nature': natureLayerfoc,
    '<img style="height: 25px" src="images/map-markers/heritage.png">culture & history': cultureHistoryLayerfoc,
    '<img style="height: 25px" src="images/map-markers/landscapes.png">architecture & landscapes': archiLandscapesLayerfoc,
    '<img style="height: 25px" src="images/map-markers/recreation.png">recreation': recreationLayerfoc
};

let controller = L.control.layers({}, overlayLayersFOC).addTo(map);


//#landing-page
let animateBtn = document.querySelectorAll('.animate-btn')
for (let each of animateBtn) {
    each.addEventListener('click', function () {
        document.querySelector('#main-page').classList.remove('hide-page');
        document.querySelector('#main-page').classList.add('show-page');
        document.querySelector('#landing-page').classList.add('hide-page');
        document.querySelector('#landing-page').classList.remove('show-page');
        document.querySelector('#landing-page').style.display = 'none';

        if (each.dataset.toggle == 'foc-toggle') {
            changeLayerDetails('foc-attractions', 'free', 'FREE');
            layerControl.style.backgroundColor = 'white';
            layerControl.style.color = '#C0392B';
            layerControl.innerHTML = '<i class="bi bi-toggle-off"></i>';
            cultureHistoryLayerfoc.addTo(map)
            archiLandscapesLayerfoc.addTo(map)
            artsLayerfoc.addTo(map)
            natureLayerfoc.addTo(map)
            recreationLayerfoc.addTo(map)
        }

        else {
            changeLayerDetails('paid-attractions', 'money', 'PAID');
            layerControl.style.backgroundColor = '#C0392B';
            layerControl.style.color = 'white';
            layerControl.innerHTML = '<i class="bi bi-toggle-on"></i>';
            cultureHistoryLayer.addTo(map)
            archiLandscapesLayer.addTo(map)
            artsLayer.addTo(map)
            natureLayer.addTo(map)
            recreationLayer.addTo(map)
            let i = 0;
            controller.remove();
            for (let eachLayer in overlayLayers) {
                map.removeLayer(freeAttractions[i]);
                paidAttractions[i].addTo(map)
                i++;
            }
            controller = L.control.layers({}, overlayLayers).addTo(map);
            document.querySelector('.leaflet-control-layers-toggle').style.backgroundImage = "url(images/overlay-control/money.png)";
        }
    })
}


//#main map
window.addEventListener('DOMContentLoaded', async function () {
    let response = await axios.get('tourism.geojson');
    for (let eachAttraction of response.data.features) {
        for (let data in eachAttraction) {

            //to get image imgUrl for display of images
            if (!eachAttraction[data]['PHOTOURL']) {
                imgUrl = eachAttraction[data]['new-photo'];
                if (!imgUrl) {
                    imgUrl = "";
                }
            }

            else {
                imgUrl = eachAttraction[data]['PHOTOURL'].split('')
                let indexEnd = imgUrl.indexOf('>') - 1
                imgUrl = imgUrl.slice(25, indexEnd).join('')
                imgUrl = imgUrl.replace("yoursingapore", "visitsingapore");
            }

            if (!eachAttraction[data]['HYPERLINK']) {
                hyperlink = 'unavailable.html'
            }

            else {
                hyperlink = eachAttraction[data]['HYPERLINK'].split('')
                let indexStart = hyperlink.indexOf('>') + 1;
                hyperlink = hyperlink.slice(indexStart, -4).join('');
            }

            if (!eachAttraction[data]['Opening Hours']) {
                eachAttraction[data]['Opening Hours'] = 'information not available'
            }

            if (!eachAttraction[data]['ADDRESSSTREETNAME']) {
                eachAttraction[data]['ADDRESSSTREETNAME'] = 'information not available'
            }

            //content of popups;
            let attractionsPopupDiv = document.createElement('div');
            attractionsPopupDiv.classList.add('popup-interior')
            attractionsPopupDiv.innerHTML =
                `<img class='pop-up-border' style='width: 100%' src="${imgUrl}"> 
            <h5 class='card-title'>${eachAttraction[data]['Name']}</h6>  
            <p class='card-text'>Opening Hours: ${eachAttraction[data]['Opening Hours']}</p>
            <p class='card-text'>${entranceFee[eachAttraction[data]['foc']]}</p>

            <div class='mx-auto'>
            <button class='btn-sm btn-general view'
            type="button" data-bs-toggle="offcanvas" role="button" 
            aria-controls="searchcanvas" 
            data-bs-target="#searchcanvas">search nearby</button>
            
            <button class='btn-sm btn-general'
            type="button" onclick='showRouteToAttraction()'}>
            get directions</button>
            </div>`
            let popup = L.responsivePopup().setContent(attractionsPopupDiv)

            //arts layer
            if (eachAttraction[data]['Field_1']
                && (eachAttraction[data]['Field_1'].toLowerCase().includes('arts')
                    || eachAttraction[data]['PHOTOURL'].toLowerCase().includes('arts'))) {

                let artsMarker = L.marker([eachAttraction.geometry.coordinates[1], eachAttraction.geometry.coordinates[0]],
                    { icon: artsIcon })
                    .bindPopup(popup)

                //arts foc
                if (eachAttraction[data]['foc'] == 'yes') {
                    artsPopupFOC.push(artsMarker)
                    artsMarker.addTo(artsLayerfoc);
                    document.querySelector('#artsfoc').innerHTML += getCardContent(imgUrl,
                        eachAttraction[data]['Name'],
                        eachAttraction[data]['description'],
                        eachAttraction[data]['ADDRESSSTREETNAME'],
                        eachAttraction.geometry.coordinates[1],
                        eachAttraction.geometry.coordinates[0],
                        'view-arts-foc',
                        hyperlink)
                }

                //arts paid
                else {
                    artsPopup.push(artsMarker)
                    artsMarker.addTo(artsLayer);
                    document.querySelector('#arts').innerHTML += getCardContent(imgUrl,
                        eachAttraction[data]['Name'],
                        eachAttraction[data]['description'],
                        eachAttraction[data]['ADDRESSSTREETNAME'],
                        eachAttraction.geometry.coordinates[1],
                        eachAttraction.geometry.coordinates[0],
                        'view-arts',
                        hyperlink)
                }

                artsMarker.on('click', () => { markerClick(eachAttraction.geometry.coordinates[1], eachAttraction.geometry.coordinates[0]) })

                //event listener to direct from offcanvas to map
                let artsButtonFOC = document.querySelectorAll('.view-arts-foc');
                directToMap(artsButtonFOC, artsLayerfoc, artsPopupFOC)


                let artsButton = document.querySelectorAll('.view-arts');
                directToMap(artsButton, artsLayer, artsPopup)


            }


            //nature layer
            else if (eachAttraction[data]['Field_1']
                && (eachAttraction[data]['Field_1'].toLowerCase().includes('nature')
                    || eachAttraction[data]['PHOTOURL'].toLowerCase().includes('nature'))) {


                let natureMarker = L.marker([eachAttraction.geometry.coordinates[1], eachAttraction.geometry.coordinates[0]],
                    { icon: natureIcon })
                    .bindPopup(popup);

                //nature foc
                if (eachAttraction[data]['foc'] == 'yes') {
                    naturePopupFOC.push(natureMarker)
                    natureMarker.addTo(natureLayerfoc);
                    document.querySelector('#naturefoc').innerHTML += getCardContent(imgUrl,
                        eachAttraction[data]['Name'],
                        eachAttraction[data]['description'],
                        eachAttraction[data]['ADDRESSSTREETNAME'],
                        eachAttraction.geometry.coordinates[1],
                        eachAttraction.geometry.coordinates[0],
                        'view-nature-foc',
                        hyperlink)
                }

                //nature paid
                else {
                    naturePopup.push(natureMarker);
                    natureMarker.addTo(natureLayer);
                    document.querySelector('#nature').innerHTML += getCardContent(imgUrl,
                        eachAttraction[data]['Name'],
                        eachAttraction[data]['description'],
                        eachAttraction[data]['ADDRESSSTREETNAME'],
                        eachAttraction.geometry.coordinates[1],
                        eachAttraction.geometry.coordinates[0],
                        'view-nature',
                        hyperlink)
                }
                natureMarker.on('click', () => { markerClick(eachAttraction.geometry.coordinates[1], eachAttraction.geometry.coordinates[0]) })

                //event listener to direct from offcanvas to map
                let natureButtonFOC = document.querySelectorAll('.view-nature-foc');
                directToMap(natureButtonFOC, natureLayerfoc, naturePopupFOC)


                let natureButton = document.querySelectorAll('.view-nature');
                directToMap(natureButton, natureLayer, naturePopup)
            }

            //culture history layer
            else if (eachAttraction[data]['Field_1']
                && (eachAttraction[data]['Field_1'].toLowerCase().includes('culture')
                    || eachAttraction[data]['Field_1'] && (eachAttraction[data]['Field_1'].toLowerCase().includes('history')))) {

                cultureHistoryMarker = L.marker([eachAttraction.geometry.coordinates[1], eachAttraction.geometry.coordinates[0]],
                    { icon: heritageIcon })
                    .bindPopup(popup)

                //culture history foc
                if (eachAttraction[data]['foc'] == 'yes') {
                    cultureHistPopupFOC.push(cultureHistoryMarker)
                    cultureHistoryMarker.addTo(cultureHistoryLayerfoc);
                    document.querySelector('#culture-hist-foc').innerHTML += getCardContent(imgUrl,
                        eachAttraction[data]['Name'], eachAttraction[data]['description'],
                        eachAttraction[data]['ADDRESSSTREETNAME'],
                        eachAttraction.geometry.coordinates[1],
                        eachAttraction.geometry.coordinates[0],
                        'view-culture-foc',
                        hyperlink)
                }

                //culture history paid
                else {
                    cultureHistPopup.push(cultureHistoryMarker)
                    cultureHistoryMarker.addTo(cultureHistoryLayer);
                    document.querySelector('#culture-hist').innerHTML += getCardContent(imgUrl,
                        eachAttraction[data]['Name'],
                        eachAttraction[data]['description'],
                        eachAttraction[data]['ADDRESSSTREETNAME'],
                        eachAttraction.geometry.coordinates[1],
                        eachAttraction.geometry.coordinates[0],
                        'view-culture',
                        hyperlink)
                }

                cultureHistoryMarker.on('click', () => { markerClick(eachAttraction.geometry.coordinates[1], eachAttraction.geometry.coordinates[0]) })

                //event listener to direct from offcanvas to map
                let cultureHistButtonFOC = document.querySelectorAll('.view-culture-foc');
                directToMap(cultureHistButtonFOC, cultureHistoryLayerfoc, cultureHistPopupFOC)

                let cultureHistButton = document.querySelectorAll('.view-culture');
                directToMap(cultureHistButton, cultureHistoryLayer, cultureHistPopup)
            }

            //archi landscapes layer
            else if (eachAttraction[data]['Field_1']
                && (eachAttraction[data]['Field_1'].toLowerCase().includes('architecture')
                    || eachAttraction[data]['Field_1'] && (eachAttraction[data]['Field_1'].toLowerCase().includes('places-to-see')))) {

                let archiLandscapesMarker = L.marker([eachAttraction.geometry.coordinates[1], eachAttraction.geometry.coordinates[0]],
                    { icon: archiLandscapesIcon })
                    .bindPopup(popup);

                //archi landscapes foc
                if (eachAttraction[data]['foc'] == 'yes') {
                    archiLandPopupFOC.push(archiLandscapesMarker);
                    archiLandscapesMarker.addTo(archiLandscapesLayerfoc);
                    document.querySelector('#archi-land-foc').innerHTML += getCardContent(imgUrl,
                        eachAttraction[data]['Name'],
                        eachAttraction[data]['description'],
                        eachAttraction[data]['ADDRESSSTREETNAME'],
                        eachAttraction.geometry.coordinates[1],
                        eachAttraction.geometry.coordinates[0],
                        'view-archi-foc',
                        hyperlink)
                }

                //archi landscapes paid
                else {
                    archiLandPopup.push(archiLandscapesMarker);
                    archiLandscapesMarker.addTo(archiLandscapesLayer);
                    document.querySelector('#archi-land').innerHTML += getCardContent(imgUrl,
                        eachAttraction[data]['Name'],
                        eachAttraction[data]['description'],
                        eachAttraction[data]['ADDRESSSTREETNAME'],
                        eachAttraction.geometry.coordinates[1],
                        eachAttraction.geometry.coordinates[0],
                        'view-archi',
                        hyperlink)
                }

                archiLandscapesMarker.on('click', () => { markerClick(eachAttraction.geometry.coordinates[1], eachAttraction.geometry.coordinates[0]) })

                //event listener to direct from offcanvas to map
                let archiLandButtonFOC = document.querySelectorAll('.view-archi-foc');
                directToMap(archiLandButtonFOC, archiLandscapesLayerfoc, archiLandPopupFOC)

                let archiLandButton = document.querySelectorAll('.view-archi');
                directToMap(archiLandButton, archiLandscapesLayer, archiLandPopup)
            }

            //recreation layer
            else if (eachAttraction[data]['Field_1']
                && (eachAttraction[data]['Field_1'].toLowerCase().includes('recreation')
                    || eachAttraction[data]['PHOTOURL'].toLowerCase().includes('recreation'))) {

                let recreationMarker = L.marker([eachAttraction.geometry.coordinates[1], eachAttraction.geometry.coordinates[0]],
                    { icon: recreationIcon })
                    .bindPopup(popup);

                //recreation foc
                if (eachAttraction[data]['foc'] == 'yes') {
                    recreationPopupFOC.push(recreationMarker);
                    recreationMarker.addTo(recreationLayerfoc);
                    document.querySelector('#recreation-foc').innerHTML += getCardContent(imgUrl,
                        eachAttraction[data]['Name'],
                        eachAttraction[data]['description'],
                        eachAttraction[data]['ADDRESSSTREETNAME'],
                        eachAttraction.geometry.coordinates[1],
                        eachAttraction.geometry.coordinates[0],
                        'view-recre-foc',
                        hyperlink)
                }

                //recreation paid
                else {
                    recreationPopup.push(recreationMarker);
                    recreationMarker.addTo(recreationLayer);
                    document.querySelector('#recreation').innerHTML += getCardContent(imgUrl,
                        eachAttraction[data]['Name'],
                        eachAttraction[data]['description'],
                        eachAttraction[data]['ADDRESSSTREETNAME'],
                        eachAttraction.geometry.coordinates[1],
                        eachAttraction.geometry.coordinates[0],
                        'view-recre',
                        hyperlink)
                }
                recreationMarker.on('click', () => { markerClick(eachAttraction.geometry.coordinates[1], eachAttraction.geometry.coordinates[0]) })

                //event listener to direct from offcanvas to map
                let recreationButtonFOC = document.querySelectorAll('.view-recre-foc');
                directToMap(recreationButtonFOC, recreationLayerfoc, recreationPopupFOC);

                let recreationButton = document.querySelectorAll('.view-recre');
                directToMap(recreationButton, recreationLayer, recreationPopup)
            }
        }
    }
})

//#navbar
//toggle for current layer
let layerControl = document.querySelector('#change')
let paidAttractions = [artsLayer, natureLayer, cultureHistoryLayer, archiLandscapesLayer, recreationLayer];
let freeAttractions = [artsLayerfoc, natureLayerfoc, cultureHistoryLayerfoc, archiLandscapesLayerfoc, recreationLayerfoc];

layerControl.addEventListener('click', function () {
    if (routing) {
        routing.remove()
    }
    searchResultLayer.clearLayers();
    if (userLocation) { map.removeLayer(userLocation) }
    document.querySelector('#search-side').style.display = 'none';
    if (document.querySelector('#current-layer').innerHTML == "PAID") {
        layerControl.innerHTML = '<i class="bi bi-toggle-off"></i>';
        layerControl.style.backgroundColor = 'white';
        layerControl.style.color = '#C0392B';
        layerControl.setAttribute('data-bs-target', '#foc-attractions');
        controller.remove();
        document.querySelector('#current-layer').innerHTML = "FREE";
        document.querySelector('#nav-toggle').href = "#foc-attractions";
        document.querySelector('#nav-toggle').setAttribute('aria-controls', "foc-attractions");
        let i = 0;
        for (let eachLayer in overlayLayers) {
            map.removeLayer(paidAttractions[i]);
            freeAttractions[i].addTo(map)
            i++;
        }
        controller = L.control.layers({}, overlayLayersFOC).addTo(map);
        document.querySelector('.leaflet-control-layers-toggle').style.backgroundImage = "url(images/overlay-control/free.png)";
    }
    else {
        document.querySelector('#current-layer').innerHTML = "PAID";
        layerControl.innerHTML = '<i class="bi bi-toggle-on"></i>';
        layerControl.style.backgroundColor = '#C0392B';
        layerControl.style.color = 'white';
        layerControl.setAttribute('data-bs-target', '#paid-attractions');
        controller.remove();
        document.querySelector('#nav-toggle').href = "#paid-attractions";
        document.querySelector('#nav-toggle').setAttribute('aria-controls', "paid-attractions")
        let i = 0;
        for (let eachLayer in overlayLayers) {
            map.removeLayer(freeAttractions[i]);
            paidAttractions[i].addTo(map)
            i++;
        }
        controller = L.control.layers({}, overlayLayers, { position: 'topright' }).addTo(map);
        document.querySelector('.leaflet-control-layers-toggle').style.backgroundImage = "url(images/overlay-control/money.png)";
    }
})

//event listener to show contact-us page
document.querySelector('#contact-us-button').addEventListener('click', function () {
    document.querySelector('#contact-page').classList.remove('hide-page');
    document.querySelector('#contact-page').classList.add('show-page');
    document.querySelector('#main-page').classList.add('hide-page');
    document.querySelector('#main-page').classList.remove('show-page');
    document.querySelector('#contact-us').style.display = 'block';
})

//event listener to show/hide weather icons
document.querySelector('#weatherBtn').addEventListener('click', async function () {
    await getWeather();
    if (map.hasLayer(weatherMarkers)) {
        map.removeLayer(weatherMarkers)
    }
    else {
        map.addLayer(weatherMarkers)
    }
})

//weather button styling
//styling for small screens
document.querySelector('#map').addEventListener('click', function () {
    if (document.querySelector('.leaflet-control-layers-expanded')) {
        document.querySelector('#weatherBtn').style.right = '240px';
    }
    else {
        document.querySelector('#weatherBtn').style.right = '60px';
    }
})
//styling for large screens
document.querySelector('#map').addEventListener('mouseover', function () {
    if (document.querySelector('.leaflet-control-layers-expanded')) {
        document.querySelector('#weatherBtn').style.right = '240px';
    }
    else {
        document.querySelector('#weatherBtn').style.right = '60px';
    }
})


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
        document.querySelector('#loader').style.display = 'block';
        let locations = await searchNearby(query);
        L.circle([chosenLat, chosenLng], { radius: 1000, color: '#C0392B' }).addTo(searchResultLayer);
        if (locations.results == false) {
            document.querySelector('#loader').style.display = 'none';
            document.querySelector('#results').innerHTML = "no results found";
        }
        else {
            let allResults = document.createElement('div');
            //create global variable to store results first before appending
            //can also have spinner to indicate loading; show before then hide when finish appending
            for (let eachResult of locations.results) {
                let id = eachResult.fsq_id;
                let photoLink = ""
                let photo = await photoSearch(id);
                let details = await placeDetails(id);
                if (photo[0]) {
                    photoLink = photo[0].prefix + 'original' + photo[0].suffix;
                }
                else {
                    photoLink = eachResult.categories[0].icon.prefix + 'bg_120' + eachResult.categories[0].icon.suffix;
                }

                if (!details.hours.display) {
                    details.hours.display = 'opening hours unavailable'
                }

                if (!details.rating) {
                    details.rating = 'ratings unavailable'
                }

                if (!details.website) {
                    details.website = 'unavailable.html'
                }

                let popupDiv = document.createElement('div');
                popupDiv.classList.add('popup-interior')
                popupDiv.innerHTML = `
                <img class='pop-up-border' style='width: 297px; height: 167px; object-fit: contain;' src='${photoLink}'>
                <h4>${eachResult.name}</h4>
                <p>Opening Hours: ${details.hours.display}</p>
                <p>Address: ${eachResult.location.formatted_address}</p>
                <p>${eachResult.distance}m from the attraction</p>
                <p>Ratings: ${details.rating} <i class="bi bi-star-fill"></i>
                </p>
                <button class='btn-sm btn-general'
                type="button">
                get directions</button>
               <a class = 'btn-sm btn-general place-link' type="button" href='${details.website}' 
               target="_blank">visit website</a>`
                // customise styling of a button
                popupDiv.querySelector('button').addEventListener('click', function () {
                    showRouteToNearby(eachResult.geocodes.main.latitude, eachResult.geocodes.main.longitude)
                })
                let popupContent = L.responsivePopup().setContent(popupDiv)
                let resultPopup = L.marker([eachResult.geocodes.main.latitude, eachResult.geocodes.main.longitude], { icon: searchIcon })
                    .addTo(searchResultLayer)
                    .bindPopup(popupContent)
                let perResult = document.createElement('div');
                perResult.className = 'search-result';
                perResult.innerHTML = eachResult.name;
                perResult.setAttribute("data-bs-dismiss", "offcanvas");
                perResult.setAttribute("aria-label", "Close")
                perResult.addEventListener('click', function () {
                    map.flyTo([eachResult.geocodes.main.latitude, eachResult.geocodes.main.longitude], 16);
                    resultPopup.openPopup()
                })
                allResults.appendChild(perResult);
            }
            document.querySelector('#results').appendChild(allResults);
            document.querySelector('#loader').style.display = 'none';
            searchResultLayer.addTo(map)
        }
    }
    else {
        document.querySelector('#validate').innerHTML = `<div class='alert alert-warning'>please enter a search term</div>`
    }
})

//event listener to reset foursquare search
document.querySelector('#reset').addEventListener('click', function () {
    document.querySelector('#results').innerHTML = "";
    searchResultLayer.clearLayers();
    document.querySelector('#search').value = "";
    document.querySelector('#validate').innerHTML = "";
})


//#contact-us page
//form validation
document.querySelector('#submitBtn').addEventListener('click', function () {
    if (!document.querySelector('#first-name').value) {
        document.querySelector('#invalid-first-name').style.display = 'block';
        document.querySelector('#first-name').style.border = 'solid 1px darkred';
    }
    else {
        document.querySelector('#invalid-first-name').style.display = 'none';
        document.querySelector('#first-name').style.border = '';
    }

    if (!document.querySelector('#last-name').value) {
        document.querySelector('#invalid-last-name').style.display = 'block';
        document.querySelector('#last-name').style.border = 'solid 1px darkred';
    }
    else {
        document.querySelector('#invalid-last-name').style.display = 'none';
        document.querySelector('#last-name').style.border = '';
    }

    if (!document.querySelector('#message').value) {
        document.querySelector('#invalid-message').style.display = 'block';
        document.querySelector('#message').style.border = 'solid 1px darkred';
    }
    else {
        document.querySelector('#invalid-message').style.display = 'none';
        document.querySelector('#message').style.border = '';
    }

    let residencyRadio = document.querySelectorAll('.residency');
    let residency = "";
    for (let each of residencyRadio) {
        if (each.checked) {
            residency = each.value;
        }
    }
    if (!residency) {
        document.querySelector('#invalid-residency').style.display = 'block';
    }
    else {
        document.querySelector('#invalid-residency').style.display = 'none';
    }


    if (!document.querySelector('#email').value || !document.querySelector('#email').value.includes('@')) {
        document.querySelector('#invalid-email').style.display = 'block';
        document.querySelector('#email').style.border = 'solid 1px darkred';
    }
    else {
        document.querySelector('#invalid-email').style.display = 'none';
        document.querySelector('#email').style.border = '';
    }

    if (document.querySelector('#first-name').value && document.querySelector('#last-name').value && document.querySelector('#message').value && residency && document.querySelector('#email') && document.querySelector('#email').value) {
        document.querySelector('.form-content').innerHTML = `<h2>thank you for contacting us! <br>
        we will try to get in touch with you as soon as possible</h2>`
    }

})

//return to main page from contact-us
document.querySelector('.return').addEventListener('click', function () {
    document.querySelector('#main-page').classList.remove('hide-page');
    document.querySelector('#main-page').classList.add('show-page');
    document.querySelector('#contact-page').classList.add('hide-page');
    document.querySelector('#contact-page').classList.remove('show-page');
})