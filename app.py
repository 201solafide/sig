from flask import Flask, jsonify, render_template
import psycopg2
import os
from dotenv import load_dotenv
from waitress import serve

# Memuat variabel lingkungan dari file .env
load_dotenv()

# Membaca variabel lingkungan
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")

app = Flask(__name__)

# Koneksi ke database PostgreSQL menggunakan psycopg2
try:
    conn = psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )
    print("Koneksi ke database berhasil!")

except Exception as e:
    print(f"Terjadi kesalahan saat koneksi ke database: {e}")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/map')
def map_page():
    return render_template('map.html')

@app.route('/api/embung', methods=['GET'])
def get_embung():
    try:
        cursor = conn.cursor()

        # Query untuk mengambil data embung dalam format GeoJSON
        cursor.execute("""
            SELECT jsonb_build_object(
                'type', 'FeatureCollection',
                'features', jsonb_agg(
                    jsonb_build_object(
                        'type', 'Feature',
                        'geometry', ST_AsGeoJSON(ST_Transform(geom, 4326))::jsonb,
                        'properties', jsonb_build_object(
                            'OBJECTID', OBJECTID,
                            'OID_', OID_,
                            'Name', Name,
                            'FolderPath', FolderPath,
                            'Shape_Leng', Shape_Leng,
                            'Shape_Le_1', Shape_Le_1,
                            'Shape_Area', Shape_Area,
                            'Keliling_m', Keliling_m,
                            'Luas_m2', Luas_m2,
                            'Kedalaman_m', Kedalaman_m,
                            'Kapasitas_m3', Kapasitas_m3,
                            'Image', Image
                        )
                    )
                )
            )
            FROM embung_arsy;
        """)
        result = cursor.fetchone()[0]
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    # Menggunakan Waitress untuk menjalankan aplikasi
    serve(app, host='0.0.0.0', port=3000)
