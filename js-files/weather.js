//weather API
let weatherMarkers = L.layerGroup()

let weatherAPI = 'https://api.data.gov.sg/v1/environment/2-hour-weather-forecast';
async function getWeather() {
    let response = await axios.get(weatherAPI);
    let weatherData = response.data;
    for (let i = 0; i < weatherData.area_metadata.length; i++) {
        if (weatherData.items[0].forecasts[i].forecast.toLowerCase().includes('partly cloudy')) {
            let marker = L.marker([weatherData.area_metadata[i].label_location.latitude, weatherData.area_metadata[i].label_location.longitude], { icon: partlyCloudyIcon }).addTo(weatherMarkers)
            marker.bindPopup(`<h5>${weatherData.items[0].forecasts[i].area}</h5>
            ${weatherData.items[0].forecasts[i].forecast}`)
        }
        else if (weatherData.items[0].forecasts[i].forecast.toLowerCase().includes('cloudy')) {
            let marker = L.marker([weatherData.area_metadata[i].label_location.latitude, weatherData.area_metadata[i].label_location.longitude], { icon: cloudyIcon }).addTo(weatherMarkers)
            marker.bindPopup(`<h5>${weatherData.items[0].forecasts[i].area}</h5>
        ${weatherData.items[0].forecasts[i].forecast}`)
        }
        else if (weatherData.items[0].forecasts[i].forecast.toLowerCase().includes('thunder')) {
            let marker = L.marker([weatherData.area_metadata[i].label_location.latitude, weatherData.area_metadata[i].label_location.longitude], { icon: thunderyIcon }).addTo(weatherMarkers)
            marker.bindPopup(`<h5>${weatherData.items[0].forecasts[i].area}</h5>
            ${weatherData.items[0].forecasts[i].forecast}`)
        }
        else if (weatherData.items[0].forecasts[i].forecast.toLowerCase().includes('rain') || weatherData.items[0].forecasts[i].forecast.toLowerCase().includes('showers')) {
            let marker = L.marker([weatherData.area_metadata[i].label_location.latitude, weatherData.area_metadata[i].label_location.longitude], { icon: rainIcon }).addTo(weatherMarkers)
            marker.bindPopup(`<h5>${weatherData.items[0].forecasts[i].area}</h5>
            ${weatherData.items[0].forecasts[i].forecast}`)
        }
        else {
            let marker = L.marker([weatherData.area_metadata[i].label_location.latitude, weatherData.area_metadata[i].label_location.longitude], { icon: fairIcon }).addTo(weatherMarkers)
            marker.bindPopup(`<h5>${weatherData.items[0].forecasts[i].area}</h5>
            ${weatherData.items[0].forecasts[i].forecast}`)
        }
    }
}
