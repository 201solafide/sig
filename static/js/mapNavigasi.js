var map = L.map('map').setView([-5.360092, 105.314564], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap GIS Embung'
}).addTo(map);

// menambahin variabel untuk waypoin dulu
let control = L.Routing.control({
    waypoints: [],
    routeWhileDragging: true,
    router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1'
    }),
    lineOptions: {
        styles: [{color: 'blue', weight: 3}]
    },
    show: false
});

fetch('http://127.0.0.1:3000/api/embung')
    .then(response => response.json())
    .then(data => {
        var geojsonLayer = L.geoJSON(data.features, {
            interactive: true,
            onEachFeature: function (feature, layer) {
                // console.log(feature); // Lihat struktur feature
                // console.log(feature.properties); // Pastikan properties ada
                // console.log(feature.properties.Keliling_m); // Pastikan properties ada
                layer.bindPopup(`
                    <b>Nama:</b> ${feature.properties.Name || "Tidak Ada Data"}<br>
                    <b>Luas:</b> ${feature.properties.Luas_m2 || "Tidak Ada Data"} m²<br>
                    <b>Keliling:</b> ${feature.properties.Keliling_m || "Tidak Ada Data"} m <br>
                `);
            }
        }).addTo(map);

        // menambahkan fitur pencarian
        var searchControl = new L.Control.Search({
            layer: geojsonLayer,
            propertyName: 'Name',
            marker: false,
            moveToLocation: function(latlng, title){
                map.setView(latlng, 18);
            }
        });
        map.addControl(searchControl);

    });

// variabel untuk lokasi saat ini
var currentLocation = null;

// Geolocation = Location pengguna (navigasi)
map.locate({setView: true, maxZoom: 16});
map.on('locationfound', function(e){
    currentLocation: e.latlng;
    L.marker(currentLocation).addTo(map).bindPopup('Lokasi sekarang').openPopup();
});

// fungsi untuk menavigasi

function setDestination(lat, lng, name){
    if(currentLocation){
        control.setWaypoints([
            L.latlng(currentLocation.lat, currentLocation.lng),
            L.latlng(lat, lng)
        ]);
    }else {
        alert("lokasi tidak ditemukan");
    }
}

// fungsi rute manual
function manualRouting(lat1, lng1, lat2, lng2){
    control.setWaypoints([
        L.latLng(lat1, lng1),
        L.latLng(lat2, lng2)
    ]);
}