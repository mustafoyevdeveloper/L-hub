import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "uz" | "ru" | "en";

type Dict = Record<string, Record<Lang, string>>;

const translations: Dict = {
  brand: { uz: "FairRNG", ru: "FairRNG", en: "FairRNG" },
  "nav.lottery": { uz: "Lotereya", ru: "Лотерея", en: "Lottery" },
  "nav.dashboard": { uz: "Panel", ru: "Панель", en: "Dashboard" },
  "nav.profile": { uz: "Profil", ru: "Профиль", en: "Profile" },
  "hero.title": {
    uz: "Adolatli, auditlanadigan onlayn lotereya",
    ru: "Справедливая, аудируемая онлайн-лотерея",
    en: "Fair, auditable online lottery",
  },
  "hero.subtitle": {
    uz: "PCI-DSS mos to‘lovlar, auditable RNG va KYC bilan xavfsiz platforma.",
    ru: "Безопасная платформа с PCI-DSS платежами, аудируемым RNG и KYC.",
    en: "Secure platform with PCI-DSS payments, auditable RNG, and KYC.",
  },
  "cta.getStarted": { uz: "Boshlash", ru: "Начать", en: "Get Started" },
  "cta.learnMore": { uz: "Batafsil", ru: "Подробнее", en: "Learn More" },
  "features.security": {
    uz: "Xavfsizlik va compliance",
    ru: "Безопасность и комплаенс",
    en: "Security & compliance",
  },
  "features.payments": {
    uz: "To‘lovlar va tokenizatsiya",
    ru: "Платежи и токенизация",
    en: "Payments & tokenization",
  },
  "features.rng": {
    uz: "Auditlanadigan RNG",
    ru: "Аудируемый RNG",
    en: "Auditable RNG",
  },
  "features.admin": {
    uz: "Kuchli admin panel",
    ru: "Мощная админ-панель",
    en: "Powerful admin panel",
  },
  "features.i18n": {
    uz: "Ko‘p tilli UI",
    ru: "Мультиязычный интерфейс",
    en: "Multilingual UI",
  },
  "features.support": {
    uz: "Support va bildirishnomalar",
    ru: "Поддержка и уведомления",
    en: "Support & notifications",
  },
  "footer.rights": {
    uz: "Barcha huquqlar himoyalangan.",
    ru: "Все права защищены.",
    en: "All rights reserved.",
  },
  "dashboard.title": { uz: "Panel", ru: "Панель", en: "Dashboard" },
  "dashboard.description": { uz: "Foydalanuvchi paneli", ru: "Пользовательская панель", en: "User dashboard" },
  "dashboard.welcome": { uz: "Xush kelibsiz!", ru: "Добро пожаловать!", en: "Welcome!" },
  "dashboard.subtitle": { uz: "Hisobingizni boshqaring", ru: "Управляйте аккаунтом", en: "Manage your account" },
  "dashboard.balance": { uz: "Balans", ru: "Баланс", en: "Balance" },
  "dashboard.settings": { uz: "Sozlamalar", ru: "Настройки", en: "Settings" },
  "dashboard.deposit": { uz: "To'ldirish", ru: "Пополнить", en: "Deposit" },
  "dashboard.fromLast": { uz: "o'tgan davrdan", ru: "с прошлого периода", en: "from last period" },
  "dashboard.activeTickets": { uz: "Faol biletlar", ru: "Активные билеты", en: "Active tickets" },
  "dashboard.inCurrentDraw": { uz: "Joriy undiruvda", ru: "В текущем тираже", en: "In current draw" },
  "dashboard.totalWins": { uz: "Jami yutuqlar", ru: "Всего выигрышей", en: "Total wins" },
  "dashboard.winRate": { uz: "Yutuq darajasi", ru: "Процент выигрыша", en: "Win rate" },
  "dashboard.overview": { uz: "Umumiy", ru: "Обзор", en: "Overview" },
  "dashboard.myTickets": { uz: "Biletlarim", ru: "Мои билеты", en: "My tickets" },
  "dashboard.history": { uz: "Tarix", ru: "История", en: "History" },
  "dashboard.payments": { uz: "To'lovlar", ru: "Платежи", en: "Payments" },
  "dashboard.currentDraw": { uz: "Joriy undiruv", ru: "Текущий тираж", en: "Current draw" },
  