BIN   = ./node_modules/.bin
PATH := $(BIN):$(PATH)
LIB   = $(shell find lib -name "*.js")
DIST   = $(patsubst lib/%.js,dist/%.js,$(LIB))

install:
	@npm $@

dist: $(DIST)
dist/%.js: lib/%.js
	@mkdir -p $(@D)
	$(BIN)/babel $< -o $@ --stage 0

lint:
	@ $(BIN)/eslint ./lib ./example

test: lint
	@echo "\nTesting source files, hang on..."
	@NODE_ENV=test $(BIN)/mocha         \
		--require lib/__tests__/testdom   \
		--require lib/__tests__/babelinit \
		./lib/__tests__/*.test.js

test-build:
	@echo "\nTesting build files, almost there..!"
	@NODE_ENV=test $(BIN)/mocha         \
		--require dist/__tests__/testdom  \
		./dist/__tests__/*.test.js

clean:
	@rm -rf ./dist

build: test clean dist test-build

dev:
	@node ./example/server.js

.PHONY: install dev test clean dist test-build build