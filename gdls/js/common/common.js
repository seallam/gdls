/**
 * 
 * Created by longhongwen on 2017/10/12
 */
var ToolApi = {
		ajax: {
			//注意：contentType默认值为application/x-www-form-urlencoded;charset=utf-8，springMVC不能接受json自动封装成实体
			//当contentType为application/json的时候，controller直接获取参数，获取不到
			ajaxPost: function (url, params, callback) {
				if (params && typeof params == "object") {
			        params = deleteEmptyProp(params);
			    }
				jQuery.ajax({
					url: url,
					type: 'post',
			        data: JSON.stringify(params),
			        dataType: 'json',
			        contentType: 'application/json',
		    		beforSend:function(){},
			        success: function (result) {//请求成功后调用的回调函数
			        	if (result && result.code && result.code != '0') {
			        		modals.error({
			                	text:'操作失败，具体错误：' + result.message,
			                	large: true
		                	});
			                return false;
			            }
			        	if (callback) {
			                callback.call(this, result);
			            }
			        },
			        error: function (err, err1, err2) {
			            console.log("ajaxPost发生异常，请仔细检查请求url是否正确，如下面错误信息中出现success，则表示csrftoken更新，请忽略");
			            if (err && err.readyState && err.readyState == '4') {
			                var sessionstatus = err.getResponseHeader("session-status");
			                if (sessionstatus == "timeout") {
			                    //如果超时就处理 ，指定要跳转的页面
			                    window.location.href = basePath + "/";
			                }
			                else if (err1 == "parsererror") {//csrf异常
			                    var responseBody = err.responseText;
			                    if (responseBody) {
			                        responseBody = "{'retData':" + responseBody;
			                        var resJson = eval('(' + responseBody + ')');
			                        jQuery("#csrftoken").val(resJson.csrf.CSRFToken);
			                        this.success(resJson.retData, 200);
			                    }
			                    return;
			                } else {
			                    modals.error({
			                        text: JSON.stringify(err) + '<br/>err1:' + JSON.stringify(err1) + '<br/>err2:' + JSON.stringify(err2),
			                        large: true
			                    });
			                    return;
			                }
			            }

			            modals.error({
			                text: JSON.stringify(err) + '<br/>err1:' + JSON.stringify(err1) + '<br/>err2:' + JSON.stringify(err2),
			                large: true
			            });
			        },
			        complete:function(msg){}
				})
			},
			ajaxPut: function (url, params, callback){
				if (params && typeof params == "object") {
			        params = deleteEmptyProp(params);
			    }
				jQuery.ajax({
					url: url,
					type: 'put',
			        data: JSON.stringify(params),
			        dataType: 'json',
		    		contentType : 'application/json',
					beforSend:function(){},
			        success: function (result) {
		        		if (result && result.code && result.code != '0') {
		        			modals.error({
			                	text:'操作失败，具体错误：' + result.message,
			                	large: true
		                	});
			            }
		        		if (callback) {
			                callback.call(this, result);
			            }
			        },
			        error: function (err, err1, err2) {
			        	 modals.error({
		                        text: JSON.stringify(err) + '<br/>err1:' + JSON.stringify(err1) + '<br/>err2:' + JSON.stringify(err2),
		                        large: true
	                     });
	                     return;			        
	                },
			        complete:function(msg){}
				})
			},
			ajaxGet: function (url, params, callback){
				if (params && typeof params == "object") {
			        params = deleteEmptyProp(params);
			    }
				jQuery.ajax({
					url: url,
					type: 'get',
			        data: params,
					beforSend:function(){},
			        success: function (result) {
			        	if (result && result.code && result.code != '0') {
			                modals.error({
			                	text:'操作失败，具体错误：' + result.message,
			                	large: true
		                	});
			                return false;
			            }
			        	if (callback) {
			                callback.call(this, result);
			            }
			        },
			        error: function (err, err1, err2) {
			        	 modals.error({
		                        text: JSON.stringify(err) + '<br/>err1:' + JSON.stringify(err1) + '<br/>err2:' + JSON.stringify(err2),
		                        large: true
	                     });
	                     return;			        
	                },
			        complete:function(msg){ 
			        	
			        }
				})
			},
			ajaxDelete: function (url, params, callback){
				if (params && typeof params == "object") {
			        params = deleteEmptyProp(params);
			    }
				jQuery.ajax({
					url: url,
					type: 'delete',
			        data: params,
					beforSend:function(){},
			        success: function (result) {
			        	if (result && result.code && result.code != '0') {
			        		modals.error({
			                	text:'操作失败，具体错误：' + result.message,
			                	large: true
		                	});
			                return false;
			            }
			        	if (callback) {
			                callback.call(this, result);
			            }
			        },
			        error: function (err, err1, err2) {
			        	 modals.error({
		                        text: JSON.stringify(err) + '<br/>err1:' + JSON.stringify(err1) + '<br/>err2:' + JSON.stringify(err2),
		                        large: true
	                     });
	                     return;
			        },
			        complete:function(msg){}
				})
			},
			formData:function(formData,url, callback, errorback){
			//遮盖层
			var $wrapper = $(document.body);
	            $.ajax({
	                type: 'post',
	                url: url,
	                data: formData,
	                dataType: "json",
	                contentType: false,// 当有文件要上传时，此项是必须的，否则后台无法识别文件流的起始位置(详见：#1)
	                processData: false,// 是否序列化data属性，默认true(注意：false时type必须是post，详见：#2)
	                beforeSend: function () {
						$wrapper.spinModal();
	                },
	                success: function(result) {
	                 	callback(result);
	                 	$wrapper.spinModal(false);
	                },
	                error: function (errorMsg) {
	                	$wrapper.spinModal(false);
	                },
	                complete: function (XMLHttpRequest, status) {
	                    $wrapper.spinModal(false);
	                }
	            })
	        }
		},
		file : {
			//上传
			upload:function(formData, callback, errorback){
				var url = basePath + "/resource/rest/upload";
				ToolApi.ajax.formData(formData,url, callback, errorback);
			},
			//下载
			download:function(ywid){
				var url = basePath + "/resource/download?id=" + ywid;
				window.open(url);
			},
			//获取资源对象
			get:function(ywid,callback){
				
				var url = basePath + "/resource/rest/" + ywid;
				 $.ajax({
	                type: 'GET',
	                url: url,
	                dataType: "json",
	                beforeSend: function () {
				
	                },
	                success: function(result) {
	                 	callback(result);
	                },
	                error: function (errorMsg) {
	                },
	                complete: function (XMLHttpRequest, status) {
	                    
	                }
	            })
			}
		},
		dictionary:{
			init : function(noLoad){
				var url = basePath + "/dictionary/listAll";
				ToolApi.ajax.ajaxGet(url, null, function(result){
						var _CODEMAP = new ToolApi.Map();
						$(result).each(function(_i,_o){
							//是否存在此类型的字典
							if(_CODEMAP.get(_o.datatype) !=null){
								var TYPEMAP = _CODEMAP.get(_o.datatype);
								TYPEMAP.put(_o.value,_o.display);
								
								_CODEMAP.remove(_o.datatype);
								_CODEMAP.put(_o.datatype,TYPEMAP);
							}else{							
								var TYPEMAP = new ToolApi.Map();
								TYPEMAP.put(_o.value,_o.display);
								_CODEMAP.put(_o.datatype,TYPEMAP);
							}
						});
						
						if(!noLoad){
							ToolApi.dictionary.load(_CODEMAP);
						}
						
						return _CODEMAP;
				}) 
			},
			
			load : function(_CODEMAP){
				
				//加载SELECT标签
				$("select").each(function(_i,_o){
					var datatype = $(_o).attr(CONSTANT.DICTIONARY.DATA_TYPE);
					var datavalue = $(_o).attr(CONSTANT.DICTIONARY.DATA_VALUE); 
					if(datatype !=null && datatype !="0"){
						var typeMap = _CODEMAP.get(datatype);
						var _html  = "<option value=\"\">请选择..</option>";
						for(var i = 0; i < typeMap.size(); i++ ){
							var map = typeMap.element(i);
							if(map.key == datavalue){
								_html += "<option value=\"" + map.key + "\" selected>" + map.value + "</option>";
							}else{
								_html += "<option value=\"" + map.key + "\">" + map.value + "</option>";
							}
						}
						$(_o).empty();
						$(_o).append(_html);
					}
				});
				
				//其他页签
			},
			getMap : function(){
				
				return CODEMAP;
			}
		},
		//自动下拉
		autoSelect :{
				init : function(){
									
				}
		},
		area:{
			init:function(noLoad){
				$("select").each(function(_i,_o){
					var dataarea = $(_o).attr(CONSTANT.AREA.DATA_AREA);
					var datavalue = $(_o).attr(CONSTANT.AREA.DATA_VALUE);
					var datarefer = $(_o).attr(CONSTANT.AREA.DATA_REFER);
					if(!dataarea) return ;
					switch(dataarea){
						case "1":
							//加载数据
							ToolApi.area.load("0",_o);
							$(_o).bind("change",function(){
								var code = $("#"+ this.id +" option:selected").attr(CONSTANT.AREA.DATA_VALUE);
								var refer = ToolApi.area.getRefer($(this)); //获取引用的元素
								//加载引用的数据
								ToolApi.area.load(code,refer);
							});
							break;
						case "2":
						
							$(_o).bind("click",function(){
								var thLength = $("select[name="+this.name+"] option").length ;
								var referValue = $("#" + $(this).attr(CONSTANT.AREA.DATA_REFER)).val();
								if((referValue  == null || referValue=="")&& thLength <2){
									$.dialog.alert($("#" + $(this).attr(CONSTANT.AREA.DATA_REFER)).attr("placeholder"));
								}
							});
							
							$(_o).bind("change",function(){
								var code = $("#"+ this.id +" option:selected").attr(CONSTANT.AREA.DATA_VALUE);
								var refer = ToolApi.area.getRefer($(this)); //获取引用的元素
								ToolApi.area.load(code,refer);
								
							});
							break;
						case "3":
							$(_o).bind("click",function(){
								var thLength = $("select[name="+this.name+"] option").length;
								var referValue = $("#" + $(this).attr(CONSTANT.AREA.DATA_REFER)).val();
								if((referValue  == null || referValue=="") && thLength <2){
									$.dialog.alert($("#" + datarefer).attr("placeholder"));
								}
							});
							break;
						default:
							console.log("非法值");
							break;
					}
			
				});
				 
			},
			load:function(parentid,element){
				var url = basePath + "/area/list?parentid=" + parentid;
				ToolApi.ajax.ajaxGet(url, null, function(result){
					var _html  = "<option value=\"\">请选择..</option>";
					var isSelected = false;
					$(result).each(function(_i,_o){
						if(_o.code == $(element).attr(CONSTANT.AREA.DATA_VALUE)){
							_html += "<option value=\"" + _o.code + "\" datavalue=\"" + _o.id + "\" selected >" + _o.name + "</option>";
							isSelected = true;
						}else{
							_html += "<option value=\"" + _o.code + "\" datavalue=\"" + _o.id + "\" >" + _o.name + "</option>";
						}
					});
				 	$(element).empty();
					$(element).append(_html);
					
					//如果已经赋值，就触发事件，加载下级
					if(isSelected){
						$(element).trigger("change");
					}
				});
				
			},
			getRefer:function(refer){
				//console.log("id="+$(refer).attr("id"));
				var tag = document.getElementsByTagName("select");
				for(var i= 0 ; i<tag.length ; i ++ ){
						var _obj = tag[i];
						if($(_obj).attr(CONSTANT.AREA.DATA_REFER) == $(refer).attr("id")){
							return _obj;
						}
						
				}
			}
		},
		Map:function(){  
		    this.elements = new Array();  
		    this.size = function() {  
		        return this.elements.length;  
		    }  
		  
		    this.isEmpty = function() {  
		        return (this.elements.length < 1);  
		    }  
		  
		    this.clear = function() {  
		        this.elements = new Array();  
		    }  
		  
		    this.put = function(_key, _value) {  
		        this.elements.push( {  
		            key : _key,  
		            value : _value  
		        });  
		    }  
		  
		    this.remove = function(_key) {  
		        var bln = false;  
		  
		        try {  
		            for (i = 0; i < this.elements.length; i++) {  
		                if (this.elements[i].key == _key) {  
		                    this.elements.splice(i, 1);  
		                    return true;  
		                }  
		            }  
		        } catch (e) {  
		            bln = false;  
		        }  
		        return bln;  
		    }  
		  
		    this.get = function(_key) {  
		        try {  
		            for (i = 0; i < this.elements.length; i++) {  
		                if (this.elements[i].key == _key) {  
		                    return this.elements[i].value;  
		                }  
		            }  
		        } catch (e) {  
		            return null;  
		        }  
		    }  
		  
		    this.element = function(_index) {  
		        if (_index < 0 || _index >= this.elements.length) {  
		            return null;  
		        }  
		        return this.elements[_index];  
		    }  
		  
		    this.containsKey = function(_key) {  
		        var bln = false;  
		        try {  
		            for (i = 0; i < this.elements.length; i++) {  
		                if (this.elements[i].key == _key) {  
		                    bln = true;  
		                }  
		            }  
		        } catch (e) {  
		            bln = false;  
		        }  
		        return bln;  
		    }  
		  
		    this.containsValue = function(_value) {  
		        var bln = false;  
		        try {  
		            for (i = 0; i < this.elements.length; i++) {  
		                if (this.elements[i].value == _value) {  
		                    bln = true;  
		                }  
		            }  
		        } catch (e) {  
		            bln = false;  
		        }  
		        return bln;  
		    }  
		  
		    this.values = function() {  
		        var arr = new Array();  
		        for (i = 0; i < this.elements.length; i++) {  
		            arr.push(this.elements[i].value);  
		        }  
		        return arr;  
		    }  
		  
		    this.keys = function() {  
		        var arr = new Array();  
		        for (i = 0; i < this.elements.length; i++) {  
		            arr.push(this.elements[i].key);  
		        }  
		        return arr;  
		    }  
		},
    date:{
        format:function(ns){
            if(!ns) return "";
            var date = new Date(ns);
            return date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + "&nbsp;" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        },
        getThisYear:function () {
            return new Date().getFullYear();
        },
        getThisMonth:function () {
            return new Date().getMonth() + 1 ;
        },
        getThisDate:function () {
            return new Date().getDate();
        },
        getThisYYYMMDD:function () {
            var date = new Date();
            return (date.getFullYear()+'年'+(date.getMonth()+1)+'月'+date.getDate());
        }
    },
    string:{
        isEmpty:function (str) {
            if(str=="" || str == null || str=="null" || typeof(str)=="undefined"){
                return true;
            }
            return false;

        },
        isNotEmpty:function (str) {
            return tool.string.isEmpty(str) == true ? false :true ;
        }
    },
    browser:{
        IsPC:function(){
                var userAgentInfo = navigator.userAgent;
                var Agents = ["Android", "iPhone",
                    "SymbianOS", "Windows Phone",
                    "iPad", "iPod"];
                var flag = true;
                for (var v = 0; v < Agents.length; v++) {
                    if (userAgentInfo.indexOf(Agents[v]) > 0) {
                        flag = false;
                        break;
                    }
                }
                return flag;
        },
        IsPhone:function(){
            return tool.browser.IsPC() == true?false:true;
        },
        IsWeChar:function(){
            var ua = navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i)=="micromessenger") {
                return true;
            } else {
                return false;
            }
        }
    },
    sms:{
        send : function(btn,mobile,count) {
            var InterValBtn = btn;
            if(mobile == "") return;
            if(!count) window.curCount = CONSTANT.SMS.COUNT;
            //设置button效果，开始计时
            $(InterValBtn).attr("disabled", "true");
            $(InterValBtn).text(window.curCount + "秒后重新获取");
            window.InterValObj = window.setInterval(function(){
            	ToolApi.sms.setRemainTime(InterValBtn);
            }, 1000); //启动计时器，1秒执行一次
            var params = {"mobile": mobile};
            ToolApi.ajax.ajaxPost(basePath + "/enterprise/base/sendSms/" + mobile,JSON.stringify(params),function (result) {
            	console.log(result);
                if(result || result == "true"){
                   $.dialog.alert("手机验证码发送成功，请留意手机短信!")
                }else{
                    $.dialog.alert("手机验证码发送失败，请重新获取！")
                }
            })
            
        },
        setRemainTime : function(InterValBtn) {
            if (window.curCount == 0) {
                window.clearInterval(window.InterValObj);//停止计时器
                $(InterValBtn).removeAttr("disabled");//启用按钮
                $(InterValBtn).text("重新获取验证码");
            }
            else {
                window.curCount--;
                $(InterValBtn).text(curCount + "秒后重新获取");
            }
        }

    },
    dataTable:{
    	/**
    	 *param为json对象
    	 *一、param对象说明
    	 *1.1、url:查询地址					  【必设属性】
    	 *1.2、tableid:表格id				  【必设属性】
    	 *1.3、columns:列组(与thoad中的列对应)【必设属性】
    	 *1.4、type:查询方式(POST/GET)		  【必设属性】
    	 *1.5、formid：查询表单formid
    	 *1.6、config:DataTable配置，#参考：http://www.cnblogs.com/liang-ling/p/5853156.html
    	 *二、方法
    	 *2.1、draw()： 查询
    	 *三、其他说明
    	 *3.1：默认返回dataTable对象
    	*/
    	init:function(param){
    		var $wrapper = $('#'+ param.tableid);
    		var $table = $("#" + param.tableid);
    		var $param = param;
    		var defaultConfig = CONSTANT.DATA_TABLES.DEFAULT_OPTION;
    		for(var c in $param.config){
    			defaultConfig[c] = $param.config[c];
    		}
    		var dataTable = $table.dataTable($.extend(true,{},defaultConfig, {
	    		columns:$param.columns,
				pagingType: "full_numbers", 
				ajax : function(data, callback, settings) {
						$wrapper.spinModal();
						var pageParams = ToolApi.dataTable.paging(data,$param.formid);
						//如果是POST需要使用JSON.stringify
						if($param.type != "GET")pageParams = JSON.stringify(pageParams);
						$.ajax({
					            type: $param.type,
					    	    url: $param.url,
					    	    cache: false, 
					    	    data: pageParams, 
					    	    dataType: 'json',
				    		    contentType : 'application/json',
					            success: function(result) {
					            	console.log(result);
					            	
				            		if (result.code=="0") {
				            			$.dialog.alert("查询失败,"+result.message);
				            			return;
									}
				            		
				            		var returnData = {};
					            	returnData.draw = data.draw;
					            	returnData.recordsTotal = result.total;
					            	returnData.recordsFiltered = result.total;
					            	returnData.data = result.list;
					            	callback(returnData);
					            	$wrapper.spinModal(false);
					            },
					            error: function(XMLHttpRequest, textStatus, errorThrown) {
					                $.dialog.alert("查询失败");
					                $wrapper.spinModal(false);
					            }
					        });
					}
					
    		})).api();
    		
    		return dataTable;
    		
    	}, //分页对象
    	paging:function(data,dataTableSearchForm){
    			var param = {};
	    		//组装排序参数
				if (data.order&&data.order.length&&data.order[0]) {
					param.orderBy=data.columns[data.order[0].column].data + " " + data.order[0].dir; //排序参数
				}
				//组装查询参数
				if (dataTableSearchForm) {
					//把form里面的数据序列化成数组
			    	 var formData = $("#"+dataTableSearchForm).serializeArray();
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
   
}

//递归删除空属性防止把null变成空值
function deleteEmptyProp(obj) {
    for (var a in obj) {
        if (typeof (obj[a]) == "object" && obj[a] != null) {
            deleteEmptyProp(obj[a]);
        }
        else {
            if (!obj[a]) {
                delete obj[a];
            }
        }
    }
    return obj;
}