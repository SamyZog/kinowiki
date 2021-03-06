import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { v4 } from "uuid";
import { Close, Loupe } from "../../../public/icons/app";
import { useText } from "../../context/TextProvider";
import DropDown from "../DropDown/DropDown";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import styles from "./Search.module.scss";

function Search(props) {
	const { text } = useText();
	const { locale } = useRouter();
	const options = ["movies", "actors"];
	const [currentOption, setCurrentOption] = useState("movie");
	const [open, setOpen] = useState(false);
	const [index, setIndex] = useState(0);
	const [dataLength, setDataLength] = useState(-1);

	const [inputVal, setInputVal] = useState("");
	const optionsText = [text.placeholders.options.movies, text.placeholders.options.actors];

	const listRef = useRef(null);
	const inputRef = useRef(null);

	const { data, error } = useSWR(
		inputVal.length > 0
			? `https://api.themoviedb.org/3/search/${currentOption}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=${locale}&query=${inputVal}&page=1&include_adult=false`
			: null,
		(url) => axios(url).then((res) => res.data),
	);

	useEffect(() => {
		if (open && inputVal.length > 0) {
			return;
		} else if (inputVal.length > 0) {
			setOpen(true);
		} else {
			setOpen(false);
		}
	}, [inputVal]);

	useEffect(() => {
		if (index < -1) {
			setIndex(dataLength);
		} else if (index > dataLength) {
			setIndex(-1);
		}

		if (index === -1) {
			inputRef.current?.focus();
		} else {
			listRef.current?.children[index]?.querySelector("a").focus();
		}
	}, [index]);

	useEffect(() => {
		const length = data?.total_results > 10 ? 10 : data?.total_results - 1;
		setDataLength(length);
	}, [data]);

	const clearInput = () => {
		setInputVal("");
	};

	const setOption = (option) => {
		setCurrentOption(option === "movies" ? "movie" : "person");
	};

	return (
		<div className={styles.Search}>
			<div className={styles.Search__dropdown}>
				<DropDown
					options={options}
					currentOption={
						currentOption === "person" ? text.placeholders.options.actors : text.placeholders.options.movies
					}
					render={(height) => {
						return options.map((option, i) => {
							return (
								<button onClick={setOption.bind(null, option)} key={v4()} style={{ height }}>
									{optionsText[i]}
								</button>
							);
						});
					}}
				/>
			</div>
			<div className={styles.Search__searchbar}>
				<SearchBar
					inputVal={inputVal}
					currentOption={currentOption}
					ref={inputRef}
					setInputVal={setInputVal}
					setOpen={setOpen}
				/>
				<button className={styles.Search__search}>
					<Loupe />
				</button>
				<button className={styles.Search__clear} onClick={clearInput}>
					<Close />
				</button>
				{open && (
					<SearchResults
						setIndex={setIndex}
						data={data}
						error={error}
						option={currentOption}
						setOpen={setOpen}
						inputVal={inputVal}
						clearInput={clearInput}
						ref={listRef}
					/>
				)}
			</div>
		</div>
	);
}

export default Search;
