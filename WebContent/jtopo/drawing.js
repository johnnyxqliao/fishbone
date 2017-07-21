
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


var zNodes =[
    { id:1, pId:0, name:"待解决问题", open:true},
    { id:11, pId:1, name:"人员", open:true},
    { id:12, pId:1, name:"机器", open:true},
    { id:13, pId:1, name:"材料", open:true},
    { id:14, pId:1, name:"方法", open:true},
    { id:15, pId:1, name:"环境", open:true},
    { id:16, pId:1, name:"测量", open:true}
];


var excelData = ["待解决问题,,,",
	",人员,,",
	",机器,,",
	",材料,,",
	",方法,,",
	",环境,,",
	",测量,,",
	",,,"];
var global_wb;
function process_wb(wb) {
    global_wb = wb;
    var output = to_csv(wb);
    excelData = output.split("\n");
    //将表格中获取的数据发送到前台界面
    fishBrain.text = excelData[2].split(",")[0];
    zNodes[0].name = fishBrain.text;
    
    
    var arr = [];
    excelData.forEach(function(value, index, array){
    	if(index>2){
    	var element = value.split(",");
    	arr.push(element);
    	}
    }, this);
    excelData = init(arr);

    cal(excelData.children[5], true, bigMeasure);
//    drawSecThirClaNode ("测量",  bigMeasure);
//    drawSecThirClaNode ("环境",  bigEnvironment);
//    drawSecThirClaNode ("方法",  bigMethod);
//    drawSecThirClaNode ("材料",  bigMaterial);
//    drawSecThirClaNode ("机器",  bigMachine);
//    drawSecThirClaNode ("人员",  bigMan);
    
    $.fn.zTree.init($("#treeDemo"), setting, zNodes);
    
}

/**
 * 遍历json
 */
var verX = 25;//斜节点补偿
var verY = 40;

var horiX = 50;//水平节点补偿
var horiY = 15;
function cal(jsonNode, direction, rootNode){
	if(jsonNode.children.length<1) return;
	var nextNode = null;

	jsonNode.children.forEach(function(value, index, array){

		if(direction){//水平放置
			if(value.children.length<1){
				
			}else{
				
			}

			value['x'] = horiX;//计算横坐标补偿
			value['y'] = horiY;
			var nextNode = drawHori(rootNode, value, direction);
		}else{//倾斜放置
			if(value.children.length<1){
                    value['x'] = verX;
				    value['y'] = verY;
				    var nextNode = drawVer(rootNode, value, direction, index);
			}else{
				value['x'] = verX;
			    value['y'] = verY;
			    var nextNode = drawVer(rootNode, value, direction, index);
			}
			
		}
		cal(value, !direction, nextNode);
	}, this);
}


/**
 * 绘制水平节点
 */
function drawHori(attriNode, curNode, direction){
	    var tarNodex = attriNode.getBound().left;
	    var tarNodey = attriNode.getBound().top;
	    var id = attriNode.id;
	    if(tarNodey>350){
	    	if(i==0){
	    		var x = tarNodex;
	    	}else{
	    		var x = tarNodex-(i)*20;
	    	}
	        var y = -2.5*x + tarNodey+2.5*tarNodex;
	    }else if(tarNodey<350){

	    	y = tarNodey-curNode.y;
	    	x = (y+2.5*tarNodex-tarNodey)/2.5;
	    }

	    var id = curNode.name;
	    var excelnode = excelNode(x-60, y, curNode.name, id);//画节点
	    excelnode.layout = {type: 'tree'};
	    
	    var lineLink = drawLine(direction, excelnode);//绘制线上方的横线
	    scene.add(excelnode);
	    scene.add(lineLink);
	    return excelnode;
}


/**
 * 绘制倾斜节点
 */
function drawVer(parentNode, curNode, direction, index){
    var childNode = new JTopo.Node(curNode.name);
    var x = parentNode.getBound().left;//获取当前节点的横纵坐标以及id信息
    var y = parentNode.getBound().top;
//计算横坐标
//    if(index==0){//第一次添加斜节点
    	xChild = x-curNode.x;

//    }else{
//    	xChild = x+30;
//    	yChild = y;
//    }
	//计算y坐标
    if(y>350){
	    var yChild = y+40;
    }else{
	     var yChild = y-curNode.y;
         } 

    childNode.id = curNode.name;
    childNode.setLocation(xChild, yChild);
    childNode.fontColor = "0,0,0";

    childNode.fillColor = "255,255,255";
    childNode.font = 'blod 16px 微软雅黑';
    if(yChild>350){
        childNode.textOffsetY =-15;
        childNode.rotate = -1.2;
        var slashLink = drawLine(direction, excelnode);//绘制线上方的横线
    }else{
        childNode.textOffsetY =-23;
        childNode.rotate = 1.2;
        var slashLink = drawLine(direction, childNode);//绘制线上方的横线
    }

    childNode.setSize(30, 10);
    scene.add(childNode);

    scene.add(slashLink);
    return childNode;
}
/**
 *偶数级添加子节点函数
 */
function evenClassNodePosition(attriNode, curNode, direction){
    var tarNodex = attriNode.getBound().left;
    var tarNodey = attriNode.getBound().top;
    var id = attriNode.id;
    if(tarNodey>350){
    	if(i==0){
    		var x = tarNodex;
    	}else{
    		var x = tarNodex-(i)*15;
    	}
        var y = -2.5*x + tarNodey+2.5*tarNodex;
    }else if(tarNodey<350){
    	y = tarNodey-curNode.y;
    	x = (y-tarNodey+2.5*tarNodex)/2.5;
    }

    
    
    var id = curNode.name;
    var excelnode = excelNode(x-55, y, curNode.name, id);//画节点
    excelnode.layout = {type: 'tree'};
    var lineLink = drawLine(direction, excelnode);//绘制线上方的横线
    
    scene.add(excelnode);
    scene.add(lineLink);
    return excelnode;
}

/**
 *奇数级添加子节点函数
 */
function oddClassNodePosition(parentNode, curNode){
    var childNode = new JTopo.Node(curNode.name);
    var x = parentNode.getBound().left;//获取当前节点的横纵坐标以及id信息
    var y = parentNode.getBound().top;
    if(y>350){//当前节点在鱼骨下方
        var coeff = y+2.5*x-20;
        xChild = (coeff-y)/2.5-50*num;
    }else{
        xChild = x-curNode.x+20;
        
    }
    
    if(y>350){
    	var yChild = y+40;
    }else{
    	var yChild = y-40;
    }
    childNode.id = curNode.name;
    childNode.setLocation(xChild+15, yChild);
    childNode.fontColor = "0,0,0";

    childNode.fillColor = "255,255,255";
    childNode.font = 'blod 14px 微软雅黑';
    // childNode.dragable = false;
    if(yChild>350){
        childNode.textOffsetY =-15;
        childNode.rotate = -1.2;
        var slashLink = new JTopo.FlexionalLink(parentNode, childNode, null, [10, 10, -10, 10, -23, 22, 0, -28]);
    }else{
        childNode.textOffsetY =-23;
        childNode.rotate = 1.2;
        slashLink = new JTopo.FlexionalLink(parentNode, childNode, null, [10, -10, -10, -10, -23, -22, 0, 32]);
    }

    childNode.setSize(30, 10);
    scene.add(childNode);

    slashLink.direction = 'horizontal' || 'horizontal';
    scene.add(slashLink);
    return childNode;
}

/**
 * 绘制文字上方或者下方线
 */
function drawLine(direction, lineNode){
	x = lineNode.getBound().left;
	y = lineNode.getBound().top;
	if(direction){//水平节点横线
		var lineNode1 = new JTopo.Node();
		var lineNode2 = new JTopo.Node();
		lineNode1.setLocation(x-15, y-5);
		lineNode2.setLocation(x+55, y-5);
		lineNode1.setSize(1, 1);
		lineNode2.setSize(1, 1);
		scene.add(lineNode2);
		scene.add(lineNode1);
	    var link = new JTopo.Link(lineNode1, lineNode2);
	    link.lineWidth = 2; // 线宽
	    scene.add(link);
	}else{
		var lineNode1 = new JTopo.Node();
		var lineNode2 = new JTopo.Node();
		lineNode1.setLocation(x-13, y-22);
		lineNode2.setLocation(x+10, y+32);
		lineNode1.setSize(1, 1);
		lineNode2.setSize(1, 1);
		scene.add(lineNode2);
		scene.add(lineNode1);
	    var link = new JTopo.Link(lineNode1, lineNode2);
	    link.lineWidth =2; // 线宽
	}
	return link;
}

/**
 * 新建树节点对象函数
 */
function newTreeNode(id, fontCla, name, num){
	var strId = null;
	var strpId = null;
	var nodePosi = null;
	for(i=0; i<zNodes.length; i++){
		if(zNodes[i].name === fontCla){
			strId = zNodes[i].id;
			strpId =zNodes[i].pId;
			nodePosi = i+1;
			break;
		};
	}
	if(num<0) num=0;
	var newTreeNode = {id:strId.toString()+id.toString(), pId:strId, name:name};
	zNodes.splice(nodePosi+id+num, 0 , newTreeNode);
}


/**
 * 遍历节点并向画布中添加元素
 */
function drawSecThirClaNode(str1, attriNode){
	
	var posiOffset = [0, 0];//位置补偿数组，存放节点补偿信息
	var update = []//存放最大长度
	var nodeArr = new Array();//建立一个存放节点信息数组
    var materialPosi = searchLine(str1);
    nodeArr.push([materialPosi[0], materialPosi[1], attriNode, null, 0, [0, 0]]);//将节点的基本信息存放在数组中（坐标、节点、添加子节点的个数以及当前节点的位置补偿）
    for(t=materialPosi[0]+1; t<excelData.length;t++){
    	if(excelData[t].split(",")[1]!==""){
    		var mater_to_meth = t-materialPosi[0]-1;//定义材料和方法之间的距离，也就是确定材料的子元素个数
    		break;
    	}else{
    		mater_to_meth = excelData.length-materialPosi[0]-1;
    	}
    } 
    for(var i=materialPosi[0]+1; i<mater_to_meth+materialPosi[0]; i++){
    	var len = excelData[i].split(",").length;
    	for(var j=0; j<len; j++){//寻找某一行不为空元素的位置,并将其添加到画布上
    		var nodeIsNull = isNull([i, j]);
    		var rootNode = null;
    		var curNode = null;
    		if(nodeIsNull>1){
    			
    			for(t=nodeArr.length-1; t>=0; t--){//从数组中检索当前节点的父节点(在数组中倒叙检索)
    				if(nodeArr[t][1]==j-1){
    					rootNode = nodeArr[t][2];
    					
        				if(j%2==0){//通过当前节点的列号，判断节点应该水平添加还是倾斜添加
        					if(j==2){//将第二级和偶数级的节点分开添加
    					          secClaNode = secondClassNodePosition(nodeArr[t][4], excelData[i].split(",")[j], rootNode, nodeArr[t][5]);//水平添加节点
    					          x = rootNode.getBound().left - secClaNode.getBound().left;
    				    		  y = rootNode.getBound().top - secClaNode.getBound().top;
    					          nodeArr[t][4] +=1;//添加当前节点添加次数跟新
    					          curNode = secClaNode;
        					}else{
    					        evenClaNode = evenClassNodePosition(nodeArr[t][4], excelData[i].split(",")[j], rootNode, nodeArr[t][5]);//水平添加节点
    					        x = rootNode.getBound().left - evenClaNode.getBound().left;
  				    		    y = rootNode.getBound().top - evenClaNode.getBound().top;
  					            nodeArr[t][4] +=1;//添加当前节点添加次数跟新
  					            curNode = evenClaNode;
        					}
        				}else{
        					if(j==3){//将第1级和奇数级的节点分开添加
    					        slashNode = thirdClassNodePosition(excelData[i].split(",")[j], rootNode, nodeArr[t][5]);//倾斜添加节点
    					        x = rootNode.getBound().left - slashNode.getBound().left;
  				    		    y = rootNode.getBound().top - slashNode.getBound().top;
    					        nodeArr[t][4] +=1;//添加当前节点添加次数跟新
  					            curNode = slashNode;

        					}else{
    					        slashNode = oddClassNodePosition(nodeArr[t][4], excelData[i].split(",")[j], rootNode, nodeArr[t][5]);//倾斜添加节点
    					        x = rootNode.getBound().left - slashNode.getBound().left;
  				    		    y = rootNode.getBound().top - slashNode.getBound().top;
    					        nodeArr[t][4] +=1;//添加当前节点添加次数跟新
    					        curNode = slashNode;
        					}
        				}
    					break;
    				}
    			}
    			nodeArr.push([i, j, curNode, rootNode, 0, [x, y]]);
    			recurNode(curNode, rootNode);
    			break;
    		}
    		
    	}
    }
/**
 * 寻找根节点
 */
function findRoot(curNode){
	for(p=0;p<nodeArr.length;p++){
		if(nodeArr[p][2]==curNode){
			for(q=0;q<nodeArr.length;q++){
				if(nodeArr[q][2]==nodeArr[p][3]){
					return nodeArr[q][5];
					break;
				}
			}
		}
	}
}
    
/**
 * 递归函数
 */
    function recurNode(curNode, rootNode){
    	
    	if(rootNode == null) return;
    	var nextNode = null;
    	for(m=0;m<nodeArr.length;m++){//将当前节点的根节点寻找下一级的子节点
    		if(nodeArr[m][2]==rootNode){
    			offSetx = rootNode.getBound().left - curNode.getBound().left+10;
    			offSety = rootNode.getBound().top - curNode.getBound().top+20;
//    			if(offSetx>nodeArr[m][5][0]){
    				nodeArr[m][5][0] += offSetx;
//    			}
//    			if(offSety>nodeArr[m][5][1]){
    				nodeArr[m][5][1] += offSety;
//    			}
    			nextNode = nodeArr[m][3];
    			break;
    		}
    	}
    	return recurNode(curNode, nextNode);
    }
}


/**
 * 检测节点添加次数
 */
function testNodeNum(testNode){
	var addNum = storeArr.indexOf(testNode);
	if(addNum<0){
		storeArr.push(testNode);
		storeArr.push(0);
		return storeArr.length-2;
	}else{
		return addNum;
	}
}

/**
 * 字符串判断是否为空
 */

function isNull(arr){
    var str = excelData[arr[0]].split(",")[arr[1]];
    var num = 1;
    var num1 = 1;
    if(str.length == 0){
        num = 0;
    }
    if(str.replace(/(^\s*)|(\s*$)/g, "").length ==0){
        num1 = 0;
    }
    return num+num1;
}

/**
 * 检索特定数据所在的行号和列号
 */

function searchLine(str) {
    for (var i = 0; i < excelData.length; i++) {
        var searchColumnNum = excelData[i].split(",").indexOf(str);
        if (searchColumnNum !== -1) {
            return [i, searchColumnNum];
        }
    }
}


/**
 * 主骨自适应函数
 */
function mainBoneAdaptSelf(num, upperBone){
    var criNum = num-120;
    if(criNum>0){
        if(upperBone.id==="测量"){
            layoutAdaptSelf(methodNode, criNum);
            layoutAdaptSelf(machineNode, criNum);
        }else if(upperBone.id==="环境"){
            layoutAdaptSelf(materialNode, criNum);
            layoutAdaptSelf(manNode, criNum);
        }else if(upperBone.id==="方法"){
            layoutAdaptSelf(machineNode, criNum);
        }else if(upperBone.id==="材料"){
            layoutAdaptSelf(manNode, criNum);
        }
    }
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
 * 第二级节点的放置位置
 */

function secondClassNodePosition(i, str, attriNode, posiOffset){
    var tarNodex = attriNode.getBound().left;
    var tarNodey = attriNode.getBound().top;
    var id = attriNode.id;
    if(tarNodey>350){
    	if(i==0){
    		var x = tarNodex;
    	}else{
    		var x = tarNodex-(i)*20;
    	}
        var y = -2.5*x + tarNodey+2.5*tarNodex;
    }else if(tarNodey<350){

    	y = tarNodey-posiOffset[1]-15;
    	x = (y+2.5*tarNodex-tarNodey)/2.5;
    }

    var id = str+i;
    var excelnode = excelNode(x-45, y, str, id);//画节点
    excelnode.layout = {type: 'tree'};
    if(y>350){
    	var lineLink = new JTopo.FlexionalLink(attriNode, excelnode, null, [-3, -43, -20, 0, -30, 10, 40, 10]);
    }else{
    	lineLink = new JTopo.FlexionalLink(attriNode, excelnode, null, [-3, 43, -20, 0, -30, -10, 33, -10]);
    }
    
    lineLink.direction = 'horizontal' || 'horizontal';
    scene.add(excelnode);
    scene.add(lineLink);
    return excelnode;
}

/**
 * 第三级节点放置位置
 */

function thirdClassNodePosition(str, parentNode, posiOffset){
    var childNode = new JTopo.Node(str);
    var x = parentNode.getBound().left;//获取当前节点的横纵坐标以及id信息
    var y = parentNode.getBound().top;
    
    //计算横坐标
    xChild = x-posiOffset[0]+10;
//    if(y>350){//当前节点在鱼骨下方
//        var coeff = y+2.5*x-20;
//        xChild = (coeff-y)/2.5-50*num;
//    }else{
//        coeff = y-2.5*x+180;
//        xChild = (coeff-y)/(-2.5)-50*num;
//    }
    
    //计算纵坐标
    if(y>350){
    	var yChild = y+40;
    }else{
    	var yChild = y-40;
    }
    childNode.id = str;
    childNode.setLocation(xChild+15, yChild);
    childNode.fontColor = "0,0,0";

    childNode.fillColor = "255,255,255";
    childNode.font = 'blod 14px 微软雅黑';
    // childNode.dragable = false;
    if(yChild>350){
        childNode.textOffsetY =-15;
        childNode.rotate = -1.2;
        var slashLink = new JTopo.FlexionalLink(parentNode, childNode, null, [10, 10, -10, 10, -23, 22, 0, -28]);
    }else{
        childNode.textOffsetY =-23;
        childNode.rotate = 1.2;
        slashLink = new JTopo.FlexionalLink(parentNode, childNode, null, [10, -10, -10, -10, -23, -22, 0, 32]);
    }

    childNode.setSize(30, 10);
    scene.add(childNode);

    slashLink.direction = 'horizontal' || 'horizontal';
    scene.add(slashLink);
    return childNode;
}


/**
 * 定义从excel中读取数据，并向画布中添加节点函数
 */
function excelNode(x, y, text, id){
    //定义导入节点的基本属性
    var excelNode = new JTopo.Node(text);
    excelNode.id = id;
    excelNode.setLocation(x, y);
    excelNode.textPosition = 'Middle_Center';
    excelNode.textOffsetY =-5;
    excelNode.fontColor = "0,0,0";
    excelNode.fillColor = "255,255,255";
    excelNode.font = '14px 微软雅黑';
    excelNode.setSize(50, 15);
    // excelNode.dragable = false;
    excelNode.borderWidth = 0.1;
    scene.add(excelNode);
   
    return excelNode;
}

/**
 * 超过四个节点换行函数
 */
function lineFeed(string){
    var lineFeed = string.split("");
    var length = lineFeed.length;
    var String = '';
    var count = 0;
    for (var i=0; i<length; i++){
        count +=1;
        String +=lineFeed[i];
        if(count%5==0){
            String +='\n';
        }
    }
    console.log(String);
    return String;
}


/**
 *读取excel内容函数的主函数入口
 */
var xlf = document.getElementById('xlf');
function handleFile(e) {
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

if (xlf.addEventListener)
    xlf.addEventListener('change', handleFile, false);
	
