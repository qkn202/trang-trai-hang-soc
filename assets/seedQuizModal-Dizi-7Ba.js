var ge=Object.defineProperty;var me=($,e,t)=>e in $?ge($,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):$[e]=t;var S=($,e,t)=>me($,typeof e!="symbol"?e+"":e,t);import{F as L,ax as W,ay as Se,d as V,f as M,at as fe,Q as H,aw as be}from"./game-data-CIg-hYYZ.js";import{bM as j,bN as I,bO as Z,bP as x,bQ as qe,bR as G,b6 as ve,bS as X,bT as B}from"./sim-foundation-BXeSnJtU.js";import{s as w,M as Y}from"./minigameViewControls-BejD1Luw.js";import{o as ye}from"./hpvn-platform-CEnEuXKU.js";function d($){return String($??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const F=["en","ko","zh","es","ja"],D=["all","listening_comprehension","grammar_cloze","dialogue_reply","sentence_builder","match_pairs","vocab_context"],J=["all","daily","travel","study_tech","health_hobby","magic","farm"];class Te{constructor(e,t,o,l,r){S(this,"root");S(this,"sim");S(this,"onRefreshHud");S(this,"onToast");S(this,"onEquipAndSow");S(this,"targetCropId","ottery_wheat");S(this,"pendingPlotUid",null);S(this,"openedFromSowIntent",!1);S(this,"seedsAcquiredInSession",!1);S(this,"challenge",null);S(this,"capNoticeShown",!1);S(this,"answeredOutcome",null);S(this,"selectedChoiceIdx",null);S(this,"placedTokenIndices",[]);S(this,"selectedLeftPairId",null);S(this,"matchedPairIds",new Set);S(this,"flashWrongPairKey",null);S(this,"pairMistakes",0);S(this,"listeningHintRevealed",!1);S(this,"activeSubView","practice");S(this,"codexQuery","");S(this,"codexBoxFilter","all");S(this,"sessionShownQids",new Set);S(this,"skipFormatOffset",0);S(this,"starterChallengePendingPack",!1);S(this,"dialogCloseBound",!1);S(this,"onOpenLeaderboard");if(this.root=e,this.sim=t,this.onRefreshHud=o,this.onToast=l,this.onEquipAndSow=r,typeof window<"u"){const h=()=>{if(!this.isOpen())return;const n=this.getDialog(),a=typeof n?.querySelector=="function"?n.querySelector(".sq-modal-inner"):null;w.applyDialogOrientation(n,a,!0),this.syncSeedQuizViewportTransform()};window.addEventListener("resize",h),window.visualViewport?.addEventListener("resize",h),window.addEventListener("keydown",n=>{if(!this.isOpen())return;const a=n.target?.tagName;a==="INPUT"||a==="TEXTAREA"||a==="SELECT"||(n.key==="+"||n.key==="="?(n.preventDefault(),w.stepZoom("seedquiz",Y),this.syncSeedQuizViewportTransform()):n.key==="-"||n.key==="_"?(n.preventDefault(),w.stepZoom("seedquiz",-Y),this.syncSeedQuizViewportTransform()):n.key==="0"&&(n.ctrlKey||n.metaKey)&&(n.preventDefault(),w.resetView("seedquiz"),this.syncSeedQuizViewportTransform()))})}}getDialog(){return this.root.querySelector("#seedQuizDialog")}isOpen(){return!!this.getDialog()?.open}syncSeedQuizViewportTransform(){const e=this.root.querySelector("#seedQuizDialogContent");if(!e)return;const t=e.querySelector("#sqScrollViewport"),o=e.querySelector("#sqZoomSizer"),l=e.querySelector("#sqZoomStage");w.applyDomScrollStageTransform(t,o,l),w.syncToolbarDOM(e,"seedquiz")}open(e,t,o,l,r,h){(h==="practice"||h==="codex")&&(this.activeSubView=h),this.openedFromSowIntent=!!e,this.seedsAcquiredInSession=!1;const n=Object.values(L).filter(b=>this.sim.state.sandboxMode||this.sim.state.level>=b.unlockLevel);if(e&&L[e]){const b=L[e];this.sim.state.sandboxMode||this.sim.state.level>=b.unlockLevel?this.targetCropId=e:n.length>0&&(this.targetCropId=n[0].id)}else!L[this.targetCropId]&&n.length>0&&(this.targetCropId=n[0].id);this.pendingPlotUid=t??null,this.pendingPlotUid||this.sim.setLastPlayedMinigame("seedquiz");const a=this.sim.ensureLanguageQuiz();let m=!this.challenge||this.answeredOutcome!==null;o&&F.includes(o)&&a.activeLang!==o&&(a.activeLang=o,m=!0),l&&(l==="beginner"||l==="intermediate"||l==="advanced")&&(j(a,a.activeLang,l),m=!0),r&&D.includes(r)&&(a.preferredFormat=r,m=!0),m||this.challenge?.lang!==a.activeLang?(this.challenge&&!this.answeredOutcome&&I(a,this.challenge),this.loadNextQuestion(!0)):(this.ensureActiveLangPackLoaded(a.activeLang,!1),this.render());const v=this.root.querySelector("#seedQuizDialog");v&&!v.open&&v.showModal(),this.onRefreshHud()}recordSessionShownQid(e){for(this.sessionShownQids.delete(e),this.sessionShownQids.add(e);this.sessionShownQids.size>350;){const t=this.sessionShownQids.values().next().value;if(t===void 0)break;this.sessionShownQids.delete(t)}}hasUserInteractedWithCurrentQuestion(){return this.answeredOutcome!==null||this.selectedChoiceIdx!==null||this.placedTokenIndices.length>0||this.matchedPairIds.size>0||this.selectedLeftPairId!==null}ensureActiveLangPackLoaded(e,t=!1){W(e)||Se(e).then(o=>{if(!this.isOpen())return;const l=this.sim.ensureLanguageQuiz();if(l.activeLang===e){if(o){if(this.starterChallengePendingPack&&!this.hasUserInteractedWithCurrentQuestion()){if(this.starterChallengePendingPack=!1,this.challenge=Z(l,this.sim.state.level,{excludeIds:this.sessionShownQids,formatOffset:this.skipFormatOffset}),this.recordSessionShownQid(this.challenge.qId),this.render(),t&&l.autoSpeak&&this.challenge&&this.activeSubView==="practice"){const r=this.challenge.ttsPromptText||this.challenge.fullSentence;r&&x(r,this.challenge.lang,.94)}return}this.starterChallengePendingPack=!1,this.challenge&&this.recordSessionShownQid(this.challenge.qId),this.answeredOutcome||this.render();return}if(this.starterChallengePendingPack=!1,this.challenge&&this.recordSessionShownQid(this.challenge.qId),t&&l.autoSpeak&&this.challenge&&!this.answeredOutcome&&this.activeSubView==="practice"){const r=this.challenge.ttsPromptText||this.challenge.fullSentence;r&&x(r,this.challenge.lang,.94)}}})}close(){const e=this.root.querySelector("#seedQuizDialog");e?.open&&e.close(),this.flushPendingSowOnDismiss()}resetInteractiveQuestionState(){this.answeredOutcome=null,this.selectedChoiceIdx=null,this.placedTokenIndices=[],this.selectedLeftPairId=null,this.matchedPairIds.clear(),this.flashWrongPairKey=null,this.pairMistakes=0,this.listeningHintRevealed=!1}loadNextQuestion(e=!0){this.resetInteractiveQuestionState();const t=this.sim.ensureLanguageQuiz(),o=W(t.activeLang);this.challenge=Z(t,this.sim.state.level,{excludeIds:this.sessionShownQids,formatOffset:this.skipFormatOffset}),o?(this.starterChallengePendingPack=!1,this.recordSessionShownQid(this.challenge.qId)):(this.starterChallengePendingPack=!0,this.ensureActiveLangPackLoaded(t.activeLang,e)),this.sim.saveToStorage(),this.render();const l=this.root.querySelector("#seedQuizDialog .sq-modal-inner");if(l&&(l.scrollTop=0),o&&e&&t.autoSpeak&&this.challenge){const r=this.challenge.ttsPromptText||this.challenge.fullSentence;r&&x(r,this.challenge.lang,.94)}}submitAttempt(e){if(!this.challenge||this.answeredOutcome)return;const t=this.sim.completeSeedLanguageQuizAttempt(this.targetCropId,this.challenge,e);this.answeredOutcome=t,this.sim.ensureLanguageQuiz().autoSpeak&&x(this.challenge.fullSentence,this.challenge.lang,.95);const l=L[this.targetCropId];if(t.correct&&t.practice)this.capNoticeShown||(this.capNoticeShown=!0,this.onToast("Hôm nay đã nhận đủ 30 câu có thưởng, giờ là luyện tập","📖"));else if(t.correct){(t.seedsAwarded??0)>0&&(this.seedsAcquiredInSession=!0);const r=t.tierAutoPromoted?` • Thăng hạng ${V[this.challenge.lang].tierLabels[t.tierAutoPromoted]}!`:"",h=t.phoenixTalismanAwarded?` • 🔥 +${t.phoenixTalismanAwarded} Bùa Trợ Chiến Phượng Hoàng!`:"",n=t.buildReduction&&t.buildReduction.reducedSec>0?t.buildReduction.ecoReduced?` • ⏱️ -${M(t.buildReduction.reducedSec)} cho cây đang lớn, thú nuôi & xưởng${t.buildReduction.targetName?`, xây ${t.buildReduction.targetName}`:""}!`:` • 🔨 -${M(t.buildReduction.reducedSec)} xây ${t.buildReduction.targetName??"công trình"}!`:"",a=t.specialtyReward?` • ${t.specialtyReward.badgeLabelVi}!`:"",m=t.leaderboardRankUp&&t.leaderboardRankUp.rankUpBy>0?` • 🏆 Lên Hạng #${t.leaderboardRankUp.newRank} (+${t.leaderboardRankUp.rankUpBy} bậc)!`:"";this.onToast(`🪄 Chuẩn xác thần chú! Nhận +${t.seedsAwarded} hạt ${l.emoji} ${l.name} (Túi: ${t.newSeedCount} hạt)${n}${a}${r}${h}${m}`,t.phoenixTalismanAwarded?"🔥":t.specialtyReward?"💧":"🌱")}else t.streakShieldConsumed&&this.onToast(`🛡️ Khiên Thu Hoạch đã giữ nguyên chuỗi ${t.newStreak} câu đúng cho bạn!`,"🛡️");this.onRefreshHud(),this.render(),requestAnimationFrame(()=>{this.root.querySelector("#seedQuizDialog .sq-explain-card")?.scrollIntoView({behavior:"smooth",block:"nearest"})})}flushPendingSowOnDismiss(){if(this.seedsAcquiredInSession&&(this.seedsAcquiredInSession=!1,this.openedFromSowIntent=!1,this.sim.state.sandboxMode||this.sim.getSeedCount(this.targetCropId)>0)){const e=this.pendingPlotUid;this.pendingPlotUid=null,this.onEquipAndSow(this.targetCropId,e)}}handleSowEquippedSeed(){const e=this.sim.getSeedCount(this.targetCropId);if(!this.sim.state.sandboxMode&&e<=0){this.onToast("Túi hạt đang trống — hãy mua bằng Sickle hoặc niệm 1 câu Thần Chú Đa Ngữ bên cạnh nhé!","🌱");return}const t=this.pendingPlotUid;this.pendingPlotUid=null,this.seedsAcquiredInSession=!1,this.openedFromSowIntent=!1,this.close(),this.onEquipAndSow(this.targetCropId,t)}handleBuySeedsWithSickle(e){const t=this.sim.buyCropSeedWithGold(this.targetCropId,e);if(this.onToast(t.msg,t.ok?"🌱":"🪙"),t.ok){if(this.seedsAcquiredInSession=!0,this.openedFromSowIntent){this.handleSowEquippedSeed();return}this.onRefreshHud(),this.render()}}render(){const e=this.root.querySelector("#seedQuizDialogContent");if(!e)return;const t=this.getDialog(),o=typeof t?.querySelector=="function"?t.querySelector(".sq-modal-inner"):null;t&&typeof t.addEventListener=="function"&&!this.dialogCloseBound&&(this.dialogCloseBound=!0,t.addEventListener("close",()=>{if(t.open)return;if(typeof window<"u"&&"speechSynthesis"in window)try{window.speechSynthesis.cancel()}catch{}const p=typeof t.querySelector=="function"?t.querySelector(".sq-modal-inner"):null;w.clearDialogOrientation(t,p),this.flushPendingSowOnDismiss()})),w.applyDialogOrientation(t,o,!0);const l=e.querySelector("#sqScrollViewport"),r=l?l.scrollTop:0,h=l?l.scrollLeft:0,n=this.sim.ensureLanguageQuiz(),a=n.activeLang,m=V[a],v=n.profiles[a],b=L[this.targetCropId],q=this.sim.getSeedCount(this.targetCropId),s=t?.querySelector("#btnSqHeaderSubView");s&&(s.textContent=this.activeSubView==="codex"?"Luyện tập":"Từ điển",s.setAttribute("aria-pressed",String(this.activeSubView==="codex")),s.onclick=()=>{if(this.sim.audio.playClick(),this.activeSubView=this.activeSubView==="codex"?"practice":"codex",this.activeSubView==="codex"){const p=this.sim.ensureLanguageQuiz();this.ensureActiveLangPackLoaded(p.activeLang)}this.render()});const i=Object.values(L).sort((p,k)=>p.unlockLevel-k.unlockLevel||p.growSec-k.growSec),c=p=>i.filter(k=>!!k.isFlowerCrop===p).map(k=>{const P=!this.sim.state.sandboxMode&&this.sim.state.level<k.unlockLevel,Q=k.id===this.targetCropId,R=this.sim.getSeedCount(k.id),pe=P?`Cấp ${k.unlockLevel} · ${k.name}`:`${k.name} (×${R})`;return`<option value="${k.id}" ${Q?"selected":""} ${P?"disabled":""}>${d(pe)}</option>`}).join(""),f=F.map(p=>{const k=V[p],P=n.profiles[p],Q=p===a,R=p==="es"?"TBN":k.tabVi;return`
        <button
          type="button"
          role="tab"
          class="sq-lang-tab ${Q?"active":""}"
          data-sq-lang="${p}"
          aria-selected="${Q}"
          title="${d(k.nameVi)} · Cấp ${P.masteryScore}"
        >${d(R)}</button>
      `}).join(""),u=[{id:"beginner",label:"Tập Sự"},{id:"intermediate",label:"O.W.L."},{id:"advanced",label:"N.E.W.T."}],g=u.map(p=>`<option value="${p.id}" ${v.tier===p.id?"selected":""}>${d(p.label)}</option>`).join(""),y={all:"Đủ dạng",listening_comprehension:"Nghe hiểu",vocab_context:"Nhìn tranh",dialogue_reply:"Đập bóng",grammar_cloze:"Điền từ",sentence_builder:"Ghép chữ",match_pairs:"Nối cặp"},T=D.map(p=>`<option value="${p}" ${n.preferredFormat===p?"selected":""}>${d(y[p])}</option>`).join(""),C={all:"Mọi chủ đề",...be},K=n.preferredTopic??"all",ee=J.map(p=>`<option value="${p}" ${K===p?"selected":""}>${d(C[p])}</option>`).join(""),te=C[K]??"Mọi chủ đề",se=qe(),ie=n.todayStudyDayKey===se?Math.min(G,n.todayAnsweredCount??0):0,U=n.dailyStreakCount??0,ne=Math.max(U,n.bestDailyStreakCount??0),ae=n.claimedStreakMilestones??[],z=ve.find(p=>!ae.includes(p.days)&&(this.sim.state.sandboxMode||ne>=p.days)),oe=!this.sim.state.sandboxMode&&this.sim.state.level<b.unlockLevel?`Cấp ${b.unlockLevel} · ${b.name}`:`${b.name} (×${q})`,le=u.find(p=>p.id===v.tier)?.label??"Tập Sự",re=y[n.preferredFormat]??"Đủ dạng",ce=this.challenge?this.renderChallengeStage(this.challenge):"",de=this.answeredOutcome!==null,E=!!this.sim.state.sandboxMode,A=this.sim.state.galleons,N=b.seedCost,_=b.seedCost*3,he=E?"0":N.toLocaleString("vi-VN"),ue=E?"0":_.toLocaleString("vi-VN");e.innerHTML=`
      <div class="sq-scroll-viewport" id="sqScrollViewport">
        <div class="sq-zoom-sizer" id="sqZoomSizer">
          <div class="sq-zoom-stage" id="sqZoomStage">
            <div class="sq-root">
              <div class="sq-lang-tabs" role="tablist" aria-label="Chọn ngôn ngữ">${f}</div>
              ${this.activeSubView==="codex"?this.renderLexiconCodexPanel(a,v):`
                    <div class="sq-setup-row" title="${d(m.tierLabels[v.tier])}">
                      <img src="${fe(b.id)}" alt="" width="22" height="22" class="sq-crop-pill-img" />
                      <div class="sq-select-shell sq-crop-select">
                        <span class="sq-select-face" aria-hidden="true">
                          <span class="sq-select-label">${d(oe)}</span>
                          <span class="sq-select-caret"></span>
                        </span>
                        <select id="selSqTargetCrop" class="sq-select" aria-label="Chọn hạt giống nhận thưởng">
                          <optgroup label="Cây trồng">${c(!1)}</optgroup>
                          <optgroup label="Hoa">${c(!0)}</optgroup>
                        </select>
                      </div>
                      ${q>0?`<button id="btnSqSowNow" type="button" class="brass-btn gold-cta sq-sow-cta">Gieo ×${q}</button>`:""}
                      <div class="sq-select-shell sq-tier-select">
                        <span class="sq-select-face" aria-hidden="true">
                          <span class="sq-select-label">${d(le)}</span>
                          <span class="sq-select-caret"></span>
                        </span>
                        <select id="selSqTier" class="sq-select" aria-label="Chọn cấp độ">${g}</select>
                      </div>
                    </div>
                    <div class="sq-buy-row" role="group" aria-label="Mua hạt giống bằng Sickle">
                      <button
                        id="btnSqBuy1"
                        type="button"
                        class="brass-btn sq-tool-pill sq-buy-pill"
                        data-unaffordable="${!E&&A<N}"
                        title="Mua 1 hạt ${d(b.name)} (${N.toLocaleString("vi-VN")} Sickle)"
                      >+1 hạt · 🪙${he}</button>
                      <button
                        id="btnSqBuy3"
                        type="button"
                        class="brass-btn sq-tool-pill sq-buy-pill"
                        data-unaffordable="${!E&&A<_}"
                        title="Mua 3 hạt ${d(b.name)} (${_.toLocaleString("vi-VN")} Sickle)"
                      >+3 hạt · 🪙${ue}</button>
                      <span class="sq-sickle-chip" title="Số dư Sickle hiện có">
                        <span class="g-coin">S</span>
                        <strong>${E?"∞":ye(A)}</strong>
                      </span>
                      <span class="sq-sickle-chip" title="Chuỗi học thần chú hằng ngày (3 câu đúng/ngày)">
                        <strong>Chuỗi ${U} ngày (${ie}/${G})</strong>
                      </span>
                      ${z?`<button id="btnSqClaimStreak" type="button" data-streak-days="${z.days}" class="brass-btn gold-cta sq-tool-pill">🎁 Mốc ${z.days}N</button>`:""}
                    </div>
                    <div class="sq-tools-row">
                      <div class="sq-select-shell sq-format-select">
                        <span class="sq-select-face" aria-hidden="true">
                          <span class="sq-select-label">${d(re)}</span>
                          <span class="sq-select-caret"></span>
                        </span>
                        <select id="selSqFormat" class="sq-select" aria-label="Chọn dạng câu hỏi">${T}</select>
                      </div>
                      <div class="sq-select-shell sq-format-select">
                        <span class="sq-select-face" aria-hidden="true">
                          <span class="sq-select-label">${d(te)}</span>
                          <span class="sq-select-caret"></span>
                        </span>
                        <select id="selSqTopic" class="sq-select" aria-label="Chọn chủ đề từ vựng">${ee}</select>
                      </div>
                      <button id="btnSqAutoSpeak" type="button" class="brass-btn sq-tool-pill" aria-pressed="${n.autoSpeak}">Tự đọc</button>
                      <button id="btnSqSpeakSlow" type="button" class="brass-btn sq-tool-pill" title="Nghe chậm">Chậm</button>
                      ${de?"":'<button id="btnSqSkipQuestion" type="button" class="brass-btn sq-tool-pill" title="Đổi câu khác">Đổi</button>'}
                    </div>
                    ${ce}
                  `}
            </div>
          </div>
        </div>
      </div>
    `,this.bindRenderedEvents(e);const O=e.querySelector("#sqScrollViewport");O&&(r>0||h>0)&&(O.scrollTop=r,O.scrollLeft=h)}getLexiconEntrySrsInfo(e,t){const o=e.srsBoxes??{};let l=0,r=!1;for(const h of["vocab:","listen:","pairs:","cloze:","bubble:","tiles:"]){const n=o[`${h}${t}`];n&&(n.box>l&&(l=n.box),n.box<5&&n.dueAtTurn<=e.totalAnswered&&(r=!0))}return{box:l,due:r}}getLanguageLexiconEntries(e){return H.filter(t=>t.lang===e).sort((t,o)=>t.levelBand-o.levelBand||t.id.localeCompare(o.id))}renderLexiconCodexPanel(e,t){const o=this.getLanguageLexiconEntries(e);let l=0,r=0,h=0;for(const a of o){const{box:m}=this.getLexiconEntrySrsInfo(t,a.id);m>=5?l+=1:m>=1?r+=1:h+=1}const n=[{id:"all",label:`Tất cả (${o.length})`},{id:"mastered",label:`Thuộc (${l})`},{id:"learning",label:`Đang học (${r})`},{id:"unseen",label:`Mới (${h})`}].map(a=>`
          <button
            type="button"
            class="sq-format-chip ${this.codexBoxFilter===a.id?"active":""}"
            data-sq-codex-filter="${a.id}"
            aria-pressed="${this.codexBoxFilter===a.id}"
          >${a.label}</button>
        `).join("");return`
      <div class="sq-codex-panel">
        <div class="sq-codex-toolbar">
          <input
            id="inpSqCodexSearch"
            type="search"
            class="sq-codex-search"
            placeholder="Tìm từ..."
            value="${d(this.codexQuery)}"
            aria-label="Tra cứu Sổ Tay Cổ Ngữ"
          />
          <div class="sq-codex-filters" role="group" aria-label="Lọc theo Hộp SRS">${n}</div>
        </div>
        <div id="sqCodexResultsMount">
          ${this.renderLexiconCodexRowsHtml(e,t,o)}
        </div>
      </div>
    `}renderLexiconCodexRowsHtml(e,t,o){const l=o??this.getLanguageLexiconEntries(e),r=this.codexQuery.trim().toLowerCase(),h=l.filter(a=>{const{box:m}=this.getLexiconEntrySrsInfo(t,a.id);return this.codexBoxFilter==="mastered"&&m<5||this.codexBoxFilter==="learning"&&(m<1||m>=5)||this.codexBoxFilter==="unseen"&&m>0?!1:r?a.word.toLowerCase().includes(r)||a.phonetic.toLowerCase().includes(r)||a.meaningVi.toLowerCase().includes(r)||a.exampleSentence.toLowerCase().includes(r)||a.exampleVi.toLowerCase().includes(r):!0});return h.length===0?`
        <div class="sq-codex-empty">
          Không có mục từ phù hợp.
        </div>
      `:`
      <div class="sq-codex-list" role="list">${h.map(a=>{const{box:m,due:v}=this.getLexiconEntrySrsInfo(t,a.id),b=X(a.meaningVi,a.word,a.id);let q="is-unseen",s=`Quyển ${a.levelBand}`;return m>=5?(q="is-box5",s="Thuộc"):m>=1&&(q=v?"is-due":"is-learning",s=`Hộp ${m}/5${v?" · Ôn":""}`),`
          <article class="sq-codex-row" role="listitem">
            <img src="${b.spriteSrc}" alt="" class="sq-codex-pic" />
            <div class="sq-codex-body">
              <div class="sq-codex-head">
                <strong class="sq-codex-word">${d(a.word)}</strong>
                <span class="sq-vocab-ph">[${d(a.phonetic)}]</span>
                <span class="sq-codex-meaning">— ${d(b.shortVi)}</span>
              </div>
              <span class="sq-codex-srs ${q}">${s}</span>
            </div>
            <button
              type="button"
              class="brass-btn sq-vocab-speak"
              data-sq-codex-word="${d(a.id)}"
              title="Nghe phát âm từ ${d(a.word)}"
            >Nghe</button>
          </article>
        `}).join("")}</div>
    `}bindCodexRowSpeakEvents(e,t){e.querySelectorAll("[data-sq-codex-word]").forEach(o=>{o.addEventListener("click",()=>{const l=o.dataset.sqCodexWord??"",r=H.find(h=>h.id===l);r&&x(r.word,t,.9)})}),e.querySelectorAll("[data-sq-codex-ex]").forEach(o=>{o.addEventListener("click",()=>{const l=o.dataset.sqCodexEx??"",r=H.find(h=>h.id===l);r&&x(r.exampleSentence,t,.95)})})}renderChallengeStage(e){const t=this.answeredOutcome!==null,o=e.visualGameKind??(e.format==="listening_comprehension"?"audio_listening":e.format==="vocab_context"?"pic_flashcard":e.format==="dialogue_reply"?"bubble_pop":e.format==="sentence_builder"?"word_tiles":e.format==="match_pairs"?"pic_pairs":"word_flashcard"),l=e.heroSpriteSrc??"/trang-trai-hang-soc/sprites/ui_icon_seed_sack.webp",r=e.format==="sentence_builder"&&!!(e.expectedSentenceTokens&&e.expectedSentenceTokens.length>=2)&&!!(e.stemText&&e.stemText!==e.heroShortVi),h=e.heroWord??e.stemText,n=e.heroPhonetic??e.stemPhonetic??"",a=r?e.stemText:e.heroShortVi??B(e.translationVi);let m="";if(o==="audio_listening"){const q=t||this.listeningHintRevealed;m=`
        <div class="sq-prompt-row">
          <div class="sq-prompt-copy">
            <strong class="sq-prompt-word">${q?d(h):"Nghe phát âm & chọn nghĩa đúng"}</strong>
            ${q&&n?`<span class="sq-prompt-ph">[${d(n)}]</span>`:""}
          </div>
          <div style="display:flex;gap:6px;align-items:center;">
            ${q?"":'<button id="btnSqRevealListeningScript" type="button" class="brass-btn sq-tool-pill">Hiện chữ</button>'}
            <button id="btnSqHeroAudio" type="button" class="brass-btn gold-cta sq-audio-btn">Nghe</button>
          </div>
        </div>
      `}else o==="pic_flashcard"?m=`
        <div class="sq-prompt-row">
          <div class="sq-prompt-copy">
            <strong class="sq-prompt-word">${d(h)}</strong>
            ${n?`<span class="sq-prompt-ph">[${d(n)}]</span>`:""}
          </div>
          <button id="btnSqHeroAudio" type="button" class="brass-btn gold-cta sq-audio-btn">Nghe</button>
        </div>
      `:o!=="pic_pairs"&&(m=`
        <div class="sq-prompt-row">
          <img src="${l}" alt="" class="sq-prompt-img" />
          <div class="sq-prompt-copy">
            <strong class="sq-prompt-word">${d(a)}</strong>
            ${t&&n?`<span class="sq-prompt-ph">[${d(n)}]</span>`:""}
          </div>
          <button id="btnSqHeroAudio" type="button" class="brass-btn gold-cta sq-audio-btn">Nghe</button>
        </div>
      `);let v="";if(o==="audio_listening"||o==="pic_flashcard"||o==="word_flashcard"||o==="bubble_pop"){const q=e.choices??[],s=e.choicePhonetics??[],i=e.choiceSprites??[],c=e.choiceSubtitles??[],f=o==="pic_flashcard"||o==="audio_listening";v=`
        <div class="sq-choice-grid">
          ${q.map((u,g)=>{let y="";t&&(g===e.correctIndex?y="is-correct":g===this.selectedChoiceIdx?y="is-wrong":y="is-dimmed");const T=i[g]??l,C=c[g]??"";return`
                <button
                  type="button"
                  class="sq-choice-btn ${y}"
                  data-sq-choice="${g}"
                  ${t?"disabled":""}
                >
                  <img src="${T}" alt="" class="sq-kid-card-img" />
                  <div class="sq-kid-card-caption">
                    <span class="sq-choice-main">${d(u)}</span>
                    ${!f&&s[g]?`<small class="sq-choice-ph">[${d(s[g])}]</small>`:t&&C?`<small class="sq-choice-ph">${d(C)}</small>`:""}
                  </div>
                </button>
              `}).join("")}
        </div>
      `}else if(e.format==="sentence_builder"){const q=e.shuffledTokens??[],s=e.expectedSentenceTokens??[],i=new Set(this.placedTokenIndices),c=s.map((u,g)=>{const y=this.placedTokenIndices[g],T=y!==void 0?q.find(C=>C.idx===y):void 0;return T?`
              <button
                type="button"
                class="sq-word-chip placed sq-kid-slot-filled"
                data-sq-unplace="${g}"
                ${t?"disabled":""}
                title="Bấm để bỏ mảnh chữ này xuống"
              >
                ${d(T.text)}
              </button>
            `:'<span class="sq-kid-slot-empty">?</span>'}).join(""),f=q.map(u=>{const g=i.has(u.idx);return`
            <button
              type="button"
              class="sq-word-chip bank sq-kid-tile ${g?"used":""}"
              data-sq-place="${u.idx}"
              ${g||t?"disabled":""}
            >
              ${d(u.text)}
            </button>
          `}).join("");v=`
        <div class="sq-sentence-builder sq-kid-tile-builder">
          <div class="sq-sentence-slots sq-kid-tile-slots ${this.placedTokenIndices.length>0?"has-words":""}">
            ${c}
          </div>
          <div class="sq-word-bank sq-kid-tile-bank">${f}</div>
          ${t?"":`
                <div class="sq-sentence-actions">
                  <button id="btnSqHintTile" type="button" class="brass-btn" title="Gợi ý 1 mảnh chữ">Gợi ý</button>
                  <button id="btnSqResetSentence" type="button" class="brass-btn" ${this.placedTokenIndices.length===0?"disabled":""}>Xếp lại</button>
                  <button id="btnSqCheckSentence" type="button" class="brass-btn gold-cta" ${this.placedTokenIndices.length===0?"disabled":""}>Kiểm tra</button>
                </div>
              `}
        </div>
      `}else if(e.format==="match_pairs"){const q=e.leftCards??[],s=e.rightCards??[];v=`
        <div class="sq-pairs-wrap sq-kid-pairs-wrap">
          <div class="sq-pairs-col">
            <div class="sq-pairs-col-title">Từ vựng</div>
            ${q.map(i=>{const c=this.matchedPairIds.has(i.pairId),f=this.selectedLeftPairId===i.pairId;return`
                  <button
                    type="button"
                    class="sq-pair-btn sq-pair-left sq-kid-pair-word ${c?"matched":""} ${f?"selected":""}"
                    data-sq-left-pair="${d(i.pairId)}"
                    ${c||t?"disabled":""}
                  >
                    <span class="sq-pair-word">${d(i.word)}</span>
                    <small class="sq-pair-ph">[${d(i.phonetic)}]</small>
                  </button>
                `}).join("")}
          </div>
          <div class="sq-pairs-col">
            <div class="sq-pairs-col-title">Nghĩa</div>
            ${s.map(i=>{const c=this.matchedPairIds.has(i.pairId),f=this.flashWrongPairKey===i.pairId,u=i.spriteSrc??X(i.meaningVi,i.word,i.pairId).spriteSrc,g=i.shortVi??B(i.meaningVi);return`
                  <button
                    type="button"
                    class="sq-pair-btn sq-pair-right sq-kid-pair-pic ${c?"matched":""} ${f?"wrong-flash":""}"
                    data-sq-right-pair="${d(i.pairId)}"
                    ${c||t?"disabled":""}
                  >
                    <img src="${u}" alt="" class="sq-pair-pic-img" />
                    <span class="sq-pair-meaning">${d(g)}</span>
                  </button>
                `}).join("")}
          </div>
        </div>
      `}const b=this.answeredOutcome?this.renderVietnameseExplanationCard(e,this.answeredOutcome):"";return`
      <div class="sq-stage-card">
        ${m}
        ${v}
        ${b}
      </div>
    `}renderVietnameseExplanationCard(e,t){const o=this.sim.getSeedCount(this.targetCropId),l=e.format==="sentence_builder"&&!!(e.expectedSentenceTokens&&e.expectedSentenceTokens.length>=2),r=l?e.fullSentence:e.heroWord??e.fullSentence,h=l?e.fullPhonetic:e.heroPhonetic??e.fullPhonetic,n=l?e.translationVi:e.heroShortVi??B(e.translationVi);return`
      <div class="sq-explain-card ${t.correct?"is-pass":"is-review"}">
        <div class="sq-explain-copy">
          <div class="sq-explain-status">
            ${t.practice?"<strong>Đúng</strong> · Đủ 30 câu thưởng hôm nay":t.correct?`<strong>Đúng</strong> · +${t.seedsAwarded} ${d(t.cropName)} · +${t.xpAwarded} XP${t.buildReduction&&t.buildReduction.reducedSec>0?` · −${M(t.buildReduction.reducedSec)}`:""}`:`<strong>Đáp án:</strong> ${d(r)}${h?` [${d(h)}]`:""} — ${d(n)}`}
          </div>
          ${t.correct?`<div class="sq-kid-result-word"><strong>${d(r)}</strong>${h?` <span class="sq-vocab-ph">[${d(h)}]</span>`:""} — ${d(n)}</div>`:""}
        </div>
        <div class="sq-explain-actions">
          <button id="btnSqSpeakFull" type="button" class="brass-btn sq-tool-pill">Nghe</button>
          ${o>0?`<button id="btnSqExplainSow" type="button" class="brass-btn sq-tool-pill">Gieo ×${o}</button>`:""}
          <button id="btnSqNextQuestion" type="button" class="brass-btn gold-cta sq-next-btn">Câu tiếp</button>
        </div>
      </div>
    `}bindRenderedEvents(e){const t=e.querySelector("#selSqTargetCrop");t?.addEventListener("change",()=>{const s=t.value;s&&L[s]&&(this.targetCropId=s,this.render())}),e.querySelector("#btnSqSowNow")?.addEventListener("click",()=>{this.handleSowEquippedSeed()}),e.querySelector("#btnSqExplainSow")?.addEventListener("click",()=>{this.handleSowEquippedSeed()}),e.querySelector("#btnSqBuy1")?.addEventListener("click",()=>{this.handleBuySeedsWithSickle(1)}),e.querySelector("#btnSqBuy3")?.addEventListener("click",()=>{this.handleBuySeedsWithSickle(3)});const o=e.querySelector("#btnSqAutoSpeak");o?.addEventListener("click",()=>{const s=this.sim.ensureLanguageQuiz();s.autoSpeak=!s.autoSpeak,o.setAttribute("aria-pressed",String(s.autoSpeak)),this.sim.saveToStorage()});const l=e.querySelector("#selSqTier");l?.addEventListener("change",()=>{const s=l.value,i=this.sim.ensureLanguageQuiz();(s==="beginner"||s==="intermediate"||s==="advanced")&&(this.challenge&&!this.answeredOutcome&&I(i,this.challenge),j(i,i.activeLang,s),this.loadNextQuestion(!0))});const r=e.querySelector("#selSqFormat");r?.addEventListener("change",()=>{const s=r.value,i=this.sim.ensureLanguageQuiz();D.includes(s)&&i.preferredFormat!==s&&(this.challenge&&!this.answeredOutcome&&I(i,this.challenge),i.preferredFormat=s,this.loadNextQuestion(!0))});const h=e.querySelector("#selSqTopic");h?.addEventListener("change",()=>{const s=h.value,i=this.sim.ensureLanguageQuiz();J.includes(s)&&(i.preferredTopic??"all")!==s&&(this.challenge&&!this.answeredOutcome&&I(i,this.challenge),i.preferredTopic=s,this.loadNextQuestion(!0))}),e.querySelector("#btnSqClaimStreak")?.addEventListener("click",s=>{const i=s.currentTarget,c=Number(i.dataset.streakDays),f=this.sim.claimQuizDailyStreakMilestone(c);this.onToast(f.msg,f.ok?"📖":"⏳"),this.onRefreshHud(),this.render()}),e.querySelector("#btnSqRevealListeningScript")?.addEventListener("click",()=>{this.listeningHintRevealed=!0,this.sim.audio.playClick(),this.render()}),e.querySelectorAll("[data-sq-lang]").forEach(s=>{s.addEventListener("click",()=>{const i=s.dataset.sqLang,c=this.sim.ensureLanguageQuiz();i&&F.includes(i)&&c.activeLang!==i&&(this.challenge&&!this.answeredOutcome&&I(c,this.challenge),c.activeLang=i,this.activeSubView==="codex"?(this.ensureActiveLangPackLoaded(i,!1),this.sim.saveToStorage(),this.render()):this.loadNextQuestion(!0))})});const n=e.querySelector("#inpSqCodexSearch");n&&n.addEventListener("input",()=>{this.codexQuery=n.value;const s=e.querySelector("#sqCodexResultsMount");if(s){const i=this.sim.ensureLanguageQuiz(),c=i.activeLang;s.innerHTML=this.renderLexiconCodexRowsHtml(c,i.profiles[c]),this.bindCodexRowSpeakEvents(s,c)}}),e.querySelectorAll("[data-sq-codex-filter]").forEach(s=>{s.addEventListener("click",()=>{const i=s.dataset.sqCodexFilter;(i==="all"||i==="mastered"||i==="learning"||i==="unseen")&&(this.codexBoxFilter=i,this.render())})});const a=e.querySelector("#sqCodexResultsMount");if(a){const s=this.sim.ensureLanguageQuiz();this.bindCodexRowSpeakEvents(a,s.activeLang)}e.querySelector("#btnSqHeroAudio")?.addEventListener("click",()=>{this.challenge&&x(this.challenge.ttsPromptText||this.challenge.fullSentence,this.challenge.lang,.94)}),e.querySelector("#btnSqSpeakSlow")?.addEventListener("click",()=>{if(!this.challenge)return;const s=this.answeredOutcome?this.challenge.fullSentence:this.challenge.ttsPromptText;x(s,this.challenge.lang,.72)}),e.querySelector("#btnSqSpeakFull")?.addEventListener("click",()=>{this.challenge&&x(this.challenge.fullSentence,this.challenge.lang,.96)}),e.querySelectorAll("[data-sq-speak-word]").forEach(s=>{s.addEventListener("click",()=>{if(!this.challenge)return;const i=Number(s.dataset.sqSpeakWord??-1),c=this.challenge.vocabNotes[i];c&&x(c.word,this.challenge.lang,.9)})}),e.querySelector("#btnSqSkipQuestion")?.addEventListener("click",()=>{const s=this.sim.ensureLanguageQuiz();I(s,this.challenge),this.skipFormatOffset+=1,this.loadNextQuestion(!0)}),e.querySelector("#btnSqNextQuestion")?.addEventListener("click",()=>{this.loadNextQuestion(!0)}),e.querySelectorAll("[data-sq-choice]").forEach(s=>{s.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const i=Number(s.dataset.sqChoice??-1);this.selectedChoiceIdx=i;const c=i===(this.challenge.correctIndex??0);c?this.sim.audio.playMatchPop(2):this.sim.audio.playClick(),this.submitAttempt(c)})});const m=()=>{if(!this.challenge||this.answeredOutcome)return!1;const s=this.challenge.expectedSentenceTokens??[],i=this.challenge.shuffledTokens??[];if(this.placedTokenIndices.length<s.length)return!1;const c=this.placedTokenIndices.map(u=>i.find(g=>g.idx===u)?.text??""),f=c.length===s.length&&c.every((u,g)=>u===s[g]);return f?this.sim.audio.playMatchPop(2):this.sim.audio.playClick(),this.submitAttempt(f),!0};e.querySelectorAll("[data-sq-place]").forEach(s=>{s.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const i=Number(s.dataset.sqPlace??-1);if(i>=0&&!this.placedTokenIndices.includes(i)){this.placedTokenIndices.push(i),this.sim.audio.playMatchPop(1);const c=this.challenge.shuffledTokens?.find(u=>u.idx===i),f=this.sim.ensureLanguageQuiz();c&&f.autoSpeak&&x(c.text,this.challenge.lang,.95),m()||this.render()}})}),e.querySelectorAll("[data-sq-unplace]").forEach(s=>{s.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const i=Number(s.dataset.sqUnplace??-1);i>=0&&i<this.placedTokenIndices.length&&(this.placedTokenIndices.splice(i,1),this.sim.audio.playClick(),this.render())})}),e.querySelector("#btnSqHintTile")?.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const s=this.challenge.expectedSentenceTokens??[],i=this.challenge.shuffledTokens??[];let c=this.placedTokenIndices.length;for(let u=0;u<this.placedTokenIndices.length;u++)if(i.find(y=>y.idx===this.placedTokenIndices[u])?.text!==s[u]){c=u;break}c<this.placedTokenIndices.length&&(this.placedTokenIndices.length=c);const f=this.placedTokenIndices.length;if(f<s.length){const u=s[f],g=i.find(y=>y.text===u&&!this.placedTokenIndices.includes(y.idx));g&&(this.placedTokenIndices.push(g.idx),this.sim.audio.playMatchPop(1),m()||this.render())}}),e.querySelector("#btnSqResetSentence")?.addEventListener("click",()=>{this.answeredOutcome||(this.placedTokenIndices=[],this.sim.audio.playClick(),this.render())}),e.querySelector("#btnSqCheckSentence")?.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const s=this.challenge.expectedSentenceTokens??[],i=this.challenge.shuffledTokens??[],c=this.placedTokenIndices.map(u=>i.find(g=>g.idx===u)?.text??""),f=c.length===s.length&&c.every((u,g)=>u===s[g]);this.submitAttempt(f)}),e.querySelectorAll("[data-sq-left-pair]").forEach(s=>{s.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const i=s.dataset.sqLeftPair??"";if(!i||this.matchedPairIds.has(i))return;this.selectedLeftPairId=i,this.flashWrongPairKey=null,this.sim.audio.playClick();const c=this.challenge.leftCards?.find(u=>u.pairId===i),f=this.sim.ensureLanguageQuiz();c&&f.autoSpeak&&x(c.word,this.challenge.lang,.92),this.render()})}),e.querySelectorAll("[data-sq-right-pair]").forEach(s=>{s.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const i=s.dataset.sqRightPair??"";if(!(!i||this.matchedPairIds.has(i))){if(!this.selectedLeftPairId){this.onToast("Chọn thẻ Từ bên trái trước.","🪄");return}if(this.selectedLeftPairId===i){this.matchedPairIds.add(i),this.selectedLeftPairId=null,this.flashWrongPairKey=null,this.sim.audio.playMatchPop(2);const c=this.challenge.leftCards?.length??3;if(this.matchedPairIds.size>=c){this.submitAttempt(this.pairMistakes<=1);return}this.render()}else this.pairMistakes+=1,this.flashWrongPairKey=i,this.sim.audio.playClick(),this.render()}})});const v=e.querySelector("#sqScrollViewport"),b=e.querySelector("#sqZoomSizer"),q=e.querySelector("#sqZoomStage");w.bindDomScrollStageInteractions({rootScope:e,scrollViewportEl:v,sizerEl:b,contentStageEl:q,onOrientationToggled:()=>this.render(),onPlayClick:()=>this.sim.audio.playClick()})}}export{Te as SeedQuizModalController};
