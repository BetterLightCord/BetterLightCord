export default () => {
    const v2Loader = document.createElement("div");
    v2Loader.className = "bd-loaderv2";
    v2Loader.title = "LightcordBD is loading...";
    document.body.appendChild(v2Loader);
};