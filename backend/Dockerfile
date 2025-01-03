FROM denoland/deno

EXPOSE 8000

WORKDIR /app

ADD . /app

RUN deno cache app.ts
RUN apt-get update
RUN apt-get install -y pandoc

RUN apt-get install -y  texlive-full texlive-latex-recommended texlive-fonts-extra texlive-latex-extra poppler-utils


RUN chmod -R 777 /app 

CMD ["run", "-A", "app.ts", "--unstable"]
