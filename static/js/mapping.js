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
            // interactive: true,
            onEachFeature: function (feature, layer) {
                // console.log(feature); // Lihat struktur feature
                // console.log(feature.properties); // Pastikan properties ada
                // console.log(feature.properties.Keliling_m); // Pastikan properties ada
                // const imageUrl = feature.properties.Image || '/static/img/default.jpg';
                // const name = feature.properties.Name || 'Tidak ada data';
                // const luas = feature.properties.Luas_m2 || 'Tidak ada data';
                // const kedalaman = feature.properties.Kedalaman_m || 'Tidak ada data';
                // const keliling = feature.properties.Keliling_m || 'Tidak ada data';
                // const kapasitas = feature.properties.Kapasitas_m3 || 'Tidak ada data';

                // const popupContent = `
                //     <div class="popup-container">
                //         <img class="popup-image" src="${imageUrl}" alt="${name}">
                //         <div class="popup-heade">${name}</div>
                //         <div class="popup-details>
                //             <b>Luas:</b> ${luas || "Tidak Ada Data"} m²<br>
                //             <b>Kedalaman:</b> ${kedalaman || "Tidak ada Data"} m <br>
                //             <b>Keliling:</b> ${keliling || "Tidak Ada Data"} m <br>
                //             <b>Kapasitas:</b> ${kapasitas || "Tidak ada Data"} m3 <br>
                //         </div>

                //     </div>
                // `;
                // layer.bindPopup(popupContent);
                layer.on('click', function () {
                    const content = `
                        <div class="popup-content">
                            <table>
                                <tr>
                                    <td colspan="2"><img src="${feature.properties.Image}" alt="${feature.properties.Name}" class="popup-image"></td>
                                </tr>
                                <tr>
                                    <td><h2>${feature.properties.Name || "Tidak Ada Data"}</h2></td>
                                    <td><button id="navigate=${feature.properties.Name}" class="btn btn-primary mt-2"><img src="/static/images/navigasi.avif" alt=""></button></td>
                                </tr>
                                <tr>
                                    <td><p><b>Luas</b> </td>
                                    <td>: ${feature.properties.Luas_m2 || "Tidak Ada Data"} m²</p></td>
                                </tr>
                                <tr>
                                    <td><p><b>Kedalaman</b> </td>
                                    <td>: ${feature.properties.Kedalaman_m || "Tidak Ada Data"} m</p></td>
                                </tr>
                                <tr>
                                    <td><p><b>Keliling</b> </td>
                                    <td>: ${feature.properties.Keliling_m || "Tidak Ada Data"} m</p></td>
                                </tr>
                                <tr>
                                    <td><p><b>Kapasitas</b> </td>
                                    <td>: ${feature.properties.Kapasitas_m3 || "Tidak Ada Data"} m³</p></td>
                                </tr>
                            </table>
                        </div>
                    `;
                    // menambahkan konten ke pop up
                    layer.bindPopup(content);

                    document.getElementById('sidebar').innerHTML = content;
                    
                    // tambahan animasi
                    const sidebar = document.getElementById('sidebar')
                    document.getElementById('sidebar').classList.add('active');
                    sidebar.innerHTML += `<button id="close-sidebar"><img src="/static/images/close.png" alt="X"></button>`;
                    // sidebar.innerHTML += `<button id="close-sidebar">tutup</button>`;
                    document.getElementById('close-sidebar').addEventListener('click', () => {
                        sidebar.classList.remove('active');
                    });
                    //  masukkan konetc
                    // layer.on('popupopen', () => {
                    //     const navigateButton = document.getElementById(`Rute (<i>navigate</>) - ${feature.properties.Name}`);
                    //     navigateButton.addEventListener('click', () => navigateToEmbung(feature));
                    // });
                    document.getElementById(`navigate-${feature.properties.Name}`).addEventListener('click', () => {
                        navigateToEmbung(feature);
                    });
                });
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

    })
    .catch(error => console.error('Error fetching GeoJSON:', error));

function navigateToEmbung(feature){
    if (!navigator.geolocation){
        alert("geolocation tidak didukung di browser");
        return;
    }
    // ambil lokasi pengguna
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const userLatLng = [position.coords.latitude, position.coords.longitude];
            const embungLatLng = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];

            // marker lokasi
            L.marker(userLatLng, {title: "lokasi anda"}).addTo(map)
                .bindPopup("Lokasi anda").openPopup();
            
            // routing ke peta
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
            alert("Gagal mendapatkan lokasi");
            console.error(error);
        }
    );
}
