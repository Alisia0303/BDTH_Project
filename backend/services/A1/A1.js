const { query } = require('express');

A1 = require('../../schema/A1/A1');

function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

exports.exams = async function(req, res){
    var notice_board = await A1.find({class: "Biển báo"}) 
    notice_board = notice_board.map(({_id, question, right_answer, image, number, answer_list, explain}) => ({_id, question, image, number, answer_list}))
    // notic_board = notice_board.map()
    var figure = await A1.find({class: "Sa hình"})
    figure = figure.map(({_id, question, right_answer, image, number, answer_list, explain}) => ({_id, question, image, number, answer_list}))
    var law = await A1.find({class: "Luật giao thông"})
    law = law.map(({_id, question, right_answer, image, number, answer_list, explain}) => ({_id, question, image, number, answer_list}))
    var exams = {}
    exams.traffic_law = getRandom(law, 7)
    exams.figure = getRandom(figure, 6)
    exams.notice_board = getRandom(notice_board, 7)
    res.json({
        status: "success",
        message: 'Exams detail following',
        count: exams.traffic_law.length + exams.figure.length + exams.notice_board.length,
        data: exams
    });
}

exports.points = async function(req, res) {
    var user_result = req.body.user_result;
    // console.log("user_result", user_result)
    var question_list = []
    for (var i=0; i< user_result.length; i++){
        // console.log("number ", user_result[i].number)
        var question = await A1.find({number: user_result[i].number})
        question_list.push(question)
    }
    // console.log("question list", question_list)
    var user_point = 0
    for (var i=0; i< user_result.length; i++) {
        // console.log("user_result[i].answer ", user_result[i].answer)
        // console.log("question_list[i].right_answer ", question_list[i][0].right_answer)
        if (user_result[i].answer === question_list[i][0].right_answer) {
            user_point = user_point + 1
            // console.log("user_point at ", user_point)
        }
    }
    console.log("user point is ", user_point)
    res.json({
        status: "success",
        message: 'Points detail following',
        count: question_list.length,
        data: {points: user_point, exams: question_list}
    });
}