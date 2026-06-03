import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, ActivityLevel, MoodExtended } from '../src/shared/db/generated/client/client';
import { ScryptPasswordHasher } from '../src/infrastructure/security/password-hasher';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('❌ DATABASE_URL environment variable is required');
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

const hasher = new ScryptPasswordHasher();

const MOOD_PATTERNS = {
  HAPPY:     { min: 7.0, max: 10.0, sleepMin: 7.0, sleepMax: 9.0, activity: ActivityLevel.HIGH,     studyMin: 1, studyMax: 4, socialMin: 7, socialMax: 10, feelingPool: [MoodExtended.HAPPY, MoodExtended.VERY_HAPPY] },
  NORMAL:    { min: 5.0, max: 7.0,  sleepMin: 5.5, sleepMax: 8.0, activity: ActivityLevel.MODERATE, studyMin: 2, studyMax: 5, socialMin: 4, socialMax: 7,  feelingPool: [MoodExtended.NORMAL, MoodExtended.HAPPY] },
  STRESS:    { min: 2.0, max: 5.0,  sleepMin: 3.0, sleepMax: 6.0, activity: ActivityLevel.LOW,      studyMin: 4, studyMax: 8, socialMin: 1, socialMax: 4,  feelingPool: [MoodExtended.STRESS, MoodExtended.VERY_STRESS, MoodExtended.NORMAL] },
};

const NOTES_POOL = [
  'Hari ini cukup produktif, banyak tugas selesai.',
  'Kuliah lancar, tapi sedikit lelah.',
  'Semangat banget hari ini! Olahraga pagi bikin fresh.',
  'Agak pusing karena kurang tidur semalam.',
  'Belajar bareng temen-temen, seru!',
  'Deadline tugas bikin stres, tapi masih bisa dihandle.',
  'Hari yang tenang, bisa me-time sejenak.',
  'Banyak meeting dan diskusi kelompok hari ini.',
  'Mood bagus setelah dengerin playlist favorit.',
  'Sedih sedikit karena ada masalah personal.',
  'Ngerjain proyek besar, lumayan exhausting.',
  'Jalan-jalan sore bikin pikiran fresh.',
  'Hari ini santai aja di rumah, recharge energy.',
  'Presentasi berjalan lancar, lega banget!',
  'Agak cemas karena ujian makin dekat.',
  null,
  null,
  null,
];

const AI_INSIGHT_TEMPLATES = {
  HAPPY: [
    {
      ai_insight: 'Energi positifmu hari ini luar biasa! Mood yang baik bisa jadi momentum untuk menyelesaikan hal-hal penting. Pertahankan dengan menjaga pola tidur dan tetap terhidrasi.',
      recommendations: [
        { name: 'Olahraga Ringan', description: 'Jaga endorfin tetap tinggi dengan jogging atau workout singkat.', duration: '30 menit' },
        { name: 'Selesaikan Prioritas', description: 'Gunakan energi ekstra untuk menyelesaikan tugas yang paling menantang.', duration: '1 jam' },
        { name: 'Sosialisasi', description: 'Bagikan energi positif dengan teman atau keluargamu hari ini.', duration: '15 menit' },
      ],
      factors: {
        stressors: [] as any[],
        boosters: [
          { name: 'Tidur Cukup', value: '8 jam', description: 'Durasi tidur yang cukup memberikan energi optimal sepanjang hari.' },
          { name: 'Aktivitas Fisik', value: 'Aktif', description: 'Olahraga melepaskan endorfin yang meningkatkan mood alami.' },
        ],
      },
    },
    {
      ai_insight: 'Kamu sedang dalam kondisi terbaik! Mood yang tinggi sangat mendukung produktivitas dan kreativitas. Jangan lupa istirahat sejenak agar tidak burnout.',
      recommendations: [
        { name: 'Teknik Pomodoro', description: 'Kerjakan tugas dengan interval 25 menit fokus + 5 menit istirahat.', duration: '25 menit' },
        { name: 'Journaling Syukur', description: 'Tulis 3 hal yang membuatmu bersyukur hari ini untuk memperkuat mindset positif.', duration: '10 menit' },
        { name: 'Istirahat Aktif', description: 'Lakukan peregangan ringan setiap 2 jam untuk menjaga energi.', duration: '5 menit' },
      ],
      factors: {
        stressors: [] as any[],
        boosters: [
          { name: 'Sosialisasi Baik', value: '8/10', description: 'Interaksi sosial yang positif memperkuat suasana hati.' },
          { name: 'Produktivitas', value: 'Tinggi', description: 'Menyelesaikan tugas memberikan rasa pencapaian yang memuaskan.' },
        ],
      },
    },
  ],
  NORMAL: [
    {
      ai_insight: 'Hari ini cukup seimbang. Mood yang stabil adalah fondasi yang baik untuk konsistensi jangka panjang. Coba tambahkan sedikit variasi agar tidak monoton.',
      recommendations: [
        { name: 'Jalan Santai', description: 'Berjalan kaki 15 menit di luar untuk menyegarkan pikiran.', duration: '15 menit' },
        { name: 'Coba Hal Baru', description: 'Lakukan satu aktivitas kecil yang belum pernah kamu coba minggu ini.', duration: '20 menit' },
        { name: 'Review Harian', description: 'Luangkan waktu untuk evaluasi apa yang berjalan baik hari ini.', duration: '5 menit' },
      ],
      factors: {
        stressors: [] as any[],
        boosters: [
          { name: 'Rutinitas Stabil', value: 'Konsisten', description: 'Pola harian yang teratur membantu menjaga mood tetap seimbang.' },
        ],
      },
    },
    {
      ai_insight: 'Mood kamu stabil, dan itu bagus! Hari seperti ini cocok untuk membangun kebiasaan kecil yang berdampak besar ke depannya.',
      recommendations: [
        { name: 'Meditasi Singkat', description: 'Coba mindfulness 5 menit untuk meningkatkan fokus dan ketenangan.', duration: '5 menit' },
        { name: 'Susun Prioritas Besok', description: 'Rencanakan 3 hal utama yang ingin diselesaikan besok hari.', duration: '10 menit' },
        { name: 'Hubungi Teman', description: 'Kirim pesan singkat ke teman dekat untuk menjaga koneksi sosial.', duration: '5 menit' },
      ],
      factors: {
        stressors: [] as any[],
        boosters: [
          { name: 'Manajemen Waktu', value: 'Baik', description: 'Pembagian waktu yang seimbang antara belajar dan istirahat.' },
        ],
      },
    },
  ],
  STRESS: [
    {
      ai_insight: 'Kami menyadari hari ini terasa berat bagimu. Tidak apa-apa untuk merasa lelah — tubuh dan pikiranmu butuh istirahat. Prioritaskan pemulihan dulu sebelum kembali produktif.',
      recommendations: [
        { name: 'Latihan Pernapasan', description: 'Lakukan teknik box breathing (tarik 4s, tahan 4s, embus 4s, tahan 4s) untuk menenangkan saraf.', duration: '5 menit' },
        { name: 'Power Nap', description: 'Tidur singkat 20 menit untuk mengembalikan energi dan fokus.', duration: '20 menit' },
        { name: 'Jeda Digital', description: 'Menjauh dari layar selama 1 jam untuk mengurangi overstimulasi.', duration: '1 jam' },
      ],
      factors: {
        stressors: [
          { name: 'Kurang Tidur', value: '4 jam', description: 'Tidur di bawah 5 jam sangat memicu kelelahan fisik dan mental.' },
          { name: 'Belajar Berlebihan', value: '7 jam', description: 'Durasi belajar yang terlalu panjang dapat menyebabkan burnout.' },
        ],
        boosters: [] as any[],
      },
    },
    {
      ai_insight: 'Hari yang melelahkan, ya. Wajar banget kok merasa overwhelmed. Ingat: ini hanya fase, bukan kondisi permanen. Yuk pelan-pelan pulihkan energimu.',
      recommendations: [
        { name: 'Minum Air Putih', description: 'Dehidrasi bisa memperburuk rasa lelah. Minum segelas air sekarang.', duration: 'segera' },
        { name: 'Curhat Singkat', description: 'Ceritakan apa yang kamu rasakan ke teman terpercaya, bahkan lewat chat.', duration: '15 menit' },
        { name: 'Tidur Lebih Awal', description: 'Usahakan tidur sebelum jam 10 malam ini untuk pemulihan maksimal.', duration: '8 jam' },
      ],
      factors: {
        stressors: [
          { name: 'Isolasi Sosial', value: '3/10', description: 'Kurangnya interaksi sosial dapat memperburuk perasaan stres.' },
          { name: 'Kondisi Emosional', value: 'STRESS', description: 'Perasaan stres yang dirasakan memengaruhi energi dan fokus.' },
        ],
        boosters: [] as any[],
      },
    },
  ],
};

function rand(min: number, max: number): number {
  return parseFloat((min + Math.random() * (max - min)).toFixed(1));
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateDayData(dayOffset: number, prevMood: string) {
  // Create realistic mood transitions (don't jump from STRESS to HAPPY instantly)
  let moodKey: 'HAPPY' | 'NORMAL' | 'STRESS';
  const roll = Math.random();

  if (prevMood === 'HAPPY') {
    moodKey = roll < 0.6 ? 'HAPPY' : roll < 0.85 ? 'NORMAL' : 'STRESS';
  } else if (prevMood === 'STRESS') {
    moodKey = roll < 0.5 ? 'STRESS' : roll < 0.8 ? 'NORMAL' : 'HAPPY';
  } else {
    moodKey = roll < 0.35 ? 'HAPPY' : roll < 0.7 ? 'NORMAL' : 'STRESS';
  }

  const pattern = MOOD_PATTERNS[moodKey];

  // Weekends are better
  const date = new Date('2026-05-01');
  date.setDate(date.getDate() + dayOffset);
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;

  const moodValue = parseFloat(
    (isWeekend
      ? Math.min(10, rand(pattern.min, pattern.max) + rand(0.5, 1.5))
      : rand(pattern.min, pattern.max)
    ).toFixed(1)
  );

  const sleepHours = isWeekend
    ? rand(pattern.sleepMin + 0.5, pattern.sleepMax + 1)
    : rand(pattern.sleepMin, pattern.sleepMax);

  const studyHours = isWeekend
    ? rand(0.5, 2)
    : rand(pattern.studyMin, pattern.studyMax);

  const socialScore = isWeekend
    ? Math.floor(rand(Math.max(pattern.socialMin, 5), pattern.socialMax))
    : Math.floor(rand(pattern.socialMin, pattern.socialMax));

  const activity: ActivityLevel = isWeekend && Math.random() > 0.5
    ? pick([ActivityLevel.MODERATE, ActivityLevel.HIGH])
    : pattern.activity;

  const feeling = pick(pattern.feelingPool) as MoodExtended;

  const notes = pick(NOTES_POOL);

  // Convert mood score to sentiment (-1 to 1)
  const sentimentScore = parseFloat((((moodValue - 5.5) / 4.5)).toFixed(2));

  const timestamp = new Date(date);
  timestamp.setHours(
    Math.floor(rand(7, 9)),
    Math.floor(rand(0, 59)),
    0, 0
  );

  const insight = pick(AI_INSIGHT_TEMPLATES[moodKey]);

  // Personalize insight with actual data
  let aiInsightText = insight.ai_insight;
  const factors = JSON.parse(JSON.stringify(insight.factors));
  const recommendations = JSON.parse(JSON.stringify(insight.recommendations));

  // Update factor values to match actual data
  for (const s of factors.stressors) {
    if (s.name === 'Kurang Tidur') s.value = `${sleepHours} jam`;
    if (s.name === 'Belajar Berlebihan') s.value = `${studyHours} jam`;
    if (s.name === 'Isolasi Sosial') s.value = `${socialScore}/10`;
  }
  for (const b of factors.boosters) {
    if (b.name === 'Tidur Cukup') b.value = `${sleepHours} jam`;
    if (b.name === 'Sosialisasi Baik') b.value = `${socialScore}/10`;
    if (b.name === 'Aktivitas Fisik') b.value = activity;
  }

  const activitySuggestion = JSON.stringify({
    ai_insight: aiInsightText,
    recommendations,
    factors,
  });

  const confidence = Math.round((0.65 + Math.random() * 0.3) * 100) / 100;

  return {
    sleep_hours: sleepHours,
    activity_level: activity,
    study_hours: studyHours,
    social_score: socialScore,
    how_you_feeling: feeling,
    notes: notes,
    sentiment_score: sentimentScore,
    logged_at: timestamp,
    created_at: timestamp,
    updated_at: timestamp,
    prediction: {
      mood_result: moodKey,
      activity_suggestion: activitySuggestion,
      confidence_score: confidence,
      created_at: timestamp,
    },
    moodValue,
  };
}

async function main() {
  console.log('🌱 Seeding 1-month data for Dami Damian...\n');

  // 1. Create user
  const hashedPassword = await hasher.hash('password123');
  const user = await prisma.users.upsert({
    where: { email: 'dami.damian@example.com' },
    update: {},
    create: {
      email: 'dami.damian@example.com',
      name: 'Dami Damian',
      password: hashedPassword,
      gender: 'MALE',
      tanggal_lahir: new Date('2002-03-15'),
      usage_reason: 'Menjaga kesehatan mental selama kuliah',
      role: 'USER',
    },
  });
  console.log(`✅ User: ${user.name} (ID: ${user.user_id})`);

  // 2. Delete existing data for this user (clean slate)
  await prisma.mood_predictions.deleteMany({ where: { log: { user_id: user.user_id } } });
  await prisma.mood_logs.deleteMany({ where: { user_id: user.user_id } });
  await prisma.todo_items.deleteMany({ where: { user_id: user.user_id } });
  await prisma.mood_forecasts.deleteMany({ where: { user_id: user.user_id } });
  console.log('🧹 Cleaned existing data for this user');

  // 3. Generate daily check-ins from May 1 to June 2 (33 days)
  const totalDays = 33; // May 1 to June 2
  let prevMood = 'NORMAL';
  let logCount = 0;

  const allRecommendations = new Map<string, { name: string; description: string; duration: string }>();

  for (let day = 0; day < totalDays; day++) {
    const data = generateDayData(day, prevMood);

    await prisma.mood_logs.create({
      data: {
        user_id: user.user_id,
        sleep_hours: data.sleep_hours,
        activity_level: data.activity_level,
        study_hours: data.study_hours,
        social_score: data.social_score,
        how_you_feeling: data.how_you_feeling,
        notes: data.notes,
        sentiment_score: data.sentiment_score,
        logged_at: data.logged_at,
        created_at: data.created_at,
        updated_at: data.updated_at,
        prediction: {
          create: data.prediction,
        },
      },
      include: { prediction: true },
    });

    // Collect unique recommendations for todo items
    const parsed = JSON.parse(data.prediction.activity_suggestion);
    for (const rec of parsed.recommendations) {
      allRecommendations.set(rec.name, rec);
    }

    prevMood = data.prediction.mood_result;
    logCount++;

    const dateStr = data.logged_at.toISOString().slice(0, 10);
    const moodBar = data.prediction.mood_result === 'HAPPY' ? '🟢' : data.prediction.mood_result === 'NORMAL' ? '🟡' : '🔴';
    process.stdout.write(`  ${moodBar} ${dateStr} | Mood: ${data.prediction.mood_result} (${data.moodValue}/10) | Sleep: ${data.sleep_hours}h | Study: ${data.study_hours}h | Social: ${data.social_score}/10\n`);
  }

  // 4. Create todo items from collected recommendations
  let todoCount = 0;
  const todoNames = Array.from(allRecommendations.values());
  // Pick 5-8 unique todos
  const selectedTodos = todoNames.sort(() => Math.random() - 0.5).slice(0, 8);

  for (const todo of selectedTodos) {
    await prisma.todo_items.create({
      data: {
        user_id: user.user_id,
        name: todo.name,
        description: todo.description,
        duration: todo.duration,
        source: 'AI',
      },
    });
    todoCount++;
  }
  console.log(`\n✅ Created ${todoCount} todo items`);

  // 5. Create a mood forecast cache for today
  const avgMood = prevMood === 'HAPPY' ? 8.2 : prevMood === 'NORMAL' ? 6.5 : 3.8;

  const forecastData = {
    forecasts: [
      { day: 'Besok', date: '2026-06-04', predicted_mood: Math.min(10, avgMood + 0.3), label: avgMood > 7 ? 'Baik' : 'Biasa', confidence: 0.85 },
      { day: 'Lusa', date: '2026-06-05', predicted_mood: avgMood, label: avgMood > 7 ? 'Baik' : 'Biasa', confidence: 0.75 },
      { day: '3 Hari Lagi', date: '2026-06-06', predicted_mood: Math.max(1, avgMood - 0.2), label: avgMood > 7 ? 'Baik' : 'Biasa', confidence: 0.65 },
      { day: '4 Hari Lagi', date: '2026-06-07', predicted_mood: avgMood, label: avgMood > 7 ? 'Baik' : 'Biasa', confidence: 0.55 },
      { day: '5 Hari Lagi', date: '2026-06-08', predicted_mood: Math.min(10, avgMood + 0.1), label: avgMood > 7 ? 'Baik' : 'Biasa', confidence: 0.45 },
    ],
    trend_direction: 'stabil',
    trend_analysis: 'Tren mood menunjukkan pola yang cukup stabil selama sebulan terakhir. Pola tidur dan aktivitas sosial yang konsisten membantu menjaga keseimbangan emosional.',
    prevention_tips: [] as string[],
    boost_tips: ['Pertahankan rutinitas tidur yang sudah baik.', 'Lanjutkan check-in harian untuk memonitor perubahan.', 'Tambahkan variasi aktivitas fisik untuk menjaga motivasi.'],
  };

  await prisma.mood_forecasts.create({
    data: {
      user_id: user.user_id,
      forecast_data: forecastData as any,
      generated_at: new Date(),
    },
  });
  console.log('✅ Created forecast cache');

  // 6. Update sequences
  await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('mood_logs', 'log_id'), GREATEST((SELECT COALESCE(MAX(log_id), 0) FROM mood_logs), 1), true)`);
  await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('mood_predictions', 'prediction_id'), GREATEST((SELECT COALESCE(MAX(prediction_id), 0) FROM mood_predictions), 1), true)`);
  await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('todo_items', 'todo_id'), GREATEST((SELECT COALESCE(MAX(todo_id), 0) FROM todo_items), 1), true)`);

  console.log(`\n🎉 Done! ${logCount} days of check-ins created for ${user.name}`);
  console.log(`   Email: dami.damian@example.com`);
  console.log(`   Password: password123`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
