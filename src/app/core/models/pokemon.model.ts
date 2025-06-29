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

export interface GraphQLPokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  pokemontypes: GraphQLPokemonType[];
  pokemonsprites: GraphQLPokemonSprites[];
}

export interface GraphQLPokemonListResponse {
  data: {
    pokemon: GraphQLPokemon[];
  };
}

export interface PokemonSummary {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: string[];
  sprites: any;
}
