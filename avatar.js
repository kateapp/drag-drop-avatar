// http://css-tricks.com/examples/DragAvatar/
// Required for drag and drop file access
jQuery.event.props.push('dataTransfer');

// IIFE to prevent globals
// Immediately-Invoked Function Expression

(function(){
	var s;
	var Avatar = {
		settings: {
			bod: $('body'),
			img: $('#profile-avatar'),
			fileInput: $('#uploader')
		},
		init: function(){
			s = Avatar.settings;
			Avatar.bindUIActions();
		},
		bindUIActions: function(){
			var timer;

			s.bod.on('dragover', function(event){
				clearTimeout(timer);
				if(event.currentTarget == s.bod[0]){
					Avatar.showDroppableArea();
				}
				return false;
			});

			s.bod.on('dragleave', function(event){
				if(event.currentTarget == s.bod[0]){
					// Flicker protection
					timer = setTimeout(function(){
						Avatar.hideDroppableArea();
					}, 200);
				}
			});

			s.bod.on('drop', function(event){
				// or else the browser will open the file
				event.preventDefault();
				Avatar.handleDrop(event.dataTransfer.files);
			});

			s.fileIput.on('change', function(event){
				Avatar.handleDrop(event.target.files);
			});
		},
		showDroppableArea: function(){
			s.bod.addClass('droppable');
		},
		hideDroppableArea: function(){
			s.bod.removeClass('droppable');
		},
		handleDrop: function(files){
			Avatar.hideDroppableArea();

			var file = files[0];

			if(file.type.match('image.*')){
				Avatar.resizeImage(file, 256, function(data){
					Avatar.placeImage(data);
				});
			} else {
				alert('That file wasn not an image');
			}
		},
		resizeImage: function(file, size, callback){
			var fileTracker = new FileReader;
			fileTracker.onload = function(){
				Resample(
					this.result,
					size,
					size,
					callback
				);
			}
			fileTracker.readAsDataURL(file);
			fileTracker.onabort = function(){
				alert('The upload was aborted!');
			}
			fileTracker.onerror = function(){
				alert('An error ocurred while reading the file');
			}
		},
		placeImage: function(data){
			s.img.attr('src', data);
		}
	}

	Avatar.init();
})();









