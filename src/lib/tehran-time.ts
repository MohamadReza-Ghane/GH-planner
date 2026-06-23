
/**
 * مدیریت زمان و تاریخ با تمرکز بر منطقه زمانی تهران و تقویم شمسی
 */

export function getTehranNow() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tehran" }));
}

/**
 * دریافت کلید تاریخ (YYYY-MM-DD)
 */
export function getTehranDateKey(date?: Date) {
  const d = date || getTehranNow();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * محاسبه میلی‌ثانیه تا نیمه‌شب تهران
 */
export function getMsUntilTehranMidnight() {
  const now = getTehranNow();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.getTime() - now.getTime();
}

/**
 * نمایش زمان به صورت فارسی
 */
export function getTehranTimeStr(date?: Date) {
  return (date || getTehranNow()).toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/**
 * فرمت‌دهی کامل تاریخ به شمسی با استفاده از Intl (بدون نیاز به کتابخانه اضافی)
 */
export function formatPersianDate(dateKey: string | Date) {
  let date: Date;
  if (typeof dateKey === 'string') {
    const [y, m, d] = dateKey.split('-').map(Number);
    date = new Date(y, m - 1, d);
  } else {
    date = dateKey;
  }
  
  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

/**
 * دریافت نام ماه شمسی
 */
export function getPersianMonthName(date: Date = getTehranNow()) {
  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', { month: 'long' }).format(date);
}
