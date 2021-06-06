import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../Context/Contexts/AuthContext";
import * as AuthActionCreators from "../Context/ActionCreators/AuthActionCreater";
import { Auth } from "aws-amplify";
import classnames from "classnames";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { toast } from "react-toastify";

const Footer = () => {
  const [mainModal, setMainModal] = useState(false);
  const toggleMain = () => {
    setMainModal(!mainModal);
    setError({});
    setValues({});
    setVisibility({});
  };
  const [code, sendCode] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  const [isValid, setIsValid] = useState(true);
  const [errors, setError] = useState({});
  const [visibility, setVisibility] = useState({
    curr: false,
    pwd: false,
    cpwd: false,
  });
  const toggleVisibility = (field) =>
    setVisibility({ ...visibility, [field]: !visibility[field] });

  const [values, setValues] = useState({
    current_password: "",
    password: "",
    confirm_password: "",
  });
  const [isDarkMode, setIsDarkMode] = useState(false); // true for dark mode
  const history = useHistory();
  const { authState, authDispatch } = useContext(AuthContext);
  const toggleLightMode = () => setIsDarkMode(!isDarkMode);

  const valid = () => {
    let errors = {};
    let isValid = true;
    if (!values.current_password) {
      isValid = false;
      errors.current_password = "Please provide current password";
    } else if (!values.password) {
      isValid = false;
      errors.password = "Please provide a new password";
    } else if (values.password.length < 8) {
      isValid = false;
      errors.password = "minimum 8 characters required";
    } else if (values.password != values.confirm_password) {
      isValid = false;
      errors.confirm_password = "Password do not match";
    }
    setError(errors);
    setIsValid(isValid);
  };

  const updatePassword = (e) => {
    e.preventDefault();
    const oldPassword = e.target[0].value;
    const newPassword = e.target[1].value;
    console.log("callled");
    if (isValid) {
      Auth.currentAuthenticatedUser()
        .then((user) => {
          return Auth.changePassword(user, oldPassword, newPassword);
        })
        .then((data) => {
          console.log(data);
          toast.success("Password updated successfully");
          toggleMain();
        })
        .catch((err) => {
          if (err.message === "Incorrect username or password.")
            toast.error("Incorrect password");
          else toast.error(err.message);
        });
    }
  };

  const updateUsername = async (e) => {
    e.preventDefault();
    const user = await Auth.currentAuthenticatedUser();
    const newName = e.target[0].value;
    Auth.updateUserAttributes(user, {
      name: newName,
    })
      .then((res) => {
        toast.success("User name updated successfully");
        toggleMain();
      })
      .catch((err) => toast.error(err.message));
  };

  const handleLogout = async (event) => {
    authDispatch(AuthActionCreators.authStateUpdate({}));
    localStorage.clear();
    history.push("/");
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
  return (
    <div className="footer-wrapper fixed-bottom">
      <Modal isOpen={mainModal} toggle={toggleMain}>
        <ModalBody>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "1" })}
                onClick={() => {
                  toggleTab("1");
                }}
              >
                Change password
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "2" })}
                onClick={() => {
                  toggleTab("2");
                }}
              >
                Change username
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <Form style={{ "margin-top": "5px" }} onSubmit={updatePassword}>
                <FormGroup>
                  <div class="d-flex bd-highlight align-items-center">
                    <Input
                      type={visibility.curr ? "text" : "password"}
                      class="p-2 flex-grow-1 bd-highlight"
                      name="current_password"
                      id="current_password"
                      placeholder="current password"
                      value={values.current_password}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    />
                    <span
                      onClick={() => {
                        toggleVisibility("curr");
                      }}
                      class="fa fa-fw fa-eye field_icon toggle-password m-n4"
                    ></span>
                  </div>
                  {errors.current_password && (
                    <p style={{ "text-align": "left" }}>
                      {errors.current_password}
                    </p>
                  )}
                </FormGroup>
                <FormGroup>
                  <div class="d-flex bd-highlight align-items-center">
                    <Input
                      type={visibility.pwd ? "text" : "password"}
                      name="password"
                      id="password"
                      placeholder="new password"
                      value={values.password}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    />
                    <span
                      onClick={() => {
                        toggleVisibility("pwd");
                      }}
                      class="fa fa-fw fa-eye field_icon toggle-password m-n4"
                    ></span>
                  </div>
                  {errors.password && (
                    <p style={{ "text-align": "left" }}>{errors.password}</p>
                  )}
                </FormGroup>
                <FormGroup>
                  <div class="d-flex bd-highlight align-items-center">
                    <Input
                      type={visibility.cpwd ? "text" : "password"}
                      name="confirm_password"
                      id="confirm_password"
                      placeholder="confirm password"
                      value={values.confirm_password}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    />
                    <span
                      onClick={() => {
                        toggleVisibility("cpwd");
                      }}
                      class="fa fa-fw fa-eye field_icon toggle-password m-n4"
                    ></span>
                  </div>
                  {errors.confirm_password && (
                    <p style={{ "text-align": "left" }}>
                      {errors.confirm_password}
                    </p>
                  )}
                </FormGroup>
                <FormGroup>
                  <Button
                    color="primary"
                    type="submit"
                    onClick={() => {
                      valid();
                    }}
                  >
                    {" "}
                    Update password{" "}
                  </Button>
                </FormGroup>
              </Form>
            </TabPane>
            <TabPane tabId="2">
              <Form style={{ "margin-top": "5px" }} onSubmit={updateUsername}>
                <FormGroup>
                  <Input
                    type="text"
                    name="new_username"
                    id="new_username"
                    placeholder="new username"
                  />
                </FormGroup>
                <FormGroup>
                  <Button type="submit" color="primary">
                    Update username
                  </Button>
                </FormGroup>
              </Form>
            </TabPane>
          </TabContent>
        </ModalBody>
      </Modal>

      <div className="container pt-3 pb-3">
        <div className="row justify-content-center text-center">
          <div className="col-6 col-sm-3 d-flex justify-content-around  align-items-center">
            <a href="https://github.com/code-gambit" target="_blank" className="text-secondary">
              <span className="fa fa-github fa-lg"></span>
            </a>
            <a href="#" target="_blank" className="text-info">
              <span className="fa fa-linkedin fa-lg"></span>
            </a>
            <a href="#" target="_blank" className="text-primary">
              <span className="fa fa-twitter fa-lg"></span>
            </a>
            <a href="#" target="_blank" className="text-danger">
              <span className="fa fa-instagram fa-lg"></span>
            </a>
          </div>
          {authState.auth.PK ? (
            <div className="col-4 col-sm-2 d-flex justify-content-between  align-items-center">
              <span onClick={toggleLightMode}>
                {!isDarkMode ? (
                  <span className="fa fa-moon-o fa-lg"></span>
                ) : (
                  <span className="fa fa-sun-o fa-lg"></span>
                )}

              </span>
                <span onClick={() => {
                  toggleMain();
                }} className="fa fa-cog fa-lg"></span>


                <span
                  className="fa fa-sign-out fa-lg "
                  onClick={handleLogout}
                ></span>

            </div>
          ) : (
            <div></div>
          )}
          <div className="col-12 col-sm-4 d-flex  align-items-center justify-content-center">v-transfer-demo@gmail.com</div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
