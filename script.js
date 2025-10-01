// Initialize feather icons
feather.replace();

// Data warna untuk Chart.js
const backgroundColors = ['#3B82F6', '#8B5CF6', '#10B981', '#EF4444', '#F59E0B', '#EC4899', '#14B8A6', '#F97316'];

// Data Kelas (ID, Hari, Waktu, SKS, Warna)
const classData = [
    { id: "KALKULUS", name: "KALKULUS", day: "Sabtu", time: "12:50-14:30", credits: 3, color: "orange" },
    { id: "TEKNOLOGI INFORMASI", name: "TEKNOLOGI INFORMASI", day: "Rabu", time: "10:00-11:40", credits: 3, color: "blue" },
    { id: "ALGORITMA", name: "ALGORITMA", day: "Jumat", time: "13:00-14:40", credits: 3, color: "red" },
    { id: "PENDIDIKAN AGAMA", name: "PENDIDIKAN AGAMA", day: "Sabtu", time: "11:50-12:40", credits: 1, color: "teal" },
    { id: "BAHASA INDONESIA", name: "BAHASA INDONESIA", day: "Rabu", time: "14:30-16:10", credits: 2, color: "green" },
    { id: "KOMUNIKASI DIGITAL", name: "KOMUNIKASI DIGITAL", day: "Sabtu", time: "08:00-09:40", credits: 3, color: "pink" },
    { id: "KECERDASAN EMOSIONAL", name: "KECERDASAN EMOSIONAL", day: "Rabu", time: "12:30-14:10", credits: 2, color: "purple" },
    { id: "B.INGGRIS 1", name: "B.INGGRIS 1", day: "Jumat", time: "15:00-16:40", credits: 2, color: "yellow" }
];

// Variabel dan Kontainer DOM
const classListContainer = document.getElementById('class-list-container');
const legendListContainer = document.getElementById('legend-list');

// --- FUNGSI GENERATE KARTU DAN LEGEND ---

function generateLegend() {
    legendListContainer.innerHTML = '';
    classData.forEach(cls => {
        const div = document.createElement('div');
        div.className = 'flex items-center';
        div.innerHTML = `
            <div class="w-4 h-4 bg-${cls.color}-600 rounded mr-3 shadow-md"></div>
            <span class="text-sm text-gray-700">${cls.name} (${cls.credits} SKS)</span>
        `;
        legendListContainer.appendChild(div);
    });
}

function generateClassCards() {
    classListContainer.innerHTML = '';
    const dayOrder = { "Rabu": 1, "Jumat": 2, "Sabtu": 3 };
    
    // Sort classes by day and then by time
    const sortedClasses = [...classData].sort((a, b) => {
        const timeA = parseInt(a.time.split('-')[0].replace(':', ''));
        const timeB = parseInt(b.time.split('-')[0].replace(':', ''));
        
        if (dayOrder[a.day] !== dayOrder[b.day]) {
            return dayOrder[a.day] - dayOrder[b.day];
        }
        return timeA - timeB;
    });
    
    sortedClasses.forEach(cls => {
        const card = document.createElement('div');
        card.className = `schedule-card bg-${cls.color}-50 border-l-4 border-${cls.color}-600 p-4 rounded-xl transition-all duration-300 shadow-md`;
        card.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="font-bold text-${cls.color}-800 text-lg">${cls.name}</h3>
                    <div class="flex items-center mt-1 text-base text-gray-600">
                        <i data-feather="calendar" class="w-4 h-4 mr-2"></i>
                        <span>${cls.day} • ${cls.time}</span>
                    </div>
                </div>
                <span class="bg-${cls.color}-200 text-${cls.color}-800 text-sm font-semibold px-3 py-1 rounded-full">${cls.credits} SKS</span>
            </div>
        `;
        classListContainer.appendChild(card);
    });
    feather.replace(); 
}

// --- INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Generate lists and legend
    generateClassCards();
    generateLegend();
    
    // 2. Initialize chart data
    const chartLabels = classData.map(cls => cls.name);
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
                }
            },
            cutout: '65%'
        }
    });

    // 3. Add hover effects to time slots
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.addEventListener('mouseenter', () => {
            slot.style.boxShadow = '0 10px 20px -5px rgba(0, 0, 0, 0.2)';
        });
        slot.addEventListener('mouseleave', () => {
            slot.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.08)';
        });
    });
});