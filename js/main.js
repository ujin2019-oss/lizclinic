'use strict';

// Demo descriptions intentionally avoid outcome promises or suitability claims.
// Extend this data and replace handlers when live services become available.
const treatments = {
  ultherapy: { name: '울쎄라', english: 'ULTHERAPY', image: 'ultherapy', concern: '탄력 · 주름', description: '초음파 에너지를 활용해 피부 탄력 관리를 돕는 리프팅 시술입니다.', detail: '초음파를 이용하는 탄력 관리 방법입니다. 적용 부위와 시술 계획은 피부 상태를 확인한 뒤 의료진 상담을 통해 정합니다.' },
  thermage: { name: '써마지', english: 'THERMAGE', image: 'thermage', concern: '탄력 · 잔주름', description: '고주파 에너지를 활용해 피부의 탄력과 잔주름을 관리합니다.', detail: '고주파를 활용하는 피부 탄력 관리 방법입니다. 피부 두께와 민감도, 시술 이력을 고려해 적용 여부를 판단합니다.' },
  lifting: { name: '리프팅 프로그램', english: 'PERSONALIZED LIFTING', image: 'sylfirm', concern: '탄력 · 주름 · 피부 상태', description: '피부 상태와 고민을 함께 살펴보는 개인별 리프팅 관리 계획입니다.', detail: '특정 장비나 시술을 확정하는 프로그램이 아닙니다. 의료진이 피부 상태와 과거 시술 이력을 확인한 뒤 관리 방향을 상담합니다. 이미지는 콘셉트 예시이며 특정 장비 사용을 의미하지 않습니다.' },
  pico: { name: '피코 레이저', english: 'PICO LASER', image: 'pico-laser', concern: '색소 · 피부 톤', description: '짧은 펄스의 레이저를 활용하는 색소 고민 관리 방법입니다.', detail: '색소의 종류와 깊이를 진료로 확인한 뒤 적용 여부를 정합니다. 시술 후 자외선 차단과 피부 자극 관리에 대한 안내가 필요할 수 있습니다.' },
  pigment: { name: '색소 레이저', english: 'PIGMENT CARE', image: 'pico-laser', concern: '기미 · 색소', description: '색소의 특성과 피부 상태를 고려해 접근하는 레이저 관리입니다.', detail: '기미와 다양한 색소 병변은 서로 다른 접근이 필요할 수 있습니다. 병변의 진단과 피부 상태 평가가 먼저 이루어져야 합니다.' },
  tone: { name: '피부 톤 관리', english: 'SKIN TONE CARE', image: 'sylfirm', concern: '피부 톤 · 피부 컨디션', description: '피부 컨디션을 살피고 균일한 피부 톤을 위한 관리 방향을 상담합니다.', detail: '피부 톤 고민의 원인과 피부 민감도를 살펴보는 관리 안내입니다. 이미지는 콘셉트 예시이며 특정 장비 사용을 의미하지 않습니다.' },
  fractional: { name: '프락셔널 레이저', english: 'FRACTIONAL LASER', image: 'sylfirm', concern: '모공 · 피부결', description: '피부 표면의 결과 모공 고민에 대해 상담하는 레이저 관리입니다.', detail: '피부에 미세한 구역 단위로 접근하는 레이저 관리 방법입니다. 붉음, 자극, 회복 기간 등을 의료진과 상담해야 합니다. 이미지는 콘셉트 예시이며 시술 장비와 다를 수 있습니다.' },
  booster: { name: '스킨부스터', english: 'SKIN BOOSTER', image: 'thermage', concern: '건조 · 피부결', description: '피부 상태에 따라 성분과 방법을 상담하는 피부 컨디션 관리입니다.', detail: '사용 성분과 적용 방법에 따라 안내 사항이 달라집니다. 알레르기, 복용 약, 이전 시술 여부 등을 상담 시 확인해야 합니다. 이미지는 콘셉트 예시이며 시술 장비를 나타내지 않습니다.' },
  texture: { name: '피부결 관리', english: 'SKIN TEXTURE CARE', image: 'sylfirm', concern: '피부결 · 피부 컨디션', description: '피부의 민감도와 생활 습관까지 고려하는 세심한 관리 계획입니다.', detail: '피부 표면의 상태와 건조감, 민감도를 살펴 관리 방향을 정합니다. 특정 시술을 추천하거나 결과를 보장하는 안내가 아닙니다.' },
  contour: { name: '윤곽 리프팅', english: 'CONTOUR LIFTING', image: 'ultherapy', concern: '페이스 라인 · 탄력', description: '얼굴의 피부 상태와 탄력 고민을 함께 살펴보는 리프팅 상담입니다.', detail: '얼굴의 구조와 피부 상태에 따라 적용 가능한 방법이 달라집니다. 구체적인 시술 여부와 범위는 의료진 상담 후 결정됩니다.' },
  firmness: { name: '탄력 관리', english: 'FIRMNESS CARE', image: 'thermage', concern: '탄력 · 페이스 라인', description: '피부의 탄력 변화를 고려해 개인에게 맞는 관리 방향을 살펴봅니다.', detail: '피부 탄력에 대한 고민과 현재 상태를 확인하는 상담 안내입니다. 개인의 상태에 따라 시술이 적합하지 않을 수 있습니다.' },
  face: { name: '맞춤형 페이스 라인 프로그램', english: 'PERSONALIZED FACE LINE', image: 'sylfirm', concern: '페이스 라인 · 피부 상태', description: '얼굴의 균형과 피부 고민을 종합적으로 살펴보는 맞춤 상담입니다.', detail: '특정 시술을 미리 정하지 않고 피부 상태와 고민을 종합적으로 확인합니다. 사용 장비와 관리 계획은 상담에 따라 달라집니다.' }
};
const categories = {
  firmness: { intro: '시간의 흐름을 고려한, 세심한 탄력 케어.', items: ['ultherapy', 'thermage', 'lifting'] },
  pigment: { intro: '피부 톤의 작은 변화부터 세심하게.', items: ['pico', 'pigment', 'tone'] },
  texture: { intro: '가까이에서 살펴보는 피부 본연의 결.', items: ['fractional', 'booster', 'texture'] },
  contour: { intro: '나만의 균형을 위한 페이스 라인 케어.', items: ['contour', 'firmness', 'face'] }
};

const panels = document.querySelector('#treatment-panels');
const tabs = [...document.querySelectorAll('[role="tab"]')];
for (const [key, category] of Object.entries(categories)) {
  const panel = document.createElement('div');
  panel.className = 'treatment-panel';
  panel.id = `panel-${key}`;
  panel.setAttribute('role', 'tabpanel');
  panel.setAttribute('aria-labelledby', `tab-${key}`);
  panel.tabIndex = 0;
  panel.hidden = key !== 'firmness';
  panel.innerHTML = `<div class="panel-intro"><p>${category.intro}</p><span class="panel-count">03 TREATMENTS</span></div><div class="treatment-track" tabindex="0" role="region" aria-label="시술 카드 목록, 모바일에서 좌우로 넘겨 탐색">${category.items.map((id, index) => {
    const item = treatments[id];
    return `<article class="treatment-card"><div class="card-image"><img src="images/treatments/${item.image}.webp" srcset="images/treatments/${item.image}-small.webp 240w, images/treatments/${item.image}.webp 376w" sizes="(max-width: 767px) 80vw, (max-width: 1439px) 30vw, 405px" width="376" height="780" loading="lazy" decoding="async" alt="${item.name} 안내를 위한 AI 장비 콘셉트 이미지, 실제 시술 장비와 다를 수 있음"><span class="image-index" aria-hidden="true">0${index + 1}</span><span class="image-label">AI CONCEPT IMAGE</span></div><div class="card-copy"><p class="card-english">${item.english}</p><h3>${item.name}</h3><p class="card-description">${item.description}</p><p class="card-concern">${item.concern}</p><div class="card-links"><button class="text-button" type="button" data-detail="${id}" aria-label="${item.name} 상세 정보 보기">상세 정보 보기 <span class="arrow" aria-hidden="true">↗</span></button><button class="card-consult" type="button" data-consult="${id}" aria-label="${item.name} 상담 안내">상담 문의</button></div></div></article>`;
  }).join('')}</div>`;
  panels.append(panel);
}

function activateTab(tab) {
  tabs.forEach(item => {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
    const panel = document.getElementById(item.getAttribute('aria-controls'));
    panel.hidden = !active;
    panel.classList.toggle('is-entering', active);
    if (active) panel.querySelector('.treatment-track').scrollLeft = 0;
  });
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      tabs[next].focus();
      activateTab(tabs[next]);
    }
  });
});

const header = document.querySelector('#header');
const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 16);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

const menu = document.querySelector('#mobile-menu');
const menuToggle = document.querySelector('.menu-toggle');
const dialog = document.querySelector('#info-dialog');
let returnFocus = null;

function updateLock() { document.body.classList.toggle('is-locked', menu.open || dialog.open); }
function closeMenu() {
  if (menu.open) menu.close();
}
menuToggle.addEventListener('click', () => {
  menu.showModal();
  menuToggle.setAttribute('aria-expanded', 'true');
  updateLock();
});
document.querySelector('[data-menu-close]').addEventListener('click', closeMenu);
menu.addEventListener('close', () => {
  menuToggle.setAttribute('aria-expanded', 'false');
  updateLock();
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
// Native dialogs supply an inert background, Escape support, and a backdrop.
// Explicit Tab wrapping also keeps the cycle inside the dialog at both ends.
for (const modal of [menu, dialog]) {
  modal.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const focusable = [...modal.querySelectorAll('a[href], button:not(:disabled), [tabindex="0"]')]
      .filter(element => element.getClientRects().length > 0);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });
}
window.matchMedia('(min-width: 1200px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

function openInfo({ title, description, detail, eyebrow, consultation, detailHeading }, trigger) {
  const fromMenu = menu.open;
  if (!dialog.open) returnFocus = fromMenu ? menuToggle : trigger;
  if (fromMenu) closeMenu();
  document.querySelector('#dialog-title').textContent = title;
  document.querySelector('#dialog-description').textContent = description;
  document.querySelector('#dialog-eyebrow').textContent = eyebrow;
  document.querySelector('#dialog-detail').replaceChildren();
  const heading = document.createElement('strong');
  heading.textContent = detailHeading || (consultation ? '데모 이용 안내' : '상담 전 확인해 주세요');
  document.querySelector('#dialog-detail').append(heading, document.createTextNode(detail));
  document.querySelector('#detail-consult').hidden = consultation;
  if (!dialog.open) dialog.showModal();
  updateLock();
  dialog.querySelector('[data-dialog-close]').focus();
}
function showConsult(trigger, id) {
  openInfo({
    title: '상담 및 예약 안내', eyebrow: 'PERSONAL CONSULTATION', consultation: true,
    description: id && treatments[id] ? `${treatments[id].name}에 관심을 가져주셔서 감사합니다. 피부 고민과 시술 적합성은 의료진과 충분한 상담 후 결정해야 합니다.` : '당신의 피부를 이해하는 것에서 맞춤 케어는 시작됩니다. 피부 고민과 시술 적합성은 의료진 상담을 통해 결정됩니다.',
    detail: '현재는 포트폴리오용 데모로 상담 신청, 개인정보 수집, 실제 예약을 진행하지 않습니다. 추후 정식 상담 채널이 연결될 예정입니다.'
  }, trigger);
}
document.addEventListener('click', event => {
  const programLink = event.target.closest('[data-select-category]');
  if (programLink) {
    const targetTab = tabs.find(tab => tab.dataset.category === programLink.dataset.selectCategory);
    if (targetTab) {
      activateTab(targetTab);
      targetTab.focus({ preventScroll: true });
    }
  }
  const consult = event.target.closest('[data-consult]');
  if (consult) showConsult(consult, consult.dataset.consult);
  const detail = event.target.closest('[data-detail]');
  if (detail) {
    const item = treatments[detail.dataset.detail];
    openInfo({ title: item.name, eyebrow: item.english, description: item.description, detail: `${item.detail} 시술 후 붉음, 부기, 통증 등 개인별 반응이 있을 수 있으며, 적합성과 유의사항은 의료진 상담으로 확인해야 합니다.`, consultation: false }, detail);
  }
});

// Information actions deliberately collect no data and create no external links.
const information = {
  phone: { title: '전화 문의 안내', description: '현재 연결 가능한 실제 전화번호가 등록되어 있지 않습니다. 임의의 번호로 연결하지 않습니다.', detail: '정식 운영 시 확인된 대표 연락처와 문의 가능한 시간을 안내할 예정입니다.' },
  privacy: { title: '개인정보 관련 안내', description: '이 포트폴리오는 개인정보 입력 양식, 실제 예약 접수, 분석 도구를 사용하지 않습니다. 상담 버튼은 브라우저 안에서 안내 모달만 엽니다.', detail: '향후 실제 상담 기능을 연결할 때는 운영 주체와 처리 목적, 수집 항목, 보유 기간, 이용자 권리 및 문의처를 확인한 개인정보 처리방침이 필요합니다. 현재 안내는 정식 의료기관의 개인정보 처리방침이 아닙니다.' },
  portfolio: { title: '포트폴리오 안내', description: 'LIZ CLINIC은 가상의 프리미엄 피부과 브랜드입니다. 의료진, 진료 과정, 프로그램과 위치는 웹 디자인을 위한 예시입니다.', detail: '모델·공간·장비 비주얼은 제공된 브랜드 콘셉트 에셋입니다. 실제 의료진 사진, 실제 병원 시설, 제조사 공식 제품 사진 또는 환자의 치료 사례가 아닙니다.' },
  location: { title: '가상 위치 안내', description: '서울특별시 강남구 도산대로 일대는 브랜드 설정을 위한 가상 위치입니다. 현재 방문 가능한 실제 병원 주소는 없습니다.', detail: '실제 주소, 대중교통, 주차, 진료시간은 운영 정보가 확정된 뒤 안내할 예정입니다. 위치 도식은 실제 지도가 아니며 길찾기에 사용할 수 없습니다.' }
};
for (const [key, content] of Object.entries(information)) {
  document.querySelectorAll(`[data-${key}]`).forEach(button => button.addEventListener('click', () => {
    openInfo({ ...content, eyebrow: 'LIZ CLINIC / INFORMATION', consultation: true, detailHeading: '포트폴리오 데모 안내' }, button);
  }));
}

const comparisonRange = document.querySelector('#compare-range');
if (comparisonRange) {
  const updateComparison = () => {
    const value = Number(comparisonRange.value);
    comparisonRange.closest('.compare-frame').style.setProperty('--compare-position', `${value}%`);
    comparisonRange.setAttribute('aria-valuetext', `흑백 ${value}%, 컬러 ${100 - value}%`);
    document.querySelector('#compare-value').textContent = `${value} / ${100 - value}`;
  };
  comparisonRange.addEventListener('input', updateComparison);
  // Pointer capture supports dragging anywhere on the comparison, including touch.
  const moveComparison = event => {
    const bounds = comparisonRange.getBoundingClientRect();
    comparisonRange.value = Math.round(Math.max(0, Math.min(100, (event.clientX - bounds.left) / bounds.width * 100)));
    updateComparison();
  };
  comparisonRange.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    comparisonRange.focus({ preventScroll: true });
    comparisonRange.setPointerCapture(event.pointerId);
    moveComparison(event);
  });
  comparisonRange.addEventListener('pointermove', event => {
    if (comparisonRange.hasPointerCapture(event.pointerId)) moveComparison(event);
  });
  comparisonRange.addEventListener('pointerup', event => {
    if (comparisonRange.hasPointerCapture(event.pointerId)) comparisonRange.releasePointerCapture(event.pointerId);
  });
  updateComparison();
}

// Observe only off-screen content; no JS/reduced-motion leaves everything visible.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !motionPreference.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('is-pending');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06 });
  document.querySelectorAll('.reveal').forEach(element => {
    if (element.getBoundingClientRect().top > window.innerHeight) {
      element.classList.add('is-pending');
      observer.observe(element);
    }
  });
  motionPreference.addEventListener('change', event => {
    if (event.matches) {
      observer.disconnect();
      document.querySelectorAll('.is-pending').forEach(element => element.classList.remove('is-pending'));
    }
  });
}
document.querySelectorAll('[data-dialog-close]').forEach(button => button.addEventListener('click', () => dialog.close()));
document.querySelector('#detail-consult').addEventListener('click', event => showConsult(event.currentTarget));
dialog.addEventListener('close', () => { updateLock(); if (returnFocus?.isConnected) returnFocus.focus(); });
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});
