// var fishBrain = null;
// var manNode= null;
// var machineNode= null;
// var materialNode= null;
// var methodNode = null;
// var environmentNode= null;
// var measureNode= null; 
//$(document).ready(function(){
//	 drawing();
// });
//
//function drawing(){
	//文本换行函数
	CanvasRenderingContext2D.prototype.wrapText = function(str,x,y){
	    var textArray = str.split('\n');
	    if(textArray==undefined||textArray==null)return false;

	    var rowCnt = textArray.length;
	    var i = 0,imax  = rowCnt,maxLength = 0;maxText = textArray[0];
	    for(;i<imax;i++){
	        var nowText = textArray[i],textLength = nowText.length;
	        if(textLength >=maxLength){
	            maxLength = textLength;
	            maxText = nowText;
	        }
	    }
	    var maxWidth = this.measureText(maxText).width;
	    var lineHeight = this.measureText("元").width;
	    x-= lineHeight*2;
	    for(var j= 0;j<textArray.length;j++){
	        var words = textArray[j];
	        this.fillText(words,-(maxWidth/2),y-textArray.length*lineHeight/2);
	        y+= lineHeight;
	    }
	};
	//定义画布、舞台以及场景
var canvas = document.getElementById('canvas');//获取画布id

var stage = new JTopo.Stage(canvas);//在画布上新建舞台
var scene = new JTopo.Scene(stage);//将舞台添加到场景中
scene.background = './images/background.jpg';//设置背景图片

//绘制鱼头
var fishBrain = new JTopo.Node();
fishBrain.text = '待解决问题';// 文字
fishBrain.id = "10";
fishBrain.textPosition = 'Middle_Center';// 文字居中
fishBrain.textOffsetY =-8;
fishBrain.font = '18px 微软雅黑';// 字体
fishBrain.fontColor = "0,0,0";
fishBrain.setLocation(800, 215);// 位置
fishBrain.setSize(180, 60);// 尺寸
fishBrain.borderRadius = 10;// 圆角
fishBrain.borderWidth = 2;// 边框的宽度
fishBrain.fillColor = '255,222,173';//边框颜色
// fishBrain.dragable = false;
fishBrain.layout = {type: 'tree'}
scene.add(fishBrain);
var aa = fishBrain.getBound();
console.log(aa);

/**
 * 绘制鱼身函数
 */
function mainBone(mainNode){
    var link = new JTopo.Link(fishBrain, mainNode);
    link.lineWidth = 3;
    link.strokeColor = '0,0,0';
    scene.add(link);
    return link;
}

/**
 * 定义六个主骨的位置
 */
function IniLine(Node, x2, y2, text){

    //定义六个相关节点的信息
    var subNode = new JTopo.Node();
    if (y2>245){
        subNode.setLocation(x2+100, y2-198);
        subNode.rotate = -1.2;
    }else{
        subNode.setLocation(x2+92, y2+198);
        subNode.rotate = 1.15;
    }
    subNode.text = text;// 文字
    subNode.textPosition = 'Middle_Center';// 文字居中
    subNode.textOffsetY =-8;
    subNode.font = '16px 微软雅黑';// 字体
    subNode.fontColor = "0,0,0";
    subNode.setSize(80, 30);// 尺寸
    subNode.borderRadius = 10;// 圆角
    subNode.borderWidth = 2;// 边框的宽度
    subNode.fillColor = '0,191,255';//填充颜色
    // subNode.dragable = false;
    scene.add(subNode);
    //连线
    if(y2<245){
        var link = new JTopo.FlexionalLink(Node, subNode,null,[0, 0, 0, 0, 0, 0, 0, 0]);
    }else{
        link = new JTopo.FlexionalLink(Node, subNode,null,[0, 0, 0, 0, 0, 0, 0, 0]);
    }
    link.direction = 'horizontal' || 'horizontal';
    link.lineWidth = 1;
    link.strokeColor = '0,0,0';
    scene.add(link);
    return link;
}
//人员
var manNode = new JTopo.Node(); 
manNode.id = "人员";
manNode.setLocation(117, 245);
manNode.setSize(1, 1);
manNode.layout = {type: 'tree'}
scene.add(manNode);
mainBone(manNode);

//机器
var machineNode = new JTopo.Node();
machineNode.id = "机器";
machineNode.setLocation(241, 245);
machineNode.setSize(1, 1);
machineNode.layout = {type: 'tree'}
scene.add(machineNode);
mainBone(machineNode);

//材料
var materialNode = new JTopo.Node();
materialNode.id = "材料";
materialNode.setLocation(367, 245);
materialNode.setSize(1, 1);
materialNode.layout = {type: 'tree'}
scene.add(materialNode);
mainBone(materialNode);

//方法
var methodNode = new JTopo.Node();
methodNode.id = "方法";
methodNode.setLocation(491, 245);
methodNode.setSize(1, 1);
methodNode.layout = {type: 'tree'}
scene.add(methodNode);
mainBone(methodNode);

//环境
var environmentNode = new JTopo.Node();
environmentNode.id = "环境";
environmentNode.setLocation(617, 245);
environmentNode.setSize(1, 1);
environmentNode.layout = {type: 'tree'}
scene.add(environmentNode);
mainBone(environmentNode);

//测量
var measureNode = new JTopo.Node();
measureNode.id = "测量";
measureNode.setLocation(741, 245);
measureNode.setSize(1, 1);
measureNode.layout = {type: 'tree'}
scene.add(measureNode);
mainBone(measureNode);

iniLineMan = IniLine(manNode, -20, 470, "人 员");
iniLineMachine = IniLine(machineNode, 110, -10, "机 器");
iniLineMaterial = IniLine(materialNode, 230, 470, "材 料");
iniLineMethod = IniLine(methodNode, 360, -10, "方 法");
iniLineEnvironment = IniLine(environmentNode, 480, 470, "环 境");
iniLineMeasure = IniLine(measureNode, 610, -10, "测 量");