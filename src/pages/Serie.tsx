import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import groupBy from "lodash.groupby";
import { useEffect, useState } from "react";
import watchedLogo from "../assets/watched.png";

type SerieProps = {
  groupedBySeasons: any;
};

export default function Serie({ groupedBySeasons }: SerieProps) {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const flated = groupedBySeasons.flat();

  let url = window.location.pathname;
  let serieName = url.split("/")[2];
  const filteredSerie = flated.filter((p) => p.formatedName === serieName);

  const saison = groupBy(filteredSerie, "season");
  let temp = [];

  for (let series in saison) {
    temp.push(saison[series]);
  }

  temp.sort(function compare(a, b) {
    if (a[0].season < b[0].season) return -1;
    if (a[0].season > b[0].season) return 1;
    return 0;
  });

  return (
    <Container>
      <div id="all-seasons">
        {temp.map((season, index) => {
          let numberWatchedEpisodes = 0; // Déplacer cette ligne ici pour recalculer le nombre d'épisodes visionnés pour chaque saison
          season.forEach((episode) => {
            if (episode.watchedBy.includes(userId)) {
              numberWatchedEpisodes++;
            }
          });

          return (
            <p
              style={{
                cursor: "pointer",
                fontSize: "2rem",
                textAlign: "center",
              }}
              key={season[0].season}
              onClick={() =>
                navigate(`/serie/${serieName}/${season[0].season}`)
              }
            >
              Season {season[0].season}
              {userId && numberWatchedEpisodes === season.length && (
                <img className="watched-logo" src={watchedLogo} alt="" />
              )}
            </p>
          );
        })}
      </div>
    </Container>
  );
}

// CSS
const Container = styled.div`
  .watched-logo {
    width: 40px;
    position: absolute;
    transform: translate(20px, -7px);
    z-index: 999;
  }

  p {
    cursor: pointer;
    transition: 0.1s;
    &:hover {
      transition: 0.1s;
      font-weight: bold;
    }
  }

  .episode {
    color: #000000;
    font-weight: bold;
    position: absolute;
    transform: translate(35px, -55px);
    background-color: #ffffffb9;
    padding: 0.5rem 1rem;
    border-radius: 0.4rem;
  }

  #all-videos {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-bottom: 6rem;
    margin-top: 4rem;
    gap: 5rem;
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

  #all-seasons {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    /* flex-wrap: wrap; */
    height: 82vh;
    gap: 1rem;
    margin-top: 2rem;
    margin-bottom: 2rem;

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
    display: flex;
    flex-direction: column;
    text-align: center;
  }
`;
