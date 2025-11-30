jQuery(document).ready(function(){
	jQuery('.buttonset').buttonset();
});

jQuery(document).ready(function( $ ){
	jQuery.fn.reverse = [].reverse;

	jQuery('.form-table').delegate("#nhp-opts-button-hide-below", "click", function(){
		var num = jQuery(this).parent().data('hide');
		jQuery(this).closest('tr').nextAll('tr:lt('+num+')').reverse().each(function(index, el) {
				$(this).hide();
			});
	});
	jQuery('.form-table').delegate("#nhp-opts-button-show-below", "click", function(){
		var num = jQuery(this).parent().data('hide');
		jQuery(this).closest('tr').nextAll('tr:lt('+num+')').reverse().each(function(index, el) {
				$(this).show();
				if ($(this).find('#nhp-opts-button-show-below').length && $(this).find('#nhp-opts-button-show-below').hasClass('ui-state-active')) {
					$(this).find('#nhp-opts-button-show-below').click();
				} else if ($(this).find('#nhp-opts-button-hide-below').length && $(this).find('#nhp-opts-button-hide-below').hasClass('ui-state-active')) {
					$(this).find('#nhp-opts-button-hide-below').click();
				}
			});
	});
	
	jQuery('.buttonset-hide #nhp-opts-button-show-below').reverse().each(function(){
		if(jQuery(this).hasClass('ui-state-active')){
			$(this).click();
		}
	});
	jQuery('.buttonset-hide #nhp-opts-button-hide-below').reverse().each(function(){
		if(jQuery(this).hasClass('ui-state-active')){
			$(this).click();
		}
	});
	
	jQuery('.form-table').delegate(".ui-buttonset .ui-button", "click", function(event){
		//jQuery("html, body").animate({ scrollTop: jQuery(this).parent(".ui-buttonset").offset().top - 100 }, 600);
	});

});