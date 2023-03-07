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
const insertEmployee   = fs.readFileSync('db/insert/employee.sql','utf8');

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
            var departments      = (await db.promise().query(selectDepartment))[0].map(row => row.name);
            var {roleDepartment} = await inquirer.prompt({type:'list',message:'Department?',name:'roleDepartment',choices:departments});
            var roleDepartmentId = departments.indexOf(roleDepartment) +1; //console.log(roleDepartmentId)
            await db.execute(insertRole,[roleTitle,roleSalary,roleDepartmentId]);
            console.log('Added '+ roleTitle +' to the data base with a salary of '+ roleSalary +' and department of '+ roleDepartment);
            break;
        case 'Add Employee': 
            var {employeeFirstName} = await inquirer.prompt({type:'input',message:'Whats is there first name?',name:'employeeFirstName'});
            var {employeeLastName}  = await inquirer.prompt({type:'input',message:'Whats is there last name?',name:'employeeLastName'});
            var roles               = (await db.promise().query(selectRole))[0].map(row => row.title);
            var {employeeRole}      = await inquirer.prompt({type:'list',name:'employeeRole',message:'Whats is there role?',choices:roles});
            var employeeRoleId      = roles.indexOf(employeeRole) + 1; //console.log(employeeRoleId);
            var employees           = (await db.promise().query(selectEmployee))[0].map(employee => employee.first_name + ' ' + employee.last_name);
            var {employeeManager}   = await inquirer.prompt({type:'list',name:'employeeManager',message:'Who is there Manager',choices:employees});
            var employeeManagerId   = employees.indexOf(employeeManager) + 1; //console.log(employeeManagerId);
            await db.execute(insertEmployee,[employeeFirstName,employeeLastName,employeeRoleId,employeeManagerId]);
            console.log('Added '+ employeeFirstName +' '+ employeeLastName +' with a role of '+ employeeRole +' and manager '+ employeeManager);
            break;
}}}

trackEmployees();
