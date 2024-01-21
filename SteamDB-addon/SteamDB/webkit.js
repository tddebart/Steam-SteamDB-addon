import {getCdn, getSteamLoopBackHost} from "./shared.js";
import {getNeededScripts} from "./script-loading.js"


// The location of browser.js relative to your skin folder, so skins/{skinName}/{browserFileLoc}
let browserFileLoc = "SteamDB/browser.js";


async function loadScript(src) {
    return new Promise((resolve, reject) => {
        var script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', src);

        script.addEventListener('load', () => {
            resolve();
        });

        script.addEventListener('error', () => {
            reject(new Error('Failed to load script'));
        });

        document.head.appendChild(script);
    });
}

async function loadPageSpecificScripts() {
    let href = window.location.href;

    let scripts = getNeededScripts();

    for (const script of scripts) {
        await loadScript(getCdn(script))
    }
}

async function main() {
    await loadScript(getSteamLoopBackHost(browserFileLoc));
    await loadScript(getCdn("scripts/common.js"));
    await loadScript(getCdn("scripts/global.js"));

    await loadPageSpecificScripts();
}

main();