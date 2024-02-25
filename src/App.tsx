import axios from "axios";
import groupBy from 'lodash.groupby';
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Register from "./pages/Register";
import Login from "./pages/Login";
import Header from './components/Header';
import HeaderLogged from './components/HeaderLogged'
import Serie from "./pages/Serie";
import Saison from "./pages/Saison";
import Movies from "./pages/Movies";

export const DataContext = React.createContext(null);

export default function App() {
  const [data, setData] = useState([]);
  const [groupedBySerie, setGroupedBySerie] = useState([]);
  const [groupedBySeasons, setGroupedBySeasons] = useState({});
  const [groupedByEpisodes, setGroupedByEpisodes] = useState([]);
  const [moviesList, setMoviesList] = useState([])
  const [seriesList, setSeriesList] = useState([])
  const [isLogged, setIsLogged] = useState(false);


  useEffect(() => {
    axios.get('https://my-sharing-base.sanren.fr/backend/get-main-videos').then((response) =>{
      setData([...response.data.files]);
      setMoviesList(response.data.files.filter(p => p.isSerie === false))
      setSeriesList(response.data.files.filter(p => p.isSerie === true))
        const seriesGrouped = groupBy(seriesList, 'serie');
     
        const seriesWithSeasons = {};
        Object.entries(seriesGrouped).forEach(([serie, episodes]: any) => {
          const slug = serie.replace(/\s+/g, "-").toLowerCase();
          const seasons = episodes.reduce((acc, episode) => {
            if (!acc.includes(episode.season)) {
              acc.push(episode.season);
            }
            return acc;
          }, []);
          seriesWithSeasons[slug] = seasons;
        });
        setGroupedBySeasons(seriesWithSeasons);
        // for Season component (return episodes list)
        let episodesByseries = []
        Object.entries(seriesGrouped).forEach(([serie, episodes]: any) => {
          const episodesGrouped = groupBy(episodes, 'season')
          const slug = serie.replace(/\s+/g, "-").toLowerCase();   
          episodesByseries.push({serie : slug , saison :episodesGrouped});
        })
        setGroupedByEpisodes(episodesByseries);
      })


      const token = localStorage.getItem('iat') 
      setIsLogged(token ? true : false);

      }, []);

      useEffect(() =>{
        const groupedList = groupBy(seriesList, "formatedName")
        let temp = []
        for (var serie in groupedList) {
          temp.push(groupedList[serie])
        }
        setGroupedBySerie([...temp])
      },[seriesList, moviesList])

      return (
    <DataContext.Provider value={data}>
      <BrowserRouter>
      {isLogged &&
        <HeaderLogged setIsLogged={setIsLogged} />
      }
      {!isLogged &&
        <Header />
      }
        <Routes>
          <Route path="/serie/:serieName/:number" element={<Saison groupedByEpisodes={groupedBySerie} />} />
          <Route path="/serie/:serieName" element={<Serie groupedBySeasons={groupedBySerie} />} />
          <Route path="/movies/:movieName" element={<Movies groupedByMovies={moviesList}/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setIsLogged={setIsLogged} />} />
          <Route path="/" element={<Home groupedBySerie={groupedBySerie} groupedByMovies={moviesList}/>} />
        </Routes>
      </BrowserRouter>
    </DataContext.Provider>
  );
}
