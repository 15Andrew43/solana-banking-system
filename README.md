# solana-banking-system

## Описание

Этот проект состоит из двух задач:

1. **SOL Transfer**: API для перевода SOL между кошельками на блокчейне Solana с использованием библиотеки `solana web3.js`.
2. **Money Transfer**: API для перевода денег между двумя аккаунтами в базе данных PostgreSQL с транзакционностью (ACID).

---

## Запуск проекта

Проект может быть запущен с использованием Docker и Docker Compose. Убедитесь, что у вас установлены Docker и Docker Compose на вашем компьютере.

### 1. Клонирование репозитория

Клонируйте репозиторий с вашим проектом:

```bash
git clone <URL вашего репозитория>
cd <папка с проектом>
```

### 2. Настройка `docker-compose.yml`

Файл `docker-compose.yml` уже настроен для запуска сервера Node.js и базы данных PostgreSQL. Убедитесь, что все переменные окружения правильно установлены в `docker-compose.yml`.

### 3. Запуск контейнеров

Запустите контейнеры с помощью Docker Compose:

```bash
docker-compose up --build
```

Это создаст и запустит контейнеры для PostgreSQL и Node.js сервера. При первом запуске база данных будет инициализирована с тестовыми данными, если в проекте присутствует файл `init.sql`.

### 4. Остановка контейнеров

Чтобы остановить запущенные контейнеры, используйте:

```bash
docker-compose down
```

### 5. Проверка состояния контейнеров

Вы можете проверить состояние запущенных контейнеров с помощью:

```bash
docker ps
```

---

## Задача 1: SOL Transfer API

### Эндпоинт 1: Отправка транзакции

**Метод**: `POST`  
**URL**: `/api/transaction`

**Описание**: Отправляет транзакцию на блокчейн Solana для перевода SOL между кошельками.

**Тело запроса (JSON)**:
```json
{
    "fromPrivateKey": "base64-encoded-private-key",
    "toPublicKey": "destination-public-key",
    "amount": "amount-in-sol"
}
```

**Ответ**:

- **Успех**:
  ```json
  {
      "success": true,
      "transactionSignature": "signature-string"
  }
  ```
- **Ошибка**:
  ```json
  {
      "success": false,
      "error": "error-message"
  }
  ```

### Эндпоинт 2: Проверка статуса транзакции

**Метод**: `GET`  
**URL**: `/api/transaction?transactionSignature=signature-string`

**Описание**: Проверяет статус ранее отправленной транзакции по её подписи.

**Ответ**:

- **Успех (подтверждена)**:
  ```json
  {
      "success": true,
      "status": "confirmed"
  }
  ```
- **Успех (в ожидании)**:
  ```json
  {
      "success": true,
      "status": "pending"
  }
  ```
- **Ошибка**:
  ```json
  {
      "success": false,
      "error": "error-message"
  }
  ```

---

## Задача 2: Money Transfer API

### Эндпоинт: Перевод денег

**Метод**: `POST`  
**URL**: `/api/transfer`

**Описание**: Выполняет перевод денег между двумя аккаунтами.

**Тело запроса (JSON)**:
```json
{
    "fromAccountId": "source-account-id",
    "toAccountId": "destination-account-id",
    "amount": "amount-to-transfer"
}
```

**Ответ**:

- **Успех**:
  ```json
  {
      "success": true,
      "message": "Transfer completed successfully"
  }
  ```
- **Ошибка**:
  ```json
  {
      "success": false,
      "error": "error-message"
  }
  ```

---

## Тестирование с помощью `curl`

### 1. Тестирование SOL Transfer

#### Успешная отправка транзакции

```bash
curl -X POST http://localhost:3000/api/transaction \
-H "Content-Type: application/json" \
-d '{
  "fromPrivateKey": "base64-encoded-private-key",
  "toPublicKey": "destination-public-key",
  "amount": "0.001"
}'
```

#### Проверка статуса транзакции

```bash
curl -X GET "http://localhost:3000/api/transaction?transactionSignature=your-transaction-signature"
```

### 2. Тестирование Money Transfer

#### Успешный перевод средств

```bash
curl -X POST http://localhost:3000/api/transfer \
-H "Content-Type: application/json" \
-d '{
  "fromAccountId": "1",
  "toAccountId": "2",
  "amount": "100"
}'
```

#### Перевод с недостатком средств

```bash
curl -X POST http://localhost:3000/api/transfer \
-H "Content-Type: application/json" \
-d '{
  "fromAccountId": "1",
  "toAccountId": "2",
  "amount": "1000000"
}'
```

#### Перевод с некорректным идентификатором аккаунта

```bash
curl -X POST http://localhost:3000/api/transfer \
-H "Content-Type: application/json" \
-d '{
  "fromAccountId": "9999",
  "toAccountId": "2",
  "amount": "50"
}'
```

#### Перевод с некорректной суммой (отрицательное значение)

```bash
curl -X POST http://localhost:3000/api/transfer \
-H "Content-Type: application/json" \
-d '{
  "fromAccountId": "1",
  "toAccountId": "2",
  "amount": "-50"
}'
```
