import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import styled from "./signInbutton.module.scss";

export const SignInButton = () => {
  const isUserLoggedIn = true;
  return (
    <button type="button" className={styled.signinButton}>
      <FaGithub color={isUserLoggedIn ? "#04d361" : "#eba417"} />
      Sign In width Github
      {isUserLoggedIn && <FiX color="#737380" />}
    </button>
  );
};
