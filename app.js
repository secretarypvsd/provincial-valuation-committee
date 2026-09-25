function bootDashboard(DATA){const PROVINCES=[...new Set(DATA.map(r=>r.province))].sort((a,b)=>a.localeCompare(b,'th')); const TODAY=new Date(); TODAY.setHours(0,0,0,0);
const $=id=>document.getElementById(id); const state={province:'',expertise:'',appointedYear:'',status:'',duplicate:'',search:''};
const normExp=s=>s.includes('สถาปัตยกรรม')?'ด้านสถาปัตยกรรมหรือด้านวิศวกรรม':s;
const fmt=d=>{if(!d)return'-';const x=new Date(d+'T00:00:00');return x.toLocaleDateString('th-TH',{day:'2-digit',month:'2-digit',year:'numeric'})};
const daysLeft=r=>Math.ceil((new Date(r.expires+'T00:00:00')-TODAY)/86400000);
const statusOf=r=>{let d=daysLeft(r);return d<0?'หมดวาระแล้ว':d<=365?'ใกล้หมดวาระ':'ปกติ'};
function provinceStats(base=DATA){let m={};base.forEach(r=>{(m[r.province]??=[]).push(normExp(r.expertise))});let out={};Object.entries(m).forEach(([p,a])=>{let c={};a.forEach(x=>c[x]=(c[x]||0)+1);let dup=Object.entries(c).filter(x=>x[1]>1);let maxDup=dup.length?Math.max(...dup.map(x=>x[1])):0;out[p]={dupCount:maxDup,dup}});return out}
const PSTATS=provinceStats();
function fillSelects(){[...new Set(DATA.map(x=>x.province))].sort((a,b)=>a.localeCompare(b,'th')).forEach(x=>$('province').add(new Option(x,x)));[...new Set(DATA.map(x=>normExp(x.expertise)))].sort().forEach(x=>$('expertise').add(new Option(x,x)));[...new Set(DATA.map(x=>x.appointed&&x.appointed.slice(0,4)).filter(Boolean))].sort((a,b)=>b-a).forEach(y=>$('appointedYear').add(new Option(`พ.ศ. ${+y+543}`,y)))}
function filtered(){return DATA.filter(r=>{let ps=PSTATS[r.province]?.dupCount||0;let dm=!state.duplicate||(state.duplicate==='none'?ps===0:state.duplicate==='4plus'?ps>=4:ps===+state.duplicate);return(!state.province||r.province===state.province)&&(!state.search||r.province.includes(state.search))&&(!state.expertise||normExp(r.expertise)===state.expertise)&&(!state.appointedYear||(r.appointed&&r.appointed.slice(0,4)===state.appointedYear))&&(!state.status||statusOf(r)===state.status)&&dm})}
function renderKpis(){let normal=DATA.filter(r=>statusOf(r)==='ปกติ').length,soon=DATA.filter(r=>statusOf(r)==='ใกล้หมดวาระ').length,expired=DATA.filter(r=>statusOf(r)==='หมดวาระแล้ว').length;$('kpis').innerHTML=[['กรรมการทั้งหมด',DATA.length],['สถานะปกติ',normal],['ใกล้หมดวาระ ≤ 1 ปี',soon],['หมดวาระแล้ว',expired]].map(x=>`<div class="kpi"><div class="n">${x[1].toLocaleString()}</div><div class="t">${x[0]}</div></div>`).join('')}
function renderAlerts(){let a=DATA.filter(r=>statusOf(r)!=='ปกติ').sort((x,y)=>daysLeft(x)-daysLeft(y));$('alertCount').textContent=a.length;$('alerts').innerHTML=a.map(r=>`<div class="alert ${daysLeft(r)<0?'expired':''}"><b>${r.name}</b><br>${r.province} • ${fmt(r.expires)}<br><span>${daysLeft(r)<0?`เกินกำหนด ${Math.abs(daysLeft(r)).toLocaleString()} วัน`:`เหลือ ${daysLeft(r).toLocaleString()} วัน`}</span></div>`).join('')||'<span class="hint">ไม่มีรายการแจ้งเตือน</span>'}
let MAP_GEO=null,MAP_LOADING=false;
function mapColor(n){if(n>=4)return '#d7193f';if(n===3)return '#ff7a21';if(n===2)return '#ffc93c';return '#bfe7c6'}
function mapFallback(){let prov=[...new Set(DATA.map(r=>r.province))].sort((a,b)=>a.localeCompare(b,'th'));$('provinceMap').innerHTML='<div class="map-error">ไม่สามารถโหลดเส้นขอบแผนที่ได้ จึงแสดงรายชื่อจังหวัดแทน</div><div class="province-map-fallback">'+prov.map(p=>`<button class="province-chip ${state.province===p?'active':''}" data-p="${p}">${p}</button>`).join('')+'</div>';document.querySelectorAll('.province-chip').forEach(b=>b.onclick=()=>selectProvince(b.dataset.p))}
function selectProvince(p){state.province=state.province===p?'':p;$('province').value=state.province;render()}
function geoPaths(geom,project){let polys=geom.type==='Polygon'?[geom.coordinates]:geom.coordinates;return polys.map(poly=>poly.map(ring=>'M'+ring.map(([x,y])=>project(x,y).join(',')).join('L')+'Z').join('')).join('')}
function drawThailandMap(geo){let el=$('provinceMap'),w=620,h=650,pad=18,pts=[],activeRows=filtered(),hasFilter=!!(state.province||state.search||state.expertise||state.appointedYear||state.status||state.duplicate),visibleProvinces=new Set(activeRows.map(r=>r.province));geo.features.forEach(f=>{let g=f.geometry,c=g.type==='Polygon'?[g.coordinates]:g.coordinates;c.forEach(poly=>poly.forEach(r=>r.forEach(p=>pts.push(p))))});let xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys),scale=Math.min((w-2*pad)/(maxX-minX),(h-2*pad)/(maxY-minY)),ox=(w-(maxX-minX)*scale)/2,oy=(h-(maxY-minY)*scale)/2;let project=(x,y)=>[ox+(x-minX)*scale,h-(oy+(y-minY)*scale)];let paths=geo.features.map(f=>{let p=f.properties||{},name=p.ADM1_TH||p.NL_NAME_1||p.name_th||'',n=PSTATS[name]?.dupCount||0,active=state.province===name,visible=!hasFilter||visibleProvinces.has(name);if(!visible)return '';return `<path class="thai-province${active?' selected':''}" data-p="${name}" d="${geoPaths(f.geometry,project)}" fill="${mapColor(n)}"><title>${name} • ${n?`มีผู้ทรงซ้ำ ${n} รายในสาขาเดียวกัน`:'ไม่มีการซ้ำซ้อนของสาขา'} — คลิกเพื่อกรองข้อมูล</title></path>`}).join('');el.innerHTML=`<div class="map-shell"><svg class="thailand-svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="แผนที่ประเทศไทย 77 จังหวัด">${paths}</svg><div class="map-legend"><b>คำอธิบายสี</b><span><i style="background:#bfe7c6"></i>ไม่มีผู้ทรงซ้ำสาขา</span><span><i style="background:#ffc93c"></i>ผู้ทรงซ้ำ 2 รายในสาขาเดียวกัน</span><span><i style="background:#ff7a21"></i>ผู้ทรงซ้ำ 3 รายในสาขาเดียวกัน</span><span><i style="background:#d7193f"></i>ผู้ทรงซ้ำมากกว่า 3 รายในสาขาเดียวกัน</span></div><div class="map-selected">${state.province?'จังหวัดที่เลือก: <b>'+state.province+'</b>':'คลิกจังหวัดบนแผนที่เพื่อกรองข้อมูล'}</div></div>`;el.querySelectorAll('.thai-province').forEach(x=>x.onclick=()=>selectProvince(x.dataset.p))}
function renderMap(){
  if(!MAP_GEO) MAP_GEO=window.THAILAND_GEOJSON||null;
  if(MAP_GEO && Array.isArray(MAP_GEO.features) && MAP_GEO.features.length===77){
    drawThailandMap(MAP_GEO);
    return;
  }
  mapFallback();
}
function renderQuickKpis(rows=DATA){
  const currentYear=new Date().getFullYear();
  const expiringThisYear=rows.filter(r=>new Date(r.expires+'T00:00:00').getFullYear()===currentYear).length;
  $('quickKpis').innerHTML=`
    <div class="quick-kpi total"><div class="icon">👥</div><div><strong>${rows.length.toLocaleString()}</strong><span>จำนวนคณะกรรมการผู้ทรงคุณวุฒิฯ</span></div></div>
    <div class="quick-kpi expiring"><div class="icon">⏳</div><div><strong>${expiringThisYear.toLocaleString()}</strong><span>ครบวาระในปี พ.ศ. ${currentYear+543}</span></div></div>`;
}
function showSuggestions(q){
  const box=$('provinceSuggestions');
  q=q.trim();
  if(!q){box.hidden=true;box.innerHTML='';return}
  const matches=PROVINCES.filter(p=>p.includes(q)).slice(0,8);
  box.innerHTML=matches.map(p=>`<div class="suggestion" data-province="${p}">${p}</div>`).join('');
  box.hidden=!matches.length;
  box.querySelectorAll('.suggestion').forEach(el=>el.onclick=()=>{
    const p=el.dataset.province;
    $('searchProvince').value=p;
    state.search=p;
    state.province=p;
    $('province').value=p;
    box.hidden=true;
    render();
  });
}
function renderDup(rows=DATA){
  const provinces=[...new Set(rows.map(r=>r.province))];
  const entries=provinces.map(p=>[p,PSTATS[p]||{dupCount:0,dup:[]}]);
  const counts={none:entries.filter(x=>x[1].dupCount===0).length,two:entries.filter(x=>x[1].dupCount===2).length,three:entries.filter(x=>x[1].dupCount===3).length,more:entries.filter(x=>x[1].dupCount>=4).length};
  $('dupSummary').innerHTML=[['s0',counts.none,'ไม่ซ้ำสาขา'],['s2',counts.two,'ซ้ำ 2 ราย'],['s3',counts.three,'ซ้ำ 3 ราย'],['s4',counts.more,'มากกว่า 3 ราย']].map(x=>`<div class="summary ${x[0]}"><strong>${x[1]}</strong>${x[2]}</div>`).join('');
  $('dupTable').innerHTML=entries.sort((a,b)=>b[1].dupCount-a[1].dupCount||a[0].localeCompare(b[0],'th')).map(([p,s])=>`<tr><td>${p}</td><td>${s.dupCount===0?'ไม่ซ้ำสาขา':`ซ้ำ ${s.dupCount} ราย`}</td><td>${s.dup.length?s.dup.map(x=>`${x[0].replace('ด้าน','')} (${x[1]} คน)`).join('<br>'):'—'}</td></tr>`).join('')||'<tr><td colspan="3">ไม่พบข้อมูลจังหวัดตามตัวกรอง</td></tr>';
}
function renderYears(rows){let m={};rows.forEach(r=>{let a=new Date(r.appointed).getFullYear()+543,e=new Date(r.expires).getFullYear()+543;(m[a]??={a:0,e:0}).a++;(m[e]??={a:0,e:0}).e++});let max=Math.max(1,...Object.values(m).flatMap(x=>[x.a,x.e]));$('yearChart').innerHTML=Object.keys(m).sort().map(y=>`<div class="bar-row"><span>พ.ศ. ${y}</span><div><div class="bar-track" title="แต่งตั้ง ${m[y].a}"><div class="bar-fill" style="width:${m[y].a/max*100}%"></div></div><div class="bar-track" style="margin-top:3px" title="ครบวาระ ${m[y].e}"><div class="bar-fill" style="width:${m[y].e/max*100}%;background:linear-gradient(90deg,#d9b8dc,#e5c5b4)"></div></div></div><b>${m[y].a}/${m[y].e}</b></div>`).join('')+'<p class="hint">ตัวเลขด้านขวา = แต่งตั้ง / ครบวาระ</p>'}
function renderExpert(rows){let m={};rows.forEach(r=>m[normExp(r.expertise)]=(m[normExp(r.expertise)]||0)+1);let colors=['#9fcdb6','#a8c9dc','#c7b5dd','#e3b6a4'];let total=Object.values(m).reduce((a,b)=>a+b,0)||1,acc=0,stops=[];Object.values(m).forEach((v,i)=>{let s=acc/total*360;acc+=v;let e=acc/total*360;stops.push(`${colors[i%colors.length]} ${s}deg ${e}deg`)});$('expertChart').innerHTML=`<div class="donut-wrap"><div class="donut" style="background:conic-gradient(${stops.join(',')})"></div><div class="legend">${Object.entries(m).map(([k,v],i)=>`<div><span class="dot" style="background:${colors[i%colors.length]}"></span>${k.replace('ด้าน','')} <b>${v}</b> (${(v/total*100).toFixed(1)}%)</div>`).join('')}</div></div>`}
function renderTable(rows){$('rowCount').textContent=rows.length;$('mainTable').innerHTML=rows.map((r,i)=>{let s=statusOf(r),d=daysLeft(r),cls=s==='ปกติ'?'normal':s==='ใกล้หมดวาระ'?'soon':'expired';return `<tr><td>${i+1}</td><td>${r.province}</td><td><b>${r.name}</b></td><td>${normExp(r.expertise)}</td><td>${fmt(r.appointed)}</td><td>${fmt(r.expires)}</td><td>${d.toLocaleString()}</td><td><span class="status-pill status-${cls}">${s}</span></td></tr>`}).join('')||'<tr><td colspan="8">ไม่พบข้อมูลตามตัวกรอง</td></tr>'}
function render(){let rows=filtered();renderMap();renderQuickKpis(rows);renderDup(rows);renderYears(rows);renderExpert(rows);renderTable(rows)}
function clearAll(){Object.keys(state).forEach(k=>state[k]='');['searchProvince','province','expertise','appointedYear','status','duplicate'].forEach(id=>$(id).value='');render()}
fillSelects();render();
$('searchProvince').oninput=e=>{state.search=e.target.value.trim();state.province='';$('province').value='';showSuggestions(state.search);render()};$('searchProvince').onfocus=e=>showSuggestions(e.target.value);document.addEventListener('click',e=>{if(!e.target.closest('.search-wrap'))$('provinceSuggestions').hidden=true});['province','expertise','appointedYear','status','duplicate'].forEach(id=>$(id).onchange=e=>{state[id]=e.target.value;render()});$('clear').onclick=clearAll;

}

const GOOGLE_SHEET_ID='1nKmFlpb92ksITl1OVeMtjxfgYYZC63OjPImJ95L_JKs';
const GOOGLE_SHEET_GID='513917908';
const GOOGLE_SHEET_CSV=`https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv&gid=${GOOGLE_SHEET_GID}`;
function parseCSV(text){const rows=[];let row=[],cell='',q=false;for(let i=0;i<text.length;i++){const c=text[i],n=text[i+1];if(c==='"'&&q&&n==='"'){cell+='"';i++;continue}if(c==='"'){q=!q;continue}if(c===','&&!q){row.push(cell);cell='';continue}if((c==='\n'||c==='\r')&&!q){if(c==='\r'&&n==='\n')i++;row.push(cell);if(row.some(v=>v!==''))rows.push(row);row=[];cell='';continue}cell+=c}if(cell||row.length){row.push(cell);rows.push(row)}return rows}
function sheetDate(v){if(!v)return '';v=String(v).trim();let m=v.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);if(m){let y=+m[3];if(y>2400)y-=543;return `${y}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`}const months={มกราคม:1,กุมภาพันธ์:2,มีนาคม:3,เมษายน:4,พฤษภาคม:5,มิถุนายน:6,กรกฎาคม:7,สิงหาคม:8,กันยายน:9,ตุลาคม:10,พฤศจิกายน:11,ธันวาคม:12};let c=v.replace(/^วัน[^,]*,\s*/,'').replace(/,/g,' ').replace(/\s+/g,' ').trim(),a=c.split(' '),i=a.findIndex(x=>months[x]);if(i>=0){let d=+(a[i+1]||0),y=+(a[i+2]||0);if(y>2400)y-=543;if(d&&y)return `${y}-${String(months[a[i]]).padStart(2,'0')}-${String(d).padStart(2,'0')}`}return ''}
async function loadLiveData(){const r=await fetch(GOOGLE_SHEET_CSV,{cache:'no-store'});if(!r.ok)throw new Error(`HTTP ${r.status}`);const rows=parseCSV(await r.text());const data=rows.slice(1).filter(r=>r[1]&&r[2]).map((r,i)=>({id:Number(r[0])||i+1,province:(r[1]||'').trim(),name:(r[2]||'').replace(/\s+/g,' ').trim(),qualification:(r[3]||'').replace(/\s+/g,' ').trim(),expertise:(r[4]||'').replace(/\s+/g,' ').trim(),appointed:sheetDate(r[5]),expires:sheetDate(r[6])}));if(!data.length)throw new Error('No rows');return data}
loadLiveData().then(bootDashboard).catch(err=>{console.error(err);document.body.insertAdjacentHTML('afterbegin','<div style="position:fixed;z-index:10000;top:8px;left:50%;transform:translateX(-50%);background:#fff3cd;color:#664d03;border:1px solid #ffecb5;padding:10px 16px;border-radius:10px;font:14px sans-serif">ไม่สามารถโหลดข้อมูล Google Sheet ได้ กรุณาตรวจสอบสิทธิ์การแชร์</div>')});
