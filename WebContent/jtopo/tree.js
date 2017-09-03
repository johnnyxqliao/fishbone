/**
 * 形成树状结构
 */

	var setting = {
	    view: {
	    	showLine: false,
			showIcon: false,
	        dblClickExpand: true
	    },
	    data: {
	        simpleData: {
	            enable:true
	        }
	    },
	    callback: {
			beforeExpand: beforeExpand,
			onExpand: onExpand,
	    }
	};
	
	
	var zTree, rMenu;
	$(document).ready(function(){
	    $.fn.zTree.init($("#treeDemo"), setting, zNodes);
	    zTree = $.fn.zTree.getZTreeObj("treeDemo");
	    setCenter();
	});
	
	
//单一路径展开	
	var curExpandNode = null;
	function beforeExpand(treeId, treeNode) {
		var pNode = curExpandNode ? curExpandNode.getParentNode():null;
		var treeNodeP = treeNode.parentTId ? treeNode.getParentNode():null;
		var zTree = $.fn.zTree.getZTreeObj("treeDemo");
		for(var i=0, l=!treeNodeP ? 0:treeNodeP.children.length; i<l; i++ ) {
			if (treeNode !== treeNodeP.children[i]) {
				zTree.expandNode(treeNodeP.children[i], false);
			}
		}
		while (pNode) {
			if (pNode === treeNode) {
				break;
			}
			pNode = pNode.getParentNode();
		}
		if (!pNode) {
			singlePath(treeNode);
		}

	}	
	
	function singlePath(newNode) {
		if (newNode === curExpandNode) return;

        var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
                rootNodes, tmpRoot, tmpTId, i, j, n;

        if (!curExpandNode) {
            tmpRoot = newNode;
            while (tmpRoot) {
                tmpTId = tmpRoot.tId;
                tmpRoot = tmpRoot.getParentNode();
            }
            rootNodes = zTree.getNodes();
            for (i=0, j=rootNodes.length; i<j; i++) {
                n = rootNodes[i];
                if (n.tId != tmpTId) {
                    zTree.expandNode(n, false);
                }
            }
        } else if (curExpandNode && curExpandNode.open) {
			if (newNode.parentTId === curExpandNode.parentTId) {
				zTree.expandNode(curExpandNode, false);
			} else {
				var newParents = [];
				while (newNode) {
					newNode = newNode.getParentNode();
					if (newNode === curExpandNode) {
						newParents = null;
						break;
					} else if (newNode) {
						newParents.push(newNode);
					}
				}
				if (newParents!=null) {
					var oldNode = curExpandNode;
					var oldParents = [];
					while (oldNode) {
						oldNode = oldNode.getParentNode();
						if (oldNode) {
							oldParents.push(oldNode);
						}
					}
					if (newParents.length>0) {
						zTree.expandNode(oldParents[Math.abs(oldParents.length-newParents.length)-1], false);
					} else {
						zTree.expandNode(oldParents[oldParents.length-1], false);
					}
				}
			}
		}
		curExpandNode = newNode;
	}
	
function onExpand(event, treeId, treeNode) {
		curExpandNode = treeNode;
	}

//冻结根节点函数
function dblClickExpand(treeId, treeNode) {
		return treeNode.level > 0;
	}

	var addCount = 1;
	function addTreeNode() {
	    var testNum0 = (zTree.getSelectedNodes()[0].tId=="treeDemo_1");//根节点
	    var testNum1 = (zTree.getSelectedNodes()[0].parentTId=="treeDemo_1");//第二级节点
		if(testNum0){
			$('#noAdd').modal();
		}else{
			var newNode = { name:"增加" + (addCount++)};
	    if (zTree.getSelectedNodes()[0]) {
	        newNode.checked = zTree.getSelectedNodes()[0].checked;
	        zTree.addNodes(zTree.getSelectedNodes()[0], newNode);
	    } else {
	        zTree.addNodes(null, newNode);
	    }
	    traverArr(excelData, zTree.getSelectedNodes()[0], 'add', newNode.name);
		}
	}
	
	function removeTreeNode() {
	    	var nodes = zTree.getSelectedNodes();
	    if (nodes && nodes.length>0) {
	            zTree.removeNode(nodes[0]);
	    }
	    traverArr(excelData, nodes[0], 'delete', null);
//	    }
	}

function chooseDelete(){
	var testNum0 = (zTree.getSelectedNodes()[0].tId=="treeDemo_1");//根节点
	var testNum1 = (zTree.getSelectedNodes()[0].parentTId=="treeDemo_1");//第二级节点
	if(testNum0 || testNum1){
		$('#noDelete').modal();
	}else{
		$('#confirmDelete').modal();
	}
}	
	
	function updateNode(postionJson){//更新节点-修改节点名称
		var testNum1 = (zTree.getSelectedNodes()[0].parentTId=="treeDemo_1");//第二级节点
		if(testNum1){
			$('#noEdit').modal();
		}else{
			 var nodes = zTree.getSelectedNodes();
	    var newName = window.prompt("输入新名称",nodes[0].name);
	    if(newName!=nodes[0].name && newName!=null && newName!=undefined){
	    	if(nodes[0].tId==="treeDemo_1"){
	    		excelData.name=newName;
	    	}else{
	    		traverArr(excelData, nodes[0], 'rename', newName);
	    	}
	    	
	        nodes[0].name = newName;
	        zTree.updateNode(nodes[0]);
	    }
		}
	}
	
/*
 * 遍历数组
 */
	function traverArr(excelData, curNode, edit, newName){
		excelData.children.forEach(function(element,index,array){
			if(edit==='delete'){//删除操作
				if(element.name===curNode.name){
					element.parent.children.splice(index, 1);
					return;
				}
			}else if(edit==='rename'){//重命名操作
				if(element.name===curNode.name){
					element.name=newName;
					return;
				}
			}else if(edit==='add'){//添加操作
				if(element.name===curNode.name){
					element.children.splice(element.children.length-1, 0, {name:newName,children:[],parent:element});
					return;
				}
			}
			traverArr(element, curNode, edit, newName);
		},this);
	}
	
	
/**
 *重新绘制图象
 */	
function redraw(){
    $("#canvas").remove();//删除当前画布
	$("#canvasDiv").append("<canvas id='canvas' width=500 height=500></canvas>");//新建画布
	//加载鱼骨图基础骨架
	var head = $("body").remove("script[role='reload']");  
	$("<scri" + "pt>" + "</scr" + "ipt>").attr({ role: 'reload', src: "jtopo/canvasAdapt.js", type: 'text/javascript' }).appendTo("body");
	$("<scri" + "pt>" + "</scr" + "ipt>").attr({ role: 'reload', src: "jtopo/bone.js", type: 'text/javascript' }).appendTo("body");
    //根据当前的数据重绘鱼骨图
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
	 $("#xlf").remove();
	 $("#chooseFile").append("<input type='file' name='xlfile' id='xlf'/>");//新建选择文件按钮
	 getId();
}

/*
 * 新建鱼骨图
 */
function newFishbone(){
   $("#canvas").remove();//删除当前画布
   $("#canvasDiv").append("<canvas id='canvas' width=500 height=500></canvas>");//新建画布
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
  $("#xlf").remove();
  $("#chooseFile").append("<input type='file' name='xlfile' id='xlf'/>");//新建画布
  getId();// 重新获得ID
  setCenter();//绘制完成之后居中
}
