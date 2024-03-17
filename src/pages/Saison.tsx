import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ReactPlayer from "react-player/lazy";
import styled from "styled-components";
import axios from "axios";
import Config from "../utils/Config";
import watchedLogo from "../assets/watched.png";

type SaisonProps = {
  groupedByEpisodes: any[];
};

export default function Saison({ groupedByEpisodes }: SaisonProps) {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  let url = window.location.pathname;
  let serieName = url.split("/")[2];
  const [data, setData] = useState([]);

  const playerRefs = useRef([]);
  const [videoEnded, setVideoEnded] = useState(false);

  useEffect(() => {
    let season = url.split("/")[3]; // Extraire la saison de l'URL
    let filteredSerie = groupedByEpisodes.filter((element: any) => {
      return element[0].formatedName === serieName;
    });

    if (filteredSerie.length > 0) {
      let temp = filteredSerie[0];
      // temp.filter

      const filtered = temp.filter((p) => p.season === season);
      filtered.sort(function compare(a, b) {
        if (a.episode < b.episode) return -1;
        if (a.episode > b.episode) return 1;
        return 0;
      });
      setData(filtered);
    }
  }, [groupedByEpisodes, url]); // Dépend de l'URL pour filtrer les épisodes correctement

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [readyToPlay, setReadyToPlay] = useState(false);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setReadyToPlay(false); // Reset readyToPlay state
  };

  useEffect(() => {
    if (selectedVideo && readyToPlay) {
      const player = playerRefs.current[data.indexOf(selectedVideo)];
      if (player) {
        player.getInternalPlayer().play();
        setInterval(() => {
          const currentTime = player.getCurrentTime();
          const totalTime = player.getDuration();
          const progressPercentage = (currentTime / totalTime) * 100;
          if (progressPercentage > 95) {
            setVideoEnded(true);
          } else setVideoEnded(false);
          console.log(currentTime);
          console.log(totalTime);
        }, 1000);
      }
    }
  }, [selectedVideo, readyToPlay, data]);

  useEffect(() => {
    const token = localStorage.getItem("iat");
    if (token && selectedVideo && readyToPlay) {
      axios
        .post(Config.postDataVideo, {
          videoName: selectedVideo.name,
          watched: videoEnded,
          token: token,
        })
        .then((response) => {})
        .catch((err) => console.log(err.data.message));
    }
    console.log(videoEnded);
  }, [videoEnded, selectedVideo, readyToPlay]);

  return (
    <Container>
      <div id="all-videos">
        {data.map((episode, index) => (
          <div
            className="video"
            style={{ overflow: "hidden" }}
            key={episode.name}
          >
            {episode.watchedBy.includes(userId) && (
              <img className="watched-logo" src={watchedLogo} alt="" />
            )}
            <ReactPlayer
              onClick={() => handleVideoClick(episode)}
              ref={(player) => (playerRefs.current[index] = player)}
              width={"350px"}
              height={"175px"}
              light
              controls
              url={episode.link}
              onReady={() => {
                if (selectedVideo === episode) {
                  setReadyToPlay(true); // Set readyToPlay to true when video is ready
                }
              }}
              style={{
                backgroundColor: "black",
                backgroundSize: "cover",
                backgroundPosition: "50%  50%",
                backgroundRepeat: "no-repeat",
                borderRadius: "0.4rem",
                overflow: "hidden",
                margin: "auto",
              }}
            />
            <p className="episode">
              {episode.episode} - {episode.episodeNameTMDB}
            </p>
          </div>
        ))}
      </div>
    </Container>
  );
}

// CSS
const Container = styled.div`
  .watched-logo {
    width: 35px;
    position: absolute;
    transform: translate(135px, 5px);
    z-index: 999;
  }

  .episode {
    color: #ffffff;
    font-weight: bold;
    text-align: center;
    background-color: #0000006f;

    padding: 0.5rem 0rem;
    border-radius: 0.25rem;
    max-width: 310px;
    min-height: 30px;
    width: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  #all-videos {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    /* flex-direction: column; */
    flex-wrap: wrap;
    margin-bottom: 6rem;
    margin-top: 4rem;
    gap: 4rem;
  }

  #bck {
    background-image: url("./assets/series/south-park.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    width: 350px;
    height: 195px;
    position: absolute;
    transform: translateY(-100%);
    z-index: -99;
    border-radius: 0.3rem;
  }

  #all-series-films {
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-wrap: wrap;
    height: auto;
    gap: 1rem;
    margin-top: 1rem;
    p {
      color: white;
    }
  }

  #south-park-main {
    width: 350px;
    height: 350px;
    background-image: url("./assets/series/south-park.jpg");
    background-size: 180%;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 0.3rem;
    cursor: pointer;
  }

  .videos {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .video {
    transition: 0.2s;
    &:hover {
      transition: 0.2s;
    }
  }
`;
