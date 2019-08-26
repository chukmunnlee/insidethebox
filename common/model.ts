export interface TvShowSummary {
	tvid: number;
	name: string;
}

export interface Genre {
	genre: string;
	tvid: number;
}

export interface TvShow {
	tvid: number;
	name: string;
	lang: string;
	officialSite: string;
	rating: number;
	image: string;
	summary: string
}
