document.addEventListener('DOMContentLoaded', () => {
    const API_POST_URL = 'https://projeto-integrado-avaliacao.azurewebsites.net/projeto2/fecaf/novo/contato';
    const API_GET_URL = 'https://projeto-integrado-avaliacao.azurewebsites.net/projeto2/fecaf/listar/contatos';
    const API_DELETE_URL = 'https://projeto-integrado-avaliacao.azurewebsites.net/projeto2/fecaf/excluir/contato';
    const API_EDIT_URL = 'https://projeto-integrado-avaliacao.azurewebsites.net/projeto2/fecaf/atualizar/contato/'; 

    const form = document.getElementById('contactForm');
    const contactsContainer = document.getElementById('contactsContainer');
    const filterIdInput = document.getElementById('filterId');
    const filterButton = document.getElementById('filterButton');
    const submitBtn = document.getElementById('submitBtn');
    const saveBtn = document.getElementById('saveBtn');
    const contactIdInput = document.getElementById('contactId');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (submitBtn.style.display !== 'none') {
            addContact();
        }
    });

    saveBtn.addEventListener('click', async () => {
        editContact();
    });

    async function addContact() {
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const telefone = document.getElementById('telefone').value;
        const image = document.getElementById('image').value;

        const response = await fetch(API_POST_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, email, telefone, image })
        });

        if (response.ok) {
            form.reset();
            loadContacts();
        } else {
            alert('Erro ao adicionar contato');
        }
    }

    async function editContact() {
        const id = contactIdInput.value;
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const telefone = document.getElementById('telefone').value;
        const image = document.getElementById('image').value;

        const response = await fetch(`${API_EDIT_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, email, telefone, image })
            
        });

        


        if (response.ok) {
            form.reset();
            submitBtn.style.display = 'inline';
            saveBtn.style.display = 'none';
            loadContacts();
        } else {
            alert('Erro ao salvar contato');
        }
    }

    async function loadContacts(filterId = null) {
        try {
            const response = await fetch(API_GET_URL);
            const data = await response.json();

            if (data && Array.isArray(data.contatos)) {
                contactsContainer.innerHTML = '';
                let contatos = data.contatos;

                if (filterId !== null) {
                    contatos = contatos.filter(contato => contato.id === filterId);
                }

                contatos.forEach(contato => {
                    const card = document.createElement('div');
                    card.className = 'card';
                    card.innerHTML = `
                        <img src="${contato.image}" class="card-img-top" alt="${contato.nome}">
                        <div class="card-body">
                            <h5 class="card-title">${contato.nome}</h5>
                            <p class="card-text">ID: ${contato.id}</p>
                            <p class="card-text">Email: ${contato.email}</p>
                            <p class="card-text">Telefone: ${contato.telefone}</p>
                            <button class="btn btn-primary" onclick="prepareEditContact(${contato.id})">Editar</button>
                            <button class="btn btn-danger" onclick="deleteContact(${contato.id})">Deletar</button>
                        </div>
                    `;
                    contactsContainer.appendChild(card);
                });
            } else {
                console.error('Resposta da API não contém um array de contatos:', data);
                alert('Erro ao carregar contatos');
            }
        } catch (error) {
            console.error('Erro ao carregar contatos:', error);
            alert('Erro ao carregar contatos');
        }
    }

    window.deleteContact = async function(id) {
        const response = await fetch(`${API_DELETE_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadContacts();
        } else {
            alert('Erro ao deletar contato');
        }
    };

    window.prepareEditContact = async function(id) {
        fetch(API_GET_URL)
            .then(response => response.json())
            .then(data => {
                const contato = data.contatos.find(contato => contato.id === id);
                if (contato) {
                    document.getElementById('nome').value = contato.nome;
                    document.getElementById('email').value = contato.email;
                    document.getElementById('telefone').value = contato.telefone;
                    document.getElementById('image').value = contato.image;
                    contactIdInput.value = contato.id;
                    submitBtn.style.display = 'none';
                    saveBtn.style.display = 'inline';
                }
            })
            .catch(error => {
                console.error('Erro ao carregar contato:', error);
                alert('Erro ao carregar contato');
            });
    };

    filterButton.addEventListener('click', () => {
        const filterId = parseInt(filterIdInput.value);
        if (!isNaN(filterId) || filterIdInput.value === '') {
            loadContacts(filterId || null);
        } else {
            alert('Por favor, insira um ID válido.');
        }
    });

    loadContacts();
});
