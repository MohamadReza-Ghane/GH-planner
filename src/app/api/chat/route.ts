import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { message, contextTasks, trackerContext, activeGoals, language, mode } = await req.json();

    const taskCtx = contextTasks?.length
      ? `\nتسک‌های فعال:\n${contextTasks.map((t: any) => `- ${t.name} (${t.stars} ستاره)`).join('\n')}` : '';

    const goalCtx = activeGoals?.length
      ? `\nاهداف فعال:\n${activeGoals.map((g: any) => `- ${g.title} (پیشرفت: ${g.progress}%)`).join('\n')}` : '';

    const trackerCtx = trackerContext?.length
      ? `\nداده‌های بیولوژیک اخیر:\n${trackerContext.slice(0, 5).map((t: any) => 
          `- ${t.dateKey}: خواب ${t.sleepHours}h، انرژی ${t.energyLevel}/10`).join('\n')}` : '';

    const modeMap: Record<string, string> = {
      chat: 'مشاوره عمومی',
      simulate: 'شبیه‌سازی آینده',
      decision: 'تصمیم‌گیری استراتژیک',
      'reverse-plan': 'برنامه‌ریزی معکوس',
    };

    const systemPrompt = `تو «GH» هستی — دستیار استراتژیک هوشمند و سیستم عامل زندگی.
شخصیت: نخبه، استراتژیک، الهام‌بخش، مستقیم و قدرتمند.
حالت فعلی: ${modeMap[mode] || 'مشاوره'}
${taskCtx}${goalCtx}${trackerCtx}

دستورالعمل‌ها:
- اسمت GH هست، نه هوش مصنوعی یا Groq یا Gemini
- پاسخ به ${language === 'fa' ? 'فارسی' : 'انگلیسی'} بده
- از ایموجی‌های 🧠 ⚡ 🚀 🎯 استفاده کن
- تحلیل عمیق و کاربردی بده
- اگر برنامه هفتگی خواسته شد، روز به روز بده`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || 'متأسفانه پاسخی دریافت نشد.';
    return NextResponse.json({ response });
  } catch (error: any) {
    console.error('GH AI error:', error);
    return NextResponse.json({ error: 'خطا در ارتباط با GH' }, { status: 500 });
  }
}
