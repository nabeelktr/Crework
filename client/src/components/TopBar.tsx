"use client";
import CustomModal from "../utils/Modal/CustomModal";
import { ArrowCircleLeftIcon, AtSymbolIcon, BellIcon, UserIcon } from "@heroicons/react/outline";
import Image from "next/image";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import { useModal } from "../hooks/useModal";
import { useLogOutMutation } from "../../redux/features/auth/authApi";
import Link from "next/link";

type Props = {};

const TopBar = (props: Props) => {
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
  const { open, setOpen } = useModal();
  const [route, setRoute] = useState("Login");
  const [hovering, setHovering] = useState(false);
  const [Lhovering, setLHovering] = useState(false);
  const [logout] = useLogOutMutation()
  return (
    <>
      <div
        className="h-[4.3rem] fixed bg-gradient-to-r from-gray-800
        to-blue-500 w-full flex items-center justify-between px-[12%] z-[99] shadow-xl"
      >
        <div className="flex px-5 items-center text-2xl font-Poppins font-semibold text-white">
          <h5>TaskTrackr</h5>
        </div>
        <div className="flex space-x-6">
          <Link href={"/"} className="text-sm uppercase font-Poppins text-white font-semibold p-2">Dashboard</Link>
          <BellIcon className="h-10 w-10 p-2 text-white" />
          {isLoggedIn  &&  <div className="relative">
                <ArrowCircleLeftIcon
                  className="h-10 w-10 text-white  hover:bg-gray-50 p-2 rounded-lg hover:text-black "
                  onMouseEnter={() => setLHovering(true)}
                  onMouseLeave={() => setLHovering(false)}
                  onClick={async () => await logout({})}
                />
                {Lhovering && (
                  <span className="absolute top-12 left-0 text-white px-2 rounded-xl py-1 text-xs bg-gray-600 uppercase">
                    Logout
                  </span>
                )}
              </div>}
          <div className="flex items-center text-white">
            {isLoggedIn  ? (
              <Image
                src="https://randomuser.me/api/portraits/men/75.jpg"
                width="36"
                height="36"
                alt=""
                className=" rounded-full bg-cover"
              />
            ) : (
              <div className="relative">
                <UserIcon
                  className="h-10 w-10  hover:bg-gray-50 p-2 rounded-lg hover:text-black "
                  onMouseEnter={() => setHovering(true)}
                  onMouseLeave={() => setHovering(false)}
                  onClick={() => setOpen(true)}
                />
                {hovering && (
                  <span className="absolute top-12 left-0 text-white px-2 rounded-xl py-1 text-xs bg-gray-600 uppercase">
                    Login
                  </span>
                )}
              </div>
            )}
          </div>
         
        </div>
      </div>
      {route === "Login" && (
        <>
          {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              component={Login}
            />
          )}
        </>
      )}
      {route === "SignUp" && (
        <>
          {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              component={SignUp}
            />
          )}
        </>
      )}
    </>
  );
};

export default TopBar;
