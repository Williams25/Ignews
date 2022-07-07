import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import styled from "./signInbutton.module.scss";
import { signIn, useSession, signOut } from "next-auth/react";

export const SignInButton = () => {
  const { data: session } = useSession();
  const isVerifiSession = Boolean(session && session.user);

  const handleSigninOrSignOut = () => {
    if (isVerifiSession) {
      signOut();
    } else {
      signIn("github");
    }
  };

  return (
    <button
      type="button"
      className={styled.signinButton}
      onClick={handleSigninOrSignOut}
    >
      <FaGithub color={isVerifiSession ? "#04d361" : "#eba417"} />
      {isVerifiSession ? session.user.name : "Sign In width Github"}
      {isVerifiSession && <FiX color="#737380" />}
    </button>
  );
};
