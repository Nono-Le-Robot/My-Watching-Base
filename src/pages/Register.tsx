import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import RegisterLogo from "../assets/register.png";
import Config from "../utils/Config";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  const handleValidation = (email) => {
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(email.match(mailformat)) return true
    else return false
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    //requete ici
    if(userData.password !== userData.confirmPassword) return toast.error('Passwords must be the same.', {
      position: "bottom-right",
      autoClose: 3000,
      pauseOnHover: false,
      draggable: false,
      theme: "dark",
    });
    if(!handleValidation(userData.email)) return toast.error('Please enter valid email.', {
      position: "bottom-right",
      autoClose: 3000,
      pauseOnHover: false,
      draggable: false,
      theme: "dark",
    });
    axios.post(Config.registerUrl,{username:userData.username, email: userData.email, password: userData.password})
    .then((result) =>{
      toast.success('Register success, redirect to login page...', {
        position: "bottom-right",
        autoClose: 3000,
        pauseOnHover: false,
        draggable: false,
        theme: "dark",
      });
      setTimeout(() => {
        navigate("/login")
      }, 1000);
    })
    .catch((err)=>console.log(err))
  
  
  
  
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
              <button onClick={handleSubmit} type="submit">REGISTER</button>
              <span>
                Already have an account ?
                <Link className="link" to="/login">
                  Login
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
    width:  95vw;
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
