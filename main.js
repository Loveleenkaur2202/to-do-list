window.addEventListener('load', () => {
    const form = document.querySelector("#new-task-form");
    const input = document.querySelector("#new-task-input");
    const list_el = document.querySelector("#tasks");

    // Load tasks from localStorage when the page loads
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(savedTasks));
    }

    function addTaskToDOM(task) {
        const task_el = document.createElement('div');
        task_el.classList.add('task');

        const task_content_el = document.createElement('div');
        task_content_el.classList.add('content');

        // Create a checkbox element for the task
        const task_checkbox_el = document.createElement('input');
        task_checkbox_el.classList.add('checkbox');
        task_checkbox_el.type = 'checkbox';

        const task_input_el = document.createElement('input');
        task_input_el.classList.add('text');
        task_input_el.type = 'text';
        task_input_el.value = task.text;
        task_input_el.setAttribute('readonly', 'readonly');

        if (task.done) {
            task_input_el.classList.add('done');
            task_checkbox_el.checked = true;
        }

        task_content_el.appendChild(task_checkbox_el);
        task_content_el.appendChild(task_input_el);

        const task_actions_el = document.createElement('div');
        task_actions_el.classList.add('actions');

        const task_edit_el = document.createElement('button');
        task_edit_el.classList.add('edit');
        task_edit_el.innerText = 'Edit';

        const task_delete_el = document.createElement('button');
        task_delete_el.classList.add('delete');
        task_delete_el.innerText = 'Delete';

        task_actions_el.appendChild(task_edit_el);
        task_actions_el.appendChild(task_delete_el);

        task_el.appendChild(task_content_el);
        task_el.appendChild(task_actions_el);

        list_el.appendChild(task_el);

        task_edit_el.addEventListener('click', (e) => {
            if (task_edit_el.innerText.toLowerCase() === "edit") {
                task_edit_el.innerText = "Save";
                task_input_el.removeAttribute("readonly");
                task_input_el.focus();
            } else {
                task_edit_el.innerText = "Edit";
                task_input_el.setAttribute("readonly", "readonly");
                // Update the task in the savedTasks array when edited
                task.text = task_input_el.value;
                saveTasks();
            }
        });

        task_delete_el.addEventListener('click', (e) => {
            list_el.removeChild(task_el);
            // Remove the task from the savedTasks array when deleted
            savedTasks.splice(savedTasks.indexOf(task), 1);
            saveTasks();
        });

        // Add a click event listener to the checkbox to mark the task as done or not
        task_checkbox_el.addEventListener('click', (e) => {
            if (task_checkbox_el.checked) {
                task_input_el.classList.add('done');
                task.done = true;
            } else {
                task_input_el.classList.remove('done');
                task.done = false;
            }
            saveTasks();
        });
    }

    // Load saved tasks into the DOM
    savedTasks.forEach((task) => {
        addTaskToDOM(task);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const taskText = input.value;

        if (taskText.trim() === '') {
            return;
        }

        const newTask = {
            text: taskText,
            done: false
        };

        savedTasks.push(newTask);
        saveTasks();

        addTaskToDOM(newTask);

        input.value = '';
    });
});
