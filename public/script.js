const baseUrl = 'http://localhost:3002/students'; // Use the full URL to avoid CORS issues

const addButton = document.getElementById('add'); // Button to open modal
const addModal = document.getElementById('modal'); // Modal element
const closeModalButton = document.getElementById('closeModal'); // Close button on the modal
const studentNameInput = document.getElementById('studentName'); // Input for the student name
const addForm = document.getElementById('addForm'); // The form for adding student

// Fetch all students
async function fetchStudents() {
    try {
        const response = await fetch(baseUrl);
        if (!response.ok) throw new Error('Failed to fetch students');
        const students = await response.json();
        
        const tableBody = document.querySelector('#studentTableBody');
        tableBody.innerHTML = '';

        students.forEach(student => {
            const row = `<tr class="tr1">
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>
                    <button class="delete" onclick="deleteStudent(${student.id})">Delete</button>
                </td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error(error);
        alert('An error occurred while fetching students.');
    }
}

// Open the modal to add a student
addButton.addEventListener('click', () => {
    addModal.style.display = 'flex'; // Show modal
});

// Close the modal
closeModalButton.addEventListener('click', () => {
    addModal.style.display = 'none'; // Hide modal
    studentNameInput.value = ''; // Clear the input field when closing
});

// Close the modal if the user clicks outside of it
window.addEventListener('click', (event) => {
    if (event.target === addModal) {
        addModal.style.display = 'none';
        studentNameInput.value = '';
    }
});

// Add a student
async function addStudent(event) {
    event.preventDefault(); // Prevent the form from submitting

    const name = studentNameInput.value;
    if (name) {
        try {
            const response = await fetch(baseUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });

            if (!response.ok) throw new Error('Failed to add student');
            
            fetchStudents(); // Refresh students table
            addModal.style.display = 'none'; // Close modal
            studentNameInput.value = ''; // Clear the input field
        } catch (error) {
            console.error(error);
            alert('An error occurred while adding the student.');
        }
    }
}

// Delete a student
async function deleteStudent(id) {
    try {
        const response = await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete student');
        
        fetchStudents(); // Refresh students table
    } catch (error) {
        console.error(error);
        alert('An error occurred while deleting the student.');
    }
}

// Initial fetch of students when the page loads
fetchStudents();

// Attach the addStudent function to the form submit event
addForm.addEventListener('submit', addStudent);
