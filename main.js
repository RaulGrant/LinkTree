document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Loaded'); // Debug

    // 1. Declaración de variables DOM principales
    const menuToggle = document.getElementById('menuToggle');
    const menuModal = document.getElementById('menuModal');
    const closeModal = document.getElementById('closeModal');
    const contactoButton = document.getElementById('contactoButton');
    const contactModal = document.getElementById('contactModal');
    const shareContactModal = document.getElementById('shareContactModal');
    const shareContactButton = document.getElementById('shareContactButton');
    const linkedinModal = document.getElementById('linkedinModal');
    const instagramModal = document.getElementById('instagramModal');
    const usimecaModal = document.getElementById('usimecaModal');

    // Configurar navegación horizontal en el modal
    if (menuModal) {
        const modalContainer = menuModal.querySelector('.grid');
        const modalLeftButton = menuModal.querySelector('#scrollLeft');
        const modalRightButton = menuModal.querySelector('#scrollRight');

        if (modalContainer && modalLeftButton && modalRightButton) {
            // Función para actualizar visibilidad de flechas del menú principal
            const updateMainArrowsVisibility = () => {
                modalLeftButton.style.display = modalContainer.scrollLeft <= 0 ? 'none' : 'flex';
                modalRightButton.style.display = 
                    modalContainer.scrollLeft >= (modalContainer.scrollWidth - modalContainer.clientWidth) 
                    ? 'none' : 'flex';
            };

            // Inicialmente ocultar flecha izquierda
            modalLeftButton.style.display = 'none';

            // Manejar click en flechas
            modalRightButton.addEventListener('click', () => {
                modalContainer.scrollBy({ left: 200, behavior: 'smooth' });
                updateMainArrowsVisibility();
            });

            modalLeftButton.addEventListener('click', () => {
                modalContainer.scrollBy({ left: -200, behavior: 'smooth' });
                updateMainArrowsVisibility();
            });

            // Actualizar flechas al hacer scroll
            modalContainer.addEventListener('scroll', updateMainArrowsVisibility);

            // Actualizar flechas al cambiar tamaño de ventana
            window.addEventListener('resize', updateMainArrowsVisibility);
        }
    }

    // 2. Función para inicializar controles de scroll
    function initializeScrollControls(modal) {
        if (!modal) return;
        
        const container = modal.querySelector('.shareButtonsContainer');
        const leftButton = modal.querySelector('.scrollLeft');
        const rightButton = modal.querySelector('.scrollRight');

        if (container && leftButton && rightButton) {
            leftButton.style.display = 'none';
            rightButton.style.display = 'flex';

            function updateArrowsVisibility() {
                leftButton.style.display = container.scrollLeft <= 0 ? 'none' : 'flex';
                rightButton.style.display = 
                    container.scrollLeft >= (container.scrollWidth - container.clientWidth) 
                    ? 'none' : 'flex';
            }

            rightButton.addEventListener('click', () => {
                container.scrollBy({ left: 200, behavior: 'smooth' });
                updateArrowsVisibility();
            });

            leftButton.addEventListener('click', () => {
                container.scrollBy({ left: -200, behavior: 'smooth' });
                updateArrowsVisibility();
            });

            container.addEventListener('scroll', updateArrowsVisibility);
            window.addEventListener('resize', updateArrowsVisibility);
            updateArrowsVisibility();
        }
    }

    // 2. Manejador para el botón de menú superior
    if (menuToggle && menuModal) {
        menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Cerrar otros modales primero
            document.querySelectorAll('.fixed').forEach(modal => {
                if (modal !== menuModal) {
                    modal.classList.add('hidden');
                }
            });

            // Alternar el modal de menú
            if (menuModal.classList.contains('hidden')) {
                menuModal.classList.remove('hidden');
                initializeScrollControls(menuModal);
            } else {
                menuModal.classList.add('hidden');
            }
        });

        // Cerrar modal al hacer clic fuera
        menuModal.addEventListener('click', (e) => {
            if (e.target === menuModal) {
                menuModal.classList.add('hidden');
            }
        });

        // Cerrar con el botón X
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                menuModal.classList.add('hidden');
            });
        }
    }

    // 3. Manejador para el botón de contacto
    if (contactoButton) {
        contactoButton.addEventListener('click', (e) => {
            if (e.target.classList.contains('fa-ellipsis-h')) {
                e.preventDefault();
                e.stopPropagation();
                shareContactModal.classList.remove('hidden');
                initializeScrollControls(shareContactModal);
            } else {
                contactModal.classList.remove('hidden');
            }
        });
    }

    // 4. Manejador para el botón de compartir dentro del modal de contacto
    if (shareContactButton) {
        shareContactButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            contactModal.classList.add('hidden');
            shareContactModal.classList.remove('hidden');
            initializeScrollControls(shareContactModal);
        });
    }

    // 5. Manejador para los botones de tres puntos en los links
    document.querySelectorAll('.fa-ellipsis-h').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const link = e.target.closest('a, button');
            if (!link) return;
            
            let modalId;
            if (link.id === 'contactoButton') {
                modalId = 'shareContactModal';
            } else {
                const text = link.querySelector('span')?.textContent.toLowerCase();
                modalId = text ? `${text}Modal` : null;
            }

            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('hidden');
                initializeScrollControls(modal);
            }
        });
    });

    // 6. Manejador para los links principales
    document.querySelectorAll('a[href]').forEach(link => {
        link.addEventListener('click', (e) => {
            if (e.target.classList.contains('fa-ellipsis-h')) return;
            e.preventDefault();
            window.open(link.href, '_blank');
        });
    });

    // 7. Cerrar modales
    document.querySelectorAll('.closeModal').forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.fixed');
            if (modal) modal.classList.add('hidden');
        });
    });

    // 8. Cerrar al hacer clic fuera
    [menuModal, contactModal, shareContactModal, linkedinModal, instagramModal, usimecaModal]
        .filter(modal => modal)
        .forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        });

    // Manejar clics en enlaces
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const clicks = parseInt(localStorage.getItem(link.href) || '0') + 1;
            localStorage.setItem(link.href, clicks);
            console.log(`Clicks en ${link.href}: ${clicks}`);
        });
    });

    // Configurar botones de compartir
    const shareButtons = {
        twitter: menuModal.querySelector('.grid button:nth-child(2)'),    // Botón de X
        facebook: menuModal.querySelector('.grid button:nth-child(3)'),   // Botón de Facebook
        whatsapp: menuModal.querySelector('.grid button:nth-child(4)'),   // Botón de WhatsApp
        linkedin: menuModal.querySelector('.grid button:nth-child(5)'),   // Botón de LinkedIn
        messenger: menuModal.querySelector('.grid button:nth-child(6)'),  // Botón de Messenger
        snapchat: menuModal.querySelector('.grid button:nth-child(7)'),   // Botón de Snapchat
        mail: menuModal.querySelector('.grid button:nth-child(8)'),       // Botón de Mail
        gmail: menuModal.querySelector('.grid button:nth-child(9)'),      // Botón de Gmail
        copy: menuModal.querySelector('.grid button:first-child')         // Botón de copiar
    };

    // Compartir en X (Twitter)
    shareButtons.twitter.addEventListener('click', () => {
        const text = "¡Mira este link!";
        const url = 'http://usimeca.com.mx/vgarciamx';
        const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        window.open(shareUrl, '_blank');
    });

    // Compartir en Facebook
    shareButtons.facebook.addEventListener('click', () => {
        const text = "¡Mira este link!";
        const baseUrl = 'http://usimeca.com.mx/vgarciamx';
        const utmSource = 'utm_source=profile_share';
        const shareUrl = `https://www.facebook.com/dialog/share?app_id=1568667420485931&href=${encodeURIComponent(baseUrl + '?' + utmSource)}&display=popup&quote=${encodeURIComponent(text)}`;
        window.open(shareUrl, '_blank');
    });

    // Compartir en WhatsApp
    shareButtons.whatsapp.addEventListener('click', () => {
        const text = "¡Mira este link!";
        const url = 'http://usimeca.com.mx/vgarciamx';
        const shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        window.open(shareUrl, '_blank');
    });

    // Compartir en LinkedIn
    shareButtons.linkedin.addEventListener('click', () => {
        const text = "¡Mira este link!";
        const url = 'http://usimeca.com.mx/vgarciamx';
        const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
        window.open(shareUrl, '_blank');
    });

    // Compartir en Messenger
    shareButtons.messenger.addEventListener('click', () => {
        const text = "¡Mira este link!";
        const url = 'http://usimeca.com.mx/vgarciamx';
        const shareUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=${FB_APP_ID}&redirect_uri=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}&message=${encodeURIComponent(text)}`;
        window.open(shareUrl, '_blank');
    });

    // Compartir en Snapchat
    shareButtons.snapchat.addEventListener('click', () => {
        const text = "¡Mira este link!";
        const url = 'http://usimeca.com.mx/vgarciamx';
        const shareUrl = `https://www.snapchat.com/share?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
        window.open(shareUrl, '_blank');
    });

    // Compartir por Mail
    shareButtons.mail.addEventListener('click', () => {
        const subject = "¡Mira este link!";
        const body = "Somos UMECA, visita nuestro sitio: http://usimeca.com.mx/vgarciamx";
        const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoUrl;
    });

    // Compartir por Gmail
    shareButtons.gmail.addEventListener('click', () => {
        const subject = "¡Mira este link!";
        const body = "Somos UMECA, visita nuestro sitio: http://usimeca.com.mx/vgarciamx";
        const gmailUrl = `https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(gmailUrl, '_blank');
    });

    // Copiar enlace
    shareButtons.copy.addEventListener('click', () => {
        navigator.clipboard.writeText('http://usimeca.com.mx/vgarciamx');
        alert('¡Enlace copiado!');
    });

    // Configuración de URLs y constantes
    const SHARE_CONFIG = {
        contact: {
            url: 'http://www.usimeca.com/vgarciamx',
            title: 'Mira mis datos de contacto en el siguiente link',
            subject: '¡Mira este link!',
            body: 'Mira mis datos de contacto en el siguiente link:'
        },
        linkedin: {
            url: 'https://www.linkedin.com/company/usimeca-ind-stria-mec-nica-s-a/mycompany/?viewAsMember=true',
            title: 'LinkedIn',
            subject: 'Mira este asombroso perfil de LinkedIn'
        },
        instagram: {
            url: 'https://www.instagram.com/usimeca.br/?igshid=YmMyMTA2M2Y%3D',
            title: 'Visita nuestro instagram',
            subject: 'Visita nuestro instagram',
            body: 'Entra al link para ver nuestro instagram',
            shareText: 'Visita nuestro instagram'
        },
        usimeca: {
            url: 'https://www.usimeca.com.br/',
            title: 'Visita nuestra página web',
            subject: 'Visita nuestra página web',
            body: 'Entra al link para ver nuestra página web',
            shareText: 'Visita nuestra página web'
        }
    };

    const FB_APP_ID = '1568667420485931';

    // Función para compartir actualizada
    function share(type, source = 'contact') {
        const config = SHARE_CONFIG[source];
        const url = encodeURIComponent(config.url);
        const title = encodeURIComponent(config.title);
        const subject = encodeURIComponent(config.subject);
        const body = encodeURIComponent(`${config.body}\n${config.url}`);

        switch(type) {
            case 'copy':
                navigator.clipboard.writeText(config.url).then(() => {
                    alert('¡Enlace copiado al portapapeles!');
                });
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${title}&url=${url}`, '_blank');
                break;
            case 'facebook':
                window.open(`https://www.facebook.com/dialog/share?app_id=${FB_APP_ID}&href=${url}&display=popup&quote=${title}`, '_blank');
                break;
            case 'whatsapp':
                window.open(`https://wa.me/?text=${encodeURIComponent(`${config.title}\n${config.url}`)}`, '_blank');
                break;
            case 'messenger':
                window.open(`https://www.facebook.com/dialog/send?link=${url}&app_id=${FB_APP_ID}&redirect_uri=${url}&quote=${title}`, '_blank');
                break;
            case 'snapchat':
                window.open(`https://www.snapchat.com/scan?attachmentUrl=${url}`, '_blank');
                break;
            case 'email':
                window.location.href = `mailto:?subject=${subject}&body=${body}`;
                break;
            case 'gmail':
                window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`, '_blank');
                break;
        }

        // Cerrar el modal después de compartir
        const modal = document.getElementById(`${source}Modal`);
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    // Event listeners para los botones de compartir
    document.querySelectorAll('.share-button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const type = button.dataset.type;
            const modal = button.closest('[id$="Modal"]');
            const source = modal ? modal.id.replace('Modal', '').replace('share', '').toLowerCase() : 'contact';
            
            share(type, source);
        });
    });

    // Configuración de URLs y constantes
    const MODAL_URL = 'https://www.linkedin.com/company/usimeca-ind-stria-mec-nica-s-a/mycompany/?viewAsMember=true';
    const SHARE_URL = 'http://usimeca.com.mx/vgarciamx';

    // Función para mostrar el overlay
    function showOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-80 z-[60] flex items-center justify-center';
        overlay.innerHTML = `
            <div class="bg-[#2D3436] rounded-2xl p-8 max-w-[400px] mx-auto animate-scale-up">
                <img src="usimecaM.jpeg" alt="Usimeca Logo" class="w-32 h-32 rounded-xl mx-auto mb-4 object-cover bg-white">
                <h4 class="text-white text-2xl font-bold text-center mb-2">LinkedIn</h4>
                <p class="text-white text-center opacity-90 text-lg">${MODAL_URL}</p>
            </div>
        `;
        document.body.appendChild(overlay);
        return new Promise(resolve => setTimeout(() => {
            overlay.remove();
            resolve();
        }, 2000));
    }

    // Agregar estilos para la animación
    const style = document.createElement('style');
    style.textContent = `
        .animate-scale-up {
            animation: scaleUp 0.3s ease-out;
        }
        
        @keyframes scaleUp {
            from {
                transform: scale(0.95);
                opacity: 0;
            }
            to {
                transform: scale(1);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
});



