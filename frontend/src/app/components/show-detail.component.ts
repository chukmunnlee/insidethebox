import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TvShow } from '../../../../common/model';
import { TvService } from '../tv.service';

@Component({
  selector: 'app-show-detail',
  templateUrl: './show-detail.component.html',
  styleUrls: ['./show-detail.component.css']
})
export class ShowDetailComponent implements OnInit {

    tvShow: TvShow = {
        image: '',
        lang: '',
        name: '',
        officialSite: '',
        rating: -1,
        summary: '',
        tvid: -1
    }

    constructor(readonly tvSvc: TvService, readonly activatedRoute: ActivatedRoute, readonly router: Router) { }

    ngOnInit() {
        this.tvSvc.getTvShow(this.activatedRoute.snapshot.params.url)
            .then(result => {
                this.tvShow = result.show;
            })
    }

}
