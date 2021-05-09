const fse = require("fs-extra");
const path = require('path');
fse.copySync("./packages/frontend/build", "./packages/backend/client", { overwrite: true });
