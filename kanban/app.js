

jQuery(function ($) {
  // custom formatting example
  $('.count-number').data('countToOptions', {
	formatter: function (value, options) {
	  return '$'+value.toFixed(options.decimals).replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
	}
  });
  
  // start all the timers
  $('.timer').each(count);  
  
  function count(options) {
	var $this = $(this);
	options = $.extend({}, options || {}, $this.data('countToOptions') || {});
	$this.countTo(options);
  }

  $(".shape").shape();
  $(".addItem").on('click',function(e){
    $(e.target).parents('.shape').shape('flip over');
  })
  $(".saveBtn").on('click', function (e) {
    $(e.target).parents('.shape').shape('flip over');
  })
  $('.menu .item')
    .tab()


  

});