import { TvShow } from './model';

export interface TvShowReference {
	name: string;
	url: string;
}

export interface TvShowCount {
	count: number;
	timestamp: string;
}

export interface TvShowList {
	shows: TvShowReference[];
	timestamp: string;
	offset?: number;
	limit?: number;
	total?: number;
}

export interface GenreList {
	genres: string[];
	timestamp: string;
}

export interface TvShowDetail {
	show: TvShow;
	timestamp: string;
}

export interface Health {
	status: string;
	timestamp: string;
}

export type ResponseType = TvShowCount | TvShowList | TvShowReference | GenreList | TvShowDetail | Health
