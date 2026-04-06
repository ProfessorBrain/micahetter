(function(){
  const $ = (id)=>document.getElementById(id);

  function openDrawer(){
    const o=$("drawerOverlay"), d=$("drawer");
    if(o) o.style.display="block";
    if(d) d.classList.add("open");
  }
  function closeDrawer(){
    const o=$("drawerOverlay"), d=$("drawer");
    if(o) o.style.display="none";
    if(d) d.classList.remove("open");
  }

  const btnMenu=$("btnMenu");
  const overlay=$("drawerOverlay");
  const btnClose=$("btnMenuClose");

  if(btnMenu) btnMenu.addEventListener("click", openDrawer);
  if(overlay) overlay.addEventListener("click", closeDrawer);
  if(btnClose) btnClose.addEventListener("click", closeDrawer);

  window.addEventListener("keydown", (e)=>{ if(e.key==="Escape") closeDrawer(); });

  // Search -> redirect to library with query
  const q=$("q_page"), q_m=$("q_page_m");
  const go = (val)=>{
    const s=(val||"").trim();
    if(!s) return;
    const u=new URL("index.html", window.location.href);
    u.searchParams.set("q", s);
    window.location.href = u.toString();
  };

  const wire = (el)=>{
    if(!el) return;
    el.addEventListener("keydown", (e)=>{
      if(e.key==="Enter"){ e.preventDefault(); go(el.value); }
    });
  };
  wire(q); wire(q_m);
  const btn=$("btnSearchGo"), btnm=$("btnSearchGo_m");
  if(btn) btn.addEventListener("click", ()=>go(q.value));
  if(btnm) btnm.addEventListener("click", ()=>go(q_m.value));
})();
