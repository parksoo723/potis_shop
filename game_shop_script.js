// 모바일 메뉴 토글
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // 메뉴 링크 클릭시 모바일 메뉴 닫기
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
});

// 부드러운 스크롤
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    const offsetTop = section.offsetTop - 70;
    
    window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
    });
}

// 네비게이션 링크 클릭 이벤트
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

// 게임 카드 선택
document.addEventListener('DOMContentLoaded', function() {
    const gameCards = document.querySelectorAll('.game-card');
    const itemCards = document.querySelectorAll('.item-card');
    
    gameCards.forEach(card => {
        card.addEventListener('click', function() {
            // 모든 카드에서 active 클래스 제거
            gameCards.forEach(c => c.classList.remove('active'));
            // 클릭된 카드에 active 클래스 추가
            this.classList.add('active');
            
            // 선택된 게임에 따라 아이템 필터링
            const selectedGame = this.dataset.game;
            filterItemsByGame(selectedGame);
        });
    });
});

// 게임별 아이템 필터링
function filterItemsByGame(game) {
    const itemCards = document.querySelectorAll('.item-card');
    
    itemCards.forEach(card => {
        if (game === 'all' || card.dataset.game === game) {
            card.style.display = 'block';
            card.classList.add('fade-in');
        } else {
            card.style.display = 'none';
        }
    });
}

// 카테고리 필터
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const itemCards = document.querySelectorAll('.item-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 모든 버튼에서 active 클래스 제거
            filterBtns.forEach(b => b.classList.remove('active'));
            // 클릭된 버튼에 active 클래스 추가
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            
            itemCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    card.classList.add('fade-in');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});

// 아이템 주문 함수
function orderItem(itemName, price) {
    const userConfirm = confirm(`${itemName}을(를) ${parseInt(price).toLocaleString()}원에 주문하시겠습니까?`);
    
    if (userConfirm) {
        // 주문 정보를 로컬 스토리지에 저장
        const orderData = {
            item: itemName,
            price: price,
            timestamp: new Date().toISOString(),
            orderId: 'ORDER-' + Date.now()
        };
        
        localStorage.setItem('pendingOrder', JSON.stringify(orderData));
        
        // 문의 폼으로 이동하면서 주문 정보 자동 입력
        scrollToSection('contact');
        
        setTimeout(() => {
            const form = document.getElementById('contactForm');
            const messageTextarea = form.querySelector('textarea[name="message"]');
            const inquirySelect = form.querySelector('select[name="inquiry_type"]');
            
            inquirySelect.value = 'purchase';
            messageTextarea.value = `주문 문의\n\n상품명: ${itemName}\n가격: ${parseInt(price).toLocaleString()}원\n주문번호: ${orderData.orderId}\n\n추가 요청사항이 있으시면 아래에 작성해주세요:`;
            
            // 폼 하이라이트 효과
            form.style.border = '2px solid #00d4ff';
            form.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.3)';
            
            setTimeout(() => {
                form.style.border = '';
                form.style.boxShadow = '';
            }, 3000);
        }, 1000);
    }
}

// 시세 업데이트 함수
function updatePrices() {
    const updateBtn = document.querySelector('.update-btn');
    const lastUpdateSpan = document.getElementById('last-update');
    
    updateBtn.textContent = '업데이트 중...';
    updateBtn.disabled = true;
    
    // 시뮬레이션: 실제로는 서버에서 데이터를 가져옴
    setTimeout(() => {
        // 가격 변동 시뮬레이션
        const priceChanges = document.querySelectorAll('.price-up, .price-down, .price-stable');
        priceChanges.forEach(change => {
            const randomChange = Math.random();
            if (randomChange < 0.3) {
                change.className = 'price-up';
                change.textContent = '+' + Math.floor(Math.random() * 10 + 1) + '%';
            } else if (randomChange < 0.6) {
                change.className = 'price-down';
                change.textContent = '-' + Math.floor(Math.random() * 15 + 1) + '%';
            } else {
                change.className = 'price-stable';
                change.textContent = '0%';
            }
        });
        
        // 현재 시간으로 업데이트
        const now = new Date();
        lastUpdateSpan.textContent = now.toLocaleString('ko-KR');
        
        updateBtn.textContent = '시세 새로고침';
        updateBtn.disabled = false;
        
        // 성공 메시지
        showNotification('시세가 업데이트되었습니다!', 'success');
    }, 2000);
}

// 알림 메시지 표시
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#51cf66' : type === 'error' ? '#ff6b6b' : '#00d4ff'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 이메일 문의 폼 처리
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const inquiryType = formData.get('inquiry_type');
        const game = formData.get('game');
        const message = formData.get('message');
        
        // 유효성 검사
        if (!name || !email || !inquiryType || !message) {
            showNotification('모든 필수 항목을 입력해주세요.', 'error');
            return;
        }
        
        // 이메일 형식 검사
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('올바른 이메일 주소를 입력해주세요.', 'error');
            return;
        }
        
        // 이메일 내용 구성
        const emailSubject = `[게임아이템샵] ${getInquiryTypeText(inquiryType)} 문의`;
        const emailBody = `
안녕하세요, ${name}님의 문의입니다.

문의 유형: ${getInquiryTypeText(inquiryType)}
게임명: ${game || '미지정'}
연락처: ${email}

문의 내용:
${message}

---
이 메일은 게임아이템샵 웹사이트에서 자동 생성되었습니다.
        `.trim();
        
        // mailto 링크 생성
        const mailtoLink = `mailto:gameitemshop@example.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        
        // 이메일 클라이언트 열기
        window.location.href = mailtoLink;
        
        // 성공 메시지
        showNotification('이메일 클라이언트가 열렸습니다. 메일을 확인하고 전송해주세요!', 'success');
        
        // 폼 초기화
        this.reset();
        
        // 주문 데이터 클리어
        localStorage.removeItem('pendingOrder');
    });
});

// 문의 유형 텍스트 변환
function getInquiryTypeText(type) {
    const types = {
        'purchase': '구매 문의',
        'price': '가격 문의',
        'delivery': '배송 문의',
        'account': '계정 문의',
        'refund': '환불 문의',
        'other': '기타 문의'
    };
    return types[type] || '일반 문의';
}

// 스크롤 애니메이션
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// 애니메이션을 적용할 요소들 관찰
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.game-card, .item-card, .price-table, .safety-item, .contact-info, .contact-form');
    animateElements.forEach(el => {
        observer.observe(el);
    });
});

// 스크롤에 따른 네비게이션 스타일 변경
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(26, 31, 58, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = 'linear-gradient(135deg, #1a1f3a 0%, #2d1b69 100%)';
        navbar.style.backdropFilter = 'none';
    }
});

// 페이지 로드시 마지막 업데이트 시간 설정
document.addEventListener('DOMContentLoaded', function() {
    const lastUpdateSpan = document.getElementById('last-update');
    if (lastUpdateSpan) {
        const now = new Date();
        lastUpdateSpan.textContent = now.toLocaleString('ko-KR');
    }
});

// 아이템 카드 호버 효과 강화
document.addEventListener('DOMContentLoaded', function() {
    const itemCards = document.querySelectorAll('.item-card');
    
    itemCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 15px 40px rgba(0, 212, 255, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 5px 20px rgba(0,0,0,0.3)';
        });
    });
});

// 검색 기능 (향후 확장용)
function searchItems(query) {
    const itemCards = document.querySelectorAll('.item-card');
    const searchQuery = query.toLowerCase();
    
    itemCards.forEach(card => {
        const itemName = card.querySelector('h3').textContent.toLowerCase();
        const itemGame = card.querySelector('.item-game').textContent.toLowerCase();
        
        if (itemName.includes(searchQuery) || itemGame.includes(searchQuery)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// 장바구니 기능 (향후 확장용)
let cart = JSON.parse(localStorage.getItem('gameItemsCart')) || [];

function addToCart(itemName, price) {
    const item = {
        id: Date.now(),
        name: itemName,
        price: parseInt(price),
        quantity: 1
    };
    
    cart.push(item);
    localStorage.setItem('gameItemsCart', JSON.stringify(cart));
    showNotification(`${itemName}이(가) 장바구니에 추가되었습니다!`, 'success');
}

// 페이지네이션 변수
let currentPage = 1;
let itemsPerPage = 12;
let totalItems = 0;
let allItems = [];

// 페이지네이션 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializePagination();
});

function initializePagination() {
    allItems = Array.from(document.querySelectorAll('.item-card'));
    totalItems = allItems.length;
    
    // 총 아이템 수 업데이트
    document.getElementById('total-items').textContent = totalItems;
    
    // 첫 페이지 표시
    showPage(1);
    updatePaginationButtons();
}

function showPage(page) {
    currentPage = page;
    
    // 모든 아이템 숨기기
    allItems.forEach(item => {
        item.style.display = 'none';
    });
    
    // 현재 페이지 아이템만 표시
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = allItems.slice(startIndex, endIndex);
    
    pageItems.forEach(item => {
        item.style.display = 'block';
    });
    
    // 페이지 정보 업데이트
    const currentStart = startIndex + 1;
    const currentEnd = Math.min(endIndex, totalItems);
    document.getElementById('current-range').textContent = `${currentStart}-${currentEnd}`;
    
    // 페이지 버튼 활성화 상태 업데이트
    updatePageButtons();
    
    // 스크롤을 아이템 섹션 상단으로 이동
    document.getElementById('items').scrollIntoView({ behavior: 'smooth' });
}

function updatePageButtons() {
    const pageButtons = document.querySelectorAll('.page-btn');
    pageButtons.forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.textContent) === currentPage) {
            btn.classList.add('active');
        }
    });
}

function updatePaginationButtons() {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    // 이전 버튼 상태
    prevBtn.disabled = currentPage === 1;
    
    // 다음 버튼 상태
    nextBtn.disabled = currentPage === totalPages;
    
    // 페이지 번호 버튼 동적 생성
    const pageNumbers = document.querySelector('.page-numbers');
    pageNumbers.innerHTML = '';
    
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // 시작 페이지 조정
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'page-btn';
        pageBtn.textContent = i;
        pageBtn.onclick = () => goToPage(i);
        
        if (i === currentPage) {
            pageBtn.classList.add('active');
        }
        
        pageNumbers.appendChild(pageBtn);
    }
}

function goToPage(page) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        showPage(page);
        updatePaginationButtons();
    }
}

function changePage(direction) {
    const newPage = currentPage + direction;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    if (newPage >= 1 && newPage <= totalPages) {
        goToPage(newPage);
    }
}

// 필터링 시 페이지네이션 업데이트
function updatePaginationAfterFilter() {
    const visibleItems = Array.from(document.querySelectorAll('.item-card')).filter(item => 
        item.style.display !== 'none'
    );
    
    allItems = visibleItems;
    totalItems = allItems.length;
    
    document.getElementById('total-items').textContent = totalItems;
    
    // 첫 페이지로 리셋
    currentPage = 1;
    showPage(1);
    updatePaginationButtons();
}

// 기존 필터 함수 수정
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const itemCards = document.querySelectorAll('.item-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 모든 버튼에서 active 클래스 제거
            filterBtns.forEach(b => b.classList.remove('active'));
            // 클릭된 버튼에 active 클래스 추가
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            
            // 필터링 적용
            itemCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    card.classList.add('fade-in');
                } else {
                    card.style.display = 'none';
                }
            });
            
            // 페이지네이션 업데이트
            setTimeout(() => {
                updatePaginationAfterFilter();
            }, 100);
        });
    });
});

// 게임별 필터링 시에도 페이지네이션 업데이트
function filterItemsByGame(game) {
    const itemCards = document.querySelectorAll('.item-card');
    
    itemCards.forEach(card => {
        if (game === 'all' || card.dataset.game === game) {
            card.style.display = 'block';
            card.classList.add('fade-in');
        } else {
            card.style.display = 'none';
        }
    });
    
    // 페이지네이션 업데이트
    setTimeout(() => {
        updatePaginationAfterFilter();
    }, 100);
}

// 키보드 단축키
document.addEventListener('keydown', function(e) {
    // 좌우 화살표로 페이지 이동
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        changePage(-1);
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        changePage(1);
    }
    
    // 숫자 키로 페이지 이동 (1-5)
    if (e.key >= '1' && e.key <= '5') {
        const page = parseInt(e.key);
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        if (page <= totalPages) {
            goToPage(page);
        }
    }
    
    // Ctrl + / 또는 Cmd + / 로 검색 포커스 (향후 검색 기능 추가시)
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        // 검색 입력 필드에 포커스 (향후 구현)
    }
    
    // ESC로 모바일 메뉴 닫기
    if (e.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// 성능 최적화: 이미지 지연 로딩 (향후 실제 이미지 추가시)
document.addEventListener('DOMContentLoaded', function() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});
