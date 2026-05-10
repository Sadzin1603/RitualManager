# Documentação da API

## Autenticação

Para rotas protegidas, envie o token JWT no header:

```js
headers: {
  Authorization: `Bearer ${token}`
}
````

---

# ROTAS

# USER

## `GET /user/:id`

Exemplo:

```bash
/user/2
```

Retorna os dados do usuário pelo ID.

---

## `PUT /user/:id`

### Requer:

* Token JWT

### Body:

```json
{
  "name": "Novo Nome",
  "email": "novo@email.com",
  "password": "novasenha"
}
```

Atualiza os dados do usuário.

---

## `DELETE /user/:id`

### Requer:

* Token JWT

Deleta o usuário.

---

## `GET /user/:id/rituais`

Retorna todos os rituais feitos pelo usuário.

---

# RITUAL

## `GET /ritual`

Retorna apenas os rituais aprovados.

---

## `POST /ritual`

### Envio:

* `FormData`
* arquivo (`file`)

Adiciona o ritual e salva a imagem no banco/storage.

---

## `GET /ritual/:id`

### Requer:

* Token JWT

Retorna o ritual pelo ID.

> Admins e o criador do ritual podem visualizar rituais pendentes.

---

## `PUT /ritual/:id`

Edita o ritual pelo ID.

---

## `DELETE /ritual/:id`

### Requer:

* Token JWT

Deleta o ritual pelo ID.

---

# AUTH

## `POST /register`

### Body:

```json
{
  "name": "Teste",
  "email": "teste@gmail.com",
  "password": "senhasupersegura123@"
}
```

Cria um novo usuário.

---

## `POST /login`

### Body:

```json
{
  "email": "teste@gmail.com",
  "password": "senhasupersegura123@"
}
```

Retorna o token JWT.

> Salve o token no localStorage/sessionStorage.

---

## `GET /me`

### Requer:

* Token JWT

Retorna os dados do usuário autenticado.

---

# ADMIN

## `GET /admin/rituals/pending`

### Requer:

* Token JWT

Retorna todos os rituais pendentes.

---

## `PATCH /admin/:id/:status`

### Requer:

* Token JWT

Atualiza o status do ritual pelo ID.

Exemplo:

```bash
/admin/12/aprovado
```

---

## `GET /admin/users`

### Requer:

* Token JWT

Retorna todos os usuários cadastrados.
