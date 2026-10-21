let chromium;
try { ({chromium}=require('playwright')); }
catch { ({chromium}=require('../.tools/node_modules/playwright')); }
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const results=[];
 for(const width of [360,390,768,1024,1440,1920]){
  const page=await browser.newPage({viewport:{width,height:width<768?844:1000},isMobile:width<768,hasTouch:width<768});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.url())});
  await page.goto('http://127.0.0.1:4173',{waitUntil:'networkidle'});
  await page.waitForTimeout(1000);
  fs.mkdirSync(`.qa/v3/${width}`,{recursive:true});
  const heights=[];
  for(let i=0;i<3;i++){
   await page.locator(`[data-slide="${i}"]`).click();
   await page.locator('.hero-slide:not([hidden]) img').evaluateAll(imgs=>Promise.all(imgs.map(im=>im.decode())));
   await page.waitForTimeout(600);
   assert.equal(await page.locator('.hero-slide:not([hidden])').count(),1);
   assert.equal(await page.locator('#hero-current').textContent(),String(i+1).padStart(2,'0'));
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${width}/${i}`);
   assert.equal(await page.locator('.hero-slide[hidden] a:visible').count(),0);
   heights.push((await page.locator('.hero-carousel').boundingBox()).height);
   if(width<768){
    const controls=await page.locator('.hero-controls').boundingBox();
    const bar=await page.locator('.mobile-contact-bar').boundingBox();
    assert(controls.y+controls.height<=bar.y,'Controls hidden by bottom bar');
   }
   if(await page.locator('.hero-slide:not([hidden])').evaluate(el=>el.classList.contains('hero--full'))){
    const image=await page.locator('.hero-slide:not([hidden]) .hero-full-image').boundingBox();
    const hero=await page.locator('.hero-carousel').boundingBox();
    assert(Math.abs(image.width-hero.width)<2,'Full bleed');
    const title=await page.locator('.hero-slide:not([hidden]) h2').boundingBox();
    const control=await page.locator('.hero-controls').boundingBox();
    assert(title.y+title.height<control.y,'Title/control overlap');
   }
   await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
   await page.screenshot({path:`.qa/v3/${width}/hero-${i+1}.png`});
  }
  assert(Math.max(...heights)-Math.min(...heights)<3,`Layout shift: ${heights}`);
  await page.locator('.hero-next').click();assert.equal(await page.locator('#hero-current').textContent(),'01');
  await page.locator('.hero-prev').click();assert.equal(await page.locator('#hero-current').textContent(),'03');
  await page.locator('.hero-next').focus();await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#hero-current').textContent(),'01');
  const rail=page.locator('#quick-nav');
  if(width<1200){await page.locator('.quick-nav-toggle').click();assert(await rail.isVisible());await page.keyboard.press('Escape');assert(!(await rail.isVisible()));}
  else{
   assert(await rail.isVisible());
   const railBox=await rail.boundingBox();const mainBox=await page.locator('main').boundingBox();
   assert(Math.abs(mainBox.width-width)<2,'Main does not fill viewport');
   assert(railBox.x<mainBox.x+mainBox.width,'Rail must overlay Hero');
   for(const link of await page.locator('.desktop-nav a').all()){
    const old=await link.boundingBox();await link.hover();await page.waitForTimeout(250);
    assert.equal(await link.locator('.nav-ko').evaluate(el=>getComputedStyle(el).opacity),'1');
    assert.equal(await link.locator('.nav-en').evaluate(el=>getComputedStyle(el).opacity),'0');
    const next=await link.boundingBox();assert.equal(old.width,next.width,'Menu layout shift');
    await link.focus();await page.mouse.move(0,0);assert.equal(await link.locator('.nav-ko').evaluate(el=>getComputedStyle(el).opacity),'1');
   }
  }
  for(const channel of ['event','youtube','instagram','blog']){
   if(width<1200)await page.locator('.quick-nav-toggle').click();
   await page.locator(`[data-channel="${channel}"]`).click();assert(await page.locator('#info-dialog').isVisible());
   await page.keyboard.press('Escape');await page.waitForTimeout(60);
  }
  if(width<1200)await page.locator('.quick-nav-toggle').click();
  await rail.locator('a[href="#location"]').click();
  await page.waitForTimeout(800);
  assert.equal(await page.evaluate(()=>location.hash),'#location');
  if(width<1200)await page.locator('.quick-nav-toggle').click();
  await rail.locator('a[href="#home"]').click();await page.waitForTimeout(800);
  await page.waitForFunction(()=>scrollY<5);
  if(width<768){
   const hero=await page.locator('.hero-slide:not([hidden]) picture').boundingBox();
   const cdp=await page.context().newCDPSession(page);const y=Math.min(700,hero.y+120);
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:width*.8,y}]});
   for(let n=1;n<=8;n++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:width*(.8-.65*n/8),y}]});
   await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
   await page.waitForTimeout(100);assert.equal(await page.locator('#hero-current').textContent(),'02','Touch swipe');
  }
  assert.deepEqual(errors,[]);results.push({width,slides:'3/3',fullBleed:'pass',heightStable:'pass',rail:'pass',channels:'4/4',hover:width>=1200?'pass':'mobile menu',touch:width<768?'pass':'N/A',errors});
  console.log('PASS',width);await page.close();
 }
 const auto=await browser.newPage({viewport:{width:1440,height:1000}});await auto.goto('http://127.0.0.1:4173');
 await auto.mouse.move(20,20);await auto.waitForTimeout(7400);assert.equal(await auto.locator('#hero-current').textContent(),'02','Auto play');
 await auto.locator('.hero-play').click();const stopped=await auto.locator('#hero-current').textContent();await auto.mouse.move(20,20);await auto.locator('.wordmark').first().focus();await auto.waitForTimeout(7400);assert.equal(await auto.locator('#hero-current').textContent(),stopped,'Pause');
 const reduced=await browser.newPage({reducedMotion:'reduce'});await reduced.goto('http://127.0.0.1:4173');assert.equal(await reduced.locator('.hero-play').getAttribute('aria-label'),'자동 재생 시작');
 await browser.close();fs.writeFileSync('.qa/v3/results.json',JSON.stringify({results,autoplay:'pass',pause:'pass',reducedMotion:'pass'},null,2));
})().catch(e=>{console.error(e);process.exit(1)});
