
let period = 2000;
let loopNum = 0;
let typewriterText = '';
let isDeleting = false;


function tick(element, doBackSpace, typewriterOptions) {
  let i = loopNum % typewriterOptions.length;
  let fullTxt = typewriterOptions[i];

  if (isDeleting) {
    typewriterText = fullTxt.substring(0, typewriterText.length - 1);
  } else {
    typewriterText = fullTxt.substring(0, typewriterText.length + 1);
  }

  element.innerHTML = '<span class="wrap">'+typewriterText+'</span>';

  let that = this;
  let delta = 200 - Math.random() * 100;

  if (isDeleting) { delta /= 2; }

  if (!isDeleting && typewriterText === fullTxt) {
    delta = period;
    isDeleting = true;
  } else if (isDeleting && typewriterText === 'I like to') {
    isDeleting = false;
    loopNum++;
    delta = 1000;
  }

  if(isDeleting) {
    if(doBackSpace)
    {
      setTimeout(function() {
        that.tick(element, doBackSpace, typewriterOptions);
      }, delta);
    }
  }
  else {
    setTimeout(function() {
      that.tick(element, doBackSpace, typewriterOptions);
    }, delta);
  }
}

function startTypewriter() {

  setTimeout(function() {
    let css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = `.typewriter1 ~ .wrap {
                        border-right: 0.08em solid lightgray;
                        animation: blink 0.75s step-end infinite;
                        -webkit-animation: blink 0.75s step-end infinite;
                        -moz-animation: blink 0.75s step-end infinite;
                        -o-animation: blink 0.75s step-end infinite;
                      }
                      @keyframes blink { 50% {border-right: 0.08em solid transparent}}
                      @-webkit-keyframes blink { 50% {border-right: 0.08em solid transparent}}
                      @-moz-keyframes blink { 50% {border-right: 0.08em solid transparent}}
                      @-o-keyframes blink { 50% {border-right: 0.08em solid transparent}}`;
    document.body.appendChild(css);
    let mainHeadingElement = document.querySelector('.typewriter1');
    tick(mainHeadingElement, false, [ "Hi, I'm Trevor." ]);
    // document.querySelector('#wrap1').style["border-right"] = "initial";
  }, 2000);

  setTimeout(function() {
    let css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = `.typewriter2 ~ .wrap {
                        border-right: 0.08em solid lightgray;
                        animation: blink 0.75s step-end infinite;
                        -webkit-animation: blink 0.75s step-end infinite;
                        -moz-animation: blink 0.75s step-end infinite;
                        -o-animation: blink 0.75s step-end infinite;
                      }
                      .typewriter1 ~ .wrap {
                        border-right: initial;
                        animation: initial;
                        -webkit-animation: initial;
                        -moz-animation: initial;
                        -o-animation: initial;
                      }`;
    document.body.appendChild(css);
    loopNum = 0;
    isDeleting = false;
    typewriterText = '';
    let subheadingElement = document.querySelector('.typewriter2');
    let options = [
      'I like to create.',
      'I like to code.',
      'I like to produce.',
      'I like to brainstorm.',
      'I like to collaborate.'
    ];
    tick(subheadingElement, true, options);
  }, 5000);
}
