!function(){function t(n,e){function o(t){return t.split("/").slice(-1).toString().replace(".js","")}return e?require(n):n.slice?t[o(n)]:function(e,i){n(e={exports:{}}),t[o(i)]=e.exports}}if("undefined"!=typeof module)var n=module;t((function(t){var n={fn:{is:function(t){return!!t&&"function"==typeof t}}};n.bi={is:function(t){return t instanceof Boolean||"boolean"==typeof t}},n.num={is:function(t){return!e(t)&&(t-parseFloat(t)+1>=0||1/0===t||-1/0===t)}},n.text={is:function(t){return"string"==typeof t}},n.text.ify=function(t){return n.text.is(t)?t:"undefined"!=typeof JSON?JSON.stringify(t):t&&t.toString?t.toString():t},n.text.random=function(t,n){var e="";for(t=t||24,n=n||"0123456789ABCDEFGHIJKLMNOPQRSTUVWXZabcdefghijklmnopqrstuvwxyz";t>0;)e+=n.charAt(Math.floor(Math.random()*n.length)),t--;return e},n.text.match=function(t,n){var e,o;return"string"==typeof t&&("string"==typeof n&&(n={"=":n}),t===(e=(n=n||{})["="]||n["*"]||n[">"]||n["<"])||o===n["="]&&(t.slice(0,((e=n["*"]||n[">"]||n["<"])||"").length)===e||o===n["*"]&&(o!==n[">"]&&o!==n["<"]?t>=n[">"]&&t<=n["<"]:o!==n[">"]&&t>=n[">"]||o!==n["<"]&&t<=n["<"])))},n.text.hash=function(t,n){if("string"==typeof t){if(n=n||0,!t.length)return n;for(var e=0,o=t.length;e<o;++e)n=(n<<5)-n+t.charCodeAt(e),n|=0;return n}},n.list={is:function(t){return t instanceof Array}},n.list.slit=Array.prototype.slice,n.list.sort=function(t){return function(n,e){return n&&e?(n=n[t])<(e=e[t])?-1:n>e?1:0:0}},n.list.map=function(t,n,e){return a(t,n,e)},n.list.index=1,n.obj={is:function(t){return!!t&&(t instanceof Object&&t.constructor===Object||"Object"===Object.prototype.toString.call(t).match(/^\[object (\w+)\]$/)[1])}},n.obj.put=function(t,n,e){return(t||{})[n]=e,t},n.obj.has=function(t,n){return t&&Object.prototype.hasOwnProperty.call(t,n)},n.obj.del=function(t,n){if(t)return t[n]=null,delete t[n],t},n.obj.as=function(t,n,e,o){return t[n]=t[n]||(o===e?{}:e)},n.obj.ify=function(t){if(i(t))return t;try{t=JSON.parse(t)}catch(n){t={}}return t},function(){function t(t,n){r(this,n)&&undefined!==this[n]||(this[n]=t)}n.obj.to=function(n,e){return a(n,t,e=e||{}),e}}(),n.obj.copy=function(t){return t?JSON.parse(JSON.stringify(t)):t},function(){function t(t,n){var e=this.n;if(!e||!(n===e||i(e)&&r(e,n)))return undefined!==n||void 0}n.obj.empty=function(n,e){return!n||!a(n,t,{n:e})}}(),function(){function t(n,e){2!==arguments.length?(t.r=t.r||[]).push(n):(t.r=t.r||{})[n]=e}var o,a=Object.keys;Object.keys=Object.keys||function(t){return o(t,(function(t,n,e){e(n)}))},n.obj.map=o=function(o,u,s){var f,c,l,p,h,d=0,g="function"==typeof u;if(t.r=f,a&&i(o)&&(p=a(o),h=!0),s=s||{},e(o)||p)for(c=(p||o).length;d<c;d++){var v=d+n.list.index;if(g){if((l=h?u.call(s,o[p[d]],p[d],t):u.call(s,o[d],v,t))!==f)return l}else if(u===o[h?p[d]:d])return p?p[d]:v}else for(d in o)if(g){if(r(o,d)&&(l=s?u.call(s,o[d],d,t):u(o[d],d,t))!==f)return l}else if(u===o[d])return d;return g?t.r:n.list.index?0:-1}}(),n.time={},n.time.is=function(t){return t?t instanceof Date:+(new Date).getTime()};var e=n.list.is,o=n.obj,i=o.is,r=o.has,a=o.map;t.exports=n}))(t,"./type"),t((function(t){t.exports=function t(n,e,o){if(!n)return{to:t};n=(this.tag||(this.tag={}))[n]||(this.tag[n]={tag:n,to:t._={next:function(t){var n;(n=this.to)&&n.next(t)}}});if("function"==typeof e){var i={off:t.off||(t.off=function(){if(this.next===t._.next)return!0;this===this.the.last&&(this.the.last=this.back),this.to.back=this.back,this.next=t._.next,this.back.to=this.to,this.the.last===this.the&&delete this.on.tag[this.the.tag]}),to:t._,next:e,the:n,on:this,as:o};return(i.back=n.last||n).to=i,n.last=i}return(n=n.to)&&undefined!==e&&n.next(e),n}}))(t,"./onto"),t((function(t){var n="undefined"!=typeof setImmediate?setImmediate:setTimeout,e=[];t.exports=setTimeout.puff=function(t){e.length?e.push(t):(e=[t],n((function t(o){o=o||+new Date;for(var i,r=0;r<9&&(i=e[r++]);)i();if(console.STAT&&console.STAT(o,+new Date-o,"puff"),i&&!(+new Date-o))return t(o);(e=e.slice(r)).length&&n(t,0)}),0))}}))(t,"./puff"),t((function(t){if("undefined"==typeof JSON)throw new Error("JSON is not included in this browser. Please load it first: ajax.cdnjs.com/ajax/libs/json2/20110223/json2.js");var n=JSON.stringify;t.exports=function(t,e,o,i,r){if(t<e)return{defer:!0};if(e<o)return{historical:!0};if(o<e)return{converge:!0,incoming:!0};if(e===o){if((i=n(i)||"")===(r=n(r)||""))return{state:!0};if(i<r)return{converge:!0,current:!0};if(r<i)return{converge:!0,incoming:!0}}return{err:"Invalid CRDT Data: "+i+" to "+r+" at "+e+" to "+o+"!"}}}))(t,"./HAM"),t((function(n){var e=t("./type"),o={is:function(t){return undefined!==t&&(null===t||t!==1/0&&(!!(u(t)||r(t)||a(t))||(o.link.is(t)||!1)))}};o.link=o.rel={_:"#"},function(){function t(t,n){var e=this;return e.id?e.id=!1:n==i&&u(t)?void(e.id=t):e.id=!1}o.link.is=function(n){if(n&&n[i]&&!n._&&f(n)){var e={};if(l(n,t,e),e.id)return e.id}return!1}}(),o.link.ify=function(t){return c({},i,t)},e.obj.has._=".";var i=o.link._,r=e.bi.is,a=e.num.is,u=e.text.is,s=e.obj,f=s.is,c=s.put,l=s.map;n.exports=o}))(t,"./val"),t((function(n){var e=t("./type"),o=t("./val"),i={_:"_",soul:function(t,n){return t&&t._&&t._[n||c]}};i.soul.ify=function(t,n){return n="string"==typeof n?{soul:n}:n||{},(t=t||{})._=t._||{},t._[c]=n.soul||t._[c]||f(),t},i.soul._=o.link._,function(){function t(t,n){if(n!==i._)return!o.is(t)||void(this.cb&&this.cb.call(this.as,t,n,this.n,this.s))}i.is=function(n,e,o){var r;return!!a(n)&&(!!(r=i.soul(n))&&!s(n,t,{as:o,cb:e,s:r,n:n}))}}(),function(){function t(t,n){var e,i=this.o;i.map?undefined===(e=i.map.call(this.as,t,""+n,i.node))?u(i.node,n):i.node&&(i.node[n]=e):o.is(t)&&(i.node[n]=t)}i.ify=function(n,e,o){return e?"string"==typeof e?e={soul:e}:"function"==typeof e&&(e={map:e}):e={},e.map&&(e.node=e.map.call(o,n,undefined,e.node||{})),(e.node=i.soul.ify(e.node||{},e))&&s(n,t,{o:e,as:o}),e.node}}();var r=e.obj,a=r.is,u=r.del,s=r.map,f=e.text.random,c=i.soul._;n.exports=i}))(t,"./node"),t((function(n){function e(){var t;return t=+new Date,r<t?(a=0,r=t+e.drift):r=t+(a+=1)/u+e.drift}var o=t("./type"),i=t("./node"),r=-1/0,a=0,u=1e3,s="undefined"!=typeof performance&&(performance.timing&&performance),f=(s&&s.timing&&s.timing.navigationStart||(s=!1),e._=">");e.drift=0,e.is=function(t,n,e){var o=n&&t&&t[b]&&t[b][f]||e;if(o)return m(o=o[n])?o:-1/0},e.lex=function(){return e().toString(36).replace(".","")},e.ify=function(t,n,e,o,r){if(!t||!t[b]){if(!r)return;t=i.soul.ify(t,r)}var a=p(t[b],f);return c!==n&&n!==b&&(m(e)&&(a[n]=e),c!==o&&(t[n]=o)),t},e.to=function(t,n,o){var r=(t||{})[n];return d(r)&&(r=v(r)),e.ify(o,n,e.is(t,n),r,i.soul(t))},function(){function t(t,n){b!==n&&e.ify(this.o,n,this.s)}e.map=function(n,o,i){var r,a=d(a=n||o)?a:null;return n=k(n=n||o)?n:null,a&&!n?(o=m(o)?o:e(),a[b]=a[b]||{},g(a,t,{o:a,s:o}),a):(i=i||d(o)?o:r,o=m(o)?o:e(),function(e,a,u,s){if(!n)return t.call({o:u,s:o},e,a),e;n.call(i||this||{},e,a,u,s),h(u,a)&&r===u[a]||t.call({o:u,s:o},e,a)})}}();var c,l=o.obj,p=l.as,h=l.has,d=l.is,g=l.map,v=l.copy,m=o.num.is,k=o.fn.is,b=i._;n.exports=e}))(t,"./state"),t((function(n){var e=t("./type"),o=t("./val"),i=t("./node"),r={};!function(){function t(t,e){if(!t||e!==i.soul(t)||!i.is(t,this.fn,this.as))return!0;this.cb&&(n.n=t,this.cb.call(n.as=this.as,t,e,n))}function n(t){t&&i.is(n.n,t,n.as)}r.is=function(n,e,o,i){return!(!n||!s(n)||l(n))&&!h(n,t,{cb:e,fn:o,as:i})}}(),function(){function t(t,e){var r;return(r=function(t,n){var e,o=t.seen,i=o.length;for(;i--;)if(n.obj===(e=o[i]).obj)return e;o.push(n)}(t,e))?r:(e.env=t,e.soul=u,i.ify(e.obj,n,e)&&(e.link=e.link||o.link.ify(i.soul(e.node)),e.obj!==t.shell&&(t.graph[o.link.is(e.link)]=e.node)),e)}function n(n,e,r){var u,s,p=this,h=p.env;if(i._===e&&c(n,o.link._))return r._;if(u=l(n,e,r,p,h)){if(e||(p.node=p.node||r||{},c(n,i._)&&i.soul(n)&&(p.node._=d(n._)),p.node=i.soul.ify(p.node,o.link.is(p.link)),p.link=p.link||o.link.ify(i.soul(p.node))),(s=h.map)&&(s.call(h.as||{},n,e,r,p),c(r,e))){if(a===(n=r[e]))return void f(r,e);if(!(u=l(n,e,r,p,h)))return}if(!e)return p.node;if(!0===u)return n;if((s=t(h,{obj:n,path:p.path.concat(e)})).node)return s.link}}function u(t){var n=this,e=o.link.is(n.link),r=n.env.graph;n.link=n.link||o.link.ify(t),n.link[o.link._]=t,n.node&&n.node[i._]&&(n.node[i._][o.link._]=t),c(r,e)&&(r[t]=r[e],f(r,e))}function l(t,n,i,r,a){var u;return!!o.is(t)||(s(t)?1:(u=a.invalid)?l(t=u.call(a.as||{},t,n,i),n,i,r,a):(a.err="Invalid value at '"+r.path.concat(n).join(".")+"'!",void(e.list.is(t)&&(a.err+=" Use `.set(item)` instead of an Array."))))}r.ify=function(n,e,i){var r={path:[],obj:n};return e?"string"==typeof e?e={soul:e}:"function"==typeof e&&(e.map=e):e={},"string"==typeof i&&(e.soul=e.soul||i,i=a),e.soul&&(r.link=o.link.ify(e.soul)),e.shell=(i||{}).shell,e.graph=e.graph||{},e.seen=e.seen||[],e.as=e.as||i,t(e,r),e.root=r.node,e.graph}}(),r.node=function(t){var n=i.soul(t);if(n)return p({},n,t)},function(){function t(t,n){var e,a;if(i._!==n)this.obj[n]=(e=o.link.is(t))?(a=this.opt.seen[e])?a:this.opt.seen[e]=r.to(this.graph,e,this.opt):t;else{if(l(t,o.link._))return;this.obj[n]=d(t)}}r.to=function(n,e,o){if(n){var i={};return h(n[e],t,{obj:i,graph:n,opt:o=o||{seen:{}}}),i}}}();var a,u=e.obj,s=u.is,f=u.del,c=u.has,l=u.empty,p=u.put,h=u.map,d=u.copy;n.exports=r}))(t,"./graph"),t((function(n){t("./onto"),n.exports=function(t,n){if(this.on){if("function"!=typeof t){if(!t||!n)return;var e=(this.tag||"")[o=t["#"]||t];if(!e)return;return e=this.on(o,n),clearTimeout(e.err),!0}var o=n&&n["#"]||Math.random().toString(36).slice(2);if(!t)return o;var i=this.on(o,t,n);return i.err=i.err||setTimeout((function(){i.next({err:"Error: No ACK yet.",lack:!0}),i.off()}),(this.opt||{}).lack||9e3),o}}}))(t,"./ask"),t((function(n){var e=t("./type");n.exports=function(t){var n={s:{}},o=n.s;t=t||{max:1e3,age:27e3},n.check=function(t){return!!o[t]&&i(t)};var i=n.track=function(e){var i=o[e]||(o[e]={});return i.was=+new Date,n.to||(n.to=setTimeout(n.drop,t.age+9)),i};return n.drop=function(i){var r=+new Date;e.obj.map(o,(function(n,e){n&&(i||t.age)>r-n.was||delete o[e]})),n.to=null,console.STAT&&(i=+new Date-r)>9&&console.STAT(r,i,"dup drop")},n}}))(t,"./dup"),t((function(e){function o(t){return t instanceof o?(this._={$:this}).$:this instanceof o?o.create(this._={$:this,opt:t}):new o(t)}o.is=function(t){return t instanceof o||t&&t._&&t===t._.$||!1},o.version=.202,(o.chain=o.prototype).toJSON=function(){};var i=t("./type");i.obj.to(i,o),o.HAM=t("./HAM"),o.val=t("./val"),o.node=t("./node"),o.state=t("./state"),o.graph=t("./graph"),o.on=t("./onto"),o.ask=t("./ask"),o.dup=t("./dup"),o.puff=t("./puff"),function(){function t(e){if(e)if(e.out!==t){var i,r=this.as,a=r.at||r,u=a.$,s=a.dup,f=e.DBG;(i=e["#"])||(i=e["#"]=c(9)),s.check(i)||(s.track(i),e._="function"==typeof(i=e._)?i:function(){},e.$&&e.$===(e.$._||"").$||(e.$=u),a.ask(e["@"],e)||(f&&(f.u=+new Date),e.get&&o.on._get(e,u),!e.put)?(f&&(f.uc=+new Date),this.to.next(e),f&&(f.ua=+new Date),e.out=t,a.on("out",e),f&&(f.ue=+new Date)):n(e))}else this.to.next(e)}function n(t){if(t){var n,i,f=t._||"",c=f.root=((f.$=t.$||"")._||"").root,l=t.put,p=t["#"],h=f.DBG=t.DBG;if(l["#"]&&l["."])c.on("put",t);else{f.out=t,f.lot={s:0,more:1};var d=+new Date;for(var g in h&&(h.p=d),l){var v,m=l[g];if(!m){n=u+s(g)+"no node.";break}if(!(i=m._)){n=u+s(g)+"no meta.";break}if(g!==i[k]){n=u+s(g)+"soul not same.";break}if(!(v=i[x])){n=u+s(g)+"no state.";break}for(var b in m)if(y!==b){var w=m[b],$=v[b];if(r===$){n=u+s(b)+"on"+s(g)+"no state.";break}if(!_(w)){n=u+s(b)+"on"+s(g)+"bad "+typeof w+s(w);break}e(w,b,g,$,t)}if(n)break}h&&(h.pe=+new Date),console.STAT&&(console.STAT(d,+new Date-d,"mix"),console.STAT(d,f.lot.s,"mix #")),(f.err=n)?c.on("in",{"@":p,err:o.log(n)}):(--f.lot.more||a(f),f.stun||t["@"]||c.on("in",{"@":p,ok:-1}))}}}function e(t,n,o,i,r){var a,u=r._||"",s=u.root,c=s.graph[o]||w,h=m(c,n,1),d=c[n],g=p(),v=f(g,i,h,t,d);if(!v.incoming){if(v.defer){var k=i-g;return setTimeout((function(){e(t,n,o,i,r)}),k>l?l:k),u.to||s.on("in",{"@":r["#"],err:k}),u.to=1,k}if(!u.miss)return}(a=u.lot||"").s++,a.more++,(u.stun||(u.stun={}))[o+n]=1;var b=u.DBG;b&&(b.ph=b.ph||+new Date),s.on("put",{"#":r["#"],"@":r["@"],put:{"#":o,".":n,":":t,">":i},_:u})}function i(t){var n;(n=(t._||"").DBG)&&(n.pa=+new Date,n.pm=n.pm||+new Date);var e,o=this.as.graph,i=t._,u=t.put,s=u["#"],f=u["."],c=u[":"],l=u[">"];o[s]=v(o[s],f,l,c,s),function(t,n,e,o,i){var r,a,u=t.root;if((u.opt||"").super&&u.$.get(n),!(u&&(a=u.next)&&(a=a[n])&&a.$))return;(r=t.put||(t.put={}))[n]=v(r[n],e,i,o,n),a.put=v(a.put,e,i,o,n)}(i,s,f,r!==(e=u["="])?e:c,l),(e=i.out)&&(e=e.put)&&(e[s]=v(e[s],f,l,c,s)),--i.lot.more||a(i),this.to.next(t)}function a(n){if(!n.err){var e,o={},i=((n.$||"")._||"").root,r=(i||"").next||"",a=n.put,u=+new Date;for(var s in a){var f=a[s];(e=r[s])&&e.$&&(i.stop=o,e.on("in",{$:e.$,get:s,put:f}),i.stop=null)}console.STAT&&console.STAT(u,+new Date-u,"fire"),n.DBG&&(n.DBG.f=+new Date),(e=n.out)&&(e.out=t,i.on("out",e))}}o.create=function(n){n.root=n.root||n,n.graph=n.graph||{},n.on=n.on||o.on,n.ask=n.ask||o.ask,n.dup=n.dup||o.dup();var e=n.$.opt(n.opt);return n.once||(n.on("in",t,n),n.on("out",t,n),n.on("put",i,n),o.on("create",n),n.on("create",n)),n.once=1,e},o.on.put=n;var u="Error: Invalid graph!",s=function(t){return" '"+(""+t).slice(0,9)+"...' "},f=o.HAM,l=2147483647,p=o.state}(),function(){function t(t,n,e,i){var r=this,a=o.state.is(e,n);if(!a)return r.err="Error: No state on '"+n+"' in node '"+i+"'!";var u=r.graph[i]||w,s=o.state.is(u,n,!0),f=o.HAM(r.machine,a,s,t,u[n]);f.incoming?(r.put[i]=o.state.to(e,n,r.put[i]),(r.diff||(r.diff={}))[i]=o.state.to(e,n,r.diff[i]),r.souls[i]=!0):f.defer&&(r.defer=a<(r.defer||1/0)?a:r.defer)}function n(t,n){var o=this,r=o.$._,u=(r.next||w)[n];if(!u){if(!(r.opt||w).super)return void(o.souls[n]=!1);u=o.$.get(n)._}var s=o.map[n]={put:t,get:n,$:u.$},f={ctx:o,msg:s};o.async=!!r.tag.node,o.ack&&(s["@"]=o.ack),g(t,e,f),o.async&&(o.and||r.on("node",(function(t){this.to.next(t),t===o.map[t.get]&&(o.souls[t.get]=!1,g(t.put,i,t),g(o.souls,(function(t){if(t)return t}))||o.c||(o.c=1,this.off(),g(o.map,a,o)))})),o.and=!0,r.on("node",s))}function e(t,n){var e=this.ctx,i=e.graph,r=this.msg,a=r.get,u=r.put,s=r.$._;i[a]=o.state.to(u,n,i[a]),e.async||(s.put=o.state.to(u,n,s.put))}function i(t,n){var e=this.$._;e.put=o.state.to(this.put,n,e.put)}function a(t){t.$&&(this.cat.stop=this.stop,t.$._.on("in",t),this.cat.stop=null)}function u(t,n){if(t!==this.graph[n])return!0}o.on._put=function(e,i){var s=i._,f={$:i,graph:s.graph,put:{},map:{},souls:{},machine:o.state(),ack:e["@"],cat:s,stop:{}};if(o.obj.map(e.put,u,f)){if(o.graph.is(e.put,null,t,f)||(f.err="Error: Invalid graph!"),f.err)return s.on("in",{"@":e["#"],err:o.log(f.err)});if(g(f.put,n,f),f.async||g(f.map,a,f),r!==f.defer){var c=f.defer-f.machine;setTimeout((function(){o.on._put(e,i)}),c>MD?MD:c)}f.diff&&s.on("put",d(e,{put:f.diff}))}},o.on._get=function(t,n){var e=n._,i=t.get,r=i[k],a=e.graph[r],u=i[b],s=(e.next||(e.next={}))[r],f=(t._||"").DBG=t.DBG;if(f&&(f.g=+new Date),!a)return e.on("get",t);if(u){if("string"!=typeof u||!h(a,u))return e.on("get",t);a=o.state.to(a,u)}else a=o.window?o.obj.copy(a):a;a=o.graph.node(a);var c=function(){};c.ram=c.faith=!0,c.$=t.$,f&&(f.ga=+new Date),e.on("in",{"@":t["#"],put:a,ram:1,$:n,_:c}),f&&(f.gm=+new Date),e.on("get",t),f&&(f.gd=+new Date)}}(),o.chain.opt=function(t){var n=this._,e=(t=t||{}).peers||t;return p(t)||(t={}),p(n.opt)||(n.opt=t),f(e)&&(e=[e]),u(e)&&(e=g(e,(function(t,n,e){(n={}).id=n.url=t,e(t,n)})),p(n.opt.peers)||(n.opt.peers={}),n.opt.peers=d(e,n.opt.peers)),n.opt.peers=n.opt.peers||{},g(t,(function t(n,e){!h(this,e)||s.is(n)||l.empty(n)?this[e]=n:n&&n.constructor!==Object&&!u(n)||g(n,t,this[e])}),n.opt),o.on("opt",n),o.obj.native(),this},o.obj.native=function(){var t=Object.prototype;for(var n in t)console.log("Native Object.prototype polluted, reverting",n),delete t[n]};var r,a,u=o.list.is,s=o.text,f=s.is,c=s.random,l=o.obj,p=l.is,h=l.has,d=l.to,g=l.map,v=o.state.ify,m=o.state.is,k=o.val.link._,b=".",y=o.node._,_=o.val.is,x=o.state._,w={};(o.log=function(){return!o.log.off&&a.log.apply(a,arguments),[].slice.call(arguments).join(" ")}).once=function(t,n,e){return(e=o.log.once)[t]=e[t]||0,e[t]++||o.log(n)},"undefined"!=typeof window&&((window.GUN=window.Gun=o).window=window);try{void 0!==n&&(n.exports=o)}catch(t){}e.exports=o,(o.window||"").console=(o.window||"").console||{log:function(){}},(a=console).only=function(t,n){return a.only.i&&t===a.only.i&&a.only.i++&&(a.log.apply(a,arguments)||n)},o.log.once("welcome","Hello wonderful person! :) Thanks for using GUN, please ask for help on http://chat.gun.eco if anything takes you longer than 5min to figure out!")}))(t,"./root"),t((function(){var n=t("./root");n.chain.back=function(t,i){if(-1===(t=t||1)||1/0===t)return this._.root.$;if(1===t)return(this._.back||this._).$;var r=this._;if("string"==typeof t&&(t=t.split(".")),t instanceof Array){for(var a=0,u=t.length,s=r;a<u;a++)s=(s||o)[t[a]];return e!==s?i?this:s:(s=r.back)?s.$.back(t,i):void 0}if("function"==typeof t){var f;for(s={back:r};(s=s.back)&&e===(f=t(s,i)););return f}return n.num.is(t)?(r.back||r).$.back(t-1):this};var e,o={}}))(t,"./back"),t((function(){function n(t){var n,e,o=this.as,i=o.back,r=o.root;if(t.$||(t.$=o.$),this.to.next(t),n=t.get){if(o.lex&&(t.get=g(o.lex,t.get)),n["#"]||o.soul){if(n["#"]=n["#"]||o.soul,t["#"]||(t["#"]=m(9)),i=r.$.get(n["#"])._,n=n["."]){if(h(i.put,n)){if((e=(a=i.$.get(n)._).ack)||(a.ack=-1),i.on("in",{$:i.$,put:f.state.to(i.put,n),get:i.get}),e)return}else if("string"!=typeof n){var a={},u=(i.put||{})._;if(f.obj.map(i.put,(function(t,e){f.text.match(e,n)&&(a[e]=t)})),f.obj.empty(a)||(a._=u,i.on("in",{$:i.$,put:a,get:i.get})),e=o.lex){if(e=e._||(e._=function(){}),i.ack<e.ask&&(e.ask=i.ack),e.ask)return;e.ask=1}}}else{if((e=i.ack)||(i.ack=-1),h(i,"put")&&i.on("in",i),e&&c!==i.put)return;t.$=i.$}return r.ask(s,t),r.on("in",t)}if(r.now&&(r.now[o.id]=r.now[o.id]||!0,o.pass={}),n["."])return o.get?(t={get:{".":o.get},$:o.$},i.ask||(i.ask={}),i.ask[o.get]=t.$._,i.on("out",t)):i.on("out",t={get:{},$:o.$});if(o.ack=o.ack||-1,o.get)return t.$=o.$,n["."]=o.get,(i.ask||(i.ask={}))[o.get]=t.$._,i.on("out",t)}return i.on("out",t)}function e(t){var n,e,r=this,s=r.as,p=s.root,m=(t.$||l)._||l,k=t.put;if(s.get&&t.get!==s.get&&(t=g(t,{get:s.get})),s.has&&m!==s&&(t=g(t,{$:s.$}),m.ack&&(s.ack=m.ack)),c===k){if(e=m.put,r.to.next(t),s.soul)return;if(c===e&&c!==m.put)return;return i(s,t,r),s.has&&u(s,t),d(m.echo,s.id),void d(s.map,m.id)}if(s.soul)return r.to.next(t),i(s,t,r),void(s.next&&v(k,a,{msg:t,cat:s}));if(!(n=f.val.link.is(k)))return f.val.is(k)?(s.has||s.soul?u(s,t):(m.has||m.soul)&&((m.echo||(m.echo={}))[s.id]=m.echo[m.id]||s,(s.map||(s.map={}))[m.id]=s.map[m.id]||{at:m}),r.to.next(t),void i(s,t,r)):(s.has&&m!==s&&h(m,"put")&&(s.put=m.put),(n=f.node.soul(k))&&m.has&&(m.put=s.root.$.get(n)._.put),e=(p.stop||{})[m.id],r.to.next(t),o(s,t,m,n),i(s,t,r),void(s.next&&v(k,a,{msg:t,cat:s})));(e=(e=p.stop||{})[m.id]||(e[m.id]={})).is=e.is||m.put,e[s.id]=m.put||!0,r.to.next(t),o(s,t,m,n),i(s,t,r)}function o(t,n,e,i){if(i&&k!==t.get){var r=t.root.$.get(i)._;t.has?e=r:e.has&&o(e,n,e,i),e!==t&&(e.$||(e={}),(e.echo||(e.echo={}))[t.id]=e.echo[t.id]||t,t.has&&!(t.map||l)[e.id]&&u(t,n),(i!==(r=e.id?(t.map||(t.map={}))[e.id]=t.map[e.id]||{at:e}:{}).link||r.pass||t.pass)&&(t.pass&&(f.obj.map(t.map,(function(t){t.pass=!0})),d(t,"pass")),r.pass&&d(r,"pass"),t.has&&(t.link=i),function(t,n){var e=t.root.$.get(n)._,o=t.lex;if((t.ack||o)&&((o=o||{})["#"]=n,e.on("out",{get:o}),!t.ask))return;e=t.ask,f.obj.del(t,"ask"),v(e||t.next,(function(t,e){var o=t.lex||{};o["#"]=n,o["."]=o["."]||e,t.on("out",{get:o})})),f.obj.del(t,"ask")}(t,r.link=i)))}}function i(t,n){t.echo&&v(t.echo,r,n)}function r(t){t&&t.on&&t.on("in",this)}function a(t,n){var e,o,i,r=this.cat.next||l,a=this.msg;(k!==n||r[n])&&(o=r[n])&&(o.has?(c!==o.put&&f.val.link.is(t)||(o.put=t),e=o.$):(i=a.$)&&(i=(e=a.$.get(n))._,c!==i.put&&f.val.link.is(t)||(i.put=t)),o.on("in",{put:t,get:n,$:e,via:a}))}function u(t,n){if(t.has||t.soul){var e=t.map;t.map=null,t.has&&(t.dub&&t.root.stop&&(t.dub=null),t.link=null),(t.pass||n["@"]||null!==e)&&(c===e&&f.val.link.is(t.put)||(v(e,(function(n){(n=n.at)&&d(n.echo,t.id)})),e=t.put,v(t.next,(function(n,o){if(c===e&&c!==t.put)return!0;n.put=c,n.ack&&(n.ack=-1),n.on("in",{get:o,$:n.$,put:c})}))))}}function s(t){var n=this.as,e=n.get||"",o=n.$._,i=(t.put||"")[e["#"]];if(o.ack&&(o.ack=o.ack+1||1),t.put&&("string"!=typeof e["."]||h(i,o.get)))k!=e["."]?(o.$===(t._||"").$&&(t._.miss=o.put===c),f.on.put(t)):o.on("in",{get:o.get,put:f.val.link.ify(e["#"]),$:o.$,"@":t["@"]});else{if(o.put!==c)return;o.on("in",{get:o.get,put:o.put=c,$:o.$,"@":t["@"]})}}var f=t("./root");f.chain.chain=function(t){var o,i=this,r=i._,a=new(t||i).constructor(i),u=a._;return u.root=o=r.root,u.id=++o.once,u.back=i._,u.on=f.on,u.on("in",e,u),u.on("out",n,u),a};var c,l={},p=f.obj,h=p.has,d=p.del,g=p.to,v=p.map,m=f.text.random,k=f.node._}))(t,"./chain"),t((function(){function n(t){var n,e=this,r=e.as,u=r.at.root,f=(t.$||{})._||{},c=t.put||f.put;if((n=u.now)&&e!==n[r.now])return e.to.next(t);if(e.seen&&f.id&&e.seen[f.id])return e.to.next(t);if((n=c)&&n[s._]&&(n=s.is(n))&&(n=(t.$$=f.root.$.get(n))._,i!==n.put&&(t=a(t,{put:c=n.put}))),(n=u.mum)&&f.id){var l=f.id+(e.id||(e.id=o.text.random(9)));if(n[l])return;i===c||s.is(c)||(n[l]=!0)}r.use(t,e),e.stun?e.stun=null:e.to.next(t)}function e(t){var n=this.on;if(!t||n.soul||n.has)return this.off();if(t=(t=(t=t.$||t)._||t).id){var e;if((e=this.seen||(this.seen={}))[t])return!0;e[t]=!0}}var o=t("./root");o.chain.get=function(t,a,l){var p;if("string"!=typeof t){if("function"==typeof t){if(!0===a)return function(t,n,e,o){var r,a=t._,u=0;(r=a.soul||a.link||a.dub)?n(r,o,a):a.jam?a.jam.push([n,o]):(a.jam=[[n,o]],t.get((function(t,n){if(!(i===t.put&&!a.root.opt.super&&(r=Object.keys(a.root.opt.peers).length)&&++u<=r)){n.rid(t);var e,o=(o=t.$)&&o._||{},c=0;for(r=a.jam,delete a.jam;e=r[c++];){var l=e[0];e=e[1],l&&l(o.link||o.soul||s.is(t.put)||f(t.put)||o.dub,e,t,n)}}}),{out:{get:{".":!0}}}))}(this,t,0,l),this;var h,d=(p=this)._,g=d.root,v=g.now;(l=a||{}).at=d,l.use=t,l.out=l.out||{},l.out.get=l.out.get||{},(h=d.on("in",n,l)).rid=e,(g.now={$:1})[l.now=d.id]=h;var m=g.mum;return g.mum={},d.on("out",l.out),g.mum=m,g.now=v,p}return u(t)?this.get(""+t,a,l):(v=s.is(t))?this.get(v,a,l):r.is(t)?(p=this,(v=((v=t["#"])||c)["="]||v)&&(p=p.get(v)),p._.lex=t,p):((l=this.chain())._.err={err:o.log("Invalid get request!",t)},a&&a.call(l,l._.err),l)}if(0==t.length)return(l=this.chain())._.err={err:o.log("Invalid zero length string key!",t)},null;return(p=(this._.next||c)[t])||(p=function(t,n){var e=n._,o=e.next,i=n.chain()._;return o||(o=e.next={}),o[i.get=t]=i,n===e.root.$?i.soul=t:(e.soul||e.has)&&(i.has=t),i}(t,this)),p=p.$,(v=this._.stun)&&(p._.stun=p._.stun||v),a&&"function"==typeof a&&p.get(a,l),p};var i,r=o.obj,a=o.obj.to,u=o.num.is,s=o.val.link,f=o.node.soul,c={}}))(t,"./get"),t((function(){function n(t){t&&t()}function e(){var t=this;t.graph&&l(t.stun)&&(t.res=t.res||function(t){t&&t()},t.res((function(){delete t.via._.stun;var n=t.$.back(-1)._,e=n.ask((function(e){n.root.on("ack",e),e.err&&u.log(e),++o>(t.acks||0)&&this.off(),t.ack&&t.ack(e,this)}),t.opt),o=0,i=n.root.now;s.del(n.root,"now");var r=n.root.mum;n.root.mum={},t.ref._.on("out",{$:t.ref,put:t.out=t.env.graph,opt:t.opt,"#":e}),n.root.mum=r?s.to(r,n.root.mum):r,n.root.now=i,t.via._.on("res",{}),delete t.via._.tag.res}),t),t.res&&t.res())}function o(t,n,e,o){var r=this,a=u.is(t);!n&&o.path.length&&(r.res||d)((function(){for(var n=o.path,e=r.ref,s=0,f=n.length;s<f;s++)e=e.get(n[s]);a&&(e=t);var c=e._.dub;if(c||(c=u.node.soul(o.obj)))return e.back(-1).get(c),void o.soul(c);(r.stun=r.stun||{})[n]=1,e.get(i,!0,{as:{at:o,as:r,p:n,ref:e}})}),{as:r,at:o})}function i(t,n,e,o){n=n.as;var i,a=n.ref,s=n.at,f=[];n=n.as,a.back((function(t){if(i=t.soul||t.link||t.dub)return i;f.push(t.has||t.get)})),f=[i||n.soul].concat(f.reverse());var c=((e||{}).$||{})._||{};t=c.dub=c.dub||t||u.node.soul(s.obj)||u.node.soul(e.put||c.put)||u.val.link.is(e.put||c.put)||f.join("/"),o&&(o.stun=!0),t?r(c,c.dub=t,s,n):n.via.back("opt.uuid")((function(t,e){if(t)return u.log(t);r(c,c.dub=c.dub||e,s,n)}))}function r(t,n,e,o){t.$.back(-1).get(n),e.soul(n),delete o.stun[e.path],o.batch()}function a(t,n,e,o){if(n=n.as,e.$&&e.$._)if(e.err)u.log("Please report this as an issue! Put.any.err");else{var i,r=e.$._,a=r.put,s=n.opt||{};if(!(i=n.ref)||!i._.now){if(o&&(o.stun=!0),n.ref!==n.$){if(!(i=n.$._.get||r.get))return delete n.via._.stun,void u.log("Please report this as an issue! Put.no.get");n.data=c({},i,n.data),i=null}if(undefined===a){if(!r.get)return void delete n.via._.stun;t||(i=r.$.back((function(t){if(t.link||t.soul)return t.link||t.soul;n.data=c({},t.get,n.data)})),n.not=!0),r=(i=i||r.soul||r.link||r.dub)?r.root.$.get(i)._:r,n.soul=i,a=n.data}n.not||(n.soul=n.soul||t)||(n.path&&f(n.data)?n.soul=(s.uuid||n.via.back("opt.uuid")||u.text.random)():(g==r.get&&(n.soul=(r.put||p)["#"]||r.dub),n.soul=n.soul||r.soul||r.link||(s.uuid||n.via.back("opt.uuid")||u.text.random)()),n.soul)?n.ref.put(n.data,n.soul,n):n.via.back("opt.uuid")((function(t,e){if(t)return delete n.via._.stun,u.log(t);n.ref.put(n.data,n.soul=e,n)}))}}}var u=t("./root");u.chain.put=function(t,i,r){var s,l=this,p=l._,d=p.root.$;return(r=r||{}).data=t,r.via=r.$=r.via||r.$||l,"string"==typeof i?r.soul=i:r.ack=r.ack||i,p.soul&&(r.soul=p.soul),r.soul||d===l?f(r.data)?(r.soul=r.soul||(r.not=u.node.soul(r.data)||(r.via.back("opt.uuid")||u.text.random)()),r.via._.stun={},r.soul?(r.$=d.get(r.soul),r.ref=r.$,function(t){t.batch=e;var n=t.env=u.state.map(o,(t.opt||{}).state);if(n.soul=t.soul,t.graph=u.graph.ify(t.data,n,t),n.err)return(t.ack||h).call(t,t.out={err:u.log(n.err)}),void(t.res&&t.res());t.batch()}(r),l):(r.via.back("opt.uuid")((function(t,n){if(t)return u.log(t);(r.ref||r.$).put(r.data,r.soul=n,r)})),l)):((r.ack||h).call(r,r.out={err:u.log("Data saved to the root level of the graph must be a node (an object), not a",typeof r.data,'of "'+r.data+'"!')}),r.res&&r.res(),l):(r.via._.stun={},u.is(t)?(t.get((function(t,n,e){if(!t)return delete r.via._.stun,u.log("The reference you are saving is a",typeof e.put,'"'+e.put+'", not a node (object)!');l.put(u.val.link.ify(t),i,r)}),!0),l):(p.has&&(s=u.val.link.is(t))&&(p.dub=s),r.ref=r.ref||d._===(s=p.back)?l:s.$,r.ref._.soul&&u.val.is(r.data)&&p.get?(r.data=c({},p.get,r.data),r.ref.put(r.data,r.soul,r),l):(r.ref.get(a,!0,{as:r}),r.out||(r.res=r.res||n,r.$._.stun=r.ref._.stun),l)))};String.fromCharCode(31);var s=u.obj,f=s.is,c=s.put,l=s.empty,p={},h=function(){},d=function(t,n){t.call(n||p)},g=u.node._}))(t,"./put"),t((function(n){var e=t("./root");t("./chain"),t("./back"),t("./put"),t("./get"),n.exports=e}))(t,"./index"),t((function(){function n(t,n){var e,o=this,r=t.$,a=((r||{})._||{}).put||t.put;if(i!==a){if(e=t.$$){if(i===(e=t.$$._).put)return;a=e.put}o.change&&(a=t.put),o.as?o.ok.call(o.as,t,n):o.ok.call(r,a,t.get,t,n)}}function e(t,n,r){if(t.$){var a,u,f=this.as,c=t.$,l=c._,p=l.put||t.put;(u=t.$$)&&(a=u=t.$$._,i!==a.put&&(p=a.put)),(u=n.wait)&&(u=u[l.id])&&clearTimeout(u),n.ack=(n.ack||0)+1,!r&&i===p&&!l.root.opt.super&&n.ack<=(f.acks||Object.keys(l.root.opt.peers).length)||(!r&&(i===p||l.soul||l.link||a&&!(0<a.ack))||i===p&&!l.root.opt.super&&(u=Object.keys(l.root.opt.peers).length)&&!r&&(a||l).ack<u?u=(n.wait={})[l.id]=setTimeout((function(){e.call({as:f},t,n,u||1)}),f.wait||99):(a&&i===a.put&&(u=s.is(p))&&(p=o.node.ify({},u)),n.rid?n.rid(t):n.off(),f.ok.call(c||f.$,p,t.get)))}else n.off()}var o=t("./index");o.chain.on=function(t,e,o,i){var r,a=this,u=a._;if("string"==typeof t)return e?(r=u.on(t,e,o||u,i),o&&o.$&&(o.subs||(o.subs=[])).push(r),a):u.on(t);var s=e;return(s=!0===s?{change:!0}:s||{}).at=u,s.ok=t,a.get(n,s),a},o.chain.val=function(t,n){return o.log.once("onceval","Future Breaking API Change: .val -> .once, apologies unexpected."),this.once(t,n)},o.chain.once=function(t,n){var r=this,a=r._,u=a.put;if(0<a.ack&&i!==u)return(t||f).call(r,u,a.get),r;if(!t){o.log.once("valonce","Chainable val is experimental, its behavior and API may change moving forward. Please play with it and report bugs and ideas on how to improve it.");var s=r.chain();return s._.nix=r.once((function(){s._.on("in",r._)})),s}return(n=n||{}).ok=t,n.at=a,n.out={"#":o.text.random(9)},r.get(e,{as:n}),n.async=!0,r},o.chain.off=function(){var t,n=this._,e=n.back;if(e)return n.ack=0,(t=e.next)&&t[n.get]&&u(t,n.get),(t=e.ask)&&u(t,n.get),(t=e.put)&&u(t,n.get),(t=n.soul)&&u(e.root.graph,t),(t=n.map)&&a(t,(function(t){t.link&&e.root.$.get(t.link).off()})),(t=n.next)&&a(t,(function(t){t.$.off()})),n.on("off",{}),this};var i,r=o.obj,a=r.map,u=r.del,s=o.val.link,f=function(){}}))(t,"./on"),t((function(){function n(t){if(!t.put||o.val.is(t.put))return this.to.next(t);this.as.nix&&this.off(),i(t.put,e,{at:this.as,msg:t}),this.to.next(t)}function e(t,n){if(a!==n){var e=this.msg.$,i=this.at,r=e._.lex;r&&!o.text.match(n,r["."]||r["#"]||r)||(((r=e.get(n)._).echo||(r.echo={}))[i.id]=r.echo[i.id]||i)}}var o=t("./index");o.chain.map=function(t){var e,i=this,a=i._;return t?(o.log.once("mapfn","Map functions are experimental, their behavior and API may change moving forward. Please play with it and report bugs and ideas on how to improve it."),e=i.chain(),i.map().on((function(n,i,a,u){var s=(t||r).call(this,n,i,a,u);if(undefined!==s)return n===s?e._.on("in",a):o.is(s)?e._.on("in",s._):void e._.on("in",{get:i,put:s})})),e):((e=a.each)||(a.each=e=i.chain(),e._.nix=i.back("nix"),i.on("in",n,e._)),e)};var i=o.obj.map,r=function(){},a=o.node._}))(t,"./map"),t((function(){function n(){return e.state.lex()+e.text.random(7)}var e=t("./index");e.chain.set=function(t,o,i){var r,a=this;return o=o||function(){},(i=i||{}).item=i.item||t,(r=e.node.soul(t))&&(t=e.obj.put({},r,e.val.link.ify(r))),e.is(t)?(t.get((function(n,r,u){if(n||!t._.stun)return n?void a.put(e.obj.put({},n,e.val.link.ify(n)),o,i):o.call(a,{err:e.log('Only a node can be linked! Not "'+u.put+'"!')});t._.on("res",(function(){this.off(),a.set(t,o,i)}))}),!0),t):(e.obj.is(t)&&(r=r||e.node.soul(t)||n()),a.get(r||n()).put(t,o,i))}}))(t,"./set"),t((function(){if("undefined"!=typeof Gun){var t;try{t=(Gun.window||function(){}).localStorage}catch(t){}t||(Gun.log("Warning: No localStorage exists to persist data to!"),t={setItem:function(t,n){this[t]=n},removeItem:function(t){delete this[t]},getItem:function(t){return this[t]}}),Gun.on("create",(function(n){function e(t){if(!t.err&&t.ok){var n=t["@"];setTimeout((function(){Gun.obj.map(u,(function(t,e){Gun.obj.map(t,(function(e,o){n===e&&delete t[o]})),s(t)&&delete u[e]})),p()}),i.wait||1)}}var o=this.to,i=n.opt;if(n.once)return o.next(n);if(!1===i.localStorage)return o.next(n);i.prefix=i.file||"gun/";var r,a,u=Gun.obj.ify(t.getItem("gap/"+i.prefix))||{},s=Gun.obj.empty;if(!s(u)){var f=Gun.obj.ify(t.getItem(i.prefix))||{},c={};Gun.obj.map(u,(function(t,n){Gun.obj.map(t,(function(t,e){c[n]=Gun.state.to(f[n],e,c[n])}))})),setTimeout((function(){n.on("out",{put:c,"#":n.ask(e)})}),1)}n.on("out",(function(t){t.lS||(Gun.is(t.$)&&t.put&&!t["@"]&&(r=t["#"],Gun.graph.is(t.put,null,l),a||(a=setTimeout(p,i.wait||1))),this.to.next(t))})),n.on("ack",e),o.next(n);var l=function(t,n,e,o){(u[o]||(u[o]={}))[n]=r},p=function(){clearTimeout(a),a=!1;try{t.setItem("gap/"+i.prefix,JSON.stringify(u))}catch(t){Gun.log(err=t||"localStorage failure")}}})),Gun.on("create",(function(n){this.to.next(n);var e=n.opt;if(!n.once&&!1!==e.localStorage){e.prefix=e.file||"gun/";var o,i={},r=0,a=Gun.obj.ify(t.getItem(e.prefix))||{};n.on("localStorage",a),n.on("put",(function(t){this.to.next(t);var n,s=t.put,f=s["#"];if(a[f]=Gun.state.ify(a[f],s["."],s[">"],s[":"],f),t["@"]||((i[t["#"]]=n=(t._||"").lot||{}).lS=(n.lS||0)+1),(r+=1)>=(e.batch||1e3))return u();o||(o=setTimeout(u,e.wait||1))})),n.on("get",(function(t){function e(){if(r&&(o=r["#"])){var e=r["."];(i=a[o]||undefined)&&e&&(i=Gun.state.to(i,e)),n.on("in",{"@":t["#"],put:Gun.graph.node(i),lS:1})}}this.to.next(t);var o,i,r=t.get;Gun.debug?setTimeout(e,1):e()}));var u=function(s){var f;r=0,clearTimeout(o),o=!1;var c=i;i={},s&&(a=s);try{t.setItem(e.prefix,JSON.stringify(a))}catch(t){Gun.log(f=(t||"localStorage failure")+" Consider using GUN's IndexedDB plugin for RAD for more storage space, https://gun.eco/docs/RAD#install"),n.on("localStorage:error",{err:f,file:e.prefix,flush:a,retry:u})}(f||Gun.obj.empty(e.peers))&&Gun.obj.map(c,(function(t,e){if(t){if(t.more)return void(i[e]=t);t.s!==t.lS&&(f="localStorage batch not same.")}n.on("in",{"@":e,err:f,ok:0})}))}}}))}}))(t,"./adapters/localStorage"),t((function(n){var e=t("../type");!function(){function t(t,o){var i;if(!(o instanceof Object))return o;var r=+new Date;return e.obj.map(Object.keys(o).sort(),n,{to:i={},on:o}),console.STAT&&console.STAT(r,+new Date-r,"sort"),i}function n(t){this.to[t]=this.on[t]}var o=JSON.stringify;e.obj.hash=function(n,i){if(i||undefined!==(n=o(n,t)))return e.text.hash(i||n||"")},e.obj.hash.sort=t}();var o=e.obj.is;try{n.exports=function(t){function n(t){var n=t.batch,e="string"==typeof n;if(e&&(n+="]"),t.batch=t.tail=null,n&&!(e?3>n.length:!n.length)){if(!e)try{n=1===n.length?n[0]:JSON.stringify(n)}catch(t){return a.log("DAM JSON stringify error",t)}n&&i(n,t)}}function i(t,n){try{var e=n.wire;n.say?n.say(t):e.send&&e.send(t),r.say.d+=t.length||0,++r.say.c}catch(e){(n.queue=n.queue||[]).push(t)}}var r=function(){},a=t.opt||{};a.log=a.log||console.log,a.gap=a.gap||a.wait||0,a.pack=a.pack||.3*(a.memory?1e3*a.memory*1e3:1399e6),a.puff=a.puff||9;var u,s,f,c=setTimeout.puff||setTimeout,l=t.dup,p=l.check,h=l.track,d=r.hear=function(i,u){if(i){if(a.pack<=i.length)return r.say({dam:"!",err:"Message too big!"},u);var s,f,l,g=i[0];if(r===this&&(d.d+=i.length||0,++d.c),"["!==g){if("{"===g||(i["#"]||o(i))&&(s=i)){try{s=s||JSON.parse(i)}catch(t){return a.log("DAM JSON parse error",t)}if(!s)return;if(s.DBG&&(s.DBG=l={DBG:s.DBG}),l&&(l.hp=+new Date),(f=s["#"])||(f=s["#"]=e.text.random(9)),g=p(f))return;if((s._=function(){}).via=r.leap=u,g=s.dam)return(g=r.hear[g])&&g(s,u,t),void h(f);var v,m=+new Date;l&&(l.is=m),t.on("in",s),l&&(l.hd=+new Date),console.STAT&&(v=+new Date-m)>9&&console.STAT(m,v,"msg"),h(f).via=u,r.leap=null}}else{try{s=JSON.parse(i)}catch(t){a.log("DAM JSON parse error",t)}if(i="",!s)return;console.STAT&&console.STAT(+new Date,s.length,"# on hear batch");var k=a.puff;!function t(){for(var e,o=+new Date,i=0;i<k&&(e=s[i++]);)d(e,u);s=s.slice(i),console.STAT&&console.STAT(o,+new Date-o,"hear loop"),n(u),s.length&&c(t,0)}()}}};d.c=d.d=0,s=0,f=r.say=function(t,o){var p,d,g;if((p=this)&&(p=p.to)&&p.next&&p.next(t),!t)return!1;var v=t.DBG;o||(b=+new Date,v&&(v.y=b));var m=t._||(t._=function(){});if((d=t["#"])||(d=t["#"]=e.text.random(9)),(g=m.raw)||(g=r.raw(t)),b&&console.STAT&&console.STAT(b,+new Date-b,"say prep"),!u&&h(d),!o&&(p=t["@"])&&(o=(p=l.s[p])&&(p.via||(p=p.it)&&(p=p._)&&p.via)||r.leap),!o&&t["@"])return console.STAT&&console.STAT(+new Date,++s,"total no peer to ack to"),!1;if(!o&&r.way)return r.way(t);if(o&&o.id){if(!o.wire&&r.wire&&r.wire(o),d!==o.last){if(o.last=d,o===m.via)return!1;if((p=m.to)&&(p[o.url]||p[o.pid]||p[o.id]))return!1;if(o.batch){if(o.tail=(p=o.tail||0)+g.length,o.tail<=a.pack)return void(o.batch+=(p?",":"")+g);n(o)}o.batch="[";var k,b=+new Date;setTimeout((function(){console.STAT&&(k=+new Date-b)>9&&console.STAT(b,k,"0ms TO",d,o.id),n(o)}),a.gap),i(g,o)}}else{if(!e.obj.is(o||a.peers))return!1;var y=a.peers,_=Object.keys(o||a.peers||{});!function n(){var e=+new Date;u=1;var o=m.raw;m.raw=g;for(var i,r=0;r<9&&(i=(_||"")[r++]);)(i=y[i])&&f(t,i);m.raw=o,u=0,_=_.slice(r),console.STAT&&console.STAT(e,+new Date-e,"say loop"),_.length&&(c(n,0),h(t["@"]))}()}},r.say.c=r.say.d=0,function(){r.raw=function(n){if(!n)return"";var e,o=n._||{};if(e=o.raw)return e;if("string"==typeof n)return n;var i=t(n);return o&&(i||"").length<1e5&&(o.raw=i),i};var t=JSON.stringify}(),r.hi=function(n){var o=n.wire||{};n.id?a.peers[n.url||n.id]=n:(o=n.id=n.id||e.text.random(9),r.say({dam:"?",pid:t.opt.pid},a.peers[o]=n),delete l.s[n.last]),n.met=n.met||+new Date,o.hied||t.on(o.hied="hi",n),o=n.queue,n.queue=[],e.obj.map(o,(function(t){i(t,n)})),e.obj.native&&e.obj.native()},r.bye=function(n){t.on("bye",n);var e=+new Date;e-=n.met||e,r.bye.time=((r.bye.time||e)+e)/2},r.hear["!"]=function(t){a.log("Error:",t.err)},r.hear["?"]=function(t,n){t.pid&&(n.pid||(n.pid=t.pid),t["@"])||(r.say({dam:"?",pid:a.pid,"@":t["#"]},n),delete l.s[n.last])},t.on("create",(function(t){t.opt.pid=t.opt.pid||e.text.random(9),this.to.next(t),t.on("out",r.say)})),t.on("bye",(function(t,n){this.to.next(t=a.peers[t.id||t]||t),t.bye?t.bye():(n=t.wire)&&n.close&&n.close(),e.obj.del(a.peers,t.id),t.wire=null}));var g={};return t.on("bye",(function(t,n){this.to.next(t),(n=t.url)&&(g[n]=!0,setTimeout((function(){delete g[n]}),a.lack||9e3))})),t.on("hi",(function(n,o){this.to.next(n),(o=n.url)&&g[o]&&(delete g[o],a.super||e.obj.map(t.next,(function(i,a){(o={})[a]=t.graph[a],r.say({"##":e.obj.hash(o),get:{"#":a}},n)})))})),r}}catch(t){}}))(t,"./adapters/mesh"),t((function(){var n=t("../index");n.Mesh=t("./mesh"),n.on("opt",(function(t){function e(t){try{if(!t||!t.url)return e&&e(t);var n=t.url.replace(/^http/,"ws"),e=t.wire=new i.WebSocket(n);return e.onclose=function(){i.mesh.bye(t),o(t)},e.onerror=function(){o(t)},e.onopen=function(){i.mesh.hi(t)},e.onmessage=function(n){n&&i.mesh.hear(n.data||n,t)},e}catch(t){}}function o(t){clearTimeout(t.defer),s&&t.retry<=0||(t.retry=(t.retry||i.retry||60)-1,t.defer=setTimeout((function n(){if(s&&s.hidden)return setTimeout(n,2e3);e(t)}),2e3))}this.to.next(t);var i=t.opt;if(!t.once&&!1!==i.WebSocket){var r;"undefined"!=typeof window&&(r=window),"undefined"!=typeof global&&(r=global),r=r||{};var a=i.WebSocket||r.WebSocket||r.webkitWebSocket||r.mozWebSocket;if(a){i.WebSocket=a;var u=i.mesh=i.mesh||n.Mesh(t);u.wire=i.wire=e,setTimeout((function(){t.on("out",{dam:"hi"})}),1);var s="undefined"!=typeof document&&document}}}))}))(t,"./adapters/websocket")}();