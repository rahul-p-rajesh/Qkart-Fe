import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link, useRouteMatch } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  let match = useRouteMatch();
  const history = useHistory();

  // TODO: LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
  const login = async (formData) => {
    // input validation
    const inputAreValid = validateInput({ username: formData.username, password: formData.password });

    if (!inputAreValid) {
      return;
    }
    try {

      let url = `${config.endpoint}/auth/login`
      const reqBody = {
        username: formData.username,
        password: formData.password
      };

      let res = await axios.post(url, reqBody);
      if (res.status === 201) {
        enqueueSnackbar("Logged in successfully", {
          variant: 'success',
        });
        const { token, username, balance } = res.data

        persistLogin(token, username, balance);

      } else {
        throw new Error(res);
      }

    } catch (error) {

      if (error.response === undefined) {
        enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.", {
          variant: 'error',
        });
      }
      else if (error.response.status < 500 && error.response.status >= 400) {
        let msg = error.response.data.message;
        enqueueSnackbar(msg, {
          variant: 'error',
        });

      } else {
        enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.", {
          variant: 'error',
        });
      }


    }

  };

  // TODO: LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
  const validateInput = (data) => {

    if (data.username === "") {
      enqueueSnackbar("Username is a required field", {
        variant: 'warning',
      });
      return false;
    }

    if (data.password === "") {
      enqueueSnackbar("Password is a required field", {
        variant: 'warning',
      });
      return false;
    }
    return true

  };

  // TODO: LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  const persistLogin = (token, username, balance) => {
    let userData = { token, username, balance };
    window.localStorage.setItem("username", username);
    window.localStorage.setItem("token", token);
    window.localStorage.setItem("balance", balance);
    history.push("/");
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack direction="column" justifyContent="center" spacing={2} className="form">
          <h2 className="title">Login</h2>
          <TextField id="username" label="Username" variant="outlined" value={userName} onChange={(e) => setUserName(e.target.value)} />
          <TextField id="passwrod" label="Password" variant="outlined" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button variant="contained" className="button" onClick={() => login({ username: userName, password: password })} >LOGIN TO QKART</Button>

          <p className="secondary-action">
            Don’t have an account? <Link to={`/register`} className="link ">Register now</Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
