let userLogin;
let userId;

function signUp() {
    let login = document.getElementsByName('username')[0].value;
    let password = document.getElementsByName('pswd')[0].value;

    const newUser = {
        user_login: login,
        user_password: password,
    };

    fetch('https://6566cae464fcff8d730f1095.mockapi.io/api/v1/user', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(newUser)
    }).then(res => {
        if (res.ok) {
            return res.json();
        }
    }).then(task => {
    }).catch(error => {
        console.log(error);
    })
}

function signIn() {
    let login = document.getElementsByName('username')[1].value;
    let password = document.getElementsByName('pswd')[1].value;

    fetch('https://6566cae464fcff8d730f1095.mockapi.io/api/v1/user', {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
    })
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error('Failed to fetch user data');
            }
        }).then(users => {
            const user = users.find(u => u.user_login === login);

            if (user) {
                if (user.hasOwnProperty('user_password') && user.user_password === password) {
                    userLogin = login;
                    userId = user.id;
                    window.location.href = 'tasks-page.html';
                } else {
                    console.log('Неверный пароль');
                }
            } else {
                console.log('Пользователь не найден');
            }
        })
        .catch(error => {
            console.log(error);
        });
}

function addTask(name, description, deadline) {
    const newTask = {
        task_name: name,
        task_description: description,
        task_deadline: deadline
    };

    fetch('https://6566cae464fcff8d730f1095.mockapi.io/api/v1/user/1/task', {
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

var myObj = {
    textSelect: function () {
        document.getElementById('description').select();
    },

    hide: function () {
        document.getElementById("form").style.display = "none";
        document.getElementById("show").style.display = "inline-block";

    },
    show: function () {

        document.getElementById("form").style.display = "block";
        document.getElementById("show").style.display = "none";
        document.getElementById('myDate').valueAsDate = new Date();
    },
    removeTask: function () {
        var id = this.getAttribute('id');
        var myTasks = returnTask();
        myTasks.splice(id, 1);
        localStorage.setItem('myData', JSON.stringify(myTasks));
        document.getElementById('myTasks').innerHTML = '';
        showMyTasks();
        console.log('delete');
    }
};

function returnTask() {
    return fetch('https://6566cae464fcff8d730f1095.mockapi.io/api/v1/user/1/task', {
        method: 'GET',
        headers: {'content-type': 'application/json' },
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            console.log('Failed to fetch');
        }
    })
    .catch(error => {
        console.log(error);
    });
}

function Task() {
    this.name = document.getElementById('taskName').value;
    this.date = document.getElementById('myDate').value;
    this.describe = document.getElementById('description').value;
}

function newTask(x, y, o) {
    document.getElementById('myTasks').innerHTML +=
        '<div class="col l3 m4 s12 animated zoomIn"> <h4>' + y + '</h1>' +
        '<p>' + x + '</p>' +
        '<p>Due: ' + o + '</p>' +
        '<div class="btn red" >Delete</div>' +
        '</div>'
}

function showMyTasks() {
    var myTasks = returnTask();
    document.getElementById('myTasks').innerHTML = '';
    for (var i = 0; i < myTasks.length; i++) {
        newTask(
            myTasks[i].name,
            myTasks[i].describe,
            myTasks[i].date
        );
    }
    var button = document.getElementsByClassName('red');
    for (var j = 0; j < button.length; j++) {
        button[j].addEventListener('click', myObj.removeTask);
        console.log(button[j].addEventListener('click', myObj.removeTask));
    }
}

function submitInfo() {
    var task = new Task();
    addTask(task.name, task.describe, task.date);
    showMyTasks();
    myObj.hide();
}

showMyTasks();
