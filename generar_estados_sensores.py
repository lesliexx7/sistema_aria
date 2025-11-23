import json
import random
from datetime import datetime, timedelta

print("Generando estados simulados para sensores...")

# Cargar sensores existentes
with open('sensores_metro.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Estados posibles
estados = ['operativo', 'falla', 'advertencia', 'mantenimiento']
probabilidades = [0.85, 0.05, 0.08, 0.02]  # 85% operativo, 5% falla, 8% advertencia, 2% mantenimiento

# Tipos de fallas/advertencias
tipos_falla = [
    'Pérdida de señal GPS',
    'Batería baja',
    'Sensor desalineado',
    'Interferencia electromagnética',
    'Temperatura anormal',
    'Comunicación intermitente',
    'Calibración requerida',
    'Hardware degradado'
]

# Generar estados para cada sensor
sensores_con_estado = []
alertas_activas = []
contador_fallas = 0
contador_advertencias = 0

for linea_data in data['lineas']:
    linea_num = linea_data['linea']
    
    for sensor in linea_data['sensores']:
        estado = random.choices(estados, probabilidades)[0]
        
        sensor_info = {
            'sensor_id': sensor['sensor_id'],
            'linea': sensor['linea'],
            'lat': sensor['lat'],
            'lon': sensor['lon'],
            'posicion_en_linea': sensor['posicion_en_linea'],
            'estado': estado,
            'ultima_actualizacion': datetime.now().isoformat(),
            'tiempo_operacion': random.randint(100, 10000),  # horas
            'nivel_bateria': random.randint(20, 100) if estado != 'falla' else random.randint(0, 30),
            'calidad_señal': random.randint(60, 100) if estado == 'operativo' else random.randint(0, 70),
            'temperatura': round(random.uniform(15, 35), 1)
        }
        
        # Si hay falla o advertencia, agregar detalles
        if estado in ['falla', 'advertencia']:
            tipo_problema = random.choice(tipos_falla)
            tiempo_deteccion = datetime.now() - timedelta(minutes=random.randint(1, 60))
            
            sensor_info['tipo_problema'] = tipo_problema
            sensor_info['tiempo_deteccion'] = tiempo_deteccion.isoformat()
            sensor_info['prioridad'] = 'alta' if estado == 'falla' else 'media'
            
            # Agregar a alertas activas
            alertas_activas.append({
                'id': f"ALERT_{len(alertas_activas) + 1:04d}",
                'sensor_id': sensor['sensor_id'],
                'linea': sensor['linea'],
                'tipo': estado,
                'problema': tipo_problema,
                'tiempo_deteccion': tiempo_deteccion.isoformat(),
                'tiempo_transcurrido_min': (datetime.now() - tiempo_deteccion).seconds // 60,
                'lat': sensor['lat'],
                'lon': sensor['lon'],
                'prioridad': 'alta' if estado == 'falla' else 'media',
                'estado_resolucion': 'pendiente'
            })
            
            if estado == 'falla':
                contador_fallas += 1
            else:
                contador_advertencias += 1
        
        sensores_con_estado.append(sensor_info)

# Ordenar alertas por prioridad y tiempo
alertas_activas.sort(key=lambda x: (0 if x['prioridad'] == 'alta' else 1, x['tiempo_deteccion']))

# Crear estructura final
resultado = {
    'timestamp': datetime.now().isoformat(),
    'resumen': {
        'total_sensores': len(sensores_con_estado),
        'operativos': sum(1 for s in sensores_con_estado if s['estado'] == 'operativo'),
        'fallas': contador_fallas,
        'advertencias': contador_advertencias,
        'mantenimiento': sum(1 for s in sensores_con_estado if s['estado'] == 'mantenimiento'),
        'porcentaje_operativo': round((sum(1 for s in sensores_con_estado if s['estado'] == 'operativo') / len(sensores_con_estado)) * 100, 2)
    },
    'alertas_activas': alertas_activas,
    'sensores': sensores_con_estado,
    'lineas': data['lineas']  # Mantener estructura original
}

# Guardar archivo
with open('sensores_estado.json', 'w', encoding='utf-8') as f:
    json.dump(resultado, f, ensure_ascii=False, indent=2)

print(f"\n{'='*60}")
print(f"RESUMEN DEL SISTEMA DE MONITOREO")
print(f"{'='*60}")
print(f"Total de sensores: {resultado['resumen']['total_sensores']}")
print(f"  ✓ Operativos: {resultado['resumen']['operativos']} ({resultado['resumen']['porcentaje_operativo']}%)")
print(f"  ⚠ Advertencias: {resultado['resumen']['advertencias']}")
print(f"  ✗ Fallas: {resultado['resumen']['fallas']}")
print(f"  🔧 Mantenimiento: {resultado['resumen']['mantenimiento']}")
print(f"\nAlertas activas: {len(alertas_activas)}")
print(f"{'='*60}")

if alertas_activas:
    print(f"\nALERTAS CRÍTICAS (Prioridad Alta):")
    for alerta in alertas_activas[:5]:
        if alerta['prioridad'] == 'alta':
            print(f"  • {alerta['id']} - Sensor {alerta['sensor_id']} (Línea {alerta['linea']})")
            print(f"    Problema: {alerta['problema']}")
            print(f"    Tiempo transcurrido: {alerta['tiempo_transcurrido_min']} minutos")

print(f"\n✓ Archivo 'sensores_estado.json' generado exitosamente")
