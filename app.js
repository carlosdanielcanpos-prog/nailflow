const KEY="nailflow_v1";
const defaultData={
 clients:[],
 appointments:[],
 materials:[],
 services:[
  {id:"s1",name:"Manicure simples",price:25},
  {id:"s2",name:"Esmaltação comum",price:25},
  {id:"s3",name:"Esmaltação em gel",price:42},
  {id:"s4",name:"Spa das mãos",price:32},
  {id:"s5",name:"Banho de gel",price:60},
  {id:"s6",name:"Alongamento em gel",price:100},
  {id:"s7",name:"Alongamento em fibra",price:110},
  {id:"s8",name:"Manutenção do alongamento",price:75},
  {id:"s9",name:"Remoção do alongamento",price:32}
 ]};
let data=JSON.parse(localStorage.getItem(KEY)||"null")||defaultData;
function save(){localStorage.setItem(KEY,JSON.stringify(data));refresh();}
function money(n){return Number(n||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}
function uid(p="id"){return p+"_"+Date.now()+"_"+Math.random().toString(16).slice(2)}
function showPage(page){
 document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));
 document.getElementById(page).classList.add("active");
 document.querySelectorAll(".nav-btn").forEach(x=>x.classList.toggle("active",x.dataset.page===page));
 const titles={inicio:["Início","Controle seu atendimento em um só lugar."],agenda:["Agenda","Veja e gerencie seus próximos atendimentos."],clientes:["Clientes","Histórico e informações das suas clientes."],precificacao:["Precificação","Monte o serviço e veja o preço sugerido."],materiais:["Materiais","Cadastre seus produtos e acompanhe os custos."]};
 document.getElementById("page-title").textContent=titles[page][0];
 document.getElementById("page-subtitle").textContent=titles[page][1];
}
document.querySelectorAll(".nav-btn").forEach(b=>b.onclick=()=>showPage(b.dataset.page));
function openModal(html){document.getElementById("modalContent").innerHTML=html;document.getElementById("modal").classList.remove("hidden")}
function closeModal(){document.getElementById("modal").classList.add("hidden")}
document.getElementById("modal").addEventListener("click",e=>{if(e.target.id==="modal")closeModal()});

function openClientModal(id=null){
 const c=data.clients.find(x=>x.id===id)||{};
 openModal(`<h2>${id?"Editar cliente":"Nova cliente"}</h2>
 <label>Nome</label><input id="fName" value="${esc(c.name||"")}">
 <label>WhatsApp</label><input id="fPhone" value="${esc(c.phone||"")}" placeholder="(67) 99999-9999">
 <label>Observações</label><textarea id="fNotes" rows="3">${esc(c.notes||"")}</textarea>
 <div class="form-actions"><button class="ghost" onclick="closeModal()">Cancelar</button><button class="primary" onclick="saveClient('${id||""}')">Salvar</button></div>`);
}
function saveClient(id){
 const obj={id:id||uid("cli"),name:document.getElementById("fName").value.trim(),phone:document.getElementById("fPhone").value.trim(),notes:document.getElementById("fNotes").value.trim()};
 if(!obj.name)return alert("Digite o nome da cliente.");
 if(id)data.clients=data.clients.map(x=>x.id===id?obj:x);else data.clients.push(obj);
 closeModal();save();showPage("clientes");
}
function deleteClient(id){if(confirm("Excluir esta cliente?")){data.clients=data.clients.filter(x=>x.id!==id);save()}}
function clientName(id){return data.clients.find(x=>x.id===id)?.name||"Cliente removida"}

function openAppointmentModal(id=null){
 const a=data.appointments.find(x=>x.id===id)||{};
 const clients=data.clients.map(c=>`<option value="${c.id}" ${c.id===a.clientId?"selected":""}>${esc(c.name)}</option>`).join("");
 const services=data.services.map(s=>`<option value="${s.id}" ${s.id===a.serviceId?"selected":""}>${esc(s.name)} — ${money(s.price)}</option>`).join("");
 const d=a.date||new Date().toISOString().slice(0,10);
 openModal(`<h2>${id?"Editar agendamento":"Novo agendamento"}</h2>
 <label>Cliente</label><select id="aClient">${clients||'<option value="">Cadastre uma cliente primeiro</option>'}</select>
 <label>Data</label><input id="aDate" type="date" value="${d}">
 <label>Horário</label><input id="aTime" type="time" value="${a.time||"09:00"}">
 <label>Serviço principal</label><select id="aService">${services}</select>
 <label>Esmaltação</label><select id="aPolish"><option value="0">Sem</option><option value="10" ${a.polish==10?"selected":""}>Comum + R$10</option><option value="20" ${a.polish==20?"selected":""}>Gel + R$20</option></select>
 <label>Decoração</label><select id="aDecoration"><option value="0">Sem</option><option value="7" ${a.decoration==7?"selected":""}>Simples + R$7</option><option value="20" ${a.decoration==20?"selected":""}>Elaborada + R$20</option><option value="12" ${a.decoration==12?"selected":""}>Pedrarias + R$12</option></select>
 <label>Extras</label><input id="aExtras" type="number" value="${a.extras||0}" min="0">
 <label>Observações</label><textarea id="aNotes" rows="2">${esc(a.notes||"")}</textarea>
 <div class="form-actions"><button class="ghost" onclick="closeModal()">Cancelar</button><button class="primary" onclick="saveAppointment('${id||""}')">Salvar</button></div>`);
}
function saveAppointment(id){
 const service=data.services.find(s=>s.id===document.getElementById("aService").value);
 const obj={id:id||uid("apt"),clientId:document.getElementById("aClient").value,date:document.getElementById("aDate").value,time:document.getElementById("aTime").value,serviceId:service?.id||"",polish:+document.getElementById("aPolish").value,decoration:+document.getElementById("aDecoration").value,extras:+document.getElementById("aExtras").value||0,notes:document.getElementById("aNotes").value,status:data.appointments.find(x=>x.id===id)?.status||"Agendado"};
 if(!obj.clientId)return alert("Cadastre uma cliente primeiro.");
 if(id)data.appointments=data.appointments.map(x=>x.id===id?obj:x);else data.appointments.push(obj);
 closeModal();save();showPage("agenda");
}
function deleteAppointment(id){if(confirm("Excluir este agendamento?")){data.appointments=data.appointments.filter(x=>x.id!==id);save()}}
function toggleDone(id){data.appointments=data.appointments.map(x=>x.id===id?{...x,status:x.status==="Realizado"?"Agendado":"Realizado"}:x);save()}
function appointmentPrice(a){return (data.services.find(s=>s.id===a.serviceId)?.price||0)+(+a.polish||0)+(+a.decoration||0)+(+a.extras||0)}
function formatDate(d){if(!d)return "";return new Date(d+"T12:00:00").toLocaleDateString("pt-BR",{weekday:"short",day:"2-digit",month:"2-digit"})}

function renderAgenda(){
 const q=(document.getElementById("agendaSearch")?.value||"").toLowerCase();
 const arr=[...data.appointments].filter(a=>clientName(a.clientId).toLowerCase().includes(q)).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
 document.getElementById("agendaList").innerHTML=arr.length?arr.map(a=>`<div class="appointment">
 <div class="date">${formatDate(a.date)} • ${a.time}</div><h3>${esc(clientName(a.clientId))}</h3>
 <div class="muted">${esc(data.services.find(s=>s.id===a.serviceId)?.name||"Serviço")} • ${money(appointmentPrice(a))}</div>
 <div><span class="tag">${a.status}</span>${a.polish?` <span class="tag">Esmaltação</span>`:""}${a.decoration?` <span class="tag">Decoração</span>`:""}</div>
 ${a.notes?`<p class="muted">${esc(a.notes)}</p>`:""}
 <div class="actions"><button class="ghost" onclick="toggleDone('${a.id}')">${a.status==="Realizado"?"↩ Reabrir":"✓ Realizado"}</button><button class="ghost" onclick="openAppointmentModal('${a.id}')">Editar</button><button class="ghost danger" onclick="deleteAppointment('${a.id}')">Excluir</button></div>
 </div>`).join(""):'<div class="empty">Nenhum agendamento encontrado.</div>';
}
function renderClients(){
 const q=(document.getElementById("clientSearch")?.value||"").toLowerCase();
 const arr=data.clients.filter(c=>c.name.toLowerCase().includes(q));
 document.getElementById("clientList").innerHTML=arr.length?arr.map(c=>{let hist=data.appointments.filter(a=>a.clientId===c.id).sort((a,b)=>b.date.localeCompare(a.date));return `<div class="client-card"><div class="avatar">${esc(c.name[0].toUpperCase())}</div><h3>${esc(c.name)}</h3><div class="muted">${esc(c.phone||"Sem telefone")}</div><p class="muted">${hist.length} atendimento(s)</p><div class="actions"><button class="ghost" onclick="showClient('${c.id}')">Ver ficha</button><button class="ghost" onclick="openClientModal('${c.id}')">Editar</button><button class="ghost danger" onclick="deleteClient('${c.id}')">Excluir</button></div></div>`}).join(""):'<div class="empty">Nenhuma cliente cadastrada.</div>';
}
function showClient(id){
 const c=data.clients.find(x=>x.id===id), hist=data.appointments.filter(a=>a.clientId===id).sort((a,b)=>(b.date+b.time).localeCompare(a.date+a.time));
 openModal(`<h2>${esc(c.name)}</h2><p class="muted">${esc(c.phone||"Sem telefone")}</p><p>${esc(c.notes||"Sem observações.")}</p><hr><h3>Histórico</h3>${hist.length?hist.map(a=>`<div class="item"><div><b>${formatDate(a.date)} • ${a.time}</b><span class="muted">${esc(data.services.find(s=>s.id===a.serviceId)?.name||"Serviço")}</span></div><strong>${money(appointmentPrice(a))}</strong></div>`).join(""):'<p class="muted">Ainda não há atendimentos.</p>'}<div class="form-actions"><button class="primary" onclick="closeModal();openAppointmentModal()">+ Novo atendimento</button></div>`);
}

function openMaterialModal(id=null){
 const m=data.materials.find(x=>x.id===id)||{};
 openModal(`<h2>${id?"Editar material":"Novo material"}</h2><label>Material</label><input id="mName" value="${esc(m.name||"")}" placeholder="Ex.: Gel construtor"><label>Valor pago</label><input id="mPrice" type="number" step=".01" value="${m.price||""}"><label>Quantidade/volume</label><input id="mQty" value="${esc(m.qty||"")}" placeholder="Ex.: 30g"><div class="form-actions"><button class="ghost" onclick="closeModal()">Cancelar</button><button class="primary" onclick="saveMaterial('${id||""}')">Salvar</button></div>`);
}
function saveMaterial(id){
 const obj={id:id||uid("mat"),name:document.getElementById("mName").value.trim(),price:+document.getElementById("mPrice").value||0,qty:document.getElementById("mQty").value.trim()};
 if(!obj.name)return alert("Digite o nome do material.");
 if(id)data.materials=data.materials.map(x=>x.id===id?obj:x);else data.materials.push(obj);
 closeModal();save();showPage("materiais");
}
function deleteMaterial(id){if(confirm("Excluir este material?")){data.materials=data.materials.filter(x=>x.id!==id);save()}}

function openServiceModal(id=null){
 const s=data.services.find(x=>x.id===id)||{};
 openModal(`<h2>${id?"Editar serviço":"Novo serviço"}</h2><label>Nome</label><input id="sName" value="${esc(s.name||"")}"><label>Preço médio</label><input id="sPrice" type="number" step=".01" value="${s.price||""}"><div class="form-actions"><button class="ghost" onclick="closeModal()">Cancelar</button><button class="primary" onclick="saveService('${id||""}')">Salvar</button></div>`);
}
function saveService(id){
 const obj={id:id||uid("srv"),name:document.getElementById("sName").value.trim(),price:+document.getElementById("sPrice").value||0};
 if(!obj.name)return alert("Digite o nome.");
 if(id)data.services=data.services.map(x=>x.id===id?obj:x);else data.services.push(obj);
 closeModal();save();
}
function deleteService(id){if(confirm("Excluir este serviço?")){data.services=data.services.filter(x=>x.id!==id);save()}}
function calculatePrice(){
 const s=data.services.find(x=>x.id===document.getElementById("calcService").value);
 const total=(s?.price||0)+(+document.getElementById("calcPolish").value||0)+(+document.getElementById("calcDecoration").value||0)+(+document.getElementById("calcExtras").value||0);
 document.getElementById("calcResult").textContent=money(total);
}
function renderPricing(){
 document.getElementById("calcService").innerHTML=data.services.map(s=>`<option value="${s.id}">${esc(s.name)} — ${money(s.price)}</option>`).join("");
 document.getElementById("serviceList").innerHTML=data.services.map(s=>`<div class="service-row"><div><b>${esc(s.name)}</b><span class="muted">Preço médio</span></div><div><input type="number" value="${s.price}" onchange="changeServicePrice('${s.id}',this.value)"><button class="ghost danger" onclick="deleteService('${s.id}')">×</button></div></div>`).join("");
 calculatePrice();
}
function changeServicePrice(id,v){const s=data.services.find(x=>x.id===id);if(s){s.price=+v||0;save()}}

function renderMaterials(){
 const q=(document.getElementById("materialSearch")?.value||"").toLowerCase();
 const arr=data.materials.filter(m=>m.name.toLowerCase().includes(q));
 document.getElementById("materialList").innerHTML=arr.length?arr.map(m=>`<div class="material-card"><div class="avatar">📦</div><h3>${esc(m.name)}</h3><div class="muted">${esc(m.qty||"Quantidade não informada")}</div><strong>${money(m.price)}</strong><div class="actions"><button class="ghost" onclick="openMaterialModal('${m.id}')">Editar</button><button class="ghost danger" onclick="deleteMaterial('${m.id}')">Excluir</button></div></div>`).join(""):'<div class="empty">Nenhum material cadastrado.</div>';
}
function renderHome(){
 const today=new Date().toISOString().slice(0,10);
 const todayA=data.appointments.filter(a=>a.date===today);
 const upcoming=data.appointments.filter(a=>(a.date+a.time)>=new Date().toISOString().slice(0,16).replace("T","")).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
 document.getElementById("todayCount").textContent=todayA.length;
 document.getElementById("clientCount").textContent=data.clients.length;
 document.getElementById("materialCount").textContent=data.materials.length;
 document.getElementById("nextCount").textContent=upcoming.length;
 document.getElementById("homeAppointments").innerHTML=upcoming.slice(0,5).map(a=>`<div class="item"><div><b>${esc(clientName(a.clientId))}</b><span class="muted">${formatDate(a.date)} • ${a.time} • ${esc(data.services.find(s=>s.id===a.serviceId)?.name||"Serviço")}</span></div><strong>${money(appointmentPrice(a))}</strong></div>`).join("")||'<div class="empty">Nenhum atendimento próximo.</div>';
}
function refresh(){renderHome();renderAgenda();renderClients();renderPricing();renderMaterials()}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
refresh();
