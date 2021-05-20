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
    <div class="container">
      {console.log({ logIn })}
      {logIn ? (
        <div className="row ">
          <div className="col">
            <SignIn loggedIn={handleClick} />
          </div>
        </div>
      ) : (
        <div className="container">
          <SignUp loggedIn={handleClick} />
        </div>
      )}
    </div>
  );
};
export default Authenticate;
