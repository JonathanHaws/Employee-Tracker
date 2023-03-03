const fs            = require('fs');
const inquirer      = require('inquirer');
const mysql         = require('mysql2');
const consoletable  = require('console.table');

const db = mysql.createConnection({host:'localhost',user:'root',password:'animals',database:'company_db'});

async function trackEmployees(){
    var {action} = await inquirer.prompt({type:'list',message:'What would you like to do?',name:'action', choices:['View All Departments','View All Roles','View All Employees','Add A Department','Add An Employee','Update An Employee Role']});
    if (action == 'View All Departments'){

    } else if (action == 'View All Roles'){

    } else if (action == 'View All Employees'){
    
    } else if (action == 'Add A Department'){

    } else if (action == 'Add An Employee'){
    
    } else if (action == 'Update An Employee Role'){

    }
}

trackEmployees();