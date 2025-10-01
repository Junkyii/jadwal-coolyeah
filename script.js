// Initialize feather icons
feather.replace();

// Data warna untuk Chart.js
const backgroundColors = ['#3B82F6', '#8B5CF6', '#10B981', '#EF4444', '#F59E0B', '#EC4899', '#14B8A6', '#F97316'];

// Data Kelas (Nama & Hari dalam ID/EN)
const classData = [
    { id: "KALKULUS", name_id: "KALKULUS", name_en: "CALCULUS", day_id: "Sabtu", day_en: "Saturday", time: "12:50-14:30", credits: 3, color: "orange" },
    { id: "TEKNOLOGI INFORMASI", name_id: "TEKNOLOGI INFORMASI", name_en: "INFORMATION TECHNOLOGY", day_id: "Rabu", day_en: "Wednesday", time: "10:00-11:40", credits: 3, color: "blue" },
    { id: "ALGORITMA", name_id: "ALGORITMA", name_en: "ALGORITHM", day_id: "Jumat", day_en: "Friday", time: "13:00-14:40", credits: 3, color: "red" },
    { id: "PENDIDIKAN AGAMA", name_id: "PENDIDIKAN AGAMA", name_en: "RELIGIOUS EDUCATION", day_id: "Sabtu", day_en: "Saturday", time: "11:50-12:40", credits: 1, color: "teal" },
    { id: "BAHASA INDONESIA", name_id: "BAHASA INDONESIA", name_en: "INDONESIAN LANGUAGE", day_id: "Rabu", day_en: "Wednesday", time: "14:30-16:10", credits: 2, color: "green" },
    { id: "KOMUNIKASI DIGITAL", name_id: "KOMUNIKASI DIGITAL", name_en: "DIGITAL COMMUNICATION", day_id: "Sabtu", day_en: "Saturday", time: "08:00-09:40", credits: 3, color: "pink" },
    { id: "KECERDASAN EMOSIONAL", name_id: "KECERDASAN EMOSIONAL", name_en: "EMOTIONAL INTELLIGENCE", day_id: "Rabu", day_en: "Wednesday", time: "12:30-14:10", credits: 2, color: "purple" },
    { id: "B.INGGRIS 1", name_id: "B.INGGRIS 1", name_en: "ENGLISH 1", day_id: "Jumat", day_en: "Friday", time: "15:00-16:40", credits: 2, color: "yellow" }
];

// Data Terjemahan (digunakan untuk elemen statis)
const translations = {
    'SKS': { id: 'SKS', en: 'Credits' },
    'Rabu': { id: 'Rabu', en: 'Wednesday' },
    'Jumat': { id: 'Jumat', en: 'Friday' },
    'Sabtu': { id: 'Sabtu', en: 'Saturday' }
};

// Variabel dan Kontainer DOM
const classListContainer = document.getElementById('class-list-container');
const legendListContainer = document.getElementById('legend-list');

// --- FUNGSI JADWAL BULANAN (TANGGAL AKURAT) ---

function generateMonthlySchedule(lang) {
    const container = document.getElementById('monthly-schedule-list');
    container.innerHTML = '';
    
    // Tentukan tanggal mulai spesifik: Rabu, 8 Oktober 2025.
    const startDate = new Date(2025, 9, 8); 

    // Offset Hari dari HARI RABU
    const dayOffset = { 
        "Rabu": 0,   
        "Jumat": 2,  
        "Sabtu": 3   
    }; 
    const maxWeeks = 4;
    
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

            const nameKey = `name_${lang}`;
            const dayKey = `day_${lang}`;
            const sksLabel = lang === 'en' ? 'Credits' : 'SKS';

            const card = document.createElement('div');
            card.className = `schedule-card bg-${cls.color}-50 border-l-4 border-${cls.color}-600 p-3 rounded-lg transition-all duration-300 shadow-sm flex justify-between items-center`;
            card.innerHTML = `
                <div class="flex items-center space-x-3">
                    <span class="font-bold text-gray-800 w-24">${formattedDate}</span>
                    <div>
                        <h4 class="font-bold text-${cls.color}-800 text-base">${cls[nameKey]}</h4>
                        <div class="text-sm text-gray-600">${cls[dayKey]} • ${cls.time}</div>
                    </div>
                </div>
                <span class="text-${cls.color}-800 text-xs font-semibold">${cls.credits} ${sksLabel}</span>
            `;
            container.appendChild(card);
        });
    }
}


// --- FUNGSI GENERATE KARTU DAN LEGEND ---

function generateLegend(lang) {
    legendListContainer.innerHTML = '';
    const nameKey = `name_${lang}`;
    const sksLabel = lang === 'en' ? 'Credits' : 'SKS';

    classData.forEach(cls => {
        const div = document.createElement('div');
        div.className = 'flex items-center';
        div.innerHTML = `
            <div class="w-4 h-4 bg-${cls.color}-600 rounded mr-3 shadow-md"></div>
            <span class="text-sm text-gray-700">${cls[nameKey]} (${cls.credits} ${sksLabel})</span>
        `;
        legendListContainer.appendChild(div);
    });
}

function generateClassCards(lang) {
    classListContainer.innerHTML = '';
    const dayOrder = { "Rabu": 1, "Jumat": 2, "Sabtu": 3 };
    const nameKey = `name_${lang}`;
    const dayKey = `day_${lang}`;
    const sksLabel = lang === 'en' ? 'Credits' : 'SKS';

    const sortedClasses = [...classData].sort((a, b) => {
        const timeA = parseInt(a.time.split('-')[0].replace(':', ''));
        const timeB = parseInt(b.time.split('-')[0].replace(':', ''));
        
        if (dayOrder[a.day_id] !== dayOrder[b.day_id]) {
            return dayOrder[a.day_id] - dayOrder[b.day_id];
        }
        return timeA - timeB;
    });
    
    sortedClasses.forEach(cls => {
        const card = document.createElement('div');
        card.className = `schedule-card bg-${cls.color}-50 border-l-4 border-${cls.color}-600 p-4 rounded-xl transition-all duration-300 shadow-md`;
        card.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="font-bold text-${cls.color}-800 text-lg">${cls[nameKey]}</h3>
                    <div class="flex items-center mt-1 text-base text-gray-600">
                        <i data-feather="calendar" class="w-4 h-4 mr-2"></i>
                        <span>${cls[dayKey]} • ${cls.time}</span>
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
    const langKey = lang === 'en' ? 'en' : 'id';
    const langOpposite = lang === 'en' ? 'id' : 'en';

    // Translate static header and body elements
    document.querySelectorAll('[data-en]').forEach(el => {
        const translationKey = el.getAttribute(`data-${langKey}`);
        if (translationKey) {
            el.textContent = translationKey;
        }
    });

    // Translate day headers (Rabu/Wednesday, etc.)
    document.querySelectorAll('.day-header').forEach(el => {
        const dayName = el.getAttribute('data-id'); 
        const translation = translations[dayName] ? translations[dayName][langKey] : dayName;
        el.textContent = translation;
    });
    
    // Update language button text
    const langToggle = document.getElementById('lang-toggle');
    langToggle.textContent = `${langOpposite.toUpperCase()} / ${lang.toUpperCase()}`;

    // Update time slot subjects (TEKNOLOGI INFORMASI, etc.)
    document.querySelectorAll('.time-slot > div:first-child').forEach(el => {
        // Ambil ID dari index.html
        const subjectID = el.getAttribute('data-id'); 
        
        const classItem = classData.find(c => c.id === subjectID);
        if (classItem) {
            const subjectName = classItem[`name_${langKey}`];
            el.textContent = subjectName;
        }
    });
    
    // Regenerate dynamic components
    generateClassCards(lang);
    generateLegend(lang);
    generateMonthlySchedule(lang); 
    
    // Update chart
    if (window.creditChart) {
        const chartLabels = classData.map(cls => cls[`name_${lang}`]);
        window.creditChart.data.labels = chartLabels;
        window.creditChart.options.plugins.tooltip.callbacks.label = function(context) {
            const sksLabel = lang === 'en' ? 'Credits' : 'SKS';
            return `${context.label}: ${context.raw} ${sksLabel}`;
        };
        window.creditChart.update();
    }
}


// --- INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
    const langToggle = document.getElementById('lang-toggle');
    const currentLang = langToggle.getAttribute('data-current-lang');

    // 1. Initialize chart data
    const chartLabels = classData.map(cls => cls.name_id);
    const chartDataValues = classData.map(cls => cls.credits);
    const ctx = document.getElementById('creditChart').getContext('2d');
    
    window.creditChart = new Chart(ctx, { 
        type: 'doughnut',
        data: {
            labels: chartLabels,
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
                        color: '#475569' 
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw} SKS`;
                        }
                    }
                },
            },
            cutout: '65%'
        }
    });

    // 2. Language Toggle Handler
    langToggle.addEventListener('click', (e) => {
        const langToggle = e.currentTarget;
        const newLang = langToggle.getAttribute('data-current-lang') === 'id' ? 'en' : 'id';
        translatePage(newLang);
        langToggle.setAttribute('data-current-lang', newLang);
    });

    // 3. Initial content setup
    translatePage(currentLang);
    
    // 4. Add hover effects to time slots
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.addEventListener('mouseenter', () => {
            slot.style.boxShadow = '0 10px 20px -5px rgba(0, 0, 0, 0.2)';
        });
        slot.addEventListener('mouseleave', () => {
            slot.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.08)';
        });
    });
});