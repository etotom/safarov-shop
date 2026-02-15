# 🚀 Инструкции для деплоя на Vercel

## Что было исправлено для Vercel

### 1. Зависимости (package.json)
- ✅ Заменены все `^` версии на точные версии
- ✅ `@auth/prisma-adapter` установлен на версию `1.5.0` (существующая версия)
- ✅ Все остальные зависимости на стабильные версии

### 2. Конфигурация
- ✅ `.npmrc` настроен для работы с peer dependencies
- ✅ `vercel.json` правильно настроен
- ✅ `.vercelignore` исключает ненужные файлы

## Перед деплоем на Vercel

### Шаг 1: Очистить локальные файлы
```bash
# Удалить node_modules
rm -rf node_modules

# Удалить lock файл
rm package-lock.json
```

### Шаг 2: Переустановить зависимости
```bash
npm install
```

### Шаг 3: Проверить локально
```bash
npm run build
npm run start
```

## Если все работает локально

### Готово к деплою!
```bash
git add .
git commit -m "Fix Vercel deployment - update dependencies"
git push origin main
```

Vercel автоматически возьмет последнюю версию и задеплоит.

## Возможные проблемы и решения

### Если Vercel все еще жалуется на версии
1. Удалить Vercel кеш:
   - На сайте vercel.com перейти в Settings → Git
   - Нажать "Clear Build Cache"
   - Переобрать проект

### Если нужны переменные окружения
1. На vercel.com перейти в Project Settings
2. Добавить переменные из `.env` файла

### Если ошибка о Prisma
- Prisma уже не используется, все переведено на файл-базированную систему (lib/db)
- Это не должно вызывать проблем

## Структура проекта для Vercel

```
safarov-shop/
├── app/                    # Next.js app directory
├── components/             # React components
├── lib/                    # Утилиты и database
├── public/                 # Статические файлы
├── data/                   # JSON "database"
├── package.json           # ✅ Исправлен
├── .npmrc                 # ✅ Настроен
├── vercel.json            # ✅ Настроен
└── .vercelignore          # ✅ Настроен
```

## Ожидаемый результат после деплоя

- ✅ Сайт доступен на `https://safarov-shop.vercel.app`
- ✅ Featured Products показывают изображения
- ✅ Все 3 языка работают
- ✅ База данных работает (файл-базированная)

---

**Статус:** Готово к деплою! 🚀
