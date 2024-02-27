import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { SyncLoader } from "react-spinners";
import groupBy from 'lodash.groupby'

type Serie = {
  id: string;
  name: string;
  img: string;
};

type HomeProps = {
  groupedBySerie: any;
  groupedByMovies: any;
};

export default function Home({ groupedBySerie, groupedByMovies }: HomeProps) {
  
  groupedByMovies.sort(function compare(a, b) {
    if (a.formatedMovieName < b.formatedMovieName)
    return -1;
  if (a.formatedMovieName > b.formatedMovieName)
  return  1;
return  0;
});

groupedBySerie.sort(function compare(a, b) {
  if (a[0].serieName < b[0].serieName)
  return -1;
if (a[0].serieName > b[0].serieName)
return  1;
return  0;
});
  const [data, setData] = useState([]);
  const [images, setImages] = useState({});
  const navigate = useNavigate();
  const [moviesSelected, setMoviesSelected] = useState(false);
  const [loading, setLoading] = useState(true);

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
    if (groupedBySerie.length >  0) {
      setLoading(false);
      // Utilisez directement le résultat de groupBy sans l'envelopper dans un nouveau tableau
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
          {!moviesSelected ? (
            <div id="all-series-films">
              {groupedBySerie ? (
                groupedBySerie.map((serie) => (
                  
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
                        })`, // Utilisez une URL de loader ou une image de chargement
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
                    <p className="serie-name">{serie[0].formatedName}</p>
                  </div>
                ))
              ) : (
                <div className="loader">Loading Series...</div>
              )}
            </div>
          ) : (
            <div id="all-series-films">
              {groupedByMovies ? (
                groupedByMovies.map((movie) => (
                  <div
                    style={{ cursor: "pointer" }}
                    key={movie.originalName}
                    onClick={() =>
                      navigate(`/movies/${movie.formatedName}`)
                    }
                  >
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

// CSS
const Container = styled.div`
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
    p{
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
