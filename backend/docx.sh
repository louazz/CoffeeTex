
pandoc -s $1 -o $2/latex.tex

cd $2

pdflatex -interaction=nonstopmode latex.tex 

bibtex latex

pdflatex -interaction=nonstopmode latex.tex 
pdflatex -interaction=nonstopmode latex.tex 