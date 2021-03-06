import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import MoviePage from "../../components/MoviePage/MoviePage";
import Spinner from "../../components/Spinner/Spinner";

function Movie(props) {
	const { movie, similarMovies, genres } = props;
	const router = useRouter();

	if (router.isFallback) {
		return (
			<div>
				<Spinner />
			</div>
		);
	}

	return (
		<>
			<Head>
				<title>{movie.title}...</title>
			</Head>
			<MoviePage data={movie} similarMovies={similarMovies} genresArr={genres} />;
		</>
	);
}

export default Movie;

export async function getStaticPaths(context) {
	// too many paths to pre-render, we set fallback to true https://nextjs.org/docs/basic-features/data-fetching#when-is-fallback-true-useful
	// used fallback: true over fallback: "blocking" to load the page faster from the user's perspective https://nextjs.org/docs/basic-features/data-fetching#fallback-blocking
	return { paths: [], fallback: true };
}

export async function getStaticProps(context) {
	const res1 = axios(
		`https://api.themoviedb.org/3/movie/${context.params.id}?api_key=${process.env.TMDB_API_KEY}&language=${context.locale}`,
	);

	const res2 = axios(
		`https://api.themoviedb.org/3/movie/${context.params.id}/similar?api_key=${process.env.TMDB_API_KEY}&language=${context.locale}&page=1`,
	);

	const res3 = axios(
		`https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.TMDB_API_KEY}&language=${context.locale}`,
	);

	try {
		const [movie, similarMovies, genres] = await Promise.all([res1, res2, res3]);
		return { props: { movie: movie.data, similarMovies: similarMovies.data, genres: genres.data } };
	} catch (error) {
		return {
			notFound: true,
		};
	}
}
