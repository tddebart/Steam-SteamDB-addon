let cdn = "https://cdn.jsdelivr.net/gh/SteamDatabase/BrowserExtension@latest/"

browser = {};
browser.storage = {};
browser.storage.sync = {};

browser.storage.sync.get = async function (items) {
    //TODO: actually store options instead of returning defaults
    return items;
}

browser.i18n = {};
const langKey = "steamDB_en";
async function getLang() {
    if (sessionStorage.getItem(langKey) === null) {
        console.log('[SteamDB addon] getting EN lang');

        const response = await fetch(cdn + "_locales/en/messages.json");
        sessionStorage.setItem(langKey, JSON.stringify(await response.json()));
    }
}
getLang();

browser.i18n.getMessage = function (messageKey, substitutions) {
    if (!Array.isArray(substitutions)) {
        substitutions = [substitutions];
    }

    let lang = JSON.parse(sessionStorage.getItem(langKey));
    if (lang === null || Object.keys(lang).length === 0) {
        console.error('SteamDB lang file not loaded in.');
        return messageKey;
    }

    let messageTemplate = lang[messageKey].message;
    substitutions.forEach((substitution, index) => {
        messageTemplate = messageTemplate.replace(`$${index + 1}`, substitution);
    });

    return messageTemplate;
}

browser.runtime = {};

browser.runtime.getURL = function (res) {
    return cdn + res;
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