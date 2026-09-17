'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type ZoneId = 'arena' | 'bootcamp' | 'duo'

interface ZoneOption {
  id: ZoneId
  name: string
  hint: string
  price: number
}

interface FormErrors {
  name?: string
  phone?: string
  date?: string
  time?: string
}

export interface BookingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialZone?: string
}

const ZONES: ZoneOption[] = [
  { id: 'arena', name: 'Арена', hint: 'Основной зал, мониторы 240 Гц', price: 150 },
  { id: 'bootcamp', name: 'Bootcamp', hint: 'Турнирная зона, топовое железо', price: 250 },
  { id: 'duo', name: 'Duo', hint: 'Приватная кабинка на двоих', price: 350 },
]

const DURATIONS = [1, 3, 5]

const TIMES: string[] = Array.from(
  { length: 24 },
  (_, index) => `${String(index).padStart(2, '0')}:00`,
)

const NAME_PATTERN = /^[A-Za-zА-ЯЁа-яё]+(?:[ '-][A-Za-zА-ЯЁа-яё]+)*$/u

const FIELD_CLASS =
  'h-10 w-full rounded-md bg-[#111111] px-3 text-sm text-[#f5f5f5] outline-none [color-scheme:dark] placeholder:text-[#5c5c62] focus:border-[#b7ff2c]'

const ERROR_CLASS = 'mt-1 text-xs text-[#ffffff]'

function getLocalTodayISO(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '')
  if (digits.length === 11) return digits.startsWith('7') || digits.startsWith('8')
  if (digits.length === 10) return digits.startsWith('9')
  return false
}

function formatPrice(value: number): string {
  return value.toLocaleString('ru-RU')
}

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-')
  return `${day}.${month}.${year}`
}

export function BookingDialog({ open, onOpenChange, initialZone }: BookingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-lenis-prevent
        className="max-h-[85dvh] overflow-y-auto overscroll-contain rounded-md border-[#2c2c30] bg-[#1f1f21] text-[#f5f5f5] sm:max-w-md"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Бронирование места
          </DialogTitle>
          <DialogDescription className="text-sm text-[#a3a3a8]">
            Демо-режим: заявка не отправляется, оплата не списывается.
          </DialogDescription>
        </DialogHeader>
        <BookingForm initialZone={initialZone} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

function BookingForm({ initialZone, onDone }: { initialZone?: string; onDone: () => void }) {
  const todayISO = getLocalTodayISO()
  const initialZoneId: ZoneId = ZONES.some((zone) => zone.id === initialZone)
    ? (initialZone as ZoneId)
    : 'arena'

  const [zone, setZone] = useState<ZoneId>(initialZoneId)
  const [date, setDate] = useState(todayISO)
  const [time, setTime] = useState('')
  const [duration, setDuration] = useState(1)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  const selectedZone = ZONES.find((item) => item.id === zone) ?? ZONES[0]
  const total = selectedZone.price * duration

  const validate = (): FormErrors => {
    const next: FormErrors = {}
    const trimmedName = name.trim()
    if (trimmedName.length < 2 || trimmedName.length > 40 || !NAME_PATTERN.test(trimmedName)) {
      next.name = 'Укажите имя: 2–40 символов, только буквы.'
    }
    if (!isValidPhone(phone)) {
      next.phone = 'Введите телефон: +7, 8 или 10 цифр, например +7 (999) 123-45-67.'
    }
    if (!date) {
      next.date = 'Выберите дату визита.'
    } else if (date < todayISO) {
      next.date = 'Дата уже прошла.'
    }
    if (!time) {
      next.time = 'Выберите время начала.'
    }
    return next
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    setSubmitted(true)
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {submitted ? (
        <motion.div
          key="success"
          role="status"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="flex flex-col items-center gap-4 py-6 text-center"
        >
          <CheckCircle2 aria-hidden="true" className="h-12 w-12 text-[#b7ff2c]" />
          <p className="text-lg font-semibold">Заявка оформлена</p>
          <p className="text-sm text-[#a3a3a8]">
            {selectedZone.name} · {formatDate(date)} · {time} · {duration} ч ·{' '}
            {formatPrice(total)} ₽
          </p>
          <p className="max-w-xs text-xs text-[#7c7c82]">
            Демо-режим: заявка не отправляется, оплата не списывается.
          </p>
          <Button type="button" onClick={onDone} className="w-full">
            Готово
          </Button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          noValidate
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="space-y-5"
        >
          <fieldset className="m-0 border-0 p-0">
            <legend className="mb-2 text-sm font-medium">Зона</legend>
            <div className="space-y-2">
              {ZONES.map((item) => {
                const active = item.id === zone
                return (
                  <label
                    key={item.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#b7ff2c] has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-[#1f1f21] ${
                      active
                        ? 'border-[#b7ff2c] bg-[#b7ff2c]/10'
                        : 'border-[#2c2c30] bg-[#111111] hover:border-[#454549]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="zone"
                      value={item.id}
                      checked={active}
                      onChange={() => setZone(item.id)}
                      className="sr-only"
                    />
                    <span
                      aria-hidden="true"
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                        active ? 'border-[#b7ff2c]' : 'border-[#55555a]'
                      }`}
                    >
                      {active ? <span className="h-2 w-2 rounded-full bg-[#b7ff2c]" /> : null}
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-medium">{item.name}</span>
                      <span className="block text-xs text-[#a3a3a8]">{item.hint}</span>
                    </span>
                    <span className="text-sm font-semibold tabular-nums">{item.price} ₽/час</span>
                  </label>
                )
              })}
            </div>
          </fieldset>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="booking-date" className="mb-1.5 block text-sm font-medium">
                Дата
              </label>
              <input
                id="booking-date"
                type="date"
                min={todayISO}
                value={date}
                onChange={(event) => {
                  setDate(event.target.value)
                  if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }))
                }}
                required
                aria-invalid={Boolean(errors.date)}
                aria-describedby={errors.date ? 'booking-date-error' : undefined}
                className={`${FIELD_CLASS} ${
                  errors.date ? 'border-[#ffffff]' : 'border-[#2c2c30]'
                }`}
              />
              {errors.date ? (
                <p id="booking-date-error" className={ERROR_CLASS}>
                  {errors.date}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="booking-time" className="mb-1.5 block text-sm font-medium">
                Время
              </label>
              <select
                id="booking-time"
                value={time}
                onChange={(event) => {
                  setTime(event.target.value)
                  if (errors.time) setErrors((prev) => ({ ...prev, time: undefined }))
                }}
                required
                aria-invalid={Boolean(errors.time)}
                aria-describedby={errors.time ? 'booking-time-error' : undefined}
                className={`${FIELD_CLASS} ${
                  errors.time ? 'border-[#ffffff]' : 'border-[#2c2c30]'
                }`}
              >
                <option value="">—</option>
                {TIMES.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              {errors.time ? (
                <p id="booking-time-error" className={ERROR_CLASS}>
                  {errors.time}
                </p>
              ) : null}
            </div>
          </div>

          <fieldset className="m-0 border-0 p-0">
            <legend className="mb-2 text-sm font-medium">Длительность</legend>
            <div className="grid grid-cols-3 gap-2">
              {DURATIONS.map((hours) => {
                const active = hours === duration
                return (
                  <label
                    key={hours}
                    className={`flex h-10 cursor-pointer items-center justify-center rounded-md border text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#b7ff2c] has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-[#1f1f21] ${
                      active
                        ? 'border-[#b7ff2c] bg-[#b7ff2c]/10 text-[#f5f5f5]'
                        : 'border-[#2c2c30] bg-[#111111] text-[#a3a3a8] hover:border-[#454549]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="duration"
                      value={hours}
                      checked={active}
                      onChange={() => setDuration(hours)}
                      className="sr-only"
                    />
                    {hours} ч
                  </label>
                )
              })}
            </div>
          </fieldset>

          <div>
            <label htmlFor="booking-name" className="mb-1.5 block text-sm font-medium">
              Имя
            </label>
            <input
              id="booking-name"
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
              }}
              required
              autoComplete="name"
              placeholder="Иван Петров"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'booking-name-error' : undefined}
              className={`${FIELD_CLASS} ${
                errors.name ? 'border-[#ffffff]' : 'border-[#2c2c30]'
              }`}
            />
            {errors.name ? (
              <p id="booking-name-error" className={ERROR_CLASS}>
                {errors.name}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="booking-phone" className="mb-1.5 block text-sm font-medium">
              Телефон
            </label>
            <input
              id="booking-phone"
              type="tel"
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value)
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }))
              }}
              required
              inputMode="tel"
              autoComplete="tel"
              placeholder="+7 (999) 123-45-67"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? 'booking-phone-error' : undefined}
              className={`${FIELD_CLASS} ${
                errors.phone ? 'border-[#ffffff]' : 'border-[#2c2c30]'
              }`}
            />
            {errors.phone ? (
              <p id="booking-phone-error" className={ERROR_CLASS}>
                {errors.phone}
              </p>
            ) : null}
          </div>

          <div className="rounded-md border border-[#2c2c30] bg-[#111111] p-4">
            <div className="flex items-center justify-between text-sm text-[#a3a3a8]">
              <span>
                {selectedZone.name} · {duration} ч · {selectedZone.price} ₽/час
              </span>
              <span className="tabular-nums">{formatPrice(total)} ₽</span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-[#2c2c30] pt-2 text-base font-semibold">
              <span>Итого</span>
              <span className="tabular-nums">{formatPrice(total)} ₽</span>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Забронировать · {formatPrice(total)} ₽
          </Button>
          <p className="text-center text-xs text-[#7c7c82]">
            Демо-режим: заявка не отправляется, оплата не списывается.
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  )
}
