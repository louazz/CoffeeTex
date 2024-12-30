

#unzip -j $1 -d $2
bsdtar xvf $1 --strip-components=1 -C $2
cd $2
mv main.tex latex.tex

pdflatex -interaction=nonstopmode latex.tex 

bibtex latex

pdflatex -interaction=nonstopmode latex.tex 
pdflatex -interaction=nonstopmode latex.tex 