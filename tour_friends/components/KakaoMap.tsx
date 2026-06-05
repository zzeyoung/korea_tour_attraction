'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

interface Props {
  characters: {
    name: string;
    latitude: number;
    longitude: number;
    level: 'locked' | 'discovered' | 'visited';
  }[];
}

export default function KakaoMap({ characters }: Props) {
  const mapRef = useRef<any>(null);

  useEffect(() => {
    const initMap = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('kakao-map');
        if (!container) return;

        if (!mapRef.current) {
          mapRef.current = new window.kakao.maps.Map(container, {
            center: new window.kakao.maps.LatLng(36.0, 127.8),
            level: 12,
          });
        }

        const map = mapRef.current;

        characters.forEach((char) => {
          if (char.level === 'locked') return;

          const color = char.level === 'visited' ? '#E8524A' : '#7C74E8';

          // 같은 위치 겹침 방지: visited는 약간 위로 offset
          const lat = char.level === 'visited'
            ? char.latitude + 0.08
            : char.latitude;

          const markerImage = new window.kakao.maps.MarkerImage(
            `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="44" viewBox="0 0 32 44">
                <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="2"/>
                <path d="M16 44 L8 28 Q16 32 24 28 Z" fill="${color}"/>
              </svg>
            `)}`,
            new window.kakao.maps.Size(32, 44),
            new window.kakao.maps.Point(16, 44)
          );

          const marker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(lat, char.longitude),
            map,
            image: markerImage,
          });

          const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:5px 10px;font-size:12px;font-weight:500;">${char.name}</div>`,
          });
          window.kakao.maps.event.addListener(marker, 'click', () => {
            infowindow.open(map, marker);
          });
        });
      });
    };

    if (window.kakao && window.kakao.maps) {
      initMap();
    } else {
      const existing = document.getElementById('kakao-map-script');
      if (!existing) {
        const script = document.createElement('script');
        script.id = 'kakao-map-script';
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`;
        script.onload = initMap;
        document.head.appendChild(script);
      } else {
        existing.addEventListener('load', initMap);
      }
    }
  }, [characters]);

  return (
    <div id="kakao-map" className="w-full h-64 rounded-xl overflow-hidden" />
  );
}