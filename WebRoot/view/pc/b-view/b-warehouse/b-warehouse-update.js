var bWarehouseWinEdit;
var bWarehouseFormEdit;
function updateBWarehouse(){
	var record = grid.getSelectionModel().selected;
	if(record.length == 0){
		msgTishi('请选择要修改的一项！');
		return;
	}
	initBWarehouseFormEdit();
	xtCityList.load({params:{parentId:record.items[0].data.xt_provinceID}});
	var parm = {parentId:record.items[0].data.xt_provinceID};
    beforeloadstoreByStore(xtCityList,parm);
	xtDistrictList.load({params:{parentId:record.items[0].data.xt_cityID}});
	parms = {parentId:record.items[0].data.xt_cityID};
    beforeloadstoreByStore(xtDistrictList,parms);
	bWarehouseWinEdit = Ext.create('Ext.Window',{
		layout:'fit',
		width:800,
		height:400,
		maximizable:true,
		minimizable:true,
		animateTarget:document.body,
		plain:true,
		modal:true,
		title:'编辑信息',
		listeners:{
			minimize:function(win,opts){
				win.collapse();
			}
		},
		items:bWarehouseFormEdit,
		buttons:[{
			text:'保存',
			itemId:'save',
			handler:function(button){
				submitForm(bWarehouseFormEdit,'../bWarehouseController/updateBWarehouse',grid,bWarehouseWinEdit,false,true);
			}
		},{
			text:'关闭',
			itemId:'close',
			handler:function(button){
				button.up('window').close();
			}
		}]
	});
	bWarehouseWinEdit.show();
	loadFormData(bWarehouseFormEdit,'../bWarehouseController/getBWarehouseById?b_warehouse_id='+ record.items[0].data.b_warehouse_id);
}
function initBWarehouseFormEdit(){
	bWarehouseFormEdit = Ext.create('Ext.FormPanel',{
		xtype:'form',
		waitMsgTarget:true,
		defaultType:'textfield',
		fieldDefaults:{
			labelWidth:70,
			labelAlign:'left',
			flex:1,
			margin:'2 5 4 5'
		},
		items:[
		{
			fieldLabel:'仓库编号',
			xtype:'textfield',
			hidden:true,
			name:'b_warehouse_id',
			allowBlank:false,
			maxLength:32,
			anchor:'100%'
		},
		{
			fieldLabel:'商户编号',
			xtype:'textfield',
			hidden:true,
			name:'b_seller_id',
			id:'b_seller_id',
			allowBlank:false,
			maxLength:32,
			anchor:'100%'
		},
		{
			fieldLabel:'仓库名称',
			xtype:'textfield',
			name:'b_warehouse_name',
			maxLength:100,
			anchor:'60%'
		},
		{
			fieldLabel:'归属商户',
			xtype:'textfield',
			name:'b_seller_name',
			id:'b_seller_name',
			allowBlank:false,
			anchor:'60%',
			readOnly:true,
			listeners:{
				render:function(p){   
			     	p.getEl().on('click',function(p){   
			     		selectBSeller();
				    });
			    }
			}
		},
		{
			fieldLabel:'省&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;份',
			name:'xt_provinceID',
			xtype:"combo",
			store:xtProvinceList, 
            emptyText:'请选择',  
            mode:'local',  
            triggerAction:'all',  
            valueField:'ID',  
		    displayField:'NAME',  
            editable:false, 
			allowBlank:false,
			maxLength:32,
			anchor:'60%',
			listeners:{
                 select:function(combo,records,options){
                	Ext.getCmp('xt_cityID').setValue("");
		         	Ext.getCmp('xt_districtID').setValue("");
		            xtCityList.load({params:{parentId:this.value}});
		            parms = {parentId:this.value};
		    	    beforeloadstoreByStore(xtCityList,parms);
		            xtDistrictList.load();
		            parms = {parentId:null};
		    	    beforeloadstoreByStore(xtDistrictList,parms);
                    /**设置默认选中第一行的值
                    xtCityList.on('load',function(store,record,opts){                                    
                     var xt_cityID = record[0].data.xt_cityID;
                     var xt_cityName=record[0].data.xt_cityName;
                     xtCityList.setValue(xt_cityID);
                     xtCityList.setDisplayValue(xt_cityName);
                    });
                    **/
                 }
             }
		},
		{
			fieldLabel:'城&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;市',
			id:'xt_cityID',
			name:'xt_cityID',
			xtype:"combo",
			store:xtCityList, 
            emptyText:'请选择',  
            mode:'local',  
            triggerAction:'all',  
            valueField:'ID',  
		    displayField:'NAME',  
            editable:false, 
			allowBlank:false,
			maxLength:32,
			anchor:'60%',
			listeners:{
                 select:function(combo,records,options){
                	Ext.getCmp('xt_districtID').setValue("");
		            xtDistrictList.load({params:{parentId:this.value}});
		            parms = {parentId:this.value};
		    	    beforeloadstoreByStore(xtDistrictList,parms);
                 }
             }
		},
		{
			fieldLabel:'区&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;县',
			xtype:'textfield',
			id:'xt_districtID',
			name:'xt_districtID',
			xtype:"combo",
			store:xtDistrictList, 
            emptyText:'请选择',  
            mode:'local',  
            triggerAction:'all',  
            valueField:'ID',  
		    displayField:'NAME',  
            editable:false, 
			maxLength:32,
			anchor:'60%'
		},
		{
			fieldLabel:'详细地址',
			xtype:'textareafield',
			name:'b_warehouse_address',
			maxLength:200,
			anchor:'100%'
		},
		{
			fieldLabel:'仓库类型',
			name:'b_warehouse_type',
			xtype:"combo",
            store:[["0","赠品"],["1","疵品"],["2","正品"]],
            emptyText:"请选择",
            mode:"local",
            value:'0',
            triggerAction:"all",
            editable:false,
			hiddenName:'b_warehouse_type',
			allowBlank:false,
			anchor:'40%'
		}
		]
	});
}
