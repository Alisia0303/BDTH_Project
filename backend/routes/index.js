var LawDescriptionRouter = require("./Law/LawDescription");
var LawsChapterRouter = require("./Law/LawsChapter");
var LawsRuleRouter = require("./Law/LawsRule");
var FineRouter = require("./Fine/Fines")
var A1Router = require("./A1/A1")
const APIRouter = require("express").Router();

//APIRouter.use("/law_description", LawDescriptionRouter);
APIRouter.use("/law_chapter", LawsChapterRouter);
APIRouter.use("/law_rule", LawsRuleRouter);
APIRouter.use("/fine", FineRouter);
APIRouter.use("/a1", A1Router)

module.exports = APIRouter;
