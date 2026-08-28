document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const totalCount = document.getElementById('total-count');
    const completedCount = document.getElementById('completed-count');
    const emptyState = document.getElementById('empty-state');
    const themeToggle = document.getElementById('theme-toggle');
    const greeting = document.getElementById('greeting');

    // Set Dynamic Greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) greeting.textContent = "Good Morning! ☀️";
    else if (hour < 18) greeting.textContent = "Good Afternoon! 🌤️";
    else greeting.textContent = "Good Evening! 🌙";

    // Load tasks from LocalStorage
    let tasks = JSON.parse(localStorage.getItem('azure_tasks')) || [];

    function saveAndRender() {
        localStorage.setItem('azure_tasks', JSON.stringify(tasks));
        renderTasks();
    }

    function renderTasks() {
        taskList.innerHTML = '';
        
        if (tasks.length === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
        }

        let completed = 0;

        tasks.forEach((task, index) => {
            if (task.completed) completed++;

            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <div class="task-content" onclick="toggleTask(${index})">
                    <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="event.stopPropagation(); toggleTask(${index})">
                    <span>${escapeHtml(task.text)}</span>
                </div>
                <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
            `;
            taskList.appendChild(li);
        });

        totalCount.textContent = tasks.length;
        completedCount.textContent = completed;
    }

    // Global helper mapping for inline event handlers
    window.toggleTask = function(index) {
        tasks[index].completed = !tasks[index].completed;
        saveAndRender();
    };

    window.deleteTask = function(index) {
        tasks.splice(index, 1);
        saveAndRender();
    };

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();
        if (text) {
            tasks.push({ text, completed: false });
            taskInput.value = '';
            saveAndRender();
        }
    });

    // Theme Toggle Logic
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            themeToggle.textContent = '🌙';
            localStorage.setItem('azure_theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.textContent = '☀️';
            localStorage.setItem('azure_theme', 'dark');
        }
    });

    // Load saved theme preference
    const savedTheme = localStorage.getItem('azure_theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
    }

    // Initial render
    renderTasks();

    function escapeHtml(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }
});