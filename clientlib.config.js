const path = require('path');
const { writeFile, mkdir } = require("fs");
const shell = require("shelljs");

const BUILD_DIR = path.join(__dirname, 'dist');
const CLIENTLIB_DIR = path.join(
  __dirname,
  'bundle',
  'apps',
  'src',
  'main',
  'content',
  'jcr_root',
  'apps',
  'frontend',
  'otempo',
  'theme',
);

const createContent = () => {
  const CONTENT = `<?xml version="1.0" encoding="UTF-8"?>\r<jcr:root xmlns:cq="http://www.day.com/jcr/cq/1.0" xmlns:jcr="http://www.jcp.org/jcr/1.0"\r jcr:primaryType="cq:ClientLibraryFolder"\r allowProxy="{Boolean}true"\r categories="[otempo.theme]"/>`;
  const JS_TXT = `theme.js`;
  const CSS_TXT = `theme.css`;

  writeFile(path.join(CLIENTLIB_DIR, ".content.xml"), CONTENT, () => {
    writeFile(path.join(CLIENTLIB_DIR, "js.txt"), JS_TXT, () => {
      writeFile(path.join(CLIENTLIB_DIR, "css.txt"), CSS_TXT, () => {});
    });
  });
  
  
};

const init = async () => {
  const CWD = process.cwd();
  shell.rm("bundle");
  shell.mkdir("-p", CLIENTLIB_DIR);
  shell.cp(path.join(BUILD_DIR,"theme.css"), CLIENTLIB_DIR);
  shell.cp(path.join(BUILD_DIR,"theme.js"), CLIENTLIB_DIR);
  shell.cp("-r",path.join(BUILD_DIR,"clientlib-site/"), CLIENTLIB_DIR.concat("/resources/"));
  createContent();
};

init();