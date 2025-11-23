#!/usr/bin/env python3
"""
Ver eventos en todos los estados
"""
import requests

API_URL = 'http://localhost:5000/api'

def mostrar_eventos_por_estado(estado, emoji):
    """Mostrar eventos de un estado específico"""
    try:
        response = requests.get(f'{API_URL}/eventos?estado={estado}')
        data = response.json()
        
        if data['success']:
            print(f"\n{emoji} {estado.upper()}: {data['total']} eventos")
            
            if data['total'] > 0:
                for evento in data['eventos'][:3]:  # Mostrar solo los primeros 3
                    minutos = int(float(evento['minutos_transcurridos']))
                    print(f"   • Evento #{evento['id']}: {evento['sensor_id']} (Línea {evento['linea']}) - {minutos} min")
                    if evento.get('tiempo_atencion_minutos'):
                        print(f"     ⏱️ Atendido en {evento['tiempo_atencion_minutos']} minutos")
                
                if data['total'] > 3:
                    print(f"   ... y {data['total'] - 3} más")
        else:
            print(f"\n{emoji} {estado.upper()}: Error - {data.get('error', 'Desconocido')}")
            
    except Exception as e:
        print(f"\n{emoji} {estado.upper()}: Error - {e}")

print("\n" + "="*70)
print("📊 EVENTOS POR ESTADO")
print("="*70)

mostrar_eventos_por_estado('activo', '🔴')
mostrar_eventos_por_estado('asignado', '🟡')
mostrar_eventos_por_estado('finalizado', '🟢')

# Estadísticas generales
try:
    response = requests.get(f'{API_URL}/eventos/estadisticas')
    data = response.json()
    
    if data['success']:
        stats = data['estadisticas']
        print("\n" + "="*70)
        print("📈 RESUMEN")
        print("="*70)
        print(f"\nTotal generadas:  {stats['generadas']}")
        print(f"🔴 Pendientes:    {stats['pendientes']}")
        print(f"🟡 En proceso:    {stats['en_proceso']}")
        print(f"🟢 Finalizadas:   {stats['finalizadas']}")
except:
    pass

print("\n" + "="*70)
print("🌐 Dashboard: http://localhost:3000/dashboard_v3.html")
print("="*70)
print("\n💡 Ahora puedes usar los botones en el dashboard para filtrar:")
print("   🔴 Activas   - Eventos sin asignar")
print("   🟡 Asignadas - Eventos en proceso")
print("   🟢 Finalizadas - Eventos completados")
print("\n" + "="*70 + "\n")
