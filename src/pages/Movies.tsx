import React, { useContext, useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player/lazy'
import styled from 'styled-components'
import axios from "axios"
import Config from '../utils/Config';

type MovieProps = {
  groupedByMovies: any[];
};

export default function Movies({ groupedByMovies }: MovieProps) {
  const playerRefs = useRef([]);
  let url = window.location.pathname;
  let movieName = url.split('/')[2];
  const filteredMovies = groupedByMovies.filter(p => p.formatedName === movieName)

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [readyToPlay, setReadyToPlay] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);



  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setReadyToPlay(false); // Reset readyToPlay state
  };

  useEffect(() => {
    if (selectedVideo && readyToPlay) {
      const player = playerRefs.current[groupedByMovies.indexOf(selectedVideo)];
      if (player) {
        player.getInternalPlayer().play();

        setInterval(() => {
          const currentTime = player.getCurrentTime();
          const totalTime = player.getDuration()
          const progressPercentage = (currentTime / totalTime) * 100;
          if(progressPercentage > 95){
            setVideoEnded(true)
          }
          else setVideoEnded(false)
        },1000)
      }
    }
  }, [selectedVideo, readyToPlay]);

  useEffect(() => {
    const token = localStorage.getItem('iat')
    if(token && selectedVideo && readyToPlay){
      axios.post(Config.postDataVideo, {
        videoName : filteredMovies[0].name,
        watched : videoEnded,
        token : token
      })
      .then((response) => {
      })
      .catch((err) =>  console.log(err.data.message))
    }
  }, [videoEnded,selectedVideo,readyToPlay])
  

  
  return (
    <Container>
      {groupedByMovies.length > 0 &&
        <div id='all-videos'>
            <div
              className="video"
              style={{ overflow: "hidden" }}
              >
              <ReactPlayer
                onClick={() => handleVideoClick(groupedByMovies[0])}
                ref={(player) => playerRefs.current[groupedByMovies.indexOf(groupedByMovies[0])] = player}
                width={"85vw"}
                height={"35vw"}
                light
                controls
                url={filteredMovies[0].link}
                onReady={() => {
                  setReadyToPlay(true)
                }}
                style={{
                  backgroundColor: "black",
                  backgroundSize: 'cover',
                  backgroundPosition: '54%   50%',
                  backgroundRepeat: 'no-repeat',
                  borderRadius: '0.4rem',
                  overflow: "hidden"
                }}
              />
              <p className="episode">{filteredMovies[0] ? filteredMovies[0].displayName : "Chargement..."}</p>
            </div>
        </div>
       } 
    </Container>
  )
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
    max-width: 310px;
    min-height: 30px;
    width:  100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
#all-videos{
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top : 3rem;

  gap: 4rem;
}
#bck{
background-image: url("./assets/series/south-park.jpg");
background-repeat: no-repeat;
background-size:cover;
width: 350px;
height: 195px;
position: absolute;
transform: translateY(-100%);
z-index: -99;
border-radius: 0.3rem;
}

#all-series-films{
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-wrap: wrap;
  height: auto;
  gap: 1rem;
  margin-top: 1rem;
  p{
    color: white;
  }
}

#south-park-main{
  width: 350px;
  height: 350px;
  background-image: url('./assets/series/south-park.jpg');
  background-size:180%;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 0.3rem;
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

