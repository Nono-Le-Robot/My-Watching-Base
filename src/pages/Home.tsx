import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { SyncLoader } from "react-spinners";
import groupBy from "lodash.groupby";
import watchedLogo from "../assets/watched.png";
import axios from "axios";
import Config from "../utils/Config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const userId = localStorage.getItem("userId");
  const [searchTerm, setSearchTerm] = useState("");

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
  const [serieList, setSerieList] = useState([]);
  const [showAddRequestModal, setShowAddRequestModal] = useState(false);
  const [requestInProgress, setRequestInProgress] = useState(false);
  const [addRequestData, setAddRequestData] = useState({
    name: "",
    year: "",
    info: "",
  });

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
    if (searchTerm !== "") {
      filteredSeries = groupedBySerie.filter((serie) =>
        serie[0].displayName
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(
            searchTerm
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
          )
      );
    } else {
      filteredSeries = [...groupedBySerie];
    }
    setSerieList(filteredSeries);
  }, [searchTerm, groupedBySerie]);

  useEffect(() => {
    let filteredMovies = [];
    if (searchTerm !== "") {
      filteredMovies = groupedByMovies.filter((movie) =>
        movie.displayName
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(
            searchTerm
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
          )
      );
    } else {
      filteredMovies = [...groupedByMovies];
    }
    setMovieList(filteredMovies);
  }, [searchTerm, groupedByMovies]);

  useEffect(() => {
    if (groupedBySerie.length > 0) {
      setLoading(false);
      setData(groupBy(groupedBySerie, "displayName"));
    }
  }, [groupedBySerie, groupedByMovies]);

  const showSeries = () => {
    setMoviesSelected(false);
  };

  const showMovies = () => {
    setMoviesSelected(true);
  };

  const handleShowAddRequestModal = () => {
    setShowAddRequestModal(true);
  };

  const handleChange = (event) => {
    setAddRequestData({
      ...addRequestData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSendAddRequest = () => {
    if (addRequestData.name === "") {
      toast.error("Please enter movie/serie name.", {
        position: "bottom-right",
        autoClose: 3000,
        pauseOnHover: false,
        draggable: false,
        theme: "dark",
      });
      return;
    }

    if (!requestInProgress) {
      setRequestInProgress(true);
      axios
        .post(Config.requestNewMovieOrSerie, addRequestData)
        .then((response) => {
          setRequestInProgress(false);
          setShowAddRequestModal(false);
          setAddRequestData({
            name: "",
            year: "",
            info: "",
          });

          toast.success("Request sent with success !", {
            position: "bottom-right",
            autoClose: 3000,
            pauseOnHover: false,
            draggable: false,
            theme: "dark",
          });
        })
        .catch((err) => {
          console.log(err.data.message);
          setRequestInProgress(false);
          setAddRequestData({
            name: "",
            year: "",
            info: "",
          });
          toast.error("Error, please try later...", {
            position: "bottom-right",
            autoClose: 3000,
            pauseOnHover: false,
            draggable: false,
            theme: "dark",
          });
        });
    }
  };

  return (
    <>
      <Container>
        {loading ? (
          <div className="loader">
            <SyncLoader color={"#36D7B7"} loading={loading} size={15} />
          </div>
        ) : (
          <>
            {!showAddRequestModal && (
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
                          onClick={() =>
                            navigate(`/serie/${serie[0].formatedName}`)
                          }
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
                          {movie.watchedBy.includes(userId) && (
                            <img
                              className="watched-logo"
                              src={watchedLogo}
                              alt=""
                            />
                          )}
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
            {!showAddRequestModal && (
              <div
                id="request-movie-or-series"
                onClick={handleShowAddRequestModal}
              >
                Request Movie / Serie
              </div>
            )}
            {showAddRequestModal && (
              <div id="request-new-modal">
                <div id="inputs-modal-new">
                  <input
                    name="Movie name"
                    className="input-modal-new"
                    type="text"
                    placeholder="Name"
                    onChange={(e) => handleChange(e)}
                  ></input>
                  <input
                    name="year"
                    className="input-modal-new"
                    type="text"
                    placeholder="Year of production (optional)"
                    onChange={(e) => handleChange(e)}
                  ></input>

                  <textarea
                    name="info"
                    className="input-area-modal-new"
                    id=""
                    cols={30}
                    rows={10}
                    placeholder="Informations (optional)"
                    onChange={(e) => handleChange(e)}
                  ></textarea>
                </div>

                <div id="btn-modal-new">
                  <div
                    id="cancel-btn-new-modal"
                    onClick={() => {
                      setShowAddRequestModal(false);
                      setRequestInProgress(false);
                      setAddRequestData({
                        name: "",
                        year: "",
                        info: "",
                      });
                    }}
                  >
                    Cancel
                  </div>
                  <div id="send-btn-new-modal" onClick={handleSendAddRequest}>
                    Send Request
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </Container>
      <ToastContainer />
    </>
  );
}

const Container = styled.div`
  #send-btn-new-modal,
  #cancel-btn-new-modal {
    margin-left: auto;
    margin-right: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 40px;
    width: 150px;
    height: 50px;
    border: 1px solid black;
    border-radius: 0.4rem;
    font-size: 1rem;
    padding: 5px;
    &:hover {
      cursor: pointer;
    }
  }

  #send-btn-new-modal {
    background-color: #01770197;
  }

  #cancel-btn-new-modal {
    background-color: #751d0292;
  }

  .input-modal-new,
  .input-area-modal-new {
    width: 320px;
    text-align: center;
    padding: 1rem;
    border-radius: 0.4rem;
    border: 1px solid black;
    color: white;
    background-color: #0000006f;
    &::placeholder {
      color: #ffffff;
      opacity: 1; /* Firefox */
    }
  }
  #btn-modal-new {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
  }
  #inputs-modal-new {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 2rem;
  }
  #request-new-modal {
    background-image: linear-gradient(45deg, #5f0128, rgb(129, 3, 13));
    border: 1px solid black;
    box-shadow: 0px 0px 50px #0000002f;

    padding: 4rem;
    width: auto;
    height: auto;
    position: absolute;
    top: 55vh;
    left: 50vw;
    transform: translate(-50%, -50%);
    border-radius: 0.5rem;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  #request-movie-or-series {
    margin-left: auto;
    margin-right: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #0000006f;
    margin-top: 40px;
    margin-bottom: 40px;
    width: 300px;
    height: 50px;
    border-radius: 0.4rem;
    font-size: 1.1rem;
    padding: 10px;
    /* margin-bottom: 8rem; */
    &:hover {
      cursor: pointer;
    }
  }

  .input-search {
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

  @media screen and (max-width: 650px) {
    .input-modal-new,
    .input-area-modal-new {
      width: 220px;
    }
    #btn-modal-new {
      /* flex-direction: column; */
      /* background-color: red; */
      /* flex-direction: column-reverse; */
      gap: 1rem;
    }

    #send-btn-new-modal,
    #cancel-btn-new-modal {
      font-size: 0.8rem;
      padding: 0.5rem;
      width: 100px;
      height: 40px;
    }

    #request-new-modal {
      background-image: linear-gradient(
        45deg,
        rgba(129, 3, 13, 0),
        rgba(129, 3, 13, 0)
      );
      border: none;
      box-shadow: none;
    }
  }
`;
