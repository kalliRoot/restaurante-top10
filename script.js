document.addEventListener('DOMContentLoaded', () => {
    
    // --- NAVEGAÇÃO SPA (SINGLE PAGE APPLICATION) ---
    window.navigateTo = function(sectionId) {
        // Encontra todas as seções e remove a classe ativa
        document.querySelectorAll('.doc-section').forEach(section => {
            section.classList.remove('active');
        });

        // Ativa a seção solicitada
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Atualiza estado do menu lateral
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if(item.getAttribute('href') === `#${sectionId}`) {
                item.classList.add('active');
                
                // Atualiza breadcrumb dinamicamente
                const cleanText = item.textContent.trim();
                document.getElementById('current-crumb').textContent = cleanText;
            }
        });

        // Rola suavemente para o topo do conteúdo
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Fecha a sidebar em dispositivos móveis após clicar
        if (window.innerWidth <= 768) {
            document.getElementById('sidebar').classList.remove('active');
        }
    };

    // Monitora rota via Hash na URL (permite links diretos ex: site.com/#whatsapp)
    function checkHashRoute() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            navigateTo(hash);
        } else {
            navigateTo('inicio');
        }
    }
    window.addEventListener('hashchange', checkHashRoute);
    checkHashRoute(); // Executa no carregamento inicial

    // --- CONTROLE DA SIDEBAR RESPONSIVA ---
    const toggleSidebarBtn = document.getElementById('toggle-sidebar');
    const sidebar = document.getElementById('sidebar');
    const contentArea = document.querySelector('.content-area');

    toggleSidebarBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle('active');
        } else {
            sidebar.classList.toggle('collapsed');
            contentArea.classList.toggle('expanded');
        }
    });

    // Fecha ao clicar fora (Mobile)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && !sidebar.contains(e.target) && e.target !== toggleSidebarBtn) {
            sidebar.classList.remove('active');
        }
    });

    // --- SISTEMA DE PESQUISA EM TEMPO REAL INTEGREGADA ---
    const searchInput = document.getElementById('search-input');
    const searchCountBadge = document.getElementById('search-results-count');
    const allDocSections = document.querySelectorAll('.doc-section');

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            searchCountBadge.style.display = 'none';
            // Restaura visual padrão baseado na rota hash atual
            checkHashRoute();
            removeHighlights();
            return;
        }

        let totalMatches = 0;

        allDocSections.forEach(section => {
            const sectionText = section.textContent.toLowerCase();
            
            if (sectionText.includes(searchTerm)) {
                section.classList.add('active'); // Força visibilidade das seções com termos achados
                totalMatches++;
            } else {
                section.classList.remove('active');
            }
        });

        // Mostra o contador global de seções correspondentes
        if (totalMatches > 0) {
            searchCountBadge.textContent = `${totalMatches} enc.`;
            searchCountBadge.style.display = 'block';
        } else {
            searchCountBadge.textContent = '0';
            searchCountBadge.style.display = 'block';
        }
    });

    function removeHighlights() {
        // Remove tags de marcação antigas se necessário expandir para highlight avançado de texto interno
    }

    // --- INTERATIVIDADE DO FAQ (ACCORDION) ---
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const currentItem = question.parentElement;
            const isOpen = currentItem.classList.contains('open');
            
            // Fecha todos os FAQs abertos para efeito limpo estilo Stripe
            document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('open'));
            
            if (!isOpen) {
                currentItem.classList.add('open');
            }
        });
    });

    // --- MODO ESCURO / MODO CLARO ---
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Checa preferência salva
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    // --- BOTÃO VOLTAR AO TOPO & NAVEGAÇÃO SUAVE ---
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});