# WordPress REST API — Finstroy (headless)

Базовый URL: `https://finstroy-wp.razvit.tech`

---

## 3. Страницы «О компании» (HTML / маршруты сайта)

| Раздел | URL |
|--------|-----|
| О компании | https://finstroy-wp.razvit.tech/about-us/o-kompanii/ |
| Корпоративная культура | https://finstroy-wp.razvit.tech/about-us/korporativnaya-kultura/ |
| Сертификаты | https://finstroy-wp.razvit.tech/about-us/sertifikaty/ |

Через прокси фронта (если настроен): см. `endpoints.md` — шаблон `GET /api/wp/about-us/{slug}`.

---

## 4. Контакты (офисы и склады)

Все офисы и склады заведены в контакты.

**Список контактов (REST):**

- **Метод:** `GET`
- **Эндпоинт:** `https://finstroy-wp.razvit.tech/wp-json/wp/v2/contact/`

Координаты каждого офиса и склада добавлены в записи контактов (поля в ответе API — см. фактическую схему ответа WordPress).

---

## 5. Регистрация пользователя

**Метод:** `POST`  
**Эндпоинт:** `https://finstroy-wp.razvit.tech/wp-json/jwt-auth/v1/register`  
**Заголовок:** `Content-Type: application/json`

**Тело запроса:**

```json
{
  "username": "new_user",
  "email": "new_user@example.com",
  "password": "secure_password_123",
  "name": "New User"
}
```

- Поле `name` опционально, но рекомендуется.
- **Успешный ответ (200):** содержит ID пользователя, его данные и JWT в поле `token_response.token`.
- После регистрации токен приходит сразу — **дополнительный логин не обязателен**.

---

## 5.1 Авторизация (JWT)

**Метод:** `POST`  
**Эндпоинт:** `https://finstroy-wp.razvit.tech/wp-json/jwt-auth/v1/token`

**Тело запроса:**

```json
{
  "username": "new_user@example.com",
  "password": "secure_password_123"
}
```

В `username` можно передавать email или логин.

---

## 5.1 (продолжение) Проверка валидности токена

**Метод:** `POST`  
**Эндпоинт:** `https://finstroy-wp.razvit.tech/wp-json/jwt-auth/v1/token/validate`

---

## 5.2 Профиль текущего пользователя

**Метод:** `GET`  
**Эндпоинт:** `https://finstroy-wp.razvit.tech/wp-json/wp/v2/users/me`  
**Заголовок:** `Authorization: Bearer <jwt_токен>`

---

## 6. Корзина (WooCommerce Store API)

База: `https://finstroy-wp.razvit.tech/wp-json/wc/store/v1`

### 6.1 Добавить товар в корзину

- **Метод:** `POST`
- **Эндпоинт:** `.../cart/add-item`

**Пример тела:**

```json
{ "id": 123, "quantity": 1 }
```

### 6.2 Получить корзину

- **Метод:** `GET`
- **Эндпоинт:** `.../cart`

Ответ: полный объект корзины (товары, купоны, адреса, цены).

### 6.3 Обновить количество товара

- **Метод:** `POST`
- **Эндпоинт:** `.../cart/update-item`

**Пример тела:**

```json
{ "key": "a5771bce93e200c36f7cd9dfd0e5deaa", "quantity": 2 }
```

### 6.4 Удалить товар из корзины

- **Метод:** `DELETE`
- **Эндпоинт:** `.../cart/remove-item`

**Пример тела:**

```json
{ "key": "a5771bce93e200c36f7cd9dfd0e5deaa" }
```

`key` — уникальный идентификатор позиции в корзине, приходит в ответе при получении корзины.

---

## 7. Заказы (WooCommerce REST API)

База заказов: `https://finstroy-wp.razvit.tech/wp-json/wc/v3`

### 7.1 Список заказов текущего пользователя

- **Метод:** `GET`
- **Эндпоинт:** `.../orders?customer=<ID_пользователя>`

После авторизации можно использовать: `.../orders?customer=me`

### 7.2 Детали заказа

- **Метод:** `GET`
- **Эндпоинт:** `.../orders/{order_id}`

### 7.3 Оформление заказа (checkout из корзины)

- **Метод:** `POST`
- **Эндпоинт:** `https://finstroy-wp.razvit.tech/wp-json/wc/store/v1/checkout`

---

## 8. Координаты

Координаты офисов и складов заданы в сущностях контактов (см. раздел 4).
