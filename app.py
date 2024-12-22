from flask import Flask, jsonify, render_template
import psycopg2

app = Flask(__name__)

try:
    conn = psycopg2.connect(
        dbname="sig",
        user="postgres",
        password="solafide1945",
        host="localhost",
        port="5432"
    )
    print("Konek")

except Exception as e:
    print(f"lost: {e}")

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

        # ambil data embung format json
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
                            'Kapasitas_m3', Kapasitas_m3
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
    app.run(debug=True, port=3000)