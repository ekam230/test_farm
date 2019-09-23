

// let item_list =''

desktopApp = {	
	buttonCount: 1,	
	item_list:'',
	init: function(){
		webix.env.codebase = "./";
		this.createLayout();
		this.createToolbar();
		this.startTime();
		this.createMenu();
	},
	createLayout: function(){
		webix.ui({
			id: "screens",
			animate: false,
			cells:[
				{
					view:"layout",
					id: "main",
					css:"desktop-layout",
					type: "clean",
					cols:[					
					]
				}
			]
		});

		webix.ui({					
			id:"App",
			view:"window",
			height:800,
			width:400,
			move:true,
			close:true,
			position:"center",
			head:"Users Manager",			
			body:{
				rows:[						
					{
					view:"list", 
					id:"mylist",
                    template:"#name#", // which data to show
                    select:true, //enables selection 
                    height:400,
                    data:user_list,
					on:{
						onItemClick: function(id){
							// console.log(this.getItem(id));
							desktopApp.item_list = this.getItem(id);
							$$("edit").enable();
						}
					}
					},
					{						
						view:"toolbar", elements:[
							{ view:"button", value:"Добавить", width:100,
								click:function(){
									$$("win2").show({x:$$("App")['$view'].offsetLeft+450, y:$$("App")['$view'].offsetTop});
									$$('myform').clear();
									var edit_button = $$('myform').getChildViews()[2];
									edit_button.setValue('Добавить');
								}
							},
							{ id:"edit",view:"button", value:"Изменить", width:100,click: this.edit_row},
							{ view:"button", value:"Удалить", width:100,click:this.delete_row },							
						]
					},
				],
			},									
	});	

	webix.ui({					
		id:"win2",
		view:"window",
		height:800,
		width:400,
		move:true,
		close:true,
		head:"Edit User",		
		body:{
			rows:[						
				{view:"form", id:"myform", width:200, elements:[
					  { view:"text", name:"name", placeholder:"Имя"},
					  { view:"text", name:"password", placeholder:"Пароль"},
					  { view:"button", value:"Добавить", width:100, click:this.save_row }
					]
				  },
			],
		}								
	});
	},	
	
	showApp: function(id){
		if ($$(id).config.hidden === false){
			$$(id).hide();
		}else{
			$$(id).show();
		}
	},

	createToolbar: function(){
		webix.ui({
			view:"toolbar",
			id:"toolbar",
			paddingY:2, height:40,
			css:"toolbar-bottom",
			cols: [
				{
					view: "button",
					id: "start_button",
					css:"webix_transparent",
					type: "image",
					image: "img/start.png",
					width: 72,
					on: {
						onItemClick: function () {
							if ($$("winmenu").config.hidden === false){
								$$("winmenu").hide();
							}else{
								$$("winmenu").show();
							}
						}
					}
				},
				{},
				{ view:"template", id:"time", width:95, css:"time-template" }
			]
		});
	},

	createMenu: function(){
		webix.ui({
				view:"popup",
				id:"winmenu",
				hidden:true,
				css:"winmenu",
				body: {
					view:"layout",
					height:298,
					width:200,
					id:"lay",
					cols:[
						{
							view:"layout",
							rows:[
								{
									view:"list",
									height:300,
									width:240,
									css:"start-menu-list",
									template:"<div class='desktop-icons start-menu-item'><div class='start-menu-item-image-title'>#title#</div></div>",
									type:{
										height:36
									},
									select:true,
									data:{"title":"Users Manager",id:"app"},
									on:{
										onItemClick: function(id){
											if(id == "app"){
												desktopApp.showApp('App');
												$$("edit").disable();
												$$("winmenu").hide();
											}
										}
									}
								},
							]
						}						
					]
				},
				position:function(state){
					state.left = 0;
					state.top = document.documentElement.clientHeight - 338;
				}
			});
	},
	updateTime: function(){
		var tm=new Date();
		var h=tm.getHours();
		var m= webix.Date.toFixed(tm.getMinutes());
		var s= webix.Date.toFixed(tm.getSeconds());
		var day = tm.getDate();
		var month = tm.getMonth()+1;
		var year = tm.getFullYear();
		var time = +h+":"+m+":"+s;
		var date = month+"/"+day+"/"+year;
		$$("time").setHTML("<div class='toolbar-time'>"+time+"</div><div class='toolbar-time'>"+date+"</div>");
	},
	startTime: function(){
		setInterval(this.updateTime, 100 );
	},

	save_row:function(){
		const formData = $$('myform').getValues();
		if (formData.id){
		  $$("mylist").updateItem(formData.id, formData);
		  webix.message("Пользователь изменен");	}
		else{
		  $$("mylist").add(formData);
		  webix.message("Пользователь добавлен");
		}
	  },

	delete_row: function() {
		const id = $$("mylist").getSelectedId();
		if (id)
		  webix.confirm({
			title: "Удалить пользователя",// the text of the box header
			text: "Продолжить удаление?",// the text of the body
			callback: function(result) { //callback function that will be called on the button click. The result is true or false subject to the clicked button.
			  if (result) {
				$$("mylist").remove(id);
			  }
			}
		  });
		else
		  webix.message("Select a user","debug");
	  },
	
	 
	edit_row:function(){	
			// webix.message("Clicked!");	  
			var edit_button = $$('myform').getChildViews()[2];
			edit_button.setValue('Изменить');
			$$('win2').show({x:$$("App")['$view'].offsetLeft+450, y:$$("App")['$view'].offsetTop});
			$$("myform").setValues(desktopApp.item_list);
	}
};
