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