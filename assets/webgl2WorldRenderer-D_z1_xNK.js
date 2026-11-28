var Mt=Object.defineProperty;var It=(g,e,a)=>e in g?Mt(g,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):g[e]=a;var r=(g,e,a)=>It(g,typeof e!="symbol"?e+"":e,a);import{G as me,g as Xe,F as je,P as pt,Z as Ft}from"./game-data-CIg-hYYZ.js";import{M as Je,a as Bt,e as mt,b as Ut,d as Wt,r as kt,f as it,g as Vt,h as Ht,W as Nt,j as Gt,k as Yt,i as Xt,l as Ot,m as zt,s as Kt}from"./engine-C22MZnfG.js";import{b as De,w as Me,E as Ce,h as qt,s as at,f as et,a as Pe,T as Ie,g as Zt}from"./sim-foundation-BXeSnJtU.js";import"./sim-world-CRiPi6jx.js";import"./sim-data-CeinEo2G.js";import"./hpvn-platform-CEnEuXKU.js";const Qt={low:{tier:"low",maxGrassInstances:800,maxPointLights:4,bloomEnabled:!1,dprCap:1.35},medium:{tier:"medium",maxGrassInstances:2500,maxPointLights:8,bloomEnabled:!0,dprCap:1.75},high:{tier:"high",maxGrassInstances:6e3,maxPointLights:16,bloomEnabled:!0,dprCap:2}};class $t{constructor(e){r(this,"preference","webgl");r(this,"canvas");r(this,"gl");r(this,"supportsHalfFloatHdr");r(this,"contextLost",!1);r(this,"handleLost");r(this,"handleRestored");this.canvas=e.canvas;const a=e.canvas.getContext("webgl2",{alpha:!1,antialias:!1,depth:!1,stencil:!1,powerPreference:"high-performance",preserveDrawingBuffer:e.preserveDrawingBuffer??!1});if(!a)throw new Error("[PixiGpuDevice] Thiết bị không hỗ trợ WebGL2.");this.gl=a;const i=a.getExtension("EXT_color_buffer_float"),w=a.getExtension("OES_texture_float_linear");this.supportsHalfFloatHdr=!!(i&&w),this.handleLost=c=>{c.preventDefault(),this.contextLost=!0,e.onContextLost?.()},this.handleRestored=()=>{this.contextLost=!1,e.onContextRestored?.()},this.canvas.addEventListener("webglcontextlost",this.handleLost,!1),this.canvas.addEventListener("webglcontextrestored",this.handleRestored,!1)}resetSharedGlState(){this.gl.bindVertexArray(null)}destroy(){this.canvas.removeEventListener("webglcontextlost",this.handleLost,!1),this.canvas.removeEventListener("webglcontextrestored",this.handleRestored,!1)}}function jt(g,e,a,i){let w=0;const c=(t,S,A,p)=>{if(w<i.length){const l=i[w];l.kind=t,l.firstInstance=S,l.instanceCount=A,l.skeletalSlotIndex=p}else i.push({kind:t,firstInstance:S,instanceCount:A,skeletalSlotIndex:p});w++};if(g<=0)return 0;if(a<=0)return c("instanced_range",0,g,-1),w;let b=0;for(let t=0;t<a;t++){const S=e[t];S<b||S>=g||(S>b&&c("instanced_range",b,S-b,-1),c("skeletal_slot",S,1,t),b=S+1)}return b<g&&c("instanced_range",b,g-b,-1),w}const Jt=`#version 300 es
precision highp float;
layout(location = 0) in vec2 aLocal; // x in [-0.5..0.5], y in [0..1] (0 = feet, 1 = crown)

uniform vec3 uCamera;
uniform vec2 uViewport;
uniform vec4 uPoseRect;    // (wx, wy, signedDrawW, drawH)
uniform vec4 uBoneParams;  // (timeSec, walkPhase, isWalking, spriteId)
uniform vec4 uPoseExtra;   // (greetWave, tendingLean, phaseSeed, 0.0)

out vec2 vLocalUv;
out float vSpriteId;
out float vShade;

void main() {
  float h = aLocal.y; // 0 feet -> 1 head
  float t = uBoneParams.x;
  float phase = uBoneParams.y;
  float walking = uBoneParams.z;
  float greetWave = uPoseExtra.x;
  float tendingLean = uPoseExtra.y;
  float pSeed = uPoseExtra.z;

  // 5-Zone Anatomical 2.5D Rig (8x10 grid): L/R Alternating Feet, Hip Bob, Counter Arms, Torso Breath, Greet Wave & Tending Nod
  float idleMask = 1.0 - walking;
  float upperWeight = smoothstep(0.35, 0.72, h);
  float breath = sin(t * 2.4 + pSeed) * (0.4 + 0.75 * idleMask);
  float chestIdleWave = sin(t * 2.4 + pSeed) * 1.15 * idleMask * upperWeight;
  float hipBob = abs(sin(phase)) * 2.4 * walking * smoothstep(0.05, 0.35, h);
  float greetHop = abs(sin(t * 8.5)) * 4.5 * greetWave * smoothstep(0.05, 0.35, h);

  // Zone 1 & 2: Left vs Right foot alternating stride + vertical lift
  float legWeight = 1.0 - smoothstep(0.08, 0.30, h);
  float sideSign = clamp(aLocal.x * 6.0, -1.0, 1.0);
  float legSwing = sin(phase) * sideSign;
  float footLiftY = max(0.0, legSwing) * 3.2 * walking * legWeight;
  float footStrideX = legSwing * 2.6 * walking * legWeight;

  // Zone 3: Outer arms & cloak sleeves counter-swinging opposite legs + cheerful greet wave
  float armMask =
    smoothstep(0.24, 0.38, h) *
    (1.0 - smoothstep(0.64, 0.76, h)) *
    smoothstep(0.12, 0.28, abs(aLocal.x));
  float headArmMask = max(armMask, smoothstep(0.55, 0.90, h));
  float armSwingX = -sin(phase) * sideSign * 3.0 * walking * armMask;
  float waveOscX = sin(t * 11.0 + pSeed) * 4.2 * greetWave * headArmMask;
  float waveLiftY = max(0.0, sin(t * 11.0 + pSeed)) * 2.4 * greetWave * armMask;
  float tendNodX = sin(t * 3.2 + pSeed) * 1.8 * tendingLean * idleMask * upperWeight;

  // Zone 4 & 5: Torso breath stretch + head/hat follow-through tilt
  float verticalStretch = 1.0 + breath * 0.022 * smoothstep(0.20, 0.95, h);
  float headMask = smoothstep(0.66, 0.92, h);
  float headTiltX = (walking * sin(phase * 1.05 - 0.38) * 2.3 + breath * 0.7) * headMask;

  vec2 deformed = vec2(
    aLocal.x * uPoseRect.z + footStrideX + armSwingX + headTiltX + chestIdleWave + waveOscX + tendNodX,
    -aLocal.y * uPoseRect.w * verticalStretch - hipBob - footLiftY - greetHop - waveLiftY
  );

  vec2 wp = uPoseRect.xy + deformed;
  vec2 sp = uViewport * 0.5 + (wp - uCamera.xy) * uCamera.z;
  vec2 clip = vec2((sp.x / uViewport.x) * 2.0 - 1.0, 1.0 - (sp.y / uViewport.y) * 2.0);
  gl_Position = vec4(clip, 0.0, 1.0);

  vLocalUv = vec2(aLocal.x + 0.5, 1.0 - aLocal.y);
  vSpriteId = uBoneParams.w;
  float dirSign = uPoseRect.z < 0.0 ? -1.0 : 1.0;
  float sunRim = clamp(0.5 - aLocal.x * dirSign, 0.0, 1.0) * smoothstep(0.35, 0.95, h);
  vShade = 0.95 + 0.06 * h + 0.05 * sunRim;
}
`,eo=`#version 300 es
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
`,to=`#version 300 es
precision highp float;
layout(location = 0) in vec2 aWorldPos;
layout(location = 1) in vec2 aUv;
layout(location = 2) in vec2 aShadeEmissive;

uniform vec3 uCamera;
uniform vec2 uViewport;

out vec2 vUv;
out float vShade;
out float vEmissive;

void main() {
  vec2 sp = uViewport * 0.5 + (aWorldPos - uCamera.xy) * uCamera.z;
  vec2 clip = vec2((sp.x / uViewport.x) * 2.0 - 1.0, 1.0 - (sp.y / uViewport.y) * 2.0);
  gl_Position = vec4(clip, 0.0, 1.0);
  vUv = aUv;
  vShade = aShadeEmissive.x;
  vEmissive = aShadeEmissive.y;
}
`,oo=`#version 300 es
precision highp float;

in vec2 vUv;
in float vShade;
in float vEmissive;

uniform sampler2D uSpineAtlas;
uniform vec3 uAmbientTint;
uniform float uAlpha;

out vec4 fragColor;

void main() {
  vec4 texel = texture(uSpineAtlas, vUv);
  if (texel.a < 0.012) discard;
  vec3 tint = mix(uAmbientTint * vShade, vec3(1.08, 0.95, 0.74), clamp(vEmissive, 0.0, 1.0));
  fragColor = vec4(texel.rgb * tint * uAlpha, texel.a * uAlpha);
}
`;function gt(g,e,a){const i=g.createShader(g.VERTEX_SHADER);g.shaderSource(i,e),g.compileShader(i);const w=g.createShader(g.FRAGMENT_SHADER);g.shaderSource(w,a),g.compileShader(w);const c=g.createProgram();return g.attachShader(c,i),g.attachShader(c,w),g.linkProgram(c),g.deleteShader(i),g.deleteShader(w),c}class io{constructor(e){r(this,"gl");r(this,"prog");r(this,"vao");r(this,"vbo");r(this,"ibo");r(this,"indexCount",0);r(this,"uAlbedoLoc",null);r(this,"uUvTableLoc",null);r(this,"uCameraLoc",null);r(this,"uViewportLoc",null);r(this,"uPoseRectLoc",null);r(this,"uBoneParamsLoc",null);r(this,"uPoseExtraLoc",null);r(this,"uAmbientTintLoc",null);r(this,"uAlphaLoc",null);r(this,"spineProg");r(this,"spineVao");r(this,"spineVbo");r(this,"spineIbo");r(this,"uSpineAtlasLoc",null);r(this,"uSpineCameraLoc",null);r(this,"uSpineViewportLoc",null);r(this,"uSpineAmbientLoc",null);r(this,"uSpineAlphaLoc",null);r(this,"spineVertData",new Float32Array(Je*4*6));r(this,"evaluator",new Bt);r(this,"spineAtlasTex",null);r(this,"externalSpineLoaded",!1);this.gl=e,this.initGpuResources(),mt()}rebuildGpuResources(){this.spineAtlasTex=null,this.externalSpineLoaded=!1,this.initGpuResources()}initGpuResources(){const e=this.gl,a=gt(e,Jt,eo);this.prog=a,this.uAlbedoLoc=e.getUniformLocation(a,"uAlbedo"),this.uUvTableLoc=e.getUniformLocation(a,"uUvTable"),this.uCameraLoc=e.getUniformLocation(a,"uCamera"),this.uViewportLoc=e.getUniformLocation(a,"uViewport"),this.uPoseRectLoc=e.getUniformLocation(a,"uPoseRect"),this.uBoneParamsLoc=e.getUniformLocation(a,"uBoneParams"),this.uPoseExtraLoc=e.getUniformLocation(a,"uPoseExtra"),this.uAmbientTintLoc=e.getUniformLocation(a,"uAmbientTint"),this.uAlphaLoc=e.getUniformLocation(a,"uAlpha");const i=8,w=10,c=[],b=[];for(let h=0;h<=w;h++){const s=h/w;for(let n=0;n<=i;n++){const u=n/i-.5;c.push(u,s)}}const t=i+1;for(let h=0;h<w;h++)for(let s=0;s<i;s++){const n=h*t+s,u=n+1,d=n+t,f=d+1;b.push(n,u,d,u,f,d)}this.indexCount=b.length,this.vao=e.createVertexArray(),e.bindVertexArray(this.vao),this.vbo=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,this.vbo),e.bufferData(e.ARRAY_BUFFER,new Float32Array(c),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),this.ibo=e.createBuffer(),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,this.ibo),e.bufferData(e.ELEMENT_ARRAY_BUFFER,new Uint16Array(b),e.STATIC_DRAW),e.bindVertexArray(null);const S=gt(e,to,oo);this.spineProg=S,this.uSpineAtlasLoc=e.getUniformLocation(S,"uSpineAtlas"),this.uSpineCameraLoc=e.getUniformLocation(S,"uCamera"),this.uSpineViewportLoc=e.getUniformLocation(S,"uViewport"),this.uSpineAmbientLoc=e.getUniformLocation(S,"uAmbientTint"),this.uSpineAlphaLoc=e.getUniformLocation(S,"uAlpha");const A=new Uint16Array(Je*6);for(let h=0;h<Je;h++){const s=h*4,n=h*6;A[n]=s,A[n+1]=s+1,A[n+2]=s+2,A[n+3]=s,A[n+4]=s+2,A[n+5]=s+3}this.spineVao=e.createVertexArray(),e.bindVertexArray(this.spineVao),this.spineVbo=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,this.spineVbo),e.bufferData(e.ARRAY_BUFFER,this.spineVertData.byteLength,e.DYNAMIC_DRAW);const p=4,l=6*p;e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,l,0),e.enableVertexAttribArray(1),e.vertexAttribPointer(1,2,e.FLOAT,!1,l,2*p),e.enableVertexAttribArray(2),e.vertexAttribPointer(2,2,e.FLOAT,!1,l,4*p),this.spineIbo=e.createBuffer(),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,this.spineIbo),e.bufferData(e.ELEMENT_ARRAY_BUFFER,A,e.STATIC_DRAW),e.bindVertexArray(null)}ensureSpineAtlasTexture(e){if(this.spineAtlasTex)return this.spineAtlasTex;const a=this.gl,i=a.createTexture();return a.activeTexture(a.TEXTURE3),a.bindTexture(a.TEXTURE_2D,i),a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0),a.texImage2D(a.TEXTURE_2D,0,a.RGBA,a.RGBA,a.UNSIGNED_BYTE,e),a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE),a.activeTexture(a.TEXTURE0),this.spineAtlasTex=i,this.externalSpineLoaded=!0,i}renderArticulatedSlot(e,a,i,w,c,b,t,S,A,p){const l=this.gl,h=mt();if(h.ready&&h.skeleton&&h.atlasImage){const s=this.evaluator.evaluate(h.skeleton,e,t);if(s>0){const n=this.ensureSpineAtlasTexture(h.atlasImage),u=this.evaluator.quads,d=this.spineVertData;for(let f=0;f<s;f++){const m=f*Ut,y=f*24,q=u[m+8],F=u[m+9],R=u[m+10],V=u[m+11],z=u[m+12],I=u[m+13];d[y]=u[m],d[y+1]=u[m+1],d[y+2]=q,d[y+3]=F,d[y+4]=z,d[y+5]=I,d[y+6]=u[m+2],d[y+7]=u[m+3],d[y+8]=R,d[y+9]=F,d[y+10]=z,d[y+11]=I,d[y+12]=u[m+4],d[y+13]=u[m+5],d[y+14]=R,d[y+15]=V,d[y+16]=z,d[y+17]=I,d[y+18]=u[m+6],d[y+19]=u[m+7],d[y+20]=q,d[y+21]=V,d[y+22]=z,d[y+23]=I}l.useProgram(this.spineProg),l.activeTexture(l.TEXTURE3),l.bindTexture(l.TEXTURE_2D,n),l.uniform1i(this.uSpineAtlasLoc,3),l.uniform3f(this.uSpineCameraLoc,a,i,w),l.uniform2f(this.uSpineViewportLoc,c,b),l.uniform3fv(this.uSpineAmbientLoc,S),l.uniform1f(this.uSpineAlphaLoc,e.alpha),l.bindVertexArray(this.spineVao),l.bindBuffer(l.ARRAY_BUFFER,this.spineVbo),l.bufferSubData(l.ARRAY_BUFFER,0,d.subarray(0,s*24)),l.drawElements(l.TRIANGLES,s*6,l.UNSIGNED_SHORT,0),l.activeTexture(l.TEXTURE0);return}}l.useProgram(this.prog),l.activeTexture(l.TEXTURE0),l.bindTexture(l.TEXTURE_2D_ARRAY,A),l.activeTexture(l.TEXTURE2),l.bindTexture(l.TEXTURE_2D,p),l.uniform1i(this.uAlbedoLoc,0),l.uniform1i(this.uUvTableLoc,2),l.uniform3f(this.uCameraLoc,a,i,w),l.uniform2f(this.uViewportLoc,c,b),l.uniform4f(this.uPoseRectLoc,e.wx,e.wy,e.drawW,e.drawH),l.uniform4f(this.uBoneParamsLoc,t,e.walkPhase,e.isWalking?1:0,e.spriteId),l.uniform4f(this.uPoseExtraLoc,e.greetWave??0,e.tendingLean??0,e.phaseSeed??0,0),l.uniform3fv(this.uAmbientTintLoc,S),l.uniform1f(this.uAlphaLoc,e.alpha),l.bindVertexArray(this.vao),l.drawElements(l.TRIANGLES,this.indexCount,l.UNSIGNED_SHORT,0)}destroy(){const e=this.gl;e.deleteProgram(this.prog),e.deleteVertexArray(this.vao),e.deleteBuffer(this.vbo),e.deleteBuffer(this.ibo),e.deleteProgram(this.spineProg),e.deleteVertexArray(this.spineVao),e.deleteBuffer(this.spineVbo),e.deleteBuffer(this.spineIbo),this.spineAtlasTex&&(e.deleteTexture(this.spineAtlasTex),this.spineAtlasTex=null)}}const Be=8,Oe=6,Ue=6,Re=12,st=8,xt=4,We=6,ie=2048,bt=8e3,wt=16,yt=16,tt=200,ao=new Set(["yule_goblet_blue_brazier","yule_hermione_bluebell_jars","yule_stag_patronus_topiary","yule_ice_phoenix_fountain","yule_ice_stag_sculpture","yule_ice_swan_arch","yule_sword_frozen_pool","yule_mirror_of_erised","yule_castle_snowglobe","yule_crystal_banquet_table","yule_crystal_lotus_fountain_pot","yule_blue_spruce_starlight","yule_hogwarts_boathouse_ice"]),so=new Set(["yule_glowing_puffapod_bush","yule_birch_fairy_grove","yule_weasley_wheezes_facade","yule_poinsettia_cauldron","yule_sugarplum_tower"]),ro=new Set(["yule_slytherin_serpent_mascot","yule_four_house_hourglasses"]);function At(g){if(!g.startsWith("yule_"))return null;if(ao.has(g))return{family:"ice-patronus",rgb:[.28,.8,1],radius:175,intensity:1.38,emissiveBoost:1.28,activeInDaySnow:!0};if(so.has(g))return{family:"fairy-violet",rgb:[.94,.52,1],radius:170,intensity:1.25,emissiveBoost:1.18,activeInDaySnow:!1};if(ro.has(g))return{family:"slytherin-emerald",rgb:[.2,.94,.62],radius:155,intensity:1.16,emissiveBoost:1.12,activeInDaySnow:!1};const e=g==="yule_mini_hogwarts_castle"||g==="yule_great_hall_tree"||g==="yule_gringotts_dragon_dome"||g==="yule_hogwarts_snow_loco";return{family:"festive-gold",rgb:[1,.76,.3],radius:e?215:162,intensity:e?1.44:1.08,emissiveBoost:e?1.26:1.05,activeInDaySnow:!1,secondaryLakePool:g==="yule_mini_hogwarts_castle"}}const Ne=32,no=[[2,17,"env_bush_flowers",1.02,!1],[2,20,"env_mossy_rock",.96,!0],[2,24,"env_bush_flowers",1.05,!0],[2,28,"env_flower_patch",.98,!1],[5,19,"env_mossy_rock",.92,!1],[5,25,"env_mossy_rock",.95,!0],[7,17,"env_bush_flowers",.98,!1],[7,21,"env_flower_patch",1.04,!0],[7,27,"env_bush_flowers",1.02,!0],[8,19,"env_flower_patch",.96,!1],[11,21,"env_bush_flowers",.95,!1],[15,28,"env_flower_patch",1,!0],[22,21,"env_bush_flowers",1.02,!0],[22,26,"env_flower_patch",.98,!1],[24,17,"env_bush_flowers",1.04,!1],[28,18,"env_mossy_rock",.94,!0],[30,23,"env_bush_flowers",1.05,!1],[33,21,"env_flower_patch",1.02,!0]],lo=[[4,22,4.18,22.25],[4,34,4.55,34.25]];function fe(g,e){let a=g*374761393+e*668265263|0;return a=(a^a>>>13)*1274126177|0,((a^a>>>16)>>>0)/4294967295}function co(g,e){if(!g)return e;const a=g.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);return a?[Number(a[1])/255,Number(a[2])/255,Number(a[3])/255]:e}class ho{constructor(){r(this,"terrainData",new Float32Array(me*me*Be));r(this,"terrainCount",0);r(this,"waterData",new Float32Array(me*me*Oe));r(this,"waterCount",0);r(this,"grassData",new Float32Array(bt*Ue));r(this,"grassCount",0);r(this,"staticDirtyGeneration",0);r(this,"cachedStaticKey","");r(this,"buildingByUidScratch",new Map);r(this,"cachedReducedMotion",null);r(this,"reducedMotionBound",!1);r(this,"sceneData",new Float32Array(ie*Re));r(this,"sceneSpriteIds",new Uint16Array(ie));r(this,"sceneTintFlags",new Uint8Array(ie));r(this,"sceneCount",0);r(this,"skeletalSortedIndices",new Int32Array(Ne));r(this,"skeletalPoses",Array.from({length:Ne},()=>({villagerId:"molly",wx:0,wy:0,drawW:0,drawH:0,spriteId:0,walkPhase:0,isWalking:!1,facingLeft:!1,alpha:1,greetWave:0,tendingLean:0,phaseSeed:0})));r(this,"rawSkeletalPoses",Array.from({length:Ne},()=>({villagerId:"molly",wx:0,wy:0,drawW:0,drawH:0,spriteId:0,walkPhase:0,isWalking:!1,facingLeft:!1,alpha:1,greetWave:0,tendingLean:0,phaseSeed:0})));r(this,"skeletalCount",0);r(this,"chimneyEmitters",new Float32Array(36));r(this,"chimneyCount",0);r(this,"lightData",new Float32Array(wt*st));r(this,"lightCount",0);r(this,"interactorData",new Float32Array(yt*xt));r(this,"interactorCount",0);r(this,"particleData",new Float32Array(tt*We));r(this,"particleCount",0);r(this,"period","day");r(this,"weatherKind","sunny");r(this,"seasonId","spring");r(this,"sunShadowDx",9);r(this,"sunShadowDy",4.5);r(this,"lockedScenery",Wt());r(this,"unlockedZonesSet",new Set);r(this,"slots",Array.from({length:ie},()=>({rxMin:0,ryMin:0,rxMax:0,ryMax:0,depth:0,wx:0,wy:0,drawW:0,drawH:0,spriteId:0,swayAmp:0,rotRad:0,pivotY:0,alpha:1,tintFlag:0,skeletalPoseIdx:-1,shadowScale:1,emissiveBoost:0,phaseSeed:0,extraCount:0,extraStart:0})));r(this,"extras",Array.from({length:ie},()=>({wx:0,wy:0,drawW:0,drawH:0,spriteId:0,swayAmp:0,rotRad:0,pivotY:0,alpha:1,tintFlag:0,emissiveBoost:0,phaseSeed:0})));r(this,"topoHead",new Int32Array(ie));r(this,"topoTail",new Int32Array(ie));r(this,"topoInDeg",new Int32Array(ie));r(this,"topoReady",new Int32Array(ie));r(this,"topoEmitted",new Uint8Array(ie));r(this,"topoSweepOrder",new Int32Array(ie));r(this,"topoIsoL",new Float32Array(ie));r(this,"topoIsoR",new Float32Array(ie));r(this,"topoEdgeCap",8192);r(this,"topoNext",new Int32Array(8192));r(this,"topoTo",new Int32Array(8192));r(this,"lightCandidates",Array.from({length:128},()=>({distSq:0,wx:0,wy:0,z:0,radius:0,r:1,g:1,b:1,intensity:1})))}isReducedMotion(){if(this.cachedReducedMotion===null){const e=typeof window<"u"?window.matchMedia?.("(prefers-reduced-motion: reduce)"):void 0;this.cachedReducedMotion=!!e?.matches,e&&!this.reducedMotionBound&&(this.reducedMotionBound=!0,e.addEventListener?.("change",a=>{this.cachedReducedMotion=a.matches}))}return this.cachedReducedMotion}get terrainRevision(){return this.staticDirtyGeneration}ensureEdgeCap(e){if(e<=this.topoEdgeCap)return;this.topoEdgeCap=Math.max(this.topoEdgeCap*2,e);const a=new Int32Array(this.topoEdgeCap),i=new Int32Array(this.topoEdgeCap);a.set(this.topoNext),i.set(this.topoTo),this.topoNext=a,this.topoTo=i}collect(e,a,i,w,c,b,t,S,A,p,l){const h=a.viewRot??0;this.period=e.getRealTimePeriod();const s=e.getCurrentWeather(c);this.weatherKind=s.kind;const n=e.state?.settings?.yuleThemeMode??"auto",u=n==="off"?!1:typeof e.isWinterMainMapActive=="function"&&e.isWinterMainMapActive()||e.getActiveFestival()==="christmas"||typeof e.isYuleVisualThemeActive=="function"&&e.isYuleVisualThemeActive(),d=kt(e.state.level??1,u?"winter":"auto");this.seasonId=n==="off"&&d.id==="winter"?"autumn":d.id,this.period==="dawn"?(this.sunShadowDx=14,this.sunShadowDy=5.5):this.period==="dusk"?(this.sunShadowDx=-15,this.sunShadowDy=6):this.period==="night"?(this.sunShadowDx=8,this.sunShadowDy=4.5):(this.sunShadowDx=9.5,this.sunShadowDy=4.2),this.unlockedZonesSet.clear();for(const m of e.state.unlockedZones)this.unlockedZonesSet.add(m);const f=`${e.stateRevision}|${h}|${d.id}|${u?1:0}|${e.state.sandboxMode?1:0}|${t}`;this.cachedStaticKey!==f&&(this.cachedStaticKey=f,this.rebuildStaticValleyBuffers(e,h,u,d.id,t),this.staticDirtyGeneration++),this.collectInteractors(e,h,A),this.collectSortedSceneAndLights(e,a,i,w,c,b,S,A,p,l),this.collectAtmosphericParticles(a,c)}rebuildStaticValleyBuffers(e,a,i,w,c){let b=0,t=0;const S=[];for(let l=0;l<me;l++){const h=e.grid[l];for(let s=0;s<me;s++){const n=h[s],u=e.state.sandboxMode||this.unlockedZonesSet.has(n.zoneId),{rx0:d,ry0:f}=De(s,l,1,1,a),m=n.elevation??0,y=(d-f)*(Pe*.5),q=(d+f+1)*(Ie*.5)-m*Ce,F=fe(s,l);if(n.terrain==="water"){let O=0;const Z=[[s,l-1],[s+1,l],[s,l+1],[s-1,l]];for(const[le,ce]of Z)if(e.grid[ce]?.[le]?.terrain!=="water"){const{rx0:be,ry0:Ae}=De(le,ce,1,1,a),Ee=be-d,P=Ae-f;P===-1?O|=1:Ee===1?O|=2:P===1?O|=4:Ee===-1&&(O|=8)}const ee=O===0?1:.42,te=t*Oe;this.waterData[te]=y,this.waterData[te+1]=q,this.waterData[te+2]=O,this.waterData[te+3]=ee,this.waterData[te+4]=u?1:.55,this.waterData[te+5]=F,t++;continue}let R=.36,V=.63,z=.175,I=0;const ne=n.terrain;ne==="snow"?(R=.92,V=.95,z=.99,I=3):ne==="stone"?(R=.82+(F-.5)*.03,V=.74+(F-.5)*.03,z=.61+(F-.5)*.025,I=2):ne==="forest"?(R=.26,V=.55,z=.175,I=1):(I=0,w==="autumn"?(R=.42,V=.63,z=.165):(R=.365,V=.655,z=.168)),u||(R=R*.9+.06,V=V*.91+.06,z=z*.92+.07);let X=0;n.path==="cobble"?X=1:n.path==="wood_pier"?X=2:n.path!=="none"&&(X=3);let ae=0;if(X>0){let O=0;const Z=[[s,l-1],[s+1,l],[s,l+1],[s-1,l]];for(const[ee,te]of Z){const le=e.grid[te]?.[ee];if(!le||le.path==="none"){const{rx0:ce,ry0:be}=De(ee,te,1,1,a),Ae=ce-d,Ee=be-f;Ee===-1?O|=1:Ae===1?O|=2:Ee===1?O|=4:Ae===-1&&(O|=8)}}ae=X+O*4}const j=b*Be;this.terrainData[j]=y,this.terrainData[j+1]=q,this.terrainData[j+2]=R,this.terrainData[j+3]=V,this.terrainData[j+4]=z,this.terrainData[j+5]=ae,this.terrainData[j+6]=m+(u?0:10),this.terrainData[j+7]=I,b++,u&&(n.terrain==="grass"||n.terrain==="forest")&&n.path==="none"&&!n.buildingUid&&S.push([y,q,F])}}this.terrainCount=b,this.waterCount=t;const A=Math.min(bt,Math.max(0,c));let p=0;if(S.length>0&&A>0){const l=Math.max(2,Math.min(5,Math.ceil(A*1.65/S.length)));for(let h=0;h<S.length&&p<A;h++){const[s,n,u]=S[h],d=n*1.9,f=Math.sin(s*.017+d*.015)+Math.cos(s*.026-d*.021)+.55*Math.sin(s*.051+d*.043);if(f<-.05){if(fe(h*19,311)>.9&&p<A){const V=(fe(h*7,41)-.5)*(Pe*.45),z=(fe(h*11,83)-1)*(Ie*.45),I=p*Ue;this.grassData[I]=s+V,this.grassData[I+1]=n+z,this.grassData[I+2]=6.5+u*2.5,this.grassData[I+3]=u,this.grassData[I+4]=u*6.28318,this.grassData[I+5]=0,p++}continue}const m=Math.min(1,(f+.05)/1.85),y=Math.max(1,Math.round(1+m*(l-1))),q=.25+fe(h*5,67)*.5,F=.25+fe(h*9,131)*.5,R=f>.58&&fe(h*17,257)>.42;for(let V=0;V<y&&p<A;V++){const z=fe(h*13+V*7,91),I=fe(h*29+V*11,173),ne=Math.max(.08,Math.min(.92,q+(z-.5)*.58)),X=Math.max(.08,Math.min(.92,F+(I-.5)*.58)),ae=(ne-X)*(Pe*.42),j=(ne+X-1)*(Ie*.42),O=R&&fe(h+V*31,409)>.56?1:0,Z=p*Ue;this.grassData[Z]=s+ae,this.grassData[Z+1]=n+j,this.grassData[Z+2]=(O>.5?8.2:7.2)+fe(h*3+V,53)*4.4,this.grassData[Z+3]=fe(h*23+V*17,509),this.grassData[Z+4]=(z*6.28318+I*3.14159)%6.28318,this.grassData[Z+5]=O,p++}}}this.grassCount=p}collectInteractors(e,a,i){let w=0;i.active&&(this.interactorData[0]=i.wx,this.interactorData[1]=i.wy,this.interactorData[2]=66,this.interactorData[3]=1.35,w=1);for(let c=0;c<e.villagers.length&&w<yt;c++){const b=e.villagers[c],t=Math.max(0,Math.min(me-1,Math.floor(b.gx))),S=Math.max(0,Math.min(me-1,Math.floor(b.gy))),A=e.grid[S]?.[t]?.elevation??0,p=Me(b.gx,b.gy,a),l=w*xt;this.interactorData[l]=p.wx,this.interactorData[l+1]=p.wy-A*Ce,this.interactorData[l+2]=34,this.interactorData[l+3]=.95,w++}this.interactorCount=w}collectSortedSceneAndLights(e,a,i,w,c,b,t,S,A,p){const l=a.viewRot??0,h=!!e.state.settings.cutawayMode,s=this.isReducedMotion(),n=1/Math.max(.15,a.zoom),u=(i*.5+380)*n,d=(w*.5+420)*n,f=a.x-u,m=a.x+u,y=a.y-d,q=a.y+d;let F=0,R=0,V=0,z=0;this.chimneyCount=0;const I=!!(e.state.supply.activeBrew&&e.state.supply.activeBrew.endsAt>c),ne=p?.bulldozerActive&&p.hoverTile?e.grid[p.hoverTile.gy]?.[p.hoverTile.gx]?.buildingUid??null:null,X=qt(a),ae=Me(X.fgx,X.fgy,l),j=(P,o,x,M,k,D,B,U)=>{if(z>=this.lightCandidates.length)return;const N=P-ae.wx,H=o-ae.wy,C=this.lightCandidates[z++];C.distSq=N*N+H*H,C.wx=P,C.wy=o,C.z=x,C.radius=M,C.r=k,C.g=D,C.b=B,C.intensity=U},O=this.period==="night"||this.period==="dusk",Z=b.resolve("hogsmeade_stone_bridge");if(Z)for(const[P,o,x,M]of lo){const k=e.grid[o]?.[P];if(!k||k.buildingUid||k.terrain!=="water"||!e.state.sandboxMode&&!this.unlockedZonesSet.has(k.zoneId))continue;const D=Me(x,M,l),B=D.wy-k.elevation*Ce+12;if(D.wx<f||D.wx>m||B<y||B>q)continue;if(F>=ie)break;const{rx0:U,ry0:N,rbw:H,rbh:C}=De(P-1,o,3,1,l),G=148,Y=G*(Z.height/Z.width),W=this.slots[F++];W.rxMin=U+.05,W.ryMin=N+.05,W.rxMax=U+H-.05,W.ryMax=N+C-.05,W.depth=U+H+N+C-.12,W.wx=D.wx,W.wy=B,W.drawW=G,W.drawH=Y,W.spriteId=Z.id,W.swayAmp=0,W.rotRad=0,W.pivotY=0,W.alpha=1,W.tintFlag=0,W.skeletalPoseIdx=-1,W.shadowScale=.85,W.emissiveBoost=.35,W.phaseSeed=P*.7+o,W.extraCount=0,W.extraStart=0,O&&j(D.wx,B-14,30,155,1,.76,.3,1.25)}const ee=this.buildingByUidScratch;ee.clear();for(let P=0;P<e.state.buildings.length;P++){const o=e.state.buildings[P];ee.set(o.uid,o)}let te=null;if(p?.hoverTile&&!p.bulldozerActive){const P=p.movingBuildingUid?ee.get(p.movingBuildingUid):void 0,o=p.selectedCatalogItem??(P?Xe(P.itemId):void 0);if(o?.connectableGroup){const x=p.rotation??0;if(e.canPlaceItem(o,p.hoverTile.gx,p.hoverTile.gy,x,p.movingBuildingUid??void 0).ok){const{bw:M,bh:k}=e.getBuildingFootprint(o,x);te={gx:p.hoverTile.gx,gy:p.hoverTile.gy,bw:M,bh:k,elev:e.grid[p.hoverTile.gy]?.[p.hoverTile.gx]?.elevation??0,group:o.connectableGroup}}}}const le=(P,o,x,M,k,D)=>{const{rx0:B,ry0:U}=De(P,o,x,M,l),N=(C,G)=>{const{gx:Y,gy:W}=Yt(C,G,l);if(Y<0||W<0||Y>=me||W>=me)return!1;if(te&&te.group===D&&te.elev===k&&Y>=te.gx&&Y<te.gx+te.bw&&W>=te.gy&&W<te.gy+te.bh)return!0;const E=e.grid[W]?.[Y];if(!E||!E.buildingUid||E.buildingUid===p?.movingBuildingUid||(E.elevation??0)!==k)return!1;const K=ee.get(E.buildingUid);return!K||c<K.constructEndsAt?!1:Xe(K.itemId)?.connectableGroup===D};let H=0;return N(B-1,U)&&(H|=1),N(B-1,U+1)&&(H|=2),N(B,U-1)&&(H|=4),N(B+1,U-1)&&(H|=8),N(B+2,U)&&(H|=16),N(B+2,U+1)&&(H|=32),N(B,U+2)&&(H|=64),N(B+1,U+2)&&(H|=128),N(B-1,U-1)&&(H|=256),N(B+2,U-1)&&(H|=512),N(B+2,U+2)&&(H|=1024),N(B-1,U+2)&&(H|=2048),H};for(let P=0;P<e.state.buildings.length&&F<ie;P++){const o=e.state.buildings[P],x=Xe(o.itemId);if(!x)continue;const{bw:M,bh:k}=e.getBuildingFootprint(x,o.rotation),{rx0:D,ry0:B,rbw:U,rbh:N}=De(o.gx,o.gy,M,k,l),H=e.grid[o.gy]?.[o.gx]?.elevation??0,C=(D-B+(U-N)*.5)*(Pe*.5),G=(D+U+B+N)*(Ie*.5)-H*Ce;if(C<f||C>m||G<y||G>q)continue;const Y=c<o.constructEndsAt;let W=Y?"prop_construction_site":it(x.id,x.spriteKey),E=0;if(!Y&&x.isFarmlandPlot)if(!o.cropId)W="crop_plot_tilled";else{const T=o.cropPlantedAt??c-1e4,v=o.cropReadyAt??c,_=Math.max(1e3,v-T);E=c>=v?1:Math.max(0,Math.min(.99,(c-T)/_)),W=E>=.25&&E<.66?"crop_plot_sprouts":"crop_plot_tilled"}if(!W)continue;const K=!!x.connectableGroup,Se=!Y&&x.connectableGroup?le(o.gx,o.gy,M,k,H,x.connectableGroup):0,J=(Se>0?b.resolve(`conn:${W}:${Se}`):void 0)??b.resolve(W);if(!J)continue;const he=x.width!==x.height,ke=Y?1.04:Vt(x),se=(M+k)*(Pe*.5)*ke,ue=se*(J.height/J.width),Q=Ht(x,o,c,s,I),ze=at(o.rotation,l,he,K),Tt=!!W.startsWith("env_")&&W!=="env_mossy_rock",_t=h&&!K&&(M>=2||k>=2||ue>95),Rt=p?.movingBuildingUid===o.uid,Ze=ne===o.uid?4:p?.selectedBuildingUid===o.uid?3:0;let nt=1,lt=1,Qe=1,ct=0;if(!s){const T=p?.squashMap?.get(o.uid);if(T!==void 0){const _=(c-T)/380;if(_>=1||_<0)p?.squashMap?.delete(o.uid);else{const $=Math.sin(_*Math.PI*3.2)*Math.exp(-_*4.2)*.14;nt=1+$,lt=1-$*.88}}const v=p?.completionPopMap?.get(o.uid);if(v!==void 0){const _=(c-v)/1300;if(_>=1||_<0)p?.completionPopMap?.delete(o.uid);else{const $=Math.sin(_*Math.PI*2.8)*Math.exp(-_*3.4);Qe=_<.11?.72+_/.11*.34:1+$*.13,ct=_<.36?Math.sin(_/.36*Math.PI)*14:0}}}const L=this.slots[F++];L.rxMin=D+.04,L.ryMin=B+.04,L.rxMax=D+U-.04,L.ryMax=B+N-.04,L.depth=D+U+B+N-.05,L.wx=C,L.wy=G+4-ct;const ht=se*Q.scaleX*nt*Qe,Pt=ue*Q.scaleY*lt*Qe;L.drawW=ze?-ht:ht,L.drawH=Pt,L.spriteId=J.id,L.swayAmp=Tt?3.8:x.category==="creature"?1.4:0,L.rotRad=0,L.pivotY=0,L.alpha=Rt?.35:_t?.3:1,L.tintFlag=Ze,L.skeletalPoseIdx=-1;const we=At(x.id);if(L.shadowScale=K?0:1,L.emissiveBoost=(x.isFlooPortal?1.35:we?we.emissiveBoost:K?0:.85)+Q.furnaceGlowBoost,L.phaseSeed=o.gx*1.7+o.gy*2.3,L.extraStart=R,L.extraCount=0,!Y&&Q.smokeIntensity>0&&this.chimneyCount<12){const T=this.chimneyCount*3;this.chimneyEmitters[T]=C+se*.14,this.chimneyEmitters[T+1]=G-ue*.82,this.chimneyEmitters[T+2]=L.phaseSeed,this.chimneyCount++}if(Y){const T=b.resolve("ui_icon_hammer_wand");if(T&&R<this.extras.length){const v=this.extras[R++],_=Math.min(36,Math.max(22,se*.28));v.wx=C+se*.2,v.wy=G-ue*.62+Math.sin(c*.006+L.phaseSeed)*3,v.drawW=_,v.drawH=_*(T.height/T.width),v.spriteId=T.id,v.swayAmp=0,v.rotRad=Math.sin(c*.008+o.gx)*.24,v.pivotY=.5,v.alpha=.95,v.tintFlag=0,v.emissiveBoost=.85,v.phaseSeed=L.phaseSeed,L.extraCount++}}else if(o.awaitingUnveil){const T=b.resolve("prop_ribbon_unveil");if(T&&R<this.extras.length){const v=this.extras[R++],_=Math.sin(c*.005+L.phaseSeed)*4.5,$=Math.min(54,Math.max(32,se*.42));v.wx=C,v.wy=G-ue*.55+_,v.drawW=$,v.drawH=$*(T.height/T.width),v.spriteId=T.id,v.swayAmp=0,v.rotRad=Math.sin(c*.0035)*.06,v.pivotY=.5,v.alpha=1,v.tintFlag=0,v.emissiveBoost=1.15,v.phaseSeed=L.phaseSeed,L.extraCount++}}const ut=ze?-1:1;if(!Y&&x.id==="burrow_windmill_canon"){const T=b.resolve("prop_windmill_sails");if(T&&R<this.extras.length){const v=this.extras[R++],_=se*.78;v.wx=C-se*.06*ut,v.wy=G+4-ue*.67,v.drawW=ze?-_:_,v.drawH=_,v.spriteId=T.id,v.swayAmp=0,v.rotRad=s?.38:(c*.0013+Q.extraRotorRad)%6.28318,v.pivotY=.5,v.alpha=L.alpha,v.tintFlag=Ze,v.emissiveBoost=.1,v.phaseSeed=L.phaseSeed,L.extraCount++}}else if(!Y&&x.id==="burrow_reed_pond_mill"){const T=b.resolve("prop_waterwheel_rotor");if(T&&R<this.extras.length){const v=this.extras[R++],_=se*.44;v.wx=C+se*.18*ut,v.wy=G+4-ue*.34,v.drawW=ze?-_:_,v.drawH=_,v.spriteId=T.id,v.swayAmp=0,v.rotRad=s?.2:(c*.0018+Q.extraRotorRad)%6.28318,v.pivotY=.5,v.alpha=L.alpha,v.tintFlag=Ze,v.emissiveBoost=.05,v.phaseSeed=L.phaseSeed,L.extraCount++}}if(!Y&&Q.isActive&&Q.activeGoodIconKey&&!(o.readyFarmGoods&&o.readyFarmGoods.length>0)&&!(o.readyBubbles&&o.readyBubbles>0)&&R<this.extras.length){const T=b.resolve(Q.activeGoodIconKey);if(T){const v=this.extras[R++],_=s?0:Math.sin(c*.0052+L.phaseSeed)*2.8,$=Math.min(26,Math.max(18,se*.2));v.wx=C,v.wy=G-Math.max(30,ue*.72)+_,v.drawW=$,v.drawH=$*(T.height/T.width),v.spriteId=T.id,v.swayAmp=0,v.rotRad=0,v.pivotY=.5,v.alpha=.9*L.alpha,v.tintFlag=0,v.emissiveBoost=.65,v.phaseSeed=L.phaseSeed,L.extraCount++}}if(!Y&&x.isFarmlandPlot&&o.cropId&&E>=.45){const T=je[o.cropId],v=T?b.resolve(T.iconKey):void 0;if(v){const _=E>=1?1:.68+E*.32,$=[[-11,-13],[11,-13],[0,-6]];for(let ge=0;ge<$.length&&R<this.extras.length;ge++){const oe=this.extras[R++],re=23*_;oe.wx=C+$[ge][0],oe.wy=G+$[ge][1],oe.drawW=re,oe.drawH=re*(v.height/v.width),oe.spriteId=v.id,oe.swayAmp=2.6,oe.rotRad=0,oe.pivotY=0,oe.alpha=1,oe.tintFlag=0,oe.emissiveBoost=T?.nocturnalGlowColor?1.15:.08,oe.phaseSeed=L.phaseSeed+ge*1.9,L.extraCount++}}}if(!Y&&x.isAnimalPasturePlot&&o.pastureAnimalId){const T=pt[o.pastureAnimalId];if(T){const v=(Se&204)!==0,_=(Se&51)!==0,$=se*(v?.3:.2),ge=ue*(_?.14:.09),oe=o.pastureAnimalId==="daisy_cow"||o.pastureAnimalId==="silver_hippogriff"||o.pastureAnimalId==="shadow_thestral"||o.pastureAnimalId==="moon_unicorn"?48:o.pastureAnimalId==="ottery_sheep"?44:38,re=Math.floor(c/16.67),$e=G+4,Ke=!!(o.pastureReadyAt&&c>=o.pastureReadyAt),Fe=this.period==="night"&&!Ke,Ve=Fe?.25:1;for(let xe=0;xe<2&&R<this.extras.length;xe++){const ve=!s&&!Fe&&Math.floor((re+o.gx*11+o.gy*17+xe*29)/42)%2===1,qe=T.spritePair[ve?1:0],Le=b.resolve(qe)??b.resolve(T.spritePair[0]);if(!Le)continue;const He=c*(xe===0?.00144:.00114)*Ve+o.gx*1.9+o.gy*1.3+xe*2.6,pe=C+Math.sin(He)*$+(xe===0?-se*.06:se*.09),Ct=s||Fe?0:Math.abs(Math.sin(c*.0066+xe*1.7+o.gx))*2.4,dt=!s&&Fe?Math.sin(c*.0016+o.gx*1.3+xe*2.1)*.022:0,Et=$e-ue*(xe===0?.44:.32)+Math.cos(He*.85)*ge-Ct,ft=xe===0?1:.82,vt=oe*ft*(1-dt*.7),Lt=oe*ft*(Le.height/Le.width)*(1+dt),Dt=Math.cos(He)<0,ye=this.extras[R++];ye.wx=pe,ye.wy=Et,ye.drawW=Dt?-vt:vt,ye.drawH=Lt,ye.spriteId=Le.id,ye.swayAmp=0,ye.rotRad=0,ye.pivotY=0,ye.alpha=1,ye.tintFlag=0,ye.emissiveBoost=o.pastureAnimalId==="moon_unicorn"?.55:.1,ye.phaseSeed=L.phaseSeed+xe*1.7,L.extraCount++}}}if(!Y&&x.isCreatureHabitat&&!x.isRuralFarmstead&&!o.isEscaped){const T=x.id==="hippogriff_glade"?["beast_hippogriff","beast_hippogriff_bow"]:x.id==="thestral_grove"?["beast_thestral","beast_thestral_wings"]:x.id==="unicorn_glade"?["beast_unicorn","beast_unicorn_prance"]:x.id==="phoenix_perch"?["beast_phoenix","beast_phoenix_soar"]:x.id==="dragon_lair"?["beast_dragon","beast_dragon_roar"]:x.id==="hagrid_bowtruckle"?null:["beast_niffler","beast_niffler_play"];if(T&&R<this.extras.length){const v=Math.floor(c/16.67),_=Math.floor((v+o.gx*13+o.gy*7)/48)%2===1,$=b.resolve(T[_?1:0])??b.resolve(T[0]);if($){const ge=o.creatureStage==="baby"?.58:o.creatureStage==="legendary"?1.05:.84,oe=c*.00192+o.gx*2.1+o.gy,re=C+Math.sin(oe)*se*.22,$e=Math.abs(Math.sin(c*.0072+o.gx))*3.5,Ke=G+4,Fe=Ke-ue*.22-$e,Ve=38*ge,xe=Ve*($.height/$.width),ve=this.extras[R++];if(ve.wx=re,ve.wy=Fe,ve.drawW=Math.cos(oe)<0?-Ve:Ve,ve.drawH=xe,ve.spriteId=$.id,ve.swayAmp=0,ve.rotRad=0,ve.pivotY=0,ve.alpha=1,ve.tintFlag=0,ve.emissiveBoost=o.creatureMorph==="radiant"||o.creatureMorph==="mystic"?.85:.14,ve.phaseSeed=L.phaseSeed,L.extraCount++,o.hasBabyOffspring&&R<this.extras.length){const qe=oe-.9,Le=22,He=Le*($.height/$.width),pe=this.extras[R++];pe.wx=C+Math.sin(qe)*se*.2,pe.wy=Ke-ue*.16-Math.abs(Math.cos(c*.0096))*3,pe.drawW=Math.cos(qe)<0?-Le:Le,pe.drawH=He,pe.spriteId=$.id,pe.swayAmp=0,pe.rotRad=0,pe.pivotY=0,pe.alpha=1,pe.tintFlag=0,pe.emissiveBoost=.14,pe.phaseSeed=L.phaseSeed+2.3,L.extraCount++}}}}else if(!Y&&x.id==="black_lake_boats"){const T=b.resolve("vehicle_lake_boat");if(T){const v=G+4;for(let _=0;_<2&&R<this.extras.length;_++){const $=c*.0015+_*Math.PI,ge=36,oe=ge*(T.height/T.width),re=this.extras[R++];re.wx=C+Math.cos($)*se*.34,re.wy=v-ue*.16+Math.sin($)*ue*.11+oe*.25,re.drawW=-Math.sin($)<0?-ge:ge,re.drawH=oe,re.spriteId=T.id,re.swayAmp=0,re.rotRad=0,re.pivotY=0,re.alpha=1,re.tintFlag=0,re.emissiveBoost=.25,re.phaseSeed=L.phaseSeed+_,L.extraCount++}}}if(!p?.skipReadyBubbleSprites&&!Y&&!o.awaitingUnveil&&R<this.extras.length){let T;x.isFarmlandPlot&&o.cropId&&E>=1?T=je[o.cropId]?.iconKey:x.isAnimalPasturePlot&&o.pastureAnimalId&&o.pastureReadyAt&&c>=o.pastureReadyAt?T=pt[o.pastureAnimalId]?.iconKey:((o.readyFarmGoods?.length??0)>0||(o.readyBubbles??0)>0)&&(T="ui_icon_golden_sickle");const v=T?b.resolve(T):void 0;if(v){const _=this.extras[R++],$=Math.sin(c*.0046+L.phaseSeed)*3.8;_.wx=C,_.wy=G-Math.max(34,ue*.78)+$,_.drawW=24,_.drawH=24*(v.height/v.width),_.spriteId=v.id,_.swayAmp=0,_.rotRad=0,_.pivotY=.5,_.alpha=.98,_.tintFlag=0,_.emissiveBoost=1.18,_.phaseSeed=L.phaseSeed,L.extraCount++}}if(!Y){if(x.isFlooPortal){const T=.92+Math.sin(c*.006+o.gx)*.12;j(C,G-8,34,195,.16,.96,.64,(O?1.65:.95)*T)}else if(x.isFarmlandPlot&&o.cropId){const T=je[o.cropId]?.nocturnalGlowColor;if(T){const[v,_,$]=co(T,[.35,.82,.98]);j(C,G-10,20,96,v,_,$,O?1.15:.45)}}else if(we){const T=this.weatherKind==="snow"||this.seasonId==="winter";if(O||we.activeInDaySnow&&T){const v=.94+Math.sin(c*.0052+o.gx*1.9+o.gy*1.3)*.06,_=O?1:.38;j(C,G-(we.secondaryLakePool?24:12),we.secondaryLakePool?52:36,we.radius,we.rgb[0],we.rgb[1],we.rgb[2],we.intensity*_*v),O&&we.secondaryLakePool&&j(C+18,G-4,22,135,.3,.78,1,.98*v)}}else if(M>=2||k>=2||x.category==="shop"||x.category==="decor"){const T=x.id==="burrow_house_canon"||x.id==="molly_apple_bakery"||x.id==="burrow_broomsticks_canon"||x.id==="burrow_honeydukes_canon"||x.id==="burrow_feast_marquee";if(O){const v=.95+Math.sin(c*.0045+o.gx*2.1)*.06;j(C,G-(x.id==="burrow_house_canon"?26:14),x.id==="burrow_house_canon"?56:42,T?200:140,1,.72,.26,(T?1.35:.85)*v),x.id==="burrow_house_canon"&&j(C-16,G-6,28,130,.14,.95,.52,1.15*(.92+Math.sin(c*.0068)*.08))}else if(Q.isActive){const v=.9+Math.sin(c*.009+o.gx*1.7)*.1;j(C,G-12,36,150,1,.68,.24,.75*v)}}}}const ce=this.seasonId==="winter",be=ce?Nt:no;for(const[P,o,x,M,k]of be){if(F>=ie)break;const D=e.grid[o]?.[P];if(!D||D.buildingUid||D.path!=="none"||D.terrain!=="grass"||!e.state.sandboxMode&&!this.unlockedZonesSet.has(D.zoneId)||M>=1.4&&(e.grid[o-1]?.[P]?.buildingUid||e.grid[o+1]?.[P]?.buildingUid||e.grid[o]?.[P-1]?.buildingUid||e.grid[o]?.[P+1]?.buildingUid))continue;const B=Me(P+.5,o+.5,l),U=B.wy-D.elevation*Ce;if(B.wx<f||B.wx>m||U<y||U>q)continue;const N=b.resolve(x);if(!N)continue;const{rx:H,ry:C}=et(P+.5,o+.5,l),Y=(x==="env_flower_patch"||x==="env_bush_flowers"||x==="env_mossy_rock"||x==="yule_holly_hedgerow"||x==="yule_snowdrop_moss_log"||x==="yule_edelweiss_alpine_rockery"||x==="yule_puffskein_snowballs"?36:58)*M,W=Y*(N.height/N.width),E=At(x),K=this.slots[F++];K.rxMin=H-.22,K.ryMin=C-.22,K.rxMax=H+.22,K.ryMax=C+.22,K.depth=H+C+.28,K.wx=B.wx,K.wy=U,K.drawW=k?-Y:Y,K.drawH=W,K.spriteId=N.id,K.swayAmp=x==="env_mossy_rock"||x.startsWith("yule_")?0:2.8,K.rotRad=0,K.pivotY=0,K.alpha=1,K.tintFlag=0,K.skeletalPoseIdx=-1,K.shadowScale=.72,K.emissiveBoost=E?E.emissiveBoost:0,K.phaseSeed=P*1.3+o*.9,K.extraCount=0,K.extraStart=0,E&&(O||E.activeInDaySnow)&&j(B.wx,U-12,36,E.radius*.82,E.rgb[0],E.rgb[1],E.rgb[2],E.intensity*(O?.58:.24))}if(p?.hoverTile&&F<ie){const P=p.movingBuildingUid?e.state.buildings.find(M=>M.uid===p.movingBuildingUid):void 0,o=p.selectedCatalogItem??(P?Xe(P.itemId):void 0),x=o?it(o.id,o.spriteKey):void 0;if(o&&x){const M=p.rotation??0,k=b.resolve(x);if(k){const{gx:D,gy:B}=p.hoverTile,{bw:U,bh:N}=e.getBuildingFootprint(o,M),{rx0:H,ry0:C,rbw:G,rbh:Y}=De(D,B,U,N,l),W=e.grid[B]?.[D]?.elevation??0,E=(H-C+(G-Y)*.5)*(Pe*.5),K=(H+G+C+Y)*(Ie*.5)-W*Ce,Se=o.width!==o.height,J=!!o.connectableGroup,he=o.spriteScale??(Se?1:1.05),ke=(U+N)*(Pe*.5)*he,rt=ke*(k.height/k.width),se=at(M,l,Se,J),ue=e.canPlaceItem(o,D,B,M,p.movingBuildingUid??void 0).ok,Q=this.slots[F++];Q.rxMin=H+.04,Q.ryMin=C+.04,Q.rxMax=H+G-.04,Q.ryMax=C+Y-.04,Q.depth=H+G+C+Y+.02,Q.wx=E,Q.wy=K+4-Math.abs(Math.sin(c*.005))*2.5,Q.drawW=se?-ke:ke,Q.drawH=rt,Q.spriteId=k.id,Q.swayAmp=0,Q.rotRad=0,Q.pivotY=0,Q.alpha=.82,Q.tintFlag=ue?1:2,Q.skeletalPoseIdx=-1,Q.shadowScale=.5,Q.emissiveBoost=.45,Q.phaseSeed=D+B,Q.extraCount=0,Q.extraStart=0}}}for(let P=0;P<e.villagers.length&&F<ie;P++){const o=e.villagers[P],x=Math.max(0,Math.min(me-1,Math.floor(o.gx))),M=Math.max(0,Math.min(me-1,Math.floor(o.gy))),k=e.grid[M]?.[x]?.elevation??0,D=Me(o.gx,o.gy,l),B=D.wy-k*Ce;if(D.wx<f||D.wx>m||B<y||B>q)continue;const U=o.state==="walking",N=U&&Math.floor(o.walkPhase*1.4)%2===1,H=b.resolve(N?o.walkSprite:o.idleSprite)??b.resolve(o.idleSprite);if(!H)continue;const C=o.id==="hagrid"?62:52,G=C*(H.width/H.height),Y=U?Math.abs(Math.sin(o.walkPhase*2.1))*2.8:Math.sin(c*.003+o.gx*1.7)*.7,W=U?Math.sin(o.walkPhase*1.05)*.045:0,{rx:E,ry:K}=et(o.gx,o.gy,l);let Se=-1;if(V<Ne){Se=V++;const he=this.rawSkeletalPoses[Se];he.villagerId=o.id,he.wx=D.wx,he.wy=B-Y,he.drawW=o.facingLeft?-G:G,he.drawH=C,he.spriteId=H.id,he.walkPhase=o.walkPhase,he.isWalking=U,he.facingLeft=!!o.facingLeft,he.alpha=1,he.greetWave=s?0:Math.min(1,Math.max(0,(o.greetReactTimer??0)/.6)),he.tendingLean=!s&&!U&&(o.tendingSpotTimer??0)>0?1:0,he.phaseSeed=P*2.1}const J=this.slots[F++];J.rxMin=E-.18,J.ryMin=K-.18,J.rxMax=E+.18,J.ryMax=K+.18,J.depth=E+K+.3,J.wx=D.wx,J.wy=B-Y,J.drawW=o.facingLeft?-G:G,J.drawH=C,J.spriteId=H.id,J.swayAmp=.8,J.rotRad=W,J.pivotY=0,J.alpha=1,J.tintFlag=0,J.skeletalPoseIdx=Se,J.shadowScale=.72,J.emissiveBoost=.12,J.phaseSeed=P*2.1,J.extraCount=0,J.extraStart=0}if(!e.state.sandboxMode)for(let P=0;P<this.lockedScenery.length&&F<ie;P++){const o=this.lockedScenery[P];if(this.unlockedZonesSet.has(o.zoneId))continue;const x=Math.max(0,Math.min(me-1,Math.round(o.gx))),M=Math.max(0,Math.min(me-1,Math.round(o.gy))),k=e.grid[M]?.[x]?.elevation??0,D=Me(o.gx+.5,o.gy+.5,l),B=D.wy-k*Ce;if(D.wx<f||D.wx>m||B<y||B>q)continue;const U=ce?Gt(o):o.spriteKey,N=b.resolve(U);if(!N)continue;const H=U==="env_flower_patch"||U==="env_bush_flowers"||U==="env_mossy_rock"||U==="yule_holly_hedgerow"||U==="yule_snowdrop_moss_log"||U==="yule_edelweiss_alpine_rockery",C=(H?34:58)*o.scale,G=C*(N.height/N.width),{rx:Y,ry:W}=et(o.gx+.5,o.gy+.5,l),E=this.slots[F++];E.rxMin=Y-.32,E.ryMin=W-.32,E.rxMax=Y+.32,E.ryMax=W+.32,E.depth=Y+W+.42,E.wx=D.wx,E.wy=B,E.drawW=o.flipX?-C:C,E.drawH=G,E.spriteId=N.id,E.swayAmp=o.spriteKey==="env_mossy_rock"?0:H?2.6:4.8,E.rotRad=0,E.pivotY=0,E.alpha=1,E.tintFlag=0,E.skeletalPoseIdx=-1,E.shadowScale=.85,E.emissiveBoost=o.spriteKey==="env_tree_magic"?.55:0,E.phaseSeed=o.gx*.9+o.gy*1.4,E.extraCount=0,E.extraStart=0}this.sortAndPackSceneInstances(F);let Ae=0;const Ee=Math.min(wt,Math.max(0,t));for(let P=0;P<z&&Ae<Ee;P++){let o=P,x=this.lightCandidates[P].distSq;for(let D=P+1;D<z;D++)this.lightCandidates[D].distSq<x&&(x=this.lightCandidates[D].distSq,o=D);if(o!==P){const D=this.lightCandidates[P];this.lightCandidates[P]=this.lightCandidates[o],this.lightCandidates[o]=D}const M=this.lightCandidates[P];if(M.intensity<=.02)continue;const k=Ae*st;this.lightData[k]=M.wx,this.lightData[k+1]=M.wy,this.lightData[k+2]=M.z,this.lightData[k+3]=M.radius,this.lightData[k+4]=M.r,this.lightData[k+5]=M.g,this.lightData[k+6]=M.b,this.lightData[k+7]=M.intensity,Ae++}this.lightCount=Ae}sortAndPackSceneInstances(e){if(this.skeletalCount=0,e===0){this.sceneCount=0;return}this.topoHead.fill(-1,0,e),this.topoTail.fill(-1,0,e),this.topoInDeg.fill(0,0,e),this.topoEmitted.fill(0,0,e);let a=0;const i=.04,w=(s,n)=>{this.ensureEdgeCap(a+1);const u=a++;this.topoTo[u]=n,this.topoNext[u]=-1,this.topoHead[s]===-1?(this.topoHead[s]=u,this.topoTail[s]=u):(this.topoNext[this.topoTail[s]]=u,this.topoTail[s]=u),this.topoInDeg[n]++},c=this.topoSweepOrder,b=this.topoIsoL,t=this.topoIsoR;for(let s=0;s<e;s++){const n=this.slots[s];c[s]=s,b[s]=n.rxMin-n.ryMax,t[s]=n.rxMax-n.ryMin}const S=[701,301,132,57,23,10,4,1];for(let s=0;s<S.length;s++){const n=S[s];if(!(n>=e))for(let u=n;u<e;u++){const d=c[u],f=b[d];let m=u;for(;m>=n&&b[c[m-n]]>f;)c[m]=c[m-n],m-=n;c[m]=d}}for(let s=0;s<e;s++){const n=c[s],u=this.slots[n],d=t[n];for(let f=s+1;f<e;f++){const m=c[f];if(b[m]>=d-i)break;const y=this.slots[m];if(t[m]<=b[n]+i)continue;const q=u.rxMax<=y.rxMin+i&&u.ryMin<y.ryMax-i||u.ryMax<=y.ryMin+i&&u.rxMin<y.rxMax-i,F=y.rxMax<=u.rxMin+i&&y.ryMin<u.ryMax-i||y.ryMax<=u.ryMin+i&&y.rxMin<u.rxMax-i;q&&!F?w(n,m):F&&!q&&w(m,n)}}let A=0,p=0;for(let s=0;s<e;s++)if(this.topoInDeg[s]===0){const n=this.slots[s].depth;let u=A,d=p;for(;u<d;){const f=u+d>>1;this.slots[this.topoReady[f]].depth<=n?u=f+1:d=f}u<p&&this.topoReady.copyWithin(u+1,u,p),this.topoReady[u]=s,p++}let l=0;const h=s=>{if(l>=ie)return;const n=this.slots[s];if(n.skeletalPoseIdx>=0&&this.skeletalCount<Ne){const d=this.skeletalCount++;this.skeletalSortedIndices[d]=l;const f=this.rawSkeletalPoses[n.skeletalPoseIdx],m=this.skeletalPoses[d];m.villagerId=f.villagerId,m.wx=f.wx,m.wy=f.wy,m.drawW=f.drawW,m.drawH=f.drawH,m.spriteId=f.spriteId,m.walkPhase=f.walkPhase,m.isWalking=f.isWalking,m.facingLeft=f.facingLeft,m.alpha=f.alpha,m.greetWave=f.greetWave??0,m.tendingLean=f.tendingLean??0,m.phaseSeed=f.phaseSeed??0}const u=l*Re;this.sceneSpriteIds[l]=n.spriteId,this.sceneTintFlags[l]=n.tintFlag,this.sceneData[u]=n.wx,this.sceneData[u+1]=n.wy,this.sceneData[u+2]=n.drawW,this.sceneData[u+3]=n.drawH,this.sceneData[u+4]=n.spriteId,this.sceneData[u+5]=n.swayAmp,this.sceneData[u+6]=n.rotRad,this.sceneData[u+7]=n.pivotY,this.sceneData[u+8]=n.alpha+n.tintFlag*2,this.sceneData[u+9]=n.shadowScale,this.sceneData[u+10]=n.emissiveBoost,this.sceneData[u+11]=n.phaseSeed,l++;for(let d=0;d<n.extraCount&&l<ie;d++){const f=this.extras[n.extraStart+d];this.sceneSpriteIds[l]=f.spriteId,this.sceneTintFlags[l]=f.tintFlag;const m=l*Re;this.sceneData[m]=f.wx,this.sceneData[m+1]=f.wy,this.sceneData[m+2]=f.drawW,this.sceneData[m+3]=f.drawH,this.sceneData[m+4]=f.spriteId,this.sceneData[m+5]=f.swayAmp,this.sceneData[m+6]=f.rotRad,this.sceneData[m+7]=f.pivotY,this.sceneData[m+8]=f.alpha+f.tintFlag*2,this.sceneData[m+9]=0,this.sceneData[m+10]=f.emissiveBoost,this.sceneData[m+11]=f.phaseSeed,l++}};for(;A<p;){const s=this.topoReady[A++];this.topoEmitted[s]=1,h(s);for(let n=this.topoHead[s];n!==-1;n=this.topoNext[n]){const u=this.topoTo[n];if(this.topoInDeg[u]--,this.topoInDeg[u]===0){const d=this.slots[u].depth;let f=A,m=p;for(;f<m;){const y=f+m>>1;this.slots[this.topoReady[y]].depth<=d?f=y+1:m=y}f<p&&this.topoReady.copyWithin(f+1,f,p),this.topoReady[f]=u,p++}}}for(let s=0;s<e;s++)this.topoEmitted[s]||h(s);this.sceneCount=l}collectAtmosphericParticles(e,a){const i=a*.001,w=this.period==="night"||this.period==="dusk",c=this.weatherKind==="rain"||this.weatherKind==="storm"||this.weatherKind==="fog",b=!c&&(this.weatherKind==="snow"||this.seasonId==="winter"),t=Math.min(48,this.chimneyCount*4),S=Math.max(0,tt-t),p=Math.min(c?0:b?140:w?130:80,S),l=Math.max(.42,e.zoom),h=Math.max(920,780/l),s=Math.max(580,500/l),n=1/Math.max(.65,Math.min(1.25,e.zoom));for(let d=0;d<p;d++){const f=fe(d,17),m=fe(d,89),y=fe(d,233),q=38+m*34,F=b?i*(14+f*10)+Math.sin(i*(.85+y*.55)+d)*26:Math.sin(i*.65+d*1.7)*38,R=b?i*q:-i*12+Math.cos(i*.8+d*1.3)*24,V=f*h*2+F,z=m*s*2+R,I=e.x-h+(V%(h*2)+h*2)%(h*2),ne=e.y-s+(z%(s*2)+s*2)%(s*2),X=d*We;if(this.particleData[X]=I,this.particleData[X+1]=ne,b){const ae=(1.5+y*1.9)*n;this.particleData[X+2]=ae,this.particleData[X+3]=(y+i*(.07+f*.06))%1,this.particleData[X+4]=f,this.particleData[X+5]=.8+.18*m}else{const ae=.45+.55*Math.sin(i*(2.2+y*2)+d*3.1);this.particleData[X+2]=(2.6+y*4.2)*ae,d%5===0?(this.particleData[X+3]=.25,this.particleData[X+4]=1.35,this.particleData[X+5]=.82):(this.particleData[X+3]=1.45,this.particleData[X+4]=1.12,this.particleData[X+5]=.36)}}let u=p;for(let d=0;d<this.chimneyCount;d++){const f=d*3,m=this.chimneyEmitters[f],y=this.chimneyEmitters[f+1],q=this.chimneyEmitters[f+2];for(let F=0;F<4&&u<tt;F++){const R=(i*.55+F*.25+q*.17)%1,V=u*We;this.particleData[V]=m+Math.sin(i*1.8+q+F*1.6)*(3+R*8),this.particleData[V+1]=y-R*34,this.particleData[V+2]=4.5+R*7.5,this.particleData[V+3]=-1,this.particleData[V+4]=Math.sin(R*Math.PI)*.46,this.particleData[V+5]=.65,u++}}this.particleCount=u}}const de=2048,uo=new Set(["yule_floating_candelabra","yule_goblet_blue_brazier","yule_hogwarts_boathouse_ice","yule_snowdrop_moss_log","yule_hermione_bluebell_jars","yule_glowing_puffapod_bush"]);function fo(g){return g.startsWith("conn:")||g.startsWith("yule_")||g.startsWith("ui_icon_")||g.startsWith("m3_")||g.startsWith("beast_")||g.startsWith("vehicle_")||g.startsWith("staff_")||g.startsWith("guest_")||g.startsWith("prop_")||g.startsWith("crop_plot_")||g==="snowy_pines"||g==="env_pine_snow"||g==="catalog_floating_candles_post"||g==="catalog_patronus_ward_lantern"?!1:Kt(g)}function vo(g){return uo.has(g)}const po=8,mo=4,ot=de>>1,go=4,Ge=512,Te=4;function xo(g,e){const a=g?mo:po,i=g?256:512,w=!g&&e,b=a*(de*de*4/(1024*1024))*1.328125,t=a*(ot*ot*4/(1024*1024));return{atlasSize:de,normalAtlasSize:ot,atlasLayers:a,albedoMipLevels:go,spriteMaxDim:i,useHalfFloatFbo:w,allocatedAtlasVramMb:Number((b+t).toFixed(1))}}function St(g,e,a){const i=g.createShader(e);if(g.shaderSource(i,a),g.compileShader(i),!g.getShaderParameter(i,g.COMPILE_STATUS)){const w=g.getShaderInfoLog(i)||"Unknown shader compile error";throw g.deleteShader(i),new Error(`[WebGL2 Shader] ${w}`)}return i}function _e(g,e,a){const i=St(g,g.VERTEX_SHADER,e),w=St(g,g.FRAGMENT_SHADER,a),c=g.createProgram();if(g.attachShader(c,i),g.attachShader(c,w),g.linkProgram(c),g.deleteShader(i),g.deleteShader(w),!g.getProgramParameter(c,g.LINK_STATUS)){const b=g.getProgramInfoLog(c)||"Unknown program link error";throw g.deleteProgram(c),new Error(`[WebGL2 Link] ${b}`)}return c}const Ye=`#version 300 es
precision highp float;
out vec2 vUv;
void main() {
  vec2 pos = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  vUv = pos;
  gl_Position = vec4(pos * 2.0 - 1.0, 0.0, 1.0);
}
`,bo=`#version 300 es
precision highp float;
precision highp sampler2DArray;
in vec2 vUv;
uniform sampler2DArray uAlbedo;
uniform float uLayer;
uniform vec2 uTexel;
uniform int uLightingProfile; // 0 = non-emissive organic/dome, 1 = framed architectural windows, 2 = magic/lantern glow
uniform vec4 uSpriteBounds;   // (x0, y0, w, h) in normalized atlas space
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
  if (uLightingProfile == 0) {
    vec2 localUv = clamp((vUv - uSpriteBounds.xy) / max(uSpriteBounds.zw, vec2(0.0001)), vec2(0.0), vec2(1.0));
    vec2 dome = vec2(localUv.x - 0.5, localUv.y - 0.45) * 0.85;
    nx = mix(nx, nx + dome.x, 0.35);
    ny = mix(ny, ny + dome.y, 0.35);
  }
  vec3 n = normalize(vec3(nx, ny, 1.0));

  // Detect warm lit cottage windows & magical cores with lighting-profile discipline
  float lum = luma(c.rgb);
  float warmth = c.r * 0.58 + c.g * 0.42 - c.b * 0.72;
  float emissive = 0.0;
  if (uLightingProfile == 2) {
    float warmGlow = smoothstep(0.20, 0.46, warmth) * smoothstep(0.54, 0.82, lum);
    float magicCore = smoothstep(0.18, 0.46, max(c.g, c.b) - c.r * 0.78) * smoothstep(0.52, 0.85, lum);
    emissive = clamp(max(warmGlow, magicCore * 0.96), 0.0, 1.0);
  } else if (uLightingProfile == 1) {
    float minNeighborLum = min(min(lL, lR), min(lU, lD));
    float localContrast = clamp((lum - minNeighborLum - 0.08) / 0.24, 0.0, 1.0);
    float warmWindow = smoothstep(0.24, 0.50, warmth) * smoothstep(0.64, 0.90, lum);
    float magicPane = smoothstep(0.20, 0.48, max(c.g, c.b) - c.r * 0.78) * smoothstep(0.60, 0.88, lum);
    emissive = clamp(max(warmWindow, magicPane * 0.92) * mix(0.14, 1.0, localContrast), 0.0, 1.0);
  }

  fragColor = vec4(n * 0.5 + 0.5, emissive);
}
`,wo=`#version 300 es
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
`,yo=`#version 300 es
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
  vec2 offset = vec2(aCorner.x * ${Pe*.5*1.036}, aCorner.y * ${Ie*.5*1.036});
  vec2 wp = iWorldPos + offset;
  vec2 sp = uViewport * 0.5 + (wp - uCamera.xy) * uCamera.z;
  vec2 clip = vec2((sp.x / uViewport.x) * 2.0 - 1.0, 1.0 - (sp.y / uViewport.y) * 2.0);
  gl_Position = vec4(clip, 0.0, 1.0);
  vLocal = aCorner;
  vWorldPos = wp;
  vColor = iBaseColor;
  vMeta = iMeta;
}
`,Ao=`#version 300 es
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
`,So=`#version 300 es
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
  vec2 offset = vec2(aCorner.x * ${Pe*.5*1.045}, aCorner.y * ${Ie*.5*1.045});
  vec2 wp = iWorldPos + offset;
  vec2 sp = uViewport * 0.5 + (wp - uCamera.xy) * uCamera.z;
  vec2 clip = vec2((sp.x / uViewport.x) * 2.0 - 1.0, 1.0 - (sp.y / uViewport.y) * 2.0);
  gl_Position = vec4(clip, 0.0, 1.0);
  vLocal = aCorner;
  vWorldPos = wp;
  vWaterMeta = iWaterMeta;
}
`,To=`#version 300 es
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
`,_o=`#version 300 es
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
`,Ro=`#version 300 es
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
`,Po=`#version 300 es
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
`,Co=`#version 300 es
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
`,Eo=`#version 300 es
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
`,Lo=`#version 300 es
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
`,Do=`#version 300 es
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
`,Mo=`#version 300 es
precision highp float;
in vec2 vLocal;
in vec3 vColor;
uniform float uIsSnow;
out vec4 fragColor;

void main() {
  float d = length(vLocal);
  if (d > 1.0) discard;
  if (vColor.x < -0.5) {
    // Cozy rising chimney smoke / potion steam puff (vColor = [-1.0, alpha, warmth])
    vec3 smokeCol = mix(vec3(0.92, 0.90, 0.88), vec3(1.0, 0.89, 0.74), vColor.z);
    float puff = pow(1.0 - d, 1.85) * vColor.y;
    vec3 outSmoke = uIsSnow > 0.5 ? smokeCol : smokeCol * 0.30;
    fragColor = vec4(outSmoke, puff);
    return;
  }
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
`,Io=`#version 300 es
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
`,Fo=`#version 300 es
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
`,Bo=`#version 300 es
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
`;class Yo{constructor(e,a){r(this,"canvas");r(this,"gpuDevice");r(this,"gl");r(this,"sprites");r(this,"snapshot",new ho);r(this,"spineAdapter");r(this,"rangeSlices",[]);r(this,"bakeNormalProg");r(this,"skyProg");r(this,"terrainProg");r(this,"waterProg");r(this,"grassProg");r(this,"shadowProg");r(this,"sceneProg");r(this,"particleProg");r(this,"bloomExtractProg");r(this,"bloomBlurProg");r(this,"compositeProg");r(this,"emptyVao");r(this,"diamondBuf");r(this,"uprightBuf");r(this,"centeredBuf");r(this,"terrainVao");r(this,"terrainInstanceBuf");r(this,"waterVao");r(this,"waterInstanceBuf");r(this,"grassVao");r(this,"grassInstanceBuf");r(this,"sceneVao");r(this,"sceneInstanceBuf");r(this,"particleVao");r(this,"particleInstanceBuf");r(this,"albedoArrayTex");r(this,"normalEmissiveArrayTex");r(this,"bakeFbo");r(this,"uvTableTex");r(this,"uvTableData",new Float32Array(Ge*2*4));r(this,"uvTableDirty",!1);r(this,"albedoMipDirty",!1);r(this,"spriteHandles",new Map);r(this,"shelf",{layer:0,curX:Te,curY:Te,rowH:0});r(this,"uploadScratchCanvas");r(this,"uploadScratchCtx");r(this,"unlockedZonesScratch",new Set);r(this,"atlasBudget");r(this,"nextSpriteId",0);r(this,"contextRestoreCount",0);r(this,"useHalfFloatFbo");r(this,"fboW",0);r(this,"fboH",0);r(this,"sceneFbo",null);r(this,"sceneColorTex",null);r(this,"bloomFboA",null);r(this,"bloomTexA",null);r(this,"bloomFboB",null);r(this,"bloomTexB",null);r(this,"uploadedStaticGen",-1);r(this,"uniformLocs",new WeakMap);r(this,"lightPosUniform",new Float32Array(64));r(this,"lightColUniform",new Float32Array(64));r(this,"fpsAccumMs",0);r(this,"fpsFrames",0);r(this,"currentFps",60);r(this,"lastFrameTs",0);r(this,"stats",{backend:"webgl2",fps:60,cpuCollectMs:0,drawCalls:0,terrainTiles:0,waterTiles:0,grassInstances:0,sortedSprites:0,particleInstances:0,activeLights:0,atlasLayers:1,atlasSpritesPacked:0,vramEstimateMb:0});this.canvas=e,this.sprites=a,this.gpuDevice=new $t({canvas:e,preserveDrawingBuffer:!1,onContextRestored:()=>{this.handleContextRestored()}});const i=this.gpuDevice.gl;this.gl=i,this.atlasBudget=xo(Xt(),this.gpuDevice.supportsHalfFloatHdr),this.useHalfFloatFbo=this.atlasBudget.useHalfFloatFbo,this.spineAdapter=new io(i),this.uploadScratchCanvas=document.createElement("canvas"),this.uploadScratchCanvas.width=512,this.uploadScratchCanvas.height=512,this.uploadScratchCtx=this.uploadScratchCanvas.getContext("2d"),this.initGpuResources()}getAtlasBudget(){return this.atlasBudget}getContextRestoreCount(){return this.contextRestoreCount}handleContextRestored(){this.contextRestoreCount+=1,this.uniformLocs=new WeakMap,this.fboW=0,this.fboH=0,this.sceneFbo=null,this.sceneColorTex=null,this.bloomFboA=null,this.bloomTexA=null,this.bloomFboB=null,this.bloomTexB=null,this.uploadedStaticGen=-1,this.invalidateSpriteAtlas(),this.initGpuResources(),this.spineAdapter.rebuildGpuResources()}initGpuResources(){const e=this.gl;this.bakeNormalProg=_e(e,Ye,bo),this.skyProg=_e(e,Ye,wo),this.terrainProg=_e(e,yo,Ao),this.waterProg=_e(e,So,To),this.grassProg=_e(e,_o,Ro),this.shadowProg=_e(e,Po,Co),this.sceneProg=_e(e,Eo,Lo),this.particleProg=_e(e,Do,Mo),this.bloomExtractProg=_e(e,Ye,Io),this.bloomBlurProg=_e(e,Ye,Fo),this.compositeProg=_e(e,Ye,Bo),this.emptyVao=e.createVertexArray();const a=new Float32Array([-1,0,0,-1,0,1,1,0]),i=e.createBuffer();this.diamondBuf=i,e.bindBuffer(e.ARRAY_BUFFER,i),e.bufferData(e.ARRAY_BUFFER,a,e.STATIC_DRAW),this.terrainVao=e.createVertexArray(),this.terrainInstanceBuf=e.createBuffer(),e.bindVertexArray(this.terrainVao),e.bindBuffer(e.ARRAY_BUFFER,i),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,this.terrainInstanceBuf),e.enableVertexAttribArray(1),e.vertexAttribPointer(1,2,e.FLOAT,!1,Be*4,0),e.vertexAttribDivisor(1,1),e.enableVertexAttribArray(2),e.vertexAttribPointer(2,3,e.FLOAT,!1,Be*4,8),e.vertexAttribDivisor(2,1),e.enableVertexAttribArray(3),e.vertexAttribPointer(3,3,e.FLOAT,!1,Be*4,20),e.vertexAttribDivisor(3,1),this.waterVao=e.createVertexArray(),this.waterInstanceBuf=e.createBuffer(),e.bindVertexArray(this.waterVao),e.bindBuffer(e.ARRAY_BUFFER,i),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,this.waterInstanceBuf),e.enableVertexAttribArray(1),e.vertexAttribPointer(1,2,e.FLOAT,!1,Oe*4,0),e.vertexAttribDivisor(1,1),e.enableVertexAttribArray(2),e.vertexAttribPointer(2,4,e.FLOAT,!1,Oe*4,8),e.vertexAttribDivisor(2,1);const w=new Float32Array([-.5,0,.5,0,-.5,1,.5,1]),c=e.createBuffer();this.uprightBuf=c,e.bindBuffer(e.ARRAY_BUFFER,c),e.bufferData(e.ARRAY_BUFFER,w,e.STATIC_DRAW),this.grassVao=e.createVertexArray(),this.grassInstanceBuf=e.createBuffer(),e.bindVertexArray(this.grassVao),e.bindBuffer(e.ARRAY_BUFFER,c),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,this.grassInstanceBuf),e.enableVertexAttribArray(1),e.vertexAttribPointer(1,2,e.FLOAT,!1,Ue*4,0),e.vertexAttribDivisor(1,1),e.enableVertexAttribArray(2),e.vertexAttribPointer(2,4,e.FLOAT,!1,Ue*4,8),e.vertexAttribDivisor(2,1),this.sceneVao=e.createVertexArray(),this.sceneInstanceBuf=e.createBuffer(),e.bindVertexArray(this.sceneVao),e.bindBuffer(e.ARRAY_BUFFER,c),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,this.sceneInstanceBuf),e.bufferData(e.ARRAY_BUFFER,this.snapshot.sceneData.byteLength,e.DYNAMIC_DRAW),e.enableVertexAttribArray(1),e.vertexAttribPointer(1,4,e.FLOAT,!1,Re*4,0),e.vertexAttribDivisor(1,1),e.enableVertexAttribArray(2),e.vertexAttribPointer(2,4,e.FLOAT,!1,Re*4,16),e.vertexAttribDivisor(2,1),e.enableVertexAttribArray(3),e.vertexAttribPointer(3,4,e.FLOAT,!1,Re*4,32),e.vertexAttribDivisor(3,1);const b=new Float32Array([-.5,-.5,.5,-.5,-.5,.5,.5,.5]),t=e.createBuffer();this.centeredBuf=t,e.bindBuffer(e.ARRAY_BUFFER,t),e.bufferData(e.ARRAY_BUFFER,b,e.STATIC_DRAW),this.particleVao=e.createVertexArray(),this.particleInstanceBuf=e.createBuffer(),e.bindVertexArray(this.particleVao),e.bindBuffer(e.ARRAY_BUFFER,t),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,this.particleInstanceBuf),e.bufferData(e.ARRAY_BUFFER,this.snapshot.particleData.byteLength,e.DYNAMIC_DRAW),e.enableVertexAttribArray(1),e.vertexAttribPointer(1,3,e.FLOAT,!1,We*4,0),e.vertexAttribDivisor(1,1),e.enableVertexAttribArray(2),e.vertexAttribPointer(2,3,e.FLOAT,!1,We*4,12),e.vertexAttribDivisor(2,1),e.bindVertexArray(null);const{atlasSize:S,normalAtlasSize:A,atlasLayers:p,albedoMipLevels:l}=this.atlasBudget;this.albedoArrayTex=e.createTexture(),e.bindTexture(e.TEXTURE_2D_ARRAY,this.albedoArrayTex),e.texStorage3D(e.TEXTURE_2D_ARRAY,l,e.RGBA8,S,S,p),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),this.normalEmissiveArrayTex=e.createTexture(),e.bindTexture(e.TEXTURE_2D_ARRAY,this.normalEmissiveArrayTex),e.texStorage3D(e.TEXTURE_2D_ARRAY,1,e.RGBA8,A,A,p),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),this.bakeFbo=e.createFramebuffer(),this.uvTableTex=e.createTexture(),e.bindTexture(e.TEXTURE_2D,this.uvTableTex),e.texImage2D(e.TEXTURE_2D,0,e.RGBA32F,Ge,2,0,e.RGBA,e.FLOAT,this.uvTableData),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}uLoc(e,a){let i=this.uniformLocs.get(e);i||(i=new Map,this.uniformLocs.set(e,i));let w=i.get(a);return w===void 0&&(w=this.gl.getUniformLocation(e,a),i.set(a,w)),w}invalidateSpriteAtlas(){this.spriteHandles.clear(),this.shelf.layer=0,this.shelf.curX=Te,this.shelf.curY=Te,this.shelf.rowH=0,this.nextSpriteId=0,this.uvTableDirty=!0}resolve(e){const a=this.spriteHandles.get(e);if(a)return a;if(this.nextSpriteId>=Ge)return;if(e.startsWith("conn:")){const w=e.split(":"),c=w[1],b=Number(w[2]??0);if(c&&Number.isFinite(b)&&b>0){const t=this.sprites.getConnectedFarmlandSprite(c,b,372);if(t)return this.packSpriteIntoArray(e,t)}return}const i=this.sprites.get(e);if(i)return this.packSpriteIntoArray(e,i)}packSpriteIntoArray(e,a){const i=a.width,w=a.height;if(!i||!w)return;const c=this.atlasBudget.spriteMaxDim,b=Math.min(1,c/Math.max(i,w)),t=Math.max(4,Math.round(i*b)),S=Math.max(4,Math.round(w*b));if(this.shelf.curX+t+Te>de&&(this.shelf.curX=Te,this.shelf.curY+=this.shelf.rowH+Te,this.shelf.rowH=0),this.shelf.curY+S+Te>de){if(this.shelf.layer+1>=this.atlasBudget.atlasLayers)return;this.shelf.layer+=1,this.shelf.curX=Te,this.shelf.curY=Te,this.shelf.rowH=0}const A=this.shelf.curX,p=this.shelf.curY,l=this.shelf.layer;this.shelf.curX+=t+Te,this.shelf.rowH=Math.max(this.shelf.rowH,S);const h=this.gl;let s=a;if(b<1){(this.uploadScratchCanvas.width<t||this.uploadScratchCanvas.height<S)&&(this.uploadScratchCanvas.width=Math.max(t,1024),this.uploadScratchCanvas.height=Math.max(S,1024)),this.uploadScratchCtx.clearRect(0,0,t,S),this.uploadScratchCtx.drawImage(a,0,0,t,S);const V=document.createElement("canvas");V.width=t,V.height=S,V.getContext("2d").drawImage(this.uploadScratchCanvas,0,0,t,S,0,0,t,S),s=V}h.bindTexture(h.TEXTURE_2D_ARRAY,this.albedoArrayTex),h.pixelStorei(h.UNPACK_PREMULTIPLY_ALPHA_WEBGL,1),h.texSubImage3D(h.TEXTURE_2D_ARRAY,0,A,p,l,t,S,1,h.RGBA,h.UNSIGNED_BYTE,s),h.pixelStorei(h.UNPACK_PREMULTIPLY_ALPHA_WEBGL,0),this.albedoMipDirty=!0;const n=this.atlasBudget.normalAtlasSize,u=Math.max(0,Math.floor(A*.5)-1),d=Math.max(0,Math.floor(p*.5)-1),f=Math.min(n-u,Math.ceil(t*.5)+2),m=Math.min(n-d,Math.ceil(S*.5)+2);h.bindFramebuffer(h.FRAMEBUFFER,this.bakeFbo),h.framebufferTextureLayer(h.FRAMEBUFFER,h.COLOR_ATTACHMENT0,this.normalEmissiveArrayTex,0,l),h.enable(h.SCISSOR_TEST),h.scissor(u,d,f,m),h.disable(h.BLEND),h.useProgram(this.bakeNormalProg),h.activeTexture(h.TEXTURE0),h.bindTexture(h.TEXTURE_2D_ARRAY,this.albedoArrayTex),h.texParameteri(h.TEXTURE_2D_ARRAY,h.TEXTURE_MIN_FILTER,h.LINEAR),h.uniform1i(this.uLoc(this.bakeNormalProg,"uAlbedo"),0),h.uniform1f(this.uLoc(this.bakeNormalProg,"uLayer"),l),h.uniform2f(this.uLoc(this.bakeNormalProg,"uTexel"),1/de,1/de),h.uniform1i(this.uLoc(this.bakeNormalProg,"uLightingProfile"),Ot(e)),h.uniform4f(this.uLoc(this.bakeNormalProg,"uSpriteBounds"),A/de,p/de,t/de,S/de),h.viewport(0,0,n,n),h.bindVertexArray(this.emptyVao),h.drawArrays(h.TRIANGLES,0,3),h.texParameteri(h.TEXTURE_2D_ARRAY,h.TEXTURE_MIN_FILTER,h.LINEAR_MIPMAP_LINEAR),h.disable(h.SCISSOR_TEST),h.bindFramebuffer(h.FRAMEBUFFER,null);const y=this.nextSpriteId++,q=y*4;this.uvTableData[q]=(A+.5)/de,this.uvTableData[q+1]=(p+.5)/de,this.uvTableData[q+2]=(A+t-.5)/de,this.uvTableData[q+3]=(p+S-.5)/de;const F=(Ge+y)*4;this.uvTableData[F]=l,this.uvTableData[F+1]=i/w,this.uvTableData[F+2]=fo(e)?1:0,this.uvTableData[F+3]=vo(e)?1:0,this.uvTableDirty=!0;const R={id:y,width:i,height:w};return this.spriteHandles.set(e,R),R}ensureRenderTargets(e,a){if(this.fboW===e&&this.fboH===a&&this.sceneFbo)return;const i=this.gl;this.fboW=e,this.fboH=a;const w=(l,h)=>{l&&i.deleteFramebuffer(l),h&&i.deleteTexture(h)};w(this.sceneFbo,this.sceneColorTex),w(this.bloomFboA,this.bloomTexA),w(this.bloomFboB,this.bloomTexB);const c=(l,h)=>{const s=i.createTexture();i.bindTexture(i.TEXTURE_2D,s),this.useHalfFloatFbo?i.texImage2D(i.TEXTURE_2D,0,i.RGBA16F,l,h,0,i.RGBA,i.HALF_FLOAT,null):i.texImage2D(i.TEXTURE_2D,0,i.RGBA8,l,h,0,i.RGBA,i.UNSIGNED_BYTE,null),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE);const n=i.createFramebuffer();return i.bindFramebuffer(i.FRAMEBUFFER,n),i.framebufferTexture2D(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,s,0),{fbo:n,tex:s}},b=Math.max(2,e>>1),t=Math.max(2,a>>1),S=c(e,a);this.sceneFbo=S.fbo,this.sceneColorTex=S.tex;const A=c(b,t);this.bloomFboA=A.fbo,this.bloomTexA=A.tex;const p=c(b,t);this.bloomFboB=p.fbo,this.bloomTexB=p.tex,i.bindFramebuffer(i.FRAMEBUFFER,null)}drawInstancedSceneRange(e,a){if(a<=0)return;const i=this.gl,w=e*Re*4;i.bindBuffer(i.ARRAY_BUFFER,this.sceneInstanceBuf),i.vertexAttribPointer(1,4,i.FLOAT,!1,Re*4,w),i.vertexAttribPointer(2,4,i.FLOAT,!1,Re*4,w+16),i.vertexAttribPointer(3,4,i.FLOAT,!1,Re*4,w+32),i.drawArraysInstanced(i.TRIANGLE_STRIP,0,4,a)}syncInteractiveHotspots(e,a,i,w,c,b,t){t.length=0;const S=a.viewRot??0,A=Math.max(.25,a.zoom),p=e.getActiveFestival(),l=this.unlockedZonesScratch;l.clear();for(let s=0;s<e.state.unlockedZones.length;s++)l.add(e.state.unlockedZones[s]);if(!e.state.sandboxMode&&!e.isVisitingNeighbor)for(const s of Ft){if(l.has(s.id))continue;const n=(s.x1+s.x2+1)*.5,u=(s.y1+s.y2+1)*.5,d=Zt(n,u,a,i,w,0);d.sx>=-120&&d.sx<=i+120&&d.sy>=-120&&d.sy<=w+120&&t.push({kind:"zone_plaque",id:s.id,sx:d.sx,sy:d.sy,radius:Math.max(28,42*A)})}const h=e.isVisitingNeighbor?[]:e.ensureNeighborSocial().homeLanternMarks;for(const s of e.state.buildings){const n=Xe(s.itemId);if(!n)continue;const{bw:u,bh:d}=e.getBuildingFootprint(n,s.rotation),{rx0:f,ry0:m,rbw:y,rbh:q}=De(s.gx,s.gy,u,d,S),F=e.grid[s.gy]?.[s.gx]?.elevation??0,R=(f-m+(y-q)*.5)*(Pe*.5),V=(f+y+m+q)*(Ie*.5)-F*Ce,z=i*.5+(R-a.x)*A,I=w*.5+(V-a.y)*A;if(z<-220||z>i+220||I<-60||I>w+280)continue;const ne=(u+d)*(Pe*.5)*A,X=n.spriteScale??(n.width!==n.height?1:1.05),ae=c<s.constructEndsAt?"prop_construction_site":n.isFarmlandPlot?"crop_plot_tilled":it(n.id,n.spriteKey),j=ae?this.sprites.get(ae):void 0,O=Math.max(28,ne*X),Z=j?O*(j.height/j.width):Math.max(26,(n.connectableGroup?.55:1.05)*ne),ee=I-Z*.45,te=at(s.rotation,S,n.width!==n.height,!!n.connectableGroup);if(t.push({kind:"building",id:s.uid,sx:z,sy:ee,radius:Math.max(26,Math.max(O,Z)*.52),spriteKey:ae,flipX:te,boxLeft:z-O*.5,boxTop:I-Z+4*A,boxW:O,boxH:Z}),e.isVisitingNeighbor){e.getVisitedBuildingHelpStatus(s).canHelp&&t.push({kind:"neighbor_help",id:s.uid,sx:z,sy:I-Z*.85,radius:Math.max(22,28*A)});continue}const le=zt(s,n,c,p,b===s.uid);le?.interactiveHotspotKind&&t.push({kind:le.interactiveHotspotKind,id:s.uid,sx:z,sy:I-Z*.82,radius:Math.max(22,28*A)}),((s.readyBubbles??0)>0||(s.readyFarmGoods?.length??0)>0)&&t.push({kind:"bubble",id:s.uid,sx:z,sy:I-Z*.88,radius:Math.max(24,30*A)});const ce=h.find(be=>be.buildingUid===s.uid);ce&&t.push({kind:"home_lantern",id:ce.id,sx:z,sy:I-Z*.92,radius:Math.max(22,28*A)})}for(const s of e.villagers){const n=Me(s.gx,s.gy,S),u=Math.max(0,Math.min(71,Math.floor(s.gx))),d=Math.max(0,Math.min(71,Math.floor(s.gy))),f=e.grid[d]?.[u]?.elevation??0,m=i*.5+(n.wx-a.x)*A,y=w*.5+(n.wy-f*Ce-24-a.y)*A;m>=-60&&m<=i+60&&y>=-60&&y<=w+60&&t.push({kind:"villager",id:s.id,sx:m,sy:y,radius:Math.max(20,26*A)})}for(const s of e.escapedCreatures){const n=Me(s.gx,s.gy,S),u=i*.5+(n.wx-a.x)*A,d=w*.5+(n.wy-18-a.y)*A;t.push({kind:"escaped",id:s.id,sx:u,sy:d,radius:Math.max(22,28*A)})}}renderFrame(e,a,i,w,c,b){if(this.gpuDevice.contextLost)return;const t=this.gl,S=Qt[i.qualityTier],A=Math.max(1,this.canvas.parentElement?.clientWidth||window.innerWidth),p=Math.max(1,this.canvas.parentElement?.clientHeight||window.innerHeight),l=b?.adaptiveDprCap?Math.min(S.dprCap,b.adaptiveDprCap):S.dprCap,h=Math.min(l,window.devicePixelRatio||1),s=Math.max(2,Math.round(A*h)),n=Math.max(2,Math.round(p*h));if((this.canvas.width!==s||this.canvas.height!==n)&&(this.canvas.width=s,this.canvas.height=n),this.lastFrameTs>0){const o=c-this.lastFrameTs;o>0&&o<250&&(this.fpsAccumMs+=o,this.fpsFrames+=1,this.fpsAccumMs>=350&&(this.currentFps=Math.round(this.fpsFrames*1e3/this.fpsAccumMs),this.fpsAccumMs=0,this.fpsFrames=0))}this.lastFrameTs=c;const u=performance.now();this.snapshot.collect(e,a,A,p,c,this,S.maxGrassInstances,S.maxPointLights,w,i.lumosWandEnabled,b),b?.hotspotsOut&&this.syncInteractiveHotspots(e,a,A,p,c,b.selectedBuildingUid??null,b.hotspotsOut);const d=performance.now()-u;this.albedoMipDirty&&(t.bindTexture(t.TEXTURE_2D_ARRAY,this.albedoArrayTex),t.generateMipmap(t.TEXTURE_2D_ARRAY),this.albedoMipDirty=!1),this.uvTableDirty&&(t.bindTexture(t.TEXTURE_2D,this.uvTableTex),t.texSubImage2D(t.TEXTURE_2D,0,0,0,Ge,2,t.RGBA,t.FLOAT,this.uvTableData),this.uvTableDirty=!1),this.uploadedStaticGen!==this.snapshot.staticDirtyGeneration&&(this.uploadedStaticGen=this.snapshot.staticDirtyGeneration,t.bindBuffer(t.ARRAY_BUFFER,this.terrainInstanceBuf),t.bufferData(t.ARRAY_BUFFER,this.snapshot.terrainData.subarray(0,this.snapshot.terrainCount*Be),t.STATIC_DRAW),t.bindBuffer(t.ARRAY_BUFFER,this.waterInstanceBuf),t.bufferData(t.ARRAY_BUFFER,this.snapshot.waterData.subarray(0,this.snapshot.waterCount*Oe),t.STATIC_DRAW),t.bindBuffer(t.ARRAY_BUFFER,this.grassInstanceBuf),t.bufferData(t.ARRAY_BUFFER,this.snapshot.grassData.subarray(0,this.snapshot.grassCount*Ue),t.STATIC_DRAW)),this.snapshot.sceneCount>0&&(t.bindBuffer(t.ARRAY_BUFFER,this.sceneInstanceBuf),t.bufferSubData(t.ARRAY_BUFFER,0,this.snapshot.sceneData.subarray(0,this.snapshot.sceneCount*Re))),this.snapshot.particleCount>0&&(t.bindBuffer(t.ARRAY_BUFFER,this.particleInstanceBuf),t.bufferSubData(t.ARRAY_BUFFER,0,this.snapshot.particleData.subarray(0,this.snapshot.particleCount*We)));const f=this.snapshot.lightCount;for(let o=0;o<f;o++){const x=o*st,M=o*4;this.lightPosUniform[M]=this.snapshot.lightData[x],this.lightPosUniform[M+1]=this.snapshot.lightData[x+1],this.lightPosUniform[M+2]=this.snapshot.lightData[x+2],this.lightPosUniform[M+3]=this.snapshot.lightData[x+3],this.lightColUniform[M]=this.snapshot.lightData[x+4],this.lightColUniform[M+1]=this.snapshot.lightData[x+5],this.lightColUniform[M+2]=this.snapshot.lightData[x+6],this.lightColUniform[M+3]=this.snapshot.lightData[x+7]}const m=this.snapshot.period,y=this.snapshot.weatherKind,q=y==="rain"||y==="storm",F=y==="snow",R=F||this.snapshot.seasonId==="winter"&&!q?1:0,V=m==="dawn"?0:m==="dusk"?2:m==="night"?3:1,z=q?1:F||this.snapshot.seasonId==="winter"?2:0;let I=[1.03,1.03,1.01],ne=[-.42,-.52,.74],X=[.22,.2,.14],ae=[.38,.76,.98],j=[.06,.12,.18],O=.2;m==="dawn"?(I=[1,.97,.92],ne=[.68,-.38,.62],X=[.3,.24,.15],ae=[.46,.76,.95],j=[.06,.11,.16],O=.3):m==="dusk"?(I=[.92,.85,.89],ne=[-.74,-.35,.57],X=[.4,.26,.16],ae=[.84,.58,.52],j=[.07,.06,.16],O=.68):m==="night"&&(I=R>.5?[.8,.87,.99]:[.74,.81,.95],ne=[.35,-.55,.75],X=[.16,.22,.36],ae=[.28,.48,.74],j=[.04,.06,.14],O=.82),q&&(I=[I[0]*.92,I[1]*.94,I[2]*.97],X=[X[0]*.65,X[1]*.68,X[2]*.75],O=Math.max(O,.55));const Z=c*.001;let ee=0;const te=1/Math.max(.15,a.zoom),le=a.x-(b?.shakeX??0)*te,ce=a.y-(b?.shakeY??0)*te,be=S.bloomEnabled&&i.bloomIntensity>.02;if(be?(this.ensureRenderTargets(s,n),t.bindFramebuffer(t.FRAMEBUFFER,this.sceneFbo)):t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,s,n),t.disable(t.BLEND),t.useProgram(this.skyProg),t.uniform1f(this.uLoc(this.skyProg,"uTime"),Z),t.uniform1i(this.uLoc(this.skyProg,"uPeriod"),V),t.uniform1i(this.uLoc(this.skyProg,"uWeather"),z),t.bindVertexArray(this.emptyVao),t.drawArrays(t.TRIANGLES,0,3),ee++,this.snapshot.terrainCount>0&&(t.useProgram(this.terrainProg),t.uniform3f(this.uLoc(this.terrainProg,"uCamera"),le,ce,a.zoom),t.uniform2f(this.uLoc(this.terrainProg,"uViewport"),A,p),t.uniform1f(this.uLoc(this.terrainProg,"uTime"),Z),t.uniform1f(this.uLoc(this.terrainProg,"uWinterSnow"),R),t.uniform3fv(this.uLoc(this.terrainProg,"uAmbientTint"),I),t.uniform1i(this.uLoc(this.terrainProg,"uLightCount"),f),f>0&&(t.uniform4fv(this.uLoc(this.terrainProg,"uLightPosRad"),this.lightPosUniform),t.uniform4fv(this.uLoc(this.terrainProg,"uLightColInt"),this.lightColUniform)),t.bindVertexArray(this.terrainVao),t.drawArraysInstanced(t.TRIANGLE_STRIP,0,4,this.snapshot.terrainCount),ee++),t.enable(t.BLEND),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA),this.snapshot.waterCount>0&&(t.useProgram(this.waterProg),t.uniform3f(this.uLoc(this.waterProg,"uCamera"),le,ce,a.zoom),t.uniform2f(this.uLoc(this.waterProg,"uViewport"),A,p),t.uniform1f(this.uLoc(this.waterProg,"uTime"),Z),t.uniform1f(this.uLoc(this.waterProg,"uWinterSnow"),R),t.uniform3fv(this.uLoc(this.waterProg,"uAmbientTint"),I),t.uniform3fv(this.uLoc(this.waterProg,"uSkyReflectColor"),ae),t.uniform3fv(this.uLoc(this.waterProg,"uSunColor"),X),t.uniform1i(this.uLoc(this.waterProg,"uInteractorCount"),this.snapshot.interactorCount),this.snapshot.interactorCount>0&&t.uniform4fv(this.uLoc(this.waterProg,"uInteractors"),this.snapshot.interactorData),t.uniform1i(this.uLoc(this.waterProg,"uLightCount"),f),f>0&&(t.uniform4fv(this.uLoc(this.waterProg,"uLightPosRad"),this.lightPosUniform),t.uniform4fv(this.uLoc(this.waterProg,"uLightColInt"),this.lightColUniform)),t.bindVertexArray(this.waterVao),t.drawArraysInstanced(t.TRIANGLE_STRIP,0,4,this.snapshot.waterCount),ee++),this.snapshot.grassCount>0&&(t.useProgram(this.grassProg),t.uniform3f(this.uLoc(this.grassProg,"uCamera"),le,ce,a.zoom),t.uniform2f(this.uLoc(this.grassProg,"uViewport"),A,p),t.uniform1f(this.uLoc(this.grassProg,"uTime"),Z),t.uniform1f(this.uLoc(this.grassProg,"uWindStrength"),i.windStrength),t.uniform1f(this.uLoc(this.grassProg,"uWinterSnow"),R),t.uniform3fv(this.uLoc(this.grassProg,"uAmbientTint"),I),t.uniform3fv(this.uLoc(this.grassProg,"uSunColor"),X),t.uniform1i(this.uLoc(this.grassProg,"uInteractorCount"),this.snapshot.interactorCount),this.snapshot.interactorCount>0&&t.uniform4fv(this.uLoc(this.grassProg,"uInteractors"),this.snapshot.interactorData),t.uniform1i(this.uLoc(this.grassProg,"uLightCount"),f),f>0&&(t.uniform4fv(this.uLoc(this.grassProg,"uLightPosRad"),this.lightPosUniform),t.uniform4fv(this.uLoc(this.grassProg,"uLightColInt"),this.lightColUniform)),t.bindVertexArray(this.grassVao),t.drawArraysInstanced(t.TRIANGLE_STRIP,0,4,this.snapshot.grassCount),ee++),this.snapshot.sceneCount>0){t.blendFunc(t.ONE,t.ONE_MINUS_SRC_ALPHA),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D_ARRAY,this.albedoArrayTex),t.activeTexture(t.TEXTURE1),t.bindTexture(t.TEXTURE_2D_ARRAY,this.normalEmissiveArrayTex),t.activeTexture(t.TEXTURE2),t.bindTexture(t.TEXTURE_2D,this.uvTableTex),t.bindVertexArray(this.sceneVao),t.useProgram(this.shadowProg),t.uniform3f(this.uLoc(this.shadowProg,"uCamera"),le,ce,a.zoom),t.uniform2f(this.uLoc(this.shadowProg,"uViewport"),A,p),t.uniform1i(this.uLoc(this.shadowProg,"uAlbedo"),0),t.uniform1i(this.uLoc(this.shadowProg,"uUvTable"),2),t.uniform2f(this.uLoc(this.shadowProg,"uShadowSkew"),this.snapshot.sunShadowDx,this.snapshot.sunShadowDy),t.uniform1f(this.uLoc(this.shadowProg,"uTime"),Z),t.uniform1f(this.uLoc(this.shadowProg,"uWindStrength"),i.windStrength),t.uniform3fv(this.uLoc(this.shadowProg,"uShadowTint"),j),this.drawInstancedSceneRange(0,this.snapshot.sceneCount),ee++,t.useProgram(this.sceneProg),t.uniform3f(this.uLoc(this.sceneProg,"uCamera"),le,ce,a.zoom),t.uniform2f(this.uLoc(this.sceneProg,"uViewport"),A,p),t.uniform1i(this.uLoc(this.sceneProg,"uAlbedo"),0),t.uniform1i(this.uLoc(this.sceneProg,"uNormalEmissive"),1),t.uniform1i(this.uLoc(this.sceneProg,"uUvTable"),2),t.uniform1f(this.uLoc(this.sceneProg,"uTime"),Z),t.uniform1f(this.uLoc(this.sceneProg,"uWindStrength"),i.windStrength),t.uniform3fv(this.uLoc(this.sceneProg,"uAmbientTint"),I),t.uniform3fv(this.uLoc(this.sceneProg,"uSunDir"),ne),t.uniform3fv(this.uLoc(this.sceneProg,"uSunColor"),X),t.uniform1f(this.uLoc(this.sceneProg,"uNormalStrength"),i.normalStrength),t.uniform1f(this.uLoc(this.sceneProg,"uWindowGlowStrength"),O),t.uniform1f(this.uLoc(this.sceneProg,"uWinterSnow"),R),t.uniform1i(this.uLoc(this.sceneProg,"uLightCount"),f),f>0&&(t.uniform4fv(this.uLoc(this.sceneProg,"uLightPosRad"),this.lightPosUniform),t.uniform4fv(this.uLoc(this.sceneProg,"uLightColInt"),this.lightColUniform));const o=jt(this.snapshot.sceneCount,this.snapshot.skeletalSortedIndices,this.snapshot.skeletalCount,this.rangeSlices);let x=!0;for(let M=0;M<o;M++){const k=this.rangeSlices[M];if(k.kind==="instanced_range")x||(t.useProgram(this.sceneProg),t.bindVertexArray(this.sceneVao),x=!0),this.drawInstancedSceneRange(k.firstInstance,k.instanceCount),ee++;else{const D=this.snapshot.skeletalPoses[k.skeletalSlotIndex];D&&(this.spineAdapter.renderArticulatedSlot(D,le,ce,a.zoom,A,p,Z,I,this.albedoArrayTex,this.uvTableTex),x=!1,ee++)}}}if(this.snapshot.particleCount>0){const o=R>.5||F;o?t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA):t.blendFunc(t.SRC_ALPHA,t.ONE),t.useProgram(this.particleProg),t.uniform3f(this.uLoc(this.particleProg,"uCamera"),le,ce,a.zoom),t.uniform2f(this.uLoc(this.particleProg,"uViewport"),A,p),t.uniform1f(this.uLoc(this.particleProg,"uIsSnow"),o?1:0),t.bindVertexArray(this.particleVao),t.drawArraysInstanced(t.TRIANGLE_STRIP,0,4,this.snapshot.particleCount),ee++}if(be&&this.sceneColorTex&&this.bloomFboA&&this.bloomFboB&&this.bloomTexA&&this.bloomTexB){t.disable(t.BLEND);const o=Math.max(2,s>>1),x=Math.max(2,n>>1);t.bindVertexArray(this.emptyVao),t.bindFramebuffer(t.FRAMEBUFFER,this.bloomFboA),t.viewport(0,0,o,x),t.useProgram(this.bloomExtractProg),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.sceneColorTex),t.uniform1i(this.uLoc(this.bloomExtractProg,"uScene"),0),t.drawArrays(t.TRIANGLES,0,3),ee++,t.useProgram(this.bloomBlurProg),t.uniform1i(this.uLoc(this.bloomBlurProg,"uTex"),0),t.bindFramebuffer(t.FRAMEBUFFER,this.bloomFboB),t.bindTexture(t.TEXTURE_2D,this.bloomTexA),t.uniform2f(this.uLoc(this.bloomBlurProg,"uOffset"),1.5/o,1.5/x),t.drawArrays(t.TRIANGLES,0,3),ee++,t.bindFramebuffer(t.FRAMEBUFFER,this.bloomFboA),t.bindTexture(t.TEXTURE_2D,this.bloomTexB),t.uniform2f(this.uLoc(this.bloomBlurProg,"uOffset"),3.2/o,3.2/x),t.drawArrays(t.TRIANGLES,0,3),ee++,t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,s,n),t.useProgram(this.compositeProg),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.sceneColorTex),t.uniform1i(this.uLoc(this.compositeProg,"uScene"),0),t.activeTexture(t.TEXTURE1),t.bindTexture(t.TEXTURE_2D,this.bloomTexA),t.uniform1i(this.uLoc(this.compositeProg,"uBloom"),1),t.uniform1f(this.uLoc(this.compositeProg,"uBloomIntensity"),i.bloomIntensity),t.drawArrays(t.TRIANGLES,0,3),ee++}t.bindVertexArray(null);const Ae=this.shelf.layer+1,Ee=this.useHalfFloatFbo?8:4,P=be?s*n*1.5*Ee/(1024*1024):0;this.stats={backend:"webgl2",fps:this.currentFps,cpuCollectMs:Number(d.toFixed(2)),drawCalls:ee,terrainTiles:this.snapshot.terrainCount,waterTiles:this.snapshot.waterCount,grassInstances:this.snapshot.grassCount,sortedSprites:this.snapshot.sceneCount,particleInstances:this.snapshot.particleCount,activeLights:f,atlasLayers:Ae,atlasSpritesPacked:this.nextSpriteId,vramEstimateMb:Number((this.atlasBudget.allocatedAtlasVramMb+P).toFixed(1))}}destroy(){const e=this.gl;this.spineAdapter.destroy(),e.deleteProgram(this.bakeNormalProg),e.deleteProgram(this.skyProg),e.deleteProgram(this.terrainProg),e.deleteProgram(this.waterProg),e.deleteProgram(this.grassProg),e.deleteProgram(this.shadowProg),e.deleteProgram(this.sceneProg),e.deleteProgram(this.particleProg),e.deleteProgram(this.bloomExtractProg),e.deleteProgram(this.bloomBlurProg),e.deleteProgram(this.compositeProg),e.deleteVertexArray(this.emptyVao),e.deleteVertexArray(this.terrainVao),e.deleteVertexArray(this.waterVao),e.deleteVertexArray(this.grassVao),e.deleteVertexArray(this.sceneVao),e.deleteVertexArray(this.particleVao),e.deleteBuffer(this.diamondBuf),e.deleteBuffer(this.uprightBuf),e.deleteBuffer(this.centeredBuf),e.deleteBuffer(this.terrainInstanceBuf),e.deleteBuffer(this.waterInstanceBuf),e.deleteBuffer(this.grassInstanceBuf),e.deleteBuffer(this.sceneInstanceBuf),e.deleteBuffer(this.particleInstanceBuf),e.deleteTexture(this.albedoArrayTex),e.deleteTexture(this.normalEmissiveArrayTex),e.deleteTexture(this.uvTableTex),this.sceneColorTex&&e.deleteTexture(this.sceneColorTex),this.bloomTexA&&e.deleteTexture(this.bloomTexA),this.bloomTexB&&e.deleteTexture(this.bloomTexB),e.deleteFramebuffer(this.bakeFbo),this.sceneFbo&&e.deleteFramebuffer(this.sceneFbo),this.bloomFboA&&e.deleteFramebuffer(this.bloomFboA),this.bloomFboB&&e.deleteFramebuffer(this.bloomFboB),this.gpuDevice.destroy()}}export{Yo as WebGL2WorldRenderer,fo as canSpriteReceiveWinterSnowCap,xo as computeWebGL2AtlasBudget,vo as shouldCleanseSpriteBakedHalo};
