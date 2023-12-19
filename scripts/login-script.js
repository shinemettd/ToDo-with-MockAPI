/**
 * Handles user sign-up.
 */
function signUp() {
    let login = document.getElementsByName('username')[0].value;
    let password = document.getElementsByName('pswd')[0].value;

    const newUser = {
        user_login: login,
        user_password: password,
    };
    // Make a POST request to add new user
    fetch('https://6566cae464fcff8d730f1095.mockapi.io/api/v1/user', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(newUser)
    }).then(res => {
        if (res.ok) {
            return res.json();
        }
    }).catch(error => {
        console.log(error);
    })
}

/**
 * Handles user sign-in.
 */
function signIn() {
    let login = document.getElementsByName('username')[1].value;
    let password = document.getElementsByName('pswd')[1].value;

    // Make a GET request to find entered user data
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
                    const userId = user.id;
                    localStorage.setItem('userId', userId.toString());
                    window.location.href = 'index.html';
                } else {
                    alert('Incorrect password!')
                }
            } else {
                alert('User wasn\'t found!')
            }
        })
        .catch(error => {
            console.log(error);
    });
}
