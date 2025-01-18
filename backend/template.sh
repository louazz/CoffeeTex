
mkdir $1
mkdir $2


cp -r ./src/uploads/ACP_paper/* $1

cp -r ./src/uploads/leukemia_paper/* $2

mv $1/main.tex $1/latex.tex
mv $2/main.tex $2/latex.tex
