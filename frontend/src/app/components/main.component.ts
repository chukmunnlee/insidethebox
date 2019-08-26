import { Component, OnInit } from '@angular/core';
import { TvService } from '../tv.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(readonly tvSvc: TvService) { }

  ngOnInit() {
      this.tvSvc.clearCache();
  }

}
