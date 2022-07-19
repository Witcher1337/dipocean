import { Provider } from "effector-react/scope";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { getClientScope } from "shared/libs/get-client-scope";

import { Application } from "./application";


const scope = getClientScope();

const container = document.getElementById("root");

if (container) {
  hydrateRoot(
    container,
    <BrowserRouter>
      <Provider value={scope}>
        <Application />
      </Provider>
    </BrowserRouter>,
  );
}