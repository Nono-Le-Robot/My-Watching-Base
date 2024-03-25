import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
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

  const statusMapping = {
    0: "Pending",
    1: "Download",
    2: "Compress",
    3: "Upload",
  };

  const nameRef = useRef();

  const [data, setData] = useState([]);
  const [images, setImages] = useState({});
  const navigate = useNavigate();
  const [moviesSelected, setMoviesSelected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [movieList, setMovieList] = useState([]);
  const [serieList, setSerieList] = useState([]);
  const [showAddRequestModal, setShowAddRequestModal] = useState(false);
  const [showChangeNameModal, setShowChangeNameModal] = useState(false);

  const [requestInProgress, setRequestInProgress] = useState(false);
  const [userToken, setUserToken] = useState("");
  const [requestQueue, setRequestQueue] = useState(null);
  const [requestRejected, setRequestRejected] = useState(null);
  const [requestFinished, setRequestFinished] = useState(null);
  const [showQueue, setShowQueue] = useState(false);
  const [showRejected, setShowRejected] = useState(false);
  const [showFinished, setShowFinished] = useState(false);
  const [newName, setNewName] = useState("");
  const [newImage, setNewImage] = useState("");
  const [gender, setGender] = useState("");

  const [prevName, setPrevName] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const [prevGender, setPrevGender] = useState("");

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [userId, setUserId] = useState(localStorage.getItem("iat"));
  const [addRequestData, setAddRequestData] = useState({
    name: "",
    year: "",
    info: "",
    token: localStorage.getItem("iat"),
  });

  useEffect(() => {
    const token = localStorage.getItem("iat");
    const userId = localStorage.getItem("userId");

    console.log(token);
    if (token) {
      setUserToken(token);
      setUserId(userId);
    }
  }, []);

  const styleImg = {
    width: "330px",
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
    width: "330px",
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
    if (userToken !== "") {
      axios
        .get(Config.getRequestQueue)
        .then((response) => {
          console.log(response.data);
          const queue = response.data.filter((p) => p.__v !== 4);
          const finished = response.data.filter((p) => p.__v === 4);
          setRequestQueue(queue.filter((p) => p.__v !== -2));
          setRequestRejected(queue.filter((p) => p.__v === -2));
          setRequestFinished(finished);

          setShowAddRequestModal(true);
        })
        .catch((err) => {
          console.log(err.data);
        });
    } else {
      navigate("/login");
    }
  };

  const handleShowChangeNameModal = (event, index) => {
    console.log(index);
    event.stopPropagation();
    const allFilmsQuerySelector = document.querySelectorAll(".serie-name");

    setShowChangeNameModal(true);

    setPrevName(allFilmsQuerySelector[index].textContent);
    setPrevImage("New image URL");
    setPrevGender("Gender");

    setSelectedIndex(index);
  };

  useEffect(() => {
    if (showChangeNameModal) {
      const inputImage = document.getElementById("input-change-image");
      const inputName = document.getElementById("input-change-name");
      const inputGender = document.getElementById("input-change-gender");

      if (inputName && inputImage && inputGender) {
        inputImage.setAttribute("placeholder", "New Image");
        inputGender.setAttribute("placeholder", "New Gender");
        inputName.setAttribute("placeholder", "New Name");
      }
    }
  }, [showChangeNameModal]);

  const handleChange = (event) => {
    setAddRequestData({
      ...addRequestData,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeName = (event) => {
    setNewName(event);
  };
  const handleChangeGender = (event) => {
    setGender(event);
  };
  const handleChangeImage = (event) => {
    setNewImage(event);
  };

  const handleClickChangeName = () => {
    axios
      .post(Config.changeName, {
        prevName: prevName,
        newName: newName,
        newImage: newImage,
        gender: gender,
      })
      .then((response) => {
        setNewName("");
        toast.success("Name Changed !", {
          position: "bottom-right",
          autoClose: 3000,
          pauseOnHover: false,
          draggable: false,
          theme: "dark",
        });
        const allFilmsQuerySelector = document.querySelectorAll(".serie-name");
        if (newName !== "") {
          allFilmsQuerySelector[selectedIndex].textContent = newName;
        }
        if (newImage !== "") {
          window.location.reload();
        }
      })

      .catch((err) => {
        console.log(err.data);
        setNewName("");

        toast.error("Error, please try later...", {
          position: "bottom-right",
          autoClose: 3000,
          pauseOnHover: false,
          draggable: false,
          theme: "dark",
        });
      });
    setShowChangeNameModal(false);
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
            token: userToken,
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
          console.log(err.data);
          setRequestInProgress(false);
          setAddRequestData({
            name: "",
            year: "",
            info: "",
            token: userToken,
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
            {showChangeNameModal && (
              <div id="modal-change-name">
                <input
                  autoComplete="nope"
                  id="input-change-image"
                  type="text"
                  name=""
                  placeholder=""
                  onChange={(event) => handleChangeImage(event.target.value)}
                ></input>
                <input
                  autoComplete="nope"
                  id="input-change-name"
                  type="text"
                  name=""
                  placeholder=""
                  onChange={(event) => handleChangeName(event.target.value)}
                ></input>
                <input
                  autoComplete="nope"
                  id="input-change-gender"
                  type="text"
                  name=""
                  placeholder=""
                  onChange={(event) => handleChangeGender(event.target.value)}
                ></input>
                <div id="div-btn-change-name">
                  <button
                    id="cancel-new-name-btn"
                    onClick={() => setShowChangeNameModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    id="save-new-name-btn"
                    onClick={handleClickChangeName}
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
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
                  autoComplete="nope"
                  type="text"
                  placeholder="Search for a movie..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="input-search"
                />
                {/* <label htmlFor="pet-select">:</label> */}

                {/* <select
                  onChange={(event) => {
                    let selectedGender = "";
                    selectedGender = event.target.value;
                    let filteredMoviesByGender = groupedByMovies.filter(
                      (movie) => movie.gender.includes(selectedGender)
                    );
                    setMovieList(filteredMoviesByGender); // Mettez à jour l'état ou la variable contenant la liste des films filtrés
                    let filteredSeriesByGender = groupedBySerie.filter(
                      (serie) => serie[0].gender.includes(selectedGender)
                    );
                    setSerieList(filteredSeriesByGender); // Mettez à jour l'état ou la variable contenant la liste des films filtrés
                  }}
                  name="genders"
                  className="input-search"
                  id="gender-select"
                >
                  <option value="">-- Select Genre --</option>
                  <option value="Action">Action</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Animation">Animation</option>
                  <option value="Comedy">Comedy</option>
                  <option value="Crime">Crime</option>
                  <option value="Documentary">Documentary</option>
                  <option value="Drama">Drama</option>
                  <option value="Family">Family</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="History">History</option>
                  <option value="Horror">Horror</option>
                  <option value="Movie">Movie</option>
                  <option value="Music">Music</option>
                  <option value="Mystery">Mystery</option>
                  <option value="Romance">Romance</option>
                  <option value="Science Fiction">Science Fiction</option>
                  <option value="Thriller">Thriller</option>
                  <option value="War">War</option>
                  <option value="Western">Western</option>
                </select> */}

                {/* <div id="hide-already-played">
                  <input
                    onChange={(event) => {
                      let originalMovieList = movieList;
                      if (event.target.checked) {
                        let movieTemp = [];

                        console.log(serieList[0][0].watchedBy);
                        movieList.forEach((movie) => {
                          if (
                            !movie.watchedBy.includes(
                              "65e99fdbd10089db3b8f20a7"
                            )
                          ) {
                            movieTemp.push(movie);
                          }
                        });
                        setMovieList(movieTemp);
                      } else {
                        setMovieList(groupedByMovies);
                      }
                    }}
                    type="checkbox"
                    name=""
                    id="check"
                  />
                  <label htmlFor="check">Hide already played</label>
                </div> */}

                {!moviesSelected ? (
                  <div id="all-series-films">
                    {groupedBySerie ? (
                      serieList.map((serie, index) => (
                        <div
                          style={{ cursor: "pointer" }}
                          key={serie[0].name}
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
                          {/* {userId === "65de0680cfabed396d4585cc" ||
                            (userId === "65eed342c89e9be8f16630c2" && ( */}
                          {userId === "65eed342c89e9be8f16630c2" && (
                            <>
                              <img
                                id="btn-change-name"
                                onClick={(event) =>
                                  handleShowChangeNameModal(event, index)
                                }
                                src="/edit.png"
                                alt=""
                              />
                              <p style={{ textAlign: "center" }}>
                                {serie[0].gender}
                              </p>
                            </>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="loader">Loading Series...</div>
                    )}
                  </div>
                ) : (
                  <div id="all-series-films">
                    {groupedByMovies ? (
                      movieList.map((movie, index) => (
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
                          {userId === "65eed342c89e9be8f16630c2" && (
                            <>
                              <img
                                id="btn-change-name"
                                onClick={(event) =>
                                  handleShowChangeNameModal(event, index)
                                }
                                src="/edit.png"
                                alt=""
                              />
                              {/* <p style={{ textAlign: "center" }}>
                                {movie.gender}
                              </p> */}
                            </>
                          )}
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
                  <p style={{ color: "#f7ffaf", textAlign: "center" }}>
                    Try to be precise as possible. Requests that are not
                    sufficiently precise will not be processed.
                  </p>
                  <input
                    autoComplete="nope"
                    name="name"
                    className="input-modal-new"
                    type="text"
                    placeholder="Movie/Serie name"
                    onChange={(e) => handleChange(e)}
                  ></input>
                  <input
                    autoComplete="nope"
                    name="year"
                    className="input-modal-new"
                    type="text"
                    placeholder="Year of production (optional)"
                    onChange={(e) => handleChange(e)}
                  ></input>

                  <textarea
                    name="info"
                    autoComplete="nope"
                    className="input-area-modal-new"
                    id=""
                    cols={30}
                    rows={10}
                    placeholder="Informations (optional)"
                    onChange={(e) => handleChange(e)}
                  ></textarea>
                </div>

                <div
                  id="show-queue-btn"
                  onClick={() => setShowQueue(!showQueue)}
                >
                  Show/hide processing queue
                </div>

                {showQueue && (
                  <div className="list-item-show-hide">
                    {requestQueue
                      .filter((item) => item.processed) // Filtre les éléments traités
                      .map((item) => (
                        <li
                          style={{
                            marginBottom: "0.7rem",
                            marginTop: "0.7rem",
                          }}
                        >
                          {item.name} ==== {statusMapping[item.__v] || item.__v}
                        </li>
                      ))}
                  </div>
                )}

                {/* <div
                  id="show-finished-btn"
                  onClick={() => setShowFinished(!showFinished)}
                >
                  Show/hide finished request
                </div>

                {showFinished && (
                  <div className="list-item-show-hide">
                    {requestFinished.map((finished) => (
                      <li
                        style={{ marginBottom: "0.7rem", marginTop: "0.7rem" }}
                      >
                        {finished.name}
                      </li>
                    ))}
                  </div>
                )} */}

                <div
                  id="show-rejected-btn"
                  onClick={() => setShowRejected(!showRejected)}
                >
                  Show/hide rejected request
                </div>

                {showRejected && (
                  <div className="list-item-show-hide">
                    {requestRejected.map((rejected) => (
                      <li
                        style={{ marginBottom: "0.7rem", marginTop: "0.7rem" }}
                      >
                        {rejected.name} ==== {rejected.details}
                      </li>
                    ))}
                  </div>
                )}

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
                        token: userToken,
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
  #hide-already-played {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
  }
  label {
    cursor: pointer;
  }

  input[type="checkbox"] {
    height: 20px;
    width: 20px;
    cursor: pointer;
  }

  #btn-change-name {
    width: 20px;
    position: relative;
    top: -115px;
    left: 150px;
    padding: 0.5rem;
    background-color: #ffffff68;
    border-radius: 100%;
  }
  #save-new-name-btn {
    margin-left: auto;
    margin-right: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 50px;
    border: 1px solid black;
    border-radius: 0.4rem;
    font-size: 1rem;
    padding: 5px;
    background-color: #f0fc8794;
    color: black;

    text-align: center;

    &:hover {
      cursor: pointer;
    }
  }

  #cancel-new-name-btn {
    margin-left: auto;
    margin-right: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 50px;
    border: 1px solid black;
    border-radius: 0.4rem;
    font-size: 1rem;
    padding: 5px;
    background-color: #fc878793;
    color: black;

    text-align: center;

    &:hover {
      cursor: pointer;
    }
  }

  #modal-change-name {
    padding: 2rem;
    border-radius: 0.5rem;
    position: fixed;
    left: 50vw;
    top: 50vh;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 1rem;
    background-color: #000000;
    z-index: 99;
    width: 330px;
    height: auto;
    margin-left: auto;
    margin-right: auto;
  }

  #input-change-name,
  #input-change-image,
  #input-change-gender {
    width: 290px;
    text-align: center;
    padding: 1rem;
    border-radius: 0.4rem;
    border: 1px solid black;
    color: white;
    background-color: #5858586e;
    &::placeholder {
      color: #ffffff;
      opacity: 1; /* Firefox */
    }
  }
  #div-btn-change-name {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }
  .list-item-show-hide {
    margin-top: 2rem;
    background-color: #00000094;
    padding: 1rem;
    border-radius: 0.4rem;
  }

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
    font-weight: bold;

    &:hover {
      cursor: pointer;
    }
  }

  #show-queue-btn {
    margin-left: auto;
    margin-right: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 40px;
    width: 250px;
    height: 50px;
    border: 1px solid black;
    border-radius: 0.4rem;
    font-size: 1rem;
    padding: 5px;
    background-color: #00000094;
    color: #ffffff;
    text-align: center;
    font-weight: bold;

    &:hover {
      cursor: pointer;
    }
  }

  #show-finished-btn {
    margin-left: auto;
    margin-right: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 40px;
    width: 250px;
    height: 50px;
    border: 1px solid black;
    border-radius: 0.4rem;
    font-size: 1rem;
    padding: 5px;
    background-color: #f0fc8794;
    color: black;

    text-align: center;

    &:hover {
      cursor: pointer;
    }
  }

  #show-rejected-btn {
    margin-left: auto;
    margin-right: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 40px;
    width: 250px;
    height: 50px;
    border: 1px solid black;
    border-radius: 0.4rem;
    font-size: 1rem;
    padding: 5px;
    background-color: #00000094;
    color: #ffffff;
    font-weight: bold;

    text-align: center;

    &:hover {
      cursor: pointer;
    }
  }

  #send-btn-new-modal {
    background-color: #87fc8796;
    color: black;
  }

  #cancel-btn-new-modal {
    background-color: #fc878795;
    color: black;
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
    /* border: 1px solid black; */
    /* box-shadow: 0px 0px 50px #0000002f; */
    padding: 2rem;
    width: auto;
    height: auto;
    margin-top: 2rem;
    /* overflow-y: scroll; */
    border-radius: 0.5rem;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    /* background-color: #ffffff1d; */
  }
  #request-movie-or-series {
    margin-left: auto;
    margin-right: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #82e6ff6d;
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

  .input-search,
  .input-gender {
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
    transform: translate(275px, 5px);
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
    max-width: 290px;
    min-height: 30px;
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
      height: 90vh;
      border: none;
      box-shadow: none;
      margin-top: 10vh;
      overflow-x: hidden;
      padding: 1rem;
      margin-top: 1rem;
      /* background-color: #550101; */
    }
  }
`;
