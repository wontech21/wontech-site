/* ════════════════════════════════════════════════════════════
   WONTech site — shared behavior (multi-page)
   ════════════════════════════════════════════════════════════ */

/* ── CONFIG ─────────────────────────────────────────────────
   Where the diagnostic questionnaire POSTs. The Flask backend
   (route: /admin/api/diagnostic/submit) must be publicly hosted
   and CORS-allow https://wontech.info for this to succeed.
   Until then, submissions fall back to an email to won@wontech.info
   so no lead is lost. Update this to the live API origin when ready. */
var DIAGNOSTIC_ENDPOINT = "https://api.wontech.info/admin/api/diagnostic/submit";

/* ── Email (assembled in JS to dodge scrapers) ───────────── */
(function(){
  var f='won'+String.fromCharCode(64)+'wontech.info';
  var fe=document.getElementById('footerEmail');
  if(fe){fe.href='mai'+'lto:'+f;fe.textContent=f;}
  var ci=document.getElementById('ctaInfo');
  if(ci){ci.href='mai'+'lto:'+f+'?subject=WONTech%20Information%20Request';}
})();

/* ── Nav scroll + theme inversion (homepage only) ────────── */
var nav=document.getElementById('nav');
var hero=document.querySelector('.hero');
var heroH=window.innerHeight;
window.addEventListener('resize',function(){heroH=window.innerHeight});
window.addEventListener('scroll',function(){
  if(nav)nav.classList.toggle('scrolled',window.scrollY>60);
  if(hero)document.body.classList.toggle('light',window.scrollY>heroH*0.85);
});

/* ── Mobile menu ─────────────────────────────────────────── */
(function(){
  var toggle=document.querySelector('.mobile-toggle');
  var menu=document.getElementById('mm');
  if(toggle&&menu){
    toggle.addEventListener('click',function(){menu.classList.add('open')});
    menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){menu.classList.remove('open')})});
    var close=menu.querySelector('.mobile-close');
    if(close)close.addEventListener('click',function(){menu.classList.remove('open')});
  }
})();

/* ── Cursor glow ─────────────────────────────────────────── */
(function(){
  var glow=document.getElementById('cursorGlow');
  if(!glow)return;
  var gx=0,gy=0,cx=0,cy=0;
  document.addEventListener('mousemove',function(e){gx=e.clientX;gy=e.clientY});
  (function ag(){cx+=(gx-cx)*.07;cy+=(gy-cy)*.07;glow.style.left=cx+'px';glow.style.top=cy+'px';requestAnimationFrame(ag)})();
})();

/* ── Floating particles ──────────────────────────────────── */
(function(){
  var pc=document.getElementById('particles');
  if(!pc)return;
  for(var i=0;i<20;i++){var p=document.createElement('div');p.classList.add('particle');p.style.left=Math.random()*100+'%';p.style.animationDuration=(10+Math.random()*18)+'s';p.style.animationDelay=Math.random()*12+'s';var s=(1+Math.random()*1.5)+'px';p.style.width=s;p.style.height=s;pc.appendChild(p)}
})();

/* ── Scroll reveals ──────────────────────────────────────── */
var obs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting)e.target.classList.add('v')})},{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.r,.rl,.rr,.rs').forEach(function(el){obs.observe(el)});

/* ── Count-up stats ──────────────────────────────────────── */
function initCounter(el){
  var cObs=new IntersectionObserver(function(entries){entries.forEach(function(entry){
    if(!entry.isIntersecting)return;
    var t=parseFloat(el.dataset.target),sf=el.dataset.suffix||'',pr=el.dataset.prefix||'',dur=2200,st=performance.now();
    function u(now){var prog=Math.min((now-st)/dur,1),ease=1-Math.pow(1-prog,4),cur=t*ease;el.textContent=pr+(t%1!==0?cur.toFixed(1):Math.round(cur))+sf;if(prog<1)requestAnimationFrame(u)}
    requestAnimationFrame(u);cObs.unobserve(el)})},{threshold:0.5});
  cObs.observe(el);
}
document.querySelectorAll('.stat-val[data-target]').forEach(function(el){initCounter(el)});

/* ── Smooth scroll for in-page anchors ───────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){var id=a.getAttribute('href');if(id.length<2)return;var t=document.querySelector(id);if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'})}})});

/* ── Demo frame fluid mouse tilt ─────────────────────────── */
(function(){
  var frames=document.querySelectorAll('.demo-frame');
  frames.forEach(function(frame){
    var wrap=frame.closest('.demo-wrap');
    if(!wrap)return;
    var tX=4,tY=-6,tS=.92;
    var curX=tY,curY=tX,curS=tS;
    var hovering=false;
    function lerp(a,b,t){return a+(b-a)*t}
    (function animate(){
      curX=lerp(curX,tY,.06);curY=lerp(curY,tX,.06);curS=lerp(curS,tS,.06);
      frame.style.transform='rotateX('+curY.toFixed(2)+'deg) rotateY('+curX.toFixed(2)+'deg) scale('+curS.toFixed(3)+')';
      requestAnimationFrame(animate);
    })();
    wrap.addEventListener('mouseenter',function(){hovering=true;tS=.97});
    wrap.addEventListener('mouseleave',function(){hovering=false;tX=4;tY=-6;tS=.92});
    wrap.addEventListener('mousemove',function(e){
      if(!hovering)return;
      var rect=wrap.getBoundingClientRect();
      var px=(e.clientX-rect.left)/rect.width;
      var py=(e.clientY-rect.top)/rect.height;
      tY=(px-.5)*-14;tX=(py-.5)*8;
    });
  });
})();

/* ════════════════════════════════════════════════════════════
   DIAGNOSTIC QUESTIONNAIRE  (only active on diagnostic.html)
   ════════════════════════════════════════════════════════════ */
var currentPanel=0;
var panels=['panelA','panelB','panelC','panelD'];
var tabs=document.querySelectorAll('.q-tab');

function showPanel(idx){
  currentPanel=idx;
  panels.forEach(function(id,i){
    var p=document.getElementById(id);if(p)p.classList.toggle('active',i===idx);
    if(tabs[i])tabs[i].classList.toggle('active',i===idx);
  });
  var prev=document.getElementById('qPrev');if(prev)prev.style.visibility=idx===0?'hidden':'visible';
  var nextBtn=document.getElementById('qNext');
  if(nextBtn){
    if(idx===panels.length-1){nextBtn.textContent='Submit Questionnaire';nextBtn.onclick=function(){submitQ()};}
    else{nextBtn.innerHTML='Next Section &#8594;';nextBtn.onclick=function(){navPanel(1)};}
  }
  var prog=document.getElementById('qProgress');if(prog)prog.textContent='Section '+(idx+1)+' of '+panels.length;
  var t=document.getElementById('qTabs');if(t)t.scrollIntoView({behavior:'smooth',block:'start'});
}
function navPanel(dir){
  var next=currentPanel+dir;
  if(next>=0&&next<panels.length){
    if(dir>0&&tabs[currentPanel])tabs[currentPanel].classList.add('completed');
    showPanel(next);
  }
}
function addToolRow(){
  var tbody=document.getElementById('toolRows');if(!tbody)return;
  var tr=document.createElement('tr');
  for(var i=0;i<5;i++){var td=document.createElement('td');var inp=document.createElement('input');td.appendChild(inp);tr.appendChild(td)}
  tbody.appendChild(tr);
}

function collectPayload(){
  var contact=document.querySelector('.q-contact');
  var cInputs=contact?contact.querySelectorAll('.q-input'):[];
  var payload={
    company_name:cInputs[0]?cInputs[0].value:'',
    contact_name:cInputs[1]?cInputs[1].value:'',
    contact_role:cInputs[2]?cInputs[2].value:'',
    contact_phone:cInputs[3]?cInputs[3].value:'',
    contact_email:cInputs[4]?cInputs[4].value:'',
    industry:cInputs[5]?cInputs[5].value:'',
    years_in_business:cInputs[6]?cInputs[6].value:'',
    num_locations:cInputs[7]?cInputs[7].value:'',
    responses:{}
  };
  var r=payload.responses;
  r.referral_source=cInputs[8]?cInputs[8].value:'';
  r.decision_makers=cInputs[9]?cInputs[9].value:'';
  panels.forEach(function(panelId){
    var panel=document.getElementById(panelId);if(!panel)return;
    panel.querySelectorAll('.q-field').forEach(function(field){
      var label=field.querySelector('.q-label');
      var input=field.querySelector('.q-input')||field.querySelector('.q-textarea')||field.querySelector('.q-select');
      if(label&&input){
        var key=label.textContent.trim().substring(0,60).toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/_+$/,'');
        r[key]=input.value||'';
      }
    });
  });
  var tools=[];
  document.querySelectorAll('#toolRows tr').forEach(function(tr){
    var tds=tr.querySelectorAll('input');
    if(tds[1]&&tds[1].value.trim()){
      tools.push({category:tds[0]?tds[0].value:'',name:tds[1]?tds[1].value:'',purpose:tds[2]?tds[2].value:'',users:tds[3]?tds[3].value:'',cost_per_month:tds[4]?tds[4].value:''});
    }
  });
  r.tools=tools;
  return payload;
}

function showQSuccess(){
  document.querySelectorAll('.q-panel,.q-tabs,.q-nav,.q-contact,.q-intro,.q-header').forEach(function(el){el.style.display='none'});
  var s=document.getElementById('qSuccess');if(s)s.classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
}

/* Graceful fallback: if the backend is unreachable, email the core
   contact details to WONTech so the lead is never lost. */
function emailFallback(payload){
  var to='won'+String.fromCharCode(64)+'wontech.info';
  var subject='New diagnostic request — '+(payload.company_name||'(no company)');
  var lines=[
    'A diagnostic questionnaire was submitted but the live backend could not be reached.',
    'Core contact details below; please follow up.','',
    'Company: '+payload.company_name,
    'Name: '+payload.contact_name,
    'Role: '+payload.contact_role,
    'Phone: '+payload.contact_phone,
    'Email: '+payload.contact_email,
    'Industry: '+payload.industry,
    'Years in business: '+payload.years_in_business,
    'Locations: '+payload.num_locations,
    'Heard about us: '+(payload.responses?payload.responses.referral_source:'')
  ];
  var href='mailto:'+to+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(lines.join('\n'));
  var a=document.createElement('a');a.href=href;document.body.appendChild(a);a.click();document.body.removeChild(a);
}

function submitQ(){
  var payload=collectPayload();
  if(!payload.company_name.trim()){alert('Please enter your company name.');return;}
  if(!payload.contact_email.trim()){alert('Please enter your email.');return;}
  var nextBtn=document.getElementById('qNext');
  if(nextBtn){nextBtn.disabled=true;nextBtn.textContent='Submitting...';}

  fetch(DIAGNOSTIC_ENDPOINT,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(payload)
  })
  .then(function(resp){return resp.json().catch(function(){return {};});})
  .then(function(data){
    if(data&&data.success){showQSuccess();}
    else{throw new Error(data&&data.error?data.error:'no success flag');}
  })
  .catch(function(){
    // Backend unreachable or error — fall back to email so the lead survives.
    emailFallback(payload);
    var note=document.getElementById('qFallbackNote');if(note)note.style.display='block';
    showQSuccess();
  });
}

/* Trigger diagnostic entrance animations on load */
(function(){
  var dp=document.querySelector('.diag-page');
  if(dp)requestAnimationFrame(function(){dp.classList.add('loaded')});
})();
