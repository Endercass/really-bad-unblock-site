importScripts("/uv/uv.bundle.js");
importScripts("/uv.config.js");
importScripts(__uv$config.sw);

const uv = new UVServiceWorker();

const callbacks = {};

const proxyClients = [];

self.addEventListener("fetch", (event) => {
    event.respondWith(
        (async () => {
            if (uv.route(event)) {
                if (event.request.mode === "navigate") {
                    // self.postMessage({
                    //     type: "navigate",
                    //     url: event.request.url,
                    // });
                }
                return await uv.fetch(event);
            } else if (shouldRouteDeprecationNotice(event)) {
                return new Response(
                    `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Deprecation Notice</title>
                    </head>
                    <body>
                        <h1>Deprecation Notice</h1>
                        <p>The requested resource has been deprecated and is no longer available.</p>
                    </body>`,
                    {
                        headers: { "Content-Type": "text/html" },
                        status: 410,
                    },
                );
            } else if (shouldRouteSearch(event)) {
                // return await fetch(event.request);
                const url = new URL(event.request.url);
                const q = url.searchParams.get("q");
                console.log("fetching search", q);
                const id = Math.random().toString(36).substring(2);
                const googleUrl =
                    location.origin +
                    __uv$config.prefix +
                    __uv$config.encodeUrl(
                        `https://www.google.com/complete/search?q=${q}&client=chrome-omni&jsonp=callbacks.${id}`,
                    );
                const request = new Request(googleUrl);
                uv.fetch({ request })
                    .then((response) => response.text())
                    .then((text) => {
                        try {
                            eval(text);
                        } catch (e) {
                            callbacks[id](null, e);
                        }
                    });
                return new Response(
                    JSON.stringify(
                        await new Promise((resolve) => {
                            callbacks[id] = (data, err) => {
                                if (err) {
                                    console.error("got error", err);
                                    resolve({ error: err });
                                } else {
                                    console.log("got data", data);
                                    resolve({
                                        query: data[0],
                                        suggestions: [...data[1], ...data[2]],
                                    });
                                }
                                delete callbacks[id];
                            };
                        }),
                    ),
                );
            }
            return await fetch(event.request);
        })(),
    );
});

function shouldRouteSearch(event) {
    return event.request.url.startsWith(location.origin + "/search");
}

function shouldRouteDeprecationNotice(event) {
    return event.request.url.startsWith(location.origin + __uv$config.bare);
}

function shouldRouteSubscribe(event) {
    return event.request.url.startsWith(location.origin + "/subscribe");
}
