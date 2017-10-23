/* 
 * 常量
 * 1、DataTable
 * 		<p>相关属性配置，请参考：http://www.cnblogs.com/liang-ling/p/5853156.html <p>
 * **/
var CONSTANT = {
		DATA_TABLES : {
			DEFAULT_OPTION : { //DataTables初始化选项
				language: {
					"sProcessing":   "处理中...",
					"sLengthMenu":   "每页 _MENU_ 项",
					"sZeroRecords":  "没有匹配结果",
					"sInfo":         "当前显示第 _START_ 至 _END_ 项，共 _TOTAL_ 项。",
					"sInfoEmpty":    "当前显示第 0 至 0 项，共 0 项",
					"sInfoFiltered": "(由 _MAX_ 项结果过滤)",
					"sInfoPostFix":  "",
					"sSearch":       "搜索:",
					"sUrl":          "",
					"sEmptyTable":     "表中数据为空",
					"sLoadingRecords": "载入中...",
					"sInfoThousands":  ",",
					"oPaginate": {
						"sFirst":    "首页",
						"sPrevious": "上页",
						"sNext":     "下页",
						"sLast":     "末页",
						"sJump":     "跳转"
					},
					"oAria": {
						"sSortAscending":  ": <img>",
						"sSortDescending": ": <img>"
					}
				},
                autoWidth: false,	//禁用自动调整列宽
                stripeClasses: ["odd", "even"],//为奇偶行加上样式，兼容不支持CSS伪类的场合
                order: [],			//取消默认排序查询,否则复选框一列会出现小箭头
                processing: false,	//隐藏加载提示,自行处理
                serverSide: true,	//启用服务器端分页
                searching: false	//禁用原生搜索
               
			},
			COLUMN: {
                CHECKBOX: {	//复选框单元格
                    className: "td-checkbox",
                    orderable: false,
                    width: "30px",
                    data: null,
                    render: function (data, type, row, meta) {
                        return '<input type="checkbox" class="iCheck">';
                    }
                }
            },
            RENDER: {	//常用render可以抽取出来，如日期时间、头像等
                ELLIPSIS: function (data, type, row, meta) {
                	data = data||"";
                	return '<span title="' + data + '">' + data + '</span>';
                }
            },
            PAGE: {   		
            		getQueryCondition : function(data,searchForm) {
            			var param = {};
            			var orderby;
            			//组装排序参数
            			if (data.order&&data.order.length&&data.order[0]) {
            				param.orderBy=data.columns[data.order[0].column].data + " " + data.order[0].dir; //排序参数
            			}
            			//组装查询参数
        				if(searchForm){
        					//把form里面的数据序列化成数组
        					var formData = $(searchForm).serializeArray();
        					formData.forEach(function (e) {
        						param[e.name] = e.value;
        					});
        				}
            			//组装分页参数
            			param.startIndex = data.start;
            			param.pageSize = data.length;
            			param.pageNum = (data.start / data.length)+1;//当前页码
            			param.draw = data.draw;
            			
            			//输出参数，方便调试
            			console.log(param);
            			return param;
            		}
            	}
            
		},
		DICTIONARY:{
			DATA_TYPE : "datatype",
			DATA_VALUE : "datavalue",
			/*SHOW_TYPE ：funtion(){
				
			}*/
			DATA_REFER : "datarefer"
		},
		AREA:{
			DATA_AREA:"dataarea",
			DATA_VALUE : "datavalue",
			DATA_REFER:"datarefer"
		},
		SMS:{
			COUNT : 60 //倒计时默认60秒
		}
};