import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { message, tasks, language } = await req.json();

    const taskContext = tasks?.length
      ? `\nوظایف فعلی کاربر:\n${tasks.map((t: any) => `- ${t.name} (${t.stars} ستاره)`).join('\n')}`
      : '';

    const systemPrompt = `شما "دستیار هوشمند GH Planner" هستید — یک کمک‌یار بهره‌وری حرفه‌ای.
وظیفه شما کمک به مدیریت زمان، اولویت‌بندی وظایف و افزایش انگیزه است.
${taskContext}
لحن: دوستانه، حرفه‌ای، الهام‌بخش. از ایموجی مناسب استفاده کن.
پاسخ را به زبان ${language === 'fa' ? 'فارسی' : 'انگلیسی'} بده. پاسخ کوتاه و کاربردی باشد.`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || 'متأسفانه پاسخی دریافت نشد.';
    return NextResponse.json({ response });
  } catch (error: any) {
    console.error('Groq error:', error);
    return NextResponse.json({ error: 'خطا در ارتباط با هوش مصنوعی' }, { status: 500 });
  }
}
