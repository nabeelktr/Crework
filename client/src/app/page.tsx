"use client";
import Login from "@/components/Auth/Login";
import Heading from "../utils/Heading";
import { useState } from "react";
import SignUp from "@/components/Auth/SignUp";

export default function Home() {
  const [route, setRoute] = useState("Login");

  return (
    <main
      className="lg:px-[12%] pt-16 h-screen "
      style={{
        background: "linear-gradient(to bottom, #FFFFFF, #AFA3FF)",
      }}
    >
      <Heading
        description="A comprehensive system for managing tasks "
        keywords="Task,Task Management,Kanban"
        title={route}
      />

        {route === "Login" ? (
          <Login setRoute={setRoute} />
        ) : (
          <SignUp setRoute={setRoute} />
        )}

    </main>
  );
}
