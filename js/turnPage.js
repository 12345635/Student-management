(function(){

	function turnPage(options,wrap){

		this.total = options.total || 1;
		this.current = options.current || 1;
		this.chagePage = options.chagePage || function(){};
		this.wrap = wrap;
	}

	turnPage.prototype.init = function(){
		this.fillHTML();
		this.bindEvent();
	}
	turnPage.prototype.fillHTML = function(){
		var pageWrapper = $('<ul class="my-page"></ul>');
		if(this.current > 1){
			$('<li class="my-page-prev">上一页</li>').appendTo(pageWrapper);
		}
		$('<li class="my-page-num">1</li>').addClass(this.current ==1 ?'my-page-current':'').appendTo(pageWrapper);
		if(this.current - 2 - 1 > 1){
			$('<span>...</span>').appendTo(pageWrapper);
		}
		for(var i = this.current -2; i<= this.current +2; i++){
			if(i > 1 && i < this.total){
				$('<li class="my-page-num"></li>').text(i).addClass(this.current == i? 'my-page-current':'').appendTo(pageWrapper);
			}
		}
		if(this.total - (this.current + 2) > 1){
			$('<span>...</span>').appendTo(pageWrapper);
		}
		$('<li class="my-page-num"></li>').text(this.total).addClass(this.current == total?'my-page-current':'').appendTo(pageWrapper);
		if(this.current <= this.total - 1){
			$('<li class="my-page-next">下一页</li>').appendTo(pageWrapper);
		}
		
		this.wrap.html(pageWrapper);
	}	

	turnPage.prototype.bindEvent = function(){
		var self = this;
		$(this.wrap).find('.my-page-prev').click(function(){
			self.current--;
			self.chagePage(self.current);
		}).end().find('.my-page-next').click(function(){
			self.current++;
			self.chagePage(self.current);
		}).end().find('.my-page-num').click(function(){
			self.current = parseInt($(this).text());
			self.chagePage(self.current);
		});
	}
	$.fn.extend({
		page:function(options){
			var p = new turnPage(options,this);
			p.init();
		}
	})
})();