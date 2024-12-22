var map = L.map('map').setView([-5.360092, 105.314564], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

var kawasanSHP = L.geoJSON(null, {
    style: {
        color: "#3388ff",
        weight: 2,
        fillcolor: "#6ca0dc",
        fillopacity: 0.4
    }
}).addTo(map);

fetch('http://127.0.0.1:3000/api/embung')
    .then(response => response.json())
    .then(data => {
        kawasanSHP.addData(data);
        var geojsonLayer = L.geoJSON(data.features, {
            onEachFeature: function (feature, layer) {
                layer.on('click', function () {
                    const content = `
                        <div class="popup-content">
                            <table border="1px">
                                <tr>
                                    <td colspan="2">
                                        <img src="${feature.properties.Image}" alt="${feature.properties.Name}" class="popup-image">
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <h2>${feature.properties.Name || "Tidak Ada Data"}</h2>
                                    </td>
                                    <td>
                                        <button id="navigate" class="btn btn-primary mt-2">
                                            <img src="/static/images/navigasi.avif" alt="Navigate">
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Luas</b></td>
                                    <td>: ${feature.properties.Luas_m2 || "Tidak Ada Data"} m²</td>
                                </tr>
                                <tr>
                                    <td><b>Kedalaman</b></td>
                                    <td>: ${feature.properties.Kedalaman_m || "Tidak Ada Data"} m</td>
                                </tr>
                                <tr>
                                    <td><b>Keliling</b></td>
                                    <td>: ${feature.properties.Keliling_m || "Tidak Ada Data"} m</td>
                                </tr>
                                <tr>
                                    <td><b>Kapasitas</b></td>
                                    <td>: ${feature.properties.Kapasitas_m3 || "Tidak Ada Data"} m³</td>
                                </tr>
                            </table>
                        </div>
                    `;
                    layer.bindPopup(content).openPopup();

                    layer.on('popupopen', () => {
                        const navigateButton = document.getElementById('navigate');
                        navigateButton.addEventListener('click', () => navigateToEmbung(feature));
                    });
                });
            }
        }).addTo(map);
    })
    .catch(error => console.error('Error fetching GeoJSON:', error));

function navigateToEmbung(feature) {
    if (!navigator.geolocation) {
        alert("Geolocation tidak didukung di browser Anda.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const userLatLng = [position.coords.latitude, position.coords.longitude];
            const embungLatLng = [
                feature.geometry.coordinates[1], // Latitude embung
                feature.geometry.coordinates[0]  // Longitude embung
            ];

            L.marker(userLatLng, { title: "Lokasi Anda" })
                .addTo(map)
                .bindPopup("Lokasi Anda").openPopup();

            L.Routing.control({
                waypoints: [
                    L.latLng(userLatLng),
                    L.latLng(embungLatLng)
                ],
                routeWhileDragging: true,
                router: L.Routing.osrmv1({
                    serviceUrl: 'https://router.project-osrm.org/route/v1'
                })
            }).addTo(map);
        },
        (error) => {
            alert("Gagal mendapatkan lokasi Anda.");
            console.error(error);
        }
    );
}


var baseMaps = {}