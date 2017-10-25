function exportFile() {
	var frameInfo = {
		data : exportData
	};
	frameInfo.projectName = 'fishBone';
	frameInfo.appName = 'fishBone';
	frameInfo.databaseName = 'none';
	var data = JSON.stringify(frameInfo);
	// 保存数据，同时传入data和文件名
	saveAsFile(data, 'fishBone');
}
/**
 * 导出项目
 * @returns
 */
function saveAsFile(data, name) {
	var link = document.createElement("a");
	link.download = name + '.imFISH';
	link.href = "data:text/plain;base64,"
			+ btoa(unescape(encodeURIComponent(data)));
	document.body.appendChild(link);
	link.click();
	link.parentNode.removeChild(link);
	return name + '.imFISH';
}
/**
 * 导入数据
 * @returns
 */
function importFile(files){
	var file = files[0];
	var reader = new FileReader();
	var fileName = file.name;
	var filetype=fileName.split(".")[1];
	var content;
	if(filetype=='imFISH'){
		reader.readAsText(file);
		reader.onload=function () {
			var content=this.result;
			var json=JSON.parse(content);
			frameLoad(json.data);//重新生成鱼骨图
		};
		
	}else {
		alert("文件格式错误，请选择imFish类型的文件重新导入");
		return;
    }
}
function frameLoad(json){
	excelData = json;
	excelData = init(excelData);
	excelData['open'] = true;
	zNodes =[excelData];
	zNodes[0].children.splice(6,1);
	$.fn.zTree.init($("#treeDemo"), setting, zNodes);
	redraw();
//	$("#fileImport").remove();
//	$("#chooseImportFile").append("<input type='file' name='fileImport' id='fileImport' onchange='importFile(this.files)'/>");// 新建选择文件按钮
}