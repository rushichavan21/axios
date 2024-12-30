import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "@/pages/home/Home";
import ProtectedRoute from "../gaurd/ProtectedRoute";
import Call from "@/pages/call/Call";
import Chat_Layout from "@/pages/chat/Chat";
import CreateMeet from "@/pages/createMeet/CreateMeet";
import Upcoming from "@/pages/upcoming/Upcoming";
import TaskPlanner from "@/components/features/TaskPlanner";
import Recording from "@/pages/recording/Recording";
import Ended from "@/pages/ended/Ended";
import Recordings from "@/pages/recordings/Recordings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute element={<CreateMeet />} />,
  },
  {
    path: "/onboarding",
    element: <Home />,
  },
  {
    path: "/chat",
    element: <Chat_Layout />,
  },
  {
    path: "/meeting/:callId",
    element: <Call />,
  },
  {
    path: "/upcoming",
    element: <Upcoming />,
  },
  {
    path: "/ended",
    element: <Ended />,
  },
  {
    path: "/recordings",
    element: <Recordings />,
  },
  {
    path: "/:recUrl",
    element: <Recording />,
  },
  {
    path: "/taskplanner",
    element: <TaskPlanner />,
  },
]);

export const RouterProviderBase = () => {
  return <RouterProvider router={router} />;
};
