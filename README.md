# BDTH_Project

1. Prerequisite

- Install NodeJs.
- Install NPM.

2. Start project

- Clone project: git clone https://github.com/Alisia0303/BDTH_Project.git
- Start backend: 
    + cd folder backend, cd backend
    + Install package: npm install
    + Start local: npm start
- Start frontend:
    + cd folder frontend, cd frontend
    + copy code into frontend folder

3. Ready API:

+++ Law Chapter:
- Get all chapters: 
    + Url: http://localhost:3001/api/law_chapter/list
    + Payload: None
- Get a chapter by number:
    + Url: http://localhost:3001/api/law_chapter/getNumber
    + Payload: number
    + Ex: http://localhost:3001/api/law_chapter/getNumber?number=I

+++ Law Rule:
- Get all rules: 
    + Url: http://localhost:3001/api/law_rule/list
    + Payload: None
- Get a chapter by number:
    + Url: http://localhost:3001/api/law_rule/getNumber
    + Payload: number
    + Ex: http://localhost:3001/api/law_rule/getNumber?number=10

+++ Fines:
- Get rules with filter by aviolation or types:
    + Url: http://localhost:3001/api/fine/list
    + Payload: aviolation, types or not.
    + Ex: 
            
        http://localhost:3001/api/fine/list

        http://localhost:3001/api/fine/list?aviolation=SIGNS

        http://localhost:3001/api/fine/list?aviolation=SIGNS&types=bike


+++ Exams:
- Get 20 questions:
    + Url: http://localhost:3001/api/a1/exams
    + Ex:  
        curl --location --request POST 'http://localhost:3001/api/a1/exams' \
             --header 'Content-Type: application/json' \
             --data-raw '{
                "user_result": []
            }'

        curl --location --request POST 'http://localhost:3001/api/a1/exams' \
             --header 'Content-Type: application/json' \
             --data-raw '{
                    "user_result": [ {"number": 10,
                        "answer": 2},
                        {"number": 20,
                        "answer": 2},
                        {"number": 30,
                        "answer": 2},
                        {"number": 40,
                        "answer": 2},
                        {"number": 50,
                        "answer": 2},
                        {"number": 60,
                        "answer": 2},
                        {"number": 70,
                        "answer": 2},
                        {"number": 80,
                        "answer": 2},
                        {"number": 90,
                        "answer": 2},
                        {"number": 100,
                        "answer": 2},
                        {"number": 110,
                        "answer": 2},
                        {"number": 120,
                        "answer": 2},
                        {"number": 130,
                        "answer": 2},
                        {"number": 140,
                        "answer": 2},
                        {"number": 150,
                        "answer": 2},
                        {"number": 160,
                        "answer": 2},
                        {"number": 170,
                        "answer": 2},
                        {"number": 180,
                        "answer": 2},
                        {"number": 190,
                        "answer": 2},
                        {"number": 199,
                        "answer": 2}]
        }'

- Get points and return right answers:
    + Url: http://localhost:3001/api/a1/points
    + Ex: 
       curl --location --request POST 'http://localhost:3001/api/a1/points' \
            --header 'Content-Type: application/json' \
            --data-raw '{
                "user_result": [
                    {"number": 10,
                    "answer": 2},
                    {"number": 20,
                    "answer": 2},
                    {"number": 30,
                    "answer": 2},
                    {"number": 40,
                    "answer": 2},
                    {"number": 50,
                    "answer": 2},
                    {"number": 60,
                    "answer": 2},
                    {"number": 70,
                    "answer": 2},
                    {"number": 80,
                    "answer": 2},
                    {"number": 90,
                    "answer": 2},
                    {"number": 100,
                    "answer": 2},
                    {"number": 110,
                    "answer": 2},
                    {"number": 120,
                    "answer": 2},
                    {"number": 130,
                    "answer": 2},
                    {"number": 140,
                    "answer": 2},
                    {"number": 150,
                    "answer": 2},
                    {"number": 160,
                    "answer": 2},
                    {"number": 170,
                    "answer": 2},
                    {"number": 180,
                    "answer": 2},
                    {"number": 190,
                    "answer": 2},
                    {"number": 199,
                    "answer": 2}
                ]
            }'