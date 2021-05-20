import React, { useState, useContext, useEffect } from "react";
import Amplify from "aws-amplify";
import { Auth } from "aws-amplify";
import awsExports from "../../aws-exports";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { AuthContext } from "../../Context/Contexts/AuthContext";
import * as AuthActionCreators from "../../Context/ActionCreators/AuthActionCreater";
import "../Styles/style.css";
import {Button,Form,FormGroup,Label,Input,FormText,Toast,ToastBody,ToastHeader} from "reactstrap";
import { toast } from "react-toastify";
import axios from "axios";
import { useHistory } from "react-router-dom";
Amplify.configure(awsExports);

export const SignIn = (props) => {
  const { authState, authDispatch } = useContext(AuthContext);
  const [errors, setError] = useState({});
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const history = useHistory();
  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  function valid() {
    let errors = {};
    if (!values.email) {
      errors.email = "email is required";
    }
    if (!values.password) {
      errors.password = "Password is required";
    }
    setError(errors);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    try {
      const result = await Auth.signIn(email, password);
      var user = {
        PK: result.attributes.sub,
        SK: "METADATA",
        email: result.attributes.email,
        type: "default",
        storage_used: 0,
      };
      await axios
        .get(
          `${process.env.REACT_APP_BACKENDURL}/user/${result.attributes.sub}`,
          {
            headers: {
              "X-Api-Key": process.env.REACT_APP_APIKEY,
            },
          }
        )
        .then((response) => {
          if (response.data.body) {
            user.storage_used = response.data.body.storage_used;
          }
        });
      localStorage.setItem("auth", JSON.stringify(user));
      await authDispatch(AuthActionCreators.authStateUpdate(user));
      history.push("/dashboard");
      toast.success("successfully logged in");
    } catch (error) {
      console.log("error signing in", error);
      toast.error(error.message);
    }
  }
  return (
    <div class="myContainer">
      <div class="row myCard">
        <div class="col-md-6">
          <div class="myLeftCtn">
            <form class="myForm text-center" onSubmit={handleSubmit}>
              <header>Log In </header>
              <div class="form-group">
                <i class="fa fa-envelope"></i>
                <Input
                  class="myInput"
                  type="email"
                  name="email"
                  id="email"
                  placeholder="username"
                  value={values.email}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                />
                {errors.email && (
                  <p style={{ "text-align": "left" }}>{errors.email}</p>
                )}
              </div>
              <div class="form-group">
                <i class="fa fa-lock"></i>
                <Input
                  class="myInput"
                  type="password"
                  name="password"
                  id="userPassword"
                  value={values.password}
                  placeholder="password"
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  onBlur={() => {
                    valid();
                  }}
                  onMouseLeave={() => {
                    valid();
                  }}
                />
                {errors.password && (
                  <p style={{ "text-align": "left" }}>{errors.password}</p>
                )}
              </div>
              <Button
                classname="row"
                color="primary"
                style={{ "margin-bottom": "10px" }}
                size="sm"
                block
                type="submit"
                disabled={JSON.stringify(errors) === "{}" ? false : true}
                color={JSON.stringify(errors) === "{}" ? "success" : "danger"}
              >
                Log In
              </Button>
              <Button
                style={{ "margin-top": "-80" }}
                size="sm"
                block
                color="primary"
                type="button"
                onClick={props.loggedIn}
              >
                {" "}
                Sign Up{" "}
              </Button>
            </form>
          </div>
        </div>
        <div class="col-md-6">
          <div class="myRightCtn">
            <div class="box">
              <header>V-transfer</header>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
