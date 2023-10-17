/**
 * This file before the deploy setup conditions 
 * to generate the right final libs
 */
const {readFile, writeFile, rename, copyFile} = require('fs');
const path = require('path');
const log = require("../utils/terminal");

const SOURCE_FOLDER = "src/main/webpack/";

/**
 * FIRST REMOVE IMPORT FOR GRID SYSTEM IN MAIN.SCSS
 */
const MAIN_SCSS_FILE = "main.scss";
const MAIN_PATH = path.resolve(process.cwd(), SOURCE_FOLDER,"site",MAIN_SCSS_FILE);
const MAIN_COPY_PATH = path.resolve(process.cwd(), SOURCE_FOLDER,"site","old_" + MAIN_SCSS_FILE);

const GRID_IMPORT = "@import './grid/*.scss';";

log.info("Copy the main.scss file to old_main.scss file")
copyFile(MAIN_PATH, MAIN_COPY_PATH, (err) => {
    if(err) log.error(err);
    log.success("Copied file");
});


readFile(MAIN_PATH, "utf-8", (err, content) => {
    log.info("Removing grid importing from file");
    if(err) log.error(err);
    let replaced = content.replace(GRID_IMPORT,"");
    writeFile(MAIN_PATH,  replaced, "utf-8", (err) => {
        if(err) log.error(err);
        log.success("File has been saved it")
    });
});

/**
 * RENAME INDEX JS FILE TO NOT
 */
const INDEX_FOLDER = path.resolve(process.cwd(),SOURCE_FOLDER,"static");
const INDEX_JS = path.resolve(INDEX_FOLDER, "index.js");
const INDEX_SCSS = path.resolve(INDEX_FOLDER, "index.scss");
const INDEX_NOT_JS = path.resolve(INDEX_FOLDER, "index.not_import_js");
const INDEX_NOT_SCSS = path.resolve(INDEX_FOLDER, "index.not_import_scss");

rename(INDEX_JS, INDEX_NOT_JS, (err) => {
    if(err) log.error(err);
    log.info("start index.js renamed to index.not_import_js");
    writeFile(INDEX_JS, "", "utf-8", (err) => {
        if(err) log.error(err);
        log.success("end renaming files");
    });
});
rename(INDEX_SCSS, INDEX_NOT_SCSS, (err) => {
    if(err) log.error(err);
    log.info("start index.scss renamed to index.not_import_scss");
    writeFile(INDEX_SCSS, "", "utf-8", (err) => {
        if(err) log.error(err);    
        log.success("end renaming files");
    });
});