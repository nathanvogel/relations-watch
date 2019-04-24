"use strict";

const entitiesRouter = require("./entities");
module.context.use("/entities", entitiesRouter);
const relationsRouter = require("./relations");
module.context.use("/relations", relationsRouter);
const sourcesRouter = require("./sources");
module.context.use("/sources", sourcesRouter);
