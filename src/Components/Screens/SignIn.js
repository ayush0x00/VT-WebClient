import React, { useState, useContext, useEffect } from "react";
import Amplify from "aws-amplify";
import { Auth } from "aws-amplify";
import awsExports from "../../aws-exports";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { AuthContext } from "../../Context/Contexts/AuthContext";
import * as AuthActionCreators from "../../Context/ActionCreators/AuthActionCreater";
import { Row, Col } from "reactstrap";
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
    if(values.email && values.password) {
      valid();
    }
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
      <Row>
        <Col>
          <div class="myLeftCtn" style={{ "margin-top": "80px" }}>
            <form class="myForm text-center" onSubmit={handleSubmit}>
              <header class="text-center">Log In </header>
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
                />
                {errors.password && (
                  <p style={{ "text-align": "left" }}>{errors.password}</p>
                )}
              </div>
              <Button
                classname="row"
                color="primary"
                size="sm"
                block
                type="submit"
                disabled={JSON.stringify(errors) === "{}" ? false : true}
                color={JSON.stringify(errors) === "{}" ? "success" : "danger"}
                onClick={() => {
                  valid();
                }}

              >
                Log In
              </Button>
              <Button
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
        </Col>
      </Row>
    </div>
  );
};

export default SignIn;
