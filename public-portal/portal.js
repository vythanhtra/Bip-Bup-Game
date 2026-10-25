/* ===== portal SDK adapter (ADR-002): no-ops unless a portal SDK is present ===== */
var PORTAL = (function(){
  var cg = null, poki = null, on = typeof CONFIG !== 'undefined' && !!CONFIG.portal;
  function init(){ if (!on) return; try { if (window.CrazyGames && CrazyGames.SDK) { cg = CrazyGames.SDK; if (cg.init) cg.init(); } } catch (e) {}
    try { if (window.PokiSDK) { poki = PokiSDK; poki.init().then(function(){ poki.gameLoadingFinished(); }).catch(function(){}); } } catch (e) {} }
  function safe(f){ try { f(); } catch (e) {} }
  return { on: on, init: init,
    gameplayStart: function(){ safe(function(){ if (cg) cg.game.gameplayStart(); if (poki) poki.gameplayStart(); }); },
    gameplayStop: function(){ safe(function(){ if (cg) cg.game.gameplayStop(); if (poki) poki.gameplayStop(); }); },
    happy: function(){ safe(function(){ if (cg) cg.game.happytime(); }); },
    adBreak: function(done){ var fin = function(){ try { done && done(); } catch (e) {} }; safe(function(){ if (poki) poki.commercialBreak().then(fin).catch(fin); else if (cg && cg.ad) cg.ad.requestAd('midgame', { adFinished: fin, adError: fin }); else fin(); }); } };
})();
