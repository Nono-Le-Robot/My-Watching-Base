import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import RegisterLogo from "../assets/login.png";
import Config from "../utils/Config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login({ setIsLogged }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  let toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    pauseOnHover: false,
    draggable: false,
    theme: "dark",
  };

  const navigateToMSB = () => {
    window.open("https://my-sharing-base.sanren.fr", "_blank");
  };

  const navigateToMWB = () => {
    window.open("https://my-watching-base.sanren.fr", "_blank");
  };

  const handleChange = (event) => {
    setUserData({ ...userData, [event.target.name]: event.target.value });
  };

  const handleValidation = (email) => {
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email.match(mailformat)) return true;
    else return false;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!handleValidation(userData.email)) {
      toast.error("Please enter valid email.", {
        position: "bottom-right",
        autoClose: 3000,
        pauseOnHover: false,
        draggable: false,
        theme: "dark",
      });
      return;
    }
    axios
      .post(Config.LoginUrl, userData)
      .then((response) => {
        if (!response.data.status) {
          toast.error(response.data.msg, {
            position: "bottom-right",
            autoClose: 3000,
            pauseOnHover: false,
            draggable: false,
            theme: "dark",
          });
        }
        if (response.data.iat) {
          toast.success("Login success", {
            position: "bottom-right",
            autoClose: 3000,
            pauseOnHover: false,
            draggable: false,
            theme: "dark",
          });
          localStorage.setItem("userId", response.data.userId);
          localStorage.setItem("email", response.data.email);
          localStorage.setItem("iat", response.data.iat);
          setTimeout(() => {
            setIsLogged(true);
            navigate("/");
          }, 1000);
        }
      })
      .catch((err) => console.log(err.data));
  };
  var userAgent;
  userAgent = navigator.userAgent.toLowerCase();
  return (
    <>
      <Container>
        <div className="register">
          <div className="register-logo-div">
            <img
              className="register-logo "
              src={RegisterLogo}
              alt="logo de connexion representant une clé "
            />
          </div>
          <p className="info-account">
            <strong className="strong" onClick={navigateToMSB}>
              My Sharing Base
            </strong>{" "}
            and{" "}
            <strong onClick={navigateToMWB} className="strong">
              My Watching Base
            </strong>{" "}
            account is the same.
          </p>
          <form
            onSubmit={(event) => handleSubmit(event)}
            className="register-form"
          >
            <input
              autoComplete="nope"
              type="text"
              name="email"
              className="email"
              placeholder="Email"
              onChange={(e) => handleChange(e)}
            />
            <input
              autoComplete="nope"
              type="password"
              name="password"
              className="password"
              placeholder="Password"
              onChange={(e) => handleChange(e)}
            />
            <button onClick={handleSubmit} type="submit">
              LOGIN
            </button>
            <span>
              Don't have an account ?
              <Link className="link" to="/register">
                Register
              </Link>
            </span>
          </form>
        </div>
      </Container>
      <ToastContainer />
    </>
  );
}

const Container = styled.div`
  height: 90vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  .register-logo-div {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 2rem;
  }

  .strong {
    text-decoration: underline;
    font-size: 1.1rem;

    &:hover {
      cursor: pointer;
    }
  }

  .info-account {
    color: #7c6feb;
    font-weight: bold;
    font-size: 1rem;
    text-align: center;
    margin-bottom: 1.5rem;
  }
  .register-logo {
    background-color: #2e0f0f;
    width: 2rem;
    padding: 0.8rem;
    border-radius: 2rem;
  }
  .register {
    background-image: linear-gradient(45deg, #ff9c4b, #ffca67);
    padding: 2rem;
    border-radius: 0.4rem;
    width: 95vw;
    max-width: 500px;
    box-shadow: 2px 2px 10px #0000005a;
  }
  .register-form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    align-items: center;
    justify-content: center;
    input {
      border: 1px solid #ffffff;
      width: 90%;

      height: 1.5rem;
      padding: 0.5rem 1rem;
      border-radius: 0.4rem;
      font-size: 1rem;
      font-weight: bold;
      background-color: #2e0f0f;

      color: white;
      &:focus {
        background-color: #531c1c;
      }
    }
    button {
      border: 1px solid #ffffff;
      font-weight: bold;
      padding: 0.5rem;
      border-radius: 0.4rem;
      width: 40%;
      font-size: 0.6rem;
      height: 2rem;
      background-color: #2e0f0f;
      color: white;
      transition: 0.4s;
      &:hover {
        cursor: pointer;
        transition: 0.4s;
        background-color: #531c1c;
      }
    }
    .link {
      margin-left: 5px;
      text-decoration: none;
      color: #850000;
      font-weight: bold;
    }
  }
`;
