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
const deleteDepartment = fs.readFileSync('db/delete/department.sql','utf8');
const deleteRole       = fs.readFileSync('db/delete/role.sql','utf8');
const deleteEmployee   = fs.readFileSync('db/delete/employee.sql','utf8');

async function trackEmployees(){ 

    async function promptDepartmentByName(promptMessage){
        var departments = (await db.promise().query(selectDepartment))[0].map(row => row.name);
        var {name}      = await inquirer.prompt({type:'list',name:'name',message:promptMessage,choices:departments});
        var id          = departments.indexOf(name) + 1; 
        return {id:id, name:name}
    }
    async function promptRoleByTitle(promptMessage){
        var roles  = (await db.promise().query(selectRole))[0].map(row => row.title);
        var {name} = await inquirer.prompt({type:'list',name:'name',message:promptMessage,choices:roles});
        var id     = roles.indexOf(name) + 1;
        return {id:id, name:name}   
    }
    async function promptEmployeeByName(promptMessage){
        var employees = (await db.promise().query(selectEmployee))[0].map(row => row.first_name + ' ' + row.last_name);
        var {name}    = await inquirer.prompt({type:'list',name:'name',message:promptMessage,choices:employees});
        var id        = employees.indexOf(name) + 1; 
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
        console.log(firstName +' '+ lastName +' with a role of '+ role.name +' and manager '+ manager.name);
        return {firstName:firstName, lastName:lastName, role:role, manager:manager}
    }

    while (true){ //Infinite Loop

    var {action} = await inquirer.prompt({type:'list',message:'What would you like to do?',name:'action', choices:[
        'View Departments',
        'View Roles',
        'View Employees',
        'Add Department',
        'Add Role',
        'Add Employee',
        'Update Department',
        'Update Role',
        'Update Employee',
        'Delete Department',
        'Delete Role',
        'Delete Employee',
    ]});
    switch(action){
        case 'View Departments':  
            console.table((await db.promise().query(selectDepartment))[0]); 
            break;
        case 'View Roles':        
            console.table((await db.promise().query(selectRole))[0]); 
            break;
        case 'View Employees':    
            console.table((await db.promise().query(selectEmployee))[0]); 
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
}}}

trackEmployees();
