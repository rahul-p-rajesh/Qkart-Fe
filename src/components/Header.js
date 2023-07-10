import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React, {useEffect, useState} from "react";
import { useHistory } from 'react-router-dom';
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons}) => {
  
  const [userName, setUsernName] = useState("");
  const history = useHistory();

  useEffect((userName) =>{
    let userData = localStorage.getItem('username');

    if(userData != null && userData !== userName){
      setUsernName(userData)
    }

    

  })


    /**
     * Handler to handle login log out bacto to explore 
     * based on the input provide
     * @param {string} btnType
     * Type of btnType 
     * - login
     * - logout
     * - backToExplore
     * - register
     */
    const btnClick = (btnType) =>{
     

      if(btnType === "backToExplore"){
        history.push("/");

      }else if(btnType === "login"){
        history.push("/login");

      }else if(btnType === "logout"){
        localStorage.clear()
        window.location.reload()

      }else{
        history.push("/register");
      }
    }
    const LoggedIn = (
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Avatar src="avatar.png" alt={userName}/>
        <p>{userName}</p>
        <Button
          className="explore-button"
          variant="text"
          onClick = {() =>{  btnClick("logout")}}
        >
          LOGOUT
        </Button>
      </Stack>

    );

    const LoggedOut = (
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
       
        <Button
          className="explore-button"
          variant="text"
          onClick = {() => btnClick("login")}
        >
          LOGIN
        </Button>

        <Button 
        variant="contained" 
        className="button"  
        onClick = {() => btnClick("register")}
        >REGISTER</Button>
      </Stack>

    );

    const defaultBtn = (
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick = {() => btnClick("backToExplore")}
        >
          Back to explore
        </Button>
    );
    
    let defultBtnView = "";
    if(!hasHiddenAuthButtons){
      if(userName !== ""){
        defultBtnView = LoggedIn;
      }else{
        defultBtnView = LoggedOut;

      }

    }else{
      defultBtnView = defaultBtn;

    }

    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        {children }
        {defultBtnView}
      </Box>
    );
};

export default Header;
