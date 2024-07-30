import express from "express";
import wisp from "wisp-server-node";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { spawn } from "node:child_process";

import ViteExpress from "vite-express";

const giggleshitter = spawn(
    "./giggleshitter-public/target/release/giggleshitter",
);
giggleshitter.stdout.pipe(process.stdout);
giggleshitter.stderr.pipe(process.stderr);

const app = express();

app.use("/uv/", express.static(uvPath));
app.use("/epoxy/", express.static(epoxyPath));
app.use("/libcurl/", express.static(libcurlPath));
app.use("/baremux/", express.static(baremuxPath));

const server = app.listen(5173, () => {
    console.log("Server listening on 5173");
});

server.on("upgrade", (req, socket, head) => {
    if (req.url.endsWith("/wisp/")) wisp.routeRequest(req, socket, head);
    else if (req.url.startsWith("/vite-hmr")) return;
    else socket.end();
});

ViteExpress.bind(app, server);
