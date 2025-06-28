import { PokeAPI } from 'pokeapi-types';

export type Pokemon = PokeAPI.Pokemon;
export type NamedAPIResource = PokeAPI.NamedAPIResource;
export type NamedAPIResourceList = PokeAPI.NamedAPIResourceList;
export type PokemonType = PokeAPI.PokemonType;
export type PokemonSprites = PokeAPI.PokemonSprites;
export type PokemonStat = PokeAPI.PokemonStat;

export interface PokemonListParams {
  limit?: number;
  offset?: number;
}

export interface PokemonSummary {
  id: number;
  name: string;
  url: string;
  height: number;
  weight: number;
  types: string[];
  sprite: string | null;
}
