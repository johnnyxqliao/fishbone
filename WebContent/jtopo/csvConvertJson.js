function init(data) {
	var nodes = [{
	    'name': '鱼骨图',
	    'children': [],

	}];
//	var data = [];
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
                if (element[i] != '') {
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
            }
        }, this);
        pre = current;
        current = [];
    }
    return nodes[0];
}