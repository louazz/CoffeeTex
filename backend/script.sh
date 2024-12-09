#!/bin/bash

cd $1 

pdflatex -interaction=nonstopmode latex.tex 

bibtex latex

pdflatex -interaction=nonstopmode latex.tex 
pdflatex -interaction=nonstopmode latex.tex 