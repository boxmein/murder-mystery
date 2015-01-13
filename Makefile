# Makefile
# make

VERSION = 1.2.0
MINIFYJS = uglifyjs
VPATH = css:js:partials

# Files needed to display index page.
# Note, all this gets added to the app cache.
MAIN_PAGE = css/angular-material.css css/style.css js/index.min.js
MAIN_PAGE += partials/howto.html partials/main.html partials/new-game.html partials/edit-person.html
MAIN_PAGE += css/font-awesome.min.css fonts/oswald-ext.woff2 fonts/oswald.woff2
MAIN_PAGE += $(FONT_AWESOME)

# Files needed to generate index.min.js aside angular-glob.js
JS = app.js GameCtrl.js NewGameCtrl.js PersonEditCtrl.js StorageService.js

# Files needed for Font Awesome to work
FONT_AWESOME = fonts/fontawesome-webfont.eot fonts/fontawesome-webfont.woff fonts/fontawesome-webfont.ttf fonts/fontawesome-webfont.svg 

TIDY = css/intermediate.css js/intermediate.js 
CLEAN = $(TIDY) $(MAIN_PAGE)

.PHONY: all clean tidy

# Build the index page
all: index.html

# AppCache manifest - which files do we need to run this site offline?
appcache.manifest:
	touch appcache.manifest
	echo "CACHE MANIFEST" > appcache.manifest
	echo "# Version 1" >> appcache.manifest
	echo >> appcache.manifest
	echo $(MAIN_PAGE) | tr ' ' '\n' >> appcache.manifest

# Everything at once
index.html: index.jade $(MAIN_PAGE) appcache.manifest
	jade $< 

# Stylesheets
%.css: %.scss
	sass $< intermediate.css --sourcemap=none
	myth intermediate.css $@ --compress

# HTML partials
%.html: %.jade
	jade $< 

# I like cats
js/index.js: js/angular-glob.js $(JS)
	cat $^ > js/index.js



# Minify
%.min.js: %.js
	$(MINIFYJS) $^ -o $@ --screw-ie8 --source-map $(subst js/,,$@.map)


# 
# 
# Online dependencies
# 
# 

#
# Material design CSS thing
#
css/angular-material.css: 
	wget -qO $@ https://ajax.googleapis.com/ajax/libs/angular_material/0.6.1/angular-material.min.css

#
# All the angular whatevers and libraries we need, in one big glob.
#
js/angular-glob.js:
	mkdir temp

	# I actually use this part
	wget -qO temp/lodash.min.js https://cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min.js
	wget -qO temp/angular.min.js https://code.angularjs.org/1.3.8/angular.min.js
	wget -qO temp/router.min.js https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.13/angular-ui-router.min.js
		
	# angular-material deps
	wget -qO temp/aria.min.js https://code.angularjs.org/1.3.8/angular-aria.min.js
	wget -qO temp/animate.min.js https://code.angularjs.org/1.3.8/angular-animate.min.js
	wget -qO temp/hammer.min.js http://hammerjs.github.io/dist/hammer.min.js
	
	# guess which file is missing a newline at the end
	echo >>temp/hammer.min.js

	wget -qO temp/material.js https://ajax.googleapis.com/ajax/libs/angular_material/0.6.1/angular-material.js

	cat temp/* > js/angular-glob.js

	rm -rf temp

# 
# Now for the fonts
# 
css/font-awesome.min.css: $(FONT_AWESOME)
	mkdir -p css/fonts
	wget -qO $@ http://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.2.0/css/font-awesome.min.css

# Font Awesome 4.2.0 by @davegandy - http://fontawesome.io - @fontawesome
fonts/fontawesome-%: 
	wget -qO $@ http://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.2.0/$@?v=4.2.0

# 
# Oswald font
# 
fonts/oswald-ext.woff2: 
	wget -qO fonts/oswald-ext.woff2 http://fonts.gstatic.com/s/oswald/v10/l1cOQ90roY9yC7voEhngDBJtnKITppOI_IvcXXDNrsc.woff2
fonts/oswald.woff2:
	wget -qO fonts/oswald.woff2 http://fonts.gstatic.com/s/oswald/v10/HqHm7BVC_nzzTui2lzQTDVtXRa8TVwTICgirnJhmVJw.woff2



# 
# 
# Utilities
# 
# 

# Clean up intermediate files
tidy: 
	rm -f $(TIDY)

# Clean up intermediate files as well as files you can make
clean: 
	rm -f $(CLEAN)
