var Pt=Object.defineProperty;var Ct=(p,o,i)=>o in p?Pt(p,o,{enumerable:!0,configurable:!0,writable:!0,value:i}):p[o]=i;var n=(p,o,i)=>Ct(p,typeof o!="symbol"?o+"":o,i);import{G as me,g as Oe,F as $e,P as ct,Z as Et}from"./game-data-D8DCwVFZ.js";import{M as je,a as Lt,e as ht,b as Dt,c as Ft,r as It,d as ot,g as Mt,f as Ut,W as Bt,h as Wt,j as kt,k as Vt,l as Ht,s as Nt}from"./engine-RoUZzWcw.js";import{b as Fe,w as Ie,E as Le,h as Gt,f as Je,T as Ce,a as Me,g as Yt}from"./sim-foundation-CX7X9Dgh.js";import"./sim-world-DqMGosfr.js";import"./sim-data--dOP_gHZ.js";import"./hpvn-platform-B1Lovr2y.js";const Xt={low:{tier:"low",maxGrassInstances:800,maxPointLights:4,bloomEnabled:!1,dprCap:1.35},medium:{tier:"medium",maxGrassInstances:2500,maxPointLights:8,bloomEnabled:!0,dprCap:1.75},high:{tier:"high",maxGrassInstances:6e3,maxPointLights:16,bloomEnabled:!0,dprCap:2}};class Ot{constructor(o){n(this,"preference","webgl");n(this,"canvas");n(this,"gl");n(this,"supportsHalfFloatHdr");n(this,"contextLost",!1);n(this,"handleLost");n(this,"handleRestored");this.canvas=o.canvas;const i=o.canvas.getContext("webgl2",{alpha:!1,antialias:!1,depth:!1,stencil:!0,powerPreference:"high-performance",preserveDrawingBuffer:o.preserveDrawingBuffer??!0});if(!i)throw new Error("[PixiGpuDevice] Thiết bị không hỗ trợ WebGL2.");this.gl=i;const e=i.getExtension("EXT_color_buffer_float"),x=i.getExtension("OES_texture_float_linear");this.supportsHalfFloatHdr=!!(e&&x),this.handleLost=u=>{u.preventDefault(),this.contextLost=!0,o.onContextLost?.()},this.handleRestored=()=>{this.contextLost=!1,o.onContextRestored?.()},this.canvas.addEventListener("webglcontextlost",this.handleLost,!1),this.canvas.addEventListener("webglcontextrestored",this.handleRestored,!1)}resetSharedGlState(){this.gl.bindVertexArray(null)}destroy(){this.canvas.removeEventListener("webglcontextlost",this.handleLost,!1),this.canvas.removeEventListener("webglcontextrestored",this.handleRestored,!1)}}function zt(p,o,i,e){let x=0;const u=(t,w,d,l)=>{if(x<e.length){const r=e[x];r.kind=t,r.firstInstance=w,r.instanceCount=d,r.skeletalSlotIndex=l}else e.push({kind:t,firstInstance:w,instanceCount:d,skeletalSlotIndex:l});x++};if(p<=0)return 0;if(i<=0)return u("instanced_range",0,p,-1),x;let m=0;for(let t=0;t<i;t++){const w=o[t];w<m||w>=p||(w>m&&u("instanced_range",m,w-m,-1),u("skeletal_slot",w,1,t),m=w+1)}return m<p&&u("instanced_range",m,p-m,-1),x}const Kt=`#version 300 es
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
`,Qt=`#version 300 es
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
`,qt=`#version 300 es
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
`,Zt=`#version 300 es
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
`;function ut(p,o,i){const e=p.createShader(p.VERTEX_SHADER);p.shaderSource(e,o),p.compileShader(e);const x=p.createShader(p.FRAGMENT_SHADER);p.shaderSource(x,i),p.compileShader(x);const u=p.createProgram();return p.attachShader(u,e),p.attachShader(u,x),p.linkProgram(u),p.deleteShader(e),p.deleteShader(x),u}class $t{constructor(o){n(this,"gl");n(this,"prog");n(this,"vao");n(this,"vbo");n(this,"ibo");n(this,"indexCount");n(this,"uAlbedoLoc");n(this,"uUvTableLoc");n(this,"uCameraLoc");n(this,"uViewportLoc");n(this,"uPoseRectLoc");n(this,"uBoneParamsLoc");n(this,"uPoseExtraLoc");n(this,"uAmbientTintLoc");n(this,"uAlphaLoc");n(this,"spineProg");n(this,"spineVao");n(this,"spineVbo");n(this,"spineIbo");n(this,"uSpineAtlasLoc");n(this,"uSpineCameraLoc");n(this,"uSpineViewportLoc");n(this,"uSpineAmbientLoc");n(this,"uSpineAlphaLoc");n(this,"spineVertData",new Float32Array(je*4*6));n(this,"evaluator",new Lt);n(this,"spineAtlasTex",null);n(this,"externalSpineLoaded",!1);this.gl=o;const i=ut(o,Kt,Qt);this.prog=i,this.uAlbedoLoc=o.getUniformLocation(i,"uAlbedo"),this.uUvTableLoc=o.getUniformLocation(i,"uUvTable"),this.uCameraLoc=o.getUniformLocation(i,"uCamera"),this.uViewportLoc=o.getUniformLocation(i,"uViewport"),this.uPoseRectLoc=o.getUniformLocation(i,"uPoseRect"),this.uBoneParamsLoc=o.getUniformLocation(i,"uBoneParams"),this.uPoseExtraLoc=o.getUniformLocation(i,"uPoseExtra"),this.uAmbientTintLoc=o.getUniformLocation(i,"uAmbientTint"),this.uAlphaLoc=o.getUniformLocation(i,"uAlpha");const e=8,x=10,u=[],m=[];for(let c=0;c<=x;c++){const s=c/x;for(let h=0;h<=e;h++){const y=h/e-.5;u.push(y,s)}}const t=e+1;for(let c=0;c<x;c++)for(let s=0;s<e;s++){const h=c*t+s,y=h+1,f=h+t,R=f+1;m.push(h,y,f,y,R,f)}this.indexCount=m.length,this.vao=o.createVertexArray(),o.bindVertexArray(this.vao),this.vbo=o.createBuffer(),o.bindBuffer(o.ARRAY_BUFFER,this.vbo),o.bufferData(o.ARRAY_BUFFER,new Float32Array(u),o.STATIC_DRAW),o.enableVertexAttribArray(0),o.vertexAttribPointer(0,2,o.FLOAT,!1,0,0),this.ibo=o.createBuffer(),o.bindBuffer(o.ELEMENT_ARRAY_BUFFER,this.ibo),o.bufferData(o.ELEMENT_ARRAY_BUFFER,new Uint16Array(m),o.STATIC_DRAW),o.bindVertexArray(null);const w=ut(o,qt,Zt);this.spineProg=w,this.uSpineAtlasLoc=o.getUniformLocation(w,"uSpineAtlas"),this.uSpineCameraLoc=o.getUniformLocation(w,"uCamera"),this.uSpineViewportLoc=o.getUniformLocation(w,"uViewport"),this.uSpineAmbientLoc=o.getUniformLocation(w,"uAmbientTint"),this.uSpineAlphaLoc=o.getUniformLocation(w,"uAlpha");const d=new Uint16Array(je*6);for(let c=0;c<je;c++){const s=c*4,h=c*6;d[h]=s,d[h+1]=s+1,d[h+2]=s+2,d[h+3]=s,d[h+4]=s+2,d[h+5]=s+3}this.spineVao=o.createVertexArray(),o.bindVertexArray(this.spineVao),this.spineVbo=o.createBuffer(),o.bindBuffer(o.ARRAY_BUFFER,this.spineVbo),o.bufferData(o.ARRAY_BUFFER,this.spineVertData.byteLength,o.DYNAMIC_DRAW);const l=4,r=6*l;o.enableVertexAttribArray(0),o.vertexAttribPointer(0,2,o.FLOAT,!1,r,0),o.enableVertexAttribArray(1),o.vertexAttribPointer(1,2,o.FLOAT,!1,r,2*l),o.enableVertexAttribArray(2),o.vertexAttribPointer(2,2,o.FLOAT,!1,r,4*l),this.spineIbo=o.createBuffer(),o.bindBuffer(o.ELEMENT_ARRAY_BUFFER,this.spineIbo),o.bufferData(o.ELEMENT_ARRAY_BUFFER,d,o.STATIC_DRAW),o.bindVertexArray(null),ht()}ensureSpineAtlasTexture(o){if(this.spineAtlasTex)return this.spineAtlasTex;const i=this.gl,e=i.createTexture();return i.activeTexture(i.TEXTURE3),i.bindTexture(i.TEXTURE_2D,e),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0),i.texImage2D(i.TEXTURE_2D,0,i.RGBA,i.RGBA,i.UNSIGNED_BYTE,o),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),i.activeTexture(i.TEXTURE0),this.spineAtlasTex=e,this.externalSpineLoaded=!0,e}renderArticulatedSlot(o,i,e,x,u,m,t,w,d,l){const r=this.gl,c=ht();if(c.ready&&c.skeleton&&c.atlasImage){const s=this.evaluator.evaluate(c.skeleton,o,t);if(s>0){const h=this.ensureSpineAtlasTexture(c.atlasImage),y=this.evaluator.quads,f=this.spineVertData;for(let R=0;R<s;R++){const _=R*Dt,S=R*24,ee=y[_+8],W=y[_+9],E=y[_+10],O=y[_+11],L=y[_+12],N=y[_+13];f[S]=y[_],f[S+1]=y[_+1],f[S+2]=ee,f[S+3]=W,f[S+4]=L,f[S+5]=N,f[S+6]=y[_+2],f[S+7]=y[_+3],f[S+8]=E,f[S+9]=W,f[S+10]=L,f[S+11]=N,f[S+12]=y[_+4],f[S+13]=y[_+5],f[S+14]=E,f[S+15]=O,f[S+16]=L,f[S+17]=N,f[S+18]=y[_+6],f[S+19]=y[_+7],f[S+20]=ee,f[S+21]=O,f[S+22]=L,f[S+23]=N}r.useProgram(this.spineProg),r.activeTexture(r.TEXTURE3),r.bindTexture(r.TEXTURE_2D,h),r.uniform1i(this.uSpineAtlasLoc,3),r.uniform3f(this.uSpineCameraLoc,i,e,x),r.uniform2f(this.uSpineViewportLoc,u,m),r.uniform3fv(this.uSpineAmbientLoc,w),r.uniform1f(this.uSpineAlphaLoc,o.alpha),r.bindVertexArray(this.spineVao),r.bindBuffer(r.ARRAY_BUFFER,this.spineVbo),r.bufferSubData(r.ARRAY_BUFFER,0,f.subarray(0,s*24)),r.drawElements(r.TRIANGLES,s*6,r.UNSIGNED_SHORT,0),r.activeTexture(r.TEXTURE0);return}}r.useProgram(this.prog),r.activeTexture(r.TEXTURE0),r.bindTexture(r.TEXTURE_2D_ARRAY,d),r.activeTexture(r.TEXTURE2),r.bindTexture(r.TEXTURE_2D,l),r.uniform1i(this.uAlbedoLoc,0),r.uniform1i(this.uUvTableLoc,2),r.uniform3f(this.uCameraLoc,i,e,x),r.uniform2f(this.uViewportLoc,u,m),r.uniform4f(this.uPoseRectLoc,o.wx,o.wy,o.drawW,o.drawH),r.uniform4f(this.uBoneParamsLoc,t,o.walkPhase,o.isWalking?1:0,o.spriteId),r.uniform4f(this.uPoseExtraLoc,o.greetWave??0,o.tendingLean??0,o.phaseSeed??0,0),r.uniform3fv(this.uAmbientTintLoc,w),r.uniform1f(this.uAlphaLoc,o.alpha),r.bindVertexArray(this.vao),r.drawElements(r.TRIANGLES,this.indexCount,r.UNSIGNED_SHORT,0)}destroy(){const o=this.gl;o.deleteProgram(this.prog),o.deleteVertexArray(this.vao),o.deleteBuffer(this.vbo),o.deleteBuffer(this.ibo),o.deleteProgram(this.spineProg),o.deleteVertexArray(this.spineVao),o.deleteBuffer(this.spineVbo),o.deleteBuffer(this.spineIbo),this.spineAtlasTex&&(o.deleteTexture(this.spineAtlasTex),this.spineAtlasTex=null)}}const Be=8,ze=6,We=6,Pe=12,it=8,dt=4,ke=6,ce=2048,ft=8e3,vt=16,pt=16,et=200,jt=new Set(["yule_goblet_blue_brazier","yule_hermione_bluebell_jars","yule_stag_patronus_topiary","yule_ice_phoenix_fountain","yule_ice_stag_sculpture","yule_ice_swan_arch","yule_sword_frozen_pool","yule_mirror_of_erised","yule_castle_snowglobe","yule_crystal_banquet_table","yule_crystal_lotus_fountain_pot","yule_blue_spruce_starlight","yule_hogwarts_boathouse_ice"]),Jt=new Set(["yule_glowing_puffapod_bush","yule_birch_fairy_grove","yule_weasley_wheezes_facade","yule_poinsettia_cauldron","yule_sugarplum_tower"]),eo=new Set(["yule_slytherin_serpent_mascot","yule_four_house_hourglasses"]);function mt(p){if(!p.startsWith("yule_"))return null;if(jt.has(p))return{family:"ice-patronus",rgb:[.28,.8,1],radius:175,intensity:1.38,emissiveBoost:1.28,activeInDaySnow:!0};if(Jt.has(p))return{family:"fairy-violet",rgb:[.94,.52,1],radius:170,intensity:1.25,emissiveBoost:1.18,activeInDaySnow:!1};if(eo.has(p))return{family:"slytherin-emerald",rgb:[.2,.94,.62],radius:155,intensity:1.16,emissiveBoost:1.12,activeInDaySnow:!1};const o=p==="yule_mini_hogwarts_castle"||p==="yule_great_hall_tree"||p==="yule_gringotts_dragon_dome"||p==="yule_hogwarts_snow_loco";return{family:"festive-gold",rgb:[1,.76,.3],radius:o?215:162,intensity:o?1.44:1.08,emissiveBoost:o?1.26:1.05,activeInDaySnow:!1,secondaryLakePool:p==="yule_mini_hogwarts_castle"}}const Ge=32,to=[[2,17,"env_bush_flowers",1.02,!1],[2,20,"env_mossy_rock",.96,!0],[2,24,"env_bush_flowers",1.05,!0],[2,28,"env_flower_patch",.98,!1],[5,19,"env_mossy_rock",.92,!1],[5,25,"env_mossy_rock",.95,!0],[7,17,"env_bush_flowers",.98,!1],[7,21,"env_flower_patch",1.04,!0],[7,27,"env_bush_flowers",1.02,!0],[8,19,"env_flower_patch",.96,!1],[11,21,"env_bush_flowers",.95,!1],[15,28,"env_flower_patch",1,!0],[22,21,"env_bush_flowers",1.02,!0],[22,26,"env_flower_patch",.98,!1],[24,17,"env_bush_flowers",1.04,!1],[28,18,"env_mossy_rock",.94,!0],[30,23,"env_bush_flowers",1.05,!1],[33,21,"env_flower_patch",1.02,!0]],oo=[[4,22,4.18,22.25],[4,34,4.55,34.25]];function de(p,o){let i=p*374761393+o*668265263|0;return i=(i^i>>>13)*1274126177|0,((i^i>>>16)>>>0)/4294967295}function io(p,o){if(!p)return o;const i=p.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);return i?[Number(i[1])/255,Number(i[2])/255,Number(i[3])/255]:o}class ao{constructor(){n(this,"terrainData",new Float32Array(me*me*Be));n(this,"terrainCount",0);n(this,"waterData",new Float32Array(me*me*ze));n(this,"waterCount",0);n(this,"grassData",new Float32Array(ft*We));n(this,"grassCount",0);n(this,"staticDirtyGeneration",0);n(this,"cachedStaticKey","");n(this,"sceneData",new Float32Array(ce*Pe));n(this,"sceneSpriteIds",new Uint16Array(ce));n(this,"sceneTintFlags",new Uint8Array(ce));n(this,"sceneCount",0);n(this,"skeletalSortedIndices",new Int32Array(Ge));n(this,"skeletalPoses",Array.from({length:Ge},()=>({villagerId:"molly",wx:0,wy:0,drawW:0,drawH:0,spriteId:0,walkPhase:0,isWalking:!1,facingLeft:!1,alpha:1,greetWave:0,tendingLean:0,phaseSeed:0})));n(this,"rawSkeletalPoses",Array.from({length:Ge},()=>({villagerId:"molly",wx:0,wy:0,drawW:0,drawH:0,spriteId:0,walkPhase:0,isWalking:!1,facingLeft:!1,alpha:1,greetWave:0,tendingLean:0,phaseSeed:0})));n(this,"skeletalCount",0);n(this,"chimneyEmitters",new Float32Array(36));n(this,"chimneyCount",0);n(this,"lightData",new Float32Array(vt*it));n(this,"lightCount",0);n(this,"interactorData",new Float32Array(pt*dt));n(this,"interactorCount",0);n(this,"particleData",new Float32Array(et*ke));n(this,"particleCount",0);n(this,"period","day");n(this,"weatherKind","sunny");n(this,"seasonId","spring");n(this,"sunShadowDx",9);n(this,"sunShadowDy",4.5);n(this,"lockedScenery",Ft());n(this,"unlockedZonesSet",new Set);n(this,"slots",Array.from({length:ce},()=>({rxMin:0,ryMin:0,rxMax:0,ryMax:0,depth:0,wx:0,wy:0,drawW:0,drawH:0,spriteId:0,swayAmp:0,rotRad:0,pivotY:0,alpha:1,tintFlag:0,skeletalPoseIdx:-1,shadowScale:1,emissiveBoost:0,phaseSeed:0,extraCount:0,extraStart:0})));n(this,"extras",Array.from({length:ce},()=>({wx:0,wy:0,drawW:0,drawH:0,spriteId:0,swayAmp:0,rotRad:0,pivotY:0,alpha:1,tintFlag:0,emissiveBoost:0,phaseSeed:0})));n(this,"topoHead",new Int32Array(ce));n(this,"topoTail",new Int32Array(ce));n(this,"topoInDeg",new Int32Array(ce));n(this,"topoReady",new Int32Array(ce));n(this,"topoEmitted",new Uint8Array(ce));n(this,"topoEdgeCap",8192);n(this,"topoNext",new Int32Array(8192));n(this,"topoTo",new Int32Array(8192));n(this,"lightCandidates",Array.from({length:128},()=>({distSq:0,wx:0,wy:0,z:0,radius:0,r:1,g:1,b:1,intensity:1})))}get terrainRevision(){return this.staticDirtyGeneration}ensureEdgeCap(o){if(o<=this.topoEdgeCap)return;this.topoEdgeCap=Math.max(this.topoEdgeCap*2,o);const i=new Int32Array(this.topoEdgeCap),e=new Int32Array(this.topoEdgeCap);i.set(this.topoNext),e.set(this.topoTo),this.topoNext=i,this.topoTo=e}collect(o,i,e,x,u,m,t,w,d,l,r){const c=i.viewRot??0;this.period=o.getRealTimePeriod();const s=o.getCurrentWeather(u);this.weatherKind=s.kind;const y=(o.state?.settings?.yuleThemeMode??"auto")==="off"?o.state?.settings?.activeFestival==="christmas":typeof o.isWinterMainMapActive=="function"&&o.isWinterMainMapActive()||o.getActiveFestival()==="christmas"||typeof o.isYuleVisualThemeActive=="function"&&o.isYuleVisualThemeActive(),f=It(o.state.level??1,y?"winter":"auto");this.seasonId=f.id,this.period==="dawn"?(this.sunShadowDx=14,this.sunShadowDy=5.5):this.period==="dusk"?(this.sunShadowDx=-15,this.sunShadowDy=6):this.period==="night"?(this.sunShadowDx=8,this.sunShadowDy=4.5):(this.sunShadowDx=9.5,this.sunShadowDy=4.2),this.unlockedZonesSet.clear();for(const _ of o.state.unlockedZones)this.unlockedZonesSet.add(_);const R=`${o.stateRevision}|${c}|${f.id}|${y?1:0}|${o.state.sandboxMode?1:0}|${t}`;this.cachedStaticKey!==R&&(this.cachedStaticKey=R,this.rebuildStaticValleyBuffers(o,c,y,f.id,t),this.staticDirtyGeneration++),this.collectInteractors(o,c,d),this.collectSortedSceneAndLights(o,i,e,x,u,m,w,d,l,r),this.collectAtmosphericParticles(i,u)}rebuildStaticValleyBuffers(o,i,e,x,u){let m=0,t=0;const w=[];for(let r=0;r<me;r++){const c=o.grid[r];for(let s=0;s<me;s++){const h=c[s],y=o.state.sandboxMode||this.unlockedZonesSet.has(h.zoneId),{rx0:f,ry0:R}=Fe(s,r,1,1,i),_=h.elevation??0,S=(f-R)*(Ce*.5),ee=(f+R+1)*(Me*.5)-_*Le,W=de(s,r);if(h.terrain==="water"){let G=0;const Y=[[s,r-1],[s+1,r],[s,r+1],[s-1,r]];for(const[Se,be]of Y)if(o.grid[be]?.[Se]?.terrain!=="water"){const{rx0:Ee,ry0:Z}=Fe(Se,be,1,1,i),ie=Ee-f,b=Z-R;b===-1?G|=1:ie===1?G|=2:b===1?G|=4:ie===-1&&(G|=8)}const fe=G===0?1:.42,j=t*ze;this.waterData[j]=S,this.waterData[j+1]=ee,this.waterData[j+2]=G,this.waterData[j+3]=fe,this.waterData[j+4]=y?1:.55,this.waterData[j+5]=W,t++;continue}let E=.36,O=.63,L=.175,N=0;const oe=h.terrain;oe==="snow"?(E=.92,O=.95,L=.99,N=3):oe==="stone"?(E=.82+(W-.5)*.03,O=.74+(W-.5)*.03,L=.61+(W-.5)*.025,N=2):oe==="forest"?(E=.26,O=.55,L=.175,N=1):(N=0,x==="autumn"?(E=.42,O=.63,L=.165):(E=.365,O=.655,L=.168)),y||(E=E*.9+.06,O=O*.91+.06,L=L*.92+.07);let Q=0;h.path==="cobble"?Q=1:h.path==="wood_pier"?Q=2:h.path!=="none"&&(Q=3);let re=0;if(Q>0){let G=0;const Y=[[s,r-1],[s+1,r],[s,r+1],[s-1,r]];for(const[fe,j]of Y){const Se=o.grid[j]?.[fe];if(!Se||Se.path==="none"){const{rx0:be,ry0:Ee}=Fe(fe,j,1,1,i),Z=be-f,ie=Ee-R;ie===-1?G|=1:Z===1?G|=2:ie===1?G|=4:Z===-1&&(G|=8)}}re=Q+G*4}const q=m*Be;this.terrainData[q]=S,this.terrainData[q+1]=ee,this.terrainData[q+2]=E,this.terrainData[q+3]=O,this.terrainData[q+4]=L,this.terrainData[q+5]=re,this.terrainData[q+6]=_+(y?0:10),this.terrainData[q+7]=N,m++,y&&(h.terrain==="grass"||h.terrain==="forest")&&h.path==="none"&&!h.buildingUid&&w.push([S,ee,W])}}this.terrainCount=m,this.waterCount=t;const d=Math.min(ft,Math.max(0,u));let l=0;if(w.length>0&&d>0){const r=Math.max(2,Math.min(5,Math.ceil(d*1.65/w.length)));for(let c=0;c<w.length&&l<d;c++){const[s,h,y]=w[c],f=h*1.9,R=Math.sin(s*.017+f*.015)+Math.cos(s*.026-f*.021)+.55*Math.sin(s*.051+f*.043);if(R<-.05){if(de(c*19,311)>.9&&l<d){const O=(de(c*7,41)-.5)*(Ce*.45),L=(de(c*11,83)-1)*(Me*.45),N=l*We;this.grassData[N]=s+O,this.grassData[N+1]=h+L,this.grassData[N+2]=6.5+y*2.5,this.grassData[N+3]=y,this.grassData[N+4]=y*6.28318,this.grassData[N+5]=0,l++}continue}const _=Math.min(1,(R+.05)/1.85),S=Math.max(1,Math.round(1+_*(r-1))),ee=.25+de(c*5,67)*.5,W=.25+de(c*9,131)*.5,E=R>.58&&de(c*17,257)>.42;for(let O=0;O<S&&l<d;O++){const L=de(c*13+O*7,91),N=de(c*29+O*11,173),oe=Math.max(.08,Math.min(.92,ee+(L-.5)*.58)),Q=Math.max(.08,Math.min(.92,W+(N-.5)*.58)),re=(oe-Q)*(Ce*.42),q=(oe+Q-1)*(Me*.42),G=E&&de(c+O*31,409)>.56?1:0,Y=l*We;this.grassData[Y]=s+re,this.grassData[Y+1]=h+q,this.grassData[Y+2]=(G>.5?8.2:7.2)+de(c*3+O,53)*4.4,this.grassData[Y+3]=de(c*23+O*17,509),this.grassData[Y+4]=(L*6.28318+N*3.14159)%6.28318,this.grassData[Y+5]=G,l++}}}this.grassCount=l}collectInteractors(o,i,e){let x=0;e.active&&(this.interactorData[0]=e.wx,this.interactorData[1]=e.wy,this.interactorData[2]=66,this.interactorData[3]=1.35,x=1);for(let u=0;u<o.villagers.length&&x<pt;u++){const m=o.villagers[u],t=Math.max(0,Math.min(me-1,Math.floor(m.gx))),w=Math.max(0,Math.min(me-1,Math.floor(m.gy))),d=o.grid[w]?.[t]?.elevation??0,l=Ie(m.gx,m.gy,i),r=x*dt;this.interactorData[r]=l.wx,this.interactorData[r+1]=l.wy-d*Le,this.interactorData[r+2]=34,this.interactorData[r+3]=.95,x++}this.interactorCount=x}collectSortedSceneAndLights(o,i,e,x,u,m,t,w,d,l){const r=i.viewRot??0,c=!!o.state.settings.cutawayMode,s=typeof window<"u"&&!!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,h=1/Math.max(.15,i.zoom),y=(e*.5+380)*h,f=(x*.5+420)*h,R=i.x-y,_=i.x+y,S=i.y-f,ee=i.y+f;let W=0,E=0,O=0,L=0;this.chimneyCount=0;const N=!!(o.state.supply.activeBrew&&o.state.supply.activeBrew.endsAt>u),oe=l?.bulldozerActive&&l.hoverTile?o.grid[l.hoverTile.gy]?.[l.hoverTile.gx]?.buildingUid??null:null,Q=Gt(i),re=Ie(Q.fgx,Q.fgy,r),q=(b,a,g,z,X,D,F,I)=>{if(L>=this.lightCandidates.length)return;const k=b-re.wx,B=a-re.wy,T=this.lightCandidates[L++];T.distSq=k*k+B*B,T.wx=b,T.wy=a,T.z=g,T.radius=z,T.r=X,T.g=D,T.b=F,T.intensity=I},G=this.period==="night"||this.period==="dusk",Y=m.resolve("hogsmeade_stone_bridge");if(Y)for(const[b,a,g,z]of oo){const X=o.grid[a]?.[b];if(!X||X.buildingUid||X.terrain!=="water"||!o.state.sandboxMode&&!this.unlockedZonesSet.has(X.zoneId))continue;const D=Ie(g,z,r),F=D.wy-X.elevation*Le+12;if(D.wx<R||D.wx>_||F<S||F>ee)continue;if(W>=ce)break;const{rx0:I,ry0:k,rbw:B,rbh:T}=Fe(b-1,a,3,1,r),V=148,H=V*(Y.height/Y.width),M=this.slots[W++];M.rxMin=I+.05,M.ryMin=k+.05,M.rxMax=I+B-.05,M.ryMax=k+T-.05,M.depth=I+B+k+T-.12,M.wx=D.wx,M.wy=F,M.drawW=V,M.drawH=H,M.spriteId=Y.id,M.swayAmp=0,M.rotRad=0,M.pivotY=0,M.alpha=1,M.tintFlag=0,M.skeletalPoseIdx=-1,M.shadowScale=.85,M.emissiveBoost=.35,M.phaseSeed=b*.7+a,M.extraCount=0,M.extraStart=0,G&&q(D.wx,F-14,30,155,1,.76,.3,1.25)}const fe=new Map;for(let b=0;b<o.state.buildings.length;b++){const a=o.state.buildings[b];fe.set(a.uid,a)}let j=null;if(l?.hoverTile&&!l.bulldozerActive){const b=l.movingBuildingUid?fe.get(l.movingBuildingUid):void 0,a=l.selectedCatalogItem??(b?Oe(b.itemId):void 0);if(a?.connectableGroup){const g=l.rotation??0;if(o.canPlaceItem(a,l.hoverTile.gx,l.hoverTile.gy,g,l.movingBuildingUid??void 0).ok){const{bw:z,bh:X}=o.getBuildingFootprint(a,g);j={gx:l.hoverTile.gx,gy:l.hoverTile.gy,bw:z,bh:X,elev:o.grid[l.hoverTile.gy]?.[l.hoverTile.gx]?.elevation??0,group:a.connectableGroup}}}}const Se=(b,a,g,z,X,D)=>{const{rx0:F,ry0:I}=Fe(b,a,g,z,r),k=(T,V)=>{const{gx:H,gy:M}=kt(T,V,r);if(H<0||M<0||H>=me||M>=me)return!1;if(j&&j.group===D&&j.elev===X&&H>=j.gx&&H<j.gx+j.bw&&M>=j.gy&&M<j.gy+j.bh)return!0;const P=o.grid[M]?.[H];if(!P||!P.buildingUid||P.buildingUid===l?.movingBuildingUid||(P.elevation??0)!==X)return!1;const K=fe.get(P.buildingUid);return!K||u<K.constructEndsAt?!1:Oe(K.itemId)?.connectableGroup===D};let B=0;return k(F-1,I)&&(B|=1),k(F-1,I+1)&&(B|=2),k(F,I-1)&&(B|=4),k(F+1,I-1)&&(B|=8),k(F+2,I)&&(B|=16),k(F+2,I+1)&&(B|=32),k(F,I+2)&&(B|=64),k(F+1,I+2)&&(B|=128),k(F-1,I-1)&&(B|=256),k(F+2,I-1)&&(B|=512),k(F+2,I+2)&&(B|=1024),k(F-1,I+2)&&(B|=2048),B};for(let b=0;b<o.state.buildings.length&&W<ce;b++){const a=o.state.buildings[b],g=Oe(a.itemId);if(!g)continue;const{bw:z,bh:X}=o.getBuildingFootprint(g,a.rotation),{rx0:D,ry0:F,rbw:I,rbh:k}=Fe(a.gx,a.gy,z,X,r),B=o.grid[a.gy]?.[a.gx]?.elevation??0,T=(D-F+(I-k)*.5)*(Ce*.5),V=(D+I+F+k)*(Me*.5)-B*Le;if(T<R||T>_||V<S||V>ee)continue;const H=u<a.constructEndsAt;let M=H?"prop_construction_site":ot(g.id,g.spriteKey),P=0;if(!H&&g.isFarmlandPlot)if(!a.cropId)M="crop_plot_tilled";else{const A=a.cropPlantedAt??u-1e4,v=a.cropReadyAt??u,U=Math.max(1e3,v-A);P=u>=v?1:Math.max(0,Math.min(.99,(u-A)/U)),M=P>=.25&&P<.66?"crop_plot_sprouts":"crop_plot_tilled"}if(!M)continue;const K=!!g.connectableGroup,Te=!H&&g.connectableGroup?Se(a.gx,a.gy,z,X,B,g.connectableGroup):0,$=(Te>0?m.resolve(`conn:${M}:${Te}`):void 0)??m.resolve(M);if(!$)continue;const he=g.width!==g.height,Ve=H?1.04:Mt(g),se=(z+X)*(Ce*.5)*Ve,ue=se*($.height/$.width),we=Ut(g,a,u,s,N),te=(a.rotation+r)%4,xt=K?!1:he?(te&1)===1:te===1||te===2,bt=!!M.startsWith("env_")&&M!=="env_mossy_rock",wt=c&&!K&&(z>=2||X>=2||ue>95),yt=l?.movingBuildingUid===a.uid,qe=oe===a.uid?4:l?.selectedBuildingUid===a.uid?3:0,C=this.slots[W++];C.rxMin=D+.04,C.ryMin=F+.04,C.rxMax=D+I-.04,C.ryMax=F+k-.04,C.depth=D+I+F+k-.05,C.wx=T,C.wy=V+4;const st=se*we.scaleX,At=ue*we.scaleY;C.drawW=xt?-st:st,C.drawH=At,C.spriteId=$.id,C.swayAmp=bt?3.8:g.category==="creature"?1.4:0,C.rotRad=0,C.pivotY=0,C.alpha=yt?.35:wt?.3:1,C.tintFlag=qe,C.skeletalPoseIdx=-1;const ye=mt(g.id);if(C.shadowScale=K?0:1,C.emissiveBoost=(g.isFlooPortal?1.35:ye?ye.emissiveBoost:K?0:.85)+we.furnaceGlowBoost,C.phaseSeed=a.gx*1.7+a.gy*2.3,C.extraStart=E,C.extraCount=0,!H&&we.smokeIntensity>0&&this.chimneyCount<12){const A=this.chimneyCount*3;this.chimneyEmitters[A]=T+se*.14,this.chimneyEmitters[A+1]=V-ue*.82,this.chimneyEmitters[A+2]=C.phaseSeed,this.chimneyCount++}if(H){const A=m.resolve("ui_icon_hammer_wand");if(A&&E<this.extras.length){const v=this.extras[E++],U=Math.min(36,Math.max(22,se*.28));v.wx=T+se*.2,v.wy=V-ue*.62+Math.sin(u*.006+C.phaseSeed)*3,v.drawW=U,v.drawH=U*(A.height/A.width),v.spriteId=A.id,v.swayAmp=0,v.rotRad=Math.sin(u*.008+a.gx)*.24,v.pivotY=.5,v.alpha=.95,v.tintFlag=0,v.emissiveBoost=.85,v.phaseSeed=C.phaseSeed,C.extraCount++}}else if(a.awaitingUnveil){const A=m.resolve("prop_ribbon_unveil");if(A&&E<this.extras.length){const v=this.extras[E++],U=Math.sin(u*.005+C.phaseSeed)*4.5,J=Math.min(54,Math.max(32,se*.42));v.wx=T,v.wy=V-ue*.55+U,v.drawW=J,v.drawH=J*(A.height/A.width),v.spriteId=A.id,v.swayAmp=0,v.rotRad=Math.sin(u*.0035)*.06,v.pivotY=.5,v.alpha=1,v.tintFlag=0,v.emissiveBoost=1.15,v.phaseSeed=C.phaseSeed,C.extraCount++}}if(!H&&g.id==="burrow_windmill_canon"){const A=m.resolve("prop_windmill_sails");if(A&&E<this.extras.length){const v=this.extras[E++],U=se*.78;v.wx=T-se*.06,v.wy=V+4-ue*.67,v.drawW=U,v.drawH=U,v.spriteId=A.id,v.swayAmp=0,v.rotRad=s?.38:(u*.0013+we.extraRotorRad)%6.28318,v.pivotY=.5,v.alpha=C.alpha,v.tintFlag=qe,v.emissiveBoost=.1,v.phaseSeed=C.phaseSeed,C.extraCount++}}else if(!H&&g.id==="burrow_reed_pond_mill"){const A=m.resolve("prop_waterwheel_rotor");if(A&&E<this.extras.length){const v=this.extras[E++],U=se*.44;v.wx=T+se*.18,v.wy=V+4-ue*.34,v.drawW=U,v.drawH=U,v.spriteId=A.id,v.swayAmp=0,v.rotRad=s?.2:(u*.0018+we.extraRotorRad)%6.28318,v.pivotY=.5,v.alpha=C.alpha,v.tintFlag=qe,v.emissiveBoost=.05,v.phaseSeed=C.phaseSeed,C.extraCount++}}if(!H&&we.isActive&&we.activeGoodIconKey&&!(a.readyFarmGoods&&a.readyFarmGoods.length>0)&&!(a.readyBubbles&&a.readyBubbles>0)&&E<this.extras.length){const A=m.resolve(we.activeGoodIconKey);if(A){const v=this.extras[E++],U=s?0:Math.sin(u*.0052+C.phaseSeed)*2.8,J=Math.min(26,Math.max(18,se*.2));v.wx=T,v.wy=V-Math.max(30,ue*.72)+U,v.drawW=J,v.drawH=J*(A.height/A.width),v.spriteId=A.id,v.swayAmp=0,v.rotRad=0,v.pivotY=.5,v.alpha=.9*C.alpha,v.tintFlag=0,v.emissiveBoost=.65,v.phaseSeed=C.phaseSeed,C.extraCount++}}if(!H&&g.isFarmlandPlot&&a.cropId&&P>=.45){const A=$e[a.cropId],v=A?m.resolve(A.iconKey):void 0;if(v){const U=P>=1?1:.68+P*.32,J=[[-11,-13],[11,-13],[0,-6]];for(let ge=0;ge<J.length&&E<this.extras.length;ge++){const ae=this.extras[E++],le=23*U;ae.wx=T+J[ge][0],ae.wy=V+J[ge][1],ae.drawW=le,ae.drawH=le*(v.height/v.width),ae.spriteId=v.id,ae.swayAmp=2.6,ae.rotRad=0,ae.pivotY=0,ae.alpha=1,ae.tintFlag=0,ae.emissiveBoost=A?.nocturnalGlowColor?1.15:.08,ae.phaseSeed=C.phaseSeed+ge*1.9,C.extraCount++}}}if(!H&&g.isAnimalPasturePlot&&a.pastureAnimalId){const A=ct[a.pastureAnimalId];if(A){const v=(Te&204)!==0,U=(Te&51)!==0,J=se*(v?.3:.2),ge=ue*(U?.14:.09),ae=a.pastureAnimalId==="daisy_cow"||a.pastureAnimalId==="silver_hippogriff"||a.pastureAnimalId==="shadow_thestral"||a.pastureAnimalId==="moon_unicorn"?48:a.pastureAnimalId==="ottery_sheep"?44:38,le=Math.floor(u/16.67),Ze=V+4,Ke=!!(a.pastureReadyAt&&u>=a.pastureReadyAt),Ue=this.period==="night"&&!Ke,He=Ue?.25:1;for(let xe=0;xe<2&&E<this.extras.length;xe++){const ve=!s&&!Ue&&Math.floor((le+a.gx*11+a.gy*17+xe*29)/42)%2===1,Qe=A.spritePair[ve?1:0],De=m.resolve(Qe)??m.resolve(A.spritePair[0]);if(!De)continue;const Ne=u*(xe===0?.00144:.00114)*He+a.gx*1.9+a.gy*1.3+xe*2.6,pe=T+Math.sin(Ne)*J+(xe===0?-se*.06:se*.09),St=s||Ue?0:Math.abs(Math.sin(u*.0066+xe*1.7+a.gx))*2.4,rt=!s&&Ue?Math.sin(u*.0016+a.gx*1.3+xe*2.1)*.022:0,Tt=Ze-ue*(xe===0?.44:.32)+Math.cos(Ne*.85)*ge-St,nt=xe===0?1:.82,lt=ae*nt*(1-rt*.7),_t=ae*nt*(De.height/De.width)*(1+rt),Rt=Math.cos(Ne)<0,Ae=this.extras[E++];Ae.wx=pe,Ae.wy=Tt,Ae.drawW=Rt?-lt:lt,Ae.drawH=_t,Ae.spriteId=De.id,Ae.swayAmp=0,Ae.rotRad=0,Ae.pivotY=0,Ae.alpha=1,Ae.tintFlag=0,Ae.emissiveBoost=a.pastureAnimalId==="moon_unicorn"?.55:.1,Ae.phaseSeed=C.phaseSeed+xe*1.7,C.extraCount++}}}if(!H&&g.isCreatureHabitat&&!g.isRuralFarmstead&&!a.isEscaped){const A=g.id==="hippogriff_glade"?["beast_hippogriff","beast_hippogriff_bow"]:g.id==="thestral_grove"?["beast_thestral","beast_thestral_wings"]:g.id==="unicorn_glade"?["beast_unicorn","beast_unicorn_prance"]:g.id==="phoenix_perch"?["beast_phoenix","beast_phoenix_soar"]:g.id==="dragon_lair"?["beast_dragon","beast_dragon_roar"]:g.id==="hagrid_bowtruckle"?null:["beast_niffler","beast_niffler_play"];if(A&&E<this.extras.length){const v=Math.floor(u/16.67),U=Math.floor((v+a.gx*13+a.gy*7)/48)%2===1,J=m.resolve(A[U?1:0])??m.resolve(A[0]);if(J){const ge=a.creatureStage==="baby"?.58:a.creatureStage==="legendary"?1.05:.84,ae=u*.00192+a.gx*2.1+a.gy,le=T+Math.sin(ae)*se*.22,Ze=Math.abs(Math.sin(u*.0072+a.gx))*3.5,Ke=V+4,Ue=Ke-ue*.22-Ze,He=38*ge,xe=He*(J.height/J.width),ve=this.extras[E++];if(ve.wx=le,ve.wy=Ue,ve.drawW=Math.cos(ae)<0?-He:He,ve.drawH=xe,ve.spriteId=J.id,ve.swayAmp=0,ve.rotRad=0,ve.pivotY=0,ve.alpha=1,ve.tintFlag=0,ve.emissiveBoost=a.creatureMorph==="radiant"||a.creatureMorph==="mystic"?.85:.14,ve.phaseSeed=C.phaseSeed,C.extraCount++,a.hasBabyOffspring&&E<this.extras.length){const Qe=ae-.9,De=22,Ne=De*(J.height/J.width),pe=this.extras[E++];pe.wx=T+Math.sin(Qe)*se*.2,pe.wy=Ke-ue*.16-Math.abs(Math.cos(u*.0096))*3,pe.drawW=Math.cos(Qe)<0?-De:De,pe.drawH=Ne,pe.spriteId=J.id,pe.swayAmp=0,pe.rotRad=0,pe.pivotY=0,pe.alpha=1,pe.tintFlag=0,pe.emissiveBoost=.14,pe.phaseSeed=C.phaseSeed+2.3,C.extraCount++}}}}else if(!H&&g.id==="black_lake_boats"){const A=m.resolve("vehicle_lake_boat");if(A){const v=V+4;for(let U=0;U<2&&E<this.extras.length;U++){const J=u*.0015+U*Math.PI,ge=36,ae=ge*(A.height/A.width),le=this.extras[E++];le.wx=T+Math.cos(J)*se*.34,le.wy=v-ue*.16+Math.sin(J)*ue*.11+ae*.25,le.drawW=-Math.sin(J)<0?-ge:ge,le.drawH=ae,le.spriteId=A.id,le.swayAmp=0,le.rotRad=0,le.pivotY=0,le.alpha=1,le.tintFlag=0,le.emissiveBoost=.25,le.phaseSeed=C.phaseSeed+U,C.extraCount++}}}if(!l?.skipReadyBubbleSprites&&!H&&!a.awaitingUnveil&&E<this.extras.length){let A;g.isFarmlandPlot&&a.cropId&&P>=1?A=$e[a.cropId]?.iconKey:g.isAnimalPasturePlot&&a.pastureAnimalId&&a.pastureReadyAt&&u>=a.pastureReadyAt?A=ct[a.pastureAnimalId]?.iconKey:((a.readyFarmGoods?.length??0)>0||(a.readyBubbles??0)>0)&&(A="ui_icon_golden_sickle");const v=A?m.resolve(A):void 0;if(v){const U=this.extras[E++],J=Math.sin(u*.0046+C.phaseSeed)*3.8;U.wx=T,U.wy=V-Math.max(34,ue*.78)+J,U.drawW=24,U.drawH=24*(v.height/v.width),U.spriteId=v.id,U.swayAmp=0,U.rotRad=0,U.pivotY=.5,U.alpha=.98,U.tintFlag=0,U.emissiveBoost=1.18,U.phaseSeed=C.phaseSeed,C.extraCount++}}if(!H){if(g.isFlooPortal){const A=.92+Math.sin(u*.006+a.gx)*.12;q(T,V-8,34,195,.16,.96,.64,(G?1.65:.95)*A)}else if(g.isFarmlandPlot&&a.cropId){const A=$e[a.cropId]?.nocturnalGlowColor;if(A){const[v,U,J]=io(A,[.35,.82,.98]);q(T,V-10,20,96,v,U,J,G?1.15:.45)}}else if(ye){const A=this.weatherKind==="snow"||this.seasonId==="winter";if(G||ye.activeInDaySnow&&A){const v=.94+Math.sin(u*.0052+a.gx*1.9+a.gy*1.3)*.06,U=G?1:.38;q(T,V-(ye.secondaryLakePool?24:12),ye.secondaryLakePool?52:36,ye.radius,ye.rgb[0],ye.rgb[1],ye.rgb[2],ye.intensity*U*v),G&&ye.secondaryLakePool&&q(T+18,V-4,22,135,.3,.78,1,.98*v)}}else if(z>=2||X>=2||g.category==="shop"||g.category==="decor"){const A=g.id==="burrow_house_canon"||g.id==="molly_apple_bakery"||g.id==="burrow_broomsticks_canon"||g.id==="burrow_honeydukes_canon"||g.id==="burrow_feast_marquee";if(G){const v=.95+Math.sin(u*.0045+a.gx*2.1)*.06;q(T,V-(g.id==="burrow_house_canon"?26:14),g.id==="burrow_house_canon"?56:42,A?200:140,1,.72,.26,(A?1.35:.85)*v),g.id==="burrow_house_canon"&&q(T-16,V-6,28,130,.14,.95,.52,1.15*(.92+Math.sin(u*.0068)*.08))}else if(we.isActive){const v=.9+Math.sin(u*.009+a.gx*1.7)*.1;q(T,V-12,36,150,1,.68,.24,.75*v)}}}}const be=this.seasonId==="winter",Ee=be?Bt:to;for(const[b,a,g,z,X]of Ee){if(W>=ce)break;const D=o.grid[a]?.[b];if(!D||D.buildingUid||D.path!=="none"||D.terrain!=="grass"||!o.state.sandboxMode&&!this.unlockedZonesSet.has(D.zoneId)||z>=1.4&&(o.grid[a-1]?.[b]?.buildingUid||o.grid[a+1]?.[b]?.buildingUid||o.grid[a]?.[b-1]?.buildingUid||o.grid[a]?.[b+1]?.buildingUid))continue;const F=Ie(b+.5,a+.5,r),I=F.wy-D.elevation*Le;if(F.wx<R||F.wx>_||I<S||I>ee)continue;const k=m.resolve(g);if(!k)continue;const{rx:B,ry:T}=Je(b+.5,a+.5,r),H=(g==="env_flower_patch"||g==="env_bush_flowers"||g==="env_mossy_rock"||g==="yule_holly_hedgerow"||g==="yule_snowdrop_moss_log"||g==="yule_edelweiss_alpine_rockery"||g==="yule_puffskein_snowballs"?36:58)*z,M=H*(k.height/k.width),P=mt(g),K=this.slots[W++];K.rxMin=B-.22,K.ryMin=T-.22,K.rxMax=B+.22,K.ryMax=T+.22,K.depth=B+T+.28,K.wx=F.wx,K.wy=I,K.drawW=X?-H:H,K.drawH=M,K.spriteId=k.id,K.swayAmp=g==="env_mossy_rock"||g.startsWith("yule_")?0:2.8,K.rotRad=0,K.pivotY=0,K.alpha=1,K.tintFlag=0,K.skeletalPoseIdx=-1,K.shadowScale=.72,K.emissiveBoost=P?P.emissiveBoost:0,K.phaseSeed=b*1.3+a*.9,K.extraCount=0,K.extraStart=0,P&&(G||P.activeInDaySnow)&&q(F.wx,I-12,36,P.radius*.82,P.rgb[0],P.rgb[1],P.rgb[2],P.intensity*(G?.58:.24))}if(l?.hoverTile&&W<ce){const b=l.movingBuildingUid?o.state.buildings.find(z=>z.uid===l.movingBuildingUid):void 0,a=l.selectedCatalogItem??(b?Oe(b.itemId):void 0),g=a?ot(a.id,a.spriteKey):void 0;if(a&&g){const z=l.rotation??0,X=m.resolve(g);if(X){const{gx:D,gy:F}=l.hoverTile,{bw:I,bh:k}=o.getBuildingFootprint(a,z),{rx0:B,ry0:T,rbw:V,rbh:H}=Fe(D,F,I,k,r),M=o.grid[F]?.[D]?.elevation??0,P=(B-T+(V-H)*.5)*(Ce*.5),K=(B+V+T+H)*(Me*.5)-M*Le,Te=a.width!==a.height,$=!!a.connectableGroup,he=a.spriteScale??(Te?1:1.05),Ve=(I+k)*(Ce*.5)*he,at=Ve*(X.height/X.width),se=(z+r)%4,ue=$?!1:Te?(se&1)===1:se===1||se===2,we=o.canPlaceItem(a,D,F,z,l.movingBuildingUid??void 0).ok,te=this.slots[W++];te.rxMin=B+.04,te.ryMin=T+.04,te.rxMax=B+V-.04,te.ryMax=T+H-.04,te.depth=B+V+T+H+.02,te.wx=P,te.wy=K+4-Math.abs(Math.sin(u*.005))*2.5,te.drawW=ue?-Ve:Ve,te.drawH=at,te.spriteId=X.id,te.swayAmp=0,te.rotRad=0,te.pivotY=0,te.alpha=.82,te.tintFlag=we?1:2,te.skeletalPoseIdx=-1,te.shadowScale=.5,te.emissiveBoost=.45,te.phaseSeed=D+F,te.extraCount=0,te.extraStart=0}}}for(let b=0;b<o.villagers.length&&W<ce;b++){const a=o.villagers[b],g=Math.max(0,Math.min(me-1,Math.floor(a.gx))),z=Math.max(0,Math.min(me-1,Math.floor(a.gy))),X=o.grid[z]?.[g]?.elevation??0,D=Ie(a.gx,a.gy,r),F=D.wy-X*Le;if(D.wx<R||D.wx>_||F<S||F>ee)continue;const I=a.state==="walking",k=I&&Math.floor(a.walkPhase*1.4)%2===1,B=m.resolve(k?a.walkSprite:a.idleSprite)??m.resolve(a.idleSprite);if(!B)continue;const T=a.id==="hagrid"?62:52,V=T*(B.width/B.height),H=I?Math.abs(Math.sin(a.walkPhase*2.1))*2.8:Math.sin(u*.003+a.gx*1.7)*.7,M=I?Math.sin(a.walkPhase*1.05)*.045:0,{rx:P,ry:K}=Je(a.gx,a.gy,r);let Te=-1;if(O<Ge){Te=O++;const he=this.rawSkeletalPoses[Te];he.villagerId=a.id,he.wx=D.wx,he.wy=F-H,he.drawW=a.facingLeft?-V:V,he.drawH=T,he.spriteId=B.id,he.walkPhase=a.walkPhase,he.isWalking=I,he.facingLeft=!!a.facingLeft,he.alpha=1,he.greetWave=s?0:Math.min(1,Math.max(0,(a.greetReactTimer??0)/.6)),he.tendingLean=!s&&!I&&(a.tendingSpotTimer??0)>0?1:0,he.phaseSeed=b*2.1}const $=this.slots[W++];$.rxMin=P-.18,$.ryMin=K-.18,$.rxMax=P+.18,$.ryMax=K+.18,$.depth=P+K+.3,$.wx=D.wx,$.wy=F-H,$.drawW=a.facingLeft?-V:V,$.drawH=T,$.spriteId=B.id,$.swayAmp=.8,$.rotRad=M,$.pivotY=0,$.alpha=1,$.tintFlag=0,$.skeletalPoseIdx=Te,$.shadowScale=.72,$.emissiveBoost=.12,$.phaseSeed=b*2.1,$.extraCount=0,$.extraStart=0}if(!o.state.sandboxMode)for(let b=0;b<this.lockedScenery.length&&W<ce;b++){const a=this.lockedScenery[b];if(this.unlockedZonesSet.has(a.zoneId))continue;const g=Math.max(0,Math.min(me-1,Math.round(a.gx))),z=Math.max(0,Math.min(me-1,Math.round(a.gy))),X=o.grid[z]?.[g]?.elevation??0,D=Ie(a.gx+.5,a.gy+.5,r),F=D.wy-X*Le;if(D.wx<R||D.wx>_||F<S||F>ee)continue;const I=be?Wt(a):a.spriteKey,k=m.resolve(I);if(!k)continue;const B=I==="env_flower_patch"||I==="env_bush_flowers"||I==="env_mossy_rock"||I==="yule_holly_hedgerow"||I==="yule_snowdrop_moss_log"||I==="yule_edelweiss_alpine_rockery",T=(B?34:58)*a.scale,V=T*(k.height/k.width),{rx:H,ry:M}=Je(a.gx+.5,a.gy+.5,r),P=this.slots[W++];P.rxMin=H-.32,P.ryMin=M-.32,P.rxMax=H+.32,P.ryMax=M+.32,P.depth=H+M+.42,P.wx=D.wx,P.wy=F,P.drawW=a.flipX?-T:T,P.drawH=V,P.spriteId=k.id,P.swayAmp=a.spriteKey==="env_mossy_rock"?0:B?2.6:4.8,P.rotRad=0,P.pivotY=0,P.alpha=1,P.tintFlag=0,P.skeletalPoseIdx=-1,P.shadowScale=.85,P.emissiveBoost=a.spriteKey==="env_tree_magic"?.55:0,P.phaseSeed=a.gx*.9+a.gy*1.4,P.extraCount=0,P.extraStart=0}this.sortAndPackSceneInstances(W);let Z=0;const ie=Math.min(vt,Math.max(0,t));for(let b=0;b<L&&Z<ie;b++){let a=b,g=this.lightCandidates[b].distSq;for(let D=b+1;D<L;D++)this.lightCandidates[D].distSq<g&&(g=this.lightCandidates[D].distSq,a=D);if(a!==b){const D=this.lightCandidates[b];this.lightCandidates[b]=this.lightCandidates[a],this.lightCandidates[a]=D}const z=this.lightCandidates[b];if(z.intensity<=.02)continue;const X=Z*it;this.lightData[X]=z.wx,this.lightData[X+1]=z.wy,this.lightData[X+2]=z.z,this.lightData[X+3]=z.radius,this.lightData[X+4]=z.r,this.lightData[X+5]=z.g,this.lightData[X+6]=z.b,this.lightData[X+7]=z.intensity,Z++}this.lightCount=Z}sortAndPackSceneInstances(o){if(this.skeletalCount=0,o===0){this.sceneCount=0;return}this.topoHead.fill(-1,0,o),this.topoTail.fill(-1,0,o),this.topoInDeg.fill(0,0,o),this.topoEmitted.fill(0,0,o);let i=0;const e=.04,x=(d,l)=>{this.ensureEdgeCap(i+1);const r=i++;this.topoTo[r]=l,this.topoNext[r]=-1,this.topoHead[d]===-1?(this.topoHead[d]=r,this.topoTail[d]=r):(this.topoNext[this.topoTail[d]]=r,this.topoTail[d]=r),this.topoInDeg[l]++};for(let d=0;d<o;d++){const l=this.slots[d],r=l.rxMin-l.ryMax,c=l.rxMax-l.ryMin;for(let s=d+1;s<o;s++){const h=this.slots[s],y=h.rxMin-h.ryMax,f=h.rxMax-h.ryMin;if(c<=y+e||f<=r+e)continue;const R=l.rxMax<=h.rxMin+e&&l.ryMin<h.ryMax-e||l.ryMax<=h.ryMin+e&&l.rxMin<h.rxMax-e,_=h.rxMax<=l.rxMin+e&&h.ryMin<l.ryMax-e||h.ryMax<=l.ryMin+e&&h.rxMin<l.rxMax-e;R&&!_?x(d,s):_&&!R&&x(s,d)}}let u=0,m=0;for(let d=0;d<o;d++)if(this.topoInDeg[d]===0){const l=this.slots[d].depth;let r=u,c=m;for(;r<c;){const s=r+c>>1;this.slots[this.topoReady[s]].depth<=l?r=s+1:c=s}r<m&&this.topoReady.copyWithin(r+1,r,m),this.topoReady[r]=d,m++}let t=0;const w=d=>{if(t>=ce)return;const l=this.slots[d];if(l.skeletalPoseIdx>=0&&this.skeletalCount<Ge){const c=this.skeletalCount++;this.skeletalSortedIndices[c]=t;const s=this.rawSkeletalPoses[l.skeletalPoseIdx],h=this.skeletalPoses[c];h.villagerId=s.villagerId,h.wx=s.wx,h.wy=s.wy,h.drawW=s.drawW,h.drawH=s.drawH,h.spriteId=s.spriteId,h.walkPhase=s.walkPhase,h.isWalking=s.isWalking,h.facingLeft=s.facingLeft,h.alpha=s.alpha,h.greetWave=s.greetWave??0,h.tendingLean=s.tendingLean??0,h.phaseSeed=s.phaseSeed??0}const r=t*Pe;this.sceneSpriteIds[t]=l.spriteId,this.sceneTintFlags[t]=l.tintFlag,this.sceneData[r]=l.wx,this.sceneData[r+1]=l.wy,this.sceneData[r+2]=l.drawW,this.sceneData[r+3]=l.drawH,this.sceneData[r+4]=l.spriteId,this.sceneData[r+5]=l.swayAmp,this.sceneData[r+6]=l.rotRad,this.sceneData[r+7]=l.pivotY,this.sceneData[r+8]=l.alpha+l.tintFlag*2,this.sceneData[r+9]=l.shadowScale,this.sceneData[r+10]=l.emissiveBoost,this.sceneData[r+11]=l.phaseSeed,t++;for(let c=0;c<l.extraCount&&t<ce;c++){const s=this.extras[l.extraStart+c];this.sceneSpriteIds[t]=s.spriteId,this.sceneTintFlags[t]=s.tintFlag;const h=t*Pe;this.sceneData[h]=s.wx,this.sceneData[h+1]=s.wy,this.sceneData[h+2]=s.drawW,this.sceneData[h+3]=s.drawH,this.sceneData[h+4]=s.spriteId,this.sceneData[h+5]=s.swayAmp,this.sceneData[h+6]=s.rotRad,this.sceneData[h+7]=s.pivotY,this.sceneData[h+8]=s.alpha+s.tintFlag*2,this.sceneData[h+9]=0,this.sceneData[h+10]=s.emissiveBoost,this.sceneData[h+11]=s.phaseSeed,t++}};for(;u<m;){const d=this.topoReady[u++];this.topoEmitted[d]=1,w(d);for(let l=this.topoHead[d];l!==-1;l=this.topoNext[l]){const r=this.topoTo[l];if(this.topoInDeg[r]--,this.topoInDeg[r]===0){const c=this.slots[r].depth;let s=u,h=m;for(;s<h;){const y=s+h>>1;this.slots[this.topoReady[y]].depth<=c?s=y+1:h=y}s<m&&this.topoReady.copyWithin(s+1,s,m),this.topoReady[s]=r,m++}}}for(let d=0;d<o;d++)this.topoEmitted[d]||w(d);this.sceneCount=t}collectAtmosphericParticles(o,i){const e=i*.001,x=this.period==="night"||this.period==="dusk",u=this.weatherKind==="rain"||this.weatherKind==="storm"||this.weatherKind==="fog",m=!u&&(this.weatherKind==="snow"||this.seasonId==="winter"),t=Math.min(48,this.chimneyCount*4),w=Math.max(0,et-t),l=Math.min(u?0:m?140:x?130:80,w),r=Math.max(.42,o.zoom),c=Math.max(920,780/r),s=Math.max(580,500/r),h=1/Math.max(.65,Math.min(1.25,o.zoom));for(let f=0;f<l;f++){const R=de(f,17),_=de(f,89),S=de(f,233),ee=38+_*34,W=m?e*(14+R*10)+Math.sin(e*(.85+S*.55)+f)*26:Math.sin(e*.65+f*1.7)*38,E=m?e*ee:-e*12+Math.cos(e*.8+f*1.3)*24,O=R*c*2+W,L=_*s*2+E,N=o.x-c+(O%(c*2)+c*2)%(c*2),oe=o.y-s+(L%(s*2)+s*2)%(s*2),Q=f*ke;if(this.particleData[Q]=N,this.particleData[Q+1]=oe,m){const re=(1.5+S*1.9)*h;this.particleData[Q+2]=re,this.particleData[Q+3]=(S+e*(.07+R*.06))%1,this.particleData[Q+4]=R,this.particleData[Q+5]=.8+.18*_}else{const re=.45+.55*Math.sin(e*(2.2+S*2)+f*3.1);this.particleData[Q+2]=(2.6+S*4.2)*re,f%5===0?(this.particleData[Q+3]=.25,this.particleData[Q+4]=1.35,this.particleData[Q+5]=.82):(this.particleData[Q+3]=1.45,this.particleData[Q+4]=1.12,this.particleData[Q+5]=.36)}}let y=l;for(let f=0;f<this.chimneyCount;f++){const R=f*3,_=this.chimneyEmitters[R],S=this.chimneyEmitters[R+1],ee=this.chimneyEmitters[R+2];for(let W=0;W<4&&y<et;W++){const E=(e*.55+W*.25+ee*.17)%1,O=y*ke;this.particleData[O]=_+Math.sin(e*1.8+ee+W*1.6)*(3+E*8),this.particleData[O+1]=S-E*34,this.particleData[O+2]=4.5+E*7.5,this.particleData[O+3]=-1,this.particleData[O+4]=Math.sin(E*Math.PI)*.46,this.particleData[O+5]=.65,y++}}this.particleCount=y}}const ne=2048,so=new Set(["yule_floating_candelabra","yule_goblet_blue_brazier","yule_hogwarts_boathouse_ice","yule_snowdrop_moss_log","yule_hermione_bluebell_jars","yule_glowing_puffapod_bush"]);function ro(p){return p.startsWith("conn:")||p.startsWith("yule_")||p.startsWith("ui_icon_")||p.startsWith("m3_")||p.startsWith("beast_")||p.startsWith("vehicle_")||p.startsWith("staff_")||p.startsWith("guest_")||p.startsWith("prop_")||p.startsWith("crop_plot_")||p==="snowy_pines"||p==="env_pine_snow"||p==="catalog_floating_candles_post"||p==="catalog_patronus_ward_lantern"?!1:Nt(p)}function no(p){return so.has(p)}const tt=8,Ye=512,_e=2;function gt(p,o,i){const e=p.createShader(o);if(p.shaderSource(e,i),p.compileShader(e),!p.getShaderParameter(e,p.COMPILE_STATUS)){const x=p.getShaderInfoLog(e)||"Unknown shader compile error";throw p.deleteShader(e),new Error(`[WebGL2 Shader] ${x}`)}return e}function Re(p,o,i){const e=gt(p,p.VERTEX_SHADER,o),x=gt(p,p.FRAGMENT_SHADER,i),u=p.createProgram();if(p.attachShader(u,e),p.attachShader(u,x),p.linkProgram(u),p.deleteShader(e),p.deleteShader(x),!p.getProgramParameter(u,p.LINK_STATUS)){const m=p.getProgramInfoLog(u)||"Unknown program link error";throw p.deleteProgram(u),new Error(`[WebGL2 Link] ${m}`)}return u}const Xe=`#version 300 es
precision highp float;
out vec2 vUv;
void main() {
  vec2 pos = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  vUv = pos;
  gl_Position = vec4(pos * 2.0 - 1.0, 0.0, 1.0);
}
`,lo=`#version 300 es
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
`,co=`#version 300 es
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
`,ho=`#version 300 es
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
  vec2 offset = vec2(aCorner.x * ${Ce*.5*1.036}, aCorner.y * ${Me*.5*1.036});
  vec2 wp = iWorldPos + offset;
  vec2 sp = uViewport * 0.5 + (wp - uCamera.xy) * uCamera.z;
  vec2 clip = vec2((sp.x / uViewport.x) * 2.0 - 1.0, 1.0 - (sp.y / uViewport.y) * 2.0);
  gl_Position = vec4(clip, 0.0, 1.0);
  vLocal = aCorner;
  vWorldPos = wp;
  vColor = iBaseColor;
  vMeta = iMeta;
}
`,uo=`#version 300 es
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
`,fo=`#version 300 es
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
  vec2 offset = vec2(aCorner.x * ${Ce*.5*1.045}, aCorner.y * ${Me*.5*1.045});
  vec2 wp = iWorldPos + offset;
  vec2 sp = uViewport * 0.5 + (wp - uCamera.xy) * uCamera.z;
  vec2 clip = vec2((sp.x / uViewport.x) * 2.0 - 1.0, 1.0 - (sp.y / uViewport.y) * 2.0);
  gl_Position = vec4(clip, 0.0, 1.0);
  vLocal = aCorner;
  vWorldPos = wp;
  vWaterMeta = iWaterMeta;
}
`,vo=`#version 300 es
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
`,po=`#version 300 es
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
`,mo=`#version 300 es
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
`,go=`#version 300 es
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
`,xo=`#version 300 es
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
`,bo=`#version 300 es
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
`,wo=`#version 300 es
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
`,yo=`#version 300 es
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
`,Ao=`#version 300 es
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
`,So=`#version 300 es
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
`,To=`#version 300 es
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
`,_o=`#version 300 es
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
`;class Io{constructor(o,i){n(this,"canvas");n(this,"gpuDevice");n(this,"gl");n(this,"sprites");n(this,"snapshot",new ao);n(this,"spineAdapter");n(this,"rangeSlices",[]);n(this,"bakeNormalProg");n(this,"skyProg");n(this,"terrainProg");n(this,"waterProg");n(this,"grassProg");n(this,"shadowProg");n(this,"sceneProg");n(this,"particleProg");n(this,"bloomExtractProg");n(this,"bloomBlurProg");n(this,"compositeProg");n(this,"emptyVao");n(this,"terrainVao");n(this,"terrainInstanceBuf");n(this,"waterVao");n(this,"waterInstanceBuf");n(this,"grassVao");n(this,"grassInstanceBuf");n(this,"sceneVao");n(this,"sceneInstanceBuf");n(this,"particleVao");n(this,"particleInstanceBuf");n(this,"albedoArrayTex");n(this,"normalEmissiveArrayTex");n(this,"bakeFbo");n(this,"uvTableTex");n(this,"uvTableData",new Float32Array(Ye*2*4));n(this,"uvTableDirty",!1);n(this,"spriteHandles",new Map);n(this,"shelf",{layer:0,curX:_e,curY:_e,rowH:0});n(this,"uploadScratchCanvas");n(this,"uploadScratchCtx");n(this,"nextSpriteId",0);n(this,"useHalfFloatFbo");n(this,"fboW",0);n(this,"fboH",0);n(this,"sceneFbo",null);n(this,"sceneColorTex",null);n(this,"bloomFboA",null);n(this,"bloomTexA",null);n(this,"bloomFboB",null);n(this,"bloomTexB",null);n(this,"uploadedStaticGen",-1);n(this,"uniformLocs",new WeakMap);n(this,"lightPosUniform",new Float32Array(64));n(this,"lightColUniform",new Float32Array(64));n(this,"fpsAccumMs",0);n(this,"fpsFrames",0);n(this,"currentFps",60);n(this,"lastFrameTs",0);n(this,"stats",{backend:"webgl2",fps:60,cpuCollectMs:0,drawCalls:0,terrainTiles:0,waterTiles:0,grassInstances:0,sortedSprites:0,particleInstances:0,activeLights:0,atlasLayers:1,atlasSpritesPacked:0,vramEstimateMb:0});this.canvas=o,this.sprites=i,this.gpuDevice=new Ot({canvas:o,preserveDrawingBuffer:!0,onContextRestored:()=>{this.uploadedStaticGen=-1,this.uvTableDirty=!0,this.uniformLocs=new WeakMap}});const e=this.gpuDevice.gl;this.gl=e,this.useHalfFloatFbo=this.gpuDevice.supportsHalfFloatHdr,this.spineAdapter=new $t(e),this.bakeNormalProg=Re(e,Xe,lo),this.skyProg=Re(e,Xe,co),this.terrainProg=Re(e,ho,uo),this.waterProg=Re(e,fo,vo),this.grassProg=Re(e,po,mo),this.shadowProg=Re(e,go,xo),this.sceneProg=Re(e,bo,wo),this.particleProg=Re(e,yo,Ao),this.bloomExtractProg=Re(e,Xe,So),this.bloomBlurProg=Re(e,Xe,To),this.compositeProg=Re(e,Xe,_o),this.emptyVao=e.createVertexArray();const x=new Float32Array([-1,0,0,-1,0,1,1,0]),u=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,u),e.bufferData(e.ARRAY_BUFFER,x,e.STATIC_DRAW),this.terrainVao=e.createVertexArray(),this.terrainInstanceBuf=e.createBuffer(),e.bindVertexArray(this.terrainVao),e.bindBuffer(e.ARRAY_BUFFER,u),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,this.terrainInstanceBuf),e.enableVertexAttribArray(1),e.vertexAttribPointer(1,2,e.FLOAT,!1,Be*4,0),e.vertexAttribDivisor(1,1),e.enableVertexAttribArray(2),e.vertexAttribPointer(2,3,e.FLOAT,!1,Be*4,8),e.vertexAttribDivisor(2,1),e.enableVertexAttribArray(3),e.vertexAttribPointer(3,3,e.FLOAT,!1,Be*4,20),e.vertexAttribDivisor(3,1),this.waterVao=e.createVertexArray(),this.waterInstanceBuf=e.createBuffer(),e.bindVertexArray(this.waterVao),e.bindBuffer(e.ARRAY_BUFFER,u),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,this.waterInstanceBuf),e.enableVertexAttribArray(1),e.vertexAttribPointer(1,2,e.FLOAT,!1,ze*4,0),e.vertexAttribDivisor(1,1),e.enableVertexAttribArray(2),e.vertexAttribPointer(2,4,e.FLOAT,!1,ze*4,8),e.vertexAttribDivisor(2,1);const m=new Float32Array([-.5,0,.5,0,-.5,1,.5,1]),t=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,t),e.bufferData(e.ARRAY_BUFFER,m,e.STATIC_DRAW),this.grassVao=e.createVertexArray(),this.grassInstanceBuf=e.createBuffer(),e.bindVertexArray(this.grassVao),e.bindBuffer(e.ARRAY_BUFFER,t),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,this.grassInstanceBuf),e.enableVertexAttribArray(1),e.vertexAttribPointer(1,2,e.FLOAT,!1,We*4,0),e.vertexAttribDivisor(1,1),e.enableVertexAttribArray(2),e.vertexAttribPointer(2,4,e.FLOAT,!1,We*4,8),e.vertexAttribDivisor(2,1),this.sceneVao=e.createVertexArray(),this.sceneInstanceBuf=e.createBuffer(),e.bindVertexArray(this.sceneVao),e.bindBuffer(e.ARRAY_BUFFER,t),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,this.sceneInstanceBuf),e.bufferData(e.ARRAY_BUFFER,this.snapshot.sceneData.byteLength,e.DYNAMIC_DRAW),e.enableVertexAttribArray(1),e.vertexAttribPointer(1,4,e.FLOAT,!1,Pe*4,0),e.vertexAttribDivisor(1,1),e.enableVertexAttribArray(2),e.vertexAttribPointer(2,4,e.FLOAT,!1,Pe*4,16),e.vertexAttribDivisor(2,1),e.enableVertexAttribArray(3),e.vertexAttribPointer(3,4,e.FLOAT,!1,Pe*4,32),e.vertexAttribDivisor(3,1);const w=new Float32Array([-.5,-.5,.5,-.5,-.5,.5,.5,.5]),d=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,d),e.bufferData(e.ARRAY_BUFFER,w,e.STATIC_DRAW),this.particleVao=e.createVertexArray(),this.particleInstanceBuf=e.createBuffer(),e.bindVertexArray(this.particleVao),e.bindBuffer(e.ARRAY_BUFFER,d),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,this.particleInstanceBuf),e.bufferData(e.ARRAY_BUFFER,this.snapshot.particleData.byteLength,e.DYNAMIC_DRAW),e.enableVertexAttribArray(1),e.vertexAttribPointer(1,3,e.FLOAT,!1,ke*4,0),e.vertexAttribDivisor(1,1),e.enableVertexAttribArray(2),e.vertexAttribPointer(2,3,e.FLOAT,!1,ke*4,12),e.vertexAttribDivisor(2,1),e.bindVertexArray(null),this.albedoArrayTex=e.createTexture(),e.bindTexture(e.TEXTURE_2D_ARRAY,this.albedoArrayTex),e.texStorage3D(e.TEXTURE_2D_ARRAY,1,e.RGBA8,ne,ne,tt),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),this.normalEmissiveArrayTex=e.createTexture(),e.bindTexture(e.TEXTURE_2D_ARRAY,this.normalEmissiveArrayTex),e.texStorage3D(e.TEXTURE_2D_ARRAY,1,e.RGBA8,ne,ne,tt),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D_ARRAY,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),this.bakeFbo=e.createFramebuffer(),this.uvTableTex=e.createTexture(),e.bindTexture(e.TEXTURE_2D,this.uvTableTex),e.texImage2D(e.TEXTURE_2D,0,e.RGBA32F,Ye,2,0,e.RGBA,e.FLOAT,this.uvTableData),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),this.uploadScratchCanvas=document.createElement("canvas"),this.uploadScratchCanvas.width=1024,this.uploadScratchCanvas.height=1024,this.uploadScratchCtx=this.uploadScratchCanvas.getContext("2d")}uLoc(o,i){let e=this.uniformLocs.get(o);e||(e=new Map,this.uniformLocs.set(o,e));let x=e.get(i);return x===void 0&&(x=this.gl.getUniformLocation(o,i),e.set(i,x)),x}invalidateSpriteAtlas(){this.spriteHandles.clear(),this.shelf.layer=0,this.shelf.curX=_e,this.shelf.curY=_e,this.shelf.rowH=0,this.nextSpriteId=0,this.uvTableDirty=!0}resolve(o){const i=this.spriteHandles.get(o);if(i)return i;if(this.nextSpriteId>=Ye)return;if(o.startsWith("conn:")){const x=o.split(":"),u=x[1],m=Number(x[2]??0);if(u&&Number.isFinite(m)&&m>0){const t=this.sprites.getConnectedFarmlandSprite(u,m,372);if(t)return this.packSpriteIntoArray(o,t)}return}const e=this.sprites.get(o);if(e)return this.packSpriteIntoArray(o,e)}packSpriteIntoArray(o,i){const e=i.width,x=i.height;if(!e||!x)return;const m=Math.min(1,1024/Math.max(e,x)),t=Math.max(4,Math.round(e*m)),w=Math.max(4,Math.round(x*m));if(this.shelf.curX+t+_e>ne&&(this.shelf.curX=_e,this.shelf.curY+=this.shelf.rowH+_e,this.shelf.rowH=0),this.shelf.curY+w+_e>ne){if(this.shelf.layer+1>=tt)return;this.shelf.layer+=1,this.shelf.curX=_e,this.shelf.curY=_e,this.shelf.rowH=0}const d=this.shelf.curX,l=this.shelf.curY,r=this.shelf.layer;this.shelf.curX+=t+_e,this.shelf.rowH=Math.max(this.shelf.rowH,w);const c=this.gl;let s=i;if(m<1){(this.uploadScratchCanvas.width<t||this.uploadScratchCanvas.height<w)&&(this.uploadScratchCanvas.width=Math.max(t,1024),this.uploadScratchCanvas.height=Math.max(w,1024)),this.uploadScratchCtx.clearRect(0,0,t,w),this.uploadScratchCtx.drawImage(i,0,0,t,w);const _=document.createElement("canvas");_.width=t,_.height=w,_.getContext("2d").drawImage(this.uploadScratchCanvas,0,0,t,w,0,0,t,w),s=_}c.bindTexture(c.TEXTURE_2D_ARRAY,this.albedoArrayTex),c.pixelStorei(c.UNPACK_PREMULTIPLY_ALPHA_WEBGL,1),c.texSubImage3D(c.TEXTURE_2D_ARRAY,0,d,l,r,t,w,1,c.RGBA,c.UNSIGNED_BYTE,s),c.pixelStorei(c.UNPACK_PREMULTIPLY_ALPHA_WEBGL,0),c.bindFramebuffer(c.FRAMEBUFFER,this.bakeFbo),c.framebufferTextureLayer(c.FRAMEBUFFER,c.COLOR_ATTACHMENT0,this.normalEmissiveArrayTex,0,r),c.enable(c.SCISSOR_TEST),c.viewport(d,l,t,w),c.scissor(d,l,t,w),c.disable(c.BLEND),c.useProgram(this.bakeNormalProg),c.activeTexture(c.TEXTURE0),c.bindTexture(c.TEXTURE_2D_ARRAY,this.albedoArrayTex),c.uniform1i(this.uLoc(this.bakeNormalProg,"uAlbedo"),0),c.uniform1f(this.uLoc(this.bakeNormalProg,"uLayer"),r),c.uniform2f(this.uLoc(this.bakeNormalProg,"uTexel"),1/ne,1/ne),c.uniform1i(this.uLoc(this.bakeNormalProg,"uLightingProfile"),Vt(o)),c.uniform4f(this.uLoc(this.bakeNormalProg,"uSpriteBounds"),d/ne,l/ne,t/ne,w/ne),c.viewport(0,0,ne,ne),c.bindVertexArray(this.emptyVao),c.drawArrays(c.TRIANGLES,0,3),c.disable(c.SCISSOR_TEST),c.bindFramebuffer(c.FRAMEBUFFER,null);const h=this.nextSpriteId++,y=h*4;this.uvTableData[y]=(d+.5)/ne,this.uvTableData[y+1]=(l+.5)/ne,this.uvTableData[y+2]=(d+t-.5)/ne,this.uvTableData[y+3]=(l+w-.5)/ne;const f=(Ye+h)*4;this.uvTableData[f]=r,this.uvTableData[f+1]=e/x,this.uvTableData[f+2]=ro(o)?1:0,this.uvTableData[f+3]=no(o)?1:0,this.uvTableDirty=!0;const R={id:h,width:e,height:x};return this.spriteHandles.set(o,R),R}ensureRenderTargets(o,i){if(this.fboW===o&&this.fboH===i&&this.sceneFbo)return;const e=this.gl;this.fboW=o,this.fboH=i;const x=(r,c)=>{r&&e.deleteFramebuffer(r),c&&e.deleteTexture(c)};x(this.sceneFbo,this.sceneColorTex),x(this.bloomFboA,this.bloomTexA),x(this.bloomFboB,this.bloomTexB);const u=(r,c)=>{const s=e.createTexture();e.bindTexture(e.TEXTURE_2D,s),this.useHalfFloatFbo?e.texImage2D(e.TEXTURE_2D,0,e.RGBA16F,r,c,0,e.RGBA,e.HALF_FLOAT,null):e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,r,c,0,e.RGBA,e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE);const h=e.createFramebuffer();return e.bindFramebuffer(e.FRAMEBUFFER,h),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,s,0),{fbo:h,tex:s}},m=Math.max(2,o>>1),t=Math.max(2,i>>1),w=u(o,i);this.sceneFbo=w.fbo,this.sceneColorTex=w.tex;const d=u(m,t);this.bloomFboA=d.fbo,this.bloomTexA=d.tex;const l=u(m,t);this.bloomFboB=l.fbo,this.bloomTexB=l.tex,e.bindFramebuffer(e.FRAMEBUFFER,null)}drawInstancedSceneRange(o,i){if(i<=0)return;const e=this.gl,x=o*Pe*4;e.bindBuffer(e.ARRAY_BUFFER,this.sceneInstanceBuf),e.vertexAttribPointer(1,4,e.FLOAT,!1,Pe*4,x),e.vertexAttribPointer(2,4,e.FLOAT,!1,Pe*4,x+16),e.vertexAttribPointer(3,4,e.FLOAT,!1,Pe*4,x+32),e.drawArraysInstanced(e.TRIANGLE_STRIP,0,4,i)}syncInteractiveHotspots(o,i,e,x,u,m,t){t.length=0;const w=i.viewRot??0,d=Math.max(.25,i.zoom),l=o.getActiveFestival(),r=new Set(o.state.unlockedZones);if(!o.state.sandboxMode&&!o.isVisitingNeighbor)for(const s of Et){if(r.has(s.id))continue;const h=(s.x1+s.x2+1)*.5,y=(s.y1+s.y2+1)*.5,f=Yt(h,y,i,e,x,0);f.sx>=-120&&f.sx<=e+120&&f.sy>=-120&&f.sy<=x+120&&t.push({kind:"zone_plaque",id:s.id,sx:f.sx,sy:f.sy,radius:Math.max(28,42*d)})}const c=o.isVisitingNeighbor?[]:o.ensureNeighborSocial().homeLanternMarks;for(const s of o.state.buildings){const h=Oe(s.itemId);if(!h)continue;const{bw:y,bh:f}=o.getBuildingFootprint(h,s.rotation),{rx0:R,ry0:_,rbw:S,rbh:ee}=Fe(s.gx,s.gy,y,f,w),W=o.grid[s.gy]?.[s.gx]?.elevation??0,E=(R-_+(S-ee)*.5)*(Ce*.5),O=(R+S+_+ee)*(Me*.5)-W*Le,L=e*.5+(E-i.x)*d,N=x*.5+(O-i.y)*d;if(L<-220||L>e+220||N<-60||N>x+280)continue;const oe=(y+f)*(Ce*.5)*d,Q=h.spriteScale??(h.width!==h.height?1:1.05),re=u<s.constructEndsAt?"prop_construction_site":h.isFarmlandPlot?"crop_plot_tilled":ot(h.id,h.spriteKey),q=re?this.sprites.get(re):void 0,G=Math.max(28,oe*Q),Y=q?G*(q.height/q.width):Math.max(26,(h.connectableGroup?.55:1.05)*oe),fe=N-Y*.45,j=(s.rotation+w)%4,Se=h.connectableGroup?!1:h.width!==h.height?(j&1)===1:j===1||j===2;if(t.push({kind:"building",id:s.uid,sx:L,sy:fe,radius:Math.max(26,Math.max(G,Y)*.52),spriteKey:re,flipX:Se,boxLeft:L-G*.5,boxTop:N-Y+4*d,boxW:G,boxH:Y}),o.isVisitingNeighbor){o.getVisitedBuildingHelpStatus(s).canHelp&&t.push({kind:"neighbor_help",id:s.uid,sx:L,sy:N-Y*.85,radius:Math.max(22,28*d)});continue}const be=Ht(s,h,u,l,m===s.uid);be?.interactiveHotspotKind&&t.push({kind:be.interactiveHotspotKind,id:s.uid,sx:L,sy:N-Y*.82,radius:Math.max(22,28*d)}),((s.readyBubbles??0)>0||(s.readyFarmGoods?.length??0)>0)&&t.push({kind:"bubble",id:s.uid,sx:L,sy:N-Y*.88,radius:Math.max(24,30*d)});const Ee=c.find(Z=>Z.buildingUid===s.uid);Ee&&t.push({kind:"home_lantern",id:Ee.id,sx:L,sy:N-Y*.92,radius:Math.max(22,28*d)})}for(const s of o.villagers){const h=Ie(s.gx,s.gy,w),y=Math.max(0,Math.min(71,Math.floor(s.gx))),f=Math.max(0,Math.min(71,Math.floor(s.gy))),R=o.grid[f]?.[y]?.elevation??0,_=e*.5+(h.wx-i.x)*d,S=x*.5+(h.wy-R*Le-24-i.y)*d;_>=-60&&_<=e+60&&S>=-60&&S<=x+60&&t.push({kind:"villager",id:s.id,sx:_,sy:S,radius:Math.max(20,26*d)})}for(const s of o.escapedCreatures){const h=Ie(s.gx,s.gy,w),y=e*.5+(h.wx-i.x)*d,f=x*.5+(h.wy-18-i.y)*d;t.push({kind:"escaped",id:s.id,sx:y,sy:f,radius:Math.max(22,28*d)})}}renderFrame(o,i,e,x,u,m){if(this.gpuDevice.contextLost)return;const t=this.gl,w=Xt[e.qualityTier],d=Math.max(1,this.canvas.parentElement?.clientWidth||window.innerWidth),l=Math.max(1,this.canvas.parentElement?.clientHeight||window.innerHeight),r=Math.min(w.dprCap,window.devicePixelRatio||1),c=Math.max(2,Math.round(d*r)),s=Math.max(2,Math.round(l*r));if((this.canvas.width!==c||this.canvas.height!==s)&&(this.canvas.width=c,this.canvas.height=s),this.lastFrameTs>0){const Z=u-this.lastFrameTs;Z>0&&Z<250&&(this.fpsAccumMs+=Z,this.fpsFrames+=1,this.fpsAccumMs>=350&&(this.currentFps=Math.round(this.fpsFrames*1e3/this.fpsAccumMs),this.fpsAccumMs=0,this.fpsFrames=0))}this.lastFrameTs=u;const h=performance.now();this.snapshot.collect(o,i,d,l,u,this,w.maxGrassInstances,w.maxPointLights,x,e.lumosWandEnabled,m),m?.hotspotsOut&&this.syncInteractiveHotspots(o,i,d,l,u,m.selectedBuildingUid??null,m.hotspotsOut);const y=performance.now()-h;this.uvTableDirty&&(t.bindTexture(t.TEXTURE_2D,this.uvTableTex),t.texSubImage2D(t.TEXTURE_2D,0,0,0,Ye,2,t.RGBA,t.FLOAT,this.uvTableData),this.uvTableDirty=!1),this.uploadedStaticGen!==this.snapshot.staticDirtyGeneration&&(this.uploadedStaticGen=this.snapshot.staticDirtyGeneration,t.bindBuffer(t.ARRAY_BUFFER,this.terrainInstanceBuf),t.bufferData(t.ARRAY_BUFFER,this.snapshot.terrainData.subarray(0,this.snapshot.terrainCount*Be),t.STATIC_DRAW),t.bindBuffer(t.ARRAY_BUFFER,this.waterInstanceBuf),t.bufferData(t.ARRAY_BUFFER,this.snapshot.waterData.subarray(0,this.snapshot.waterCount*ze),t.STATIC_DRAW),t.bindBuffer(t.ARRAY_BUFFER,this.grassInstanceBuf),t.bufferData(t.ARRAY_BUFFER,this.snapshot.grassData.subarray(0,this.snapshot.grassCount*We),t.STATIC_DRAW)),this.snapshot.sceneCount>0&&(t.bindBuffer(t.ARRAY_BUFFER,this.sceneInstanceBuf),t.bufferSubData(t.ARRAY_BUFFER,0,this.snapshot.sceneData.subarray(0,this.snapshot.sceneCount*Pe))),this.snapshot.particleCount>0&&(t.bindBuffer(t.ARRAY_BUFFER,this.particleInstanceBuf),t.bufferSubData(t.ARRAY_BUFFER,0,this.snapshot.particleData.subarray(0,this.snapshot.particleCount*ke)));const f=this.snapshot.lightCount;for(let Z=0;Z<f;Z++){const ie=Z*it,b=Z*4;this.lightPosUniform[b]=this.snapshot.lightData[ie],this.lightPosUniform[b+1]=this.snapshot.lightData[ie+1],this.lightPosUniform[b+2]=this.snapshot.lightData[ie+2],this.lightPosUniform[b+3]=this.snapshot.lightData[ie+3],this.lightColUniform[b]=this.snapshot.lightData[ie+4],this.lightColUniform[b+1]=this.snapshot.lightData[ie+5],this.lightColUniform[b+2]=this.snapshot.lightData[ie+6],this.lightColUniform[b+3]=this.snapshot.lightData[ie+7]}const R=this.snapshot.period,_=this.snapshot.weatherKind,S=_==="rain"||_==="storm",ee=_==="snow",W=ee||this.snapshot.seasonId==="winter"&&!S?1:0,E=R==="dawn"?0:R==="dusk"?2:R==="night"?3:1,O=S?1:ee||this.snapshot.seasonId==="winter"?2:0;let L=[1.03,1.03,1.01],N=[-.42,-.52,.74],oe=[.22,.2,.14],Q=[.38,.76,.98],re=[.06,.12,.18],q=.2;R==="dawn"?(L=[1,.97,.92],N=[.68,-.38,.62],oe=[.3,.24,.15],Q=[.46,.76,.95],re=[.06,.11,.16],q=.3):R==="dusk"?(L=[.92,.85,.89],N=[-.74,-.35,.57],oe=[.4,.26,.16],Q=[.84,.58,.52],re=[.07,.06,.16],q=.68):R==="night"&&(L=W>.5?[.8,.87,.99]:[.74,.81,.95],N=[.35,-.55,.75],oe=[.16,.22,.36],Q=[.28,.48,.74],re=[.04,.06,.14],q=.82),S&&(L=[L[0]*.92,L[1]*.94,L[2]*.97],oe=[oe[0]*.65,oe[1]*.68,oe[2]*.75],q=Math.max(q,.55));const G=u*.001;let Y=0;const fe=w.bloomEnabled&&e.bloomIntensity>.02;if(fe?(this.ensureRenderTargets(c,s),t.bindFramebuffer(t.FRAMEBUFFER,this.sceneFbo)):t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,c,s),t.disable(t.BLEND),t.useProgram(this.skyProg),t.uniform1f(this.uLoc(this.skyProg,"uTime"),G),t.uniform1i(this.uLoc(this.skyProg,"uPeriod"),E),t.uniform1i(this.uLoc(this.skyProg,"uWeather"),O),t.bindVertexArray(this.emptyVao),t.drawArrays(t.TRIANGLES,0,3),Y++,this.snapshot.terrainCount>0&&(t.useProgram(this.terrainProg),t.uniform3f(this.uLoc(this.terrainProg,"uCamera"),i.x,i.y,i.zoom),t.uniform2f(this.uLoc(this.terrainProg,"uViewport"),d,l),t.uniform1f(this.uLoc(this.terrainProg,"uTime"),G),t.uniform1f(this.uLoc(this.terrainProg,"uWinterSnow"),W),t.uniform3fv(this.uLoc(this.terrainProg,"uAmbientTint"),L),t.uniform1i(this.uLoc(this.terrainProg,"uLightCount"),f),f>0&&(t.uniform4fv(this.uLoc(this.terrainProg,"uLightPosRad"),this.lightPosUniform),t.uniform4fv(this.uLoc(this.terrainProg,"uLightColInt"),this.lightColUniform)),t.bindVertexArray(this.terrainVao),t.drawArraysInstanced(t.TRIANGLE_STRIP,0,4,this.snapshot.terrainCount),Y++),t.enable(t.BLEND),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA),this.snapshot.waterCount>0&&(t.useProgram(this.waterProg),t.uniform3f(this.uLoc(this.waterProg,"uCamera"),i.x,i.y,i.zoom),t.uniform2f(this.uLoc(this.waterProg,"uViewport"),d,l),t.uniform1f(this.uLoc(this.waterProg,"uTime"),G),t.uniform1f(this.uLoc(this.waterProg,"uWinterSnow"),W),t.uniform3fv(this.uLoc(this.waterProg,"uAmbientTint"),L),t.uniform3fv(this.uLoc(this.waterProg,"uSkyReflectColor"),Q),t.uniform3fv(this.uLoc(this.waterProg,"uSunColor"),oe),t.uniform1i(this.uLoc(this.waterProg,"uInteractorCount"),this.snapshot.interactorCount),this.snapshot.interactorCount>0&&t.uniform4fv(this.uLoc(this.waterProg,"uInteractors"),this.snapshot.interactorData),t.uniform1i(this.uLoc(this.waterProg,"uLightCount"),f),f>0&&(t.uniform4fv(this.uLoc(this.waterProg,"uLightPosRad"),this.lightPosUniform),t.uniform4fv(this.uLoc(this.waterProg,"uLightColInt"),this.lightColUniform)),t.bindVertexArray(this.waterVao),t.drawArraysInstanced(t.TRIANGLE_STRIP,0,4,this.snapshot.waterCount),Y++),this.snapshot.grassCount>0&&(t.useProgram(this.grassProg),t.uniform3f(this.uLoc(this.grassProg,"uCamera"),i.x,i.y,i.zoom),t.uniform2f(this.uLoc(this.grassProg,"uViewport"),d,l),t.uniform1f(this.uLoc(this.grassProg,"uTime"),G),t.uniform1f(this.uLoc(this.grassProg,"uWindStrength"),e.windStrength),t.uniform1f(this.uLoc(this.grassProg,"uWinterSnow"),W),t.uniform3fv(this.uLoc(this.grassProg,"uAmbientTint"),L),t.uniform3fv(this.uLoc(this.grassProg,"uSunColor"),oe),t.uniform1i(this.uLoc(this.grassProg,"uInteractorCount"),this.snapshot.interactorCount),this.snapshot.interactorCount>0&&t.uniform4fv(this.uLoc(this.grassProg,"uInteractors"),this.snapshot.interactorData),t.uniform1i(this.uLoc(this.grassProg,"uLightCount"),f),f>0&&(t.uniform4fv(this.uLoc(this.grassProg,"uLightPosRad"),this.lightPosUniform),t.uniform4fv(this.uLoc(this.grassProg,"uLightColInt"),this.lightColUniform)),t.bindVertexArray(this.grassVao),t.drawArraysInstanced(t.TRIANGLE_STRIP,0,4,this.snapshot.grassCount),Y++),this.snapshot.sceneCount>0){t.blendFunc(t.ONE,t.ONE_MINUS_SRC_ALPHA),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D_ARRAY,this.albedoArrayTex),t.activeTexture(t.TEXTURE1),t.bindTexture(t.TEXTURE_2D_ARRAY,this.normalEmissiveArrayTex),t.activeTexture(t.TEXTURE2),t.bindTexture(t.TEXTURE_2D,this.uvTableTex),t.bindVertexArray(this.sceneVao),t.useProgram(this.shadowProg),t.uniform3f(this.uLoc(this.shadowProg,"uCamera"),i.x,i.y,i.zoom),t.uniform2f(this.uLoc(this.shadowProg,"uViewport"),d,l),t.uniform1i(this.uLoc(this.shadowProg,"uAlbedo"),0),t.uniform1i(this.uLoc(this.shadowProg,"uUvTable"),2),t.uniform2f(this.uLoc(this.shadowProg,"uShadowSkew"),this.snapshot.sunShadowDx,this.snapshot.sunShadowDy),t.uniform1f(this.uLoc(this.shadowProg,"uTime"),G),t.uniform1f(this.uLoc(this.shadowProg,"uWindStrength"),e.windStrength),t.uniform3fv(this.uLoc(this.shadowProg,"uShadowTint"),re),this.drawInstancedSceneRange(0,this.snapshot.sceneCount),Y++,t.useProgram(this.sceneProg),t.uniform3f(this.uLoc(this.sceneProg,"uCamera"),i.x,i.y,i.zoom),t.uniform2f(this.uLoc(this.sceneProg,"uViewport"),d,l),t.uniform1i(this.uLoc(this.sceneProg,"uAlbedo"),0),t.uniform1i(this.uLoc(this.sceneProg,"uNormalEmissive"),1),t.uniform1i(this.uLoc(this.sceneProg,"uUvTable"),2),t.uniform1f(this.uLoc(this.sceneProg,"uTime"),G),t.uniform1f(this.uLoc(this.sceneProg,"uWindStrength"),e.windStrength),t.uniform3fv(this.uLoc(this.sceneProg,"uAmbientTint"),L),t.uniform3fv(this.uLoc(this.sceneProg,"uSunDir"),N),t.uniform3fv(this.uLoc(this.sceneProg,"uSunColor"),oe),t.uniform1f(this.uLoc(this.sceneProg,"uNormalStrength"),e.normalStrength),t.uniform1f(this.uLoc(this.sceneProg,"uWindowGlowStrength"),q),t.uniform1f(this.uLoc(this.sceneProg,"uWinterSnow"),W),t.uniform1i(this.uLoc(this.sceneProg,"uLightCount"),f),f>0&&(t.uniform4fv(this.uLoc(this.sceneProg,"uLightPosRad"),this.lightPosUniform),t.uniform4fv(this.uLoc(this.sceneProg,"uLightColInt"),this.lightColUniform));const Z=zt(this.snapshot.sceneCount,this.snapshot.skeletalSortedIndices,this.snapshot.skeletalCount,this.rangeSlices);let ie=!0;for(let b=0;b<Z;b++){const a=this.rangeSlices[b];if(a.kind==="instanced_range")ie||(t.useProgram(this.sceneProg),t.bindVertexArray(this.sceneVao),ie=!0),this.drawInstancedSceneRange(a.firstInstance,a.instanceCount),Y++;else{const g=this.snapshot.skeletalPoses[a.skeletalSlotIndex];g&&(this.spineAdapter.renderArticulatedSlot(g,i.x,i.y,i.zoom,d,l,G,L,this.albedoArrayTex,this.uvTableTex),ie=!1,Y++)}}}if(this.snapshot.particleCount>0){const Z=W>.5||ee;Z?t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA):t.blendFunc(t.SRC_ALPHA,t.ONE),t.useProgram(this.particleProg),t.uniform3f(this.uLoc(this.particleProg,"uCamera"),i.x,i.y,i.zoom),t.uniform2f(this.uLoc(this.particleProg,"uViewport"),d,l),t.uniform1f(this.uLoc(this.particleProg,"uIsSnow"),Z?1:0),t.bindVertexArray(this.particleVao),t.drawArraysInstanced(t.TRIANGLE_STRIP,0,4,this.snapshot.particleCount),Y++}if(fe&&this.sceneColorTex&&this.bloomFboA&&this.bloomFboB&&this.bloomTexA&&this.bloomTexB){t.disable(t.BLEND);const Z=Math.max(2,c>>1),ie=Math.max(2,s>>1);t.bindVertexArray(this.emptyVao),t.bindFramebuffer(t.FRAMEBUFFER,this.bloomFboA),t.viewport(0,0,Z,ie),t.useProgram(this.bloomExtractProg),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.sceneColorTex),t.uniform1i(this.uLoc(this.bloomExtractProg,"uScene"),0),t.drawArrays(t.TRIANGLES,0,3),Y++,t.useProgram(this.bloomBlurProg),t.uniform1i(this.uLoc(this.bloomBlurProg,"uTex"),0),t.bindFramebuffer(t.FRAMEBUFFER,this.bloomFboB),t.bindTexture(t.TEXTURE_2D,this.bloomTexA),t.uniform2f(this.uLoc(this.bloomBlurProg,"uOffset"),1.5/Z,1.5/ie),t.drawArrays(t.TRIANGLES,0,3),Y++,t.bindFramebuffer(t.FRAMEBUFFER,this.bloomFboA),t.bindTexture(t.TEXTURE_2D,this.bloomTexB),t.uniform2f(this.uLoc(this.bloomBlurProg,"uOffset"),3.2/Z,3.2/ie),t.drawArrays(t.TRIANGLES,0,3),Y++,t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,c,s),t.useProgram(this.compositeProg),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.sceneColorTex),t.uniform1i(this.uLoc(this.compositeProg,"uScene"),0),t.activeTexture(t.TEXTURE1),t.bindTexture(t.TEXTURE_2D,this.bloomTexA),t.uniform1i(this.uLoc(this.compositeProg,"uBloom"),1),t.uniform1f(this.uLoc(this.compositeProg,"uBloomIntensity"),e.bloomIntensity),t.drawArrays(t.TRIANGLES,0,3),Y++}t.bindVertexArray(null);const j=this.shelf.layer+1,Se=j*2*(ne*ne*4/(1024*1024)),be=this.useHalfFloatFbo?8:4,Ee=fe?c*s*1.5*be/(1024*1024):0;this.stats={backend:"webgl2",fps:this.currentFps,cpuCollectMs:Number(y.toFixed(2)),drawCalls:Y,terrainTiles:this.snapshot.terrainCount,waterTiles:this.snapshot.waterCount,grassInstances:this.snapshot.grassCount,sortedSprites:this.snapshot.sceneCount,particleInstances:this.snapshot.particleCount,activeLights:f,atlasLayers:j,atlasSpritesPacked:this.nextSpriteId,vramEstimateMb:Number((Se+Ee).toFixed(1))}}destroy(){const o=this.gl;this.spineAdapter.destroy(),o.deleteTexture(this.albedoArrayTex),o.deleteTexture(this.normalEmissiveArrayTex),o.deleteTexture(this.uvTableTex),this.sceneColorTex&&o.deleteTexture(this.sceneColorTex),this.bloomTexA&&o.deleteTexture(this.bloomTexA),this.bloomTexB&&o.deleteTexture(this.bloomTexB),o.deleteFramebuffer(this.bakeFbo),this.sceneFbo&&o.deleteFramebuffer(this.sceneFbo),this.bloomFboA&&o.deleteFramebuffer(this.bloomFboA),this.bloomFboB&&o.deleteFramebuffer(this.bloomFboB),this.gpuDevice.destroy()}}export{Io as WebGL2WorldRenderer,ro as canSpriteReceiveWinterSnowCap,no as shouldCleanseSpriteBakedHalo};
