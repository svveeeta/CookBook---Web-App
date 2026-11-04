export type Store = {
    id: string;
    name: string;
    coordinates: [number, number]; // [широта, долгота]
    address: string;
  };
  
  export const stores: Store[] = [
    { id: "1", name: "Пятёрочка", coordinates: [55.751244, 37.618423], address: "ул. Тверская, 1" },
    { id: "2", name: "Магнит", coordinates: [55.760186, 37.618711], address: "ул. Арбат, 10" },
    // ... добавь свои магазины
  ];