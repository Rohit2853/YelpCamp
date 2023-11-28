
// console.log(campground.geometry.coordinates);
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: "map", // container ID
style: "mapbox://styles/mapbox/streets-v12", // style URL
center: campground.geometry.coordinates, // starting position [lng, lat]
zoom: 10, // starting zoom
});

const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`<h4>${campground.title}</h4>`);
map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(popup)
    .addTo(map)