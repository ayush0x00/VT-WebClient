import React, { useState } from "react";
import { Button } from "reactstrap";
import SignUp from "./SignUp";
import SignIn from "./SignIn";

const Authenticate = () => {
  const [logIn, toggleLogIn] = useState(true);

  function handleClick() {
    const curr = logIn;
    toggleLogIn(!curr);
  }

  return (
    <div class="d-flex flex-column justify-content-center vh-100">
      {console.log({ logIn })}
      {logIn ? (
        <>
          <SignIn loggedIn={handleClick} />
        </>
      ) : (
        <div class="container">
          <SignUp loggedIn={handleClick} />
        </div>
      )}
    </div>
  );
};
export default Authenticate;
