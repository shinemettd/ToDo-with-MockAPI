// Retrieve the user ID from local storage
var userId = localStorage.getItem('userId');

var sortBy = 'Default';

/**
 * Adds a new task to the user's tasks list.
 * @param {string} name - The name of the task.
 * @param {string} description - The description of the task.
 * @param {string} deadline - The deadline of the task.
 */
function addTask(name, description, deadline, status) {
    
    const newTask = {
        task_name: name,
        task_description: description,
        task_deadline: deadline,
        task_status: status
    };


    // Make a POST request to add the new task
    fetch('https://6566cae464fcff8d730f1095.mockapi.io/api/v1/user/'+ userId +'/task', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(newTask)
    })
    .then(res => {
        if (res.ok) {
            return res.json();
        }
    })
    .catch(error => {
        console.log(error);
    });
    // Refresh the displayed tasks
    showMyTasks();
}

/**
 * Deletes a task with the specified ID.
 * @param {string} id - The ID of the task to be deleted.
 */
function deleteTask(id) {
    fetch('https://6566cae464fcff8d730f1095.mockapi.io/api/v1/user/'+ userId +'/task/' + id, {
    method: 'DELETE',
    }).then(res => {
    if (res.ok) {
        return res.json();
    }
    }).catch(error => {
        console.log(error);
    })
}

// Object to handle various task-related actions
var myObj = {
    /**
     * Selecting task description from html file.
     */
    textSelect: function(){
        document.getElementById('description').select();
    },
    /**
     * Hides the task form.
     */
    hide: function() {
        document.getElementById("form").style.display = "none";
        document.getElementById("show").style.display = "inline-block";

    },

    /**
     * Shows the task form and sets the default date.
     */
    show: function() {
        document.getElementById("form").style.display = "block";
        document.getElementById("show").style.display = "none";
        document.getElementById('myDate').valueAsDate = new Date();
    },

    /**
     * Edits a task.
     */
    edit: function() {
        var buttonId = this.getAttribute('id');
        // Enable editing for task name and description
        document.getElementById('editTaskName_' + buttonId).removeAttribute('readonly');
        document.getElementById('editTaskDescription_' + buttonId).removeAttribute('readonly');
        document.getElementById('changeStatus_' + buttonId).style.display = 'flex';
        document.getElementById(buttonId).innerText = 'Save';
        document.getElementById(buttonId).addEventListener('click', myObj.saveChanges);
    },

    changeStatus: async function() {
        var buttonId = this.getAttribute('id').split('_')[1]; 
    
        var myTasks = await returnToDo();
        var taskToUpdate = myTasks[buttonId];
        if (taskToUpdate.task_status == 'Failed') {
            alert('You already failed that task!');
            return;
        }
        // Make a GET request to find task we need
        fetch('https://6566cae464fcff8d730f1095.mockapi.io/api/v1/user/' + userId + '/task', {
            method: 'GET',
            headers: { 'content-type': 'application/json' },
        })
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error('Failed to fetch user data');
            }
        }).then(tasks => {
            const task = tasks.find(t => t.task_name === taskToUpdate.task_name && t.task_description == taskToUpdate.task_description);
            if (task) {
                var updateTaskId = task.id;
                var newStatus = (taskToUpdate.task_status === 'In progress') ? 'Completed' : 'In progress';
                // Make a PUT request to change the task status
                fetch('https://6566cae464fcff8d730f1095.mockapi.io/api/v1/user/' + userId + '/task/' + updateTaskId, {
                    method: 'PUT',
                    headers: {'content-type':'application/json'},
                    body: JSON.stringify({task_status: newStatus})
                }).then(res => {
                if (res.ok) {
                    return res.json();
                }
                }).then(task => {
                    showMyTasks();
                })
                .catch(error => {
                    console.log(error);
                })
            }
        })
        .catch(error => {
            console.log(error);
        });
    },

    /**
     * Saves changes to an edited task.
     */
    saveChanges: async function() {
        var buttonId = this.getAttribute('id');
        // Saving edited name and description
        document.getElementById('editTaskName_' + buttonId).setAttribute('readonly', true);
        document.getElementById('editTaskDescription_' + buttonId).setAttribute('readonly', true);
        document.getElementById(buttonId).innerText = 'Edit';
        document.getElementById(buttonId).removeEventListener('click', myObj.saveChanges);
        var newTaskName = document.getElementById('editTaskName_' + buttonId).value;
        var newTaskDescription = document.getElementById('editTaskDescription_' + buttonId).value;
        var index = this.getAttribute('id');
        var myTasks = await returnToDo();
        var taskToUpdate = myTasks[index];
        document.getElementById('myTasks').innerHTML = '';
        // Make a GET request to find task we need
        fetch('https://6566cae464fcff8d730f1095.mockapi.io/api/v1/user/' + userId + '/task', {
            method: 'GET',
            headers: { 'content-type': 'application/json' },
        })
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error('Failed to fetch user data');
            }
        }).then(tasks => {
            const task = tasks.find(t => t.task_name === taskToUpdate.task_name && t.task_description == taskToUpdate.task_description);
            if (task) {
                var updateTaskId = task.id;
                // Make a PUT request to change the task
                fetch('https://6566cae464fcff8d730f1095.mockapi.io/api/v1/user/' + userId + '/task/' + updateTaskId, {
                    method: 'PUT',
                    headers: {'content-type':'application/json'},
                    body: JSON.stringify({task_name: newTaskName, task_description: newTaskDescription})
                }).then(res => {
                if (res.ok) {
                    return res.json();
                }
                }).then(task => {
                    showMyTasks();
                })
                .catch(error => {
                    console.log(error);
                })
            }
        })
        .catch(error => {
            console.log(error);
        });
    },

    changeSort: async function() {
        var sortButton = document.getElementById('sortButton');

        switch (sortBy) {
            case "Deadline":
                sortBy = "Default";
                break;
            case "Default":
                sortBy = "Task Status";
                break;
            case "Task Status":
                sortBy = "Deadline";
                break;
            default:
                sortBy = "Default";
        }

        sortButton.innerText = 'Sort By: ' + sortBy;
        showMyTasks();
    },

    /**
     * Removes a task.
     */
    removeTask: async function () {
        var index = this.getAttribute('id');
        var myTasks = await returnToDo();
        var taskToRemove = myTasks[index];
        myTasks.splice(index, 1);
        localStorage.setItem('myData', JSON.stringify(myTasks));
        document.getElementById('myTasks').innerHTML = '';
        // Make a GET request to find task we need
        fetch('https://6566cae464fcff8d730f1095.mockapi.io/api/v1/user/' + userId + '/task', {
            method: 'GET',
            headers: { 'content-type': 'application/json' },
        })
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error('Failed to fetch user data');
            }
        }).then(tasks => {
            const task = tasks.find(t => t.task_name === taskToRemove.task_name && t.task_description == taskToRemove.task_description);
            if (task) {
                var deletionTaskId = task.id;
                // Make a DELETE request to delete the task
                fetch('https://6566cae464fcff8d730f1095.mockapi.io/api/v1/user/' + userId + '/task/' + deletionTaskId, {
                method: 'DELETE',
                }).then(res => {
                if (res.ok) {
                    showMyTasks();
                    return res.json();
                }
                }).catch(error => {
                    console.log(error);
                })

            }
        })
        .catch(error => {
            console.log(error);
        });
    }   
};

/**
 * Retrieves the user's tasks from the API.
 * @returns {Array} - An array of tasks.
 */
async function returnToDo() {
    var myTasks = [];
    var url = new URL('https://6566cae464fcff8d730f1095.mockapi.io/api/v1/user/' + userId + '/task');
    if (sortBy === 'Deadline') {
        url.searchParams.append('sortBy', 'task_deadline');
    } else if (sortBy === 'Task Status') {
        url.searchParams.append('sortBy', 'task_status');
    }
    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: { 'content-type': 'application/json' },
        });

        if (res.ok) {
            const tasks = await res.json();
            myTasks = tasks;
        } else {
            throw new Error('Failed to fetch user data');
        }
    } catch (error) {
        console.log(error);
    }
    return myTasks;
}

/**
 * Constructor function for creating a Task object.
 */
function Task() {
    this.name = document.getElementById('taskName').value;
    this.date = document.getElementById('myDate').value;
    this.describe = document.getElementById('description').value;
    var currentDate = new Date();
    var targetDate = new Date(this.date);
    targetDate.setHours(23);
    targetDate.setMinutes(59);
    targetDate.setSeconds(59);
    if (currentDate < targetDate || currentDate === targetDate) {
        this.status = 'In progress';
    } else {
        this.status = 'Failed';
    }
}

function newTask(x, y, o, status, index) {
    var otherStatus = 'Failed';
    if (status === 'In progress') {
        otherStatus = 'Completed';
    } else if (status === 'Completed') {
        otherStatus = 'In progress';
    } else {
        otherStatus === 'Failed';
    }
    document.getElementById('myTasks').innerHTML +=
            '<div class="col l3 m4 s12 animated zoomIn" style="margin-top: 20px;">' +
            '<strong><textarea style="font-size: 30px;" id="editTaskName_' + index + '" readonly>' + x + '</textarea><strong><br>' +
            '<textarea id="editTaskDescription_' + index + '"readonly>' + y + '</textarea><br>' +
            '<h3>Due: ' + o + ' </h3><br>' +
            '<p>Status: ' + status + '</p>' +
            '<div class="btn blue" id="changeStatus_' + index + '" style="display: none; margin-bottom: 10px; align-items: center; justify-content: center;">Change to ' + otherStatus + '</div>' +
            '<div class="btn green" id="' + index + '">Edit</div>' +
            '<div class="btn red" id="' + index + '">Delete</div>' +
        '</div>'
}  

/**
 * Displays the user's tasks on the page.
 */
async function showMyTasks(){
    var myTasks = await returnToDo();
    document.getElementById('myTasks').innerHTML = '';
    for (var i = 0; i < myTasks.length; i++){
        newTask(
            myTasks[i].task_name,
            myTasks[i].task_description,
            myTasks[i].task_deadline,
            myTasks[i].task_status,
            i
        );
    }
    var deleteButton = document.getElementsByClassName('red');
    for (var j = 0; j < deleteButton.length; j++) {
        deleteButton[j].addEventListener('click', myObj.removeTask);
    }
    var editButton = document.getElementsByClassName('green');
    for (var k = 0; k < editButton.length; k++) {
        editButton[k].addEventListener('click', myObj.edit);
    }
    var changeStatusButton = document.getElementsByClassName('blue');
    for (var l = 0; l < changeStatusButton.length; l++) {
        changeStatusButton[l].addEventListener('click', myObj.changeStatus);
    }
}

/**
 * Adds a new task to the user's tasks.
 */
async function submitInfo(){
    var myTasks = await returnToDo();
    var task = new Task();
    myTasks.push(task);
    localStorage.setItem('myData', JSON.stringify(myTasks));
    addTask(task.name, task.describe, task.date, task.status);
    showMyTasks();
    myObj.hide();
}

/**
 * Logs out the user by clearing the user ID in local storage.
 */
function logOut() {
    localStorage.setItem('userId', 'undefined');
    window.location.href = 'login.html';
}

// Initial display of tasks
showMyTasks();