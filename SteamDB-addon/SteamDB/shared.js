export function getCdn(url) {
    return "https://cdn.jsdelivr.net/gh/SteamDatabase/BrowserExtension@latest/" + url;
}

export function getSteamLoopBackHost(url) {
    let steamLoopBack = "";

    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
        let src = scripts[i].getAttribute('src');
        if (src && src.includes('webkit.js')) {
            steamLoopBack = src.slice(0,src.indexOf('webkit.js'), src);
        }
    }

    return steamLoopBack + url;
}