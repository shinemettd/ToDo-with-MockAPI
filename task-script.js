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

    removeTask: function () {
        var index = this.getAttribute('id');
        var myTasks = returnToDo();
        var taskToRemove = myTasks[index];
        console.log('index:::', index);
        console.log('ttrn', taskToRemove.name, 'ttrd', taskToRemove.describe);
        myTasks.splice(index, 1);
        localStorage.setItem('myData', JSON.stringify(myTasks));
        document.getElementById('myTasks').innerHTML = '';
        showMyTasks();
        console.log('delete');
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
            const task = tasks.find(t => t.task_name === taskToRemove.name && t.task_description == taskToRemove.describe);
            if (task) {
                console.log('task found');
                var deletionTaskId = task.id;
                console.log(deletionTaskId);
                fetch('https://6566cae464fcff8d730f1095.mockapi.io/api/v1/user/' + userId + '/task/' + deletionTaskId, {
                method: 'DELETE',
                }).then(res => {
                if (res.ok) {
                    console.log('Task successfully deleted');
                    return res.json();
                }
                }).catch(error => {
                    console.log(error);
                })

            } else {
                console.log('task not found');
            }
        })
        .catch(error => {
            console.log(error);
        });    
    }   
};

function returnToDo(){
    var myTasks = [];
    
    // fetch('https://6566cae464fcff8d730f1095.mockapi.io/api/v1/user/' + userId + '/task', {
    //     method: 'GET',
    //     headers: { 'content-type': 'application/json' },
    // })
    // .then(res => {
    //     if (res.ok) {
            
    //         return res.json();
    //     } else {
    //         throw new Error('Failed to fetch user data');
    //     }
    // }).then(tasks => {
    //     myTasks = myTasks.concat(tasks);
    //     localStorage.setItem('myData', JSON.stringify(myTasks));
    // })
    // .catch(error => {
    //     console.log(error);
    // });    
    
    var myTasksTemp = localStorage.getItem('myData');
    if(myTasksTemp != null){
        console.log("+++ " + myTasksTemp);
        myTasks = JSON.parse(myTasksTemp);
    }
    console.log("--- " + myTasks);
    return myTasks;
}

function Task() {
    this.name = document.getElementById('taskName').value;
    this.date = document.getElementById('myDate').value;
    this.describe = document.getElementById('description').value;
}

function newTask(x, y, o, index) {
    document.getElementById('myTasks').innerHTML +=
        '<div class="col l3 m4 s12 animated zoomIn"> <h4>' + y + '</h1>' +
        '<p>' + x + '</p>' +
        '<p>Due: ' + o + '</p>' +
        '<div class="btn red" id="' + index + '">Delete</div>' +
        '</div>'
}   

function showMyTasks(){
    var myTasks = returnToDo();
    document.getElementById('myTasks').innerHTML = '';
    for (var i = 0; i < myTasks.length; i++){
        newTask(
            myTasks[i].name,
            myTasks[i].describe,
            myTasks[i].date,
            i
        );
    }
    var button = document.getElementsByClassName('red');
    for (var j = 0; j < button.length; j++) {
        button[j].addEventListener('click', myObj.removeTask);
        console.log(button[j].addEventListener('click', myObj.removeTask));

    }
}

function submitInfo(){
    var myTasks = returnToDo();
    var task = new Task();
    myTasks.push(task);
    localStorage.setItem('myData',JSON.stringify(myTasks));
    addTask(task.name, task.describe, task.date);
    showMyTasks();
    myObj.hide();
}

showMyTasks();