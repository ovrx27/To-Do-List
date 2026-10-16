
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const counter = document.getElementById("counter");
const clearBtn = document.getElementById("clear-btn");
const filterButtons = document.querySelectorAll(".filter-btn");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";

// Save tasks in Local Storage
function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Display tasks
function renderTodos() {
    todoList.innerHTML = "";

    const filteredTodos = todos.filter(todo => {
        if (currentFilter === "pending") {
            return !todo.completed;
        }

        if (currentFilter === "completed") {
            return todo.completed;
        }

        return true;
    });

    if (filteredTodos.length === 0) {
        const message = document.createElement("li");
        message.className = "empty-message";
        message.textContent = "No tasks here yet!";
        todoList.appendChild(message);
    }

    filteredTodos.forEach(todo => {
        const li = document.createElement("li");
        li.className = "todo-item";

        if (todo.completed) {
            li.classList.add("completed");
        }

        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;
        checkbox.setAttribute("aria-label", "Complete task");

        checkbox.addEventListener("change", () => {
            todo.completed = checkbox.checked;
            saveTodos();
            renderTodos();
        });

        // Task text
        const span = document.createElement("span");
        span.className = "todo-text";
        span.textContent = todo.text;

        // Edit button
        const editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.className = "edit-btn";
        editBtn.textContent = "Edit";

        editBtn.addEventListener("click", () => {
            const newText = prompt("Edit your task:", todo.text);

            if (newText === null) {
                return;
            }

            if (newText.trim() === "") {
                alert("Task cannot be empty!");
                return;
            }

            todo.text = newText.trim();

            saveTodos();
            renderTodos();
        });

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", () => {
            todos = todos.filter(item => item.id !== todo.id);
            saveTodos();
            renderTodos();
        });

        li.append(checkbox, span, editBtn, deleteBtn);
        todoList.appendChild(li);
    });

    // Update remaining tasks counter
    const pendingCount = todos.filter(todo => !todo.completed).length;
    counter.textContent = `${pendingCount} tasks left`;
}

// Add new task
form.addEventListener("submit", event => {
    event.preventDefault();

    const text = input.value.trim();

    if (text === "") {
        input.focus();
        return;
    }

    todos.push({
        id: Date.now() + Math.random(),
        text: text,
        completed: false
    });

    input.value = "";

    saveTodos();
    renderTodos();
    input.focus();
});

// Filter tasks
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");
        renderTodos();
    });
});

// Remove all completed tasks
clearBtn.addEventListener("click", () => {
    todos = todos.filter(todo => !todo.completed);

    saveTodos();
    renderTodos();
});

// Initial display
renderTodos();