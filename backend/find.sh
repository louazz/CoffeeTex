bsdtar xvf $1 --strip-components=1 -C $2

find $2 -type f -name "main.tex" | wc -l