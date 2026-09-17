# AGENTS.md

## Проект

CTRL CLUB — демо-сайт компьютерного клуба.
Стек: Next.js + TypeScript + Tailwind v4 + shadcn/ui + GSAP + Framer Motion + Lenis + Lucide + React Three Fiber.
Стилевой каркас — `pc club.md` (фон #111111, акцент #b7ff2c только для действий, радиус 6px, без градиентов).

## Команды

- `npm run dev` — дев-сервер на http://127.0.0.1:3000
- `npm run lint` — ESLint
- `npm run typecheck` — tsc --noEmit
- `npm run build` — production-сборка
- Node/npm: `C:\Program Files\nodejs\npm.cmd` (в PowerShell `npm`/`npx` блокированы политикой — вызывать через `.cmd`, скрипты не менять)

## Релиз по команде «выкладывай»

Когда пользователь после правок говорит «все отлично, выкладывай» (или прямо просит опубликовать):

1. `npm run lint` и `npm run typecheck` — оба должны пройти.
2. `git add -A` (исключения уже в `.gitignore`: `node_modules`, `.next`, `.vercel`, `.env*`, `tsconfig.tsbuildinfo`).
3. `git commit -m "<краткое описание правок>"`.
4. `git push origin main` — GitHub: https://github.com/Zurux1337/PC-club.git
5. Vercel связан с репозиторием и деплоит `main` автоматически — пуш и есть публикация.
   Проверить, что деплой собрался: `npx.cmd vercel ls` (или ответ Vercel в GitHub). Только если автодеплой не сработал — вручную `npx.cmd vercel deploy --prod --yes`.
6. Сообщить пользователю: ссылку на прод (https://ctrl-club-lyart.vercel.app), статус коммита и деплоя.

Не отправлять в репозиторий и не деплоить без явной команды пользователя.
