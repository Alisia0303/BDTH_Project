var LawDescriptionRouter = require("./Law/LawDescription");
var LawsChapterRouter = require("./Law/LawsChapter");
var LawsRuleRouter = require("./Law/LawsRule");
const APIRouter = require("express").Router();

//APIRouter.use("/law_description", LawDescriptionRouter);
APIRouter.use("/law_chapter", LawsChapterRouter);
APIRouter.use("/law_rule", LawsRuleRouter);

module.exports = APIRouter;
