document.querySelectorAll('.deck-title').forEach(e=>{let size=29;while(e.offsetHeight>68&&size>19)e.style.fontSize=(--size)+'px'});
document.querySelectorAll('.native svg path[fill="none"]').forEach(p=>p.setAttribute('pathLength','1'));

const slides=[...document.querySelectorAll('.slide')];let cur=-1,typingTimer,counterFrames=[];
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
function fit(){document.querySelector('#deck').style.transform=`translate(-50%,-50%) scale(${Math.min(innerWidth/1280,innerHeight/720)})`};addEventListener('resize',fit);fit();
slides.forEach(s=>s.querySelectorAll('.source-canvas>.source-object').forEach((o,i)=>o.style.setProperty('--i',Math.min(i,18))));

let sceneHosts={};
const groupOf=i=>i>=15&&i<=17?'stages':i>=40&&i<=45?'cases':i===36||i===37?'process':i===6||i===7?'taxi':null;
function motion(el,direction=1){if(reduce||!el)return;el.getAnimations().forEach(a=>a.cancel());el.animate([{opacity:0,transform:`translateY(${direction*12}px)`},{opacity:1,transform:'translateY(0)'}],{duration:380,easing:'cubic-bezier(.2,.8,.2,1)'})}
function swapText(el,text,animate=true){if(el.textContent===text)return;el.textContent=text;if(animate)motion(el)}
function sourceBlocks(i){return JSON.parse(document.querySelector('#source-text-data').textContent)[i].blocks}
function makeHost(group){const host=document.createElement('div');host.className='scene-host';host.dataset.group=group;host.innerHTML='<h2 class="deck-title"></h2><div class="slide-id"></div>';document.querySelector('#deck').append(host);
if(group==='stages'){
 host.querySelector('h2').textContent='ИСПОЛЬЗУЕМЫЙ ПОДХОД РЕИНЖИНИРИНГА';host.append(slides[15].querySelector('.stage-bar').cloneNode(true));host.insertAdjacentHTML('beforeend','<div class="grid two stage-cards dense-stage"><article class="glass stage-team"><h3>Команда проекта</h3><div class="team-body"></div></article><article class="glass stage-analysis"><h3>Анализ текущей ситуации</h3><div class="analysis-body"></div></article></div><div class="stage-orb orb"><video src="assets/orb.mp4" muted loop playsinline autoplay></video></div>');
 sourceBlocks(15)[6].split('\n').forEach(t=>{const p=document.createElement('p');p.textContent=t;host.querySelector('.team-body').append(p)});for(let j=0;j<4;j++)host.querySelector('.analysis-body').append(document.createElement('p'));
}else if(group==='taxi'){
 host.classList.add('taxi-host');host.querySelector('h2').textContent=slides[6].dataset.title;const paper=slides[6].querySelector('.paper').cloneNode(true);paper.querySelectorAll('.source-object').forEach(el=>{if(el.querySelector('img[src="assets/image16.jpg"]'))el.remove()});const overlay=[...slides[7].querySelectorAll('.source-object')].find(el=>el.querySelector('img[src="assets/image16.jpg"]')).cloneNode(true);overlay.classList.add('taxi-new');overlay.hidden=true;paper.querySelector('.source-canvas').append(overlay);host.append(paper);
}else if(group==='process'){
 host.classList.add('process-host');host.querySelector('h2').textContent='ФОРМИРОВАНИЕ ПОТРЕБНОСТИ И ЗАКУПКА ЛЕКАРСТВ';host.insertAdjacentHTML('beforeend','<div class="process-status"></div><div class="process-steps"></div><img class="process-photo" src="assets/image45.jpg" alt="Выдача лекарств гражданину"><div class="photo-label">ВЫДАЧА ЛС<br>ГРАЖДАНИНУ</div><div class="process-total"></div><div class="process-summary"></div>');sourceBlocks(36).slice(1,6).forEach(t=>{const e=document.createElement('article');e.className='process-step';const title=document.createElement('h3');title.textContent=t;e.append(title);e.insertAdjacentHTML('beforeend','<div class="process-duration"></div><p class="process-comment"></p>');host.querySelector('.process-steps').append(e)});
}else{
 host.insertAdjacentHTML('beforeend','<div class="case-intro"></div><div class="grid two comparison"><article class="glass"><h3>Было</h3><p class="before-content"></p></article><article class="glass"><h3>Стало</h3><p class="after-content"></p></article></div><aside class="results-panel"><h3>Результаты</h3><div class="results-list"></div></aside>');for(let j=0;j<5;j++)host.querySelector('.results-list').insertAdjacentHTML('beforeend','<div class="result-row"><strong></strong><p></p></div>');
}host.querySelectorAll('[data-a]').forEach(e=>e.removeAttribute('data-a'));sceneHosts[group]=host;return host}
function renderScene(group,i,continuing){const host=sceneHosts[group]||makeHost(group);host.classList.add('scene-visible');if(continuing)host.getAnimations().forEach(a=>a.finish());host.querySelector('.slide-id').textContent=String(i+1).padStart(2,'0');
 if(group==='stages'){
  const stage=i===15?0:1;host.querySelectorAll('.stage-bar>div').forEach((e,j)=>e.classList.toggle('current',j===stage));
  const analysis=host.querySelector('.stage-analysis'),orb=host.querySelector('.stage-orb');const wasHidden=analysis.hidden;analysis.hidden=i===15;orb.hidden=i!==15;
  const video=orb.querySelector('video');i===15?video.play().catch(()=>{}):video.pause();
  if(i!==15){const b=sourceBlocks(i);const items=i===16?b.slice(6,10):b.slice(5,9);host.querySelectorAll('.analysis-body p').forEach((el,j)=>swapText(el,items[j].replaceAll('процессовпосредством','процессов посредством').replaceAll('процессапутем','процесса путем'),continuing&&!wasHidden));if(wasHidden&&continuing)motion(analysis)}
 }else if(group==='taxi'){
 const overlay=host.querySelector('.taxi-new'),wasVisible=!overlay.hidden;overlay.hidden=i!==7;if(i===7&&!wasVisible&&continuing)motion(overlay);
 }else if(group==='process'){
 const optimized=i===37;swapText(host.querySelector('.process-status'),optimized?'ОПТИМИЗАЦИЯ БИЗНЕС-ПРОЦЕССОВ':'ТЕКУЩЕЕ СОСТОЯНИЕ БИЗНЕС-ПРОЦЕССОВ',continuing);
 const durations=optimized?['до 10 дней','1 день','Исключён','до 45 дней','20–30 дней']:['10–30 дней','10–20 дней','7–14 дней','45–90 дней','20–30 дней'];
 const comments=optimized?['Оптимизация за счет внедрения ИС и утверждения нового регламента формирования перечня','Формируются автоматически системой','Нет необходимости согласовывать потребности, сформированные системой','Оптимизация за счет внедрения ИС и утверждения нового регламента осуществления закупок','Занимает время на логистику и перемещение (доставка осуществляется по графику)']:['РИСК утверждения перечня с задержкой','Допускаются ошибки при формировании потребности, человеческий фактор','Трудоемкость исполняемого процесса','Занимает время на проведение тендеров (минимум 45 календарных дней)','Занимает время на логистику и перемещение (доставка осуществляется по графику)'];
 host.querySelectorAll('.process-step').forEach((step,j)=>{swapText(step.querySelector('.process-duration'),durations[j],continuing);swapText(step.querySelector('.process-comment'),comments[j],continuing);step.classList.toggle('excluded',optimized&&j===2)});
 swapText(host.querySelector('.process-total'),optimized?'76–106 дней':'83–154 дня',continuing);swapText(host.querySelector('.process-summary'),optimized?sourceBlocks(37)[17]:'93–184 дня в случае задержки перечня',continuing);
 }else{
  const original=slides[i];swapText(host.querySelector('h2'),original.dataset.title,continuing);let size=29;const title=host.querySelector('h2');title.style.fontSize=size+'px';while(title.offsetHeight>68&&size>19)title.style.fontSize=(--size)+'px';swapText(host.querySelector('.case-intro'),original.querySelector('.case-intro').textContent,continuing);
  swapText(host.querySelector('.before-content'),sourceBlocks(i).find(t=>t.startsWith('Было')).split(':').slice(1).join(':').trim(),continuing);swapText(host.querySelector('.after-content'),sourceBlocks(i).find(t=>t.startsWith('Стало')).split(':').slice(1).join(':').trim(),continuing);
  const metrics=[...original.querySelectorAll('.case-metrics>div')];host.querySelectorAll('.result-row').forEach((row,j)=>{row.hidden=!metrics[j];if(!metrics[j])return;const value=metrics[j].querySelector('strong').cloneNode(true);value.querySelectorAll('[data-count]').forEach(e=>e.textContent=e.dataset.count);swapText(row.querySelector('strong'),value.textContent,continuing);swapText(row.querySelector('p'),metrics[j].querySelector('p').textContent,continuing)});
 }if(group==='cases'){host.querySelectorAll('.comparison p').forEach(el=>{let size=17;el.style.fontSize=size+'px';const available=host.querySelector('.comparison .glass').clientHeight-92;while(el.scrollHeight>available&&size>15){size-=.5;el.style.fontSize=size+'px'}});host.querySelectorAll('.result-row').forEach(row=>row.classList.toggle('result-note',row.querySelector('strong').textContent.trim().startsWith('*')))}if(!continuing)motion(host);return host}
function go(i){i=Math.max(0,Math.min(slides.length-1,i));if(i===cur)return;clearTimeout(typingTimer);counterFrames.forEach(cancelAnimationFrame);counterFrames=[];const previous=cur,oldGroup=groupOf(previous),group=groupOf(i),continuing=group&&group===oldGroup;
 if(previous>=0){slides[previous].classList.remove('active');slides[previous].querySelectorAll('video').forEach(v=>v.pause())}Object.entries(sceneHosts).forEach(([key,host])=>{if(key!==group){host.classList.remove('scene-visible');host.querySelectorAll('video').forEach(v=>v.pause())}});cur=i;const s=slides[i];document.body.classList.toggle('evidence-view',!group&&s.classList.contains('native')&&i>=18);
 if(group){renderScene(group,i,continuing)}else{s.classList.add('active');s.querySelectorAll('video').forEach(v=>{v.currentTime=0;v.play().catch(()=>{})});s.querySelectorAll('[data-count]').forEach(el=>{const target=+el.dataset.count;if(reduce){el.textContent=target;return}const start=performance.now()+500;function step(t){const k=Math.min(1,Math.max(0,(t-start)/1400));el.textContent=Math.round(target*(1-(1-k)**3));if(k<1)counterFrames.push(requestAnimationFrame(step))}counterFrames.push(requestAnimationFrame(step))});s.querySelectorAll('[data-type]').forEach(el=>{if(!el.dataset.original)el.dataset.original=el.innerHTML;const final=el.dataset.original;if(reduce){el.innerHTML=final;return}const txt=final.replace(/<br\s*\/?\s*>/gi,'\n');let k=0;el.innerHTML='';function step(){el.innerHTML=txt.slice(0,++k).replaceAll('\n','<br>')+'<span style="color:#aab8ff">▏</span>';if(k<txt.length)typingTimer=setTimeout(step,38);else el.innerHTML=final}typingTimer=setTimeout(step,400)})}
 document.querySelector('#count').textContent=`${i+1} / ${slides.length}`;document.querySelector('#progress').style.width=`${(i+1)/slides.length*100}%`;history.replaceState(null,'','#'+(i+1));document.title=`${i+1}. ${s.dataset.title} — Цифровая трансформация`}

function closeOverlays(){document.querySelectorAll('#overview,#zoom,#transcript').forEach(e=>e.classList.remove('open'))}
function overview(){const el=document.querySelector('#overview');el.classList.toggle('open')}
function full(){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen?.()}
document.querySelector('#prev').onclick=()=>go(cur-1);document.querySelector('#next').onclick=()=>go(cur+1);document.querySelector('#fs').onclick=full;document.querySelector('#grid').onclick=overview;
addEventListener('keydown',e=>{if(e.key==='Escape'){closeOverlays();return}if(e.key.toLowerCase()==='o'||e.key==='щ'){overview();return}if(document.querySelector('.open'))return;if(['ArrowRight','ArrowDown','PageDown',' ','Enter'].includes(e.key)){e.preventDefault();go(cur+1)}if(['ArrowLeft','ArrowUp','PageUp','Backspace'].includes(e.key)){e.preventDefault();go(cur-1)}if(e.key==='Home')go(0);if(e.key==='End')go(slides.length-1);if(['f','F','а','А'].includes(e.key))full()});
document.querySelector('#deck').onclick=e=>{const paper=e.target.closest('.paper');if(paper&&!paper.classList.contains('zoomable'))return;if(paper){const z=document.querySelector('#zoom');z.querySelector('.zoom-content').innerHTML=paper.innerHTML;z.classList.add('open');return}go(e.clientX<innerWidth/3?cur-1:cur+1)};
let tx,ty;addEventListener('touchstart',e=>{tx=e.touches[0].clientX;ty=e.touches[0].clientY},{passive:true});addEventListener('touchend',e=>{if(document.querySelector('.open'))return;const dx=e.changedTouches[0].clientX-tx,dy=e.changedTouches[0].clientY-ty;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy))go(cur+(dx<0?1:-1))},{passive:true});
document.querySelectorAll('.overlay-close').forEach(e=>e.onclick=closeOverlays);slides.forEach((s,i)=>{const b=document.createElement('button');b.innerHTML=`<b>${String(i+1).padStart(2,'0')}</b>`;b.append(s.dataset.title);b.onclick=()=>{closeOverlays();go(i)};document.querySelector('.overview-grid').append(b)});addEventListener('hashchange',()=>go((parseInt(location.hash.slice(1))||1)-1));go((parseInt(location.hash.slice(1))||1)-1);


// фон: летающие точки, соединённые линиями как нейросеть; живёт под всеми слайдами
(() => {
  const cv = document.getElementById('net'), ctx = cv.getContext('2d');
  const W = 1280, H = 720, N = 78, LINK = 150;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pts = Array.from({ length: N }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - .5) * .28, vy: (Math.random() - .5) * .28,
    r: 1.1 + Math.random() * 1.4
  }));
  function size() { // чёткость с учётом масштаба сцены и ретины
    const k = Math.min(innerWidth / W, innerHeight / H) * (devicePixelRatio || 1);
    cv.width = Math.round(W * k); cv.height = Math.round(H * k);
    ctx.setTransform(k, 0, 0, k, 0, 0);
  }
  addEventListener('resize', size); size();
  function frame() {
    ctx.clearRect(0, 0, W, H);
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < -20) p.x = W + 20; else if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20; else if (p.y > H + 20) p.y = -20;
    }
    ctx.lineWidth = 0.8;
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
      const a = pts[i], b = pts[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
      if (d2 < LINK * LINK) {
        ctx.strokeStyle = `rgba(150,170,255,${(1 - Math.sqrt(d2) / LINK) * 0.28})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }
    ctx.fillStyle = 'rgba(190,205,255,.75)';
    for (const p of pts) { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill(); }
    if (!reduce) requestAnimationFrame(frame);
  }
  frame();
})();

const sourceText=JSON.parse(document.querySelector('#source-text-data').textContent);document.querySelector('#text-toggle').onclick=()=>{const panel=document.querySelector('#transcript'),content=panel.querySelector('.transcript-content');content.replaceChildren();sourceText[cur].blocks.forEach(t=>{const p=document.createElement('p');p.textContent=t;content.append(p)});panel.classList.add('open')};document.querySelector('#transcript .overlay-close').onclick=closeOverlays;

