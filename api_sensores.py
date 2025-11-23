from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2
import psycopg2.extras

app = Flask(__name__)
CORS(app)  # Permitir peticiones desde el dashboard

# Configuración de PostgreSQL
DB_CONFIG = {
    'host': '34.69.252.59',
    'database': 'metro',
    'user': 'postgres',
    'password': 'postgres',
    'port': 5432
}

def get_db_connection():
    return psycopg2.connect(**DB_CONFIG)

@app.route('/api/sensores', methods=['GET'])
def get_sensores():
    """Obtener todos los sensores"""
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        cur.execute("""
            SELECT sensor_id, linea, lat, lon, posicion_en_linea
            FROM sensores
            ORDER BY linea, sensor_id;
        """)
        
        sensores = cur.fetchall()
        cur.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'total': len(sensores),
            'sensores': sensores
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/sensores/<sensor_id>', methods=['GET'])
def get_sensor(sensor_id):
    """Obtener un sensor específico"""
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        cur.execute("""
            SELECT sensor_id, linea, lat, lon, posicion_en_linea
            FROM sensores
            WHERE sensor_id = %s;
        """, (sensor_id,))
        
        sensor = cur.fetchone()
        cur.close()
        conn.close()
        
        if sensor:
            return jsonify({
                'success': True,
                'sensor': sensor
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Sensor no encontrado'
            }), 404
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/sensores/linea/<linea>', methods=['GET'])
def get_sensores_by_linea(linea):
    """Obtener sensores de una línea específica"""
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        cur.execute("""
            SELECT sensor_id, linea, lat, lon, posicion_en_linea
            FROM sensores
            WHERE linea = %s
            ORDER BY sensor_id;
        """, (linea,))
        
        sensores = cur.fetchall()
        cur.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'linea': linea,
            'total': len(sensores),
            'sensores': sensores
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/eventos', methods=['GET'])
def get_eventos():
    """Obtener todos los eventos/alertas"""
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        # Obtener parámetros opcionales
        estado = request.args.get('estado')  # 'activo', 'asignado', 'finalizado'
        limit = request.args.get('limit', type=int)
        
        query = """
            SELECT 
                e.id,
                e.id_sensor as sensor_id,
                e.timestamp,
                e.severidad as nivel_severidad,
                e.estampa_asignacion,
                e.estampa_finalizacion,
                e.tiempo_atencion_minutos,
                s.linea,
                s.lat,
                s.lon,
                CASE 
                    WHEN e.estampa_finalizacion IS NOT NULL THEN 'finalizado'
                    WHEN e.estampa_asignacion IS NOT NULL THEN 'asignado'
                    ELSE 'activo'
                END as estado,
                EXTRACT(EPOCH FROM (COALESCE(e.estampa_finalizacion, NOW()) - e.timestamp))/60 as minutos_transcurridos
            FROM evento e
            LEFT JOIN sensores s ON e.id_sensor = s.sensor_id
        """
        
        conditions = []
        params = []
        
        if estado == 'activo':
            conditions.append("e.estampa_finalizacion IS NULL AND e.estampa_asignacion IS NULL")
        elif estado == 'asignado':
            conditions.append("e.estampa_asignacion IS NOT NULL AND e.estampa_finalizacion IS NULL")
        elif estado == 'finalizado':
            conditions.append("e.estampa_finalizacion IS NOT NULL")
        
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
        
        query += " ORDER BY e.timestamp DESC"
        
        if limit:
            query += f" LIMIT {limit}"
        
        cur.execute(query, params)
        eventos = cur.fetchall()
        cur.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'total': len(eventos),
            'eventos': eventos
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/eventos/estadisticas', methods=['GET'])
def get_estadisticas_eventos():
    """Obtener estadísticas de eventos/alertas"""
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        # Estadísticas generales
        cur.execute("""
            SELECT 
                COUNT(*) as total_generadas,
                COUNT(estampa_asignacion) as total_atendidas,
                COUNT(estampa_finalizacion) as total_finalizadas,
                COUNT(*) - COUNT(estampa_asignacion) as total_pendientes,
                COUNT(CASE WHEN estampa_asignacion IS NOT NULL AND estampa_finalizacion IS NULL THEN 1 END) as en_proceso,
                AVG(tiempo_atencion_minutos) FILTER (WHERE tiempo_atencion_minutos IS NOT NULL) as tiempo_promedio_atencion,
                COUNT(CASE WHEN severidad >= 3 THEN 1 END) as alertas_criticas,
                COUNT(CASE WHEN severidad = 2 THEN 1 END) as alertas_medias,
                COUNT(CASE WHEN severidad = 1 THEN 1 END) as alertas_bajas
            FROM evento;
        """)
        
        stats = cur.fetchone()
        
        # Estadísticas por línea
        cur.execute("""
            SELECT 
                s.linea,
                COUNT(*) as total_eventos,
                COUNT(e.estampa_finalizacion) as finalizados
            FROM evento e
            LEFT JOIN sensores s ON e.id_sensor = s.sensor_id
            WHERE s.linea IS NOT NULL
            GROUP BY s.linea
            ORDER BY s.linea;
        """)
        
        por_linea = cur.fetchall()
        
        cur.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'estadisticas': {
                'generadas': int(stats['total_generadas'] or 0),
                'atendidas': int(stats['total_atendidas'] or 0),
                'finalizadas': int(stats['total_finalizadas'] or 0),
                'pendientes': int(stats['total_pendientes'] or 0),
                'en_proceso': int(stats['en_proceso'] or 0),
                'tiempo_promedio_atencion': float(stats['tiempo_promedio_atencion'] or 0),
                'alertas_criticas': int(stats['alertas_criticas'] or 0),
                'alertas_medias': int(stats['alertas_medias'] or 0),
                'alertas_bajas': int(stats['alertas_bajas'] or 0),
                'por_linea': [dict(linea) for linea in por_linea]
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/eventos/crear', methods=['POST'])
def crear_evento():
    """Crear un nuevo evento/alerta"""
    try:
        data = request.get_json()
        sensor_id = data.get('sensor_id')
        timestamp = data.get('timestamp')
        
        if not sensor_id or not timestamp:
            return jsonify({
                'success': False,
                'error': 'sensor_id y timestamp son requeridos'
            }), 400
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("""
            INSERT INTO evento (id_sensor, timestamp)
            VALUES (%s, %s)
            RETURNING id;
        """, (sensor_id, timestamp))
        
        evento_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'evento_id': evento_id,
            'message': 'Evento creado exitosamente'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health():
    """Verificar que la API está funcionando"""
    return jsonify({
        'status': 'ok',
        'message': 'API de sensores funcionando correctamente'
    })

if __name__ == '__main__':
    import os
    
    print("="*60)
    print("API de Sensores - Metro CDMX")
    print("="*60)
    print("Endpoints disponibles:")
    print("  GET /api/sensores              - Todos los sensores")
    print("  GET /api/sensores/<id>         - Sensor específico")
    print("  GET /api/sensores/linea/<n>    - Sensores por línea")
    print("  GET /api/eventos               - Todos los eventos")
    print("  GET /api/eventos?estado=activo - Eventos activos")
    print("  GET /api/eventos/estadisticas  - Estadísticas de eventos")
    print("  POST /api/eventos/crear        - Crear nuevo evento")
    print("  GET /api/health                - Estado de la API")
    print("="*60)
    
    # Obtener puerto de variable de entorno (para Railway/Render) o usar 5000 por defecto
    port = int(os.environ.get('PORT', 5000))
    print(f"\nServidor corriendo en puerto {port}")
    print("Presiona Ctrl+C para detener\n")
    
    app.run(host='0.0.0.0', port=port, debug=False)
