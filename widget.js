/* global requirejs cprequire cpdefine chilipeppr transferCode gCoord gCoordNum */
// Defining the globals above helps Cloud9 not show warnings for those variables

// ChiliPeppr Widget/Element Javascript

requirejs.config({
    /*
    Dependencies can be defined here. ChiliPeppr uses require.js so
    please refer to http://requirejs.org/docs/api.html for info.
    
    Most widgets will not need to define Javascript dependencies.
    
    Make sure all URLs are https and http accessible. Try to use URLs
    that start with // rather than http:// or https:// so they simply
    use whatever method the main page uses.
    
    Also, please make sure you are not loading dependencies from different
    URLs that other widgets may already load like jquery, bootstrap,
    three.js, etc.
    
    You may slingshot content through ChiliPeppr's proxy URL if you desire
    to enable SSL for non-SSL URL's. ChiliPeppr's SSL URL is
    https://i2dcui.appspot.com which is the SSL equivalent for
    http://chilipeppr.com
    */
    paths: {
        // Example of how to define the key (you make up the key) and the URL
        // Make sure you DO NOT put the .js at the end of the URL
        // SmoothieCharts: '//smoothiecharts.org/smoothie',
    },
    shim: {
        // See require.js docs for how to define dependencies that
        // should be loaded before your script/widget.
    }
});

cprequire_test(["inline:com-chilipeppr-widget-playground"], function(myWidget) {

    // Test this element. This code is auto-removed by the chilipeppr.load()
    // when using this widget in production. So use the cpquire_test to do things
    // you only want to have happen during testing, like loading other widgets or
    // doing unit tests. Don't remove end_test at the end or auto-remove will fail.

    // Please note that if you are working on multiple widgets at the same time
    // you may need to use the ?forcerefresh=true technique in the URL of
    // your test widget to force the underlying chilipeppr.load() statements
    // to referesh the cache. For example, if you are working on an Add-On
    // widget to the Eagle BRD widget, but also working on the Eagle BRD widget
    // at the same time you will have to make ample use of this technique to
    // get changes to load correctly. If you keep wondering why you're not seeing
    // your changes, try ?forcerefresh=true as a get parameter in your URL.

    console.log("test running of " + myWidget.id);

    $('body').prepend('<div id="testDivForFlashMessageWidget"></div>');

    chilipeppr.load(
        "#testDivForFlashMessageWidget",
        "http://fiddle.jshell.net/chilipeppr/90698kax/show/light/",
        function() {
            console.log("mycallback got called after loading flash msg module");
            cprequire(["inline:com-chilipeppr-elem-flashmsg"], function(fm) {
                //console.log("inside require of " + fm.id);
                fm.init();
            });
        }
    );

    // init my widget
    myWidget.init();
    $('#' + myWidget.id).css('margin', '10px');
    $('title').html(myWidget.name);

} /*end_test*/ );

// This is the main definition of your widget. Give it a unique name.
cpdefine("inline:com-chilipeppr-widget-playground", ["chilipeppr_ready", /* other dependencies here */ ], function() {
    return {
        /**
         * The ID of the widget. You must define this and make it unique.
         */
        id: "com-chilipeppr-widget-playground", // Make the id the same as the cpdefine id
        name: "Widget / Playground", // The descriptive name of your widget.
        desc: "This is a testing area to try out new pieces of coding to work with Chilipeppr.", // A description of what your widget does
        url: "(auto fill by runme.js)",       // The final URL of the working widget as a single HTML file with CSS and Javascript inlined. You can let runme.js auto fill this if you are using Cloud9.
        fiddleurl: "(auto fill by runme.js)", // The edit URL. This can be auto-filled by runme.js in Cloud9 if you'd like, or just define it on your own to help people know where they can edit/fork your widget
        githuburl: "(auto fill by runme.js)", // The backing github repo
        testurl: "(auto fill by runme.js)",   // The standalone working widget so can view it working by itself
        /**
         * Define pubsub signals below. These are basically ChiliPeppr's event system.
         * ChiliPeppr uses amplify.js's pubsub system so please refer to docs at
         * http://amplifyjs.com/api/pubsub/
         */
        /**
         * Define the publish signals that this widget/element owns or defines so that
         * other widgets know how to subscribe to them and what they do.
         */
        publish: {
            // Define a key:value pair here as strings to document what signals you publish.
            //'/onExampleGenerate': 'Example: Publish this signal when we go to generate gcode.'
        },
        /**
         * Define the subscribe signals that this widget/element owns or defines so that
         * other widgets know how to subscribe to them and what they do.
         */
        subscribe: {
            // Define a key:value pair here as strings to document what signals you subscribe to
            // so other widgets can publish to this widget to have it do something.
            // '/onExampleConsume': 'Example: This widget subscribe to this signal so other widgets can send to us and we'll do something with it.'
        },
        /**
         * Document the foreign publish signals, i.e. signals owned by other widgets
         * or elements, that this widget/element publishes to.
         */
        foreignPublish: {
            // Define a key:value pair here as strings to document what signals you publish to
            // that are owned by foreign/other widgets.
            // '/jsonSend': 'Example: We send Gcode to the serial port widget to do stuff with the CNC controller.'
        },
        /**
         * Document the foreign subscribe signals, i.e. signals owned by other widgets
         * or elements, that this widget/element subscribes to.
         */
        foreignSubscribe: {
            '/com-chilipeppr-interface-cnccontroller/units': 'Track which unit mode is active. The walue is normalized as {units: \"mm\"} or {units: \"inch\"}',
            '/com-chilipeppr-interface-cnccontroller/coords': " Track which is coordinate system is active: G54, G55, etc. The value is {coord:\"g55\", coordNum: 55} or for G92 {coord:\"g92\", coordNum: 92} or for machine {coord:\"g53\", coordNum: 53}",
            '/com-chilipeppr-interface-cnccontroller/requestCoords': 'Send in this signal to request a callback signal of "/com-chilipeppr-interface-cnccontroller/coords" to be sent back. You wil be sent whatever value this widget currently has stored as the last coordinates.'

            // Define a key:value pair here as strings to document what signals you subscribe to
            // that are owned by foreign/other widgets.
            // '/com-chilipeppr-elem-dragdrop/ondropped': 'Example: We subscribe to this signal at a higher priority to intercept the signal. We do not let it propagate by returning false.'
        },
        /**
         * All widgets should have an init method. It should be run by the
         * instantiating code like a workspace or a different widget.
         */
        init: function() {
            console.log("I am being initted. Thanks.");

            this.setupUiFromLocalStorage();
            this.btnSetup();
            this.forkSetup();
            
            // setup run buttons
            $('#' + this.id + ' .btn-touchplaterun1').click(this.onRun.bind(this));
            $('#' + this.id + ' .btn-touchplaterun2').click(this.onRun.bind(this));
            $('#' + this.id + ' .btn-touchplaterun3').click(this.onRun.bind(this));
            
            chilipeppr.subscribe('/com-chilipeppr-interface-cnccontroller/coords',this, this.onCoordsUpdate);

            console.log("I am done being initted.");
        },
        
        lastCoords: {
            coord: null, // G54, G55, etc
            coordNum: null // 54, 55, etc
        },
        
        onCoordsUpdate: function(coords) {
            console.log("onCoordUpdate. coords:", coords);
            alert("onCoordsUpdate: ", coords);
            if (coords.coord != this.lastCoords.coord) {
                $('.com-chilipeppr-widget-playground-coords').text(coords.coordNum);
                $('.com-chilipeppr-widget-playground-tab2-name').text(coords.coord +" Float");
                $('.com-chilipeppr-widget-playground-tab3-name').text(coords.coord +" Fixed");
                $('#' + this.id + ' .btn-touchplaterun2').text(coords.coord + " Run");
                
                this.lastCoords = coords;
                gCoordNum = coords.coordNum; //54, 55, etc
                gCoord = coords.coord; // G54, G55, etc
            }
            chilipeppr.unsubscribe('/com-chilipeppr-interface-cnccontroller/coords',this, this.onCoordsUpdate);
        },
        
        gcodeCtr: 0,
        isRunning: false,
        transferCode: null,
        runCode: null,
        
        onRun: function(evt) {
            // when user clicks the run button
            console.log("user clicked run button. evt:", evt, event.target.id);
            chilipeppr.unsubscribe('/com-chilipeppr-interface-cnccontroller/coords',this, this.onCoordsUpdate);
            
            // define variable to determine which subroutine to run based on
            // user selection through the tabs
            var runCode = event.target.id;
            // logs which button was clicked
            console.log("this is the runCode:", runCode);
            
            // transfer runCode to read only global variable
            transferCode = runCode;
            
            // Stop controller upon completion of probing cycle
            console.log("The transferCode is:", transferCode);
            
            if (this.isRunning) {

                // Stop controller
                var id = "tp" + this.gcodeCtr++;
                var gcode = "!\n";
                chilipeppr.publish("/com-chilipeppr-widget-serialport/jsonSend", {Id: id, D: gcode});

                
                // Swap clicked button to run
                if (runCode == "run1") {
                    // Run WCS (G53) button
                    $('#' + this.id + ' .btn-touchplaterun1').removeClass("btn-danger").text("Run WCS");
                    this.isRunning = false;
                    
                } else if (runCode == "run2") {
                    // Run G5x (MCS) button for floating touchplate
                    $('#' + this.id + ' .btn-touchplaterun2').removeClass("btn-danger").text(gCoord + " Run");
                    this.isRunning = false;
                    
                }else {
                    // Run G92 (MCS) button for floating touchplate
                    $('#' + this.id + ' .btn-touchplaterun3').removeClass("btn-danger").text("G92 Run");
                    this.isRunning = false;
                }

            } else {
                
                // Start probing process
                
                this.isRunning = true;
                // Start controller and swap button to stop
                $('#' + this.id + ' .btn-touchplate' + runCode).addClass("btn-danger").text("Stop");
                
                // Start watch for circuit closing, subscribe to recvline
                this.watchForProbeStart();
               
                // Run the G38.2 probe cycle for all buttons
                id = "tp" + this.gcodeCtr++;
                var gcode = "G21 G91 (Use mm and rel coords)\n";
                chilipeppr.publish("/com-chilipeppr-widget-serialport/jsonSend", {Id: id, D: gcode});
                id = "tp" + this.gcodeCtr++;
                gcode = "G38.2 Z-20 F" + fr + "\n";
                chilipeppr.publish("/com-chilipeppr-widget-serialport/jsonSend", {Id: id, D: gcode});
                id = "tp" + this.gcodeCtr++;
                gcode = "G90 (return to absolute coords) \n";
                chilipeppr.publish("/com-chilipeppr-widget-serialport/jsonSend", {Id: id, D: gcode});

            }
        },
        
        /**
         * Call this method when the G30 define button is clicked on tab 4.
         * The G30 Tab 4 will create a defined position, through a G30.1 command 
         * that locates a fixed touchplate. Send G30.1 - This will "remember" the 
         * absolute position. This position remains constant regardless of what
         * coordinate system is in effect.
         */
        
        watchForProbeStart: function() {
            // We need to subscribe to the /recvline cuz we need to analyze everything coming back
            console.log("checking that transferCode works:", transferCode);
            chilipeppr.subscribe("/com-chilipeppr-widget-serialport/recvline", this, this.onRecvLineForProbe);
        },

        watchForProbeEnd: function() {
            chilipeppr.unsubscribe("/com-chilipeppr-widget-serialport/recvline", this, this.onRecvLineForProbe);
        },
        
        onRecvLineForProbe: function(data) {
            console.log("onRecvLineForProbe. data:", data);
        
            // the data we're looking for is:
            // {"prb":{"e":1,"z":-7.844}}
        
            // make sure it's the data we want
            if (!('dataline' in data)) {
                console.log("did not get dataline in data. returning.");
                return;
            }
        
            // let's make sure it's json
            var json = $.parseJSON(data.dataline);
        
            // sometimes we get {"r":{"prb"  instead of {"prb": so just
            // detect and remap
            if ('r' in json && 'prb' in json.r) json = json.r;
        
            if ('prb' in json && 'e' in json.prb && 'z' in json.prb) {
                // yes, it's data for the probe ending
        
                // now do all the final steps now that we got our data
                this.onAfterProbeDone(json.prb);
            }
        },
        
        onAfterProbeDone: function(probeData) {
            // probeData should be of the format
            // {"e":1,"z":-7.844}
            console.log("onAfterProbeDone. probeData:", probeData);
            
            // unsub so we stop getting events
            this.watchForProbeEnd();
            
            // play good beep
            this.audio.play();
            
            // Stop controller upon completion of probing cycle
            console.log("The transferCode is:", transferCode);
            
            // Cycle stop and swap buttons to run
            this.isRunning = false;
            var plateHeight = $('#com-chilipeppr-widget-playground .heightplate').val();
            if (isNaN(plateHeight)) plateHeight = 0;
                console.log("plateHeight:", plateHeight);

            if (transferCode == "run1") {
                // Run WCS (G53) button - Tab 1
                $('#' + this.id + ' .btn-touchplaterun1').removeClass("btn-danger").text("Run WCS");
                
                // Set G53 machine coordinates Z-value to zero
                // create Gcode and send to controller
                var gcode = "G28.3 Z" + plateHeight + "\n";
                var id = "tp" + this.gcodeCtr++;
                chilipeppr.publish("/com-chilipeppr-widget-serialport/jsonSend", {Id: id, D: gcode});
            }
            
            else if (transferCode == "run2") {
                // Run G5x (MCS) button for floating touchplate - Tab 2
                $('#' + this.id + ' .btn-touchplaterun2').removeClass("btn-danger").text(gCoord + "  Run");
                
                // Set G5x offset
                // Set the G92 offset value
                var zoffset = probeData.z - plateHeight;
                // create Gcode and send to controller
                var gcode = "G10 L2 P1 Z" + zoffset + "\n";
                var id = "tp" + this.gcodeCtr++;
                chilipeppr.publish("/com-chilipeppr-widget-serialport/jsonSend", {Id: id, D: gcode});
            }
            
            else if (transferCode == "run3") {
                // Run G92 (MCS) button for floating touchplate - Tab 2
                $('#' + this.id + ' .btn-touchplaterun3').removeClass("btn-danger").text("G92 Run");
                
                // Set the G5x offset via G92
                var gcode = "G92 Z" + plateHeight;
                var id = "tp" + this.gcodeCtr++;
                chilipeppr.publish("/com-chilipeppr-widget-serialport/jsonSend", {Id: id, D: gcode});
                
            }
            else if (transferCode == "run4") {
                // Run G5x (MCS) button for fixed touchplate - Tab 3
                $('#' + this.id + ' .btn-touchplaterun4').removeClass("btn-danger").text(gCoord + " Run4");
                
                // Set G5x offset
                // Set the G92 offset value
                var zoffset = probeData.z - plateHeight;
                // create Gcode and send to controller
                var gcode = "G10 L2 P1 Z" + zoffset + "\n";
                var id = "tp" + this.gcodeCtr++;
                chilipeppr.publish("/com-chilipeppr-widget-serialport/jsonSend", {Id: id, D: gcode})
            }
            else {
                // Run G92 (MCS) button for fixed touchplate - Tab 3
                $('#' + this.id + ' .btn-touchplaterun5').removeClass("btn-danger").text("G92 Run5");
                
                // Set the G5x offset via G92
                var gcode = "G92 Z" + plateHeight;
                var id = "tp" + this.gcodeCtr++;
                chilipeppr.publish("/com-chilipeppr-widget-serialport/jsonSend", {Id: id, D: gcode});
            }
            
            // Back tool off of touch plate (2mm)
            var gcode = "G91 G0 Z2\n";
    		var id = "tp" + this.gcodeCtr++;
	    	chilipeppr.publish("/com-chilipeppr-widget-serialport/jsonSend", {Id: id, D: gcode});
	    	
	    	// return to absolute coordinate system
    		var gcode = "G90\n";
	    	var id = "tp" + this.gcodeCtr++;
		    chilipeppr.publish("/com-chilipeppr-widget-serialport/jsonSend", {Id: id, D: gcode});
        },

        
        
        /**
         * Call this method from init to setup all the buttons when this widget
         * is first loaded. This basically attaches click events to your 
         * buttons. It also turns on all the bootstrap popovers by scanning
         * the entire DOM of the widget.
         */
        btnSetup: function() {

            // Chevron hide/show body
            var that = this;
            $('#' + this.id + ' .hidebody').click(function(evt) {
                console.log("hide/unhide body");
                if ($('#' + that.id + ' .panel-body').hasClass('hidden')) {
                    // it's hidden, unhide
                    that.showBody(evt);
                }
                else {
                    // hide
                    that.hideBody(evt);
                }
            });
        },

        options: null,
        /**
         * Call this method on init to setup the UI by reading the user's
         * stored settings from localStorage and then adjust the UI to reflect
         * what the user wants.
         */
        setupUiFromLocalStorage: function() {

            // Read vals from localStorage. Make sure to use a unique
            // key specific to this widget so as not to overwrite other
            // widgets' options. By using this.id as the prefix of the
            // key we're safe that this will be unique.

            // Feel free to add your own keys inside the options 
            // object for your own items

            var options = localStorage.getItem(this.id + '-options');

            if (options) {
                options = $.parseJSON(options);
                console.log("just evaled options: ", options);
            }
            else {
                options = {
                    showBody: true,
                    tabShowing: 1,
                    customParam1: null,
                    customParam2: 1.0
                };
            }

            this.options = options;
            console.log("options:", options);

            // show/hide body
            if (options.showBody) {
                this.showBody();
            }
            else {
                this.hideBody();
            }

        },
        /**
         * When a user changes a value that is stored as an option setting, you
         * should call this method immediately so that on next load the value
         * is correctly set.
         */
        saveOptionsLocalStorage: function() {
            // You can add your own values to this.options to store them
            // along with some of the normal stuff like showBody
            var options = this.options;

            var optionsStr = JSON.stringify(options);
            console.log("saving options:", options, "json.stringify:", optionsStr);
            // store settings to localStorage
            localStorage.setItem(this.id + '-options', optionsStr);
        },

        /**
         * Show the body of the panel.
         * @param {jquery_event} evt - If you pass the event parameter in, we 
         * know it was clicked by the user and thus we store it for the next 
         * load so we can reset the user's preference. If you don't pass this 
         * value in we don't store the preference because it was likely code 
         * that sent in the param.
         */
        showBody: function(evt) {
            $('#' + this.id + ' .panel-body').removeClass('hidden');
            $('#' + this.id + ' .panel-footer').removeClass('hidden');
            $('#' + this.id + ' .hidebody span').addClass('glyphicon-chevron-up');
            $('#' + this.id + ' .hidebody span').removeClass('glyphicon-chevron-down');
            if (!(evt == null)) {
                this.options.showBody = true;
                this.saveOptionsLocalStorage();
            }
        },
        /**
         * Hide the body of the panel.
         * @param {jquery_event} evt - If you pass the event parameter in, we 
         * know it was clicked by the user and thus we store it for the next 
         * load so we can reset the user's preference. If you don't pass this 
         * value in we don't store the preference because it was likely code 
         * that sent in the param.
         */
        hideBody: function(evt) {
            $('#' + this.id + ' .panel-body').addClass('hidden');
            $('#' + this.id + ' .panel-footer').addClass('hidden');
            $('#' + this.id + ' .hidebody span').removeClass('glyphicon-chevron-up');
            $('#' + this.id + ' .hidebody span').addClass('glyphicon-chevron-down');
            if (!(evt == null)) {
                this.options.showBody = false;
                this.saveOptionsLocalStorage();
            }
        },
        /**
         * This method loads the pubsubviewer widget which attaches to our 
         * upper right corner triangle menu and generates 3 menu items like
         * Pubsub Viewer, View Standalone, and Fork Widget. It also enables
         * the modal dialog that shows the documentation for this widget.
         * 
         * By using chilipeppr.load() we can ensure that the pubsubviewer widget
         * is only loaded and inlined once into the final ChiliPeppr workspace.
         * We are given back a reference to the instantiated singleton so its
         * not instantiated more than once. Then we call it's attachTo method
         * which creates the full pulldown menu for us and attaches the click
         * events.
         */
        forkSetup: function() {
            var topCssSelector = '#' + this.id;

            $(topCssSelector + ' .panel-title').popover({
                title: this.name,
                content: this.desc,
                html: true,
                delay: 1000,
                animation: true,
                trigger: 'hover',
                placement: 'auto'
            });

            var that = this;
            chilipeppr.load("http://fiddle.jshell.net/chilipeppr/zMbL9/show/light/", function() {
                require(['inline:com-chilipeppr-elem-pubsubviewer'], function(pubsubviewer) {
                    pubsubviewer.attachTo($(topCssSelector + ' .panel-heading .dropdown-menu'), that);
                });
            });

        },

    };
});
