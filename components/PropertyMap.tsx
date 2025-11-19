'use client';

/**
 * Property Boundaries Map Component
 * Displays property boundaries on an interactive map
 * Uses MapLibre GL (open-source Mapbox alternative)
 */

import { useEffect, useRef } from 'react';
import type { Coordinate } from '@/lib/types';

interface Props {
  bounds: Coordinate[];
}

export default function PropertyMap({ bounds }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);

  useEffect(() => {
    // TODO: Initialize MapLibre map
    // For MVP, we'll show a placeholder with coordinates list
    // Full implementation requires: npm install maplibre-gl react-map-gl

    /*
    import maplibregl from 'maplibre-gl';

    if (!map.current && mapContainer.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://api.maptiler.com/maps/satellite/style.json?key=YOUR_KEY',
        center: calculateCenter(bounds),
        zoom: 16,
      });

      // Add polygon
      map.current.on('load', () => {
        map.current.addSource('property', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [bounds.map(b => [b.longitude, b.latitude])],
            },
          },
        });

        map.current.addLayer({
          id: 'property-fill',
          type: 'fill',
          source: 'property',
          paint: {
            'fill-color': '#3B82F6',
            'fill-opacity': 0.2,
          },
        });

        map.current.addLayer({
          id: 'property-outline',
          type: 'line',
          source: 'property',
          paint: {
            'line-color': '#3B82F6',
            'line-width': 3,
          },
        });
      });
    }

    return () => {
      if (map.current) map.current.remove();
    };
    */
  }, [bounds]);

  // Calculate center point for map
  const calculateCenter = (coords: Coordinate[]) => {
    const total = coords.reduce(
      (acc, coord) => ({
        latitude: acc.latitude + coord.latitude,
        longitude: acc.longitude + coord.longitude,
      }),
      { latitude: 0, longitude: 0 }
    );

    return {
      latitude: total.latitude / coords.length,
      longitude: total.longitude / coords.length,
    };
  };

  const center = calculateCenter(bounds);

  // Placeholder map (for MVP without MapLibre dependency)
  return (
    <div className="relative">
      {/* Placeholder Map */}
      <div
        ref={mapContainer}
        className="w-full h-[400px] bg-aureal-slate rounded-lg flex items-center justify-center border-2 border-aureal-gold/30"
      >
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🗺️</div>
          <h3 className="text-xl font-bold text-aureal-gold mb-4">Property Boundaries</h3>
          <div className="max-w-md mx-auto">
            <p className="text-sm text-aureal-text-secondary mb-4">
              Interactive map will be displayed here showing the exact property boundaries.
            </p>
            <div className="bg-aureal-card rounded-lg p-4 text-left">
              <div className="text-xs text-aureal-text-muted uppercase tracking-wide mb-2">
                Boundary Coordinates
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {bounds.map((coord, index) => (
                  <div key={index} className="text-xs font-mono text-aureal-text-secondary">
                    #{index + 1}: {coord.latitude.toFixed(6)}, {coord.longitude.toFixed(6)}
                  </div>
                ))}
              </div>
              <div className="text-xs text-aureal-text-muted mt-3">
                Center: {center.latitude.toFixed(6)}, {center.longitude.toFixed(6)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TODO Notice for developers */}
      <div className="absolute top-4 right-4 bg-yellow-500/90 text-black text-xs px-3 py-2 rounded-lg font-semibold">
        Map: Integration Required
      </div>
    </div>
  );
}
