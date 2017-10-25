
/**
 *读取excel部分
 */
var X = XLSX;
var XW = {
    msg: 'xlsx',
    rABS: 'js/xlsxworker2.js'
};

var use_worker = typeof Worker !== 'undefined';

function ab2str(data) {
    var o = ""
        , l = 0
        , w = 10240;
    for (; l < data.byteLength / w; ++l)
        o += String.fromCharCode.apply(null, new Uint16Array(data.slice(l * w, l * w + w)));
    o += String.fromCharCode.apply(null, new Uint16Array(data.slice(l * w)));
    return o;
}

function s2ab(s) {
    var b = new ArrayBuffer(s.length * 2)
        , v = new Uint16Array(b);
    for (var i = 0; i != s.length; ++i)
        v[i] = s.charCodeAt(i);
    return [v, b];
}

function xw_xfer(data, cb) {
    var worker = new Worker(rABS ? XW.rABS : XW.norABS);
    worker.onmessage = function(e) {
        switch (e.data.t) {
            case 'ready':
                break;
            case 'e':
                console.error(e.data.d);
                break;
            default:
                xx = ab2str(e.data).replace(/\n/g, "\\n").replace(/\r/g, "\\r");
                cb(JSON.parse(xx));
                break;
        }
    }
    ;
    if (rABS) {
        var val = s2ab(data);
        worker.postMessage(val[1], [val[1]]);
    } else {
        worker.postMessage(data, [data]);
    }
}

function xw(data, cb) {
    transferable = true;
    if (transferable)
        xw_xfer(data, cb);
    else
        xw_noxfer(data, cb);
}

function to_csv(workbook) {
    var result = [];
    workbook.SheetNames.forEach(function(sheetName) {
        var csv = X.utils.sheet_to_csv(workbook.Sheets[sheetName]);
        if(csv.length > 0){
            result.push("SHEET: " + sheetName);
            result.push("");
            result.push(csv);
        }
    });
    return result.join("\n");
}

var baseData = ["SHEET: Sheet1","","待解决问题,",",人员"
	         ,",机器",",材料",",方法",",环境",",测量",""];
var zNodes =init(baseData);
zNodes['open'] = true;
zNodes =[zNodes];
zNodes[0].children.splice(6,1);
var excelData = zNodes[0];

var global_wb;
var exportData = baseData;
function process_wb(wb) {//数据转换
    global_wb = wb;
    var output = to_csv(wb);
    excelData = output.split("\n");
    exportData = excelData;//用于导出文件
	//将表格中获取的数据发送到前台界面
    excelData = init(excelData);
    excelData['open'] = true;
	zNodes =[excelData];
	zNodes[0].children.splice(6,1);
	$.fn.zTree.init($("#treeDemo"), setting, zNodes);
}

/*
 * 绘制鱼骨图
 */
function drawFishBone(){
	fishBrain.text = excelData.name;
    fishBrain.setSize(fishBrain.text.split('').length*20, 60);// 尺寸
	var nodeArr = [bigMeasure, bigMethod, bigMachine, bigEnvironment, bigMaterial, bigMan];
	for(var i=0;i<nodeArr.length;i++){
		excelData.children.forEach(function(value,index,array){
			if(nodeArr[i].text===value.name){
				value['node'] = nodeArr[i];
				cal(value, true, value.node);
				mainBoneAdaptSelf(value.children, value.name);
			}
		},this)
	}
	selfAdapt();//根节点补偿
	setCenter();//绘制完成之后居中
}

/*
 * 更新根节点位置
 */

function selfAdapt(){
	[measureNode,environmentNode,methodNode,materialNode,machineNode,manNode].forEach(function(element,index,array){
	layoutAdaptSelf(element, 22);
},this)
}

/**
 * 遍历json
 */
var verX = 40;//斜节点所占补偿矩形的长和宽
var verY = 50;

var horiX = 15;//水平节点所占补偿矩形的长和宽
var horiY = 40;

function cal(jsonNode, direction, rootNode){
	jsonNode.children.forEach(function(value, index, array){
		value = addNull(value);//在每个子节点后面添加标识元素
		if(direction){//水平放置
			rootNode = drawHori(rootNode, value, direction, index);
			value['node'] = rootNode;
			if(value.children.length<1){//水平节点最后一层
				rootNode = value.node;
			}
			if(array.length===(index+1)){
				var horiNodeOffset = nodeOffset(array, direction);//当前层对下一层的补偿
				value.parent.node.endx += horiNodeOffset[0];
				value.parent.node.endy += horiNodeOffset[1];
			}
		}else{//倾斜放置
			rootNode = drawVer(rootNode, value, direction, index);
			value['node'] = rootNode;
			if(value.children.length<1){//斜节点最后一层
				rootNode = value.node;
			}
			if(array.length===(index+1)){
				var veriNodeOffset = nodeOffset(array, direction);//当前层对下一层的补偿
				value.parent.node.endx += veriNodeOffset[0];
				value.parent.node.endy += veriNodeOffset[1];
			}
		}
		cal(value, !direction, rootNode);
	}, this);
}

/**
 * 绘制水平节点
 */
var textHoriNode = 15;
function drawHori(attriNode, curNode, direction, index){
	var textLen = equalLen(attriNode.text);//计算文本补偿
    textOffset =0;
    if (textLen>5) var textOffset = textLen*10;
    var tarNodex = attriNode.getBound().left;
    var tarNodey = attriNode.getBound().top;
	    //计算横纵坐标
	    if(tarNodey<350){//在鱼骨上方
	    	if(index==0){//首次添加水平节点，横纵坐标直接由目标节点位置确定
	    		var x = tarNodex-textOffset*0.34-72;
	    		var y = tarNodey-textOffset*0.94-72*9/25;
	    	}else{//正常添加水平节点，按照水平节点矩形补偿进行添加
	    		var x = tarNodex-attriNode.endy*9/25;//水平节点的横坐标比上一级小固定值
	    		var y = tarNodey-attriNode.endy;
	    	}
	    }else{//在鱼骨下方
	    	if(index==0){//首次添加水平节点，横纵坐标直接由目标节点位置确定
	    		var x = tarNodex-textOffset*0.34-72;
	    		var y = tarNodey+textOffset*0.94+72*9/25;
	    	}else{//正常添加水平节点，按照水平节/点矩形补偿进行添加
	    		var x = tarNodex-attriNode.endy*9/25;//水平节点的横坐标比上一级小固定值
	    		var y = tarNodey+attriNode.endy;
	    	}
	    }
	    	
	    var id = curNode.name;
	    var excelnode = excelNode(x, y, curNode.name, id);//画节点
	    if(curNode.name==='/n**'){
	    	excelnode['endx'] = 0;//计算横坐标补偿
		    excelnode['endy'] = 0;
	    }else{
	    	excelnode['endx'] = horiX;//计算横坐标补偿
	        excelnode['endy'] = horiY;
	    }
	    
	    var lineLink = drawHoriLine(attriNode, excelnode, index);//绘制线上方的横线
	    if(curNode.name==='/n**'){
	    	excelnode.visible=false;
	    	lineLink.alpha=0;
	    }
	    	scene.add(excelnode);
	        scene.add(lineLink);
	    return excelnode;
}

/**
 * 绘制倾斜节点
 */
var textVerNode = 15;
function drawVer(parentNode, curNode, direction, index){
	var textLen = equalLen(parentNode.text);//计算文本长度对节点位置的补偿
	var textOffset = 0;
	if(textLen>5) textOffset = (textLen-5)*20;
	
    var childNode = new JTopo.Node(curNode.name);
    var x = parentNode.getBound().left;//获取当前节点的横纵坐标以及id信息
    var y = parentNode.getBound().top;
    
    if(y<350){//鱼骨上方
    	if(index==0){
    		var xChild = x-30-textOffset;
    		var yChild = y-40;//首次添加斜节点，直接由根节点确定水平节点放置位置
    	}else{
    		var xChild = x-parentNode.endx;
    		var yChild = y;//正常添加斜节点
    	}
    }else{//鱼骨下方
    	if(index==0){
    		var xChild = x-30-textOffset;
    		var yChild = y+40;//首次添加斜节点，直接由根节点确定水平节点放置位置
    	}else{
    		var xChild = x-parentNode.endx;
    		var yChild = y;//正常添加斜节点
    	}
    }

    	if(curNode.name==='/n**'){
    		childNode['endx'] = 0;//计算横坐标补偿
        	childNode['endy'] = 0;
    	}else{
    		childNode['endx'] = verX;//计算横坐标补偿
    	    childNode['endy'] = verY;
    	}
    	
    childNode.id = curNode.name;
    childNode.setLocation(xChild, yChild);
    childNode.fontColor = "0,0,0";
    
    childNode.fillColor = "255,255,255";
    childNode.font = '14px 微软雅黑';
    childNode.dragable = false;
    
    
    if(yChild>350){
        childNode.textOffsetY =-15;
        childNode.rotate = -1.2;
        childNode.textPosition = 'Bottom_Left';
        var slashLink = drawVerLine(parentNode, childNode, index);//绘制线上方的横线
    }else{
        childNode.textOffsetY =-13;
        childNode.rotate = -1.95;
        childNode.textPosition = 'Bottom_Right';
        var slashLink = drawVerLine(parentNode, childNode, index);//绘制线上方的横线
    }

    childNode.setSize(30, 10);
    if(curNode.name==='/n**'){
    	childNode.visible=false;
    	slashLink.alpha=0;
    }
    
    scene.add(childNode);
    scene.add(slashLink);
    return childNode;
}
/*
 * 绘制水平节点连线
 */
function drawHoriLine(rootNode, subNode, index){
	
	var rootTextLen = equalLen(rootNode.text);
	var subTextLen = equalLen(subNode.text);
	subTextLen = (subTextLen>5?subTextLen:0);
	rootTextLen = (rootTextLen>5?rootTextLen:0);
	if(rootNode.getBound().top<350){
		if(index==0){
		var lineLink = new JTopo.FlexionalLink(rootNode, subNode, null, [0, 30, 0, 30,
			                                                              -35-subTextLen*10, -12.5, 34.5, -12.5]);
	}else{
		var lineLink = new JTopo.FlexionalLink(rootNode, subNode, null, [34.5, -12.5, 34.5, -12.5, 
			                                                              -34.5-subTextLen*10, -12.5, 34.5, -12.5]);
	}
	}else{
		if(index==0){
			var lineLink = new JTopo.FlexionalLink(rootNode, subNode, null, [-23, 25, -23, 25,
				                                                              -35-subTextLen*10, 12.5, 34, 12.5]);
		}else{
			var lineLink = new JTopo.FlexionalLink(rootNode, subNode, null, [35, 12.5, 34, 12.5, 
				                                                              -35-subTextLen*10, 12.5, 34, 12.5]);
		}
	}
	
	lineLink.direction = 'horizontal' || 'horizontal';
	return lineLink;
}

/*
 * 绘制倾斜节点连线
 */
function drawVerLine(rootNode, subNode, index){
	var rootTextLen = equalLen(rootNode.text);
	var subTextLen = equalLen(subNode.text);
	subTextLen = (subTextLen>5?subTextLen:0);
	rootTextLen = (rootTextLen>5?rootTextLen:0);
	if(rootNode.getBound().top<350){//鱼骨上方
		if(index==0){//首次添加斜节点
		var slashLink = new JTopo.FlexionalLink(rootNode, subNode, null, [20, -12.5, -40, -12.5,
			                                                               -16.8-subTextLen*12*0.34, -10-subTextLen*12*0.94, 0, 30]);
	}else{//正常添加斜节点
		var slashLink = new JTopo.FlexionalLink(rootNode, subNode, null, [0, 30, 0, 30, 
			                                                               -23-subTextLen*12*0.34, -25-subTextLen*12*0.94, 0, 30]);
	}
	}else{//鱼骨下方
		if(index==0){//首次添加斜节点
			var slashLink = new JTopo.FlexionalLink(rootNode, subNode, null, [20, 12.5, -45, 12.5,
				                                                             -20-subTextLen*12*0.34, 16.7+subTextLen*12*0.94,-5, -25]);
		}else{//正常添加斜节点
			var slashLink = new JTopo.FlexionalLink(rootNode, subNode, null, [-23, 25, -5, -25, 
				                                                               -23-subTextLen*12*0.34, 25+subTextLen*12*0.94, -5, -25]);
		}
	}
	slashLink.direction = 'horizontal' || 'horizontal';
	return slashLink;
}


/**
 * 计算当前层对下一层节点的补偿量
 */
function nodeOffset(nodeArray, direction){
	if(direction){//水平节点补偿
		sumHoriEndx = 0;
		sumHoriEndy = 0;
		var textHoriLen = 0;
		nodeArray.forEach(function(element,index,array){
			if(element.node.endx>sumHoriEndx){
				sumHoriEndx = element.node.endx;
			}
			sumHoriEndy += element.node.endy;
			if(element.name.split('').length>textHoriLen){
				textHoriLen = element.name.split('').length;
			}
		},this)
		sumHoriEndx = (sumHoriEndx>textHoriLen*20 ? sumHoriEndx:textHoriLen*20);
		return [sumHoriEndx+nodeArray.length*horiX, sumHoriEndy];
	}else{//斜节点补偿
		sumVeriEndx = 0;
		sumVeriEndy = 0;
		var textVeriLen = 0;
		nodeArray.forEach(function(element,index,array){
			sumVeriEndx += element.node.endx;
			if(element.node.endy>sumVeriEndy){
				sumVeriEndy = element.node.endy;
			}
			if(element.name.split('').length>textVeriLen){
				textVeriLen = element.name.split('').length;
			}
		},this)
		if(textVeriLen>5) sumVeriEndy += textVeriLen*10;
		return [sumVeriEndx, sumVeriEndy];
	}
}

/**
 * 子节点中添加标识元素
 */
function addNull(valueArr){
	var testValue = 0;
	if(valueArr.name!=="/n**"){
		valueArr.children.forEach(function(value,index,array){
		if(value.name==="/n**"){
			testValue=1;
		}
	},this)
	if(!testValue && valueArr.children.length>1){
		valueArr.children.push({name:'/n**' ,
			                    children:[] ,
			                    parent:valueArr})
	}
	}
	return valueArr;
}

/**
 * 主骨自适应函数
 */
function mainBoneAdaptSelf(childrenArr, upperBone){
	var selfOffset=0;
	var maxTextLen=0;
	for(var m=0;m<childrenArr.length;m++){
		if(childrenArr[m].node.endx>selfOffset){
			selfOffset = childrenArr[m].node.endx;
		}
		if(childrenArr[m].name.split('').length>maxTextLen){
			maxTextLen = childrenArr[m].name.split('').length;
			maxTextLen = (maxTextLen>5?maxTextLen:0);
		}
	}
	selfOffset +=maxTextLen*15;
	selfOffset -= 90;
        if(upperBone==="测量"){
            layoutAdaptSelf(methodNode, selfOffset);
            layoutAdaptSelf(machineNode, selfOffset);
        }else if(upperBone==="环境"){
            layoutAdaptSelf(materialNode, selfOffset);
            layoutAdaptSelf(manNode, selfOffset);
        }else if(upperBone==="方法"){
            layoutAdaptSelf(machineNode, selfOffset);
        }else if(upperBone==="材料"){
            layoutAdaptSelf(manNode, selfOffset);
        }
}

/*
 * 计算字符串等价长度
 */
function equalLen(str){
	var euqalLen=0;
	for(var len=0;len<str.length;len++){
		if(str.charCodeAt(len) > 255){
			euqalLen += 1;
		}else{
			euqalLen += 0.5;
		}
	}
	return euqalLen;
}

/**
 * 自适应布局函数
 */
function layoutAdaptSelf(layoutNode, criNum){
    var oldNode = {x:layoutNode.x,
        y:layoutNode.y};
    return JTopo.layout.layoutNode(scene, layoutNode.setLocation(layoutNode.x-criNum, layoutNode.y), oldNode);
}

/**
 * 定义从excel中读取数据，并向画布中添加节点函数
 */
function excelNode(x, y, text, id){
    //定义导入节点的基本属性
    var excelNode = new JTopo.Node(text);
    excelNode.id = id;
    excelNode.setLocation(x, y);
    excelNode.fontColor = "0,0,0";
    excelNode.fillColor = "255,255,255";
    excelNode.font = '14px 微软雅黑';
    excelNode.setSize(50, 15);
     excelNode.dragable = false;
    excelNode.borderWidth = 0.1;
    excelNode.textPosition = 'Middle_Right';
    scene.add(excelNode);
    return excelNode;
}


/**
 *读取excel内容函数的主函数入口
 */

function handleFile(e) {
	
	$("#canvas").remove();//删除当前画布
	   $("#canvasDiv").append("<canvas id='canvas' width=1000 height=600></canvas>");//新建画布
		//加载鱼骨图基础骨架
		var head = $("body").remove("script[role='reload']");  
		$("<scri" + "pt>" + "</scr" + "ipt>").attr({ role: 'reload', src: "jtopo/canvasAdapt.js", type: 'text/javascript' }).appendTo("body");
	   $("<scri" + "pt>" + "</scr" + "ipt>").attr({ role: 'reload', src: "jtopo/bone.js", type: 'text/javascript' }).appendTo("body"); 
	   
	  zNodes =init(baseData);
	  fishBrain.text = zNodes.name;
	  zNodes['open'] = true;
	  zNodes =[zNodes];
	  zNodes[0].children.splice(6,1);
	  excelData = zNodes[0];
	  $.fn.zTree.init($("#treeDemo"), setting, zNodes);
	  getId();// 重新获得ID
	  setCenter();//绘制完成之后居中
	  
    rABS = true;
    use_worker = true;
    var files = e.target.files;
    var f = files[0];
    {
        var reader = new FileReader();
        var name = f.name;
        reader.onload = function(e) {
            var data = e.target.result;
            if (use_worker) {
                xw(data, process_wb);
            } else {
                var wb;
                if (rABS) {
                    wb = X.read(data, {
                        type: 'binary'
                    });
                } else {
                    var arr = fixdata(data);
                    wb = X.read(btoa(arr), {
                        type: 'base64'
                    });
                }
                process_wb(wb);
            }
        }
        ;
        if (rABS)
            reader.readAsBinaryString(f);
        else
            reader.readAsArrayBuffer(f);
    }
}

function getId(){
	var xlf = document.getElementById('xlf');
if (xlf.addEventListener)
    xlf.addEventListener('change', handleFile, false);
}
getId();
	
