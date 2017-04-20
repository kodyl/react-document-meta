BIN   = ./node_modules/.bin
PATH := $(BIN):$(PATH)
LIB   = $(shell find lib -name "*.js")
DIST   = $(patsubst lib/%.js,dist/%.js,$(LIB))

install:
	@ npm $@

dist: $(DIST)
dist/%.js: lib/%.js
	@ mkdir -p $(@D)
	$(BIN)/babel $< -o $@

lint:
	@ echo "\nLinting source files, hang on..."
	@ $(BIN)/eslint ./lib ./example

test:
	@ echo "\nTesting source files, hang on..."
	@ NODE_ENV=test $(BIN)/babel-istanbul cover  \
		./node_modules/mocha/bin/_mocha --        \
		--require lib/__tests__/testdom           \
		./lib/__tests__/*.test.js

test-dist:
	@ echo "\nTesting build files, almost there..!"
	@ NODE_ENV=test $(BIN)/mocha         \
		--require dist/__tests__/testdom  \
		./dist/__tests__/*.test.js

coveralls:
	@ cat ./coverage/lcov.info | $(BIN)/coveralls

clean:
	@ rm -rf ./dist
	@ rm -rf ./coverage

build: lint test clean dist test-dist
	@ git add . && \
		git commit -am "make build"

dev:
	@ node ./example/client-side/server.js

dev-ssr:
	@ $(BIN)/babel-node ./example/server-side/server.js

release: build
	@ npm publish

release-patch: build
	@ npm version patch

.PHONY: install dev test clean dist test-build build
