import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components'
import logo from '../assets/logo.png'

export default function Header({setIsLogged}) {
    const navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem("iat")
        localStorage.removeItem("data")
        localStorage.removeItem("email")
        localStorage.removeItem("userId")
        setIsLogged(false)

    }
    return (
        <Container >
            <div id='header'>
                <div id='left-header'>
                    <img onClick={() => navigate('/')} src={logo} id='logo' alt="" />
                    <h1 onClick={() => navigate('/')} >My Watching Base</h1>
                </div>
                <div id='right-header'>
                    <p onClick={() => navigate('/storage')}>Storage</p>
                    <p onClick={logout}>Logout</p>
                </div>
            </div>
        </Container>
    )
}

// CSS
const Container = styled.div`
#header{
    height: 10vh;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-image: linear-gradient(45deg, #ff9035,#fdc54d, #ff9035);
    border-bottom: 1px solid #24150b92;

}


h1{
    font-size: 2rem;
    cursor: pointer;
}
@media screen and (max-width: 650px) {
    h1{
        display: none;
}
}
#logo{
    width:  50px;
    height: 50px;
    transform: translateY(-5px);
    cursor: pointer;

}

#left-header{
    display: flex;
    align-items: center;
    gap: 2.5rem;
    margin-left: 1rem;
}

#right-header{
    p{
        font-size: 1.5rem;
        font-weight: bold;
        cursor: pointer;
    }
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-right: 2rem;
}
`;