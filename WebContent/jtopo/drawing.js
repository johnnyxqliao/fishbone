
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
    drawSecThirClaNode ("测量",  bigMeasure);
    drawSecThirClaNode ("环境",  bigEnvironment);
    drawSecThirClaNode ("方法",  bigMethod);
    drawSecThirClaNode ("材料",  bigMaterial);
    drawSecThirClaNode ("机器",  bigMachine);
    drawSecThirClaNode ("人员",  bigMan);
    
    $.fn.zTree.init($("#treeDemo"), setting, zNodes);
    
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
 * 画第二级和第三级函数
 */
//var storeArr = new Array();
function drawSecThirClaNode(str1, attriNode){
    var pointerArr = [0, 0];//定义一个指针
    var numArr = new Array();
    numArr[0] = 0;
    var materialPosition = searchLine(str1);
    pointerArr[0]=materialPosition[0]+1;
	pointerArr[1]=materialPosition[1]+1;
	var secClaNode = secondClassNodePosition(0, excelData[pointerArr[0]].split(",")[pointerArr[1]], attriNode);
	storeArr.push(secClaNode);
	storeArr.push(1);
	storeArr[1] = 0;//采用数组的方式存储每个节点以及每个节点的下一级子节点个数，并不断跟新
    for(t=materialPosition[0]+1; t<excelData.length;t++){
    	if(excelData[t].split(",")[1]!==""){
    		var mater_to_meth = t-materialPosition[0]-1;//定义材料和方法之间的距离，也就是确定材料的子元素个数
    		break;
    	}else{
    		mater_to_meth = excelData.length-materialPosition[0]-1;
    	}
    }
    for(var i=0; i<mater_to_meth; i++){
    	
    	var newPointer = pointerRenew(pointerArr, attriNode, secClaNode);
    	pointerArr = newPointer[0];
    	attriNode = newPointer[1];
    	secClaNode =  newPointer[2];
    	
    }
}

/**
 * 指针遍历函数
 */

function pointerRenew(curPointer, fontRootNode, pointerNode){
	
	var underRootNode = isNull([curPointer[0]+1, curPointer[1]]);//指针下方节点是否为空
	var slashRootNode = isNull([curPointer[0]+1, curPointer[1]+1]);//指针右下方节点是否为空
	
	if(underRootNode>1 && slashRootNode<2){//指针下方不为空
		var addNum = testNodeNum(fontRootNode);
		
		var secClaNode = secondClassNodePosition(storeArr[addNum+1], excelData[curPointer[0]+1].split(",")[curPointer[1]], fontRootNode);//将材料的第二级子元素添加到画布上
		storeArr[addNum+1] +=1;
		curPointer[0] = curPointer[0]+1;
        curPointer[1] = curPointer[1];
        return [curPointer, pointerNode, secClaNode];//返回更新后的指针，添加的节点以及上一级节点
	}else if(underRootNode<2 && slashRootNode>1){//指针右下角不为空
		var addNum = testNodeNum(pointerNode);
		
		var thirClaNode = thirdClassNodePosition(storeArr[addNum+1], excelData[curPointer[0]+1].split(",")[curPointer[1]+1], pointerNode);//将材料的第三级子元素添加到画布上
		storeArr[addNum+1] +=1;
		curPointer[0] = curPointer[0]+1;
        curPointer[1] = curPointer[1]+1;
        return [curPointer, pointerNode, thirClaNode];
	}else if(underRootNode<2 && slashRootNode<2){
		var addNum = testNodeNum(fontRootNode);
		
		for(var t=0; t<curPointer[1]; t++){//检测下一行非空的位置
			var newPosi = isNull([curPointer[0]+1, t]);
			if(newPosi>1){
				curPointer[0] = curPointer[0]+1;
			    curPointer[1] = t;
				break;
			}
		}
		var secClaNode = secondClassNodePosition(storeArr[addNum+1], excelData[curPointer[0]].split(",")[curPointer[1]], fontRootNode);//将材料的第二级子元素添加到画布上
		storeArr[addNum+1] +=1;
       
        return [curPointer, pointerNode, secClaNode];
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
    var criNum = num-4;
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
    return JTopo.layout.layoutNode(scene, layoutNode.setLocation(layoutNode.x-criNum*50, layoutNode.y), oldNode);
}

/**
 * 第二级节点的放置位置
 */

function secondClassNodePosition(i, str, attriNode){
    var tarNodex = attriNode.getBound().left;
    var tarNodey = attriNode.getBound().top;
    var id = attriNode.id;
    var up_level = (id==="机器")||(id==="方法")||(id==="测量");
    var down_level = (id==="人员")||(id==="材料")||(id==="环境");
    if(down_level){
    	if(i==0){
    		var x = tarNodex-20;
    	}else{
    		var x = tarNodex-(i)*35-20;
    	}
        var y = -2.5*x + tarNodey+2.5*tarNodex;
    }else if(up_level){
    	if(i==0){
    		var x = tarNodex-20;
    	}else{
    		var x = tarNodex-(i)*35-20;
    	}
        y = 2.5*x + tarNodey-2.5*tarNodex;
    }

    var id = str+i;
    var excelnode = excelNode(x-65, y, str, id);//画节点
    excelnode.layout = {type: 'tree'};
    if(y>350){
    	var lineLink = new JTopo.FlexionalLink(attriNode, excelnode, null, [-15, 0, -20, 0, -30, 10, 60, 10]);
    }else{
    	lineLink = new JTopo.FlexionalLink(attriNode, excelnode, null, [-15, 0, -20, 0, -30, -10, 55, -10]);
    }
    
    lineLink.direction = 'horizontal' || 'horizontal';
    scene.add(excelnode);
    scene.add(lineLink);
    return excelnode;
}

/**
 * 第三级节点放置位置
 */

function thirdClassNodePosition(num, str, parentNode){
    var childNode = new JTopo.Node(str);
    var x = parentNode.getBound().left;//获取当前节点的横纵坐标以及id信息
    var y = parentNode.getBound().top;
    if(y>350){//当前节点在鱼骨下方
        var coeff = y+2.5*x-20;
        if(x<270){//判断当前节点在下方的那个位置
            var xChild = (coeff-y)/2.5-50*num;
        }else if(270<x && x<510){
            xChild = (coeff-y)/2.5-50*num;
        }else{
            xChild = (coeff-y)/2.5-50*num;
        }
    }else{
        coeff = y-2.5*x-50;
        if(x<150){//判断当前节点在下方的那个位置
            xChild = (coeff-y)/(-2.5)-50*num;
        }else if(150<x && x<390){
            xChild = (coeff-y)/(-2.5)-50*num;
        }else{
            xChild = (coeff-y)/(-2.5)-50*num;
        }
    }
    
    if(y>350){
    	var yChild = y+50;
    }else{
    	var yChild = y-40;
    }
    childNode.id = str+num;
    childNode.setLocation(xChild, yChild);
    childNode.fontColor = "0,0,0";

    childNode.fillColor = "255,255,255";
    childNode.font = 'blod 14px 微软雅黑';
    // childNode.dragable = false;
    if(yChild>350){
        childNode.textOffsetY =-15;
        childNode.rotate = -1.4;
        var slashLink = new JTopo.FlexionalLink(parentNode, childNode, null, [10, 10, -10, 10, -23, 22, 0, -38]);
    }else{
        childNode.textOffsetY =-23;
        childNode.rotate = 1.4;
        slashLink = new JTopo.FlexionalLink(parentNode, childNode, null, [10, -10, -10, -10, -23, -22, -7, 32]);
    }

    childNode.setSize(40, 10);
    scene.add(childNode);

    slashLink.direction = 'horizontal' || 'horizontal';
    scene.add(slashLink);
    return childNode;
}

/**
 * 定义从excel中读取数据，并向画布中添加节点函数
 */

var currentNode = null;
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
    //定义从excel中导入节点的右键函数
    excelNode.addEventListener('mouseup', function(event){
        currentNode = this;
        handler(event);
    });
    stage.click(function(event){
        if(event.button == 0){
            $("#contextmenu").hide();
        }
    });
    return excelNode;
}

/**
 *右键添加子节点方法
 */

function addExcelNode(x, y, num) {
    var string = prompt("请添加原因", "");
    var str = lineFeed(string);
    console.log(str);
    var childNode = new JTopo.Node(str);

    if(y>220){//当前节点在鱼骨下方
        if(x<120){//判断当前节点在下方的那个位置
            var xChild = (520-y)/2.5-50*num;
        }else if(120<x && x<370){
            xChild = (1145-y)/2.5-50*num;
        }else{
            xChild = (1770-y)/2.5-50*num;
        }
    }else{
        if(x<245){//判断当前节点在下方的那个位置
            xChild = (-330.75-y)/(-2.5)-50*num;
        }else if(245<x && x<495){
            xChild = (-918.25-y)/(-2.5)-50*num;
        }else{
            xChild = (-1508.1-y)/(-2.5)-50*num;
        }
    }

    var yChild = y+35;
    childNode.setLocation(xChild, yChild);
    childNode.fontColor = "0,0,0";
    childNode.textOffsetY =-15;
    childNode.fillColor = "255,255,255";
    childNode.font = 'blod 14px 微软雅黑';
    childNode.dragable = false;
    if(y>220){
        childNode.rotate = -1.2;
    }else{
        childNode.rotate = 1.2;
    }

    childNode.setSize(40, 10);
    scene.add(childNode);
    var x1 = xChild+4;
    var y1 = yChild+20;
    if(y>220){
        var y2 = y1-55;
        var x2 = x1+0;
    }else{
        var y2 = y1-55;
        var x2 = x1-30;
    }
    var slashLink = new JTopo.FlexionalLink(currentNode, childNode, null, [10, 10, -10, 10, -10, 10, 2, -22]);
    slashLink.direction = 'horizontal' || 'horizontal';
    scene.add(slashLink);
    num += 1;

    //定义从excel中导入节点的右键函数
    childNode.addEventListener('mouseup', function(event){
        currentNode = this;
        handler(event);
    });
    stage.click(function(event){
        if(event.button == 0){
            $("#contextmenu").hide();
        }
    });
    return [x2, y2, num];
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
 *定义从excel中导出数据的连线函数
 */
function handler(event) {
    if (event.button == 2) {
        $("#contextmenu").css({
            top: event.pageY,
            left: event.pageX
        }).show();
    }
}
/**
 *右键删除节点函数
 */
function deleteNode(){
    scene.remove(currentNode);
    currentNode = null;
    $("#contextmenu").hide();
    console.log("删除节点");
}
/**
 *右键添加子节点函数
 */
var Node = new Array();
Node[0] = 0;
Node[1] = 0;
Node[2] = 0;
Node[3] = 0;
function addNode() {
    var num = 1;//初始化节点右键次数
    var len = Node.length;
    var left = currentNode.getBound().left;//获取当前节点的横纵坐标以及id信息
    var top = currentNode.getBound().top;
    var id = currentNode.getBound().id;

    //输出与该节点对应的num,即该记录该节点右键次数
    var idArray = new Array();
    for (var i=0; i<len; i+=4){
        idArray[i/4] = Node[i];
    }
    var numnode = idArray.indexOf(id);
    console.log(numnode);
    if(top>220){//当前节点在鱼骨下方
        if(numnode==-1){
            num = 1;
            Node.push(id);
            Node.push(num);
            if(left<120){//判断当前节点在下方的那个位置
                Node.push((520-top)/2.5-50+4);
            }else if(120<left && left<370){
                Node.push((1145-top)/2.5-50+4);
            }else{
                Node.push((1770-top)/2.5-50+4);
            }
            Node.push(top);
            numnode = len/4;
        }else{
            num = Node[numnode*4+1];
        }
    }else{//当前节点在鱼骨的上方
        if(numnode==-1){
            num = 1;
            Node.push(id);
            Node.push(num);
            if(left<245){//判断当前节点在上方的那个位置
                Node.push((-330.75-top)/(-2.5)-50+4);
            }else if(245<left && left<495){
                Node.push((-918.25-top)/(-2.5)-50+4);
            }else{
                Node.push((-1508.1-top)/(-2.5)-50+4);
            }
            Node.push(top);
            numnode = len/4;
        }else{
            num = Node[numnode*4+1];
        }
    }

    console.log("这是更新前的数组："+Node);
    var addNode = addExcelNode(left, top, num);

    //将每次选择的节点存放在一个数组中，用于判断当前一共添加了几个节点
    Node[numnode*4+1] = addNode[2];//更新num数值
    console.log("这是更新后的数组："+Node);
    currentNode = null;
    $("#contextmenu").hide();
}

/**
 *读取excel内容函数 的主函数入口
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
	
