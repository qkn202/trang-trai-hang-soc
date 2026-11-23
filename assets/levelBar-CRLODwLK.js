var P=Object.defineProperty;var m=(s,e,t)=>e in s?P(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var r=(s,e,t)=>m(s,typeof e!="symbol"?e+"":e,t);const A=[[1.45,1.12,.32],[.25,1.38,.76],[1.42,.42,.62],[.42,1.05,1.48],[1.12,.58,1.45]],R=`#version 300 es
precision highp float;
layout(location = 0) in vec2 aQuad;
layout(location = 1) in vec3 iPosSize; // (sx, sy, size)
layout(location = 2) in vec4 iColAlpha; // (r, g, b, alpha)
uniform vec2 uViewport;
out vec2 vLocal;
out vec4 vColAlpha;

void main() {
  vec2 sp = iPosSize.xy + aQuad * (iPosSize.z * 2.5);
  vec2 clip = vec2((sp.x / uViewport.x) * 2.0 - 1.0, 1.0 - (sp.y / uViewport.y) * 2.0);
  gl_Position = vec4(clip, 0.0, 1.0);
  vLocal = aQuad * 2.0;
  vColAlpha = iColAlpha;
}
`,_=`#version 300 es
precision highp float;
in vec2 vLocal;
in vec4 vColAlpha;
out vec4 fragColor;

void main() {
  float d = length(vLocal);
  if (d > 1.0) discard;
  float core = pow(1.0 - d, 2.35);
  float crossFlare = max(
    exp(-abs(vLocal.x) * 9.0) * (1.0 - d),
    exp(-abs(vLocal.y) * 9.0) * (1.0 - d)
  ) * 0.55;
  float glow = clamp(core + crossFlare, 0.0, 1.4) * vColAlpha.a;
  fragColor = vec4(vColAlpha.rgb * glow, glow);
}
`;class I{constructor(e){r(this,"hostEl");r(this,"canvas",null);r(this,"gl",null);r(this,"prog",null);r(this,"vao",null);r(this,"instanceBuf",null);r(this,"sparkPool",new Float32Array(512*8));r(this,"sparkActive",new Uint8Array(512));r(this,"gpuData",new Float32Array(512*7));r(this,"activeCount",0);r(this,"rafId",0);r(this,"lastTs",0);r(this,"tick",e=>{if(this.rafId=0,!this.gl||!this.canvas||!this.prog||!this.vao||!this.instanceBuf)return;const t=Math.min(.05,Math.max(.001,(e-this.lastTs)/1e3));this.lastTs=e;const c=Math.max(1,window.innerWidth||1280),p=Math.max(1,window.innerHeight||720),n=c,u=p;(this.canvas.width!==n||this.canvas.height!==u)&&(this.canvas.width=n,this.canvas.height=u);let l=0;for(let o=0;o<512;o++){if(this.sparkActive[o]===0)continue;const i=o*8,f=this.sparkPool[i+4]+t,h=this.sparkPool[i+5];if(f>=h){this.sparkActive[o]=0,this.activeCount=Math.max(0,this.activeCount-1);continue}this.sparkPool[i+4]=f,this.sparkPool[i+2]*=Math.pow(.08,t),this.sparkPool[i+3]=this.sparkPool[i+3]*Math.pow(.12,t)+190*t,this.sparkPool[i]+=this.sparkPool[i+2]*t,this.sparkPool[i+1]+=this.sparkPool[i+3]*t;const d=f/h,S=Math.max(0,1-d*d),g=A[Math.round(this.sparkPool[i+7])%A.length],v=l*7;this.gpuData[v]=this.sparkPool[i],this.gpuData[v+1]=this.sparkPool[i+1],this.gpuData[v+2]=this.sparkPool[i+6]*(1-d*.45),this.gpuData[v+3]=g[0],this.gpuData[v+4]=g[1],this.gpuData[v+5]=g[2],this.gpuData[v+6]=S,l++}const a=this.gl;a.viewport(0,0,n,u),a.clearColor(0,0,0,0),a.clear(a.COLOR_BUFFER_BIT),l>0?(a.enable(a.BLEND),a.blendFunc(a.ONE,a.ONE),a.useProgram(this.prog),a.uniform2f(a.getUniformLocation(this.prog,"uViewport"),c,p),a.bindVertexArray(this.vao),a.bindBuffer(a.ARRAY_BUFFER,this.instanceBuf),a.bufferSubData(a.ARRAY_BUFFER,0,this.gpuData.subarray(0,l*7)),a.drawArraysInstanced(a.TRIANGLE_STRIP,0,4,l),a.bindVertexArray(null),this.rafId=requestAnimationFrame(this.tick)):this.canvas.style.display="none"});this.hostEl=e}ensureInitialized(){if(this.gl)return!0;if(typeof document>"u"||typeof window<"u"&&window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)return!1;try{const e=document.createElement("canvas");e.className="minigame-gpu-fx-overlay",e.setAttribute("aria-hidden","true"),e.style.cssText="position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:2147483645;display:none;",this.hostEl.appendChild(e);const t=e.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!t)return e.remove(),!1;const c=t.createShader(t.VERTEX_SHADER);t.shaderSource(c,R),t.compileShader(c);const p=t.createShader(t.FRAGMENT_SHADER);t.shaderSource(p,_),t.compileShader(p);const n=t.createProgram();if(t.attachShader(n,c),t.attachShader(n,p),t.linkProgram(n),t.deleteShader(c),t.deleteShader(p),!t.getProgramParameter(n,t.LINK_STATUS))return t.deleteProgram(n),e.remove(),!1;const u=new Float32Array([-.5,-.5,.5,-.5,-.5,.5,.5,.5]),l=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,l),t.bufferData(t.ARRAY_BUFFER,u,t.STATIC_DRAW);const a=t.createVertexArray(),o=t.createBuffer();return t.bindVertexArray(a),t.bindBuffer(t.ARRAY_BUFFER,l),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0),t.bindBuffer(t.ARRAY_BUFFER,o),t.bufferData(t.ARRAY_BUFFER,this.gpuData.byteLength,t.DYNAMIC_DRAW),t.enableVertexAttribArray(1),t.vertexAttribPointer(1,3,t.FLOAT,!1,28,0),t.vertexAttribDivisor(1,1),t.enableVertexAttribArray(2),t.vertexAttribPointer(2,4,t.FLOAT,!1,28,12),t.vertexAttribDivisor(2,1),t.bindVertexArray(null),this.canvas=e,this.gl=t,this.prog=n,this.vao=a,this.instanceBuf=o,!0}catch{return!1}}spawnStarburst(e,t,c=26,p=0,n=1){if(!this.ensureInitialized())return;const u=Math.abs(p)%A.length,l=Math.min(72,Math.max(6,Math.round(c)));for(let a=0;a<l;a++){let o=-1;for(let d=0;d<512;d++)if(this.sparkActive[d]===0){o=d;break}if(o<0)break;this.sparkActive[o]=1,this.activeCount++;const i=Math.PI*2*a/l+(Math.random()-.5)*.35,f=(95+Math.random()*210)*n,h=o*8;this.sparkPool[h]=e,this.sparkPool[h+1]=t,this.sparkPool[h+2]=Math.cos(i)*f,this.sparkPool[h+3]=Math.sin(i)*f-35,this.sparkPool[h+4]=0,this.sparkPool[h+5]=.34+Math.random()*.32,this.sparkPool[h+6]=4.5+Math.random()*6.5,this.sparkPool[h+7]=(u+(a%2===0?0:1))%A.length}this.canvas&&(this.canvas.style.display="block"),this.rafId||(this.lastTs=performance.now(),this.rafId=requestAnimationFrame(this.tick))}clear(){this.rafId&&(cancelAnimationFrame(this.rafId),this.rafId=0),this.sparkActive.fill(0),this.activeCount=0,this.gl&&this.canvas&&this.canvas.width>0&&this.canvas.height>0&&(this.gl.viewport(0,0,this.canvas.width,this.canvas.height),this.gl.clearColor(0,0,0,0),this.gl.clear(this.gl.COLOR_BUFFER_BIT)),this.canvas&&(this.canvas.style.display="none")}destroy(){this.rafId&&(cancelAnimationFrame(this.rafId),this.rafId=0),this.gl&&(this.prog&&this.gl.deleteProgram(this.prog),this.vao&&this.gl.deleteVertexArray(this.vao),this.instanceBuf&&this.gl.deleteBuffer(this.instanceBuf),this.gl=null),this.canvas?.remove(),this.canvas=null}}const b="/trang-trai-hang-soc/sprites/",k=s=>`<img class="hs-ico" src="${b}${s}.webp" alt="" aria-hidden="true">`,y='<span class="hs-x" aria-hidden="true"></span>',T=(s,e,t="")=>`<span class="hs-lv-stat"><span class="sr-only">${s}</span>${t}${e}</span>`,E=s=>s.replace(/ (\S+)$/," $1");function x(s){return s.alert&&(s={...s,alert:E(s.alert)}),`
    <div class="pa-stage-banner hs-lv${s.alert?" is-alert":""}"${s.alert?' role="status"':""}>
      <div class="hs-lv-meta"><div class="hs-lv-stage">${s.stage}</div><div class="hs-lv-sub">${s.alert??s.sub}</div></div>
      <div class="hs-lv-stats">${s.alert&&s.action?s.action:s.stats}</div>
    </div>`}export{y as L,I as M,x as a,k as b,T as l};
