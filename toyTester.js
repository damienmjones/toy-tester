const balancedParens = (input, structure = [], open = '([{', closed = ')]}') => {
  for (char of input) {
    if ( open.includes(char) ) structure.push(char);
    if ( closed.includes(char) && structure.pop() != open.charAt(closed.indexOf(char))) return false;
  }
  return (structure.length === 0);
};

const _test = tests =>  tests.reduce( ( r, {test, expected, section}, i, a, actual = ( eval( test ) ), failed = (actual != expected ), t = '', sc ) => {
  
  const newSection = section =>  { r.sn = section; r.st = '', r.s++, r.sp = 0, r.sc = 0; }
  if (!i) newSection( section || 'Tests'); // init first section

  if( !section ){ // log test
    t = '\x1b[2m\x1b[3' + ((failed)?'1':'2') + 'm   * ' + test + ' expected \x1b[1m' + expected + '\x1b[22m\x1b[2m; returned \x1b[3m' + actual + '\x1b[23m\n';
    if (failed || process.argv[2]==='-v') r.st += t 
    if (!failed) {r.sp++;r.tpt++;}
    r.sc++;
  }

  if ( (section && !!i) || i === a.length-1 ) { // log section
    failed = (r.sc!=r.sp)
    if (!failed) {r.p++;r.tps++}
    r.t += '\n\x1b[1m\x1b[3' + ( failed ? '1' : '2' ) + 'm' + r.s + ') ' + r.sn + ' '+ Math.floor(r.sp/r.sc*100) + '% (' + r.sp + '/' + r.sc + ')\x1b[49m\x1b[0m\n' + r.st
    newSection(section);
    r.ts++; 
  }

  if ( i === a.length-1 ) {
    failed = (r.tpt < (a.length-r.s+1));
    r.h = '\n\x1b[0m\x1b[10' + ( failed ? '1' : '2' ) + 'm\x1b[30m\x1b[4mTESTS ' + ( (failed) ? 'FAILED' : 'PASSED' ) +
    '\x1b[24m:  Sections '+r.tps+'/'+(r.s-1)+' ('+Math.floor(r.tps/(r.s-1)*100)+'%),' +
    ' Tests ' + r.tpt + '/'+ (a.length-r.s+1) +' (' + Math.floor(r.tpt/(a.length-r.s+1)*100) + '%)\x1b[0m\n';

    r.t = r.h + r.t + r.h  
    console.log (r.t)
;  }
  return r;
}, {t:'', tpt:0, tps:0, s:0, sn:'', sp:0, sc:0, st:0});
// text, total (passed tests, passed sections, sections (name, passed tests, total tests )


// SAMPLE TEST CALL -->   node toyTester.js -v (optional: verbose, includes passed tests)

_test([
  { section: `should return true if parens are balanced and false otherwise`}, 
  { test: `balancedParens('(')`, expected: false },
  { test: `balancedParens('()')`, expected: true },
  { test: `balancedParens(')(')`, expected: true },
  { test: `balancedParens('(())')`, expected: true },
  { section: `should work for all types of brackets`},
  { test: `balancedParens('[](){}')`, expected: true },
  { test: `balancedParens('[({})]')`, expected: true },
  { test: `balancedParens('[(]{)}')`, expected: false },
  { section: `ignore non-bracket characters`},
  { test: `balancedParens(' var hubble = function() { telescopes.awesome();')`, expected: false },
  { test: `balancedParens(' var wow  = { yo: thisIsAwesome() }')`, expected: true }
])