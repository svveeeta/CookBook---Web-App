"use client";

import { useState, useEffect } from "react";
// import PhotoMap, { MapObject } from "../gallery/_components/PhotoMap";

import dynamic from "next/dynamic";
// Тип MapObject можно импортировать отдельно, так как он не тянет за собой саму карту
import type { MapObject } from "../gallery/_components/PhotoMap";

// Загружаем саму карту лениво (только на клиенте)
const PhotoMap = dynamic(() => import("../gallery/_components/PhotoMap"), { 
  ssr: false,
  loading: () => <p style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>Карта загружается...</p> 
});

// const PhotoMap = dynamic(() => import("../gallery/_components/PhotoMap"), { 
//   ssr: false,
//   loading: () => <p>Загрузка карты...</p> 
// });


// Начальный список магазинов (добавь реальные координаты твоих магазинов)
const initialStores: MapObject[] = [
  { id: "1", name: "Перекресток", description: "Кирпичный пер., 4", coordinates: [59.935840, 30.315886] },
  { id: "2", name: "Дикси", description: "Гороховая улица, 17/56", coordinates: [59.932175, 30.316111] },
  { id: "3", name: "Сенной рынок", description: "Московский пр., 4АБ", coordinates: [59.924474, 30.319731]},
  { id: "4", name: "Лента", description: "Индустриальный пр., 25А", coordinates: [59.947027, 30.477466]},
];

// Функция для расчета расстояния между двумя точками (в км)
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Радиус Земли в км
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function NearbyStoresPage() {
  // const [stores, setStores] = useState<MapObject[]>(initialStores);
  const [stores] = useState<MapObject[]>(initialStores);
  const [selectedStore, setSelectedStore] = useState<MapObject | null>(null);
  
  // Состояние для геопозиции
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [geoStatus, setGeoStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [geoError, setGeoError] = useState<string | null>(null);

  // Получаем геопозицию при загрузке страницы
  useEffect(() => {
    if (!navigator.geolocation) {
      const timer = setTimeout(() => {
        setGeoStatus("error");
        setGeoError("Ваш браузер не поддерживает геолокацию.");
      }, 0); 
      
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setGeoStatus("loading");

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords([position.coords.latitude, position.coords.longitude]);
          setGeoStatus("success");
        },
        (error) => {
          setGeoStatus("error");
          if (error.code === error.PERMISSION_DENIED) {
            setGeoError("Вы запретили доступ к геопозиции. Показываем карту по умолчанию.");
          } else {
            setGeoError("Не удалось определить местоположение.");
          }
        },
      );
    }, 0);
    
    return () => clearTimeout(timer);
      
  }, []);

  // Сортируем магазины по удаленности от пользователя (если координаты есть)
  const sortedStores = [...stores].sort((a, b) => {
    if (!userCoords) return 0;
    const distA = getDistance(userCoords[0], userCoords[1], a.coordinates[0], a.coordinates[1]);
    const distB = getDistance(userCoords[0], userCoords[1], b.coordinates[0], b.coordinates[1]);
    return distA - distB;
  });

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h2>Магазины поблизости</h2>
      
      {/* Статус геолокации */}
      {geoStatus === "loading" && <p>Определяем ваше местоположение...</p>}
      {geoStatus === "error" && <p style={{ color: "#a5231c" }}>{geoError}</p>}

      {/* Список магазинов (отсортированный) */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Ближайшие к вам:</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {sortedStores.map((store) => {
            // Считаем расстояние для отображения
            const distance = userCoords 
              ? getDistance(userCoords[0], userCoords[1], store.coordinates[0], store.coordinates[1]).toFixed(1)
              : null;

            return (
              <li 
                key={store.id} 
                onClick={() => setSelectedStore(store)}
                style={{ 
                  padding: "10px", 
                  borderBottom: "1px solid #ddd", 
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >
                <span><strong>{store.name}</strong> — {store.description}</span>
                {distance && <span style={{ color: "#666" }}>{distance} км</span>}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Карта */}
      <PhotoMap 
        objects={stores} 
        onSelect={setSelectedStore}
      />

      {/* Модалка */}
      {selectedStore && (
        <div 
          style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 9999
          }}
          onClick={() => setSelectedStore(null)}
        >
          <div 
            style={{ background: "#faf1db", padding: "30px", borderRadius: "12px", maxWidth: "400px", width: "90%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0, color: "#a5231c" }}>{selectedStore.name}</h3>
            <p>{selectedStore.description}</p>
            <button 
              onClick={() => setSelectedStore(null)}
              style={{ padding: "10px 20px", background: "#a5231c", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </main>
  );
}