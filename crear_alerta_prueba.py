#!/usr/bin/env python3
"""
Script para crear una alerta de prueba y verificar que aparezca en el dashboard
"""
import requests
import psycopg2
import psycopg2.extras
from datetime import datetime
import time

DB_CONFIG = {
    'host': '34.69.252.59',
    'database': 'metro',
    'user': 'postgres',
    'password': 'postgres',
    'port': 5432
}

API_URL = 'http://localhost:5000/api'

def obtener_sensor_aleatorio():
    """Obtener un sensor aleatorio de la base de datos"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        cur.execute("""
            SELECT sensor_id, linea 
            FROM sensores 
            ORDER BY RANDOM() 
            LIMIT 1
        """)
        
        sensor = cur.fetchone()
        cur.close()
        conn.close()
        
        return sensor
        
    except Exception as e:
        print(f"Error: {e}")
        return None

def crear_alerta_db(sensor_id, severidad=2):
    """Crear una alerta directamente en la base de datos"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        cur.execute("""
            INSERT INTO evento (id_sensor, timestamp, severidad)
            VALUES (%s, NOW(), %s)
            RETURNING id
        """, (sensor_id, severidad))
        
        evento_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        
        return evento_id
        
    except Exception as e:
        print(f"Error: {e}")
        return None

def verificar_alerta_api(evento_id):
    """Verificar que la alerta aparezca en la API"""
    try:
        response = requests.get(f'{API_URL}/eventos?estado=activo', timeout=2)
        if response.status_code == 200:
            data = response.json()
            if data['success']:
                # Buscar el evento en la lista
                for evento in data['eventos']:
                    if evento['id'] == evento_id:
                        return evento
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None

def main():
    print("\n" + "="*70)
    print("🧪 PRUEBA DE CREACIÓN DE ALERTA EN TIEMPO REAL")
    print("="*70)
    
    # Paso 1: Obtener sensor aleatorio
    print("\n1. Obteniendo sensor aleatorio...")
    sensor = obtener_sensor_aleatorio()
    
    if not sensor:
        print("❌ No se pudo obtener un sensor")
        return
    
    print(f"✅ Sensor seleccionado: {sensor['sensor_id']} (Línea {sensor['linea']})")
    
    # Paso 2: Crear alerta
    print("\n2. Creando alerta en la base de datos...")
    severidad = 3  # Alta
    evento_id = crear_alerta_db(sensor['sensor_id'], severidad)
    
    if not evento_id:
        print("❌ No se pudo crear la alerta")
        return
    
    print(f"✅ Alerta creada: Evento #{evento_id}")
    print(f"   Sensor: {sensor['sensor_id']}")
    print(f"   Línea: {sensor['linea']}")
    print(f"   Severidad: {severidad} (Alta/Crítica)")
    print(f"   Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Paso 3: Verificar en la API
    print("\n3. Verificando que aparezca en la API...")
    time.sleep(1)  # Esperar un segundo
    
    evento = verificar_alerta_api(evento_id)
    
    if evento:
        print(f"✅ Alerta visible en la API:")
        print(f"   ID: {evento['id']}")
        print(f"   Sensor: {evento['sensor_id']}")
        print(f"   Línea: {evento['linea']}")
        print(f"   Severidad: {evento['nivel_severidad']}")
        print(f"   Estado: {evento['estado']}")
    else:
        print("⚠️  Alerta no encontrada en la API (puede tardar unos segundos)")
    
    # Paso 4: Instrucciones para ver en el dashboard
    print("\n" + "="*70)
    print("📊 CÓMO VER LA ALERTA EN EL DASHBOARD")
    print("="*70)
    print("\n1. Abre el dashboard:")
    print("   http://localhost:8080/dashboard_v3.html")
    print("\n2. Busca en el panel izquierdo, sección '🚨 Alertas Pendientes'")
    print(f"\n3. Deberías ver una nueva alerta:")
    print(f"   ┌─────────────────────────────────┐")
    print(f"   │ {sensor['sensor_id']:<20s} 0 min       │")
    print(f"   │ 📍 Línea {sensor['linea']:<18s}│")
    print(f"   │ 🚨 Evento #{evento_id} - ACTIVO{' '*(10-len(str(evento_id)))}│")
    print(f"   └─────────────────────────────────┘")
    print(f"   Con borde ROJO (severidad alta)")
    
    print("\n4. Si no aparece inmediatamente:")
    print("   - Espera 30 segundos (auto-actualización)")
    print("   - O recarga la página (F5)")
    
    print("\n5. Click en la alerta para:")
    print("   - Ver detalles del sensor en el panel derecho")
    print("   - Hacer zoom al sensor en el mapa")
    
    print("\n" + "="*70)
    print("✅ ALERTA DE PRUEBA CREADA EXITOSAMENTE")
    print("="*70)
    
    # Mostrar estadísticas actualizadas
    try:
        response = requests.get(f'{API_URL}/eventos/estadisticas', timeout=2)
        if response.status_code == 200:
            data = response.json()
            if data['success']:
                stats = data['estadisticas']
                print("\n📊 Estadísticas actualizadas:")
                print(f"   Total generadas: {stats['generadas']}")
                print(f"   Pendientes: {stats['pendientes']}")
                print(f"   Críticas: {stats['alertas_criticas']}")
    except:
        pass
    
    print("\n" + "="*70)

if __name__ == '__main__':
    main()
