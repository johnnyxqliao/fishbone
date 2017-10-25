<%@ page language="java" pageEncoding="UTF-8"
	contentType="text/html;charset=utf-8"%>
<%@ include file="/common/taglibs.jsp"%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<title>鱼骨图</title>
<!-- 鱼骨图CSS -->
<link rel="stylesheet" href="assets/css/font-awesome.min.css"
	type="text/css" />
<link rel="stylesheet" href="css/uploadButton.css" type="text/css" />
<link rel="stylesheet" href="assets/css/ace.min.css" type="text/css" />
<link rel="stylesheet" href="assets/css/ace-rtl.min.css" />
<link rel="stylesheet" href="assets/css/ace-skins.min.css" />
<link rel="stylesheet" href="./css/canvasAdapt.css" type="text/css">
<link rel="stylesheet" href="./css/rightCSS.css" type="text/css" />
<link rel="stylesheet" href="./css/text.css" type="text/css" />
<link rel="stylesheet" href="./css/main.css" type="text/css" />
<link rel="stylesheet" href="./css/freezeRootNode.css" type="text/css" />
<link rel="stylesheet" href="./css/demo.css" type="text/css" />
<link rel="stylesheet" href="./css/zTreeStyle.css" type="text/css" />
<!-- 导入js -->
<script type="text/javascript" src="js/jquery.min.js"></script>
<script type="text/javascript" src="js/cpexcel.js"></script>
<script type="text/javascript" src="js/shim.js"></script>
<script type="text/javascript" src="js/jszip.js"></script>
<script type="text/javascript" src="jtopo/csvConvertJson.js"></script>
<script type="text/javascript" src="js/xlsx.js"></script>
<script type="text/javascript" src="jtopo/jTopo.js"></script>
<script type="text/javascript" src="./jtopo/saveImages.js"></script>
<script src="assets/js/ace-extra.min.js"></script>
</head>
<body>
	<div class="sidebar" id="sidebar"
		style="margin-top: 0px; width: 190px; background-color: #FFFFFF;">
		<button type="button" class="btn btn-primary"
			style="float: left; padding-top: 0px; padding-bottom: 0px; padding-right: 0px; margin-top: 10px; left: 5px; padding-left: 0px;"
			onclick="updateNode()">
			<i class="glyphicon glyphicon-text-width">编辑</i>
		</button>

		<button type="button" class="btn btn-primary"
			style="float: left; padding-top: 0px; padding-bottom: 0px; padding-right: 0px; margin-top: 10px; left: 5px; margin-left: 5px; padding-left: 0px;"
			onclick="addTreeNode();">
			<i class="glyphicon glyphicon-plus">添加</i>
		</button>

		<button type="button" class="btn btn-primary"
			style="float: left; padding-top: 0px; padding-bottom: 0px; padding-right: 0px; margin-top: 10px; left: 5px; margin-left: 5px; padding-left: 0px;"
			onclick="chooseDelete()">
			<i class="glyphicon glyphicon-minus">删除</i>
		</button>

		<div class="zTreeDemoBackground left nav_wrap" id="sideTree">
			<ul id="treeDemo" class="ztree nav_ul"></ul>
		</div>

	</div>
	<div class="main-content">
		<div class="breadcrumbs" id="breadcrumbs"
			style="padding-right: 0px; border-bottom-width: 0px;">
			<div>
				<button type="button" class="btn btn-primary"
					style="float: left; padding-top: 0px; padding-bottom: 0px; padding-right: 0px; margin-top: 10px; padding-left: 0px; margin-right: 5px; margin-left: 5px;"
					onclick="downloadFile()">
					<i class="glyphicon glyphicon-download-alt">下载模板</i>
				</button>

				<button type="submit" class="btn btn-primary"
					style="float: left; padding-top: 0px; padding-bottom: 0px; padding-right: 0px; margin-top: 10px; padding-left: 0px; margin-right: 5px;"
					onclick="$('#myModal1').modal()">
					<i class="glyphicon glyphicon-upload">导入表格</i>
				</button>

				<button type="button" class="btn btn-primary"
					style="float: left; padding-top: 0px; padding-bottom: 0px; padding-right: 0px; margin-top: 10px; padding-left: 0px; margin-right: 5px;"
					onclick="$('#redraw').modal()">
					<i class="glyphicon glyphicon-edit">绘制</i>
				</button>

				<button type="button" class="btn btn-primary"
					style="float: left; padding-top: 0px; padding-bottom: 0px; padding-right: 0px; margin-top: 10px; padding-left: 0px; margin-right: 5px;"
					onclick="$('#renew').modal()">
					<i class="glyphicon glyphicon-new-window">新建</i>
				</button>

				<button type="button" class="btn btn-primary"
					style="float: left; padding-top: 0px; padding-bottom: 0px; padding-right: 0px; margin-top: 10px; padding-left: 0px; margin-right: 5px;"
					onclick="setCenter()">
					<i class="glyphicon glyphicon-align-center">居中</i>
				</button>

				<button type="button" class="btn btn-primary"
					style="float: left; padding-top: 0px; padding-bottom: 0px; padding-right: 0px; margin-top: 10px; padding-left: 0px; margin-right: 5px;"
					onclick="convertCanvasToImage()">
					<i class="	glyphicon glyphicon-saved">保存</i>
				</button>

				<button type="button" class="btn btn-primary"
					style="float: left; padding-top: 0px; padding-bottom: 0px; padding-right: 0px; margin-top: 10px; padding-left: 0px; margin-right: 5px;"
					onclick="exportFile()">
					<i class="	glyphicon glyphicon-export">导出项目</i>
				</button>

				<button type="submit" class="btn btn-primary"
					style="float: left; padding-top: 0px; padding-bottom: 0px; padding-right: 0px; margin-top: 10px; padding-left: 0px; margin-right: 5px;"
					onclick="$('#fileImport').modal()">
					<i class="glyphicon glyphicon-import">导入项目</i>
				</button>

				<button type="button" class="btn btn-primary"
					style="float: left; padding-top: 0px; padding-bottom: 0px; padding-right: 0px; margin-top: 10px; padding-left: 0px; margin-right: 5px;"
					onclick="$('#myModal').modal()">
					<i class="glyphicon glyphicon-info-sign">帮助</i>
				</button>
			</div>
		</div>
		<div id="canvasDiv">
			<canvas id="canvas" width=500 height=500></canvas>
		</div>
	</div>

	<div id="rMenu">
		<ul>
			<li id="m_add" onclick="addTreeNode();">添加</li>
			<li id="m_del" onclick="removeTreeNode();">删除</li>
			<li id="m_check" onclick="updateNode()">编辑</li>
		</ul>
	</div>
	<!-- 模态框（Modal） -->
	<div class="modal fade" id="myModal" tabindex="-1" role="dialog"
		aria-labelledby="myModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h2 class="modal-title">鱼骨图App使用说明:</h2>
				</div>
				<div class="modal-body">
					本WebApp提供两种绘制鱼骨图方法：<br /> 1、使用模板<br />
					&nbsp;&nbsp;&nbsp;1)点击“下载模板”，获取标准模板；<br />
					&nbsp;&nbsp;&nbsp;2)填写待解决问题以及问题原因；<br /> &nbsp;&nbsp;&nbsp;<img
						src="./template/img/reasonAnasis.png" width="400px" height="200px">
					<br /> &nbsp;&nbsp;&nbsp;3)删除模板中多余数据；<br />
					&nbsp;&nbsp;&nbsp;4)点击绘制按钮，绘制鱼骨图；<br />
					&nbsp;&nbsp;&nbsp;5)选中节点，点击上方的功能按钮，可是实现对内容的修改，点击绘制可得到修改后的鱼骨图；<br />
					&nbsp;&nbsp;&nbsp;6)点击居中，并保存图片；<br /> 2、在侧边栏交互编辑<br />
					&nbsp;&nbsp;&nbsp;1)编辑待解决问题；<br />
					&nbsp;&nbsp;&nbsp;2)分别添加每一级的子节点，并编辑；<br />
					&nbsp;&nbsp;&nbsp;3)点击绘制鱼骨图即可生成对应的鱼骨图；<br />
					&nbsp;&nbsp;&nbsp;4)点击居中，并保存图片；<br /> 3、注意事项<br />
					&nbsp;&nbsp;&nbsp;1)使用模板添加问题原因时，必须保持问题之间的层次结构（树状结构）；<br />
					&nbsp;&nbsp;&nbsp;2)模板中每一行只能有一个数据；<br />
					&nbsp;&nbsp;&nbsp;3)保存图片时，应先居中；<br />
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" data-dismiss="modal">关闭
					</button>
				</div>
			</div>
		</div>
	</div>
	<!-- 导入表格模态框 -->
	<div class="modal fade" id="myModal1" tabindex="-1" role="dialog"
		aria-labelledby="myModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h4 class="modal-title" id="myModalLabel">导入文件</h4>
				</div>
				<div class="modal-body"
					style="padding-top: 50px; padding-bottom: 50px;">
					<div id="chooseFile">
						<input type="file" name="xlfile" id="xlf" />
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" data-dismiss="modal">确定
					</button>
				</div>
			</div>
		</div>
	</div>
	<!-- 导入项目模态框 -->
	<div class="modal fade" id="fileImport" tabindex="-1" role="dialog"
		aria-labelledby="myModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h4 class="modal-title" id="myModalLabel">导入项目</h4>
				</div>
				<div class="modal-body"
					style="padding-top: 50px; padding-bottom: 50px;">
					<div id="chooseImportFile">
						<input type="file" name="fileImport" id="fileImport"
							onchange="importFile(this.files)" />
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" data-dismiss="modal">确定
					</button>
				</div>
			</div>
		</div>
	</div>
	<!-- 不允许添加模态框 -->
	<div class="modal fade" id="noAdd" tabindex="-1" role="dialog"
		aria-labelledby="myModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header"
					style="text-align: center; padding-top: 50px; padding-bottom: 50px; padding-left: 0px; padding-right: 0px;">
					<h4 class="modal-title" id="myModalLabel">不允许添加子节点</h4>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" data-dismiss="modal"
						style="padding-top: 5px; padding-bottom: 5px; padding-right: 10px; padding-left: 10px;">
						确定</button>
				</div>
			</div>
		</div>
	</div>
	<!-- 不允许编辑模态框 -->
	<div class="modal fade" id="noEdit" tabindex="-1" role="dialog"
		aria-labelledby="myModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header"
					style="text-align: center; padding-top: 50px; padding-bottom: 50px; padding-left: 0px; padding-right: 0px;">
					<h4 class="modal-title" id="myModalLabel">不允许编辑该节点</h4>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" data-dismiss="modal"
						style="padding-top: 5px; padding-bottom: 5px; padding-right: 10px; padding-left: 10px;">
						确定</button>
				</div>
			</div>
		</div>
	</div>
	<!-- 不允许删除模态框 -->
	<div class="modal fade" id="noDelete" tabindex="-1" role="dialog"
		aria-labelledby="myModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header"
					style="text-align: center; padding-top: 50px; padding-bottom: 50px; padding-left: 0px; padding-right: 0px;">
					<h4 class="modal-title" id="myModalLabel">不允许删除该节点</h4>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" data-dismiss="modal"
						style="padding-top: 5px; padding-bottom: 5px; padding-right: 10px; padding-left: 10px;">
						确定</button>
				</div>
			</div>
		</div>
	</div>
	<!-- 重绘-->
	<div class="modal fade" id="redraw" tabindex="-1" role="dialog"
		aria-labelledby="myModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header"
					style="text-align: center; padding-top: 50px; padding-bottom: 50px; padding-left: 0px; padding-right: 0px;">
					<h4 class="modal-title" id="myModalLabel">
						如果绘制将无法恢复原来的鱼骨图数据。</br> 确认绘制请点击“确认”按钮，否则点击“取消”按钮。
					</h4>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" data-dismiss="modal"
						onclick="redraw()"
						style="padding-top: 5px; padding-bottom: 5px; padding-right: 10px; padding-left: 10px;">
						确定</button>
					<button type="button" class="btn btn-default" data-dismiss="modal"
						style="padding-top: 5px; padding-bottom: 5px; padding-right: 10px; padding-left: 10px;">
						取消</button>
				</div>
			</div>
		</div>
	</div>
	<!-- 新建-->
	<div class="modal fade" id="renew" tabindex="-1" role="dialog"
		aria-labelledby="myModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header"
					style="text-align: center; padding-top: 50px; padding-bottom: 50px; padding-left: 0px; padding-right: 0px;">
					<h4 class="modal-title" id="myModalLabel">
						如果新建将无法恢复原来的鱼骨图数据。</br> 确认重绘请点击“确认”按钮，否则点击“取消”按钮。
					</h4>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" data-dismiss="modal"
						onclick="newFishbone()"
						style="padding-top: 5px; padding-bottom: 5px; padding-right: 10px; padding-left: 10px;">
						确定</button>
					<button type="button" class="btn btn-default" data-dismiss="modal"
						style="padding-top: 5px; padding-bottom: 5px; padding-right: 10px; padding-left: 10px;">
						取消</button>
				</div>
			</div>
		</div>
	</div>
	<!-- 确认删除-->
	<div class="modal fade" id="confirmDelete" tabindex="-1" role="dialog"
		aria-labelledby="myModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header"
					style="text-align: center; padding-top: 50px; padding-bottom: 50px; padding-left: 0px; padding-right: 0px;">
					<h4 class="modal-title" id="myModalLabel">
						如果删除该节点，该节点的子节点也将会一起删除</br> 确认重绘请点击“确认”按钮，否则点击“取消”按钮。
					</h4>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" data-dismiss="modal"
						onclick="removeTreeNode();"
						style="padding-top: 5px; padding-bottom: 5px; padding-right: 10px; padding-left: 10px;">
						确定</button>
					<button type="button" class="btn btn-default" data-dismiss="modal"
						style="padding-top: 5px; padding-bottom: 5px; padding-right: 10px; padding-left: 10px;">
						取消</button>
				</div>
			</div>
		</div>
	</div>
	<script type="text/javascript" src="js/tree/jquery.ztree.core.js"></script>
	<script type="text/javascript" src="js/tree/jquery.ztree.exedit.js"></script>
	<script type="text/javascript" src="./jtopo/canvasAdapt.js"></script>
	<script type="text/javascript" src="js/featureButton.js"></script>
	<script type="text/javascript" src="jtopo/bone.js"></script>
	<script type="text/javascript" src="jtopo/drawing.js"></script>
	<script type="text/javascript" src="jtopo/tree.js"></script>
	<script type="text/javascript" src="./jtopo/popups.js"></script>
	<script type="text/javascript" src="./jtopo/exportFile.js"></script>
</body>
</html>