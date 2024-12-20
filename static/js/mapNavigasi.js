<<<<<<< HEAD
var map = L.map('map').setView([-5.360092, 105.314564], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap GIS Embung'
}).addTo(map);

// menambahin variabel untuk waypoin dulu
let control = L.Routing.control({
    waypoints: [],
=======
// Inisialisasi peta
var map = L.map('map').setView([-5.360092, 105.314564], 13);

// Layer OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Variabel waypoint
let control = L.Routing.control({
    waypoints: [], // Mulai dengan kosong
>>>>>>> 5aa844d (Merge remote-tracking branch 'origin/main')
    routeWhileDragging: true,
    router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1'
    }),
    lineOptions: {
<<<<<<< HEAD
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
=======
        styles: [{ color: 'blue', weight: 4 }]
    }
    // show: false
}).addTo(map);

// Ambil data GeoJSON embung
fetch('http://127.0.0.1:3000/api/embung')
    .then(response => response.json())
    .then(data => {
        // Tambahkan layer GeoJSON ke peta
        // var geojsonLayer = L.geoJSON(data.features, {
        //     onEachFeature: function (feature, layer) {
        //         layer.bindPopup(`
        //             <b>Nama:</b> ${feature.properties.Name || "Tidak Ada"}<br>
        //             <b>Luas:</b> ${feature.properties.Luas_m2 || "Tidak Ada"} m²<br>
        //             <button onclick="setDestination(${layer.getLatLng().lat}, ${layer.getLatLng().lng}, '${feature.properties.Name}')">
        //                 Navigasi ke sini
        //             </button>
        //         `);
        //     }
        // }).addTo(map);
        var geojsonLayer = L.geoJSON(data, {
            onEachFeature: onEachFeature
        }).addTo(map);

        // Tambahkan fitur pencarian
        var searchControl = new L.Control.Search({
            layer: geojsonLayer, // Layer GeoJSON yang digunakan
            propertyName: 'Name', // Properti pada GeoJSON yang akan dicari
            marker: false,
            moveToLocation: function(latlng, title, map) {
                map.setView(latlng, 16); // Zoom ke lokasi
            }
        });
        map.addControl(searchControl);
        
        searchControl.on('search:locationfound', function (e) {
            if (waypoints.length < 2){
                addWaypoint(e.latlng)
            }
        });
    });

// Variabel untuk lokasi saat ini
var currentLocation = null;

// Geolocation - mendapatkan lokasi pengguna
map.locate({ setView: true, maxZoom: 16 });
map.on('locationfound', function (e) {
    currentLocation = e.latlng;
    L.marker(currentLocation).addTo(map)
        .bindPopup('Lokasi Anda Sekarang').openPopup();
});

function onEachFeature(feature, layer){
    if (feature.properties && feature.properties.Name){
        layer.bindPopup(`
            <b>Nama:</b> ${feature.properties.Name || "Tidak Ada"}<br>
            <b>Luas:</b> ${feature.properties.Luas_m2 || "Tidak Ada"} m²<br>
            <b>Keliling:</b> ${feature.properties.Keliling_m || "Tidak ada"} m <br>
            <button><img style="width: 100px; height: 100px;" src="/static/images/search-icon.jpeg" alt="logo-search"> </button>
            <button>navigasiHere</button>
    
        `);   
    }

    // listener klik layer 
    layer.on('click', function() {
        let center;
        if (layer.getLatLng){
            center = layer.getLatLng(); //untuk point
        } else if (layer.getBounds){
            center = layer.getBounds().getCenter(); // untuk polygon atau linestyring
        }
        map.setView(center, 16); // zoom lokasi
    });
}


// Fungsi untuk menavigasi
function setDestination(lat, lng, name) {
    if (currentLocation) {
        control.setWaypoints([
            L.latLng(currentLocation.lat, currentLocation.lng),  // Lokasi saat ini
            L.latLng(lat, lng) // Lokasi embung
        ]);
    } else {
        alert("Lokasi Anda tidak ditemukan! Pastikan GPS diaktifkan.");
    }
}

// Fungsi untuk memilih rute manual dari dua embung
function manualRouting(lat1, lng1, lat2, lng2) {
>>>>>>> 5aa844d (Merge remote-tracking branch 'origin/main')
    control.setWaypoints([
        L.latLng(lat1, lng1),
        L.latLng(lat2, lng2)
    ]);
}