window.onload = function()
{
  var canvases = document.getElementsByClassName("xeye");
  var ctxs = [].slice.call(canvases) // jesus christ..
      .map(function(canvas)
           {
             var ctx = canvas.getContext('2d');
             draw_xeye(ctx, XGetOrigin(ctx));
             return ctx;
           });

  document.addEventListener(
    'mousemove',
    function(e)
    {
      var mouse = XQueryPointer(e);
      ctxs.forEach(function(ctx) { draw_xeye(ctx, mouse); });
    });
};

function XQueryPointer(e)
{
  return { x: e.pageX, y: e.pageY };
}

function XGetOrigin(ctx)
{
  return {
    x: ctx.canvas.width / 2,
    y: ctx.canvas.height / 2,
  };
}

function XSetForeground(ctx, fill, stroke)
{
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 8;
}

function XTranslateCoordinates(ctx, coords)
{
  var rect = ctx.canvas.getBoundingClientRect();
  return {
    x: coords.x - rect.left,
    y: coords.y - rect.top,
  };
}

function Tx(coords, origin)
{
  return {
    x: coords.x - origin.x,
    y: origin.y - coords.y,
  };
}

function Tr(coords, origin)
{
  return {
    x: coords.x + origin.x,
    y: origin.y + coords.y
  };
}

function draw_xeye(ctx, mouse)
{
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  draw_xoutline(ctx);
  draw_xpupil(ctx, mouse);
}

function draw_xpupil(ctx, mouse)
{
  var width  = 6;
  var height = 9;

  ctx.save();
  ctx.beginPath();

  var coords = calculate_xpupil(ctx, mouse);
  ctx.ellipse(coords.x, coords.y, width, height, 0, 0, 2 * Math.PI);
  ctx.fill();

  ctx.closePath();
  ctx.restore();
}

function calculate_xpupil(ctx, mouse)
{
  var width  = ctx.canvas.width;
  var height = ctx.canvas.height;
  var origin = XGetOrigin(ctx);

  var c = Tx(XTranslateCoordinates(ctx, mouse), origin);

  var a = width / 4;
  var b = height / 3.5;

  var rad = Math.atan2(c.y, c.x);
  var x = a * Math.cos(rad);
  var y = b * Math.sin(rad);

  var xx = Math.abs(c.x) > Math.abs(x) ? x : c.x;
  var yy = Math.abs(c.y) > Math.abs(y) ? -y : -c.y;

  return Tr({ x: xx, y: yy }, origin);
}

function draw_xoutline(ctx)
{
  ctx.save();

  var cx = ctx.canvas.width / 2;
  var cy = ctx.canvas.height / 2;

  XSetForeground(ctx, "white", "black");

  ctx.beginPath();

  ctx.ellipse(cx, cy, cx-4, cy-4, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();

  ctx.closePath();
  ctx.restore();
}
