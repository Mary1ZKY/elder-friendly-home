const form = document.querySelector('#lead-form');
const formStatus = document.querySelector('.form-status');
document.querySelectorAll('[data-demand]').forEach((card) => {
  card.addEventListener('click', () => {
    const select = form.elements.demand;
    if (select) select.value = card.dataset.demand;
  });
});
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = form.elements.name.value.trim();
  const demand = form.elements.demand.value;
  const city = form.elements.city.value.trim();
  const message = form.elements.message.value.trim();
  if (!demand && !message) {
    formStatus.textContent = '先选一个想聊的话题，或写一点家中的情况。';
    return;
  }
  const summary = [
    '居家改善需求',
    `想聊：${demand || '家中的情况'}`,
    name && `称呼：${name}`,
    city && `城市：${city}`,
    message && `家中情况：${message}`,
    '咨询电话：19295319008',
    `官网：${location.origin}${location.pathname}`,
  ].filter(Boolean).join('\n');
  try {
    await navigator.clipboard.writeText(summary);
    formStatus.textContent = '需求已复制。您可以粘贴发送给家人或联系人，也可以拨打 19295319008，照着这份提纲慢慢聊。';
  } catch (error) {
    formStatus.textContent = `可以选中以下内容手动复制，或直接拨打 19295319008：\n\n${summary}`;
  }
});

const revealTargets = document.querySelectorAll('.industry-card, .service-card, .keyword-groups article, .proof-copy, .contact-panel');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  revealTargets.forEach((item) => item.classList.add('reveal'));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((item) => observer.observe(item));
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

const roomChecks = {
  '卫生间': [
    ['wet', 'PRICE_WET_A', '地面遇水容易滑'],
    ['support', 'PRICE_BAR_A', '起身或转身时没有支撑'],
    ['light', 'PRICE_LIGHT_A', '夜里开灯不方便'],
    ['threshold', 'PRICE_THRESHOLD_A', '进出有高低差或容易绊脚'],
  ],
  '卧室': [
    ['support', 'PRICE_BED_SUPPORT_A', '床边起身时缺少支撑'],
    ['light', 'PRICE_LIGHT_A', '夜间照明不够方便'],
    ['floor', 'PRICE_MAT_A', '床边地面容易滑或有松动地垫'],
    ['path', 'PRICE_LIVING_PATH_A', '床到门口的通道有杂物'],
  ],
  '客厅': [
    ['path', 'PRICE_LIVING_PATH_A', '走道被茶几或家具挡住'],
    ['rug', 'PRICE_MAT_A', '地毯或地垫容易卷边移动'],
    ['cable', 'PRICE_LIVING_PATH_A', '电线横在常走的地方'],
    ['light', 'PRICE_LIGHT_A', '常坐的位置或通道光线偏暗'],
  ],
  '厨房': [
    ['reach', 'PRICE_KITCHEN_REACH_A', '常用物品需要踮脚或弯腰取'],
    ['floor', 'PRICE_MAT_A', '地面遇水或油容易滑'],
    ['light', 'PRICE_LIGHT_A', '操作台照明不够清楚'],
    ['path', 'PRICE_LIVING_PATH_A', '常走的通道有物品或线缆'],
  ],
  '走廊 / 楼梯': [
    ['path', 'PRICE_CORRIDOR_PATH_A', '走道有鞋物、杂物或线缆'],
    ['threshold', 'PRICE_THRESHOLD_A', '门槛或高低差容易绊脚'],
    ['support', 'PRICE_BAR_A', '走动时缺少可扶靠的位置'],
    ['light', 'PRICE_LIGHT_A', '夜间走廊或楼梯不够亮'],
  ],
  '阳台': [
    ['threshold', 'PRICE_THRESHOLD_A', '阳台门槛或高差容易绊脚'],
    ['drying', 'PRICE_BALCONY_REACH_A', '晾衣时需要踮脚或够得太远'],
    ['floor', 'PRICE_MAT_A', '地面湿滑或地垫容易移动'],
    ['light', 'PRICE_LIGHT_A', '傍晚或夜间光线不足'],
  ],
};

const starterPriceRanges = {
  PRICE_BAR_A: [30, 150], PRICE_WET_A: [10, 80], PRICE_LIGHT_A: [30, 150],
  PRICE_THRESHOLD_A: [10, 50], PRICE_MAT_A: [0, 80], PRICE_BED_SUPPORT_A: [0, 100],
  PRICE_LIVING_PATH_A: [0, 80], PRICE_KITCHEN_REACH_A: [0, 50], PRICE_CORRIDOR_PATH_A: [0, 50], PRICE_BALCONY_REACH_A: [30, 200],
};

const roomLabel = document.querySelector('#risk-room-label');
const checksContainer = document.querySelector('#risk-checks');
const resultPanel = document.querySelector('.assessment-result');
const formatCny = (amount) => `¥${amount.toLocaleString('zh-CN')}`;
let activeRoom = '卫生间';

function renderRoomChecks() {
  roomLabel.textContent = `${activeRoom}里，您有没有留意到这些情况？`;
  checksContainer.replaceChildren(...roomChecks[activeRoom].map(([key, price, label]) => {
    const wrapper = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.dataset.risk = key;
    input.dataset.price = price;
    input.dataset.name = label;
    const icon = document.createElement('span');
    icon.className = 'check-icon';
    icon.textContent = '✓';
    wrapper.append(input, icon, document.createTextNode(label));
    return wrapper;
  }));
  checksContainer.querySelectorAll('input').forEach((input) => input.addEventListener('change', updateAssessment));
  updateAssessment();
}

function updateAssessment() {
  const selected = [...checksContainer.querySelectorAll('input:checked')];
  const title = document.querySelector('#result-title');
  const copy = document.querySelector('#result-copy');
  const budget = document.querySelector('#result-budget');
  if (!selected.length) {
    title.textContent = '选好情况后，这里会出现一份温和的建议';
    copy.textContent = '不需要一次解决所有问题。我们会先帮您排出一个更值得优先讨论的小步骤。';
    budget.textContent = '待选择';
    resultPanel.classList.remove('is-ready');
    return;
  }
  const low = selected.reduce((sum, input) => sum + starterPriceRanges[input.dataset.price][0], 0);
  const high = selected.reduce((sum, input) => sum + starterPriceRanges[input.dataset.price][1], 0);
  const first = selected[0].dataset.name;
  title.textContent = selected.length === 1 ? `可以先从「${first}」聊起` : `${activeRoom}里有 ${selected.length} 件事值得优先聊聊`;
  copy.textContent = selected.length > 1
    ? `先一起看看${first}，再结合长者平时怎么使用这个房间，排出最合适的改善顺序。`
    : `我们可以从${first}开始了解，再结合长者日常习惯与现场条件判断是否需要调整。`;
  budget.textContent = `${formatCny(low)} – ${formatCny(high)}`;
  resultPanel.classList.remove('is-ready');
  requestAnimationFrame(() => resultPanel.classList.add('is-ready'));
}

document.querySelectorAll('[data-room]').forEach((button) => {
  button.addEventListener('click', () => {
    activeRoom = button.dataset.room;
    document.querySelectorAll('[data-room]').forEach((room) => room.classList.toggle('active', room === button));
    renderRoomChecks();
  });
});
renderRoomChecks();

document.querySelector('#room-photo')?.addEventListener('change', (event) => {
  const file = event.currentTarget.files?.[0];
  document.querySelector('#photo-name').textContent = file ? `${file.name} · 仅在本机选择，未上传` : '让我们一起看得更具体';
});

document.querySelector('#assessment-contact')?.addEventListener('click', () => {
  const selected = [...checksContainer.querySelectorAll('input:checked')].map((input) => input.dataset.name);
  if (!selected.length) return;
  form.elements.demand.value = '老年人居住安全评估';
  form.elements.message.value = `房间：${activeRoom}\n我留意到：${selected.join('、')}\n网站给出的入门参考预算：${document.querySelector('#result-budget').textContent}（仅供讨论，非现场报价）`;
});
