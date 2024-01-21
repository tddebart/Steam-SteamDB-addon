browser = {};
browser.storage = {};
browser.storage.sync = {};

browser.storage.sync.get = async function (items) {
    //TODO: actually store options instead of returning defaults
    return items;
}

browser.i18n = {};

browser.i18n.getMessage = function (message, substitutions) {
    //TODO: use translation file instead of returning translation id's
    return message;
}

browser.runtime = {};

browser.runtime.getURL = function (res) {
    return "https://cdn.jsdelivr.net/gh/SteamDatabase/BrowserExtension@latest/" + res;
}

let oldCreateElement = document.createElement.bind(document);

document.createElement = function (tagName, options) {
    let tag = oldCreateElement(tagName, options);

    if (tagName.toLowerCase() === "a") {
        var callback = function(mutationsList) {
            for(let mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
                    if (!tag.href.includes('steampowered.com')) {
                        tag.href = "steam://openurl_external/" + tag.href;
                    }

                    observer.disconnect();
                }
            }
        };

        var observer = new MutationObserver(callback);

        observer.observe(tag, { attributes: true });
    }

    return tag;
}