export interface PokemonListParams {
  limit?: number;
  offset?: number;
}

export interface GraphQLPokemonType {
  type: { name: string };
}

export interface GraphQLPokemonSprites {
  sprites: any;
}

export interface GraphQLPokemonSpeciesName {
  name: string;
}

export interface GraphQLPokemonSpecy {
  pokemonspeciesnames: GraphQLPokemonSpeciesName[];
}

export interface GraphQLPokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  pokemontypes: GraphQLPokemonType[];
  pokemonsprites: GraphQLPokemonSprites[];
  pokemonspecy: GraphQLPokemonSpecy;
}

export interface GraphQLPokemonListResponse {
  data: {
    pokemon: GraphQLPokemon[];
    pokemon_aggregate: {
      aggregate: {
        count: number;
      };
    };
  };
}

export interface PokemonSummary {
  id: number;
  name: string;
  displayName: string; // English species name for better display
  height: number;
  weight: number;
  types: string[];
  sprites: any;
}

export interface PokemonListResult {
  pokemon: PokemonSummary[];
  totalCount: number;
}
