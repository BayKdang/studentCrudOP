const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const studentsFilePath = './students.json';
const readStudentsData = () => {
    try {
        const data = fs.readFileSync(studentsFilePath);
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading students data:', error);
        return [];
    }
};
const writeStudentsData = (students) => {
    try {
        fs.writeFileSync(studentsFilePath, JSON.stringify(students, null, 2));
    } catch (error) {
        console.error('Error writing students data:', error);
    }
};

app.get('/students', (req, res) => {
    const students = readStudentsData();
    res.json(students);
});
app.post('/students', (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    const students = readStudentsData();
    const newStudent = {
        id: students.length ? students[students.length - 1].id + 1 : 1, // Auto-increment ID
        name: name
    };

    students.push(newStudent);
    writeStudentsData(students);
    res.status(201).json(newStudent);
});
app.put('/students/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    const students = readStudentsData();
    const studentIndex = students.findIndex(student => student.id == id);

    if (studentIndex === -1) {
        return res.status(404).json({ error: 'Student not found' });
    }

    students[studentIndex].name = name;
    writeStudentsData(students);
    res.json(students[studentIndex]);
});
app.delete('/students/:id', (req, res) => {
    const { id } = req.params;
    const students = readStudentsData();
    const studentIndex = students.findIndex(student => student.id == id);

    if (studentIndex === -1) {
        return res.status(404).json({ error: 'Student not found' });
    }

    const deletedStudent = students.splice(studentIndex, 1);
    writeStudentsData(students);
    res.json(deletedStudent);
});
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
