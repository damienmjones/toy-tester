var _test = function(tests) { 
  var pv = process.argv,f=pv[1].split('/'),repeat = parseInt(pv.find( a => !isNaN(parseInt(a)) ) || 1)
  f=f[f.length-1].split('.')[0]; 
  for ( var i = 1; i < (repeat+1); i++ ) { 
      if(repeat>1) console.log('Test #' + i);
      tests.reduce((r,c,i,a) => {
        c=(typeof c==='string')?{test:c}:c;
        var t,test=c.test,e=(c.expected===undefined)?true:c.expected,section=c.section,v=process.argv.includes('-v');
        if(test && !new RegExp(/[a-zA-Z]+\([^\)]*\)/g).test(test)) test=f+'('+test+')';
        var ts=process.hrtime(),actual=eval(test),ms=process.hrtime(ts)[1]/1000000,failed=(JSON.stringify(actual)!= JSON.stringify(e));
        var newSection = section => { r.sn = section; r.st = '', r.s++, r.sp = 0, r.sc = 0; }
        if (!i) newSection( section || f); // init first section
      
        if( !section ){ // log test
          t = '\x1b[2m\x1b[3' + ((failed)?'1':'2') + 'm   * ' + test + ' expected \x1b[1m' + e + '\x1b[22m\x1b[2m; returned \x1b[3m' + actual + '\x1b[23m\x1b[37m' + ( (v) ? '  (' + ms + 'ms)' : '') + '\n';
          if (failed || v) r.st += t 
          if (!failed) {r.sp++;r.tpt++;}
          r.sc++;
        }
      
        if ( (section && !!i) || i === a.length-1 ) { // log section
          failed = (r.sc!=r.sp)
          if (!failed) {r.p++;r.tps++}
          r.t += '\n\x1b[0m\x1b[1m\x1b[3' + ( failed ? '1' : '2' ) + 'm' + r.s + ') ' + r.sn + ' -> ' + r.sp + '/' + r.sc +' ('+ Math.floor(r.sp/r.sc*100) + '%)\x1b[49m\x1b[0m\n' + r.st
          newSection(section);
          r.ts++; 
        }
      
        if ( i === a.length-1 ) {
          failed = (r.tpt < (a.length-r.s+1));
          r.h = '\n\x1b[0m\x1b[10' + ( failed ? '1' : '2' ) + 'm\x1b[30m\x1b[4mTESTS ' + ( (failed) ? 'FAILED' : 'PASSED' ) +
          '\x1b[24m:  Sections '+r.tps+'/'+(r.s-1)+' ('+Math.floor(r.tps/(r.s-1)*100)+'%),' +
          ' Tests ' + r.tpt + '/'+ (a.length-r.s+1) +' (' + Math.floor(r.tpt/(a.length-r.s+1)*100) + '%)\x1b[0m\n';
      
          r.t = r.h + r.t + r.h  
          console.log (r.t);
        }
        return r;
      }, {t:'', tpt:0, tps:0, s:0, sn:'', sp:0, sc:0, st:0});
      // text, total (passed tests, passed sections, sections (name, passed tests, total tests )  
  }

} 



/* ------------------------------------------------------------------------------------------------- */



/* FUNCTION TO TEST (bonus if it's the name of the file)
------------------------------------------------------*/
const balancedParens = (input, structure = [], open = '([{', closed = ')]}') => {
  for (char of input) {
    if ( open.includes(char) ) structure.push(char);
    if ( closed.includes(char) && structure.pop() != open.charAt(closed.indexOf(char))) return false;
  }
  return (structure.length === 0);
};


/* TESTING FUNCTION (minified)
-------------------------------------*/
var _test=function _test(tests){var pv=process.argv,f=pv[1].split("/"),repeat=parseInt(pv.find(function(t){return!isNaN(parseInt(t))})||1);f=f[f.length-1].split(".")[0];for(var i=1;i<repeat+1;i++)repeat>1&&console.log("Test #"+i),tests.reduce(function(r,c,i,a){c="string"==typeof c?{test:c}:c;var t,test=c.test,e=void 0===c.expected||c.expected,section=c.section,v=process.argv.includes("-v");test&&!new RegExp(/[a-zA-Z]+\([^\)]*\)/g).test(test)&&(test=f+"("+test+")");var ts=process.hrtime(),actual=eval(test),ms=process.hrtime(ts)[1]/1e6,failed=JSON.stringify(actual)!=JSON.stringify(e),newSection=function(t){r.sn=t,r.st="",r.s++,r.sp=0,r.sc=0};return i||newSection(section||f),section||(t="[2m[3"+(failed?"1":"2")+"m   * "+test+" expected [1m"+e+"[22m[2m; returned [3m"+actual+"[23m[37m"+(v?"  ("+ms+"ms)":"")+"\n",(failed||v)&&(r.st+=t),failed||(r.sp++,r.tpt++),r.sc++),(section&&i||i===a.length-1)&&(failed=r.sc!=r.sp,failed||(r.p++,r.tps++),r.t+="\n[0m[1m[3"+(failed?"1":"2")+"m"+r.s+") "+r.sn+" -> "+r.sp+"/"+r.sc+" ("+Math.floor(r.sp/r.sc*100)+"%)[49m[0m\n"+r.st,newSection(section),r.ts++),i===a.length-1&&(failed=r.tpt<a.length-r.s+1,r.h="\n[0m[10"+(failed?"1":"2")+"m[30m[4mTESTS "+(failed?"FAILED":"PASSED")+"[24m:  Sections "+r.tps+"/"+(r.s-1)+" ("+Math.floor(r.tps/(r.s-1)*100)+"%), Tests "+r.tpt+"/"+(a.length-r.s+1)+" ("+Math.floor(r.tpt/(a.length-r.s+1)*100)+"%)[0m\n",r.t=r.h+r.t+r.h,console.log(r.t)),r},{t:"",tpt:0,tps:0,s:0,sn:"",sp:0,sc:0,st:0})};


/* WRITING TESTS (working examples)
---------------------------------*/
_test([ // if no first section, it defaults to the filename
  // { section: `should return true if parens are balanced and false otherwise`},
  { test: `balancedParens(')(')`, expected: false }, 
  { test: `balancedParens('()')` }, // SHORTHAND: "expected" defaults to true
  { test: `')('`, expected: false }, // SHORTHAND: if fn=filename, you can omit fn()
  `balancedParens('(())')`, // if it's only the test, the object is unnecessary
  // { section: `should work for all types of brackets`}, 
  { test: `balancedParens('[](){}')`, expected: true },
  `'[({})]'`, // SHORTHAND: fn and expected default; no object
  { test: `'[(]{)}'`, expected: false }, 
  // { section: `ignore non-bracket characters`}, 
  { test: `balancedParens(' var hubble = function() { telescopes.awesome();')`, expected:false },
  { test: `balancedParens(' var wow  = { yo: thisIsAwesome() }')`}
])

_test(
  [`'()'`, `'(())'`, `'{[()]}'`]
  )


/* RUNNNING TESTS IN THE CONSOLE (parameters can be chained) 
------------------------------------------------------------
node toyTester 
node toyTester.js -v    (verbose; includes passed tests & durations)
node toyTester 5        (run 5x) */
