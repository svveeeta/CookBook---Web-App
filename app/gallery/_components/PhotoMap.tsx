"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./PhotoMap.module.css";

// Типы для Яндекс.Карт
interface YandexMap {
  container: { fitToViewport: () => void };
  geoObjects: {
    add: (obj: YandexPlacemark) => void;
    each: (cb: (obj: YandexPlacemark) => void) => void;
    remove: (obj: YandexPlacemark) => void;
  };
  destroy: () => void;
  setCenter: (coords: number[], zoom: number, options?: object) => void;
}

interface YandexPlacemark {
  events: { add: (event: string, cb: () => void) => void };
  properties: { get: (key: string) => string };
}

interface YandexMaps {
  Map: new (el: HTMLElement, opts: object) => YandexMap;
  Placemark: new (coords: number[], props: object, opts?: object) => YandexPlacemark;
  ready: (cb: () => void) => void;
}

declare global {
  interface Window {
    ymaps: YandexMaps;
  }
}

// Тип объекта (Магазин / Место)
export type MapObject = {
  id: string;
  name: string;
  description: string; // Адрес или описание
  coordinates: [number, number]; // [широта, долгота]
};

type PhotoMapProps = {
  objects: MapObject[]; // Массив типизированных объектов
  onSelect: (obj: MapObject) => void; // Обработчик выбора
  // userCoords?: [number, number] | null; // Добавление координат пользователя
};

export default function PhotoMap({ objects, onSelect }: PhotoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null); // 2. Ref для контейнера
  const mapInstance = useRef<YandexMap | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false); // Состояние для кнопки

  useEffect(() => {
    let isMounted = true;

    // Берем ключ напрямую из .env.local
    const YANDEX_API_KEY = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;
    
    if (!YANDEX_API_KEY) {
      const timer = setTimeout(() => setError("Отсутствует API-ключ Яндекс.Карт. Проверьте файл .env.local."), 0);
      return () => clearTimeout(timer);
    }

    // const ymaps = (window as unknown as { ymaps: Record<string, unknown> }).ymaps;

    // 3. Загрузка API по HTTPS
    const loadApi = () => {
      if (window.ymaps) return Promise.resolve();

      return new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = `https://api-maps.yandex.ru/2.1/?apikey=${YANDEX_API_KEY}&lang=ru_RU`;
        script.type = "text/javascript";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Ошибка загрузки скрипта Яндекс.Карт"));
        document.head.appendChild(script);
      });
    };

    loadApi()
      .then(() => {
        // 4. Дожидаемся ymaps.ready
        window.ymaps.ready(() => {
          if (!isMounted || !mapRef.current) return;

          // Не создаем новый экземпляр при каждом рендере
          if (mapInstance.current) {
            mapInstance.current.destroy();
          }

          // 5. Создаем карту
          mapInstance.current = new window.ymaps.Map(mapRef.current, {
            center: [59.938676, 30.314494], // Центр Петербурга по умолчанию
            zoom: 11,
            controls: ["zoomControl", "fullscreenControl"],
          });

          // 6. Создаем Placemark для каждого объекта
          objects.forEach((obj) => {
            const placemark: YandexPlacemark = new window.ymaps.Placemark(
              obj.coordinates,
              {
                hintContent: obj.name, // 7. Передаем название в hintContent
                balloonContent: obj.description,
              },
              { preset: "islands#blueIcon" }
            );

            // 8. Открываем модальное окно при нажатии метки
            placemark.events.add("click", () => {
              onSelect(obj);
            });

            // 9. Добавляем метки в geoObjects
            mapInstance.current?.geoObjects.add(placemark);
          });

          // ДОБАВЛЯЕМ RESIZE OBSERVER ЗДЕСЬ
          if (mapRef.current && typeof ResizeObserver !== "undefined") {
            const observer = new ResizeObserver(() => {
              if (mapInstance.current) {
                mapInstance.current.container.fitToViewport();
              }
            });
            observer.observe(mapRef.current);
          }
        });
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) {
          setError("Не удалось загрузить карту. Проверьте API-ключ.");
        }
      });

      // Создаем наблюдатель за размерами контейнера
      let resizeObserver: ResizeObserver | null = null;

      if (mapRef.current && typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(() => {
          // Когда контейнер меняет размер (например, поворот телефона), 
          // просим Яндекс.Карты пересчитать область
          if (mapInstance.current) {
            mapInstance.current.container.fitToViewport();
          }
        });
        resizeObserver.observe(mapRef.current);
      }

    // 10. Уничтожить карту в cleanup
    return () => {
      isMounted = false;
      // Отключаем наблюдатель
      // if (resizeObserver) {
      //   resizeObserver.disconnect();
      // }
      // Уничтожаем карту
      if (mapInstance.current) {
        mapInstance.current.destroy();
        mapInstance.current = null;
      }
    };
    // Эффект зависит от массива объектов и обработчика выбора
  }, [objects, onSelect]);

//   if (error) {
//     return <div className={styles.error}>{error}</div>;
//   }

//   return (
//     <div className={styles.mapContainer}>
//       <div ref={mapRef} className={styles.map}></div>
//     </div>
//   );

    // Функция определения геолокации
    const handleLocateUser = () => {
      if (!navigator.geolocation) {
        alert("Ваш браузер не поддерживает геолокацию.");
        return;
      }

      setIsLocating(true);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Если карта загружена, центрируем её на пользователе
          if (mapInstance.current) {
            mapInstance.current.setCenter([latitude, longitude], 14, {
              duration: 500 // Плавная анимация перемещения
            });

            // Опционально: добавить метку "Вы здесь"
            const userPlacemark = new window.ymaps.Placemark(
              [latitude, longitude],
              { hintContent: "Вы здесь" },
              { preset: "islands#redDotIcon" }
            );
            
            // Удаляем старую метку пользователя, если она была, и добавляем новую
            const geoObjects = mapInstance.current.geoObjects;
            geoObjects.each((obj: YandexPlacemark) => {
              if (obj.properties.get("hintContent") === "Вы здесь") {
                geoObjects.remove(obj);
              }
            });
            geoObjects.add(userPlacemark);
          }
          
          setIsLocating(false);
        },
        (error) => {
          console.error("Ошибка геолокации:", error);
          alert("Не удалось определить местоположение. Разрешите доступ к геолокации в браузере.");
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    };

    if (error) {
      return <div className={styles.error}>{error}</div>;
    }

    return (
      <div className={styles.mapContainer}>
        {/* Кнопка поверх карты */}
        <button 
          className={styles.geoBtn} 
          onClick={handleLocateUser} 
          disabled={isLocating}
        >
          {isLocating ? "Поиск..." : "📍 Определить местоположение"}
        </button>
        
        <div ref={mapRef} className={styles.map}></div>
      </div>
    );
}

