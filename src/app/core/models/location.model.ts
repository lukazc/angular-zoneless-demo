/**
 * Location model for map and location widgets
 */
export interface Location {
  /** Unique identifier for the location */
  id: number;
  
  /** Display name of the location */
  name: string;
  
  /** Latitude coordinate */
  lat: number;
  
  /** Longitude coordinate */
  lng: number;
  
  /** Optional description */
  description?: string;
}

/**
 * Predefined locations in Zagreb area
 * Starting with Heinzelova 70 as specified in the task
 */
export const ZAGREB_LOCATIONS: Location[] = [
  {
    id: 1,
    name: 'Heinzelova 70',
    lat: 45.8044250,
    lng: 16.0076573,
  },
  {
    id: 2,
    name: 'Zagreb Cathedral',
    lat: 45.8144,
    lng: 15.9794,
  },
  {
    id: 3,
    name: 'Ban Jelačić Square',
    lat: 45.8131,
    lng: 15.9775,
  },
  {
    id: 4,
    name: 'Zagreb Airport',
    lat: 45.7429,
    lng: 16.0688,
  },
  {
    id: 5,
    name: 'Maksimir Park',
    lat: 45.8219,
    lng: 16.0181,
  },
  {
    id: 6,
    name: 'Croatian National Theatre',
    lat: 45.8094,
    lng: 15.9700,
  },
  {
    id: 7,
    name: 'Zagreb Main Railway Station',
    lat: 45.8047,
    lng: 15.9788,
  },
  {
    id: 8,
    name: 'Tkalčićeva Street',
    lat: 45.8175,
    lng: 15.9763,
  },
  {
    id: 9,
    name: 'Mirogoj Cemetery',
    lat: 45.8359,
    lng: 15.9869,
  },
  {
    id: 10,
    name: 'Zagreb Zoo',
    lat: 45.8219,
    lng: 16.0219,
  }
];

/** Default location (Heinzelova 70) */
export const DEFAULT_LOCATION: Location = ZAGREB_LOCATIONS[0];
