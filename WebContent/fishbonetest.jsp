<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <title>鱼骨图</title>
        
<!--  导入css -->

        <link rel="stylesheet" href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css">
        <link rel="stylesheet" href="assets/css/font-awesome.min.css" type="text/css"/>
        <link rel="stylesheet" href="css/uploadButton.css" type="text/css"/>
        <link rel="stylesheet" href="assets/css/font.css" type="text/css"/>
        <link rel="stylesheet" href="assets/css/ace.min.css" type="text/css"/>
        <link rel="stylesheet" href="assets/css/ace-responsive.min.css" type="text/css"/>
        
        <link rel="stylesheet" href="./css/canvasAdapt.css" type="text/css" >
        <link rel="stylesheet" href="./css/rightCSS.css" type="text/css"/>
        <link rel="stylesheet" href="./css/text.css" type="text/css"/>
        <link rel="stylesheet" href="./css/main.css" type="text/css"/>
         <link rel="stylesheet" href="./css/demo.css" type="text/css"/>
        <link rel="stylesheet" href="./css/zTreeStyle.css" type="text/css"/>
        <link rel="stylesheet" href="./css/freezeRootNode.css" type="text/css"/>
        
<!-- 导入js -->

        <script type="text/javascript" src="js/featureButton.js"></script>
        <script type="text/javascript" src="js/cpexcel.js"></script>
        <script type="text/javascript" src="js/shim.js"></script>
        <script type="text/javascript" src="js/jszip.js"></script>

        <script type="text/javascript" src="jtopo/csvConvertJson.js"></script>  
        <script type="text/javascript" src="js/xlsx.js"></script>
        <script type="text/javascript" src="jtopo/jTopo.js"></script>
        <script src="https://cdn.bootcss.com/jquery/2.1.1/jquery.min.js"></script>
        <script type="text/javascript" src="./jtopo/saveImages.js"></script>
        <script src="https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
        
        
    </head>
    <body>
        <div class="navbar">
            <div class="navbar-inner">
                <div class="container-fluid">
                    <a href="#" class="brand">
                        <small>
                                         小微企业多创新方法融合与集成应用平台   创新管理平台                            
                        </small>
                    </a>
                    <ul class="nav ace-nav pull-right">
                        <li class="light-blue">
                            <a data-toggle="dropdown" href="#" class="dropdown-toggle">
                                <img class="nav-user-photo" src="assets/avatars/user.jpg" alt="Jason's Photo"/>
                                <span class="user-info">
                                    <small>Welcome,</small>
                                    Jason
								
                                </span>
                                <i class="icon-caret-down"></i>
                            </a>
                            <ul class="user-menu pull-right dropdown-menu dropdown-yellow dropdown-caret dropdown-closer">
                                <li>
                                    <a href="#">
                                        <i class="icon-cog"></i>
                                        Settings
									
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <i class="icon-user"></i>
                                        Profile
                                    </a>
                                </li>
                                <li class="divider"></li>
                                <li>
                                    <a href="#">
                                        <i class="icon-off"></i>
                                        Logout
									
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="sidebar" id="sidebar" style=" border-top-width: 100px;margin-top: 50px; width: 190px;">
        <div style="margin-left:10px; float:left; padding-top: 5px;">
                                <input type="submit" value="绘制鱼骨图" id="redraw" onclick="redraw()" class="file"/>
        </div>
        <div style="margin-left:10px; float:left; padding-top: 5px;">
                                <input type="submit" value="帮助" id="redraw" onclick="$('#myModal').modal()" class="file"/>
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

                            <div style="margin-left:10px; float:left; padding-top: 5px;">
                                <a class="file">
                                                                                    选择文件
                                 <input type="file" name="xlfile" id="xlf" style="margin-left:10px;float:left"/>
                                </a>
                            </div>

                            <div style="margin-left:10px;float:left; padding-top: 5px;">
                                <input type="submit" value="保存图片" onclick="convertCanvasToImage()" class="file"/>
                            </div>

                            <div style="margin-left:10px;float:left; padding-top: 5px;">
                                <input type="submit" value="居中" onclick="setCenter()" class="file"/>
                            </div>

                            <div class="nav-search" id="nav-search">
                                  <span class="input-icon">
                                      <input type="text" placeholder="Search ..." class="input-small nav-search-input" id="nav-search-input" autocomplete="off"/>
                                      <i class="icon-search nav-search-icon"></i>
                                  </span>
                            </div>
                      </div>
                </div>
                                <div id="canvasDiv">
                <canvas id="canvas" width=1000 height=600></canvas>
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
	       <div class="modal-header">
               <h4 class="modal-title">
					鱼骨图App使用说明:
				</h4>
		  </div>
		  <div class="modal-body">
				本WebApp提供两种绘制鱼骨图方法：<br/>
				1、使用模板<br/>
				&nbsp;&nbsp;1)点击“下载模板”，获取标准模板；<br/>
				&nbsp;&nbsp;2)填写待解决问题以及问题原因；<br/>
				&nbsp;&nbsp;<img src="./template/img/reasonAnasis.png" width="200px" height="100px"> <br/> 
				&nbsp;&nbsp;3)删除模板中多余数据；<br/>
				&nbsp;&nbsp;4)通过右键可以在侧边栏上数据，点击绘制鱼骨图，即可得到修改后的鱼骨图；<br/>
				2、在侧边栏交互编辑<br/>
				&nbsp;&nbsp;1)编辑待解决问题；<br/>
				&nbsp;&nbsp;2)分别添加每一级的子节点，并编辑；<br/>
				&nbsp;&nbsp;3)点击绘制鱼骨图即可生成对应的鱼骨图；<br/>
				&nbsp;&nbsp;4)点击居中，并保存图片；<br/>
				3、注意事项<br/>
				&nbsp;&nbsp;1)使用模板添加问题原因时，因保持问题之间的层次结构；<br/>
				&nbsp;&nbsp;2)模板中每一行只能有一个数据；<br/>
				&nbsp;&nbsp;3)保存图片时，应先居中；<br/>
				
		  </div>
		  <div class="modal-footer">
				<button type="button" class="btn btn-primary" data-dismiss="modal">关闭
				</button>
		  </div>
		</div><!-- /.modal-content -->
	</div><!-- /.modal -->
</div>


    <script type="text/javascript" src="js/tree/jquery.ztree.core.js"></script>
    <script type="text/javascript" src="js/tree/jquery.ztree.exedit.js"></script>
    <script type="text/javascript" src="jtopo/bone.js"></script>
    <script type="text/javascript" src="jtopo/drawing.js"></script>    
    <script type="text/javascript" src="jtopo/tree.js"></script>  
        
    <script type="text/javascript" src="./jtopo/canvasAdapt.js"></script>
    </body>
</html>
