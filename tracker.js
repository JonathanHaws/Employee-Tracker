const fs               = require('fs');
const inquirer         = require('inquirer');
const consoletable     = require('console.table');
const mysql            = require('mysql2');
const db               = mysql.createConnection({host:'localhost',user:'root',password:'animals',database:'company_db'});
const selectDepartment = fs.readFileSync('db/select/department.sql','utf8');
const selectRole       = fs.readFileSync('db/select/role.sql','utf8');
const selectEmployee   = fs.readFileSync('db/select/employee.sql','utf8');

async function trackEmployees(){ 
    while (true){ //Infinite Loop
    var {action} = await inquirer.prompt({type:'list',message:'What would you like to do?',name:'action', choices:['View All Departments','View All Roles','View All Employees','Add A Department','Add An Employee','Update An Employee Role']});
    switch(action){
        case 'View All Departments': console.table((await db.promise().query(selectDepartment))[0]); break;
        case 'View All Roles':       console.table((await db.promise().query(selectRole))[0]); break;
        case 'View All Employees':   console.table((await db.promise().query(selectEmployee))[0]); break;
        case 'Add A Department': break;
        case 'Add An Employee':  break;
        case 'Update An Employee Role': break;
}}}

trackEmployees();