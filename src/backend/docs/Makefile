# Minimal makefile for Sphinx documentation
#

# You can set these variables from the command line, and also
# from the environment for the first two.
SPHINXOPTS    ?=
SPHINXBUILD   ?= sphinx-build
SPHINXAPIDOC ?= sphinx-apidoc
SOURCEDIR     = source
BUILDDIR      = build
SPHINX_APIDOC_OPTIONS?=members,show-inheritance

# Put it first so that "make" without argument is like "make help".
help:
	@$(SPHINXBUILD) -M help "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)

apidoc:
	@SPHINX_APIDOC_OPTIONS=$(SPHINX_APIDOC_OPTIONS) $(SPHINXAPIDOC) -f -o "$(SOURCEDIR)" "../src"

.PHONY: help Makefile apidoc

# Catch-all target: route all unknown targets to Sphinx using the new
# "make mode" option.  $(O) is meant as a shortcut for $(SPHINXOPTS).
%: Makefile apidoc
	@$(SPHINXBUILD) -M $@ "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)
