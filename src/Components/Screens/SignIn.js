import React, { useState, useContext, useEffect } from "react";
import Amplify from "aws-amplify";
import { Auth } from "aws-amplify";
import awsExports from "../../aws-exports";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { AuthContext } from "../../Context/Contexts/AuthContext";
import * as AuthActionCreators from "../../Context/ActionCreators/AuthActionCreater";
import { Link } from "react-router-dom";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Toast,
  ToastBody,
  ToastHeader,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";
import { toast } from "react-toastify";
import axios from "axios";
import { useHistory } from "react-router-dom";
Amplify.configure(awsExports);

export const SignIn = () => {
  const { authState, authDispatch } = useContext(AuthContext);
  const [errors, setError] = useState({});
  const [modal, setModal] = useState(false);
  const [mailSent, hasSentMail] = useState(false);
  const toggle = () => setModal(!modal);
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

  const sendMail = (e) => {
    e.preventDefault();
    const user = e.target[0].value;
    Auth.forgotPassword(user)
      .then((data) => {
        toast.info("Mail with verification code sent");
        hasSentMail(true);
        console.log(data);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

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
    <div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader> Get password reset code</ModalHeader>
        <ModalBody>
          <Form onSubmit={sendMail}>
            <FormGroup>
              <Input type="text" name="user" placeholder="email address" />
            </FormGroup>
            <Button type="submit" color="primary">
              Get code
            </Button>
            {mailSent ? history.push("/changepwd") : null}
          </Form>
        </ModalBody>
      </Modal>
      <div
        className="container"
        style={{ margin: "auto", display: "flex", "justify-content": "center" }}
      >
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="userPassword">Email</Label>
            <Input
              type="email"
              name="email"
              id="userEmail"
              placeholder="username"
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
              id="userPassword"
              value={values.password}
              placeholder="password"
              onChange={(e) => {
                handleChange(e);
              }}
              onBlur={() => {
                valid();
              }}
            />
            <div
              class="container text-center"
              style={{ margin: "auto", width: "100%" }}
            >
              <a
                href="#"
                onClick={() => {
                  toggle();
                }}
              >
                Forgot password?
              </a>
            </div>
            {errors.password && (
              <p style={{ "text-align": "left" }}>{errors.password}</p>
            )}
          </FormGroup>
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
        </Form>
      </div>
      {errors.code && (
        <div className="p-3 bg-danger my-2 rounded">
          <Toast>
            <ToastHeader>{errors.code}</ToastHeader>
            <ToastBody>{errors.message}</ToastBody>
          </Toast>
        </div>
      )}
    </div>
  );
};

export default SignIn;
