"use strict";


/* =====================================================
   TASK 03
   JAVASCRIPT TO-DO LIST
   ===================================================== */


/* =====================================================
   1. APPLICATION STATE
   ===================================================== */

const STORAGE_KEY = "task03-todo-items";


let todos = loadTodos();


let currentFilter = "all";


/* =====================================================
   2. DOM ELEMENTS
   ===================================================== */

const todoForm =
    document.getElementById("todo-form");


const todoInput =
    document.getElementById("todo-input");


const todoList =
    document.getElementById("todo-list");


const emptyState =
    document.getElementById("empty-state");


const statusMessage =
    document.getElementById("status-message");


const allCount =
    document.getElementById("all-count");


const activeCount =
    document.getElementById("active-count");


const completedCount =
    document.getElementById("completed-count");


const filters =
    document.querySelector(".filters");


/* =====================================================
   3. LOCAL STORAGE
   ===================================================== */

function loadTodos() {

    try {

        const storedTodos =
            window.localStorage.getItem(
                STORAGE_KEY
            );


        if (!storedTodos) {

            return [];

        }


        const parsedTodos =
            JSON.parse(storedTodos);


        return Array.isArray(parsedTodos)
            ? parsedTodos
            : [];

    } catch (error) {

        console.error(
            "Unable to load saved tasks:",
            error
        );

        return [];

    }

}


function saveTodos() {

    window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(todos)
    );

}


/* =====================================================
   4. CREATE
   ===================================================== */

function createTodo(text) {

    const todo = {

        id:
            `${Date.now()}-${Math.random()
                .toString(16)
                .slice(2)}`,

        text: text.trim(),

        completed: false,

        createdAt:
            new Date().toISOString()

    };


    todos.push(todo);


    saveTodos();


    render();

}


/* =====================================================
   5. READ
   ===================================================== */

function getFilteredTodos() {

    switch (currentFilter) {

        case "active":

            return todos.filter(
                todo => !todo.completed
            );


        case "completed":

            return todos.filter(
                todo => todo.completed
            );


        default:

            return todos;

    }

}


function render() {

    const filteredTodos =
        getFilteredTodos();


    todoList.innerHTML = "";


    filteredTodos.forEach(
        todo => {

            const listItem =
                createTodoElement(todo);


            todoList.appendChild(
                listItem
            );

        }
    );


    updateCounts();


    updateEmptyState(
        filteredTodos.length
    );

}


/* =====================================================
   6. DYNAMIC DOM ELEMENT
   ===================================================== */

function createTodoElement(todo) {

    const li =
        document.createElement("li");


    li.className =
        "todo-item";


    li.dataset.id =
        todo.id;


    if (todo.completed) {

        li.classList.add(
            "completed"
        );

    }


    const completeButton =
        document.createElement("button");


    completeButton.type =
        "button";


    completeButton.className =
        "complete-button";


    completeButton.dataset.action =
        "toggle";


    completeButton.setAttribute(
        "aria-label",
        todo.completed
            ? "Mark task as active"
            : "Mark task as completed"
    );


    completeButton.setAttribute(
        "aria-pressed",
        String(todo.completed)
    );


    completeButton.textContent =
        todo.completed
            ? "✓"
            : "";


    const textElement =
        document.createElement("span");


    textElement.className =
        "task-text";


    textElement.textContent =
        todo.text;


    const actions =
        document.createElement("div");


    actions.className =
        "task-actions";


    const editButton =
        document.createElement("button");


    editButton.type =
        "button";


    editButton.className =
        "action-button";


    editButton.dataset.action =
        "edit";


    editButton.textContent =
        "Edit";


    editButton.setAttribute(
        "aria-label",
        `Edit task: ${todo.text}`
    );


    const deleteButton =
        document.createElement("button");


    deleteButton.type =
        "button";


    deleteButton.className =
        "action-button delete-button";


    deleteButton.dataset.action =
        "delete";


    deleteButton.textContent =
        "Delete";


    deleteButton.setAttribute(
        "aria-label",
        `Delete task: ${todo.text}`
    );


    actions.append(
        editButton,
        deleteButton
    );


    li.append(
        completeButton,
        textElement,
        actions
    );


    return li;

}


/* =====================================================
   7. UPDATE
   ===================================================== */

function toggleTodo(id) {

    todos =
        todos.map(todo => {

            if (todo.id !== id) {

                return todo;

            }


            return {

                ...todo,

                completed:
                    !todo.completed

            };

        });


    saveTodos();


    render();


    showStatus(
        "Task status updated."
    );

}


function updateTodo(id, newText) {

    const cleanedText =
        newText.trim();


    if (!cleanedText) {

        render();

        return;

    }


    todos =
        todos.map(todo => {

            if (todo.id !== id) {

                return todo;

            }


            return {

                ...todo,

                text: cleanedText

            };

        });


    saveTodos();


    render();


    showStatus(
        "Task updated successfully."
    );

}


/* =====================================================
   8. DELETE
   ===================================================== */

function deleteTodo(id) {

    todos =
        todos.filter(
            todo => todo.id !== id
        );


    saveTodos();


    render();


    showStatus(
        "Task deleted."
    );

}


/* =====================================================
   9. EDIT UI
   ===================================================== */

function startEditing(todoElement) {

    const id =
        todoElement.dataset.id;


    const todo =
        todos.find(
            item => item.id === id
        );


    if (!todo) {

        return;

    }


    const textElement =
        todoElement.querySelector(
            ".task-text"
        );


    const oldText =
        todo.text;


    const input =
        document.createElement("input");


    input.type =
        "text";


    input.className =
        "edit-input";


    input.value =
        oldText;


    input.maxLength =
        150;


    input.setAttribute(
        "aria-label",
        "Edit task"
    );


    textElement.replaceWith(
        input
    );


    input.focus();


    input.select();


    const finishEditing =
        () => {

            updateTodo(
                id,
                input.value
            );

        };


    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                finishEditing();

            }


            if (
                event.key === "Escape"
            ) {

                render();

            }

        }
    );


    input.addEventListener(
        "blur",
        finishEditing,
        {
            once: true
        }
    );

}


/* =====================================================
   10. EVENT DELEGATION
   ===================================================== */

todoList.addEventListener(
    "click",
    event => {

        const actionButton =
            event.target.closest(
                "[data-action]"
            );


        if (!actionButton) {

            return;

        }


        const todoElement =
            actionButton.closest(
                ".todo-item"
            );


        if (!todoElement) {

            return;

        }


        const id =
            todoElement.dataset.id;


        const action =
            actionButton.dataset.action;


        if (action === "toggle") {

            toggleTodo(id);

        }


        if (action === "edit") {

            startEditing(
                todoElement
            );

        }


        if (action === "delete") {

            deleteTodo(id);

        }

    }
);


/* =====================================================
   11. ADD TASK EVENT
   ===================================================== */

todoForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const text =
            todoInput.value.trim();


        if (!text) {

            todoInput.focus();

            return;

        }


        createTodo(text);


        todoInput.value = "";


        todoInput.focus();


        showStatus(
            "Task added successfully."
        );

    }
);


/* =====================================================
   12. FILTERING
   ===================================================== */

filters.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-filter]"
            );


        if (!button) {

            return;

        }


        currentFilter =
            button.dataset.filter;


        document
            .querySelectorAll(
                ".filter-button"
            )
            .forEach(
                filterButton => {

                    const isActive =
                        filterButton ===
                        button;


                    filterButton.classList
                        .toggle(
                            "active",
                            isActive
                        );


                    filterButton.setAttribute(
                        "aria-pressed",
                        String(isActive)
                    );

                }
            );


        render();

    }
);


/* =====================================================
   13. COUNTS
   ===================================================== */

function updateCounts() {

    const completed =
        todos.filter(
            todo => todo.completed
        ).length;


    const active =
        todos.length - completed;


    allCount.textContent =
        todos.length;


    activeCount.textContent =
        active;


    completedCount.textContent =
        completed;

}


/* =====================================================
   14. EMPTY STATE
   ===================================================== */

function updateEmptyState(
    numberOfVisibleTodos
) {

    if (
        numberOfVisibleTodos === 0
    ) {

        emptyState.classList.remove(
            "hidden"
        );


        if (currentFilter === "active") {

            emptyState.textContent =
                "No active tasks.";

        } else if (
            currentFilter === "completed"
        ) {

            emptyState.textContent =
                "No completed tasks.";

        } else {

            emptyState.textContent =
                "No tasks yet. Add your first task.";

        }

    } else {

        emptyState.classList.add(
            "hidden"
        );

    }

}


/* =====================================================
   15. STATUS MESSAGE
   ===================================================== */

function showStatus(message) {

    statusMessage.textContent =
        message;


    window.clearTimeout(
        showStatus.timeout
    );


    showStatus.timeout =
        window.setTimeout(
            () => {

                statusMessage.textContent =
                    "";

            },
            2500
        );

}


/* =====================================================
   16. INITIAL RENDER
   ===================================================== */

render();