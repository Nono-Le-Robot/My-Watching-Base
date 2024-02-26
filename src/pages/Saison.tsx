import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player/lazy';
import styled from 'styled-components';

type SaisonProps = {
  groupedByEpisodes: any[];
};


export default function Saison({ groupedByEpisodes }: SaisonProps) {
  const navigate = useNavigate();
  let url = window.location.pathname;
  let serieName = url.split('/')[2];
  const [data, setData] = useState([]);

  const playerRefs = useRef([]);

  useEffect(() => {
    let season = url.split('/')[3]; // Extraire la saison de l'URL
    let filteredSerie = groupedByEpisodes.filter((element: any) => {
      return element[0].formatedName === serieName;
    });

    if (filteredSerie.length >  0) {
      let temp = filteredSerie[0];
      // temp.filter
      
      const filtered = temp.filter(p => p.season === season)
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
      }
    }
  }, [selectedVideo, readyToPlay, data]);

  return (
    <Container>
      <div id='all-videos'>
        {data.map((episode, index) => (
          <div
            className="video"
            style={{ overflow: "hidden" }}
            key={episode.name}
          >
            <ReactPlayer
              onClick={() => handleVideoClick(episode)}
              ref={(player) => playerRefs.current[index] = player}
              width={"85vw"}
              height={"35vw"}
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
                backgroundSize: 'cover',
                backgroundPosition: '50%  50%',
                backgroundRepeat: 'no-repeat',
                borderRadius: '0.4rem',
                overflow: "hidden",
                margin: "auto",
              }}
              
            />
              <p className="episode">{episode.episode} - {episode.episodeNameTMDB}</p>

          </div>
        ))}
      </div>
    </Container>
  );
}

// CSS
const Container = styled.div`
  .episode{
    color: #000000;
    font-weight: bold;
    text-align:center;
    background-color: #ffffffb9;
    padding:  0.5rem  0rem;
    border-radius:  0.25rem;
    max-width:  90vw;
    width:  100%;
    overflow: hidden;
  }

  #all-videos{
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    /* flex-direction: column; */
    flex-wrap: wrap;
    margin-bottom:  6rem;
    margin-top :  4rem;
    gap:  4rem;
  }

  #bck{
    background-image: url("./assets/series/south-park.jpg");
    background-repeat: no-repeat;
    background-size:cover;
    width:  350px;
    height:  195px;
    position: absolute;
    transform: translateY(-100%);
    z-index: -99;
    border-radius:  0.3rem;
  }

  #all-series-films{
    padding:  1rem;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-wrap: wrap;
    height: auto;
    gap:  1rem;
    margin-top:  1rem;
    p{
      color: white;
    }
  }

  #south-park-main{
    width:  350px;
    height:  350px;
    background-image: url('./assets/series/south-park.jpg');
    background-size:180%;
    background-position: center;
    background-repeat: no-repeat;
    border-radius:  0.3rem;
    cursor: pointer;
  }

  .videos{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap:1rem;
  }

  .video{
    transition:0.2s;
    &:hover{
      transition:0.2s;
    }
  }
`;
