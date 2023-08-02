"use client";

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import styles from "./page.module.css";

import Welcome from "./screens/welcome/page";
import Room from "./screens/room/page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Welcome />,
  },
  { path: "/room", element: <Room /> },
]);

export default function Home() {
  return (
    <div className={styles["home"]}>
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}

// <div className={styles[""]}></div>
