import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MaterialMarvelCharactersModule } from '../material.module';
import { AppComponent } from './app.component';
import { CharactersListComponent } from './components/characters-list/characters-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CharacterFilterComponent } from './components/character-filter/character-filter.component';
import { CharactersListPageComponent } from './pages/characters-list-page/characters-list-page.component';
import { AppRoutingModule } from './app-routing.module';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { CharacterDetailDialogComponent } from './components/character-detail-dialog/character-detail-dialog.component';
import { CharacterDetailComponent } from './components/character-detail/character-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    CharactersListComponent,
    CharacterFilterComponent,
    CharactersListPageComponent,
    HomePageComponent,
    CharacterDetailDialogComponent,
    CharacterDetailComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialMarvelCharactersModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
