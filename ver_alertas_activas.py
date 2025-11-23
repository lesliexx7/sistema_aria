#!/usr/bin/env python3
import requests

print("\n" + "="*70)
print("🚨 ALERTAS ACTIVAS EN EL SISTEMA")
print("="*70)

try:
    # Obtener alertas activas
    response = requests.get('http://localhost:5000/api/eventos?estado=activo')
    data = response.json()
    
    if data['success']:
        print(f"\n✅ Total de alertas activas: {data['total']}\n")
        
        if data['total'] > 0:
            for evento in data['eventos']:
                severidad_emoji = "🔴" if evento['nivel_severidad'] == 3 else "🟡" if evento['nivel_severidad'] == 2 else "🟢"
                minutos = int(float(evento['minutos_transcurridos']))
                
                print(f"{severidad_emoji} Evento #{evento['id']}")
                print(f"   Sensor: {evento['sensor_id']}")
                print(f"   Línea: {evento['linea']}")
                print(f"   Severidad: {evento['nivel_severidad']}")
                print(f"   Tiempo: {minutos} minutos")
                print(f"   Estado: {evento['estado'].upper()}")
                print()
        else:
            print("No hay alertas activas")
    else:
        print(f"❌ Error: {data.get('error', 'Desconocido')}")
        
    # Obtener estadísticas
    response = requests.get('http://localhost:5000/api/eventos/estadisticas')
    data = response.json()
    
    if data['success']:
        stats = data['estadisticas']
        print("="*70)
        print("📊 ESTADÍSTICAS GENERALES")
        print("="*70)
        print(f"\nTotal generadas:  {stats['generadas']}")
        print(f"Pendientes:       {stats['pendientes']}")
        print(f"Finalizadas:      {stats['finalizadas']}")
        print(f"En proceso:       {stats['en_proceso']}")
        print(f"\nPor severidad:")
        print(f"  🔴 Críticas:    {stats['alertas_criticas']}")
        print(f"  🟡 Medias:      {stats['alertas_medias']}")
        print(f"  🟢 Bajas:       {stats['alertas_bajas']}")
        
except Exception as e:
    print(f"\n❌ Error: {e}")

print("\n" + "="*70)
print("🌐 Dashboard: http://localhost:3000/dashboard_v3.html")
print("="*70 + "\n")
