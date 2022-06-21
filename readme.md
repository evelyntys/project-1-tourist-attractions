
# SGgoWhere
The live demo of the website is available [here](https://sggowhere.netlify.app/).

## Project Summary
This website aims to serve as a guide for users on the different attractions available in Singapore, grouped into 5 main categories:
* Arts
* Nature
* Culture and History
* Architecture and Landmarks
* Recreation

The main target audience of this website are tourists coming to Singapore. It could also serve as a guide for fellow Singaporeans who are thinking about where to go or visit in Singapore on their next day off .

## The Five Planes of UI/UX
### 1. Strategy 
#### Organisation
* Objective: To provide information about the various attractions available in Singapore
#### User 
* Objective: To find attractions available in Singapore
* Needs: 
    * Easily accessible information about the attractions in Singapore
    * Available amenities e.g. dining places, stations near the attraction of interest
    * Know if an attraction offers free entry or not
* Demographics:
    * Anyone interested in exploring the different attractions available in Singapore 
* Pain points: 
    * May have to use different websites to search for each feature:
        * Amenities near the attractions
        * Directions to the amenities
        * Directions to the attractions
        * Whether the attraction offers free entry
        * Opening hours


 User Stories    | Acceptance Criteria(s)    
 -------------   | ---------------------      
As someone looking for attractions to visit around Singapore, I want to be able to know if the attractions require an entry fee. I would also like to read more about each attraction before deciding which ones to visit.| <ul><li>Feature to toggle between free attractions and paid attractions</li> <li>Indicators on the attraction of interest to show entry fee requirements</li></ul>
As someone planning to visit outdoor attractions, I would like to know the weather around the area to see if it would be feasible to visit. | <ul><li>Feature to show weather data around Singapore</li></ul>
As someone visitng an attraction, I would be concerned about the food choices nearby, as well as the bus stops and stations to plan my navigation. | <ul><li>Feature to search for nearby food places and stations etc</li> <li>Feature to show directions to aid in navigation planning</li></ul>


### 2. Scope
#### Functional Requirements
#### Features
1. <b>Layer toggle between free and paid attractions</b>
* Attractions separated based on whether they require an entry fee prior to entry or not
* Navigation bar toggle allow users to toggle between attractions that have no entry fee and those that require an entry fee

2. <b>Side-bar navigation</b>
* Triggered by clicking the main navigation bar icon
* Allows for unobstructed view of the map
* Allows for users to read the description of the different attractions
    * View more about the attraction on the map popup
    * Visit the respective websites of the attraction

3. <b>Map popups</b>
* Obtain directions to the attraction based on their current location
* Search for available amenities nearby (e.g. food, stations) within a 1km radius of the chosen attraction
    * Directions to the amenity of interest from the attraction of interest is also available
    
    <i>Note: Due to limitations, currently only driving instructions are available</i>

4. <b>Weather data</b>
* 2-hourly weather data is available, triggered by clicking the weather button on the map
    * Weather data, marked by various icons, around the different areas of Singapore will be shown
    * Aims to help users plan their days/itinerary better as some places, such as parks or nature reserves may not be so fun on rainy days!


#### Content
* Information about the different attractions e.g. name, location, category, free entry or paid
* Information about the weather

#### Non-functional Requirements
* Mobile responsiveness 
* Performance and loading

### 3. Structure
![Structure of the website](/images/read-me/structure.png?raw=true)

### 4. Skeleton
An initial draft idea of the site layout has been attached.
![Initial wireframe of the website](/images/read-me/initial-wireframe.png?raw=true)

### 5. Surface
* The main colors used in this website are red and white, synchronus to the colors on the Singapore flag.
* The fonts used include:
    * Carme for general text
    * Fredoka One for navbar icon
    * Cantarell for showing the current layer

## Deployment
This website was deployed using [Netlify](https://www.netlify.com/). 

## Testing
Details for test cases for the website can be found [here]().

## Technologies Used
* HTML
* CSS
* Javascript
* [LeafletJS](https://leafletjs.com/) for map creation
    * [Marker Cluster](https://github.com/Leaflet/Leaflet.markercluster) for adding markers to group clusters
    * [Leaflet Routing Machine](https://github.com/perliedman/leaflet-routing-machine)
* [Boostrap v5.0](https://getbootstrap.com/) for general styling and design of the website
* [MyGeoData](https://mygeodata.cloud/converter/kml-to-geojson) for conversion of KML file to Geojson
* [Axios](https://github.com/axios/axios) for calling API and getting data from promises
* [Google Fonts](https://fonts.google.com/) for the fonts used
* [Bootstrap Icons](https://icons.getbootstrap.com/) for icons

## Possible improvements to the project
* Leaflet Routing Machine only provides driving directions, which may not be that applicable for tourists as they most likely will not be driving in Singapore. We could consider other forms of routing services if available in the future, to also include navigation with public transport and walking. 

* No search bar is implemented for those who may already have a specific attraction in mind and wish to search for it as this website mainly caters to those who are unsure of the attractions available. We can consider implementing a searchbar to cater for both groups.

* Currently, users are only allowed to get directions to a specific attraction from their location. We can consider allowing users to input another location of choice into the routing machine to obtain the directions.

## Credits
### Data
* KML data of attractions & weather API from [data.gov.sg](data.gov.sg);
* API for nearby search from [Foursquare](https://developer.foursquare.com/docs);

### Landing Page Images
* (Portrait photo for small-screen devices by Tiff Ng)[https://www.pexels.com/photo/marina-bay-sand-s-2434270/]
* (Landscape photo for larger devices from Travel.Earth)[https://travel.earth/why-is-singapore-a-hard-to-beat-tourist-destination/]

### Navbar Icon
* <a href="https://www.flaticon.com/free-icons/tourist" title="tourist icons">Tourist icons created by Luvdat - Flaticon</a>

### Location Pins Icons
* <a href="https://www.flaticon.com/free-icons/maps-and-location" title="maps-and-location icons">Maps-and-location icons created by Smashicons - Flaticon</a>

### Layer Control Icons
* <a href="https://www.flaticon.com/free-icons/free" title="free icons">Free icons created by wanicon - Flaticon</a>
* <a href="https://www.flaticon.com/free-icons/money" title="money icons">Money icons created by Freepik - Flaticon</a>

### Weather Icons
* <a href="https://www.flaticon.com/free-icons/cloudy" title="cloudy icons">Cloudy icons created by Freepik - Flaticon</a>
* <a href="https://www.flaticon.com/free-icons/sun" title="sun icons">Sun icons created by Freepik - Flaticon</a>
* <a href="https://www.flaticon.com/free-icons/storm" title="storm icons">Storm icons created by Freepik - Flaticon</a>
* <a href="https://www.flaticon.com/free-icons/rain" title="rain icons">Rain icons created by Freepik - Flaticon</a>

### Error Icon
* <a href="https://www.flaticon.com/free-icons/error" title="error icons">Error icons created by Freepik - Flaticon</a>

### Loader GIF
* [Icon from loading.io](https://loading.io/)