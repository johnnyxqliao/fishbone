function init(data) {
	//数据处理
	var arr = [];
	data.forEach(function(value, index, array){
    	if(index>1){
    	var element = value.split(",");
    	arr.push(element);
    	}
    }, this);
	 
	data = arr;
	//数据转换
	var nodes = [{
	    'name': data[0][0],
	    'children': [],
	}];

	var p = {
	    'name': '',
	    'children': [
	    ]
	}

    var arr = nodes[0].children;
    var current = [];
    var pre = arr;
    for (var i = 0; i < data[0].length; i++) {
        data.forEach(function (element, index) {
            if (i == 1) {
                if (element[i] != '') {
                	help=true;
                    var temp = {
                        'name': element[i],
                        'children': [],
                        'parent': arr,
                        'y': index,
                    };
                    nodes[0].children.push(temp);
                    current.push(temp);
                }
            } else {
                if (element[i] != '' && element[i]!=undefined) {
 
                    for (var j = 0; j < pre.length; j++) {
                        if (index < pre[j].y) {
                            var temp = {
                                'name': element[i],
                                'children': [],
                                'parent': pre[j - 1],
                                'y': index,
                            };
                            pre[j - 1].children.push(temp);
                            current.push(temp);
                            break;
                        }
                    }
                }
                if(element[i]==undefined){
					var temp={
							'name': element[i],
                            'children': [],
                            'parent': [],
                            'y': index,
					}
					current.push(temp);
				}
            }
        }, this);
        pre = current;
        if(pre.length<2&&i>=1){
        	break;
        }
        current = [];
    }
    return nodes[0];
}