const fs               = require('fs');
const inquirer         = require('inquirer');
const consoletable     = require('console.table');
const mysql            = require('mysql2');
const db               = mysql.createConnection({host:'localhost',user:'root',password:'animals',database:'company_db'});
const selectDepartment = fs.readFileSync('db/select/department.sql','utf8');
const selectRole       = fs.readFileSync('db/select/role.sql','utf8');
const selectEmployee   = fs.readFileSync('db/select/employee.sql','utf8');
const insertDepartment = fs.readFileSync('db/insert/department.sql','utf8');
const insertRole       = fs.readFileSync('db/insert/role.sql','utf8');

async function trackEmployees(){ 
    while (true){ //Infinite Loop
    var {action} = await inquirer.prompt({type:'list',message:'What would you like to do?',name:'action', choices:['View Departments','View Roles','View Employees','Add Department','Add Role','Add Employee','Update Role','Update Employee']});
    switch(action){
        case 'View Departments': console.table((await db.promise().query(selectDepartment))[0]); break;
        case 'View Roles':       console.table((await db.promise().query(selectRole))[0]); break;
        case 'View Employees':   console.table((await db.promise().query(selectEmployee))[0]); break;
        case 'Add Department': 
            var {departmentName} = await inquirer.prompt({type:'input',message:'Whats its name?',name:'departmentName'});
            await db.execute(insertDepartment,[departmentName]);
            console.log('Added '+ departmentName +' to the data base');
            break;
        case 'Add Role':  
            var {roleTitle}      = await inquirer.prompt({type:'input',message:'Whats its title?',name:'roleTitle'});
            var {roleSalary}     = await inquirer.prompt({type:'input',message:'Salary?',name:'roleSalary'});
            var {roleDepartment} = await inquirer.prompt({type:'input',message:'Department?',name:'roleDepartment'});
            await db.execute(insertRole,[roleTitle,roleSalary,roleDepartment]);
            console.log('Added '+ roleTitle +' to the data base with a salary of '+ roleSalary +' and department of '+ roleDepartment);
            break;
        case 'Update An Employee Role': break;
}}}

trackEmployees();