import "dreamland/dev";

declare global {
    // eslint-disable-next-line no-var
    var userSettings: Stateful<{
        theme: Stateful<Theme>;
        transport: "epoxy" | "libcurl";
        usegiggleshitter: boolean;
    }>;
}

globalThis.userSettings = $store(
    {
        theme: $state(mochaTheme),
        transport: "epoxy",
        usegiggleshitter: false,
    },
    {
        ident: "userSettings",
        autosave: "auto",
        backing: "localstorage",
    },
);

import "@fontsource/lexend";
import "@fontsource/iosevka";
import { ColorName } from "@catppuccin/palette";
// @ts-ignore - this still hasn't been fixed?
import { BareMuxConnection } from "@mercuryworkshop/bare-mux";

import "./index.css";
import Router from "./router";
import { mochaTheme, Theme } from "./theme/Themes";

const connection = new BareMuxConnection("/baremux/worker.js");

for (const color in userSettings.theme) {
    useChange(use(userSettings.theme[color as ColorName]), (val) => {
        document.documentElement.style.setProperty(`--${color}`, val.hex);
    });
}

const base = css`
    width: 100%;
    height: 100%;
    background-color: var(--base);
    color: var(--text);
`;

const App: Component<{}, {}> = function () {
    this.mount = () => {
        Router.mount(this.root as HTMLElement);
    };
    return <div class={base} id="app" />;
};

async function registerSW() {
    let wisp =
        (location.protocol === "https:" ? "wss" : "ws") +
        "://" +
        location.host +
        "/wisp/";

    await connection.setTransport("/epoxy/index.mjs", [{ wisp }]);
    useChange(use(userSettings.transport), async (val) => {
        try {
            await connection.setTransport(`/${val}/index.mjs`, [{ wisp }]);
        } catch (e) {
            console.warn("Caught transport set error", e);
            console.warn("Setting transport to EpoxyClient");
            userSettings.transport = "epoxy";
        }
    });

    await navigator.serviceWorker.register("/sw.js");
}

window.addEventListener("load", async () => {
    await registerSW();
    document.getElementById("app")!.replaceWith(<App />);
});
