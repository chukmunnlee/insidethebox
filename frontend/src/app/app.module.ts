import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { TvService } from './tv.service';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchComponent } from './components/search.component';
import { MaterialModule } from './material.module';
import { AppRoutesModule } from './approutes.module';
import { ShowListComponent } from './components/show-list.component';
import { FormsModule } from '@angular/forms';
import { ListGenresComponent } from './components/list-genres.component';
import { MainComponent } from './components/main.component';
import { ShowDetailComponent } from './components/show-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    ShowListComponent,
    ListGenresComponent,
    MainComponent,
    ShowDetailComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule,
    HttpClientModule, FormsModule,
    MaterialModule, AppRoutesModule
  ],
  providers: [ TvService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
