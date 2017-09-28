<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	String basePath = "http://innovation.xjtu.edu.cn:80/StaticFiles/web-resources/frames/mes/1.0-SNAPSHOT/";
	String appPath = "http://innovation.xjtu.edu.cn:80/InnovationToolsPlatform/";
	String userName = (String) request.getAttribute("username");
%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>鱼骨图</title>
<link href="./img/fish.ico" rel="shortcut icon">
<!-- 鱼骨图CSS -->
<link rel="stylesheet" href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css">
<link rel="stylesheet" href="assets/css/font-awesome.min.css" type="text/css" />
<link rel="stylesheet" href="css/uploadButton.css" type="text/css" />
<link rel="stylesheet" href="assets/css/ace.min.css" type="text/css" />
<link rel="stylesheet" href="assets/css/ace-rtl.min.css" />
<link rel="stylesheet" href="assets/css/ace-skins.min.css" />

<link rel="stylesheet" href="./css/canvasAdapt.css" type="text/css">
<link rel="stylesheet" href="./css/rightCSS.css" type="text/css" />
<link rel="stylesheet" href="./css/text.css" type="text/css" />
<link rel="stylesheet" href="./css/main.css" type="text/css" />
<link rel="stylesheet" href="./css/demo.css" type="text/css" />
<link rel="stylesheet" href="./css/zTreeStyle.css" type="text/css" />
<link rel="stylesheet" href="./css/freezeRootNode.css" type="text/css" />

<!-- 表头 -->
<link rel="stylesheet"href="http://innovation.xjtu.edu.cn:80/StaticFiles/web-resources/frames/mes/1.0-SNAPSHOT/css/gallery-style.css" />
<link rel="stylesheet"href="http://innovation.xjtu.edu.cn:80/StaticFiles/web-resources/frames/mes/1.0-SNAPSHOT/assets/css/ace-modify.css" />
<!-- 导入js -->
<script src="https://cdn.bootcss.com/jquery/2.1.1/jquery.min.js"></script>
<script type="text/javascript" src="js/cpexcel.js"></script>
<script type="text/javascript" src="js/shim.js"></script>
<script type="text/javascript" src="js/jszip.js"></script>
<script type="text/javascript" src="jtopo/csvConvertJson.js"></script>
<script type="text/javascript" src="js/xlsx.js"></script>
<script type="text/javascript" src="jtopo/jTopo.js"></script>
<script type="text/javascript" src="./jtopo/saveImages.js"></script>
<script src="https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="assets/js/ace-extra.min.js"></script>

<!-- 表头 -->
<script type="text/javascript">
	if ("ontouchend" in document)
		document
				.write("<script src='http://innovation.xjtu.edu.cn:80/StaticFiles/web-resources/frames/mes/1.0-SNAPSHOT/assets/js/jquery.mobile.custom.min.js'>"
						+ "<" + "/script>");
</script>
<script src="http://innovation.xjtu.edu.cn:80/StaticFiles/web-resources/frames/mes/1.0-SNAPSHOT/assets/js/typeahead-bs2.min.js"></script>
<script src="http://innovation.xjtu.edu.cn:80/StaticFiles/web-resources/frames/mes/1.0-SNAPSHOT/assets/js/jquery-ui-1.10.3.custom.min.js"></script>
<script src="http://innovation.xjtu.edu.cn:80/StaticFiles/web-resources/frames/mes/1.0-SNAPSHOT/assets/js/jquery.ui.touch-punch.min.js"></script>
<script src="http://innovation.xjtu.edu.cn:80/StaticFiles/web-resources/frames/mes/1.0-SNAPSHOT/assets/js/chosen.jquery.min.js"></script>
<script src="http://innovation.xjtu.edu.cn:80/StaticFiles/web-resources/frames/mes/1.0-SNAPSHOT/assets/js/fuelux/fuelux.spinner.min.js"></script>
<script src="http://innovation.xjtu.edu.cn:80/StaticFiles/web-resources/frames/mes/1.0-SNAPSHOT/assets/js/date-time/bootstrap-datepicker.min.js"></script>
<script src="http://innovation.xjtu.edu.cn:80/StaticFiles/web-resources/frames/mes/1.0-SNAPSHOT/assets/js/date-time/bootstrap-timepicker.min.js"></script>
<script src="http://innovation.xjtu.edu.cn:80/StaticFiles/web-resources/frames/mes/1.0-SNAPSHOT/assets/js/date-time/moment.min.js"></script>
<script src="http://innovation.xjtu.edu.cn:80/StaticFiles/web-resources/frames/mes/1.0-SNAPSHOT/assets/js/date-time/daterangepicker.min.js"></script>
<script src="http://innovation.xjtu.edu.cn:80/StaticFiles/web-resources/frames/mes/1.0-SNAPSHOT/assets/js/bootstrap-colorpicker.min.js"></script>
<script src="http://innovation.xjtu.edu.cn:80/StaticFiles/web-resources/frames/mes/1.0-SNAPSHOT/assets/js/jquery.knob.min.js"></script>
<script src="http://innovation.xjtu.edu.cn:80/StaticFiles/web-resources/frames/mes/1.0-SNAPSHOT/assets/js/jquery.autosize.min.js"></script>
<script src="http://innovation.xjtu.edu.cn:80/StaticFiles/web-resources/frames/mes/1.0-SNAPSHOT/assets/js/jquery.inputlimiter.1.3.1.min.js"></script>
<script src="http://innovation.xjtu.edu.cn:80/StaticFiles/web-resources/frames/mes/1.0-SNAPSHOT/assets/js/jquery.maskedinput.min.js"></script>
<script src="http://innovation.xjtu.edu.cn:80/StaticFiles/web-resources/frames/mes/1.0-SNAPSHOT/assets/js/bootstrap-tag.min.js"></script>
<script src="http://innovation.xjtu.edu.cn:80/StaticFiles/web-resources/frames/mes/1.0-SNAPSHOT/assets/js/ace-elements.min.js"></script>
</head>

<body>
	<div class="navbar navbar-default" id="navbar">
		<script type="text/javascript">
			try {
				ace.settings.check('navbar', 'fixed')
			} catch (e) {
			}
		</script>

		<div class="navbar-container" id="navbar-container">
			<div class="navbar-header pull-left">
				<a id="href0"
					href="http://innovation.xjtu.edu.cn/InnovationToolsPlatform/index"
					class="navbar-brand"> <small><i class="icon-leaf"></i>
						小微企业多创新方法融合与集成应用平台 </small>
				</a> <a id="href1" href="#" class="navbar-brand"> <small> <small>
							鱼骨图 </small>
				</small>
				</a>
				<!-- /.brand -->
			</div>
			<!-- /.navbar-header -->
			<div class="navbar-header pull-right" role="navigation">
				<ul class="nav ace-nav">
					<li class="grey"><a id="href2" data-toggle="dropdown"
						href="<%=appPath%>appList" onclick="gotoHref(this)"
						class="dropdown-toggle"> <img class="nav-user-photo"
							src="<%=basePath%>assets/avatars/platform.png"
							alt="Jason's Photo" /> 平台主页
					</a></li>


					<li class="purple"><a data-toggle="dropdown" href="#"
						onclick="gotoHref(this)" class="dropdown-toggle"> <img
							class="nav-user-photo"
							src="<%=basePath%>assets/avatars/process.png" alt="Jason's Photo" />
							模板层 <i class="icon-caret-down"></i>
					</a>
						<ul id="templateList"
							class="user-menu pull-right dropdown-menu dropdown-yellow dropdown-caret dropdown-close">
							<li><a data-toggle="dropdown" href="#"
								onclick="gotoHref(this)" class="dropdown-toggle"> <img
									class="nav-user-photo"
									src="<%=basePath%>assets/avatars/manage.png"
									alt="Jason's Photo" /> DMAIC模板
							</a></li>
							<li><a data-toggle="dropdown" href="#"
								onclick="gotoHref(this)" class="dropdown-toggle"> <img
									class="nav-user-photo"
									src="<%=basePath%>assets/avatars/manage.png"
									alt="Jason's Photo" /> 知识工程模板
							</a></li>
							<li><a data-toggle="dropdown"
								href="https://innovation.xjtu.edu.cn:8443/vsm"
								onclick="gotoHref(this)" class="dropdown-toggle"> <img
									class="nav-user-photo"
									src="<%=basePath%>assets/avatars/manage.png"
									alt="Jason's Photo" /> 价值流模板
							</a></li>
							<li><a data-toggle="dropdown" href="#"
								onclick="gotoHref(this)" class="dropdown-toggle"> <img
									class="nav-user-photo"
									src="<%=basePath%>assets/avatars/manage.png"
									alt="Jason's Photo" /> 5S模板
							</a></li>
							<li><a data-toggle="dropdown" href="#"
								onclick="gotoHref(this)" class="dropdown-toggle"> <img
									class="nav-user-photo"
									src="<%=basePath%>assets/avatars/manage.png"
									alt="Jason's Photo" /> TRIZ模板
							</a></li>
						</ul></li>
					<li class="green"><a data-toggle="dropdown" href="#"
						class="dropdown-toggle"> <img class="nav-user-photo"
							src="<%=basePath%>assets/avatars/tool.png" alt="Jason's Photo" />
							工具集 <i class="icon-caret-down"></i>
					</a>

						<ul
							class="user-menu pull-right dropdown-menu dropdown-yellow dropdown-caret dropdown-close">

							<li><a id="href3" data-toggle="dropdown" href="#"
								onclick="gotoHref(this)" class="dropdown-toggle"> <img
									class="nav-user-photo"
									src="<%=basePath%>assets/avatars/manage.png"
									alt="Jason's Photo" /> 创新管理工具
							</a></li>
							<li><a id="href4" data-toggle="dropdown" href="#"
								onclick="gotoHref(this)" class="dropdown-toggle"> <img
									class="nav-user-photo"
									src="<%=basePath%>assets/avatars/knowledge.png"
									alt="Jason's Photo" /> 创新知识服务
							</a></li>
							<li><a id="href5" data-toggle="dropdown" href="#"
								onclick="gotoHref(this)" class="dropdown-toggle"> <img
									class="nav-user-photo"
									src="<%=basePath%>assets/avatars/monitor.png"
									alt="Jason's Photo" /> 创新方法导入与过程监控
							</a></li>
							<li><a id="href6" data-toggle="dropdown" href="#"
								onclick="gotoHref(this)" class="dropdown-toggle"> <img
									class="nav-user-photo"
									src="<%=basePath%>assets/avatars/assess.png"
									alt="Jason's Photo" /> 创新方法评估
							</a></li>
							<li><a id="href7" data-toggle="dropdown" href="#"
								onclick="gotoHref(this)" class="dropdown-toggle"> <img
									class="nav-user-photo"
									src="<%=basePath%>assets/avatars/support.png"
									alt="Jason's Photo" /> 产业链协同创新支持
							</a></li>
						</ul></li>

					<li class="light-blue"><a data-toggle="dropdown" href="#"
						class="dropdown-toggle"> <img id="userAvatar"
							class="nav-user-photo"
							src="<%=basePath%>assets/avatars/avatar2.png" alt="Jason's Photo" />
							<span class="user-info"> <small>欢迎光临,</small> <%
								 	if (userName == null || userName.equals("anon")) {
								 %> 匿名游客 <%
								 	} else {
								 %> ${username} <%
								 	}
								 %>
						</span> <i class="icon-caret-down"></i>
					</a>
						<ul
							class="user-menu pull-right dropdown-menu dropdown-yellow dropdown-caret dropdown-close">
							<%
								if (userName == null || userName.equals("anon")) {
							%>
							<li><a href="#" onclick="gotoLogin()"> <i
									class="icon-key"></i>登录
							</a></li>
							<li><a href="#" onclick="gotoRegister()"> <i
									class="icon-plus"></i>注册
							</a></li>
							<%
								} else {
							%>
							<li><a href="#" onclick="gotoUserInfo()"> <i
									class="icon-user"></i> 个人资料
							</a></li>
							<li class="divider"></li>
							<li><a onclick="logout()" style="cursor: pointer;"> <i
									class="icon-off"></i> 退出
							</a></li>
							<%
								}
							%>
						</ul></li>

				</ul>
				<!-- /.ace-nav -->
			</div>
			<!-- /.navbar-header -->
		</div>
		<!-- /.container -->
	</div>
	
	
	<div class="sidebar" id="sidebar"
		style="margin-top: 0px; width: 190px; background-color: #FFFFFF ;">
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
					<i class="glyphicon glyphicon-upload">导入</i>
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
	<!-- 导入文件模态框 -->
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
	<script type="text/javascript" src="./jtopo/canvasAdapt.js"></script>
	<script type="text/javascript" src="js/featureButton.js"></script>
	<script type="text/javascript" src="js/tree/jquery.ztree.core.js"></script>
	<script type="text/javascript" src="js/tree/jquery.ztree.exedit.js"></script>
	<script type="text/javascript" src="jtopo/bone.js"></script>
	<script type="text/javascript" src="jtopo/drawing.js"></script>
	<script type="text/javascript" src="jtopo/tree.js"></script>
	<script type="text/javascript" src="./jtopo/popups.js"></script>
<jsp:include page="/decorators/copyright.jsp"></jsp:include>
</body>
</html>
