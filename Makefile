STAGING_URL=https://phtchugo.stage.ccnmtl.columbia.edu/
PROD_URL=https://phtc.ctl.columbia.edu/
STAGING_BUCKET=phtcstatic.stage.ccnmtl.columbia.edu
PROD_BUCKET=phtc.ctl.columbia.edu
INTERMEDIATE_STEPS ?= echo nothing
HUGO=/usr/local/bin/hugo-0.47.1

JS_FILES=static/js/src

# commenting this out for now all: eslint

include *.mk

clean:
	rm -rf $(PUBLIC)/*

$(PUBLIC)/js/all.json: $(PUBLIC)/json/all/index.html
	mkdir $(PUBLIC)/js/ || true
	mv $< $@ && ./checkjson.py

.PHONY: clean