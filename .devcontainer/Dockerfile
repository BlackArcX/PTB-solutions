FROM qmcgaw/latexdevcontainer

USER root

RUN apt install -y ghostscript 
RUN tlmgr update --self --all
RUN tlmgr install standalone xkeyval currfile pgf pgfplots \
    filehook filemod import gincltex svn-prov adjustbox collectbox \
    sectsty pdfcrop lipsum tcolorbox environ etoolbox
RUN texhash
USER vscode
