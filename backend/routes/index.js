var LawDescriptionRouter = require("./Law/LawDescription");
var LawsChapterRouter = require("./Law/LawsChapter");
var LawsRuleRouter = require("./Law/LawsRule");
var FineRouter = require("./Fine/Fines")
const APIRouter = require("express").Router();

//APIRouter.use("/law_description", LawDescriptionRouter);
APIRouter.use("/law_chapter", LawsChapterRouter);
APIRouter.use("/law_rule", LawsRuleRouter);
APIRouter.use("/fine", FineRouter)

module.exports = APIRouter;
