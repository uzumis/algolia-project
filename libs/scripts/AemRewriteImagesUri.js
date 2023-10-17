/**
 * This file find for all ocurrences about ORIGINAL_PREFIX in site.css file
 * and change it values to PROXY_PREFIX
 */
const {readFile, writeFile} = require('fs');
const path = require('path');
const log = require("../utils/terminal");

const ORIGINAL_PREFIX = new RegExp("url[(]images/","g");
const PROXY_PREFIX = "url(resources/images/";

const PATH = "dist";
const SITE_CSS = path.resolve(process.cwd(), PATH, "theme.css");

log.info("Exec... AemRewriteImagesUri.js");
readFile(SITE_CSS, "utf-8", (err, content) => {
    
    if(err) log.error(err);
    
    const REPLACED_CONTENT = content.replace(ORIGINAL_PREFIX, PROXY_PREFIX);
    
    log.info("Replacing all the ocurrences for", ORIGINAL_PREFIX, "to", PROXY_PREFIX);

    writeFile(SITE_CSS, REPLACED_CONTENT, 'utf-8', (err) => {
        if(err) log.error(err);
        log.success("The file has been saved");
    });
});