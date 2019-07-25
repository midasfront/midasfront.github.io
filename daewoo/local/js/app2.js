window.console = window[ 'console' ] ? window[ 'console' ] : { log: function() {} };
window.log = window[ 'log' ] ? window[ 'log' ] : function() {
	console.info( arguments[ 0 ] );
};

APP.register( 'FloorInfoData' );
APP.FloorInfoData = ( function() {
	var _isLocal = false;
	// var _isLocal = true;
	var _isLoading = false;
	var _localUrl = '/resources/user/local/floorInfo.json';
	var _serverUrl = '/api/floorInfo';
	var _url = _isLocal ? _localUrl : _serverUrl;
	var _fooling = {};

	var load = function( cb ) {
		var param = APP.FloorInfo.getParam();
		if( _fooling[ param.zoneType ] != undefined ) return cb( _fooling[ param.zoneType ] );
		log( 'ajax FloorInfoData ---------------------------------' );
		log( param );

		_isLoading = true;
		$.ajax( {
			url: _url,
			method: 'GET',
			data: param,
			dataType: 'json'
		} ).done( function( data ) {
			_isLoading = false;
			log( data );
			if( data.result == false ) return;
			_fooling[ param.zoneType ] = data.list;
			cb( data.list );
		} ).fail( function() {
			log( "FloorInfoData fail" );
			_isLoading = false;
		} );
	};

	return {
		isLoading: function() { return _isLoading; },
		load: load
	}
} )();

APP.register( 'FloorInfo' );
APP.FloorInfo = ( function() {
	var _isInitialized;
	var _vue;
	var Data = APP.FloorInfoData;

	var init = function() {
		if( _isInitialized ) return;
		_isInitialized = true;

		_initVue();
		_load();
	};

	var getParam = function() {
		return {
			zoneType: _vue.zoneType
		}
	};

	var _load = function() {
		if( Data.isLoading() ) return;
		Data.load( function( data ) {
			_vue.$set( _vue.zoneList, _vue.zoneType - 1, data );
			// _vue.zoneList[ _vue.zoneType - 1 ] = data;
		} );
	};

	var _initVue = function() {
		var vueList = {
			template: '#list-template',
			props: {
				list: String,
				floor: String,
				dong: {
					type: String,
					default: '없음'
				}
			},
			data: function() {
				return {};
			},
			methods: {
				getStores: function( str ) {
					return str.split( ',' );
				}
			}
		};
		_vue = new Vue( {
			el: '.floor_info',
			data: {
				zoneType: 1,
				zoneList: [
					[ { "zoneType": NaN, "dongType": NaN, "floorType": NaN, "categoryType": NaN, "zone": "", "dong": "", "floor": "", "category": "", "stores": "" } ],
					[ { "zoneType": NaN, "dongType": NaN, "floorType": NaN, "categoryType": NaN, "zone": "", "dong": "", "floor": "", "category": "", "stores": "" } ],
					[ { "zoneType": NaN, "dongType": NaN, "floorType": NaN, "categoryType": NaN, "zone": "", "dong": "", "floor": "", "category": "", "stores": "" } ],
					[ { "zoneType": NaN, "dongType": NaN, "floorType": NaN, "categoryType": NaN, "zone": "", "dong": "", "floor": "", "category": "", "stores": "" } ]
				]
			},
			methods: {
				changeZone: function( id ) {
					if( Data.isLoading() ) return;
					this.zoneType = id + 1;
					_load();
				}
			},
			components: {
				'my-list': vueList
			}
		} );
	};

	return {
		init: init,
		getParam: getParam
	}
} )();

APP.register( 'ScheduleData' );
APP.ScheduleData = ( function() {
	var _isLocal = false;
	// var _isLocal = true;
	var _isLoading = false;
	var _localUrl = '/resources/user/local/schedule.json';
	var _serverUrl = '/api/scheduleInfo';
	var _url = _isLocal ? _localUrl : _serverUrl;

	var load = function( cb ) {
		log( 'ajax ScheduleData ---------------------------------' );
		var param = APP.Schedule.getParam();
		log( param );

		_isLoading = true;
		$.ajax( {
			url: _url,
			method: 'GET',
			data: param,
			dataType: 'json'
		} ).done( function( data ) {
			_isLoading = false;
			// log( data );
			cb( data );
		} ).fail( function() {
			log( "ScheduleData fail" );
			_isLoading = false;
		} );
	};

	return {
		isLoading: function() { return _isLoading; },
		load: load
	}
} )();

APP.register( 'Schedule' );
APP.Schedule = ( function() {
	var _isInitialized;
	var _vue;
	var Data = APP.ScheduleData;

	var init = function() {
		if( _isInitialized ) return;
		_isInitialized = true;

		_initVue();
	};

	var getParam = function() {
		return "searchToDate=" + _vue.year + _getTwoString( _vue.month );
	};

	var _getTwoString = function( num ) {
		return parseInt( num, 10 ) < 10 ? '0' + num : num;
	};
	var _getDateStr = function( year, month, day ) {
		return year + '-' + _getTwoString( month ) + '-' + _getTwoString( day );
	};

	var _load = function() {
		if( Data.isLoading() ) return;
		Data.load( function( data ) {
			_vue.total = data.total;
			_vue.list = data.list;
		} );
	};

	var _initVue = function() {
		_vue = new Vue( {
			el: '.calendar_con',
			data: {
				week: [ '일', '월', '화', '수', '목', '금', '토' ],
				today: new Date(),
				date: new Date(),
				year: null,
				month: null,
				calendarObj: {},
				calendarArr: [
					[ { today: false, year: null, month: null, day: null } ]
				],
				actDateStr: '',
				mode: 'calendar', //list
				total: 0,
				list: {}
			},
			methods: {
				prevCalendar: function() {
					var date = this.date;
					this.date = new Date( date.getFullYear(), date.getMonth() - 1, date.getDate() );
					_buildCalendar();
				},
				nextCalendar: function() {
					var date = this.date;
					this.date = new Date( date.getFullYear(), date.getMonth() + 1, date.getDate() );
					_buildCalendar();
				},
				getMonthDay: function( obj ) {
					return _getTwoString( obj.month ) + '.' + _getTwoString( obj.day );
				},
				more: function( dateStr ) {
					log( dateStr );
					this.actDateStr = dateStr;
					this.mode = 'list';
				},
				changeMode: function( mode ) {
					this.mode = mode;
				}
			}
		} );

		_buildCalendar();
	};

	var _buildCalendar = function() {
		var date = _vue.date;
		var nMonth = new Date( date.getFullYear(), date.getMonth(), 1 );
		var lastDate = new Date( date.getFullYear(), date.getMonth() + 1, 0 );
		var year = date.getFullYear();
		var month = date.getMonth() + 1;

		var i, leng;
		var cnt = 0;
		var calendarObj = {};
		var calendarArr = [];
		var arr, obj;
		var todayStr;

		calendarArr.push( arr = [] );

		leng = nMonth.getDay();
		for( i = 0; i < leng; i++ ) {
			arr.push( {} );
			cnt++;
		}

		leng = lastDate.getDate();
		for( i = 1; i <= leng; i++ ) {
			obj = {
				today: false,
				year: year,
				month: month,
				day: i,
				week: _vue.week[ cnt % 7 ],
				dateStr: _getDateStr( year, month, i )
			};
			calendarObj[ _getDateStr( year, month, i ) ] = obj;
			arr.push( obj );
			cnt++;
			if( cnt % 7 == 0 ) calendarArr.push( arr = [] );
		}

		for( i = cnt % 7; i < 7; i++ ) {
			arr.push( {} );
		}

		todayStr = _getDateStr( _vue.today.getFullYear(), _vue.today.getMonth() + 1, _vue.today.getDate() );
		calendarObj[ todayStr ] ? calendarObj[ todayStr ].today = true : null;

		_vue.year = year;
		_vue.month = month;
		_vue.calendarObj = calendarObj;
		_vue.calendarArr = calendarArr;

		_load();
	};

	return {
		init: init,
		getParam: getParam
	}
} )();

APP.register( 'GuideData' );
APP.GuideData = ( function() {
	var _isLocal = false;
	// var _isLocal = true;
	var _isLoading = false;
	var _localUrl = {
		getFloorType: '/resources/user/local/getFloorType.json',
		guideInfo: '/resources/user/local/guideInfo.json'
	};
	var _serverUrl = {
		getFloorType: '/api/getFloorType',
		guideInfo: '/api/guideInfo'
	};
	var _url = _isLocal ? _localUrl : _serverUrl;

	var loadFloorType = function( cb ) {
		log( 'ajax GuideData loadFloorType ---------------------------------' );

		_isLoading = true;
		$.ajax( {
			url: _url.getFloorType + '?z1=1F&z2=1F&z3=1F&z4=1F', // 디폴트 층 선택 4개 다 필요
			method: 'GET',
			dataType: 'json'
		} ).done( function( data ) {
			_isLoading = false;
			// log( data );
			cb( data );
		} ).fail( function() {
			log( "GuideData loadFloorType fail" );
			_isLoading = false;
		} );
	};

	var loadGuideInfo = function( cb ) {
		log( 'ajax GuideData loadGuideInfo ---------------------------------' );
		var param = APP.Guide.getParam();
		log( param );

		_isLoading = true;
		$.ajax( {
			url: _url.guideInfo,
			method: 'GET',
			data: param,
			dataType: 'json'
		} ).done( function( data ) {
			_isLoading = false;
			log( data );
			if( data.result == false ) return;
			cb( data.obj );
		} ).fail( function() {
			log( "GuideData loadGuideInfo fail" );
			_isLoading = false;
		} );
	};

	return {
		isLoading: function() { return _isLoading; },
		loadFloorType: loadFloorType,
		loadGuideInfo: loadGuideInfo
	}
} )();

APP.register( 'GuideMap' );
APP.GuideMap = ( function() {
	var _size = { s: { w: 1200, h: 700 }, b: { w: 2400, h: 1400 } };
	var _maxX = _size.s.w - _size.b.w;
	var _maxY = _size.s.h - _size.b.h;
	var _oldX = 0;
	var _oldY = 0;
	var _press;
	var _clientX, _moveX, _startX, _posX;
	var _clientY, _moveY, _startY, _posY;

	var init = function() {
		_addEvent();
	};

	var mousedown = function( e ) {
		_setData( e );
		_press = true;
		_moveX = _moveY = 0;
		_startX = _clientX, _startY = _clientY;
	};

	var showLocation = function( mapLocX, mapLocY, time ) {
		_posX = _size.b.w * -mapLocX / 100 + _size.s.w / 2;
		_posY = _size.b.h * -mapLocY / 100 + _size.s.h / 2;

		_move( time );

		_oldX = _posX;
		_oldY = _posY;
	};

	var _move = function( time ) {
		var el = APP.Guide.getMapBig();
		if( !el ) return;

		time = time == undefined ? 0 : time;

		_posX = _posX > 0 ? 0 : _posX;
		_posX = _posX <= _maxX ? _maxX : _posX;
		TweenLite.to( el, time, { x: _posX } );

		_posY = _posY > 0 ? 0 : _posY;
		_posY = _posY <= _maxY ? _maxY : _posY;
		TweenLite.to( el, time, { y: _posY } );
	};

	var _setData = function( e ) {
		_clientX = e.clientX;
		_clientY = e.clientY;
	};

	var _addEvent = function() {
		document.addEventListener( 'mousemove', function( e ) {
			if( !_press ) return;
			_setData( e );
			_moveX = _clientX - _startX
			_moveY = _clientY - _startY
			_posX = _moveX + _oldX;
			_posY = _moveY + _oldY;
			_move();
		} );
		document.addEventListener( 'mouseup', function( e ) {
			if( !_press ) return;
			_setData( e );
			_press = false;
			_moveX = _moveY = 0;
			_oldX = _posX;
			_oldY = _posY;
		} );
	};

	return {
		init: init,
		mousedown: mousedown,
		showLocation: showLocation
	}
} )();

APP.register( 'Guide' );
APP.Guide = ( function() {
	var _isInitialized;
	var _vue;
	var _detailPosY;
	var Data = APP.GuideData;

	var init = function() {
		if( _isInitialized ) return;
		_isInitialized = true;

		_detailPosY = $( '#detail' ).offset().top - 100;

		if( Data.isLoading() ) return;
		Data.loadFloorType( function( data ) {
			_initVue();
			_vue.floorDefaultObj = data.floorDefaultObj;
			_vue.floorTypeObj = data.floorTypeObj;
			_initHash();
			APP.GuideMap.init();
		} );
	};

	var getParam = function() {
		return {
			zoneType: _vue.zoneType,
			floorType: _vue.floorType.code
		}
	};

	var getMapBig = function() {
		return _vue.$refs.mapBig;
	};

	var _initVue = function() {
		var timer;
		var vueList = {
			template: '#list-template',
			props: {
				storeData: Object,
				id: Number,
				toggle: Boolean
			},
			data: function() {
				return {};
			},
			computed: {
				detailTime: function() {
					var r = [];
					for( var i = 1; i <= 10; i++ ) {
						r.push( this.storeData[ 'time' + i ] );
					}
					return r;
				}
			},
			methods: {
				detailToggle: function() {
					this.$emit( 'toggle', this.id );
				},
				showInfo: function() {
					this.$emit( 'show', this.storeData );
				},
				checkTime: function( str ) {
					if( str.indexOf( '||' ) < 0 ) return { bool: false, txt: '' };
					return { bool: true, txt: str.split( '||' )[ 0 ] };
				},
				checkIssue: function( str ) {
					if( str.indexOf( '||' ) < 0 ) return { bool: true, txt: str };
					return { bool: true, txt: str.split( '||' )[ 1 ] };
				}
			}
		};

		_vue = new Vue( {
			el: '.sub_contents',
			data: {
				zoneType: 0,
				viewType: 0,
				floorType: { "code": 3, "codeName": "" },
				floorTypeActObj: {},
				imgSmall: '',
				imgBig: '',
				zoom: false,
				categoryType: '',
				mapLocX: -10,
				mapLocY: 50,
				storeData: {},
				storeList: [],
				myListActId: -1,
				floorDefaultObj: { "1": [ { "code": 3, "codeName": "" } ] },
				floorTypeObj: { "1": [ { "code": 1, "codeName": "" } ] }
			},
			mounted: function() {
				this.$nextTick( function() {} );
			},
			components: {
				'my-list': vueList
			},
			methods: {
				changeFloorType: function( obj ) {
					this.floorType = obj;
					_loadGuideInfo();
				},
				viewOver: function( id ) {
					clearTimeout( timer );
					this.viewType = id;
				},
				viewOut: function() {
					var self = this;
					timer = setTimeout( function() {
						self.viewType = self.zoneType;
					}, 500 );
				},
				viewClick: function( id ) {
					TweenLite.to( window, 1, { scrollTo: _detailPosY, ease: Power4.easeOut } );
					location.href = "#" + id;
				},
				mousedown: function( e ) {
					APP.GuideMap.mousedown( e );
				},
				zoomIn: function() {
					this.zoom = true;
					if( this.mapLocX > 0 ) return;
					APP.GuideMap.showLocation( 50, 50 );
				},
				zoomOut: function() {
					this.zoom = false;
				},
				detailToggle: function( id ) {
					this.myListActId = this.myListActId == id ? -1 : id;
				},
				showInfo: function( storeData ) {
					this.storeData = storeData;
					this.mapLocX = storeData.mapLocX;
					this.mapLocY = storeData.mapLocY;
					APP.GuideMap.showLocation( storeData.mapLocX, storeData.mapLocY, 0.5 );
					TweenLite.to( window, 1, { scrollTo: _detailPosY, ease: Power4.easeOut } );
				}
			}
		} );
	};

	var _setZoneType = function( id ) {
		log( '_setZoneType : ' + id )
		_vue.zoneType = _vue.viewType = id;
		_vue.floorTypeActObj = _vue.floorTypeObj[ id ];
		_vue.floorType = _vue.floorDefaultObj[ id ];

		if( id != 0 ) {
			_loadGuideInfo();
		}

	};

	var _loadGuideInfo = function() {
		if( Data.isLoading() ) return;
		Data.loadGuideInfo( function( data ) {
			_vue.imgSmall = data.img1;
			_vue.imgBig = data.img2;
			_vue.storeData = {};
			_vue.storeList = data.storeList;
			_vue.mapLocX = -10;
			_vue.mapLocY = 50;
			_vue.zoomOut();
			_vue.categoryType = '';
			_vue.myListActId = -1;
		} );
	};

	var _initHash = function() {
		var getHash = function( str ) {
			return str.split( '#' )[ 1 ] || 0;
		};

		window.addEventListener( 'hashchange', function() {
			var zoneType;
			var $lnb = $( '#cloneLnb>li' );
			_setZoneType( zoneType = getHash( location.hash ) );
			$lnb.removeClass( 'on' );
			if( zoneType != 0 ) $lnb.eq( zoneType - 1 ).addClass( 'on' );
		}, false );

		_setZoneType( getHash( location.hash ) );
	};

	return {
		init: init,
		getParam: getParam,
		getMapBig: getMapBig
	}
} )();
