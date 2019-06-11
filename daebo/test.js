var defaultSwiperConfiguration = {
		vertical: {
			autoplay: 1000
		}
	},
	// Set individual slide timeout for dynamic autoplay
	setSwiperSlideTimeout = function ( swiper ) {
		var timeout = $( swiper.slides[ swiper.activeIndex ] ).data( "timeout" );

		if (
			timeout === undefined
			|| timeout === ''
			|| timeout === 0
		) {
			timeout = 1000;
		}

		setTimeout( function () {
			swiper.slideNext();
		}, timeout );
	},
	// Get nested swiper instance
	getNestedSwiper = function ( swiper ) {
		var nestedSwiper = $( swiper.slides[ swiper.activeIndex ] ).children( ".swiper-container" ).data( "swiper" );

		if ( nestedSwiper !== undefined ) {
			return nestedSwiper;
		}

		return null;
	},
	// Main horizontal
	swiperMain = new Swiper( "#swiper-main", {
		pagination: ".swiper-pagination",
		loop: true,
		loopedSlides: 1,
		onSlideChangeEnd: function ( currentSwiper ) {
			var nestedSwiper = getNestedSwiper( currentSwiper );
			if ( nestedSwiper !== null ) {
				var swiperType = nestedSwiper.container.data( "swiper-type" );

				// Start autoplay within nested swiper
				nestedSwiper.params.autoplay = defaultSwiperConfiguration[ swiperType ].autoplay;
				nestedSwiper.params.autoplayStopOnLast = true;
				nestedSwiper.on( "onAutoplayStop", function () {
					currentSwiper.slideNext();

					// Reset nested swiper
					setTimeout( function () {
						nestedSwiper.slideTo( 0 );
					}, 1000 )
				} );
				nestedSwiper.startAutoplay();
			} else {
				setSwiperSlideTimeout( currentSwiper );
			}
		}
	} ),
	// Secondary vertical
	swiperVertical = new Swiper( ".swiper-vertical", {
		pagination: ".swiper-pagination",
		direction: "vertical",
		loop: false
	} );