#!/usr/bin/env python3
"""
Verificación final del sistema de alertas
"""
import requests
import psycopg2
import psycopg2.extras

DB_CONFIG = {
    'host': '34.69.252.59',
    'database': 'metro',
    'user': 'postgres',
    'password': 'postgres',
    'port': 5432
}

def verificar_base_datos():
    """Verificar eventos en la base de datos"""
    print("="*70)
    print("1. VERIFICACIÓN DE BASE DE DATOS")
    print("="*70)
    
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        # Verificar tipo de columna severidad
        cur.execute("""
            SELECT data_type 
            FROM information_schema.columns 
            WHERE table_name='evento' AND column_name='severidad'
        """)
        tipo = cur.fetchone()['data_type']
        
        if tipo == 'integer':
            print(f"\n✅ Columna severidad: {tipo} (CORRECTO)")
        else:
            print(f"\n❌ Columna severidad: {tipo} (DEBE SER integer)")
            return False
        
        # Contar eventos
        cur.execute("""
            SELECT 
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE estampa_finalizacion IS NULL AND estampa_asignacion IS NULL) as activos,
                COUNT(*) FILTER (WHERE estampa_finalizacion IS NOT NULL) as finalizados
            FROM evento
        """)
        stats = cur.fetchone()
        
        print(f"✅ Total eventos: {stats['total']}")
        print(f"✅ Eventos activos: {stats['activos']}")
        print(f"✅ Eventos finalizados: {stats['finalizados']}")
        
        # Verificar que no haya eventos inválidos
        cur.execute("SELECT COUNT(*) as invalidos FROM evento WHERE id_sensor NOT LIKE 'L%_S%'")
        invalidos = cur.fetchone()['invalidos']
        
        if invalidos == 0:
            print(f"✅ Sin eventos inválidos")
        else:
            print(f"❌ {invalidos} eventos con sensor_id inválido")
            return False
        
        cur.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        return False

def verificar_api():
    """Verificar que la API esté funcionando"""
    print("\n" + "="*70)
    print("2. VERIFICACIÓN DE API")
    print("="*70)
    
    try:
        # Health check
        response = requests.get('http://localhost:5000/api/health', timeout=2)
        if response.status_code == 200:
            print("\n✅ API Health: OK")
        else:
            print(f"\n❌ API Health: Error {response.status_code}")
            return False
        
        # Eventos activos
        response = requests.get('http://localhost:5000/api/eventos?estado=activo', timeout=2)
        if response.status_code == 200:
            data = response.json()
            if data['success']:
                print(f"✅ API Eventos: {data['total']} eventos activos")
                
                # Mostrar algunos eventos
                if data['total'] > 0:
                    print("\n   Ejemplos de eventos activos:")
                    for evento in data['eventos'][:3]:
                        print(f"   - Evento #{evento['id']}: {evento['sensor_id']} (Línea {evento['linea']}) - Severidad {evento['nivel_severidad']}")
            else:
                print(f"❌ API Eventos: {data.get('error', 'Error desconocido')}")
                return False
        else:
            print(f"❌ API Eventos: Error {response.status_code}")
            return False
        
        # Estadísticas
        response = requests.get('http://localhost:5000/api/eventos/estadisticas', timeout=2)
        if response.status_code == 200:
            data = response.json()
            if data['success']:
                stats = data['estadisticas']
                print(f"✅ API Estadísticas:")
                print(f"   - Generadas: {stats['generadas']}")
                print(f"   - Pendientes: {stats['pendientes']}")
                print(f"   - Finalizadas: {stats['finalizadas']}")
                print(f"   - Críticas: {stats['alertas_criticas']}")
                print(f"   - Medias: {stats['alertas_medias']}")
                print(f"   - Bajas: {stats['alertas_bajas']}")
            else:
                print(f"❌ API Estadísticas: {data.get('error', 'Error desconocido')}")
                return False
        else:
            print(f"❌ API Estadísticas: Error {response.status_code}")
            return False
        
        return True
        
    except requests.exceptions.ConnectionError:
        print("\n❌ No se puede conectar a la API")
        print("   Ejecuta: python api_sensores.py")
        return False
    except Exception as e:
        print(f"\n❌ Error: {e}")
        return False

def verificar_servidor_web():
    """Verificar que el servidor web esté funcionando"""
    print("\n" + "="*70)
    print("3. VERIFICACIÓN DE SERVIDOR WEB")
    print("="*70)
    
    try:
        response = requests.get('http://localhost:8080/dashboard_v3.html', timeout=2)
        if response.status_code == 200:
            print("\n✅ Servidor Web: OK")
            print("✅ Dashboard accesible en: http://localhost:8080/dashboard_v3.html")
            return True
        else:
            print(f"\n❌ Servidor Web: Error {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("\n❌ Servidor web no está corriendo")
        print("   Ejecuta: python server.py")
        return False
    except Exception as e:
        print(f"\n❌ Error: {e}")
        return False

def main():
    print("\n" + "="*70)
    print("🔍 VERIFICACIÓN COMPLETA DEL SISTEMA DE ALERTAS")
    print("="*70)
    
    bd_ok = verificar_base_datos()
    api_ok = verificar_api()
    web_ok = verificar_servidor_web()
    
    print("\n" + "="*70)
    print("RESULTADO FINAL")
    print("="*70)
    
    if bd_ok and api_ok and web_ok:
        print("\n✅ ¡TODO FUNCIONANDO CORRECTAMENTE!")
        print("\n🎉 El sistema de alertas está operativo")
        print("\n📊 Abre el dashboard:")
        print("   http://localhost:8080/dashboard_v3.html")
        print("\n📝 Las alertas deberían mostrarse en el panel izquierdo")
        print("   bajo la sección '🚨 Alertas Pendientes'")
    else:
        print("\n❌ HAY PROBLEMAS:")
        if not bd_ok:
            print("   - Base de datos tiene errores")
        if not api_ok:
            print("   - API no está funcionando")
            print("     Ejecuta: python api_sensores.py")
        if not web_ok:
            print("   - Servidor web no está funcionando")
            print("     Ejecuta: python server.py")
    
    print("\n" + "="*70)

if __name__ == '__main__':
    main()
