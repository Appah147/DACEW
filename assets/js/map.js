let currentMarker = null; // Replace both previousMarker and selectedMarker
let polyline = null;
let routeLayer = null;

const deliveryPoint = [45.5019, -73.5674];
const map = L.map('map').setView(deliveryPoint, 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

L.marker(deliveryPoint).addTo(map)
    .bindPopup('Point de livraison - Montréal')
    .openPopup();

/**
 * Supprime les elements deja presents sur la map
 * 
 */
function clearMapElements() {
    if (currentMarker) map.removeLayer(currentMarker);
    if (polyline) map.removeLayer(polyline);
    if (routeLayer) map.removeLayer(routeLayer);
}

/**
 * localise l'utilisateur
 */
function locateUser() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const userLatLng = [position.coords.latitude, position.coords.longitude];
            map.setView(userLatLng, 14);
            clearMapElements();
            currentMarker = L.marker(userLatLng).addTo(map).bindPopup("Vous êtes ici").openPopup();
            drawRouteAndLine(userLatLng);
        }, () => {
            alert("Impossible de récupérer votre position.");
        });
    } else {
        alert("La géolocalisation n'est pas supportée par ce navigateur.");
    }
}

/**
 * Recherche une adresse
 * @returns Null
 */
function searchAddress() {
    const address = document.getElementById('address-input').value;
    if (!address) {
        alert("Veuillez entrer une adresse.");
        return;
    }

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                alert("Adresse introuvable.");
                return;
            }

            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            const newLatLng = [lat, lon];

            map.setView(newLatLng, 14);
            clearMapElements();
            currentMarker = L.marker(newLatLng).addTo(map).bindPopup(data[0].display_name).openPopup();
            drawRouteAndLine(newLatLng);
        })
        .catch(error => {
            alert("Erreur lors de la recherche.");
            console.error(error);
        });
}

/**
 * Dessine une route (lignes) vers une destination donnee
 * @param {*} destination 
 */
function drawRouteAndLine(destination) {
    // Red dashed line
    polyline = L.polyline([deliveryPoint, destination], {
        color: 'red',
        weight: 2,
        dashArray: '5, 5'
    }).addTo(map);

    // Route
    calculateRoute(deliveryPoint, destination);
    calculateDistance(deliveryPoint, destination);
}

/**
 * Calcule de route
 * @param {*} start 
 * @param {*} end 
 */
function calculateRoute(start, end) {
    const routeUrl = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;

    fetch(routeUrl)
        .then(response => response.json())
        .then(data => {
            if (data.routes && data.routes.length > 0) {
                const route = data.routes[0].geometry;

                routeLayer = L.geoJSON(route, {
                    style: { color: 'blue', weight: 4 }
                }).addTo(map);

                const routeDistance = data.routes[0].legs[0].distance / 1000;
                displayDistance(routeDistance);
            } else {
                alert("Aucun itinéraire trouvé.");
            }
        })
        .catch(error => {
            alert("Erreur lors du calcul de l'itinéraire.");
            console.error(error);
        });
}

/**
 * Calcule la distance
 * @param {*} start 
 * @param {*} end 
 */
function calculateDistance(start, end) {
    const R = 6371;
    const dLat = (end[0] - start[0]) * Math.PI / 180;
    const dLon = (end[1] - start[1]) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(start[0] * Math.PI / 180) * Math.cos(end[0] * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    displayDistance(distance);
}

/**
 * Affiche la distance
 * @param {*} distance 
 */
function displayDistance(distance) {
    document.getElementById('distance-info').innerHTML = `La distance entre les deux points est de ${distance.toFixed(2)} km.`;
}

// Reverse geocode map click
map.on('click', function(e) {
    const newLatLng = [e.latlng.lat, e.latlng.lng];
    clearMapElements();

    const reverseUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${newLatLng[0]}&lon=${newLatLng[1]}`;

    fetch(reverseUrl)
        .then(response => response.json())
        .then(data => {
            const address = data.display_name || `${newLatLng[0].toFixed(4)}, ${newLatLng[1].toFixed(4)}`;
            currentMarker = L.marker(newLatLng).addTo(map)
                .bindPopup(`Adresse sélectionnée : ${address}`)
                .openPopup();
            drawRouteAndLine(newLatLng);
        })
        .catch(error => {
            console.error("Erreur reverse geocoding:", error);
            currentMarker = L.marker(newLatLng).addTo(map)
                .bindPopup(`Coordonnées : ${newLatLng[0].toFixed(4)}, ${newLatLng[1].toFixed(4)}`)
                .openPopup();
            drawRouteAndLine(newLatLng);
        });
});
