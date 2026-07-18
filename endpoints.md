# WordPress pages/content (через прокси `/api/wp/*`)
Upstream base: https://finstroy-wp.razvit.tech  
Proxy base (same-origin): `/api/wp`

GET https://finstroy-wp.razvit.tech/glavnaya/ → GET `/api/wp/glavnaya/` — главная страница

GET https://finstroy-wp.razvit.tech/article/{slug} → GET `/api/wp/article/{slug}` — запись
GET https://finstroy-wp.razvit.tech/news/{slug} → GET `/api/wp/news/{slug}` — новость по заголовку
GET https://finstroy-wp.razvit.tech/contact/{slug} → GET `/api/wp/contact/{slug}` — контакты города

GET https://finstroy-wp.razvit.tech/shop → GET `/api/wp/shop` — каталог (список) ⚠️ сейчас отдаёт HTML (`Content-Type: text/html`)
GET https://finstroy-wp.razvit.tech/product/{slug} → GET `/api/wp/product/{slug}` — конкретный товар

GET https://finstroy-wp.razvit.tech/about-us/{slug} → GET `/api/wp/about-us/{slug}` — «О компании»
GET https://finstroy-wp.razvit.tech/question-answer/{slug} → GET `/api/wp/question-answer/{slug}` — «Вопросы и ответы»
GET https://finstroy-wp.razvit.tech/our_client/{slug} → GET `/api/wp/our_client/{slug}` — «Наши клиенты»
GET https://finstroy-wp.razvit.tech/feedback/{slug} → GET `/api/wp/feedback/{slug}` — «Отзывы»
GET https://finstroy-wp.razvit.tech/to-suppliers/{slug} → GET `/api/wp/to-suppliers/{slug}` — «Поставщикам»
GET https://finstroy-wp.razvit.tech/company-office/{slug} → GET `/api/wp/company-office/{slug}` — «Представительства компании»
GET https://finstroy-wp.razvit.tech/project/{slug} → GET `/api/wp/project/{slug}` — «Проекты»

Пример:
`/api/wp/news/my-news-slug`

# Калькулятор (через прокси `/api/cubic-calculator/*`)
Upstream base: https://finstroy-wp.razvit.tech/wp-json/cubic-calculator/v1  
Proxy base (same-origin): `/api/cubic-calculator`

https://finstroy-wp.razvit.tech/wp-json/cubic-calculator/v1/data - GET `/api/cubic-calculator/data` Получение справочных данных
Ответ
{
"formats": [
{"id": 1, "name": "1525×1525 мм", "width_mm": 1525, "height_mm": 1525}
],
"materials": [
{"id": 1, "name": "Фанера березовая", "type": "plywood", "density": 680}
],
"thickness": [
{"id": 8, "value_mm": 18}
],
"blade_widths": [
{"id": 1, "value_mm": 3}
]
}
Поля

https://finstroy-wp.razvit.tech/wp-json/cubic-calculator/v1/calculate - POST `/api/cubic-calculator/calculate` Расчёт объема и веса
Параметры

Укажите sheets или area
Пример запроса
{
"material_id": 1,
"format_id": 1,
"thickness_id": 8,
"sheets": 10
}
Ответ
{
"success": true,
"sheets": 10,
"area": 23.256,
"volume": 0.4186,
"weight": 284.6,
"sheet_area": 2.3256
}
Поля ответа

https://finstroy-wp.razvit.tech/wp-json/cubic-calculator/v1/cutting - POST `/api/cubic-calculator/cutting` расчёт раскроя листов
Параметры

Структура parts
[
{"width": 500, "height": 300, "quantity": 4},
{"width": 400, "height": 200, "quantity": 2}
]
Пример запроса
{
"sheet_width": 1525,
"sheet_height": 1525,
"parts": [
{"width": 500, "height": 300, "quantity": 4}
],
"blade_width_id": 1,
"thickness_id": 8
}
Ответ
{
"success": true,
"sheets_used": 1,
"total_cut_length": 4.37,
"total_parts": 4,
"waste_area": 0.85,
"price_per_meter": 9,
"total_price": 39.33
}
Поля ответа

https://finstroy-wp.razvit.tech/wp-json/cubic-calculator/v1/generate-pdf - POST `/api/cubic-calculator/generate-pdf` генерация PDF со схемой раскроя (тот же body, что и `/cutting`)
Пример запроса
{
"sheet_width": 1525,
"sheet_height": 1525,
"parts": [
{"width": 500, "height": 400, "quantity": 6}
],
"blade_width_id": 1,
"thickness_id": 1
}
Ответ
{
"success": true,
"pdf_url": "https://finstroy-wp.razvit.tech/wp-content/uploads/cutting-pdfs/cutting-....pdf",
"cutting_result": { "success": true, "sheets_used": 1, "sheets": [...], "total_cut_length": 3.13, "total_parts": 6, "waste_area": 1.13, "price_per_meter": 9, "total_price": 28.13 }
}
`pdf_url` отдаёт напрямую WP (публичный, без авторизации) — фронт открывает его в новой вкладке, файл не проксируется.
