<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <title>鱼骨图</title>
        
<!--  导入css -->

        <link rel="stylesheet" href="assets/css/bootstrap.min.css" type="text/css"/>
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

        <script type="text/javascript" src="js/xlsx.js"></script>
        <script type="text/javascript" src="jtopo/jTopo.js"></script>
        <script type="text/javascript" src="./jtopo/jquery-min.js"></script>
        <script type="text/javascript" src="./jtopo/saveImages.js"></script>
        
        
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
                               <input type="submit" value="保存" id="dataSave"  class="file"/>
        </div>
        <div style="margin-left:10px; float:left; padding-top: 5px;">
                                <input type="submit" value="重绘" id="redraw" onclick="redraw()" class="file"/>
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
                                <input type="submit" value="缩小" onclick="zoomIn()" class="file"/>
                            </div>

                            <div style="margin-left:10px;float:left; padding-top: 5px;">
                                <input type="submit" value="放大" onclick="zoomOut()" class="file"/>
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
    <script type="text/javascript" src="js/tree/jquery.ztree.core.js"></script>
    <script type="text/javascript" src="js/tree/jquery.ztree.exedit.js"></script>
    <script type="text/javascript" src="jtopo/bone.js"></script>
    <script type="text/javascript" src="jtopo/drawing.js"></script>    
    <script type="text/javascript" src="jtopo/tree.js"></script>  
    <script type="text/javascript" src="jtopo/csvConvertJson.js"></script>      
    <script type="text/javascript" src="./jtopo/canvasAdapt.js"></script>
    </body>
</html>
