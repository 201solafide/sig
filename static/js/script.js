var map = L.map('map').setView([-5.360092, 105.314564], 15);

        // Basemap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
        }).addTo(map);

        // Fetch data GeoJSON
        fetch('http://127.0.0.1:3000/api/embung')
            .then(response => response.json())
            .then(data => {
                var geojsonLayer = L.geoJSON(data.features, {
                    onEachFeature: function (feature, layer) {
                        layer.bindPopup(`
                            <b>Nama:</b> ${feature.properties.Name || "Tidak Ada Data"}<br>
                            <b>Luas:</b> ${feature.properties.Luas_m2 || "Tidak Ada Data"} m²<br>
                            <b>Keliling:</b> ${feature.properties.Keliling_m || "Tidak Ada Data"} m
                        `);
                    }
                }).addTo(map);

                // Search Control
                var searchControl = new L.Control.Search({
                    layer: geojsonLayer,
                    propertyName: 'Name',
                    zoom: 18,
                    marker: false
                });
                map.addControl(searchControl);
            });

        // Routing Control
        L.Routing.control({
            waypoints: [
                L.latLng(-5.360092, 105.314564),
                L.latLng(-5.358000, 105.320000) // Koordinat tujuan
            ],
            routeWhileDragging: true,
            router: L.Routing.osrmv1({
                serviceUrl: 'https://router.project-osrm.org/route/v1'
            })
        }).addTo(map);