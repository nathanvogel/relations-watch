"use strict";

const entitiesRouter = require("./entities");
module.context.use("/entities", entitiesRouter);
const relationsRouter = require("./relations");
module.context.use("/relations", relationsRouter);
const sourcesRouter = require("./sources");
module.context.use("/sources", sourcesRouter);
const dataimportRouter = require("./dataimport");
module.context.use("/dataimport", dataimportRouter);
const graphsRouter = require("./graphs");
module.context.use("/graphs", graphsRouter);
