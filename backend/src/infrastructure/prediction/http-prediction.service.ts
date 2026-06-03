import type { PredictionService, PredictionInsight, PredictionFactors, MoodForecast } from '@/shared/ports/prediction-service';

export class HttpPredictionService implements PredictionService {
    private readonly apiUrl = process.env.ML_API_URL || 'http://localhost:8000';

    async predict(params: {
        text: string;
        sleep_hours?: number;
        activity_level?: string;
        how_you_feeling?: string;
    }): Promise<{
        predicted_mood: 'stress' | 'happy' | 'normal';
        confidence: number;
    }> {
        try {
            const response = await fetch(`${this.apiUrl}/api/v1/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });

            if (!response.ok) {
                throw new Error(`ML API returned status ${response.status}`);
            }

            const data = await response.json();
            return {
                predicted_mood: data.predicted_mood,
                confidence: data.confidence,
            };
        } catch (error) {
            console.error('ML Prediction request failed, utilizing rule-based fallback:', error);
            
            // Fail-safe Rule-Based Fallback to avoid breaking checkins if ML API is offline
            const feeling = params.how_you_feeling?.toLowerCase() || 'normal';
            let predicted: 'stress' | 'happy' | 'normal' = 'normal';
            if (feeling.includes('stress')) {
                predicted = 'stress';
            } else if (feeling.includes('happy')) {
                predicted = 'happy';
            }

            return {
                predicted_mood: predicted,
                confidence: 0.5,
            };
        }
    }

    async getInsight(params: {
        sleep_hours: number;
        activity_level: string;
        study_hours: number;
        social_score: number;
        how_you_feeling: string;
        notes?: string;
    }): Promise<PredictionInsight> {
        try {
            const response = await fetch(`${this.apiUrl}/api/v1/insight`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });

            if (!response.ok) {
                throw new Error(`ML API returned status ${response.status}`);
            }

            const data = await response.json();
            return {
                insight: data.insight,
                recommendations: data.recommendations || [],
            };
        } catch (error) {
            console.error('ML Insight request failed, utilizing rule-based fallback:', error);

            // Fail-safe Rule-Based Fallback to avoid breaking checkins if ML API is offline/rate-limited
            const feeling = params.how_you_feeling?.toUpperCase() || 'NORMAL';
            if (feeling === 'STRESS' || feeling === 'VERY_STRESS') {
                return {
                    insight: 'Kami menyadari hari ini terasa berat bagimu. Ingatlah untuk mengambil waktu sejenak untuk diri sendiri dan memulihkan energi.',
                    recommendations: [
                        {
                            name: 'Latihan Pernapasan',
                            description: 'Lakukan teknik box breathing (tarik 4s, tahan 4s, embus 4s, tahan 4s) untuk menenangkan sistem saraf.',
                            duration: '5 menit',
                        },
                        {
                            name: 'Jeda Istirahat',
                            description: 'Menjauh sejenak dari layar atau tugas kuliah untuk meregangkan tubuh.',
                            duration: '15 menit',
                        },
                        {
                            name: 'Musik Tenang',
                            description: 'Dengarkan instrumental lambat atau suara alam untuk menurunkan tingkat kecemasan.',
                            duration: '10 menit',
                        },
                    ],
                };
            } else if (feeling === 'HAPPY' || feeling === 'VERY_HAPPY') {
                return {
                    insight: 'Luar biasa! Energi positifmu hari ini sangat bagus. Salurkan energi ini untuk aktivitas yang produktif atau menyenangkan.',
                    recommendations: [
                        {
                            name: 'Berolahraga Ringan',
                            description: 'Lakukan jogging atau workout ringan untuk menjaga endorfin tetap tinggi.',
                            duration: '30 menit',
                        },
                        {
                            name: 'Bersosialisasi',
                            description: 'Bagikan keceriaanmu hari ini dengan menghubungi teman atau keluarga terdekat.',
                            duration: '15 menit',
                        },
                        {
                            name: 'Lanjutkan Hobi',
                            description: 'Habiskan waktu untuk mendalami hal yang kamu sukai.',
                            duration: '1 jam',
                        },
                    ],
                };
            } else {
                return {
                    insight: 'Hari berjalan dengan cukup seimbang. Pertahankan stabilitas ini dengan menjaga rutinitas harianmu.',
                    recommendations: [
                        {
                            name: 'Jalan Santai',
                            description: 'Berjalan kaki di luar ruangan untuk menghirup udara segar dan menyegarkan pikiran.',
                            duration: '15 menit',
                        },
                        {
                            name: 'Journaling',
                            description: 'Tuliskan apa saja yang berjalan lancar hari ini sebagai bentuk apresiasi diri.',
                            duration: '10 menit',
                        },
                        {
                            name: 'Belajar Terstruktur',
                            description: 'Lanjutkan belajar dengan teknik Pomodoro untuk mencegah kelelahan.',
                            duration: '25 menit',
                        },
                    ],
                };
            }
        }
    }

    async getFactors(params: {
        sleep_hours: number;
        activity_level: string;
        study_hours: number;
        social_score: number;
        how_you_feeling: string;
        notes?: string;
    }): Promise<PredictionFactors> {
        try {
            const response = await fetch(`${this.apiUrl}/api/v1/factors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });

            if (!response.ok) {
                throw new Error(`ML API returned status ${response.status}`);
            }

            const data = await response.json();
            return {
                stressors: data.stressors || [],
                boosters: data.boosters || [],
            };
        } catch (error) {
            console.error('ML Factors request failed, utilizing rule-based fallback:', error);

            const stressors: Array<{ name: string; value: string; description: string }> = [];
            const boosters: Array<{ name: string; value: string; description: string }> = [];

            const sleep = params.sleep_hours;
            if (sleep < 5) {
                stressors.push({
                    name: 'Tidur Kurang',
                    value: `${sleep.toFixed(1)} jam`,
                    description: 'Kurang tidur di bawah 5 jam sangat memicu kelelahan fisik dan mental.',
                });
            } else if (sleep >= 7 && sleep <= 9) {
                boosters.push({
                    name: 'Tidur Cukup',
                    value: `${sleep.toFixed(1)} jam`,
                    description: 'Durasi tidur yang cukup (7-9 jam) mendukung fungsi kognitif yang optimal.',
                });
            }

            const activity = params.activity_level.toUpperCase();
            if (activity === 'NONE') {
                stressors.push({
                    name: 'Kurang Aktivitas',
                    value: 'Tidak ada',
                    description: 'Kurangnya aktivitas fisik dapat membuat tubuh terasa lemas dan menurunkan suasana hati.',
                });
            } else if (activity === 'HIGH' || activity === 'MODERATE') {
                boosters.push({
                    name: 'Aktivitas Fisik',
                    value: activity,
                    description: 'Aktivitas fisik yang aktif membantu melepaskan ketegangan dan meningkatkan mood.',
                });
            }

            const study = params.study_hours;
            if (study > 6) {
                stressors.push({
                    name: 'Belajar Berlebihan',
                    value: `${study.toFixed(1)} jam`,
                    description: 'Belajar terlalu lama dapat menyebabkan burnout dan kelelahan mental.',
                });
            } else if (study >= 3 && study <= 6) {
                boosters.push({
                    name: 'Belajar Produktif',
                    value: `${study.toFixed(1)} jam`,
                    description: 'Durasi belajar yang seimbang membantu performa akademik tanpa memicu burnout.',
                });
            }

            const social = params.social_score;
            if (social <= 3) {
                stressors.push({
                    name: 'Isolasi Sosial',
                    value: `${social}/10`,
                    description: 'Kurangnya interaksi sosial dapat mengurangi rasa terhubung dan dukungan moral.',
                });
            } else if (social >= 7) {
                boosters.push({
                    name: 'Sosialisasi Baik',
                    value: `${social}/10`,
                    description: 'Interaksi sosial yang positif memperkuat dukungan sosial dan meningkatkan mood.',
                });
            }

            const feeling = params.how_you_feeling.toUpperCase();
            if (feeling === 'STRESS' || feeling === 'VERY_STRESS') {
                stressors.push({
                    name: 'Kondisi Emosional',
                    value: feeling,
                    description: 'Perasaan stres atau cemas yang dirasakan secara langsung memengaruhi energi harian.',
                });
            } else if (feeling === 'HAPPY' || feeling === 'VERY_HAPPY') {
                boosters.push({
                    name: 'Kondisi Emosional',
                    value: feeling,
                    description: 'Suasana hati yang bahagia memberikan motivasi ekstra untuk beraktivitas.',
                });
            }

            // Fallback default elements if both lists are empty
            if (stressors.length === 0 && boosters.length === 0) {
                boosters.push({
                    name: 'Kondisi Umum',
                    value: 'Stabil',
                    description: 'Secara umum kondisi fisik dan mental Anda berada dalam kondisi seimbang.',
                });
            }

            return { stressors, boosters };
        }
    }

    async getForecast(params: {
        weekly_trend: Array<{ date: string; average_mood: number }>;
        average_mood: number;
        sleep_quality: number;
        check_in_streak: number;
        latest_mood: string | null;
    }): Promise<MoodForecast> {
        try {
            const response = await fetch(`${this.apiUrl}/api/v1/forecast`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });

            if (!response.ok) {
                throw new Error(`ML API returned status ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('ML Forecast request failed, utilizing rule-based fallback:', error);

            // Rule-based fallback: simple projection based on trend direction
            const trend = params.weekly_trend;
            const scores = trend.map((p) => p.average_mood);
            const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
            const secondHalf = scores.slice(Math.floor(scores.length / 2));
            const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
            const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
            const direction = secondAvg > firstAvg + 0.3 ? 'meningkat' : secondAvg < firstAvg - 0.3 ? 'menurun' : 'stabil';

            const lastScore = scores[scores.length - 1] || params.average_mood;
            const forecasts = [];
            const today = new Date();

            for (let i = 1; i <= 5; i++) {
                const adjustment = direction === 'meningkat' ? 0.3 * i : direction === 'menurun' ? -0.3 * i : 0;
                const predicted = Math.max(1, Math.min(10, lastScore + adjustment));
                const futureDate = new Date(today);
                futureDate.setDate(today.getDate() + i);

                const dayLabels = ['Besok', 'Lusa', '3 Hari Lagi', '4 Hari Lagi', '5 Hari Lagi'];
                let label = 'Biasa';
                if (predicted <= 2.5) label = 'Buruk';
                else if (predicted <= 4.5) label = 'Kurang';
                else if (predicted <= 6.5) label = 'Biasa';
                else if (predicted <= 8.5) label = 'Baik';
                else label = 'Luar Biasa';

                forecasts.push({
                    day: dayLabels[i - 1],
                    date: futureDate.toISOString().slice(0, 10),
                    predicted_mood: parseFloat(predicted.toFixed(1)),
                    label,
                    confidence: Math.max(0.3, 0.9 - (i - 1) * 0.12),
                });
            }

            return {
                forecasts,
                trend_direction: direction,
                trend_analysis: direction === 'meningkat'
                    ? 'Tren mood menunjukkan peningkatan. Pertahankan kebiasaan baik yang sudah berjalan.'
                    : direction === 'menurun'
                    ? 'Tren mood menunjukkan sedikit penurunan. Ini saat yang tepat untuk memberi perhatian ekstra pada istirahat dan aktivitas positif.'
                    : 'Tren mood cenderung stabil. Konsistensi adalah kunci untuk menjaga keseimbangan.',
                prevention_tips: direction === 'menurun'
                    ? ['Tidur minimal 7 jam malam ini untuk stabilkan mood besok.', 'Luangkan 10 menit untuk aktivitas yang kamu nikmati.', 'Bicarakan perasaanmu dengan teman atau keluarga.']
                    : [],
                boost_tips: direction !== 'menurun'
                    ? ['Pertahankan rutinitas tidur yang konsisten.', 'Lanjutkan check-in harian untuk memantau perubahan.', 'Tambahkan aktivitas fisik ringan untuk menjaga endorfin.']
                    : [],
            };
        }
    }
}

