import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(readonly router: Router) { }

  search() {
    this.router.navigate(['/search'], { skipLocationChange: true })
  }

  home() {
    this.router.navigate(['/'])
  }
}
