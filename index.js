const express = require('express');
const fs = require('fs'); // Built-in Node module
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const DATA_FILE = './data.json';

// Helper function to read data from the file
const readData = () => {
    const jsonData = fs.readFileSync(DATA_FILE);
    return JSON.parse(jsonData);
};

// Helper function to write data to the file
const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

app.use(express.static('public'));

// GET: View all employees
app.get('/employees', (req, res) => {
    const employees = readData();
    res.json(employees);
});

// POST: Add a new employee
app.post('/employees', (req, res) => {
    const employees = readData();
    const newEmployee = {
        id: employees.length + 1,
        name: req.body.name,
        role: req.body.role
    };
    employees.push(newEmployee);
    writeData(employees); // Save back to the file
    res.status(201).json(newEmployee);
});

// Update an employee
app.put('/employees/:id', (req, res) => {
    let employees = readData();
    const id = parseInt(req.params.id);
    const index = employees.findIndex(e => e.id === id);

    if (index !== -1) {
        // Update name or role if provided in the request body
        employees[index].name = req.body.name || employees[index].name;
        employees[index].role = req.body.role || employees[index].role;
        
        writeData(employees);
        res.json(employees[index]);
    } else {
        res.status(404).send('Employee not found');
    }
});

// Delete an employee
app.delete('/employees/:id', (req, res) => {
    let employees = readData();
    const id = parseInt(req.params.id);
    const newEmployees = employees.filter(e => e.id !== id);

    if (employees.length !== newEmployees.length) {
        writeData(newEmployees);
        res.send(`Employee with ID ${id} deleted.`);
    } else {
        res.status(404).send('Employee not found');
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));