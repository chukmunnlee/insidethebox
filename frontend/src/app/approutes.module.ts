import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router'
import { SearchComponent } from './components/search.component';
import { ShowListComponent } from './components/show-list.component';
import { MainComponent } from './components/main.component';
import { ShowDetailComponent } from './components/show-detail.component';

const ROUTES: Routes = [
  { path: '', component: MainComponent },
  { path: 'list', component: ShowListComponent },
  { path: 'search', component: SearchComponent },
  { path: 'detail/:url', component: ShowDetailComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
]

@NgModule({
  imports: [ RouterModule.forRoot(ROUTES, { useHash: true }) ],
  exports: [ RouterModule ]
})
export class AppRoutesModule { }
