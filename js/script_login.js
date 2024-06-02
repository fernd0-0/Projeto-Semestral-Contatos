document.getElementById("button").addEventListener("click", function (event) {
    event.preventDefault();

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // Tenta autenticar com a API remota
    fetch('https://back-login.vercel.app/usuarios')
        .then(response => response.json())
        .then(data => {
            const user = data.find(u => u.nome === username && u.senha === password);
            if (user) {
                // Salva o token de login e o nome de usuário no localStorage
                localStorage.setItem('token', user.token);
                localStorage.setItem('username', user.nome);
                alert("Login bem-sucedido! Você será redirecionado para a página principal.");
                window.location.href = "index.html";
            } else {
                
                var localUsers = JSON.parse(localStorage.getItem('users')) || [];
                const localUser = localUsers.find(u => u.nome === username && u.senha === password);

                if (localUser) {
                    // Salva o token de login e o nome de usuário no localStorage
                    localStorage.setItem('token', localUser.token);
                    localStorage.setItem('username', localUser.nome);
                    alert("Login bem-sucedido! Você será redirecionado para a página principal.");
                    window.location.href = "index.html";
                } else {
                    alert("Nome de usuário ou senha inválidos.");
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
          
            var localUsers = JSON.parse(localStorage.getItem('users')) || [];
            const localUser = localUsers.find(u => u.nome === username && u.senha === password);

            if (localUser) {
                // Salva o token de login e o nome de usuário no localStorage
                localStorage.setItem('token', localUser.token);
                localStorage.setItem('username', localUser.nome);
                alert("Login bem-sucedido! Você será redirecionado para a página principal.");
                window.location.href = "index.html";
            } else {
                alert("Nome de usuário ou senha inválidos.");
            }
        });
});

document.getElementById("criarContaButton").addEventListener("click", function () {
    window.location.href = "criar_conta.html";
});
