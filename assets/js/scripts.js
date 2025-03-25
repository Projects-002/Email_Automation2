
// // IIFE - Immediately Invoked Function Expression
var lastCheckEmail  = {lookup:false, result:false};
var lastCheckDomain = {lookup:false, result:false};

(
	function(et_init) {

		/**
		 * FIX (hack)
		 * Prevent autoload on pageload || page refresh
		 * Note: Saved data in 'cf7msm_posted_data' is not lost!
		 */ 
		cf7msm_posted_data = {}

		// The global jQuery object is passed as a parameter
		et_init(window.jQuery, window, document)

	} (function($, window, document) {

		// The $ is now locally scoped 
		$(function() {
			// STEP 1 (Form #1)
			/**
			 * Disable by default the submit button's on different forms.
			 * Note: - disabling generally it is not useful for us, as we do have informative forms only.
			 */
			$('form#step-1 :input[type="submit"]').prop('disabled', true)

			/**
			 * Watcher over the first step form's variables
			 * Variables used to determine if the second form is accesible by the user.
			 */
			let etVariable = (function (context) {
				return function(varName, varValue) {
					let value = varValue

					Object.defineProperty(context, varName, {
						get: function() {
							return value
						},
						set: function(v) {
							value = v
							firstStepSubmitActivator()
						}
					})
				}
			})(window)

			/**
			 * Watching the consent checkbox on the first step form.
			 */
			$("#consent").change(function() {
				firstStepSubmitActivator()
			})

			// Create the variables
			etVariable('email_is_ok', false)
			etVariable('email_is_pro', false)
			etVariable('domain_is_ok', false)

			// Validator methods
			$.validator.addMethod("uniqueEmail", function (value, element) {
				let apiUrl = ETScriptVars.root + '/check-email/' + encodeURIComponent(value)
				let var_result = false
				if (lastCheckEmail.lookup == value) {
					var_result = lastCheckEmail.result
					email_is_ok = lastCheckEmail.result
				} else {
					$.ajax({
						type: "GET",
						url: apiUrl,
						dataType: "JSON",
						success: function (data) {
							if (data.data.content.duplicate == true) {
								var_result = false
							} else {
								email_is_ok = true
								var_result = true
							}
						},
						async: false
					})
				}
				lastCheckEmail.lookup = value;
				lastCheckEmail.result = var_result;
				return var_result
			})

			$.validator.addMethod("validEmailDomain", function(value, element) {
				let domain = value.split('@')[1]
				let is_valid_domain = true
				let disposableEmails = []

				$.ajax({
					url: ETIncludeData.disposableEmailsPath,
					dataType: 'json',
					async: false,
					success: function(data) {
						disposableEmails = data.emails
						if (disposableEmails.indexOf(domain) !== -1) {
							is_valid_domain = false
						}
					},
					error: function() {
						console.log('Failed to load disposable emails')
					}
				})
				email_is_pro = is_valid_domain
				return is_valid_domain
			})

			$.validator.addMethod("uniqueDomain", function (value, element) {
				let product 	= $("#product").val()
				let apiUrl 		= ETScriptVars.root + '/check-domain/' + product + '/' + encodeURIComponent(value)
				let result 		= false
				if (lastCheckDomain.lookup == value) {
					result = lastCheckDomain.result
					domain_is_ok = lastCheckDomain.result
				} else {
					$.ajax({
						type: "GET",
						url: apiUrl,
						dataType: "JSON",
						success: function (data) {
							if (data.data.content.duplicate == true) {
								result = false
							} else {
								domain_is_ok = true
								result = true
							}
						},
						async: false
					});
				}
				lastCheckDomain.lookup = value;
				lastCheckDomain.result = result;
				return result
			})

			$.validator.addMethod("noSpace", function(value, element) {
				return value.indexOf(" ") < 0 && value != ""
			})

			$.validator.addMethod("alphanumeric", function(value, element) {
				return this.optional(element) || /^\w+$/i.test(value)
			})

			$.validator.addMethod("noUnderscore", function(value, element) {
				return this.optional(element) || /^((?!_).)*$/i.test(value)
			})

			$("#step-1").validate({
				// Custom ET validation rules
				onkeyup: false,
				success: function(label) {
					let name = label.attr('for')
					if (name === 'email') {
						label.addClass('valid').text('The entered email address is available.')
					}
					if (name === 'domain') {
						label.addClass('valid').text('The tenant name is available to order.')
					}
				},
				rules: {
					firstName: {
						required: true
					},
					lastName: {
						required: true
					},
					email: {
						required: true,
						email: true,
						uniqueEmail: true,
						validEmailDomain: true
					},
					domain: {
						required: true,
						minlength: 3,
						maxlength: 20,
						uniqueDomain: true,
						noSpace: true,
						alphanumeric: true,
						noUnderscore: true
					},
					consent: {
						required: true
					}
				},
				messages: {
					firstName: "Please enter your firstname.",
					lastName: "Please enter your lastname.",
					email: {
						required:"Please enter a valid email address.",
						uniqueEmail: "You already have an Emailtree account.",
						validEmailDomain: "Kindly provide a professional email for registration."
					},
					domain: {
						required: "Please enter your emailtree chosen domain.",
						uniqueDomain: "This domain is already in use.",
						noSpace: "No spaces allowed.",
						alphanumeric: "Letters only please.",
						noUnderscore: "No underscores allowed."
					},
					consent: "You have to agree to our conditions"
				},
				submitHandler: function(form) {
					form.submit()
				}
			})

			$('#step-1-submit').click(function(e){
				$jvcfpValidation = $(this).parents('form')
				if (!$($jvcfpValidation).valid()) {
					e.preventDefault()
					$topErrorPosition = $('.wpcf7-form-control.error').offset().top;
					$topErrorPosition = parseInt($topErrorPosition) - 100;
					$('body, html').animate({scrollTop:$topErrorPosition}, 'normal');
				} else {
					let serializedData = $jvcfpValidation.serialize()
					$.ajax({
						url: ETScriptVars.root + '/order',
						type: "POST",
						data: serializedData,
						async: false,
						success: function (data) {
							// No directions received yet!
						}
					})
				}
			})


			$('#step-1-order').click(function(e){
				$jvcfpValidation = $(this).parents('form')
				if (!$($jvcfpValidation).valid()) {
					e.preventDefault()
					$topErrorPosition = $('.wpcf7-form-control.error').offset().top;
					$topErrorPosition = parseInt($topErrorPosition) - 100;
					$('body, html').animate({scrollTop:$topErrorPosition}, 'normal');
				} else {
					let serializedData = $jvcfpValidation.serialize()
					$.ajax({
						url: ETScriptVars.root + '/orderpending',
						type: "POST",
						data: serializedData,
						async: false,
						success: function (data) {
							console.log(data);
							e.preventDefault();
							window.location="step2?order_id="+ data.data.content.order_number_b;
						},
						error: function() {
							alert("Error creating order!")
							e.preventDefault();
						}
					})
				}
			})

			$('#step-1-order-summer').click(function(e){
				$jvcfpValidation = $(this).parents('form')
				if (!$($jvcfpValidation).valid()) {
					e.preventDefault()
					$topErrorPosition = $('.wpcf7-form-control.error').offset().top;
					$topErrorPosition = parseInt($topErrorPosition) - 100;
					$('body, html').animate({scrollTop:$topErrorPosition}, 'normal');
				} else {
					let serializedData = $jvcfpValidation.serialize()
					$.ajax({
						url: ETScriptVars.root + '/orderpending',
						type: "POST",
						data: serializedData,
						async: false,
						success: function (data) {
							console.log(data);
							e.preventDefault();
							window.location="step-2-black-friday-deal?order_id="+ data.data.content.order_number_b;
						},
						error: function() {
							alert("Error creating order!")
							e.preventDefault();
						}
					})
				}
			})
			
			if ($("#step-1-o").length) {
				wpcf7.cached = 0; 
				wpcf7.reset = 0; 
			}

			$("#step-1-o").validate({
				// Custom ET validation rules
				onkeyup: false,
				success: function(label) {
					let name = label.attr('for')
					if (name === 'email') {
						label.addClass('valid').text('The entered email address is available.')
					}
					if (name === 'domain') {
						label.addClass('valid').text('The tenant name is available to order.')
					}
				},
				rules: {
					firstName: {
						required: true
					},
					lastName: {
						required: true
					},
					email: {
						required: true,
						email: true
					},
					domain: {
						required: true,
						minlength: 3,
						maxlength: 20,
						uniqueDomain: true,
						noSpace: true,
						alphanumeric: true,
						noUnderscore: true
					},
					consent: {
						required: true
					}
				},
				messages: {
					firstName: "Please enter your firstname.",
					lastName: "Please enter your lastname.",
					email: 	"Please enter a valid email address.",
					domain: {
						required: "Please enter your emailtree chosen domain.",
						uniqueDomain: "This domain is already in use.",
						noSpace: "No spaces allowed.",
						alphanumeric: "Letters only please.",
						noUnderscore: "No underscores allowed."
					},
					consent: "You have to agree to our conditions"
				},
				submitHandler: function(form) {
					form.submit()
				}
			})
			function getSessionFromUrl() {
				const queryString = window.location.search;
				const urlParams = new URLSearchParams(queryString);
				return urlParams.get('session');
			}

			if ($("#step-1-o").length) {
				$.ajax({
					url: ETScriptVars.root+"/check-stripe-session/"+ getSessionFromUrl(),

				})
				.done(function( data ) {
					if(data.data.content.id) {
						$("#step-1-o").css("display", "flex");
					}
					$("#firstName").val(data.data.content.first_name);
					$("#lastName").val(data.data.content.last_name);
					$("#email").val(data.data.content.email);
					$('#email').attr('readonly', true);
					$("#stripe_subscription_id").val(data.data.content.id);

				});
			}

			// STEP 2 (Form #2)
			$('form#step-2 :input[type="submit"]').prop('disabled', true)

			/**
			 * Watching the reason checkboxes on the second step form.
			 */
			let secondFormChecked = []
			let secondFormTextareaIsReady = false
			$('#reasonCheckbox input[type="checkbox"]').on('change', function() {
				let _thisValue = $(this).val()
				if ( $(this).is(':checked') ) {
					secondFormChecked.push(_thisValue)
					$(this).parent().parent().addClass('selected')
				} else {
					secondFormChecked.splice( $.inArray(_thisValue, secondFormChecked), 1)
					$(this).parent().parent().removeClass('selected')
				}
				secondStepSubmitActivator(secondFormChecked.length, secondFormTextareaIsReady)
			})

			// Stretch <textarea> to fit content.
			$('#otherReason').on('input', function() {
				let _thisValue = $(this).val()
				if (_thisValue != "Add your thoughts here" && _thisValue != "" ) {
					secondFormTextareaIsReady = true
				} else {
					secondFormTextareaIsReady = false
				}
				secondStepSubmitActivator(secondFormChecked.length, secondFormTextareaIsReady)
				this.style.height = ""
				this.style.height = this.scrollHeight + "px"
			})

			// Validate form from step #2
			$("#step-2").validate({
				// Custom ET validation rules
				onkeyup: false,
				rules: {
					'reasonCheckbox[]': {
						required: function(element) {
							let _otherValue = $('#otherReason').val()
							if (_otherValue != "Add your thoughts here" && _otherValue != "") {
								return false
							} else {
								return true
							}
						}
					},
					otherReason: {
						required: function(element) {
							let _counter = 0
							let _reasonValue = $('#reasonCheckbox input[type="checkbox"]')
							if (_reasonValue.is(':checked')) {
								_counter++
							}
							if (_counter > 0) {
								return false
							} else {
								return true
							}
						}
					}
				},
				messages: {
					'reasonCheckbox[]': "Please select field option",
					otherReason: "Please insert some feedback."
				},
				submitHandler: function(form) {
					//form.submit()
				}
			})

			$('#step-2-submit').click(function(e){
				$jvcfpValidation = $(this).parents('form')
				if (!$($jvcfpValidation).valid()) {
					e.preventDefault()
					$topErrorPosition = $('.wpcf7-form-control.error').offset().top;
					$topErrorPosition = parseInt($topErrorPosition) - 100;
					$('body, html').animate({scrollTop:$topErrorPosition}, 'normal');
				} else {
					$jvcfpValidation.submit()
				}
			})

			// STEP 5 (Form #5, last one)
			$('form#step-5 :input[type="submit"]').prop('disabled', true)

			etVariable('industry_is_ok', false)
			etVariable('role_is_ok', false)
			etVariable('language_is_ok', false)

			$('#industry').select2({tags: true})
			$('#role').select2()
			$('#language').select2()

			$('#industry').on('change', function() {
				let selected = $('#industry option:selected').val()
				if (selected != 'select industry') {
					$('.industry .select2-container .selection').addClass('selected')
					industry_is_ok = true
				} else {
					$('.industry .select2-container .selection').removeClass('selected')
					industry_is_ok = false
				}
				lastStepSubmitActivator()
			})

			$('#role').on('change', function() {
				let selected = $('#role option:selected').val()
				if (selected != 'select role') {
					$('.role .select2-container .selection').addClass('selected')
					role_is_ok = true
				} else {
					$('.role .select2-container .selection').removeClass('selected')
					role_is_ok = false
				}
				lastStepSubmitActivator()
			})

			$('#language').on('change', function() {
				let selected = $('#language option:selected').val()
				if (selected != 'select language') {
					$('.language .select2-container .selection').addClass('selected')
					language_is_ok = true
				} else {
					$('.language .select2-container .selection').removeClass('selected')
					language_is_ok = false
				}
				lastStepSubmitActivator()
			})

			//FUNCTIONS
			firstStepSubmitActivator = function() {
				let emllCheck;
				if ($("#step-1-o").length) {
					emllCheck = true;
				} else {
					emllCheck = email_is_ok && email_is_pro;
				}

				if (emllCheck && domain_is_ok  && $('#consent').is(':checked')) {
					$(':input[type="submit"]').prop('disabled', false)
				} else {
					if ($(':input[type="submit"]').attr("disabled", false)) {
						$(':input[type="submit"]').prop('disabled', true)
					}
				}
			},

			secondStepSubmitActivator = function(formLength, textareaIsReady) {
				if (formLength != 0 || textareaIsReady) {
					$('form#step-2 :input[type="submit"]').prop('disabled', false)
				} else {
					$('form#step-2 :input[type="submit"]').prop('disabled', true)
				}
			},

			lastStepSubmitActivator = function() {
				if (industry_is_ok && role_is_ok && language_is_ok) {
					$(':input[type="submit"]').prop('disabled', false)
				} else {
					if ($(':input[type="submit"]').attr("disabled", false)) {
						$(':input[type="submit"]').prop('disabled', true)
					}
				}
			}
		})

		// The rest of the code goes here!
		// SLIDER
		$("#et-wp-slideshow > div:gt(0)").hide()

		var slidesl = $('.slideitem').length

		var d = "<li class=\"dot active-dot\">&bull;</li>"

		for (var i = 1; i < slidesl; i++) {
			d = d+"<li class=\"dot\">&bull;</li>"
		}

		var dots = "<ul class=\"slider-dots\">" + d + "</ul\>"

		$("#et-wp-slideshow").append(dots)

		var interval = setInterval(slide, 6000)

		function intslide(func) {
			if (func == 'start') { 
				interval = setInterval(slide, 6000)
			} else {
				clearInterval(interval)		
			}
		}

		function slide() {
			sact('next', 0, 1200)
		}

		function sact(a, ix, it) {
			var currentSlide = $('.current')
			var nextSlide = currentSlide.next('.slideitem')
			var prevSlide = currentSlide.prev('.slideitem')
			var reqSlide = $('.slideitem').eq(ix)

			var currentDot = $('.active-dot')
			var nextDot = currentDot.next()
			var prevDot = currentDot.prev()
			var reqDot = $('.dot').eq(ix)

			if (nextSlide.length == 0) {
				nextDot = $('.dot').first()
				nextSlide = $('.slideitem').first()
			}

			if (prevSlide.length == 0) {
				prevDot = $('.dot').last()
				prevSlide = $('.slideitem').last()
			}
			
			if (a == 'next') {
				var Slide = nextSlide
				var Dot = nextDot
			} else if (a == 'prev') {
				var Slide = prevSlide
				var Dot = prevDot
			} else {
				var Slide = reqSlide
				var Dot = reqDot
			}

			currentSlide.fadeOut(it).removeClass('current')
			Slide.fadeIn(it).addClass('current')

			currentDot.removeClass('active-dot')
			Dot.addClass('active-dot')
		}

		$('.dot').on('click', function(){
			intslide('stop')
			var index  = $(this).index()
			sact('dot', index, 400)
			intslide('start')
		})
		//et-wp-slideshow

		if ($('#pricing-table-pending').length >=1) {
			
			var pricing_table;
			if($('#pricing-table-pending').data('deal')=='summer') {
				pricing_table='<script async="" src="https://js.stripe.com/v3/pricing-table.js"></script><stripe-pricing-table pricing-table-id="prctbl_1Pg7awFvt5IDmLS7n6swJ5ev" publishable-key="pk_live_51OrjrCFvt5IDmLS7bdwo8EnML7o2DJ8onuWrac76Nd2aqMqPraZID40CKVAGKCsAEvBgGFTNC1KedLfeyvVLSGZ300jxwBwYnD"';
			} else {
			
				pricing_table='<script async="" src="https://js.stripe.com/v3/pricing-table.js"></script><stripe-pricing-table pricing-table-id="prctbl_1Ovh2lFvt5IDmLS7BHs61vNG" publishable-key="pk_live_51OrjrCFvt5IDmLS7bdwo8EnML7o2DJ8onuWrac76Nd2aqMqPraZID40CKVAGKCsAEvBgGFTNC1KedLfeyvVLSGZ300jxwBwYnD"';
			
			}

			var queryString = location.search;
			let params = new URLSearchParams(queryString);

			$.ajax({


				url: ETScriptVars.root + '/orderb-info/'+params.get("order_id"),
				type: "GET",
				async: false,
				success: function (data) {
					console.log(data);
					pricing_table+=' client-reference-id="'+data.data.content.orderno+'" customer-email="'+data.data.content.email+'"';
					pricing_table+='></stripe-pricing-table>';
					$('#pricing-table-pending').html(pricing_table);
				}
			})
		
		}
	})






);

