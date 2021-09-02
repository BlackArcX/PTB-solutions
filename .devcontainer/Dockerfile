FROM qmcgaw/latexdevcontainer

USER root
RUN tlmgr update --self --all
RUN tlmgr install standalone xkeyval currfile pgf pgfplots \
    filehook filemod import gincltex svn-prov adjustbox collectbox sectsty
RUN texhash
USER vscode
