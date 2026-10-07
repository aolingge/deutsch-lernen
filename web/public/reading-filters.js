// @ts-nocheck
(function () {
  const form = document.getElementById("readingFilters"); if (!form) return;
  const cards = [...document.querySelectorAll("[data-reading-resource]")];
  function apply(updateUrl = true) {
    const terms = form.elements.q.value.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
    const level = form.elements.level.value, price = form.elements.price.value;
    cards.forEach(card => { card.hidden = !terms.every(term => card.dataset.search.toLocaleLowerCase().includes(term)) || (level && !card.dataset.levels.split(",").includes(level)) || (price && card.dataset.price !== price); });
    document.querySelectorAll(".reading-collection").forEach(group => {
      group.hidden = !group.querySelector("[data-reading-resource]:not([hidden])");
      const link = document.querySelector(`.reading-index a[href="#${group.id}"]`); if (link) link.hidden = group.hidden;
    });
    const count = new Set(cards.filter(card => !card.hidden).map(card => card.dataset.readingResource)).size;
    document.getElementById("readingFilterCount").textContent = `${count} 个入口`;
    document.getElementById("readingEmpty").hidden = count > 0;
    if (updateUrl) {
      const url = new URL(location.href);
      ["q", "level", "price"].forEach(key => { const value = form.elements[key].value.trim(); if (value) url.searchParams.set(key, value); else url.searchParams.delete(key); });
      history.replaceState(null, "", url);
    }
  }
  function restore() { const params = new URLSearchParams(location.search); ["q", "level", "price"].forEach(key => { form.elements[key].value = params.get(key) || ""; }); apply(false); }
  form.addEventListener("submit", event => event.preventDefault());
  form.addEventListener("input", () => apply());
  form.addEventListener("change", () => apply());
  form.addEventListener("reset", () => setTimeout(() => apply(), 0));
  window.addEventListener("popstate", restore); restore();
})();
