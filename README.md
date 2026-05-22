# Lab 7: insert

Маршруты:

- `GET /login/` - возвращает логин `dieuvina`.
- `POST /insert/` - принимает `application/x-www-form-urlencoded` поля `login`, `password`, `URL`, подключается к MongoDB по `URL` и добавляет документ `{ login, password }` в коллекцию `users`.

## Запуск

```bash
npm install
npm start
```

## Docker

```bash
docker build -t lab7-insert .
docker run -p 4321:4321 lab7-insert
```
