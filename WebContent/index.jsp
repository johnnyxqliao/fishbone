<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>鱼骨图 </title>
		<link href="./img/fish.ico" rel="shortcut icon">
		<!-- 鱼骨图CSS -->
		<link rel="stylesheet" href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css">
        <link rel="stylesheet" href="assets/css/font-awesome.min.css" type="text/css"/>
        <link rel="stylesheet" href="css/uploadButton.css" type="text/css"/>
        <link rel="stylesheet" href="assets/css/ace.min.css" type="text/css"/>
        
        <link rel="stylesheet" href="./css/canvasAdapt.css" type="text/css" >
        <link rel="stylesheet" href="./css/rightCSS.css" type="text/css"/>
        <link rel="stylesheet" href="./css/text.css" type="text/css"/>
        <link rel="stylesheet" href="./css/main.css" type="text/css"/>
        <link rel="stylesheet" href="./css/demo.css" type="text/css"/>
        <link rel="stylesheet" href="./css/zTreeStyle.css" type="text/css"/>
        <link rel="stylesheet" href="./css/freezeRootNode.css" type="text/css"/>
        <!-- 表头CSS -->
		<link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Open+Sans:400,300" />
		<link rel="stylesheet" href="assets/css/ace-rtl.min.css" />
		<link rel="stylesheet" href="assets/css/ace-skins.min.css" />
		
		<!-- 导入js -->
        
        <script type="text/javascript" src="js/cpexcel.js"></script>
        <script type="text/javascript" src="js/shim.js"></script>
        <script type="text/javascript" src="js/jszip.js"></script>
        <script type="text/javascript" src="jtopo/csvConvertJson.js"></script>  
        <script type="text/javascript" src="js/xlsx.js"></script>
        <script type="text/javascript" src="jtopo/jTopo.js"></script>
        <script src="https://cdn.bootcss.com/jquery/2.1.1/jquery.min.js"></script>
        <script type="text/javascript" src="./jtopo/saveImages.js"></script>
        <script src="https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
		<script src="assets/js/ace-extra.min.js"></script>
		
	</head>

	<body>
	<jsp:include page="/decorators/banner.jsp"></jsp:include>
	<jsp:include page="/decorators/copyright.jsp"></jsp:include>
	   
        <div class="sidebar" id="sidebar" style="margin-top: 5px; width: 190px;">
        <div style="margin-left:10px; float:left; padding-top: 5px;">
                                <input type="submit" value="绘制鱼骨图" id="redraw" onclick="redraw()" class="file"/>
        </div>
        <div style="margin-left:10px; float:left; padding-top: 5px;">
                                <input type="submit" value="新建" id="redraw" onclick="newFishbone()" class="file"/>
        </div>
        
        <div class="zTreeDemoBackground left" >
            <ul id="treeDemo" class="ztree"></ul>
        </div>
     </div>
            <div class="main-content" style="height: 720px;">
                <div class="breadcrumbs" id="breadcrumbs">
                        <div style="margin-left:10px;float:left; padding-top: 5px;">

                            <div style="margin-left:10px; float:left; padding-top: 5px;">
                                <a href="template/template.xls" class="file">下载模板</a>
                            </div>

                            <div id="chooseFile" style="margin-left:10px; float:left; padding-top: 5px;">
                                <a class="file" id='aFile'>
                                                                                    选择文件
                                 <input type="file" name="xlfile" id="xlf" style="margin-left:10px;float:left"/>
                                </a>
                            </div>

                            <div style="margin-left:10px; float:left; padding-top: 5px;">
                                <input type="submit" value="保存图片" onclick="convertCanvasToImage()" class="file" style="float:left"/>
                            </div>

                            <div style="margin-left:10px;float:left; padding-top: 5px;">
                                <input type="submit" value="居中" onclick="setCenter()" class="file" style="float:left"/>
                            </div>
                            
                            <div style="margin-left:10px;float:left; padding-top: 5px;">
                                <input type="submit" value="帮助" onclick="$('#myModal').modal()" class="file" style="float:left"/>
                            </div>
                      </div>
                </div>
                    <div id="canvasDiv" style="border-bottom:1px solid #000 ">
                          <canvas id="canvas" width=1000 height=600 ></canvas>
                    </div>
                </div>

            <ul id="contextmenu" style="display:none;">
                <li>
                    <a  href="javascript:addNode()">添加子节点</a>
                </li>
                <li>
                    <a href="javascript:deleteNode()">删除节点</a>
                </li>
                <li>
                    <a>撤销</a>
                </li>
            </ul>
        <div id="rMenu">
            <ul>
                <li id="m_add" onclick="addTreeNode();">添加</li>
                <li id="m_del" onclick="removeTreeNode();">删除</li>
                <li id="m_check" onclick="updateNode()">编辑</li>
            </ul>
        </div>
<!-- 模态框（Modal） -->
<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
	       <div class="modal-header" >
               <h4 class="modal-title" >
					鱼骨图App使用说明:
				</h4>
		  </div>
		  <div class="modal-body">
				本WebApp提供两种绘制鱼骨图方法：<br/>
				1、使用模板<br/>
				&nbsp;&nbsp;&nbsp;1)点击“下载模板”，获取标准模板；<br/>
				&nbsp;&nbsp;&nbsp;2)填写待解决问题以及问题原因；<br/>
				&nbsp;&nbsp;&nbsp;<img src="./template/img/reasonAnasis.png" width="400px" height="200px"> <br/> 
				&nbsp;&nbsp;&nbsp;3)删除模板中多余数据；<br/>
				&nbsp;&nbsp;&nbsp;4)通过右键可以在侧边栏上数据，点击绘制鱼骨图，即可得到修改后的鱼骨图；<br/>
				2、在侧边栏交互编辑<br/>
				&nbsp;&nbsp;&nbsp;1)编辑待解决问题；<br/>
				&nbsp;&nbsp;&nbsp;2)分别添加每一级的子节点，并编辑；<br/>
				&nbsp;&nbsp;&nbsp;3)点击绘制鱼骨图即可生成对应的鱼骨图；<br/>
				&nbsp;&nbsp;&nbsp;4)点击居中，并保存图片；<br/>
				3、注意事项<br/>
				&nbsp;&nbsp;&nbsp;1)使用模板添加问题原因时，因保持问题之间的层次结构；<br/>
				&nbsp;&nbsp;&nbsp;2)模板中每一行只能有一个数据；<br/>
				&nbsp;&nbsp;&nbsp;3)保存图片时，应先居中；<br/>
				
		  </div>
		  <div class="modal-footer">
				<button type="button" class="btn btn-primary" data-dismiss="modal">关闭
				</button>
		  </div>
		</div>
	</div>
</div>
    <script type="text/javascript" src="js/featureButton.js"></script>
    <script type="text/javascript" src="js/tree/jquery.ztree.core.js"></script>
    <script type="text/javascript" src="js/tree/jquery.ztree.exedit.js"></script>
    <script type="text/javascript" src="jtopo/bone.js"></script>
    <script type="text/javascript" src="jtopo/drawing.js"></script>    
    <script type="text/javascript" src="jtopo/tree.js"></script>  
    <script type="text/javascript" src="./jtopo/popups.js"></script>
    <script type="text/javascript" src="./jtopo/canvasAdapt.js"></script>		
</body>
</html>
