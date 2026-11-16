var mt=Object.defineProperty;var pt=(g,o,s)=>o in g?mt(g,o,{enumerable:!0,configurable:!0,writable:!0,value:s}):g[o]=s;var c=(g,o,s)=>pt(g,typeof o!="symbol"?o+"":o,s);import{G as fe,g as Ge,F as Ze,P as it,Z as gt}from"./game-data-B80lpGGE.js";import{b as xt,r as wt,a as et,W as bt,c as yt,d as At,e as Tt,s as St}from"./engine-B82YWe7Z.js";import{b as Pe,aC as Ee,E as Ce,h as _t,f as $e,T as _e,a as Le,g as Rt}from"./sim-Bap4m-rP.js";import{W as Ct,B as Pt,a as je,R as Et,G as Lt,b as Dt}from"./vendor-pixi-Du6zZD-X.js";import"./vendor-d6FS5LaX.js";const Ut={low:{tier:"low",maxGrassInstances:800,maxPointLights:4,bloomEnabled:!1,dprCap:1.35},medium:{tier:"medium",maxGrassInstances:2500,maxPointLights:8,bloomEnabled:!0,dprCap:1.75},high:{tier:"high",maxGrassInstances:6e3,maxPointLights:16,bloomEnabled:!0,dprCap:2}};class Ft{constructor(o){c(this,"preference","webgl");c(this,"canvas");c(this,"gl");c(this,"pixiRenderer",null);c(this,"supportsHalfFloatHdr");c(this,"contextLost",!1);c(this,"handleLost");c(this,"handleRestored");c(this,"managedBuffers",[]);c(this,"managedTargets",[]);this.canvas=o.canvas;const s=o.canvas.getContext("webgl2",{alpha:!1,antialias:!1,depth:!1,stencil:!0,powerPreference:"high-performance",preserveDrawingBuffer:o.preserveDrawingBuffer??!0});if(!s)throw new Error("[PixiGpuDevice] Thiết bị không hỗ trợ WebGL2.");this.gl=s;const e=s.getExtension("EXT_color_buffer_float"),x=s.getExtension("OES_texture_float_linear");this.supportsHalfFloatHdr=!!(e&&x),this.handleLost=d=>{d.preventDefault(),this.contextLost=!0,o.onContextLost?.()},this.handleRestored=()=>{this.contextLost=!1,o.onContextRestored?.()},this.canvas.addEventListener("webglcontextlost",this.handleLost,!1),this.canvas.addEventListener("webglcontextrestored",this.handleRestored,!1)}async ensurePixiWebGLRenderer(o,s){if(this.pixiRenderer)return(this.pixiRenderer.width!==o||this.pixiRenderer.height!==s)&&this.pixiRenderer.resize(o,s,1),this.pixiRenderer;const e=new Ct;return await e.init({canvas:this.canvas,context:this.gl,width:Math.max(2,o),height:Math.max(2,s),resolution:1,antialias:!1,clearBeforeRender:!1,powerPreference:"high-performance",preferWebGLVersion:2}),this.pixiRenderer=e,e}createInstancedSoABuffer(o,s=!0){const e=new Pt({data:o,usage:je.VERTEX|(s?je.COPY_DST:je.STATIC)});return this.managedBuffers.push(e),e}createHdrRenderTarget(o,s){const e=new Et({width:Math.max(2,o),height:Math.max(2,s),colorTextures:1});return this.managedTargets.push(e),e}createLowLevelGlProgram(o,s,e){return Lt.from({vertex:o,fragment:s,name:e})}createInstancedQuadGeometry(o,s){const e=new Float32Array([-.5,0,.5,0,-.5,1,.5,1]);return new Dt({attributes:{aQuad:{buffer:e,format:"float32x2",stride:8,offset:0,instance:!1},iSlotA:{buffer:o,format:"float32x4",stride:s,offset:0,instance:!0}},topology:"triangle-strip"})}resetSharedGlState(){this.pixiRenderer?.state&&this.pixiRenderer.state.resetState(),this.gl.bindVertexArray(null)}destroy(){this.canvas.removeEventListener("webglcontextlost",this.handleLost,!1),this.canvas.removeEventListener("webglcontextrestored",this.handleRestored,!1);for(const o of this.managedBuffers)o.destroy();this.managedBuffers.length=0;for(const o of this.managedTargets)o.destroy();this.managedTargets.length=0,this.pixiRenderer&&(this.pixiRenderer.destroy(),this.pixiRenderer=null)}}function It(g,o,s,e){let x=0;const d=(t,w,u,n)=>{if(x<e.length){const r=e[x];r.kind=t,r.firstInstance=w,r.instanceCount=u,r.skeletalSlotIndex=n}else e.push({kind:t,firstInstance:w,instanceCount:u,skeletalSlotIndex:n});x++};if(g<=0)return 0;if(s<=0)return d("instanced_range",0,g,-1),x;let v=0;for(let t=0;t<s;t++){const w=o[t];w<v||w>=g||(w>v&&d("instanced_range",v,w-v,-1),d("skeletal_slot",w,1,t),v=w+1)}return v<g&&d("instanced_range",v,g-v,-1),x}const Mt=`#version 300 es
precision highp float;
layout(location = 0) in vec2 aLocal; // x in [-0.5..0.5], y in [0..1] (0 = feet, 1 = crown)

uniform vec3 uCamera;
uniform vec2 uViewport;
uniform vec4 uPoseRect;    // (wx, wy, signedDrawW, drawH)
uniform vec4 uBoneParams;  // (timeSec, walkPhase, isWalking, spriteId)

out vec2 vLocalUv;
out float vSpriteId;
out float vShade;

void main() {
  float h = aLocal.y; // 0 feet -> 1 head
  float t = uBoneParams.x;
  float phase = uBoneParams.y;
  float walking = uBoneParams.z;

  // 3-Bone Articulated 2.5D Deformation (Feet Stride + Torso Breath + Cloak/Head Follow-Through)
  float breath = sin(t * 2.7 + phase) * (1.0 - walking * 0.5);
  float verticalStretch = 1.0 + breath * 0.022 * smoothstep(0.18, 0.95, h);

  // Lower hem / stride shear when walking
  float hemWave = walking * sin(phase * 2.1 + aLocal.x * 2.4) * 2.6 * (1.0 - smoothstep(0.0, 0.45, h));
  // Upper torso / head secondary counter-sway
  float headSway = (walking * sin(phase * 1.05 - 0.45) * 2.8 + breath * 1.1) * smoothstep(0.35, 1.0, h);

  vec2 deformed = vec2(
    aLocal.x * uPoseRect.z + hemWave + headSway,
    -aLocal.y * uPoseRect.w * verticalStretch
  );

  vec2 wp = uPoseRect.xy + deformed;
  vec2 sp = uViewport * 0.5 + (wp - uCamera.xy) * uCamera.z;
  vec2 clip = vec2((sp.x / uViewport.x) * 2.0 - 1.0, 1.0 - (sp.y / uViewport.y) * 2.0);
  gl_Position = vec4(clip, 0.0, 1.0);

  vLocalUv = vec2(aLocal.x + 0.5, 1.0 - aLocal.y);
  vSpriteId = uBoneParams.w;
  vShade = 0.96 + 0.06 * h;
}
`,Bt=`#version 300 es
precision highp float;
precision highp sampler2DArray;

in vec2 vLocalUv;
in float vSpriteId;
in float vShade;

uniform sampler2DArray uAlbedo;
uniform sampler2D uUvTable;
uniform vec3 uAmbientTint;
uniform float uAlpha;

out vec4 fragColor;

void main() {
  int id = int(vSpriteId + 0.5);
  vec4 uvRect = texelFetch(uUvTable, ivec2(id, 0), 0);
  vec4 meta = texelFetch(uUvTable, ivec2(id, 1), 0);
  vec2 uv = mix(uvRect.xy, uvRect.zw, clamp(vLocalUv, vec2(0.0), vec2(1.0)));
  vec4 texel = texture(uAlbedo, vec3(uv, meta.x));
  if (texel.a < 0.015) discard;
  vec3 lit = texel.rgb * uAmbientTint * vShade;
  fragColor = vec4(lit * uAlpha, texel.a * uAlpha);
}
`;class Wt{constructor(o){c(this,"gl");c(this,"prog");c(this,"vao");c(this,"indexCount");c(this,"externalSpineLoaded",!1);this.gl=o;const s=o.createShader(o.VERTEX_SHADER);o.shaderSource(s,Mt),o.compileShader(s);const e=o.createShader(o.FRAGMENT_SHADER);o.shaderSource(e,Bt),o.compileShader(e);const x=o.createProgram();o.attachShader(x,s),o.attachShader(x,e),o.linkProgram(x),o.deleteShader(s),o.deleteShader(e),this.prog=x;const d=4,v=6,t=[],w=[];for(let l=0;l<=v;l++){const a=l/v;for(let h=0;h<=d;h++){const _=h/d-.5;t.push(_,a)}}const u=d+1;for(let l=0;l<v;l++)for(let a=0;a<d;a++){const h=l*u+a,_=h+1,b=h+u,V=b+1;w.push(h,_,b,_,V,b)}this.indexCount=w.length,this.vao=o.createVertexArray(),o.bindVertexArray(this.vao);const n=o.createBuffer();o.bindBuffer(o.ARRAY_BUFFER,n),o.bufferData(o.ARRAY_BUFFER,new Float32Array(t),o.STATIC_DRAW),o.enableVertexAttribArray(0),o.vertexAttribPointer(0,2,o.FLOAT,!1,0,0);const r=o.createBuffer();o.bindBuffer(o.ELEMENT_ARRAY_BUFFER,r),o.bufferData(o.ELEMENT_ARRAY_BUFFER,new Uint16Array(w),o.STATIC_DRAW),o.bindVertexArray(null)}renderArticulatedSlot(o,s,e,x,d,v,t,w,u,n){const r=this.gl;r.useProgram(this.prog),r.activeTexture(r.TEXTURE0),r.bindTexture(r.TEXTURE_2D_ARRAY,u),r.activeTexture(r.TEXTURE2),r.bindTexture(r.TEXTURE_2D,n),r.uniform1i(r.getUniformLocation(this.prog,"uAlbedo"),0),r.uniform1i(r.getUniformLocation(this.prog,"uUvTable"),2),r.uniform3f(r.getUniformLocation(this.prog,"uCamera"),s,e,x),r.uniform2f(r.getUniformLocation(this.prog,"uViewport"),d,v),r.uniform4f(r.getUniformLocation(this.prog,"uPoseRect"),o.wx,o.wy,o.drawW,o.drawH),r.uniform4f(r.getUniformLocation(this.prog,"uBoneParams"),t,o.walkPhase,o.isWalking?1:0,o.spriteId),r.uniform3fv(r.getUniformLocation(this.prog,"uAmbientTint"),w),r.uniform1f(r.getUniformLocation(this.prog,"uAlpha"),o.alpha),r.bindVertexArray(this.vao),r.drawElements(r.TRIANGLES,this.indexCount,r.UNSIGNED_SHORT,0)}destroy(){this.gl.deleteProgram(this.prog),this.gl.deleteVertexArray(this.vao)}}const Ue=8,Ne=6,Fe=6,Se=12,tt=8,at=4,Ye=6,se=2048,rt=8e3,st=16,nt=16,kt=200,Vt=new Set(["yule_goblet_blue_brazier","yule_hermione_bluebell_jars","yule_stag_patronus_topiary","yule_ice_phoenix_fountain","yule_ice_stag_sculpture","yule_ice_swan_arch","yule_sword_frozen_pool","yule_mirror_of_erised","yule_castle_snowglobe","yule_crystal_banquet_table","yule_crystal_lotus_fountain_pot","yule_blue_spruce_starlight","yule_hogwarts_boathouse_ice"]),Ht=new Set(["yule_glowing_puffapod_bush","yule_birch_fairy_grove","yule_weasley_wheezes_facade","yule_poinsettia_cauldron","yule_sugarplum_tower"]),Gt=new Set(["yule_slytherin_serpent_mascot","yule_four_house_hourglasses"]);function lt(g){if(!g.startsWith("yule_"))return null;if(Vt.has(g))return{family:"ice-patronus",rgb:[.28,.8,1],radius:175,intensity:1.38,emissiveBoost:1.28,activeInDaySnow:!0};if(Ht.has(g))return{family:"fairy-violet",rgb:[.94,.52,1],radius:170,intensity:1.25,emissiveBoost:1.18,activeInDaySnow:!1};if(Gt.has(g))return{family:"slytherin-emerald",rgb:[.2,.94,.62],radius:155,intensity:1.16,emissiveBoost:1.12,activeInDaySnow:!1};const o=g==="yule_mini_hogwarts_castle"||g==="yule_great_hall_tree"||g==="yule_gringotts_dragon_dome"||g==="yule_hogwarts_snow_loco";return{family:"festive-gold",rgb:[1,.76,.3],radius:o?215:162,intensity:o?1.44:1.08,emissiveBoost:o?1.26:1.05,activeInDaySnow:!1,secondaryLakePool:g==="yule_mini_hogwarts_castle"}}const ke=32,Nt=[[2,17,"env_bush_flowers",1.02,!1],[2,20,"env_mossy_rock",.96,!0],[2,24,"env_bush_flowers",1.05,!0],[2,28,"env_flower_patch",.98,!1],[5,19,"env_mossy_rock",.92,!1],[5,25,"env_mossy_rock",.95,!0],[7,17,"env_bush_flowers",.98,!1],[7,21,"env_flower_patch",1.04,!0],[7,27,"env_bush_flowers",1.02,!0],[8,19,"env_flower_patch",.96,!1],[11,21,"env_bush_flowers",.95,!1],[15,28,"env_flower_patch",1,!0],[22,21,"env_bush_flowers",1.02,!0],[22,26,"env_flower_patch",.98,!1],[24,17,"env_bush_flowers",1.04,!1],[28,18,"env_mossy_rock",.94,!0],[30,23,"env_bush_flowers",1.05,!1],[33,21,"env_flower_patch",1.02,!0]],Yt=[[4,22,4.18,22.25],[4,34,4.55,34.25]];function ue(g,o){let s=g*374761393+o*668265263|0;return s=(s^s>>>13)*1274126177|0,((s^s>>>16)>>>0)/4294967295}function Xt(g,o){if(!g)return o;const s=g.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);return s?[Number(s[1])/255,Number(s[2])/255,Number(s[3])/255]:o}class Ot{constructor(){c(this,"terrainData",new Float32Array(fe*fe*Ue));c(this,"terrainCount",0);c(this,"waterData",new Float32Array(fe*fe*Ne));c(this,"waterCount",0);c(this,"grassData",new Float32Array(rt*Fe));c(this,"grassCount",0);c(this,"staticDirtyGeneration",0);c(this,"cachedStaticKey","");c(this,"sceneData",new Float32Array(se*Se));c(this,"sceneSpriteIds",new Uint16Array(se));c(this,"sceneTintFlags",new Uint8Array(se));c(this,"sceneCount",0);c(this,"skeletalSortedIndices",new Int32Array(ke));c(this,"skeletalPoses",Array.from({length:ke},()=>({villagerId:"molly",wx:0,wy:0,drawW:0,drawH:0,spriteId:0,walkPhase:0,isWalking:!1,facingLeft:!1,alpha:1})));c(this,"rawSkeletalPoses",Array.from({length:ke},()=>({villagerId:"molly",wx:0,wy:0,drawW:0,drawH:0,spriteId:0,walkPhase:0,isWalking:!1,facingLeft:!1,alpha:1})));c(this,"skeletalCount",0);c(this,"lightData",new Float32Array(st*tt));c(this,"lightCount",0);c(this,"interactorData",new Float32Array(nt*at));c(this,"interactorCount",0);c(this,"particleData",new Float32Array(kt*Ye));c(this,"particleCount",0);c(this,"period","day");c(this,"weatherKind","sunny");c(this,"seasonId","spring");c(this,"sunShadowDx",9);c(this,"sunShadowDy",4.5);c(this,"lockedScenery",xt());c(this,"unlockedZonesSet",new Set);c(this,"slots",Array.from({length:se},()=>({rxMin:0,ryMin:0,rxMax:0,ryMax:0,depth:0,wx:0,wy:0,drawW:0,drawH:0,spriteId:0,swayAmp:0,rotRad:0,pivotY:0,alpha:1,tintFlag:0,skeletalPoseIdx:-1,shadowScale:1,emissiveBoost:0,phaseSeed:0,extraCount:0,extraStart:0})));c(this,"extras",Array.from({length:se},()=>({wx:0,wy:0,drawW:0,drawH:0,spriteId:0,swayAmp:0,rotRad:0,pivotY:0,alpha:1,tintFlag:0,emissiveBoost:0,phaseSeed:0})));c(this,"topoHead",new Int32Array(se));c(this,"topoTail",new Int32Array(se));c(this,"topoInDeg",new Int32Array(se));c(this,"topoReady",new Int32Array(se));c(this,"topoEmitted",new Uint8Array(se));c(this,"topoEdgeCap",8192);c(this,"topoNext",new Int32Array(8192));c(this,"topoTo",new Int32Array(8192));c(this,"lightCandidates",Array.from({length:128},()=>({distSq:0,wx:0,wy:0,z:0,radius:0,r:1,g:1,b:1,intensity:1})))}get terrainRevision(){return this.staticDirtyGeneration}ensureEdgeCap(o){if(o<=this.topoEdgeCap)return;this.topoEdgeCap=Math.max(this.topoEdgeCap*2,o);const s=new Int32Array(this.topoEdgeCap),e=new Int32Array(this.topoEdgeCap);s.set(this.topoNext),e.set(this.topoTo),this.topoNext=s,this.topoTo=e}collect(o,s,e,x,d,v,t,w,u,n,r){const l=s.viewRot??0;this.period=o.getRealTimePeriod();const a=o.getCurrentWeather(d);this.weatherKind=a.kind;const h=typeof o.isWinterMainMapActive=="function"&&o.isWinterMainMapActive()||o.getActiveFestival()==="christmas"||typeof o.isYuleVisualThemeActive=="function"&&o.isYuleVisualThemeActive(),_=wt(o.state.level??1,h?"winter":"auto");this.seasonId=_.id,this.period==="dawn"?(this.sunShadowDx=14,this.sunShadowDy=5.5):this.period==="dusk"?(this.sunShadowDx=-15,this.sunShadowDy=6):this.period==="night"?(this.sunShadowDx=8,this.sunShadowDy=4.5):(this.sunShadowDx=9.5,this.sunShadowDy=4.2),this.unlockedZonesSet.clear();for(const V of o.state.unlockedZones)this.unlockedZonesSet.add(V);const b=`${o.stateRevision}|${l}|${_.id}|${h?1:0}|${o.state.sandboxMode?1:0}|${t}`;this.cachedStaticKey!==b&&(this.cachedStaticKey=b,this.rebuildStaticValleyBuffers(o,l,h,_.id,t),this.staticDirtyGeneration++),this.collectInteractors(o,l,u),this.collectSortedSceneAndLights(o,s,e,x,d,v,w,u,n,r),this.collectAtmosphericParticles(s,d)}rebuildStaticValleyBuffers(o,s,e,x,d){let v=0,t=0;const w=[];for(let r=0;r<fe;r++){const l=o.grid[r];for(let a=0;a<fe;a++){const h=l[a],_=o.state.sandboxMode||this.unlockedZonesSet.has(h.zoneId),{rx0:b,ry0:V}=Pe(a,r,1,1,s),O=h.elevation??0,q=(b-V)*(_e*.5),z=(b+V+1)*(Le*.5)-O*Ce,M=ue(a,r);if(h.terrain==="water"){let X=0;const E=[[a,r-1],[a+1,r],[a,r+1],[a-1,r]];for(const[be,de]of E)if(o.grid[de]?.[be]?.terrain!=="water"){const{rx0:Re,ry0:m}=Pe(be,de,1,1,s),i=Re-b,f=m-V;f===-1?X|=1:i===1?X|=2:f===1?X|=4:i===-1&&(X|=8)}const ge=X===0?1:.42,ae=t*Ne;this.waterData[ae]=q,this.waterData[ae+1]=z,this.waterData[ae+2]=X,this.waterData[ae+3]=ge,this.waterData[ae+4]=_?1:.55,this.waterData[ae+5]=M,t++;continue}let ie=.36,U=.63,F=.175,Y=0;const j=h.terrain;j==="snow"?(ie=.92,U=.95,F=.99,Y=3):j==="stone"?(ie=.82+(M-.5)*.03,U=.74+(M-.5)*.03,F=.61+(M-.5)*.025,Y=2):j==="forest"?(ie=.26,U=.55,F=.175,Y=1):(Y=0,x==="autumn"?(ie=.42,U=.63,F=.165):(ie=.365,U=.655,F=.168)),_||(ie=ie*.9+.06,U=U*.91+.06,F=F*.92+.07);let Z=0;h.path==="cobble"?Z=1:h.path==="wood_pier"?Z=2:h.path!=="none"&&(Z=3);let J=0;if(Z>0){let X=0;const E=[[a,r-1],[a+1,r],[a,r+1],[a-1,r]];for(const[ge,ae]of E){const be=o.grid[ae]?.[ge];if(!be||be.path==="none"){const{rx0:de,ry0:Re}=Pe(ge,ae,1,1,s),m=de-b,i=Re-V;i===-1?X|=1:m===1?X|=2:i===1?X|=4:m===-1&&(X|=8)}}J=Z+X*4}const Q=v*Ue;this.terrainData[Q]=q,this.terrainData[Q+1]=z,this.terrainData[Q+2]=ie,this.terrainData[Q+3]=U,this.terrainData[Q+4]=F,this.terrainData[Q+5]=J,this.terrainData[Q+6]=O+(_?0:10),this.terrainData[Q+7]=Y,v++,_&&(h.terrain==="grass"||h.terrain==="forest")&&h.path==="none"&&!h.buildingUid&&w.push([q,z,M])}}this.terrainCount=v,this.waterCount=t;const u=Math.min(rt,Math.max(0,d));let n=0;if(w.length>0&&u>0){const r=Math.max(2,Math.min(5,Math.ceil(u*1.65/w.length)));for(let l=0;l<w.length&&n<u;l++){const[a,h,_]=w[l],b=h*1.9,V=Math.sin(a*.017+b*.015)+Math.cos(a*.026-b*.021)+.55*Math.sin(a*.051+b*.043);if(V<-.05){if(ue(l*19,311)>.9&&n<u){const U=(ue(l*7,41)-.5)*(_e*.45),F=(ue(l*11,83)-1)*(Le*.45),Y=n*Fe;this.grassData[Y]=a+U,this.grassData[Y+1]=h+F,this.grassData[Y+2]=6.5+_*2.5,this.grassData[Y+3]=_,this.grassData[Y+4]=_*6.28318,this.grassData[Y+5]=0,n++}continue}const O=Math.min(1,(V+.05)/1.85),q=Math.max(1,Math.round(1+O*(r-1))),z=.25+ue(l*5,67)*.5,M=.25+ue(l*9,131)*.5,ie=V>.58&&ue(l*17,257)>.42;for(let U=0;U<q&&n<u;U++){const F=ue(l*13+U*7,91),Y=ue(l*29+U*11,173),j=Math.max(.08,Math.min(.92,z+(F-.5)*.58)),Z=Math.max(.08,Math.min(.92,M+(Y-.5)*.58)),J=(j-Z)*(_e*.42),Q=(j+Z-1)*(Le*.42),X=ie&&ue(l+U*31,409)>.56?1:0,E=n*Fe;this.grassData[E]=a+J,this.grassData[E+1]=h+Q,this.grassData[E+2]=(X>.5?8.2:7.2)+ue(l*3+U,53)*4.4,this.grassData[E+3]=ue(l*23+U*17,509),this.grassData[E+4]=(F*6.28318+Y*3.14159)%6.28318,this.grassData[E+5]=X,n++}}}this.grassCount=n}collectInteractors(o,s,e){let x=0;e.active&&(this.interactorData[0]=e.wx,this.interactorData[1]=e.wy,this.interactorData[2]=66,this.interactorData[3]=1.35,x=1);for(let d=0;d<o.villagers.length&&x<nt;d++){const v=o.villagers[d],t=Math.max(0,Math.min(fe-1,Math.floor(v.gx))),w=Math.max(0,Math.min(fe-1,Math.floor(v.gy))),u=o.grid[w]?.[t]?.elevation??0,n=Ee(v.gx,v.gy,s),r=x*at;this.interactorData[r]=n.wx,this.interactorData[r+1]=n.wy-u*Ce,this.interactorData[r+2]=34,this.interactorData[r+3]=.95,x++}this.interactorCount=x}collectSortedSceneAndLights(o,s,e,x,d,v,t,w,u,n){const r=s.viewRot??0,l=!!o.state.settings.cutawayMode,a=1/Math.max(.15,s.zoom),h=(e*.5+380)*a,_=(x*.5+420)*a,b=s.x-h,V=s.x+h,O=s.y-_,q=s.y+_;let z=0,M=0,ie=0,U=0;const F=n?.bulldozerActive&&n.hoverTile?o.grid[n.hoverTile.gy]?.[n.hoverTile.gx]?.buildingUid??null:null,Y=_t(s),j=Ee(Y.fgx,Y.fgy,r),Z=(m,i,f,B,D,S,C,L)=>{if(U>=this.lightCandidates.length)return;const k=m-j.wx,I=i-j.wy,y=this.lightCandidates[U++];y.distSq=k*k+I*I,y.wx=m,y.wy=i,y.z=f,y.radius=B,y.r=D,y.g=S,y.b=C,y.intensity=L},J=this.period==="night"||this.period==="dusk",Q=v.resolve("hogsmeade_stone_bridge");if(Q)for(const[m,i,f,B]of Yt){const D=o.grid[i]?.[m];if(!D||D.buildingUid||D.terrain!=="water"||!o.state.sandboxMode&&!this.unlockedZonesSet.has(D.zoneId))continue;const S=Ee(f,B,r),C=S.wy-D.elevation*Ce+12;if(S.wx<b||S.wx>V||C<O||C>q)continue;if(z>=se)break;const{rx0:L,ry0:k,rbw:I,rbh:y}=Pe(m-1,i,3,1,r),G=148,H=G*(Q.height/Q.width),P=this.slots[z++];P.rxMin=L+.05,P.ryMin=k+.05,P.rxMax=L+I-.05,P.ryMax=k+y-.05,P.depth=L+I+k+y-.12,P.wx=S.wx,P.wy=C,P.drawW=G,P.drawH=H,P.spriteId=Q.id,P.swayAmp=0,P.rotRad=0,P.pivotY=0,P.alpha=1,P.tintFlag=0,P.skeletalPoseIdx=-1,P.shadowScale=.85,P.emissiveBoost=.35,P.phaseSeed=m*.7+i,P.extraCount=0,P.extraStart=0,J&&Z(S.wx,C-14,30,155,1,.76,.3,1.25)}const X=new Map;for(let m=0;m<o.state.buildings.length;m++){const i=o.state.buildings[m];X.set(i.uid,i)}let E=null;if(n?.hoverTile&&!n.bulldozerActive){const m=n.movingBuildingUid?X.get(n.movingBuildingUid):void 0,i=n.selectedCatalogItem??(m?Ge(m.itemId):void 0);if(i?.connectableGroup){const f=n.rotation??0;if(o.canPlaceItem(i,n.hoverTile.gx,n.hoverTile.gy,f,n.movingBuildingUid??void 0).ok){const{bw:B,bh:D}=o.getBuildingFootprint(i,f);E={gx:n.hoverTile.gx,gy:n.hoverTile.gy,bw:B,bh:D,elev:o.grid[n.hoverTile.gy]?.[n.hoverTile.gx]?.elevation??0,group:i.connectableGroup}}}}const ge=(m,i,f,B,D,S)=>{const{rx0:C,ry0:L}=Pe(m,i,f,B,r),k=(y,G)=>{const{gx:H,gy:P}=At(y,G,r);if(H<0||P<0||H>=fe||P>=fe)return!1;if(E&&E.group===S&&E.elev===D&&H>=E.gx&&H<E.gx+E.bw&&P>=E.gy&&P<E.gy+E.bh)return!0;const A=o.grid[P]?.[H];if(!A||!A.buildingUid||A.buildingUid===n?.movingBuildingUid||(A.elevation??0)!==D)return!1;const N=X.get(A.buildingUid);return!N||d<N.constructEndsAt?!1:Ge(N.itemId)?.connectableGroup===S};let I=0;return k(C-1,L)&&(I|=1),k(C-1,L+1)&&(I|=2),k(C,L-1)&&(I|=4),k(C+1,L-1)&&(I|=8),k(C+2,L)&&(I|=16),k(C+2,L+1)&&(I|=32),k(C,L+2)&&(I|=64),k(C+1,L+2)&&(I|=128),k(C-1,L-1)&&(I|=256),k(C+2,L-1)&&(I|=512),k(C+2,L+2)&&(I|=1024),k(C-1,L+2)&&(I|=2048),I};for(let m=0;m<o.state.buildings.length&&z<se;m++){const i=o.state.buildings[m],f=Ge(i.itemId);if(!f)continue;const{bw:B,bh:D}=o.getBuildingFootprint(f,i.rotation),{rx0:S,ry0:C,rbw:L,rbh:k}=Pe(i.gx,i.gy,B,D,r),I=o.grid[i.gy]?.[i.gx]?.elevation??0,y=(S-C+(L-k)*.5)*(_e*.5),G=(S+L+C+k)*(Le*.5)-I*Ce;if(y<b||y>V||G<O||G>q)continue;const H=d<i.constructEndsAt;let P=H?"prop_construction_site":et(f.id,f.spriteKey),A=0;if(!H&&f.isFarmlandPlot)if(!i.cropId)P="crop_plot_tilled";else{const T=i.cropPlantedAt??d-1e4,p=i.cropReadyAt??d,W=Math.max(1e3,p-T);A=d>=p?1:Math.max(0,Math.min(.99,(d-T)/W)),P=A>=.25&&A<.66?"crop_plot_sprouts":"crop_plot_tilled"}if(!P)continue;const N=!!f.connectableGroup,ye=!H&&f.connectableGroup?ge(i.gx,i.gy,B,D,I,f.connectableGroup):0,K=(ye>0?v.resolve(`conn:${P}:${ye}`):void 0)??v.resolve(P);if(!K)continue;const ce=f.width!==f.height,Ie=H?1.04:f.spriteScale??(ce?1:1.05),oe=(B+D)*(_e*.5)*Ie,he=oe*(K.height/K.width),Me=(i.rotation+r)%4,ee=N?!1:ce?(Me&1)===1:Me===1||Me===2,ht=!!P.startsWith("env_")&&P!=="env_mossy_rock",ut=l&&!N&&(B>=2||D>=2||he>95),dt=n?.movingBuildingUid===i.uid,Oe=F===i.uid?4:n?.selectedBuildingUid===i.uid?3:0,R=this.slots[z++];R.rxMin=S+.04,R.ryMin=C+.04,R.rxMax=S+L-.04,R.ryMax=C+k-.04,R.depth=S+L+C+k-.05,R.wx=y,R.wy=G+4,R.drawW=ee?-oe:oe,R.drawH=he,R.spriteId=K.id,R.swayAmp=ht?3.8:f.category==="creature"?1.4:0,R.rotRad=0,R.pivotY=0,R.alpha=dt?.35:ut?.3:1,R.tintFlag=Oe,R.skeletalPoseIdx=-1;const xe=lt(f.id);if(R.shadowScale=N?0:1,R.emissiveBoost=f.isFlooPortal?1.35:xe?xe.emissiveBoost:N?0:.85,R.phaseSeed=i.gx*1.7+i.gy*2.3,R.extraStart=M,R.extraCount=0,H){const T=v.resolve("ui_icon_hammer_wand");if(T&&M<this.extras.length){const p=this.extras[M++],W=Math.min(36,Math.max(22,oe*.28));p.wx=y+oe*.2,p.wy=G-he*.62+Math.sin(d*.006+R.phaseSeed)*3,p.drawW=W,p.drawH=W*(T.height/T.width),p.spriteId=T.id,p.swayAmp=0,p.rotRad=Math.sin(d*.008+i.gx)*.24,p.pivotY=.5,p.alpha=.95,p.tintFlag=0,p.emissiveBoost=.85,p.phaseSeed=R.phaseSeed,R.extraCount++}}else if(i.awaitingUnveil){const T=v.resolve("prop_ribbon_unveil");if(T&&M<this.extras.length){const p=this.extras[M++],W=Math.sin(d*.005+R.phaseSeed)*4.5,$=Math.min(54,Math.max(32,oe*.42));p.wx=y,p.wy=G-he*.55+W,p.drawW=$,p.drawH=$*(T.height/T.width),p.spriteId=T.id,p.swayAmp=0,p.rotRad=Math.sin(d*.0035)*.06,p.pivotY=.5,p.alpha=1,p.tintFlag=0,p.emissiveBoost=1.15,p.phaseSeed=R.phaseSeed,R.extraCount++}}if(!H&&f.id==="burrow_windmill_canon"){const T=v.resolve("prop_windmill_sails");if(T&&M<this.extras.length){const p=this.extras[M++],W=oe*.78;p.wx=y-oe*.06,p.wy=G+4-he*.67,p.drawW=W,p.drawH=W,p.spriteId=T.id,p.swayAmp=0,p.rotRad=d*.0013%6.28318,p.pivotY=.5,p.alpha=R.alpha,p.tintFlag=Oe,p.emissiveBoost=.1,p.phaseSeed=R.phaseSeed,R.extraCount++}}else if(!H&&f.id==="burrow_reed_pond_mill"){const T=v.resolve("prop_waterwheel_rotor");if(T&&M<this.extras.length){const p=this.extras[M++],W=oe*.44;p.wx=y+oe*.18,p.wy=G+4-he*.34,p.drawW=W,p.drawH=W,p.spriteId=T.id,p.swayAmp=0,p.rotRad=d*.0018%6.28318,p.pivotY=.5,p.alpha=R.alpha,p.tintFlag=Oe,p.emissiveBoost=.05,p.phaseSeed=R.phaseSeed,R.extraCount++}}if(!H&&f.isFarmlandPlot&&i.cropId&&A>=.45){const T=Ze[i.cropId],p=T?v.resolve(T.iconKey):void 0;if(p){const W=A>=1?1:.68+A*.32,$=[[-11,-13],[11,-13],[0,-6]];for(let ve=0;ve<$.length&&M<this.extras.length;ve++){const te=this.extras[M++],re=23*W;te.wx=y+$[ve][0],te.wy=G+$[ve][1],te.drawW=re,te.drawH=re*(p.height/p.width),te.spriteId=p.id,te.swayAmp=2.6,te.rotRad=0,te.pivotY=0,te.alpha=1,te.tintFlag=0,te.emissiveBoost=T?.nocturnalGlowColor?1.15:.08,te.phaseSeed=R.phaseSeed+ve*1.9,R.extraCount++}}}if(!H&&f.isAnimalPasturePlot&&i.pastureAnimalId){const T=it[i.pastureAnimalId];if(T){const p=(ye&204)!==0,W=(ye&51)!==0,$=oe*(p?.3:.2),ve=he*(W?.14:.09),te=i.pastureAnimalId==="daisy_cow"||i.pastureAnimalId==="silver_hippogriff"||i.pastureAnimalId==="shadow_thestral"||i.pastureAnimalId==="moon_unicorn"?48:i.pastureAnimalId==="ottery_sheep"?44:38,re=Math.floor(d/16.67),ze=G+4;for(let me=0;me<2&&M<this.extras.length;me++){const Ke=Math.floor((re+i.gx*11+i.gy*17+me*29)/42)%2===1,Be=T.spritePair[Ke?1:0],De=v.resolve(Be)??v.resolve(T.spritePair[0]);if(!De)continue;const ne=d*(me===0?.00144:.00114)+i.gx*1.9+i.gy*1.3+me*2.6,Xe=y+Math.sin(ne)*$+(me===0?-oe*.06:oe*.09),We=Math.abs(Math.sin(d*.0066+me*1.7+i.gx))*2.4,Qe=ze-he*(me===0?.44:.32)+Math.cos(ne*.85)*ve-We,qe=te*(me===0?1:.82),ft=qe*(De.height/De.width),vt=Math.cos(ne)<0,we=this.extras[M++];we.wx=Xe,we.wy=Qe,we.drawW=vt?-qe:qe,we.drawH=ft,we.spriteId=De.id,we.swayAmp=0,we.rotRad=0,we.pivotY=0,we.alpha=1,we.tintFlag=0,we.emissiveBoost=i.pastureAnimalId==="moon_unicorn"?.55:.1,we.phaseSeed=R.phaseSeed+me*1.7,R.extraCount++}}}if(!H&&f.isCreatureHabitat&&!f.isRuralFarmstead&&!i.isEscaped){const T=f.id==="hippogriff_glade"?["beast_hippogriff","beast_hippogriff_bow"]:f.id==="thestral_grove"?["beast_thestral","beast_thestral_wings"]:f.id==="unicorn_glade"?["beast_unicorn","beast_unicorn_prance"]:f.id==="phoenix_perch"?["beast_phoenix","beast_phoenix_soar"]:f.id==="dragon_lair"?["beast_dragon","beast_dragon_roar"]:f.id==="hagrid_bowtruckle"?null:["beast_niffler","beast_niffler_play"];if(T&&M<this.extras.length){const p=Math.floor(d/16.67),W=Math.floor((p+i.gx*13+i.gy*7)/48)%2===1,$=v.resolve(T[W?1:0])??v.resolve(T[0]);if($){const ve=i.creatureStage==="baby"?.58:i.creatureStage==="legendary"?1.05:.84,te=d*.00192+i.gx*2.1+i.gy,re=y+Math.sin(te)*oe*.22,ze=Math.abs(Math.sin(d*.0072+i.gx))*3.5,me=G+4,Ke=me-he*.22-ze,Be=38*ve,De=Be*($.height/$.width),ne=this.extras[M++];if(ne.wx=re,ne.wy=Ke,ne.drawW=Math.cos(te)<0?-Be:Be,ne.drawH=De,ne.spriteId=$.id,ne.swayAmp=0,ne.rotRad=0,ne.pivotY=0,ne.alpha=1,ne.tintFlag=0,ne.emissiveBoost=i.creatureMorph==="radiant"||i.creatureMorph==="mystic"?.85:.14,ne.phaseSeed=R.phaseSeed,R.extraCount++,i.hasBabyOffspring&&M<this.extras.length){const Xe=te-.9,We=22,Qe=We*($.height/$.width),pe=this.extras[M++];pe.wx=y+Math.sin(Xe)*oe*.2,pe.wy=me-he*.16-Math.abs(Math.cos(d*.0096))*3,pe.drawW=Math.cos(Xe)<0?-We:We,pe.drawH=Qe,pe.spriteId=$.id,pe.swayAmp=0,pe.rotRad=0,pe.pivotY=0,pe.alpha=1,pe.tintFlag=0,pe.emissiveBoost=.14,pe.phaseSeed=R.phaseSeed+2.3,R.extraCount++}}}}else if(!H&&f.id==="black_lake_boats"){const T=v.resolve("vehicle_lake_boat");if(T){const p=G+4;for(let W=0;W<2&&M<this.extras.length;W++){const $=d*.0015+W*Math.PI,ve=36,te=ve*(T.height/T.width),re=this.extras[M++];re.wx=y+Math.cos($)*oe*.34,re.wy=p-he*.16+Math.sin($)*he*.11+te*.25,re.drawW=-Math.sin($)<0?-ve:ve,re.drawH=te,re.spriteId=T.id,re.swayAmp=0,re.rotRad=0,re.pivotY=0,re.alpha=1,re.tintFlag=0,re.emissiveBoost=.25,re.phaseSeed=R.phaseSeed+W,R.extraCount++}}}if(!n?.skipReadyBubbleSprites&&!H&&!i.awaitingUnveil&&M<this.extras.length){let T;f.isFarmlandPlot&&i.cropId&&A>=1?T=Ze[i.cropId]?.iconKey:f.isAnimalPasturePlot&&i.pastureAnimalId&&i.pastureReadyAt&&d>=i.pastureReadyAt?T=it[i.pastureAnimalId]?.iconKey:((i.readyFarmGoods?.length??0)>0||(i.readyBubbles??0)>0)&&(T="ui_icon_golden_sickle");const p=T?v.resolve(T):void 0;if(p){const W=this.extras[M++],$=Math.sin(d*.0046+R.phaseSeed)*3.8;W.wx=y,W.wy=G-Math.max(34,he*.78)+$,W.drawW=24,W.drawH=24*(p.height/p.width),W.spriteId=p.id,W.swayAmp=0,W.rotRad=0,W.pivotY=.5,W.alpha=.98,W.tintFlag=0,W.emissiveBoost=1.18,W.phaseSeed=R.phaseSeed,R.extraCount++}}if(!H){if(f.isFlooPortal){const T=.92+Math.sin(d*.006+i.gx)*.12;Z(y,G-8,34,195,.16,.96,.64,(J?1.65:.95)*T)}else if(f.isFarmlandPlot&&i.cropId){const T=Ze[i.cropId]?.nocturnalGlowColor;if(T){const[p,W,$]=Xt(T,[.35,.82,.98]);Z(y,G-10,20,96,p,W,$,J?1.15:.45)}}else if(xe){const T=this.weatherKind==="snow"||this.seasonId==="winter";if(J||xe.activeInDaySnow&&T){const p=.94+Math.sin(d*.0052+i.gx*1.9+i.gy*1.3)*.06,W=J?1:.38;Z(y,G-(xe.secondaryLakePool?24:12),xe.secondaryLakePool?52:36,xe.radius,xe.rgb[0],xe.rgb[1],xe.rgb[2],xe.intensity*W*p),J&&xe.secondaryLakePool&&Z(y+18,G-4,22,135,.3,.78,1,.98*p)}}else if(B>=2||D>=2||f.category==="shop"||f.category==="decor"){const T=f.id==="burrow_house_canon"||f.id==="molly_apple_bakery"||f.id==="burrow_broomsticks_canon"||f.id==="burrow_honeydukes_canon"||f.id==="burrow_feast_marquee";if(J){const p=.95+Math.sin(d*.0045+i.gx*2.1)*.06;Z(y,G-(f.id==="burrow_house_canon"?26:14),f.id==="burrow_house_canon"?56:42,T?200:140,1,.72,.26,(T?1.35:.85)*p),f.id==="burrow_house_canon"&&Z(y-16,G-6,28,130,.14,.95,.52,1.15*(.92+Math.sin(d*.0068)*.08))}}}}const ae=this.seasonId==="winter",be=ae?bt:Nt;for(const[m,i,f,B,D]of be){if(z>=se)break;const S=o.grid[i]?.[m];if(!S||S.buildingUid||S.path!=="none"||S.terrain!=="grass"||!o.state.sandboxMode&&!this.unlockedZonesSet.has(S.zoneId)||B>=1.4&&(o.grid[i-1]?.[m]?.buildingUid||o.grid[i+1]?.[m]?.buildingUid||o.grid[i]?.[m-1]?.buildingUid||o.grid[i]?.[m+1]?.buildingUid))continue;const C=Ee(m+.5,i+.5,r),L=C.wy-S.elevation*Ce;if(C.wx<b||C.wx>V||L<O||L>q)continue;const k=v.resolve(f);if(!k)continue;const{rx:I,ry:y}=$e(m+.5,i+.5,r),H=(f==="env_flower_patch"||f==="env_bush_flowers"||f==="env_mossy_rock"||f==="yule_holly_hedgerow"||f==="yule_snowdrop_moss_log"||f==="yule_edelweiss_alpine_rockery"||f==="yule_puffskein_snowballs"?36:58)*B,P=H*(k.height/k.width),A=lt(f),N=this.slots[z++];N.rxMin=I-.22,N.ryMin=y-.22,N.rxMax=I+.22,N.ryMax=y+.22,N.depth=I+y+.28,N.wx=C.wx,N.wy=L,N.drawW=D?-H:H,N.drawH=P,N.spriteId=k.id,N.swayAmp=f==="env_mossy_rock"||f.startsWith("yule_")?0:2.8,N.rotRad=0,N.pivotY=0,N.alpha=1,N.tintFlag=0,N.skeletalPoseIdx=-1,N.shadowScale=.72,N.emissiveBoost=A?A.emissiveBoost:0,N.phaseSeed=m*1.3+i*.9,N.extraCount=0,N.extraStart=0,A&&(J||A.activeInDaySnow)&&Z(C.wx,L-12,36,A.radius*.82,A.rgb[0],A.rgb[1],A.rgb[2],A.intensity*(J?.58:.24))}if(n?.hoverTile&&z<se){const m=n.movingBuildingUid?o.state.buildings.find(B=>B.uid===n.movingBuildingUid):void 0,i=n.selectedCatalogItem??(m?Ge(m.itemId):void 0),f=i?et(i.id,i.spriteKey):void 0;if(i&&f){const B=n.rotation??0,D=v.resolve(f);if(D){const{gx:S,gy:C}=n.hoverTile,{bw:L,bh:k}=o.getBuildingFootprint(i,B),{rx0:I,ry0:y,rbw:G,rbh:H}=Pe(S,C,L,k,r),P=o.grid[C]?.[S]?.elevation??0,A=(I-y+(G-H)*.5)*(_e*.5),N=(I+G+y+H)*(Le*.5)-P*Ce,ye=i.width!==i.height,K=!!i.connectableGroup,ce=i.spriteScale??(ye?1:1.05),Ie=(L+k)*(_e*.5)*ce,ot=Ie*(D.height/D.width),oe=(B+r)%4,he=K?!1:ye?(oe&1)===1:oe===1||oe===2,Me=o.canPlaceItem(i,S,C,B,n.movingBuildingUid??void 0).ok,ee=this.slots[z++];ee.rxMin=I+.04,ee.ryMin=y+.04,ee.rxMax=I+G-.04,ee.ryMax=y+H-.04,ee.depth=I+G+y+H+.02,ee.wx=A,ee.wy=N+4-Math.abs(Math.sin(d*.005))*2.5,ee.drawW=he?-Ie:Ie,ee.drawH=ot,ee.spriteId=D.id,ee.swayAmp=0,ee.rotRad=0,ee.pivotY=0,ee.alpha=.82,ee.tintFlag=Me?1:2,ee.skeletalPoseIdx=-1,ee.shadowScale=.5,ee.emissiveBoost=.45,ee.phaseSeed=S+C,ee.extraCount=0,ee.extraStart=0}}}for(let m=0;m<o.villagers.length&&z<se;m++){const i=o.villagers[m],f=Math.max(0,Math.min(fe-1,Math.floor(i.gx))),B=Math.max(0,Math.min(fe-1,Math.floor(i.gy))),D=o.grid[B]?.[f]?.elevation??0,S=Ee(i.gx,i.gy,r),C=S.wy-D*Ce;if(S.wx<b||S.wx>V||C<O||C>q)continue;const L=i.state==="walking",k=L&&Math.floor(i.walkPhase*1.4)%2===1,I=v.resolve(k?i.walkSprite:i.idleSprite)??v.resolve(i.idleSprite);if(!I)continue;const y=i.id==="hagrid"?62:52,G=y*(I.width/I.height),H=L?Math.abs(Math.sin(i.walkPhase*2.1))*2.8:Math.sin(d*.003+i.gx*1.7)*.7,P=L?Math.sin(i.walkPhase*1.05)*.045:0,{rx:A,ry:N}=$e(i.gx,i.gy,r);let ye=-1;if(ie<ke){ye=ie++;const ce=this.rawSkeletalPoses[ye];ce.villagerId=i.id,ce.wx=S.wx,ce.wy=C-H,ce.drawW=i.facingLeft?-G:G,ce.drawH=y,ce.spriteId=I.id,ce.walkPhase=i.walkPhase,ce.isWalking=L,ce.facingLeft=!!i.facingLeft,ce.alpha=1}const K=this.slots[z++];K.rxMin=A-.18,K.ryMin=N-.18,K.rxMax=A+.18,K.ryMax=N+.18,K.depth=A+N+.3,K.wx=S.wx,K.wy=C-H,K.drawW=i.facingLeft?-G:G,K.drawH=y,K.spriteId=I.id,K.swayAmp=.8,K.rotRad=P,K.pivotY=0,K.alpha=1,K.tintFlag=0,K.skeletalPoseIdx=ye,K.shadowScale=.72,K.emissiveBoost=.12,K.phaseSeed=m*2.1,K.extraCount=0,K.extraStart=0}if(!o.state.sandboxMode)for(let m=0;m<this.lockedScenery.length&&z<se;m++){const i=this.lockedScenery[m];if(this.unlockedZonesSet.has(i.zoneId))continue;const f=Math.max(0,Math.min(fe-1,Math.round(i.gx))),B=Math.max(0,Math.min(fe-1,Math.round(i.gy))),D=o.grid[B]?.[f]?.elevation??0,S=Ee(i.gx+.5,i.gy+.5,r),C=S.wy-D*Ce;if(S.wx<b||S.wx>V||C<O||C>q)continue;const L=ae?yt(i):i.spriteKey,k=v.resolve(L);if(!k)continue;const I=L==="env_flower_patch"||L==="env_bush_flowers"||L==="env_mossy_rock"||L==="yule_holly_hedgerow"||L==="yule_snowdrop_moss_log"||L==="yule_edelweiss_alpine_rockery",y=(I?34:58)*i.scale,G=y*(k.height/k.width),{rx:H,ry:P}=$e(i.gx+.5,i.gy+.5,r),A=this.slots[z++];A.rxMin=H-.32,A.ryMin=P-.32,A.rxMax=H+.32,A.ryMax=P+.32,A.depth=H+P+.42,A.wx=S.wx,A.wy=C,A.drawW=i.flipX?-y:y,A.drawH=G,A.spriteId=k.id,A.swayAmp=i.spriteKey==="env_mossy_rock"?0:I?2.6:4.8,A.rotRad=0,A.pivotY=0,A.alpha=1,A.tintFlag=0,A.skeletalPoseIdx=-1,A.shadowScale=.85,A.emissiveBoost=i.spriteKey==="env_tree_magic"?.55:0,A.phaseSeed=i.gx*.9+i.gy*1.4,A.extraCount=0,A.extraStart=0}this.sortAndPackSceneInstances(z);let de=0;const Re=Math.min(st,Math.max(0,t));for(let m=0;m<U&&de<Re;m++){let i=m,f=this.lightCandidates[m].distSq;for(let S=m+1;S<U;S++)this.lightCandidates[S].distSq<f&&(f=this.lightCandidates[S].distSq,i=S);if(i!==m){const S=this.lightCandidates[m];this.lightCandidates[m]=this.lightCandidates[i],this.lightCandidates[i]=S}const B=this.lightCandidates[m];if(B.intensity<=.02)continue;const D=de*tt;this.lightData[D]=B.wx,this.lightData[D+1]=B.wy,this.lightData[D+2]=B.z,this.lightData[D+3]=B.radius,this.lightData[D+4]=B.r,this.lightData[D+5]=B.g,this.lightData[D+6]=B.b,this.lightData[D+7]=B.intensity,de++}this.lightCount=de}sortAndPackSceneInstances(o){if(this.skeletalCount=0,o===0){this.sceneCount=0;return}this.topoHead.fill(-1,0,o),this.topoTail.fill(-1,0,o),this.topoInDeg.fill(0,0,o),this.topoEmitted.fill(0,0,o);let s=0;const e=.04,x=(u,n)=>{this.ensureEdgeCap(s+1);const r=s++;this.topoTo[r]=n,this.topoNext[r]=-1,this.topoHead[u]===-1?(this.topoHead[u]=r,this.topoTail[u]=r):(this.topoNext[this.topoTail[u]]=r,this.topoTail[u]=r),this.topoInDeg[n]++};for(let u=0;u<o;u++){const n=this.slots[u],r=n.rxMin-n.ryMax,l=n.rxMax-n.ryMin;for(let a=u+1;a<o;a++){const h=this.slots[a],_=h.rxMin-h.ryMax,b=h.rxMax-h.ryMin;if(l<=_+e||b<=r+e)continue;const V=n.rxMax<=h.rxMin+e&&n.ryMin<h.ryMax-e||n.ryMax<=h.ryMin+e&&n.rxMin<h.rxMax-e,O=h.rxMax<=n.rxMin+e&&h.ryMin<n.ryMax-e||h.ryMax<=n.ryMin+e&&h.rxMin<n.rxMax-e;V&&!O?x(u,a):O&&!V&&x(a,u)}}let d=0,v=0;for(let u=0;u<o;u++)if(this.topoInDeg[u]===0){const n=this.slots[u].depth;let r=d,l=v;for(;r<l;){const a=r+l>>1;this.slots[this.topoReady[a]].depth<=n?r=a+1:l=a}r<v&&this.topoReady.copyWithin(r+1,r,v),this.topoReady[r]=u,v++}let t=0;const w=u=>{if(t>=se)return;const n=this.slots[u];if(n.skeletalPoseIdx>=0&&this.skeletalCount<ke){const l=this.skeletalCount++;this.skeletalSortedIndices[l]=t;const a=this.rawSkeletalPoses[n.skeletalPoseIdx],h=this.skeletalPoses[l];h.villagerId=a.villagerId,h.wx=a.wx,h.wy=a.wy,h.drawW=a.drawW,h.drawH=a.drawH,h.spriteId=a.spriteId,h.walkPhase=a.walkPhase,h.isWalking=a.isWalking,h.facingLeft=a.facingLeft,h.alpha=a.alpha}const r=t*Se;this.sceneSpriteIds[t]=n.spriteId,this.sceneTintFlags[t]=n.tintFlag,this.sceneData[r]=n.wx,this.sceneData[r+1]=n.wy,this.sceneData[r+2]=n.drawW,this.sceneData[r+3]=n.drawH,this.sceneData[r+4]=n.spriteId,this.sceneData[r+5]=n.swayAmp,this.sceneData[r+6]=n.rotRad,this.sceneData[r+7]=n.pivotY,this.sceneData[r+8]=n.alpha+n.tintFlag*2,this.sceneData[r+9]=n.shadowScale,this.sceneData[r+10]=n.emissiveBoost,this.sceneData[r+11]=n.phaseSeed,t++;for(let l=0;l<n.extraCount&&t<se;l++){const a=this.extras[n.extraStart+l];this.sceneSpriteIds[t]=a.spriteId,this.sceneTintFlags[t]=a.tintFlag;const h=t*Se;this.sceneData[h]=a.wx,this.sceneData[h+1]=a.wy,this.sceneData[h+2]=a.drawW,this.sceneData[h+3]=a.drawH,this.sceneData[h+4]=a.spriteId,this.sceneData[h+5]=a.swayAmp,this.sceneData[h+6]=a.rotRad,this.sceneData[h+7]=a.pivotY,this.sceneData[h+8]=a.alpha+a.tintFlag*2,this.sceneData[h+9]=0,this.sceneData[h+10]=a.emissiveBoost,this.sceneData[h+11]=a.phaseSeed,t++}};for(;d<v;){const u=this.topoReady[d++];this.topoEmitted[u]=1,w(u);for(let n=this.topoHead[u];n!==-1;n=this.topoNext[n]){const r=this.topoTo[n];if(this.topoInDeg[r]--,this.topoInDeg[r]===0){const l=this.slots[r].depth;let a=d,h=v;for(;a<h;){const _=a+h>>1;this.slots[this.topoReady[_]].depth<=l?a=_+1:h=_}a<v&&this.topoReady.copyWithin(a+1,a,v),this.topoReady[a]=r,v++}}}for(let u=0;u<o;u++)this.topoEmitted[u]||w(u);this.sceneCount=t}collectAtmosphericParticles(o,s){const e=s*.001,x=this.period==="night"||this.period==="dusk",d=this.weatherKind==="rain"||this.weatherKind==="storm"||this.weatherKind==="fog",v=!d&&(this.weatherKind==="snow"||this.seasonId==="winter");if(d){this.particleCount=0;return}const t=v?140:x?130:80,w=Math.max(.42,o.zoom),u=Math.max(920,780/w),n=Math.max(580,500/w),r=1/Math.max(.65,Math.min(1.25,o.zoom));for(let l=0;l<t;l++){const a=ue(l,17),h=ue(l,89),_=ue(l,233),b=38+h*34,V=v?e*(14+a*10)+Math.sin(e*(.85+_*.55)+l)*26:Math.sin(e*.65+l*1.7)*38,O=v?e*b:-e*12+Math.cos(e*.8+l*1.3)*24,q=a*u*2+V,z=h*n*2+O,M=o.x-u+(q%(u*2)+u*2)%(u*2),ie=o.y-n+(z%(n*2)+n*2)%(n*2),U=l*Ye;if(this.particleData[U]=M,this.particleData[U+1]=ie,v){const F=(1.5+_*1.9)*r;this.particleData[U+2]=F,this.particleData[U+3]=(_+e*(.07+a*.06))%1,this.particleData[U+4]=a,this.particleData[U+5]=.8+.18*h}else{const F=.45+.55*Math.sin(e*(2.2+_*2)+l*3.1);this.particleData[U+2]=(2.6+_*4.2)*F,l%5===0?(this.particleData[U+3]=.25,this.particleData[U+4]=1.35,this.particleData[U+5]=.82):(this.particleData[U+3]=1.45,this.particleData[U+4]=1.12,this.particleData[U+5]=.36)}}this.particleCount=t}}const le=2048,zt=new Set(["yule_floating_candelabra","yule_goblet_blue_brazier","yule_hogwarts_boathouse_ice","yule_snowdrop_moss_log","yule_hermione_bluebell_jars","yule_glowing_puffapod_bush"]);function Kt(g){return g.startsWith("conn:")||g.startsWith("yule_")||g.startsWith("ui_icon_")||g.startsWith("m3_")||g.startsWith("beast_")||g.startsWith("vehicle_")||g.startsWith("staff_")||g.startsWith("guest_")||g.startsWith("prop_")||g.startsWith("crop_plot_")||g==="snowy_pines"||g==="env_pine_snow"||g==="catalog_floating_candles_post"||g==="catalog_patronus_ward_lantern"?!1:St(g)}function Qt(g){return zt.has(g)}const Je=8,Ve=512,Ae=2;function ct(g,o,s){const e=g.createShader(o);if(g.shaderSource(e,s),g.compileShader(e),!g.getShaderParameter(e,g.COMPILE_STATUS)){const x=g.getShaderInfoLog(e)||"Unknown shader compile error";throw g.deleteShader(e),new Error(`[WebGL2 Shader] ${x}`)}return e}function Te(g,o,s){const e=ct(g,g.VERTEX_SHADER,o),x=ct(g,g.FRAGMENT_SHADER,s),d=g.createProgram();if(g.attachShader(d,e),g.attachShader(d,x),g.linkProgram(d),g.deleteShader(e),g.deleteShader(x),!g.getProgramParameter(d,g.LINK_STATUS)){const v=g.getProgramInfoLog(d)||"Unknown program link error";throw g.deleteProgram(d),new Error(`[WebGL2 Link] ${v}`)}return d}const He=`#version 300 es
precision highp float;
out vec2 vUv;
void main() {
  vec2 pos = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  vUv = pos;
  gl_Position = vec4(pos * 2.0 - 1.0, 0.0, 1.0);
}
`,qt=`#version 300 es
precision highp float;
precision highp sampler2DArray;
in vec2 vUv;
uniform sampler2DArray uAlbedo;
uniform float uLayer;
uniform vec2 uTexel;
out vec4 fragColor;

float luma(vec3 c) {
  return dot(c, vec3(0.299, 0.587, 0.114));
}

vec4 samplePremulUnpacked(vec2 uv) {
  vec4 s = texture(uAlbedo, vec3(clamp(uv, vec2(0.0), vec2(1.0)), uLayer));
  if (s.a > 0.004) {
    s.rgb /= s.a;
  }
  return s;
}

void main() {
  vec4 c = samplePremulUnpacked(vUv);
  if (c.a < 0.02) {
    fragColor = vec4(0.5, 0.5, 1.0, 0.0);
    return;
  }

  // Multi-scale silhouette bevel + interior painterly relief
  vec2 r1 = uTexel * 2.0;
  vec2 r2 = uTexel * 6.5;

  float aL1 = texture(uAlbedo, vec3(vUv - vec2(r1.x, 0.0), uLayer)).a;
  float aR1 = texture(uAlbedo, vec3(vUv + vec2(r1.x, 0.0), uLayer)).a;
  float aU1 = texture(uAlbedo, vec3(vUv - vec2(0.0, r1.y), uLayer)).a;
  float aD1 = texture(uAlbedo, vec3(vUv + vec2(0.0, r1.y), uLayer)).a;

  float aL2 = texture(uAlbedo, vec3(vUv - vec2(r2.x, 0.0), uLayer)).a;
  float aR2 = texture(uAlbedo, vec3(vUv + vec2(r2.x, 0.0), uLayer)).a;
  float aU2 = texture(uAlbedo, vec3(vUv - vec2(0.0, r2.y), uLayer)).a;
  float aD2 = texture(uAlbedo, vec3(vUv + vec2(0.0, r2.y), uLayer)).a;

  float lL = luma(samplePremulUnpacked(vUv - vec2(r1.x, 0.0)).rgb);
  float lR = luma(samplePremulUnpacked(vUv + vec2(r1.x, 0.0)).rgb);
  float lU = luma(samplePremulUnpacked(vUv - vec2(0.0, r1.y)).rgb);
  float lD = luma(samplePremulUnpacked(vUv + vec2(0.0, r1.y)).rgb);

  // Screen Y points downward: silhouette empty above -> normal points UP (negative screen Y)
  float nx = (aL1 - aR1) * 0.85 + (aL2 - aR2) * 1.15 + (lL - lR) * 0.45;
  float ny = (aU1 - aD1) * 0.85 + (aU2 - aD2) * 1.15 + (lU - lD) * 0.45;
  vec3 n = normalize(vec3(nx, ny, 1.0));

  // Detect warm lit cottage windows (amber/gold panes), emerald Floo & icy Yule blue-flame/Patronus cores
  float lum = luma(c.rgb);
  float warmth = c.r * 0.58 + c.g * 0.42 - c.b * 0.72;
  float warmWindow = smoothstep(0.22, 0.48, warmth) * smoothstep(0.56, 0.84, lum);
  float magicCore = smoothstep(0.18, 0.46, max(c.g, c.b) - c.r * 0.78) * smoothstep(0.52, 0.85, lum);
  float emissive = clamp(max(warmWindow, magicCore * 0.96), 0.0, 1.0);

  fragColor = vec4(n * 0.5 + 0.5, emissive);
}
`,Zt=`#version 300 es
precision highp float;
in vec2 vUv;
uniform float uTime;
uniform int uPeriod; // 0 dawn, 1 day, 2 dusk, 3 night
uniform int uWeather; // 0 clear, 1 rain/storm, 2 snow
out vec4 fragColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {
  float y = 1.0 - vUv.y; // 0 top -> 1 bottom
  vec3 topCol;
  vec3 botCol;
  if (uPeriod == 0) {
    topCol = vec3(0.36, 0.64, 0.94);
    botCol = vec3(0.99, 0.88, 0.72);
  } else if (uPeriod == 2) {
    topCol = vec3(0.32, 0.34, 0.64);
    botCol = vec3(0.98, 0.68, 0.48);
  } else if (uPeriod == 3) {
    topCol = vec3(0.11, 0.19, 0.40);
    botCol = vec3(0.24, 0.38, 0.64);
  } else {
    topCol = vec3(0.36, 0.68, 0.96);
    botCol = vec3(0.90, 0.96, 1.0);
  }

  if (uWeather == 1) {
    topCol = mix(topCol, vec3(0.38, 0.48, 0.60), 0.42);
    botCol = mix(botCol, vec3(0.62, 0.70, 0.80), 0.42);
  }

  vec3 col = mix(topCol, botCol, smoothstep(0.0, 1.0, y));

  // Twinkling pinpoint night/dusk stars & subtle emerald-violet aurora ribbon
  if (uPeriod == 3 || uPeriod == 2) {
    float starStrength = uPeriod == 3 ? 1.0 : 0.35;
    vec2 starUv = vUv * vec2(140.0, 82.0);
    vec2 grid = floor(starUv);
    vec2 f = fract(starUv);
    float h = hash(grid);
    if (h > 0.945 && y < 0.68) {
      vec2 starCenter = vec2(hash(grid + vec2(13.7, 5.3)), hash(grid + vec2(29.1, 41.9))) * 0.56 + 0.22;
      float d = length(f - starCenter);
      float pinpoint = smoothstep(0.14, 0.015, d);
      float tw = 0.45 + 0.55 * sin(uTime * (2.2 + h * 4.5) + h * 40.0);
      col += vec3(0.95, 0.98, 1.25) * pinpoint * tw * starStrength;
    }
    if (uPeriod == 3) {
      float auroraWave = sin(vUv.x * 5.5 + uTime * 0.28) * 0.05 + sin(vUv.x * 11.0 - uTime * 0.19) * 0.025;
      float band = exp(-pow((y - (0.24 + auroraWave)) * 9.5, 2.0));
      float yuleBoost = uWeather == 2 ? 1.85 : 1.0;
      col += mix(vec3(0.06, 0.52, 0.38), vec3(0.28, 0.18, 0.58), vUv.x) * band * 0.28 * yuleBoost;
      if (uWeather == 2) {
        float highCurtain = exp(-pow((y - (0.14 - auroraWave * 0.7)) * 11.0, 2.0));
        col += mix(vec3(0.14, 0.58, 0.82), vec3(0.56, 0.24, 0.72), 1.0 - vUv.x) * highCurtain * 0.30;
      }
    }
  }

  fragColor = vec4(col, 1.0);
}
`,$t=`#version 300 es
precision highp float;
layout(location = 0) in vec2 aCorner; // [-1..1] diamond corner
layout(location = 1) in vec2 iWorldPos;
layout(location = 2) in vec3 iBaseColor;
layout(location = 3) in vec3 iMeta; // [pathCode, elevAndUnlock, terrainKindCode]

uniform vec3 uCamera; // (camX, camY, zoom)
uniform vec2 uViewport;

out vec2 vLocal;
out vec2 vWorldPos;
out vec3 vColor;
out vec3 vMeta;

void main() {
  // Expand diamond by 1.036 so adjacent tiles fuse seamlessly without hairline gaps or grid lines
  vec2 offset = vec2(aCorner.x * ${_e*.5*1.036}, aCorner.y * ${Le*.5*1.036});
  vec2 wp = iWorldPos + offset;
  vec2 sp = uViewport * 0.5 + (wp - uCamera.xy) * uCamera.z;
  vec2 clip = vec2((sp.x / uViewport.x) * 2.0 - 1.0, 1.0 - (sp.y / uViewport.y) * 2.0);
  gl_Position = vec4(clip, 0.0, 1.0);
  vLocal = aCorner;
  vWorldPos = wp;
  vColor = iBaseColor;
  vMeta = iMeta;
}
`,jt=`#version 300 es
precision highp float;
in vec2 vLocal;
in vec2 vWorldPos;
in vec3 vColor;
in vec3 vMeta;

uniform float uTime;
uniform float uWinterSnow;
uniform vec3 uAmbientTint;
uniform int uLightCount;
uniform vec4 uLightPosRad[16]; // (wx, wy, z, radius)
uniform vec4 uLightColInt[16]; // (r, g, b, intensity)

out vec4 fragColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm3(vec2 p) {
  float v = 0.0;
  v += 0.55 * vnoise(p);
  v += 0.30 * vnoise(p * 2.07 + vec2(19.3, 7.1));
  v += 0.15 * vnoise(p * 4.13 + vec2(43.7, 29.5));
  return v;
}

void main() {
  float manhattan = abs(vLocal.x) + abs(vLocal.y);
  if (manhattan > 1.038) discard;

  // Isometric ground-plane projection (2:1 foreshortening correction) so meadow patches look round in 2.5D
  vec2 isoPos = vec2(vWorldPos.x, vWorldPos.y * 1.92);
  float terrainKind = vMeta.z; // 0 = meadow, 1 = forest, 2 = stone, 3 = snow
  vec3 col = vColor;

  if (terrainKind < 1.5) {
    // 1. Continuous Zero-Seam Rolling Meadow Glades (Playrix Township / Hay Day Cozy 2.5D)
    float hill = fbm3(isoPos * 0.0052);
    float glade = fbm3(isoPos * 0.0145 + vec2(31.4, 12.8));

    // Vibrant emerald valley hollows -> rich meadow lawn -> warm sun-kissed golden-chartreuse hilltops
    vec3 deepHollow = vColor * vec3(0.76, 0.88, 0.78);
    vec3 sunlitCrest = min(vec3(1.0), vColor * vec3(1.42, 1.24, 1.06) + vec3(0.06, 0.05, 0.0));
    col = mix(deepHollow, vColor, smoothstep(0.22, 0.50, hill));
    col = mix(col, sunlitCrest, smoothstep(0.46, 0.78, hill * 0.68 + glade * 0.32) * 0.85);

    // 2. Soft Organic Clover Cushions with subtle top-left sunlit 2.5D rim
    float clover = vnoise(isoPos * 0.026 + vec2(11.0, 27.0)) * 0.65 + vnoise(isoPos * 0.058) * 0.35;
    float cloverNeighbor = vnoise((isoPos + vec2(3.5, 3.5)) * 0.026 + vec2(11.0, 27.0)) * 0.65
                         + vnoise((isoPos + vec2(3.5, 3.5)) * 0.058) * 0.35;
    float cloverMask = smoothstep(0.56, 0.73, clover);
    float cloverRim = clamp((clover - cloverNeighbor) * 2.2, -0.12, 0.22) * cloverMask;
    vec3 cloverHue = col * vec3(0.86, 1.05, 0.84) + vec3(0.02, 0.05, 0.01) + cloverRim * vec3(0.24, 0.28, 0.05);
    col = mix(col, cloverHue, cloverMask * 0.50);

    // 3. Velvety Gouache Directional Brushstroke Micro-Fiber (replaces flat plastic fill up close)
    float brushBroad = vnoise(vec2(vWorldPos.x * 0.19, vWorldPos.y * 0.46));
    float brushFine = vnoise(vec2(vWorldPos.x * 0.46 + 9.2, vWorldPos.y * 1.08));
    float stroke = (brushBroad - 0.5) * 0.07 + (brushFine - 0.5) * 0.04;
    col += stroke * vec3(0.10, 0.12, 0.02);

    // 4. Crisp Bright Winter Snow Blanket across the entire meadow (zero muddy/green blotches!)
    if (uWinterSnow > 0.01) {
      float snowField = fbm3(isoPos * 0.0095 + vec2(71.2, 19.6));
      float snowCover = mix(0.95, 1.0, smoothstep(0.12, 0.48, snowField));
      float snowDriftCrest = smoothstep(0.42, 0.78, snowField);
      vec3 snowBase = vec3(0.92, 0.96, 1.0);
      vec3 snowCrest = vec3(0.99, 0.995, 1.0) + (brushBroad - 0.5) * 0.015;
      vec3 crispSnow = mix(snowBase, snowCrest, snowDriftCrest);
      col = mix(col, crispSnow, snowCover * uWinterSnow * 0.99);
    }
  } else {
    float macro = vnoise(isoPos * 0.018);
    float detail = vnoise(isoPos * 0.095);
    col = vColor * (0.94 + macro * 0.11 + (detail - 0.5) * 0.05);
  }

  // Sculpted 2.5D Voronoi Cobblestone / Timber / Flagstone Paths — 100% Seamless Across Connected Tiles!
  int rawPath = int(vMeta.x + 0.5);
  int basePathKind = rawPath & 3;
  int curbMask = rawPath >> 2;
  if (basePathKind > 0) {
    // u in [-1..1] along rx, v in [-1..1] along ry; fade ONLY on outer curb edges where neighbor is grass!
    float u = vLocal.x + vLocal.y;
    float v = vLocal.y - vLocal.x;
    float curbDist = 2.0;
    if ((curbMask & 1) != 0) curbDist = min(curbDist, 1.0 + v); // ry - 1 grass bank
    if ((curbMask & 4) != 0) curbDist = min(curbDist, 1.0 - v); // ry + 1 grass bank
    if ((curbMask & 8) != 0) curbDist = min(curbDist, 1.0 + u); // rx - 1 grass bank
    if ((curbMask & 2) != 0) curbDist = min(curbDist, 1.0 - u); // rx + 1 grass bank

    float edgeWave = (vnoise(isoPos * 0.15) - 0.5) * 0.18;
    float warpedCurb = curbDist + edgeWave;
    float earthVerge = smoothstep(0.02, 0.34, warpedCurb);
    float roadMask = smoothstep(0.12, 0.38, warpedCurb);

    vec2 cellUv = vec2(vWorldPos.x * 0.125, vWorldPos.y * 0.235);
    vec2 baseCell = floor(cellUv);
    vec2 fracCell = fract(cellUv);
    float minDist = 8.0;
    float secondDist = 8.0;
    vec2 bestVec = vec2(0.0);
    float stoneHue = 0.5;
    for (int oy = -1; oy <= 1; oy++) {
      for (int ox = -1; ox <= 1; ox++) {
        vec2 neighbor = vec2(float(ox), float(oy));
        vec2 cid = baseCell + neighbor;
        vec2 jitter = vec2(hash(cid), hash(cid + vec2(37.0, 19.0))) * 0.72 + 0.14;
        vec2 diff = neighbor + jitter - fracCell;
        float d = length(diff);
        if (d < minDist) {
          secondDist = minDist;
          minDist = d;
          bestVec = diff;
          stoneHue = hash(cid + vec2(91.0, 13.0));
        } else if (d < secondDist) {
          secondDist = d;
        }
      }
    }
    float edgeGap = secondDist - minDist;
    float stoneMask = smoothstep(0.055, 0.14, edgeGap);
    float bevel = clamp(0.88 + (-bestVec.x * 0.55 - bestVec.y * 0.75) * 0.60, 0.68, 1.18);
    vec3 mortarCol = vec3(0.28, 0.21, 0.14);
    vec3 baseStone = basePathKind == 1
      ? mix(vec3(0.62, 0.49, 0.34), vec3(0.79, 0.65, 0.47), stoneHue)
      : basePathKind == 2
        ? mix(vec3(0.52, 0.36, 0.20), vec3(0.66, 0.47, 0.28), stoneHue)
        : mix(vec3(0.72, 0.69, 0.63), vec3(0.85, 0.82, 0.76), stoneHue);
    vec3 roadCol = mix(mortarCol, baseStone * bevel, stoneMask);
    vec3 vergeCol = mix(vec3(0.50, 0.40, 0.26), vec3(0.88, 0.93, 0.99), uWinterSnow * 0.92);
    col = mix(col, mix(col * 0.90, vergeCol, 0.58), earthVerge * (1.0 - roadMask) * 0.80);
    col = mix(col, roadCol, roadMask * 0.98);
  } else if (terrainKind > 1.5 && terrainKind < 2.5) {
    // Subtle plaza slab bevel ONLY on stone terrain — NEVER draw diamond grid seams on grass/snow!
    float edge = smoothstep(0.88, 1.0, manhattan);
    col *= 1.0 - edge * 0.045;
  }

  // Whisper-soft drifting cloud breeze (never darkens white winter snow!)
  float cloud = vnoise(isoPos * 0.0022 + vec2(uTime * 0.028, -uTime * 0.016));
  float cloudShadow = smoothstep(0.58, 0.84, cloud) * 0.04;
  col *= 1.0 - cloudShadow;

  // Apply time-of-day ambient & soft-compressed dynamic 2.5D ground light spill (prevents multi-lamp blowout on snow!)
  vec3 lit = col * uAmbientTint;
  vec3 pointSum = vec3(0.0);
  for (int i = 0; i < 16; i++) {
    if (i >= uLightCount) break;
    vec4 lp = uLightPosRad[i];
    vec4 lc = uLightColInt[i];
    vec2 d = (vWorldPos - lp.xy) * vec2(1.0, 1.65); // Isometric ground ellipse correction
    float dist = length(d);
    float att = pow(clamp(1.0 - dist / lp.w, 0.0, 1.0), 2.15);
    pointSum += lc.rgb * (att * lc.w * 0.52);
  }
  pointSum = pointSum / (vec3(1.0) + pointSum * 1.15);
  lit += col * pointSum * 0.55 + pointSum * 0.08;

  // Bright pastel frost glaze over locked outer zones (never dark!)
  if (vMeta.y >= 9.5) {
    lit = mix(lit, uAmbientTint * vec3(0.94, 0.97, 1.0), 0.14);
  }

  fragColor = vec4(lit, 1.0);
}
`,Jt=`#version 300 es
precision highp float;
layout(location = 0) in vec2 aCorner;
layout(location = 1) in vec2 iWorldPos;
layout(location = 2) in vec4 iWaterMeta; // [shoreMask, depthFactor, unlocked, seed]

uniform vec3 uCamera;
uniform vec2 uViewport;

out vec2 vLocal;
out vec2 vWorldPos;
out vec4 vWaterMeta;

void main() {
  vec2 offset = vec2(aCorner.x * ${_e*.5*1.045}, aCorner.y * ${Le*.5*1.045});
  vec2 wp = iWorldPos + offset;
  vec2 sp = uViewport * 0.5 + (wp - uCamera.xy) * uCamera.z;
  vec2 clip = vec2((sp.x / uViewport.x) * 2.0 - 1.0, 1.0 - (sp.y / uViewport.y) * 2.0);
  gl_Position = vec4(clip, 0.0, 1.0);
  vLocal = aCorner;
  vWorldPos = wp;
  vWaterMeta = iWaterMeta;
}
`,eo=`#version 300 es
precision highp float;
in vec2 vLocal;
in vec2 vWorldPos;
in vec4 vWaterMeta;

uniform float uTime;
uniform float uWinterSnow;
uniform vec3 uAmbientTint;
uniform vec3 uSkyReflectColor;
uniform vec3 uSunColor;
uniform int uInteractorCount;
uniform vec4 uInteractors[16]; // (wx, wy, radius, strength)
uniform int uLightCount;
uniform vec4 uLightPosRad[16];
uniform vec4 uLightColInt[16];

out vec4 fragColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float causticPattern(vec2 uv, float t) {
  vec2 p1 = uv * 0.075 + vec2(t * 0.35, t * 0.22);
  vec2 p2 = uv * 0.092 - vec2(t * 0.28, -t * 0.31);
  float w1 = sin(p1.x * 6.283 + sin(p1.y * 6.283));
  float w2 = cos(p2.y * 6.283 + cos(p2.x * 6.283));
  return pow(clamp((w1 * w2) * 0.5 + 0.5, 0.0, 1.0), 3.2);
}

void main() {
  float manhattan = abs(vLocal.x) + abs(vLocal.y);
  if (manhattan > 1.04) discard;

  // Dual-octave flow-mapped water normal
  vec2 flowUv = vec2(vWorldPos.x * 0.038, vWorldPos.y * 0.068);
  float n1 = vnoise(flowUv + vec2(uTime * 0.55, uTime * 0.85));
  float n2 = vnoise(flowUv * 2.1 - vec2(uTime * 0.42, -uTime * 0.62));
  vec2 waveGrad = vec2(n1 - n2, (n1 + n2) - 1.0) * 0.55;

  // Interactive concentric ripples around cursor & riverside villagers!
  float interactiveRing = 0.0;
  for (int i = 0; i < 16; i++) {
    if (i >= uInteractorCount) break;
    vec4 intr = uInteractors[i];
    float d = length((vWorldPos - intr.xy) * vec2(1.0, 1.7));
    if (d < intr.z * 1.35) {
      float falloff = smoothstep(intr.z * 1.35, 0.0, d);
      float ring = sin(d * 0.36 - uTime * 6.8) * falloff * intr.w;
      interactiveRing += ring;
      waveGrad += normalize(vWorldPos - intr.xy + vec2(0.001)) * ring * 0.35;
    }
  }

  vec3 waterDeep = mix(vec3(0.06, 0.44, 0.64), vec3(0.05, 0.34, 0.56), uWinterSnow);
  vec3 waterShallow = mix(vec3(0.16, 0.72, 0.80), vec3(0.32, 0.76, 0.92), uWinterSnow);
  vec3 baseWater = mix(waterShallow, waterDeep, vWaterMeta.y);

  // Refractive sunlit caustics dancing on shallow pebbles
  float caus = causticPattern(vWorldPos + waveGrad * 22.0, uTime);
  baseWater += uSunColor * caus * (1.25 - vWaterMeta.y * 0.55) * 0.42;

  // Sky reflection + sparkling sun/moon specular glints
  vec3 normal = normalize(vec3(waveGrad.x, waveGrad.y, 1.0));
  vec3 sunDir = normalize(vec3(-0.45, -0.55, 0.70));
  float spec = pow(max(dot(normal, sunDir), 0.0), 22.0);
  vec3 col = mix(baseWater * uAmbientTint, uSkyReflectColor, 0.12);
  col += uSunColor * spec * 0.95;
  col += vec3(0.75, 0.96, 1.0) * max(0.0, interactiveRing) * 0.28;

  // Subtle crystalline glacier ice floes drifting along River Ottery in Winter Christmas mode!
  if (uWinterSnow > 0.01) {
    vec2 floeUv = vec2(vWorldPos.x * 0.052, vWorldPos.y * 0.088 + uTime * 0.05);
    float floeField = vnoise(floeUv) * 0.72 + vnoise(floeUv * 2.4 + vec2(7.3, 19.1)) * 0.28;
    float floeRim = smoothstep(0.74, 0.78, floeField);
    float floeCore = smoothstep(0.78, 0.84, floeField);
    vec3 iceRimCol = vec3(0.56, 0.86, 0.99) * max(uAmbientTint, vec3(0.45));
    vec3 iceTopCol = vec3(0.95, 0.985, 1.0) * max(uAmbientTint, vec3(0.52));
    col = mix(col, iceRimCol, floeRim * uWinterSnow * 0.85);
    col = mix(col, iceTopCol, floeCore * uWinterSnow * 0.92);
  }

  // Organic SDF shoreline foam / crystalline snowy frost shelf where water meets riverbanks
  int mask = int(vWaterMeta.x + 0.5);
  if (mask > 0) {
    // vLocal.x = drx - dry, vLocal.y = drx + dry  =>  u = 2*drx [-1..1], v = 2*dry [-1..1]
    float u = (vLocal.x + vLocal.y); // [-1..1] along rx
    float v = (vLocal.y - vLocal.x); // [-1..1] along ry
    float shoreDist = 2.0;
    if ((mask & 1) != 0) shoreDist = min(shoreDist, 1.0 + v); // ry - 1 bank
    if ((mask & 4) != 0) shoreDist = min(shoreDist, 1.0 - v); // ry + 1 bank
    if ((mask & 8) != 0) shoreDist = min(shoreDist, 1.0 + u); // rx - 1 bank
    if ((mask & 2) != 0) shoreDist = min(shoreDist, 1.0 - u); // rx + 1 bank
    float waveNoise = vnoise(vWorldPos * 0.09 + vec2(uTime * 0.9, -uTime * 0.6)) * 0.14;
    float lap = sin(uTime * 2.6 + (vWorldPos.x + vWorldPos.y) * 0.065) * 0.06 + waveNoise;
    float foamWidth = mix(0.28, 0.42, uWinterSnow);
    float foam = smoothstep(foamWidth + lap * (1.0 - uWinterSnow * 0.55), 0.04, shoreDist);
    vec3 shoreCol = mix(vec3(0.90, 0.98, 1.0), vec3(0.95, 0.985, 1.0), uWinterSnow);
    col = mix(col, shoreCol * max(uAmbientTint, vec3(0.48)), foam * mix(0.72, 0.92, uWinterSnow));
  }

  // Shimmering reflections of nearby 2.5D lanterns, Floo fire & Lumos wand on water!
  for (int i = 0; i < 16; i++) {
    if (i >= uLightCount) break;
    vec4 lp = uLightPosRad[i];
    vec4 lc = uLightColInt[i];
    vec2 d = (vWorldPos - lp.xy) * vec2(1.0, 1.55);
    float dist = length(d);
    if (dist < lp.w * 1.15) {
      float att = pow(clamp(1.0 - dist / (lp.w * 1.15), 0.0, 1.0), 1.8);
      float shimmer = 0.65 + 0.35 * sin(waveGrad.x * 9.0 + uTime * 5.0);
      col += lc.rgb * att * lc.w * shimmer * 0.72;
    }
  }

  fragColor = vec4(col, 0.96);
}
`,to=`#version 300 es
precision highp float;
layout(location = 0) in vec2 aQuadVert; // x in [-0.5..0.5], y in [0..1] (0 = root, 1 = crown)
layout(location = 1) in vec2 iWorldPos;
layout(location = 2) in vec4 iGrassMeta; // [height, hueVar, phase, isFlower]

uniform vec3 uCamera;
uniform vec2 uViewport;
uniform float uTime;
uniform float uWindStrength;
uniform int uInteractorCount;
uniform vec4 uInteractors[16];

out vec2 vTuftUv;
out float vHueVar;
out float vFlower;
out vec2 vWorldPos;

void main() {
  float t = aQuadVert.y;
  float bendWeight = t * t;

  // Gentle rolling meadow wind gusts sweeping across the valley
  float gust = sin(iWorldPos.x * 0.015 + iWorldPos.y * 0.012 - uTime * 2.15 + iGrassMeta.z)
             + 0.42 * sin(iWorldPos.x * 0.038 - uTime * 3.6 + iGrassMeta.z * 1.7);
  vec2 bendOffset = vec2(gust * 3.1 * uWindStrength, abs(gust) * 0.65 * uWindStrength) * bendWeight;

  // Interactive proximity bending away from cursor & walking villagers!
  for (int i = 0; i < 16; i++) {
    if (i >= uInteractorCount) break;
    vec4 intr = uInteractors[i];
    vec2 diff = iWorldPos - intr.xy;
    vec2 isoDiff = diff * vec2(1.0, 1.65);
    float dist = length(isoDiff);
    if (dist < intr.z && dist > 0.001) {
      float push = smoothstep(intr.z, 0.0, dist) * intr.w;
      vec2 dir = normalize(diff);
      bendOffset += vec2(dir.x * 10.5, dir.y * 5.0 + 2.6) * push * bendWeight;
    }
  }

  float quadWidth = iGrassMeta.w > 0.5 ? 11.5 : (11.5 + iGrassMeta.y * 3.5);
  float quadHeight = iGrassMeta.x;
  vec2 localOffset = vec2(aQuadVert.x * quadWidth, -t * quadHeight) + bendOffset;
  vec2 wp = iWorldPos + localOffset;

  vec2 sp = uViewport * 0.5 + (wp - uCamera.xy) * uCamera.z;
  vec2 clip = vec2((sp.x / uViewport.x) * 2.0 - 1.0, 1.0 - (sp.y / uViewport.y) * 2.0);
  gl_Position = vec4(clip, 0.0, 1.0);

  vTuftUv = aQuadVert; // x in [-0.5..0.5], y in [0..1]
  vHueVar = iGrassMeta.y;
  vFlower = iGrassMeta.w;
  vWorldPos = iWorldPos;
}
`,oo=`#version 300 es
precision highp float;
in vec2 vTuftUv;
in float vHueVar;
in float vFlower;
in vec2 vWorldPos;

uniform float uWinterSnow;
uniform vec3 uAmbientTint;
uniform vec3 uSunColor;
uniform int uLightCount;
uniform vec4 uLightPosRad[16];
uniform vec4 uLightColInt[16];

out vec4 fragColor;

float bladeShape(vec2 uv, float baseX, float lean, float h, float wBase) {
  if (uv.y > h || uv.y < 0.0) return 0.0;
  float yn = uv.y / h;
  float center = baseX + lean * yn * yn;
  // Soft rounded painterly blade (tapers gently with rounded tip, never needle-sharp)
  float halfW = wBase * (1.0 - 0.72 * yn * yn) * smoothstep(1.0, 0.84, yn);
  float d = abs(uv.x - center);
  return smoothstep(halfW + 0.032, max(0.0, halfW - 0.025), d);
}

void main() {
  vec2 uv = vTuftUv;
  float alpha = 0.0;
  vec3 col = vec3(0.0);
  float shadeGrad = clamp(uv.y, 0.0, 1.0);

  if (vFlower < 0.5) {
    // Unified Plump 3-Leaf Fanned Meadow Cushion (overlapping leaves = zero comb-teeth, warmer/brighter than turf!)
    float flip = vHueVar > 0.5 ? -1.0 : 1.0;
    float leafL = bladeShape(uv, -0.11 * flip, -0.19 * flip, 0.78, 0.185);
    float leafC = bladeShape(uv,  0.00,         0.02 * flip, 0.96, 0.205);
    float leafR = bladeShape(uv,  0.11 * flip,  0.19 * flip, 0.74, 0.180);
    float mask = max(leafC, max(leafL, leafR));
    float rootFade = smoothstep(0.04, 0.34, uv.y);
    alpha = mask * rootFade * 0.88;
    if (alpha < 0.02) discard;

    vec3 baseCol = mix(vec3(0.36, 0.66, 0.17), vec3(0.42, 0.71, 0.19), vHueVar);
    vec3 tipCol = mix(vec3(0.56, 0.83, 0.24), vec3(0.68, 0.88, 0.28), vHueVar);
    col = mix(baseCol, tipCol, smoothstep(0.18, 0.90, uv.y));

    if (uWinterSnow > 0.01) {
      vec3 frostBase = vec3(0.74, 0.84, 0.92);
      vec3 frostTip = vec3(0.96, 0.985, 1.0);
      vec3 winterTuft = mix(frostBase, frostTip, smoothstep(0.22, 0.84, uv.y));
      col = mix(col, winterTuft, uWinterSnow * 0.94);
      alpha *= mix(1.0, 0.68, uWinterSnow);
    }
  } else {
    // Cozy 5-Petal Cottage Wildflower (Cream Daisy / Golden Buttercup / Lavender / Blush Rose)
    float stem = bladeShape(uv, 0.0, (vHueVar - 0.5) * 0.10, 0.68, 0.068);
    float leafL = bladeShape(uv, -0.08, -0.18, 0.44, 0.075);
    float leafR = bladeShape(uv,  0.08,  0.18, 0.42, 0.075);
    float foliageMask = max(stem, max(leafL, leafR)) * smoothstep(0.02, 0.22, uv.y);

    vec2 bp = vec2(uv.x - (vHueVar - 0.5) * 0.04, (uv.y - 0.70) * 1.12);
    float r = length(bp);
    float ang = atan(bp.y, bp.x) + vHueVar * 6.283;
    float petalRadius = 0.205 + 0.055 * cos(ang * 5.0);
    float petalMask = smoothstep(petalRadius + 0.032, petalRadius - 0.025, r);
    float centerMask = smoothstep(0.095, 0.055, r);

    alpha = max(foliageMask * 0.85, petalMask * 0.96);
    if (alpha < 0.02) discard;

    vec3 stemCol = mix(vec3(0.30, 0.58, 0.16), vec3(0.09, 0.44, 0.20), uWinterSnow * 0.92);
    vec3 summerPetalCol = vHueVar < 0.38
      ? vec3(0.99, 0.98, 0.92) // Cream cottage daisy
      : vHueVar < 0.68
        ? vec3(0.99, 0.84, 0.22) // Golden buttercup
        : vHueVar < 0.85
          ? vec3(0.84, 0.70, 0.99) // Soft lavender
          : vec3(0.99, 0.74, 0.85); // Blush rose
    vec3 winterHollyCol = vHueVar < 0.72
      ? vec3(0.86, 0.14, 0.16) // Glossy crimson Christmas holly berry
      : vec3(0.98, 0.99, 1.0); // Snowdrop white winter bloom
    vec3 petalCol = mix(summerPetalCol, winterHollyCol, uWinterSnow);
    vec3 summerHeartCol = vHueVar < 0.38 ? vec3(0.96, 0.65, 0.12) : vec3(0.99, 0.93, 0.58);
    vec3 winterHeartCol = vec3(1.0, 0.98, 0.96); // Crisp snow glint on holly berry
    vec3 heartCol = mix(summerHeartCol, winterHeartCol, uWinterSnow);
    vec3 bloomCol = mix(petalCol, heartCol, centerMask);
    col = mix(stemCol, bloomCol, petalMask);
    shadeGrad = mix(uv.y, 0.95, petalMask);
  }

  // Translucent sunlit tip rim + dynamic 2.5D point lights
  vec3 lit = col * uAmbientTint + uSunColor * (shadeGrad * shadeGrad * 0.10);
  for (int i = 0; i < 16; i++) {
    if (i >= uLightCount) break;
    vec4 lp = uLightPosRad[i];
    vec4 lc = uLightColInt[i];
    float dist = length((vWorldPos - lp.xy) * vec2(1.0, 1.65));
    float att = pow(clamp(1.0 - dist / lp.w, 0.0, 1.0), 2.0);
    lit += col * lc.rgb * (att * lc.w * 1.05);
  }

  fragColor = vec4(lit, alpha);
}
`,io=`#version 300 es
precision highp float;
layout(location = 0) in vec2 aQuad; // x in [-0.5..0.5], y in [0..1] (0 = bottom, 1 = top)
layout(location = 1) in vec4 iRect; // [wx, wy, drawW, drawH]
layout(location = 2) in vec4 iAnim; // [spriteId, swayAmp, rotRad, pivotY]
layout(location = 3) in vec4 iShade; // [alpha, shadowScale, emissiveBoost, phaseSeed]

uniform vec3 uCamera;
uniform vec2 uViewport;
uniform sampler2D uUvTable;
uniform vec2 uShadowSkew; // directional sun shadow offset per unit height
uniform float uTime;
uniform float uWindStrength;

out vec2 vUv;
flat out float vLayer;
out float vShadowAlpha;

void main() {
  if (iShade.y <= 0.01 || iShade.x <= 0.35) {
    gl_Position = vec4(2.0, 2.0, 0.0, 1.0);
    vUv = vec2(0.0);
    vLayer = 0.0;
    vShadowAlpha = 0.0;
    return;
  }

  int sid = int(iAnim.x + 0.5);
  vec4 uvRect = texelFetch(uUvTable, ivec2(sid, 0), 0);
  vec4 meta = texelFetch(uUvTable, ivec2(sid, 1), 0);

  float flipSign = iRect.z < 0.0 ? -1.0 : 1.0;
  float absW = abs(iRect.z);
  float h = iRect.w;
  float yNorm = aQuad.y;

  float sway = sin(uTime * 1.9 + iShade.w) * iAnim.y * uWindStrength * (yNorm * yNorm);
  // Project upright silhouette onto the isometric ground plane with sun skew
  vec2 groundOffset = vec2(
    aQuad.x * absW * 0.92 + uShadowSkew.x * yNorm * (h * 0.018) + sway * 0.6,
    -yNorm * h * 0.28 + uShadowSkew.y * yNorm * (h * 0.018)
  );

  vec2 wp = iRect.xy + groundOffset;
  vec2 sp = uViewport * 0.5 + (wp - uCamera.xy) * uCamera.z;
  vec2 clip = vec2((sp.x / uViewport.x) * 2.0 - 1.0, 1.0 - (sp.y / uViewport.y) * 2.0);
  gl_Position = vec4(clip, 0.0, 1.0);

  float uCoord = flipSign < 0.0 ? (0.5 - aQuad.x) : (aQuad.x + 0.5);
  vUv = mix(uvRect.xy, uvRect.zw, vec2(uCoord, 1.0 - yNorm));
  vLayer = meta.x;
  vShadowAlpha = 0.38 * iShade.y * (1.0 - yNorm * 0.48);
}
`,ao=`#version 300 es
precision highp float;
precision highp sampler2DArray;
in vec2 vUv;
flat in float vLayer;
in float vShadowAlpha;

uniform sampler2DArray uAlbedo;
uniform vec3 uShadowTint;
out vec4 fragColor;

void main() {
  float a = texture(uAlbedo, vec3(vUv, vLayer)).a;
  if (a < 0.08) discard;
  float sa = a * vShadowAlpha;
  fragColor = vec4(uShadowTint * sa, sa);
}
`,ro=`#version 300 es
precision highp float;
layout(location = 0) in vec2 aQuad; // x in [-0.5..0.5], y in [0..1] (0 = bottom, 1 = top)
layout(location = 1) in vec4 iRect; // [wx, wy, drawW, drawH]
layout(location = 2) in vec4 iAnim; // [spriteId, swayAmp, rotRad, pivotY]
layout(location = 3) in vec4 iShade; // [alpha, shadowScale, emissiveBoost, phaseSeed]

uniform vec3 uCamera;
uniform vec2 uViewport;
uniform sampler2D uUvTable;
uniform float uTime;
uniform float uWindStrength;

out vec2 vUv;
flat out float vLayer;
flat out float vFlipSign;
flat out float vTintFlag;
flat out float vSnowCapEligible;
flat out float vHaloCleanse;
out vec2 vWorldPos;
out float vHeightPx;
out float vYNorm;
out float vAlpha;
out float vEmissiveBoost;

void main() {
  int sid = int(iAnim.x + 0.5);
  vec4 uvRect = texelFetch(uUvTable, ivec2(sid, 0), 0);
  vec4 meta = texelFetch(uUvTable, ivec2(sid, 1), 0);

  float flipSign = iRect.z < 0.0 ? -1.0 : 1.0;
  float absW = abs(iRect.z);
  float h = iRect.w;
  float yNorm = aQuad.y;

  // Local sprite coordinates anchored at (0, pivotY)
  vec2 local = vec2(aQuad.x * absW, -(yNorm - iAnim.w) * h);
  if (abs(iAnim.z) > 0.0001) {
    float c = cos(iAnim.z);
    float s = sin(iAnim.z);
    local = vec2(local.x * c - local.y * s, local.x * s + local.y * c);
  }

  // Base-pinned organic wind sway on trees, bushes & mature crops!
  float sway = (sin(uTime * 2.05 + iShade.w) + 0.4 * sin(uTime * 3.7 + iShade.w * 1.9))
             * iAnim.y * uWindStrength * (yNorm * yNorm);
  local.x += sway;

  vec2 wp = iRect.xy + local;
  vec2 sp = uViewport * 0.5 + (wp - uCamera.xy) * uCamera.z;
  vec2 clip = vec2((sp.x / uViewport.x) * 2.0 - 1.0, 1.0 - (sp.y / uViewport.y) * 2.0);
  gl_Position = vec4(clip, 0.0, 1.0);

  float uCoord = flipSign < 0.0 ? (0.5 - aQuad.x) : (aQuad.x + 0.5);
  vUv = mix(uvRect.xy, uvRect.zw, vec2(uCoord, 1.0 - yNorm));
  vLayer = meta.x;
  vSnowCapEligible = meta.z;
  vHaloCleanse = meta.w;
  vFlipSign = flipSign;
  float decodedTint = floor(iShade.x * 0.5);
  vTintFlag = decodedTint;
  // Ground-projected world coordinate + vertical pixel elevation for accurate 2.5D 3D light vectors!
  vWorldPos = vec2(iRect.x + local.x, iRect.y);
  vHeightPx = yNorm * h * 0.72;
  vYNorm = yNorm;
  vAlpha = clamp(iShade.x - decodedTint * 2.0, 0.0, 1.0);
  vEmissiveBoost = iShade.z;
}
`,so=`#version 300 es
precision highp float;
precision highp sampler2DArray;
in vec2 vUv;
flat in float vLayer;
flat in float vFlipSign;
flat in float vTintFlag;
flat in float vSnowCapEligible;
flat in float vHaloCleanse;
in vec2 vWorldPos;
in float vHeightPx;
in float vYNorm;
in float vAlpha;
in float vEmissiveBoost;

uniform sampler2DArray uAlbedo;
uniform sampler2DArray uNormalEmissive;
uniform vec3 uAmbientTint;
uniform vec3 uSunDir;
uniform vec3 uSunColor;
uniform float uNormalStrength;
uniform float uWindowGlowStrength;
uniform float uWinterSnow;
uniform int uLightCount;
uniform vec4 uLightPosRad[16];
uniform vec4 uLightColInt[16];

out vec4 fragColor;

void main() {
  vec4 tex = texture(uAlbedo, vec3(vUv, vLayer));
  if (tex.a < 0.012) discard;

  // Un-premultiply BEFORE optional outer halo refinement so edge colors stay pure
  vec3 albedo = tex.rgb / max(tex.a, 0.004);
  if (vHaloCleanse > 0.5 && tex.a < 0.85) {
    tex.a = mix(tex.a, smoothstep(0.24, 0.80, tex.a), 0.76);
    if (tex.a < 0.015) discard;
  }

  vec4 ne = texture(uNormalEmissive, vec3(vUv, vLayer));
  float rawNy = ne.g * 2.0 - 1.0;

  // Procedural 2.5D Winter Roof & Bough Snow Cap on canon Hang Sóc structures (0 extra PNGs!)
  if (uWinterSnow > 0.01 && vSnowCapEligible > 0.5) {
    float drift = sin(vWorldPos.x * 0.19) * 0.5 + sin(vWorldPos.x * 0.47 + vHeightPx * 0.09) * 0.5;
    float upwardMask = smoothstep(-0.10 + drift * 0.08, -0.44 + drift * 0.06, rawNy);
    float heightGate = smoothstep(0.22, 0.44, vYNorm);
    float lumBase = dot(albedo, vec3(0.299, 0.587, 0.114));
    // Preserve dark painted outlines & warm glowing cottage windows
    float inkProtect = smoothstep(0.16, 0.34, lumBase);
    float windowProtect = 1.0 - smoothstep(0.16, 0.42, ne.a);
    float snowAmt = clamp(upwardMask * heightGate * inkProtect * windowProtect * uWinterSnow * 0.88, 0.0, 0.90);
    albedo = mix(albedo, vec3(0.94, 0.97, 1.0), snowAmt);
  }

  vec3 normal = normalize(vec3(
    (ne.r * 2.0 - 1.0) * vFlipSign * uNormalStrength,
    rawNy * uNormalStrength,
    1.0
  ));

  // 1. Energy-Conserving 2.5D Directional Shading (bright, clean Playrix storybook interior)
  float nDotSun = max(dot(normal, uSunDir), 0.0);
  float baseAo = mix(0.96, 1.0, clamp(vHeightPx / 26.0, 0.0, 1.0));
  vec3 totalLight = (uAmbientTint + uSunColor * (nDotSun * 0.56)) * baseAo;

  // 2. Dynamic 2.5D Point Lights (Floo Emerald Hearth, Yule Ice/Patronus, Warm Windows, Lumos Wand Cursor!)
  vec3 pointLightAccum = vec3(0.0);
  for (int i = 0; i < 16; i++) {
    if (i >= uLightCount) break;
    vec4 lp = uLightPosRad[i];
    vec4 lc = uLightColInt[i];
    vec3 delta = vec3(
      lp.x - vWorldPos.x,
      (lp.y - vWorldPos.y) * 1.45,
      lp.z - vHeightPx
    );
    float dist = length(delta);
    if (dist < lp.w) {
      vec3 lDir = delta / max(dist, 0.001);
      float att = pow(clamp(1.0 - dist / lp.w, 0.0, 1.0), 2.05);
      float nDotL = mix(0.35, max(dot(normal, lDir), 0.0), clamp(uNormalStrength * 0.7, 0.0, 1.0));
      pointLightAccum += lc.rgb * (att * lc.w * nDotL * 1.18);
    }
  }
  totalLight += pointLightAccum / (vec3(1.0) + pointLightAccum * 0.72);

  vec3 lit = albedo * totalLight;

  // 3. Self-Illuminated Warm Cottage Windows & Cool Magical Emissive Cores (preserves sapphire/emerald flames!)
  float winMask = ne.a * vEmissiveBoost * uWindowGlowStrength;
  if (winMask > 0.01) {
    float coolMagic = clamp(max(albedo.b, albedo.g) - albedo.r * 0.82, 0.0, 1.0);
    vec3 coolHue = albedo * 1.18 + vec3(0.06, 0.16, 0.24);
    vec3 targetHue = mix(vec3(1.0, 0.78, 0.34), coolHue, smoothstep(0.04, 0.24, coolMagic));
    vec3 glowHue = mix(albedo, targetHue, 0.50);
    lit += glowHue * (winMask * 1.75);
  }

  // 4. Gameplay Build-Mode Ghost / Selection / Bulldoze Tinting (Track B3 Parity)
  if (vTintFlag > 0.5) {
    if (vTintFlag < 1.5) {
      // Valid placement: crisp emerald aura
      lit = mix(lit, vec3(0.32, 1.18, 0.62), 0.42);
    } else if (vTintFlag < 2.5) {
      // Blocked placement: warm crimson warning
      lit = mix(lit, vec3(1.25, 0.26, 0.24), 0.52);
    } else if (vTintFlag < 3.5) {
      // Selected building: golden highlight rim
      lit = lit * 1.12 + vec3(0.16, 0.12, 0.02);
    } else {
      // Bulldoze hover: warning amber-crimson pulse
      lit = mix(lit, vec3(1.30, 0.36, 0.18), 0.48);
    }
  }

  float outA = tex.a * vAlpha;
  fragColor = vec4(lit * outA, outA);
}
`,no=`#version 300 es
precision highp float;
layout(location = 0) in vec2 aQuad; // [-0.5..0.5] x [-0.5..0.5]
layout(location = 1) in vec3 iPosSize; // [wx, wy, radius]
layout(location = 2) in vec3 iColor;

uniform vec3 uCamera;
uniform vec2 uViewport;

out vec2 vLocal;
out vec3 vColor;

void main() {
  vec2 wp = iPosSize.xy + aQuad * (iPosSize.z * 2.4);
  vec2 sp = uViewport * 0.5 + (wp - uCamera.xy) * uCamera.z;
  vec2 clip = vec2((sp.x / uViewport.x) * 2.0 - 1.0, 1.0 - (sp.y / uViewport.y) * 2.0);
  gl_Position = vec4(clip, 0.0, 1.0);
  vLocal = aQuad * 2.0;
  vColor = iColor;
}
`,lo=`#version 300 es
precision highp float;
in vec2 vLocal;
in vec3 vColor;
uniform float uIsSnow;
out vec4 fragColor;

void main() {
  float d = length(vLocal);
  if (d > 1.0) discard;
  if (uIsSnow > 0.5) {
    // vColor = [spinPhase, styleSeed, alpha]
    // Directional 3D drop-shadow (never a concentric ring!) so pure white flakes stand out naturally on white snow
    float style = vColor.y;
    vec2 pBody = vLocal + vec2(0.06, 0.08);
    vec2 pShadow = vLocal - vec2(0.14, 0.18);
    if (style < 0.36) {
      float angB = atan(pBody.y, pBody.x) + vColor.x * 6.2831853;
      float starRB = mix(0.22, 0.86, pow(0.5 + 0.5 * cos(angB * 6.0), 2.6));
      float body = 1.0 - smoothstep(starRB * 0.45, starRB, length(pBody));

      float angS = atan(pShadow.y, pShadow.x) + vColor.x * 6.2831853;
      float starRS = mix(0.24, 0.88, pow(0.5 + 0.5 * cos(angS * 6.0), 2.6));
      float sh = (1.0 - smoothstep(starRS * 0.40, starRS, length(pShadow))) * 0.34;

      float alpha = clamp(body * 0.96 + sh * (1.0 - body), 0.0, 1.0) * vColor.z;
      vec3 col = mix(vec3(0.45, 0.66, 0.88), vec3(1.0, 1.0, 1.0), clamp(body * 1.15, 0.0, 1.0));
      fragColor = vec4(col, alpha);
    } else {
      float body = 1.0 - smoothstep(0.22, 0.62, length(pBody));
      float sh = (1.0 - smoothstep(0.20, 0.66, length(pShadow))) * 0.30;
      float alpha = clamp(body * 0.94 + sh * (1.0 - body), 0.0, 1.0) * vColor.z;
      vec3 col = mix(vec3(0.48, 0.69, 0.90), vec3(1.0, 1.0, 1.0), clamp(body * 1.15, 0.0, 1.0));
      fragColor = vec4(col, alpha);
    }
  } else {
    float glow = pow(1.0 - d, 2.4);
    fragColor = vec4(vColor * glow, glow);
  }
}
`,co=`#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uScene;
out vec4 fragColor;

void main() {
  vec3 c = texture(uScene, vUv).rgb;
  float brightness = max(max(c.r, c.g), c.b);
  // Threshold > 1.12 ensures white painted walls in daylight NEVER bleed milky haze; only true HDR lights bloom!
  float soft = clamp((brightness - 1.12) / 0.85, 0.0, 1.9);
  fragColor = vec4(c * soft * 0.62, 1.0);
}
`,ho=`#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uOffset;
out vec4 fragColor;

void main() {
  vec3 sum = texture(uTex, vUv).rgb * 0.28;
  sum += texture(uTex, vUv + vec2(uOffset.x, uOffset.y)).rgb * 0.18;
  sum += texture(uTex, vUv + vec2(-uOffset.x, uOffset.y)).rgb * 0.18;
  sum += texture(uTex, vUv + vec2(uOffset.x, -uOffset.y)).rgb * 0.18;
  sum += texture(uTex, vUv + vec2(-uOffset.x, -uOffset.y)).rgb * 0.18;
  fragColor = vec4(sum, 1.0);
}
`,uo=`#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uScene;
uniform sampler2D uBloom;
uniform float uBloomIntensity;
out vec4 fragColor;

// Preserves 1:1 sRGB blacks & midtones in [0..0.86] so hand-painted outlines never look washed out,
// while smoothly rolling off HDR highlights (> 0.86) without harsh clipping!
vec3 srgbHdrShoulder(vec3 x) {
  const float k = 0.94;
  vec3 over = max(x - k, vec3(0.0));
  vec3 compressed = k + (1.0 - k) * (1.0 - exp(-over / (1.0 - k)));
  return clamp(mix(x, compressed, step(vec3(k), x)), 0.0, 1.0);
}

void main() {
  vec3 hdr = texture(uScene, vUv).rgb;
  vec3 bloom = texture(uBloom, vUv).rgb * uBloomIntensity;
  vec3 combined = hdr + bloom;

  // Bright, unvignetted Playrix-style composite (zero corner darkening or shadow crush!)
  vec3 col = srgbHdrShoulder(combined);
  float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = clamp(mix(vec3(lum), col, 1.06), 0.0, 1.0);

  fragColor = vec4(col, 1.0);
}
`;class wo{constructor(o,s){c(this,"canvas");c(this,"gpuDevice");c(this,"gl");c(this,"sprites");c(this,"snapshot",new Ot);c(this,"spineAdapter");c(this,"rangeSlices",[]);c(this,"bakeNormalProg");c(this,"skyProg");c(this,"terrainProg");c(this,"waterProg");c(this,"grassProg");c(this,"shadowProg");c(this,"sceneProg");c(this,"particleProg");c(this,"bloomExtractProg");c(this,"bloomBlurProg");c(this,"compositeProg");c(this,"emptyVao");c(this,"terrainVao");c(this,"terrainInstanceBuf");c(this,"waterVao");c(this,"waterInstanceBuf");c(this,"grassVao");c(this,"grassInstanceBuf");c(this,"sceneVao");c(this,"sceneInstanceBuf");c(this,"particleVao");c(this,"particleInstanceBuf");c(this,"albedoArrayTex");c(this,"normalEmissiveArrayTex");c(this,"bakeFbo");c(this,"uvTableTex");c(this,"uvTableData",new Float32Array(Ve*2*4));c(this,"uvTableDirty",!1);c(this,"spriteHandles",new Map);c(this,"shelf",{layer:0,curX:Ae,curY:Ae,rowH:0});c(this,"uploadScratchCanvas");c(this,"uploadScratchCtx");c(this,"nextSpriteId",0);c(this,"useHalfFloatFbo");c(this,"fboW",0);c(this,"fboH",0);c(this,"sceneFbo",null);c(this,"sceneColorTex",null);c(this,"bloomFboA",null);c(this,"bloomTexA",null);c(this,"bloomFboB",null);c(this,"bloomTexB",null);c(this,"uploadedStaticGen",-1);c(this,"lightPosUniform",new Float32Array(64));c(this,"lightColUniform",new Float32Array(64));c(this,"fpsAccumMs",0);c(this,"fpsFrames",0);c(this,"currentFps",60);c(this,"lastFrameTs",0);c(this,"stats",{backend:"webgl2",fps:60,cpuCollectMs:0,drawCalls:0,terrainTiles:0,waterTiles:0,grassInstances:0,sortedSprites:0,particleInstances:0,activeLights:0,atlasLayers:1,atlasSpritesPacked:0,vramEstimateMb:0});this.canvas=o,this.sprites=s,this.gpuDevice=new Ft({canvas:o,preserveDrawingBuffer:!0,onContextRestored:()=>{this.uploadedStaticGen=-1,this.uvTableDirty=!0}});const e=this.gpuDevice.gl;this.gl=e,this.useHalfFloatFbo=this.gpuDevice.supportsHalfFloatHdr,this.spineAdapter=new Wt(e),this.bakeNormalProg=Te(e,He,qt),this.skyProg=Te(e,He,Zt),this.terrainProg=Te(e,$t,jt),this.waterProg=Te(e,Jt,eo),this.grassProg=Te(e,to,oo),this.shadowProg=Te(e,io,ao),this.sceneProg=Te(e,ro,so),this.particleProg=Te(e,no,lo),this.bloomExtractProg=Te(e,He,co),this.bloomBlurProg=Te(e,He,ho),this.compositeProg=Te(e,He,uo),this.emptyVao=e.createVertexArray();const x=new Float32Array([-1,0,0,-1,0,1,1,0]),d=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,d),e.bufferData(e.ARRAY_BUFFER,x,e.STATIC_DRAW),this.terrainVao=e.createVertexArray(),this.terrainInstanceBuf=e.createBuffer(),e.bindVertexArray(this.terrainVao),e.bindBuffer(e.ARRAY_BUFFER,d),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,this.terrainInstanceBuf),e.enableVertexAttribArray(1),e.vertexAttribPointer(1,2,e.FLOAT,!1,Ue*4,0),e.vertexAttribDivisor(1,1),e.enableVertexAttribArray(2),e.vertexAttribPointer(2,3,e.FLOAT,!1,Ue*4,8),e.vertexAttribDivisor(2,1),e.enableVertexAttribArray(3),e.vertexAttribPointer(3,3,e.FLOAT,!1,Ue*4,20),e.vertexAttribDivisor(3,1),this.waterVao=e.createVertexArray(),this.waterInstanceBuf=e.createBuffer(),e.bindVertexArray(this.waterVao),e.bindBuffer(e.ARRAY_BUFFER,d),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,this.waterInstanceBuf),e.enableVertexAttribArray(1),e.vertexAttribPointer(1,2,e.FLOAT,!1,Ne*4,0),e.vertexAttribDivisor(1,1),e.enableVertexAttribArray(2),e.vertexAttribPointer(2,4,e.FLOAT,!1,Ne*4,8),e.vertexAttribDivisor(2,1);const v=new Float32Array([-.5,0,.5,0,-.5,1,.5,1]),t=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,t),e.bufferData(e.ARRAY_BUFFER,v,e.STATIC_DRAW),this.grassVao=e.createVertexArray(),this.grassInstanceBuf=e.createBuffer(),e.bindVertexArray(this.grassVao),e.bindBuffer(e.ARRAY_BUFFER,t),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,this.grassInstanceBuf),e.enableVertexAttribArray(1),e.vertexAttribPointer(1,2,e.FLOAT,!1,Fe*4,0),e.vertexAttribDivisor(1,1),e.enableVertexAttribArray(2),e.vertexAttribPointer(2,4,e.FLOAT,!1,Fe*4,8),e.vertexAttribDivisor(2,1),this.sceneVao=e.createVertexArray(),this.sceneInstanceBuf=e.createBuffer(),e.bindVertexArray(this.sceneVao),e.bindBuffer(e.ARRAY_BUFFER,t),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,this.sceneInstanceBuf),e.bufferData(e.ARRAY_BUFFER,this.snapshot.sceneData.byteLength,e.DYNAMIC_DRAW),e.enableVertexAttribArray(1),e.vertexAttribPointer(1,4,e.FLOAT,!1,Se*4,0),e.vertexAttribDivisor(1,1),e.enableVertexAttribArray(2),e.vertexAttribPointer(2,4,e.FLOAT,!1,Se*4,16),e.vertexAttribDivisor(2,1),e.enableVertexAttribArray(3),e.vertexAttribPointer(3,4,e.FLOAT,!1,Se*4,32),e.vertexAttribDivisor(3,1);const w=new Float32Array([-.5,-.5,.5,-.5,-.5,.5,.5,.5]),u=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,u),e.bufferData(e.ARRAY_BUFFER,w,e.STATIC_DRAW),this.particleVao=e.createVertexArray(),this.particleInstanceBuf=e.createBuffer(),e.bindVertexArray(this.particleVao),e.bindBuffer(e.ARRAY_BUFFER,u),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,this.particleInstanceBuf),e.bufferData(e.ARRAY_BUFFER,this.snapshot.particleData.byteLength,e.DYNAMIC_DRAW),e.enableVertexAttribArray(1),e.vertexAttribPointer(1,3,e.FLOAT,!1,Ye*4,0),e.vertexAttribDivisor(1,1),e.enableVertexAttribArray(2),e.vertexAttribPointer(2,3,e.FLOAT,!1,Ye*4,12),e.vertexAttribDivisor(2,1),e.bindVertexArray(null),this.albedoArrayTex=e.createTexture(),e.bindTexture(e.TEXTURE_2D_ARRAY,this.albedoArrayTex),e.texStorage3D(e.TEXTURE_2D_ARRAY,1,e.RGBA8,le,le,Je),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),this.normalEmissiveArrayTex=e.createTexture(),e.bindTexture(e.TEXTURE_2D_ARRAY,this.normalEmissiveArrayTex),e.texStorage3D(e.TEXTURE_2D_ARRAY,1,e.RGBA8,le,le,Je),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),this.bakeFbo=e.createFramebuffer(),this.uvTableTex=e.createTexture(),e.bindTexture(e.TEXTURE_2D,this.uvTableTex),e.texImage2D(e.TEXTURE_2D,0,e.RGBA32F,Ve,2,0,e.RGBA,e.FLOAT,this.uvTableData),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),this.uploadScratchCanvas=document.createElement("canvas"),this.uploadScratchCanvas.width=1024,this.uploadScratchCanvas.height=1024,this.uploadScratchCtx=this.uploadScratchCanvas.getContext("2d")}invalidateSpriteAtlas(){this.spriteHandles.clear(),this.shelf.layer=0,this.shelf.curX=Ae,this.shelf.curY=Ae,this.shelf.rowH=0,this.nextSpriteId=0,this.uvTableDirty=!0}resolve(o){const s=this.spriteHandles.get(o);if(s)return s;if(this.nextSpriteId>=Ve)return;if(o.startsWith("conn:")){const x=o.split(":"),d=x[1],v=Number(x[2]??0);if(d&&Number.isFinite(v)&&v>0){const t=this.sprites.getConnectedFarmlandSprite(d,v,372);if(t)return this.packSpriteIntoArray(o,t)}return}const e=this.sprites.get(o);if(e)return this.packSpriteIntoArray(o,e)}packSpriteIntoArray(o,s){const e=s.width,x=s.height;if(!e||!x)return;const v=Math.min(1,1024/Math.max(e,x)),t=Math.max(4,Math.round(e*v)),w=Math.max(4,Math.round(x*v));if(this.shelf.curX+t+Ae>le&&(this.shelf.curX=Ae,this.shelf.curY+=this.shelf.rowH+Ae,this.shelf.rowH=0),this.shelf.curY+w+Ae>le){if(this.shelf.layer+1>=Je)return;this.shelf.layer+=1,this.shelf.curX=Ae,this.shelf.curY=Ae,this.shelf.rowH=0}const u=this.shelf.curX,n=this.shelf.curY,r=this.shelf.layer;this.shelf.curX+=t+Ae,this.shelf.rowH=Math.max(this.shelf.rowH,w);const l=this.gl;let a=s;if(v<1){(this.uploadScratchCanvas.width<t||this.uploadScratchCanvas.height<w)&&(this.uploadScratchCanvas.width=Math.max(t,1024),this.uploadScratchCanvas.height=Math.max(w,1024)),this.uploadScratchCtx.clearRect(0,0,t,w),this.uploadScratchCtx.drawImage(s,0,0,t,w);const O=document.createElement("canvas");O.width=t,O.height=w,O.getContext("2d").drawImage(this.uploadScratchCanvas,0,0,t,w,0,0,t,w),a=O}l.bindTexture(l.TEXTURE_2D_ARRAY,this.albedoArrayTex),l.pixelStorei(l.UNPACK_PREMULTIPLY_ALPHA_WEBGL,1),l.texSubImage3D(l.TEXTURE_2D_ARRAY,0,u,n,r,t,w,1,l.RGBA,l.UNSIGNED_BYTE,a),l.pixelStorei(l.UNPACK_PREMULTIPLY_ALPHA_WEBGL,0),l.bindFramebuffer(l.FRAMEBUFFER,this.bakeFbo),l.framebufferTextureLayer(l.FRAMEBUFFER,l.COLOR_ATTACHMENT0,this.normalEmissiveArrayTex,0,r),l.enable(l.SCISSOR_TEST),l.viewport(u,n,t,w),l.scissor(u,n,t,w),l.disable(l.BLEND),l.useProgram(this.bakeNormalProg),l.activeTexture(l.TEXTURE0),l.bindTexture(l.TEXTURE_2D_ARRAY,this.albedoArrayTex),l.uniform1i(l.getUniformLocation(this.bakeNormalProg,"uAlbedo"),0),l.uniform1f(l.getUniformLocation(this.bakeNormalProg,"uLayer"),r),l.uniform2f(l.getUniformLocation(this.bakeNormalProg,"uTexel"),1/le,1/le),l.viewport(0,0,le,le),l.bindVertexArray(this.emptyVao),l.drawArrays(l.TRIANGLES,0,3),l.disable(l.SCISSOR_TEST),l.bindFramebuffer(l.FRAMEBUFFER,null);const h=this.nextSpriteId++,_=h*4;this.uvTableData[_]=(u+.5)/le,this.uvTableData[_+1]=(n+.5)/le,this.uvTableData[_+2]=(u+t-.5)/le,this.uvTableData[_+3]=(n+w-.5)/le;const b=(Ve+h)*4;this.uvTableData[b]=r,this.uvTableData[b+1]=e/x,this.uvTableData[b+2]=Kt(o)?1:0,this.uvTableData[b+3]=Qt(o)?1:0,this.uvTableDirty=!0;const V={id:h,width:e,height:x};return this.spriteHandles.set(o,V),V}ensureRenderTargets(o,s){if(this.fboW===o&&this.fboH===s&&this.sceneFbo)return;const e=this.gl;this.fboW=o,this.fboH=s;const x=(r,l)=>{r&&e.deleteFramebuffer(r),l&&e.deleteTexture(l)};x(this.sceneFbo,this.sceneColorTex),x(this.bloomFboA,this.bloomTexA),x(this.bloomFboB,this.bloomTexB);const d=(r,l)=>{const a=e.createTexture();e.bindTexture(e.TEXTURE_2D,a),this.useHalfFloatFbo?e.texImage2D(e.TEXTURE_2D,0,e.RGBA16F,r,l,0,e.RGBA,e.HALF_FLOAT,null):e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,r,l,0,e.RGBA,e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE);const h=e.createFramebuffer();return e.bindFramebuffer(e.FRAMEBUFFER,h),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,a,0),{fbo:h,tex:a}},v=Math.max(2,o>>1),t=Math.max(2,s>>1),w=d(o,s);this.sceneFbo=w.fbo,this.sceneColorTex=w.tex;const u=d(v,t);this.bloomFboA=u.fbo,this.bloomTexA=u.tex;const n=d(v,t);this.bloomFboB=n.fbo,this.bloomTexB=n.tex,e.bindFramebuffer(e.FRAMEBUFFER,null)}drawInstancedSceneRange(o,s){if(s<=0)return;const e=this.gl,x=o*Se*4;e.bindBuffer(e.ARRAY_BUFFER,this.sceneInstanceBuf),e.vertexAttribPointer(1,4,e.FLOAT,!1,Se*4,x),e.vertexAttribPointer(2,4,e.FLOAT,!1,Se*4,x+16),e.vertexAttribPointer(3,4,e.FLOAT,!1,Se*4,x+32),e.drawArraysInstanced(e.TRIANGLE_STRIP,0,4,s)}syncInteractiveHotspots(o,s,e,x,d,v,t){t.length=0;const w=s.viewRot??0,u=Math.max(.25,s.zoom),n=o.getActiveFestival(),r=new Set(o.state.unlockedZones);if(!o.state.sandboxMode&&!o.isVisitingNeighbor)for(const a of gt){if(r.has(a.id))continue;const h=(a.x1+a.x2+1)*.5,_=(a.y1+a.y2+1)*.5,b=Rt(h,_,s,e,x,0);b.sx>=-120&&b.sx<=e+120&&b.sy>=-120&&b.sy<=x+120&&t.push({kind:"zone_plaque",id:a.id,sx:b.sx,sy:b.sy,radius:Math.max(28,42*u)})}const l=o.isVisitingNeighbor?[]:o.ensureNeighborSocial().homeLanternMarks;for(const a of o.state.buildings){const h=Ge(a.itemId);if(!h)continue;const{bw:_,bh:b}=o.getBuildingFootprint(h,a.rotation),{rx0:V,ry0:O,rbw:q,rbh:z}=Pe(a.gx,a.gy,_,b,w),M=o.grid[a.gy]?.[a.gx]?.elevation??0,ie=(V-O+(q-z)*.5)*(_e*.5),U=(V+q+O+z)*(Le*.5)-M*Ce,F=e*.5+(ie-s.x)*u,Y=x*.5+(U-s.y)*u;if(F<-220||F>e+220||Y<-60||Y>x+280)continue;const j=(_+b)*(_e*.5)*u,Z=h.spriteScale??(h.width!==h.height?1:1.05),J=d<a.constructEndsAt?"prop_construction_site":h.isFarmlandPlot?"crop_plot_tilled":et(h.id,h.spriteKey),Q=J?this.sprites.get(J):void 0,X=Math.max(28,j*Z),E=Q?X*(Q.height/Q.width):Math.max(26,(h.connectableGroup?.55:1.05)*j),ge=Y-E*.45,ae=(a.rotation+w)%4,be=h.connectableGroup?!1:h.width!==h.height?(ae&1)===1:ae===1||ae===2;if(t.push({kind:"building",id:a.uid,sx:F,sy:ge,radius:Math.max(26,Math.max(X,E)*.52),spriteKey:J,flipX:be,boxLeft:F-X*.5,boxTop:Y-E+4*u,boxW:X,boxH:E}),o.isVisitingNeighbor){o.getVisitedBuildingHelpStatus(a).canHelp&&t.push({kind:"neighbor_help",id:a.uid,sx:F,sy:Y-E*.85,radius:Math.max(22,28*u)});continue}const de=Tt(a,h,d,n,v===a.uid);de?.interactiveHotspotKind&&t.push({kind:de.interactiveHotspotKind,id:a.uid,sx:F,sy:Y-E*.82,radius:Math.max(22,28*u)}),((a.readyBubbles??0)>0||(a.readyFarmGoods?.length??0)>0)&&t.push({kind:"bubble",id:a.uid,sx:F,sy:Y-E*.88,radius:Math.max(24,30*u)});const Re=l.find(m=>m.buildingUid===a.uid);Re&&t.push({kind:"home_lantern",id:Re.id,sx:F,sy:Y-E*.92,radius:Math.max(22,28*u)})}for(const a of o.villagers){const h=Ee(a.gx,a.gy,w),_=Math.max(0,Math.min(71,Math.floor(a.gx))),b=Math.max(0,Math.min(71,Math.floor(a.gy))),V=o.grid[b]?.[_]?.elevation??0,O=e*.5+(h.wx-s.x)*u,q=x*.5+(h.wy-V*Ce-24-s.y)*u;O>=-60&&O<=e+60&&q>=-60&&q<=x+60&&t.push({kind:"villager",id:a.id,sx:O,sy:q,radius:Math.max(20,26*u)})}for(const a of o.escapedCreatures){const h=Ee(a.gx,a.gy,w),_=e*.5+(h.wx-s.x)*u,b=x*.5+(h.wy-18-s.y)*u;t.push({kind:"escaped",id:a.id,sx:_,sy:b,radius:Math.max(22,28*u)})}}renderFrame(o,s,e,x,d,v){if(this.gpuDevice.contextLost)return;const t=this.gl,w=Ut[e.qualityTier],u=Math.max(1,this.canvas.parentElement?.clientWidth||window.innerWidth),n=Math.max(1,this.canvas.parentElement?.clientHeight||window.innerHeight),r=Math.min(w.dprCap,window.devicePixelRatio||1),l=Math.max(2,Math.round(u*r)),a=Math.max(2,Math.round(n*r));if((this.canvas.width!==l||this.canvas.height!==a)&&(this.canvas.width=l,this.canvas.height=a),this.lastFrameTs>0){const m=d-this.lastFrameTs;m>0&&m<250&&(this.fpsAccumMs+=m,this.fpsFrames+=1,this.fpsAccumMs>=350&&(this.currentFps=Math.round(this.fpsFrames*1e3/this.fpsAccumMs),this.fpsAccumMs=0,this.fpsFrames=0))}this.lastFrameTs=d;const h=performance.now();this.snapshot.collect(o,s,u,n,d,this,w.maxGrassInstances,w.maxPointLights,x,e.lumosWandEnabled,v),v?.hotspotsOut&&this.syncInteractiveHotspots(o,s,u,n,d,v.selectedBuildingUid??null,v.hotspotsOut);const _=performance.now()-h;this.uvTableDirty&&(t.bindTexture(t.TEXTURE_2D,this.uvTableTex),t.texSubImage2D(t.TEXTURE_2D,0,0,0,Ve,2,t.RGBA,t.FLOAT,this.uvTableData),this.uvTableDirty=!1),this.uploadedStaticGen!==this.snapshot.staticDirtyGeneration&&(this.uploadedStaticGen=this.snapshot.staticDirtyGeneration,t.bindBuffer(t.ARRAY_BUFFER,this.terrainInstanceBuf),t.bufferData(t.ARRAY_BUFFER,this.snapshot.terrainData.subarray(0,this.snapshot.terrainCount*Ue),t.STATIC_DRAW),t.bindBuffer(t.ARRAY_BUFFER,this.waterInstanceBuf),t.bufferData(t.ARRAY_BUFFER,this.snapshot.waterData.subarray(0,this.snapshot.waterCount*Ne),t.STATIC_DRAW),t.bindBuffer(t.ARRAY_BUFFER,this.grassInstanceBuf),t.bufferData(t.ARRAY_BUFFER,this.snapshot.grassData.subarray(0,this.snapshot.grassCount*Fe),t.STATIC_DRAW)),this.snapshot.sceneCount>0&&(t.bindBuffer(t.ARRAY_BUFFER,this.sceneInstanceBuf),t.bufferSubData(t.ARRAY_BUFFER,0,this.snapshot.sceneData.subarray(0,this.snapshot.sceneCount*Se))),this.snapshot.particleCount>0&&(t.bindBuffer(t.ARRAY_BUFFER,this.particleInstanceBuf),t.bufferSubData(t.ARRAY_BUFFER,0,this.snapshot.particleData.subarray(0,this.snapshot.particleCount*Ye)));const b=this.snapshot.lightCount;for(let m=0;m<b;m++){const i=m*tt,f=m*4;this.lightPosUniform[f]=this.snapshot.lightData[i],this.lightPosUniform[f+1]=this.snapshot.lightData[i+1],this.lightPosUniform[f+2]=this.snapshot.lightData[i+2],this.lightPosUniform[f+3]=this.snapshot.lightData[i+3],this.lightColUniform[f]=this.snapshot.lightData[i+4],this.lightColUniform[f+1]=this.snapshot.lightData[i+5],this.lightColUniform[f+2]=this.snapshot.lightData[i+6],this.lightColUniform[f+3]=this.snapshot.lightData[i+7]}const V=this.snapshot.period,O=this.snapshot.weatherKind,q=O==="rain"||O==="storm",z=O==="snow",M=z||this.snapshot.seasonId==="winter"&&!q?1:0,ie=V==="dawn"?0:V==="dusk"?2:V==="night"?3:1,U=q?1:z||this.snapshot.seasonId==="winter"?2:0;let F=[1.03,1.03,1.01],Y=[-.42,-.52,.74],j=[.22,.2,.14],Z=[.38,.76,.98],J=[.06,.12,.18],Q=.2;V==="dawn"?(F=[1,.97,.92],Y=[.68,-.38,.62],j=[.3,.24,.15],Z=[.46,.76,.95],J=[.06,.11,.16],Q=.3):V==="dusk"?(F=[.92,.85,.89],Y=[-.74,-.35,.57],j=[.4,.26,.16],Z=[.84,.58,.52],J=[.07,.06,.16],Q=.68):V==="night"&&(F=M>.5?[.8,.87,.99]:[.74,.81,.95],Y=[.35,-.55,.75],j=[.16,.22,.36],Z=[.28,.48,.74],J=[.04,.06,.14],Q=.82),q&&(F=[F[0]*.92,F[1]*.94,F[2]*.97],j=[j[0]*.65,j[1]*.68,j[2]*.75],Q=Math.max(Q,.55));const X=d*.001;let E=0;const ge=w.bloomEnabled&&e.bloomIntensity>.02;if(ge?(this.ensureRenderTargets(l,a),t.bindFramebuffer(t.FRAMEBUFFER,this.sceneFbo)):t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,l,a),t.disable(t.BLEND),t.useProgram(this.skyProg),t.uniform1f(t.getUniformLocation(this.skyProg,"uTime"),X),t.uniform1i(t.getUniformLocation(this.skyProg,"uPeriod"),ie),t.uniform1i(t.getUniformLocation(this.skyProg,"uWeather"),U),t.bindVertexArray(this.emptyVao),t.drawArrays(t.TRIANGLES,0,3),E++,this.snapshot.terrainCount>0&&(t.useProgram(this.terrainProg),t.uniform3f(t.getUniformLocation(this.terrainProg,"uCamera"),s.x,s.y,s.zoom),t.uniform2f(t.getUniformLocation(this.terrainProg,"uViewport"),u,n),t.uniform1f(t.getUniformLocation(this.terrainProg,"uTime"),X),t.uniform1f(t.getUniformLocation(this.terrainProg,"uWinterSnow"),M),t.uniform3fv(t.getUniformLocation(this.terrainProg,"uAmbientTint"),F),t.uniform1i(t.getUniformLocation(this.terrainProg,"uLightCount"),b),b>0&&(t.uniform4fv(t.getUniformLocation(this.terrainProg,"uLightPosRad"),this.lightPosUniform),t.uniform4fv(t.getUniformLocation(this.terrainProg,"uLightColInt"),this.lightColUniform)),t.bindVertexArray(this.terrainVao),t.drawArraysInstanced(t.TRIANGLE_STRIP,0,4,this.snapshot.terrainCount),E++),t.enable(t.BLEND),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA),this.snapshot.waterCount>0&&(t.useProgram(this.waterProg),t.uniform3f(t.getUniformLocation(this.waterProg,"uCamera"),s.x,s.y,s.zoom),t.uniform2f(t.getUniformLocation(this.waterProg,"uViewport"),u,n),t.uniform1f(t.getUniformLocation(this.waterProg,"uTime"),X),t.uniform1f(t.getUniformLocation(this.waterProg,"uWinterSnow"),M),t.uniform3fv(t.getUniformLocation(this.waterProg,"uAmbientTint"),F),t.uniform3fv(t.getUniformLocation(this.waterProg,"uSkyReflectColor"),Z),t.uniform3fv(t.getUniformLocation(this.waterProg,"uSunColor"),j),t.uniform1i(t.getUniformLocation(this.waterProg,"uInteractorCount"),this.snapshot.interactorCount),this.snapshot.interactorCount>0&&t.uniform4fv(t.getUniformLocation(this.waterProg,"uInteractors"),this.snapshot.interactorData),t.uniform1i(t.getUniformLocation(this.waterProg,"uLightCount"),b),b>0&&(t.uniform4fv(t.getUniformLocation(this.waterProg,"uLightPosRad"),this.lightPosUniform),t.uniform4fv(t.getUniformLocation(this.waterProg,"uLightColInt"),this.lightColUniform)),t.bindVertexArray(this.waterVao),t.drawArraysInstanced(t.TRIANGLE_STRIP,0,4,this.snapshot.waterCount),E++),this.snapshot.grassCount>0&&(t.useProgram(this.grassProg),t.uniform3f(t.getUniformLocation(this.grassProg,"uCamera"),s.x,s.y,s.zoom),t.uniform2f(t.getUniformLocation(this.grassProg,"uViewport"),u,n),t.uniform1f(t.getUniformLocation(this.grassProg,"uTime"),X),t.uniform1f(t.getUniformLocation(this.grassProg,"uWindStrength"),e.windStrength),t.uniform1f(t.getUniformLocation(this.grassProg,"uWinterSnow"),M),t.uniform3fv(t.getUniformLocation(this.grassProg,"uAmbientTint"),F),t.uniform3fv(t.getUniformLocation(this.grassProg,"uSunColor"),j),t.uniform1i(t.getUniformLocation(this.grassProg,"uInteractorCount"),this.snapshot.interactorCount),this.snapshot.interactorCount>0&&t.uniform4fv(t.getUniformLocation(this.grassProg,"uInteractors"),this.snapshot.interactorData),t.uniform1i(t.getUniformLocation(this.grassProg,"uLightCount"),b),b>0&&(t.uniform4fv(t.getUniformLocation(this.grassProg,"uLightPosRad"),this.lightPosUniform),t.uniform4fv(t.getUniformLocation(this.grassProg,"uLightColInt"),this.lightColUniform)),t.bindVertexArray(this.grassVao),t.drawArraysInstanced(t.TRIANGLE_STRIP,0,4,this.snapshot.grassCount),E++),this.snapshot.sceneCount>0){t.blendFunc(t.ONE,t.ONE_MINUS_SRC_ALPHA),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D_ARRAY,this.albedoArrayTex),t.activeTexture(t.TEXTURE1),t.bindTexture(t.TEXTURE_2D_ARRAY,this.normalEmissiveArrayTex),t.activeTexture(t.TEXTURE2),t.bindTexture(t.TEXTURE_2D,this.uvTableTex),t.bindVertexArray(this.sceneVao),t.useProgram(this.shadowProg),t.uniform3f(t.getUniformLocation(this.shadowProg,"uCamera"),s.x,s.y,s.zoom),t.uniform2f(t.getUniformLocation(this.shadowProg,"uViewport"),u,n),t.uniform1i(t.getUniformLocation(this.shadowProg,"uAlbedo"),0),t.uniform1i(t.getUniformLocation(this.shadowProg,"uUvTable"),2),t.uniform2f(t.getUniformLocation(this.shadowProg,"uShadowSkew"),this.snapshot.sunShadowDx,this.snapshot.sunShadowDy),t.uniform1f(t.getUniformLocation(this.shadowProg,"uTime"),X),t.uniform1f(t.getUniformLocation(this.shadowProg,"uWindStrength"),e.windStrength),t.uniform3fv(t.getUniformLocation(this.shadowProg,"uShadowTint"),J),this.drawInstancedSceneRange(0,this.snapshot.sceneCount),E++;const m=()=>{t.useProgram(this.sceneProg),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D_ARRAY,this.albedoArrayTex),t.activeTexture(t.TEXTURE1),t.bindTexture(t.TEXTURE_2D_ARRAY,this.normalEmissiveArrayTex),t.activeTexture(t.TEXTURE2),t.bindTexture(t.TEXTURE_2D,this.uvTableTex),t.uniform3f(t.getUniformLocation(this.sceneProg,"uCamera"),s.x,s.y,s.zoom),t.uniform2f(t.getUniformLocation(this.sceneProg,"uViewport"),u,n),t.uniform1i(t.getUniformLocation(this.sceneProg,"uAlbedo"),0),t.uniform1i(t.getUniformLocation(this.sceneProg,"uNormalEmissive"),1),t.uniform1i(t.getUniformLocation(this.sceneProg,"uUvTable"),2),t.uniform1f(t.getUniformLocation(this.sceneProg,"uTime"),X),t.uniform1f(t.getUniformLocation(this.sceneProg,"uWindStrength"),e.windStrength),t.uniform3fv(t.getUniformLocation(this.sceneProg,"uAmbientTint"),F),t.uniform3fv(t.getUniformLocation(this.sceneProg,"uSunDir"),Y),t.uniform3fv(t.getUniformLocation(this.sceneProg,"uSunColor"),j),t.uniform1f(t.getUniformLocation(this.sceneProg,"uNormalStrength"),e.normalStrength),t.uniform1f(t.getUniformLocation(this.sceneProg,"uWindowGlowStrength"),Q),t.uniform1f(t.getUniformLocation(this.sceneProg,"uWinterSnow"),M),t.uniform1i(t.getUniformLocation(this.sceneProg,"uLightCount"),b),b>0&&(t.uniform4fv(t.getUniformLocation(this.sceneProg,"uLightPosRad"),this.lightPosUniform),t.uniform4fv(t.getUniformLocation(this.sceneProg,"uLightColInt"),this.lightColUniform)),t.bindVertexArray(this.sceneVao)},i=It(this.snapshot.sceneCount,this.snapshot.skeletalSortedIndices,this.snapshot.skeletalCount,this.rangeSlices);m();let f=!0;for(let B=0;B<i;B++){const D=this.rangeSlices[B];if(D.kind==="instanced_range")f||(m(),f=!0),this.drawInstancedSceneRange(D.firstInstance,D.instanceCount),E++;else{const S=this.snapshot.skeletalPoses[D.skeletalSlotIndex];S&&(this.spineAdapter.renderArticulatedSlot(S,s.x,s.y,s.zoom,u,n,X,F,this.albedoArrayTex,this.uvTableTex),f=!1,E++)}}}if(this.snapshot.particleCount>0){const m=M>.5||z;m?t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA):t.blendFunc(t.SRC_ALPHA,t.ONE),t.useProgram(this.particleProg),t.uniform3f(t.getUniformLocation(this.particleProg,"uCamera"),s.x,s.y,s.zoom),t.uniform2f(t.getUniformLocation(this.particleProg,"uViewport"),u,n),t.uniform1f(t.getUniformLocation(this.particleProg,"uIsSnow"),m?1:0),t.bindVertexArray(this.particleVao),t.drawArraysInstanced(t.TRIANGLE_STRIP,0,4,this.snapshot.particleCount),E++}if(ge&&this.sceneColorTex&&this.bloomFboA&&this.bloomFboB&&this.bloomTexA&&this.bloomTexB){t.disable(t.BLEND);const m=Math.max(2,l>>1),i=Math.max(2,a>>1);t.bindVertexArray(this.emptyVao),t.bindFramebuffer(t.FRAMEBUFFER,this.bloomFboA),t.viewport(0,0,m,i),t.useProgram(this.bloomExtractProg),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.sceneColorTex),t.uniform1i(t.getUniformLocation(this.bloomExtractProg,"uScene"),0),t.drawArrays(t.TRIANGLES,0,3),E++,t.useProgram(this.bloomBlurProg),t.uniform1i(t.getUniformLocation(this.bloomBlurProg,"uTex"),0),t.bindFramebuffer(t.FRAMEBUFFER,this.bloomFboB),t.bindTexture(t.TEXTURE_2D,this.bloomTexA),t.uniform2f(t.getUniformLocation(this.bloomBlurProg,"uOffset"),1.5/m,1.5/i),t.drawArrays(t.TRIANGLES,0,3),E++,t.bindFramebuffer(t.FRAMEBUFFER,this.bloomFboA),t.bindTexture(t.TEXTURE_2D,this.bloomTexB),t.uniform2f(t.getUniformLocation(this.bloomBlurProg,"uOffset"),3.2/m,3.2/i),t.drawArrays(t.TRIANGLES,0,3),E++,t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,l,a),t.useProgram(this.compositeProg),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.sceneColorTex),t.uniform1i(t.getUniformLocation(this.compositeProg,"uScene"),0),t.activeTexture(t.TEXTURE1),t.bindTexture(t.TEXTURE_2D,this.bloomTexA),t.uniform1i(t.getUniformLocation(this.compositeProg,"uBloom"),1),t.uniform1f(t.getUniformLocation(this.compositeProg,"uBloomIntensity"),e.bloomIntensity),t.drawArrays(t.TRIANGLES,0,3),E++}t.bindVertexArray(null);const ae=this.shelf.layer+1,be=ae*2*(le*le*4/(1024*1024)),de=this.useHalfFloatFbo?8:4,Re=ge?l*a*1.5*de/(1024*1024):0;this.stats={backend:"webgl2",fps:this.currentFps,cpuCollectMs:Number(_.toFixed(2)),drawCalls:E,terrainTiles:this.snapshot.terrainCount,waterTiles:this.snapshot.waterCount,grassInstances:this.snapshot.grassCount,sortedSprites:this.snapshot.sceneCount,particleInstances:this.snapshot.particleCount,activeLights:b,atlasLayers:ae,atlasSpritesPacked:this.nextSpriteId,vramEstimateMb:Number((be+Re).toFixed(1))}}destroy(){const o=this.gl;this.spineAdapter.destroy(),o.deleteTexture(this.albedoArrayTex),o.deleteTexture(this.normalEmissiveArrayTex),o.deleteTexture(this.uvTableTex),this.sceneColorTex&&o.deleteTexture(this.sceneColorTex),this.bloomTexA&&o.deleteTexture(this.bloomTexA),this.bloomTexB&&o.deleteTexture(this.bloomTexB),o.deleteFramebuffer(this.bakeFbo),this.sceneFbo&&o.deleteFramebuffer(this.sceneFbo),this.bloomFboA&&o.deleteFramebuffer(this.bloomFboA),this.bloomFboB&&o.deleteFramebuffer(this.bloomFboB),this.gpuDevice.destroy()}}export{wo as WebGL2WorldRenderer,Kt as canSpriteReceiveWinterSnowCap,Qt as shouldCleanseSpriteBakedHalo};
