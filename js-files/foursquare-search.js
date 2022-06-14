//four square
const BASE_API_URL = 'https://api.foursquare.com/v3/';
const API_KEY = 'fsq3ZRDrusEE9o+I1ExY+0+OY+AEHvj6C8fw5zccHOkbJpA=';

async function searchNearby(query) {
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

async function photoSearch(id) {
    let url = BASE_API_URL + `places/${id}/photos`;
    let response = await axios.get(url, {
        'params': {
            'fsq_id': id,
            'limit': 1,
        },
        'headers': {
            'Accept': 'application/json',
            'Authorization': API_KEY
        }
    });
    return response.data
}

async function openingHours (id){
    let url = BASE_API_URL + `places/${id}`;
    let response = await axios.get(url, {
        'params': {
            'fsq_id': id,
            'fields': 'hours'
        },
        'headers': {
            'Accept': 'application/json',
            'Authorization': API_KEY
        }
    })
    return response.data
}