# export MOD_AGREEMENTS_URL=http://localhost:9130/erm

AUTH_TOKEN=`./okapi-login`

OKAPI="http://localhost:9130"
TENANT="diku"

if [ -f .okapirc ]; then
  . .okapirc
elif [ -f $HOME/.okapirc ]; then
  . $HOME/.okapirc
fi

echo Submit query with auth $AUTH_TOKEN

curl -v -v -v -H "X-Okapi-Tenant: ${TENANT}" \
         -H "X-Okapi-Token: ${AUTH_TOKEN}" \
         -H "Content-Type: application/json" -X POST http://localhost:4001 -d '{
  "query": "agreements() { name description }"
}'

# R1=`curl -H "X-Okapi-Tenant: ${TENANT}" \
#          -H "X-Okapi-Token: ${AUTH_TOKEN}" \
#          -H "Content-Type: application/json" -X POST http://localhost:4001 -d ' {
#   agreements {
#     name
#     description
#   }
# }
# '`
# echo result: $R1
