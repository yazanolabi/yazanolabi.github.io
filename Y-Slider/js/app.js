(function () {
    
	// Define our constructor
	this.YSlider = function () {
		// Create global element references
        this.sliderArray = null;
        this.current = null;
        this.prevSlide = null;
        this.nextSlide = null;
        this.index = 0;

		// Define option defaults
		var defaults = {
			sliderContainer: ".Y-Slider",
			sliderWrapper: ".Y-Slider-Wrapper",
			sliderSlides: ".Y-Slider-Slide",
            navClass: ".Y-Slider-Navigation",
			navButtons: true,
			overlay: true,
		};

		// Create options by extending defaults with the passed in arugments
		if (arguments[0] && typeof arguments[0] === "object") {
			this.options = extendDefaults(defaults, arguments[0]);
        }
        
        initilaizeSlider.call(this);
        initializeEvents.call(this);
	}
    
	// Public Methods

    YSlider.prototype.next = function () {
		var cur = this.current;
		var nxt = this.nextSlide;
		var prv = this.prevSlide;
		var _this = this;
		setIndex.call(_this, (dist = "next"));
		if (cur.getAttribute("animate-out-next")) {
			animateCSS(
				cur,
				cur.getAttribute("animate-out-next")
			);
		}
		cur.addEventListener("animationend", function () {
			cur.classList.remove("Y-Slider-Active");
		});
		if (nxt.getAttribute("animate-in-next")) {
			animateCSS(
				nxt,
				nxt.getAttribute("animate-in-next")
			);
		}
		nxt.classList.add("Y-Slider-Active");
		
		
	};
    YSlider.prototype.prev = function () {
        if (this.index == 0)
            this.index = this.sliderArray.length - 1;
        else
            this.index--;
        setSlide.call(this);
	};;

	// Private Methods

	// Utility method to extend defaults with user options
	function extendDefaults(source, properties) {
		var property;
		for (property in properties) {
			if (properties.hasOwnProperty(property)) {
				source[property] = properties[property];
			}
		}
		return source;
	}

	// Init Slider
	function initilaizeSlider(options) {
		// Check if the slider is not empty
		if ((this.options.sliderSlides).length) {
			this.sliderArray = document.querySelectorAll(
				this.options.sliderSlides
			);
		}

		// If navButtons option is false, hide them
		if (this.options.navButtons) {
			document.querySelector(this.options.navClass);
		}

        for (let i = 0; i < this.sliderArray.length; i++) {

			// If overlay is true display it
			if (this.options.overlay === true) {
				this.sliderArray[i].classList.add("overlay");
            }
            
            // indexing the slides
			this.sliderArray[i].setAttribute("Y-Slide-id", i);
                
            this.sliderArray[i].classList.remove("Y-Slider-Active");
        }
        
        // resetting defaults
        this.index = 0;
        this.sliderArray[this.index].classList.add("Y-Slider-Active");
        this.current = this.sliderArray[this.index];
        if (this.current.getAttribute("animation-in")) {
            animate(this.current, this.current.getAttribute("animation-in"), "0.5s", "0.5s");
        }
        setSlide.call(this);

    }

	// Init Events
	function initializeEvents() {
		if (this.options.navButtons) {
			document.querySelector(this.options.navClass).querySelector('.next').addEventListener("click", this.next.bind(this));
			document.querySelector(this.options.navClass).querySelector('.prev').addEventListener("click", this.prev.bind(this));
		}
    }
    
    function setSlide() {
        this.sliderArray[this.index].classList.add("Y-Slider-Active");
        this.current = this.sliderArray[this.index];
        if (this.index == 0) {
            this.prevSlide = this.sliderArray[this.sliderArray.length - 1];
		} else {
            this.prevSlide = this.sliderArray[this.index - 1];
		}
		this.prevSlide.classList.remove("Y-Slider-Active");
        this.prevSlide.style.cssText = "";
        if (this.index == this.sliderArray.length - 1) {
            this.nextSlide = this.sliderArray[0];
		} else {
            this.nextSlide = this.sliderArray[this.index + 1];
		}
		this.nextSlide.classList.remove("Y-Slider-Active");
        this.nextSlide.style.cssText = "";
        // console.log(JSON.parse(this.current.getAttribute("animation-data")));
        if (this.current.getAttribute("animation-in")) {
            animate(this.current, this.current.getAttribute("animation-in"), "0.5s", "0.5s");
        }
    }

    function setIndex() {
        if (dist == "next") {
            if (this.index == this.sliderArray.length - 1) {
                this.index = 0;
            } else {
                this.index++;
            }
        } else {
            if (this.index == 0) {
                this.index = this.sliderArray.length - 1;
			} else {
                this.index--;
			}
        }
        this.current = this.sliderArray[this.index];
		if (this.index == 0) {
			this.prevSlide = this.sliderArray[this.sliderArray.length - 1];
		} else {
			this.prevSlide = this.sliderArray[this.index - 1];
		}
		if (this.index == this.sliderArray.length - 1) {
			this.nextSlide = this.sliderArray[0];
		} else {
			this.nextSlide = this.sliderArray[this.index + 1];
        }
       
    }

    function animate(element, animation, duration = "0.5s", delay = "0.1s") {
        element.style.cssText = `transition: ${duration};` + animation ;

		return new Promise((resolve) => {
			setTimeout(function () {
                resolve("animating");
                
			}, 500);
		});
	} 
	const animateCSS = (element, animation, prefix = "animate__") => {
		new Promise((resolve, reject) => {
			const animationName = `${animation}`;
			const node = element;

			node.classList.add(`${prefix}animated`, animationName);

			// When the animation ends, we clean the classes and resolve the Promise
			function handleAnimationEnd() {
				node.classList.remove(`${prefix}animated`, animationName);
				resolve("Animation ended");
			}

			node.addEventListener("animationend", handleAnimationEnd, {
				once: true,
			});
		});
	}

}());


// var resolveAfter2Seconds = function () {
// 	console.log("starting slow promise");
// 	return new Promise((resolve) => {
// 		setTimeout(function () {
// 			resolve("slow");
// 			console.log("slow promise is done");
// 		}, 2000);
// 	});
// };

// var resolveAfter1Second = function () {
// 	console.log("starting fast promise");
// 	return new Promise((resolve) => {
// 		setTimeout(function () {
// 			resolve("fast");
// 			console.log("fast promise is done");
// 		}, 1000);
// 	});
// };
// var sequentialStart = async function () {
// 	console.log("==SEQUENTIAL START==");

// 	// 1. Execution gets here almost instantly
// 	const slow = await resolveAfter2Seconds();
// 	console.log(slow); // 2. this runs 2 seconds after 1.

// 	const fast = await resolveAfter1Second();
// 	console.log(fast); // 3. this runs 3 seconds after 1.
// };

