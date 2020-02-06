function _test(tests) {

  // gather user-selected execution parameters from node
  var pv = process.argv, 

      // flag for "verbose mode" (v)
      v = process.argv.includes('-v'),

      // get filename (fn)
      vars = pv[1].split('/'), 
      fn = vars[vars.length - 1].split('.')[0];

      // if one of the parameters is a valid number, repeat tests that many times (rpt)
      rpt = parseInt( pv.find( function (a) { 
        return !isNaN( parseInt( a ) );
      }) || 1 );


  // repeat the test (rpt) times, keeping a count (c)  
  for (var c = 1; c <= rpt; c++) {

    // r = reduce object that keeps track of test results for summary
    tests.reduce(function (r, obj, i, a) {

      // if test is not an object, make it one
      if (typeof obj === 'string' ) obj = { test: obj };
      if (Array.isArray(obj)) obj = { test: obj[0], expected:obj[1] };

      var t, // temp variable for gathering text results
          test = obj.test,
          // if no expected value passed, assume true
          exp = obj.expected === undefined 
            ? true 
            : obj.expected,
          section = obj.section;
          
      // if there is no function expression in the test, assume filename as function
      if (test && !new RegExp(/[a-zA-Z]+\([^\)]*\)/g).test(test)) test = fn + '(' + test + ')';

          // start timer
      var ts = process.hrtime(), 
          // run test
          actual = eval(test), 
          // log time elapsed
          ms = process.hrtime(ts)[1] / 1000000, 
          // log whether test passed or failed
          failed = JSON.stringify(actual) != JSON.stringify(exp); 

      var newSection = function newSection(section) {
        // set name of section
        r.sn = section;
        // reset section text, tests passed in section (r.sp), section test count (r.sc)
        r.st = ''; r.sp = 0; r.sc = 0;
        // increment section count
        r.s++;        
      };

      // initialize first section; if no explicit section name, default to function/file name
      if (!i) newSection( section || fn ); 

      // if this is a test (not a section) LOG TEST RESULTS to temp variable
      if (!section) {

        /* console formatting uses strange codes:
          \x1b[31m = red
          \x1b[32m = green
          \x1b[37m = white
          \x1b[2m  = dim
          \x1b[1m  = bold
          \x1b[3m  = italics
          \x1b[0m  = reset to default
        */

        // format red (or green) depending on whether test passed or failed
        t = '\x1b[2m\x1b[3' + (failed ? '1' : '2') + 'm'  

        // "test expected bold ( [expected_value] ); returned italics ( [actual_value] )" 
        + '   * ' + test + ' expected \x1b[1m' + exp + '\x1b[22m\x1b[2m; returned \x1b[3m' + actual

        // if "verbose" option selected, log the time it took to run the function
        + '\x1b[37m' + (v ? '  (' + ms + 'ms)' : '') + '\n';

        // add test to list if test failed OR if "verbose" option indicates to show passed tests
        if (failed || v) r.st += t;

        // if test passed, increment "test passed in this section" (r.sp) & "total passed tests" (r.tpt)
        if (!failed) {
          r.sp++;
          r.tpt++;
        }

        // increment "section count" and "total tests"
        r.sc++;
        r.tt++;
      }

      // if there is a section, summarize and log previous section (into temp variable)
      if (section && !!i || i === a.length - 1) {

        // if fewer tests PASSED in the section than total tests IN the section, the section fails  
        failed = r.sp < r.sc;

        // increment "total passed sections" 
        if (!failed) {
          r.tps++;
        }

        // format red (or green) and bold depending on whether section passed or failed
        r.t += '\n\x1b[0m\x1b[1m\x1b[3' + (failed ? '1' : '2') + 'm' 

        // log [section number (r.s)] ) [section_name (r.sn)] => 
        // [passed_tests_in_current_section (r.sp)] / [total_tests_in_current_section (r.sc)]
        + r.s + ') ' + r.sn + ' -> ' + r.sp + '/' + r.sc 

        // log ( [percent_of_tests_passed] % )
        + ' (' + Math.floor(r.sp / r.sc * 100) + '%)\n' + r.st;

        newSection(section);

        // increment section count (r.ts)
        r.ts++;

      }

      // if we're on the last item, print TOTAL TEST SUMMARY from results object
      if (i === a.length - 1) _final( r );

      return r;

    }, {
      // initialize all the test tracking variables
      t: '', // collected test results
      tt: 0, // total tests
      tpt: 0, // total passed tests
      tps: 0, // total passed sections
      s: 0, // section count
      sn: '', // name of current section
      sp: 0, // passed tests in current section
      sc: 0, // tests in current section
      st: '' // test results for current section
    }); // text, total (passed tests, passed sections, sections (name, passed tests, total tests )  
  }

  function _final( r ) {

        // if fewer tests PASSED than total tests, entire routine fails  
        var failed = r.tpt < r.tt;
        
        // if multiple tests, print which one we're on
        (rpt > 1) ? 'TEST #' + c : 'TESTS';

        // format red (or green) and bold depending on whether section passed or failed
        //      \x1b[101m = red background; \x1b[102m = green background;  \x1b[4m = underline
        r.h = '\n\x1b[0m\x1b[10' + (failed ? '1' : '2') + '\x1b[4m'
        
        // if multiple tests, print which one we're on and whether it passed or failed
        + ( ( rpt > 1 ) ? 'TEST ' + c : 'TESTS' ) + ' ' + ( failed ? 'FAILED' : 'PASSED' ) 

        // end underline; log total passed sections (r.tps) / total sections (r.s)
        + '\x1b[24m:  Sections ' + r.tps + '/' + (r.s - 1) 

        // log Section success % (passed_sections / total sections) * 100
        + ' (' + Math.floor(r.tps / (r.s - 1) * 100) + '%),' 

        // log total passed tests / total tests
        + ' Tests ' + r.tpt + '/' + r.tt

        // log total success % (passed_tests / total tests) * 100
        + ' (' + Math.floor(r.tpt / r.tt * 100) + '%)\x1b[0m\n';
        
        // print TOTAL TEST SUMMARY before and after other tests
        console.log(r.h + r.t + r.h);
  }

};
