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

                    <div id="canvasDiv">
                          <canvas id="canvas" width=500 height=500></canvas>
                    </div>

    <script type="text/javascript" src="./jtopo/canvasAdapt.js"></script>
    <script type="text/javascript" src="js/featureButton.js"></script>
    <script type="text/javascript" src="js/tree/jquery.ztree.core.js"></script>
    <script type="text/javascript" src="js/tree/jquery.ztree.exedit.js"></script>
    <script type="text/javascript" src="jtopo/bone.js"></script>
    <script type="text/javascript" src="jtopo/drawing.js"></script>    
    <script type="text/javascript" src="jtopo/tree.js"></script>  
    <script type="text/javascript" src="./jtopo/popups.js"></script>
    		
</body>
</html>
