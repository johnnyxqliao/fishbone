
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
    	if(index>1){
    	var element = value.split(",");
    	arr.push(element);
    	}
    }, this);
    excelData = init(arr);

    cal(excelData.children[5], true, bigMeasure, [0,0]);
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
function cal(jsonNode, direction, rootNode, offset){
//	if(jsonNode.children.length<1) return;
	var nextNode = null;
	
	jsonNode.children.forEach(function(value, index, array){
		if(direction){//水平放置
			value['x'] = horiX+offset[0];//计算横坐标补偿
			value['y'] = horiY+offset[1];
			var nextNode = drawHori(rootNode, value, direction, index);
			if(array.length==index+1){//水平节点放置完成后，计算对下一级节点的补偿
				offset[0] = (index+1)*verX;
				offset[1] = verY;
			}
		}else{//倾斜放置
			 value['x'] = verX+offset[0];//计算横坐标补偿
			 value['y'] = verY+offset[1];
			 var nextNode = drawVer(rootNode, value, direction, index);
				if(array.length==index+1){//斜节点放置完成后，计算对下一级节点的补偿
					offset[0] = (index+1)*verX;
					offset[1] = verY;
				}
		}
		cal(value, !direction, nextNode, offset);

	}, this);
	offset = [0, 0];//每执行一次，将补偿归零
}


/**
 * 绘制水平节点
 */
function drawHori(attriNode, curNode, direction, index){
	    var tarNodex = attriNode.getBound().left;
	    var tarNodey = attriNode.getBound().top;
	    var id = attriNode.id;
	    //计算横纵坐标
	    	y = tarNodey-index*50-curNode.y;
	    	x = (y+2.5*tarNodex-tarNodey)/2.5;
	    	
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
//计算x坐标
    xChild = x-60*index-curNode.x;
//计算y坐标
    if(y>350){
	     var yChild = y+curNode.y;
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
	
