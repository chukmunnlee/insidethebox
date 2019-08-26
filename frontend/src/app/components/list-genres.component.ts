import { Component, OnInit } from '@angular/core';
import { TvService } from '../tv.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-genres',
  templateUrl: './list-genres.component.html',
  styleUrls: ['./list-genres.component.css']
})
export class ListGenresComponent implements OnInit {

    genres: string[] = []

    constructor(readonly tvSvc: TvService, readonly router: Router) { }

    ngOnInit() {
        this.tvSvc.getGenres()
            .then(result => this.genres = result.genres);
    }

    search(idx: number) {
        this.tvSvc.findTvShowsByGenre(this.genres[idx])
            .then(result => {
                this.router.navigate(['/', 'list'],
                    {
                        queryParams: { cacheKey: this.tvSvc.addToCache(result) }
                    }
                )
            })
            .catch(error => {
                console.error('error: ', error);
            })

    }

}
