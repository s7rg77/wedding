import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

import { provideHttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GoogleMapsModule } from '@angular/google-maps';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AudioPlayerComponent } from './audioplayer/audioplayer.component';
import { MapComponent } from './map/map.component';
import { FormComponent } from './form/form.component';
import { ItineraryComponent } from './itinerary/itinerary.component';
import { BookComponent } from './book/book.component';
import { ServicesComponent } from './services/services.component';
import { GameComponent } from './game/game.component';
import { MainComponent } from './main/main.component';
import { TopComponent } from './top/top.component';
import { SegaComponent } from './sega/sega.component';
import { NotesComponent } from './notes/notes.component';
import { LeavesComponent } from './leaves/leaves.component';

const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};

@NgModule({
  declarations: [
    AppComponent,
    AudioPlayerComponent,
    MapComponent,
    FormComponent,
    ItineraryComponent,
    BookComponent,
    ServicesComponent,
    GameComponent,
    MainComponent,
    TopComponent,
    SegaComponent,
    NotesComponent,
    LeavesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    GoogleMapsModule
  ],
  providers: [
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth())
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }