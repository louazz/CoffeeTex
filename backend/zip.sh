

#unzip -j $1 -d $2
cd $2
mv main.tex latex.tex

pdflatex -interaction=nonstopmode latex.tex 

bibtex latex

pdflatex -interaction=nonstopmode latex.tex 
pdflatex -interaction=nonstopmode latex.tex 