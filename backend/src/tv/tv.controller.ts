import { Controller, Get, Header, Query, BadRequestException, NotFoundException, Param } from '@nestjs/common';
import { TvService } from './tv.service';

import { TvShowCount, TvShowList, TvShowReference, GenreList, TvShowDetail } from '../../../common/response';
import { TvShowSummary } from '../../../common/model';

@Controller('tv')
export class TvController {

    constructor(readonly tvSvc: TvService) { }

    @Get()
    @Header('Content-Type', 'application/json')
    getTvShows(@Query() query, total = -1): Promise<TvShowList> {
        const offset = parseInt(query.offset) || 0;
        const limit = parseInt(query.limit) || 10;
        return (
            Promise.all([ 
                this.tvSvc.getTvShows({limit: limit, offset: offset}),
                (total <= -1)? this.tvSvc.getTvShowsCount(): Promise.resolve(total)
            ]).then(results => {
                const r = this.tvReferenceToList(results[0]);
                r.offset = offset;
                r.limit = limit;
                r.total = results[1]
                return (r);
            })
        );
    }

    @Get('/count')
    @Header('Content-Type', 'application/json')
    getTvShowCount(): Promise<TvShowCount> {
        return (
            this.tvSvc.getTvShowsCount()
                .then(result => 
                    <TvShowCount>{ 
                        count: result, 
                        timestamp: (new Date()).toUTCString() 
                    }
                )
        );
    }

    @Get('/genres')
    @Header('Content-Type', 'application/json')
    genres(): Promise<GenreList> {
        return (
            this.tvSvc.getGenres()
                .then(result => 
                    <GenreList>{
                        genres: result,
                        timestamp: (new Date()).toUTCString() 
                    }
                )
        )
    }

    @Get('/genre/:genre')
    @Header('Content-Type', 'application/json')
    findTvShowByGenre(@Param('genre') genre): Promise<TvShowList> {
        return (
            this.tvSvc.findTvShowsByGenre(genre)
                .then(result => this.tvReferenceToList(result))
        )
    }

    @Get('/search')
    @Header('Content-Type', 'application/json')
    findTvShowByName(@Query() query): Promise<TvShowList> {

        if (! ('q' in query))
            throw new BadRequestException('Missing search term')

        return (
            this.tvSvc.findTvShowsByName(query.q)
                .then(result => this.tvReferenceToList(result))
        )
    }

    @Get('/:tvid')
    @Header('Content-Type', 'application/json')
    findTvShowByTvid(@Param('tvid') tvid): Promise<TvShowDetail> {
        return (
            this.tvSvc.findTvShowByTvid(parseInt(tvid))
                .then(result => {
                    if (result)
                        return <TvShowDetail>{
                            show: result,
                            timestamp: (new Date()).toUTCString()
                        }
                    throw new NotFoundException(`Tv show ${tvid} not found`)
                })

        )
    }

    private tvReferenceToList(result: TvShowSummary[]): TvShowList {
        return <TvShowList>{
            shows: result.map(v => <TvShowReference>{name: v.name, url: `/api/tv/${v.tvid}`}),
            timestamp: (new Date()).toUTCString()
        }
    }
}
