FROM node:alpine

COPY server.js /src/
ADD https://raw.githubusercontent.com/martindubb/musterloesungen-aws-23-02/main/modul_2/ue76/a2_compare/app.js /src/

ENV MY_NAME="John Doe" MY_NAME2="Max Muster"

EXPOSE 8080
ENTRYPOINT [ "node" ]
CMD [ "/src/server.js" ]