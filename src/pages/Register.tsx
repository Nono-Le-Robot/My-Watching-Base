import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import RegisterLogo from "../assets/register.png";
export default function Register() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    pauseOnHover: false,
    draggable: false,
    theme: "dark",
  };

  const handleChange = (event) => {
    setUserData({ ...userData, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const { username, email, password, confirmPassword } = userData;
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    //requete ici
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
            <form
              onSubmit={(event) => handleSubmit(event)}
              className="register-form"
            >
              <input
                autoComplete="nope"
                type="text"
                name="username"
                className="username"
                placeholder="Username"
                onChange={(e) => handleChange(e)}
              />
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
              <input
                autoComplete="nope"
                type="password"
                name="confirmPassword"
                className="confirmPassword"
                placeholder="Confirm Password"
                onChange={(e) => handleChange(e)}
              />
              <button type="submit">LOGIN</button>
              <span>
                Already have an account ?
                <Link className="link" to="/login">
                  Login
                </Link>
              </span>
            </form>
          </div>
        </Container>
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

      height: 1rem;
      padding: 0.5rem 1rem;
      border-radius: 0.4rem;
        font-size: 0.6rem;
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
