#!/usr/bin/env python3
"""
Script para corregir completamente el sistema de alertas
"""
import psycopg2
import psycopg2.extras
from datetime import datetime

DB_CONFIG = {
    'host': '34.69.252.59',
    'database': 'metro',
    'user': 'postgres',
    'password': 'postgres',
    'port': 5432
}

def limpiar_eventos_invalidos():
    """Eliminar eventos con datos inválidos"""
    print("="*70)
    print("LIMPIANDO EVENTOS INVÁLIDOS")
    print("="*70)
    
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        # Eliminar eventos con sensor_id inválido (solo números)
        cur.execute("""
            DELETE FROM evento 
            WHERE id_sensor NOT LIKE 'L%_S%'
        """)
        eliminados = cur.rowcount
        print(f"\n✓ Eliminados {eliminados} eventos con sensor_id inválido")
        
        # Eliminar eventos con timestamps fuera de rango razonable (2020-2030)
        cur.execute("""
            DELETE FROM evento 
            WHERE timestamp < '2020-01-01' OR timestamp > '2030-12-31'
        """)
        eliminados_fecha = cur.rowcount
        print(f"✓ Eliminados {eliminados_fecha} eventos con fechas inválidas")
        
        conn.commit()
        cur.close()
        conn.close()
        
        print(f"\n✓ Limpieza completada")
        return True
        
    except Exception as e:
        print(f"\n✗ Error: {e}")
        return False

def corregir_columna_severidad():
    """Convertir severidad de texto a número"""
    print("\n" + "="*70)
    print("CORRIGIENDO COLUMNA SEVERIDAD")
    print("="*70)
    
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        # Verificar tipo actual
        cur.execute("""
            SELECT data_type 
            FROM information_schema.columns 
            WHERE table_name='evento' AND column_name='severidad'
        """)
        tipo_actual = cur.fetchone()[0]
        print(f"\nTipo actual de severidad: {tipo_actual}")
        
        if 'character' in tipo_actual or 'text' in tipo_actual:
            print("\n⚠ Severidad es texto, convirtiendo a entero...")
            
            # Actualizar valores de texto a número
            cur.execute("""
                UPDATE evento 
                SET severidad = CASE 
                    WHEN severidad IN ('alto', 'alta', 'critico', 'crítico', 'crítica') THEN '3'
                    WHEN severidad IN ('medio', 'media', 'moderado', 'moderada') THEN '2'
                    WHEN severidad IN ('bajo', 'baja', 'leve') THEN '1'
                    WHEN severidad IS NULL THEN '2'
                    WHEN severidad ~ '^[0-9]+$' THEN severidad
                    ELSE '2'
                END
            """)
            print(f"✓ Actualizados {cur.rowcount} registros")
            
            # Cambiar tipo de columna
            cur.execute("""
                ALTER TABLE evento 
                ALTER COLUMN severidad TYPE INTEGER 
                USING severidad::integer
            """)
            print("✓ Columna convertida a INTEGER")
            
            # Establecer valor por defecto
            cur.execute("""
                ALTER TABLE evento 
                ALTER COLUMN severidad SET DEFAULT 2
            """)
            print("✓ Valor por defecto establecido a 2")
            
        else:
            print("✓ Severidad ya es numérica")
        
        conn.commit()
        cur.close()
        conn.close()
        
        return True
        
    except Exception as e:
        print(f"\n✗ Error: {e}")
        return False

def crear_eventos_prueba():
    """Crear algunos eventos de prueba válidos"""
    print("\n" + "="*70)
    print("CREANDO EVENTOS DE PRUEBA")
    print("="*70)
    
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        # Obtener algunos sensores válidos
        cur.execute("SELECT sensor_id FROM sensores ORDER BY RANDOM() LIMIT 5")
        sensores = [row[0] for row in cur.fetchall()]
        
        if not sensores:
            print("\n✗ No hay sensores en la base de datos")
            return False
        
        # Crear eventos de prueba
        eventos_creados = 0
        for i, sensor_id in enumerate(sensores):
            severidad = (i % 3) + 1  # 1, 2, o 3
            cur.execute("""
                INSERT INTO evento (id_sensor, timestamp, severidad)
                VALUES (%s, NOW() - INTERVAL '%s minutes', %s)
            """, (sensor_id, i * 10, severidad))
            eventos_creados += 1
        
        conn.commit()
        print(f"\n✓ Creados {eventos_creados} eventos de prueba")
        
        # Mostrar los eventos creados
        cur.execute("""
            SELECT e.id, e.id_sensor, e.severidad, s.linea, e.timestamp
            FROM evento e
            LEFT JOIN sensores s ON e.id_sensor = s.sensor_id
            ORDER BY e.id DESC
            LIMIT 5
        """)
        
        print("\nÚltimos eventos creados:")
        for row in cur.fetchall():
            print(f"  #{row[0]}: {row[1]} (Línea {row[3]}) - Severidad {row[2]}")
        
        cur.close()
        conn.close()
        
        return True
        
    except Exception as e:
        print(f"\n✗ Error: {e}")
        return False

def verificar_api_corregida():
    """Verificar que la API funcione correctamente"""
    print("\n" + "="*70)
    print("VERIFICANDO API")
    print("="*70)
    
    try:
        import requests
        
        # Verificar health
        response = requests.get('http://localhost:5000/api/health', timeout=2)
        if response.status_code == 200:
            print("\n✓ API health: OK")
        
        # Verificar eventos
        response = requests.get('http://localhost:5000/api/eventos?estado=activo', timeout=2)
        if response.status_code == 200:
            data = response.json()
            if data['success']:
                print(f"✓ API eventos: {data['total']} eventos activos")
            else:
                print(f"✗ API eventos: {data.get('error', 'Error desconocido')}")
        
        # Verificar estadísticas
        response = requests.get('http://localhost:5000/api/eventos/estadisticas', timeout=2)
        if response.status_code == 200:
            data = response.json()
            if data['success']:
                stats = data['estadisticas']
                print(f"✓ API estadísticas:")
                print(f"  - Generadas: {stats['generadas']}")
                print(f"  - Pendientes: {stats['pendientes']}")
                print(f"  - Finalizadas: {stats['finalizadas']}")
        
        return True
        
    except Exception as e:
        print(f"\n✗ API no está corriendo")
        print(f"  Error: {e}")
        print("\n  SOLUCIÓN: Ejecuta en otra terminal:")
        print("  python api_sensores.py")
        return False

def main():
    print("\n🔧 CORRECCIÓN COMPLETA DEL SISTEMA DE ALERTAS\n")
    
    # Paso 1: Limpiar eventos inválidos
    if not limpiar_eventos_invalidos():
        print("\n✗ Error en limpieza, abortando")
        return
    
    # Paso 2: Corregir columna severidad
    if not corregir_columna_severidad():
        print("\n✗ Error corrigiendo severidad, abortando")
        return
    
    # Paso 3: Crear eventos de prueba
    if not crear_eventos_prueba():
        print("\n⚠ No se pudieron crear eventos de prueba")
    
    # Paso 4: Verificar API
    api_ok = verificar_api_corregida()
    
    # Resumen final
    print("\n" + "="*70)
    print("RESUMEN FINAL")
    print("="*70)
    
    if api_ok:
        print("\n✓ Sistema corregido y funcionando")
        print("\n  Abre el dashboard:")
        print("  http://localhost:8000/dashboard_v3.html")
    else:
        print("\n✓ Base de datos corregida")
        print("\n  SIGUIENTE PASO:")
        print("  1. Abre una nueva terminal")
        print("  2. Ejecuta: python api_sensores.py")
        print("  3. Abre el dashboard: http://localhost:8000/dashboard_v3.html")
    
    print("\n" + "="*70)

if __name__ == '__main__':
    main()
