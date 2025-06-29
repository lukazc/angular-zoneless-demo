import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
import { PokemonList } from './features/pokemon/pokemon-list/pokemon-list';
import { PokemonDetail } from './features/pokemon/pokemon-detail/pokemon-detail';
import { NotFound } from './shared/components/not-found/not-found';

export const routes: Routes = [
    { path: 'dashboard', component: Dashboard },
    { path: 'pokemon', children: [
        { path: '', component: PokemonList },
        { path: ':id', component: PokemonDetail }
    ]},
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: '**', component: NotFound }
];
