import { Redirect, Route, Router } from "dreamland-router";
import Browser from "./routes/browse";
export default new Router(
    (
        <Route>
            <Route path="/browse/" show={<Browser />} />
            {/* Saving webapps as PWA's feature coming soon <Route path="/s"></Route> */}
            <Redirect path="/" to="/browse/" />
        </Route>
    ),
);
