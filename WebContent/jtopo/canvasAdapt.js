$(window).resize(resizeCanvas);
function resizeCanvas() {
var width = $(window).get(0).innerWidth;
var height = $(window).get(0).innerHeight;
$("#canvas").attr("width", width-190);
$("#canvas").attr("height", height-150);
$("#treeDemo").css("height", height-150);
}
resizeCanvas();