ESBUILD=node_modules/.bin/esbuild
ESLINT=node_modules/.bin/eslint

help:  ## Display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n\nTargets:\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

all: depend build    ## Download dependencies and build everything

depend:    ## Download Nodejs dependencies
	yarn install

watch:    ## Debug mode, monitor file changes and then compile automatically
	yarn run watch

build:   ## Release mode, optimize and minimize the Javascript file
	yarn run build

lint:    ## Run static analyzer on the main script
	yarn run lint

# The website will be built in `./docs`, from which it can be served as
# github.io pages.
#
#
# You should list the Markdown sources here in the order that they should
# appear.
input_files := $(sort $(wildcard lit/*.md))

# Arguments to Pandoc; these are reasonable defaults
pandoc_args += --template bootstrap/template.html
pandoc_args += --css css/mods.css
pandoc_args += -t html5 -s --mathjax --toc
pandoc_args += --toc-depth 2
pandoc_args += --filter pandoc-bootstrap
pandoc_args += -f markdown+multiline_tables+simple_tables
pandoc_args += --highlight-style tango

# Any file in the `lit` directory that is not a Markdown source 
# is to be copied to the `docs` directory
static_files := $(shell find -L lit -type f -not -name '*.md')
static_targets := $(static_files:lit/%=docs/%)

site: docs/index.html docs/css/mods.css $(static_targets)	## Build documentation

docs/index.html: $(input_files) Makefile
	@mkdir -p docs
	pandoc $(pandoc_args) $(input_files) -o $@

docs/css/mods.css: bootstrap/mods.css
	@mkdir -p docs/css
	cp $< $@

$(static_targets): docs/%: lit/%
	@mkdir -p $(dir $@)
	cp $< $@
