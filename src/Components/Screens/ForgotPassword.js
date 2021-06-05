import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { useHistory } from "react-router-dom";
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
import awsExports from "../../aws-exports";

const ForgotPassword = () => {
  const [isvalid, setIsValid] = useState(true);
  const [values, setValues] = useState({
    code: "",
    confirm_password: "",
    password: "",
  });
  const history = useHistory();
  const [errors, setError] = useState({});
  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const updatePassword = (user, code, new_password) => {
    Auth.forgotPasswordSubmit(user, code, new_password)
      .then((data) => {
        console.log(data);
        toast.success("Password reset successful");
        history.push("/authenticate");
      })
      .catch((err) => toast.error(err.message));
  };

  const valid = () => {
    let errors = {};
    let valid = true;
    if (!values.code) {
      valid = false;
      errors.code = "enter the verification code";
    } else if (!values.password) {
      valid = false;
      errors.password = "Password is required";
    } else if (values.password !== values.confirm_password) {
      valid = false;
      errors.confirm_password = "Password do not match";
    }
    setError(errors);
    setIsValid(valid);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("called hdfd");
    if (isvalid) {
      const user = e.target[0].value;
      const code = e.target[1].value;
      const new_password = e.target[2].value;
      updatePassword(user, code, new_password);
    }
  };
  return (
    <div class="container text-center">
      <h1>Update password</h1>
      <div
        class="d-inline-flex  justify-content-center text-center flex-column"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
        }}
      >
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Input type="email" name="user" placeholder="user email" />
          </FormGroup>
          <FormGroup>
            <Input
              type="text"
              name="code"
              placeholder="verification code"
              value={values.code}
              onChange={(e) => {
                handleChange(e);
              }}
            />
            {errors.code && (
              <p style={{ "text-align": "left" }}>{errors.code}</p>
            )}
          </FormGroup>
          <FormGroup>
            <Input
              type="password"
              name="password"
              placeholder="new password"
              value={values.password}
              onChange={(e) => {
                handleChange(e);
              }}
            />
            {errors.password && (
              <p style={{ "text-align": "left" }}>{errors.password}</p>
            )}
          </FormGroup>
          <FormGroup>
            <Input
              type="password"
              name="confirm_password"
              placeholder="confirm password"
              value={values.confirm_password}
              onChange={(e) => {
                handleChange(e);
              }}
            />
            {errors.confirm_password && (
              <p style={{ "text-align": "left" }}>{errors.confirm_password}</p>
            )}
          </FormGroup>
          <FormGroup>
            <Button type="submit" color="success" onClick={() => valid()}>
              Update password
            </Button>
          </FormGroup>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;
