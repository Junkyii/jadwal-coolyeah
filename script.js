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

// --- FUNGSI JADWAL BULANAN ---

function generateMonthlySchedule(lang) {
    const container = document.getElementById('monthly-schedule-list');
    container.innerHTML = '';
    
    // Tentukan hari ini dan hari Rabu terdekat sebagai awal jadwal
    const today = new Date();
    let startDate = new Date(today);
    // Atur startDate ke hari Rabu terdekat (kode hari 3)
    startDate.setDate(today.getDate() - today.getDay() + 3); 
    if (startDate < today) {
        startDate.setDate(startDate.getDate() + 7); // Jika Rabu sudah lewat, mulai Rabu minggu depan
    }

    const dayOrder = { "Rabu": 1, "Jumat": 2, "Sabtu": 3 };
    const maxWeeks = 4; // Target 1 bulan
    
    // Urutkan data kelas berdasarkan hari dan jam
    const sortedClassData = [...classData].sort((a, b) => {
        const timeA = parseInt(a.time.split('-')[0].replace(':', ''));
        const timeB = parseInt(b.time.split('-')[0].replace(':', ''));
        if (dayOrder[a.day_id] !== dayOrder[b.day_id]) {
            return dayOrder[a.day_id] - dayOrder[b.day_id];
        }
        return timeA - timeB;
    });

    for (let week = 0; week < maxWeeks; week++) {
        let weekStart = new Date(startDate);
        weekStart.setDate(startDate.getDate() + (week * 7));
        
        // Buat header untuk setiap minggu
        const weekHeader = document.createElement('div');
        weekHeader.className = 'text-center font-bold text-indigo-700 bg-indigo-50 p-2 rounded-lg mt-4 shadow-sm';
        const weekNumber = lang === 'en' ? `Week ${week + 1}` : `Minggu ${week + 1}`;
        weekHeader.textContent = weekNumber;
        container.appendChild(weekHeader);

        // Tambahkan kelas untuk minggu ini
        sortedClassData.forEach(cls => {
            // Hari Rabu=1, Jumat=2, Sabtu=3. (Mengacu pada sorted data)
            const classDayCode = dayOrder[cls.day_id]; 
            let classDate = new Date(weekStart);
            
            // Hitung tanggal sebenarnya (0=Rabu, 2=Jumat, 3=Sabtu dari hari Rabu)
            const daysToAdd = classDayCode - 1; 
            classDate.setDate(weekStart.getDate() + daysToAdd);

            // Format tanggal: DD MMMM YYYY
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
    
    // Sort classes by day and then by time
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
    // Translate static elements using data- attributes
    document.querySelectorAll('[data-en]').forEach(el => {
        const translationKey = el.getAttribute(`data-${lang}`);
        if (translationKey) {
            el.textContent = translationKey;
        }
    });

    // Translate schedule blocks 
    document.querySelectorAll('.time-slot > div:first-child').forEach(el => {
        const translationKey = el.getAttribute(`data-${lang}`);
        if (translationKey) {
            el.textContent = translationKey;
        }
    });

    // Translate day headers
    document.querySelectorAll('.day-header').forEach(el => {
        const translationKey = el.getAttribute(`data-${lang}`);
        if (translationKey) {
            el.textContent = translationKey;
        }
    });

    // Re-generate lists and monthly schedule
    generateClassCards(lang);
    generateLegend(lang);
    generateMonthlySchedule(lang); 
    currentLang = lang;
    
    // Update chart
    if (window.creditChart) {
        const newLabels = classData.map(cls => translations[cls.id][lang]);
        window.creditChart.data.labels = newLabels;
        window.creditChart.options.plugins.tooltip.callbacks.label = function(context) {
            const sksLabel = currentLang === 'en' ? 'Credits' : 'SKS';
            return `${context.label}: ${context.raw} ${sksLabel}`;
        };
        window.creditChart.update();
    }
}

// --- EVENT LISTENERS & INIITALIZERS ---

// Language Toggle Handler
document.getElementById('lang-toggle').addEventListener('click', () => {
    const newLang = currentLang === 'id' ? 'en' : 'id';
    translatePage(newLang);
    document.getElementById('lang-toggle').setAttribute('data-current-lang', newLang);
});

// Initialize chart data
const initialChartLabels = classData.map(cls => translations[cls.id][currentLang]);
const chartDataValues = classData.map(cls => cls.credits);

const ctx = document.getElementById('creditChart').getContext('2d');
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
                labels: { boxWidth: 10, padding: 15, font: { size: 12 } }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const sksLabel = currentLang === 'en' ? 'Credits' : 'SKS';
                        return `${context.label}: ${context.raw} ${sksLabel}`;
                    }
                }
            }
        },
        cutout: '65%'
    }
});

// Initial setup
translatePage(currentLang);

// Add hover effects to time slots (for the fixed elements in index.html)
document.querySelectorAll('.time-slot').forEach(slot => {
    slot.addEventListener('mouseenter', () => {
        slot.style.boxShadow = '0 10px 20px -5px rgba(0, 0, 0, 0.2)';
    });
    slot.addEventListener('mouseleave', () => {
        slot.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.05)';
    });
});