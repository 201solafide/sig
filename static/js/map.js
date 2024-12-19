var map = L.map('map').setView([-5.360092, 105.314564], 15);

// basemap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

// Load GeoJSON
fetch('/static/data/embung_gis_baru1.geojson')
// fetch('http://127.0.0.1:3000/api/embung')
    .then(response => response.json())
    .then(data => {
        var geoJsonLayer = L.geoJSON(data, {
            onEachFeature: function (feature, layer) {
                layer.bindPopup(`
                    <b>${feature.properties.Name}</b><br>
                    Luas: ${feature.properties.Luas_m2} m²<br>
                    Keliling: ${feature.properties.Keliling_m} m
                `);
            }
        }).addTo(map);

        // Menambahkan tombol pencarian untuk fitur yang ada di GeoJSON
        var searchControl = new L.Control.Search({
            layer: geoJsonLayer,
            propertyName: 'Name', // Nama field yang digunakan untuk pencarian
            initial: false,
            zoom: 17,
            marker: false // Tidak menambahkan marker pencarian
        });
        map.addControl(searchControl);

        searchControl.on('search:locationfound', function (e) {
            e.layer.setStyle({ color: 'yellow', weight: 3 }); // Highlight fitur
            setTimeout(() => e.layer.setStyle({ color: '#3388ff', weight: 1 }), 2000); // Kembali ke warna semula
        });
    });
