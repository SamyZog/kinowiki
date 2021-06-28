import React, { useRef, useState } from "react";
import { Arrow } from "../../../public/icons/app";
import CustomLink from "../CustomLink/CustomLink";
import MovieSliderCard from "../MovieSliderCard/MovieSliderCard";
import styles from "./Slider.module.scss";

function Slider(props) {
	const { data } = props;
	const [slide, setSlide] = useState(0);

	const windowRef = useRef(null);

	const getNextSLide = () => {
		setSlide((state) => {
			if (state === data.length - 1) {
				return 0;
			}
			return state + 1;
		});
	};

	const getPreviousSLide = () => {
		setSlide((state) => {
			if (state === 0) {
				return data.length - 1;
			}
			return state - 1;
		});
	};

	return (
		<div className={styles.Slider}>
			<div className={styles.Slider__window} ref={windowRef}>
				<button className={styles.Slider__prevbtn} onClick={getPreviousSLide}>
					<Arrow />
				</button>
				<ul
					className={styles.Slider__strip}
					style={{
						width: `calc(${data.length} * 100%)`,
						transform: `translateX(-${windowRef.current && windowRef.current.offsetWidth * slide}px)`,
					}}>
					{data.map((movie) => {
						const {
							backdrop_path,
							id,
							poster_path,
							original_title,
							title,
							overview,
							release_date,
							vote_average,
							vote_count,
						} = movie;

						return (
							<li
								className={styles.Slider__slide}
								key={id}
								style={{
									width: `calc(100% / ${data.length})`,
									backgroundImage: `url(https://image.tmdb.org/t/p/w1280${backdrop_path})`,
								}}>
								<CustomLink href={`/movie/${id}`} passHref>
									<MovieSliderCard
										bg={backdrop_path}
										poster={poster_path}
										title={original_title}
										altTitle={title}
										overview={overview}
										date={new Date(release_date).getFullYear()}
										avg={vote_average}
										count={vote_count}
									/>
								</CustomLink>
							</li>
						);
					})}
				</ul>
				<button className={styles.Slider__nextbtn} onClick={getNextSLide}>
					<Arrow />
				</button>
			</div>
		</div>
	);
}

export default Slider;
