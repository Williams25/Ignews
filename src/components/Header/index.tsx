import { SignInButton } from "components/SignInButton";
import Image from "next/image";
import Link from "next/link";
import styled from "./header.module.scss";

export const Header = () => {
  return (
    <header className={styled.headerContainer}>
      <div className={styled.headerContent}>
        <Image src="/images/logo.svg" alt="ig.news" width="300" height="300" />
        <nav>
          <Link href="#">
            <a className={styled.active}>Home</a>
          </Link>
          <Link href="/posts">
            <a>Posts</a>
          </Link>
        </nav>

        <SignInButton />
      </div>
    </header>
  );
};
