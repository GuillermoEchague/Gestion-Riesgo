(() => {
  'use strict';
  const STORAGE_KEY = 'riesgo-ti-registry-v1';
  const $ = (selector) => document.querySelector(selector);
  const dialog = $('#risk-dialog');
  let risks = loadRisks();
  let toastTimer;

  function loadRisks() {
    try { const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); return Array.isArray(value) ? value : []; }
    catch { return []; }
  }
  function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(risks)); render(); }
  function level(score) { return score >= 20 ? 'Crítico' : score >= 12 ? 'Alto' : score >= 6 ? 'Moderado' : 'Bajo'; }
  function score(risk, residual = false) { return Number(risk.likelihood || 1) * Number(residual ? (risk.residualImpact || risk.impact) : risk.impact || 1); }
  function safe(value) { return String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char])); }
  function showToast(message) { const toast = $('#toast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2500); }
  function render() {
    const query = $('#search').value.trim().toLocaleLowerCase('es');
    const levelFilter = $('#filter-level').value, statusFilter = $('#filter-status').value;
    const visible = risks.filter(r => {
      const matchesText = !query || [r.name, r.asset, r.owner, r.category, r.cause].join(' ').toLocaleLowerCase('es').includes(query);
      return matchesText && (levelFilter === 'all' || level(score(r)) === levelFilter) && (statusFilter === 'all' || r.status === statusFilter);
    });
    $('#risk-rows').innerHTML = visible.map(r => {
      const inherent = score(r), residual = r.residualImpact ? score(r, true) : null;
      return `<tr><td><div class="risk-name" title="${safe(r.name)}">${safe(r.name)}</div><div class="risk-asset">${safe(r.asset)}</div></td><td><span class="cat-pill">${safe(r.category)}</span></td><td><span class="risk-pill level-${level(inherent)}"><i></i>${level(inherent)} · ${inherent}</span></td><td><span class="status-pill ${r.status === 'Identificado' ? 'status-Identificado' : r.status === 'Aceptado' ? 'status-Aceptado' : r.status === 'Cerrado' ? 'status-Cerrado' : ''}">${safe(r.status)}</span></td><td class="owner-cell">${safe(r.owner || 'Sin asignar')}</td><td><span class="residual ${residual ? `level-${level(residual)}` : ''}">${residual ? `${level(residual)} · ${residual}` : 'Sin estimar'}</span></td><td><div class="row-actions"><button class="icon-button" data-edit="${safe(r.id)}" title="Editar" aria-label="Editar riesgo">✎</button><button class="icon-button" data-delete="${safe(r.id)}" title="Eliminar" aria-label="Eliminar riesgo">×</button></div></td></tr>`;
    }).join('');
    $('#empty-state').style.display = visible.length ? 'none' : 'block';
    $('#table-summary').textContent = `${visible.length} ${visible.length === 1 ? 'riesgo' : 'riesgos'}${visible.length !== risks.length ? ` de ${risks.length}` : ''}`;
    $('#total-count').textContent = risks.length;
    $('#nav-count').textContent = risks.length;
    $('#high-count').textContent = risks.filter(r => score(r) >= 12 && r.status !== 'Cerrado').length;
    $('#treat-count').textContent = risks.filter(r => r.status === 'En tratamiento').length;
    $('#residual-count').textContent = risks.filter(r => r.residualImpact && score(r, true) >= 12).length;
    renderHeatmap();
  }
  function renderHeatmap() {
    const cells = [];
    for (let likelihood = 5; likelihood >= 1; likelihood--) {
      for (let impact = 1; impact <= 5; impact++) {
        const value = likelihood * impact;
        const shade = value >= 20 ? 5 : value >= 12 ? 4 : value >= 6 ? 3 : value >= 3 ? 2 : 1;
        const count = risks.filter(r => Number(r.likelihood) === likelihood && Number(r.impact) === impact).length;
        cells.push(`<div class="heat-cell heat-${shade}" title="Probabilidad ${likelihood} × impacto ${impact}: ${count} riesgo(s)">${count || ''}</div>`);
      }
    }
    $('#heatmap').innerHTML = cells.join('');
  }
  function openNew() { $('#risk-form').reset(); $('#risk-id').value = ''; $('#dialog-title').textContent = 'Nuevo riesgo'; $('#risk-status').value = 'Identificado'; dialog.showModal(); $('#risk-name').focus(); }
  function openEdit(id) {
    const r = risks.find(item => item.id === id); if (!r) return;
    $('#risk-id').value = r.id; $('#dialog-title').textContent = 'Editar riesgo';
    const fields = {name:'name',asset:'asset',category:'category',cause:'cause',impactDesc:'impactDesc',likelihood:'likelihood',impact:'impact',treatment:'treatment',status:'status',plan:'plan',owner:'owner',due:'due',residual:'residualImpact'};
    for (const [field, key] of Object.entries(fields)) $(`#risk-${field}`).value = r[key] ?? '';
    dialog.showModal();
  }
  function exportData() {
    const file = new Blob([JSON.stringify({format:'riesgo-ti',version:1,exportedAt:new Date().toISOString(),risks},null,2)],{type:'application/json'});
    const link = document.createElement('a'); link.href = URL.createObjectURL(file); link.download = `registro-riesgos-ti-${new Date().toISOString().slice(0,10)}.json`; link.click(); URL.revokeObjectURL(link.href); showToast('Registro exportado en JSON');
  }
  $('#risk-form').addEventListener('submit', event => {
    event.preventDefault();
    const id = $('#risk-id').value;
    const r = {id:id || (crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`),name:$('#risk-name').value.trim(),asset:$('#risk-asset').value.trim(),category:$('#risk-category').value,cause:$('#risk-cause').value.trim(),impactDesc:$('#risk-impact-desc').value.trim(),likelihood:Number($('#risk-likelihood').value),impact:Number($('#risk-impact').value),treatment:$('#risk-treatment').value,status:$('#risk-status').value,plan:$('#risk-plan').value.trim(),owner:$('#risk-owner').value.trim(),due:$('#risk-due').value,residualImpact:Number($('#risk-residual').value)||null,updatedAt:new Date().toISOString()};
    if (id) risks = risks.map(item => item.id === id ? {...item,...r,createdAt:item.createdAt} : item); else risks.unshift({...r,createdAt:r.updatedAt});
    save(); dialog.close(); showToast(id ? 'Riesgo actualizado' : 'Riesgo registrado');
  });
  $('#risk-rows').addEventListener('click', event => {
    const edit = event.target.closest('[data-edit]'), del = event.target.closest('[data-delete]');
    if (edit) openEdit(edit.dataset.edit);
    if (del) { risks = risks.filter(r => r.id !== del.dataset.delete); save(); showToast('Riesgo eliminado'); }
  });
  ['#new-risk','#new-risk-2','#empty-new'].forEach(selector => $(selector).addEventListener('click', openNew));
  $('#close-dialog').addEventListener('click', () => dialog.close()); $('#cancel-dialog').addEventListener('click', () => dialog.close());
  $('#search').addEventListener('input', render); $('#filter-level').addEventListener('change', render); $('#filter-status').addEventListener('change', render);
  $('#export-top').addEventListener('click', exportData);
  $('#import-top').addEventListener('click', () => $('#import-file').click());
  $('#clear-data').addEventListener('click', () => { if (!risks.length) return showToast('No hay datos que borrar'); if (confirm('¿Borrar todos los riesgos guardados en este equipo? Esta acción no se puede deshacer.')) { risks = []; save(); showToast('Datos locales borrados'); } });
  $('#import-file').addEventListener('change', async event => {
    const file = event.target.files?.[0]; if (!file) return;
    try { const data = JSON.parse(await file.text()); const imported = Array.isArray(data) ? data : data.risks; if (!Array.isArray(imported) || imported.some(r => !r.name || !r.asset)) throw new Error('Formato inválido'); const byId = new Map(risks.map(r => [r.id,r])); for (const r of imported) byId.set(r.id || crypto.randomUUID(),r); risks = [...byId.values()]; save(); showToast(`${imported.length} riesgo(s) importado(s)`); }
    catch { showToast('El archivo no tiene un registro válido'); }
    event.target.value = '';
  });
  document.querySelectorAll('.nav-item').forEach(link => link.addEventListener('click', () => { document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active')); link.classList.add('active'); }));
  render();
})();
