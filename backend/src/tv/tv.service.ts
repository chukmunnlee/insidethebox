import { Injectable, OnModuleInit, OnModuleDestroy, OnApplicationShutdown } from "@nestjs/common";

import * as mysql from 'mysql';
import { Pool, MysqlError } from 'mysql';

import * as config from '../../../config.json';
import { TvShow, TvShowSummary } from '../../../common/model';

import { mkQuery, Query } from './database';

const SQL_SELECT_TV_SHOWS_SUMMARY = 'select tvid, name from tv_shows limit ? offset ?';
const SQL_SELECT_COUNT_TV_SHOWS = 'select count(*) as show_count from tv_shows';
const SQL_SELECT_TV_SHOWS_BY_NAME = 'select tvid, name from tv_shows where name like ?';
const SQL_SELECT_GENRES = 'select distinct genre from genres;'
const SQL_SELECT_TV_SHOWS_BY_GENRE = 'select tvid from genres where genre like ?'
const SQL_SELECT_TV_SHOWS_NAMES_BY_GENRE = 'select tvid, name from tv_shows where tvid in (?)';
const SQL_SELECT_TV_SHOW_BY_TVID = 'select * from tv_shows where tvid = ?';

@Injectable()
export class TvService implements OnModuleInit, OnModuleDestroy, OnApplicationShutdown {
    
    private pool: Pool;

    private countTvShows: Query;
    private selectTvShowsByName: Query;
    private selectTvShowsSummary: Query;
    private selectTvShowByTvid: Query;
    private selectGenres: Query;
    private selectTvShowsByGenre: Query;
    private selectTvShowsNamesByGenre: Query;

    constructor() { 
        this.pool = mysql.createPool(config.database)

        this.selectTvShowsSummary = mkQuery(SQL_SELECT_TV_SHOWS_SUMMARY, this.pool);
        this.countTvShows = mkQuery(SQL_SELECT_COUNT_TV_SHOWS, this.pool);
        this.selectTvShowsByName = mkQuery(SQL_SELECT_TV_SHOWS_BY_NAME, this.pool);
        this.selectTvShowByTvid = mkQuery(SQL_SELECT_TV_SHOW_BY_TVID, this.pool);
        this.selectGenres = mkQuery(SQL_SELECT_GENRES, this.pool);
        this.selectTvShowsByGenre = mkQuery(SQL_SELECT_TV_SHOWS_BY_GENRE, this.pool);
        this.selectTvShowsNamesByGenre = mkQuery(SQL_SELECT_TV_SHOWS_NAMES_BY_GENRE, this.pool);
    }

    getTvShows(params = { limit: 20, offset: 0 }): Promise<TvShowSummary[]> {
        return (
            this.selectTvShowsSummary([ params.limit || 20, params.offset || 0])
        );
    }

    getGenres(): Promise<string[]> {
        return (
            this.selectGenres()
                .then((result: any[]) => result.map(v => v.genre))
        );
    }

    findTvShowsByGenre(genre: string): Promise<TvShowSummary[]> {
        return (
            this.selectTvShowsByGenre([ genre ])
                .then((result: any[]) => result.map(v => v.tvid))
                .then(result => this.selectTvShowsNamesByGenre([ result ]))
        );
    }

    findTvShowsByName(name: string): Promise<TvShowSummary[]> {
        return (
            this.selectTvShowsByName([ `%${name}%`] )
        );
    }

    findTvShowByTvid(tvid: number): Promise<TvShow> {
        return (
            this.selectTvShowByTvid([ tvid ])
                .then(result => {
                    if (result.length)
                        return (<TvShow>result[0])
                    return (null);
                })
        );
    }

    getTvShowsCount(): Promise<number> {
        return (
            this.countTvShows()
                .then(result => {
                    return (<number>result[0].show_count);
                })
        );
    }

    onModuleInit(): Promise<void> {
        console.info(`Waiting for database to be ready: ${config.waitTime} seconds`);
        return (
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve()
                }, config.waitTime * 1000)
            })
            .then(() => {
                console.info('Creating connection pool')
                this.pool.getConnection((err: MysqlError, conn) => {
                    if (err) {
                        console.error('Cannot connect to database: ', err)
                        return (Promise.reject());
                    }
                    conn.ping((err) => {
                        conn.release();
                        if (err) {
                            console.error('Cannot ping database: ', err)
                            return (Promise.reject())
                        }
                        console.info('Created connection pool')
                        return (Promise.resolve());
                    })
                })
            })
        );
    }

    onModuleDestroy() {
        console.info('Terminating connection pool')
        this.pool.end((err: MysqlError) => {
            if (err) 
                return console.error('Error when closing connection pool: ', err)
            console.info('Terminated connection pool');
        })
    }

    onApplicationShutdown() {
        this.onModuleDestroy();
    }

}