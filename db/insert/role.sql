INSERT INTO role (title, salary, department_id)
SELECT ?, ?, id FROM department WHERE name = ?;