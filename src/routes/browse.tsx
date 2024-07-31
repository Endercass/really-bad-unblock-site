import { $ } from "../aliases";

const baseStyle = css`
    width: 100%;
    height: 100%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 6px;
`;

const iframe = css`
    width: 100%;
    height: 100%;
    border: none;
`;

const Browser: Component<
    {},
    {
        counter: number;
        url: string;
        commitedUrl: string;
        frame: HTMLIFrameElement;
    }
> = function () {
    this.counter = 0;
    this.url = "https://google.com";

    this.mount = () => {
        $("#web-manifest")?.setAttribute("href", "/browse/manifest.json");
        if (!navigator.serviceWorker) {
            location.reload();
        }
        navigator.serviceWorker.controller?.addEventListener("message", (e) => {
            console.log("SW message", e);
        });
    };
    return (
        <div class={baseStyle}>
            {/* <h1 class={title}>Dreamland.js</h1> */}
            <input type="text" bind:value={use(this.url)} />
            <button
                id="go"
                on:click={async () => {
                    if (userSettings.usegiggleshitter) {
                        const encodedUrl = await fetch(
                            "https://api." + location.host + "/encode",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ url: this.url }),
                            },
                        ).then((res) => res.json());
                        console.log("ENCODED URL", encodedUrl);
                        this.commitedUrl = encodedUrl.encoded_url;
                    }

                    const xorKey = [0x0, 0x2];
                    // decode with xor key above
                    this.commitedUrl =
                        "/service/" +
                        this.url
                            .split("")
                            .map((char, i) =>
                                String.fromCharCode(
                                    char.charCodeAt(0) ^
                                        xorKey[i % xorKey.length],
                                ),
                            )
                            .join("");
                }}
            >
                Go
            </button>

            <button
                id="giggleshitter"
                on:click={() => {
                    userSettings.usegiggleshitter =
                        !userSettings.usegiggleshitter;
                    this.commitedUrl = this.commitedUrl;
                    if (userSettings.usegiggleshitter) {
                        console.log("GIGGLESHITTER ENABLED");
                        $("#giggleshitter")?.setAttribute(
                            "style",
                            "color: red;",
                        );
                    }
                }}
            >
                <img src="/sween.jpg" alt="SWEEN" />
                TOGGLE SWEEN MODE (BASED CLCICKE ME EPEOLEEASE)
            </button>

            <iframe
                bind:this={use(this.frame)}
                src={use(this.commitedUrl)}
                class={iframe}
            ></iframe>
        </div>
    );
};

export default Browser;
