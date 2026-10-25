/* ===== anonymous gameplay events (ADR-001): no cookies, no PII; silent when no endpoint is configured ===== */
var A = (function(){
  function C(){ return typeof CONFIG !== 'undefined' ? CONFIG : {}; }
  var sid = Math.random().toString(36).slice(2, 10), d = null, q = [], t0 = Date.now(), timer = null;
  try { d = localStorage.getItem('bakhi.d'); if (!d) { d = Math.random().toString(36).slice(2, 12); localStorage.setItem('bakhi.d', d); } } catch (e) {}
  function flush(){ var url = C().analyticsUrl || '', key = C().analyticsKey || ''; if (!url || !q.length) return; var body = JSON.stringify(q.splice(0, 50)); try { fetch(url + '/rest/v1/events', { method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json', 'apikey': key, 'Authorization': 'Bearer ' + key, 'Prefer': 'return=minimal' }, body: body }).catch(function(){}); } catch (e) {} }
  function ev(name, data){ if (!C().analyticsUrl) return; var r = { sid: sid, d: d, ev: name, lang: (window.I18N && I18N.lang) || '', v: C().version || '', portal: C().portal || '', secs: Math.round((Date.now() - t0) / 1000), g: null, ms: null, x: null };
    if (data) { if (data.g !== undefined) r.g = data.g; if (data.ms !== undefined) r.ms = data.ms; if (data.x !== undefined) r.x = String(data.x); }
    q.push(r); if (q.length >= 8 || name === 'load') flush(); else { clearTimeout(timer); timer = setTimeout(flush, 2500); } }
  document.addEventListener('visibilitychange', function(){ if (document.visibilityState === 'hidden') { ev('bye'); flush(); } });
  setInterval(function(){ if (document.visibilityState === 'visible' && window.__bakhi && __bakhi.get() && !__bakhi.get().over) ev('hb'); }, 30000);
  return { ev: ev, flush: flush, sid: sid };
})();
