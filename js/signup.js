document.getElementById("signupForm").addEventListener("submit", function (event) {
    event.preventDefault();

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

   
    var users = JSON.parse(localStorage.getItem('users')) || [];
    var userExists = users.some(user => user.nome === username);

    if (userExists) {
        alert("Nome de usuário já existe. Por favor, escolha outro.");
    } else {
        // Cria um novo usuário e salva no Local Storage
        var newUser = { nome: username, senha: password, token: generateToken() };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        alert("Conta criada com sucesso! Você será redirecionado para a página de login.");
        window.location.href = "login.html";
    }
});


function generateToken() {
    return Math.random().toString(36).substr(2);
}
