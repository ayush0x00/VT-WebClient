import React, { useState, useContext, useEffect } from "react";
import Amplify from "aws-amplify";
import { Auth } from "aws-amplify";
import awsExports from "../../aws-exports";
import { withAuthenticator } from "@aws-amplify/ui-react";
import axios from "axios";
import { AuthContext } from "../../Context/Contexts/AuthContext";
import * as AuthActionCreators from "../../Context/ActionCreators/AuthActionCreater";
import {Button,Form,FormGroup,Label,Input,FormText,Toast,ToastBody,ToastHeader,Row,Col} from "reactstrap";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
Amplify.configure(awsExports);

export const SignUp = (props) => {
  const { authState, authDispatch } = useContext(AuthContext);
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [hasClicked, setHasClicked] = useState(false);
  const [errors, setError] = useState({});

  const [cognitoInfo, setCognitoInfo] = useState({
    userConfirmed: "",
    mailSent: false,
  });
  const [cognitoUser, setCognitoUser] = useState({
    PK: "",
    SK: "METADATA",
    email: "",
    type: "default",
    storage_used: 0,
  });
  const history = useHistory();

  async function confirmSignUp(e) {
    e.preventDefault();
    const verificationcode = e.target[0].value;
    try {
      await Auth.confirmSignUp(values.email, verificationcode);
      localStorage.setItem("auth", JSON.stringify(cognitoUser));
      authDispatch(AuthActionCreators.authStateUpdate(cognitoUser));
      setCognitoInfo({ ...cognitoUser, userConfirmed: true });
      history.push("/dashboard");
      toast.success("Email confirmed");
    } catch (error) {
      toast.error(error.message, {
        autoClose: 8000,
      });
    }
  }
  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errors.hasError) return;
    {
      const name = e.target[0].value;
      const username = e.target[1].value;
      const password = e.target[2].value;
      try {
        const result = await Auth.signUp({
          username,
          password,
          attributes: {
            name,
          },
        });
        console.log(result);
        setCognitoUser({
          ...cognitoUser,
          PK: result.userSub,
          email: result.user.username,
        });
        if (result.user.client) {
          setCognitoInfo({
            userConfirmed: false,
            mailSent: true,
          });

          toast.info(
            "A verification code is sent on your mail. Please verify.",
            {
              autoClose: 8000,
            }
          );
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };
  const valid = () => {
    setHasClicked(true);
    let errors = {};
    var isValid = true;
    const pattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );
    if (!values.username) {
      isValid = false;
      errors.username = "Username required";
    }
    if (!values.email) {
      errors.email = "email is required";
      isValid = false;
    } else if (!pattern.test(values.email)) {
      isValid = false;
      errors.email = "Please enter a valid email";
    }

    if (!values.password) {
      isValid = false;
      errors.password = "Password is required";
    } else if (values.password.length < 8) {
      isValid = false;
      errors.password = "Minimum length is of 8 characters";
    }
    if (!values.confirm_password) {
      isValid = false;
      errors.confirm_password = "Password is required";
    } else if (values.password !== values.confirm_password) {
      errors.confirm_password = "Passwords do not match";
      isValid = false;
    }
    errors.hasError = !isValid;

    setError(errors);
    return isValid;
  };
  return (
    <div class="container">
      {cognitoInfo.mailSent === true && errors.hasError === false ? (
        <>
          <div class="row  mb-3">
            <header
              class="container text-center vh-150 mt-n3"
              style={{ "font-size": "40px" }}
            >
              Confirm Code
            </header>
          </div>
          <div class="myContainer">
            <div class="d-flex justify-content-center">
              <Form onSubmit={confirmSignUp}>
                <FormGroup>
                  <div class="myContainer">
                    <Input
                      type="text"
                      name="confirmCode"
                      id="username"
                      placeholder="code"
                    />
                  </div>
                </FormGroup>
                <div class="myContainer">
                  <Button color="success" size="sm" block type="submit">
                    Submit Code
                  </Button>
                  <a href="/authenticate" class="text-center">
                    Log In
                  </a>
                </div>
              </Form>
            </div>
          </div>
        </>
      ) : (
        <div class="container">
          <div class="row ">
            <header
              class="container text-center vh-150 mt-n3"
              style={{ "font-size": "40px" }}
            >
              Sign Up
            </header>
          </div>
          <Row>
            <Col>
              <div class="d-flex justify-content-center  mt-3">
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label for="username">User name</Label>
                    <Input
                      type="text"
                      name="username"
                      id="username"
                      placeholder="username"
                      value={values.username}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    />
                    {errors.username && (
                      <p style={{ "text-align": "left" }}>{errors.username}</p>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="userEmail">Email</Label>
                    <Input
                      type="text"
                      name="email"
                      id="userEmail"
                      placeholder="userEmail"
                      value={values.email}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    />
                    {errors.email && (
                      <p style={{ "text-align": "left" }}>{errors.email}</p>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="userPassword">Password</Label>
                    <Input
                      type="password"
                      name="password"
                      value={values.password}
                      id="userPassword"
                      placeholder="password"
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    />
                    {errors.password && (
                      <p style={{ "text-align": "left" }}>{errors.password}</p>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="confirmPassword">Confirm Password</Label>
                    <Input
                      type="password"
                      name="confirm_password"
                      id="confPassword"
                      placeholder="confirm password"
                      value={values.confirm_password}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    />
                    {errors.confirm_password && (
                      <p style={{ "text-align": "left" }}>
                        {errors.confirm_password}
                      </p>
                    )}
                  </FormGroup>
                  {console.log({ errors })}
                  <Button
                    id="submitButton"
                    color="success"
                    size="sm"
                    block
                    type="submit"
                    onClick={() => {
                      valid();
                    }}
                  >
                    SignUp
                  </Button>
                  <Button
                    size="sm"
                    block
                    color="primary"
                    onClick={props.loggedIn}
                  >
                    Log In
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default SignUp;
