/**
 * 形成树状结构
 */

	var setting = {
	    view: {
	        dblClickExpand: false
	    },
	    data: {
	        simpleData: {
	            enable: true
	        }
	    },
	    callback: {
			beforeExpand: beforeExpand,
			onExpand: onExpand,
	        onRightClick: OnRightClick
	    }
	};
	
	var zTree, rMenu;
	$(document).ready(function(){
	    $.fn.zTree.init($("#treeDemo"), setting, zNodes);
	    zTree = $.fn.zTree.getZTreeObj("treeDemo");
	    rMenu = $("#rMenu");
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

//定义右键属性
function OnRightClick(event, treeId, treeNode) {
	    if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
	        zTree.cancelSelectedNode();
	        showRMenu("root", event.clientX, event.clientY);
	    } else if (treeNode && !treeNode.noR) {
	        zTree.selectNode(treeNode);
	        showRMenu(treeNode, event.clientX, event.clientY);
	    }
	}

//右键展开菜单
function showRMenu(type, x, y) {
	    $("#rMenu ul").show();
	    var testNum0 = (type.id=="1");
	    var testNum1 = (type.id=="1"||type.id=="11"||type.id=="12"||type.id=="13"||type.id=="14"||type.id=="15"||type.id=="16");
	    if (testNum0) {
	        $("#m_del").hide();
	        $("#m_check").show();
	        $("#m_add").hide();
	    } else if(testNum1){
	        $("#m_del").hide();
	        $("#m_check").show();
	        $("#m_add").show();
	    }else{
	    	$("#m_del").show();
	        $("#m_check").show();
	        $("#m_add").show();
	    }
	    rMenu.css({"top":y+"px", "left":x+"px", "visibility":"visible"});

	    $("body").bind("mousedown", onBodyMouseDown);
	}

function onBodyMouseDown(event){
    if (!(event.target.id == "rMenu" || $(event.target).parents("#rMenu").length>0)) {
        rMenu.css({"visibility" : "hidden"});
    }
}
	
function hideRMenu() {
    if (rMenu) rMenu.css({"visibility": "hidden"});
    $("body").unbind("mousedown", onBodyMouseDown);
}
	
	
	var addCount = 1;
	function addTreeNode() {
	    hideRMenu();
	    var newNode = { name:"增加" + (addCount++)};
	    if (zTree.getSelectedNodes()[0]) {
	        newNode.checked = zTree.getSelectedNodes()[0].checked;
	        zTree.addNodes(zTree.getSelectedNodes()[0], newNode);
	    } else {
	        zTree.addNodes(null, newNode);
	    }
	    renewAddCsv(zTree.getSelectedNodes()[0], newNode.name);
	}
	
	function removeTreeNode() {
	    hideRMenu();
	    var nodes = zTree.getSelectedNodes();
	    if (nodes && nodes.length>0) {
	        if (nodes[0].children && nodes[0].children.length > 0) {
	            var msg = "要删除的节点是父节点，如果删除将连同子节点一起删掉。\n\n确认要删除！";
	            if (confirm(msg)==true){
	                zTree.removeNode(nodes[0]);
	            }
	        } else {
	            zTree.removeNode(nodes[0]);
	        }
	    }
	    renewDeleteCsv(nodes[0]);
	}

	function updateNode(postionJson){//更新节点-修改节点名称
	    var nodes = zTree.getSelectedNodes();
	    var newName = window.prompt("输入新名称",nodes[0].name);
	    if(newName!=nodes[0].name && newName!=null && newName!=undefined){
	    	renewModifyCsv(nodes[0], newName);
	        nodes[0].name = newName;
	        zTree.updateNode(nodes[0]);
	    }
	    hideRMenu();
	}

/**
 * 添加节点更新数组
 */
	function renewAddCsv(curNode, newName){
		var addNode = [];
		for(i=0; i<excelData.length; i++){
			var length = excelData[i].split(",").length;
			for(j=0; j<length; j++){
				if(excelData[i].split(",")[j] === curNode.name){
					for(m=0; m<length; m++){
						addNode[m] = "";//定义一个数组对象
					}
					addNode[j+1] = newName;
					excelData.splice(i+1, 0 ,addNode.join(","));
					break;
				}
			}
		}
	}
	
/**
 * 修改节点更新数组
 */	
	
	function renewModifyCsv(curNode, newName){
		var addNode = [];
		for(i=0; i<excelData.length; i++){
			var length = excelData[i].split(",").length;
					for(j=0; j<length; j++){
			if(excelData[i].split(",")[j] === curNode.name){
				for(m=0; m<length; m++){
					addNode[m] = "";//定义一个数组对象
				}
				addNode[j] = newName;
				excelData.splice(i, 1 ,addNode.join(","));
				break;
			}
					}
		}
	}

		

/**
 * 删除节点更新数组
 */		
	function renewDeleteCsv(curNode){
		for(i=0; i<excelData.length; i++){
			var length = excelData[i].split(",").length;
			for(j=0; j<length; j++){
				if(excelData[i].split(",")[j] === curNode.name){
					excelData.splice(i, curNode.children.length+1);
					break;
				}
			}
		}
	}
	
/**
 *重新绘制图象
 */	
function redraw(){
	 var msg = "重绘之后，将无法恢复之前的鱼骨图！！！\n\n确认要重绘！";
     if (confirm(msg)==true){
         $("#canvas").remove();//删除当前画布
	$("#canvasDiv").append("<canvas id='canvas' width=1000 height=600></canvas>");//新建画布
	//画布自适应屏幕
	$(window).resize(resizeCanvas);
	function resizeCanvas() {
	var width = $(window).get(0).innerWidth;
	var height = $(window).get(0).innerHeight;
	$("#canvas").attr("width", width-190);
	$("#canvas").attr("height", height);
	}
	resizeCanvas();
	
	var head = $("body").remove("script[role='reload']");  
    $("<scri" + "pt>" + "</scr" + "ipt>").attr({ role: 'reload', src: "jtopo/bone.js", type: 'text/javascript' }).appendTo("body"); 
    for(i=0; i<excelData.length; i++){
    	if(excelData[i].split(",").length>1 && excelData[i].split(",")[0]!==""){
    		fishBrain.text = excelData[i].split(",")[0];
    		break;
    	}
    }
    drawSecThirClaNode ("测量",  bigMeasure);
    drawSecThirClaNode ("环境",  bigEnvironment);
    drawSecThirClaNode ("方法",  bigMethod);
    drawSecThirClaNode ("材料",  bigMaterial);
    drawSecThirClaNode ("机器",  bigMachine);
    drawSecThirClaNode ("人员",  bigMan);
     }
}