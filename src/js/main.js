$(document).ready( function(){
	/* Draw pie chart */
	var chart = document.getElementById("pie-chart");
	chart.width = 150;
	chart.height = 150;

	var ctx = chart.getContext("2d");

	function drawLine(ctx, startX, startY, endX, endY){
	    ctx.beginPath();
	    ctx.moveTo(startX,startY);
	    ctx.lineTo(endX,endY);
	    ctx.stroke();
	}

	function drawArc(ctx, centerX, centerY, radius, startAngle, endAngle){
	    ctx.beginPath();
	    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
	    ctx.stroke();
	}

	function drawPieSlice(ctx,centerX, centerY, radius, startAngle, endAngle, color ){
	    ctx.fillStyle = color;
	    ctx.beginPath();
	    ctx.moveTo(centerX,centerY);
	    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
	    ctx.closePath();
	    ctx.fill();
	}

	var Piechart = function(options){
	  this.options = options;
	  this.canvas = options.canvas;
	  this.ctx = this.canvas.getContext("2d");
	  this.colors = options.colors;

  	this.draw = function(){
	    var total_value = 0.0;
	    var color_index = 0;
	    for (var categ in this.options.data){
	        var val = this.options.data[categ];
	        total_value += val;
	    }

	    var start_angle = 1.5*Math.PI;
	    for (categ in this.options.data){
	      val = this.options.data[categ];
	      var slice_angle = 2 * Math.PI * val / total_value;

	      drawPieSlice(
	          this.ctx,
	          this.canvas.width/2,
	          this.canvas.height/2,
	          Math.min(this.canvas.width/2,this.canvas.height/2),
	          start_angle,
	          start_angle+slice_angle,
	          this.colors[color_index%this.colors.length]
	      );

	      start_angle += slice_angle;
	      color_index++;
	    }

	    start_angle = 1.5*Math.PI;
	    for (categ in this.options.data){
        val = this.options.data[categ];
        slice_angle = 2 * Math.PI * val / total_value;
        var pieRadius = Math.min(this.canvas.width/1.6,this.canvas.height/1.6);
        var labelX = this.canvas.width/2 + (pieRadius / 2) * Math.cos(start_angle + slice_angle/2);
        var labelY = this.canvas.height/2 + (pieRadius / 2) * Math.sin(start_angle + slice_angle/2);
     
        if (this.options.doughnutHoleSize){
            var offset = (pieRadius * this.options.doughnutHoleSize ) / 2;
            labelX = this.canvas.width/2 + (offset + pieRadius / 2) * Math.cos(start_angle + slice_angle/2);
            labelY = this.canvas.height/2 + (offset + pieRadius / 2) * Math.sin(start_angle + slice_angle/2);               
        }
     
        var labelText = Math.round(100 * val / total_value);
        this.ctx.fillStyle = "white";
        this.ctx.font = 'Octarine';
        this.ctx.fillText(labelText+"%", labelX,labelY);
        start_angle += slice_angle;
	    }
	  }
	}

	var dataForPie = {
		"title": "Title of the chart",
		"data": {
			"Foo": 22,
			"Bar": 33,
			"Baz": 10.5,
			"Daftcode": 80
		},
		"leading_color": [
			"#0d47a1",
			"#1565c0",
			"#1976d2",
			"#1e88e5"
		]
	};

	$("#data-pie .diagram-title").text(dataForPie.title);
	if(dataForPie.leading_color !== undefined){
		var myPiechart = new Piechart(
			{
				canvas: chart,
				data: dataForPie.data,
				colors: dataForPie.leading_color
			}
		);
	} else {
		var myPiechart = new Piechart(
			{
				canvas: chart,
				data: dataForPie.data,
				colors: ["#467fcf", "e3e3e3", "#ffffff", "#e9e9e9"]
			}
		);
	}
	myPiechart.draw();

	$('#data-loader').click(function(){
		dataForPie = {
			"title": "Something else",
			"data": {
				"Daft": 10,
				"Code": 20,
				"Example": 50
			},
			"leading_color": [
				"#fde23e",
				"#f16e23",
				"#57d9ff",
			]
		}
		$("#data-pie .diagram-title").text(dataForPie.title);
		myPiechart = new Piechart(
				{
					canvas: chart,
					data: dataForPie.data,
					colors: dataForPie.leading_color
				}
		);
		myPiechart.draw();
	});

	/* Main form */

	var dataForm = {
		"fields": [
			{
				"label": "Full name",
				"required": true,
				"type": "text",
				"field_name": "full_name"
			},
			{
				"label": "Company",
				"required": true,
				"type": "text",
				"field_name": "company"
			},
			{
				"label": "Email",
				"required": true,
				"type": "email",
				"field_name": "email"
			},
			{
				"label": "Phone number",
				"required": false,
				"type": "text",
				"field_name": "phone"
			},
		],
		"submit_text": "Submit data",
		"url": "https://httpbin.org/post",
		"method": "POST"
	};

	console.log("field " + dataForm.fields[0].field_name);
	for (var i = 0; i < dataForm.fields.length; i++){
		
		$('#form').append("<label for=\"" + dataForm.fields[i].field_name + "\">" + dataForm.fields[i].label + "</label>");
		var required = "";
		if(dataForm.fields[i].required == true) {
				required = "required";
				$('#form label').addClass('red-star');
			} else {
				required = "";
			}
		$('#form').append("<input id=\""+dataForm.fields[i].field_name+"\" type=\""+dataForm.fields[i].type+"\" "+required+">");
	}
	/* button submit */
	$('#form').append("<button id=\"form-btn\" type=\"submit\">"+dataForm.submit_text+"</button>")

	$('#form').submit(function(event) {
		event.preventDefault();
		$.ajax({
			type: dataForm.method,
			url: dataForm.url,
			data: $(this).serialize()
		}).done(function() {
			$(this).find("input").val("");
			// put flach message with JSON
			$("form").trigger("reset");
		});
		return false;
	});


	/* Zadanie 2*/
	const myList = [1,2,3];
	for (var item = 0; item < myList.length; item++){
		console.log(myList[item]);
	}

	/* Zadanie 3 - Palindrom */
	var text = "aa  cd dc, aa.";

	function palindrom(str) {
	 var re = /[^A-Za-z0-9]/g;
	 str = str.toLowerCase().replace(re, '');
	 var len = str.length;
	 for (var i = 0; i < len/2; i++) {
	   if (str[i] !== str[len - 1 - i]) {
	       return false;
	   }
	 }
	 return true;
	}
	console.log(palindrom(text));

	/* Zadanie 5 */
	var Person = function(imie, waga){
		this.imie = imie;
		this.waga = waga;
	}

	Person.prototype.fun = function() {
		console.log("Nazywam się "+this.imie+" i ważę "+this.waga+" kg");
	}

	var person = new Person("kisa", 3.3);
	person.fun();

	$('#add_cat').click(function(){
		$('.cat-modal').toggleClass('cat-modal-active');
		$('.display-shadow').css('display', 'block');
	});

	$('#modal-close').click(function(){
		$('.cat-modal').toggleClass('cat-modal-active');
		$('.display-shadow').css('display', 'none');
	});

	$('#btn_cat').click(function(){
		var imie = document.getElementById("cat_name").value;
		var waga = document.getElementById("cat_waga").value;

		person = new Person(imie, waga);
		
		$('.cat-list').append("<p>Nazywam się <span>"+person.imie+"</span> i ważę "+person.waga+" kg</p>");
		
		$('.cat-list').append("<button id=\"miaucz\">Miaucz</button><br>");

		$(".cat-display").find("input").val("");
		
		$('.cat-modal').toggleClass('cat-modal-active');
		$('.display-shadow').css('display', 'none');
	});

	$('.cat-list').on('click', '#miaucz', function(e){
     alert('Miaucz ' + person.imie);  	
   });

});