import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import logo from "../assets/images/logo.png";
import NavItem from "./NavItem";

import {auth} from "../utils/firebase"
import {useAuthState} from 'react-firebase-hooks/auth'
import {useRouter} from 'next/router'



var MENU_LIST = [
  { text: "Search", href: "/search" },
  { text: "Sale", href: "/search?purpose=for-sale" },
  { text: "AI Searching", href: "/quiz" },
  { text: "AI decorating", href: "/dalle" },
  { text: "Sign in", href: "/login" },
];

const Navbar = () => {
  const [navActive, setNavActive] = useState(null);
  const [activeIdx, setActiveIdx] = useState(-1);
  const router = useRouter();
  
  const [user, loading] = useAuthState(auth)

  if(user){
    MENU_LIST = [
      { text: "AI Searching", href: "/quiz" },
      { text: "AI decorating", href: "/dalle" },
      { text: user.displayName, href: `/user` },
    ];
  }

  if(!user){
    MENU_LIST = [
      { text: "AI Searching", href: "/quiz" },
      { text: "AI decorating", href: "/dalle" },
      { text: "Sign in", href: "/login" },
    ];
  }

  const signOutSession = () =>{
    auth.signOut()
    router.push("/login")
  }

  return (
    <header>
      <nav className={`nav`}>
        <Link legacyBehavior href={"/"}>
          <a>
            <Image className="logo" src={logo} alt="logo" />
          </a>
        </Link>
        <div onClick={() => setNavActive(!navActive)} className={`nav__menu-bar`}>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className={`${navActive ? "active" : ""} nav__menu-list`}>
          {MENU_LIST.map((menu, idx) => (
            <div
              onClick={() => {
                setActiveIdx(idx);
                setNavActive(false);
              }}
              key={menu.text}
            >
              <NavItem active={activeIdx === idx} {...menu} />
            </div>
          ))}
          {user && (
            <button onClick={signOutSession}>Log Out</button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;