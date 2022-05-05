WEBPACK=node_modules/.bin/webpack
help:  ## Display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n\nTargets:\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

all: depend build    ## Download dependencies and build everything

depend:    ## Download Nodejs dependencies
	yarn install

debug:    ## Debug mode, monitor file changes and then compile automatically
	$(WEBPACK) --mode development --watch

build:    ## Release mode, optimize and minimize the Javascript file
	yarn run build
