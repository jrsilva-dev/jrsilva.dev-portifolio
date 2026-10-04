(function () {
  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  var canvas = document.getElementById("bg-canvas");
  var ctx = canvas.getContext("2d");
  var W, H, DPR;
  var nodes = [];
  var NODE_COUNT = 46;
  var LINK_DIST = 130;

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function makeNodes() {
    nodes = [];
    for (var i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 1 + Math.random() * 1.6,
        baseR: 1 + Math.random() * 1.6,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        glow: Math.random(),
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0) n.x = W;
      if (n.x > W) n.x = 0;
      if (n.y < 0) n.y = H;
      if (n.y > H) n.y = 0;
    }

    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var a = nodes[i],
          b = nodes[j];
        var dx = a.x - b.x,
          dy = a.y - b.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          var alpha = (1 - dist / LINK_DIST) * 0.14;
          ctx.strokeStyle = "rgba(255,45,45," + alpha + ")";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var alpha = 0.25 + n.glow * 0.5;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,45,45," + alpha + ")";
      ctx.fill();
    }

    if (!reduceMotion) requestAnimationFrame(draw);
  }

  resize();
  makeNodes();
  window.addEventListener("resize", function () {
    resize();
    makeNodes();
  });

  if (!reduceMotion) {
    requestAnimationFrame(draw);

    anime({
      targets: nodes,
      r: function (el) {
        return el.baseR * 2.6;
      },
      glow: function () {
        return Math.random();
      },
      easing: "easeInOutSine",
      duration: function () {
        return 2200 + Math.random() * 1800;
      },
      delay: anime.stagger(40),
      direction: "alternate",
      loop: true,
    });
  } else {
    draw();
  }
})();
