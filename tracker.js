const fs                         = require('fs');
const inquirer                   = require('inquirer');
const consoletable               = require('console.table');
const mysql                      = require('mysql2');
const {default:Prompt}           = require('inquirer/lib/prompts/base');
const db                         = mysql.createConnection({host:'localhost',user:'root',password:'animals',database:'company_db'});
const insertDepartment           = 'INSERT INTO department (name) SELECT ?;';
const insertRole                 = 'INSERT INTO role (title, salary, department_id) SELECT ?,?,?;';
const insertEmployee             = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) SELECT ?,?,?,?';
const deleteDepartment           = 'DELETE FROM department WHERE id = ?;';
const deleteRole                 = 'DELETE FROM role WHERE id = ?;';
const deleteEmployee             = 'DELETE FROM employee WHERE id = ?;';
const updateEmployee             = 'UPDATE employee SET first_name = ?, last_name = ?, role_id = ?, manager_id = ? WHERE id = ?;';
const selectDepartment           = 'SELECT * FROM department;';
const selectRole                 = 'SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id;';
const selectEmployee             = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id;';
const selectDepartmentId         = 'SELECT id FROM department WHERE name = ?;';
const selectRoleId               = 'SELECT id FROM role WHERE title = ?'
const selectEmployeeId           = "SELECT id FROM employee WHERE CONCAT(first_name, ' ',last_name) = ?;";
const selectEmployeeManagerId    = 'SELECT id, first_name, last_name FROM employee WHERE manager_id = ?;';
const selectEmployeeDepartmentId = 'SELECT e.id, e.first_name, e.last_name, r.salary, role.title AS role_title FROM employee e JOIN role r ON e.role_id = r.id JOIN department ON r.department_id = department.id JOIN role ON r.id = role.id WHERE department.id = ?;';

async function trackEmployees(){ 

    async function promptDepartmentByName(promptMessage){
        var departments = (await db.promise().query(selectDepartment))[0].map(row => row.name);
        var {name}      = await inquirer.prompt({type:'list',name:'name',message:promptMessage,choices:departments});
        var id          = (await db.promise().execute(selectDepartmentId,[name]))[0][0].id;
        return {id:id, name:name}
    }
    async function promptRoleByTitle(promptMessage){
        var roles  = (await db.promise().query(selectRole))[0].map(row => row.title);
        var {name} = await inquirer.prompt({type:'list',name:'name',message:promptMessage,choices:roles});
        var id     = (await db.promise().execute(selectRoleId,[name]))[0][0].id;
        return {id:id, name:name}   
    }
    async function promptEmployeeByName(promptMessage){
        var employees = (await db.promise().query(selectEmployee))[0].map(row => row.first_name + ' ' + row.last_name);
        var {name}    = await inquirer.prompt({type:'list',name:'name',message:promptMessage,choices:employees}); //console.log(name);
        var id        = (await db.promise().execute(selectEmployeeId,[name]))[0][0].id;
        return {id:id, name:name}   
    }
    
    async function promptForDepartment(){
        var {name} = await inquirer.prompt({type:'input',message:'Name?',name:'name'});
        console.log('Department Named'+ name);
        return {name:name}
    }
    async function promptForRole(){
        var {title}      = await inquirer.prompt({type:'input',message:'Title?',name:'title'});
        var {salary}     = await inquirer.prompt({type:'input',message:'Salary?',name:'salary'});
        var department   = await promptDepartmentByName('Department?');
        console.log(title +' with a salary of '+ salary +' and department of '+ department.name);
        return {title:title, salary:salary, department:department}   
    }
    async function promptForEmployee(){
        var {firstName} = await inquirer.prompt({type:'input',message:'First name?',name:'firstName'});
        var {lastName}  = await inquirer.prompt({type:'input',message:'Last name?',name:'lastName'});
        var role        = await promptRoleByTitle('Which Role Will They Have?');
        var manager     = await promptEmployeeByName('Who Will Be There Manager');
        console.log(firstName +' '+ lastName +' with a role of '+ role.name +' and manager '+ manager.name); //console.log(manager.id);
        return {firstName:firstName, lastName:lastName, role:role, manager:manager}
    }

    while (true){ //Infinite Loop

    var {action} = await inquirer.prompt({type:'list',message:'What would you like to do?',name:'action', choices:[
        'View Departments',
        'View Roles',
        'View Employees',
        'View Employees By Manager',
        'View Employees By Department And See Total Deparment Budget',
        'Add Department',
        'Add Role',
        'Add Employee',
        'Update Employee',
        'Delete Department',
        'Delete Role',
        'Delete Employee',
    ]});
    switch(action){
        case 'View Departments':  
            console.table((await db.promise().execute(selectDepartment))[0]); 
            break;
        case 'View Roles':        
            console.table((await db.promise().execute(selectRole))[0]); 
            break;
        case 'View Employees':    
            console.table((await db.promise().execute(selectEmployee))[0]);
            break;
        case 'View Employees By Manager':
            var manager = await promptEmployeeByName('Who is the Manager?');
            console.table((await db.promise().execute(selectEmployeeManagerId,[manager.id]))[0]);
            break;
        case 'View Employees By Department And See Total Deparment Budget':
            var department = await promptDepartmentByName('Which Department?');
            var employees  = (await db.promise().execute(selectEmployeeDepartmentId,[department.id]))[0]
            console.table(employees);//console.log(employees);
            var budget = 0;
            for (i=0; i<employees.length; i++){ budget += parseInt(employees[i].salary);}
            console.log('The total cost / budget for this department is ' + budget);
            console.log('');
            break;
        case 'Add Department':    
            var department = await promptForDepartment(); 
            await db.execute(insertDepartment,[department.name]);
            break;
        case 'Add Role':          
            var role = await promptForRole(); 
            await db.execute(insertRole,[role.title,role.salary,role.department.id]); 
            break;
        case 'Add Employee':      
            var employee = await promptForEmployee(); 
            await db.execute(insertEmployee,[employee.firstName,employee.lastName,employee.role.id,employee.manager.id]);
            break;
        case 'Delete Department': 
            var department = await promptDepartmentByName('Which do you want to delete?');
            await db.execute(deleteDepartment,[department.id]);
            console.log('Deleted Department'+ department.name)
            break;
        case 'Delete Role':
            var role = await promptRoleByTitle('Which do you want to delete?');
            await db.execute(deleteRole,[role.id]);
            console.log('Deleted Role'+ role.name);
            break;
        case 'Delete Employee': 
            var employee = await promptEmployeeByName('Which do you want to delete?');
            await db.execute(deleteEmployee,[employee.id]);
            console.log('Deleted Employee '+ employee.name);
            break;
        case 'Update Employee': 
            var existing = await promptEmployeeByName('Which do you want to Update?'); //console.log(existing);
            var employee  = await promptForEmployee(); //console.log(employee);
            await db.promise().execute(updateEmployee,[employee.firstName, employee.lastName ,employee.role.id, employee.manager.id, existing.id]);
            console.log('Updated Employee '+ employee.name);
            break;
 
}}}

trackEmployees();
