import x from"http";import l from"express";import p from"argon2";import{Pool as w}from"pg";import h from"dotenv";h.config();var R=new w({connectionString:process.env.POSTGRES_URL,ssl:{rejectUnauthorized:!1}}),i=R;import d from"jsonwebtoken";import{rateLimit as y}from"express-rate-limit";function u(s){return`
        <!doctype html>
        <html>
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />

                <meta property="og:type" content="website" />
                <meta property="og:title" content="User Manager" />
                <meta
                    property="og:description"
                    content="Managing user login/signup, testing backend."
                />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="User Manager" />
                <meta
                    name="twitter:description"
                    content="Managing user login/signup, testing backend."
                />

                <title>User Manager</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href='https://fonts.googleapis.com/css?family=Geist' rel='stylesheet'>
                <link rel="stylesheet" href="/style.css" />
            </head>
            <body>
                <div id="root"></div>
                <script src=${s} type="module"></script>
            </body>
        </html>
    `}function m(s){return d.sign(s,process.env.PRIVATE_KEY,{algorithm:"HS256"})}function E(s){return d.verify(s,process.env.PRIVATE_KEY,{algorithms:["HS256"]})}var o=l();o.use(l.static(process.cwd()));o.use(l.urlencoded({extended:!0}));o.use(l.json());o.get("/",(s,e)=>{e.status(200).send(u("/js-pages/main-page.js"))});o.get("/signup",(s,e)=>{e.status(200).send(u("/js-pages/signup-page.js"))});o.get("/login",(s,e)=>{e.status(200).send(u("/js-pages/login-page.js"))});o.get("/settings",(s,e)=>{e.status(200).send(u("/js-pages/settings-page.js"))});o.get("/*path",(s,e)=>{e.status(200).send(u("/js-pages/main-page.js"))});o.use((s,e,n)=>{let r=s.headers.authorization;if(!r||r.split(" ").length<=1){n();return}try{e.locals.token=r.split(" ")[1],e.locals.user=E(e.locals.token)}catch{e.sendStatus(401);return}n()});o.delete("/delete-account",(s,e)=>{console.log(`Deleting user ${e.locals.user.name}`),i.query(`
        DELETE FROM users
        WHERE id = $1;
    `,[e.locals.user.id]),e.sendStatus(204)});o.post("/signup",async(s,e)=>{let{name:n,password:r}=s.body;if(console.log(`Signing up as ${n}`),!n){e.status(403).json({error:"Invalid username!"});return}if(!r){e.status(403).json({error:"Invalid password!"});return}if(n.length>255){e.status(403).json({error:"Username too long!"});return}if(r.length>255){e.status(403).json({error:"Password too long!"});return}if((await i.query(`
        SELECT name
        FROM users
        WHERE name = $1;
    `,[n])).rowCount>0){e.status(403).json({error:"Username already exists!"});return}let a=await p.hash(r);if(!a){e.status(403).json({error:"Invalid password!"});return}await i.query(`
        INSERT INTO users (name, hash_password)
        VALUES ($1, $2);
    `,[n,a]),e.status(201).json({error:null})});o.post("/login",async(s,e)=>{let{name:n,password:r}=s.body;if(console.log(`Logging in as ${n}`),n===""){e.status(403).json({error:"Empty username!",token:null,user:null});return}if(r===""){e.status(403).json({error:"Empty password!",token:null,user:null});return}if(n.length>255){e.status(403).json({error:"Username too long!",token:null,user:null});return}if(r.length>255){e.status(403).json({error:"Password too long!",token:null,user:null});return}let t=await i.query(`
        SELECT *
        FROM users
        WHERE name = $1;
    `,[n]);if(t.rowCount===0){e.status(403).json({error:"Wrong username or password!",token:null,user:null});return}let a=t.rows[0];if(!await p.verify(a.hash_password,r)){e.status(403).json({error:"Wrong username or password!",token:null,user:null});return}let g={id:a.id,name:a.name,click_count:a.click_count};e.status(200).json({error:null,token:m(g),user:g})});o.put("/update-user",y({windowMs:1e3,limit:50}),async(s,e)=>{let r=e.locals.user,t=s.body;if(console.log(`Updating user ${t.name}`),Math.abs(t.click_count-r.click_count)>10||t.id!=r.id){e.status(403).json({error:"Illegal user modification!",token:null});return}let a=await i.query(`
        SELECT *
        FROM users
        WHERE name = $1;
    `,[t.name]);if(t.name===""){e.status(403).json({error:"Empty username!",token:null});return}if(t.name!=r.name&&a.rowCount>0){e.status(403).json({error:"Name already in use!",token:null});return}if(await i.query(`
        UPDATE users
        SET name = $1, click_count = $2
        WHERE id = $3;
    `,[t.name,t.click_count,t.id]),t.password){let c=await p.hash(t.password);await i.query(`
            UPDATE users
            SET hash_password = $1
            WHERE id = $2;
        `,[c,t.id]),delete t.password}e.status(200).json({error:null,token:m(t)})});var f=o;var j=x.createServer(f);j.listen(3e3,()=>{console.log("Running app on localhost:3000")});
//# sourceMappingURL=hoster.js.map
