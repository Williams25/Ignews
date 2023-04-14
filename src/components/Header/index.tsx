import { SignInButton } from "components/SignInButton";
import Image from "next/image";
import styled from "./header.module.scss";
import { ActiveLink } from "components/ActiveLink";

export const Header = () => {
  return (
    <header className={styled.headerContainer}>
      <div className={styled.headerContent}>
        <Image src="/images/logo.svg" alt="ig.news" width="300" height="300" />
        <nav>
          <ActiveLink href="/" activeClassName={styled.active}>
            <a>Home</a>
          </ActiveLink>
          <ActiveLink href="/posts" activeClassName={styled.active}>
            <a>Posts</a>
          </ActiveLink>
        </nav>

        <SignInButton />
      </div>
    </header>
  );
};
