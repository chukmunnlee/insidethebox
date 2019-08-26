import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { TvService } from '../tv.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

    @ViewChild('form', { static: false }) form: NgForm;

    constructor(readonly tvSvc: TvService, readonly router: Router) { }

    ngOnInit() { }

    processForm() {
        this.tvSvc.findTvShows(this.form.value.q)
            .then(result => {
                this.router.navigate(['/', 'list'],
                    {
                        queryParams: { cacheKey: this.tvSvc.addToCache(result) }
                    }
                )
            })
            .catch(error => {
                console.error('>> ', error)
            })
    }

}
