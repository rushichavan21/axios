import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import "./index.css";
import App from "./App.jsx";
import Auth from "./Components/Auth.jsx";
import { StrictMode } from "react";

const root = createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <Auth0Provider
      domain="dev-riaw1h1kzszelhv5.us.auth0.com"
      clientId="w5dAqh53hZqBrhmIIwytz4Sr9eSF3AR8"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    > 
      <Auth/>
      <App />
    </Auth0Provider>
  </StrictMode>
);
