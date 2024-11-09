import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main/main.component';
import { NotesComponent } from './notes/notes.component';
import { GameComponent } from './game/game.component';
import { TopComponent } from './top/top.component';

const routes: Routes = [

  { path: '', component: MainComponent },
  { path: 'notes', component: NotesComponent },
  { path: 'game', component: GameComponent },
  { path: 'top', component: TopComponent },
  { path: '**', redirectTo: '' }
  
];

@NgModule({

  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]

})

export class AppRoutingModule { }