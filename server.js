const fs            = require('fs');
const inquirer      = require('inquirer');
const mysql2        = require('mysql2');
const consoletable  = require('console.table');

async function trackEmployees(){
    var {action} = await inquirer.prompt({type:'list',message:'What would you like to do?',name:'action', 
        choices:['View All Departments','View All Roles','View All Employees','Add A Department','Add An Employee','Update An Employee Role']});
    console.log(action)
}

trackEmployees();