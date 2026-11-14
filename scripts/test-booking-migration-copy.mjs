// Populated synthetic legacy DB -> pg_dump/restore copy -> additive upgrade.
// No production/shared database URL is read or used.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, cpSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir, userInfo } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import assert from 'node:assert/strict';
const dir=mkdtempSync(join(tmpdir(),'lup-migration-copy-')), bin=process.env.TICKETING_TEST_PG_BIN || '/usr/local/opt/postgresql@18/bin';
const port=58000+Math.floor(Math.random()*2000), user=userInfo().username;
const source='ticketing_legacy_fixture',copy='ticketing_migration_copy';
const url=name=>`postgresql://${encodeURIComponent(user)}@127.0.0.1:${port}/${name}?schema=ticketing`;
const env=name=>({...process.env,DATABASE_URL:url(name),POSTGRES_URL:url(name),DATABASE_URL_UNPOOLED:url(name)});
function run(command,args,name=source){const result=spawnSync(command,args,{env:env(name),encoding:'utf8'});if(result.status!==0)throw Error(result.stderr||result.stdout);return result;}
let started=false,db;
const checks=[];
try{
 run(join(bin,'initdb'),['-D',join(dir,'data'),'--auth=trust','--no-locale','--encoding=UTF8']);
 run(join(bin,'pg_ctl'),['-D',join(dir,'data'),'-l',join(dir,'postgres.log'),'-o',`-F -h 127.0.0.1 -p ${port} -k ${dir}`,'-w','start']);started=true;
 for(const name of [source,copy])run(join(bin,'createdb'),['-h','127.0.0.1','-p',String(port),'-U',user,name]);
 const legacy=join(dir,'legacy','prisma');mkdirSync(join(legacy,'migrations'),{recursive:true});cpSync('prisma/schema.prisma',join(legacy,'schema.prisma'));
 for(const file of readdirSync('prisma/migrations'))if(file<'20261114050000_booking_email_outbox' || file==='migration_lock.toml')cpSync(join('prisma/migrations',file),join(legacy,'migrations',file),{recursive:true});
 run(process.execPath,['node_modules/prisma/build/index.js','migrate','deploy','--schema',join(legacy,'schema.prisma')]);
 db=new PrismaClient({datasourceUrl:url(source)});
 const statements=[
 `INSERT INTO ticketing."Product" (id,name,slug,type,price,active,"updatedAt") VALUES ('product-history','Fixture historis','fixture-history','ADULT',50000,false,NOW())`,
 `INSERT INTO ticketing."Schedule" (id,date,session,capacity,sold,"updatedAt") VALUES ('schedule-history',CURRENT_DATE+1,'13:00',5,2,NOW())`,
 `INSERT INTO ticketing."Customer" (id,name,email,"updatedAt") VALUES ('customer-history','Pelanggan Fixture','history@example.test',NOW())`,
 `INSERT INTO ticketing."VisitorAccount" (id,name,email,"passwordHash","updatedAt") VALUES ('visitor-history','Akun Fixture','account@example.test','fixture-never-used-for-login',NOW())`,
 `INSERT INTO ticketing."VisitorSession" (id,"tokenHash","visitorId","expiresAt") VALUES ('session-history','${'b'.repeat(64)}','visitor-history',NOW()+INTERVAL '1 day')`,
 `INSERT INTO ticketing."Order" (id,"orderNumber","customerId","visitorId",status,"totalAmount","expiresAt","paidAt","updatedAt") VALUES ('order-history','LU-${'1'.repeat(24)}','customer-history','visitor-history','PAID',100000,NOW()+INTERVAL '15 minutes',NOW(),NOW())`,
 `INSERT INTO ticketing."OrderItem" (id,"orderId","productId","scheduleId","productName","unitPrice",quantity,"lineTotal") VALUES ('item-history','order-history','product-history','schedule-history','Nama snapshot historis',50000,2,100000)`,
 `INSERT INTO ticketing."Payment" (id,"orderId",provider,"providerPaymentId",status,amount,"updatedAt") VALUES ('payment-history','order-history','midtrans-sandbox','fixture-transaction','SETTLED',100000,NOW())`,
 `INSERT INTO ticketing."Ticket" (id,"orderId",code,"qrToken",status) VALUES ('ticket-used','order-history','LUT-${'1'.repeat(24)}','${'a'.repeat(64)}','USED'),('ticket-issued','order-history','LUT-${'2'.repeat(24)}','${'c'.repeat(64)}','ISSUED')`,
 `INSERT INTO ticketing."CheckIn" (id,"ticketId",source) VALUES ('checkin-history','ticket-used','MANUAL_SANDBOX')`,
 ];
 for(const sql of statements)await db.$executeRawUnsafe(sql); // Constants only, disposable DB.
 async function snapshot(client){return client.$queryRawUnsafe(`SELECT o.id,o.status::text,o."totalAmount",o."visitorId",p.status::text AS payment_status,i."productName",i."unitPrice",s.sold,s.reserved,(SELECT count(*)::int FROM ticketing."Ticket") AS tickets,(SELECT count(*)::int FROM ticketing."CheckIn") AS checkins,(SELECT count(*)::int FROM ticketing."VisitorSession") AS sessions FROM ticketing."Order" o JOIN ticketing."Payment" p ON p."orderId"=o.id JOIN ticketing."OrderItem" i ON i."orderId"=o.id JOIN ticketing."Schedule" s ON s.id=i."scheduleId"`);}
 const before=await snapshot(db);await db.$disconnect();
 const backup=join(dir,'legacy-fixture.dump');
 run(join(bin,'pg_dump'),['-h','127.0.0.1','-p',String(port),'-U',user,'-Fc','--schema=ticketing','-f',backup,source]);
 run(join(bin,'pg_restore'),['--list',backup]);
 run(join(bin,'pg_restore'),['-h','127.0.0.1','-p',String(port),'-U',user,'--no-owner','-d',copy,backup],copy);
 checks.push({id:'DB-COPY-RESTORE',status:'PASS',actual:'Populated synthetic legacy schema dumped and actually restored into a separate local database'});
 run(process.execPath,['node_modules/prisma/build/index.js','migrate','deploy'],copy);
 db=new PrismaClient({datasourceUrl:url(copy)});assert.deepEqual(await snapshot(db),before);assert.equal(await db.emailDelivery.count(),0);
 checks.push({id:'DB-ADDITIVE-UPGRADE',status:'PASS',actual:'Pending additive email migration applied on restored copy; historical account/session/order/payment/items/tickets/check-in and quota unchanged'});
 await assert.rejects(db.$executeRawUnsafe(`UPDATE ticketing."Schedule" SET capacity=1 WHERE id='schedule-history'`));
 await assert.rejects(db.emailDelivery.create({data:{eventKey:'bad-fk',orderId:'missing',kind:'PAYMENT',recipient:'fixture@example.test',subject:'Fixture',text:'Fixture'}}));
 run(process.execPath,['node_modules/prisma/build/index.js','migrate','deploy'],copy);
 assert.deepEqual(await snapshot(db),before);
 checks.push({id:'DB-CONSTRAINTS-ROLLBACK',status:'PASS',actual:'Quota and FK constraints reject invalid writes; second migrate deploy is idempotent; old-field queries remain compatible for code rollback'});
 mkdirSync('docs/booking/phase-2/evidence',{recursive:true});
 writeFileSync('docs/booking/phase-2/evidence/migration-copy.json',JSON.stringify({runAt:new Date().toISOString(),scope:'Synthetic populated legacy COPY, NOT a production data clone',backupSha256:createHash('sha256').update(readFileSync(backup)).digest('hex'),snapshot:before,checks},null,2));
 console.log(checks);
}finally{await db?.$disconnect();if(started)run(join(bin,'pg_ctl'),['-D',join(dir,'data'),'-m','fast','-w','stop']);console.log('Private fixture backup/logs:',dir);}
