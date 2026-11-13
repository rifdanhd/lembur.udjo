// Opt-in real Sandbox payment and genuine HTTPS delivery; disposable local DB only.
// Never synthesizes a payment status or notification signature.
import { spawn, spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdtempSync, mkdirSync, openSync, closeSync, writeFileSync } from 'node:fs';
import { tmpdir, userInfo } from 'node:os';
import { join } from 'node:path';
import { randomBytes } from 'node:crypto';
import assert from 'node:assert/strict';
import nextEnv from '@next/env';
import { PrismaClient } from '@prisma/client';
import { chromium } from '@playwright/test';
import { hashPassword } from '../lib/ticketing/visitor-auth.ts';
nextEnv.loadEnvConfig(process.cwd());
if(process.env.MIDTRANS_IS_PRODUCTION === 'true' || !process.env.MIDTRANS_SERVER_KEY) throw Error('Sandbox credentials required');
const dir=mkdtempSync(join(tmpdir(),'lup-real-delivery-'));
const evidence='docs/booking/phase-2/evidence'; mkdirSync(evidence,{recursive:true});
const pgBin=process.env.TICKETING_TEST_PG_BIN || '/usr/local/opt/postgresql@18/bin';
const pgPort=58000+Math.floor(Math.random()*2000), webPort=3700+Math.floor(Math.random()*100);
const database=`postgresql://${encodeURIComponent(userInfo().username)}@127.0.0.1:${pgPort}/ticketing_midtrans_e2e?schema=ticketing`;
const base=`http://127.0.0.1:${webPort}`;
const route=`/${randomBytes(24).toString('hex')}/api/ticketing/webhook`;
const tunnels=await (await fetch('http://127.0.0.1:4040/api/tunnels')).json();
const publicUrl=tunnels.tunnels.find(t=>t.config.addr==='http://127.0.0.1:3999')?.public_url;
if(!publicUrl?.startsWith('https://')) throw Error('Start HTTPS ngrok tunnel to 127.0.0.1:3999 first');
const callback=publicUrl+route;
const env={...process.env,NODE_ENV:'development',DATABASE_URL:database,POSTGRES_URL:database,DATABASE_URL_UNPOOLED:database,LUP_TEST_DIST_DIR:'.next-booking-tests',BOOKING_PUBLIC_URL:base,TICKETING_SALES_APPROVED:'true',TICKETING_SANDBOX_ENABLED:'true',TICKETING_SECRET:randomBytes(32).toString('hex'),TICKETING_TRUST_PROXY:'false',MIDTRANS_IS_PRODUCTION:'false',TICKETING_ISOLATED_SANDBOX_TEST:'true',TICKETING_SANDBOX_NOTIFICATION_URL:callback,GOOGLE_CLIENT_ID:'',GOOGLE_CLIENT_SECRET:'',RESEND_API_KEY:'',EMAIL_FROM:'',NEXT_PUBLIC_SHOW_COMING_SOON:'false'};
let started=false,server,db,browser,relay,activePage;
const results=[],callbacks=[]; let paidBody,forceFailure=true,replayPhase=false;
const record=(id,actual)=>{results.push({id,status:'PASS',actual});console.log(`PASS ${id}: ${actual}`);};
const run=(command,args)=>{const r=spawnSync(command,args,{env,encoding:'utf8'});if(r.status!==0)throw Error(`${command} failed: ${r.stderr || r.stdout}`);};
const pause=ms=>new Promise(r=>setTimeout(r,ms));
const gatewayHeaders={Authorization:`Basic ${Buffer.from(`${env.MIDTRANS_SERVER_KEY}:`).toString('base64')}`,Accept:'application/json'};
const gatewayStatus=async number=>{const r=await fetch(`https://api.sandbox.midtrans.com/v2/${number}/status`,{headers:gatewayHeaders,signal:AbortSignal.timeout(15000)});return r.json();};
try {
 run(join(pgBin,'initdb'),['-D',join(dir,'data'),'--auth=trust','--no-locale','--encoding=UTF8']);
 run(join(pgBin,'pg_ctl'),['-D',join(dir,'data'),'-l',join(dir,'postgres.log'),'-o',`-F -h 127.0.0.1 -p ${pgPort} -k ${dir}`,'-w','start']);started=true;
 run(join(pgBin,'createdb'),['-h','127.0.0.1','-p',String(pgPort),'-U',userInfo().username,'ticketing_midtrans_e2e']);
 run(process.execPath,['node_modules/prisma/build/index.js','migrate','deploy']);db=new PrismaClient({datasourceUrl:database});
 const product=await db.product.create({data:{name:'QA Sandbox Nyata — bukan tiket resmi',slug:'qa-real',description:'Fixture terisolasi untuk verifikasi Sandbox, bukan paket/harga resmi LUP.',type:'ADULT',price:10000}});
 const date=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Jakarta'}).format(new Date());
 const schedule=await db.schedule.create({data:{date:new Date(date),session:'23:59',capacity:8}});
 await db.productSchedule.create({data:{productId:product.id,scheduleId:schedule.id,price:10000}});
 const staffPassword=randomBytes(20).toString('hex');
 const admin=await db.user.create({data:{name:'Petugas QA terisolasi',email:'qa-admin@example.test',role:'ADMIN',passwordHash:await hashPassword(staffPassword)}});
 relay=createServer(async(req,res)=>{
  if(req.url!==route || req.method!=='POST'){res.writeHead(404).end();return;}
  try{
   const chunks=[];let length=0;for await(const c of req){length+=c.length;if(length>16384){res.writeHead(413).end();return;}chunks.push(c);}
   const raw=Buffer.concat(chunks),body=JSON.parse(raw.toString());
   if(!await db.order.findUnique({where:{orderNumber:body.order_id},select:{id:true}})){res.writeHead(404).end();return;}
   const entry={at:new Date().toISOString(),order:body.order_id,providerStatus:body.transaction_status,replay:replayPhase};
   if(body.transaction_status==='settlement' && forceFailure){forceFailure=false;entry.http=503;callbacks.push(entry);console.log('Observed real settlement notification; intentionally returning 503 once to test retry');res.writeHead(503).end('Retry requested by isolated QA');return;}
   const upstream=await fetch(`${base}/api/ticketing/webhook`,{method:'POST',headers:{host:'ticket.localhost','content-type':'application/json'},body:raw,signal:AbortSignal.timeout(30000)});
   entry.http=upstream.status;callbacks.push(entry);if(body.transaction_status==='settlement' && upstream.ok)paidBody=body;
   console.log(`Webhook observed: ${body.transaction_status}, HTTP ${upstream.status}, replay=${replayPhase}`);
   res.writeHead(upstream.status,{'Content-Type':'application/json'}).end(await upstream.text());
  }catch{res.writeHead(503).end('Temporary verification failure');}
 }); await new Promise(r=>relay.listen(3999,'127.0.0.1',r));
 const log=openSync(join(dir,'next.log'),'w');server=spawn(process.execPath,['node_modules/next/dist/bin/next','dev','--webpack','--hostname','127.0.0.1','--port',String(webPort)],{env,stdio:['ignore',log,log],detached:true});closeSync(log);
 for(let i=0;;i++){try{if((await fetch(`${base}/api/ticketing/catalog`,{signal:AbortSignal.timeout(10000)})).ok)break;}catch{}if(i>90)throw Error('Local application unavailable');await pause(1000);}
 browser=await chromium.launch({headless:true,channel:'chromium'});const context=await browser.newContext({viewport:{width:1280,height:1000}});const page=await context.newPage();activePage=page;page.setDefaultTimeout(60000);page.setDefaultNavigationTimeout(120000);
 const email=`qa-${randomBytes(6).toString('hex')}@example.test`,password=randomBytes(20).toString('hex');
 const registration=await context.request.post(`${base}/api/ticketing/auth/register`,{headers:{Origin:base},data:{name:'Pelanggan QA Sandbox',email,password,consent:true}});assert.equal(registration.status(),201);
 await page.goto(`${base}/pilih-tiket?kategori=kunjungan&produk=${product.id}`);await page.getByText('Memuat harga dan ketersediaan…',{exact:true}).waitFor({state:'hidden'});
 await page.getByLabel('Jumlah pengunjung').fill('2');await page.getByRole('button',{name:'Tambahkan ke keranjang'}).click();await page.goto(`${base}/checkout`);
 await page.getByLabel('Nomor WhatsApp').fill('081234567890');await page.getByRole('checkbox').check();
 const created=page.waitForResponse(r=>new URL(r.url()).pathname==='/api/ticketing/orders' && r.request().method()==='POST');
 await page.getByRole('button',{name:'Buat pesanan & lanjut pembayaran'}).click();const response=await created;assert.equal(response.status(),201);const order=await response.json();assert.ok(order.checkoutUrl);assert.equal(order.totalAmount,20000);
 record('REAL-CHECKOUT',`HTTP 201; ${order.orderNumber}; amount IDR 20000; 2 tickets pending`);
 await page.screenshot({path:`${evidence}/real-reservation-pending.png`,fullPage:true});
 await page.goto(order.checkoutUrl);await page.screenshot({path:`${evidence}/real-snap-start.png`,fullPage:true});
 writeFileSync(join(dir,'snap-before.txt'),await page.locator('body').innerText());
 let bni=page.getByText(/^BNI(?: Virtual Account)?$/i).first();
 if(!await bni.isVisible()){const bank=page.getByText(/Bank transfer|Transfer bank|Virtual account/i).first();if(await bank.isVisible())await bank.click();}
 await bni.click();
 const pay=page.getByRole('button',{name:/pay now|bayar sekarang|lihat nomor|see account|confirm/i}).first();if(await pay.isVisible())await pay.click();
 let state;for(let i=0;i<20;i++){state=await gatewayStatus(order.orderNumber);if(state.va_numbers?.length)break;await pause(1000);}
 if(!state.va_numbers?.length){writeFileSync(join(dir,'snap-after.txt'),await page.locator('body').innerText());throw Error('BNI virtual account not created; inspect private Snap diagnostics');}
 assert.equal(state.transaction_status,'pending');assert.equal(Number(state.gross_amount),20000);assert.equal(await db.ticket.count(),0);record('REAL-PENDING','Midtrans GET status pending; amount/order verified; zero tickets');
 await page.screenshot({path:`${evidence}/real-snap-pending.png`,fullPage:true});
 const simulator=await context.newPage();activePage=simulator;simulator.setDefaultTimeout(60000);await simulator.goto('https://simulator.sandbox.midtrans.com/bni/va/index');
 writeFileSync(join(dir,'simulator-before.txt'),await simulator.locator('body').innerText());
 await simulator.locator('input:not([type="hidden"]):not([type="submit"])').first().fill(state.va_numbers[0].va_number);
 for(let i=0;i<4;i++){
  const button=simulator.getByRole('button',{name:/inquire|pay|submit|confirm|bayar/i}).first();
  const inputSubmit=simulator.locator('input[type="submit"]').first();
  if(await button.isVisible())await button.click();else if(await inputSubmit.isVisible())await inputSubmit.click();else break;
  await simulator.waitForLoadState('domcontentloaded');await pause(1000);
  writeFileSync(join(dir,`simulator-step-${i}.txt`),await simulator.locator('body').innerText());
  if((await gatewayStatus(order.orderNumber)).transaction_status==='settlement')break;
 }
 await simulator.screenshot({path:`${evidence}/real-simulator-result.png`,fullPage:true});
 state=await gatewayStatus(order.orderNumber);assert.equal(state.transaction_status,'settlement');record('REAL-BANK-SETTLEMENT','Official BNI simulator completed; trusted Midtrans API reports settlement');
 // Observe DB only. Never refresh/reconcile status via browser while proving delivery.
 for(let i=0;i<90;i++){const current=await db.order.findUnique({where:{orderNumber:order.orderNumber}});if(current.status==='PAID' && paidBody)break;if(i===89)throw Error('No successful real HTTPS settlement notification observed within 180 seconds');await pause(2000);}
 const paid=await db.order.findUniqueOrThrow({where:{orderNumber:order.orderNumber},include:{tickets:true,payments:true}});assert.equal(paid.status,'PAID');assert.equal(paid.tickets.length,2);assert.equal(paid.payments[0].status,'SETTLED');
 assert.ok(callbacks.some(x=>x.providerStatus==='settlement' && x.http===503 && !x.replay));assert.ok(callbacks.some(x=>x.providerStatus==='settlement' && x.http===200 && !x.replay));
 record('REAL-HTTPS-RETRY','Real Midtrans settlement delivery failed intentionally once (503), then retried successfully (200); application verified signature and fetched real status');
 record('REAL-TICKETS','DB order PAID, payment SETTLED, exactly two unique tickets issued from real notification');
 replayPhase=true;const replays=await Promise.all(Array.from({length:3},()=>fetch(callback,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(paidBody)})));assert.ok(replays.every(r=>r.status===200));assert.equal(await db.ticket.count({where:{orderId:paid.id}}),2);assert.equal(await db.auditLog.count({where:{entityId:paid.id,action:'PAYMENT_SETTLED'}}),1);record('REAL-REPLAY','Three concurrent HTTPS replays of genuine signed notification: 200, still 2 tickets and 1 settlement event');
 const tampered=await fetch(callback,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...paidBody,signature_key:'0'.repeat(128)})});assert.equal(tampered.status,403);record('REAL-INVALID','Tampered signature rejected over HTTPS with 403');
 const pdf=await context.request.get(`${base}/api/ticketing/orders/${paid.orderNumber}/tickets`);assert.equal(pdf.status(),200);assert.equal((await pdf.body()).subarray(0,5).toString(),'%PDF-');writeFileSync(`${evidence}/real-paid-tickets.pdf`,await pdf.body());
 await page.goto(`${base}/account/bookings/${paid.orderNumber}`);await page.getByText('Pembayaran terkonfirmasi',{exact:true}).waitFor();await page.screenshot({path:`${evidence}/real-paid-booking.png`,fullPage:true});record('REAL-PDF','Authenticated owner downloaded PDF containing the two paid tickets');
 const staff=await browser.newContext();assert.equal((await staff.request.post(`${base}/api/staff/session`,{headers:{Origin:base},data:{email:admin.email,password:staffPassword}})).status(),200);
 const view=await staff.request.get(`${base}/api/staff/orders?q=${paid.orderNumber}`);assert.equal(view.status(),200);assert.equal((await view.json()).orders[0].status,'PAID');record('REAL-ADMIN','Authenticated admin sees real Sandbox order and payment record PAID');
 const code=`LUP1:${paid.tickets[0].code}:${paid.tickets[0].qrToken}`;
 const scans=await Promise.all(Array.from({length:3},()=>staff.request.post(`${base}/api/staff/check-in`,{headers:{Origin:base},data:{code}})));assert.deepEqual(scans.map(r=>r.status()).sort(),[200,409,409]);assert.equal(await db.checkIn.count(),1);record('REAL-CHECKIN','Real paid ticket: three concurrent QR payload scans produce 200/409/409 and one CheckIn; no physical camera claim');
 const invalid=await staff.request.post(`${base}/api/staff/check-in`,{headers:{Origin:base},data:{code:'LUT-'+'0'.repeat(24)}});assert.equal(invalid.status(),404);
 record('REAL-INVALID-TICKET','Unknown manual code rejected');
} catch(error){console.error('Real Sandbox test failed:',error.message);results.push({id:'RUN',status:'FAIL',actual:error.message});try{if(activePage){writeFileSync(join(dir,'failure-page.txt'),await activePage.locator('body').innerText());await activePage.screenshot({path:`${evidence}/real-failure.png`,fullPage:true});}}catch{}process.exitCode=1;}
finally{
 writeFileSync(`${evidence}/real-midtrans-delivery.json`,JSON.stringify({runAt:new Date().toISOString(),database:'Disposable local PostgreSQL only',gateway:'Real Midtrans Sandbox API and official bank simulator',webhook:'Actual Midtrans HTTPS delivery through webhook-only tunnel; no synthetic provider status',callbacks,results},null,2));
 await browser?.close();if(relay)await new Promise(r=>relay.close(r));await db?.$disconnect();if(server?.pid){try{process.kill(-server.pid,'SIGTERM');}catch{}}if(started)run(join(pgBin,'pg_ctl'),['-D',join(dir,'data'),'-m','fast','-w','stop']);console.log('Private logs:',dir);
}
