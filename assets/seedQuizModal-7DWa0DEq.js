var ge=Object.defineProperty;var me=(w,e,t)=>e in w?ge(w,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):w[e]=t;var m=(w,e,t)=>me(w,typeof e!="symbol"?e+"":e,t);import{F as $,ax as W,ay as Se,d as R,J as V,at as be,Q as M,aw as fe}from"./game-data-D8DCwVFZ.js";import{ba as j,bb as T,bc as Z,bd as k,be as qe,bf as G,aN as ve,bg as X,bh as H}from"./sim-foundation-D_to9JYB.js";import{s as x,M as Y}from"./minigameViewControls-CXvIJwsv.js";import{m as ye}from"./hpvn-platform-B1Lovr2y.js";function d(w){return String(w??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const B=["en","ko","zh","es","ja"],F=["all","listening_comprehension","grammar_cloze","dialogue_reply","sentence_builder","match_pairs","vocab_context"],J=["all","daily","travel","study_tech","health_hobby","magic","farm"];class Te{constructor(e,t,l,r,a){m(this,"root");m(this,"sim");m(this,"onRefreshHud");m(this,"onToast");m(this,"onEquipAndSow");m(this,"targetCropId","ottery_wheat");m(this,"pendingPlotUid",null);m(this,"openedFromSowIntent",!1);m(this,"seedsAcquiredInSession",!1);m(this,"challenge",null);m(this,"capNoticeShown",!1);m(this,"answeredOutcome",null);m(this,"selectedChoiceIdx",null);m(this,"placedTokenIndices",[]);m(this,"selectedLeftPairId",null);m(this,"matchedPairIds",new Set);m(this,"flashWrongPairKey",null);m(this,"pairMistakes",0);m(this,"listeningHintRevealed",!1);m(this,"activeSubView","practice");m(this,"codexQuery","");m(this,"codexBoxFilter","all");m(this,"sessionShownQids",new Set);m(this,"skipFormatOffset",0);m(this,"starterChallengePendingPack",!1);m(this,"dialogCloseBound",!1);m(this,"onOpenLeaderboard");if(this.root=e,this.sim=t,this.onRefreshHud=l,this.onToast=r,this.onEquipAndSow=a,typeof window<"u"){const h=()=>{if(!this.isOpen())return;const o=this.getDialog(),n=typeof o?.querySelector=="function"?o.querySelector(".sq-modal-inner"):null;x.applyDialogOrientation(o,n,!0),this.syncSeedQuizViewportTransform()};window.addEventListener("resize",h),window.visualViewport?.addEventListener("resize",h),window.addEventListener("keydown",o=>{if(!this.isOpen())return;const n=o.target?.tagName;n==="INPUT"||n==="TEXTAREA"||n==="SELECT"||(o.key==="+"||o.key==="="?(o.preventDefault(),x.stepZoom("seedquiz",Y),this.syncSeedQuizViewportTransform()):o.key==="-"||o.key==="_"?(o.preventDefault(),x.stepZoom("seedquiz",-Y),this.syncSeedQuizViewportTransform()):o.key==="0"&&(o.ctrlKey||o.metaKey)&&(o.preventDefault(),x.resetView("seedquiz"),this.syncSeedQuizViewportTransform()))})}}getDialog(){return this.root.querySelector("#seedQuizDialog")}isOpen(){return!!this.getDialog()?.open}syncSeedQuizViewportTransform(){const e=this.root.querySelector("#seedQuizDialogContent");if(!e)return;const t=e.querySelector("#sqScrollViewport"),l=e.querySelector("#sqZoomSizer"),r=e.querySelector("#sqZoomStage");x.applyDomScrollStageTransform(t,l,r),x.syncToolbarDOM(e,"seedquiz")}open(e,t,l,r,a,h){(h==="practice"||h==="codex")&&(this.activeSubView=h),this.openedFromSowIntent=!!e,this.seedsAcquiredInSession=!1;const o=Object.values($).filter(g=>this.sim.state.sandboxMode||this.sim.state.level>=g.unlockLevel);if(e&&$[e]){const g=$[e];this.sim.state.sandboxMode||this.sim.state.level>=g.unlockLevel?this.targetCropId=e:o.length>0&&(this.targetCropId=o[0].id)}else!$[this.targetCropId]&&o.length>0&&(this.targetCropId=o[0].id);this.pendingPlotUid=t??null,this.pendingPlotUid||this.sim.setLastPlayedMinigame("seedquiz");const n=this.sim.ensureLanguageQuiz();let b=!this.challenge||this.answeredOutcome!==null;l&&B.includes(l)&&n.activeLang!==l&&(n.activeLang=l,b=!0),r&&(r==="beginner"||r==="intermediate"||r==="advanced")&&(j(n,n.activeLang,r),b=!0),a&&F.includes(a)&&(n.preferredFormat=a,b=!0),b||this.challenge?.lang!==n.activeLang?(this.challenge&&!this.answeredOutcome&&T(n,this.challenge),this.loadNextQuestion(!0)):(this.ensureActiveLangPackLoaded(n.activeLang,!1),this.render());const v=this.root.querySelector("#seedQuizDialog");v&&!v.open&&v.showModal(),this.onRefreshHud()}recordSessionShownQid(e){for(this.sessionShownQids.delete(e),this.sessionShownQids.add(e);this.sessionShownQids.size>350;){const t=this.sessionShownQids.values().next().value;if(t===void 0)break;this.sessionShownQids.delete(t)}}hasUserInteractedWithCurrentQuestion(){return this.answeredOutcome!==null||this.selectedChoiceIdx!==null||this.placedTokenIndices.length>0||this.matchedPairIds.size>0||this.selectedLeftPairId!==null}ensureActiveLangPackLoaded(e,t=!1){W(e)||Se(e).then(l=>{const r=this.sim.ensureLanguageQuiz();if(r.activeLang===e){if(l){if(this.starterChallengePendingPack&&!this.hasUserInteractedWithCurrentQuestion()){if(this.starterChallengePendingPack=!1,this.challenge=Z(r,this.sim.state.level,{excludeIds:this.sessionShownQids,formatOffset:this.skipFormatOffset}),this.recordSessionShownQid(this.challenge.qId),this.render(),t&&r.autoSpeak&&this.challenge&&this.activeSubView==="practice"){const a=this.challenge.ttsPromptText||this.challenge.fullSentence;a&&k(a,this.challenge.lang,.94)}return}this.starterChallengePendingPack=!1,this.challenge&&this.recordSessionShownQid(this.challenge.qId),this.answeredOutcome||this.render();return}if(this.starterChallengePendingPack=!1,this.challenge&&this.recordSessionShownQid(this.challenge.qId),t&&r.autoSpeak&&this.challenge&&!this.answeredOutcome&&this.activeSubView==="practice"){const a=this.challenge.ttsPromptText||this.challenge.fullSentence;a&&k(a,this.challenge.lang,.94)}}})}close(){const e=this.root.querySelector("#seedQuizDialog");e?.open&&e.close(),this.flushPendingSowOnDismiss()}resetInteractiveQuestionState(){this.answeredOutcome=null,this.selectedChoiceIdx=null,this.placedTokenIndices=[],this.selectedLeftPairId=null,this.matchedPairIds.clear(),this.flashWrongPairKey=null,this.pairMistakes=0,this.listeningHintRevealed=!1}loadNextQuestion(e=!0){this.resetInteractiveQuestionState();const t=this.sim.ensureLanguageQuiz(),l=W(t.activeLang);this.challenge=Z(t,this.sim.state.level,{excludeIds:this.sessionShownQids,formatOffset:this.skipFormatOffset}),l?(this.starterChallengePendingPack=!1,this.recordSessionShownQid(this.challenge.qId)):(this.starterChallengePendingPack=!0,this.ensureActiveLangPackLoaded(t.activeLang,e)),this.sim.saveToStorage(),this.render();const r=this.root.querySelector("#seedQuizDialog .sq-modal-inner");if(r&&(r.scrollTop=0),l&&e&&t.autoSpeak&&this.challenge){const a=this.challenge.ttsPromptText||this.challenge.fullSentence;a&&k(a,this.challenge.lang,.94)}}submitAttempt(e){if(!this.challenge||this.answeredOutcome)return;const t=this.sim.completeSeedLanguageQuizAttempt(this.targetCropId,this.challenge,e);this.answeredOutcome=t,this.sim.ensureLanguageQuiz().autoSpeak&&k(this.challenge.fullSentence,this.challenge.lang,.95);const r=$[this.targetCropId];if(t.correct&&t.practice)this.capNoticeShown||(this.capNoticeShown=!0,this.onToast("Hôm nay đã nhận đủ 30 câu có thưởng, giờ là luyện tập","📖"));else if(t.correct){(t.seedsAwarded??0)>0&&(this.seedsAcquiredInSession=!0);const a=t.tierAutoPromoted?` • Thăng hạng ${R[this.challenge.lang].tierLabels[t.tierAutoPromoted]}!`:"",h=t.phoenixTalismanAwarded?` • 🔥 +${t.phoenixTalismanAwarded} Bùa Trợ Chiến Phượng Hoàng!`:"",o=t.buildReduction&&t.buildReduction.reducedSec>0?t.buildReduction.ecoReduced?` • ⏱️ -${V(t.buildReduction.reducedSec)} cho cây đang lớn, thú nuôi & xưởng${t.buildReduction.targetName?`, xây ${t.buildReduction.targetName}`:""}!`:` • 🔨 -${V(t.buildReduction.reducedSec)} xây ${t.buildReduction.targetName??"công trình"}!`:"",n=t.leaderboardRankUp&&t.leaderboardRankUp.rankUpBy>0?` • 🏆 Lên Hạng #${t.leaderboardRankUp.newRank} (+${t.leaderboardRankUp.rankUpBy} bậc)!`:"";this.onToast(`🪄 Chuẩn xác thần chú! Nhận +${t.seedsAwarded} hạt ${r.emoji} ${r.name} (Túi: ${t.newSeedCount} hạt)${o}${a}${h}${n}`,t.phoenixTalismanAwarded?"🔥":"🌱")}this.onRefreshHud(),this.render(),requestAnimationFrame(()=>{this.root.querySelector("#seedQuizDialog .sq-explain-card")?.scrollIntoView({behavior:"smooth",block:"nearest"})})}flushPendingSowOnDismiss(){if(this.seedsAcquiredInSession&&(this.seedsAcquiredInSession=!1,this.openedFromSowIntent=!1,this.sim.state.sandboxMode||this.sim.getSeedCount(this.targetCropId)>0)){const e=this.pendingPlotUid;this.pendingPlotUid=null,this.onEquipAndSow(this.targetCropId,e)}}handleSowEquippedSeed(){const e=this.sim.getSeedCount(this.targetCropId);if(!this.sim.state.sandboxMode&&e<=0){this.onToast("Túi hạt đang trống — hãy mua bằng Sickle hoặc niệm 1 câu Thần Chú Đa Ngữ bên cạnh nhé!","🌱");return}const t=this.pendingPlotUid;this.pendingPlotUid=null,this.seedsAcquiredInSession=!1,this.openedFromSowIntent=!1,this.close(),this.onEquipAndSow(this.targetCropId,t)}handleBuySeedsWithSickle(e){const t=this.sim.buyCropSeedWithGold(this.targetCropId,e);if(this.onToast(t.msg,t.ok?"🌱":"🪙"),t.ok){if(this.seedsAcquiredInSession=!0,this.openedFromSowIntent){this.handleSowEquippedSeed();return}this.onRefreshHud(),this.render()}}render(){const e=this.root.querySelector("#seedQuizDialogContent");if(!e)return;const t=this.getDialog(),l=typeof t?.querySelector=="function"?t.querySelector(".sq-modal-inner"):null;t&&typeof t.addEventListener=="function"&&!this.dialogCloseBound&&(this.dialogCloseBound=!0,t.addEventListener("close",()=>{if(t.open)return;if(typeof window<"u"&&"speechSynthesis"in window)try{window.speechSynthesis.cancel()}catch{}const p=typeof t.querySelector=="function"?t.querySelector(".sq-modal-inner"):null;x.clearDialogOrientation(t,p),this.flushPendingSowOnDismiss()})),x.applyDialogOrientation(t,l,!0);const r=e.querySelector("#sqScrollViewport"),a=r?r.scrollTop:0,h=r?r.scrollLeft:0,o=this.sim.ensureLanguageQuiz(),n=o.activeLang,b=R[n],v=o.profiles[n],g=$[this.targetCropId],q=this.sim.getSeedCount(this.targetCropId),s=t?.querySelector("#btnSqHeaderSubView");s&&(s.textContent=this.activeSubView==="codex"?"Luyện tập":"Từ điển",s.setAttribute("aria-pressed",String(this.activeSubView==="codex")),s.onclick=()=>{if(this.sim.audio.playClick(),this.activeSubView=this.activeSubView==="codex"?"practice":"codex",this.activeSubView==="codex"){const p=this.sim.ensureLanguageQuiz();this.ensureActiveLangPackLoaded(p.activeLang)}this.render()});const i=Object.values($).sort((p,y)=>p.unlockLevel-y.unlockLevel||p.growSec-y.growSec),c=p=>i.filter(y=>!!y.isFlowerCrop===p).map(y=>{const E=!this.sim.state.sandboxMode&&this.sim.state.level<y.unlockLevel,P=y.id===this.targetCropId,O=this.sim.getSeedCount(y.id),pe=E?`Cấp ${y.unlockLevel} · ${y.name}`:`${y.name} (×${O})`;return`<option value="${y.id}" ${P?"selected":""} ${E?"disabled":""}>${d(pe)}</option>`}).join(""),S=B.map(p=>{const y=R[p],E=o.profiles[p],P=p===n,O=p==="es"?"TBN":y.tabVi;return`
        <button
          type="button"
          role="tab"
          class="sq-lang-tab ${P?"active":""}"
          data-sq-lang="${p}"
          aria-selected="${P}"
          title="${d(y.nameVi)} · Cấp ${E.masteryScore}"
        >${d(O)}</button>
      `}).join(""),u=[{id:"beginner",label:"Tập Sự"},{id:"intermediate",label:"O.W.L."},{id:"advanced",label:"N.E.W.T."}],f=u.map(p=>`<option value="${p.id}" ${v.tier===p.id?"selected":""}>${d(p.label)}</option>`).join(""),L={all:"Đủ dạng",listening_comprehension:"Nghe hiểu",vocab_context:"Nhìn tranh",dialogue_reply:"Đập bóng",grammar_cloze:"Điền từ",sentence_builder:"Ghép chữ",match_pairs:"Nối cặp"},C=F.map(p=>`<option value="${p}" ${o.preferredFormat===p?"selected":""}>${d(L[p])}</option>`).join(""),D={all:"Mọi chủ đề",...fe},U=o.preferredTopic??"all",ee=J.map(p=>`<option value="${p}" ${U===p?"selected":""}>${d(D[p])}</option>`).join(""),te=D[U]??"Mọi chủ đề",se=qe(),ie=o.todayStudyDayKey===se?Math.min(G,o.todayAnsweredCount??0):0,K=o.dailyStreakCount??0,ne=Math.max(K,o.bestDailyStreakCount??0),ae=o.claimedStreakMilestones??[],Q=ve.find(p=>!ae.includes(p.days)&&(this.sim.state.sandboxMode||ne>=p.days)),oe=!this.sim.state.sandboxMode&&this.sim.state.level<g.unlockLevel?`Cấp ${g.unlockLevel} · ${g.name}`:`${g.name} (×${q})`,le=u.find(p=>p.id===v.tier)?.label??"Tập Sự",re=L[o.preferredFormat]??"Đủ dạng",ce=this.challenge?this.renderChallengeStage(this.challenge):"",de=this.answeredOutcome!==null,I=!!this.sim.state.sandboxMode,z=this.sim.state.galleons,A=g.seedCost,N=g.seedCost*3,he=I?"0":A.toLocaleString("vi-VN"),ue=I?"0":N.toLocaleString("vi-VN");e.innerHTML=`
      <div class="sq-scroll-viewport" id="sqScrollViewport">
        <div class="sq-zoom-sizer" id="sqZoomSizer">
          <div class="sq-zoom-stage" id="sqZoomStage">
            <div class="sq-root">
              <div class="sq-lang-tabs" role="tablist" aria-label="Chọn ngôn ngữ">${S}</div>
              ${this.activeSubView==="codex"?this.renderLexiconCodexPanel(n,v):`
                    <div class="sq-setup-row" title="${d(b.tierLabels[v.tier])}">
                      <img src="${be(g.id)}" alt="" width="22" height="22" class="sq-crop-pill-img" />
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
                        <select id="selSqTier" class="sq-select" aria-label="Chọn cấp độ">${f}</select>
                      </div>
                    </div>
                    <div class="sq-buy-row" role="group" aria-label="Mua hạt giống bằng Sickle">
                      <button
                        id="btnSqBuy1"
                        type="button"
                        class="brass-btn sq-tool-pill sq-buy-pill"
                        data-unaffordable="${!I&&z<A}"
                        title="Mua 1 hạt ${d(g.name)} (${A.toLocaleString("vi-VN")} Sickle)"
                      >+1 hạt · 🪙${he}</button>
                      <button
                        id="btnSqBuy3"
                        type="button"
                        class="brass-btn sq-tool-pill sq-buy-pill"
                        data-unaffordable="${!I&&z<N}"
                        title="Mua 3 hạt ${d(g.name)} (${N.toLocaleString("vi-VN")} Sickle)"
                      >+3 hạt · 🪙${ue}</button>
                      <span class="sq-sickle-chip" title="Số dư Sickle hiện có">
                        <span class="g-coin">S</span>
                        <strong>${I?"∞":ye(z)}</strong>
                      </span>
                      <span class="sq-sickle-chip" title="Chuỗi học thần chú hằng ngày (3 câu đúng/ngày)">
                        <strong>Chuỗi ${K} ngày (${ie}/${G})</strong>
                      </span>
                      ${Q?`<button id="btnSqClaimStreak" type="button" data-streak-days="${Q.days}" class="brass-btn gold-cta sq-tool-pill">🎁 Mốc ${Q.days}N</button>`:""}
                    </div>
                    <div class="sq-tools-row">
                      <div class="sq-select-shell sq-format-select">
                        <span class="sq-select-face" aria-hidden="true">
                          <span class="sq-select-label">${d(re)}</span>
                          <span class="sq-select-caret"></span>
                        </span>
                        <select id="selSqFormat" class="sq-select" aria-label="Chọn dạng câu hỏi">${C}</select>
                      </div>
                      <div class="sq-select-shell sq-format-select">
                        <span class="sq-select-face" aria-hidden="true">
                          <span class="sq-select-label">${d(te)}</span>
                          <span class="sq-select-caret"></span>
                        </span>
                        <select id="selSqTopic" class="sq-select" aria-label="Chọn chủ đề từ vựng">${ee}</select>
                      </div>
                      <button id="btnSqAutoSpeak" type="button" class="brass-btn sq-tool-pill" aria-pressed="${o.autoSpeak}">Tự đọc</button>
                      <button id="btnSqSpeakSlow" type="button" class="brass-btn sq-tool-pill" title="Nghe chậm">Chậm</button>
                      ${de?"":'<button id="btnSqSkipQuestion" type="button" class="brass-btn sq-tool-pill" title="Đổi câu khác">Đổi</button>'}
                    </div>
                    ${ce}
                  `}
            </div>
          </div>
        </div>
      </div>
    `,this.bindRenderedEvents(e);const _=e.querySelector("#sqScrollViewport");_&&(a>0||h>0)&&(_.scrollTop=a,_.scrollLeft=h)}getLexiconEntrySrsInfo(e,t){const l=e.srsBoxes??{};let r=0,a=!1;for(const h of["vocab:","listen:","pairs:","cloze:","bubble:","tiles:"]){const o=l[`${h}${t}`];o&&(o.box>r&&(r=o.box),o.box<5&&o.dueAtTurn<=e.totalAnswered&&(a=!0))}return{box:r,due:a}}getLanguageLexiconEntries(e){return M.filter(t=>t.lang===e).sort((t,l)=>t.levelBand-l.levelBand||t.id.localeCompare(l.id))}renderLexiconCodexPanel(e,t){const l=this.getLanguageLexiconEntries(e);let r=0,a=0,h=0;for(const n of l){const{box:b}=this.getLexiconEntrySrsInfo(t,n.id);b>=5?r+=1:b>=1?a+=1:h+=1}const o=[{id:"all",label:`Tất cả (${l.length})`},{id:"mastered",label:`Thuộc (${r})`},{id:"learning",label:`Đang học (${a})`},{id:"unseen",label:`Mới (${h})`}].map(n=>`
          <button
            type="button"
            class="sq-format-chip ${this.codexBoxFilter===n.id?"active":""}"
            data-sq-codex-filter="${n.id}"
            aria-pressed="${this.codexBoxFilter===n.id}"
          >${n.label}</button>
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
          <div class="sq-codex-filters" role="group" aria-label="Lọc theo Hộp SRS">${o}</div>
        </div>
        <div id="sqCodexResultsMount">
          ${this.renderLexiconCodexRowsHtml(e,t,l)}
        </div>
      </div>
    `}renderLexiconCodexRowsHtml(e,t,l){const r=l??this.getLanguageLexiconEntries(e),a=this.codexQuery.trim().toLowerCase(),h=r.filter(n=>{const{box:b}=this.getLexiconEntrySrsInfo(t,n.id);return this.codexBoxFilter==="mastered"&&b<5||this.codexBoxFilter==="learning"&&(b<1||b>=5)||this.codexBoxFilter==="unseen"&&b>0?!1:a?n.word.toLowerCase().includes(a)||n.phonetic.toLowerCase().includes(a)||n.meaningVi.toLowerCase().includes(a)||n.exampleSentence.toLowerCase().includes(a)||n.exampleVi.toLowerCase().includes(a):!0});return h.length===0?`
        <div class="sq-codex-empty">
          Không có mục từ phù hợp.
        </div>
      `:`
      <div class="sq-codex-list" role="list">${h.map(n=>{const{box:b,due:v}=this.getLexiconEntrySrsInfo(t,n.id),g=X(n.meaningVi,n.word,n.id);let q="is-unseen",s=`Quyển ${n.levelBand}`;return b>=5?(q="is-box5",s="Thuộc"):b>=1&&(q=v?"is-due":"is-learning",s=`Hộp ${b}/5${v?" · Ôn":""}`),`
          <article class="sq-codex-row" role="listitem">
            <img src="${g.spriteSrc}" alt="" class="sq-codex-pic" />
            <div class="sq-codex-body">
              <div class="sq-codex-head">
                <strong class="sq-codex-word">${d(n.word)}</strong>
                <span class="sq-vocab-ph">[${d(n.phonetic)}]</span>
                <span class="sq-codex-meaning">— ${d(g.shortVi)}</span>
              </div>
              <span class="sq-codex-srs ${q}">${s}</span>
            </div>
            <button
              type="button"
              class="brass-btn sq-vocab-speak"
              data-sq-codex-word="${d(n.id)}"
              title="Nghe phát âm từ ${d(n.word)}"
            >Nghe</button>
          </article>
        `}).join("")}</div>
    `}bindCodexRowSpeakEvents(e,t){e.querySelectorAll("[data-sq-codex-word]").forEach(l=>{l.addEventListener("click",()=>{const r=l.dataset.sqCodexWord??"",a=M.find(h=>h.id===r);a&&k(a.word,t,.9)})}),e.querySelectorAll("[data-sq-codex-ex]").forEach(l=>{l.addEventListener("click",()=>{const r=l.dataset.sqCodexEx??"",a=M.find(h=>h.id===r);a&&k(a.exampleSentence,t,.95)})})}renderChallengeStage(e){const t=this.answeredOutcome!==null,l=e.visualGameKind??(e.format==="listening_comprehension"?"audio_listening":e.format==="vocab_context"?"pic_flashcard":e.format==="dialogue_reply"?"bubble_pop":e.format==="sentence_builder"?"word_tiles":e.format==="match_pairs"?"pic_pairs":"word_flashcard"),r=e.heroSpriteSrc??"/trang-trai-hang-soc/sprites/ui_icon_seed_sack.webp",a=e.heroWord??e.stemText,h=e.heroPhonetic??e.stemPhonetic??"",o=e.heroShortVi??H(e.translationVi);let n="";if(l==="audio_listening"){const g=t||this.listeningHintRevealed;n=`
        <div class="sq-prompt-row">
          <div class="sq-prompt-copy">
            <strong class="sq-prompt-word">${g?d(a):"Nghe phát âm & chọn nghĩa đúng"}</strong>
            ${g&&h?`<span class="sq-prompt-ph">[${d(h)}]</span>`:""}
          </div>
          <div style="display:flex;gap:6px;align-items:center;">
            ${g?"":'<button id="btnSqRevealListeningScript" type="button" class="brass-btn sq-tool-pill">Hiện chữ</button>'}
            <button id="btnSqHeroAudio" type="button" class="brass-btn gold-cta sq-audio-btn">Nghe</button>
          </div>
        </div>
      `}else l==="pic_flashcard"?n=`
        <div class="sq-prompt-row">
          <div class="sq-prompt-copy">
            <strong class="sq-prompt-word">${d(a)}</strong>
            ${h?`<span class="sq-prompt-ph">[${d(h)}]</span>`:""}
          </div>
          <button id="btnSqHeroAudio" type="button" class="brass-btn gold-cta sq-audio-btn">Nghe</button>
        </div>
      `:l!=="pic_pairs"&&(n=`
        <div class="sq-prompt-row">
          <img src="${r}" alt="" class="sq-prompt-img" />
          <div class="sq-prompt-copy">
            <strong class="sq-prompt-word">${d(o)}</strong>
            ${t&&h?`<span class="sq-prompt-ph">[${d(h)}]</span>`:""}
          </div>
          <button id="btnSqHeroAudio" type="button" class="brass-btn gold-cta sq-audio-btn">Nghe</button>
        </div>
      `);let b="";if(l==="audio_listening"||l==="pic_flashcard"||l==="word_flashcard"||l==="bubble_pop"){const g=e.choices??[],q=e.choicePhonetics??[],s=e.choiceSprites??[],i=e.choiceSubtitles??[],c=l==="pic_flashcard"||l==="audio_listening";b=`
        <div class="sq-choice-grid">
          ${g.map((S,u)=>{let f="";t&&(u===e.correctIndex?f="is-correct":u===this.selectedChoiceIdx?f="is-wrong":f="is-dimmed");const L=s[u]??r,C=i[u]??"";return`
                <button
                  type="button"
                  class="sq-choice-btn ${f}"
                  data-sq-choice="${u}"
                  ${t?"disabled":""}
                >
                  <img src="${L}" alt="" class="sq-kid-card-img" />
                  <div class="sq-kid-card-caption">
                    <span class="sq-choice-main">${d(S)}</span>
                    ${!c&&q[u]?`<small class="sq-choice-ph">[${d(q[u])}]</small>`:t&&C?`<small class="sq-choice-ph">${d(C)}</small>`:""}
                  </div>
                </button>
              `}).join("")}
        </div>
      `}else if(e.format==="sentence_builder"){const g=e.shuffledTokens??[],q=e.expectedSentenceTokens??[],s=new Set(this.placedTokenIndices),i=q.map((S,u)=>{const f=this.placedTokenIndices[u],L=f!==void 0?g.find(C=>C.idx===f):void 0;return L?`
              <button
                type="button"
                class="sq-word-chip placed sq-kid-slot-filled"
                data-sq-unplace="${u}"
                ${t?"disabled":""}
                title="Bấm để bỏ mảnh chữ này xuống"
              >
                ${d(L.text)}
              </button>
            `:'<span class="sq-kid-slot-empty">?</span>'}).join(""),c=g.map(S=>{const u=s.has(S.idx);return`
            <button
              type="button"
              class="sq-word-chip bank sq-kid-tile ${u?"used":""}"
              data-sq-place="${S.idx}"
              ${u||t?"disabled":""}
            >
              ${d(S.text)}
            </button>
          `}).join("");b=`
        <div class="sq-sentence-builder sq-kid-tile-builder">
          <div class="sq-sentence-slots sq-kid-tile-slots ${this.placedTokenIndices.length>0?"has-words":""}">
            ${i}
          </div>
          <div class="sq-word-bank sq-kid-tile-bank">${c}</div>
          ${t?"":`
                <div class="sq-sentence-actions">
                  <button id="btnSqHintTile" type="button" class="brass-btn" title="Gợi ý 1 mảnh chữ">Gợi ý</button>
                  <button id="btnSqResetSentence" type="button" class="brass-btn" ${this.placedTokenIndices.length===0?"disabled":""}>Xếp lại</button>
                  <button id="btnSqCheckSentence" type="button" class="brass-btn gold-cta" ${this.placedTokenIndices.length===0?"disabled":""}>Kiểm tra</button>
                </div>
              `}
        </div>
      `}else if(e.format==="match_pairs"){const g=e.leftCards??[],q=e.rightCards??[];b=`
        <div class="sq-pairs-wrap sq-kid-pairs-wrap">
          <div class="sq-pairs-col">
            <div class="sq-pairs-col-title">Từ vựng</div>
            ${g.map(s=>{const i=this.matchedPairIds.has(s.pairId),c=this.selectedLeftPairId===s.pairId;return`
                  <button
                    type="button"
                    class="sq-pair-btn sq-pair-left sq-kid-pair-word ${i?"matched":""} ${c?"selected":""}"
                    data-sq-left-pair="${d(s.pairId)}"
                    ${i||t?"disabled":""}
                  >
                    <span class="sq-pair-word">${d(s.word)}</span>
                    <small class="sq-pair-ph">[${d(s.phonetic)}]</small>
                  </button>
                `}).join("")}
          </div>
          <div class="sq-pairs-col">
            <div class="sq-pairs-col-title">Nghĩa</div>
            ${q.map(s=>{const i=this.matchedPairIds.has(s.pairId),c=this.flashWrongPairKey===s.pairId,S=s.spriteSrc??X(s.meaningVi,s.word,s.pairId).spriteSrc,u=s.shortVi??H(s.meaningVi);return`
                  <button
                    type="button"
                    class="sq-pair-btn sq-pair-right sq-kid-pair-pic ${i?"matched":""} ${c?"wrong-flash":""}"
                    data-sq-right-pair="${d(s.pairId)}"
                    ${i||t?"disabled":""}
                  >
                    <img src="${S}" alt="" class="sq-pair-pic-img" />
                    <span class="sq-pair-meaning">${d(u)}</span>
                  </button>
                `}).join("")}
          </div>
        </div>
      `}const v=this.answeredOutcome?this.renderVietnameseExplanationCard(e,this.answeredOutcome):"";return`
      <div class="sq-stage-card">
        ${n}
        ${b}
        ${v}
      </div>
    `}renderVietnameseExplanationCard(e,t){const l=this.sim.getSeedCount(this.targetCropId),r=e.heroWord??e.fullSentence,a=e.heroPhonetic??e.fullPhonetic,h=e.heroShortVi??H(e.translationVi);return`
      <div class="sq-explain-card ${t.correct?"is-pass":"is-review"}">
        <div class="sq-explain-copy">
          <div class="sq-explain-status">
            ${t.practice?"<strong>Đúng</strong> · Đủ 30 câu thưởng hôm nay":t.correct?`<strong>Đúng</strong> · +${t.seedsAwarded} ${d(t.cropName)} · +${t.xpAwarded} XP${t.buildReduction&&t.buildReduction.reducedSec>0?` · −${V(t.buildReduction.reducedSec)}`:""}`:`<strong>Đáp án:</strong> ${d(r)}${a?` [${d(a)}]`:""} — ${d(h)}`}
          </div>
          ${t.correct?`<div class="sq-kid-result-word"><strong>${d(r)}</strong>${a?` <span class="sq-vocab-ph">[${d(a)}]</span>`:""} — ${d(h)}</div>`:""}
        </div>
        <div class="sq-explain-actions">
          <button id="btnSqSpeakFull" type="button" class="brass-btn sq-tool-pill">Nghe</button>
          ${l>0?`<button id="btnSqExplainSow" type="button" class="brass-btn sq-tool-pill">Gieo ×${l}</button>`:""}
          <button id="btnSqNextQuestion" type="button" class="brass-btn gold-cta sq-next-btn">Câu tiếp</button>
        </div>
      </div>
    `}bindRenderedEvents(e){const t=e.querySelector("#selSqTargetCrop");t?.addEventListener("change",()=>{const s=t.value;s&&$[s]&&(this.targetCropId=s,this.render())}),e.querySelector("#btnSqSowNow")?.addEventListener("click",()=>{this.handleSowEquippedSeed()}),e.querySelector("#btnSqExplainSow")?.addEventListener("click",()=>{this.handleSowEquippedSeed()}),e.querySelector("#btnSqBuy1")?.addEventListener("click",()=>{this.handleBuySeedsWithSickle(1)}),e.querySelector("#btnSqBuy3")?.addEventListener("click",()=>{this.handleBuySeedsWithSickle(3)});const l=e.querySelector("#btnSqAutoSpeak");l?.addEventListener("click",()=>{const s=this.sim.ensureLanguageQuiz();s.autoSpeak=!s.autoSpeak,l.setAttribute("aria-pressed",String(s.autoSpeak)),this.sim.saveToStorage()});const r=e.querySelector("#selSqTier");r?.addEventListener("change",()=>{const s=r.value,i=this.sim.ensureLanguageQuiz();(s==="beginner"||s==="intermediate"||s==="advanced")&&(this.challenge&&!this.answeredOutcome&&T(i,this.challenge),j(i,i.activeLang,s),this.loadNextQuestion(!0))});const a=e.querySelector("#selSqFormat");a?.addEventListener("change",()=>{const s=a.value,i=this.sim.ensureLanguageQuiz();F.includes(s)&&i.preferredFormat!==s&&(this.challenge&&!this.answeredOutcome&&T(i,this.challenge),i.preferredFormat=s,this.loadNextQuestion(!0))});const h=e.querySelector("#selSqTopic");h?.addEventListener("change",()=>{const s=h.value,i=this.sim.ensureLanguageQuiz();J.includes(s)&&(i.preferredTopic??"all")!==s&&(this.challenge&&!this.answeredOutcome&&T(i,this.challenge),i.preferredTopic=s,this.loadNextQuestion(!0))}),e.querySelector("#btnSqClaimStreak")?.addEventListener("click",s=>{const i=s.currentTarget,c=Number(i.dataset.streakDays),S=this.sim.claimQuizDailyStreakMilestone(c);this.onToast(S.msg,S.ok?"📖":"⏳"),this.onRefreshHud(),this.render()}),e.querySelector("#btnSqRevealListeningScript")?.addEventListener("click",()=>{this.listeningHintRevealed=!0,this.sim.audio.playClick(),this.render()}),e.querySelectorAll("[data-sq-lang]").forEach(s=>{s.addEventListener("click",()=>{const i=s.dataset.sqLang,c=this.sim.ensureLanguageQuiz();i&&B.includes(i)&&c.activeLang!==i&&(this.challenge&&!this.answeredOutcome&&T(c,this.challenge),c.activeLang=i,this.activeSubView==="codex"?(this.ensureActiveLangPackLoaded(i,!1),this.sim.saveToStorage(),this.render()):this.loadNextQuestion(!0))})});const o=e.querySelector("#inpSqCodexSearch");o&&o.addEventListener("input",()=>{this.codexQuery=o.value;const s=e.querySelector("#sqCodexResultsMount");if(s){const i=this.sim.ensureLanguageQuiz(),c=i.activeLang;s.innerHTML=this.renderLexiconCodexRowsHtml(c,i.profiles[c]),this.bindCodexRowSpeakEvents(s,c)}}),e.querySelectorAll("[data-sq-codex-filter]").forEach(s=>{s.addEventListener("click",()=>{const i=s.dataset.sqCodexFilter;(i==="all"||i==="mastered"||i==="learning"||i==="unseen")&&(this.codexBoxFilter=i,this.render())})});const n=e.querySelector("#sqCodexResultsMount");if(n){const s=this.sim.ensureLanguageQuiz();this.bindCodexRowSpeakEvents(n,s.activeLang)}e.querySelector("#btnSqHeroAudio")?.addEventListener("click",()=>{this.challenge&&k(this.challenge.ttsPromptText||this.challenge.fullSentence,this.challenge.lang,.94)}),e.querySelector("#btnSqSpeakSlow")?.addEventListener("click",()=>{if(!this.challenge)return;const s=this.answeredOutcome?this.challenge.fullSentence:this.challenge.ttsPromptText;k(s,this.challenge.lang,.72)}),e.querySelector("#btnSqSpeakFull")?.addEventListener("click",()=>{this.challenge&&k(this.challenge.fullSentence,this.challenge.lang,.96)}),e.querySelectorAll("[data-sq-speak-word]").forEach(s=>{s.addEventListener("click",()=>{if(!this.challenge)return;const i=Number(s.dataset.sqSpeakWord??-1),c=this.challenge.vocabNotes[i];c&&k(c.word,this.challenge.lang,.9)})}),e.querySelector("#btnSqSkipQuestion")?.addEventListener("click",()=>{const s=this.sim.ensureLanguageQuiz();T(s,this.challenge),this.skipFormatOffset+=1,this.loadNextQuestion(!0)}),e.querySelector("#btnSqNextQuestion")?.addEventListener("click",()=>{this.loadNextQuestion(!0)}),e.querySelectorAll("[data-sq-choice]").forEach(s=>{s.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const i=Number(s.dataset.sqChoice??-1);this.selectedChoiceIdx=i;const c=i===(this.challenge.correctIndex??0);c?this.sim.audio.playMatchPop(2):this.sim.audio.playClick(),this.submitAttempt(c)})});const b=()=>{if(!this.challenge||this.answeredOutcome)return!1;const s=this.challenge.expectedSentenceTokens??[],i=this.challenge.shuffledTokens??[];if(this.placedTokenIndices.length<s.length)return!1;const c=this.placedTokenIndices.map(u=>i.find(f=>f.idx===u)?.text??""),S=c.length===s.length&&c.every((u,f)=>u===s[f]);return S?this.sim.audio.playMatchPop(2):this.sim.audio.playClick(),this.submitAttempt(S),!0};e.querySelectorAll("[data-sq-place]").forEach(s=>{s.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const i=Number(s.dataset.sqPlace??-1);if(i>=0&&!this.placedTokenIndices.includes(i)){this.placedTokenIndices.push(i),this.sim.audio.playMatchPop(1);const c=this.challenge.shuffledTokens?.find(u=>u.idx===i),S=this.sim.ensureLanguageQuiz();c&&S.autoSpeak&&k(c.text,this.challenge.lang,.95),b()||this.render()}})}),e.querySelectorAll("[data-sq-unplace]").forEach(s=>{s.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const i=Number(s.dataset.sqUnplace??-1);i>=0&&i<this.placedTokenIndices.length&&(this.placedTokenIndices.splice(i,1),this.sim.audio.playClick(),this.render())})}),e.querySelector("#btnSqHintTile")?.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const s=this.challenge.expectedSentenceTokens??[],i=this.challenge.shuffledTokens??[];for(;this.placedTokenIndices.length>0;){const S=this.placedTokenIndices.length-1;if(i.find(f=>f.idx===this.placedTokenIndices[S])?.text===s[S])break;this.placedTokenIndices.pop()}const c=this.placedTokenIndices.length;if(c<s.length){const S=s[c],u=i.find(f=>f.text===S&&!this.placedTokenIndices.includes(f.idx));u&&(this.placedTokenIndices.push(u.idx),this.sim.audio.playMatchPop(1),b()||this.render())}}),e.querySelector("#btnSqResetSentence")?.addEventListener("click",()=>{this.answeredOutcome||(this.placedTokenIndices=[],this.sim.audio.playClick(),this.render())}),e.querySelector("#btnSqCheckSentence")?.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const s=this.challenge.expectedSentenceTokens??[],i=this.challenge.shuffledTokens??[],c=this.placedTokenIndices.map(u=>i.find(f=>f.idx===u)?.text??""),S=c.length===s.length&&c.every((u,f)=>u===s[f]);this.submitAttempt(S)}),e.querySelectorAll("[data-sq-left-pair]").forEach(s=>{s.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const i=s.dataset.sqLeftPair??"";if(!i||this.matchedPairIds.has(i))return;this.selectedLeftPairId=i,this.flashWrongPairKey=null,this.sim.audio.playClick();const c=this.challenge.leftCards?.find(u=>u.pairId===i),S=this.sim.ensureLanguageQuiz();c&&S.autoSpeak&&k(c.word,this.challenge.lang,.92),this.render()})}),e.querySelectorAll("[data-sq-right-pair]").forEach(s=>{s.addEventListener("click",()=>{if(!this.challenge||this.answeredOutcome)return;const i=s.dataset.sqRightPair??"";if(!(!i||this.matchedPairIds.has(i))){if(!this.selectedLeftPairId){this.onToast("Chọn thẻ Từ bên trái trước.","🪄");return}if(this.selectedLeftPairId===i){this.matchedPairIds.add(i),this.selectedLeftPairId=null,this.flashWrongPairKey=null,this.sim.audio.playMatchPop(2);const c=this.challenge.leftCards?.length??3;if(this.matchedPairIds.size>=c){this.submitAttempt(this.pairMistakes<=1);return}this.render()}else this.pairMistakes+=1,this.flashWrongPairKey=i,this.sim.audio.playClick(),this.render()}})});const v=e.querySelector("#sqScrollViewport"),g=e.querySelector("#sqZoomSizer"),q=e.querySelector("#sqZoomStage");x.bindDomScrollStageInteractions({rootScope:e,scrollViewportEl:v,sizerEl:g,contentStageEl:q,onOrientationToggled:()=>this.render(),onPlayClick:()=>this.sim.audio.playClick()})}}export{Te as SeedQuizModalController};
