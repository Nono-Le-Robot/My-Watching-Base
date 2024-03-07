import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { SyncLoader } from "react-spinners";
import groupBy from 'lodash.groupby';
import watchedLogo from '../assets/watched.png';

type Movie = {
 id: string;
 name: string;
 img: string;
};

type HomeProps = {
 groupedBySerie: any;
 groupedByMovies: any;
};

export default function Home({ groupedBySerie, groupedByMovies }: HomeProps) {
 const userId = localStorage.getItem('userId');
 const [searchTerm, setSearchTerm] = useState('');
  
 groupedByMovies.sort(function compare(a, b) {
    if (a.displayName < b.displayName) return -1;
    if (a.displayName > b.displayName) return 1;
    return 0;
 });

 groupedBySerie.sort(function compare(a, b) {
    if (a[0].displayName < b[0].displayName) return -1;
    if (a[0].displayName > b[0].displayName) return 1;
    return 0;
 });

 const [data, setData] = useState([]);
 const [images, setImages] = useState({});
 const navigate = useNavigate();
 const [moviesSelected, setMoviesSelected] = useState(false);
 const [loading, setLoading] = useState(true);
 const [movieList, setMovieList] = useState([]);
 const [serieList, setSerieList] = useState([])

 const styleImg = {
    width: "350px",
    height: "500px",
    backgroundSize: "cover",
    backgroundPosition: "54%  50%",
    backgroundRepeat: "no-repeat",
    borderRadius: "0.4rem",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
 };

 const styleImgLoader = {
    width: "350px",
    height: "500px",
    backgroundSize: "cover",
    backgroundPosition: "54%  50%",
    backgroundRepeat: "no-repeat",
    borderRadius: "0.4rem",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
 };

 useEffect(() => {
    let filteredSeries = [];
    if (searchTerm !== '') {
      filteredSeries = groupedBySerie.filter(serie => serie[0].displayName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")));
    } else {
      filteredSeries = [...groupedBySerie];
    }
    setSerieList(filteredSeries);
 }, [searchTerm, groupedBySerie]);

 useEffect(() => {
    let filteredMovies = [];
    if (searchTerm !== '') {
      filteredMovies = groupedByMovies.filter(movie => movie.displayName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")));
    } else {
      filteredMovies = [...groupedByMovies];
    }
    setMovieList(filteredMovies);
 }, [searchTerm, groupedByMovies]);

 useEffect(() => {
    if (groupedBySerie.length > 0) {
      setLoading(false);
      setData(groupBy(groupedBySerie, 'displayName'));
    }
 }, [groupedBySerie, groupedByMovies]);

 const showSeries = () => {
    setMoviesSelected(false);
 };

 const showMovies = () => {
    setMoviesSelected(true);
 };

 return (
    <Container>
      {loading ? (
        <div className="loader">
          <SyncLoader color={"#36D7B7"} loading={loading} size={15} />
        </div>
      ) : (
        <>

          <div id="nav">
            <p className="toggle-series-movies" onClick={showSeries}>
              Series ({groupedBySerie.length})
            </p>
            <p className="toggle-series-movies" onClick={showMovies}>
              Movies ({groupedByMovies.length})
            </p>
          </div>

          <input
            type="text"
            placeholder="Search for a movie..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="input-search"
          />

          {!moviesSelected ? (
            <div id="all-series-films">
              {groupedBySerie ? (
                serieList.map((serie) => (
                 <div
                    style={{ cursor: "pointer" }}
                    key={serie[0].serieName}
                    onClick={() => navigate(`/serie/${serie[0].formatedName}`)}
                 >
                    <div
                      id="div-serie"
                      style={{
                        ...styleImgLoader,
                        backgroundImage: `url(${
                          serie[0].ImageTMDB || "placeholder-loader-url"
                        })`,
                      }}
                    >
                      {images[serie.id] === null && (
                        <SyncLoader
                          color={"#36D7B7"}
                          style={{ margin: "auto" }}
                          loading={true}
                          size={15}
                        />
                      )}
                    </div>
                    <p className="serie-name">{serie[0].displayName}</p>
                 </div>
                ))
              ) : (
                <div className="loader">Loading Series...</div>
              )}
            </div>
          ) : (
            <div id="all-series-films">
              {groupedByMovies ? (
                movieList.map((movie) => (
                 <div
                    style={{ cursor: "pointer" }}
                    key={movie.originalName}
                    onClick={() =>
                      navigate(`/movies/${movie.formatedName}`)
                    }
                 >
                    {movie.watchedBy.includes(userId) &&
                      <img className="watched-logo" src={watchedLogo} alt="" />
                    }
                    <div
                      id="div-serie"
                      style={{
                        ...styleImg,
                        backgroundImage: `url(${movie.ImageTMDB})`,
                      }}
                    />
                    <p className="serie-name">{movie.displayName}</p>
                 </div>
                ))
              ) : (
                <div className="loader">Loading Movies...</div>
              )}
            </div>
          )}
        </>
      )}
    </Container>
 );
}

const Container = styled.div`
.input-search{
    width: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 2rem;
    margin-left: auto;
    margin-right: auto;
    padding: 0.5rem;
    border-radius: 0.5rem;
    text-align: center;
  }

 .watched-logo {
    width: 50px;
    position: absolute;
    transform: translate(295px, 5px);
    z-index: 999;
 }

 .loader {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    font-size: 5rem;
 }

 .toggle-series-movies {
    background-color: #0000006f;
    border-radius: 0.5rem;
    font-size: 1.5rem;
    padding: 1rem;
 }

 #nav {
    margin: auto;
    display: flex;
    align-items: center;
    gap: 10rem;
    justify-content: center;
    p {
      &:hover {
        cursor: pointer;
      }
    }
 }

 .serie-name {
    color: #000000;
    font-weight: bold;
    background-color: #ffffffb9;
    padding: 0.5rem 1rem;
    border-radius: 0.4rem;
    text-align: center;
 }

 #div-serie {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
 }

 #all-series-films {
    margin-bottom: 2rem;
    padding: 1rem;
    padding-top: 4rem;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-wrap: wrap;
    gap: 1rem;
 }

 .videos {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
 }

 .video {
    display: flex;
    flex-direction: column;
    text-align: center;
 }
`;
