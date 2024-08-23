// script.js
document.addEventListener('DOMContentLoaded', loadTasks);
document.getElementById('add-task').addEventListener('click', addTask);
document.getElementById('search-task').addEventListener('input', filterTasks);
document.getElementById('filter-priority').addEventListener('change', filterTasks);

function addTask() {
    const taskName = document.getElementById('task-name').value;
    const taskPriority = document.getElementById('task-priority').value;
    const taskDate = document.getElementById('task-date').value;
    const taskCategory = document.getElementById('task-category').value;

    if (taskName === '' || taskDate === '' || taskCategory === '') {
        alert('Please fill in all fields');
        return;
    }

    const taskList = document.getElementById('task-list');

    const listItem = document.createElement('li');
    listItem.setAttribute('data-priority', taskPriority);
    listItem.innerHTML = `
        <span>
            <strong>${taskName}</strong> 
            <em>(${taskCategory})</em> 
            <br> Due: ${taskDate} 
        </span>
        <button class="delete-button">Delete</button>
    `;

    listItem.addEventListener('click', () => {
        listItem.classList.toggle('completed');
        saveTasks();
    });

    listItem.querySelector('.delete-button').addEventListener('click', (e) => {
        e.stopPropagation();
        taskList.removeChild(listItem);
        saveTasks();
    });

    taskList.appendChild(listItem);

    saveTasks();

    document.getElementById('task-name').value = '';
    document.getElementById('task-date').value = '';
    document.getElementById('task-category').value = '';
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#task-list li').forEach(task => {
        tasks.push({
            name: task.querySelector('strong').innerText,
            priority: task.getAttribute('data-priority'),
            date: task.querySelector('em').nextSibling.textContent.trim().split('Due: ')[1],
            category: task.querySelector('em').innerText.replace(/[()]/g, ''),
            completed: task.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const taskList = document.getElementById('task-list');

        const listItem = document.createElement('li');
        listItem.setAttribute('data-priority', task.priority);
        listItem.innerHTML = `
            <span>
                <strong>${task.name}</strong> 
                <em>(${task.category})</em> 
                <br> Due: ${task.date} 
            </span>
            <button class="delete-button">Delete</button>
        `;

        if (task.completed) {
            listItem.classList.add('completed');
        }

        listItem.addEventListener('click', () => {
            listItem.classList.toggle('completed');
            saveTasks();
        });

        listItem.querySelector('.delete-button').addEventListener('click', (e) => {
            e.stopPropagation();
            taskList.removeChild(listItem);
            saveTasks();
        });

        taskList.appendChild(listItem);
    });
}

function filterTasks() {
    const search = document.getElementById('search-task').value.toLowerCase();
    const filterPriority = document.getElementById('filter-priority').value;

    document.querySelectorAll('#task-list li').forEach(task => {
        const taskText = task.querySelector('strong').innerText.toLowerCase();
        const taskPriority = task.getAttribute('data-priority');

        const matchesSearch = taskText.includes(search);
        const matchesPriority = filterPriority === 'All' || taskPriority === filterPriority;

        if (matchesSearch && matchesPriority) {
            task.style.display = '';
        } else {
            task.style.display = 'none';
        }
    });
}
