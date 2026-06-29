import fs from 'fs';
import path from 'path';

const appCode = fs.readFileSync('src/App.tsx', 'utf-8');

// Extract products data
const productsMatch = appCode.match(/const products = \[\s*([\s\S]*?)\s*\];/);
const productsStr = productsMatch ? `[${productsMatch[1]}]` : '[]';

const elderlyMatch = appCode.match(/const elderlyProducts = \[\s*([\s\S]*?)\s*\];/);
const elderlyStr = elderlyMatch ? `[${elderlyMatch[1]}]` : '[]';

const carsMatch = appCode.match(/const carProducts = \[\s*([\s\S]*?)\s*\];/);
const carsStr = carsMatch ? `[${carsMatch[1]}]` : '[]';

// Extract CSS
const cssCode = fs.readFileSync('dist/assets/index-DH3YMKRN.css', 'utf-8');

const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CH-FILTER</title>
    <style>
        ${cssCode}
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #FFFFF0; margin: 0; padding: 0; }
        .page { display: none; }
        .active-page { display: block; }
    </style>
</head>
<body class="bg-[#FFFFF0] min-h-screen flex flex-col font-sans">
    <div id="app"></div>
    <script>
        const products = ${productsStr};
        const elderlyProducts = ${elderlyStr};
        const carProducts = ${carsStr};

        let activeTab = 'home';
        let productImages = {};

        function chunkArray(arr, size) {
            const chunked = [];
            for (let i = 0; i < arr.length; i += size) {
                chunked.push(arr.slice(i, i + size));
            }
            return chunked;
        }

        function handleImageUpload(id, input) {
            const file = input.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    productImages[id] = e.target.result;
                    render();
                };
                reader.readAsDataURL(file);
            }
        }

        function exportPDF() {
            window.print();
        }

        function share() {
            if (navigator.share) {
                navigator.share({
                    title: 'مجلة الصحة والتوافق الزوجي',
                    text: 'دليلك لاختيارات آمنة، مبتكرة، ومثبتة الفعالية',
                    url: window.location.href,
                }).catch(console.error);
            } else {
                alert('عذراً، متصفحك لا يدعم خاصية المشاركة المباشرة.');
            }
        }

        function setTab(tab) {
            if (tab === 'health') {
                document.getElementById('passwordModal').style.display = 'flex';
            } else {
                activeTab = tab;
                render();
            }
        }

        function submitPassword(e) {
            e.preventDefault();
            const val = document.getElementById('passwordInput').value;
            if (val === '*12*') {
                activeTab = 'health';
                closePasswordModal();
                render();
            } else {
                document.getElementById('passwordError').style.display = 'block';
                document.getElementById('passwordInput').classList.add('border-rose-500');
            }
        }

        function closePasswordModal() {
            document.getElementById('passwordModal').style.display = 'none';
            document.getElementById('passwordInput').value = '';
            document.getElementById('passwordError').style.display = 'none';
            document.getElementById('passwordInput').classList.remove('border-rose-500');
        }

        window.render = function() {
            const app = document.getElementById('app');
            let content = '';

            content += \`
                <nav class="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 shadow-sm print:hidden">
                    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                        <div class="font-serif font-black text-2xl text-[#0A192F] tracking-widest" dir="ltr">
                            CH-FILTER
                        </div>
                        <div class="flex items-center gap-3">
                            <button onclick="setTab('home')" class="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all \${activeTab === 'home' ? 'bg-[#0A192F] text-white' : 'text-[#0A192F]'}">الرئيسية</button>
                            <button onclick="setTab('health')" class="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all border-2 \${activeTab === 'health' ? 'bg-rose-500 text-white border-rose-500' : 'text-rose-500 border-rose-500'}">الصحة والتوافق</button>
                            <button onclick="setTab('elderly')" class="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all border-2 \${activeTab === 'elderly' ? 'bg-emerald-600 text-white border-emerald-600' : 'text-emerald-600 border-emerald-600'}">بر الوالدين</button>
                            <button onclick="setTab('cars')" class="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all border-2 \${activeTab === 'cars' ? 'bg-blue-600 text-white border-blue-600' : 'text-blue-600 border-blue-600'}">قسم سيارات</button>
                        </div>
                    </div>
                </nav>
            \`;

            if (activeTab === 'home') {
                content += \`
                    <div class="flex-1 flex flex-col bg-[#FFFFF0] print:hidden">
                        <header class="relative bg-[#0A192F] text-white overflow-hidden py-24 px-6 rounded-b-[3rem] shadow-xl">
                            <div class="max-w-4xl mx-auto text-center relative z-10">
                                <h1 class="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight" style="font-family: serif;">مجلة الصحة<br/><span class="text-[#D4AF37]">والتوافق الزوجي</span></h1>
                                <p class="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">دليلك الموثوق لاختيارات آمنة، مبتكرة، ومثبتة الفعالية.</p>
                            </div>
                        </header>
                    </div>
                \`;
            }

            app.innerHTML = content;
        }

        window.render();
    </script>
</body>
</html>\`;

fs.writeFileSync('/app/applet/dist/vanilla.html', html);
