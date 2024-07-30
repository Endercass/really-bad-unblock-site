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
    this.commitedUrl = this.url;

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
                onclick={() => {
                    this.commitedUrl = this.url;
                }}
            >
                Go
            </button>

            <iframe
                bind:this={use(this.frame)}
                src={use(this.commitedUrl, (val) => {
                    const xorKey = [0x0, 0x2];
                    // decode with xor key above
                    return (
                        "/service/" +
                        val
                            .split("")
                            .map((char, i) =>
                                String.fromCharCode(
                                    char.charCodeAt(0) ^
                                        xorKey[i % xorKey.length],
                                ),
                            )
                            .join("")
                    );
                })}
                class={iframe}
            ></iframe>
        </div>
    );
};

export default Browser;
