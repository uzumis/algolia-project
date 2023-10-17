const proxy = require("browser-sync").create();
const aem = require("../../env");
const terminal = require("../utils/terminal");

async function init() {

  const WEB_DEV_PORT = "8080";
  const WEB_DEV_HOST = "http://localhost"
  const WEB_DEV_SERVER = `${WEB_DEV_HOST}:${WEB_DEV_PORT}/`;
  const WEB_DEV_THEME_CSS = `${WEB_DEV_SERVER}theme.css`;
  const WEB_DEV_THEME_JS = `${WEB_DEV_SERVER}theme.js`;

  const cssToInject = `<script>Array.from(document.head.childNodes).find(item => item.href && item.href.includes("https://static") && item.href.includes("adobeaemcloud.com")).href="${WEB_DEV_THEME_CSS}"</script>`;
  const jsToInject = `<script>Array.from(document.head.childNodes).find(item => item.src && item.src.includes("https://static") && item.src.includes("adobeaemcloud.com")).src="${WEB_DEV_THEME_JS}"</script>`;
  const GET_ENVIRONMENT = (ENVIRONMENT) => {
    let env = aem.environments.find(item => item.AEM_ENV === ENVIRONMENT);
    if (env === undefined) {
      terminal.error("you did not pass an environment as actual parameter i.e: local | dev | stage | prod");
    };
    return env;
  };
  const PROXY_PUBLISH = GET_ENVIRONMENT(process.argv[process.argv.length - 1]);

  proxy.init({
    proxy: {
      target: PROXY_PUBLISH.AEM_URL,
    },
    snippetOptions: {
      rule: {
        match: /<\/head>/i,
        fn: function (snippet, match) {
          return cssToInject + jsToInject + snippet + match;
        }
      }
    },
    logFileChanges: true,
    logLevel: "info",
    files: ["src"],
    port: 3000,
  });
};

init();