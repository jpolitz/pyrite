PYRET=node ~/src/pyret-lang/build/phase0/main-wrapper.js
ALL_PYRET := $(patsubst %.arr,%.arr.js,$(wildcard *.arr))

test: $(ALL_PYRET)
	$(PYRET) --module-load-dir ./ test.arr

%.arr.js: %.arr
	$(PYRET) --compile-module-js $< > $@
