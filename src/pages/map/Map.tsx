import React, { useEffect, useRef, useState } from 'react';
import L, { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getUserProfile } from '@/providers/userProfileProvider';
import type { UserProfileType } from '@/types/userProfileType';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { MAP_COOKIE_CONSENT } from '@/core/appData';
import { useLocationConsent } from '@/components/consent/LocationConsent';

interface MarkerData {
  lat: number;
  lng: number;
  title: string;
  content: string;
  marker?: LeafletMarker;
  isCurrentUser?: boolean; 
}

interface MapProps {
  userId: number | null
}

// TODO
// Bikin lingkaran (radius20km) buat nyari temen terdekat

const Map: React.FC<MapProps> = ({ userId }) => {
  if(!userId) return
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [currentUserMarker, setCurrentUserMarker] = useState<MarkerData | null>(null);
  const [location, setLocation] = useState<UserProfileType>();
  const { showCookieConsent, cookieConsentGiven, handleCookieConsent } = useCookieConsent(MAP_COOKIE_CONSENT)
  const [mapInfo, setMapInfo] = useState({
    center: { lat: 40.7128, lng: -74.006 },
    zoom: 13,
  });
  const { requestLocation } = useLocationConsent(
    userId,
    showCookieConsent,
    cookieConsentGiven,
    handleCookieConsent
  );

  const findMyLocation = () => {
    if (currentUserMarker && mapInstanceRef.current) {
      mapInstanceRef.current.setView([currentUserMarker.lat, currentUserMarker.lng], 15);
      
      if (currentUserMarker.marker) {
        currentUserMarker.marker.openPopup();
      }
    } else {
      requestLocation();
    }
  };

  const createRedIcon = () => {
    return L.divIcon({
      html: `
        <div style="
          background-color: #dc2626;
          width: 25px;
          height: 25px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 8px;
            height: 8px;
            background-color: white;
            border-radius: 50%;
          "></div>
        </div>
      `,
      className: 'custom-red-marker',
      iconSize: [25, 25],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12]
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const data: UserProfileType = await getUserProfile(userId!);
      setLocation(data);
      addCurrentUserMarker({
        lat: data.latitude,
        lng: data.longitude,
        title: 'Kamu',
        content: `${data.address}, ${data.city}`,
        isCurrentUser: true
      });
    }
    fetchData()
  }, []);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([2.4602, 120.9375], 4); //Indonesia
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // const initialMarkers = [
    //   { lat: 40.7128, lng: -74.006, title: 'New York City', content: 'Welcome to NYC!' },
    //   { lat: 40.7589, lng: -73.9851, title: 'Times Square', content: 'The heart of NYC' },
    //   { lat: 40.6892, lng: -74.0445, title: 'Statue of Liberty', content: 'Freedom symbol' },
    // ];

    // initialMarkers.forEach(addMarkerToMap);

    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      addMarkerToMap({
        lat,
        lng,
        title: 'Lokasi yang Ditekan',
        content: `Kamu menekan ke ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      });
    });

    map.on('ZOOOOMMMM', updateMapInfo);

    updateMapInfo();
  }, []);

  const addCurrentUserMarker = (data: MarkerData) => {
    if (!mapInstanceRef.current) return;

    const redIcon = createRedIcon();
    const marker = L.marker([data.lat, data.lng], { icon: redIcon }).addTo(mapInstanceRef.current);
    
    marker.bindPopup(`
      <div style="font-family: sans-serif;">
        <h3 style="font-weight: bold; color: #dc2626;">${data.title}</h3>
        <p>${data.content}</p>
        <small>(${data.lat.toFixed(4)}, ${data.lng.toFixed(4)})</small>
        <div style="margin-top: 8px; padding: 4px 8px; background-color: #fef2f2; border-radius: 4px; font-size: 12px; color: #dc2626;">
          📍 Kamu
        </div>
      </div>
    `);
    
    const markerData = { ...data, marker };
    setCurrentUserMarker(markerData);
    
    mapInstanceRef.current.setView([data.lat, data.lng], 15);
  };

  const addMarkerToMap = (data: MarkerData) => {
    if (!mapInstanceRef.current) return;

    const marker = L.marker([data.lat, data.lng]).addTo(mapInstanceRef.current);
    marker.bindPopup(`
      <div style="font-family: sans-serif;">
        <h3 style="font-weight: bold;">${data.title}</h3>
        <p>${data.content}</p>
        <small>(${data.lat.toFixed(4)}, ${data.lng.toFixed(4)})</small>
      </div>
    `);
    setMarkers(prev => [...prev, { ...data, marker }]);
  };

  const addRandomMarker = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const bounds = map.getBounds();
    const lat = bounds.getSouth() + Math.random() * (bounds.getNorth() - bounds.getSouth());
    const lng = bounds.getWest() + Math.random() * (bounds.getEast() - bounds.getWest());

    const titles = ['Random Point', 'Mystery Spot', 'Cool Place'];
    const title = titles[Math.floor(Math.random() * titles.length)];

    addMarkerToMap({
      lat,
      lng,
      title,
      content: 'This marker was added randomly!',
    });
  };

  const clearMarkers = () => {
    if (!mapInstanceRef.current) return;

    // Clear yg reguler
    markers.forEach(({ marker }) => {
      if (marker) mapInstanceRef.current!.removeLayer(marker);
    });
    setMarkers([]);
  };

  const updateMapInfo = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const center = map.getCenter();
    const zoom = map.getZoom();
    setMapInfo({
      center: { lat: center.lat, lng: center.lng },
      zoom,
    });
  };

  return (
    <div className="min-h-screen p-4 ">
      <div className="max-w-6xl mx-auto">
        <div className="rounded shadow bg-white overflow-hidden">
          <div className="bg-blue-700 text-white p-4">
            <h1 className="text-xl font-bold">Temukan Teman Disekitar</h1>
            <p className="text-sm text-blue-100">Cari teman dengan klik atau tombol</p>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex gap-2 flex-wrap">
              {/* <button onClick={searchFriend} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                Temukan Teman
              </button> */}
              <button onClick={clearMarkers} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                Bersihkan Marker
              </button>
              <button onClick={findMyLocation} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                Temukan Lokasi saya
              </button>
            </div>
            <div ref={mapRef} className="w-full h-96 rounded shadow-inner" />
            <div className="text-sm bg-gray-50 p-3 rounded">
              <p><strong>Center:</strong> {mapInfo.center.lat.toFixed(4)}, {mapInfo.center.lng.toFixed(4)}</p>
              <p><strong>Zoom:</strong> {mapInfo.zoom}</p>
              <p><strong>Marker Reguler:</strong> {markers.length}</p>
              <p><strong>Marker Lokasi Kamu:</strong> {currentUserMarker ? 'Active' : 'None'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;