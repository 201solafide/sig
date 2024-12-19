import json
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String
from geoalchemy2 import Geometry

# Koneksi ke database
engine = create_engine('postgresql://postgis:solafide1945@localhost:5432/sig')
connection = engine.connect()
metadata = MetaData()

# Buat tabel (jika belum ada)
embung = Table(
    'embung', metadata,
    Column('id', Integer, primary_key=True),
    Column('objectid', Integer),
    Column('oid', Integer),
    Column('name', String),
    Column('folder_path', String),
    Column('shape_leng', String),
    Column('shape_le_1', String),
    Column('shape_area', String),
    Column('keliling_m', String),
    Column('luas_m2', String),
    Column('geom', Geometry('MULTIPOLYGON', srid=4326))
)
metadata.create_all(engine)

# Baca file GeoJSON
with open("/static/data/embung_gis_baru1.geojson", "r") as file:
    geojson_data = json.load(file)

# Masukkan data
for feature in geojson_data['features']:
    connection.execute(
        embung.insert().values(
            objectid=feature['properties']['OBJECTID'],
            oid=feature['properties']['OID_'],
            name=feature['properties']['Name'],
            folder_path=feature['properties']['FolderPath'],
            shape_leng=feature['properties']['Shape_Leng'],
            shape_le_1=feature['properties']['Shape_Le_1'],
            shape_area=feature['properties']['Shape_Area'],
            keliling_m=feature['properties']['Keliling_m'],
            luas_m2=feature['properties']['Luas_m2'],
            geom=f"SRID=4326;{json.dumps(feature['geometry'])}"
        )
    )

print("Data berhasil dimasukkan!")
