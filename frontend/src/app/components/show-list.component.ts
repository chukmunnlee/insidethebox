import { Component, OnInit } from '@angular/core';
import { TvService } from '../tv.service';
import { TvShowReference, TvShowList } from '../../../../common/response';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-list',
  templateUrl: './show-list.component.html',
  styleUrls: ['./show-list.component.css']
})
export class ShowListComponent implements OnInit {

    tvShows: TvShowReference[];

    constructor(readonly tvSvc: TvService, readonly router: Router) { }

    ngOnInit() {

        const c = this.tvSvc.readFromCache() as TvShowList;

        if (c)
            return this.tvShows = c.shows;

        this.tvSvc.getTvShows()
            .then((result: TvShowList ) => {
                this.tvShows = result.shows;
            })
    }

    show(idx: number) {
        this.router.navigate(['/', 'detail', this.tvShows[idx].url ]);
    }
}
