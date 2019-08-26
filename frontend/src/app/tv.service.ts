import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';

import { TvShowList, GenreList, TvShowDetail } from '../../../common/response'

const CACHE_KEY = 'cache-key';

@Injectable()
export class TvService {

    constructor(readonly http: HttpClient) { }

    addToCache(data: any): string {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        return (CACHE_KEY);
    }

    readFromCache(): any {
        let r = localStorage.getItem(CACHE_KEY)
        if (r)
            return (JSON.parse(r));
        return (r)
    }

    clearCache() {
        localStorage.removeItem(CACHE_KEY)
    }

    findTvShows(query: string): Promise<TvShowList> {
        const qs = new HttpParams()
            .set('q', query);

        return (
            this.http.get<TvShowList>('/api/tv/search', { params: qs })
                .toPromise()
        );
    }

    findTvShowsByGenre(genre: string): Promise<TvShowList> {
        return (
            this.http.get<TvShowList>(`/api/tv/genre/${genre}`)
                .toPromise()
        )
    }

    getTvShow(url: string): Promise<TvShowDetail> {
        return (
            this.http.get<TvShowDetail>(url)
                .toPromise()
        );
    }

    getTvShows(params = { limit: 20, offset: 0 }): Promise<TvShowList> {
        const qs = new HttpParams()
            .set('limit', (params.limit + '') || '20')
            .set('offset', (params.offset + '') || '0')
        return (
            this.http.get<TvShowList>('/api/tv', { params: qs })
                .toPromise()
        );
    }

    getGenres(): Promise<GenreList> {
        return (
            this.http.get<GenreList>('/api/tv/genres')
                .toPromise()
        )
    }
}
