/**
 * This file undo the changes that have been made
 * by BeforeDeploy file
 */
const { rename, stat, unlink } = require('fs');
const path = require('path');
const log = require("../utils/terminal");

const SOURCE_FOLDER = "src/main/webpack/";

/**
 * DELETE MAIN.SCSS AND RENAME OLD_MAIN.SCSS TO MAIN.SCSS
 */
const MAIN_SCSS_FILE = "main.scss";
const MAIN_PATH = path.resolve(process.cwd(), SOURCE_FOLDER, "site", MAIN_SCSS_FILE);
const MAIN_COPY_PATH = path.resolve(process.cwd(), SOURCE_FOLDER, "site", "old_" + MAIN_SCSS_FILE);


log.info("Check for old_main.scss");
stat(MAIN_COPY_PATH, (errCopy) => {
    if (errCopy) throwError(errCopy);
    stat(MAIN_PATH, (errMain) => {
        if (errMain) log.error(errMain);

        log.info("Delete main.scss");
        unlink(MAIN_PATH, (err) => {
            if(err) log.error(err);
            log.success("end deleting files");
        });
        log.info("Rename old_main.scss to main.scss");
        rename(MAIN_COPY_PATH, MAIN_PATH, (err) => {
            if(err) log.error(err);
            log.success("end renaming files");
        });
    });
});

/**
 * REVERTING INDEX FILE NAMES
 */
const INDEX_FOLDER = path.resolve(process.cwd(), SOURCE_FOLDER, "static");
const INDEX_JS = path.resolve(INDEX_FOLDER, "index.js");
const INDEX_SCSS = path.resolve(INDEX_FOLDER, "index.scss");
const INDEX_NOT_JS = path.resolve(INDEX_FOLDER, "index.not_import_js");
const INDEX_NOT_SCSS = path.resolve(INDEX_FOLDER, "index.not_import_scss");

log.info("Reverting index.not_import_js to index.js");
rename(INDEX_NOT_JS, INDEX_JS, (err) => {
    if(err) log.error(err);
    log.success("end reverting files");
});

log.info("Reverting index.not_import_scss to index.scss");
rename(INDEX_NOT_SCSS, INDEX_SCSS, (err) => {
    if(err) log.error(err);
    log.success("end reverting files");
});