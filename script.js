// Initialize feather icons
feather.replace();

// Data warna untuk Chart.js
const backgroundColors = ['#3B82F6', '#8B5CF6', '#10B981', '#EF4444', '#F59E0B', '#EC4899', '#14B8A6', '#F97316'];

// Data Kelas (ID, Hari, Waktu, SKS, Warna)
const classData = [
    { id: "KALKULUS", day_id: "Sabtu", day_en: "Saturday", time: "12:50-14:30", credits: 3, color: "orange" },
    { id: "TEKNOLOGI INFORMASI", day_id: "Rabu", day_en: "Wednesday", time: "10:00-11:40", credits: 3, color: "blue" },
    { id: "ALGORITMA", day_id: "Jumat", day_en: "Friday", time: "13:00-14:40", credits: 3, color: "red" },
    { id: "PENDIDIKAN AGAMA", day_id: "Sabtu", day_en: "Saturday", time: "11:50-12:40", credits: 1, color: "teal" },
    { id: "BAHASA INDONESIA", day_id: "Rabu", day_en: "Wednesday", time: "14:30-16:10", credits: 2, color: "green" },
    { id: "KOMUNIKASI DIGITAL", day_id: "Sabtu", day_en: "Saturday", time: "08:00-09:40", credits: 3, color: "pink" },
    { id: "KECERDASAN EMOSIONAL", day_id: "Rabu", day_en: "Wednesday", time: "12:30-14:10", credits: 2, color: "purple" },
    { id: "B.INGGRIS 1", day_id: "Jumat", day_en: "Friday", time: "15:00-16:40", credits: 2, color: "yellow" }
];

// Data Terjemahan
const translations = {
    'KALKULUS': { id: 'KALKULUS', en: 'CALCULUS' },
    'TEKNOLOGI INFORMASI': { id: 'TEKNOLOGI INFORMASI', en: 'INFORMATION TECHNOLOGY' },
    'ALGORITMA': { id: 'ALGORITMA', en: 'ALGORITHM' },
    'PENDIDIKAN AGAMA': { id: 'PENDIDIKAN AGAMA', en: 'RELIGIOUS EDUCATION' },
    'BAHASA INDONESIA': { id: 'BAHASA INDONESIA', en: 'INDONESIAN LANGUAGE' },
    'KOMUNIKASI DIGITAL': { id: 'KOMUNIKASI DIGITAL', en: 'DIGITAL COMMUNICATION' },
    'KECERDASAN EMOSIONAL': { id: 'KECERDASAN EMOSIONAL', en: 'EMOTIONAL INTELLIGENCE' },
    'B.INGGRIS 1': { id: 'B.INGGRIS 1', en: 'ENGLISH 1' },
    'SKS': { id: 'SKS', en: 'Credits' },
    'Rabu': { id: 'Rabu', en: 'Wednesday' },
    'Jumat': { id: 'Jumat', en: 'Friday' },
    'Sabtu': { id: 'Sabtu', en: 'Saturday' }
};

// Variabel dan Kontainer DOM
let currentLang = document.getElementById('lang-toggle').getAttribute('data-current-lang');
const classListContainer = document.getElementById('class-list-container');
const legendListContainer = document.getElementById('legend-list');


// --- CHART INITIALIZATION FUNCTION ---

function initializeChart() {
    const currentLang = document.getElementById('lang-toggle').getAttribute('data-current-lang');
    const initialChartLabels = classData.map(cls => translations[cls.id][currentLang]);
    const chartDataValues = classData.map(cls => cls.credits);

    const ctx = document.getElementById('creditChart').getContext('2d');
    
    // Determine the text color based on the current theme class
    const chartTextColor = document.body.classList.contains('dark-theme') ? '#cbd5e1' : '#475569';

    // Destroy existing chart if it exists to prevent memory leaks and ghosting
    if (window.creditChart) {
        window.creditChart.destroy();
    }

    window.creditChart = new Chart(ctx, { 
        type: 'doughnut',
        data: {
            labels: initialChartLabels,
            datasets: [{
                data: chartDataValues,
                backgroundColor: backgroundColors,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: { 
                        boxWidth: 10, 
                        padding: 15, 
                        font: { size: 12 },
                        color: chartTextColor // Set label color based on theme
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const sksLabel = document.getElementById('lang-toggle').getAttribute('data-current-lang') === 'en' ? 'Credits' : 'SKS';
                            return `${context.label}: ${context.raw} ${sksLabel}`;
                        }
                    }
                }
            },
            cutout: '65%'
        }
    });
}


// --- FUNGSI JADWAL BULANAN ---

function generateMonthlySchedule(lang) {
    const container = document.getElementById('monthly-schedule-list');
    container.innerHTML = '';
    
    // Tentukan tanggal mulai spesifik: Rabu, 8 Oktober 2025.
    const startDate = new Date(2025, 9, 8); 

    // Offset Hari dari HARI RABU (Hari ke-3 dalam seminggu)
    const dayOffset = { 
        "Rabu": 0,    // Rabu ke Rabu (8 Okt) = 0 hari
        "Jumat": 2,   // Rabu ke Jumat = 2 hari
        "Sabtu": 3    // Rabu ke Sabtu = 3 hari
    }; 
    const maxWeeks = 4; // Target 1 bulan
    
    // Urutkan data kelas berdasarkan offset hari dan jam
    const sortedClassData = [...classData].sort((a, b) => {
        const timeA = parseInt(a.time.split('-')[0].replace(':', ''));
        const timeB = parseInt(b.time.split('-')[0].replace(':', ''));
        if (dayOffset[a.day_id] !== dayOffset[b.day_id]) {
            return dayOffset[a.day_id] - dayOffset[b.day_id];
        }
        return timeA - timeB;
    });

    for (let week = 0; week < maxWeeks; week++) {
        
        let weekStart = new Date(startDate);
        weekStart.setDate(startDate.getDate() + (week * 7));
        
        const weekHeader = document.createElement('div');
        weekHeader.className = 'text-center font-bold text-indigo-700 bg-indigo-50 p-2 rounded-lg mt-4 shadow-sm';
        const weekNumber = lang === 'en' ? `Week ${week + 1}` : `Minggu ${week + 1}`;
        weekHeader.textContent = weekNumber;
        container.appendChild(weekHeader);

        sortedClassData.forEach(cls => {
            
            const daysToAdd = dayOffset[cls.day_id]; 
            let classDate = new Date(weekStart);
            
            classDate.setDate(weekStart.getDate() + daysToAdd);

            const dateOptions = { day: 'numeric', month: lang === 'en' ? 'short' : 'long', year: 'numeric' };
            const formattedDate = classDate.toLocaleDateString(lang === 'en' ? 'en-US' : 'id-ID', dateOptions);

            const name = translations[cls.id] ? translations[cls.id][lang] : cls.id;
            const day = translations[cls.day_id] ? translations[cls.day_id][lang] : cls.day_id;
            const sksLabel = lang === 'en' ? 'Credits' : 'SKS';

            const card = document.createElement('div');
            card.className = `schedule-card bg-${cls.color}-50 border-l-4 border-${cls.color}-600 p-3 rounded-lg transition-all duration-300 shadow-sm flex justify-between items-center`;
            card.innerHTML = `
                <div class="flex items-center space-x-3">
                    <span class="font-bold text-gray-800 w-24">${formattedDate}</span>
                    <div>
                        <h4 class="font-bold text-${cls.color}-800 text-base">${name}</h4>
                        <div class="text-sm text-gray-600">${day} • ${cls.time}</div>
                    </div>
                </div>
                <span class="text-${cls.color}-800 text-xs font-semibold">${cls.credits} ${sksLabel}</span>
            `;
            container.appendChild(card);
        });
    }
}


// --- FUNGSI GENERATE KARTU DAN LEGEND (Klasik) ---

function generateLegend(lang) {
    legendListContainer.innerHTML = '';
    classData.forEach(cls => {
        const name = translations[cls.id] ? translations[cls.id][lang] : cls.id;
        const sksLabel = lang === 'en' ? 'Credits' : 'SKS';
        const div = document.createElement('div');
        div.className = 'flex items-center';
        div.innerHTML = `
            <div class="w-4 h-4 bg-${cls.color}-600 rounded mr-3 shadow-md"></div>
            <span class="text-sm text-gray-700">${name} (${cls.credits} ${sksLabel})</span>
        `;
        legendListContainer.appendChild(div);
    });
}

function generateClassCards(lang) {
    classListContainer.innerHTML = '';
    const dayOrder = { "Rabu": 1, "Jumat": 2, "Sabtu": 3 };
    
    const sortedClasses = [...classData].sort((a, b) => {
        const timeA = parseInt(a.time.split('-')[0].replace(':', ''));
        const timeB = parseInt(b.time.split('-')[0].replace(':', ''));
        
        if (dayOrder[a.day_id] !== dayOrder[b.day_id]) {
            return dayOrder[a.day_id] - dayOrder[b.day_id];
        }
        return timeA - timeB;
    });
    
    sortedClasses.forEach(cls => {
        const name = translations[cls.id] ? translations[cls.id][lang] : cls.id;
        const day = translations[cls.day_id] ? translations[cls.day_id][lang] : cls.day_id;
        const sksLabel = lang === 'en' ? 'Credits' : 'SKS';

        const card = document.createElement('div');
        card.className = `schedule-card bg-${cls.color}-50 border-l-4 border-${cls.color}-600 p-4 rounded-xl transition-all duration-300 shadow-md`;
        card.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="font-bold text-${cls.color}-800 text-lg">${name}</h3>
                    <div class="flex items-center mt-1 text-base text-gray-600">
                        <i data-feather="calendar" class="w-4 h-4 mr-2"></i>
                        <span>${day} • ${cls.time}</span>
                    </div>
                </div>
                <span class="bg-${cls.color}-200 text-${cls.color}-800 text-sm font-semibold px-3 py-1 rounded-full">${cls.credits} ${sksLabel}</span>
            </div>
        `;
        classListContainer.appendChild(card);
    });
    feather.replace(); 
}


// --- FUNGSI TRANSLASI UTAMA ---

function translatePage(lang) {
    document.querySelectorAll('[data-en]').forEach(el => {
        const translationKey = el.getAttribute(`data-${lang}`);
        if (translationKey) {
            el.textContent = translationKey;
        }
    });

    document.querySelectorAll('.time-slot > div:first-child').forEach(el => {
        const translationKey = el.getAttribute(`data-${lang}`);
        if (translationKey) {
            el.textContent = translationKey;
        }
    });

    document.querySelectorAll('.day-header').forEach(el => {
        const translationKey = el.getAttribute(`data-${lang}`);
        if (translationKey) {
            el.textContent = translationKey;
        }
    });

    generateClassCards(lang);
    generateLegend(lang);
    generateMonthlySchedule(lang); 
    currentLang = lang;
}


// --- DOM CONTENT LOADED & THEME LOGIC ---

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const langToggle = document.getElementById('lang-toggle');

    // 1. Theme Logic (Persistent)
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-theme');
            themeIcon.setAttribute('data-feather', 'sun');
        } else {
            body.classList.remove('dark-theme');
            themeIcon.setAttribute('data-feather', 'moon');
        }
        feather.replace();
        // Re-initialize chart to update label colors
        initializeChart();
    };

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }

    // 2. Theme Toggle Handler
    themeToggle.addEventListener('click', () => {
        const newTheme = body.classList.contains('dark-theme') ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });

    // 3. Language Toggle Handler
    langToggle.addEventListener('click', () => {
        const newLang = langToggle.getAttribute('data-current-lang') === 'id' ? 'en' : 'id';
        translatePage(newLang);
        langToggle.setAttribute('data-current-lang', newLang);
    });

    // 4. Initial content setup (must happen after theme logic)
    translatePage(langToggle.getAttribute('data-current-lang'));

    // 5. Add hover effects to time slots
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.addEventListener('mouseenter', () => {
            slot.style.boxShadow = '0 10px 20px -5px rgba(0, 0, 0, 0.2)';
        });
        slot.addEventListener('mouseleave', () => {
            slot.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.08)';
        });
    });
});