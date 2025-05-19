document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.project-demo-card').forEach(btn => {
    btn.style.transition = 'all 0.4s ease';

    btn.addEventListener('mouseenter', () => {
      if (btn._isAnimating) return;
      btn._isAnimating = true;

      // 1) measure viewport‐relative rect, then convert to document coords
      const rect    = btn.getBoundingClientRect();
      const scrollY = window.pageYOffset;
      const scrollX = window.pageXOffset;
      const docTop  = rect.top  + scrollY;
      const docLeft = rect.left + scrollX;

      // 2) insert placeholder to hold layout
      const placeholder = document.createElement('div');
      placeholder.style.width   = rect.width  + 'px';
      placeholder.style.height  = rect.height + 'px';
      placeholder.style.display = 'inline-block';
      btn.parentNode.replaceChild(placeholder, btn);

      // 3) reparent into <body> and seed absolute‐position at doc coords
      document.body.appendChild(btn);
      Object.assign(btn.style, {
        position: 'absolute',
        top:      docTop    + 'px',
        left:     docLeft   + 'px',
        width:    rect.width + 'px',
        height:   rect.height+ 'px',
        margin:   '0',
        zIndex:   '998',
      });

      // 4) next frame → animate to smaller full-screen (60vw×60vh @ 20% gutters)
      requestAnimationFrame(() => {
        Object.assign(btn.style, {
          top:           '20vh',      // 20% from top of viewport
          left:          '20vw',      // 20% from left
          width:         '60vw',      // 60% of viewport width
          height:        '60vh',      // 60% of viewport height
          padding:       '2rem',
          borderRadius:  '12px',
          boxShadow:     '0 12px 40px rgba(0,0,0,0.15)',
          background:    '#fafafa',
        });
      });

      // 5) on mouseleave → reverse, then restore original spot
      btn.addEventListener('mouseleave', function _back() {
        btn.removeEventListener('mouseleave', _back);

        // animate back to original document position & size
        Object.assign(btn.style, {
          top:           docTop    + 'px',
          left:          docLeft   + 'px',
          width:         rect.width + 'px',
          height:        rect.height+ 'px',
          padding:       '',
          borderRadius:  '',
          boxShadow:     '',
          background:    '',
        });

        // cleanup after the 'top' transition ends
        btn.addEventListener('transitionend', function _cleanup(e) {
          if (e.propertyName !== 'top') return;
          btn.removeEventListener('transitionend', _cleanup);
          placeholder.parentNode.replaceChild(btn, placeholder);
          ['position','top','left','width','height','zIndex'].forEach(prop => btn.style[prop] = '');
          btn._isAnimating = false;
        });
      });
    });
  });
});
