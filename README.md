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
    + Ex: http://localhost:3001/api/fine/list
          http://localhost:3001/api/fine/list?aviolation=SIGNS
          http://localhost:3001/api/fine/list?aviolation=SIGNS&types=bike