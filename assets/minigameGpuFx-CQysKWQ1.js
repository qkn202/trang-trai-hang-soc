var R=Object.defineProperty;var m=(A,e,t)=>e in A?R(A,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):A[e]=t;var s=(A,e,t)=>m(A,typeof e!="symbol"?e+"":e,t);const v=[[1.45,1.12,.32],[.25,1.38,.76],[1.42,.42,.62],[.42,1.05,1.48],[1.12,.58,1.45]],_=`#version 300 es
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
`,b=`#version 300 es
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
`;class E{constructor(e){s(this,"hostEl");s(this,"canvas",null);s(this,"gl",null);s(this,"prog",null);s(this,"vao",null);s(this,"instanceBuf",null);s(this,"sparkPool",new Float32Array(512*8));s(this,"sparkActive",new Uint8Array(512));s(this,"gpuData",new Float32Array(512*7));s(this,"activeCount",0);s(this,"rafId",0);s(this,"lastTs",0);s(this,"tick",e=>{if(this.rafId=0,!this.gl||!this.canvas||!this.prog||!this.vao||!this.instanceBuf)return;const t=Math.min(.05,Math.max(.001,(e-this.lastTs)/1e3));this.lastTs=e;const l=Math.max(1,window.innerWidth||1280),h=Math.max(1,window.innerHeight||720),n=Math.min(2,window.devicePixelRatio||1),u=Math.round(l*n),c=Math.round(h*n);(this.canvas.width!==u||this.canvas.height!==c)&&(this.canvas.width=u,this.canvas.height=c);let r=0;for(let p=0;p<512;p++){if(this.sparkActive[p]===0)continue;const i=p*8,o=this.sparkPool[i+4]+t,f=this.sparkPool[i+5];if(o>=f){this.sparkActive[p]=0,this.activeCount=Math.max(0,this.activeCount-1);continue}this.sparkPool[i+4]=o,this.sparkPool[i+2]*=Math.pow(.08,t),this.sparkPool[i+3]=this.sparkPool[i+3]*Math.pow(.12,t)+190*t,this.sparkPool[i]+=this.sparkPool[i+2]*t,this.sparkPool[i+1]+=this.sparkPool[i+3]*t;const g=o/f,S=Math.max(0,1-g*g),P=v[Math.round(this.sparkPool[i+7])%v.length],d=r*7;this.gpuData[d]=this.sparkPool[i],this.gpuData[d+1]=this.sparkPool[i+1],this.gpuData[d+2]=this.sparkPool[i+6]*(1-g*.45),this.gpuData[d+3]=P[0],this.gpuData[d+4]=P[1],this.gpuData[d+5]=P[2],this.gpuData[d+6]=S,r++}const a=this.gl;a.viewport(0,0,u,c),a.clearColor(0,0,0,0),a.clear(a.COLOR_BUFFER_BIT),r>0?(a.enable(a.BLEND),a.blendFunc(a.ONE,a.ONE),a.useProgram(this.prog),a.uniform2f(a.getUniformLocation(this.prog,"uViewport"),l,h),a.bindVertexArray(this.vao),a.bindBuffer(a.ARRAY_BUFFER,this.instanceBuf),a.bufferSubData(a.ARRAY_BUFFER,0,this.gpuData.subarray(0,r*7)),a.drawArraysInstanced(a.TRIANGLE_STRIP,0,4,r),a.bindVertexArray(null),this.rafId=requestAnimationFrame(this.tick)):this.canvas.style.display="none"});this.hostEl=e}ensureInitialized(){if(this.gl)return!0;if(typeof document>"u"||typeof window<"u"&&window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)return!1;try{const e=document.createElement("canvas");e.className="minigame-gpu-fx-overlay",e.setAttribute("aria-hidden","true"),e.style.cssText="position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:2147483645;display:none;",this.hostEl.appendChild(e);const t=e.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!t)return e.remove(),!1;const l=t.createShader(t.VERTEX_SHADER);t.shaderSource(l,_),t.compileShader(l);const h=t.createShader(t.FRAGMENT_SHADER);t.shaderSource(h,b),t.compileShader(h);const n=t.createProgram();if(t.attachShader(n,l),t.attachShader(n,h),t.linkProgram(n),t.deleteShader(l),t.deleteShader(h),!t.getProgramParameter(n,t.LINK_STATUS))return t.deleteProgram(n),e.remove(),!1;const u=new Float32Array([-.5,-.5,.5,-.5,-.5,.5,.5,.5]),c=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,c),t.bufferData(t.ARRAY_BUFFER,u,t.STATIC_DRAW);const r=t.createVertexArray(),a=t.createBuffer();return t.bindVertexArray(r),t.bindBuffer(t.ARRAY_BUFFER,c),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0),t.bindBuffer(t.ARRAY_BUFFER,a),t.bufferData(t.ARRAY_BUFFER,this.gpuData.byteLength,t.DYNAMIC_DRAW),t.enableVertexAttribArray(1),t.vertexAttribPointer(1,3,t.FLOAT,!1,28,0),t.vertexAttribDivisor(1,1),t.enableVertexAttribArray(2),t.vertexAttribPointer(2,4,t.FLOAT,!1,28,12),t.vertexAttribDivisor(2,1),t.bindVertexArray(null),this.canvas=e,this.gl=t,this.prog=n,this.vao=r,this.instanceBuf=a,!0}catch{return!1}}spawnStarburst(e,t,l=26,h=0,n=1){if(!this.ensureInitialized())return;const u=Math.abs(h)%v.length,c=Math.min(72,Math.max(6,Math.round(l)));for(let r=0;r<c;r++){let a=-1;for(let f=0;f<512;f++)if(this.sparkActive[f]===0){a=f;break}if(a<0)break;this.sparkActive[a]=1,this.activeCount++;const p=Math.PI*2*r/c+(Math.random()-.5)*.35,i=(95+Math.random()*210)*n,o=a*8;this.sparkPool[o]=e,this.sparkPool[o+1]=t,this.sparkPool[o+2]=Math.cos(p)*i,this.sparkPool[o+3]=Math.sin(p)*i-35,this.sparkPool[o+4]=0,this.sparkPool[o+5]=.34+Math.random()*.32,this.sparkPool[o+6]=4.5+Math.random()*6.5,this.sparkPool[o+7]=(u+(r%2===0?0:1))%v.length}this.canvas&&(this.canvas.style.display="block"),this.rafId||(this.lastTs=performance.now(),this.rafId=requestAnimationFrame(this.tick))}destroy(){this.rafId&&(cancelAnimationFrame(this.rafId),this.rafId=0),this.gl&&(this.prog&&this.gl.deleteProgram(this.prog),this.vao&&this.gl.deleteVertexArray(this.vao),this.instanceBuf&&this.gl.deleteBuffer(this.instanceBuf),this.gl=null),this.canvas?.remove(),this.canvas=null}}export{E as M};
