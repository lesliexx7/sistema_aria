--- Este es el código para generar los datos que alimentan al modelo predictivo de AWS.

import pandas as pd
import numpy as np
import random
import psycopg2
from datetime import datetime, timedelta


def cargar_sensores_desde_bd():
    """Carga los sensores reales desde PostgreSQL"""
    print("Conectando a la base de datos...")
    conn = psycopg2.connect(
        host="34.69.252.59",
        database="metro",
        user="postgres",
        password="postgres"
    )
    
    cursor = conn.cursor()
    cursor.execute("SELECT sensor_id, linea, lat, lon, posicion_en_linea FROM sensores ORDER BY linea, posicion_en_linea")
    sensores = cursor.fetchall()
    
    df_sensores = pd.DataFrame(sensores, columns=['sensor_id', 'linea', 'lat', 'lon', 'posicion_en_linea'])
    
    cursor.close()
    conn.close()
    
    print(f"{len(df_sensores)} sensores cargados desde la BD")
    return df_sensores

# Mapeo de líneas de BD a perfiles de riesgo
PERFIL_POR_LINEA = {
    '1': 'renovada',
    '2': 'alta_afluencia',
    '3': 'critica_antigua',
    '4': 'baja_afluencia',
    '5': 'superficie_moderada',
    '6': 'moderada',
    '7': 'profunda',
    '8': 'alta_afluencia',
    '9': 'critica_saturada',
    '10': 'ferrea_superficie',  # Línea A
    '11': 'ferrea_superficie',  # Línea B
    '12': 'moderna_vigilada'
}

# Tipos de Falla ponderados por probabilidad
CAUSAS_FALLA = {
    'renovada': [
        ('Ajuste de Señalización (CBTC)', 0.4),
        ('Bloqueo de Puertas', 0.3),
        ('Objeto en Vias', 0.2),
        ('Falla Electrica', 0.1)
    ],
    'critica_antigua': [
        ('Zapatas Pegadas/Humo', 0.3),
        ('Falla de Pilotaje', 0.2),
        ('Corte de Corriente', 0.2),
        ('Puertas Descompuestas', 0.2),
        ('Tren Averiado', 0.1)
    ],
    'critica_saturada': [
        ('Zapatas Pegadas/Humo', 0.25),
        ('Falla de Pilotaje', 0.2),
        ('Corte de Corriente', 0.2),
        ('Puertas Descompuestas', 0.2),
        ('Tren Averiado', 0.15)
    ],
    'ferrea_superficie': [
        ('Marcha de Seguridad (Lluvia)', 0.4),
        ('Falla en Catenaria', 0.2),
        ('Inundación de Vías', 0.2),
        ('Objeto en Vias', 0.2)
    ],
    'profunda': [
        ('Falla Escaleras/Acceso', 0.3),
        ('Filtración de Agua', 0.3),
        ('Tren Averiado', 0.2),
        ('Alta Afluencia', 0.2)
    ],
    'alta_afluencia': [
        ('Palanca de Emergencia', 0.4),
        ('Dosificación de Usuarios', 0.3),
        ('Puertas forzadas', 0.2),
        ('Falla Electrica', 0.1)
    ],
    'moderna_vigilada': [
        ('Revisión de Protocolo', 0.5),
        ('Objeto en Vias', 0.3),
        ('Falla de Energía', 0.2)
    ],
    'moderada': [
        ('Retraso General', 0.5),
        ('Falla Mecánica', 0.5)
    ],
    'baja_afluencia': [
        ('Retraso de Tren', 0.8),
        ('Falla Electrica', 0.2)
    ],
    'superficie_moderada': [
        ('Marcha Lenta Lluvia', 0.5),
        ('Objeto en Vias', 0.5)
    ]
}

def obtener_clima(fecha):
    """Simula clima CDMX: Lluvia fuerte de Junio a Septiembre en las tardes."""
    mes = fecha.month
    hora = fecha.hour
    
    es_temporada_lluvia = 6 <= mes <= 9
    es_tarde = 16 <= hora <= 21
    
    if es_temporada_lluvia and es_tarde:
        return np.random.choice(['Lluvia Ligera', 'Tormenta', 'Nublado'], p=[0.4, 0.3, 0.3])
    elif es_temporada_lluvia:
        return np.random.choice(['Despejado', 'Lluvia Ligera'], p=[0.8, 0.2])
    else:
        return 'Despejado'

def es_hora_pico(fecha):
    """Horarios de saturación real CDMX."""
    h = fecha.hour
    dia = fecha.weekday()
    
    if dia >= 5:
        return False  
    
    mañana = 6 <= h <= 9
    tarde = 17 <= h <= 20
    return mañana or tarde

def convertir_severidad(severity_num):
    """Convierte severidad numérica a texto"""
    if severity_num == 0:
        return 'Bajo'
    elif severity_num == 1:
        return 'Medio'
    elif severity_num == 2:
        return 'Alto'
    else:
        return 'Critico'

def generar_historial():
    print("="*60)
    print("GENERADOR DE HISTORIAL METRO CDMX CON SENSORES REALES")
    print("="*60)
    
    # Cargar sensores desde BD
    df_sensores = cargar_sensores_desde_bd()
    
    # Agrupar sensores por línea
    sensores_por_linea = df_sensores.groupby('linea')['sensor_id'].apply(list).to_dict()
    
    print(f"\n📊 Líneas disponibles: {list(sensores_por_linea.keys())}")
    
    fecha_inicio = datetime(2025, 1, 1)
    fecha_fin = datetime.now()
    diferencia = fecha_fin - fecha_inicio
    horas_totales = int(diferencia.total_seconds() / 3600)
    
    print(f"Generando datos desde {fecha_inicio.date()} hasta {fecha_fin.date()}")
    print(f" Total de horas a simular: {horas_totales}")
    print("\n Procesando...")
    
    dataset = []
    
    for i in range(horas_totales):
        if i % 1000 == 0:
            print(f"  Progreso: {i}/{horas_totales} horas ({(i/horas_totales)*100:.1f}%)")
        
        fecha_actual = fecha_inicio + timedelta(hours=i)
        clima = obtener_clima(fecha_actual)
        hora_pico = es_hora_pico(fecha_actual)
        
    
        for linea, sensores in sensores_por_linea.items():
            perfil = PERFIL_POR_LINEA.get(linea, 'moderada')
            
# --- PROBABILIDAD BASE DE FALLA ---
            prob_falla = 0.01  # 1% base por hora
            
            
            if perfil in ['critica_antigua', 'critica_saturada', 'ferrea_superficie']:
                prob_falla += 0.04
            
            if perfil == 'renovada':
                prob_falla += 0.015
            
            
            if hora_pico:
                prob_falla *= 2.5
            
            if clima == 'Tormenta' and perfil in ['ferrea_superficie', 'superficie_moderada']:
                prob_falla *= 4.0
                
# --- SIMULACIÓN DEL EVENTO ---
            if random.random() < prob_falla:
                # ¡Hubo falla en un sensor!
                sensor_id = random.choice(sensores)
                causas = CAUSAS_FALLA[perfil]
                tipo_falla = random.choices([c[0] for c in causas], weights=[c[1] for c in causas])[0]
                
                # Calcular duración y severidad
                duracion = random.randint(5, 15)
                severity_num = 1
                
                if tipo_falla in ['Zapatas Pegadas/Humo', 'Inundación de Vías', 'Falla de Energía', 'Tren Averiado']:
                    duracion = random.randint(30, 90)
                    severity_num = 3
                elif tipo_falla in ['Corte de Corriente', 'Falla en Catenaria', 'Filtración de Agua']:
                    duracion = random.randint(20, 45)
                    severity_num = 2
                elif tipo_falla in ['Bloqueo de Puertas', 'Palanca de Emergencia', 'Dosificación de Usuarios']:
                    duracion = random.randint(10, 25)
                    severity_num = 1
                
               
                nombre_linea = 'LA' if linea == '10' else 'LB' if linea == '11' else f'L{linea}'
                
                dataset.append({
                    'fecha': fecha_actual.strftime('%Y-%m-%d'),
                    'hora': fecha_actual.hour,
                    'dia_semana': fecha_actual.strftime('%A'),
                    'linea': nombre_linea,
                    'sensor_id': sensor_id,
                    'tipo_falla': tipo_falla,
                    'clima': clima,
                    'es_hora_pico': 1 if hora_pico else 0,
                    'duracion_retraso_min': duracion,
                    'severidad': convertir_severidad(severity_num),
                    'target_falla': 1
                })
            else:
                # Generar datos "sanos" (Sin falla) para balancear el modelo
                if random.random() < 0.015:
                    sensor_id = random.choice(sensores)
                    
                    nombre_linea = 'LA' if linea == '10' else 'LB' if linea == '11' else f'L{linea}'
                    
                    dataset.append({
                        'fecha': fecha_actual.strftime('%Y-%m-%d'),
                        'hora': fecha_actual.hour,
                        'dia_semana': fecha_actual.strftime('%A'),
                        'linea': nombre_linea,
                        'sensor_id': sensor_id,
                        'tipo_falla': 'Operacion Normal',
                        'clima': clima,
                        'es_hora_pico': 1 if hora_pico else 0,
                        'duracion_retraso_min': 0,
                        'severidad': 'Bajo',
                        'target_falla': 0
                    })

    df = pd.DataFrame(dataset)
    
    # Guardar la infromacion el CSV 
    archivo_salida = 'historial_metro_sensores_2025.csv'
    df.to_csv(archivo_salida, index=False, encoding='utf-8-sig')
    
    print("\n" + "="*60)
    print(" ¡GENERACIÓN COMPLETADA!")
    print("="*60)
    print(f" Total de registros: {len(df)}")
    print(f"Fallas detectadas: {df[df['target_falla']==1].shape[0]}")
    print(f"Operación normal: {df[df['target_falla']==0].shape[0]}")
    print(f"Archivo guardado: {archivo_salida}")
    print("\nEjemplo de datos:")
    print(df.head(10))
    print("\nDistribución de severidad:")
    print(df['severidad'].value_counts())
    print("\nDistribución por línea:")
    print(df['linea'].value_counts().sort_index())

if __name__ == "__main__":
    generar_historial()



-- Este el código que genera los escenarios de 14 días en el futuro que se van a procesar en modelo de predicción para poder crear un resultado de fallas posibles en el futuro.


import pandas as pd
from datetime import datetime, timedelta
import numpy as np
import os

print("--- GENERANDO PROYECCIÓN 14 DÍAS  ---")

archivo_historial = 'historial_metro_sensores_2025.csv'
if not os.path.exists(archivo_historial):
    print(f"ERROR: No encuentro '{archivo_historial}'.")
    exit()
try:
    df_historia = pd.read_csv(archivo_historial)
    sensores_unicos = df_historia[['linea', 'sensor_id']].drop_duplicates()
    print(f"Sensores base cargados: {len(sensores_unicos)}")
except Exception as e:
    print(f"Error leyendo historial: {e}")
    exit()

DIAS_A_PROYECTAR = 14
HORAS_OPERATIVAS = range(6, 24) 
datos_proyeccion = []
fecha_inicio = datetime.now().date() + timedelta(days=1)

print("Generando filas y agregando columnas de compatibilidad...")


for dia in range(DIAS_A_PROYECTAR):
    fecha_actual = fecha_inicio + timedelta(days=dia)
    nombre_dia = fecha_actual.strftime('%A')
    prob_lluvia = 0.3
    
    for hora in HORAS_OPERATIVAS:
       
        es_pico = 1 if (7 <= hora <= 9) or (18 <= hora <= 21) else 0
        clima = 'Despejado'
        if 17 <= hora <= 22 and np.random.random() < prob_lluvia:
            clima = 'Lluvia Ligera'
            if np.random.random() < 0.3: clima = 'Tormenta'
            
        for _, row in sensores_unicos.iterrows():
            datos_proyeccion.append({
                # --- DATOS REALES PARA PREDECIR ---
                'fecha': fecha_actual,
                'hora': hora,
                'dia_semana': nombre_dia,
                'linea': row['linea'],
                'sensor_id': row['sensor_id'],
                'clima': clima,
                'es_hora_pico': es_pico,
                
                
                'tipo_falla': 'Por Determinar',  
                'duracion_retraso_min': 0,       
                'severidad': 'Desconocida',     
                'target_falla': None             
            })


df_final = pd.DataFrame(datos_proyeccion)
nombre_archivo = 'proyeccion_compatible_final.csv'
df_final.to_csv(nombre_archivo, index=False)

print(f"\n ¡LISTO! Archivo generado: {nombre_archivo}")
print(f" Total filas: {len(df_final)}")
print(" Sube ESTE archivo a AWS Canvas. Ahora sí coinciden todas las columnas.")



-- Esto nos ayuda a filtrar el resultado de procesar los datos a traves de el modelo de precisión para poder obtener solo los resultados que superen el 90% de posibilidad de fallar.

import pandas as pd
import mysql.connector
from datetime import datetime

# Configuración de la base de datos
DB_CONFIG = {
    'host': 'localhost',
    'user': 'tu_usuario',
    'password': 'tu_password',
    'database': 'tu_base_de_datos'
}

def conectar_db():
    """Establece conexión con la base de datos"""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        print("✓ Conexión exitosa a la base de datos")
        return conn
    except mysql.connector.Error as err:
        print(f"✗ Error de conexión: {err}")
        return None

def cargar_csv_a_sql(archivo_csv, tabla='alertas_criticas'):
    """Carga datos del CSV a la tabla SQL"""
    
    # Leer CSV
    print(f"\nLeyendo archivo: {archivo_csv}")
    df = pd.read_csv(archivo_csv)
    print(f"✓ {len(df)} registros encontrados")
    
    # Conectar a la base de datos
    conn = conectar_db()
    if not conn:
        return
    
    cursor = conn.cursor()
    
    # Query de inserción
    insert_query = f"""
    INSERT INTO {tabla} 
    (target_falla, fecha, hora, dia_semana, linea, sensor_id, 
     clima, es_hora_pico, tipo_falla, duracion_retraso_min, severidad)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    
    # Insertar datos en lotes
    registros_insertados = 0
    errores = 0
    
    print("\nInsertando datos...")
    for index, row in df.iterrows():
        try:
            valores = (
                float(row['target_falla']),
                row['fecha'],
                int(row['hora']),
                row['dia_semana'],
                row['linea'],
                row['sensor_id'],
                row['clima'],
                int(row['es_hora_pico']),
                row['tipo_falla'],
                int(row['duracion_retraso_min']),
                row['severidad']
            )
            
            cursor.execute(insert_query, valores)
            registros_insertados += 1
            
            # Commit cada 100 registros
            if registros_insertados % 100 == 0:
                conn.commit()
                print(f"  Procesados: {registros_insertados}/{len(df)}")
                
        except Exception as e:
            errores += 1
            print(f"✗ Error en fila {index}: {e}")
    
    # Commit final
    conn.commit()
    
    print(f"\n{'='*50}")
    print(f"✓ Registros insertados: {registros_insertados}")
    print(f"✗ Errores: {errores}")
    print(f"{'='*50}")
    
    # Cerrar conexión
    cursor.close()
    conn.close()
    print("\n✓ Conexión cerrada")

if __name__ == "__main__":
    # Ejecutar carga
    cargar_csv_a_sql('todas_alertas_criticas_90.csv')



