import axios from 'axios';
import React, { useContext, useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player/lazy'
import styled from 'styled-components'
import Config from '../utils/Config';

// type MovieProps = {
//   groupedByMovies: any[];
// };
// { groupedByMovies }: MovieProps
export default function Storage() {
  const [data, setData] = useState([])

  useEffect(() => {
    axios.post(Config.getUserFiles, {
      token : localStorage.getItem('iat')
    }).then((response) =>{
      const files = response.data.files
      const temp = []
      files.forEach(file => {
        const videoType = ["video/mp4", "video/x-matroska", "video/avi", "video/mov", "video/flv"];
        const isVideo = videoType.includes(file.format) ? true : false
        if(isVideo){
          let phraseCapitalisee = file.formatedName.replace(/-/g, ' ');
          const mots = phraseCapitalisee.split(" ");
          const motsCapitalises = mots.map(mot => mot.charAt(0).toUpperCase() + mot.slice(1).toLowerCase());
          const formatedMovieName = motsCapitalises.join(" ");
          file.formatedName = formatedMovieName
          temp.push(file)
        }
      });
      setData([...temp])
    })  
    
    }, [])
    
  

  useEffect(() => {
    console.log("doof data",data);
  }, [data])
  
  
  const playerRefs = useRef([]);
  let url = window.location.pathname;
  let movieName = url.split('/')[2];
  const filteredMovies = data.filter(p => p.formatedName === movieName)

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
  }, [selectedVideo, readyToPlay]);

  
  return (
    <Container>
      {data.length > 0 &&
    <div id='all-videos'>
      {data.map((video, index) => (
        <div
          className="video"
          style={{ overflow: "hidden" }}
          key={video.name}
        >
          <ReactPlayer
            onClick={() => handleVideoClick(video)}
            ref={(player) => playerRefs.current[index] = player}
            width={"354px"}
            height={"199px"}
            light
            controls
            url={video.link}
            onReady={() => {
              if (selectedVideo === video) {
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
            {video.isMovie || video.isSerie ?
            (
            <p className="episode">{video.episode} - {video.episodeNameTMDB}</p>
            )
            :
            (
              <p className="episode">{video.formatedName.replace(/-/g, ' ')}</p>
            )
          }


        </div>
      ))}
    </div>
    }
  </Container>
  )
}

{/* <p className="episode">{filteredMovies[0] ? filteredMovies[0].formatedMovieName : "Chargement..."}</p> */}
// CSS
const Container = styled.div`

.episode{
  color: #000000;
  font-weight: bold;
  text-align:center;
  background-color: #ffffffb9;
  padding: 0.5rem 1rem;
   border-radius: 0.4rem;
}

#all-videos{
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 6rem;
  margin-top : 4rem;

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
    transform: scale(1.01);
    transition:0.2s;
  }
}
`;

