var map = L.map('map').setView([-5.360092, 105.314564], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
    // attribution: '&copy; OpenStreetMap GIS Embung'
}).addTo(map);

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

        // Menambahkan fitur pencarian
        var searchControl = new L.Control.Search({
            layer: geojsonLayer,
            propertyName: 'Name', // Nama field yang digunakan untuk pencarian
            initial: false,
            zoom: 18,
            marker: false // Tidak menambahkan marker pencarian
        });
        map.addControl(searchControl);
            // moveToLocation: function(latlng, title){
            //     map.setView(latlng, 18);
            // }

        // map.addControl(searchControl);
        // console.log(data);
        // console.log(data.features);
        // console.log(data.features.properties);

        // event onSearch untuk menambahkan titik sebagai waypoint routing
        searchControl.on('search:locationfound', function (e) {
            if (waypoints.length < 2){
                addWaypoint(e.latlng)
            }
        });
    })
    .catch(error => console.error('Error fetching GeoJSON:', error));

let waypoints = [];

function addWaypoint(latlng) {
    const marker = L.marker(latlng).addTo(map);

    // tambahkan ke waypoint
    waypoints.push(latlng);

    // jika sudah dua titik, tampilkan rute
    if (waypoints.length === 2){
        L.Routing.control({
            waypoints: waypoints,
            routeWhileDragging: true,
            router: L.Routing.osrmv1({
                serviceUrl: 'https://router.project-osrm.org/route/v1'
            })                    
        }).addTo(map);

        // reset waypoints untuk rute berikutnya
        waypoints = [];
    }
}

// tambahkan event clik untuk menambahkan titik koordinat ke waypoint
map.on('click', function (e) {
    if (waypoints.length < 2) {
        addWaypoint(e.latlng);
    }
    });

