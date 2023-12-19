var userId = localStorage.getItem('userId');

function addTask(name, description, deadline) {
    const newTask = {
        task_name: name,
        task_description: description,
        task_deadline: deadline
    };

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
    showMyTasks();
}

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

var myObj= {
    textSelect: function(){
        document.getElementById('description').select();
    },

    hide: function() {
        document.getElementById("form").style.display = "none";
        document.getElementById("show").style.display = "inline-block";

    },

    show:function(){
        document.getElementById("form").style.display = "block";
        document.getElementById("show").style.display = "none";
        document.getElementById('myDate').valueAsDate = new Date();
    },

    removeTask: async function () {
        var index = this.getAttribute('id');
        var myTasks = await returnToDo();
        var taskToRemove = myTasks[index];
        myTasks.splice(index, 1);
        localStorage.setItem('myData', JSON.stringify(myTasks));
        document.getElementById('myTasks').innerHTML = '';
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

async function returnToDo() {
    var myTasks = [];

    try {
        const res = await fetch('https://6566cae464fcff8d730f1095.mockapi.io/api/v1/user/' + userId + '/task', {
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

function Task() {
    this.name = document.getElementById('taskName').value;
    this.date = document.getElementById('myDate').value;
    this.describe = document.getElementById('description').value;
}

function newTask(x, y, o, index) {
    document.getElementById('myTasks').innerHTML +=
        '<div class="col l3 m4 s12 animated zoomIn"> <h1>' + y + '</h1>' +
        '<p>' + x + '</p>' +
        '<p>Due: ' + o + '</p>' +
        '<div class="btn red" id="' + index + '">Edit</div>' +
        '<div class="btn red" id="' + index + '">Delete</div>' +
        '</div>'
}   

async function showMyTasks(){
    var myTasks = await returnToDo();
    document.getElementById('myTasks').innerHTML = '';
    for (var i = 0; i < myTasks.length; i++){
        newTask(
            myTasks[i].task_name,
            myTasks[i].task_description,
            myTasks[i].task_deadline,
            i
        );
    }
    var button = document.getElementsByClassName('red');
    for (var j = 0; j < button.length; j++) {
        button[j].addEventListener('click', myObj.removeTask);
    }
}

async function submitInfo(){
    var myTasks = await returnToDo();
    var task = new Task();
    myTasks.push(task);
    localStorage.setItem('myData',JSON.stringify(myTasks));
    addTask(task.name, task.describe, task.date);
    showMyTasks();
    myObj.hide();
}

showMyTasks();