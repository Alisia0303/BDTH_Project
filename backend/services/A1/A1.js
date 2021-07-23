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

function getRatio(user_point, total_questions) {
    var error_point = {law: total_questions.law - user_point.law, figure: total_questions.figure - user_point.figure, notice_board: total_questions.notice_board - user_point.notice_board}
    var recommend_question = {}
    var total_error = error_point.law + error_point.figure + error_point.notice_board
    recommend_question.law = Math.floor(error_point.law*(20/total_error))
    recommend_question.figure = Math.floor(error_point.figure*(20/total_error))
    recommend_question.notice_board = 20 - recommend_question.law - recommend_question.figure
    console.log("recommend question is", recommend_question)
    return recommend_question
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
    if (req.body.user_result.length === 0) {
        exams.traffic_law = getRandom(law, 7)
        exams.figure = getRandom(figure, 6)
        exams.notice_board = getRandom(notice_board, 7)
    }
    else if (req.body.user_result.length > 0) {
        var user_result = req.body.user_result;
        console.log("user result", user_result)
        var question_list = []
        for (var i=0; i< user_result.length; i++){
            // console.log("number ", user_result[i].number)
            var question = await A1.find({number: user_result[i].number})
            question_list.push(question)
        }
        // console.log("question list", question_list)
        var user_point = {law: 0, figure: 0, notice_board: 0}
        var total_questions = {law: 0, figure: 0, notice_board: 0}
        for (var i=0; i< user_result.length; i++) {
            // console.log("user_result[i].answer ", user_result[i].answer)
            // console.log("question_list[i].right_answer ", question_list[i][0].right_answer)
            if (user_result[i].answer === question_list[i][0].right_answer) {
                if (question_list[i][0].class === 'Luật giao thông') user_point.law = user_point.law + 1
                if (question_list[i][0].class === 'Biển báo') user_point.notice_board = user_point.notice_board + 1
                if (question_list[i][0].class === 'Sa hình') user_point.figure = user_point.figure + 1
                // console.log("user_point at ", user_point)
            }
            if (question_list[i][0].class === 'Luật giao thông') total_questions.law = total_questions.law + 1
            if (question_list[i][0].class === 'Biển báo') total_questions.notice_board = total_questions.notice_board + 1
            if (question_list[i][0].class === 'Sa hình') total_questions.figure = total_questions.figure + 1
        }
        console.log("user point is ", user_point)
        console.log("total question is", total_questions)
        var recommend_question = getRatio(user_point, total_questions)
        exams.traffic_law = getRandom(law, recommend_question.law)
        exams.figure = getRandom(figure, recommend_question.figure)
        exams.notice_board = getRandom(notice_board, recommend_question.notice_board)
    }
    
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